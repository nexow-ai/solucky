use anchor_lang::prelude::*;

#[error_code]
pub enum SoluckyError {
    #[msg("Only the authority can do this")]
    Unauthorized,
    #[msg("The ticket price must be greater than zero")]
    InvalidTicketPrice,
    #[msg("The fee is above the 10% cap")]
    FeeTooHigh,
    #[msg("The highest number must be greater than zero")]
    InvalidMaxNumber,
    #[msg("Ticket sales are paused")]
    Paused,
    #[msg("Tickets can only be bought for today's round")]
    WrongDay,
    #[msg("The number is out of range")]
    NumberOutOfRange,
    #[msg("The country must be an uppercase ISO 3166-1 alpha-2 code")]
    InvalidCountry,
    #[msg("The round is not open")]
    RoundNotOpen,
    #[msg("The round has not ended yet")]
    RoundNotOver,
    #[msg("The round was already drawn")]
    RoundAlreadyDrawn,
    #[msg("The pinned slot can still be drawn")]
    DrawStillPossible,
    #[msg("The round is not closed")]
    RoundNotClosed,
    #[msg("The pinned slot has not been reached yet")]
    TargetSlotNotReached,
    #[msg("The pinned slot hash is not available; close the round again to pin a new slot")]
    RandomnessUnavailable,
    #[msg("The round has not been drawn")]
    RoundNotDrawn,
    #[msg("This is not the winning ticket")]
    NotWinningTicket,
    #[msg("The round has not been settled")]
    RoundNotSettled,
    #[msg("Arithmetic overflow")]
    Overflow,
}
