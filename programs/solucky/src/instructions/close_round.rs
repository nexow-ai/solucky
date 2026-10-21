use anchor_lang::prelude::*;

use crate::{
    constants::{DRAW_DELAY_SLOTS, ROUND_SEED, SLOT_HASHES_ID},
    error::SoluckyError,
    events::RoundClosed,
    state::{Round, RoundStatus},
    utils::slot_hash_expired,
};

/// Anyone can close a lottery round once its period is over, or seal the
/// unchecked guesses of a Guess round at any time. Closing pins a slot a few
/// slots ahead; that slot's hash, unknown to everyone at this point, will
/// seed the draw.
#[derive(Accounts)]
pub struct CloseRound<'info> {
    #[account(
        mut,
        seeds = [ROUND_SEED, &round.kind.to_le_bytes(), &round.period.to_le_bytes()],
        bump = round.bump
    )]
    pub round: Account<'info, Round>,
    /// CHECK: the SlotHashes sysvar, read by hand to prove a pinned slot expired.
    #[account(address = SLOT_HASHES_ID)]
    pub slot_hashes: UncheckedAccount<'info>,
}

pub fn handle_close_round(ctx: Context<CloseRound>) -> Result<()> {
    let clock = Clock::get()?;
    let round = &mut ctx.accounts.round;
    if let Some(ends_at) = round.ends_at() {
        require!(clock.unix_timestamp >= ends_at, SoluckyError::RoundNotOver);
    }

    match round.status {
        RoundStatus::Open => {
            require!(
                round.ticket_count > round.checked,
                SoluckyError::NothingToCheck
            );
            round.sealed_count = round.ticket_count;
        }
        // A new slot can only be pinned once SlotHashes proves the old one can
        // never be drawn, so a known result cannot be thrown away early. The
        // sealed tickets stay the same.
        RoundStatus::Closed => {
            let data = ctx.accounts.slot_hashes.try_borrow_data()?;
            require!(
                slot_hash_expired(&data, round.target_slot),
                SoluckyError::DrawStillPossible
            );
        }
        RoundStatus::Drawn | RoundStatus::Settled => return err!(SoluckyError::RoundAlreadyDrawn),
    }

    round.status = RoundStatus::Closed;
    round.target_slot = clock
        .slot
        .checked_add(DRAW_DELAY_SLOTS)
        .ok_or(SoluckyError::Overflow)?;

    emit!(RoundClosed {
        kind: round.kind,
        period: round.period,
        ticket_count: round.sealed_count - round.checked,
        pot: round.pot,
        target_slot: round.target_slot,
    });
    Ok(())
}
