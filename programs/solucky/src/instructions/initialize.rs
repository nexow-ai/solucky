use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, MAX_FEE_BPS, MIN_TICKET_PRICE},
    error::SoluckyError,
    events::ConfigUpdated,
    program::Solucky,
    state::Config,
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// Must be the program's upgrade authority, so nobody can front-run the
    /// deployment and claim the config.
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: only its address is stored, as the fee recipient.
    pub treasury: UncheckedAccount<'info>,
    #[account(constraint = program.programdata_address()? == Some(program_data.key()) @ SoluckyError::Unauthorized)]
    pub program: Program<'info, Solucky>,
    #[account(constraint = program_data.upgrade_authority_address == Some(authority.key()) @ SoluckyError::Unauthorized)]
    pub program_data: Account<'info, ProgramData>,
    pub system_program: Program<'info, System>,
}

pub fn handle_initialize(
    ctx: Context<Initialize>,
    ticket_price: u64,
    fee_bps: u16,
    max_number: u32,
) -> Result<()> {
    require!(
        ticket_price >= MIN_TICKET_PRICE,
        SoluckyError::InvalidTicketPrice
    );
    require!(fee_bps <= MAX_FEE_BPS, SoluckyError::FeeTooHigh);
    require!(max_number > 0, SoluckyError::InvalidMaxNumber);

    let config = &mut ctx.accounts.config;
    config.set_inner(Config {
        authority: ctx.accounts.authority.key(),
        treasury: ctx.accounts.treasury.key(),
        ticket_price,
        fee_bps,
        max_number,
        paused: false,
        bump: ctx.bumps.config,
    });

    emit!(ConfigUpdated {
        authority: config.authority,
        treasury: config.treasury,
        ticket_price,
        fee_bps,
        max_number,
        paused: false,
    });
    Ok(())
}
