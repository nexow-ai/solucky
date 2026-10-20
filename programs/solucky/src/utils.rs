use anchor_lang::prelude::*;

use crate::{
    constants::{BPS_DENOMINATOR, NO_COUNTRY, ROUND_DURATION},
    error::SoluckyError,
};

/// UTC day number of a Unix timestamp.
pub fn day_of(unix_timestamp: i64) -> Result<u32> {
    require!(unix_timestamp >= 0, SoluckyError::WrongDay);
    u32::try_from(unix_timestamp / ROUND_DURATION).map_err(|_| error!(SoluckyError::Overflow))
}

/// Two uppercase ASCII letters, or `[0, 0]` for a private country.
pub fn is_valid_country(country: &[u8; 2]) -> bool {
    *country == NO_COUNTRY || country.iter().all(u8::is_ascii_uppercase)
}

/// House fee for a pot, rounded down.
pub fn fee_for(pot: u64, fee_bps: u16) -> u64 {
    // fee_bps <= 10_000, so the result always fits in a u64.
    (u128::from(pot) * u128::from(fee_bps) / BPS_DENOMINATOR) as u64
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
    let entries = data.get(8..)?.chunks_exact(SLOT_HASH_ENTRY_LEN).take(len);

    let mut found = None;
    let mut reaches_target = false;
    for entry in entries {
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

    #[test]
    fn day_of_counts_utc_days() {
        assert_eq!(day_of(0).unwrap(), 0);
        assert_eq!(day_of(86_399).unwrap(), 0);
        assert_eq!(day_of(86_400).unwrap(), 1);
        assert!(day_of(-1).is_err());
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
    fn fee_rounds_down() {
        assert_eq!(fee_for(1_000, 500), 50);
        assert_eq!(fee_for(999, 1), 0);
        assert_eq!(fee_for(u64::MAX, 1_000), u64::MAX / 10);
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
    }
}
