use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use solana_sha256_hasher::hashv;

use crate::{
    constants::{CONFIG_SEED, ROUND_SEED, TICKET_SEED},
    error::SoluckyError,
    events::TicketPurchased,
    state::{Config, Round, RoundStatus, Ticket},
    utils::{day_of, is_valid_country},
};

#[derive(Accounts)]
#[instruction(day: u32, number: u32)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
    /// Opened by the day's first buyer.
    #[account(
        init_if_needed,
        payer = buyer,
        space = 8 + Round::INIT_SPACE,
        seeds = [ROUND_SEED, &day.to_le_bytes()],
        bump
    )]
    pub round: Account<'info, Round>,
    /// Fails with "already in use" if someone holds this number today.
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
    day: u32,
    number: u32,
    country: [u8; 2],
    max_price: u64,
) -> Result<()> {
    let config = &ctx.accounts.config;
    let clock = Clock::get()?;
    require!(!config.paused, SoluckyError::Paused);
    require!(day == day_of(clock.unix_timestamp)?, SoluckyError::WrongDay);
    require!(number <= config.max_number, SoluckyError::NumberOutOfRange);
    require!(is_valid_country(&country), SoluckyError::InvalidCountry);

    let buyer = ctx.accounts.buyer.key();
    let round_key = ctx.accounts.round.key();
    let ticket_key = ctx.accounts.ticket.key();

    let round = &mut ctx.accounts.round;
    // `day` is today, so it is never 0: a zero day means the account was just
    // created by `init_if_needed`.
    if round.day == 0 {
        round.set_inner(Round {
            day,
            status: RoundStatus::Open,
            ticket_price: config.ticket_price,
            fee_bps: config.fee_bps,
            ticket_count: 0,
            pot: 0,
            entropy: hashv(&[b"solucky", &day.to_le_bytes(), round_key.as_ref()]).to_bytes(),
            target_slot: 0,
            draw_slot: 0,
            slot_hash: [0; 32],
            randomness: [0; 32],
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
    require!(
        round.status == RoundStatus::Open,
        SoluckyError::RoundNotOpen
    );

    let price = round.ticket_price;
    // The first ticket of a day opens the round at the config's price; the
    // buyer never pays more than the price they were shown.
    require!(price <= max_price, SoluckyError::PriceChanged);
    let index = round.ticket_count;
    round.ticket_count = index.checked_add(1).ok_or(SoluckyError::Overflow)?;
    round.pot = round.pot.checked_add(price).ok_or(SoluckyError::Overflow)?;
    round.entropy = hashv(&[
        &round.entropy,
        buyer.as_ref(),
        &number.to_le_bytes(),
        &clock.slot.to_le_bytes(),
        ticket_key.as_ref(),
    ])
    .to_bytes();
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

    transfer(
        CpiContext::new(
            System::id(),
            Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.round.to_account_info(),
            },
        ),
        price,
    )?;

    emit!(TicketPurchased {
        day,
        owner: buyer,
        number,
        index,
        country,
        pot,
    });
    Ok(())
}
