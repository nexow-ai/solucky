//! End-to-end tests of the program on LiteSVM. Run `anchor build` first: the
//! tests load `target/deploy/solucky.so`.

// LiteSVM's failed-transaction metadata is large; it only lives in tests.
#![allow(clippy::result_large_err)]

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
        AccountDeserialize, AccountSerialize, InstructionData, Space, ToAccountMetas,
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
        accounts, error::SoluckyError, instruction, utils::guess_outcome, Config, ConfigUpdate,
        Game, Round, RoundStatus, Ticket, CONFIG_SEED, DAILY, DAY_SECONDS, DRAW_DELAY_SLOTS,
        DRAW_WINDOW_SLOTS, GAME_SEED, GUESS, HOURLY, HOUR_SECONDS, MAX_LOTTERY_TICKETS,
        MIN_TICKET_PRICE, NO_COUNTRY, ROUND_SEED, SLOT_HASHES_ID, TICKET_SEED,
    },
};

const PRICE: u64 = 100_000_000;
const FEE_BPS: u16 = 500;
const MAX_NUMBER: u32 = 21_000_000;
const DAY: u32 = 20_000;
/// The clock starts at 01:00 on `DAY`, inside this hour.
const HOUR: u32 = DAY * 24 + 1;
const START_SLOT: u64 = 1_000;
const SOL: u64 = 1_000_000_000;
const TX_FEE: u64 = 5_000;

type TxResult = Result<TransactionMetadata, FailedTransactionMetadata>;

fn config_pda() -> Pubkey {
    Pubkey::find_program_address(&[CONFIG_SEED], &solucky::ID).0
}

fn game_pda(kind: u8) -> Pubkey {
    Pubkey::find_program_address(&[GAME_SEED, &[kind]], &solucky::ID).0
}

fn round_pda(kind: u8, period: u32) -> Pubkey {
    Pubkey::find_program_address(&[ROUND_SEED, &[kind], &period.to_le_bytes()], &solucky::ID).0
}

fn ticket_pda(kind: u8, period: u32, number: u32) -> Pubkey {
    Pubkey::find_program_address(
        &[
            TICKET_SEED,
            round_pda(kind, period).as_ref(),
            &number.to_le_bytes(),
        ],
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

fn randomness(round: &Round, address: &Pubkey, slot: u64, hash: &Hash) -> [u8; 32] {
    hashv(&[
        &round.entropy,
        hash.as_ref(),
        &slot.to_le_bytes(),
        address.as_ref(),
    ])
    .to_bytes()
}

fn first_u64(bytes: &[u8; 32]) -> u64 {
    u64::from_le_bytes(bytes[..8].try_into().unwrap())
}

fn payout_of(pot: u64) -> u64 {
    pot * 8 / 10
}

fn fee_of(pot: u64, fee_bps: u16) -> u64 {
    pot * u64::from(fee_bps) / 10_000
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
    /// `(kind, period, number)` of every ticket sold, to find Guess winners.
    sold: Vec<(u8, u32, u32)>,
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
        env.set_time(i64::from(DAY) * DAY_SECONDS + HOUR_SECONDS);
        env.set_slot(START_SLOT, &[START_SLOT - 1]);
        env
    }

    /// A deployed and initialized program, with the three games open.
    fn new() -> Self {
        let mut env = Self::deployed();
        let admin = env.admin.insecure_clone();
        assert_ok(env.initialize(&admin, MAX_NUMBER));
        for kind in [DAILY, HOURLY, GUESS] {
            assert_ok(env.set_game(&admin, kind, PRICE, FEE_BPS));
        }
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

    fn crank(&mut self, instruction: Instruction) -> TxResult {
        let cranker = self.cranker.insecure_clone();
        self.send(instruction, &cranker, &[])
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

    /// Moves the clock to the end of a lottery round.
    fn end_of(&mut self, kind: u8, period: u32) {
        let seconds = if kind == DAILY {
            DAY_SECONDS
        } else {
            HOUR_SECONDS
        };
        self.set_time((i64::from(period) + 1) * seconds);
    }

    /// Moves to `slot`, with `produced` (newest first) as the recorded slots.
    fn set_slot(&mut self, slot: u64, produced: &[u64]) {
        let entries: Vec<(u64, Hash)> = produced.iter().map(|s| (*s, slot_hash(*s))).collect();
        self.set_slot_hashes(slot, &entries);
    }

    fn set_slot_hashes(&mut self, slot: u64, entries: &[(u64, Hash)]) {
        self.svm.warp_to_slot(slot);
        self.svm.set_sysvar(&SlotHashes::new(entries));
    }

    fn balance(&self, address: &Pubkey) -> u64 {
        self.svm.get_balance(address).unwrap_or(0)
    }

    fn rent(&self, address: &Pubkey) -> u64 {
        let len = self.svm.get_account(address).unwrap().data.len();
        self.svm.minimum_balance_for_rent_exemption(len)
    }

    fn fetch<T: AccountDeserialize>(&self, address: &Pubkey) -> T {
        let account = self.svm.get_account(address).expect("account exists");
        T::try_deserialize(&mut account.data.as_slice()).unwrap()
    }

    fn config(&self) -> Config {
        self.fetch(&config_pda())
    }

    fn game(&self, kind: u8) -> Game {
        self.fetch(&game_pda(kind))
    }

    fn round(&self, kind: u8, period: u32) -> Round {
        self.fetch(&round_pda(kind, period))
    }

    /// The sorted numbers stored after a lottery round.
    fn numbers(&self, kind: u8, period: u32) -> Vec<u32> {
        let account = self.svm.get_account(&round_pda(kind, period)).unwrap();
        account.data[8 + Round::INIT_SPACE..]
            .chunks(4)
            .map(|n| u32::from_le_bytes(n.try_into().unwrap()))
            .collect()
    }

    fn ticket(&self, kind: u8, period: u32, number: u32) -> Ticket {
        self.fetch(&ticket_pda(kind, period, number))
    }

    fn initialize(&mut self, authority: &Keypair, max_number: u32) -> TxResult {
        let treasury = self.treasury;
        self.send(
            ix(
                instruction::Initialize { max_number },
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

    fn set_game(&mut self, authority: &Keypair, kind: u8, price: u64, fee_bps: u16) -> TxResult {
        self.send(
            ix(
                instruction::SetGame {
                    kind,
                    ticket_price: price,
                    fee_bps,
                },
                accounts::SetGame {
                    authority: authority.pubkey(),
                    config: config_pda(),
                    game: game_pda(kind),
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

    fn set_max_number(&mut self, max_number: u32) {
        let admin = self.admin.insecure_clone();
        assert_ok(self.update(
            &admin,
            ConfigUpdate {
                max_number: Some(max_number),
                ..Default::default()
            },
        ));
    }

    fn buy(&mut self, buyer: &Keypair, kind: u8, period: u32, number: u32) -> TxResult {
        self.buy_full(buyer, kind, period, number, *b"ES", u64::MAX)
    }

    fn buy_full(
        &mut self,
        buyer: &Keypair,
        kind: u8,
        period: u32,
        number: u32,
        country: [u8; 2],
        max_price: u64,
    ) -> TxResult {
        let result = self.send(
            ix(
                instruction::BuyTicket {
                    kind,
                    period,
                    number,
                    country,
                    max_price,
                },
                accounts::BuyTicket {
                    buyer: buyer.pubkey(),
                    config: config_pda(),
                    game: game_pda(kind),
                    round: round_pda(kind, period),
                    ticket: ticket_pda(kind, period, number),
                    system_program: system_program::ID,
                },
            ),
            buyer,
            &[],
        );
        if result.is_ok() {
            self.sold.push((kind, period, number));
        }
        result
    }

    fn close(&mut self, kind: u8, period: u32) -> TxResult {
        self.crank(ix(
            instruction::CloseRound {},
            accounts::CloseRound {
                round: round_pda(kind, period),
                slot_hashes: SLOT_HASHES_ID,
            },
        ))
    }

    fn draw(&mut self, kind: u8, period: u32) -> TxResult {
        self.crank(ix(
            instruction::DrawRound {},
            accounts::DrawRound {
                round: round_pda(kind, period),
                game: game_pda(kind),
                slot_hashes: SLOT_HASHES_ID,
            },
        ))
    }

    /// Draws a closed round from a slot hash picked so that the randomness
    /// passes `wanted`: the test plays the slot leader to force an outcome.
    fn draw_where(&mut self, kind: u8, period: u32, wanted: impl Fn(u64) -> bool) -> TxResult {
        let round = self.round(kind, period);
        let target = round.target_slot;
        let hash = (0u64..)
            .map(|salt| hashv(&[b"leader", &salt.to_le_bytes()]))
            .find(|hash| {
                wanted(first_u64(&randomness(
                    &round,
                    &round_pda(kind, period),
                    target,
                    hash,
                )))
            })
            .unwrap();
        self.set_slot_hashes(target + 1, &[(target, hash)]);
        self.draw(kind, period)
    }

    fn claim_with(&mut self, kind: u8, period: u32, number: u32, owner: Pubkey) -> TxResult {
        self.crank(ix(
            instruction::ClaimPrize {},
            accounts::ClaimPrize {
                round: round_pda(kind, period),
                ticket: ticket_pda(kind, period, number),
                owner,
            },
        ))
    }

    fn claim(&mut self, kind: u8, period: u32, number: u32) -> TxResult {
        let owner = self.ticket(kind, period, number).owner;
        self.claim_with(kind, period, number, owner)
    }

    fn collect_to(&mut self, kind: u8, period: u32, treasury: Pubkey) -> TxResult {
        self.crank(ix(
            instruction::CollectFee {},
            accounts::CollectFee {
                config: config_pda(),
                round: round_pda(kind, period),
                treasury,
            },
        ))
    }

    fn collect(&mut self, kind: u8, period: u32) -> TxResult {
        let treasury = self.config().treasury;
        self.collect_to(kind, period, treasury)
    }

    fn close_ticket(&mut self, owner: &Keypair, kind: u8, period: u32, number: u32) -> TxResult {
        self.send(
            ix(
                instruction::CloseTicket {},
                accounts::CloseTicket {
                    owner: owner.pubkey(),
                    round: round_pda(kind, period),
                    ticket: ticket_pda(kind, period, number),
                },
            ),
            owner,
            &[],
        )
    }

    /// Closes a lottery round and draws it from the pinned slot. Returns the
    /// winning ticket.
    fn close_and_draw(&mut self, kind: u8, period: u32) -> Ticket {
        self.end_of(kind, period);
        assert_ok(self.close(kind, period));
        let target = self.round(kind, period).target_slot;
        self.set_slot(target + 1, &[target, target - 1]);
        assert_ok(self.draw(kind, period));
        self.winning_ticket(kind, period)
    }

    fn winning_ticket(&self, kind: u8, period: u32) -> Ticket {
        let round = self.round(kind, period);
        if round.is_lottery() {
            return self.ticket(kind, period, round.winning_number);
        }
        self.sold
            .iter()
            .filter(|(k, p, _)| (*k, *p) == (kind, period))
            .map(|(_, _, number)| self.ticket(kind, period, *number))
            .find(|ticket| ticket.index == round.winning_index)
            .expect("the winning ticket exists")
    }
}

#[test]
fn initialize_is_reserved_to_the_upgrade_authority() {
    let mut env = Env::deployed();
    let stranger = env.player();
    assert_error(
        env.initialize(&stranger, MAX_NUMBER),
        SoluckyError::Unauthorized,
    );

    let admin = env.admin.insecure_clone();
    assert_error(env.initialize(&admin, 0), SoluckyError::InvalidMaxNumber);
    assert_ok(env.initialize(&admin, MAX_NUMBER));
    let config = env.config();
    assert_eq!(config.authority, admin.pubkey());
    assert_eq!(config.treasury, env.treasury);
    assert_eq!(config.max_number, MAX_NUMBER);
    assert!(!config.paused);

    // The config can only be created once.
    assert!(env.initialize(&admin, MAX_NUMBER).is_err());
}

#[test]
fn games_are_set_by_the_authority() {
    let mut env = Env::deployed();
    let admin = env.admin.insecure_clone();
    assert_ok(env.initialize(&admin, MAX_NUMBER));

    let stranger = env.player();
    assert_error(
        env.set_game(&stranger, DAILY, PRICE, FEE_BPS),
        SoluckyError::Unauthorized,
    );
    assert_error(
        env.set_game(&admin, DAILY, PRICE, 2_001),
        SoluckyError::FeeTooHigh,
    );
    assert_error(
        env.set_game(&admin, DAILY, MIN_TICKET_PRICE - 1, FEE_BPS),
        SoluckyError::InvalidTicketPrice,
    );
    assert_error(
        env.set_game(&admin, GUESS + 1, PRICE, FEE_BPS),
        SoluckyError::InvalidGame,
    );

    assert_ok(env.set_game(&admin, HOURLY, MIN_TICKET_PRICE, 2_000));
    let game = env.game(HOURLY);
    assert_eq!(game.kind, HOURLY);
    assert_eq!(game.ticket_price, MIN_TICKET_PRICE);
    assert_eq!(game.fee_bps, 2_000);
    assert_eq!(game.carry, 0);

    // A game that is not open sells nothing.
    let alice = env.player();
    assert_code(
        env.buy(&alice, DAILY, DAY, 1),
        u32::from(ErrorCode::AccountNotInitialized),
    );
    assert_ok(env.buy(&alice, HOURLY, HOUR, 1));
}

#[test]
fn buying_tickets_fills_the_pot_and_sorts_the_numbers() {
    let mut env = Env::new();
    let alice = env.player();
    let bob = env.player();
    let before = env.balance(&alice.pubkey());

    assert_ok(env.buy(&alice, DAILY, DAY, 7));
    let round = env.round(DAILY, DAY);
    assert_eq!((round.kind, round.period), (DAILY, DAY));
    assert_eq!(round.status, RoundStatus::Open);
    assert_eq!(round.ticket_price, PRICE);
    assert_eq!(round.fee_bps, FEE_BPS);
    assert_eq!(round.max_number, MAX_NUMBER);
    assert_eq!(round.ticket_count, 1);
    assert_eq!(round.pot, PRICE);

    let ticket = env.ticket(DAILY, DAY, 7);
    assert_eq!(ticket.round, round_pda(DAILY, DAY));
    assert_eq!(ticket.owner, alice.pubkey());
    assert_eq!((ticket.number, ticket.index), (7, 0));
    assert_eq!(&ticket.country, b"ES");

    // Alice paid the ticket, the rent of both accounts and the network fee;
    // the round holds exactly its rent and the pot.
    let round_rent = env.rent(&round_pda(DAILY, DAY));
    let ticket_rent = env.balance(&ticket_pda(DAILY, DAY, 7));
    assert_eq!(env.balance(&round_pda(DAILY, DAY)), round_rent + PRICE);
    assert_eq!(
        before - env.balance(&alice.pubkey()),
        PRICE + round_rent + ticket_rent + TX_FEE
    );

    // A number is sold once per round.
    assert_code(env.buy(&bob, DAILY, DAY, 7), 0);
    // The same number in another game is another ticket.
    assert_ok(env.buy(&bob, HOURLY, HOUR, 7));

    for number in [MAX_NUMBER, 0, 3, 8] {
        assert_ok(env.buy(&bob, DAILY, DAY, number));
    }
    let round = env.round(DAILY, DAY);
    assert_eq!(round.ticket_count, 5);
    assert_eq!(round.pot, 5 * PRICE);
    assert_eq!(env.ticket(DAILY, DAY, MAX_NUMBER).index, 1);
    assert_eq!(env.numbers(DAILY, DAY), [0, 3, 7, 8, MAX_NUMBER]);
    assert_eq!(
        env.balance(&round_pda(DAILY, DAY)),
        env.rent(&round_pda(DAILY, DAY)) + 5 * PRICE
    );
}

#[test]
fn tickets_are_validated() {
    let mut env = Env::new();
    let carol = env.player();
    assert_error(env.buy(&carol, DAILY, DAY + 1, 1), SoluckyError::WrongRound);
    assert_error(env.buy(&carol, DAILY, DAY - 1, 1), SoluckyError::WrongRound);
    assert_error(
        env.buy(&carol, HOURLY, HOUR + 1, 1),
        SoluckyError::WrongRound,
    );
    assert_error(env.buy(&carol, GUESS, 1, 1), SoluckyError::WrongRound);
    assert_error(
        env.buy(&carol, DAILY, DAY, MAX_NUMBER + 1),
        SoluckyError::NumberOutOfRange,
    );
    assert_error(
        env.buy_full(&carol, DAILY, DAY, 1, *b"es", u64::MAX),
        SoluckyError::InvalidCountry,
    );
    assert_error(
        env.buy_full(&carol, DAILY, DAY, 1, [b'E', 0], u64::MAX),
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
    assert_error(env.buy(&carol, GUESS, 0, 1), SoluckyError::Paused);
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            paused: Some(false),
            ..Default::default()
        },
    ));
    assert_ok(env.buy_full(&carol, DAILY, DAY, 1, NO_COUNTRY, u64::MAX));
}

#[test]
fn the_closest_number_wins_80_percent() {
    let mut env = Env::new();
    let players: Vec<Keypair> = (0..5).map(|_| env.player()).collect();
    let numbers = [1_000, 5_000_000, 10_000_000, 15_000_000, 20_000_000];
    for (player, number) in players.iter().zip(numbers) {
        assert_ok(env.buy(player, DAILY, DAY, number));
    }

    // Too early.
    assert_error(env.close(DAILY, DAY), SoluckyError::RoundNotOver);
    assert_error(env.draw(DAILY, DAY), SoluckyError::RoundNotClosed);

    env.end_of(DAILY, DAY);
    assert_ok(env.close(DAILY, DAY));
    let round = env.round(DAILY, DAY);
    assert_eq!(round.status, RoundStatus::Closed);
    assert_eq!(round.target_slot, START_SLOT + DRAW_DELAY_SLOTS);
    // No more tickets for a closed day, and no second pin.
    assert_error(
        env.buy(&players[0], DAILY, DAY, 1),
        SoluckyError::WrongRound,
    );
    assert_error(env.close(DAILY, DAY), SoluckyError::DrawStillPossible);

    // The pinned slot has not been produced yet.
    let target = round.target_slot;
    env.set_slot(target, &[target - 1]);
    assert_error(env.draw(DAILY, DAY), SoluckyError::TargetSlotNotReached);

    env.set_slot(target + 2, &[target + 1, target, target - 1]);
    assert_ok(env.draw(DAILY, DAY));
    let round = env.round(DAILY, DAY);
    assert_eq!(round.status, RoundStatus::Drawn);

    // Anyone can check the draw.
    let expected = randomness(&round, &round_pda(DAILY, DAY), target, &slot_hash(target));
    assert_eq!(round.randomness, expected);
    assert_eq!(round.draw_slot, target);
    assert_eq!(round.slot_hash, slot_hash(target).to_bytes());
    let drawn = (first_u64(&expected) % (u64::from(MAX_NUMBER) + 1)) as u32;
    assert_eq!(round.drawn_number, drawn);
    let closest = *numbers
        .iter()
        .min_by_key(|n| (n.abs_diff(drawn), **n))
        .unwrap();
    assert_eq!(round.winning_number, closest);

    let pot = 5 * PRICE;
    let fee = fee_of(pot, FEE_BPS);
    let carry = pot - payout_of(pot) - fee;
    assert_eq!(round.payout, payout_of(pot));
    assert_eq!(round.fee, fee);
    // 80% to the winner, 5% to the house, 15% to the next round.
    assert_eq!(carry, pot * 15 / 100);
    assert_eq!(env.game(DAILY).carry, carry);
    assert_eq!(
        env.balance(&game_pda(DAILY)),
        env.rent(&game_pda(DAILY)) + carry
    );

    assert_error(env.close(DAILY, DAY), SoluckyError::RoundAlreadyDrawn);
    assert_error(env.draw(DAILY, DAY), SoluckyError::RoundNotClosed);

    let winner = env.winning_ticket(DAILY, DAY);
    let loser = *numbers.iter().find(|n| **n != closest).unwrap();
    assert_error(env.claim(DAILY, DAY, loser), SoluckyError::NotWinningTicket);

    // The prize can only go to the ticket's owner.
    let stranger = Keypair::new().pubkey();
    assert_code(
        env.claim_with(DAILY, DAY, winner.number, stranger),
        u32::from(ErrorCode::ConstraintHasOne),
    );
    assert_error(env.collect(DAILY, DAY), SoluckyError::RoundNotSettled);

    let winner_before = env.balance(&winner.owner);
    let treasury_before = env.balance(&env.treasury);
    assert_ok(env.claim(DAILY, DAY, winner.number));
    assert_eq!(env.balance(&winner.owner) - winner_before, payout_of(pot));
    assert_eq!(env.balance(&env.treasury), treasury_before);

    let round = env.round(DAILY, DAY);
    assert_eq!(round.status, RoundStatus::Settled);
    assert_eq!(round.winner, winner.owner);
    assert_eq!(round.winning_index, winner.index);
    assert_eq!(&round.winner_country, b"ES");
    assert!(!round.fee_collected);
    assert_error(
        env.claim(DAILY, DAY, winner.number),
        SoluckyError::RoundNotDrawn,
    );

    // The fee can only go to the configured treasury, once, and the round
    // keeps exactly its rent.
    assert_code(
        env.collect_to(DAILY, DAY, stranger),
        u32::from(ErrorCode::ConstraintAddress),
    );
    assert_ok(env.collect(DAILY, DAY));
    assert_eq!(env.balance(&env.treasury) - treasury_before, fee);
    assert_eq!(
        env.balance(&round_pda(DAILY, DAY)),
        env.rent(&round_pda(DAILY, DAY))
    );
    assert!(env.round(DAILY, DAY).fee_collected);
    assert_error(env.collect(DAILY, DAY), SoluckyError::FeeAlreadyCollected);
}

#[test]
fn ties_go_to_the_lower_number() {
    let mut env = Env::new();
    // A small range keeps the search for a fitting slot hash short.
    env.set_max_number(400);
    let alice = env.player();
    let bob = env.player();
    assert_ok(env.buy(&bob, DAILY, DAY, 300));
    assert_ok(env.buy(&alice, DAILY, DAY, 100));
    env.end_of(DAILY, DAY);
    assert_ok(env.close(DAILY, DAY));
    assert_ok(env.draw_where(DAILY, DAY, |x| x % 401 == 200));
    let round = env.round(DAILY, DAY);
    assert_eq!(round.drawn_number, 200);
    assert_eq!(round.winning_number, 100);
    assert_eq!(env.winning_ticket(DAILY, DAY).owner, alice.pubkey());
}

#[test]
fn the_carry_joins_the_next_round_of_the_same_game() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 1));
    assert_ok(env.buy(&alice, DAILY, DAY, 2));
    assert_ok(env.buy(&alice, HOURLY, HOUR, 1));
    let first = 2 * PRICE;
    let carry = first - payout_of(first) - fee_of(first, FEE_BPS);

    // The draw sets the carry aside; the claim does not touch it.
    env.close_and_draw(DAILY, DAY);
    assert_eq!(env.game(DAILY).carry, carry);
    assert_ok(env.claim(DAILY, DAY, env.round(DAILY, DAY).winning_number));
    assert_eq!(env.game(DAILY).carry, carry);
    // Each game keeps its own.
    assert_eq!(env.game(HOURLY).carry, 0);

    assert_ok(env.buy(&alice, DAILY, DAY + 1, 9));
    assert_eq!(env.round(DAILY, DAY + 1).pot, PRICE);
    let winner = env.close_and_draw(DAILY, DAY + 1);
    let pot = PRICE + carry;
    let round = env.round(DAILY, DAY + 1);
    assert_eq!(round.pot, pot);
    assert_eq!(round.payout, payout_of(pot));
    assert_eq!(
        env.game(DAILY).carry,
        pot - payout_of(pot) - fee_of(pot, FEE_BPS)
    );

    let before = env.balance(&alice.pubkey());
    assert_ok(env.claim(DAILY, DAY + 1, winner.number));
    assert_eq!(env.balance(&alice.pubkey()) - before, payout_of(pot));
    assert_ok(env.collect(DAILY, DAY + 1));
    assert_eq!(
        env.balance(&round_pda(DAILY, DAY + 1)),
        env.rent(&round_pda(DAILY, DAY + 1))
    );
    assert_eq!(
        env.balance(&game_pda(DAILY)),
        env.rent(&game_pda(DAILY)) + env.game(DAILY).carry
    );
}

#[test]
fn hourly_rounds_follow_the_hour() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, HOURLY, HOUR, 5));
    assert_ok(env.buy(&alice, DAILY, DAY, 5));

    env.end_of(HOURLY, HOUR);
    assert_error(env.buy(&alice, HOURLY, HOUR, 6), SoluckyError::WrongRound);
    assert_ok(env.buy(&alice, HOURLY, HOUR + 1, 6));
    // The day is not over yet.
    assert_error(env.close(DAILY, DAY), SoluckyError::RoundNotOver);

    let winner = env.close_and_draw(HOURLY, HOUR);
    assert_eq!(winner.number, 5);
    assert_ok(env.claim(HOURLY, HOUR, 5));
    assert_ok(env.collect(HOURLY, HOUR));
}

#[test]
fn guesses_are_checked_in_batches_until_one_finds_the_number() {
    let mut env = Env::new();
    // Numbers 0 to 9, so the test can find slot hashes for a miss and a hit.
    let max = 9;
    env.set_max_number(max);
    let alice = env.player();
    let bob = env.player();
    let carol = env.player();
    assert_ok(env.buy(&alice, GUESS, 0, 5));
    assert_ok(env.buy(&bob, GUESS, 0, 6));
    assert_eq!(env.round(GUESS, 0).ends_at(), None);

    // Seal the first two guesses.
    assert_ok(env.close(GUESS, 0));
    let round = env.round(GUESS, 0);
    assert_eq!(round.status, RoundStatus::Closed);
    assert_eq!((round.checked, round.sealed_count), (0, 2));

    // Sales go on while the batch waits, without touching its entropy.
    assert_ok(env.buy(&carol, GUESS, 0, 7));
    let after = env.round(GUESS, 0);
    assert_eq!(after.ticket_count, 3);
    assert_eq!(after.entropy, round.entropy);
    assert_eq!(after.sealed_count, 2);

    // A miss: those two numbers are out, the round goes on.
    assert_ok(env.draw_where(GUESS, 0, |x| guess_outcome(x, 0, 2, max).is_none()));
    let round = env.round(GUESS, 0);
    assert_eq!(round.status, RoundStatus::Open);
    assert_eq!(round.checked, 2);
    assert_eq!(env.game(GUESS).current_round, 0);
    assert_eq!(env.game(GUESS).carry, 0);
    assert_error(env.draw(GUESS, 0), SoluckyError::RoundNotClosed);

    // Carol's guess is next. A hit, with odds 1 in 8.
    assert_ok(env.close(GUESS, 0));
    assert_eq!(env.round(GUESS, 0).sealed_count, 3);
    assert_ok(env.draw_where(GUESS, 0, |x| x % 8 == 0));
    let round = env.round(GUESS, 0);
    assert_eq!(round.status, RoundStatus::Drawn);
    assert_eq!(round.winning_index, 2);
    let pot = 3 * PRICE;
    assert_eq!(round.payout, payout_of(pot));
    assert_eq!(
        env.game(GUESS).carry,
        pot - payout_of(pot) - fee_of(pot, FEE_BPS)
    );

    // The next round is on sale at once.
    assert_eq!(env.game(GUESS).current_round, 1);
    assert_error(env.buy(&alice, GUESS, 0, 8), SoluckyError::WrongRound);
    assert_ok(env.buy(&alice, GUESS, 1, 7));

    assert_error(env.claim(GUESS, 0, 5), SoluckyError::NotWinningTicket);
    let before = env.balance(&carol.pubkey());
    assert_ok(env.claim(GUESS, 0, 7));
    assert_eq!(env.balance(&carol.pubkey()) - before, payout_of(pot));
    let round = env.round(GUESS, 0);
    assert_eq!(round.winner, carol.pubkey());
    assert_eq!(round.winning_number, 7);
    assert_ok(env.collect(GUESS, 0));
    assert_eq!(
        env.balance(&round_pda(GUESS, 0)),
        env.rent(&round_pda(GUESS, 0))
    );
}

#[test]
fn a_guess_check_cannot_be_gamed() {
    let mut env = Env::new();
    let alice = env.player();
    let bob = env.player();
    assert_code(
        env.close(GUESS, 0),
        u32::from(ErrorCode::AccountNotInitialized),
    );
    assert_ok(env.buy(&alice, GUESS, 0, 5));
    assert_ok(env.close(GUESS, 0));
    let target = env.round(GUESS, 0).target_slot;

    // Once the pinned slot's hash is out, the result is known: no more sales
    // until the draw lands.
    env.set_slot(target, &[target - 1]);
    assert_ok(env.buy(&bob, GUESS, 0, 6));
    env.set_slot(target + 1, &[target]);
    assert_error(env.buy(&bob, GUESS, 0, 9), SoluckyError::BatchSealed);

    // A pinned slot that expired is replaced, but the batch stays the same:
    // Bob's guess does not join it.
    let now = target + DRAW_WINDOW_SLOTS + 1;
    env.set_slot(now, &[now - 1, now - 2]);
    assert_error(env.draw(GUESS, 0), SoluckyError::RandomnessUnavailable);
    assert_ok(env.close(GUESS, 0));
    let round = env.round(GUESS, 0);
    assert_eq!(round.target_slot, now + DRAW_DELAY_SLOTS);
    assert_eq!((round.checked, round.sealed_count), (0, 1));

    assert_ok(env.draw_where(GUESS, 0, |x| guess_outcome(x, 0, 1, MAX_NUMBER).is_none()));
    assert_eq!(env.round(GUESS, 0).checked, 1);
    // Bob's guess is checked next; then there is nothing left to check.
    assert_ok(env.close(GUESS, 0));
    assert_ok(env.draw_where(GUESS, 0, |x| guess_outcome(x, 1, 2, MAX_NUMBER).is_none()));
    assert_error(env.close(GUESS, 0), SoluckyError::NothingToCheck);
}

#[test]
fn the_number_range_is_fixed_when_a_round_opens() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 1));

    env.set_max_number(1);
    // The open round keeps its range; new rounds get the new one.
    assert_ok(env.buy(&alice, DAILY, DAY, 99));
    assert_error(
        env.buy(&alice, HOURLY, HOUR, 2),
        SoluckyError::NumberOutOfRange,
    );

    // With every number of a Guess round tried, the check must hit.
    assert_ok(env.buy(&alice, GUESS, 0, 0));
    assert_ok(env.buy(&alice, GUESS, 0, 1));
    assert_error(env.buy(&alice, GUESS, 0, 2), SoluckyError::NumberOutOfRange);
    assert_ok(env.close(GUESS, 0));
    let target = env.round(GUESS, 0).target_slot;
    env.set_slot(target + 1, &[target]);
    assert_ok(env.draw(GUESS, 0));
    assert_eq!(env.round(GUESS, 0).status, RoundStatus::Drawn);
}

#[test]
fn tickets_can_be_closed_once_the_round_is_settled() {
    let mut env = Env::new();
    let alice = env.player();
    let bob = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 1));
    assert_ok(env.buy(&bob, DAILY, DAY, 2));
    assert_error(
        env.close_ticket(&alice, DAILY, DAY, 1),
        SoluckyError::RoundNotSettled,
    );

    let winner = env.close_and_draw(DAILY, DAY);
    assert_error(
        env.close_ticket(&alice, DAILY, DAY, 1),
        SoluckyError::RoundNotSettled,
    );
    assert_ok(env.claim(DAILY, DAY, winner.number));

    // Only the owner can close a ticket.
    assert_code(
        env.close_ticket(&bob, DAILY, DAY, 1),
        u32::from(ErrorCode::ConstraintHasOne),
    );

    let rent = env.balance(&ticket_pda(DAILY, DAY, 1));
    let before = env.balance(&alice.pubkey());
    assert_ok(env.close_ticket(&alice, DAILY, DAY, 1));
    assert_eq!(env.balance(&alice.pubkey()), before + rent - TX_FEE);
    assert!(env
        .svm
        .get_account(&ticket_pda(DAILY, DAY, 1))
        .is_none_or(|a| a.lamports == 0));
}

#[test]
fn a_skipped_slot_uses_the_next_produced_one() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 42));
    env.end_of(DAILY, DAY);
    assert_ok(env.close(DAILY, DAY));
    let target = env.round(DAILY, DAY).target_slot;

    // The target slot and the one after it were skipped.
    env.set_slot(target + 5, &[target + 4, target + 2, target - 1]);
    assert_ok(env.draw(DAILY, DAY));
    let round = env.round(DAILY, DAY);
    let expected = randomness(
        &round,
        &round_pda(DAILY, DAY),
        target + 2,
        &slot_hash(target + 2),
    );
    assert_eq!(round.randomness, expected);
    assert_eq!(round.draw_slot, target + 2);
    assert_eq!(round.winning_number, 42);
}

#[test]
fn an_expired_slot_can_be_pinned_again() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 42));
    env.end_of(DAILY, DAY);
    assert_ok(env.close(DAILY, DAY));
    let target = env.round(DAILY, DAY).target_slot;

    // Nobody drew in time: the sysvar no longer reaches the pinned slot.
    let now = target + DRAW_WINDOW_SLOTS + 1;
    env.set_slot(now, &[now - 1, now - 2]);
    assert_error(env.draw(DAILY, DAY), SoluckyError::RandomnessUnavailable);

    assert_ok(env.close(DAILY, DAY));
    let round = env.round(DAILY, DAY);
    assert_eq!(round.status, RoundStatus::Closed);
    assert_eq!(round.target_slot, now + DRAW_DELAY_SLOTS);

    let target = round.target_slot;
    env.set_slot(target + 1, &[target, target - 1]);
    assert_ok(env.draw(DAILY, DAY));
    assert_ok(env.claim(DAILY, DAY, 42));
}

#[test]
fn a_readable_slot_cannot_be_pinned_again() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 42));
    env.end_of(DAILY, DAY);
    assert_ok(env.close(DAILY, DAY));
    let target = env.round(DAILY, DAY).target_slot;

    // Past the nominal window, but SlotHashes still holds the pinned slot:
    // its result is known, so it must be drawn, not replaced.
    let now = target + DRAW_WINDOW_SLOTS + 11;
    env.set_slot(now, &[now - 1, target]);
    assert_error(env.close(DAILY, DAY), SoluckyError::DrawStillPossible);
    assert_ok(env.draw(DAILY, DAY));
}

#[test]
fn price_and_fee_changes_wait_for_the_next_round() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 1));

    let admin = env.admin.insecure_clone();
    assert_ok(env.set_game(&admin, DAILY, 2 * PRICE, 0));

    // Same day, same price.
    assert_ok(env.buy(&alice, DAILY, DAY, 2));
    let round = env.round(DAILY, DAY);
    assert_eq!(round.pot, 2 * PRICE);
    assert_eq!(round.fee_bps, FEE_BPS);

    // The next day opens at the new price.
    env.set_time(i64::from(DAY + 1) * DAY_SECONDS + 60);
    assert_ok(env.buy(&alice, DAILY, DAY + 1, 1));
    let next = env.round(DAILY, DAY + 1);
    assert_eq!(next.ticket_price, 2 * PRICE);
    assert_eq!(next.pot, 2 * PRICE);
    assert_eq!(next.fee_bps, 0);
    // Other games keep their own price.
    assert_ok(env.buy(&alice, GUESS, 0, 1));
    assert_eq!(env.round(GUESS, 0).ticket_price, PRICE);

    // A zero fee leaves nothing to collect: the whole 20% carries over.
    let winner = env.close_and_draw(DAILY, DAY + 1);
    let before = env.balance(&alice.pubkey());
    assert_ok(env.claim(DAILY, DAY + 1, winner.number));
    assert_eq!(env.balance(&alice.pubkey()) - before, payout_of(2 * PRICE));
    let round = env.round(DAILY, DAY + 1);
    assert_eq!(round.fee, 0);
    assert!(round.fee_collected);
    assert_eq!(env.game(DAILY).carry, 2 * PRICE / 5);
    assert_error(
        env.collect(DAILY, DAY + 1),
        SoluckyError::FeeAlreadyCollected,
    );
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
                max_number: Some(0),
                ..Default::default()
            },
        ),
        SoluckyError::InvalidMaxNumber,
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
    assert_error(
        env.set_game(&admin, DAILY, PRICE, FEE_BPS),
        SoluckyError::Unauthorized,
    );
    assert_ok(env.update(&next, ConfigUpdate::default()));
    assert_ok(env.set_game(&next, DAILY, PRICE, FEE_BPS));
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
    assert_ok(env.buy_full(&admin, DAILY, DAY, 9, NO_COUNTRY, u64::MAX));

    let winner = env.close_and_draw(DAILY, DAY);
    let before = env.balance(&admin.pubkey());
    assert_ok(env.claim(DAILY, DAY, winner.number));
    assert_ok(env.collect(DAILY, DAY));
    assert_eq!(
        env.balance(&admin.pubkey()) - before,
        payout_of(PRICE) + fee_of(PRICE, FEE_BPS)
    );
}

#[test]
fn buyers_never_pay_more_than_they_accepted() {
    let mut env = Env::new();
    let alice = env.player();
    let admin = env.admin.insecure_clone();
    // The price goes up before the round's first ticket opens it.
    assert_ok(env.set_game(&admin, HOURLY, 3 * PRICE, FEE_BPS));
    assert_error(
        env.buy_full(&alice, HOURLY, HOUR, 1, *b"ES", PRICE),
        SoluckyError::PriceChanged,
    );
    assert_ok(env.buy_full(&alice, HOURLY, HOUR, 1, *b"ES", 3 * PRICE));
    assert_eq!(env.round(HOURLY, HOUR).pot, 3 * PRICE);
}

#[test]
fn a_bad_treasury_never_blocks_the_winner() {
    let mut env = Env::new();
    let alice = env.player();
    let admin = env.admin.insecure_clone();
    assert_ok(env.buy(&alice, DAILY, DAY, 7));

    // A treasury that can never be written to, such as a sysvar.
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            treasury: Some(SLOT_HASHES_ID),
            ..Default::default()
        },
    ));
    let winner = env.close_and_draw(DAILY, DAY);
    let before = env.balance(&alice.pubkey());
    assert_ok(env.claim(DAILY, DAY, winner.number));
    assert_eq!(env.balance(&alice.pubkey()) - before, payout_of(PRICE));

    // Only the fee waits, until the authority fixes the treasury.
    assert!(env.collect(DAILY, DAY).is_err());
    let treasury = env.treasury;
    assert_ok(env.update(
        &admin,
        ConfigUpdate {
            treasury: Some(treasury),
            ..Default::default()
        },
    ));
    let treasury_before = env.balance(&treasury);
    assert_ok(env.collect(DAILY, DAY));
    assert_eq!(
        env.balance(&treasury) - treasury_before,
        fee_of(PRICE, FEE_BPS)
    );
}

#[test]
fn a_full_lottery_round_stays_cheap_and_refuses_more_tickets() {
    let mut env = Env::new();
    let alice = env.player();
    assert_ok(env.buy(&alice, DAILY, DAY, 0));

    // Fill the round up to one ticket short of the cap with the even numbers
    // (the ticket accounts themselves do not matter to the round).
    let address = round_pda(DAILY, DAY);
    let mut account = env.svm.get_account(&address).unwrap();
    let mut round = env.round(DAILY, DAY);
    round.ticket_count = MAX_LOTTERY_TICKETS - 1;
    round.pot = u64::from(round.ticket_count) * PRICE;
    account.data.truncate(8 + Round::INIT_SPACE);
    round
        .try_serialize(&mut account.data.as_mut_slice())
        .unwrap();
    account
        .data
        .extend((0..round.ticket_count).flat_map(|i| (2 * i).to_le_bytes()));
    account.lamports = env
        .svm
        .minimum_balance_for_rent_exemption(account.data.len())
        + round.pot;
    env.svm.set_account(address, account).unwrap();

    // Number 1 goes second: almost the whole list moves.
    let meta = assert_ok(env.buy(&alice, DAILY, DAY, 1));
    println!(
        "buy into a full lottery round: {} CU",
        meta.compute_units_consumed
    );
    assert!(meta.compute_units_consumed < 150_000);
    assert_eq!(&env.numbers(DAILY, DAY)[..3], [0, 1, 2]);
    assert_eq!(
        env.balance(&address),
        env.rent(&address) + u64::from(MAX_LOTTERY_TICKETS) * PRICE
    );

    assert_error(env.buy(&alice, DAILY, DAY, 3), SoluckyError::RoundFull);
}
