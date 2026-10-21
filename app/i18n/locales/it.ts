/** Italian: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const it: Dict = {
  meta: {
    title: 'S☉Lucky: giochi di lotteria su Solana',
    description:
      'Scegli un numero nella lotteria quotidiana o in quella oraria, oppure scova il numero nascosto. Il vincitore si prende l’80% del montepremi. Ogni biglietto, montepremi ed estrazione vive su Solana e chiunque può verificarlo.',
    ogImageAlt: 'S☉Lucky, giochi di lotteria su Solana',
  },

  nav: {
    play: 'Gioca',
    how: 'Come funziona',
    fairness: 'Equità',
    faq: 'FAQ',
  },

  lang: {
    label: 'Lingua',
    choose: 'Lingua: {name}',
  },

  update: {
    title: 'Una nuova versione è pronta',
    hint: 'Ricarica per averla subito. Si carica anche da sola al prossimo cambio di pagina.',
    reload: 'Ricarica',
  },

  install: {
    label: 'Installa l’app',
    ios: 'Per installare S☉Lucky, apri il menu Condividi del tuo browser e scegli Aggiungi alla schermata Home.',
  },

  push: {
    on: 'Avvisami quando viene vinto un round di questo gioco',
    off: 'Disattiva le notifiche di questo gioco',
    enabled: 'Notifiche attive',
    enabledHint: '{game}: riceverai una notifica ogni volta che viene vinto un round.',
    disabled: 'Notifiche disattivate',
    blocked: 'Le notifiche sono bloccate per questo sito. Consentile nelle impostazioni del tuo browser, poi riprova.',
    failed: 'Impossibile modificare le notifiche. Riprova.',
    lottery: 'Round {round}: è stato estratto il {drawn}. Il biglietto più vicino, il {winning}, vince ◎{prize}.',
    guess: 'Round {round}: il numero era il {winning}. Il tentativo che l’ha trovato vince ◎{prize}.',
  },

  header: {
    beta: 'Beta',
    getSol: 'Ottieni SOL',
    faucetTip: 'Faucet provvisorio della beta: ottieni SOL di test gratuiti per giocare',
    mute: 'Disattiva i suoni',
    unmute: 'Attiva i suoni',
  },

  faucet: {
    connectFirst: 'Prima collega un wallet',
    connectFirstHint: 'Poi tocca Ottieni SOL per ricaricarlo con SOL di test.',
    request: 'Richiedi SOL di test dal faucet',
    requestHint: 'L’indirizzo del tuo wallet è stato copiato. Incollalo se il campo è vuoto, poi conferma.',
    openAgain: 'Riapri',
    airdropped: 'Airdrop di ◎1 ricevuto',
    airdroppedHint: 'I SOL di test sono arrivati su {cluster}. Ora puoi comprare biglietti.',
    failed: 'Airdrop non riuscito',
    slow: 'L’airdrop è stato accettato, ma il saldo non si è ancora aggiornato. Aggiorna tra un momento.',
  },

  footer: {
    license: 'Licenza MIT',
    program: 'Programma {address} su {cluster}.',
    age: 'Vietato ai minori di 18 anni. Gioca per divertimento, e solo dove le lotterie sono legali.',
    legal: 'Legale',
    languages: 'Lingue',
    source: 'Codice sorgente',
    builtOn: 'Costruito su {solana}',
    madeBy: 'Realizzato da {nexow}',
  },

  home: {
    kicker: 'Giochi di lotteria su Solana',
    title: 'Scegli un numero.',
    titleEnd: 'Vinci a mezzanotte.',
    lead: 'Un’estrazione al giorno, un’estrazione ogni ora e un numero nascosto da scovare. Il vincitore si prende l’80% del montepremi, e il resto passa al round successivo. Ogni biglietto, ogni lamport e ogni estrazione vivono su Solana, dove chiunque può verificarli.',
    playNow: 'Gioca ora',
    howItWorks: 'Come funziona',
    program: 'Programma',
    cluster: 'Cluster',
    draw: 'Estrazione',
    dialCaption:
      'Ogni punto è uno dei biglietti di oggi: lungo il quadrante in base all’ora dell’acquisto, verso l’esterno in base al suo numero.',

    how: {
      tag: 'Come funziona',
      title: 'Quattro passi, un’estrazione al giorno',
      description:
        'I round seguono il calendario UTC: uno nuovo si apre alle 00:00 UTC e viene estratto subito dopo la mezzanotte successiva.',
      opens: 'Apertura del round',
      draw: 'Estrazione',
      now: 'Ora',
      steps: {
        wallet: {
          title: 'Collega un wallet',
          description:
            'Phantom, Solflare, Backpack o qualsiasi wallet compatibile con il Wallet Standard. Niente account, niente email.',
          when: 'In qualsiasi momento',
        },
        number: {
          title: 'Scegli il tuo numero',
          description:
            'Qualsiasi numero da 0 a {max}. Ogni numero può appartenere a un solo biglietto al giorno, quindi sii veloce.',
          when: 'Fino a mezzanotte UTC',
        },
        pot: {
          title: 'Guarda crescere il montepremi',
          description:
            'Ogni biglietto aggiunge il suo prezzo al montepremi, custodito dall’account del round su Solana. Nessun altro può spostarlo.',
          when: 'Tutto il giorno',
        },
        win: {
          title: 'Vinci a mezzanotte UTC',
          description:
            'Viene estratto un numero a caso, e il biglietto più vicino vince l’80% del montepremi. La commissione della casa esce dal resto, e ciò che avanza passa al round del giorno dopo.',
          when: 'Subito dopo la mezzanotte UTC',
        },
      },
    },

    fairness: {
      tag: 'Equità',
      title: 'Non fidarti di noi. Verifica.',
      description:
        'S☉Lucky è un programma Solana, non un server che custodisce i tuoi soldi. Queste regole sono imposte dal suo codice.',
      rules: {
        locked: {
          title: 'Il montepremi è bloccato nel programma',
          description:
            'I soldi dei biglietti vanno dritti all’account del round. Il programma ne paga solo l’80% al proprietario del biglietto vincente, la commissione alla tesoreria e il resto al round successivo del gioco. L’operatore non può prelevarli.',
        },
        draw: {
          title: 'Un’estrazione che nessuno può prevedere',
          description:
            'Ogni acquisto viene mescolato nell’entropia del round. Quando un round finisce, fissa uno slot qualche secondo nel futuro; l’hash di quello slot, sconosciuto a tutti fino ad allora, sceglie il numero con cui si misurano i biglietti.',
        },
        anyone: {
          title: 'Chiunque può portarla a termine',
          description:
            'Chiudere, estrarre e pagare sono operazioni aperte a tutti. Se domani l’operatore sparisse, qualsiasi giocatore potrebbe comunque concludere ogni round.',
        },
        browser: {
          title: 'Verificabile nel tuo browser',
          description:
            'La pagina di ogni round ricalcola l’estrazione dai dati pubblici: l’entropia, l’hash dello slot, il numero estratto e il biglietto più vicino. Stessi input, stesso vincitore.',
        },
        limits: {
          title: 'Limiti rigidi per la casa',
          description:
            'Il programma paga sempre al vincitore l’80% del montepremi e limita la commissione al 20%. Le modifiche di prezzo e commissione valgono solo per i round aperti in seguito, e chi compra non paga mai più del prezzo che gli è stato mostrato.',
        },
        open: {
          title: 'Open source',
          description: 'Il programma, l’app e gli script dell’operatore sono pubblici, con test per ogni regola.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Domande',
      description: 'Ancora dubbi? Il programma, l’app e gli script dell’operatore sono open source.',
      readCode: 'Leggi il codice',
      items: {
        real: {
          q: 'Sono soldi veri?',
          a: 'L’app pubblica gira sulla devnet di Solana, dove i SOL sono soldi di test gratuiti presi da faucet.solana.com. Il programma funziona allo stesso modo sulla mainnet, ma gestire una lotteria con soldi veri richiede le licenze adeguate nei luoghi in cui operi.',
        },
        price: {
          q: 'Quanto costa un biglietto?',
          a: 'Il prezzo di ogni gioco è fissato on-chain e mostrato nella sua pagina Gioca. Oltre al prezzo, l’account di un biglietto contiene un piccolo deposito di rent, che recuperi chiudendo il biglietto una volta pagato il round. Il primo biglietto di un round paga anche il rent dell’account del round, che resta on-chain come suo registro pubblico; nelle lotterie, ogni biglietto paga anche i 4 byte che il suo numero occupa lì.',
        },
        odds: {
          q: 'Come si calcolano le mie probabilità?',
          a: 'Nelle lotterie vince il biglietto più vicino al numero estratto, quindi la tua probabilità è la parte dell’intervallo di numeri più vicina ai tuoi numeri che a quelli di chiunque altro: un numero lontano dagli altri biglietti ne copre una parte maggiore. In Indovina il numero, ogni verifica trova il numero con una probabilità pari ai nuovi tentativi divisi per i numeri non ancora provati.',
        },
        draw: {
          q: 'E se nessuno estrae il round?',
          a: 'Un piccolo bot (il crank) chiude, estrae e paga ogni round delle lotterie pochi secondi dopo la sua fine, e verifica i nuovi tentativi ogni pochi secondi. Chiunque può fare lo stesso dalla pagina Gioca. Se lo slot fissato diventa troppo vecchio per essere letto (circa tre minuti), il round può essere chiuso di nuovo per fissarne uno nuovo; il programma lo consente solo quando è dimostrabile che il vecchio slot è fuori portata.',
        },
        country: {
          q: 'Perché mostrate il mio paese?',
          a: 'S☉Lucky ha sempre mostrato una bandiera accanto a ogni biglietto. Ti suggeriamo il paese in base alla tua connessione al nostro host, senza alcuna consultazione di terzi, e puoi cambiarlo o tenerlo privato prima di comprare. Viene salvato on-chain con il tuo biglietto.',
        },
        validator: {
          q: 'Un validatore può truccare l’estrazione?',
          a: 'I giocatori no: l’hash vincente non esiste quando le vendite si chiudono. Il validatore che produce lo slot fissato potrebbe influenzarlo, scegliendo cosa entra in quel blocco o saltandolo. È accettabile per un gioco con soldi di test; per montepremi con soldi veri, l’estrazione dovrebbe usare un oracolo di casualità verificabile, e il README spiega dove collegarne uno.',
        },
      },
    },

    cta: {
      title: 'Il montepremi di oggi ti aspetta',
      description: 'Scegli un numero che nessuno ha ancora preso. Buona fortuna!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Un’estrazione al giorno · Estrazione dopo la mezzanotte UTC · Ogni biglietto su Solana',
    draw: 'Estrazione',
    pot: 'Montepremi di oggi',
    toDraw: 'all’estrazione · {day}',
    tickets: '{n} biglietto oggi | {n} biglietti oggi',
    entropy: 'Entropia · {cluster}',
    entropyTitle: 'Entropia: {hex}',
    noTickets: 'ancora nessun biglietto',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Nuovo biglietto',
    rules: {
      daily: 'Nuovo round ogni giorno alle 00:00 UTC',
      hourly: 'E uno ogni ora',
      pot: 'Il numero più vicino vince l’80% del montepremi',
      carry: 'Il resto passa al round successivo',
      guess: 'Indovina il numero: nessuna scadenza, finché qualcuno non lo trova',
      numbers: 'Numeri da 0 a {max}',
      fee: 'Commissione della casa limitata al 20% dal programma',
      anyone: 'Chiunque può chiudere, estrarre e pagare un round',
      check: 'Ricalcola ogni estrazione nel tuo browser',
      open: 'Open source',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Ricevuta dell’estrazione',
    round: 'Round',
    noneYet: 'nessuno ancora liquidato',
    tickets: 'Biglietti',
    pot: 'Montepremi',
    entropy: 'Entropia',
    slotHash: 'Hash dello slot · slot {slot}',
    formula: 'sha256(entropia ‖ hash dello slot ‖ slot ‖ round) =',
    mod: 'primi 8 byte come u64 mod {count} = {drawn}',
    ticketCount: 'numeri',
    closest: 'biglietto più vicino: {number}',
    number: 'Numero',
    paidTo: 'Pagato a',
    payout: 'Vincita',
    check: 'Verifica questa estrazione',
    roundPage: 'Pagina del round',
    nextDraw: 'Prossima estrazione dopo le 00:00 UTC',
    ok: 'Ricalcolato nel tuo browser: stesso hash, vince il numero {number}.',
    mismatch: 'L’hash ricalcolato nel tuo browser non corrisponde a questo round.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Biglietti',
    players: 'Giocatori',
    countries: 'Paesi',
    ticket: 'Biglietto',
    yourTickets: 'I tuoi biglietti',
    winChance: 'Prob. di vincita',
    chance: 'Probabilità',
    todaysPot: 'Montepremi',
    checked: 'Verificati',
    waiting: 'In attesa',
    numbersLeft: 'Numeri rimasti',
    winners: 'Vincitori',
    averagePot: 'Montepremi medio',
    biggestPot: 'Montepremi più alto',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: 'Tempo rimasto: {time}',
  },

  play: {
    title: 'Gioca',
    description:
      'Scegli un numero nella lotteria quotidiana o in quella oraria, oppure scova quello nascosto, e guarda il montepremi crescere in diretta su Solana.',
    testMoney: 'Stai giocando su Solana {cluster}: i biglietti costano SOL di test senza alcun valore reale.',
    localFunds: 'Punta il tuo wallet su {url}, poi ricaricalo con: {command}',
    phantomFunds:
      'In Phantom: Settings → Developer Settings → attiva Testnet Mode → seleziona {cluster}. Poi ottieni SOL di test gratuiti dal faucet.',
    openFaucet: 'Apri il faucet',
    retry: 'Riprova',
    rpcError: 'Impossibile raggiungere l’endpoint RPC di Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Scegli un',
    title: 'Numero',
    win: 'Vinci',
    in: 'tra',
    taken: 'Già preso in questo round',
    range: 'Da 0 a {max}, un biglietto per numero',
    pad: 'Tastierino numerico',
    reset: 'Azzera',
    delete: 'Cancella l’ultima cifra',
    dip: 'A caso',
    searchCountry: 'Cerca un paese',
    country: 'Paese mostrato con il tuo biglietto',
    notSetUp: 'Questo gioco non è ancora configurato su questo cluster.',
    paused: 'La vendita dei biglietti è in pausa.',
    buy: 'Compra il numero {number} per ◎{price}',
    takenToday: 'Il numero {number} è preso',
    outOfRange: 'Numero fuori intervallo',
    notEnough: 'SOL insufficienti',
    keys: 'Tasti 0–9 per digitare, ⌫ per cancellare, Invio per comprare.',
    rent: 'Un biglietto trattiene anche ◎{rent} di rent dell’account, che recuperi dopo l’estrazione.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · chiude tra',
    carried: 'Include ◎{carry} riportati dal round precedente',
    split: '80% al vincitore · {fee} di commissione della casa · il resto al round successivo',
    inPlay: 'Numeri in gioco',
    empty: 'Ancora nessun biglietto',
    beFirst: 'Sii la prima persona a scegliere un numero in questo round.',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Giochi',
    title: 'Tre modi di giocare',
    description:
      'Stessi numeri, da 0 a {max}. Il vincitore si prende l’80% del montepremi; la commissione della casa esce dal resto, e ciò che avanza passa al round successivo.',
    play: 'Gioca',
    daily: {
      name: 'Lotteria quotidiana',
      short: 'Quotidiana',
      description:
        'Un’estrazione ogni giorno dopo la mezzanotte UTC. Vince il biglietto più vicino al numero estratto.',
    },
    hourly: {
      name: 'Lotteria oraria',
      short: 'Oraria',
      description:
        'Un’estrazione ogni ora, allo scoccare dell’ora (UTC). Vince il biglietto più vicino al numero estratto.',
    },
    guess: {
      name: 'Indovina il numero',
      short: 'Indovina',
      description:
        'Nessuna scadenza. I nuovi tentativi vengono verificati ogni pochi secondi finché uno non trova il numero del round; poi inizia un nuovo round.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Finché qualcuno non lo trova',
    odds: 'Ogni verifica trova il numero con una probabilità pari ai nuovi tentativi divisi per i {n} numeri non ancora provati.',
    bought: 'Il tentativo {number} è in gioco. Viene verificato tra pochi secondi.',
    sealing: 'Sigillatura degli ultimi tentativi del round {day}',
    checkNow: 'Verifica ora',
    checkHint:
      'Un bot verifica i nuovi tentativi ogni pochi secondi. Chiunque può avviare la verifica; costa le commissioni di rete.',
    missed: 'Non è il numero: {numbers}',
    left: 'Il numero è uno dei {n} numeri non ancora provati.',
    foundByYou: 'L’hai trovato! Il numero era il {number}',
    foundByOther: 'Un altro giocatore ha trovato il numero',
    nextRound: 'È in vendita un nuovo round con un nuovo numero.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Cronologia',
    total: 'Totale',
    games: 'partita | partite',
    waiting: 'In attesa dell’estrazione',
    settle: 'Liquida',
    settleDay: 'Liquida il {day}',
    anyone:
      'Chiunque può chiudere, estrarre e pagare un round concluso. Costa solo le commissioni di rete; il premio va sempre al vincitore.',
    rent: '{n} vecchio biglietto trattiene ◎{sol} di rent | {n} vecchi biglietti trattengono ◎{sol} di rent',
    rentHint: 'Chiudili per riavere quei SOL. Il round conserva i suoi risultati.',
    getBack: 'Recuperali',
    winners: 'Vincitori',
    noWinners: 'Ancora nessun vincitore',
    firstDraw: 'Il primo vincitore comparirà qui.',
    chart: 'Montepremi per round',
    chartEmpty: 'Ancora nessun round concluso.',
    chartLabel:
      'Montepremi dell’ultimo round; l’elenco qui sotto riporta ogni valore. | Montepremi degli ultimi {n} round; l’elenco qui sotto riporta ogni valore.',
  },

  status: {
    open: 'Aperto',
    toClose: 'In attesa di chiusura',
    toDraw: 'In attesa di estrazione',
    checking: 'Verifica dei tentativi',
    unpaid: 'Estratto, non pagato',
    paid: 'Pagato',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'In diretta',
    connecting: 'Connessione',
    offline: 'Offline',
    atTable: '{n} al tavolo',
    picking: '{n} sta scegliendo | {n} stanno scegliendo',
    you: 'tu',
    joined: 'si è unito',
    now: 'ora',
    empty: 'Il tavolo è aperto. Il prossimo biglietto compare qui appena arriva.',
    joinedOne: 'Un nuovo giocatore si è unito al tavolo',
    joinedMany: '{n} nuovo giocatore si è unito al tavolo | {n} nuovi giocatori si sono uniti al tavolo',
    hereNow: '{n} qui ora',
    locked: '{who} ha giocato il numero {number}',
    potNow: 'Il montepremi ora è di ◎{pot} con {n} biglietto | Il montepremi ora è di ◎{pot} con {n} biglietti',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Conferma nel tuo wallet…',
    done: '{label}: fatto',
    cancelled: '{label}: annullato',
    failed: '{label}: non riuscito',
    view: 'Vedi la transazione',
    buying: 'Acquisto del numero {number}',
    bought: 'Il numero {number} è tuo. Buona fortuna!',
    repin: 'Nuovo fissaggio dello slot di estrazione del {day}',
    closing: 'Chiusura del {day}',
    drawing: 'Estrazione del {day}',
    paying: 'Pagamento del vincitore del {day}',
    paid: 'Vincita di ◎{amount} pagata al vincitore del {day}',
    settleFailed: 'Impossibile liquidare il {day}',
    reclaiming: 'Restituzione del rent dei biglietti',
    slowSlot: 'Il cluster è lento a raggiungere lo slot di estrazione. Riprova tra un minuto.',
    noWinner: 'Impossibile trovare il biglietto vincente.',
  },

  wallet: {
    connect: 'Collega wallet',
    title: 'Collega un wallet',
    description: 'Funziona qualsiasi wallet Solana che supporti il Wallet Standard.',
    none: 'In questo browser non è stato trovato nessun wallet Solana. Installane uno, poi ricarica la pagina:',
    failed: 'Impossibile collegare {wallet}',
    copied: 'Indirizzo copiato',
    balance: 'Saldo',
    ticketsLeft: '{n} biglietto rimanente | {n} biglietti rimanenti',
    needMore: 'servono più SOL per giocare',
    numbers: 'I tuoi numeri in questo round',
    copy: 'Copia indirizzo',
    explorer: 'Explorer',
    play: 'Gioca',
    disconnect: 'Disconnetti',
  },

  round: {
    title: 'Round del {day}',
    back: 'Torna al gioco',
    notDate:
      'Questo non è un round di questo gioco. I round quotidiani si chiamano YYYY-MM-DD, quelli orari YYYY-MM-DDTHH e quelli di Indovina il numero con il loro numero.',
    kicker: 'Round',
    nobody: 'Nessuno ha giocato in questo round',
    beFirst: 'Sii la prima persona a comprare un biglietto in questo round.',
    onlyExists: 'Un round esiste solo dopo che è stato venduto il suo primo biglietto.',
    pot: 'Montepremi',
    usd: '{usd} al prezzo di oggi',
    winner: 'Vincitore',
    won: 'Vincita ◎{payout} · commissione ◎{fee}',
    unpaid: 'Non ancora pagato',
    anyone: 'Chiunque può concludere questo round. Costa solo le commissioni di rete.',
    settle: 'Liquida questo round',
    sold: 'Biglietti venduti',
    price: 'Prezzo del biglietto',
    fee: 'Commissione della casa',
    slot: 'Slot fissato',
    check: 'Verifica l’estrazione',
    formula: 'casualità = sha256(entropia ‖ hash dello slot ‖ slot di estrazione ‖ indirizzo del round)',
    recompute: 'Ricalcola nel mio browser',
    entropy: 'Entropia (ogni acquisto, sottoposto a hash in ordine)',
    slotHash: 'Hash dello slot {slot} (letto dal programma dalla sysvar SlotHashes)',
    randomness: 'Casualità',
    winning: 'Biglietto vincente',
    winningFormula: 'primi 8 byte come u64 mod {count} = {drawn}; il biglietto più vicino ha il {number}',
    guessFormula:
      'primi 8 byte come u64 mod {left} (numeri non ancora provati) = {r}, sotto {batch} (tentativi nella verifica): l’acquisto #{index} ha trovato il numero',
    ok: 'L’estrazione è corretta.',
    mismatch: 'Discrepanza: il risultato salvato non corrisponde agli input.',
    got: 'Il tuo browser ha ottenuto {hash}… e il numero {number}.',
    tickets: 'Biglietti',
    ticketsHint:
      'I biglietti chiusi dai proprietari dopo il pagamento non compaiono più qui; il round conserva i totali.',
    noTickets: 'Nessun biglietto aperto rimasto per questo round.',
    account: 'Account del round {address} · {day}',
  },

  country: {
    private: 'Privato',
  },

  errors: {
    rejected: 'Hai annullato la richiesta nel tuo wallet.',
    taken: 'Qualcuno ha già questo numero in questo round. Scegline un altro.',
    funds: 'SOL insufficienti nel wallet.',
    walletCluster:
      'Il tuo wallet non è riuscito a firmare. In Phantom: Settings → Developer Settings → attiva Testnet Mode → seleziona Devnet, poi ricollegalo e riprova.',
    unknown: 'Qualcosa è andato storto.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Solo l’autorità può farlo.',
      invalidTicketPrice: 'Il prezzo del biglietto deve essere di almeno 0,002 SOL.',
      feeTooHigh: 'La commissione supera il limite del 20%.',
      invalidMaxNumber: 'Il numero più alto deve essere maggiore di zero.',
      paused: 'La vendita dei biglietti è in pausa.',
      wrongRound: 'I biglietti si possono comprare solo per il round in vendita.',
      numberOutOfRange: 'Il numero è fuori intervallo.',
      invalidCountry: 'Il paese deve essere un codice ISO 3166-1 alpha-2 in maiuscolo.',
      roundNotOpen: 'Il round non è aperto.',
      roundNotOver: 'Il round non è ancora finito.',
      roundAlreadyDrawn: 'Il round è già stato estratto.',
      drawStillPossible: 'L’estrazione sullo slot fissato è ancora possibile.',
      roundNotClosed: 'Il round non è chiuso.',
      targetSlotNotReached: 'Lo slot fissato non è ancora stato raggiunto.',
      randomnessUnavailable:
        'L’hash dello slot fissato non è ancora leggibile; riprova tra poco, oppure chiudi di nuovo il round quando lo slot è scaduto.',
      roundNotDrawn: 'Il round non è stato estratto.',
      notWinningTicket: 'Questo non è il biglietto vincente.',
      roundNotSettled: 'Il round non è stato liquidato.',
      overflow: 'Overflow aritmetico.',
      priceChanged: 'Il prezzo del biglietto è più alto di quello che hai accettato.',
      feeAlreadyCollected: 'La commissione di questo round è già stata riscossa.',
      roundFull: 'Questo round ha venduto tutti i biglietti che può contenere.',
      nothingToCheck: 'Non ci sono nuovi tentativi da verificare.',
      batchSealed: 'Gli ultimi tentativi sono in verifica; riprova tra qualche secondo.',
      invalidGame: 'Gioco sconosciuto.',
    },
  },

  legal: {
    kicker: 'Legale',
    updated: 'Ultimo aggiornamento: {date}',
    onThisPage: 'In questa pagina',
    others: 'Altri documenti legali',
    translated:
      'Questa pagina è una traduzione dell’originale inglese. In caso di differenze, fa fede la versione inglese.',
    readEnglish: 'Leggila in inglese',
    repository: 'repository del codice sorgente',

    pages: {
      notice: {
        label: 'Note legali',
        description: 'Chi gestisce S☉Lucky, come contattarci e i documenti che si applicano.',
      },
      terms: {
        label: 'Termini di servizio',
        description: 'Le regole per usare il sito e giocare, e cosa il programma promette e non promette.',
      },
      privacy: {
        label: 'Informativa sulla privacy',
        description: 'Cosa è pubblico su Solana, cosa vedono i nostri server e cosa non raccogliamo mai.',
      },
      cookies: {
        label: 'Cookie e archiviazione',
        description: 'Niente cookie, niente tracker: le cinque impostazioni che l’app conserva nel tuo browser.',
      },
      play: {
        label: 'Gioco responsabile',
        description: 'Come funzionano le probabilità, e dove trovare aiuto se giocare smette di essere divertente.',
      },
    },

    notice: {
      description: 'Chi gestisce S☉Lucky, come contattarci e i documenti che si applicano quando lo usi.',
      operator: {
        title: 'Chi gestisce S☉Lucky',
        body: 'S☉Lucky è realizzato e gestito da {operator}. Puoi scriverci via email a {email} e saperne di più su di noi visitando {site}.',
      },
      software: {
        title: 'Il programma e il sito',
        intro: 'S☉Lucky è composto da due parti:',
        program:
          '{name}, un programma Solana che vende i biglietti, custodisce il montepremi di ogni giorno e paga il vincitore. Questo sito usa il programma all’indirizzo {address} su Solana {cluster}. Chiunque può usarlo direttamente, senza questo sito.',
        programName: 'Il programma',
        site: '{name}, che mostra i dati pubblici del programma e ti aiuta a inviare transazioni dal tuo wallet. Non custodisce mai le tue chiavi né i tuoi SOL.',
        siteName: 'Questo sito',
      },
      documents: {
        title: 'Documenti',
        intro: 'Usare il sito significa accettare questi documenti:',
      },
      security: {
        title: 'Segnalare un problema di sicurezza',
        body: 'Per favore, non aprire una issue pubblica. Scrivi a {email} con oggetto {subject}, e non fare mai test sui fondi di altri giocatori: usa la devnet o un validatore locale. La politica di sicurezza, {file} nel {repository}, spiega cosa includere e cosa rientra nell’ambito.',
      },
      license: {
        title: 'Licenza open source',
        body: 'Il programma, l’app e gli script dell’operatore sono open source con licenza MIT ({file} nel {repository}), © {years} {operator}. La licenza riguarda il codice; i {terms} regolano l’uso di questo sito.',
      },
    },

    terms: {
      description: 'Le regole per usare S☉Lucky, e cosa il suo programma promette e non promette.',
      agreement: {
        title: 'Questi termini',
        p1: 'Questi termini si applicano quando usi il sito web e l’app di S☉Lucky, gestiti da {operator} («noi»). Usando il sito, accetti questi termini, insieme all’{privacy} e alla pagina {cookies}. Se non li accetti, non usare il sito.',
        p2: 'Il gioco in sé è un programma Solana: software open source che gira sulla rete Solana, non sui nostri server. Il sito è un modo per usarlo; chiunque può anche usare il programma direttamente.',
      },
      eligibility: {
        title: 'Chi può giocare',
        age: 'Devi avere almeno 18 anni.',
        legal:
          'Puoi giocare solo dove le lotterie e i giochi d’azzardo online sono legali per te. Verificarlo è una tua responsabilità; noi non verifichiamo dove ti trovi.',
        own: 'Non giocare per conto di qualcun altro, né con SOL che non sono tuoi.',
      },
      money: {
        title: 'SOL di test e SOL veri',
        test: 'Questo sito gira su {cluster}. I biglietti costano SOL di test, che sono gratuiti da un faucet e non hanno valore: non possono essere scambiati con denaro reale, e nemmeno ciò che vinci con essi.',
        real: 'Questo sito gira su {cluster}. I biglietti costano SOL veri, e i montepremi sono pagati in SOL veri.',
      },
      rounds: {
        title: 'Come funziona un round',
        intro: 'Il programma impone queste regole; il sito si limita a mostrarle:',
        day: 'S☉Lucky ha tre giochi. Nella lotteria quotidiana si gioca un round per ogni giorno UTC, dalle 00:00 UTC alla mezzanotte successiva; nella lotteria oraria, uno per ogni ora UTC. In Indovina il numero, un round non ha un orario di fine: dura finché un tentativo non trova il suo numero.',
        number:
          'Un biglietto è un numero, da 0 al numero più alto impostato nella configurazione del programma. Ogni numero può appartenere a un solo biglietto per round.',
        price:
          'Ogni gioco ha il suo prezzo del biglietto e la sua commissione della casa. Vengono copiati, insieme al numero più alto, quando un round si apre, e restano fissi per quel round. La commissione non può mai superare il 20% del montepremi. Quando compri, non paghi mai più del prezzo che ti è stato mostrato.',
        pot: 'Il prezzo di ogni biglietto va nel montepremi del round, custodito dall’account del round su Solana. Nelle lotterie viene estratto un numero a caso da 0 al numero più alto e vince il biglietto più vicino; in caso di parità vince il numero più basso. In Indovina il numero, i nuovi tentativi vengono verificati a gruppi: un gruppo contiene il numero con una probabilità pari ai suoi tentativi divisi per i numeri non ancora provati, la stessa di un numero nascosto all’apertura del round.',
        draw: 'Una volta concluso un round delle lotterie, o appena ci sono nuovi tentativi in attesa di verifica, chiunque può chiudere il round, estrarlo e pagarlo. Il proprietario del biglietto vincente riceve l’80% del montepremi, la commissione della casa va alla tesoreria, e il resto rimane nel programma per essere estratto nel round successivo del gioco.',
        rent: 'L’account di un biglietto contiene anche un piccolo deposito di rent, che recuperi chiudendo il biglietto una volta pagato il suo round. Il primo biglietto di un round paga anche il rent dell’account del round, che resta su Solana come registro pubblico del round. Nelle lotterie, ogni biglietto paga anche il rent dei 4 byte che il suo numero occupa in quell’account, che non viene restituito.',
      },
      wallet: {
        title: 'Il tuo wallet e le transazioni',
        own: 'Giochi con il tuo wallet. Non custodiamo mai le tue chiavi, i tuoi SOL o i tuoi biglietti, e non possiamo spostarli.',
        sign: 'Firmi tu ogni transazione, e paghi tu le commissioni di rete di Solana. Le transazioni confermate sono definitive: non possiamo annullarle, stornarle o rimborsarle.',
        public:
          'Il numero di un biglietto, l’indirizzo del suo proprietario e la bandiera del paese che scegli per esso sono pubblici su Solana per sempre. L’{privacy} spiega cosa significa.',
        keys: 'Custodisci al sicuro le chiavi del tuo wallet. Nessuno, noi compresi, può recuperarle per te.',
      },
      operator: {
        title: 'Cosa l’operatore può e non può fare',
        intro: 'La configurazione del programma ha un’autorità, che può:',
        price:
          'cambiare il prezzo del biglietto di ogni gioco (almeno ◎0,002) e la sua commissione della casa (al massimo 20%), con effetto dal prossimo round di quel gioco che si apre;',
        pause:
          'sospendere e riprendere la vendita dei biglietti. Una pausa blocca solo i nuovi biglietti: i round già giocati possono comunque essere estratti e pagati;',
        other: 'cambiare la tesoreria, il numero più alto e l’autorità stessa.',
        cannot:
          'Il codice del programma non consente all’autorità, né a nessun altro, di prendere il montepremi di un round o di inviarlo altrove che al proprietario del biglietto vincente, alla tesoreria per la commissione e al round successivo del gioco, di prendere più della commissione, o di far pagare a un acquirente più del prezzo che gli è stato mostrato.',
        upgrade:
          'Il programma è aggiornabile: chi ne detiene l’autorità di aggiornamento potrebbe distribuire codice diverso, quindi ti stai fidando di quella persona finché il programma non viene reso immutabile o affidato a un multisig. Il sorgente di ogni versione è pubblico, e un programma distribuito può essere confrontato con esso come spiega la sezione «Verifiable builds» del README.',
      },
      risks: {
        title: 'Rischi',
        intro: 'Giocando, accetti che:',
        bugs: 'il software può avere bug, compresi il programma, l’app e il tuo wallet, e un bug potrebbe costarti i tuoi biglietti o i tuoi SOL;',
        network:
          'Solana o l’endpoint RPC usato dal sito possono essere lenti, congestionati o fuori servizio, e una transazione può fallire o arrivare dopo la chiusura di un round;',
        draw: 'l’estrazione usa l’hash di uno slot Solana che nessuno conosce quando un round si chiude o un gruppo di tentativi viene sigillato. I giocatori non possono prevederlo, ma il validatore che produce quello slot potrebbe influenzarlo, e chi chiude un round potrebbe trattenere un’estrazione sfavorevole finché quello slot non può più essere letto. Non è un oracolo di casualità verificabile;',
        site: 'il sito può essere non disponibile in qualsiasi momento. Il programma, e i tuoi biglietti, continuano a funzionare senza di esso;',
        law: 'le leggi su lotterie e cripto-attività variano da paese a paese e possono cambiare.',
      },
      use: {
        title: 'Usare il sito in modo corretto',
        body: 'Non attaccare né sovraccaricare il sito o i suoi server, non cercare di aggirarne i limiti, non interferire con gli altri giocatori e non usare il sito per violare la legge. Possiamo bloccare l’accesso a chiunque lo faccia.',
      },
      liability: {
        title: 'Nessuna garanzia',
        body: 'Il sito e il programma sono forniti «così come sono», senza alcuna garanzia. Nei limiti consentiti dalla legge, non siamo responsabili di alcuna perdita derivante dal loro uso, compresi biglietti persi, transazioni fallite o in ritardo, bug, problemi di rete o un’estrazione che consideri ingiusta. Nulla in questi termini limita una responsabilità che la legge non ci consente di limitare.',
      },
      openSource: {
        title: 'Open source',
        body: 'Il programma, l’app e gli script dell’operatore sono open source con licenza MIT: vedi il {repository}. Quella licenza riguarda il codice; questi termini regolano l’uso di questo sito.',
      },
      changes: {
        title: 'Modifiche',
        body: 'Possiamo aggiornare questi termini. La data in cima mostra l’ultima modifica, e la versione mostrata qui si applica da quella data.',
      },
      contact: {
        title: 'Contatti',
        body: 'Domande su questi termini: {email}.',
      },
    },

    privacy: {
      description: 'Cosa è pubblico su Solana, cosa vedono i nostri server e cosa non raccogliamo mai.',
      summary: {
        title: 'In breve',
        account: 'Non ci sono account, email o registrazioni. Giochi con un wallet.',
        cookies: 'Il sito non imposta cookie e non carica strumenti di analisi, pubblicità o tracker.',
        database: 'Non teniamo un database dei giocatori, e non vendiamo né condividiamo dati su di te.',
        public:
          'I tuoi biglietti sono pubblici su Solana, per scelta progettuale: è ciò che permette a chiunque di verificare il gioco.',
        controller: '{operator} gestisce il sito ed è responsabile dei dati che tratta.',
      },
      onChain: {
        title: 'Cosa è pubblico su Solana',
        intro: 'Quando compri un biglietto, la transazione e l’account del biglietto registrano pubblicamente:',
        address: 'l’indirizzo del tuo wallet, e le transazioni che firma;',
        number: 'il numero che hai scelto, il round e l’ora dell’acquisto;',
        flag: 'la bandiera del paese che hai scelto per il biglietto, o nessuna se lo tieni privato.',
        ledger:
          'Quando un round viene estratto, il suo account registra anche l’indirizzo del vincitore, il numero vincente e la sua bandiera, e la vincita pagata. Solana è un registro pubblico: chiunque può leggere questi dati, molte persone ne conservano copie, e restano lì per sempre. Chiudere un biglietto cancella il suo account e ne restituisce il rent, ma le transazioni che lo hanno creato e chiuso restano nel registro. Né noi né nessun altro possiamo modificarlo o cancellarlo.',
        link: 'Un indirizzo wallet non è il tuo nome, ma può essere collegato a te, per esempio tramite un exchange che hai usato. Usa un wallet separato se vuoi tenere il tuo gioco separato dal resto della tua attività.',
      },
      servers: {
        title: 'Cosa vedono i nostri server',
        visit: 'Ogni visita',
        visitBody:
          'Il sito è ospitato su Cloudflare. Come qualsiasi sito web, riceve il tuo indirizzo IP, lo user agent del tuo browser e le pagine che richiedi, per servirtele e proteggere il sito dagli abusi. Cloudflare conserva log operativi per un periodo limitato secondo la sua {policy}. Li usiamo solo per far funzionare e correggere il sito.',
        policy: 'informativa sulla privacy',
        country: 'Il tuo paese',
        countryBody:
          'Cloudflare comunica al nostro server da quale paese arriva ogni richiesta. L’app lo chiede una volta, per suggerire la bandiera dei tuoi biglietti; puoi cambiarlo o tenerlo privato prima di comprare. Il server legge solo il paese, non il tuo indirizzo IP, e non lo conserva.',
        live: 'Il tavolo in diretta della pagina Gioca',
        liveBody:
          'Mentre la pagina Gioca è aperta, il tuo browser mantiene una connessione con il nostro server, così i giocatori possono vedere chi altro c’è. Condivide tre cose con le altre persone sulla pagina: un id casuale valido solo per quella connessione, la bandiera mostrata dai tuoi biglietti (nessuna se tieni privato il tuo paese) e se stai inserendo un numero, mai il numero stesso. Non contiene alcun indirizzo wallet né indirizzo IP, e nulla della connessione viene salvato o conservato dopo la sua chiusura.',
        price: 'Il prezzo di SOL',
        priceBody:
          'Per mostrare i montepremi in dollari, il nostro server recupera il prezzo di SOL da Coinbase, o da CoinGecko se Coinbase non risponde, e lo tiene in cache per un minuto. Queste richieste partono dal nostro server e non contengono nulla su di te.',
        push: 'Notifiche delle estrazioni',
        pushBody:
          'Se attivi le notifiche di un gioco, il tuo browser dà al nostro server un’iscrizione push: un indirizzo presso il servizio push del tuo browser (gestito da Google, Mozilla, Apple o Microsoft, a seconda del browser) e le chiavi per cifrargli i messaggi. La conserviamo con la tua lingua e i giochi che hai scelto, e nient’altro: nessun indirizzo del wallet, nessun indirizzo IP. Quando viene vinto un round di uno di quei giochi, il nostro server invia il risultato, cifrato, tramite quel servizio push, che lo consegna al tuo browser secondo la propria politica. Disattivare le notifiche cancella l’iscrizione, e la cancelliamo anche quando il servizio push ci dice che non esiste più.',
      },
      thirdParties: {
        title: 'Servizi usati dal tuo browser',
        rpc: '{name}, da cui l’app legge il gioco e attraverso cui invia le tue transazioni: {endpoint}. Riceve il tuo indirizzo IP e gli account che l’app consulta, compreso quello del tuo wallet una volta collegato, secondo la politica del suo gestore.',
        rpcName: 'Un endpoint RPC di Solana',
        rpcHost: '{host} su questo sito',
        rpcPublic: 'l’endpoint pubblico di Solana per {cluster}',
        wallet:
          '{name}, come Phantom, Solflare o Backpack, che è un software del suo produttore, con la sua politica. Il sito gli chiede solo di collegarsi e di firmare le transazioni che approvi.',
        walletName: 'Il tuo wallet',
        links:
          '{name}: Solana Explorer, il faucet di Solana, GitHub e i nostri account social sono altri siti, con le loro politiche.',
        linksName: 'I link che apri',
        own: 'Font, suoni e immagini provengono dal nostro dominio, quindi caricare il sito non contatta nessun altro.',
      },
      browser: {
        title: 'Cosa resta nel tuo browser',
        body: 'L’app conserva cinque impostazioni nella memoria locale del tuo browser: il tuo tema, il tuo ultimo wallet, la tua scelta del paese, l’impostazione dei suoni e la tua lingua. La pagina {cookies} le elenca.',
        cache:
          'Per aprirsi senza connessione, l’app conserva anche copie delle pagine che visiti e dei propri file nella memoria cache del tuo browser. Ogni nuova versione del sito le sostituisce.',
      },
      purposes: {
        title: 'Perché, e cosa non facciamo mai',
        body: 'Trattiamo i dati sopra indicati solo per mostrare il sito, far funzionare il gioco a cui chiedi di giocare, mantenere il sito sicuro e risolvere problemi. Non creiamo profili, non mostriamo pubblicità, non vendiamo dati né li condividiamo con inserzionisti.',
      },
      rights: {
        title: 'Le tue scelte e i tuoi diritti',
        flag: 'Puoi giocare senza la bandiera del tuo paese: scegli di tenerlo privato prima di comprare.',
        clear:
          'Puoi cancellare le impostazioni nel tuo browser in qualsiasi momento, e usare un nuovo wallet quando vuoi.',
        law: 'A seconda di dove vivi, potresti avere il diritto di accedere ai dati personali che ti riguardano, di correggerli o cancellarli, o di opporti al modo in cui vengono usati. Scrivi a {email} e ti risponderemo. Non conserviamo quasi nulla su di te, e non possiamo modificare o cancellare ciò che è su Solana.',
      },
      children: {
        title: 'Minori',
        body: 'S☉Lucky è per persone dai 18 anni in su. Non trattiamo consapevolmente dati di persone più giovani.',
      },
      changes: {
        title: 'Modifiche e contatti',
        body: 'Aggiorneremo questa pagina quando il sito cambierà il modo in cui tratta i dati; la data in cima mostra l’ultima modifica. Domande: {email}.',
      },
    },

    cookies: {
      description:
        'Niente cookie, niente tracker: le cinque impostazioni che l’app conserva nel tuo browser, e come rimuoverle.',
      none: {
        title: 'Niente cookie',
        p1: 'S☉Lucky non imposta cookie e non carica script di analisi, pubblicità o tracciamento. La politica di sicurezza del sito consente solo script del suo stesso dominio.',
        p2: 'Il nostro host, Cloudflare, può impostare cookie di sicurezza strettamente necessari, come {cookie}, quando è attiva la sua protezione dai bot. Cloudflare li usa per distinguere le persone dai bot, come spiega il suo {list}.',
        list: 'elenco dei cookie',
      },
      storage: {
        title: 'Cosa conserva l’app nel tuo browser',
        intro:
          'L’app salva alcune impostazioni nella memoria locale del tuo browser, così le ritrovi la volta successiva. Restano sul tuo dispositivo, con un’eccezione: la bandiera che scegli va sui biglietti che compri, ed è mostrata sul tavolo in diretta della pagina Gioca mentre sei lì.',
        key: 'Chiave',
        holds: 'Contenuto',
        saved: 'Salvato',
        wallet: 'L’estensione del tuo wallet conserva i propri dati, secondo la politica del suo produttore.',
        cache:
          'Per aprirsi senza connessione, l’app conserva anche copie delle pagine che visiti e dei propri file nella memoria cache del tuo browser; ogni nuova versione del sito le sostituisce. Se attivi le notifiche delle estrazioni, il tuo browser conserva anche l’iscrizione push finché non le disattivi. Cancellare i dati di questo sito rimuove tutto.',
      },
      keys: {
        theme: {
          holds: 'Il tuo tema chiaro o scuro.',
          when: 'Quando cambi tema.',
        },
        wallet: {
          holds: 'Il nome dell’ultimo wallet che hai collegato e il suo indirizzo, così l’app può ricollegarlo.',
          when: 'Quando colleghi un wallet; rimosso quando lo disconnetti.',
        },
        country: {
          holds: 'La bandiera del paese che hai scelto per i tuoi biglietti, o il fatto che lo tieni privato.',
          when: 'Quando scegli una bandiera.',
        },
        sound: {
          holds: 'Se i suoni sono attivi o no.',
          when: 'Quando disattivi o riattivi i suoni.',
        },
        lang: {
          holds: 'La lingua che hai scelto, così l’app non te ne propone di nuovo un’altra.',
          when: 'Quando scegli una lingua, o rispondi alla proposta di leggere il sito nella tua.',
        },
      },
      clear: {
        title: 'Rimuoverli',
        disconnect: 'Disconnetti il tuo wallet nell’app per rimuovere {key}.',
        site: 'Cancella i dati di questo sito nelle impostazioni del browser per rimuoverli tutti.',
        private: 'In una finestra privata, vengono cancellati quando la chiudi.',
        reset: 'Rimuoverli azzera solo queste impostazioni; i tuoi biglietti sono su Solana e restano tuoi.',
      },
      banner: {
        title: 'Perché non c’è un banner dei cookie',
        body: 'Niente qui ti traccia, e ogni impostazione qui sopra esiste perché l’hai impostata tu. Quindi non c’è nulla da accettare o rifiutare.',
      },
    },

    play: {
      description: 'Come funzionano le probabilità, e dove trovare aiuto se giocare smette di essere divertente.',
      basics: {
        title: 'Prima di giocare',
        age: 'S☉Lucky è per persone dai 18 anni in su, dove le lotterie sono legali.',
        test: 'Questo sito gira su Solana {cluster}: i biglietti costano SOL di test, che sono gratuiti e non hanno valore. È un buon modo per vedere come funziona il gioco senza spendere nulla.',
        real: 'Questo sito gira su Solana Mainnet: i biglietti costano SOL veri.',
        fun: 'Gioca per divertimento, mai per guadagnare o per recuperare soldi persi.',
      },
      odds: {
        title: 'Conosci le probabilità',
        same: 'Nelle lotterie vince il biglietto più vicino a un numero casuale: la tua probabilità è la parte dell’intervallo di numeri più vicina ai tuoi numeri che a quelli di chiunque altro. In Indovina il numero, ogni verifica trova il numero con una probabilità pari ai nuovi tentativi divisi per i numeri non ancora provati.',
        label:
          'Nessun numero è più fortunato di un altro: il numero estratto ha la stessa probabilità di essere qualsiasi numero dell’intervallo.',
        fee: 'Il vincitore riceve l’80% del montepremi. La commissione della casa, che il programma limita al 20%, esce dal resto, e ciò che avanza va al round successivo del gioco. Quindi, considerando tutti i giocatori, i biglietti restituiscono i soldi spesi per acquistarli meno quella commissione: in media, un biglietto restituisce meno di quanto costa.',
        nothing: 'Niente sul sito cambia queste probabilità.',
      },
      final: {
        title: 'I biglietti sono definitivi',
        body: 'Un biglietto non può essere annullato o rimborsato una volta comprato. L’unica cosa che recuperi è il suo piccolo deposito di rent, chiudendo il biglietto dopo che il suo round è stato pagato.',
      },
      habits: {
        title: 'Che resti un divertimento',
        budget: 'Decidi in anticipo quanto accetti di perdere, e fermati quando quella somma è finita.',
        chase:
          'Non cercare mai di rifarti delle perdite, e non giocare mai con soldi presi in prestito o di cui hai bisogno.',
        mood: 'Non giocare in un momento di turbamento o di stanchezza, né dopo aver bevuto.',
        breaks: 'Fai delle pause, e lascia che il gioco resti una parte della tua vita tra tante.',
      },
      limits: {
        title: 'Stabilisci i tuoi limiti',
        intro: 'S☉Lucky non ha account, quindi non può impostare limiti né escluderti. Puoi impostare i tuoi:',
        wallet: 'Tieni un wallet separato con dentro solo ciò che accetti di spendere.',
        block: 'Usa un blocco siti o il controllo parentale del tuo dispositivo per bloccare il sito.',
        trust: 'Parlane con una persona di cui ti fidi, e chiedile di aiutarti a rispettare i tuoi limiti.',
      },
      help: {
        title: 'Chiedere aiuto',
        intro:
          'Se giocare ha smesso di essere divertente, o qualcuno a te vicino se ne preoccupa, queste organizzazioni indipendenti offrono aiuto gratuito e riservato. Non siamo affiliati a loro.',
        worldwide: 'In tutto il mondo: incontri e contatti per paese.',
        us: 'Stati Uniti.',
        uk: 'Regno Unito.',
        emergency: 'Se tu o qualcun altro siete in pericolo immediato, chiama il numero di emergenza locale.',
      },
    },
  },
};

export default it;
