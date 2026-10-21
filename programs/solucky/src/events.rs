use anchor_lang::prelude::*;

#[event]
pub struct ConfigUpdated {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub max_number: u32,
    pub paused: bool,
}

#[event]
pub struct GameUpdated {
    pub kind: u8,
    pub ticket_price: u64,
    pub fee_bps: u16,
}

#[event]
pub struct TicketPurchased {
    pub kind: u8,
    pub period: u32,
    pub owner: Pubkey,
    pub number: u32,
    pub index: u32,
    pub country: [u8; 2],
    pub pot: u64,
}

#[event]
pub struct RoundClosed {
    pub kind: u8,
    pub period: u32,
    /// Lotteries: every ticket. Guess: the guesses sealed for the next check.
    pub ticket_count: u32,
    pub pot: u64,
    pub target_slot: u64,
}

#[event]
pub struct RoundDrawn {
    pub kind: u8,
    pub period: u32,
    pub slot: u64,
    pub slot_hash: [u8; 32],
    pub randomness: [u8; 32],
    /// Guess: false when the batch missed and the round goes on.
    pub won: bool,
    pub drawn_number: u32,
    pub winning_index: u32,
    pub winning_number: u32,
    pub carry_in: u64,
    pub payout: u64,
    pub fee: u64,
    pub carry_out: u64,
}

#[event]
pub struct FeeCollected {
    pub kind: u8,
    pub period: u32,
    pub treasury: Pubkey,
    pub fee: u64,
}

#[event]
pub struct PrizeClaimed {
    pub kind: u8,
    pub period: u32,
    pub winner: Pubkey,
    pub number: u32,
    pub payout: u64,
    pub fee: u64,
}
