//! End-to-end tests of the program on LiteSVM. Run `anchor build` first: the
//! tests load `target/deploy/solucky.so`.

use {
    anchor_lang::{
        error::ErrorCode,
        prelude::Pubkey,
        solana_program::{
            bpf_loader_upgradeable::{get_program_data_address, UpgradeableLoaderState},
            clock::Clock,
            instruction::Instruction,
            system_program,
        },
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::{
        types::{FailedTransactionMetadata, TransactionMetadata},
        LiteSVM,
    },
    solana_hash::Hash,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_sha256_hasher::hashv,
    solana_signer::Signer,
    solana_slot_hashes::SlotHashes,
    solana_transaction::{versioned::VersionedTransaction, InstructionError},
    solana_transaction_error::TransactionError,
    solucky::{
        accounts, error::SoluckyError, instruction, Config, ConfigUpdate, Round, RoundStatus,
        Ticket, CONFIG_SEED, DRAW_DELAY_SLOTS, DRAW_WINDOW_SLOTS, NO_COUNTRY, ROUND_DURATION,
        ROUND_SEED, SLOT_HASHES_ID, TICKET_SEED,
    },
};

const PRICE: u64 = 100_000_000;
const FEE_BPS: u16 = 500;
const MAX_NUMBER: u32 = 1_000_000_000;
const DAY: u32 = 20_000;
const START_SLOT: u64 = 1_000;
const SOL: u64 = 1_000_000_000;

type TxResult = Result<TransactionMetadata, FailedTransactionMetadata>;

fn config_pda() -> Pubkey {
    Pubkey::find_program_address(&[CONFIG_SEED], &solucky::ID).0
}

fn round_pda(day: u32) -> Pubkey {
    Pubkey::find_program_address(&[ROUND_SEED, &day.to_le_bytes()], &solucky::ID).0
}

fn ticket_pda(day: u32, number: u32) -> Pubkey {
    Pubkey::find_program_address(
        &[TICKET_SEED, round_pda(day).as_ref(), &number.to_le_bytes()],
        &solucky::ID,
    )
    .0
}

fn ix(data: impl InstructionData, accounts: impl ToAccountMetas) -> Instruction {
    Instruction::new_with_bytes(solucky::ID, &data.data(), accounts.to_account_metas(None))
}

/// Deterministic stand-in for a block hash.
fn slot_hash(slot: u64) -> Hash {
    hashv(&[b"block", &slot.to_le_bytes()])
}

#[track_caller]
fn assert_code(result: TxResult, code: u32) {
    match result {
        Ok(_) => panic!("expected custom error {code}, the transaction succeeded"),
        Err(failed) => assert_eq!(
            failed.err,
            TransactionError::InstructionError(0, InstructionError::Custom(code)),
            "logs: {:#?}",
            failed.meta.logs
        ),
    }
}

#[track_caller]
fn assert_error(result: TxResult, error: SoluckyError) {
    assert_code(result, u32::from(error));
}

#[track_caller]
fn assert_ok(result: TxResult) -> TransactionMetadata {
    result.unwrap_or_else(|failed| panic!("{:?}\n{:#?}", failed.err, failed.meta.logs))
}

struct Env {
    svm: LiteSVM,
    admin: Keypair,
    cranker: Keypair,
    treasury: Pubkey,
    /// `(day, number)` of every ticket sold, to find winners.
    sold: Vec<(u32, u32)>,
}

impl Env {
    /// A program deployed by `admin`, with no config yet, on `DAY` at 01:00.
    fn deployed() -> Self {
        let mut svm = LiteSVM::new();
        let program = include_bytes!(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../target/deploy/solucky.so"
        ));
        svm.add_program(solucky::ID, program).unwrap();

        let admin = Keypair::new();
        let cranker = Keypair::new();
        let treasury = Keypair::new().pubkey();
        for account in [admin.pubkey(), cranker.pubkey(), treasury] {
            svm.airdrop(&account, 100 * SOL).unwrap();
        }

        // LiteSVM deploys without an upgrade authority; make it `admin`.
        let program_data = get_program_data_address(&solucky::ID);
        let mut account = svm.get_account(&program_data).unwrap();
        let header = bincode::serialize(&UpgradeableLoaderState::ProgramData {
            slot: 0,
            upgrade_authority_address: Some(admin.pubkey()),
        })
        .unwrap();
        account.data[..header.len()].copy_from_slice(&header);
        svm.set_account(program_data, account).unwrap();

        let mut env = Self {
            svm,
            admin,
            cranker,
            treasury,
            sold: Vec::new(),
        };
        env.set_time(i64::from(DAY) * ROUND_DURATION + 3_600);
        env.set_slot(START_SLOT, &[START_SLOT - 1]);
        env
    }

    /// A deployed and initialized program.
    fn new() -> Self {
        let mut env = Self::deployed();
        let admin = env.admin.insecure_clone();
        assert_ok(env.initialize(&admin, PRICE, FEE_BPS, MAX_NUMBER));
        env
    }

    fn send(
        &mut self,
        instruction: Instruction,
        payer: &Keypair,
        signers: &[&Keypair],
    ) -> TxResult {
        // A fresh blockhash keeps retried transactions from being deduplicated.
        self.svm.expire_blockhash();
        let blockhash = self.svm.latest_blockhash();
        let message =
            Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
        let mut all_signers = vec![payer];
        all_signers.extend(signers.iter().filter(|s| s.pubkey() != payer.pubkey()));
        let tx =
            VersionedTransaction::try_new(VersionedMessage::Legacy(message), &all_signers).unwrap();
        self.svm.send_transaction(tx)
    }

    fn player(&mut self) -> Keypair {
        let player = Keypair::new();
        self.svm.airdrop(&player.pubkey(), 10 * SOL).unwrap();
        player
    }

    fn set_time(&mut self, unix_timestamp: i64) {
        let mut clock = self.svm.get_sysvar::<Clock>();
        clock.unix_timestamp = unix_timestamp;
        self.svm.set_sysvar(&clock);
    }

    fn end_of(&mut self, day: u32) {
        self.set_time((i64::from(day) + 1) * ROUND_DURATION);
    }

    /// Moves to `slot`, with `produced` (newest first) as the recorded slots.
    fn set_slot(&mut self, slot: u64, produced: &[u64]) {
        self.svm.warp_to_slot(slot);
        let entries: Vec<(u64, Hash)> = produced.iter().map(|s| (*s, slot_hash(*s))).collect();
        self.svm.set_sysvar(&SlotHashes::new(&entries));
    }

    fn balance(&self, address: &Pubkey) -> u64 {
        self.svm.get_balance(address).unwrap_or(0)
    }

    fn fetch<T: AccountDeserialize>(&self, address: &Pubkey) -> T {
        let account = self.svm.get_account(address).expect("account exists");
        T::try_deserialize(&mut account.data.as_slice()).unwrap()
    }

    fn config(&self) -> Config {
        self.fetch(&config_pda())
    }

    fn round(&self, day: u32) -> Round {
        self.fetch(&round_pda(day))
    }

    fn ticket(&self, day: u32, number: u32) -> Ticket {
        self.fetch(&ticket_pda(day, number))
    }

    fn initialize(&mut self, authority: &Keypair, price: u64, fee_bps: u16, max: u32) -> TxResult {
        let treasury = self.treasury;
        self.send(
            ix(
                instruction::Initialize {
                    ticket_price: price,
                    fee_bps,
                    max_number: max,
                },
                accounts::Initialize {
                    authority: authority.pubkey(),
                    config: config_pda(),
                    treasury,
                    program: solucky::ID,
                    program_data: get_program_data_address(&solucky::ID),
                    system_program: system_program::ID,
                },
            ),
            authority,
            &[],
        )
    }

    fn update(&mut self, authority: &Keypair, update: ConfigUpdate) -> TxResult {
        self.send(
            ix(
                instruction::UpdateConfig { update },
                accounts::UpdateConfig {
                    authority: authority.pubkey(),
                    config: config_pda(),
                },
            ),
            authority,
            &[],
        )
    }

    fn buy(&mut self, buyer: &Keypair, day: u32, number: u32, country: [u8; 2]) -> TxResult {
        let result = self.send(
            ix(
                instruction::BuyTicket {
                    day,
                    number,
                    country,
                },
                accounts::BuyTicket {
                    buyer: buyer.pubkey(),
                    config: config_pda(),
                    round: round_pda(day),
                    ticket: ticket_pda(day, number),
                    system_program: system_program::ID,
                },
            ),
            buyer,
            &[],
        );
        if result.is_ok() {
            self.sold.push((day, number));
        }
        result
    }

    fn close(&mut self, day: u32) -> TxResult {
        let cranker = self.cranker.insecure_clone();
        self.send(
            ix(
                instruction::CloseRound {},
                accounts::CloseRound {
                    round: round_pda(day),
                },
            ),
            &cranker,
            &[],
        )
    }

    fn draw(&mut self, day: u32) -> TxResult {
        let cranker = self.cranker.insecure_clone();
        self.send(
            ix(
                instruction::DrawRound {},
                accounts::DrawRound {
                    round: round_pda(day),
                    slot_hashes: SLOT_HASHES_ID,
                },
            ),
            &cranker,
            &[],
        )
    }

    fn claim_with(&mut self, day: u32, number: u32, owner: Pubkey, treasury: Pubkey) -> TxResult {
        let cranker = self.cranker.insecure_clone();
        self.send(
            ix(
                instruction::ClaimPrize {},
                accounts::ClaimPrize {
                    config: config_pda(),
                    round: round_pda(day),
                    ticket: ticket_pda(day, number),
                    owner,
                    treasury,
                },
            ),
            &cranker,
            &[],
        )
    }

    fn claim(&mut self, day: u32, number: u32) -> TxResult {
        let owner = self.ticket(day, number).owner;
        let treasury = self.config().treasury;
        self.claim_with(day, number, owner, treasury)
    }

    fn close_ticket(&mut self, owner: &Keypair, day: u32, number: u32) -> TxResult {
        self.send(
            ix(
                instruction::CloseTicket {},
                accounts::CloseTicket {
                    owner: owner.pubkey(),
                    round: round_pda(day),
                    ticket: ticket_pda(day, number),
                },
            ),
            owner,
            &[],
        )
    }

    /// Closes `day` and draws it from the pinned slot. Returns the winner.
    fn close_and_draw(&mut self, day: u32) -> Ticket {
        self.end_of(day);
        assert_ok(self.close(day));
        let target = self.round(day).target_slot;
        self.set_slot(target + 1, &[target, target - 1]);
        assert_ok(self.draw(day));
        let round = self.round(day);
        self.winning_ticket(day, round.winning_index)
    }

    fn winning_ticket(&self, day: u32, index: u32) -> Ticket {
        self.sold
            .iter()
            .filter(|(d, _)| *d == day)
            .map(|(_, number)| self.ticket(day, *number))
            .find(|ticket| ticket.index == index)
            .expect("the winning ticket exists")
    }
}

#[test]
fn initialize_is_reserved_to_the_upgrade_authority() {
    let mut env = Env::deployed();
    let stranger = env.player();
    assert_error(
        env.initialize(&stranger, PRICE, FEE_BPS, MAX_NUMBER),
        SoluckyError::Unauthorized,
    );

    let admin = env.admin.insecure_clone();
    assert_error(
        env.initialize(&admin, PRICE, 1_001, MAX_NUMBER),
        SoluckyError::FeeTooHigh,
    );
    assert_error(
        env.initialize(&admin, 0, FEE_BPS, MAX_NUMBER),
        SoluckyError::InvalidTicketPrice,
    );
    assert_error(
        env.initialize(&admin, PRICE, FEE_BPS, 0),
        SoluckyError::InvalidMaxNumber,
    );

    assert_ok(env.initialize(&admin, PRICE, FEE_BPS, MAX_NUMBER));
    let config = env.config();
    assert_eq!(config.authority, admin.pubkey());
    assert_eq!(config.treasury, env.treasury);
    assert_eq!(config.ticket_price, PRICE);
    assert_eq!(config.fee_bps, FEE_BPS);
    assert_eq!(config.max_number, MAX_NUMBER);
    assert!(!config.paused);

    // The config can only be created once.
    assert!(env.initialize(&admin, PRICE, FEE_BPS, MAX_NUMBER).is_err());
}

#[test]
fn buying_tickets_fills_the_pot() {
    let mut env = Env::new();
    let alice = env.player();
    let bob = env.player();
    let before = env.balance(&alice.pubkey());

    assert_ok(env.buy(&alice, DAY, 7, *b"ES"));
    let round = env.round(DAY);
    assert_eq!(round.day, DAY);
    assert_eq!(round.status, RoundStatus::Open);
    assert_eq!(round.ticket_price, PRICE);
    assert_eq!(round.fee_bps, FEE_BPS);
    assert_eq!(round.ticket_count, 1);
    assert_eq!(round.pot, PRICE);

    let ticket = env.ticket(DAY, 7);
    assert_eq!(ticket.round, round_pda(DAY));
    assert_eq!(ticket.owner, alice.pubkey());
    assert_eq!(ticket.number, 7);
    assert_eq!(ticket.index, 0);
    assert_eq!(&ticket.country, b"ES");

    // Alice paid the ticket, the rent of both accounts and the network fee.
    let rent = env.balance(&round_pda(DAY)) - PRICE + env.balance(&ticket_pda(DAY, 7));
    assert_eq!(before - env.balance(&alice.pubkey()), PRICE + rent + 5_000);

    // A number is sold once per day.
    assert_code(env.buy(&bob, DAY, 7, *b"FR"), 0);

    assert_ok(env.buy(&bob, DAY, MAX_NUMBER, NO_COUNTRY));
    let round = env.round(DAY);
    assert_eq!(round.ticket_count, 2);
    assert_eq!(round.pot, 2 * PRICE);
    assert_eq!(env.ticket(DAY, MAX_NUMBER).index, 1);
    assert_ne!(round.entropy, [0; 32]);
}

#[test]
fn tickets_are_validated() {
    let mut env = Env::new();
    let carol = env.player();
    assert_error(env.buy(&carol, DAY + 1, 1, *b"ES"), SoluckyError::WrongDay);
    assert_error(env.buy(&carol, DAY - 1, 1, *b"ES"), SoluckyError::WrongDay);
    assert_error(
        env.buy(&carol, DAY, MAX_NUMBER + 1, *b"ES"),
        SoluckyError::NumberOutOfRange,
    );
    assert_error(
        env.buy(&carol, DAY, 1, *b"es"),
        SoluckyError::InvalidCountry,
    );
    assert_error(
        env.buy(&carol, DAY, 1, [b'E', 0]),
        SoluckyError::InvalidCountry,
    );

    let admin = env.admin.insecure_clone();
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            paused: Some(true),
            ..Default::default()
        },
    ));
    assert_error(env.buy(&carol, DAY, 1, *b"ES"), SoluckyError::Paused);
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            paused: Some(false),
            ..Default::default()
        },
    ));
    assert_ok(env.buy(&carol, DAY, 1, *b"ES"));
}

#[test]
fn a_full_round_pays_the_winner_and_the_treasury() {
    let mut env = Env::new();
    let players: Vec<Keypair> = (0..5).map(|_| env.player()).collect();
    for (i, player) in players.iter().enumerate() {
        assert_ok(env.buy(player, DAY, 100 + i as u32, *b"JP"));
    }

    // Too early.
    assert_error(env.close(DAY), SoluckyError::RoundNotOver);
    assert_error(env.draw(DAY), SoluckyError::RoundNotClosed);

    env.end_of(DAY);
    assert_ok(env.close(DAY));
    let round = env.round(DAY);
    assert_eq!(round.status, RoundStatus::Closed);
    assert_eq!(round.target_slot, START_SLOT + DRAW_DELAY_SLOTS);
    // No more tickets for a closed day, and no second pin.
    assert_error(env.buy(&players[0], DAY, 1, *b"JP"), SoluckyError::WrongDay);
    assert_error(env.close(DAY), SoluckyError::DrawStillPossible);

    // The pinned slot has not been produced yet.
    let target = round.target_slot;
    env.set_slot(target, &[target - 1]);
    assert_error(env.draw(DAY), SoluckyError::TargetSlotNotReached);

    env.set_slot(target + 2, &[target + 1, target, target - 1]);
    assert_ok(env.draw(DAY));
    let round = env.round(DAY);
    assert_eq!(round.status, RoundStatus::Drawn);

    // Anyone can check the draw.
    let expected = hashv(&[
        &round.entropy,
        slot_hash(target).as_ref(),
        &target.to_le_bytes(),
        round_pda(DAY).as_ref(),
    ])
    .to_bytes();
    assert_eq!(round.randomness, expected);
    assert_eq!(round.draw_slot, target);
    assert_eq!(round.slot_hash, slot_hash(target).to_bytes());
    let seed = u64::from_le_bytes(expected[..8].try_into().unwrap());
    assert_eq!(round.winning_index, (seed % 5) as u32);

    assert_error(env.close(DAY), SoluckyError::RoundAlreadyDrawn);
    assert_error(env.draw(DAY), SoluckyError::RoundNotClosed);

    let winner = env.winning_ticket(DAY, round.winning_index);
    let loser_number = if winner.number == 100 { 101 } else { 100 };
    assert_error(env.claim(DAY, loser_number), SoluckyError::NotWinningTicket);

    // The prize can only go to the ticket's owner and the configured treasury.
    let stranger = Keypair::new().pubkey();
    assert_code(
        env.claim_with(DAY, winner.number, stranger, env.treasury),
        u32::from(ErrorCode::ConstraintHasOne),
    );
    assert_code(
        env.claim_with(DAY, winner.number, winner.owner, stranger),
        u32::from(ErrorCode::ConstraintAddress),
    );

    let round_before = env.balance(&round_pda(DAY));
    let winner_before = env.balance(&winner.owner);
    let treasury_before = env.balance(&env.treasury);
    assert_ok(env.claim(DAY, winner.number));

    let pot = 5 * PRICE;
    let fee = pot * u64::from(FEE_BPS) / 10_000;
    assert_eq!(env.balance(&winner.owner) - winner_before, pot - fee);
    assert_eq!(env.balance(&env.treasury) - treasury_before, fee);
    assert_eq!(round_before - env.balance(&round_pda(DAY)), pot);

    let round = env.round(DAY);
    assert_eq!(round.status, RoundStatus::Settled);
    assert_eq!(round.winner, winner.owner);
    assert_eq!(round.winning_number, winner.number);
    assert_eq!(&round.winner_country, b"JP");
    assert_eq!(round.payout, pot - fee);
    assert_eq!(round.fee, fee);

    assert_error(env.claim(DAY, winner.number), SoluckyError::RoundNotDrawn);
}

#[test]
fn tickets_can_be_closed_once_the_round_is_settled() {
    let mut env = Env::new();
    let alice = env.player();
    let bob = env.player();
    assert_ok(env.buy(&alice, DAY, 1, *b"ES"));
    assert_ok(env.buy(&bob, DAY, 2, *b"FR"));
    assert_error(
        env.close_ticket(&alice, DAY, 1),
        SoluckyError::RoundNotSettled,
    );

    let winner = env.close_and_draw(DAY);
    assert_error(
        env.close_ticket(&alice, DAY, 1),
        SoluckyError::RoundNotSettled,
    );
    assert_ok(env.claim(DAY, winner.number));

    // Only the owner can close a ticket.
    assert_code(
        env.close_ticket(&bob, DAY, 1),
        u32::from(ErrorCode::ConstraintHasOne),
    );

    let rent = env.balance(&ticket_pda(DAY, 1));
    let before = env.balance(&alice.pubkey());
    assert_ok(env.close_ticket(&alice, DAY, 1));
    assert_eq!(env.balance(&alice.pubkey()), before + rent - 5_000);
    assert!(env
        .svm
        .get_account(&ticket_pda(DAY, 1))
        .map_or(true, |a| a.lamports == 0));
}

#[test]
fn a_skipped_slot_uses_the_next_produced_one() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAY, 42, *b"ES"));
    env.end_of(DAY);
    assert_ok(env.close(DAY));
    let target = env.round(DAY).target_slot;

    // The target slot and the one after it were skipped.
    env.set_slot(target + 5, &[target + 4, target + 2, target - 1]);
    assert_ok(env.draw(DAY));
    let round = env.round(DAY);
    let expected = hashv(&[
        &round.entropy,
        slot_hash(target + 2).as_ref(),
        &(target + 2).to_le_bytes(),
        round_pda(DAY).as_ref(),
    ])
    .to_bytes();
    assert_eq!(round.randomness, expected);
    assert_eq!(round.draw_slot, target + 2);
    assert_eq!(round.winning_index, 0);
}

#[test]
fn an_expired_slot_can_be_pinned_again() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAY, 42, *b"ES"));
    env.end_of(DAY);
    assert_ok(env.close(DAY));
    let target = env.round(DAY).target_slot;

    // Nobody drew in time: the sysvar no longer reaches the pinned slot.
    let now = target + DRAW_WINDOW_SLOTS + 1;
    env.set_slot(now, &[now - 1, now - 2]);
    assert_error(env.draw(DAY), SoluckyError::RandomnessUnavailable);

    assert_ok(env.close(DAY));
    let round = env.round(DAY);
    assert_eq!(round.status, RoundStatus::Closed);
    assert_eq!(round.target_slot, now + DRAW_DELAY_SLOTS);

    let target = round.target_slot;
    env.set_slot(target + 1, &[target, target - 1]);
    assert_ok(env.draw(DAY));
    assert_ok(env.claim(DAY, 42));
}

#[test]
fn price_and_fee_changes_wait_for_the_next_round() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAY, 1, *b"ES"));

    let admin = env.admin.insecure_clone();
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            ticket_price: Some(2 * PRICE),
            fee_bps: Some(0),
            ..Default::default()
        },
    ));

    // Same day, same price.
    assert_ok(env.buy(&alice, DAY, 2, *b"ES"));
    let round = env.round(DAY);
    assert_eq!(round.pot, 2 * PRICE);
    assert_eq!(round.fee_bps, FEE_BPS);

    // The next day opens at the new price.
    env.set_time(i64::from(DAY + 1) * ROUND_DURATION + 60);
    assert_ok(env.buy(&alice, DAY + 1, 1, *b"ES"));
    let next = env.round(DAY + 1);
    assert_eq!(next.ticket_price, 2 * PRICE);
    assert_eq!(next.pot, 2 * PRICE);
    assert_eq!(next.fee_bps, 0);

    // A zero fee pays the whole pot.
    let winner = env.close_and_draw(DAY + 1);
    let before = env.balance(&alice.pubkey());
    assert_ok(env.claim(DAY + 1, winner.number));
    assert_eq!(env.balance(&alice.pubkey()) - before, 2 * PRICE);
    assert_eq!(env.round(DAY + 1).fee, 0);
}

#[test]
fn only_the_authority_can_update_the_config() {
    let mut env = Env::new();
    let stranger = env.player();
    assert_error(
        env.update(
            &stranger,
            ConfigUpdate {
                paused: Some(true),
                ..Default::default()
            },
        ),
        SoluckyError::Unauthorized,
    );

    let admin = env.admin.insecure_clone();
    assert_error(
        env.update(
            &admin,
            ConfigUpdate {
                fee_bps: Some(1_001),
                ..Default::default()
            },
        ),
        SoluckyError::FeeTooHigh,
    );
    assert_error(
        env.update(
            &admin,
            ConfigUpdate {
                ticket_price: Some(0),
                ..Default::default()
            },
        ),
        SoluckyError::InvalidTicketPrice,
    );

    // Hand over the authority.
    let next = env.player();
    let treasury = Keypair::new().pubkey();
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            authority: Some(next.pubkey()),
            treasury: Some(treasury),
            max_number: Some(99),
            ..Default::default()
        },
    ));
    let config = env.config();
    assert_eq!(config.authority, next.pubkey());
    assert_eq!(config.treasury, treasury);
    assert_eq!(config.max_number, 99);
    assert_error(
        env.update(&admin, ConfigUpdate::default()),
        SoluckyError::Unauthorized,
    );
    assert_ok(env.update(&next, ConfigUpdate::default()));
}

#[test]
fn the_treasury_can_win_too() {
    let mut env = Env::new();
    let admin = env.admin.insecure_clone();
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            treasury: Some(admin.pubkey()),
            ..Default::default()
        },
    ));
    assert_ok(env.buy(&admin, DAY, 9, NO_COUNTRY));

    let winner = env.close_and_draw(DAY);
    let before = env.balance(&admin.pubkey());
    assert_ok(env.claim(DAY, winner.number));
    assert_eq!(env.balance(&admin.pubkey()) - before, PRICE);
}
