use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, GAME_SEED, GUESS, MAX_FEE_BPS, MIN_TICKET_PRICE},
    error::SoluckyError,
    events::GameUpdated,
    state::{Config, Game},
};

#[derive(Accounts)]
#[instruction(kind: u8)]
pub struct SetGame<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [CONFIG_SEED],
        bump = config.bump,
        has_one = authority @ SoluckyError::Unauthorized
    )]
    pub config: Account<'info, Config>,
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + Game::INIT_SPACE,
        seeds = [GAME_SEED, &kind.to_le_bytes()],
        bump
    )]
    pub game: Account<'info, Game>,
    pub system_program: Program<'info, System>,
}

/// Opens a game, or changes its price and fee for the rounds opened next.
pub fn handle_set_game(
    ctx: Context<SetGame>,
    kind: u8,
    ticket_price: u64,
    fee_bps: u16,
) -> Result<()> {
    require!(kind <= GUESS, SoluckyError::InvalidGame);
    require!(
        ticket_price >= MIN_TICKET_PRICE,
        SoluckyError::InvalidTicketPrice
    );
    require!(fee_bps <= MAX_FEE_BPS, SoluckyError::FeeTooHigh);

    let game = &mut ctx.accounts.game;
    // A new account is all zeros, and a game's price is never zero.
    if game.ticket_price == 0 {
        game.kind = kind;
        game.bump = ctx.bumps.game;
    }
    game.ticket_price = ticket_price;
    game.fee_bps = fee_bps;

    emit!(GameUpdated {
        kind,
        ticket_price,
        fee_bps,
    });
    Ok(())
}
