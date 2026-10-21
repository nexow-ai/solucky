use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, ROUND_SEED},
    error::SoluckyError,
    events::FeeCollected,
    state::{Config, Round, RoundStatus},
};

/// Sends a settled round's house fee to the treasury in the config. Anyone
/// can send it; the fee can only go to that treasury.
#[derive(Accounts)]
pub struct CollectFee<'info> {
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [ROUND_SEED, &round.kind.to_le_bytes(), &round.period.to_le_bytes()],
        bump = round.bump
    )]
    pub round: Account<'info, Round>,
    /// CHECK: must be the treasury in the config.
    #[account(mut, address = config.treasury)]
    pub treasury: UncheckedAccount<'info>,
}

pub fn handle_collect_fee(ctx: Context<CollectFee>) -> Result<()> {
    let round = &ctx.accounts.round;
    require!(
        round.status == RoundStatus::Settled,
        SoluckyError::RoundNotSettled
    );
    require!(!round.fee_collected, SoluckyError::FeeAlreadyCollected);

    let fee = round.fee;
    ctx.accounts.round.sub_lamports(fee)?;
    ctx.accounts.treasury.add_lamports(fee)?;
    ctx.accounts.round.fee_collected = true;

    emit!(FeeCollected {
        kind: ctx.accounts.round.kind,
        period: ctx.accounts.round.period,
        treasury: ctx.accounts.treasury.key(),
        fee,
    });
    Ok(())
}
