use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    constants::{MAX_SESSION_SECONDS, SESSION_SEED},
    error::SoluckyError,
    state::Session,
};

/// Starts a quick-buy session, or changes its key and end and adds to its
/// budget. Only the owner can.
#[derive(Accounts)]
pub struct OpenSession<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + Session::INIT_SPACE,
        seeds = [SESSION_SEED, owner.key().as_ref()],
        bump
    )]
    pub session: Account<'info, Session>,
    pub system_program: Program<'info, System>,
}

pub fn handle_open_session(
    ctx: Context<OpenSession>,
    delegate: Pubkey,
    expires_at: i64,
    deposit: u64,
) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    require!(
        expires_at > now && expires_at.saturating_sub(now) <= MAX_SESSION_SECONDS,
        SoluckyError::InvalidSessionExpiry
    );
    let owner = ctx.accounts.owner.key();
    ctx.accounts.session.set_inner(Session {
        owner,
        delegate,
        expires_at,
        bump: ctx.bumps.session,
    });
    if deposit > 0 {
        transfer(
            CpiContext::new(
                System::id(),
                Transfer {
                    from: ctx.accounts.owner.to_account_info(),
                    to: ctx.accounts.session.to_account_info(),
                },
            ),
            deposit,
        )?;
    }
    Ok(())
}
