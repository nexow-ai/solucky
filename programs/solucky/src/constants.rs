use anchor_lang::prelude::*;

#[constant]
pub const CONFIG_SEED: &[u8] = b"config";

#[constant]
pub const GAME_SEED: &[u8] = b"game";

#[constant]
pub const ROUND_SEED: &[u8] = b"round";

#[constant]
pub const TICKET_SEED: &[u8] = b"ticket";

/// Daily lottery: round `d` is open from `d * 86_400` to `(d + 1) * 86_400`
/// seconds after the Unix epoch.
#[constant]
pub const DAILY: u8 = 0;

/// Hourly lottery: round `h` is open from `h * 3_600` to `(h + 1) * 3_600`.
#[constant]
pub const HOURLY: u8 = 1;

/// Guess the number: rounds are numbered from 0 and stay open until a guess
/// finds the number.
#[constant]
pub const GUESS: u8 = 2;

#[constant]
pub const DAY_SECONDS: i64 = 86_400;

#[constant]
pub const HOUR_SECONDS: i64 = 3_600;

/// Share of the pot paid to the winner: 80%. The house fee comes out of the
/// other 20%, and what is left carries over to the game's next round.
#[constant]
pub const WINNER_SHARE_BPS: u16 = 8_000;

/// Lowest ticket price: 0.002 SOL. The winner's 80% of the smallest pot is
/// then above the rent-exempt minimum of an empty wallet, so it can always be
/// paid.
#[constant]
pub const MIN_TICKET_PRICE: u64 = 2_000_000;

/// Highest house fee the authority can ever set: 20%, the part of the pot
/// that does not go to the winner.
#[constant]
pub const MAX_FEE_BPS: u16 = 2_000;

/// Most tickets in one lottery round. Each one adds 4 bytes to the round's
/// sorted list of numbers.
// ponytail: keeps a buy near 100K CU at the cap; raise with measured CU.
#[constant]
pub const MAX_LOTTERY_TICKETS: u32 = 1_000_000;

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
