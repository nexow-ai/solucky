use anchor_lang::prelude::*;

#[event]
pub struct ConfigUpdated {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub ticket_price: u64,
    pub fee_bps: u16,
    pub max_number: u32,
    pub paused: bool,
}

#[event]
pub struct TicketPurchased {
    pub day: u32,
    pub owner: Pubkey,
    pub number: u32,
    pub index: u32,
    pub country: [u8; 2],
    pub pot: u64,
}

#[event]
pub struct RoundClosed {
    pub day: u32,
    pub ticket_count: u32,
    pub pot: u64,
    pub target_slot: u64,
}

#[event]
pub struct RoundDrawn {
    pub day: u32,
    pub slot: u64,
    pub slot_hash: [u8; 32],
    pub randomness: [u8; 32],
    pub winning_index: u32,
}

#[event]
pub struct PrizeClaimed {
    pub day: u32,
    pub winner: Pubkey,
    pub number: u32,
    pub payout: u64,
    pub fee: u64,
}
