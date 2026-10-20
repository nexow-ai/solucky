use anchor_lang::prelude::*;

use crate::{
    constants::{DRAW_DELAY_SLOTS, DRAW_WINDOW_SLOTS, ROUND_SEED},
    error::SoluckyError,
    events::RoundClosed,
    state::{Round, RoundStatus},
};

/// Anyone can close a round once its day is over. Closing pins a slot a few
/// slots ahead; that slot's hash, unknown to everyone at this point, will
/// seed the draw.
#[derive(Accounts)]
pub struct CloseRound<'info> {
    #[account(mut, seeds = [ROUND_SEED, &round.day.to_le_bytes()], bump = round.bump)]
    pub round: Account<'info, Round>,
}

pub fn handle_close_round(ctx: Context<CloseRound>) -> Result<()> {
    let clock = Clock::get()?;
    let round = &mut ctx.accounts.round;
    require!(
        clock.unix_timestamp >= round.ends_at(),
        SoluckyError::RoundNotOver
    );

    match round.status {
        RoundStatus::Open => {}
        // Re-pinning is only allowed once the old slot fell out of the
        // SlotHashes window, so a known result can never be thrown away.
        RoundStatus::Closed => require!(
            clock.slot > round.target_slot.saturating_add(DRAW_WINDOW_SLOTS),
            SoluckyError::DrawStillPossible
        ),
        RoundStatus::Drawn | RoundStatus::Settled => return err!(SoluckyError::RoundAlreadyDrawn),
    }

    round.status = RoundStatus::Closed;
    round.target_slot = clock
        .slot
        .checked_add(DRAW_DELAY_SLOTS)
        .ok_or(SoluckyError::Overflow)?;

    emit!(RoundClosed {
        day: round.day,
        ticket_count: round.ticket_count,
        pot: round.pot,
        target_slot: round.target_slot,
    });
    Ok(())
}
