//! S☉Lucky: a daily lottery on Solana.
//!
//! Each UTC day is a round. Players buy numbered tickets at a fixed price; a
//! number can only be held by one ticket per round. After midnight UTC anyone
//! can close the round, draw it and pay the winner. The pot never leaves the
//! round account except to the winner and, for the house fee, the treasury.
//!
//! Copyright (c) 2022-2026 Nexow, Inc. (https://nexow.studio). MIT License.

pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("8uiVKnUeC7L4KG93MWvfhRoJkprdAUZ3eg3nzzKfowq2");

#[program]
pub mod solucky {
    use super::*;

    /// Creates the config. Only the program's upgrade authority can call it.
    pub fn initialize(
        ctx: Context<Initialize>,
        ticket_price: u64,
        fee_bps: u16,
        max_number: u32,
    ) -> Result<()> {
        instructions::initialize::handle_initialize(ctx, ticket_price, fee_bps, max_number)
    }

    /// Changes the config. Price and fee changes apply to the next rounds.
    pub fn update_config(ctx: Context<UpdateConfig>, update: ConfigUpdate) -> Result<()> {
        instructions::update_config::handle_update_config(ctx, update)
    }

    /// Buys `number` in today's round, opening the round if needed.
    pub fn buy_ticket(
        ctx: Context<BuyTicket>,
        day: u32,
        number: u32,
        country: [u8; 2],
    ) -> Result<()> {
        instructions::buy_ticket::handle_buy_ticket(ctx, day, number, country)
    }

    /// Ends a finished round and pins the slot that will seed its draw.
    pub fn close_round(ctx: Context<CloseRound>) -> Result<()> {
        instructions::close_round::handle_close_round(ctx)
    }

    /// Picks the winning ticket from the pinned slot's hash.
    pub fn draw_round(ctx: Context<DrawRound>) -> Result<()> {
        instructions::draw_round::handle_draw_round(ctx)
    }

    /// Pays the winner and the treasury.
    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        instructions::claim_prize::handle_claim_prize(ctx)
    }

    /// Returns a settled round's ticket rent to its owner.
    pub fn close_ticket(ctx: Context<CloseTicket>) -> Result<()> {
        instructions::close_ticket::handle_close_ticket(ctx)
    }
}
