use anchor_lang::prelude::*;

use crate::{constants::GUESS, utils::period_seconds};

/// Global settings. Only `authority` can change them.
#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    /// Receives the house fees through `collect_fee`.
    pub treasury: Pubkey,
    /// Highest number a ticket can carry (inclusive), in every game. Changes
    /// only apply to rounds opened afterwards.
    pub max_number: u32,
    /// Blocks new tickets. Closing, drawing and claiming always stay open,
    /// so a pause can never lock a pot.
    pub paused: bool,
    pub bump: u8,
}

/// One of the three games: `DAILY`, `HOURLY` or `GUESS`. Price and fee
/// changes only apply to rounds opened afterwards.
#[account]
#[derive(InitSpace)]
pub struct Game {
    pub kind: u8,
    /// Price of one ticket, in lamports.
    pub ticket_price: u64,
    /// House fee, in basis points of the pot. Capped at `MAX_FEE_BPS`.
    pub fee_bps: u16,
    /// Lamports left over by the last draw, held by this account on top of
    /// its rent. They join the pot of the next round drawn.
    pub carry: u64,
    /// Guess only: the number of the round on sale.
    pub current_round: u32,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum RoundStatus {
    /// Selling tickets.
    Open,
    /// Lotteries: sales are over and `target_slot` is pinned.
    /// Guess: the first `sealed_count` guesses wait for their check; sales go
    /// on until `target_slot`.
    Closed,
    /// The winner is known; waiting for the prize to be paid.
    Drawn,
    /// The winner was paid. The fee may still be waiting for `collect_fee`.
    Settled,
}

/// One round of a game. The account holds the pot itself, on top of its
/// rent-exempt balance, and stays on-chain as the round's public record.
///
/// Lottery rounds (`DAILY`, `HOURLY`) are followed in the same account by the
/// sorted list of their numbers, 4 bytes (u32 LE) each, so the draw can find
/// the closest one.
#[account]
#[derive(InitSpace)]
pub struct Round {
    pub kind: u8,
    /// Days (`DAILY`) or hours (`HOURLY`) since the Unix epoch, or the round
    /// number (`GUESS`).
    pub period: u32,
    pub status: RoundStatus,
    /// Ticket price, fee and highest number copied when the round opened.
    pub ticket_price: u64,
    pub fee_bps: u16,
    pub max_number: u32,
    pub ticket_count: u32,
    /// Lamports collected from tickets, plus the carry joined at the draw.
    pub pot: u64,
    /// Rolling SHA-256 of every purchase in the round (for `GUESS`, of every
    /// purchase made while no guesses were waiting for a check).
    pub entropy: [u8; 32],
    /// Slot pinned by `close_round`; the draw uses it or the next produced slot.
    pub target_slot: u64,
    /// Guess only: guesses checked by earlier draws, and guesses sealed for
    /// the pending one. Purchases are numbered in order, so these are counts
    /// of the first tickets.
    pub checked: u32,
    pub sealed_count: u32,
    /// Slot whose hash the draw used, and that hash, as read from SlotHashes.
    pub draw_slot: u64,
    pub slot_hash: [u8; 32],
    /// `sha256(entropy || slot_hash || draw_slot || round)`.
    pub randomness: [u8; 32],
    /// Lotteries only: `randomness[..8] % (max_number + 1)`.
    pub drawn_number: u32,
    /// The winning ticket's purchase index and number.
    pub winning_index: u32,
    pub winning_number: u32,
    pub winner: Pubkey,
    pub winner_country: [u8; 2],
    /// Set by the draw: the winner's 80% and the house fee. The rest of the
    /// pot went to the game's carry.
    pub payout: u64,
    pub fee: u64,
    pub fee_collected: bool,
    pub bump: u8,
}

impl Round {
    pub fn is_lottery(&self) -> bool {
        self.kind != GUESS
    }

    /// When sales end, or `None` for Guess rounds, which end with a hit.
    pub fn ends_at(&self) -> Option<i64> {
        period_seconds(self.kind).map(|seconds| (i64::from(self.period) + 1) * seconds)
    }
}

/// A number held by one player in one round. Its address is derived from the
/// round and the number, so each number can only be sold once per round.
#[account]
#[derive(InitSpace)]
pub struct Ticket {
    pub round: Pubkey,
    pub owner: Pubkey,
    pub number: u32,
    /// Purchase order within the round, starting at 0.
    pub index: u32,
    /// ISO 3166-1 alpha-2 code in uppercase ASCII, or `[0, 0]` if undisclosed.
    pub country: [u8; 2],
    pub created_at: i64,
    pub bump: u8,
}
