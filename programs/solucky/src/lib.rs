//! S☉Lucky: three lottery games on Solana.
//!
//! Players buy numbered tickets at a fixed price; a number can only be held by
//! one ticket per round. In the daily and hourly lotteries, once the period is
//! over anyone can close the round and draw a random number: the closest held
//! number wins. In Guess the number, guesses are checked in batches until one
//! finds the round's number. The winner gets 80% of the pot, the house fee
//! comes out of the rest, and what is left carries over to the game's next
//! round. Every step after a purchase is permissionless.
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

declare_id!("GC81vFcGhBvT9poUzXAFqvfZ8rnAqGVmKUPehrXLq6ux");

#[program]
pub mod solucky {
    use super::*;

    /// Creates the config. Only the program's upgrade authority can call it.
    pub fn initialize(ctx: Context<Initialize>, max_number: u32) -> Result<()> {
        instructions::initialize::handle_initialize(ctx, max_number)
    }

    /// Changes the config. A new `max_number` applies to the next rounds.
    pub fn update_config(ctx: Context<UpdateConfig>, update: ConfigUpdate) -> Result<()> {
        instructions::update_config::handle_update_config(ctx, update)
    }

    /// Opens a game, or changes its price and fee for the next rounds.
    pub fn set_game(
        ctx: Context<SetGame>,
        kind: u8,
        ticket_price: u64,
        fee_bps: u16,
    ) -> Result<()> {
        instructions::set_game::handle_set_game(ctx, kind, ticket_price, fee_bps)
    }

    /// Buys `number` in the game's round on sale, opening the round if
    /// needed. Fails if the round's ticket price is above `max_price`.
    pub fn buy_ticket(
        ctx: Context<BuyTicket>,
        kind: u8,
        period: u32,
        number: u32,
        country: [u8; 2],
        max_price: u64,
    ) -> Result<()> {
        instructions::buy_ticket::handle_buy_ticket(ctx, kind, period, number, country, max_price)
    }

    /// Ends a finished lottery round, or seals a Guess round's unchecked
    /// guesses, and pins the slot that will seed the draw.
    pub fn close_round(ctx: Context<CloseRound>) -> Result<()> {
        instructions::close_round::handle_close_round(ctx)
    }

    /// Picks the winner from the pinned slot's hash: the closest number in a
    /// lottery, or whether a sealed batch of guesses found the number.
    pub fn draw_round(ctx: Context<DrawRound>) -> Result<()> {
        instructions::draw_round::handle_draw_round(ctx)
    }

    /// Pays the winner.
    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        instructions::claim_prize::handle_claim_prize(ctx)
    }

    /// Sends a settled round's house fee to the treasury.
    pub fn collect_fee(ctx: Context<CollectFee>) -> Result<()> {
        instructions::collect_fee::handle_collect_fee(ctx)
    }

    /// Returns a settled round's ticket rent to its owner.
    pub fn close_ticket(ctx: Context<CloseTicket>) -> Result<()> {
        instructions::close_ticket::handle_close_ticket(ctx)
    }
}
