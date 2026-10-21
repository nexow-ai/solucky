use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use solana_sha256_hasher::hashv;

use crate::{
    constants::{CONFIG_SEED, GAME_SEED, MAX_LOTTERY_TICKETS, ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    events::TicketPurchased,
    state::{Config, Game, Round, RoundStatus, Ticket},
    utils::{insert_sorted, is_valid_country, period_of, period_seconds},
};

#[derive(Accounts)]
#[instruction(kind: u8, period: u32, number: u32)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(seeds = [GAME_SEED, &kind.to_le_bytes()], bump = game.bump)]
    pub game: Account<'info, Game>,
    /// Opened by the round's first buyer. A lottery round grows by 4 bytes a
    /// ticket, and `init_if_needed` wants an existing account's size to match
    /// `space`, hence the `max`.
    #[account(
        init_if_needed,
        payer = buyer,
        space = (8 + Round::INIT_SPACE).max(round.data_len()),
        seeds = [ROUND_SEED, &kind.to_le_bytes(), &period.to_le_bytes()],
        bump
    )]
    pub round: Account<'info, Round>,
    /// Fails with "already in use" if someone holds this number in the round.
    #[account(
        init,
        payer = buyer,
        space = 8 + Ticket::INIT_SPACE,
        seeds = [TICKET_SEED, round.key().as_ref(), &number.to_le_bytes()],
        bump
    )]
    pub ticket: Account<'info, Ticket>,
    pub system_program: Program<'info, System>,
}

pub fn handle_buy_ticket(
    ctx: Context<BuyTicket>,
    kind: u8,
    period: u32,
    number: u32,
    country: [u8; 2],
    max_price: u64,
) -> Result<()> {
    let config = &ctx.accounts.config;
    let game = &ctx.accounts.game;
    let clock = Clock::get()?;
    require!(!config.paused, SoluckyError::Paused);
    require!(is_valid_country(&country), SoluckyError::InvalidCountry);
    let on_sale = match period_seconds(kind) {
        Some(seconds) => period_of(clock.unix_timestamp, seconds)?,
        None => game.current_round,
    };
    require!(period == on_sale, SoluckyError::WrongRound);

    let buyer = ctx.accounts.buyer.key();
    let round_key = ctx.accounts.round.key();
    let ticket_key = ctx.accounts.ticket.key();
    let round_info = ctx.accounts.round.to_account_info();

    let round = &mut ctx.accounts.round;
    // A new account is all zeros, and a round's price is never zero.
    if round.ticket_price == 0 {
        round.set_inner(Round {
            kind,
            period,
            status: RoundStatus::Open,
            ticket_price: game.ticket_price,
            fee_bps: game.fee_bps,
            max_number: config.max_number,
            ticket_count: 0,
            pot: 0,
            entropy: hashv(&[
                b"solucky",
                &[kind],
                &period.to_le_bytes(),
                round_key.as_ref(),
            ])
            .to_bytes(),
            target_slot: 0,
            checked: 0,
            sealed_count: 0,
            draw_slot: 0,
            slot_hash: [0; 32],
            randomness: [0; 32],
            drawn_number: 0,
            winning_index: 0,
            winning_number: 0,
            winner: Pubkey::default(),
            winner_country: [0; 2],
            payout: 0,
            fee: 0,
            fee_collected: false,
            bump: ctx.bumps.round,
        });
    }
    match round.status {
        RoundStatus::Open => {}
        // Guess: sales go on while the last guesses wait for their check, but
        // stop once the pinned slot's hash, and so the check's result, is out.
        RoundStatus::Closed if !round.is_lottery() => {
            require!(clock.slot <= round.target_slot, SoluckyError::BatchSealed)
        }
        _ => return err!(SoluckyError::RoundNotOpen),
    }
    require!(number <= round.max_number, SoluckyError::NumberOutOfRange);

    let price = round.ticket_price;
    // The first ticket opens the round at the game's price; the buyer never
    // pays more than the price they were shown.
    require!(price <= max_price, SoluckyError::PriceChanged);
    let index = round.ticket_count;
    let lottery = round.is_lottery();
    require!(
        !lottery || index < MAX_LOTTERY_TICKETS,
        SoluckyError::RoundFull
    );
    round.ticket_count = index.checked_add(1).ok_or(SoluckyError::Overflow)?;
    round.pot = round.pot.checked_add(price).ok_or(SoluckyError::Overflow)?;
    // A sealed Guess batch is drawn from the entropy it was sealed with.
    if round.status == RoundStatus::Open {
        round.entropy = hashv(&[
            &round.entropy,
            buyer.as_ref(),
            &number.to_le_bytes(),
            &clock.slot.to_le_bytes(),
            ticket_key.as_ref(),
        ])
        .to_bytes();
    }
    let pot = round.pot;

    ctx.accounts.ticket.set_inner(Ticket {
        round: round_key,
        owner: buyer,
        number,
        index,
        country,
        created_at: clock.unix_timestamp,
        bump: ctx.bumps.ticket,
    });

    // A lottery round keeps its numbers sorted after the struct. The buyer
    // pays the rent of the 4 new bytes on top of the price, so the pot never
    // pays for storage.
    let mut cost = price;
    if lottery {
        let old_len = round_info.data_len();
        let rent = Rent::get()?;
        cost += rent.minimum_balance(old_len + 4) - rent.minimum_balance(old_len);
        round_info.resize(old_len + 4)?;
        insert_sorted(
            &mut round_info.try_borrow_mut_data()?[8 + Round::INIT_SPACE..],
            number,
        );
    }

    transfer(
        CpiContext::new(
            System::id(),
            Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: round_info,
            },
        ),
        cost,
    )?;

    emit!(TicketPurchased {
        kind,
        period,
        owner: buyer,
        number,
        index,
        country,
        pot,
    });
    Ok(())
}
