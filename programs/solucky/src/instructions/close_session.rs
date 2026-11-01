use anchor_lang::prelude::*;

use crate::{constants::SESSION_SEED, error::SoluckyError, state::Session};

/// Ends a quick-buy session and sends its budget and rent back to the owner.
/// The owner or the session's key can end it; the lamports always go to the
/// owner.
#[derive(Accounts)]
pub struct CloseSession<'info> {
    /// The owner, or the session's key.
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = owner,
        seeds = [SESSION_SEED, owner.key().as_ref()],
        bump = session.bump,
        constraint = authority.key() == owner.key()
            || authority.key() == session.delegate @ SoluckyError::Unauthorized
    )]
    pub session: Account<'info, Session>,
    /// CHECK: the session's owner, enforced by the seeds above.
    #[account(mut)]
    pub owner: UncheckedAccount<'info>,
}

pub fn handle_close_session(_ctx: Context<CloseSession>) -> Result<()> {
    Ok(())
}
