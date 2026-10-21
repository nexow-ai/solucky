use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, MAX_FEE_BPS, MIN_TICKET_PRICE},
    error::SoluckyError,
    events::ConfigUpdated,
    state::Config,
};

/// Fields left as `None` keep their current value.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ConfigUpdate {
    pub authority: Option<Pubkey>,
    pub treasury: Option<Pubkey>,
    pub ticket_price: Option<u64>,
    pub fee_bps: Option<u16>,
    pub max_number: Option<u32>,
    pub paused: Option<bool>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump,
        has_one = authority @ SoluckyError::Unauthorized
    )]
    pub config: Account<'info, Config>,
}

pub fn handle_update_config(ctx: Context<UpdateConfig>, update: ConfigUpdate) -> Result<()> {
    let config = &mut ctx.accounts.config;

    if let Some(ticket_price) = update.ticket_price {
        require!(
            ticket_price >= MIN_TICKET_PRICE,
            SoluckyError::InvalidTicketPrice
        );
        config.ticket_price = ticket_price;
    }
    if let Some(fee_bps) = update.fee_bps {
        require!(fee_bps <= MAX_FEE_BPS, SoluckyError::FeeTooHigh);
        config.fee_bps = fee_bps;
    }
    if let Some(max_number) = update.max_number {
        require!(max_number > 0, SoluckyError::InvalidMaxNumber);
        config.max_number = max_number;
    }
    if let Some(treasury) = update.treasury {
        config.treasury = treasury;
    }
    if let Some(paused) = update.paused {
        config.paused = paused;
    }
    if let Some(authority) = update.authority {
        config.authority = authority;
    }

    emit!(ConfigUpdated {
        authority: config.authority,
        treasury: config.treasury,
        ticket_price: config.ticket_price,
        fee_bps: config.fee_bps,
        max_number: config.max_number,
        paused: config.paused,
    });
    Ok(())
}
