/** Dutch: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const nl: Dict = {
  meta: {
    title: 'S☉Lucky: loterijspellen op Solana',
    description:
      'Kies een getal in de dagelijkse loterij of de uurloterij, of spoor het verborgen getal op. De winnaar krijgt 80% van de pot. Elk lot, elke pot en elke trekking staat op Solana en kan door iedereen worden gecontroleerd.',
    ogImageAlt: 'S☉Lucky, loterijspellen op Solana',
  },

  nav: {
    play: 'Spelen',
    how: 'Zo werkt het',
    fairness: 'Eerlijkheid',
    faq: 'FAQ',
  },

  lang: {
    label: 'Taal',
    choose: 'Taal: {name}',
  },

  update: {
    title: 'Er is een nieuwe versie klaar',
    hint: 'Herlaad om hem nu te krijgen. Hij laadt ook vanzelf bij je volgende paginawissel.',
    reload: 'Herladen',
  },

  install: {
    label: 'App installeren',
    ios: 'Open het deelmenu van je browser en kies Zet op beginscherm om S☉Lucky te installeren.',
  },

  push: {
    on: 'Laat het me weten als een ronde van dit spel gewonnen is',
    off: 'Meldingen voor dit spel uitzetten',
    enabled: 'Meldingen aan',
    enabledHint: '{game}: je krijgt een melding telkens als een ronde gewonnen is.',
    disabled: 'Meldingen uit',
    blocked:
      'Meldingen zijn geblokkeerd voor deze site. Sta ze toe in de instellingen van je browser en probeer het opnieuw.',
    failed: 'Meldingen konden niet worden gewijzigd. Probeer het opnieuw.',
    lottery: 'Ronde {round}: {drawn} is getrokken. Het dichtstbijzijnde lot, {winning}, wint ◎{prize}.',
    guess: 'Ronde {round}: het getal was {winning}. De poging die het vond, wint ◎{prize}.',
  },

  header: {
    beta: 'Bèta',
    getSol: 'SOL halen',
    faucetTip: 'Voorlopige bèta-faucet: haal gratis test-SOL om te spelen',
    mute: 'Geluid uit',
    unmute: 'Geluid aan',
  },

  faucet: {
    connectFirst: 'Koppel eerst een wallet',
    connectFirstHint: 'Tik daarna op “SOL halen” om hem met test-SOL te vullen.',
    request: 'Vraag test-SOL aan in de faucet',
    requestHint: 'Je walletadres is gekopieerd. Plak het als het veld leeg is en bevestig dan.',
    openAgain: 'Opnieuw openen',
    airdropped: '◎1 ontvangen via airdrop',
    airdroppedHint: 'Test-SOL is aangekomen op {cluster}. Je kunt nu loten kopen.',
    failed: 'Airdrop mislukt',
    slow: 'De airdrop is geaccepteerd, maar het saldo is nog niet bijgewerkt. Vernieuw zo meteen.',
  },

  footer: {
    license: 'MIT-licentie',
    program: 'Programma {address} op {cluster}.',
    age: 'Alleen 18+. Speel voor de lol, en alleen waar loterijen legaal zijn.',
    legal: 'Juridisch',
    languages: 'Talen',
    source: 'Broncode',
    builtOn: 'Gebouwd op {solana}',
    madeBy: 'Gemaakt door {nexow}',
  },

  home: {
    kicker: 'Loterijspellen op Solana',
    title: 'Kies een getal.',
    titleEnd: 'Win om middernacht.',
    lead: 'Elke dag een trekking, elk uur een trekking, en een verborgen getal om op te sporen. De winnaar krijgt 80% van de pot, en de rest schuift door naar de volgende ronde. Elk lot, elke lamport en elke trekking staat op Solana, waar iedereen het kan controleren.',
    playNow: 'Nu spelen',
    howItWorks: 'Zo werkt het',
    program: 'Programma',
    cluster: 'Cluster',
    draw: 'Trekking',
    dialCaption:
      'Elke stip is een van de loten van vandaag: rond de wijzerplaat volgens het moment van aankoop, naar buiten volgens het getal.',

    how: {
      tag: 'Zo werkt het',
      title: 'Vier stappen, één trekking per dag',
      description:
        'Rondes volgen de UTC-kalender: om 00:00 UTC opent een nieuwe, die direct na de volgende middernacht wordt getrokken.',
      opens: 'Ronde opent',
      draw: 'Trekking',
      now: 'Nu',
      steps: {
        wallet: {
          title: 'Koppel een wallet',
          description:
            'Phantom, Solflare, Backpack of elke andere wallet die de Wallet Standard ondersteunt. Geen account, geen e-mail.',
          when: 'Altijd',
        },
        number: {
          title: 'Kies je getal',
          description:
            'Elk getal van 0 tot {max}. Elk getal kan per dag door één lot worden bezet, dus wees er snel bij.',
          when: 'Tot middernacht UTC',
        },
        pot: {
          title: 'Zie de pot groeien',
          description:
            'Elk lot voegt zijn prijs toe aan de pot, die wordt bewaard door het eigen account van de ronde op Solana. Niemand anders kan hem verplaatsen.',
          when: 'De hele dag',
        },
        win: {
          title: 'Win om middernacht UTC',
          description:
            'Er wordt een willekeurig getal getrokken, en het lot dat er het dichtst bij ligt, wint 80% van de pot. De huiscommissie gaat van de rest af, en wat overblijft, schuift door naar de volgende dag.',
          when: 'Direct na middernacht UTC',
        },
      },
    },

    fairness: {
      tag: 'Eerlijkheid',
      title: 'Vertrouw ons niet. Controleer het.',
      description:
        'S☉Lucky is een Solana-programma, geen server die je geld beheert. Deze regels worden afgedwongen door de code ervan.',
      rules: {
        locked: {
          title: 'De pot zit vast in het programma',
          description:
            'Het geld van de loten gaat rechtstreeks naar het account van de ronde. Het programma betaalt er alleen 80% van uit aan de eigenaar van het winnende lot, de commissie aan de treasury en de rest aan de volgende ronde van het spel. De beheerder kan het niet opnemen.',
        },
        draw: {
          title: 'Een trekking die niemand kan voorspellen',
          description:
            'Elke aankoop wordt in de entropie van de ronde gemengd. Als een ronde eindigt, legt ze een slot een paar seconden in de toekomst vast; de hash van dat slot, tot dan voor iedereen onbekend, bepaalt het getal waarmee de loten worden vergeleken.',
        },
        anyone: {
          title: 'Iedereen kan het uitvoeren',
          description:
            'Sluiten, trekken en uitbetalen staan voor iedereen open. Als de beheerder morgen zou verdwijnen, kan elke speler nog steeds elke ronde afronden.',
        },
        browser: {
          title: 'Te controleren in je browser',
          description:
            'Elke rondepagina berekent de trekking opnieuw uit openbare gegevens: de entropie, de slothash, het getrokken getal en het dichtstbijzijnde lot. Dezelfde invoer, dezelfde winnaar.',
        },
        limits: {
          title: 'Harde grenzen voor het huis',
          description:
            'Het programma betaalt de winnaar altijd 80% van de pot uit en begrenst de commissie op 20%. Wijzigingen in prijs en commissie gelden pas voor rondes die daarna openen, en een koper betaalt nooit meer dan de prijs die hij te zien kreeg.',
        },
        open: {
          title: 'Open source',
          description: 'Het programma, de app en de beheerscripts zijn openbaar, met tests voor elke regel.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Vragen',
      description: 'Nog twijfels? Het programma, de app en de beheerscripts zijn open source.',
      readCode: 'Lees de code',
      items: {
        real: {
          q: 'Is dit echt geld?',
          a: 'De openbare app draait op Solana devnet, waar SOL gratis testgeld is van faucet.solana.com. Het programma werkt hetzelfde op mainnet, maar voor een loterij met echt geld heb je de juiste vergunningen nodig waar je actief bent.',
        },
        price: {
          q: 'Wat kost een lot?',
          a: 'De prijs van elk spel wordt on-chain vastgesteld en staat op de pagina “Spelen” van dat spel. Naast de prijs houdt een lotaccount een kleine borg voor rent vast, die je terugkrijgt door het lot te sluiten zodra de ronde is uitbetaald. Het eerste lot van een ronde betaalt ook de rent van het account van de ronde, dat on-chain blijft als openbare registratie ervan; in de loterijen betaalt elk lot ook voor de 4 bytes die zijn getal daarin inneemt.',
        },
        odds: {
          q: 'Hoe wordt mijn kans berekend?',
          a: 'In de loterijen wint het lot dat het dichtst bij het getrokken getal ligt. Je kans is dus het deel van het getallenbereik dat dichter bij jouw getallen ligt dan bij die van wie dan ook: een getal ver van de andere loten dekt er meer van. Bij Raad het getal vindt elke controle het getal met een kans van de nieuwe pogingen gedeeld door de getallen die nog niet geprobeerd zijn.',
        },
        draw: {
          q: 'Wat als niemand de ronde trekt?',
          a: 'Een kleine bot (de crank) sluit, trekt en betaalt elke loterijronde binnen enkele seconden na het einde ervan uit, en controleert om de paar seconden nieuwe pogingen. Iedereen kan hetzelfde doen vanaf de pagina “Spelen”. Als het vastgelegde slot ooit te oud wordt om te lezen (ongeveer drie minuten), kan de ronde opnieuw worden gesloten om een nieuw slot vast te leggen; het programma staat dat alleen toe als het oude slot aantoonbaar buiten bereik is.',
        },
        country: {
          q: 'Waarom tonen jullie mijn land?',
          a: 'S☉Lucky toont altijd al een vlag naast elk lot. We stellen je land voor op basis van je verbinding met onze host, zonder opzoeking bij derden, en je kunt het vóór de aankoop wijzigen of privé houden. Het wordt on-chain opgeslagen bij je lot.',
        },
        validator: {
          q: 'Kan een validator vals spelen bij de trekking?',
          a: 'Spelers niet: de winnende hash bestaat nog niet als de verkoop sluit. De validator die het vastgelegde slot produceert, zou het kunnen beïnvloeden door te kiezen wat er in dat blok komt of door het over te slaan. Voor een spel met testgeld is dat acceptabel; voor potten met echt geld zou de trekking een oracle voor verifieerbare willekeur moeten gebruiken, en de README legt uit waar je er een inplugt.',
        },
      },
    },

    cta: {
      title: 'De pot van vandaag wacht',
      description: 'Kies een getal dat nog niemand heeft genomen. Veel geluk!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Eén trekking per dag · Getrokken na middernacht UTC · Elk lot op Solana',
    draw: 'Trekking',
    pot: 'Pot van vandaag',
    toDraw: 'tot de trekking · {day}',
    tickets: 'vandaag {n} lot | vandaag {n} loten',
    entropy: 'Entropie · {cluster}',
    entropyTitle: 'Entropie: {hex}',
    noTickets: 'nog geen loten',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Nieuw lot',
    rules: {
      daily: 'Elke dag om 00:00 UTC een nieuwe ronde',
      hourly: 'En elk uur één',
      pot: 'Het dichtstbijzijnde getal wint 80% van de pot',
      carry: 'De rest schuift door naar de volgende ronde',
      guess: 'Raad het getal: geen deadline, tot iemand het vindt',
      numbers: 'Getallen van 0 tot {max}',
      fee: 'Huiscommissie door het programma begrensd op 20%',
      anyone: 'Iedereen kan een ronde sluiten, trekken en uitbetalen',
      check: 'Reken elke trekking na in je browser',
      open: 'Open source',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Trekkingsbewijs',
    round: 'Ronde',
    noneYet: 'nog geen afgewikkeld',
    tickets: 'Loten',
    pot: 'Pot',
    entropy: 'Entropie',
    slotHash: 'Slothash · slot {slot}',
    formula: 'sha256(entropie ‖ slothash ‖ slot ‖ ronde) =',
    mod: 'eerste 8 bytes als u64 mod {count} = {drawn}',
    ticketCount: 'getallen',
    closest: 'dichtstbijzijnde lot: {number}',
    number: 'Getal',
    paidTo: 'Betaald aan',
    payout: 'Uitbetaling',
    check: 'Controleer deze trekking',
    roundPage: 'Rondepagina',
    nextDraw: 'Volgende trekking na 00:00 UTC',
    ok: 'Nagerekend in je browser: dezelfde hash, getal {number} wint.',
    mismatch: 'De hash die je browser heeft nagerekend, komt niet overeen met deze ronde.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Loten',
    players: 'Spelers',
    countries: 'Landen',
    ticket: 'Lot',
    yourTickets: 'Jouw loten',
    winChance: 'Winkans',
    chance: 'Kans',
    todaysPot: 'Pot',
    checked: 'Gecontroleerd',
    waiting: 'Wachtend',
    numbersLeft: 'Getallen over',
    winners: 'Winnaars',
    averagePot: 'Gemiddelde pot',
    biggestPot: 'Grootste pot',
  },

  countdown: {
    h: 'u',
    m: 'm',
    s: 's',
    left: 'nog {time}',
  },

  play: {
    title: 'Spelen',
    description:
      'Kies een getal in de dagelijkse loterij of de uurloterij, of spoor het verborgen getal op, en zie de pot live groeien op Solana.',
    testMoney: 'Je speelt op Solana {cluster}: loten kosten test-SOL zonder echte waarde.',
    localFunds: 'Richt je wallet op {url} en vul hem daarna met: {command}',
    phantomFunds:
      'In Phantom: Settings → Developer Settings → Testnet Mode inschakelen → {cluster} kiezen. Haal daarna gratis test-SOL uit de faucet.',
    openFaucet: 'Faucet openen',
    retry: 'Opnieuw proberen',
    rpcError: 'Kan het Solana-RPC-endpoint niet bereiken ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Kies een',
    title: 'Getal',
    win: 'Win',
    in: 'over',
    taken: 'Al bezet in deze ronde',
    range: '0 tot {max}, één lot per getal',
    pad: 'Cijferblok',
    reset: 'Resetten',
    delete: 'Laatste cijfer wissen',
    dip: 'Willekeurig',
    searchCountry: 'Zoek een land',
    country: 'Land dat bij je lot wordt getoond',
    notSetUp: 'Dit spel is op dit cluster nog niet ingesteld.',
    paused: 'De verkoop van loten is gepauzeerd.',
    buy: 'Koop {number} voor ◎{price}',
    takenToday: '{number} is bezet',
    outOfRange: 'Getal buiten bereik',
    notEnough: 'Niet genoeg SOL',
    keys: 'Typ met 0–9, ⌫ wist, Enter koopt.',
    rent: 'Een lot houdt ook ◎{rent} aan rent voor zijn account vast, die je na de trekking terugkrijgt.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · sluit over',
    carried: 'Inclusief ◎{carry} doorgeschoven uit de vorige ronde',
    split: '80% naar de winnaar · {fee} huiscommissie · de rest naar de volgende ronde',
    inPlay: 'Getallen in het spel',
    empty: 'Nog geen loten',
    beFirst: 'Kies in deze ronde als eerste een getal.',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Spellen',
    title: 'Drie manieren om te spelen',
    description:
      'Dezelfde getallen, van 0 tot {max}. De winnaar krijgt 80% van de pot; de huiscommissie gaat van de rest af, en wat overblijft, schuift door naar de volgende ronde.',
    play: 'Spelen',
    daily: {
      name: 'Dagelijkse loterij',
      short: 'Dagelijks',
      description:
        'Elke dag een trekking na middernacht UTC. Het lot dat het dichtst bij het getrokken getal ligt, wint.',
    },
    hourly: {
      name: 'Uurloterij',
      short: 'Elk uur',
      description:
        'Elk uur een trekking, op het hele uur (UTC). Het lot dat het dichtst bij het getrokken getal ligt, wint.',
    },
    guess: {
      name: 'Raad het getal',
      short: 'Raden',
      description:
        'Geen deadline. Nieuwe pogingen worden om de paar seconden gecontroleerd tot er een het getal van de ronde vindt; dan begint er een nieuwe ronde.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Tot iemand het vindt',
    odds: 'Elke controle vindt het getal met een kans van de nieuwe pogingen gedeeld door de {n} getallen die nog niet geprobeerd zijn.',
    bought: 'Poging {number} is binnen. Ze wordt over een paar seconden gecontroleerd.',
    sealing: 'De laatste pogingen van ronde {day} verzegelen',
    checkNow: 'Nu controleren',
    checkHint:
      'Een bot controleert om de paar seconden nieuwe pogingen. Iedereen kan de controle uitvoeren; het kost netwerkkosten.',
    missed: 'Niet het getal: {numbers}',
    left: 'Het getal is een van de {n} getallen die nog niet geprobeerd zijn.',
    foundByYou: 'Je hebt het gevonden! {number} was het getal',
    foundByOther: 'Een andere speler heeft het getal gevonden',
    nextRound: 'Er is een nieuwe ronde met een nieuw getal te koop.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Geschiedenis',
    total: 'Totaal',
    games: 'spel | spellen',
    waiting: 'Wachten op de trekking',
    settle: 'Afwikkelen',
    settleDay: '{day} afwikkelen',
    anyone:
      'Iedereen kan een afgelopen ronde sluiten, trekken en uitbetalen. Het kost alleen netwerkkosten; het prijzengeld gaat altijd naar de winnaar.',
    rent: '{n} oud lot houdt ◎{sol} aan rent vast | {n} oude loten houden ◎{sol} aan rent vast',
    rentHint: 'Sluit ze om die SOL terug te krijgen. De ronde houdt haar resultaten.',
    getBack: 'Terughalen',
    winners: 'Winnaars',
    noWinners: 'Nog geen winnaars',
    firstDraw: 'De eerste winnaar verschijnt hier.',
    chart: 'Pot per ronde',
    chartEmpty: 'Nog geen afgeronde rondes.',
    chartLabel:
      'Pot van de laatste ronde; de lijst hieronder bevat elke waarde. | Pot van de laatste {n} rondes; de lijst hieronder bevat elke waarde.',
  },

  status: {
    open: 'Open',
    toClose: 'Wacht op sluiting',
    toDraw: 'Wacht op trekking',
    checking: 'Pogingen controleren',
    unpaid: 'Getrokken, onbetaald',
    paid: 'Uitbetaald',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Live',
    connecting: 'Verbinden',
    offline: 'Offline',
    atTable: '{n} aan tafel',
    picking: '{n} kiest | {n} kiezen',
    you: 'jij',
    joined: 'schoof aan',
    now: 'nu',
    empty: 'De tafel is open. Het volgende lot verschijnt hier zodra het binnenkomt.',
    joinedOne: 'Er is een nieuwe speler aan tafel aangeschoven',
    joinedMany: '{n} nieuwe speler is aan tafel aangeschoven | {n} nieuwe spelers zijn aan tafel aangeschoven',
    hereNow: '{n} nu hier',
    locked: '{who} legt {number} vast',
    potNow: 'De pot staat nu op ◎{pot} met {n} lot | De pot staat nu op ◎{pot} met {n} loten',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Bevestig in je wallet…',
    done: '{label}: klaar',
    cancelled: '{label}: geannuleerd',
    failed: '{label} mislukt',
    view: 'Transactie bekijken',
    buying: 'Aankoop van getal {number}',
    bought: 'Getal {number} is van jou. Veel geluk!',
    repin: 'Opnieuw vastleggen van het trekkingsslot voor {day}',
    closing: 'Sluiten van {day}',
    drawing: 'Trekking van {day}',
    paying: 'Uitbetaling aan de winnaar van {day}',
    paid: '◎{amount} uitbetaald aan de winnaar van {day}',
    settleFailed: 'Kon {day} niet afwikkelen',
    reclaiming: 'Terughalen van de rent van loten',
    slowSlot: 'Het cluster bereikt het trekkingsslot traag. Probeer het over een minuut opnieuw.',
    noWinner: 'Het winnende lot kon niet worden gevonden.',
  },

  wallet: {
    connect: 'Wallet koppelen',
    title: 'Koppel een wallet',
    description: 'Elke Solana-wallet die de Wallet Standard ondersteunt, werkt.',
    none: 'In deze browser is geen Solana-wallet gevonden. Installeer er een en laad de pagina daarna opnieuw:',
    failed: 'Kon {wallet} niet koppelen',
    copied: 'Adres gekopieerd',
    balance: 'Saldo',
    ticketsLeft: 'nog {n} lot | nog {n} loten',
    needMore: 'meer SOL nodig om te spelen',
    numbers: 'Jouw getallen in deze ronde',
    copy: 'Adres kopiëren',
    explorer: 'Explorer',
    play: 'Spelen',
    disconnect: 'Ontkoppelen',
  },

  round: {
    title: 'Ronde {day}',
    back: 'Terug naar het spel',
    notDate:
      'Dit is geen ronde van dit spel. Dagelijkse rondes heten YYYY-MM-DD, uurrondes YYYY-MM-DDTHH, en rondes van Raad het getal heten naar hun nummer.',
    kicker: 'Ronde',
    nobody: 'Niemand speelde in deze ronde',
    beFirst: 'Koop in deze ronde als eerste een lot.',
    onlyExists: 'Een ronde bestaat pas zodra het eerste lot ervan is verkocht.',
    pot: 'Pot',
    usd: '{usd} tegen de koers van vandaag',
    winner: 'Winnaar',
    won: '◎{payout} gewonnen · commissie ◎{fee}',
    unpaid: 'Nog niet uitbetaald',
    anyone: 'Iedereen kan deze ronde afronden. Het kost alleen netwerkkosten.',
    settle: 'Deze ronde afwikkelen',
    sold: 'Verkochte loten',
    price: 'Lotprijs',
    fee: 'Huiscommissie',
    slot: 'Vastgelegd slot',
    check: 'Controleer de trekking',
    formula: 'willekeur = sha256(entropie ‖ slothash ‖ trekkingsslot ‖ rondeadres)',
    recompute: 'Narekenen in mijn browser',
    entropy: 'Entropie (elke aankoop, op volgorde gehasht)',
    slotHash: 'Slothash van slot {slot} (door het programma gelezen uit de sysvar SlotHashes)',
    randomness: 'Willekeur',
    winning: 'Winnend lot',
    winningFormula: 'eerste 8 bytes als u64 mod {count} = {drawn}; het dichtstbijzijnde lot heeft {number}',
    guessFormula:
      'eerste 8 bytes als u64 mod {left} (getallen die nog niet geprobeerd zijn) = {r}, onder {batch} (pogingen in de controle): aankoop #{index} vond het getal',
    ok: 'De trekking klopt.',
    mismatch: 'Geen overeenkomst: het opgeslagen resultaat past niet bij de invoer.',
    got: 'Je browser kwam uit op {hash}… en getal {number}.',
    tickets: 'Loten',
    ticketsHint:
      'Loten die hun eigenaars na de uitbetaling hebben gesloten, staan hier niet meer; de ronde houdt de totalen bij.',
    noTickets: 'Geen open loten meer voor deze ronde.',
    account: 'Rondeaccount {address} · {day}',
  },

  country: {
    private: 'Privé',
  },

  errors: {
    rejected: 'Je hebt het verzoek in je wallet geannuleerd.',
    taken: 'Iemand heeft dit getal in deze ronde al. Kies een ander.',
    funds: 'Niet genoeg SOL in de wallet.',
    walletCluster:
      'Je wallet kon niet ondertekenen. In Phantom: Settings → Developer Settings → Testnet Mode inschakelen → Devnet kiezen, koppel daarna opnieuw en probeer het nog eens.',
    unknown: 'Er is iets misgegaan.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Alleen de authority kan dit doen.',
      invalidTicketPrice: 'De lotprijs moet minstens 0,002 SOL zijn.',
      feeTooHigh: 'De commissie ligt boven het maximum van 20%.',
      invalidMaxNumber: 'Het hoogste getal moet groter zijn dan nul.',
      paused: 'De verkoop van loten is gepauzeerd.',
      wrongRound: 'Loten kunnen alleen worden gekocht voor de ronde die in de verkoop is.',
      numberOutOfRange: 'Het getal valt buiten het bereik.',
      invalidCountry: 'Het land moet een ISO 3166-1 alpha-2-code in hoofdletters zijn.',
      roundNotOpen: 'De ronde is niet open.',
      roundNotOver: 'De ronde is nog niet afgelopen.',
      roundAlreadyDrawn: 'De ronde is al getrokken.',
      drawStillPossible: 'Het vastgelegde slot kan nog worden getrokken.',
      roundNotClosed: 'De ronde is niet gesloten.',
      targetSlotNotReached: 'Het vastgelegde slot is nog niet bereikt.',
      randomnessUnavailable:
        'De hash van het vastgelegde slot is nog niet leesbaar; probeer het zo opnieuw, of sluit de ronde opnieuw zodra die is verlopen.',
      roundNotDrawn: 'De ronde is nog niet getrokken.',
      notWinningTicket: 'Dit is niet het winnende lot.',
      roundNotSettled: 'De ronde is nog niet afgewikkeld.',
      overflow: 'Rekenkundige overloop.',
      priceChanged: 'De lotprijs is hoger dan de prijs die je hebt geaccepteerd.',
      feeAlreadyCollected: 'De commissie van deze ronde is al geïnd.',
      roundFull: 'Deze ronde heeft alle loten verkocht die ze kan bevatten.',
      nothingToCheck: 'Er zijn geen nieuwe pogingen om te controleren.',
      batchSealed: 'De laatste pogingen worden gecontroleerd; probeer het over een paar seconden opnieuw.',
      invalidGame: 'Onbekend spel.',
    },
  },

  legal: {
    kicker: 'Juridisch',
    updated: 'Laatst bijgewerkt op {date}',
    onThisPage: 'Op deze pagina',
    others: 'Andere juridische documenten',
    translated:
      'Deze pagina is een vertaling van het Engelse origineel. Als ze van elkaar verschillen, geldt de Engelse versie.',
    readEnglish: 'Lees het in het Engels',
    repository: 'broncoderepository',

    pages: {
      notice: {
        label: 'Juridische informatie',
        description: 'Wie S☉Lucky beheert, hoe je ons bereikt en welke documenten van toepassing zijn.',
      },
      terms: {
        label: 'Gebruiksvoorwaarden',
        description: 'De regels voor het gebruik van de site en het spelen, en wat het programma wel en niet belooft.',
      },
      privacy: {
        label: 'Privacybeleid',
        description: 'Wat openbaar is op Solana, wat onze servers zien en wat we nooit verzamelen.',
      },
      cookies: {
        label: 'Cookies & opslag',
        description: 'Geen cookies, geen trackers: de vijf instellingen die de app in je browser bewaart.',
      },
      play: {
        label: 'Verantwoord spelen',
        description: 'Hoe de kansen werken, en waar je hulp krijgt als spelen niet meer leuk is.',
      },
    },

    notice: {
      description: 'Wie S☉Lucky beheert, hoe je ons bereikt en welke documenten gelden als je het gebruikt.',
      operator: {
        title: 'Wie S☉Lucky beheert',
        body: 'S☉Lucky wordt gemaakt en beheerd door {operator}. Je bereikt ons per e-mail op {email} en leest meer over ons op {site}.',
      },
      software: {
        title: 'Het programma en de site',
        intro: 'S☉Lucky bestaat uit twee delen:',
        program:
          '{name}, een Solana-programma dat de loten verkoopt, de pot van elke dag bewaart en de winnaar uitbetaalt. Deze site gebruikt het programma op {address} op Solana {cluster}. Iedereen kan het rechtstreeks gebruiken, zonder deze site.',
        programName: 'Het programma',
        site: '{name}, die de openbare gegevens van het programma toont en je helpt transacties te versturen vanuit je eigen wallet. Hij bewaart nooit je sleutels of je SOL.',
        siteName: 'Deze site',
      },
      documents: {
        title: 'Documenten',
        intro: 'Wie de site gebruikt, aanvaardt deze documenten:',
      },
      security: {
        title: 'Een beveiligingsprobleem melden',
        body: 'Open alsjeblieft geen openbare issue. Mail naar {email} met als onderwerp {subject}, en test nooit met het geld van andere spelers: gebruik devnet of een lokale validator. Het beveiligingsbeleid, {file} in de {repository}, legt uit wat je moet vermelden en wat binnen de scope valt.',
      },
      license: {
        title: 'Opensourcelicentie',
        body: 'Het programma, de app en de beheerscripts zijn open source onder de MIT-licentie ({file} in de {repository}), © {years} {operator}. De licentie geldt voor de code; de {terms} gelden voor het gebruik van deze site.',
      },
    },

    terms: {
      description: 'De regels voor het gebruik van S☉Lucky, en wat het programma ervan wel en niet belooft.',
      agreement: {
        title: 'Deze voorwaarden',
        p1: 'Deze voorwaarden gelden als je de website en app van S☉Lucky gebruikt, beheerd door {operator} (“wij”, “ons”). Door ze te gebruiken, aanvaard je deze voorwaarden, samen met het {privacy} en de pagina {cookies}. Als je ze niet aanvaardt, gebruik de site dan niet.',
        p2: 'Het spel zelf is een Solana-programma: opensourcesoftware die op het Solana-netwerk draait, niet op onze servers. De site is één manier om het te gebruiken; iedereen kan het programma ook rechtstreeks gebruiken.',
      },
      eligibility: {
        title: 'Wie mag spelen',
        age: 'Je moet 18 jaar of ouder zijn.',
        legal:
          'Je mag alleen spelen waar loterijen en online kansspelen voor jou legaal zijn. Dat controleren is jouw verantwoordelijkheid; wij controleren niet waar je bent.',
        own: 'Speel niet voor iemand anders, en niet met SOL die niet van jou is.',
      },
      money: {
        title: 'Test-SOL en echte SOL',
        test: 'Deze site draait op {cluster}. Loten kosten test-SOL, dat gratis is via een faucet en geen waarde heeft: het kan niet worden ingewisseld voor echt geld, en ook niets wat je ermee wint.',
        real: 'Deze site draait op {cluster}. Loten kosten echte SOL, en potten worden uitbetaald in echte SOL.',
      },
      rounds: {
        title: 'Hoe een ronde werkt',
        intro: 'Het programma dwingt deze regels af; de site toont ze alleen:',
        day: 'S☉Lucky heeft drie spellen. In de dagelijkse loterij loopt er één ronde per UTC-dag, van 00:00 UTC tot de volgende middernacht; in de uurloterij één per UTC-uur. Bij Raad het getal heeft een ronde geen eindtijd: ze loopt tot een poging het getal ervan vindt.',
        number:
          'Een lot is één getal, van 0 tot het hoogste getal dat in de configuratie van het programma is ingesteld. Elk getal kan per ronde door één lot worden bezet.',
        price:
          'Elk spel heeft een eigen lotprijs en huiscommissie. Die worden, samen met het hoogste getal, overgenomen wanneer een ronde opent, en liggen voor die ronde vast. De commissie kan nooit meer zijn dan 20% van de pot. Als je koopt, betaal je nooit meer dan de prijs die je te zien kreeg.',
        pot: 'De prijs van elk lot gaat naar de pot van de ronde, die wordt bewaard door het eigen account van de ronde op Solana. In de loterijen wordt een willekeurig getal van 0 tot het hoogste getal getrokken en wint het lot dat er het dichtst bij ligt; bij een gelijkspel wint het laagste getal. Bij Raad het getal worden nieuwe pogingen in groepen gecontroleerd: een groep bevat het getal met een kans van zijn pogingen gedeeld door de getallen die nog niet geprobeerd zijn, dezelfde kans als bij een getal dat bij de opening van de ronde werd verborgen.',
        draw: 'Zodra een loterijronde is afgelopen, of zodra er nieuwe pogingen op een controle wachten, kan iedereen de ronde sluiten, trekken en uitbetalen. De eigenaar van het winnende lot ontvangt 80% van de pot, de huiscommissie gaat naar de treasury, en de rest blijft in het programma om in de volgende ronde van het spel te worden getrokken.',
        rent: 'Een lotaccount houdt ook een kleine borg voor rent vast, die je terugkrijgt door het lot te sluiten zodra de ronde ervan is uitbetaald. Het eerste lot van een ronde betaalt ook de rent van het account van de ronde, dat op Solana blijft als openbare registratie van de ronde. In de loterijen betaalt elk lot ook de rent van de 4 bytes die zijn getal in dat account inneemt; die krijg je niet terug.',
      },
      wallet: {
        title: 'Je wallet en transacties',
        own: 'Je speelt met je eigen wallet. Wij bewaren nooit je sleutels, je SOL of je loten, en we kunnen ze niet verplaatsen.',
        sign: 'Je ondertekent elke transactie zelf en betaalt de netwerkkosten van Solana. Bevestigde transacties zijn definitief: we kunnen ze niet annuleren, terugdraaien of terugbetalen.',
        public:
          'Het getal van een lot, het adres van de eigenaar en de landvlag die je ervoor kiest, zijn voorgoed openbaar op Solana. Het {privacy} legt uit wat dat betekent.',
        keys: 'Bewaar de sleutels van je wallet veilig. Niemand, ook wij niet, kan ze voor je herstellen.',
      },
      operator: {
        title: 'Wat de beheerder wel en niet kan',
        intro: 'De configuratie van het programma heeft een authority, die:',
        price:
          'per spel de lotprijs (minstens ◎0,002) en de huiscommissie (hoogstens 20%) kan wijzigen, met ingang van de volgende ronde van dat spel die opent;',
        pause:
          'de verkoop van loten kan pauzeren en hervatten. Een pauze stopt alleen nieuwe loten: rondes die al gespeeld zijn, kunnen nog steeds worden getrokken en uitbetaald;',
        other: 'de treasury, het hoogste getal en de authority zelf kan wijzigen.',
        cannot:
          'De code van het programma staat de authority, of wie dan ook, niet toe de pot van een ronde te nemen of hem ergens anders heen te sturen dan naar de eigenaar van het winnende lot, de treasury (voor de commissie) en de volgende ronde van het spel, meer te nemen dan de commissie, of een koper meer te rekenen dan de prijs die hij te zien kreeg.',
        upgrade:
          'Het programma is upgradebaar: wie de upgrade-authority ervan heeft, zou andere code kunnen deployen, dus je vertrouwt die persoon totdat het programma onveranderlijk wordt gemaakt of aan een multisig wordt overgedragen. De broncode van elke versie is openbaar, en een gedeployd programma kan daartegen worden gecontroleerd, zoals de sectie “Verifiable builds” in de README uitlegt.',
      },
      risks: {
        title: 'Risico’s',
        intro: 'Door te spelen aanvaard je dat:',
        bugs: 'software bugs kan bevatten, ook het programma, de app en je wallet, en een bug je je loten of je SOL kan kosten;',
        network:
          'Solana of het RPC-endpoint dat de site gebruikt traag, overbelast of offline kan zijn, en een transactie kan mislukken of pas aankomen nadat een ronde is gesloten;',
        draw: 'de trekking de hash gebruikt van een Solana-slot dat niemand kent als een ronde sluit of een groep pogingen wordt verzegeld. Spelers kunnen die niet voorspellen, maar de validator die dat slot produceert, zou hem kunnen beïnvloeden, en wie een ronde sluit, zou een ongunstige trekking kunnen tegenhouden totdat dat slot niet meer kan worden gelezen. Het is geen oracle voor verifieerbare willekeur;',
        site: 'de site op elk moment onbereikbaar kan zijn. Het programma, en je loten, blijven zonder de site werken;',
        law: 'wetten over loterijen en cryptoactiva per land verschillen en kunnen veranderen.',
      },
      use: {
        title: 'Eerlijk gebruik van de site',
        body: 'Val de site of de servers ervan niet aan en overbelast ze niet, probeer hun limieten niet te omzeilen, hinder andere spelers niet en gebruik de site niet om de wet te overtreden. We kunnen iedereen die dat doet de toegang ontzeggen.',
      },
      liability: {
        title: 'Geen garantie',
        body: 'De site en het programma worden geleverd “zoals ze zijn”, zonder enige garantie. Voor zover de wet het toestaat, zijn wij niet aansprakelijk voor enig verlies dat voortkomt uit het gebruik ervan, waaronder verloren loten, mislukte of vertraagde transacties, bugs, netwerkproblemen of een trekking die je oneerlijk vindt. Niets in deze voorwaarden beperkt een aansprakelijkheid die we volgens de wet niet mogen beperken.',
      },
      openSource: {
        title: 'Open source',
        body: 'Het programma, de app en de beheerscripts zijn open source onder de MIT-licentie: zie de {repository}. Die licentie geldt voor de code; deze voorwaarden gelden voor het gebruik van deze site.',
      },
      changes: {
        title: 'Wijzigingen',
        body: 'We kunnen deze voorwaarden bijwerken. De datum bovenaan toont de laatste wijziging, en de versie die hier staat, geldt vanaf die datum.',
      },
      contact: {
        title: 'Contact',
        body: 'Vragen over deze voorwaarden: {email}.',
      },
    },

    privacy: {
      description: 'Wat openbaar is op Solana, wat onze servers zien en wat we nooit verzamelen.',
      summary: {
        title: 'In het kort',
        account: 'Er is geen account, e-mail of registratie. Je speelt met een wallet.',
        cookies: 'De site plaatst geen cookies en laadt geen analytics, advertenties of trackers.',
        database: 'We houden geen database van spelers bij, en we verkopen of delen geen gegevens over jou.',
        public: 'Je loten zijn openbaar op Solana, en dat is zo bedoeld: daardoor kan iedereen het spel controleren.',
        controller: '{operator} beheert de site en is verantwoordelijk voor de gegevens die hij verwerkt.',
      },
      onChain: {
        title: 'Wat openbaar is op Solana',
        intro: 'Als je een lot koopt, leggen de transactie en het account van het lot openbaar vast:',
        address: 'je walletadres, en de transacties die het ondertekent;',
        number: 'het getal dat je koos, de ronde en het tijdstip van aankoop;',
        flag: 'de landvlag die je voor het lot koos, of geen als je die privé houdt.',
        ledger:
          'Wanneer een ronde wordt getrokken, legt het account ervan ook het adres van de winnaar vast, het winnende getal en de vlag daarvan, en de uitbetaling. Solana is een openbaar grootboek: iedereen kan deze gegevens lezen, veel mensen bewaren er kopieën van, en ze blijven er voorgoed staan. Een lot sluiten verwijdert het account ervan en geeft de rent terug, maar de transacties die het aanmaakten en sloten, blijven in het grootboek. Wij noch iemand anders kan dat wijzigen of verwijderen.',
        link: 'Een walletadres is niet je naam, maar het kan aan jou worden gekoppeld, bijvoorbeeld via een exchange die je hebt gebruikt. Gebruik een aparte wallet als je je spelen gescheiden wilt houden van de rest van je activiteit.',
      },
      servers: {
        title: 'Wat onze servers zien',
        visit: 'Elk bezoek',
        visitBody:
          'De site wordt gehost bij Cloudflare. Zoals elke website ontvangt hij je IP-adres, de user agent van je browser en de pagina’s die je opvraagt, om ze te leveren en de site te beschermen tegen misbruik. Cloudflare bewaart operationele logs voor beperkte tijd onder zijn {policy}. Wij gebruiken ze alleen om de site te laten draaien en te repareren.',
        policy: 'eigen privacybeleid',
        country: 'Je land',
        countryBody:
          'Cloudflare vertelt onze server uit welk land elk verzoek komt. De app vraagt dat één keer op, om de vlag voor je loten voor te stellen; je kunt die vóór de aankoop wijzigen of privé houden. De server leest alleen het land, niet je IP-adres, en bewaart het niet.',
        live: 'De live tafel op de pagina “Spelen”',
        liveBody:
          'Zolang de pagina “Spelen” open is, houdt je browser een verbinding met onze server, zodat spelers kunnen zien wie er nog meer is. Die verbinding deelt drie dingen met de andere mensen op de pagina: een willekeurige id alleen voor die verbinding, de vlag die je loten tonen (geen als je je land privé houdt), en of je een getal aan het invoeren bent, nooit het getal zelf. Er gaat geen walletadres of IP-adres in mee, en niets over de verbinding wordt opgeslagen of bewaard nadat die is gesloten.',
        price: 'De SOL-koers',
        priceBody:
          'Om potten in dollars te tonen, haalt onze server de SOL-koers op bij Coinbase, of bij CoinGecko als Coinbase niet antwoordt, en slaat die een minuut in de cache op. Deze verzoeken komen van onze server en bevatten niets over jou.',
        push: 'Meldingen van trekkingen',
        pushBody:
          'Als je meldingen voor een spel aanzet, geeft je browser onze server een push-abonnement: een adres bij de pushdienst van je browser (van Google, Mozilla, Apple of Microsoft, afhankelijk van de browser) en de sleutels om berichten ervoor te versleutelen. We bewaren het met je taal en de spellen die je koos, en verder niets: geen walletadres, geen IP-adres. Als een ronde van een van die spellen gewonnen is, stuurt onze server de uitslag versleuteld via die pushdienst, die hem onder zijn eigen beleid bij je browser bezorgt. Meldingen uitzetten verwijdert het abonnement, en we verwijderen het ook als de pushdienst laat weten dat het niet meer bestaat.',
      },
      thirdParties: {
        title: 'Diensten die je browser gebruikt',
        rpc: '{name}, waar de app het spel van leest en waarlangs ze je transacties verstuurt: {endpoint}. Het ontvangt je IP-adres en de accounts die de app opvraagt, waaronder dat van je wallet zodra je die koppelt, onder het beleid van de beheerder ervan.',
        rpcName: 'Een Solana-RPC-endpoint',
        rpcHost: '{host} op deze site',
        rpcPublic: 'het openbare endpoint van Solana voor {cluster}',
        wallet:
          '{name}, zoals Phantom, Solflare of Backpack, is software van een eigen maker, met een eigen beleid. De site vraagt hem alleen om te koppelen en de transacties te ondertekenen die jij goedkeurt.',
        walletName: 'Je wallet',
        links:
          '{name}: Solana Explorer, de Solana-faucet, GitHub en onze sociale accounts zijn andere sites, met hun eigen beleid.',
        linksName: 'Links die je opent',
        own: 'Lettertypen, geluiden en afbeeldingen komen van ons eigen domein, dus bij het laden van de site wordt met niemand anders contact gemaakt.',
      },
      browser: {
        title: 'Wat in je browser blijft',
        body: 'De app bewaart vijf instellingen in de lokale opslag van je browser: je thema, je laatste wallet, je landkeuze, de geluidsinstelling en je taal. De pagina {cookies} somt ze op.',
        cache:
          'Zodat ze ook zonder verbinding opent, bewaart de app kopieën van de pagina’s die je bezoekt en van haar eigen bestanden in de cacheopslag van je browser. Elke nieuwe versie van de site vervangt ze.',
      },
      purposes: {
        title: 'Waarom, en wat we nooit doen',
        body: 'We verwerken de gegevens hierboven alleen om de site te tonen, het spel te laten draaien dat je wilt spelen, de site veilig te houden en problemen op te lossen. We maken geen profielen, tonen geen advertenties, verkopen geen gegevens en delen ze niet met adverteerders.',
      },
      rights: {
        title: 'Je keuzes en rechten',
        flag: 'Je kunt spelen zonder landvlag: kies ervoor die privé te houden voordat je koopt.',
        clear:
          'Je kunt de instellingen in je browser op elk moment wissen, en een nieuwe wallet gebruiken wanneer je maar wilt.',
        law: 'Afhankelijk van waar je woont, heb je mogelijk het recht om persoonsgegevens over jou in te zien, te laten corrigeren of te laten verwijderen, of bezwaar te maken tegen hoe ze worden gebruikt. Mail naar {email} en we antwoorden. We bewaren bijna niets over jou, en we kunnen niet wijzigen of verwijderen wat op Solana staat.',
      },
      children: {
        title: 'Kinderen',
        body: 'S☉Lucky is voor mensen van 18 jaar en ouder. We verwerken niet bewust gegevens over iemand die jonger is.',
      },
      changes: {
        title: 'Wijzigingen en contact',
        body: 'We werken deze pagina bij wanneer de site verandert hoe hij met gegevens omgaat; de datum bovenaan toont de laatste wijziging. Vragen: {email}.',
      },
    },

    cookies: {
      description:
        'Geen cookies, geen trackers: de vijf instellingen die de app in je browser bewaart, en hoe je ze verwijdert.',
      none: {
        title: 'Geen cookies',
        p1: 'S☉Lucky plaatst geen cookies en laadt geen analytics-, advertentie- of trackingscripts. Het beveiligingsbeleid van de site staat alleen scripts van het eigen domein toe.',
        p2: 'Onze host, Cloudflare, kan strikt noodzakelijke beveiligingscookies plaatsen, zoals {cookie}, wanneer de botbescherming ervan aanstaat. Cloudflare gebruikt ze om mensen van bots te onderscheiden, zoals zijn {list} uitlegt.',
        list: 'cookielijst',
      },
      storage: {
        title: 'Wat de app in je browser bewaart',
        intro:
          'De app slaat een paar instellingen op in de lokale opslag van je browser, zodat ze er de volgende keer nog zijn. Ze blijven op je apparaat, met één uitzondering: de vlag die je kiest, komt op de loten die je koopt, en wordt aan de live tafel van de pagina “Spelen” getoond zolang je daar bent.',
        key: 'Sleutel',
        holds: 'Wat erin staat',
        saved: 'Opgeslagen',
        wallet: 'Je walletextensie bewaart haar eigen gegevens, onder het beleid van de maker ervan.',
        cache:
          'Zodat ze ook zonder verbinding opent, bewaart de app kopieën van de pagina’s die je bezoekt en van haar eigen bestanden in de cacheopslag van je browser; elke nieuwe versie van de site vervangt ze. Als je meldingen van trekkingen aanzet, bewaart je browser ook het push-abonnement tot je ze uitzet. De gegevens van deze site wissen verwijdert dat allemaal.',
      },
      keys: {
        theme: {
          holds: 'Je lichte of donkere thema.',
          when: 'Als je van thema wisselt.',
        },
        wallet: {
          holds:
            'De naam van de wallet die je het laatst koppelde en het adres ervan, zodat de app hem opnieuw kan koppelen.',
          when: 'Als je een wallet koppelt; verwijderd als je hem ontkoppelt.',
        },
        country: {
          holds: 'De landvlag die je voor je loten koos, of dat je die privé houdt.',
          when: 'Als je een vlag kiest.',
        },
        sound: {
          holds: 'Of geluiden aan of uit staan.',
          when: 'Als je het geluid uit- of aanzet.',
        },
        lang: {
          holds: 'De taal die je koos, zodat de app je niet opnieuw een andere aanbiedt.',
          when: 'Als je een taal kiest, of reageert op het aanbod om de site in jouw taal te lezen.',
        },
      },
      clear: {
        title: 'Verwijderen',
        disconnect: 'Ontkoppel je wallet in de app om {key} te verwijderen.',
        site: 'Wis de gegevens van deze site in de instellingen van je browser om ze allemaal te verwijderen.',
        private: 'In een privévenster worden ze verwijderd als je het sluit.',
        reset: 'Ze verwijderen zet alleen deze instellingen terug; je loten staan op Solana en blijven van jou.',
      },
      banner: {
        title: 'Waarom er geen cookiebanner is',
        body: 'Niets hier volgt je, en elke instelling hierboven bestaat omdat jij die hebt ingesteld. Er valt dus niets te accepteren of te weigeren.',
      },
    },

    play: {
      description: 'Hoe de kansen werken, en waar je hulp krijgt als spelen niet meer leuk is.',
      basics: {
        title: 'Voordat je speelt',
        age: 'S☉Lucky is voor mensen van 18 jaar en ouder, waar loterijen legaal zijn.',
        test: 'Deze site draait op Solana {cluster}: loten kosten test-SOL, dat gratis is en geen waarde heeft. Zo kun je goed zien hoe het spel werkt zonder iets uit te geven.',
        real: 'Deze site draait op Solana Mainnet: loten kosten echte SOL.',
        fun: 'Speel voor de lol, nooit om geld te verdienen of om verloren geld terug te winnen.',
      },
      odds: {
        title: 'Ken de kansen',
        same: 'In de loterijen wint het lot dat het dichtst bij een willekeurig getal ligt: je kans is het deel van het getallenbereik dat dichter bij jouw getallen ligt dan bij die van wie dan ook. Bij Raad het getal vindt elke controle het getal met een kans van de nieuwe pogingen gedeeld door de getallen die nog niet geprobeerd zijn.',
        label:
          'Geen enkel getal brengt meer geluk dan een ander: het getrokken getal kan met gelijke kans elk getal uit het bereik zijn.',
        fee: 'De winnaar ontvangt 80% van de pot. De huiscommissie, die het programma begrenst op 20%, gaat van de rest af, en wat overblijft, gaat naar de volgende ronde van het spel. Over alle spelers samen betalen loten dus het geld terug dat eraan is uitgegeven, min die commissie: gemiddeld levert een lot minder op dan het kost.',
        nothing: 'Niets op de site verandert deze kansen.',
      },
      final: {
        title: 'Loten zijn definitief',
        body: 'Een lot kan na aankoop niet worden geannuleerd of terugbetaald. Het enige wat je terugkrijgt is de kleine borg voor rent, door het lot te sluiten nadat de ronde ervan is uitbetaald.',
      },
      habits: {
        title: 'Houd het leuk',
        budget: 'Bepaal vooraf hoeveel je bereid bent te verliezen, en stop als dat op is.',
        chase: 'Jaag nooit verliezen na, en speel nooit met geleend geld of geld dat je nodig hebt.',
        mood: 'Speel niet als je van streek of moe bent, of hebt gedronken.',
        breaks: 'Neem pauzes, en houd spelen één onderdeel van je leven tussen vele andere.',
      },
      limits: {
        title: 'Je eigen limieten stellen',
        intro:
          'S☉Lucky heeft geen accounts, dus het kan geen limieten instellen of je uitsluiten. Je kunt je eigen limieten stellen:',
        wallet: 'Houd een aparte wallet aan met alleen wat je bereid bent uit te geven.',
        block: 'Gebruik een websiteblokkering of het ouderlijk toezicht van je apparaat om de site te blokkeren.',
        trust:
          'Vertel het aan iemand die je vertrouwt, en vraag die persoon je te helpen je aan je limieten te houden.',
      },
      help: {
        title: 'Hulp zoeken',
        intro:
          'Als spelen niet meer leuk is, of als iemand in je omgeving zich er zorgen over maakt, bieden deze onafhankelijke organisaties gratis en vertrouwelijke hulp. We zijn niet aan hen verbonden.',
        worldwide: 'Wereldwijd: bijeenkomsten en contacten per land.',
        us: 'Verenigde Staten.',
        uk: 'Verenigd Koninkrijk.',
        emergency: 'Als jij of iemand anders in direct gevaar is, bel dan het lokale alarmnummer.',
      },
    },
  },
};

export default nl;
