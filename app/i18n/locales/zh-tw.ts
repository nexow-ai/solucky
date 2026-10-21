/** Placeholder: still the English text, until it is translated. */
import type { Dict } from './en';

const zhtw: Dict = {
  meta: {
    title: 'S☉Lucky: the daily lottery on Solana',
    description:
      'Pick a number, buy a ticket, and win the whole pot at midnight UTC. Every ticket, pot and draw lives on Solana and can be checked by anyone.',
    ogImageAlt: 'S☉Lucky, the daily lottery on Solana',
  },

  nav: {
    play: 'Play',
    how: 'How it works',
    fairness: 'Fairness',
    faq: 'FAQ',
  },

  lang: {
    label: 'Language',
    choose: 'Language: {name}',
  },

  header: {
    beta: 'Beta',
    getSol: 'Get SOL',
    faucetTip: 'Provisional beta faucet: get free test SOL to play',
    mute: 'Mute sounds',
    unmute: 'Play sounds',
  },

  faucet: {
    connectFirst: 'Connect a wallet first',
    connectFirstHint: 'Then tap Get SOL to fund it with test SOL.',
    request: 'Request test SOL in the faucet',
    requestHint: 'Your wallet address is copied. Paste it if the field is empty, then confirm.',
    openAgain: 'Open again',
    airdropped: 'Airdropped ◎1',
    airdroppedHint: 'Test SOL landed on {cluster}. You can buy tickets now.',
    failed: 'Airdrop failed',
    slow: 'The airdrop was accepted but the balance has not updated yet. Refresh in a moment.',
  },

  footer: {
    license: 'MIT License',
    program: 'Program {address} on {cluster}.',
    age: '18+ only. Play for fun, and only where lotteries are legal.',
    legal: 'Legal',
    languages: 'Languages',
    source: 'Source code',
    builtOn: '建構於 {solana}',
    madeBy: '由 {nexow} 打造',
  },

  home: {
    kicker: 'Daily lottery on Solana',
    title: 'Pick a number.',
    titleEnd: 'Win the pot at midnight.',
    lead: 'One draw a day, one winner, the whole pot. Every ticket, every lamport and every draw lives on Solana, where anyone can check it.',
    playNow: 'Play now',
    howItWorks: 'How it works',
    program: 'Program',
    cluster: 'Cluster',
    draw: 'Draw',
    dialCaption:
      'Each dot is one of today’s tickets: around the dial by the time it was bought, outwards by its number.',

    how: {
      tag: 'How it works',
      title: 'Four steps, one draw a day',
      description:
        'Rounds follow the UTC calendar: a new one opens at 00:00 UTC and is drawn right after the next midnight.',
      opens: 'Round opens',
      draw: 'Draw',
      now: 'Now',
      steps: {
        wallet: {
          title: 'Connect a wallet',
          description:
            'Phantom, Solflare, Backpack or any wallet that speaks the Wallet Standard. No account, no email.',
          when: 'Any time',
        },
        number: {
          title: 'Pick your number',
          description: 'Any number from 0 to {max}. Each number can be held by one ticket per day, so be quick.',
          when: 'Until midnight UTC',
        },
        pot: {
          title: 'Watch the pot grow',
          description:
            'Every ticket adds its price to the pot, held by the round’s own account on Solana. Nobody else can move it.',
          when: 'All day',
        },
        win: {
          title: 'Win at midnight UTC',
          description:
            'One ticket wins the whole pot, minus a small house fee. More tickets, better odds: every ticket counts once.',
          when: 'Right after midnight UTC',
        },
      },
    },

    fairness: {
      tag: 'Fairness',
      title: 'Don’t trust us. Check.',
      description:
        'S☉Lucky is a Solana program, not a server holding your money. These rules are enforced by its code.',
      rules: {
        locked: {
          title: 'The pot is locked in the program',
          description:
            'Ticket money goes straight to the round’s account. The program only ever pays it to the winning ticket’s owner, and the fee to the treasury. The operator cannot withdraw it.',
        },
        draw: {
          title: 'A draw nobody can predict',
          description:
            'Every purchase is mixed into the round’s entropy. When the day ends, the round pins a slot a few seconds in the future; that slot’s hash, unknown to everyone until then, picks the winner.',
        },
        anyone: {
          title: 'Anyone can run it',
          description:
            'Closing, drawing and paying out are open to everyone. If the operator vanished tomorrow, any player could still finish every round.',
        },
        browser: {
          title: 'Checkable in your browser',
          description:
            'Each round page recomputes the draw from public data: the entropy, the slot hash and the winning index. Same inputs, same winner.',
        },
        limits: {
          title: 'Hard limits on the house',
          description:
            'The program caps the fee at 10%. Price and fee changes only apply to the next day’s round, and a buyer never pays more than the price they were shown.',
        },
        open: {
          title: 'Open source',
          description: 'The program, the app and the operator scripts are public, with tests for every rule.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Questions',
      description: 'Still unsure? The program, the app and the operator scripts are open source.',
      readCode: 'Read the code',
      items: {
        real: {
          q: 'Is this real money?',
          a: 'The public app runs on Solana devnet, where SOL is free test money from faucet.solana.com. The program works the same on mainnet, but running a real-money lottery needs the right licences where you operate.',
        },
        price: {
          q: 'How much does a ticket cost?',
          a: 'The price is set on-chain and shown on the Play page. Besides the price, a ticket account holds a small rent deposit that you get back by closing the ticket once the round is paid. The first ticket of the day also pays the rent of the round’s account, which stays on-chain as its public record.',
        },
        odds: {
          q: 'How are my odds calculated?',
          a: 'Every ticket has the same chance: your tickets divided by all tickets sold that day. The number you pick is your label on the board; it does not change your odds.',
        },
        draw: {
          q: 'What if nobody draws the round?',
          a: 'A small bot (the crank) closes, draws and pays every round within seconds of midnight, and anyone can do the same from the History panel. If the pinned slot ever becomes too old to read (about three minutes), the round can be closed again to pin a fresh one; the program only allows that once the old slot is provably out of reach.',
        },
        country: {
          q: 'Why do you show my country?',
          a: 'S☉Lucky has always shown a flag next to each ticket. We suggest your country from your host connection, without any third-party lookup, and you can change it or keep it private before buying. It is stored on-chain with your ticket.',
        },
        validator: {
          q: 'Can a validator cheat the draw?',
          a: 'Players cannot: the winning hash does not exist when sales close. The validator that produces the pinned slot could bias it, by choosing what goes in that block or by skipping it. That is acceptable for a test-money game; for real-money pots, the draw should use a verifiable randomness oracle, and the README explains where to plug one in.',
        },
      },
    },

    cta: {
      title: 'Today’s pot is waiting',
      description: 'Pick a number nobody has taken yet. Good luck!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'One draw a day · Drawn after midnight UTC · Every ticket on Solana',
    draw: 'Draw',
    pot: 'Today’s pot',
    toDraw: 'to the draw · {day}',
    tickets: '{n} ticket today | {n} tickets today',
    entropy: 'Entropy · {cluster}',
    entropyTitle: 'Entropy: {hex}',
    noTickets: 'no tickets yet',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'New ticket',
    rules: {
      daily: 'New round every day at 00:00 UTC',
      pot: 'One ticket wins the pot',
      numbers: 'Numbers from 0 to {max}',
      fee: 'House fee capped at 10% by the program',
      anyone: 'Anyone can close, draw and pay a round',
      check: 'Recompute every draw in your browser',
      open: 'Open source',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Draw receipt',
    round: 'Round',
    noneYet: 'none settled yet',
    tickets: 'Tickets',
    pot: 'Pot',
    entropy: 'Entropy',
    slotHash: 'Slot hash · slot {slot}',
    formula: 'sha256(entropy ‖ slot hash ‖ slot ‖ round) =',
    mod: 'first 8 bytes as u64 mod {count} = {ticket}',
    ticketCount: 'tickets',
    ticket: 'ticket #{index}',
    number: 'Number',
    paidTo: 'Paid to',
    payout: 'Payout',
    check: 'Check this draw',
    roundPage: 'Round page',
    nextDraw: 'Next draw after 00:00 UTC',
    ok: 'Recomputed in your browser: same hash, ticket #{index} wins.',
    mismatch: 'The hash recomputed in your browser does not match this round.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Tickets',
    players: 'Players',
    countries: 'Countries',
    ticket: 'Ticket',
    yourTickets: 'Your tickets',
    winChance: 'Win chance',
    chance: 'Chance',
    todaysPot: 'Today’s pot',
    winners: 'Winners',
    averagePot: 'Average pot',
    biggestPot: 'Biggest pot',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: '{time} left',
  },

  play: {
    title: 'Play',
    description: 'Pick today’s number and watch the pot grow live on Solana.',
    testMoney: 'You are playing on Solana {cluster}: tickets cost test SOL with no real value.',
    localFunds: 'Point your wallet at {url}, then fund it with: {command}',
    phantomFunds:
      'In Phantom: Settings → Developer Settings → enable Testnet Mode → select {cluster}. Then get free test SOL from the faucet.',
    openFaucet: 'Open faucet',
    retry: 'Retry',
    rpcError: 'Could not reach the Solana RPC endpoint ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Pick a',
    title: 'Number',
    win: 'Win',
    in: 'in',
    taken: 'Already taken today',
    range: '0 to {max}, one ticket per number',
    pad: 'Number pad',
    reset: 'Reset',
    delete: 'Delete last digit',
    dip: 'Lucky dip',
    searchCountry: 'Search a country',
    country: 'Country shown with your ticket',
    notSetUp: 'The lottery is not set up on this cluster yet.',
    paused: 'Ticket sales are paused.',
    buy: 'Buy {number} for ◎{price}',
    takenToday: '{number} is taken today',
    outOfRange: 'Number out of range',
    notEnough: 'Not enough SOL',
    keys: 'Keys 0–9 type, ⌫ deletes, Enter buys.',
    rent: 'A ticket also holds ◎{rent} of account rent, which you get back after the draw.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    kicker: 'Today’s',
    title: 'SOLPOT',
    closesIn: '{day} · closes in',
    inPlay: 'Numbers in play',
    empty: 'No tickets yet',
    beFirst: 'Be the first to pick a number today.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'History',
    total: 'Total',
    games: 'game | games',
    waiting: 'Waiting for the draw',
    settle: 'Settle',
    settleDay: 'Settle {day}',
    anyone:
      'Anyone can close, draw and pay a finished round. It only costs network fees; the prize always goes to the winner.',
    rent: '{n} old ticket holds ◎{sol} of rent | {n} old tickets hold ◎{sol} of rent',
    rentHint: 'Close them to get that SOL back. The round keeps its results.',
    getBack: 'Get it back',
    winners: 'Winners',
    noWinners: 'No winners yet',
    firstDraw: 'The first draw happens at midnight UTC.',
    chart: 'Pot per day',
    chartEmpty: 'No finished rounds yet.',
    chartLabel:
      'Pot of the last round; the list below has every value. | Pot of the last {n} rounds; the list below has every value.',
  },

  status: {
    open: 'Open',
    toClose: 'Waiting to close',
    toDraw: 'Waiting for draw',
    unpaid: 'Drawn, unpaid',
    paid: 'Paid',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Live',
    connecting: 'Connecting',
    offline: 'Offline',
    atTable: '{n} at the table',
    picking: '{n} picking | {n} picking',
    you: 'you',
    joined: 'joined',
    now: 'now',
    empty: 'The table is open. The next ticket shows up here the moment it lands.',
    joinedOne: 'A new player joined the table',
    joinedMany: '{n} new player joined the table | {n} new players joined the table',
    hereNow: '{n} here now',
    locked: '{who} locked in {number}',
    potNow: 'The pot is now ◎{pot} with {n} ticket | The pot is now ◎{pot} with {n} tickets',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Confirm in your wallet…',
    done: '{label}: done',
    cancelled: '{label}: cancelled',
    failed: '{label} failed',
    view: 'View transaction',
    buying: 'Buying number {number}',
    bought: 'Number {number} is yours. Good luck!',
    repin: 'Re-pinning the draw slot for {day}',
    closing: 'Closing {day}',
    drawing: 'Drawing {day}',
    paying: 'Paying the {day} winner',
    paid: 'Paid ◎{amount} to the {day} winner',
    settleFailed: 'Could not settle {day}',
    reclaiming: 'Returning ticket rent',
    slowSlot: 'The cluster is slow to reach the draw slot. Try again in a minute.',
    noWinner: 'The winning ticket could not be found.',
  },

  wallet: {
    connect: 'Connect wallet',
    title: 'Connect a wallet',
    description: 'Any Solana wallet that supports the Wallet Standard works.',
    none: 'No Solana wallet was found in this browser. Install one, then reload the page:',
    failed: 'Could not connect {wallet}',
    copied: 'Address copied',
    balance: 'Balance',
    ticketsLeft: '{n} ticket left | {n} tickets left',
    needMore: 'need more SOL to play',
    numbers: 'Your numbers today',
    copy: 'Copy address',
    explorer: 'Explorer',
    play: 'Play',
    disconnect: 'Disconnect',
  },

  round: {
    title: 'Round {day}',
    back: 'Back to the game',
    notDate: 'This is not a date. Rounds are named YYYY-MM-DD.',
    kicker: 'Round',
    nobody: 'Nobody played this day',
    beFirst: 'Be the first to buy a ticket today.',
    onlyExists: 'A round only exists once its first ticket is sold.',
    pot: 'Pot',
    usd: '{usd} at today’s price',
    winner: 'Winner',
    won: 'Won ◎{payout} · fee ◎{fee}',
    unpaid: 'Not paid yet',
    anyone: 'Anyone can finish this round. It only costs network fees.',
    settle: 'Settle this round',
    sold: 'Tickets sold',
    price: 'Ticket price',
    fee: 'House fee',
    slot: 'Pinned slot',
    check: 'Check the draw',
    formula: 'randomness = sha256(entropy ‖ slot hash ‖ draw slot ‖ round address)',
    recompute: 'Recompute in my browser',
    entropy: 'Entropy (every purchase, hashed in order)',
    slotHash: 'Slot hash of slot {slot} (read by the program from the SlotHashes sysvar)',
    randomness: 'Randomness',
    winning: 'Winning ticket',
    winningFormula: 'first 8 bytes as u64 mod {count} = purchase #{index}',
    ok: 'The draw checks out.',
    mismatch: 'Mismatch: the stored result does not match the inputs.',
    got: 'Your browser got {hash}… and ticket #{index}.',
    tickets: 'Tickets',
    ticketsHint: 'Tickets closed by their owners after the payout no longer show here; the round keeps the totals.',
    noTickets: 'No open tickets left for this round.',
    account: 'Round account {address} · {day}',
  },

  country: {
    private: 'Private',
  },

  errors: {
    rejected: 'You cancelled the request in your wallet.',
    taken: 'Someone already holds this number today. Pick another one.',
    funds: 'Not enough SOL in the wallet.',
    walletCluster:
      'Your wallet could not sign. In Phantom: Settings → Developer Settings → enable Testnet Mode → select Devnet, then reconnect and try again.',
    unknown: 'Something went wrong.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Only the authority can do this.',
      invalidTicketPrice: 'The ticket price must be at least 0.001 SOL.',
      feeTooHigh: 'The fee is above the 10% cap.',
      invalidMaxNumber: 'The highest number must be greater than zero.',
      paused: 'Ticket sales are paused.',
      wrongDay: 'Tickets can only be bought for today’s round.',
      numberOutOfRange: 'The number is out of range.',
      invalidCountry: 'The country must be an uppercase ISO 3166-1 alpha-2 code.',
      roundNotOpen: 'The round is not open.',
      roundNotOver: 'The round has not ended yet.',
      roundAlreadyDrawn: 'The round was already drawn.',
      drawStillPossible: 'The pinned slot can still be drawn.',
      roundNotClosed: 'The round is not closed.',
      targetSlotNotReached: 'The pinned slot has not been reached yet.',
      randomnessUnavailable:
        'The pinned slot’s hash is not readable yet; try again shortly, or close the round again once it expired.',
      roundNotDrawn: 'The round has not been drawn.',
      notWinningTicket: 'This is not the winning ticket.',
      roundNotSettled: 'The round has not been settled.',
      overflow: 'Arithmetic overflow.',
      priceChanged: 'The ticket price is higher than the price you accepted.',
      feeAlreadyCollected: 'The fee of this round was already collected.',
    },
  },

  legal: {
    kicker: 'Legal',
    updated: 'Last updated {date}',
    onThisPage: 'On this page',
    others: 'Other legal documents',
    translated: 'This page is a translation of the English original. If they differ, the English version applies.',
    readEnglish: 'Read it in English',
    repository: 'source repository',

    pages: {
      notice: {
        label: 'Legal notice',
        description: 'Who runs S☉Lucky, how to reach us, and the documents that apply.',
      },
      terms: {
        label: 'Terms of Service',
        description: 'The rules for using the site and playing, and what the program does and does not promise.',
      },
      privacy: {
        label: 'Privacy Policy',
        description: 'What is public on Solana, what our servers see, and what we never collect.',
      },
      cookies: {
        label: 'Cookies & storage',
        description: 'No cookies, no trackers: the five settings the app keeps in your browser.',
      },
      play: {
        label: 'Responsible play',
        description: 'How the odds work, and where to get help if playing stops being fun.',
      },
    },

    notice: {
      description: 'Who runs S☉Lucky, how to reach us, and the documents that apply when you use it.',
      operator: {
        title: 'Who runs S☉Lucky',
        body: 'S☉Lucky is made and run by {operator}. You can reach us by email at {email} and learn more about us at {site}.',
      },
      software: {
        title: 'The program and the site',
        intro: 'S☉Lucky has two parts:',
        program:
          '{name}, a Solana program that sells the tickets, holds each day’s pot and pays the winner. This site uses the program at {address} on Solana {cluster}. Anyone can use it directly, without this site.',
        programName: 'The program',
        site: '{name}, which shows the program’s public data and helps you send transactions from your own wallet. It never holds your keys or your SOL.',
        siteName: 'This site',
      },
      documents: {
        title: 'Documents',
        intro: 'Using the site means accepting these documents:',
      },
      security: {
        title: 'Reporting a security issue',
        body: 'Please do not open a public issue. Email {email} with the subject {subject}, and never test against other players’ funds: use devnet or a local validator. The security policy, {file} in the {repository}, explains what to include and what is in scope.',
      },
      license: {
        title: 'Open source license',
        body: 'The program, the app and the operator scripts are open source under the MIT License ({file} in the {repository}), © {years} {operator}. The license covers the code; the {terms} cover using this site.',
      },
    },

    terms: {
      description: 'The rules for using S☉Lucky, and what its program does and does not promise.',
      agreement: {
        title: 'These terms',
        p1: 'These terms apply when you use the S☉Lucky website and app, run by {operator} (“we”, “us”). By using it, you accept them, along with the {privacy} and the {cookies} page. If you do not accept them, do not use the site.',
        p2: 'The game itself is a Solana program: open source software that runs on the Solana network, not on our servers. The site is one way to use it; anyone can also use the program directly.',
      },
      eligibility: {
        title: 'Who can play',
        age: 'You must be 18 or older.',
        legal:
          'You may only play where lotteries and online games of chance are legal for you. Checking that is your responsibility; we do not check where you are.',
        own: 'Do not play for someone else, or with SOL that is not yours.',
      },
      money: {
        title: 'Test SOL and real SOL',
        test: 'This site runs on {cluster}. Tickets cost test SOL, which is free from a faucet and has no value: it cannot be exchanged for real money, and neither can anything you win with it.',
        real: 'This site runs on {cluster}. Tickets cost real SOL, and pots are paid in real SOL.',
      },
      rounds: {
        title: 'How a round works',
        intro: 'The program enforces these rules; the site only shows them:',
        day: 'One round runs per UTC day, from 00:00 UTC to the next midnight.',
        number:
          'A ticket is one number, from 0 to the highest number set in the program’s configuration. Each number can be held by one ticket per round.',
        price:
          'The ticket price and the house fee are copied from the configuration when a round opens, and stay fixed for that round. The fee can never be more than 10% of the pot. When you buy, you never pay more than the price you were shown.',
        pot: 'Every ticket’s price goes into the round’s pot, held by the round’s own account on Solana. Each ticket has the same chance: your chance is your tickets divided by all the tickets sold in that round. The number you pick does not change it.',
        draw: 'After midnight, anyone can close the round, draw it and pay it. The winning ticket’s owner receives the pot minus the house fee, and the fee goes to the treasury.',
        rent: 'A ticket account also holds a small rent deposit, which you get back by closing the ticket once its round is paid. The first ticket of a round also pays the rent of the round’s account, which stays on Solana as the round’s public record.',
      },
      wallet: {
        title: 'Your wallet and transactions',
        own: 'You play with your own wallet. We never hold your keys, your SOL or your tickets, and we cannot move them.',
        sign: 'You sign every transaction yourself, and you pay Solana’s network fees. Confirmed transactions are final: we cannot cancel, reverse or refund them.',
        public:
          'A ticket’s number, its owner’s address and the country flag you choose for it are public on Solana for good. The {privacy} explains what that means.',
        keys: 'Keep your wallet’s keys safe. Nobody, including us, can recover them for you.',
      },
      operator: {
        title: 'What the operator can and cannot do',
        intro: 'The program’s configuration has an authority, which can:',
        price:
          'change the ticket price (at least ◎0.001) and the house fee (at most 10%), effective from the next round to open;',
        pause:
          'pause and resume ticket sales. A pause stops new tickets only: rounds already played can still be drawn and paid;',
        other: 'change the treasury, the highest number, and the authority itself.',
        cannot:
          'The program’s code does not let the authority, or anyone else, take a round’s pot or send it anywhere but to the winning ticket’s owner, take more than the fee, or charge a buyer more than the price they were shown.',
        upgrade:
          'The program is upgradeable: whoever holds its upgrade authority could deploy different code, so you are trusting them until the program is made immutable or handed to a multisig. The source of every version is public, and a deployed program can be checked against it as the README’s “Verifiable builds” section explains.',
      },
      risks: {
        title: 'Risks',
        intro: 'By playing, you accept that:',
        bugs: 'software can have bugs, including the program, the app and your wallet, and a bug could cost you your tickets or your SOL;',
        network:
          'Solana or the RPC endpoint the site uses can be slow, congested or down, and a transaction can fail or arrive after a round closes;',
        draw: 'the draw uses the hash of a Solana slot that nobody knows when sales close. Players cannot predict it, but the validator that produces that slot could bias it, and whoever closes a round could hold back an unfavourable draw until that slot can no longer be read. It is not a verifiable randomness oracle;',
        site: 'the site can be unavailable at any time. The program, and your tickets, keep working without it;',
        law: 'laws on lotteries and crypto-assets differ between countries and can change.',
      },
      use: {
        title: 'Using the site fairly',
        body: 'Do not attack or overload the site or its servers, try to get around their limits, interfere with other players, or use the site to break the law. We may block access from anyone who does.',
      },
      liability: {
        title: 'No warranty',
        body: 'The site and the program are provided “as is”, without any warranty. To the extent the law allows, we are not liable for any loss that comes from using them, including lost tickets, failed or late transactions, bugs, network problems, or a draw you consider unfair. Nothing in these terms limits a liability that the law does not allow us to limit.',
      },
      openSource: {
        title: 'Open source',
        body: 'The program, the app and the operator scripts are open source under the MIT License: see the {repository}. That license covers the code; these terms cover using this site.',
      },
      changes: {
        title: 'Changes',
        body: 'We may update these terms. The date at the top shows the last change, and the version shown here applies from that date.',
      },
      contact: {
        title: 'Contact',
        body: 'Questions about these terms: {email}.',
      },
    },

    privacy: {
      description: 'What is public on Solana, what our servers see, and what we never collect.',
      summary: {
        title: 'In short',
        account: 'There is no account, email or sign-up. You play with a wallet.',
        cookies: 'The site sets no cookies and loads no analytics, ads or trackers.',
        database: 'We do not keep a database of players, and we do not sell or share data about you.',
        public: 'Your tickets are public on Solana, by design: that is what lets anyone check the game.',
        controller: '{operator} runs the site and is responsible for the data it handles.',
      },
      onChain: {
        title: 'What is public on Solana',
        intro: 'When you buy a ticket, the transaction and the ticket’s account record, publicly:',
        address: 'your wallet address, and the transactions it signs;',
        number: 'the number you picked, the round and the time of purchase;',
        flag: 'the country flag you chose for the ticket, or none if you keep it private.',
        ledger:
          'When a round is drawn, its account also records the winner’s address, the winning number and its flag, and the payout. Solana is a public ledger: anyone can read this data, many people keep copies of it, and it stays there for good. Closing a ticket deletes its account and returns its rent, but the transactions that created and closed it remain in the ledger. Neither we nor anyone else can change or delete it.',
        link: 'A wallet address is not your name, but it can be linked to you, for example through an exchange you used. Use a separate wallet if you want to keep your play apart from the rest of your activity.',
      },
      servers: {
        title: 'What our servers see',
        visit: 'Every visit',
        visitBody:
          'The site is hosted on Cloudflare. Like any website, it receives your IP address, your browser’s user agent and the pages you request, to deliver them and protect the site from abuse. Cloudflare keeps operational logs for a limited time under its {policy}. We use them only to run and fix the site.',
        policy: 'own privacy policy',
        country: 'Your country',
        countryBody:
          'Cloudflare tells our server which country each request comes from. The app asks for it once, to suggest the flag for your tickets; you can change it or keep it private before buying. The server reads only the country, not your IP address, and does not keep it.',
        live: 'The live table on the Play page',
        liveBody:
          'While the Play page is open, your browser keeps a connection to our server so players can see who else is there. It shares three things with the other people on the page: a random id for that connection only, the flag your tickets show (none if you keep your country private), and whether you are entering a number, never the number itself. No wallet address or IP address goes into it, and nothing about the connection is stored or kept after it closes.',
        price: 'The SOL price',
        priceBody:
          'To show pots in dollars, our server fetches the SOL price from Coinbase, or from CoinGecko if Coinbase does not answer, and caches it for a minute. These requests come from our server and carry nothing about you.',
      },
      thirdParties: {
        title: 'Services your browser uses',
        rpc: '{name}, which the app reads the game from and sends your transactions through: {endpoint}. It receives your IP address and the accounts the app looks up, including your wallet’s once you connect it, under its operator’s policy.',
        rpcName: 'A Solana RPC endpoint',
        rpcHost: '{host} on this site',
        rpcPublic: 'Solana’s public endpoint for {cluster}',
        wallet:
          '{name}, such as Phantom, Solflare or Backpack, which is software from its own maker, with its own policy. The site only asks it to connect and to sign the transactions you approve.',
        walletName: 'Your wallet',
        links:
          '{name}: Solana Explorer, the Solana faucet, GitHub and our social accounts are other sites, with their own policies.',
        linksName: 'Links you open',
        own: 'Fonts, sounds and images come from our own domain, so loading the site does not contact anyone else.',
      },
      browser: {
        title: 'What stays in your browser',
        body: 'The app keeps five settings in your browser’s local storage: your theme, your last wallet, your country choice, the sound setting and your language. The {cookies} page lists them.',
      },
      purposes: {
        title: 'Why, and what we never do',
        body: 'We handle the data above only to show the site, run the game you ask to play, keep the site secure and fix problems. We do not build profiles, show ads, sell data or share it with advertisers.',
      },
      rights: {
        title: 'Your choices and rights',
        flag: 'You can play without a country flag: choose to keep it private before buying.',
        clear: 'You can clear the settings in your browser at any time, and use a new wallet whenever you like.',
        law: 'Depending on where you live, you may have the right to access, correct or delete personal data about you, or to object to how it is used. Email {email} and we will answer. We hold almost nothing about you, and we cannot change or delete what is on Solana.',
      },
      children: {
        title: 'Children',
        body: 'S☉Lucky is for people aged 18 and over. We do not knowingly handle data about anyone younger.',
      },
      changes: {
        title: 'Changes and contact',
        body: 'We will update this page when the site changes how it handles data; the date at the top shows the last change. Questions: {email}.',
      },
    },

    cookies: {
      description: 'No cookies, no trackers: the five settings the app keeps in your browser, and how to remove them.',
      none: {
        title: 'No cookies',
        p1: 'S☉Lucky sets no cookies, and it loads no analytics, advertising or tracking scripts. The site’s security policy only allows scripts from its own domain.',
        p2: 'Our host, Cloudflare, can set strictly necessary security cookies, such as {cookie}, when its bot protection is on. Cloudflare uses them to tell people from bots, as its {list} explains.',
        list: 'cookie list',
      },
      storage: {
        title: 'What the app keeps in your browser',
        intro:
          'The app saves a few settings in your browser’s local storage, so they are still there next time. They stay on your device, with one exception: the flag you pick goes on the tickets you buy, and is shown on the Play page’s live table while you are there.',
        key: 'Key',
        holds: 'What it holds',
        saved: 'Saved',
        wallet: 'Your wallet extension keeps its own data, under its maker’s policy.',
      },
      keys: {
        theme: {
          holds: 'Your light or dark theme.',
          when: 'When you switch the theme.',
        },
        wallet: {
          holds: 'The name of the wallet you last connected and its address, so the app can reconnect it.',
          when: 'When you connect a wallet; removed when you disconnect it.',
        },
        country: {
          holds: 'The country flag you picked for your tickets, or that you keep it private.',
          when: 'When you pick a flag.',
        },
        sound: {
          holds: 'Whether sounds are on or off.',
          when: 'When you mute or unmute.',
        },
        lang: {
          holds: 'The language you chose, so the app does not offer you another one again.',
          when: 'When you pick a language, or answer the offer to read the site in yours.',
        },
      },
      clear: {
        title: 'Removing it',
        disconnect: 'Disconnect your wallet in the app to remove {key}.',
        site: 'Clear this site’s data in your browser’s settings to remove all of them.',
        private: 'In a private window, they are deleted when you close it.',
        reset: 'Removing them only resets these settings; your tickets are on Solana and stay yours.',
      },
      banner: {
        title: 'Why there is no cookie banner',
        body: 'Nothing here tracks you, and every setting above exists because you set it. So there is nothing to accept or refuse.',
      },
    },

    play: {
      description: 'How the odds work, and where to get help if playing stops being fun.',
      basics: {
        title: 'Before you play',
        age: 'S☉Lucky is for people aged 18 and over, where lotteries are legal.',
        test: 'This site runs on Solana {cluster}: tickets cost test SOL, which is free and has no value. It is a good way to see how the game works without spending anything.',
        real: 'This site runs on Solana Mainnet: tickets cost real SOL.',
        fun: 'Play for fun, never to make money or to win back money you lost.',
      },
      odds: {
        title: 'Know the odds',
        same: 'Every ticket has the same chance. Your chance of winning a round is your tickets divided by all the tickets sold in it.',
        label: 'The number you pick is your label on the board. It does not change your chance.',
        fee: 'The winner receives the pot minus the house fee, which the program caps at 10%. So, taken over all players, tickets pay back the money spent on them minus that fee: on average, a ticket returns less than it costs.',
        nothing: 'Nothing on the site changes these odds.',
      },
      final: {
        title: 'Tickets are final',
        body: 'A ticket cannot be cancelled or refunded once it is bought. The only thing you get back is its small rent deposit, by closing the ticket after its round is paid.',
      },
      habits: {
        title: 'Keep it fun',
        budget: 'Decide in advance how much you are ready to lose, and stop when it is gone.',
        chase: 'Never chase losses, and never play with borrowed money or money you need.',
        mood: 'Do not play when you are upset, tired or have been drinking.',
        breaks: 'Take breaks, and keep playing one part of your life among many.',
      },
      limits: {
        title: 'Setting your own limits',
        intro: 'S☉Lucky has no accounts, so it cannot set limits or exclude you. You can set your own:',
        wallet: 'Keep a separate wallet holding only what you are ready to spend.',
        block: 'Use a website blocker or your device’s parental controls to block the site.',
        trust: 'Tell someone you trust, and ask them to help you stick to your limits.',
      },
      help: {
        title: 'Getting help',
        intro:
          'If playing has stopped being fun, or someone close to you is worried about it, these independent organisations offer free and confidential help. We are not affiliated with them.',
        worldwide: 'Worldwide: meetings and contacts by country.',
        us: 'United States.',
        uk: 'United Kingdom.',
        emergency: 'If you or someone else is in immediate danger, call your local emergency number.',
      },
    },
  },
};

export default zhtw;
