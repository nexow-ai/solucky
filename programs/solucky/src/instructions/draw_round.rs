use anchor_lang::prelude::*;
use solana_sha256_hasher::hashv;

use crate::{
    constants::{ROUND_SEED, SLOT_HASHES_ID},
    error::SoluckyError,
    events::RoundDrawn,
    state::{Round, RoundStatus},
    utils::find_slot_hash,
};

/// Anyone can draw a closed round once its pinned slot has passed.
#[derive(Accounts)]
pub struct DrawRound<'info> {
    #[account(mut, seeds = [ROUND_SEED, &round.day.to_le_bytes()], bump = round.bump)]
    pub round: Account<'info, Round>,
    /// CHECK: the SlotHashes sysvar, read by hand because it is too large to
    /// deserialize on-chain.
    #[account(address = SLOT_HASHES_ID)]
    pub slot_hashes: UncheckedAccount<'info>,
}

pub fn handle_draw_round(ctx: Context<DrawRound>) -> Result<()> {
    let clock = Clock::get()?;
    let round_key = ctx.accounts.round.key();
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
    let seed = u64::from_le_bytes(randomness[..8].try_into().unwrap());
    // ticket_count >= 1: a round only exists once its first ticket is sold.
    let winning_index = (seed % u64::from(round.ticket_count)) as u32;

    round.draw_slot = slot;
    round.slot_hash = slot_hash;
    round.randomness = randomness;
    round.winning_index = winning_index;
    round.status = RoundStatus::Drawn;

    emit!(RoundDrawn {
        day: round.day,
        slot,
        slot_hash,
        randomness,
        winning_index,
    });
    Ok(())
}
