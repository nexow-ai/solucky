use anchor_lang::prelude::*;
use solana_sha256_hasher::hashv;

use crate::{
    constants::{GAME_SEED, ROUND_SEED, SLOT_HASHES_ID},
    error::SoluckyError,
    events::RoundDrawn,
    state::{Game, Round, RoundStatus},
    utils::{closest, fee_for, find_slot_hash, guess_outcome, payout_for},
};

/// Anyone can draw a closed round once its pinned slot has passed.
#[derive(Accounts)]
pub struct DrawRound<'info> {
    #[account(
        mut,
        seeds = [ROUND_SEED, &round.kind.to_le_bytes(), &round.period.to_le_bytes()],
        bump = round.bump
    )]
    pub round: Account<'info, Round>,
    /// Hands its carry to the round when a winner is found, and keeps what
    /// the winner and the fee leave of the pot.
    #[account(mut, seeds = [GAME_SEED, &round.kind.to_le_bytes()], bump = game.bump)]
    pub game: Account<'info, Game>,
    /// CHECK: the SlotHashes sysvar, read by hand because it is too large to
    /// deserialize on-chain.
    #[account(address = SLOT_HASHES_ID)]
    pub slot_hashes: UncheckedAccount<'info>,
}

pub fn handle_draw_round(ctx: Context<DrawRound>) -> Result<()> {
    let clock = Clock::get()?;
    let round_key = ctx.accounts.round.key();
    let round_info = ctx.accounts.round.to_account_info();
    let round = &mut ctx.accounts.round;
    require!(
        round.status == RoundStatus::Closed,
        SoluckyError::RoundNotClosed
    );
    require!(
        clock.slot > round.target_slot,
        SoluckyError::TargetSlotNotReached
    );

    let (slot, slot_hash) = {
        let data = ctx.accounts.slot_hashes.try_borrow_data()?;
        find_slot_hash(&data, round.target_slot).ok_or(SoluckyError::RandomnessUnavailable)?
    };

    let randomness = hashv(&[
        &round.entropy,
        &slot_hash,
        &slot.to_le_bytes(),
        round_key.as_ref(),
    ])
    .to_bytes();
    let x = u64::from_le_bytes(randomness[..8].try_into().unwrap());
    round.draw_slot = slot;
    round.slot_hash = slot_hash;
    round.randomness = randomness;

    let won = if round.is_lottery() {
        // The closest number to a random one wins.
        round.drawn_number = (x % (u64::from(round.max_number) + 1)) as u32;
        let data = round_info.try_borrow_data()?;
        // A round only exists once its first ticket is sold, so there always
        // is a closest number.
        round.winning_number = closest(&data[8 + Round::INIT_SPACE..], round.drawn_number)
            .ok_or(SoluckyError::Overflow)?;
        true
    } else if let Some(index) =
        guess_outcome(x, round.checked, round.sealed_count, round.max_number)
    {
        round.winning_index = index;
        true
    } else {
        // Not this time: those numbers are out, the round goes on.
        round.checked = round.sealed_count;
        round.status = RoundStatus::Open;
        false
    };

    let game = &mut ctx.accounts.game;
    let (carry_in, carry_out) = if won {
        let carry_in = game.carry;
        let pot = round
            .pot
            .checked_add(carry_in)
            .ok_or(SoluckyError::Overflow)?;
        let payout = payout_for(pot);
        let fee = fee_for(pot, round.fee_bps);
        // The fee is at most 20%, so the winner's 80% and the fee fit in the pot.
        let carry_out = pot - payout - fee;
        round.pot = pot;
        round.payout = payout;
        round.fee = fee;
        round.status = RoundStatus::Drawn;
        game.carry = carry_out;
        if !round.is_lottery() {
            // The next Guess round goes on sale at once.
            game.current_round = game
                .current_round
                .checked_add(1)
                .ok_or(SoluckyError::Overflow)?;
        }
        (carry_in, carry_out)
    } else {
        (0, 0)
    };
    game.sub_lamports(carry_in)?;
    round.add_lamports(carry_in)?;
    round.sub_lamports(carry_out)?;
    game.add_lamports(carry_out)?;

    emit!(RoundDrawn {
        kind: round.kind,
        period: round.period,
        slot,
        slot_hash,
        randomness,
        won,
        drawn_number: round.drawn_number,
        winning_index: round.winning_index,
        winning_number: round.winning_number,
        carry_in,
        payout: round.payout,
        fee: round.fee,
        carry_out,
    });
    Ok(())
}
