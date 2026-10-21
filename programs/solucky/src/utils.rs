use anchor_lang::{prelude::*, solana_program::program_memory::sol_memmove};

use crate::{
    constants::{
        BPS_DENOMINATOR, DAILY, DAY_SECONDS, HOURLY, HOUR_SECONDS, NO_COUNTRY, WINNER_SHARE_BPS,
    },
    error::SoluckyError,
};

/// Length of a lottery round's period in seconds, or `None` for Guess.
pub fn period_seconds(kind: u8) -> Option<i64> {
    match kind {
        DAILY => Some(DAY_SECONDS),
        HOURLY => Some(HOUR_SECONDS),
        _ => None,
    }
}

/// Period of a Unix timestamp: days or hours since the epoch (UTC).
pub fn period_of(unix_timestamp: i64, seconds: i64) -> Result<u32> {
    require!(unix_timestamp >= 0, SoluckyError::WrongRound);
    u32::try_from(unix_timestamp / seconds).map_err(|_| error!(SoluckyError::Overflow))
}

/// Two uppercase ASCII letters, or `[0, 0]` for a private country.
pub fn is_valid_country(country: &[u8; 2]) -> bool {
    *country == NO_COUNTRY || country.iter().all(u8::is_ascii_uppercase)
}

/// `bps` basis points of `amount`, rounded down.
fn share(amount: u64, bps: u16) -> u64 {
    // bps <= 10_000, so the result always fits in a u64.
    (u128::from(amount) * u128::from(bps) / BPS_DENOMINATOR) as u64
}

/// House fee for a pot, rounded down.
pub fn fee_for(pot: u64, fee_bps: u16) -> u64 {
    share(pot, fee_bps)
}

/// The winner's 80% of a pot, rounded down.
pub fn payout_for(pot: u64) -> u64 {
    share(pot, WINNER_SHARE_BPS)
}

const NUMBER_LEN: usize = 4;

fn number(bytes: &[u8; NUMBER_LEN]) -> u32 {
    u32::from_le_bytes(*bytes)
}

/// Inserts `n` into a lottery round's sorted numbers. `tail` holds them as
/// u32 LE plus 4 free bytes at the end; numbers are unique.
pub fn insert_sorted(tail: &mut [u8], n: u32) {
    let end = tail.len() - NUMBER_LEN;
    let (numbers, _) = tail[..end].as_chunks::<NUMBER_LEN>();
    let at = numbers.partition_point(|x| number(x) < n) * NUMBER_LEN;
    let ptr = tail.as_mut_ptr();
    // SAFETY: `at..end` and `at + 4..end + 4` both lie inside `tail`. The
    // syscall is far cheaper on-chain than a byte loop over a long list.
    unsafe { sol_memmove(ptr.add(at + NUMBER_LEN), ptr.add(at), end - at) };
    tail[at..at + NUMBER_LEN].copy_from_slice(&n.to_le_bytes());
}

/// The number in a sorted tail closest to `target`; a tie goes to the lower
/// number. `None` when the tail is empty.
pub fn closest(tail: &[u8], target: u32) -> Option<u32> {
    let (numbers, _) = tail.as_chunks::<NUMBER_LEN>();
    let at = numbers.partition_point(|x| number(x) < target);
    let above = numbers.get(at).map(number);
    let below = at.checked_sub(1).map(|i| number(&numbers[i]));
    match (below, above) {
        (Some(b), Some(a)) => Some(if target - b <= a - target { b } else { a }),
        (b, a) => b.or(a),
    }
}

/// Checks a batch of guesses. `checked` guesses were already wrong, so the
/// number is one of the `max_number + 1 - checked` numbers left, each equally
/// likely; the batch holds `sealed - checked` of them. Returns the purchase
/// index of the guess that found it, if any.
pub fn guess_outcome(x: u64, checked: u32, sealed: u32, max_number: u32) -> Option<u32> {
    let left = u64::from(max_number) + 1 - u64::from(checked);
    let r = x % left;
    // r < sealed - checked <= u32::MAX, so the index fits.
    (r < u64::from(sealed - checked)).then(|| checked + r as u32)
}

const SLOT_HASH_ENTRY_LEN: usize = 8 + 32;

/// Finds the hash of the first produced slot at or after `target` in the raw
/// data of the SlotHashes sysvar (a u64 length, then `(slot, hash)` pairs
/// sorted from newest to oldest).
///
/// Returns `None` when no slot at or after `target` was recorded yet, or when
/// `target` is older than the oldest recorded slot: the sysvar can no longer
/// prove which slot came first, so the answer would not be deterministic.
pub fn find_slot_hash(data: &[u8], target: u64) -> Option<(u64, [u8; 32])> {
    let len = usize::try_from(u64::from_le_bytes(data.get(..8)?.try_into().ok()?)).ok()?;
    let (entries, _) = data.get(8..)?.as_chunks::<SLOT_HASH_ENTRY_LEN>();

    let mut found = None;
    let mut reaches_target = false;
    for entry in entries.iter().take(len) {
        let slot = u64::from_le_bytes(entry[..8].try_into().ok()?);
        if slot < target {
            reaches_target = true;
            break;
        }
        found = Some((slot, entry[8..].try_into().ok()?));
        if slot == target {
            reaches_target = true;
            break;
        }
    }
    found.filter(|_| reaches_target)
}

/// True when the SlotHashes data proves that `target` can never be drawn:
/// its oldest recorded slot is already newer than `target`.
pub fn slot_hash_expired(data: &[u8], target: u64) -> bool {
    let Some(len) = data
        .get(..8)
        .and_then(|bytes| bytes.try_into().ok())
        .map(u64::from_le_bytes)
        .and_then(|len| usize::try_from(len).ok())
    else {
        return false;
    };
    let Some(entries) = data.get(8..) else {
        return false;
    };
    let (entries, _) = entries.as_chunks::<SLOT_HASH_ENTRY_LEN>();
    entries
        .get(..len.min(entries.len()))
        .and_then(<[_]>::last)
        .map(|oldest| u64::from_le_bytes(oldest[..8].try_into().unwrap()))
        .is_some_and(|oldest| oldest > target)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn slot_hashes(entries: &[(u64, u8)]) -> Vec<u8> {
        let mut data = (entries.len() as u64).to_le_bytes().to_vec();
        for (slot, fill) in entries {
            data.extend_from_slice(&slot.to_le_bytes());
            data.extend_from_slice(&[*fill; 32]);
        }
        data
    }

    fn tail(numbers: &[u32]) -> Vec<u8> {
        numbers.iter().flat_map(|n| n.to_le_bytes()).collect()
    }

    #[test]
    fn periods_count_utc_days_and_hours() {
        assert_eq!(period_of(0, DAY_SECONDS).unwrap(), 0);
        assert_eq!(period_of(86_399, DAY_SECONDS).unwrap(), 0);
        assert_eq!(period_of(86_400, DAY_SECONDS).unwrap(), 1);
        assert_eq!(period_of(3_599, HOUR_SECONDS).unwrap(), 0);
        assert_eq!(period_of(86_400, HOUR_SECONDS).unwrap(), 24);
        assert!(period_of(-1, DAY_SECONDS).is_err());
        assert_eq!(period_seconds(crate::constants::GUESS), None);
    }

    #[test]
    fn inserts_keep_the_numbers_sorted() {
        let mut data = Vec::new();
        for n in [50, 7, 21_000_000, 0, 8] {
            data.extend_from_slice(&[0; NUMBER_LEN]);
            insert_sorted(&mut data, n);
        }
        assert_eq!(data, tail(&[0, 7, 8, 50, 21_000_000]));
    }

    #[test]
    fn closest_number_wins_and_ties_go_low() {
        let numbers = tail(&[10, 20, 40]);
        assert_eq!(closest(&numbers, 0), Some(10));
        assert_eq!(closest(&numbers, 10), Some(10));
        assert_eq!(closest(&numbers, 14), Some(10));
        assert_eq!(closest(&numbers, 15), Some(10));
        assert_eq!(closest(&numbers, 16), Some(20));
        assert_eq!(closest(&numbers, 30), Some(20));
        assert_eq!(closest(&numbers, 31), Some(40));
        assert_eq!(closest(&numbers, u32::MAX), Some(40));
        assert_eq!(closest(&tail(&[5]), 1_000), Some(5));
        assert_eq!(closest(&[], 1), None);
    }

    #[test]
    fn guesses_hit_with_batch_over_numbers_left() {
        // 11 numbers, 3 already wrong: 8 left, 2 in the batch.
        assert_eq!(guess_outcome(0, 3, 5, 10), Some(3));
        assert_eq!(guess_outcome(1, 3, 5, 10), Some(4));
        assert_eq!(guess_outcome(2, 3, 5, 10), None);
        assert_eq!(guess_outcome(8, 3, 5, 10), Some(3));
        // Every number left is in the batch: a sure hit.
        assert_eq!(guess_outcome(u64::MAX, 9, 11, 10), Some(10));
        assert_eq!(guess_outcome(u64::MAX, 0, 1, 21_000_000), None);
    }

    #[test]
    fn country_codes() {
        assert!(is_valid_country(b"ES"));
        assert!(is_valid_country(&NO_COUNTRY));
        assert!(!is_valid_country(b"es"));
        assert!(!is_valid_country(&[b'E', 0]));
        assert!(!is_valid_country(b"1A"));
    }

    #[test]
    fn shares_round_down() {
        assert_eq!(fee_for(1_000, 500), 50);
        assert_eq!(fee_for(999, 1), 0);
        assert_eq!(fee_for(u64::MAX, 1_000), u64::MAX / 10);
        assert_eq!(payout_for(1_000), 800);
        assert_eq!(payout_for(9), 7);
        assert_eq!(payout_for(u64::MAX), u64::MAX / 10 * 8 + 4);
    }

    #[test]
    fn finds_the_target_slot() {
        let data = slot_hashes(&[(105, 5), (104, 4), (103, 3), (101, 1)]);
        assert_eq!(find_slot_hash(&data, 103), Some((103, [3; 32])));
        assert_eq!(find_slot_hash(&data, 101), Some((101, [1; 32])));
    }

    #[test]
    fn skips_to_the_next_produced_slot() {
        let data = slot_hashes(&[(105, 5), (104, 4), (101, 1)]);
        assert_eq!(find_slot_hash(&data, 102), Some((104, [4; 32])));
    }

    #[test]
    fn target_not_reached_yet() {
        let data = slot_hashes(&[(105, 5), (104, 4)]);
        assert_eq!(find_slot_hash(&data, 106), None);
    }

    #[test]
    fn target_out_of_window() {
        let data = slot_hashes(&[(105, 5), (104, 4)]);
        assert_eq!(find_slot_hash(&data, 100), None);
    }

    #[test]
    fn malformed_data() {
        assert_eq!(find_slot_hash(&[], 1), None);
        assert_eq!(find_slot_hash(&[1, 0, 0], 1), None);
        assert!(!slot_hash_expired(&[], 1));
        assert!(!slot_hash_expired(&[1, 0, 0], 1));
    }

    #[test]
    fn expiry_needs_proof() {
        let data = slot_hashes(&[(105, 5), (104, 4), (101, 1)]);
        // Still readable, or not produced yet: no expiry.
        assert!(!slot_hash_expired(&data, 101));
        assert!(!slot_hash_expired(&data, 103));
        assert!(!slot_hash_expired(&data, 200));
        // The oldest recorded slot is newer than the target: gone for good.
        assert!(slot_hash_expired(&data, 100));
        assert_eq!(find_slot_hash(&data, 100), None);
    }
}
