use anchor_lang::prelude::*;

use crate::{
    constants::{ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    state::{Round, RoundStatus, Ticket},
};

/// Once a round is settled, a player can close their ticket to get its rent
/// back. The round keeps the totals and the winner.
#[derive(Accounts)]
pub struct CloseTicket<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        seeds = [ROUND_SEED, &round.kind.to_le_bytes(), &round.period.to_le_bytes()],
        bump = round.bump
    )]
    pub round: Account<'info, Round>,
    #[account(
        mut,
        close = owner,
        seeds = [TICKET_SEED, round.key().as_ref(), &ticket.number.to_le_bytes()],
        bump = ticket.bump,
        has_one = round,
        has_one = owner
    )]
    pub ticket: Account<'info, Ticket>,
}

pub fn handle_close_ticket(ctx: Context<CloseTicket>) -> Result<()> {
    require!(
        ctx.accounts.round.status == RoundStatus::Settled,
        SoluckyError::RoundNotSettled
    );
    Ok(())
}
