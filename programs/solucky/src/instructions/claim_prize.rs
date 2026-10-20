use anchor_lang::prelude::*;

use crate::{
    constants::{ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    events::PrizeClaimed,
    state::{Round, RoundStatus, Ticket},
    utils::fee_for,
};

/// Pays a drawn round's winner: the pot minus the house fee goes to the
/// winning ticket's owner. Anyone can send it, and the prize can only go to
/// that owner. The fee stays in the round until `collect_fee`, so nothing the
/// treasury does can hold up a winner.
#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut, seeds = [ROUND_SEED, &round.day.to_le_bytes()], bump = round.bump)]
    pub round: Account<'info, Round>,
    #[account(
        seeds = [TICKET_SEED, round.key().as_ref(), &ticket.number.to_le_bytes()],
        bump = ticket.bump,
        has_one = round,
        has_one = owner
    )]
    pub ticket: Account<'info, Ticket>,
    /// CHECK: the winning ticket's owner, enforced by `has_one` above.
    #[account(mut)]
    pub owner: UncheckedAccount<'info>,
}

pub fn handle_claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
    let round = &ctx.accounts.round;
    let ticket = &ctx.accounts.ticket;
    require!(
        round.status == RoundStatus::Drawn,
        SoluckyError::RoundNotDrawn
    );
    require!(
        ticket.index == round.winning_index,
        SoluckyError::NotWinningTicket
    );

    let fee = fee_for(round.pot, round.fee_bps);
    let payout = round.pot - fee;

    ctx.accounts.round.sub_lamports(payout)?;
    ctx.accounts.owner.add_lamports(payout)?;

    let ticket = &ctx.accounts.ticket;
    let round = &mut ctx.accounts.round;
    round.status = RoundStatus::Settled;
    round.winner = ticket.owner;
    round.winning_number = ticket.number;
    round.winner_country = ticket.country;
    round.payout = payout;
    round.fee = fee;
    // Nothing to collect on a fee-free round.
    round.fee_collected = fee == 0;

    emit!(PrizeClaimed {
        day: round.day,
        winner: ticket.owner,
        number: ticket.number,
        payout,
        fee,
    });
    Ok(())
}
