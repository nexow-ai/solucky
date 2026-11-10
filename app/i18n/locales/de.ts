/** German: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const de: Dict = {
  meta: {
    title: 'S☉Lucky: Lotteriespiele auf Solana',
    description:
      'Wähle eine Zahl in der täglichen oder stündlichen Lotterie, oder spür die versteckte Zahl auf. Der Gewinner erhält 80 % des Pots. Jedes Ticket, jeder Pot und jede Ziehung liegt auf Solana und kann von allen überprüft werden.',
    ogImageAlt: 'S☉Lucky, Lotteriespiele auf Solana',
  },

  nav: {
    play: 'Spielen',
    skip: 'Zum Inhalt springen',
  },

  lang: {
    label: 'Sprache',
  },

  settings: {
    label: 'Einstellungen',
    theme: 'Design',
    light: 'Hell',
    dark: 'Dunkel',
    sound: 'Ton',
    back: 'Zurück',
  },

  update: {
    title: 'Eine neue Version ist bereit',
    hint: 'Neu laden, um sie sofort zu erhalten. Sie lädt sich auch beim nächsten Seitenwechsel von selbst.',
    reload: 'Neu laden',
  },

  install: {
    label: 'App installieren',
    ios: 'Um S☉Lucky zu installieren, öffne das Teilen-Menü deines Browsers und wähle „Zum Home-Bildschirm“.',
  },

  push: {
    on: 'Benachrichtige mich, wenn eine Runde dieses Spiels gewonnen wird',
    off: 'Benachrichtigungen für dieses Spiel ausschalten',
    enabled: 'Benachrichtigungen an',
    enabledHint: '{game}: Du bekommst jedes Mal eine Benachrichtigung, wenn eine Runde gewonnen wird.',
    disabled: 'Benachrichtigungen aus',
    blocked:
      'Benachrichtigungen sind für diese Website blockiert. Erlaube sie in den Einstellungen deines Browsers und versuch es dann noch einmal.',
    failed: 'Benachrichtigungen konnten nicht geändert werden. Versuch es noch einmal.',
    lottery: 'Runde {round}: Gezogen wurde {drawn}. Das nächstgelegene Ticket, {winning}, gewinnt ◎{prize}.',
    guess: 'Runde {round}: Die Zahl war {winning}. Der Tipp, der sie gefunden hat, gewinnt ◎{prize}.',
  },

  header: {
    beta: 'Beta',
    getSol: 'SOL holen',
    faucetTip: 'Öffnet den Solana-Faucet mit deiner Adresse und ◎{amount} schon eingetragen',
  },

  network: {
    label: 'Netzwerk',
    test: 'Testnet',
    main: 'Mainnet',
    testHere: 'Solana {cluster}: Tickets kosten Test-SOL ohne echten Wert',
    mainHere: 'Solana Mainnet: Tickets kosten echte SOL',
    goTest: 'Mit kostenlosen Test-SOL spielen',
    goMain: 'Mit echten SOL im Solana Mainnet spielen',
    soon: 'Demnächst',
  },

  faucet: {
    request: 'Fordere Test-SOL im Faucet an',
    requestHint:
      'Deine Adresse und ◎{amount} sind schon eingetragen: Schließ die Prüfung ab und tippe dann auf „Confirm Airdrop“.',
    airdropped: 'Airdrop von ◎1 erhalten',
    airdroppedHint: 'Die Test-SOL sind auf {cluster} angekommen. Du kannst jetzt Tickets kaufen.',
    failed: 'Airdrop fehlgeschlagen',
    slow: 'Der Airdrop wurde angenommen, aber das Guthaben ist noch nicht aktualisiert. Lade gleich neu.',
  },

  footer: {
    license: 'MIT-Lizenz',
    program: 'Programm {address} auf {cluster}.',
    age: 'Nur ab 18. Spiel zum Spaß und nur dort, wo Lotterien legal sind.',
    legal: 'Rechtliches',
    languages: 'Sprachen',
    source: 'Quellcode',
    builtOn: 'Gebaut auf {solana}',
    madeBy: 'Entwickelt von {nexow}',
  },

  home: {
    lead: 'Eine Ziehung jeden Tag, eine Ziehung jede Stunde und eine versteckte Zahl zum Aufspüren. Der Gewinner erhält 80 % des Pots, und der Rest geht in die nächste Runde über. Jedes Ticket, jeder Lamport und jede Ziehung liegt auf Solana, wo alle es überprüfen können.',
    playNow: 'Jetzt spielen',
    howItWorks: 'So funktioniert’s',

    how: {
      tag: 'So funktioniert’s',
    },

    fairness: {
      tag: 'Fairness',
      title: 'Vertrau uns nicht. Prüf nach.',
      description:
        'S☉Lucky ist ein Solana-Programm, kein Server, der dein Geld verwahrt. Diese Regeln setzt sein Code durch.',
      rules: {
        locked: {
          title: 'Der Pot ist im Programm eingeschlossen',
          description:
            'Das Ticketgeld geht direkt auf das Konto der Runde. Das Programm zahlt nur 80 % davon an den Besitzer des Gewinnertickets aus, die Gebühr an die Treasury und den Rest an die nächste Runde des Spiels. Der Betreiber kann es nicht abheben.',
        },
        draw: {
          title: 'Eine Ziehung, die niemand vorhersagen kann',
          description:
            'Jeder Kauf fließt in die Entropie der Runde ein. Wenn eine Runde endet, legt sie einen Slot einige Sekunden in der Zukunft fest; der Hash dieses Slots, bis dahin allen unbekannt, bestimmt die Zahl, an der die Tickets gemessen werden.',
        },
        anyone: {
          title: 'Alle können es ausführen',
          description:
            'Schließen, Ziehen und Auszahlen stehen allen offen. Wäre der Betreiber morgen verschwunden, könnte jeder Spieler trotzdem jede Runde zu Ende bringen.',
        },
        browser: {
          title: 'Prüfbar in deinem Browser',
          description:
            'Jede Rundenseite berechnet die Ziehung aus öffentlichen Daten neu: der Entropie, dem Slot-Hash, der gezogenen Zahl und dem nächstgelegenen Ticket. Gleiche Eingaben, gleicher Gewinner.',
        },
        limits: {
          title: 'Harte Grenzen für das Haus',
          description:
            'Das Programm zahlt dem Gewinner immer 80 % des Pots und begrenzt die Gebühr auf 20 %. Preis- und Gebührenänderungen gelten erst für danach geöffnete Runden, und wer kauft, zahlt nie mehr als den angezeigten Preis.',
        },
        guessDraw: {
          title: 'Eine Prüfung, die niemand vorhersagen kann',
          description:
            'Jeder Tipp fließt in die Entropie der Runde ein. Das Versiegeln der neuen Tipps legt einen Slot einige Sekunden in der Zukunft fest; der Hash dieses Slots, bis dahin allen unbekannt, entscheidet, ob einer von ihnen die Zahl gefunden hat.',
        },
        guessBrowser: {
          title: 'Prüfbar in deinem Browser',
          description:
            'Jede Rundenseite berechnet die Prüfung, die sie beendet hat, aus öffentlichen Daten neu: der Entropie, dem Slot-Hash und dem Tipp, der die Zahl gefunden hat. Gleiche Eingaben, gleicher Gewinner.',
        },
        open: {
          title: 'Open Source',
          description: 'Das Programm, die App und die Betreiberskripte sind öffentlich, mit Tests für jede Regel.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Fragen',
      description: 'Noch unsicher? Das Programm, die App und die Betreiberskripte sind Open Source.',
      readCode: 'Code lesen',
      items: {
        what: {
          q: 'Was ist S☉Lucky?',
          a: 'S☉Lucky sind drei Lotteriespiele auf Solana, entwickelt von Nexow, Inc.: eine tägliche Lotterie, eine stündliche Lotterie und Errate die Zahl. Jedes Ticket, jeder Pot und jede Ziehung ist ein Konto eines quelloffenen Solana-Programms, sodass alle sie überprüfen können. Der Gewinner erhält 80 % des Pots; die Hausgebühr geht vom Rest ab, und was übrig bleibt, geht in die nächste Runde des Spiels über.',
        },
        guess: {
          q: 'Wie funktioniert Errate die Zahl?',
          a: 'Es spielt sich so, als würde jede Runde eine Zahl von 0 bis {max} verstecken, die niemand kennt, auch der Betreiber nicht. Jeder Tipp ist ein Ticket auf eine Zahl, die in der Runde noch niemand versucht hat. Alle paar Sekunden werden die neuen Tipps versiegelt und mit dem Hash eines Slots geprüft, den vorher niemand kennen konnte. Trifft einer, gewinnt sein Besitzer 80 % des Pots, und sofort beginnt eine neue Runde; sonst scheiden diese Zahlen aus, und die Runde geht weiter, ohne Frist.',
        },
        real: {
          q: 'Ist das echtes Geld?',
          a: 'Die öffentliche App läuft im Devnet von Solana, wo SOL kostenloses Testgeld von faucet.solana.com ist. Das Programm funktioniert im Mainnet genauso, aber wer eine Lotterie mit echtem Geld betreibt, braucht dort, wo er tätig ist, die passenden Lizenzen.',
        },
        price: {
          q: 'Was kostet ein Ticket?',
          a: 'Der Preis jedes Spiels wird on-chain festgelegt und auf seiner Seite „Spielen“ angezeigt. Neben dem Preis hält ein Ticketkonto eine kleine Rent-Kaution, die du zurückbekommst, wenn du das Ticket schließt, sobald die Runde ausgezahlt ist. Das erste Ticket einer Runde zahlt außerdem die Rent für das Konto der Runde, das als ihr öffentlicher Nachweis on-chain bleibt; in den Lotterien zahlt jedes Ticket zudem für die 4 Bytes, die seine Zahl dort belegt.',
        },
        odds: {
          q: 'Wie werden meine Chancen berechnet?',
          a: 'In den Lotterien gewinnt das Ticket, das der gezogenen Zahl am nächsten liegt. Deine Chance ist also der Anteil des Zahlenbereichs, der näher an deinen Zahlen liegt als an denen aller anderen: Eine Zahl weit weg von den anderen Tickets deckt mehr davon ab. Bei „Errate die Zahl“ findet jede Prüfung die Zahl mit einer Chance von neuen Tipps geteilt durch die noch nicht probierten Zahlen.',
        },
        draw: {
          q: 'Was, wenn niemand die Runde zieht?',
          a: 'Ein kleiner Bot (der Crank) schließt, zieht und zahlt jede Lotterierunde innerhalb von Sekunden nach ihrem Ende aus und prüft alle paar Sekunden neue Tipps. Alle können dasselbe auf der Seite „Spielen“ tun. Wird der festgelegte Slot jemals zu alt, um ihn zu lesen (etwa drei Minuten), kann die Runde erneut geschlossen werden, um einen neuen festzulegen; das Programm erlaubt das nur, wenn der alte Slot nachweislich außer Reichweite ist.',
        },
        country: {
          q: 'Warum zeigt ihr mein Land an?',
          a: 'S☉Lucky hat schon immer neben jedem Ticket eine Flagge angezeigt. Wir schlagen dein Land anhand deiner Verbindung zu unserem Hoster vor, ohne Abfrage bei Dritten, und du kannst es vor dem Kauf ändern oder privat halten. Es wird mit deinem Ticket on-chain gespeichert.',
        },
        validator: {
          q: 'Kann ein Validator bei der Ziehung betrügen?',
          a: 'Spieler können es nicht: Der Gewinner-Hash existiert noch nicht, wenn der Verkauf schließt. Der Validator, der den festgelegten Slot produziert, könnte ihn beeinflussen, indem er wählt, was in diesen Block kommt, oder ihn auslässt. Für ein Spiel mit Testgeld ist das akzeptabel; bei Pots mit echtem Geld sollte die Ziehung ein verifizierbares Zufallsorakel nutzen, und das README erklärt, wo man eines einbindet.',
        },
      },
    },

    live: {
      drawIn: 'Ziehung in',
      noDeadline: 'Ohne Frist',
    },

    split: {
      title: 'jedes Pots gehen an den Gewinner',
      lead: 'Das Programm zahlt sie dem Besitzer des Gewinnertickets aus, sobald die Runde abgewickelt ist. Die Hausgebühr geht von den übrigen {rest} ab, und was übrig bleibt, geht in die nächste Runde des Spiels über.',
      winner: 'Gewinner',
      fee: 'Hausgebühr',
      carry: 'Nächste Runde',
    },

    winners: {
      tag: 'Gewinner',
      title: 'Jeder Gewinner, on-chain',
      description:
        'Die zuletzt abgewickelten Runden dieses Spiels, gelesen aus den Konten des Programms. Jede verlinkt auf ihre Rundenseite, wo sich das Ergebnis nachrechnen lässt.',
      paid: 'An Gewinner ausgezahlt',
      rounds: 'Abgewickelte Runden',
      empty: 'Noch keine Runde wurde abgewickelt.',
      drawn: 'Gezogen: {number}',
      found: 'Zahl gefunden',
    },
  },

  /**
   * Each game's own page: the daily lottery's at the root (/), the others at
   * /hourly and /guess. The header's game tabs switch between them.
   */
  landing: {
    /** The hourly and Guess pages' title; the daily lottery's page is the site's home and keeps meta.title. */
    title: '{game} auf Solana',
    daily: {
      kicker: 'Tägliche Lotterie · eine Ziehung am Tag',
      title: 'Wähle eine Zahl.',
      titleEnd: 'Gewinne um Mitternacht.',
      lead: 'Eine Runde am Tag, von 00:00 bis 24:00 UTC. Wähle eine beliebige Zahl von 0 bis {max}: Direkt nach Mitternacht wird eine Zufallszahl gezogen, und das Ticket, das ihr am nächsten liegt, gewinnt 80 % des Pots. Die Hausgebühr geht vom Rest ab, und was übrig bleibt, wird auf den nächsten Tag übertragen.',
      how: {
        title: 'Vier Schritte, eine Ziehung am Tag',
        description:
          'Die Runden folgen dem UTC-Kalender: Eine neue öffnet um 00:00 UTC und wird direkt nach der nächsten Mitternacht gezogen.',
      },
      steps: {
        wallet: {
          title: 'Verbinde eine Wallet',
          description:
            'Solflare, Phantom, Backpack oder jede Wallet, die den Wallet Standard unterstützt. Kein Konto, keine E-Mail.',
          when: 'Jederzeit',
        },
        number: {
          title: 'Wähle deine Zahl',
          description:
            'Eine beliebige Zahl von 0 bis {max}. Jede Zahl kann pro Tag nur von einem Ticket belegt werden, also sei schnell.',
          when: 'Bis Mitternacht UTC',
        },
        pot: {
          title: 'Sieh dem Pot beim Wachsen zu',
          description:
            'Jedes Ticket legt seinen Preis in den Pot, den das eigene Konto der Runde auf Solana verwahrt. Niemand sonst kann ihn bewegen.',
          when: 'Den ganzen Tag',
        },
        win: {
          title: 'Gewinne um Mitternacht UTC',
          description:
            'Eine Zufallszahl wird gezogen, und das Ticket, das ihr am nächsten liegt, gewinnt 80 % des Pots. Die Hausgebühr geht vom Rest ab, und was übrig bleibt, wird auf den nächsten Tag übertragen.',
          when: 'Direkt nach Mitternacht UTC',
        },
      },
      cta: {
        kicker: 'Jeden Tag nach Mitternacht UTC gezogen',
        title: 'Der heutige Pot wartet',
        description: 'Wähle eine Zahl, die noch niemand genommen hat. Viel Glück!',
      },
    },
    hourly: {
      kicker: 'Stündliche Lotterie · 24 Ziehungen am Tag',
      title: 'Wähle eine Zahl.',
      titleEnd: 'Gewinne zur vollen Stunde.',
      lead: 'Jede Stunde eine neue Runde, zur vollen Stunde (UTC). Wähle eine beliebige Zahl von 0 bis {max}: Direkt nach Ende der Stunde wird eine Zufallszahl gezogen, und das Ticket, das ihr am nächsten liegt, gewinnt 80 % des Pots. Die Hausgebühr geht vom Rest ab, und was übrig bleibt, wird auf die nächste Stunde übertragen.',
      how: {
        title: 'Vier Schritte, eine Ziehung pro Stunde',
        description:
          'Die Runden folgen der UTC-Uhr: Eine neue öffnet zu Beginn jeder Stunde und wird direkt nach deren Ende gezogen.',
      },
      steps: {
        wallet: {
          title: 'Verbinde eine Wallet',
          description:
            'Solflare, Phantom, Backpack oder jede Wallet, die den Wallet Standard unterstützt. Kein Konto, keine E-Mail.',
          when: 'Jederzeit',
        },
        number: {
          title: 'Wähle deine Zahl',
          description:
            'Eine beliebige Zahl von 0 bis {max}. Jede Zahl kann pro Stunde nur von einem Ticket belegt werden, also sei schnell.',
          when: 'Bis zum Ende der Stunde',
        },
        pot: {
          title: 'Sieh dem Pot beim Wachsen zu',
          description:
            'Jedes Ticket legt seinen Preis in den Pot, den das eigene Konto der Runde auf Solana verwahrt. Niemand sonst kann ihn bewegen.',
          when: 'Die ganze Stunde',
        },
        win: {
          title: 'Gewinne zur vollen Stunde',
          description:
            'Eine Zufallszahl wird gezogen, und das Ticket, das ihr am nächsten liegt, gewinnt 80 % des Pots. Die Hausgebühr geht vom Rest ab, und was übrig bleibt, wird auf die nächste Stunde übertragen.',
          when: 'Direkt nach Ende der Stunde',
        },
      },
      cta: {
        kicker: 'Jede Stunde gezogen, zur vollen Stunde',
        title: 'Der Pot dieser Stunde wartet',
        description: 'Wähle eine Zahl, die in dieser Stunde noch niemand genommen hat. Viel Glück!',
      },
    },
    guess: {
      kicker: 'Errate die Zahl · ohne Frist',
      title: 'Finde die Zahl.',
      titleEnd: 'Vor allen anderen.',
      lead: 'Jede Runde spielt sich so, als würde sie eine Zahl von 0 bis {max} verstecken, die niemand kennt, auch der Betreiber nicht. Jeder Tipp ist ein Ticket auf eine Zahl, die in der Runde noch niemand versucht hat. Alle paar Sekunden werden die neuen Tipps geprüft: Der Tipp, der die Zahl findet, gewinnt 80 % des Pots, und sofort beginnt eine neue Runde.',
      how: {
        title: 'Vier Schritte, ohne Frist',
        description:
          'Eine Runde dauert, bis ein Tipp ihre Zahl findet. Dann öffnet die nächste Runde, mit einer neuen Zahl zum Finden.',
      },
      steps: {
        wallet: {
          title: 'Verbinde eine Wallet',
          description:
            'Solflare, Phantom, Backpack oder jede Wallet, die den Wallet Standard unterstützt. Kein Konto, keine E-Mail.',
          when: 'Jederzeit',
        },
        guess: {
          title: 'Gib einen Tipp ab',
          description:
            'Eine beliebige Zahl von 0 bis {max}, die in der Runde noch niemand versucht hat. Jeder Tipp ist ein Ticket, und sein Preis fließt in den Pot.',
          when: 'Jederzeit',
        },
        check: {
          title: 'In Sekunden geprüft',
          description:
            'Alle paar Sekunden werden die neuen Tipps versiegelt und mit dem Hash eines Slots geprüft, den vorher niemand kennen konnte. Ein Tipp, der danebenliegt, nimmt seine Zahl aus der Runde.',
          when: 'Alle paar Sekunden',
        },
        win: {
          title: 'Finde sie zuerst',
          description:
            'Der Tipp, der die Zahl findet, gewinnt 80 % des Pots. Die Hausgebühr geht vom Rest ab, was übrig bleibt, wird übertragen, und sofort beginnt eine neue Runde.',
          when: 'Sobald sie gefunden ist',
        },
      },
      cta: {
        kicker: 'Alle paar Sekunden geprüft',
        title: 'Die Zahl ist noch da draußen',
        description: 'Versuch eine Zahl, die noch niemand versucht hat. Viel Glück!',
      },
    },
  },

  /** The dial on each game's page. */
  dial: {
    draw: 'Ziehung',
    pot: 'Heutiger Pot',
    potHour: 'Pot dieser Stunde',
    toDraw: 'bis zur Ziehung · {day}',
    tickets: 'heute {n} Ticket | heute {n} Tickets',
    ticketsHour: '{n} Ticket in dieser Stunde | {n} Tickets in dieser Stunde',
    guesses: '{n} Tipp in dieser Runde | {n} Tipps in dieser Runde',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Tickets',
    players: 'Spieler',
    countries: 'Länder',
    ticket: 'Ticket',
    yourTickets: 'Deine Tickets',
    winChance: 'Gewinnchance',
    chance: 'Chance',
    todaysPot: 'Pot',
    waiting: 'Wartend',
    numbersLeft: 'Übrige Zahlen',
    winners: 'Gewinner',
    averagePot: 'Pot im Schnitt',
    biggestPot: 'Größter Pot',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: 'noch {time}',
  },

  play: {
    description:
      'Wähle eine Zahl in der täglichen oder stündlichen Lotterie, oder spür die versteckte auf, und sieh live auf Solana zu, wie der Pot wächst.',
    testMoney: 'Du spielst auf Solana {cluster}: Tickets kosten Test-SOL ohne echten Wert.',
    localFunds: 'Richte deine Wallet auf {url} aus und lade sie dann auf mit: {command}',
    phantomFunds:
      'In Phantom: Settings → Developer Settings → Testnet Mode aktivieren → {cluster} auswählen. Hol dir dann kostenlose Test-SOL vom Faucet.',
    openFaucet: 'Faucet öffnen',
    retry: 'Erneut versuchen',
    rpcError: 'Der Solana-RPC-Endpunkt ist nicht erreichbar ({reason})',
    fundHow: 'Test-SOL holen',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Wähle eine',
    title: 'Zahl',
    win: 'Gewinne',
    taken: 'In dieser Runde schon vergeben',
    range: '0 bis {max}, ein Ticket pro Zahl',
    pad: 'Ziffernblock',
    reset: 'Zurücksetzen',
    delete: 'Letzte Ziffer löschen',
    dip: 'Quicktipp',
    searchCountry: 'Land suchen',
    country: 'Land, das mit deinem Ticket angezeigt wird',
    notSetUp: 'Dieses Spiel ist auf diesem Cluster noch nicht eingerichtet.',
    paused: 'Der Ticketverkauf ist pausiert.',
    buy: '{number} für ◎{price} kaufen',
    takenToday: '{number} ist vergeben',
    outOfRange: 'Zahl außerhalb des Bereichs',
    notEnough: 'Nicht genug SOL',
    loading: 'Runde wird geladen…',
    unavailable: 'Runde nicht verfügbar',
    closing: 'Diese Runde schließt gleich',
    over: 'Diese Runde ist vorbei',
    full: 'Diese Runde ist voll',
    keys: 'Mit 0–9 tippen, ⌫ löscht, Enter kauft.',
    rent: 'Ein Ticket bindet außerdem ◎{rent} an Rent für sein Konto, die du nach der Ziehung zurückbekommst.',
    best: 'Bester Platz',
    bestHint: 'Wählt die freie Zahl mit dem größten Anteil an der Ziehung, Stand jetzt',
    share: 'Gewinnchance mit {number}',
    wins: 'Gewinnt, wenn die Ziehung zwischen {lo} und {hi} landet. Später in der Nähe gekaufte Lose verkleinern das.',
    yourPick: 'Deine Zahl',
    line: 'Tippe oder ziehe auf der Linie, um eine Zahl zu wählen',
  },

  batch: {
    one: 'Eine Zahl',
    many: 'Mehrere Zahlen',
    from: 'Von',
    to: 'Bis',
    count: 'Wie viele',
    upTo: 'Bis zu {n}',
    random: 'Zufällig',
    spread: 'Verteilt',
    randomHint: 'Freie Zahlen, zufällig aus dem Bereich gewählt.',
    spreadHint:
      'Freie Zahlen, gleichmäßig über den Bereich verteilt. Das nächstgelegene Ticket gewinnt, darum decken verteilte Zahlen mehr von der Linie ab.',
    onlyFree: 'Nur {n} freie Zahl in diesem Bereich | Nur {n} freie Zahlen in diesem Bereich',
    again: 'Neu wählen',
    whole: 'Ganzer Bereich',
    picked: '{n} Zahl gewählt | {n} Zahlen gewählt',
    share: 'Gewinnchance mit diesen',
    shareHint: 'Ihr Anteil an der Linie, Stand jetzt. Später in der Nähe gekaufte Tickets verkleinern ihn.',
    chance: 'Chance, dass eine davon die Zahl ist',
    none: 'Keine freie Zahl zum Kaufen',
    buy: '{n} Ticket für ◎{price} kaufen | {n} Tickets für ◎{price} kaufen',
    viaQuick: 'Der Schnellkauf zahlt: keine Wallet-Abfrage.',
    viaWallet:
      '{n} Transaktion, mit einer einzigen Freigabe in deiner Wallet. | {n} Transaktionen, mit einer einzigen Freigabe in deiner Wallet.',
    total: 'Insgesamt etwa ◎{sol}, mit Rent und Gebühren.',
    buying: 'Kauf von {n} Ticket | Kauf von {n} Tickets',
    bought: '{n} Ticket gekauft | {n} Tickets gekauft',
    boughtSome: '{n} von {count} Tickets gekauft: Jemand war bei den anderen Zahlen schneller',
    oneApproval:
      'Gib {n} Transaktion in deiner Wallet frei, in einem Schritt. | Gib {n} Transaktionen in deiner Wallet frei, alle auf einmal.',
  },

  quick: {
    title: 'Schnellkauf',
    statusOff: 'Tickets kaufen ohne Wallet-Abfrage bei jedem Kauf',
    statusOn: 'aktiv · noch ◎{sol} · endet {when}',
    statusLow: 'aktiv · noch ◎{sol} · lade Guthaben auf, um seine Netzwerkgebühren aufzufüllen',
    statusEnded: 'beendet · noch ◎{sol} zurückzuholen',
    statusElsewhere: 'aktiv in einem anderen Browser · noch ◎{sol}',
    setUp: 'Einrichten',
    manage: 'Verwalten',
    explain:
      'Gib einmal frei und lege ein Budget fest. Dieser Browser behält dann einen Schlüssel, der aus diesem Budget Tickets für deine Wallet kauft, ohne Wallet-Abfrage. Die Tickets und jeder Gewinn gehören dir.',
    safety:
      'Das Programm lässt den Schlüssel das Budget nur für Tickets für deine Wallet ausgeben. Alle, die diesen Browser nutzen, können es so ausgeben, also halte das Budget klein. Wenn du den Schnellkauf ausschaltest, geht der Rest an deine Wallet zurück.',
    budget: 'Budget (SOL)',
    tickets: 'Bis zu {n} Ticket | Bis zu {n} Tickets',
    lasts: 'Laufzeit',
    days: '{n} Tag | {n} Tage',
    float:
      'Der Schlüssel bekommt außerdem ◎{sol} für Netzwerkgebühren, und die Sitzung bindet etwas Rent. Beides kommt zurück, wenn du den Schnellkauf ausschaltest.',
    turnOn: 'Mit ◎{sol} einschalten',
    useHere: 'In diesem Browser nutzen',
    elsewhereHint:
      'Der Schnellkauf ist für einen Schlüssel in einem anderen Browser aktiv. Hol ihn mit einer einzigen Freigabe in der Wallet hierher, oder schalte ihn aus, um sein Budget zurückzubekommen.',
    add: 'Zum Budget hinzufügen (SOL)',
    addButton: '◎{sol} hinzufügen',
    renew: 'Verlängern',
    turnOff: 'Ausschalten',
    turnOffReturn: 'Ausschalten und ◎{sol} zurückholen',
    returnFloat: '◎{sol} an Gebühren aus diesem Browser zurückholen',
    unsupported: 'Dieser Browser kann keinen Schnellkauf-Schlüssel behalten.',
    opening: 'Einschalten des Schnellkaufs',
    funding: 'Hinzufügen von ◎{sol} zum Schnellkauf',
    on: 'Der Schnellkauf ist aktiv',
    closing: 'Ausschalten des Schnellkaufs',
    off: 'Der Schnellkauf ist aus. Alles ist zurück in deiner Wallet.',
    returning: 'Rückholung der Gebühren',
    returned: 'Die Gebühren sind zurück in deiner Wallet',
    noPrompt: 'Der Schnellkauf signiert: keine Wallet-Abfrage.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    carried: 'Enthält ◎{carry}, übertragen aus der letzten Runde',
    split: '80 % an den Gewinner · {fee} Hausgebühr · der Rest an die nächste Runde',
    inPlay: 'Zahlen im Spiel',
    empty: 'Noch keine Tickets',
    beFirst: 'Sei der Erste, der in dieser Runde eine Zahl wählt.',
    search: 'Zahl, Wallet oder Land suchen',
    clearSearch: 'Suche löschen',
    noMatch: 'Nichts im Spiel passt zu „{query}“',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Spiele',
    title: 'Drei Arten zu spielen',
    description:
      'Dieselben Zahlen, von 0 bis {max}. Der Gewinner erhält 80 % des Pots; die Hausgebühr geht vom Rest ab, und was übrig bleibt, geht in die nächste Runde über.',
    /** On a game's page, over the cards of the two others. */
    others: 'Zwei weitere Arten zu spielen',
    discover: 'Entdecken',
    daily: {
      name: 'Tägliche Lotterie',
      short: 'Täglich',
      description:
        'Eine Ziehung jeden Tag nach Mitternacht UTC. Das Ticket, das der gezogenen Zahl am nächsten liegt, gewinnt.',
    },
    hourly: {
      name: 'Stündliche Lotterie',
      short: 'Stündlich',
      description:
        'Eine Ziehung jede Stunde, zur vollen Stunde (UTC). Das Ticket, das der gezogenen Zahl am nächsten liegt, gewinnt.',
    },
    guess: {
      name: 'Errate die Zahl',
      short: 'Raten',
      description:
        'Ohne Frist. Neue Tipps werden alle paar Sekunden geprüft, bis einer die Zahl der Runde findet; dann beginnt eine neue Runde.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Bis jemand sie findet',
    odds: 'Jede Prüfung findet die Zahl mit einer Chance von neuen Tipps geteilt durch die {n} noch nicht probierten Zahlen.',
    bought: 'Tipp {number} ist drin. Er wird in ein paar Sekunden geprüft.',
    sealing: 'Versiegelung der letzten Tipps von Runde {day}',
    checkNow: 'Jetzt prüfen',
    checkHint:
      'Ein Bot prüft alle paar Sekunden neue Tipps. Alle können die Prüfung ausführen; sie kostet Netzwerkgebühren.',
    missed: 'Nicht die Zahl: {numbers}',
    left: 'Die Zahl ist eine der {n} noch nicht probierten Zahlen.',
    foundByYou: 'Du hast sie gefunden! {number} war die Zahl',
    foundByOther: 'Ein anderer Spieler hat die Zahl gefunden',
    nextRound: 'Eine neue Runde mit einer neuen Zahl ist im Verkauf.',
    perGuess: 'Jeder Tipp: 1 zu {n} bei der nächsten Prüfung',
  },

  /** The top of the play page: the round, its pot and its clock. */
  stage: {
    round: 'Runde {round}',
    winnerTakes: 'Der Gewinner erhält ◎{prize}',
    lastDraw: 'Letzte Ziehung',
    closesIn: 'Schließt in',
  },

  /** The play page's list of the connected wallet's tickets. */
  tickets: {
    none: 'Noch keine Lose in dieser Runde. Wähle eine Zahl, um eins zu bekommen.',
    connect: 'Verbinde eine Wallet, um zu spielen. Deine Lose erscheinen hier.',
    missed: 'Daneben',
    won: 'Gewonnen',
  },

  /** The moment a round is drawn while the play page is open. */
  reveal: {
    title: 'Runde {round} ist gezogen',
    number: 'Gewinnzahl',
    youWon: 'Du hast ◎{amount} gewonnen!',
    winner: 'Der Gewinner erhält ◎{amount}',
    see: 'Ziehung ansehen',
    close: 'Schließen',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Verlauf',
    total: 'Gesamt',
    games: 'Spiel | Spiele',
    waiting: 'Warten auf die Ziehung',
    settle: 'Abwickeln',
    settleDay: '{day} abwickeln',
    anyone:
      'Alle können eine beendete Runde schließen, ziehen und auszahlen. Das kostet nur Netzwerkgebühren; der Gewinn geht immer an den Gewinner.',
    rent: '{n} altes Ticket bindet ◎{sol} an Rent | {n} alte Tickets binden ◎{sol} an Rent',
    rentHint: 'Schließe sie, um diese SOL zurückzubekommen. Die Runde behält ihre Ergebnisse.',
    getBack: 'Zurückholen',
    winners: 'Gewinner',
    noWinners: 'Noch keine Gewinner',
    firstDraw: 'Der erste Gewinner erscheint hier.',
    chart: 'Pot pro Runde',
    chartEmpty: 'Noch keine beendeten Runden.',
    chartLabel:
      'Pot der letzten Runde; die Liste darunter enthält jeden Wert. | Pot der letzten {n} Runden; die Liste darunter enthält jeden Wert.',
  },

  status: {
    open: 'Offen',
    toClose: 'Wartet auf Schließung',
    toDraw: 'Wartet auf Ziehung',
    checking: 'Tipps werden geprüft',
    unpaid: 'Gezogen, unbezahlt',
    paid: 'Ausgezahlt',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Live',
    connecting: 'Verbinden',
    offline: 'Offline',
    atTable: '{n} am Tisch',
    picking: '{n} wählt | {n} wählen',
    you: 'du',
    joined: 'beigetreten',
    now: 'jetzt',
    empty: 'Der Tisch ist offen. Das nächste Ticket erscheint hier, sobald es landet.',
    joinedOne: 'Ein neuer Spieler hat am Tisch Platz genommen',
    joinedMany: '{n} neuer Spieler hat am Tisch Platz genommen | {n} neue Spieler haben am Tisch Platz genommen',
    hereNow: '{n} gerade hier',
    locked: '{who} sichert sich {number}',
    potNow: 'Der Pot liegt jetzt bei ◎{pot} mit {n} Ticket | Der Pot liegt jetzt bei ◎{pot} mit {n} Tickets',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'In deiner Wallet bestätigen…',
    cancel: 'Abbrechen',
    otherWay: 'Anders versuchen',
    abandoned:
      'Die Seite wartet nicht mehr auf deine Wallet. Wenn die Wallet die Anfrage noch zeigt, lehne sie dort ab.',
    done: '{label}: erledigt',
    cancelled: '{label}: abgebrochen',
    failed: '{label} fehlgeschlagen',
    view: 'Transaktion ansehen',
    buying: 'Kauf der Zahl {number}',
    bought: 'Die Zahl {number} gehört dir. Viel Glück!',
    repin: 'Neufestlegung des Ziehungs-Slots für {day}',
    closing: 'Schließung von {day}',
    drawing: 'Ziehung von {day}',
    paying: 'Auszahlung an den Gewinner von {day}',
    paid: '◎{amount} an den Gewinner von {day} ausgezahlt',
    settleFailed: '{day} konnte nicht abgewickelt werden',
    reclaiming: 'Rückholung der Ticket-Rent',
    slowSlot: 'Der Cluster braucht lange, um den Ziehungs-Slot zu erreichen. Versuch es in einer Minute noch einmal.',
    noWinner: 'Das Gewinnerticket wurde nicht gefunden.',
  },

  wallet: {
    connect: 'Wallet verbinden',
    /** The badge on the wallet the site recommends (Solflare). */
    recommended: 'Empfohlen',
    title: 'Verbinde eine Wallet',
    description: 'Jede Solana-Wallet, die den Wallet Standard unterstützt, funktioniert.',
    none: 'In diesem Browser wurde keine Solana-Wallet gefunden. Installiere eine und lade die Seite dann neu:',
    phone:
      'Browser auf dem Handy haben keine Wallet-Erweiterungen. Öffne S☉Lucky in deiner Wallet-App, um dich zu verbinden:',
    openIn: 'In {wallet} öffnen',
    getApp: 'Noch keine Wallet-App? Installiere eine und öffne S☉Lucky darin:',
    failed: '{wallet} konnte nicht verbunden werden',
    noAccount:
      '{wallet} hat kein Solana-Konto freigegeben. Füge in {wallet} ein Solana-Konto hinzu oder wähle eines aus, dann verbinde dich erneut.',
    copied: 'Adresse kopiert',
    balance: 'Guthaben',
    ticketsLeft: 'noch {n} Ticket | noch {n} Tickets',
    needMore: 'mehr SOL zum Spielen nötig',
    numbers: 'Deine Zahlen in dieser Runde',
    copy: 'Adresse kopieren',
    explorer: 'Explorer',
    play: 'Spielen',
    disconnect: 'Trennen',
  },

  round: {
    title: 'Runde {day}',
    back: 'Zurück zum Spiel',
    notDate:
      'Das ist keine Runde dieses Spiels. Tägliche Runden heißen YYYY-MM-DD, stündliche YYYY-MM-DDTHH und Runden von „Errate die Zahl“ nach ihrer Nummer.',
    kicker: 'Runde',
    nobody: 'In dieser Runde hat niemand gespielt',
    beFirst: 'Sei der Erste, der in dieser Runde ein Ticket kauft.',
    onlyExists: 'Eine Runde existiert erst, wenn ihr erstes Ticket verkauft ist.',
    pot: 'Pot',
    usd: '{usd} zum heutigen Kurs',
    winner: 'Gewinner',
    won: '◎{payout} gewonnen · Gebühr ◎{fee}',
    unpaid: 'Noch nicht ausgezahlt',
    anyone: 'Alle können diese Runde zu Ende bringen. Das kostet nur Netzwerkgebühren.',
    settle: 'Diese Runde abwickeln',
    sold: 'Verkaufte Tickets',
    price: 'Ticketpreis',
    fee: 'Hausgebühr',
    slot: 'Festgelegter Slot',
    check: 'Ziehung prüfen',
    formula: 'Zufallswert = sha256(Entropie ‖ Slot-Hash ‖ Ziehungs-Slot ‖ Rundenadresse)',
    recompute: 'In meinem Browser nachrechnen',
    entropy: 'Entropie (jeder Kauf, der Reihe nach gehasht)',
    slotHash: 'Slot-Hash von Slot {slot} (vom Programm aus der Sysvar SlotHashes gelesen)',
    randomness: 'Zufallswert',
    winning: 'Gewinnerticket',
    winningFormula: 'erste 8 Bytes als u64 mod {count} = {drawn}; das nächstgelegene Ticket hält {number}',
    guessFormula:
      'erste 8 Bytes als u64 mod {left} (noch nicht probierte Zahlen) = {r}, unter {batch} (Tipps in der Prüfung): Kauf #{index} hat die Zahl gefunden',
    ok: 'Die Ziehung stimmt.',
    mismatch: 'Abweichung: Das gespeicherte Ergebnis passt nicht zu den Eingaben.',
    got: 'Dein Browser kam auf {hash}… und die Zahl {number}.',
    tickets: 'Tickets',
    ticketsHint:
      'Tickets, die ihre Besitzer nach der Auszahlung geschlossen haben, erscheinen hier nicht mehr; die Runde behält die Summen.',
    noTickets: 'Für diese Runde sind keine offenen Tickets mehr übrig.',
    account: 'Rundenkonto {address} · {day}',
  },

  country: {
    private: 'Privat',
  },

  errors: {
    rejected: 'Du hast die Anfrage in deiner Wallet abgebrochen.',
    taken: 'Jemand hat diese Zahl in dieser Runde schon. Wähle eine andere.',
    funds: 'Nicht genug SOL in der Wallet.',
    noSol: 'Diese Wallet hat in diesem Netzwerk noch kein SOL. Lade etwas auf, dann versuche es noch einmal.',
    wrongCluster:
      'Deine Wallet hat die Transaktion in ein anderes Netzwerk gesendet. Stelle sie auf {network} um, dann versuche es noch einmal.',
    notSetUp: 'Dieses Spiel ist in diesem Netzwerk noch nicht eingerichtet.',
    outdated: 'Die App ist veraltet. Lade die Seite neu, dann versuche es noch einmal.',
    expired:
      'Die Transaktion ist abgelaufen, bevor sie bestätigt wurde. Prüfe die Aktivität deiner Wallet, bevor du es noch einmal versuchst.',
    walletFailed:
      'Deine Wallet meldete „Unexpected error“ und hat nicht signiert. Schließe ihr Fenster, sperre und entsperre sie oder starte die Erweiterung neu, dann versuche es noch einmal.',
    walletNetwork:
      'Achte darauf, dass deine Wallet auf {network} steht (in Phantom: Settings → Developer Settings → Testnet Mode), oder nimm eine andere Wallet.',
    rateLimited: 'Der RPC-Endpunkt begrenzt die Anfragen (HTTP 429). Warte eine Minute und versuche es noch einmal.',
    rpcHttp: 'Der RPC-Endpunkt antwortete mit dem HTTP-Fehler {status}.',
    unknown: 'Etwas ist schiefgelaufen.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Nur die Authority kann das tun.',
      invalidTicketPrice: 'Der Ticketpreis muss mindestens 0,002 SOL betragen.',
      feeTooHigh: 'Die Gebühr liegt über der Obergrenze von 20 %.',
      invalidMaxNumber: 'Die höchste Zahl muss größer als null sein.',
      paused: 'Der Ticketverkauf ist pausiert.',
      wrongRound: 'Tickets können nur für die Runde im Verkauf gekauft werden.',
      numberOutOfRange: 'Die Zahl liegt außerhalb des Bereichs.',
      invalidCountry: 'Das Land muss ein Code nach ISO 3166-1 alpha-2 in Großbuchstaben sein.',
      roundNotOpen: 'Die Runde ist nicht offen.',
      roundNotOver: 'Die Runde ist noch nicht beendet.',
      roundAlreadyDrawn: 'Die Runde wurde bereits gezogen.',
      drawStillPossible: 'Der festgelegte Slot kann noch gezogen werden.',
      roundNotClosed: 'Die Runde ist nicht geschlossen.',
      targetSlotNotReached: 'Der festgelegte Slot ist noch nicht erreicht.',
      randomnessUnavailable:
        'Der Hash des festgelegten Slots ist noch nicht lesbar; versuch es gleich noch einmal oder schließe die Runde erneut, sobald er abgelaufen ist.',
      roundNotDrawn: 'Die Runde wurde noch nicht gezogen.',
      notWinningTicket: 'Das ist nicht das Gewinnerticket.',
      roundNotSettled: 'Die Runde wurde noch nicht abgewickelt.',
      overflow: 'Arithmetischer Überlauf.',
      priceChanged: 'Der Ticketpreis ist höher als der Preis, den du akzeptiert hast.',
      feeAlreadyCollected: 'Die Gebühr dieser Runde wurde bereits eingezogen.',
      roundFull: 'Diese Runde hat alle Tickets verkauft, die sie aufnehmen kann.',
      nothingToCheck: 'Es gibt keine neuen Tipps zu prüfen.',
      batchSealed: 'Die letzten Tipps werden gerade geprüft; versuch es in ein paar Sekunden noch einmal.',
      invalidGame: 'Unbekanntes Spiel.',
      ticketsMismatch: 'Gib mindestens eine Zahl an, und für jede Zahl ein Ticketkonto.',
      wrongTicketAccount: 'Ein Ticketkonto passt nicht zu seiner Zahl.',
      allTaken: 'Alle Zahlen waren schon vergeben. Wähle andere.',
      notSessionKey: 'Dieser Schlüssel kann nicht aus dieser Schnellkauf-Sitzung ausgeben.',
      sessionExpired: 'Der Schnellkauf ist beendet. Verlängere ihn oder schalte ihn aus.',
      sessionBudgetLow:
        'Im Schnellkauf ist für diese Tickets zu wenig übrig. Lade Guthaben auf oder kaufe mit deiner Wallet.',
      invalidSessionExpiry: 'Der Schnellkauf muss in der Zukunft enden, innerhalb von 30 Tagen.',
    },
  },

  legal: {
    kicker: 'Rechtliches',
    updated: 'Zuletzt aktualisiert am {date}',
    onThisPage: 'Auf dieser Seite',
    others: 'Weitere rechtliche Dokumente',
    translated:
      'Diese Seite ist eine Übersetzung des englischen Originals. Weichen beide voneinander ab, gilt die englische Fassung.',
    readEnglish: 'Auf Englisch lesen',
    repository: 'Quellcode-Repository',

    pages: {
      notice: {
        label: 'Rechtliche Hinweise',
        description: 'Wer S☉Lucky betreibt, wie du uns erreichst und welche Dokumente gelten.',
      },
      terms: {
        label: 'Nutzungsbedingungen',
        description:
          'Die Regeln für die Nutzung der Website und das Spielen, und was das Programm verspricht und was nicht.',
      },
      privacy: {
        label: 'Datenschutzerklärung',
        description: 'Was auf Solana öffentlich ist, was unsere Server sehen und was wir nie erheben.',
      },
      cookies: {
        label: 'Cookies & Speicher',
        description: 'Keine Cookies, keine Tracker: die fünf Einstellungen, die die App in deinem Browser speichert.',
      },
      play: {
        label: 'Verantwortungsvolles Spielen',
        description: 'Wie die Chancen funktionieren und wo du Hilfe bekommst, wenn das Spielen keinen Spaß mehr macht.',
      },
    },

    notice: {
      description: 'Wer S☉Lucky betreibt, wie du uns erreichst und welche Dokumente gelten, wenn du es nutzt.',
      operator: {
        title: 'Wer S☉Lucky betreibt',
        body: 'S☉Lucky wird von {operator} entwickelt und betrieben. Du erreichst uns per E-Mail unter {email} und erfährst mehr über uns auf {site}.',
      },
      software: {
        title: 'Das Programm und die Website',
        intro: 'S☉Lucky besteht aus zwei Teilen:',
        program:
          '{name}, ein Solana-Programm, das die Tickets verkauft, den Pot jedes Tages verwahrt und den Gewinner auszahlt. Diese Website nutzt das Programm unter {address} auf Solana {cluster}. Alle können es direkt nutzen, ohne diese Website.',
        programName: 'Das Programm',
        site: '{name}, die die öffentlichen Daten des Programms anzeigt und dir hilft, Transaktionen aus deiner eigenen Wallet zu senden. Sie verwahrt nie deine Schlüssel oder deine SOL.',
        siteName: 'Diese Website',
      },
      documents: {
        title: 'Dokumente',
        intro: 'Wer die Website nutzt, akzeptiert diese Dokumente:',
      },
      security: {
        title: 'Eine Sicherheitslücke melden',
        body: 'Bitte eröffne kein öffentliches Issue. Schreib eine E-Mail an {email} mit dem Betreff {subject} und teste niemals mit dem Geld anderer Spieler: Nutze das Devnet oder einen lokalen Validator. Die Sicherheitsrichtlinie, {file} im {repository}, erklärt, was du angeben solltest und was in den Geltungsbereich fällt.',
      },
      license: {
        title: 'Open-Source-Lizenz',
        body: 'Das Programm, die App und die Betreiberskripte sind Open Source unter der MIT-Lizenz ({file} im {repository}), © {years} {operator}. Die Lizenz gilt für den Code; für die Nutzung dieser Website gelten die {terms}.',
      },
    },

    terms: {
      description: 'Die Regeln für die Nutzung von S☉Lucky und was sein Programm verspricht und was nicht.',
      agreement: {
        title: 'Diese Bedingungen',
        p1: 'Diese Bedingungen gelten, wenn du die Website und die App von S☉Lucky nutzt, die von {operator} („wir“, „uns“) betrieben werden. Mit der Nutzung akzeptierst du diese Bedingungen, zusammen mit der {privacy} und der Seite {cookies}. Wenn du sie nicht akzeptierst, nutze die Website nicht.',
        p2: 'Das Spiel selbst ist ein Solana-Programm: Open-Source-Software, die im Solana-Netzwerk läuft, nicht auf unseren Servern. Die Website ist ein Weg, es zu nutzen; alle können das Programm auch direkt nutzen.',
      },
      eligibility: {
        title: 'Wer spielen darf',
        age: 'Du musst mindestens 18 Jahre alt sein.',
        legal:
          'Du darfst nur dort spielen, wo Lotterien und Online-Glücksspiele für dich legal sind. Das zu prüfen liegt in deiner Verantwortung; wir prüfen nicht, wo du dich befindest.',
        own: 'Spiel nicht für jemand anderen und nicht mit SOL, die dir nicht gehören.',
      },
      money: {
        title: 'Test-SOL und echte SOL',
        test: 'Diese Website läuft auf {cluster}. Tickets kosten Test-SOL, die kostenlos über einen Faucet erhältlich sind und keinen Wert haben: Sie können nicht in echtes Geld umgetauscht werden, und auch nichts, was du damit gewinnst.',
        real: 'Diese Website läuft auf {cluster}. Tickets kosten echte SOL, und Pots werden in echten SOL ausgezahlt.',
      },
      rounds: {
        title: 'Wie eine Runde abläuft',
        intro: 'Das Programm setzt diese Regeln durch; die Website zeigt sie nur an:',
        day: 'S☉Lucky hat drei Spiele. In der täglichen Lotterie läuft pro UTC-Tag eine Runde, von 00:00 UTC bis zur nächsten Mitternacht; in der stündlichen Lotterie pro UTC-Stunde. Bei „Errate die Zahl“ hat eine Runde kein Ende: Sie läuft, bis ein Tipp ihre Zahl findet.',
        number:
          'Ein Ticket ist eine Zahl, von 0 bis zur höchsten Zahl, die in der Konfiguration des Programms festgelegt ist. Jede Zahl kann pro Runde nur von einem Ticket belegt werden.',
        price:
          'Jedes Spiel hat seinen eigenen Ticketpreis und seine eigene Hausgebühr. Sie werden beim Öffnen einer Runde zusammen mit der höchsten Zahl übernommen und bleiben für diese Runde fest. Die Gebühr kann nie mehr als 20 % des Pots betragen. Beim Kauf zahlst du nie mehr als den Preis, der dir angezeigt wurde.',
        pot: 'Der Preis jedes Tickets fließt in den Pot der Runde, den das eigene Konto der Runde auf Solana verwahrt. In den Lotterien wird eine Zufallszahl von 0 bis zur höchsten Zahl gezogen, und das Ticket, das ihr am nächsten liegt, gewinnt; bei Gleichstand gewinnt die niedrigere Zahl. Bei „Errate die Zahl“ werden neue Tipps in Stapeln geprüft: Ein Stapel enthält die Zahl mit einer Chance von seinen Tipps geteilt durch die noch nicht probierten Zahlen, dieselbe Chance wie für eine Zahl, die beim Öffnen der Runde versteckt wurde.',
        draw: 'Sobald eine Lotterierunde beendet ist oder neue Tipps auf eine Prüfung warten, können alle die Runde schließen, ziehen und auszahlen. Der Besitzer des Gewinnertickets erhält 80 % des Pots, die Hausgebühr geht an die Treasury, und der Rest bleibt im Programm für die nächste gezogene Runde des Spiels.',
        rent: 'Ein Ticketkonto hält außerdem eine kleine Rent-Kaution, die du zurückbekommst, wenn du das Ticket schließt, sobald seine Runde ausgezahlt ist. Das erste Ticket einer Runde zahlt außerdem die Rent für das Konto der Runde, das als öffentlicher Nachweis der Runde auf Solana bleibt. In den Lotterien zahlt jedes Ticket außerdem die Rent für die 4 Bytes, die seine Zahl in diesem Konto belegt; sie wird nicht erstattet.',
      },
      wallet: {
        title: 'Deine Wallet und Transaktionen',
        own: 'Du spielst mit deiner eigenen Wallet. Wir verwahren nie deine Schlüssel, deine SOL oder deine Tickets und können sie nicht bewegen.',
        sign: 'Du signierst jede Transaktion selbst und zahlst die Netzwerkgebühren von Solana. Bestätigte Transaktionen sind endgültig: Wir können sie nicht stornieren, rückgängig machen oder erstatten.',
        public:
          'Die Zahl eines Tickets, die Adresse seines Besitzers und die Länderflagge, die du dafür wählst, sind auf Solana dauerhaft öffentlich. Die {privacy} erklärt, was das bedeutet.',
        keys: 'Bewahre die Schlüssel deiner Wallet sicher auf. Niemand, auch wir nicht, kann sie für dich wiederherstellen.',
      },
      operator: {
        title: 'Was der Betreiber tun kann und was nicht',
        intro: 'Die Konfiguration des Programms hat eine Authority, die:',
        price:
          'den Ticketpreis (mindestens ◎0,002) und die Hausgebühr (höchstens 20 %) jedes Spiels ändern kann, wirksam ab der nächsten Runde dieses Spiels, die öffnet;',
        pause:
          'neue Runden pausieren und fortsetzen kann. Eine Pause verhindert nur, dass neue Runden beginnen: Eine Runde, die bereits läuft, verkauft weiter bis zu ihrem Ende, und jede Runde kann weiterhin gezogen und ausgezahlt werden;',
        other: 'die Treasury, die höchste Zahl und die Authority selbst ändern kann.',
        cannot:
          'Der Code des Programms erlaubt es weder der Authority noch sonst jemandem, den Pot einer Runde zu nehmen oder ihn anderswohin zu senden als an den Besitzer des Gewinnertickets, als Gebühr an die Treasury und an die nächste Runde des Spiels, mehr als die Gebühr zu nehmen oder einem Käufer mehr als den ihm angezeigten Preis zu berechnen.',
        upgrade:
          'Das Programm ist upgradebar: Wer seine Upgrade-Authority hält, könnte anderen Code deployen, du vertraust dieser Person also, bis das Programm unveränderlich gemacht oder an eine Multisig übergeben wird. Der Quellcode jeder Version ist öffentlich, und ein deploytes Programm kann damit abgeglichen werden, wie es der Abschnitt „Verifiable builds“ im README erklärt.',
      },
      risks: {
        title: 'Risiken',
        intro: 'Mit dem Spielen akzeptierst du, dass:',
        bugs: 'Software Fehler haben kann, auch das Programm, die App und deine Wallet, und ein Fehler dich deine Tickets oder deine SOL kosten könnte;',
        network:
          'Solana oder der RPC-Endpunkt, den die Website nutzt, langsam, überlastet oder ausgefallen sein können und eine Transaktion fehlschlagen oder erst nach dem Schließen einer Runde ankommen kann;',
        draw: 'die Ziehung den Hash eines Solana-Slots nutzt, den niemand kennt, wenn eine Runde schließt oder ein Stapel von Tipps versiegelt wird. Spieler können ihn nicht vorhersagen, aber der Validator, der diesen Slot produziert, könnte ihn beeinflussen, und wer eine Runde schließt, könnte eine ungünstige Ziehung zurückhalten, bis dieser Slot nicht mehr gelesen werden kann. Sie ist kein verifizierbares Zufallsorakel;',
        site: 'die Website jederzeit nicht verfügbar sein kann. Das Programm und deine Tickets funktionieren ohne sie weiter;',
        law: 'Gesetze zu Lotterien und Kryptowerten sich von Land zu Land unterscheiden und sich ändern können.',
      },
      use: {
        title: 'Faire Nutzung der Website',
        body: 'Greif die Website oder ihre Server nicht an und überlaste sie nicht, versuch nicht, ihre Limits zu umgehen, stör andere Spieler nicht und nutze die Website nicht, um gegen das Gesetz zu verstoßen. Wir können allen, die das tun, den Zugang sperren.',
      },
      liability: {
        title: 'Keine Gewährleistung',
        body: 'Die Website und das Programm werden „wie besehen“ bereitgestellt, ohne jegliche Gewährleistung. Soweit gesetzlich zulässig, haften wir nicht für Verluste, die aus ihrer Nutzung entstehen, einschließlich verlorener Tickets, fehlgeschlagener oder verspäteter Transaktionen, Fehler, Netzwerkprobleme oder einer Ziehung, die du für unfair hältst. Nichts in diesen Bedingungen beschränkt eine Haftung, deren Beschränkung uns gesetzlich nicht erlaubt ist.',
      },
      openSource: {
        title: 'Open Source',
        body: 'Das Programm, die App und die Betreiberskripte sind Open Source unter der MIT-Lizenz: siehe das {repository}. Diese Lizenz gilt für den Code; diese Bedingungen gelten für die Nutzung dieser Website.',
      },
      changes: {
        title: 'Änderungen',
        body: 'Wir können diese Bedingungen aktualisieren. Das Datum oben zeigt die letzte Änderung, und die hier angezeigte Fassung gilt ab diesem Datum.',
      },
      contact: {
        title: 'Kontakt',
        body: 'Fragen zu diesen Bedingungen: {email}.',
      },
    },

    privacy: {
      description: 'Was auf Solana öffentlich ist, was unsere Server sehen und was wir nie erheben.',
      summary: {
        title: 'Kurz gesagt',
        account: 'Es gibt kein Benutzerkonto, keine E-Mail und keine Registrierung. Du spielst mit einer Wallet.',
        cookies: 'Die Website setzt keine Cookies und lädt keine Analyse-Tools, Werbung oder Tracker.',
        database: 'Wir führen keine Datenbank über Spieler, und wir verkaufen oder teilen keine Daten über dich.',
        public:
          'Deine Tickets sind auf Solana öffentlich, und zwar absichtlich: Genau das ermöglicht es allen, das Spiel zu prüfen.',
        controller: '{operator} betreibt die Website und ist für die Daten verantwortlich, die sie verarbeitet.',
      },
      onChain: {
        title: 'Was auf Solana öffentlich ist',
        intro: 'Wenn du ein Ticket kaufst, halten die Transaktion und das Konto des Tickets öffentlich fest:',
        address: 'deine Wallet-Adresse und die Transaktionen, die sie signiert;',
        number: 'die Zahl, die du gewählt hast, die Runde und den Zeitpunkt des Kaufs;',
        flag: 'die Länderflagge, die du für das Ticket gewählt hast, oder keine, wenn du sie privat hältst.',
        ledger:
          'Wenn eine Runde gezogen wird, hält ihr Konto außerdem die Adresse des Gewinners, die Gewinnzahl und ihre Flagge sowie die Auszahlung fest. Solana ist ein öffentliches Hauptbuch: Alle können diese Daten lesen, viele bewahren Kopien davon auf, und sie bleiben dauerhaft dort. Das Schließen eines Tickets löscht sein Konto und erstattet seine Rent, aber die Transaktionen, die es erstellt und geschlossen haben, bleiben im Hauptbuch. Weder wir noch sonst jemand kann sie ändern oder löschen.',
        link: 'Eine Wallet-Adresse ist nicht dein Name, kann aber mit dir in Verbindung gebracht werden, zum Beispiel über eine Börse, die du genutzt hast. Nutze eine separate Wallet, wenn du dein Spielen vom Rest deiner Aktivität getrennt halten willst.',
      },
      servers: {
        title: 'Was unsere Server sehen',
        visit: 'Jeder Besuch',
        visitBody:
          'Die Website wird bei Cloudflare gehostet. Wie jede Website empfängt sie deine IP-Adresse, den User-Agent deines Browsers und die Seiten, die du aufrufst, um sie auszuliefern und die Website vor Missbrauch zu schützen. Cloudflare speichert Betriebslogs für begrenzte Zeit gemäß seiner {policy}. Wir nutzen sie nur, um die Website zu betreiben und zu reparieren.',
        policy: 'eigenen Datenschutzrichtlinie',
        country: 'Dein Land',
        countryBody:
          'Cloudflare teilt unserem Server mit, aus welchem Land jede Anfrage kommt. Die App fragt es einmal ab, um die Flagge für deine Tickets vorzuschlagen; du kannst sie vor dem Kauf ändern oder privat halten. Der Server liest nur das Land, nicht deine IP-Adresse, und speichert es nicht.',
        live: 'Der Live-Tisch auf der Seite „Spielen“',
        liveBody:
          'Solange die Seite „Spielen“ geöffnet ist, hält dein Browser eine Verbindung zu unserem Server, damit Spieler sehen können, wer sonst noch da ist. Sie teilt drei Dinge mit den anderen Personen auf der Seite: eine zufällige ID nur für diese Verbindung, die Flagge, die deine Tickets zeigen (keine, wenn du dein Land privat hältst), und ob du gerade eine Zahl eingibst, nie die Zahl selbst. Keine Wallet-Adresse und keine IP-Adresse fließen ein, und nichts über die Verbindung wird gespeichert oder nach ihrem Ende aufbewahrt.',
        price: 'Der SOL-Kurs',
        priceBody:
          'Um Pots in Dollar anzuzeigen, ruft unser Server den SOL-Kurs bei Coinbase ab, oder bei CoinGecko, falls Coinbase nicht antwortet, und speichert ihn eine Minute lang zwischen. Diese Anfragen kommen von unserem Server und enthalten nichts über dich.',
        push: 'Benachrichtigungen zu Ziehungen',
        pushBody:
          'Wenn du Benachrichtigungen für ein Spiel einschaltest, gibt dein Browser unserem Server ein Push-Abonnement: eine Adresse beim Push-Dienst deines Browsers (betrieben von Google, Mozilla, Apple oder Microsoft, je nach Browser) und die Schlüssel, um Nachrichten dafür zu verschlüsseln. Wir speichern es zusammen mit deiner Sprache und den gewählten Spielen, sonst nichts: keine Wallet-Adresse, keine IP-Adresse. Wenn eine Runde eines dieser Spiele gewonnen wird, schickt unser Server das Ergebnis verschlüsselt über diesen Push-Dienst, der es nach seiner eigenen Richtlinie an deinen Browser zustellt. Schaltest du die Benachrichtigungen aus, wird das Abonnement gelöscht; wir löschen es auch, wenn der Push-Dienst meldet, dass es nicht mehr existiert.',
      },
      thirdParties: {
        title: 'Dienste, die dein Browser nutzt',
        rpc: '{name}, über den die App das Spiel liest und deine Transaktionen sendet: {endpoint}. Er empfängt deine IP-Adresse und die Konten, die die App abfragt, einschließlich des Kontos deiner Wallet, sobald du sie verbindest, gemäß der Richtlinie seines Betreibers.',
        rpcName: 'Ein Solana-RPC-Endpunkt',
        rpcHost: '{host} auf dieser Website',
        rpcPublic: 'der öffentliche Endpunkt von Solana für {cluster}',
        wallet:
          '{name}, etwa Solflare, Phantom oder Backpack, ist Software ihres eigenen Herstellers, mit eigener Richtlinie. Die Website bittet sie nur, sich zu verbinden und die Transaktionen zu signieren, die du freigibst.',
        walletName: 'Deine Wallet',
        links:
          '{name}: Solana Explorer, der Solana-Faucet, GitHub und unsere Social-Media-Konten sind andere Websites mit eigenen Richtlinien.',
        linksName: 'Links, die du öffnest',
        own: 'Schriften, Sounds und Bilder kommen von unserer eigenen Domain, daher kontaktiert das Laden der Website niemanden sonst.',
      },
      browser: {
        title: 'Was in deinem Browser bleibt',
        body: 'Die App speichert fünf Einstellungen im lokalen Speicher deines Browsers: dein Farbschema, deine zuletzt genutzte Wallet, deine Länderwahl, die Sound-Einstellung und deine Sprache. Die Seite {cookies} listet sie auf.',
        cache:
          'Damit sie auch ohne Verbindung startet, speichert die App außerdem Kopien der besuchten Seiten und ihrer eigenen Dateien im Cache-Speicher deines Browsers. Jede neue Version der Website ersetzt sie.',
      },
      purposes: {
        title: 'Wozu, und was wir nie tun',
        body: 'Wir verarbeiten die oben genannten Daten nur, um die Website anzuzeigen, das Spiel auszuführen, das du spielen möchtest, die Website sicher zu halten und Probleme zu beheben. Wir erstellen keine Profile, zeigen keine Werbung, verkaufen keine Daten und teilen sie nicht mit Werbetreibenden.',
      },
      rights: {
        title: 'Deine Wahlmöglichkeiten und Rechte',
        flag: 'Du kannst ohne Länderflagge spielen: Entscheide dich vor dem Kauf, sie privat zu halten.',
        clear:
          'Du kannst die Einstellungen in deinem Browser jederzeit löschen und eine neue Wallet nutzen, wann immer du willst.',
        law: 'Je nachdem, wo du lebst, hast du möglicherweise das Recht, auf personenbezogene Daten über dich zuzugreifen, sie berichtigen oder löschen zu lassen oder ihrer Verwendung zu widersprechen. Schreib an {email}, und wir antworten. Wir haben fast nichts über dich gespeichert, und was auf Solana steht, können wir nicht ändern oder löschen.',
      },
      children: {
        title: 'Kinder',
        body: 'S☉Lucky ist für Personen ab 18 Jahren. Wir verarbeiten nicht wissentlich Daten über jüngere Personen.',
      },
      changes: {
        title: 'Änderungen und Kontakt',
        body: 'Wir aktualisieren diese Seite, wenn die Website ändert, wie sie mit Daten umgeht; das Datum oben zeigt die letzte Änderung. Fragen: {email}.',
      },
    },

    cookies: {
      description:
        'Keine Cookies, keine Tracker: die fünf Einstellungen, die die App in deinem Browser speichert, und wie du sie entfernst.',
      none: {
        title: 'Keine Cookies',
        p1: 'S☉Lucky setzt keine Cookies und lädt keine Analyse-, Werbe- oder Tracking-Skripte. Die Sicherheitsrichtlinie der Website erlaubt nur Skripte von ihrer eigenen Domain.',
        p2: 'Unser Hoster, Cloudflare, kann unbedingt notwendige Sicherheits-Cookies wie {cookie} setzen, wenn sein Bot-Schutz aktiv ist. Cloudflare nutzt sie, um Menschen von Bots zu unterscheiden, wie seine {list} erklärt.',
        list: 'Cookie-Liste',
      },
      storage: {
        title: 'Was die App in deinem Browser speichert',
        intro:
          'Die App speichert einige Einstellungen im lokalen Speicher deines Browsers, damit sie beim nächsten Mal noch da sind. Sie bleiben auf deinem Gerät, mit einer Ausnahme: Die Flagge, die du wählst, kommt auf die Tickets, die du kaufst, und wird am Live-Tisch der Seite „Spielen“ angezeigt, solange du dort bist.',
        key: 'Schlüssel',
        holds: 'Inhalt',
        saved: 'Gespeichert',
        wallet: 'Deine Wallet-Erweiterung speichert ihre eigenen Daten, gemäß der Richtlinie ihres Herstellers.',
        cache:
          'Damit sie auch ohne Verbindung startet, speichert die App außerdem Kopien der besuchten Seiten und ihrer eigenen Dateien im Cache-Speicher deines Browsers; jede neue Version der Website ersetzt sie. Wenn du Benachrichtigungen zu Ziehungen einschaltest, speichert dein Browser zusätzlich das Push-Abonnement, bis du sie ausschaltest. Das Löschen der Daten dieser Website entfernt all das.',
      },
      keys: {
        theme: {
          holds: 'Dein helles oder dunkles Farbschema.',
          when: 'Wenn du das Farbschema wechselst.',
        },
        wallet: {
          holds: 'Der Name der zuletzt verbundenen Wallet und ihre Adresse, damit die App sie wieder verbinden kann.',
          when: 'Wenn du eine Wallet verbindest; entfernt, wenn du sie trennst.',
        },
        country: {
          holds: 'Die Länderflagge, die du für deine Tickets gewählt hast, oder dass du sie privat hältst.',
          when: 'Wenn du eine Flagge wählst.',
        },
        sound: {
          holds: 'Ob Sounds an oder aus sind.',
          when: 'Wenn du den Ton aus- oder einschaltest.',
        },
        lang: {
          holds: 'Die Sprache, die du gewählt hast, damit die App dir nicht noch einmal eine andere anbietet.',
          when: 'Wenn du eine Sprache wählst oder auf das Angebot antwortest, die Website in deiner zu lesen.',
        },
      },
      clear: {
        title: 'Entfernen',
        disconnect: 'Trenne deine Wallet in der App, um {key} zu entfernen.',
        site: 'Lösche die Daten dieser Website in den Einstellungen deines Browsers, um alle zu entfernen.',
        private: 'In einem privaten Fenster werden sie gelöscht, wenn du es schließt.',
        reset: 'Das Entfernen setzt nur diese Einstellungen zurück; deine Tickets sind auf Solana und bleiben deine.',
      },
      banner: {
        title: 'Warum es keinen Cookie-Banner gibt',
        body: 'Nichts hier trackt dich, und jede Einstellung oben existiert, weil du sie gesetzt hast. Es gibt also nichts zu akzeptieren oder abzulehnen.',
      },
    },

    play: {
      description: 'Wie die Chancen funktionieren und wo du Hilfe bekommst, wenn das Spielen keinen Spaß mehr macht.',
      basics: {
        title: 'Bevor du spielst',
        age: 'S☉Lucky ist für Personen ab 18 Jahren, dort, wo Lotterien legal sind.',
        test: 'Diese Website läuft auf Solana {cluster}: Tickets kosten Test-SOL, die kostenlos sind und keinen Wert haben. Das ist eine gute Möglichkeit zu sehen, wie das Spiel funktioniert, ohne etwas auszugeben.',
        real: 'Diese Website läuft auf Solana Mainnet: Tickets kosten echte SOL.',
        fun: 'Spiel zum Spaß, nie, um Geld zu verdienen oder verlorenes Geld zurückzugewinnen.',
      },
      odds: {
        title: 'Kenne die Chancen',
        same: 'In den Lotterien gewinnt das Ticket, das einer Zufallszahl am nächsten liegt: Deine Chance ist der Anteil des Zahlenbereichs, der näher an deinen Zahlen liegt als an denen aller anderen. Bei „Errate die Zahl“ findet jede Prüfung die Zahl mit einer Chance von neuen Tipps geteilt durch die noch nicht probierten Zahlen.',
        label:
          'Keine Zahl bringt mehr Glück als eine andere: Die gezogene Zahl ist mit gleicher Wahrscheinlichkeit jede Zahl im Bereich.',
        fee: 'Der Gewinner erhält 80 % des Pots. Die Hausgebühr, die das Programm auf 20 % begrenzt, geht vom Rest ab, und was übrig bleibt, geht an die nächste Runde des Spiels. Über alle Spieler betrachtet zahlen Tickets also das für sie ausgegebene Geld abzüglich dieser Gebühr zurück: Im Durchschnitt bringt ein Ticket weniger ein, als es kostet.',
        nothing: 'Nichts auf der Website ändert diese Chancen.',
      },
      final: {
        title: 'Tickets sind endgültig',
        body: 'Ein Ticket kann nach dem Kauf weder storniert noch erstattet werden. Zurück bekommst du nur seine kleine Rent-Kaution, indem du das Ticket schließt, nachdem seine Runde ausgezahlt ist.',
      },
      habits: {
        title: 'Damit es Spaß bleibt',
        budget: 'Leg vorher fest, wie viel du bereit bist zu verlieren, und hör auf, wenn es weg ist.',
        chase: 'Jag Verlusten nie hinterher und spiel nie mit geliehenem Geld oder Geld, das du brauchst.',
        mood: 'Spiel nicht, wenn du aufgewühlt oder müde bist oder getrunken hast.',
        breaks: 'Mach Pausen und lass das Spielen ein Teil deines Lebens unter vielen bleiben.',
      },
      limits: {
        title: 'Eigene Limits setzen',
        intro:
          'S☉Lucky hat keine Benutzerkonten, kann also keine Limits setzen oder dich sperren. Du kannst deine eigenen setzen:',
        wallet: 'Nutze eine separate Wallet, die nur so viel enthält, wie du auszugeben bereit bist.',
        block: 'Sperre die Website mit einem Website-Blocker oder der Kindersicherung deines Geräts.',
        trust: 'Erzähl es jemandem, dem du vertraust, und bitte diese Person, dir zu helfen, deine Limits einzuhalten.',
      },
      help: {
        title: 'Hilfe bekommen',
        intro:
          'Wenn das Spielen keinen Spaß mehr macht oder sich jemand, der dir nahesteht, deswegen Sorgen macht, bieten diese unabhängigen Organisationen kostenlose und vertrauliche Hilfe an. Wir sind nicht mit ihnen verbunden.',
        worldwide: 'Weltweit: Treffen und Kontakte nach Land.',
        us: 'Vereinigte Staaten.',
        uk: 'Vereinigtes Königreich.',
        emergency: 'Wenn du oder jemand anderes in unmittelbarer Gefahr ist, ruf deine örtliche Notrufnummer an.',
      },
    },
  },
};

export default de;
