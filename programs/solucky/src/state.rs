use anchor_lang::prelude::*;

use crate::constants::ROUND_DURATION;

/// Global settings. Only `authority` can change them, and changes to the
/// price or fee only apply to rounds opened afterwards.
#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    /// Receives the house fee through `collect_fee`.
    pub treasury: Pubkey,
    /// Price of one ticket, in lamports.
    pub ticket_price: u64,
    /// House fee, in basis points of the pot. Capped at `MAX_FEE_BPS`.
    pub fee_bps: u16,
    /// Highest number a ticket can carry (inclusive).
    pub max_number: u32,
    /// Blocks new tickets. Closing, drawing and claiming always stay open,
    /// so a pause can never lock a pot.
    pub paused: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum RoundStatus {
    /// Selling tickets until the end of the UTC day.
    Open,
    /// Sales are over and `target_slot` is pinned; waiting for the draw.
    Closed,
    /// `winning_index` is known; waiting for the prize to be paid.
    Drawn,
    /// The winner was paid. The fee may still be waiting for `collect_fee`.
    Settled,
}

/// One UTC day of play. The account holds the pot itself, on top of its
/// rent-exempt balance, and stays on-chain as the round's public record.
#[account]
#[derive(InitSpace)]
pub struct Round {
    /// Days since the Unix epoch (UTC).
    pub day: u32,
    pub status: RoundStatus,
    /// Ticket price and fee copied from `Config` when the round opened.
    pub ticket_price: u64,
    pub fee_bps: u16,
    pub ticket_count: u32,
    /// Lamports collected from tickets, held by this account.
    pub pot: u64,
    /// Rolling SHA-256 of every purchase in the round.
    pub entropy: [u8; 32],
    /// Slot pinned by `close_round`; the draw uses it or the next produced slot.
    pub target_slot: u64,
    /// Slot whose hash the draw used, and that hash, as read from SlotHashes.
    pub draw_slot: u64,
    pub slot_hash: [u8; 32],
    /// `sha256(entropy || slot_hash || draw_slot || round)`.
    pub randomness: [u8; 32],
    /// Purchase index of the winning ticket: `randomness[..8] % ticket_count`.
    pub winning_index: u32,
    pub winning_number: u32,
    pub winner: Pubkey,
    pub winner_country: [u8; 2],
    /// Lamports paid to the winner, and the house fee for the treasury.
    pub payout: u64,
    pub fee: u64,
    pub fee_collected: bool,
    pub bump: u8,
}

impl Round {
    pub fn ends_at(&self) -> i64 {
        (i64::from(self.day) + 1) * ROUND_DURATION
    }
}

/// A number held by one player in one round. Its address is derived from the
/// round and the number, so each number can only be sold once per day.
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
