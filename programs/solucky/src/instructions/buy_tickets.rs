use anchor_lang::{
    prelude::*,
    system_program::{
        allocate, assign, create_account, transfer, Allocate, Assign, CreateAccount, Transfer,
    },
};
use solana_sha256_hasher::hashv;

use crate::{
    constants::{CONFIG_SEED, GAME_SEED, MAX_LOTTERY_TICKETS, ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    events::TicketPurchased,
    instructions::buy_ticket::prepare_round,
    state::{Config, Game, Round, RoundStatus, Session, Ticket},
    utils::{insert_many_sorted, is_valid_country},
};

/// The ticket accounts follow these, one per number and in the same order,
/// as remaining accounts.
#[derive(Accounts)]
#[instruction(kind: u8, period: u32)]
pub struct BuyTickets<'info> {
    /// Pays the network fee and opens the round if needed. Without a session
    /// it pays for the tickets and owns them.
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// A quick-buy session whose key is `buyer`: the tickets are paid from it
    /// and belong to its owner.
    #[account(
        mut,
        constraint = session.delegate == buyer.key() @ SoluckyError::NotSessionKey
    )]
    pub session: Option<Account<'info, Session>>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(seeds = [GAME_SEED, &kind.to_le_bytes()], bump = game.bump)]
    pub game: Account<'info, Game>,
    /// See `BuyTicket::round`.
    #[account(
        init_if_needed,
        payer = buyer,
        space = (8 + Round::INIT_SPACE).max(round.data_len()),
        seeds = [ROUND_SEED, &kind.to_le_bytes(), &period.to_le_bytes()],
        bump
    )]
    pub round: Account<'info, Round>,
    pub system_program: Program<'info, System>,
}

pub fn handle_buy_tickets<'info>(
    ctx: Context<'info, BuyTickets<'info>>,
    kind: u8,
    period: u32,
    numbers: Vec<u32>,
    country: [u8; 2],
    max_price: u64,
) -> Result<()> {
    let tickets = ctx.remaining_accounts;
    require!(
        !numbers.is_empty() && numbers.len() == tickets.len(),
        SoluckyError::TicketsMismatch
    );
    require!(is_valid_country(&country), SoluckyError::InvalidCountry);
    let clock = Clock::get()?;
    let program_id = ctx.program_id;
    let accounts = &mut *ctx.accounts;
    let session = accounts.session.as_ref();
    if let Some(session) = session {
        require!(
            clock.unix_timestamp < session.expires_at,
            SoluckyError::SessionExpired
        );
    }
    let owner = session.map_or(accounts.buyer.key(), |session| session.owner);

    let opened = prepare_round(
        &mut accounts.round,
        &accounts.config,
        &accounts.game,
        kind,
        period,
        ctx.bumps.round,
        &clock,
    )?;
    let round = &mut accounts.round;
    let round_key = round.key();
    let round_info = round.to_account_info();
    let buyer_info = accounts.buyer.to_account_info();
    let price = round.ticket_price;
    // The first ticket opens the round at the game's price; the buyer never
    // pays more than the price they were shown.
    require!(price <= max_price, SoluckyError::PriceChanged);
    let lottery = round.is_lottery();

    let rent = Rent::get()?;
    let space = 8 + Ticket::INIT_SPACE;
    let ticket_rent = rent.minimum_balance(space);
    let mut bought: Vec<u32> = Vec::with_capacity(numbers.len());
    // With a session, what each new ticket still needs for its rent. The
    // session pays it once every ticket exists: lamports moved by hand
    // before a system call would unbalance that call.
    let mut unfunded: Vec<(&AccountInfo<'info>, u64)> = Vec::new();

    for (&number, info) in numbers.iter().zip(tickets) {
        require!(number <= round.max_number, SoluckyError::NumberOutOfRange);
        let number_bytes = number.to_le_bytes();
        let (address, bump) = Pubkey::find_program_address(
            &[TICKET_SEED, round_key.as_ref(), &number_bytes],
            program_id,
        );
        require_keys_eq!(*info.key, address, SoluckyError::WrongTicketAccount);
        // Someone holds the number already, or it is listed twice: the rest
        // of the batch goes ahead without it.
        if info.owner == program_id {
            continue;
        }
        let index = round.ticket_count;
        require!(
            !lottery || index < MAX_LOTTERY_TICKETS,
            SoluckyError::RoundFull
        );

        let seeds: &[&[u8]] = &[TICKET_SEED, round_key.as_ref(), &number_bytes, &[bump]];
        let shortfall = ticket_rent.saturating_sub(info.lamports());
        if session.is_none() && shortfall == ticket_rent {
            create_account(
                CpiContext::new_with_signer(
                    System::id(),
                    CreateAccount {
                        from: buyer_info.clone(),
                        to: info.clone(),
                    },
                    &[seeds],
                ),
                ticket_rent,
                space as u64,
                program_id,
            )?;
        } else {
            // Someone sent lamports to the address first, or a session pays.
            if session.is_some() {
                unfunded.push((info, shortfall));
            } else if shortfall > 0 {
                transfer(
                    CpiContext::new(
                        System::id(),
                        Transfer {
                            from: buyer_info.clone(),
                            to: info.clone(),
                        },
                    ),
                    shortfall,
                )?;
            }
            allocate(
                CpiContext::new_with_signer(
                    System::id(),
                    Allocate {
                        account_to_allocate: info.clone(),
                    },
                    &[seeds],
                ),
                space as u64,
            )?;
            assign(
                CpiContext::new_with_signer(
                    System::id(),
                    Assign {
                        account_to_assign: info.clone(),
                    },
                    &[seeds],
                ),
                program_id,
            )?;
        }

        round.ticket_count = index.checked_add(1).ok_or(SoluckyError::Overflow)?;
        round.pot = round.pot.checked_add(price).ok_or(SoluckyError::Overflow)?;
        // A sealed Guess batch is drawn from the entropy it was sealed with.
        if round.status == RoundStatus::Open {
            round.entropy = hashv(&[
                &round.entropy,
                owner.as_ref(),
                &number_bytes,
                &clock.slot.to_le_bytes(),
                info.key.as_ref(),
            ])
            .to_bytes();
        }
        let ticket = Ticket {
            round: round_key,
            owner,
            number,
            index,
            country,
            created_at: clock.unix_timestamp,
            bump,
        };
        ticket.try_serialize(&mut &mut info.try_borrow_mut_data()?[..])?;

        emit!(TicketPurchased {
            kind,
            period,
            owner,
            number,
            index,
            country,
            pot: round.pot,
        });
        bought.push(number);
    }
    require!(!bought.is_empty(), SoluckyError::AllTaken);

    // The price of every ticket, and in a lottery the rent of the 4 bytes a
    // number adds to the round's sorted list, so the pot never pays for
    // storage.
    let count = bought.len() as u64;
    let mut cost = price.checked_mul(count).ok_or(SoluckyError::Overflow)?;
    if lottery {
        let old_len = round_info.data_len();
        let new_len = old_len + 4 * bought.len();
        cost += rent.minimum_balance(new_len) - rent.minimum_balance(old_len);
        round_info.resize(new_len)?;
        bought.sort_unstable();
        insert_many_sorted(
            &mut round_info.try_borrow_mut_data()?[8 + Round::INIT_SPACE..],
            &bought,
        );
    }

    match session {
        None => transfer(
            CpiContext::new(
                System::id(),
                Transfer {
                    from: buyer_info,
                    to: round_info,
                },
            ),
            cost,
        )?,
        Some(session) => {
            // The key paid the new round's rent; the session pays it back,
            // so the key only ever spends network fees.
            let refund = if opened {
                rent.minimum_balance(8 + Round::INIT_SPACE)
            } else {
                0
            };
            let tickets_rent: u64 = unfunded.iter().map(|(_, lamports)| lamports).sum();
            let total = cost + tickets_rent + refund;
            let floor = rent.minimum_balance(session.to_account_info().data_len());
            require!(
                session.get_lamports() >= floor.saturating_add(total),
                SoluckyError::SessionBudgetLow
            );
            session.sub_lamports(total)?;
            round_info.add_lamports(cost)?;
            for (info, lamports) in unfunded {
                info.add_lamports(lamports)?;
            }
            buyer_info.add_lamports(refund)?;
        }
    }
    Ok(())
}
