use anchor_lang::prelude::*;

#[constant]
pub const CONFIG_SEED: &[u8] = b"config";

#[constant]
pub const ROUND_SEED: &[u8] = b"round";

#[constant]
pub const TICKET_SEED: &[u8] = b"ticket";

/// A round lasts one UTC day: round `d` is open from `d * 86_400` to
/// `(d + 1) * 86_400` seconds after the Unix epoch.
#[constant]
pub const ROUND_DURATION: i64 = 86_400;

/// Lowest ticket price: 0.001 SOL. With the 10% fee cap, a prize is always
/// above the rent-exempt minimum of an empty wallet, so it can always be paid.
#[constant]
pub const MIN_TICKET_PRICE: u64 = 1_000_000;

/// Highest house fee the authority can ever set: 10%.
#[constant]
pub const MAX_FEE_BPS: u16 = 1_000;

/// Slots between closing a round and the slot whose hash seeds its draw.
/// Nobody knows that hash when the round closes.
#[constant]
pub const DRAW_DELAY_SLOTS: u64 = 8;

/// The SlotHashes sysvar only remembers the last 512 produced slots, so a
/// pinned slot can be drawn for about this many slots. `close_round` only
/// pins a new slot once SlotHashes proves the old one is out of reach.
#[constant]
pub const DRAW_WINDOW_SLOTS: u64 = 500;

pub const BPS_DENOMINATOR: u128 = 10_000;

/// ISO 3166-1 alpha-2 placeholder for players who keep their country private.
pub const NO_COUNTRY: [u8; 2] = [0, 0];

pub const SLOT_HASHES_ID: Pubkey = pubkey!("SysvarS1otHashes111111111111111111111111111");
