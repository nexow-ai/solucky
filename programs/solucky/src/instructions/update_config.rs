use anchor_lang::prelude::*;

use crate::{constants::CONFIG_SEED, error::SoluckyError, events::ConfigUpdated, state::Config};

/// Fields left as `None` keep their current value.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ConfigUpdate {
    pub authority: Option<Pubkey>,
    pub treasury: Option<Pubkey>,
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
        max_number: config.max_number,
        paused: config.paused,
    });
    Ok(())
}
