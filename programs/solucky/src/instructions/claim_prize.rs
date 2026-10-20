use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    events::PrizeClaimed,
    state::{Config, Round, RoundStatus, Ticket},
    utils::fee_for,
};

/// Pays a drawn round: the pot minus the fee to the winning ticket's owner,
/// and the fee to the treasury. Anyone can send it; the money can only go to
/// the winner and the treasury.
#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
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
    /// CHECK: must be the treasury in the config. May be the owner too.
    #[account(mut, dup, address = config.treasury)]
    pub treasury: UncheckedAccount<'info>,
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

    let pot = round.pot;
    let fee = fee_for(pot, round.fee_bps);
    let payout = pot - fee;

    ctx.accounts.round.sub_lamports(pot)?;
    ctx.accounts.owner.add_lamports(payout)?;
    if fee > 0 {
        ctx.accounts.treasury.add_lamports(fee)?;
    }

    let ticket = &ctx.accounts.ticket;
    let round = &mut ctx.accounts.round;
    round.status = RoundStatus::Settled;
    round.winner = ticket.owner;
    round.winning_number = ticket.number;
    round.winner_country = ticket.country;
    round.payout = payout;
    round.fee = fee;

    emit!(PrizeClaimed {
        day: round.day,
        winner: ticket.owner,
        number: ticket.number,
        payout,
        fee,
    });
    Ok(())
}
