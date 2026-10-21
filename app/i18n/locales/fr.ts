/** French: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const fr: Dict = {
  meta: {
    title: 'S☉Lucky : la loterie quotidienne sur Solana',
    description:
      'Choisis un numéro, achète un ticket et remporte toute la cagnotte à minuit UTC. Chaque ticket, chaque cagnotte et chaque tirage vivent sur Solana et peuvent être vérifiés par n’importe qui.',
    ogImageAlt: 'S☉Lucky, la loterie quotidienne sur Solana',
  },

  nav: {
    play: 'Jouer',
    how: 'Comment ça marche',
    fairness: 'Équité',
    faq: 'FAQ',
  },

  lang: {
    label: 'Langue',
    choose: 'Langue : {name}',
  },

  header: {
    beta: 'Bêta',
    getSol: 'Obtenir du SOL',
    faucetTip: 'Faucet provisoire de la bêta : obtiens du SOL de test gratuit pour jouer',
    mute: 'Couper le son',
    unmute: 'Activer le son',
  },

  faucet: {
    connectFirst: 'Connecte d’abord un portefeuille',
    connectFirstHint: 'Puis appuie sur Obtenir du SOL pour l’approvisionner en SOL de test.',
    request: 'Demande du SOL de test sur le faucet',
    requestHint: 'L’adresse de ton portefeuille est copiée. Colle-la si le champ est vide, puis confirme.',
    openAgain: 'Rouvrir',
    airdropped: 'Airdrop de ◎1 reçu',
    airdroppedHint: 'Le SOL de test est arrivé sur {cluster}. Tu peux maintenant acheter des tickets.',
    failed: 'Échec de l’airdrop',
    slow: 'L’airdrop a été accepté, mais le solde n’est pas encore à jour. Actualise dans un instant.',
  },

  footer: {
    license: 'Licence MIT',
    program: 'Programme {address} sur {cluster}.',
    age: 'Réservé aux 18 ans et plus. Joue pour le plaisir, et seulement là où les loteries sont légales.',
    legal: 'Légal',
    languages: 'Langues',
    source: 'Code source',
    builtOn: 'Construit sur {solana}',
    madeBy: 'Conçu par {nexow}',
  },

  home: {
    kicker: 'Loterie quotidienne sur Solana',
    title: 'Choisis un numéro.',
    titleEnd: 'Remporte la cagnotte à minuit.',
    lead: 'Un tirage par jour, un gagnant, toute la cagnotte. Chaque ticket, chaque lamport et chaque tirage vivent sur Solana, où n’importe qui peut les vérifier.',
    playNow: 'Jouer maintenant',
    howItWorks: 'Comment ça marche',
    program: 'Programme',
    cluster: 'Cluster',
    draw: 'Tirage',
    dialCaption:
      'Chaque point est l’un des tickets du jour : autour du cadran selon l’heure de son achat, vers l’extérieur selon son numéro.',

    how: {
      tag: 'Comment ça marche',
      title: 'Quatre étapes, un tirage par jour',
      description:
        'Les manches suivent le calendrier UTC : une nouvelle manche s’ouvre à 00:00 UTC et est tirée juste après le minuit suivant.',
      opens: 'Ouverture de la manche',
      draw: 'Tirage',
      now: 'Maintenant',
      steps: {
        wallet: {
          title: 'Connecte un portefeuille',
          description:
            'Phantom, Solflare, Backpack ou n’importe quel portefeuille compatible avec le Wallet Standard. Pas de compte, pas d’e-mail.',
          when: 'À tout moment',
        },
        number: {
          title: 'Choisis ton numéro',
          description:
            'N’importe quel numéro de 0 à {max}. Chaque numéro ne peut être détenu que par un seul ticket par jour, alors fais vite.',
          when: 'Jusqu’à minuit UTC',
        },
        pot: {
          title: 'Regarde la cagnotte grossir',
          description:
            'Chaque ticket ajoute son prix à la cagnotte, détenue par le compte propre de la manche sur Solana. Personne d’autre ne peut la déplacer.',
          when: 'Toute la journée',
        },
        win: {
          title: 'Gagne à minuit UTC',
          description:
            'Un ticket remporte toute la cagnotte, moins une petite commission de la maison. Plus de tickets, plus de chances : chaque ticket compte une fois.',
          when: 'Juste après minuit UTC',
        },
      },
    },

    fairness: {
      tag: 'Équité',
      title: 'Ne nous crois pas sur parole. Vérifie.',
      description:
        'S☉Lucky est un programme Solana, pas un serveur qui détient ton argent. Ces règles sont appliquées par son code.',
      rules: {
        locked: {
          title: 'La cagnotte est verrouillée dans le programme',
          description:
            'L’argent des tickets va directement sur le compte de la manche. Le programme ne le verse qu’au propriétaire du ticket gagnant, et la commission qu’à la trésorerie. L’opérateur ne peut pas le retirer.',
        },
        draw: {
          title: 'Un tirage que personne ne peut prédire',
          description:
            'Chaque achat est mélangé à l’entropie de la manche. À la fin de la journée, la manche fixe un slot quelques secondes dans le futur ; le hash de ce slot, inconnu de tous jusque-là, désigne le gagnant.',
        },
        anyone: {
          title: 'Tout le monde peut s’en charger',
          description:
            'Clôturer, tirer et payer sont des opérations ouvertes à tous. Si l’opérateur disparaissait demain, n’importe quel joueur pourrait encore terminer chaque manche.',
        },
        browser: {
          title: 'Vérifiable dans ton navigateur',
          description:
            'Chaque page de manche recalcule le tirage à partir des données publiques : l’entropie, le hash du slot et l’indice gagnant. Mêmes entrées, même gagnant.',
        },
        limits: {
          title: 'Des limites strictes pour la maison',
          description:
            'Le programme plafonne la commission à 10 %. Les changements de prix et de commission ne s’appliquent qu’à la manche du lendemain, et un acheteur ne paie jamais plus que le prix qui lui a été affiché.',
        },
        open: {
          title: 'Open source',
          description:
            'Le programme, l’appli et les scripts de l’opérateur sont publics, avec des tests pour chaque règle.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Questions',
      description: 'Encore un doute ? Le programme, l’appli et les scripts de l’opérateur sont open source.',
      readCode: 'Lire le code',
      items: {
        real: {
          q: 'Est-ce de l’argent réel ?',
          a: 'L’appli publique tourne sur le devnet de Solana, où le SOL est de l’argent de test gratuit, obtenu sur faucet.solana.com. Le programme fonctionne de la même façon sur le mainnet, mais exploiter une loterie en argent réel exige les licences adéquates là où tu opères.',
        },
        price: {
          q: 'Combien coûte un ticket ?',
          a: 'Le prix est fixé on-chain et affiché sur la page Jouer. En plus du prix, un compte de ticket contient un petit dépôt de loyer, que tu récupères en fermant le ticket une fois la manche payée. Le premier ticket du jour paie aussi le loyer du compte de la manche, qui reste on-chain comme son registre public.',
        },
        odds: {
          q: 'Comment mes chances sont-elles calculées ?',
          a: 'Chaque ticket a la même chance : tes tickets divisés par tous les tickets vendus ce jour-là. Le numéro que tu choisis est ton étiquette sur le tableau ; il ne change pas tes chances.',
        },
        draw: {
          q: 'Et si personne ne tire la manche ?',
          a: 'Un petit bot (le crank) clôture, tire et paie chaque manche dans les secondes qui suivent minuit, et n’importe qui peut faire de même depuis le panneau Historique. Si le slot fixé devient un jour trop ancien pour être lu (environ trois minutes), la manche peut être clôturée à nouveau pour en fixer un nouveau ; le programme ne le permet qu’une fois qu’il est prouvé que l’ancien slot est hors d’atteinte.',
        },
        country: {
          q: 'Pourquoi affichez-vous mon pays ?',
          a: 'S☉Lucky a toujours affiché un drapeau à côté de chaque ticket. Nous suggérons ton pays à partir de ta connexion à notre hébergeur, sans aucune recherche auprès d’un tiers, et tu peux le changer ou le garder privé avant d’acheter. Il est enregistré on-chain avec ton ticket.',
        },
        validator: {
          q: 'Un validateur peut-il fausser le tirage ?',
          a: 'Les joueurs, non : le hash gagnant n’existe pas encore à la clôture des ventes. Le validateur qui produit le slot fixé pourrait l’influencer, en choisissant ce qui entre dans ce bloc ou en le sautant. C’est acceptable pour un jeu en argent de test ; pour des cagnottes en argent réel, le tirage devrait utiliser un oracle d’aléa vérifiable, et le README explique où en brancher un.',
        },
      },
    },

    cta: {
      title: 'La cagnotte du jour t’attend',
      description: 'Choisis un numéro que personne n’a encore pris. Bonne chance !',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Un tirage par jour · Tiré après minuit UTC · Chaque ticket sur Solana',
    draw: 'Tirage',
    pot: 'Cagnotte du jour',
    toDraw: 'avant le tirage · {day}',
    tickets: '{n} ticket aujourd’hui | {n} tickets aujourd’hui',
    entropy: 'Entropie · {cluster}',
    entropyTitle: 'Entropie : {hex}',
    noTickets: 'aucun ticket pour l’instant',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Nouveau ticket',
    rules: {
      daily: 'Nouvelle manche chaque jour à 00:00 UTC',
      pot: 'Un ticket remporte la cagnotte',
      numbers: 'Numéros de 0 à {max}',
      fee: 'Commission de la maison plafonnée à 10 % par le programme',
      anyone: 'N’importe qui peut clôturer, tirer et payer une manche',
      check: 'Recalcule chaque tirage dans ton navigateur',
      open: 'Open source',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Reçu du tirage',
    round: 'Manche',
    noneYet: 'aucune réglée pour l’instant',
    tickets: 'Tickets',
    pot: 'Cagnotte',
    entropy: 'Entropie',
    slotHash: 'Hash du slot · slot {slot}',
    formula: 'sha256(entropie ‖ hash du slot ‖ slot ‖ manche) =',
    mod: 'les 8 premiers octets en u64 mod {count} = {ticket}',
    ticketCount: 'tickets',
    ticket: 'ticket #{index}',
    number: 'Numéro',
    paidTo: 'Payé à',
    payout: 'Gain',
    check: 'Vérifier ce tirage',
    roundPage: 'Page de la manche',
    nextDraw: 'Prochain tirage après 00:00 UTC',
    ok: 'Recalculé dans ton navigateur : même hash, le ticket #{index} gagne.',
    mismatch: 'Le hash recalculé dans ton navigateur ne correspond pas à cette manche.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Tickets',
    players: 'Joueurs',
    countries: 'Pays',
    ticket: 'Ticket',
    yourTickets: 'Tes tickets',
    winChance: 'Chance de gain',
    chance: 'Chance',
    todaysPot: 'Cagnotte du jour',
    winners: 'Gagnants',
    averagePot: 'Cagnotte moyenne',
    biggestPot: 'Plus grosse cagnotte',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: 'Temps restant : {time}',
  },

  play: {
    title: 'Jouer',
    description: 'Choisis le numéro du jour et regarde la cagnotte grossir en direct sur Solana.',
    testMoney: 'Tu joues sur Solana {cluster} : les tickets coûtent du SOL de test sans valeur réelle.',
    localFunds: 'Fais pointer ton portefeuille vers {url}, puis approvisionne-le avec : {command}',
    phantomFunds:
      'Dans Phantom : Settings → Developer Settings → active Testnet Mode → sélectionne {cluster}. Obtiens ensuite du SOL de test gratuit sur le faucet.',
    openFaucet: 'Ouvrir le faucet',
    retry: 'Réessayer',
    rpcError: 'Impossible de joindre l’endpoint RPC de Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Choisis un',
    title: 'Numéro',
    win: 'Gagne',
    in: 'dans',
    taken: 'Déjà pris aujourd’hui',
    range: 'De 0 à {max}, un ticket par numéro',
    pad: 'Pavé numérique',
    reset: 'Réinitialiser',
    delete: 'Effacer le dernier chiffre',
    dip: 'Au hasard',
    searchCountry: 'Rechercher un pays',
    country: 'Pays affiché avec ton ticket',
    notSetUp: 'La loterie n’est pas encore configurée sur ce cluster.',
    paused: 'Les ventes de tickets sont en pause.',
    buy: 'Acheter le {number} pour ◎{price}',
    takenToday: 'Le {number} est pris aujourd’hui',
    outOfRange: 'Numéro hors limites',
    notEnough: 'Pas assez de SOL',
    keys: 'Touches 0–9 pour saisir, ⌫ pour effacer, Entrée pour acheter.',
    rent: 'Un ticket immobilise aussi ◎{rent} de loyer de compte, que tu récupères après le tirage.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    kicker: 'Aujourd’hui',
    title: 'SOLPOT',
    closesIn: '{day} · clôture dans',
    inPlay: 'Numéros en jeu',
    empty: 'Aucun ticket pour l’instant',
    beFirst: 'Sois la première personne à choisir un numéro aujourd’hui.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Historique',
    total: 'Total',
    games: 'partie | parties',
    waiting: 'En attente du tirage',
    settle: 'Régler',
    settleDay: 'Régler le {day}',
    anyone:
      'N’importe qui peut clôturer, tirer et payer une manche terminée. Cela ne coûte que les frais de réseau ; le gain revient toujours au gagnant.',
    rent: '{n} ancien ticket retient ◎{sol} de loyer | {n} anciens tickets retiennent ◎{sol} de loyer',
    rentHint: 'Ferme-les pour récupérer ce SOL. La manche garde ses résultats.',
    getBack: 'Le récupérer',
    winners: 'Gagnants',
    noWinners: 'Pas encore de gagnant',
    firstDraw: 'Le premier tirage a lieu à minuit UTC.',
    chart: 'Cagnotte par jour',
    chartEmpty: 'Aucune manche terminée pour l’instant.',
    chartLabel:
      'Cagnotte de {n} manche, la plus récente ; la liste ci-dessous donne chaque valeur. | Cagnotte des {n} dernières manches ; la liste ci-dessous donne chaque valeur.',
  },

  status: {
    open: 'Ouverte',
    toClose: 'En attente de clôture',
    toDraw: 'En attente du tirage',
    unpaid: 'Tirée, non payée',
    paid: 'Payée',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'En direct',
    connecting: 'Connexion',
    offline: 'Hors ligne',
    atTable: '{n} à la table',
    picking: '{n} choisit | {n} choisissent',
    you: 'toi',
    joined: 'a rejoint',
    now: 'à l’instant',
    empty: 'La table est ouverte. Le prochain ticket s’affiche ici dès son arrivée.',
    joinedOne: 'Un nouveau joueur a rejoint la table',
    joinedMany: '{n} nouveau joueur a rejoint la table | {n} nouveaux joueurs ont rejoint la table',
    hereNow: '{n} ici en ce moment',
    locked: '{who} a joué le {number}',
    potNow:
      'La cagnotte est maintenant de ◎{pot} avec {n} ticket | La cagnotte est maintenant de ◎{pot} avec {n} tickets',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Confirme dans ton portefeuille…',
    done: '{label} : terminé',
    cancelled: '{label} : annulé',
    failed: '{label} : échec',
    view: 'Voir la transaction',
    buying: 'Achat du numéro {number}',
    bought: 'Le numéro {number} est à toi. Bonne chance !',
    repin: 'Nouvelle fixation du slot de tirage du {day}',
    closing: 'Clôture du {day}',
    drawing: 'Tirage du {day}',
    paying: 'Paiement du gagnant du {day}',
    paid: 'Gain de ◎{amount} versé au gagnant du {day}',
    settleFailed: 'Impossible de régler le {day}',
    reclaiming: 'Restitution du loyer des tickets',
    slowSlot: 'Le cluster tarde à atteindre le slot de tirage. Réessaie dans une minute.',
    noWinner: 'Le ticket gagnant est introuvable.',
  },

  wallet: {
    connect: 'Se connecter',
    title: 'Connecte un portefeuille',
    description: 'N’importe quel portefeuille Solana compatible avec le Wallet Standard fonctionne.',
    none: 'Aucun portefeuille Solana n’a été trouvé dans ce navigateur. Installes-en un, puis recharge la page :',
    failed: 'Impossible de connecter {wallet}',
    copied: 'Adresse copiée',
    balance: 'Solde',
    ticketsLeft: '{n} ticket restant | {n} tickets restants',
    needMore: 'il faut plus de SOL pour jouer',
    numbers: 'Tes numéros du jour',
    copy: 'Copier l’adresse',
    explorer: 'Explorateur',
    play: 'Jouer',
    disconnect: 'Déconnecter',
  },

  round: {
    title: 'Manche du {day}',
    back: 'Retour au jeu',
    notDate: 'Ce n’est pas une date. Les manches sont nommées YYYY-MM-DD.',
    kicker: 'Manche',
    nobody: 'Personne n’a joué ce jour-là',
    beFirst: 'Sois la première personne à acheter un ticket aujourd’hui.',
    onlyExists: 'Une manche n’existe qu’une fois son premier ticket vendu.',
    pot: 'Cagnotte',
    usd: '{usd} au cours du jour',
    winner: 'Gagnant',
    won: 'Gain ◎{payout} · commission ◎{fee}',
    unpaid: 'Pas encore payée',
    anyone: 'N’importe qui peut terminer cette manche. Cela ne coûte que les frais de réseau.',
    settle: 'Régler cette manche',
    sold: 'Tickets vendus',
    price: 'Prix du ticket',
    fee: 'Commission de la maison',
    slot: 'Slot fixé',
    check: 'Vérifier le tirage',
    formula: 'aléa = sha256(entropie ‖ hash du slot ‖ slot de tirage ‖ adresse de la manche)',
    recompute: 'Recalculer dans mon navigateur',
    entropy: 'Entropie (chaque achat, hashé dans l’ordre)',
    slotHash: 'Hash du slot {slot} (lu par le programme dans la sysvar SlotHashes)',
    randomness: 'Aléa',
    winning: 'Ticket gagnant',
    winningFormula: 'les 8 premiers octets en u64 mod {count} = achat #{index}',
    ok: 'Le tirage est conforme.',
    mismatch: 'Incohérence : le résultat enregistré ne correspond pas aux entrées.',
    got: 'Ton navigateur a obtenu {hash}… et le ticket #{index}.',
    tickets: 'Tickets',
    ticketsHint:
      'Les tickets fermés par leurs propriétaires après le paiement n’apparaissent plus ici ; la manche garde les totaux.',
    noTickets: 'Plus aucun ticket ouvert pour cette manche.',
    account: 'Compte de la manche {address} · {day}',
  },

  country: {
    private: 'Privé',
  },

  errors: {
    rejected: 'Tu as annulé la demande dans ton portefeuille.',
    taken: 'Quelqu’un détient déjà ce numéro aujourd’hui. Choisis-en un autre.',
    funds: 'Pas assez de SOL dans le portefeuille.',
    walletCluster:
      'Ton portefeuille n’a pas pu signer. Dans Phantom : Settings → Developer Settings → active Testnet Mode → sélectionne Devnet, puis reconnecte-toi et réessaie.',
    unknown: 'Une erreur s’est produite.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Seule l’autorité peut faire cela.',
      invalidTicketPrice: 'Le prix du ticket doit être d’au moins 0,001 SOL.',
      feeTooHigh: 'La commission dépasse le plafond de 10 %.',
      invalidMaxNumber: 'Le numéro le plus élevé doit être supérieur à zéro.',
      paused: 'Les ventes de tickets sont en pause.',
      wrongDay: 'Les tickets ne peuvent être achetés que pour la manche du jour.',
      numberOutOfRange: 'Le numéro est hors limites.',
      invalidCountry: 'Le pays doit être un code ISO 3166-1 alpha-2 en majuscules.',
      roundNotOpen: 'La manche n’est pas ouverte.',
      roundNotOver: 'La manche n’est pas encore terminée.',
      roundAlreadyDrawn: 'La manche a déjà été tirée.',
      drawStillPossible: 'Le tirage reste possible sur le slot fixé.',
      roundNotClosed: 'La manche n’est pas clôturée.',
      targetSlotNotReached: 'Le slot fixé n’a pas encore été atteint.',
      randomnessUnavailable:
        'Le hash du slot fixé n’est pas encore lisible ; réessaie sous peu, ou clôture à nouveau la manche une fois le slot expiré.',
      roundNotDrawn: 'La manche n’a pas été tirée.',
      notWinningTicket: 'Ce n’est pas le ticket gagnant.',
      roundNotSettled: 'La manche n’a pas été réglée.',
      overflow: 'Dépassement arithmétique.',
      priceChanged: 'Le prix du ticket est plus élevé que le prix que tu as accepté.',
      feeAlreadyCollected: 'La commission de cette manche a déjà été perçue.',
    },
  },

  legal: {
    kicker: 'Légal',
    updated: 'Dernière mise à jour : {date}',
    onThisPage: 'Sur cette page',
    others: 'Autres documents juridiques',
    translated:
      'Cette page est une traduction de l’original anglais. En cas de divergence, c’est la version anglaise qui fait foi.',
    readEnglish: 'La lire en anglais',
    repository: 'dépôt source',

    pages: {
      notice: {
        label: 'Mentions légales',
        description: 'Qui gère S☉Lucky, comment nous joindre, et les documents qui s’appliquent.',
      },
      terms: {
        label: 'Conditions d’utilisation',
        description: 'Les règles pour utiliser le site et jouer, et ce que le programme promet et ne promet pas.',
      },
      privacy: {
        label: 'Politique de confidentialité',
        description: 'Ce qui est public sur Solana, ce que voient nos serveurs, et ce que nous ne collectons jamais.',
      },
      cookies: {
        label: 'Cookies et stockage',
        description: 'Pas de cookies, pas de traceurs : les cinq réglages que l’appli garde dans ton navigateur.',
      },
      play: {
        label: 'Jeu responsable',
        description: 'Comment fonctionnent les chances, et où trouver de l’aide si jouer n’est plus un plaisir.',
      },
    },

    notice: {
      description: 'Qui gère S☉Lucky, comment nous joindre, et les documents qui s’appliquent quand tu l’utilises.',
      operator: {
        title: 'Qui gère S☉Lucky',
        body: 'S☉Lucky est conçu et géré par {operator}. Tu peux nous écrire par e-mail à {email} et en savoir plus à notre sujet sur {site}.',
      },
      software: {
        title: 'Le programme et le site',
        intro: 'S☉Lucky se compose de deux parties :',
        program:
          '{name}, un programme Solana qui vend les tickets, détient la cagnotte de chaque jour et paie le gagnant. Ce site utilise le programme à l’adresse {address} sur Solana {cluster}. N’importe qui peut l’utiliser directement, sans passer par ce site.',
        programName: 'Le programme',
        site: '{name}, qui affiche les données publiques du programme et t’aide à envoyer des transactions depuis ton propre portefeuille. Il ne détient jamais tes clés ni ton SOL.',
        siteName: 'Ce site',
      },
      documents: {
        title: 'Documents',
        intro: 'Utiliser le site implique d’accepter ces documents :',
      },
      security: {
        title: 'Signaler un problème de sécurité',
        body: 'Merci de ne pas ouvrir d’issue publique. Écris à {email} avec l’objet {subject}, et ne fais jamais de tests sur les fonds d’autres joueurs : utilise le devnet ou un validateur local. La politique de sécurité, {file} dans le {repository}, explique quoi inclure et ce qui entre dans le périmètre.',
      },
      license: {
        title: 'Licence open source',
        body: 'Le programme, l’appli et les scripts de l’opérateur sont open source sous licence MIT ({file} dans le {repository}), © {years} {operator}. La licence couvre le code ; les {terms} couvrent l’utilisation de ce site.',
      },
    },

    terms: {
      description: 'Les règles d’utilisation de S☉Lucky, et ce que son programme promet et ne promet pas.',
      agreement: {
        title: 'Ces conditions',
        p1: 'Ces conditions s’appliquent quand tu utilises le site web et l’appli S☉Lucky, gérés par {operator} (« nous »). En les utilisant, tu acceptes ces conditions, ainsi que la {privacy} et la page {cookies}. Si tu ne les acceptes pas, n’utilise pas le site.',
        p2: 'Le jeu lui-même est un programme Solana : un logiciel open source qui tourne sur le réseau Solana, et non sur nos serveurs. Le site est une façon de l’utiliser ; n’importe qui peut aussi utiliser le programme directement.',
      },
      eligibility: {
        title: 'Qui peut jouer',
        age: 'Tu dois avoir 18 ans ou plus.',
        legal:
          'Tu ne peux jouer que là où les loteries et les jeux de hasard en ligne te sont permis par la loi. Il t’appartient de le vérifier ; nous ne vérifions pas où tu te trouves.',
        own: 'Ne joue pas pour quelqu’un d’autre, ni avec du SOL qui ne t’appartient pas.',
      },
      money: {
        title: 'SOL de test et SOL réel',
        test: 'Ce site tourne sur {cluster}. Les tickets coûtent du SOL de test, gratuit sur un faucet et sans valeur : il ne peut pas être échangé contre de l’argent réel, pas plus que ce que tu gagnes avec.',
        real: 'Ce site tourne sur {cluster}. Les tickets coûtent du SOL réel, et les cagnottes sont payées en SOL réel.',
      },
      rounds: {
        title: 'Comment fonctionne une manche',
        intro: 'Le programme applique ces règles ; le site ne fait que les afficher :',
        day: 'Une manche a lieu par jour UTC, de 00:00 UTC au minuit suivant.',
        number:
          'Un ticket correspond à un numéro, de 0 au numéro le plus élevé fixé dans la configuration du programme. Chaque numéro ne peut être détenu que par un seul ticket par manche.',
        price:
          'Le prix du ticket et la commission de la maison sont copiés depuis la configuration à l’ouverture d’une manche, et restent fixes pour cette manche. La commission ne peut jamais dépasser 10 % de la cagnotte. Quand tu achètes, tu ne paies jamais plus que le prix qui t’a été affiché.',
        pot: 'Le prix de chaque ticket va dans la cagnotte de la manche, détenue par le compte propre de la manche sur Solana. Chaque ticket a la même chance : ta chance correspond à tes tickets divisés par tous les tickets vendus dans cette manche. Le numéro que tu choisis ne la change pas.',
        draw: 'Après minuit, n’importe qui peut clôturer la manche, la tirer et la payer. Le propriétaire du ticket gagnant reçoit la cagnotte moins la commission de la maison, et la commission va à la trésorerie.',
        rent: 'Un compte de ticket contient aussi un petit dépôt de loyer, que tu récupères en fermant le ticket une fois sa manche payée. Le premier ticket d’une manche paie aussi le loyer du compte de la manche, qui reste sur Solana comme registre public de la manche.',
      },
      wallet: {
        title: 'Ton portefeuille et tes transactions',
        own: 'Tu joues avec ton propre portefeuille. Nous ne détenons jamais tes clés, ton SOL ni tes tickets, et nous ne pouvons pas les déplacer.',
        sign: 'Tu signes toi-même chaque transaction, et tu paies les frais de réseau de Solana. Les transactions confirmées sont définitives : nous ne pouvons ni les annuler, ni les inverser, ni les rembourser.',
        public:
          'Le numéro d’un ticket, l’adresse de son propriétaire et le drapeau de pays que tu choisis pour lui sont publics sur Solana, pour de bon. La {privacy} explique ce que cela implique.',
        keys: 'Garde les clés de ton portefeuille en sécurité. Personne, pas même nous, ne peut les récupérer pour toi.',
      },
      operator: {
        title: 'Ce que l’opérateur peut et ne peut pas faire',
        intro: 'La configuration du programme a une autorité, qui peut :',
        price:
          'modifier le prix du ticket (au moins ◎0,001) et la commission de la maison (au plus 10 %), avec effet à partir de la prochaine manche qui s’ouvre ;',
        pause:
          'suspendre et reprendre la vente de tickets. Une pause n’arrête que les nouveaux tickets : les manches déjà jouées peuvent toujours être tirées et payées ;',
        other: 'changer la trésorerie, le numéro le plus élevé, et l’autorité elle-même.',
        cannot:
          'Le code du programme ne permet ni à l’autorité ni à personne d’autre de prendre la cagnotte d’une manche ou de l’envoyer ailleurs qu’au propriétaire du ticket gagnant, de prélever plus que la commission, ou de faire payer à un acheteur plus que le prix qui lui a été affiché.',
        upgrade:
          'Le programme peut être mis à niveau : quiconque détient son autorité de mise à niveau pourrait déployer un code différent, tu fais donc confiance à cette personne jusqu’à ce que le programme soit rendu immuable ou confié à un multisig. Le code source de chaque version est public, et un programme déployé peut être vérifié par rapport à lui, comme l’explique la section « Verifiable builds » du README.',
      },
      risks: {
        title: 'Risques',
        intro: 'En jouant, tu acceptes que :',
        bugs: 'les logiciels peuvent avoir des bugs, y compris le programme, l’appli et ton portefeuille, et un bug pourrait te coûter tes tickets ou ton SOL ;',
        network:
          'Solana ou l’endpoint RPC qu’utilise le site peuvent être lents, congestionnés ou hors service, et une transaction peut échouer ou arriver après la clôture d’une manche ;',
        draw: 'le tirage utilise le hash d’un slot Solana que personne ne connaît à la clôture des ventes. Les joueurs ne peuvent pas le prédire, mais le validateur qui produit ce slot pourrait l’influencer, et quiconque clôture une manche pourrait retenir un tirage défavorable jusqu’à ce que ce slot ne puisse plus être lu. Ce n’est pas un oracle d’aléa vérifiable ;',
        site: 'le site peut être indisponible à tout moment. Le programme, et tes tickets, continuent de fonctionner sans lui ;',
        law: 'les lois sur les loteries et les crypto-actifs diffèrent d’un pays à l’autre et peuvent changer.',
      },
      use: {
        title: 'Utiliser le site loyalement',
        body: 'N’attaque pas et ne surcharge pas le site ou ses serveurs, n’essaie pas de contourner leurs limites, ne gêne pas les autres joueurs et n’utilise pas le site pour enfreindre la loi. Nous pouvons bloquer l’accès à quiconque le fait.',
      },
      liability: {
        title: 'Aucune garantie',
        body: 'Le site et le programme sont fournis « en l’état », sans aucune garantie. Dans la mesure permise par la loi, nous ne sommes responsables d’aucune perte découlant de leur utilisation, y compris des tickets perdus, des transactions échouées ou tardives, des bugs, des problèmes de réseau ou un tirage que tu jugerais injuste. Rien dans ces conditions ne limite une responsabilité que la loi ne nous permet pas de limiter.',
      },
      openSource: {
        title: 'Open source',
        body: 'Le programme, l’appli et les scripts de l’opérateur sont open source sous licence MIT : consulte le {repository}. Cette licence couvre le code ; ces conditions couvrent l’utilisation de ce site.',
      },
      changes: {
        title: 'Modifications',
        body: 'Nous pouvons mettre à jour ces conditions. La date en haut de la page indique la dernière modification, et la version affichée ici s’applique à partir de cette date.',
      },
      contact: {
        title: 'Contact',
        body: 'Pour toute question sur ces conditions : {email}.',
      },
    },

    privacy: {
      description: 'Ce qui est public sur Solana, ce que voient nos serveurs, et ce que nous ne collectons jamais.',
      summary: {
        title: 'En bref',
        account: 'Il n’y a ni compte, ni e-mail, ni inscription. Tu joues avec un portefeuille.',
        cookies:
          'Le site ne dépose aucun cookie et ne charge aucun outil d’analyse, aucune publicité ni aucun traceur.',
        database:
          'Nous ne tenons pas de base de données des joueurs, et nous ne vendons ni ne partageons de données sur toi.',
        public:
          'Tes tickets sont publics sur Solana, par conception : c’est ce qui permet à n’importe qui de vérifier le jeu.',
        controller: '{operator} gère le site et est responsable des données qu’il traite.',
      },
      onChain: {
        title: 'Ce qui est public sur Solana',
        intro: 'Quand tu achètes un ticket, la transaction et le compte du ticket enregistrent publiquement :',
        address: 'l’adresse de ton portefeuille, et les transactions qu’il signe ;',
        number: 'le numéro que tu as choisi, la manche et l’heure de l’achat ;',
        flag: 'le drapeau de pays que tu as choisi pour le ticket, ou aucun si tu le gardes privé.',
        ledger:
          'Quand une manche est tirée, son compte enregistre aussi l’adresse du gagnant, le numéro gagnant et son drapeau, ainsi que le gain versé. Solana est un registre public : n’importe qui peut lire ces données, beaucoup de gens en conservent des copies, et elles y restent pour de bon. Fermer un ticket supprime son compte et restitue son loyer, mais les transactions qui l’ont créé et fermé restent dans le registre. Ni nous ni personne d’autre ne pouvons le modifier ou le supprimer.',
        link: 'Une adresse de portefeuille n’est pas ton nom, mais elle peut être reliée à toi, par exemple via une plateforme d’échange que tu as utilisée. Utilise un portefeuille séparé si tu veux garder ton jeu à l’écart du reste de ton activité.',
      },
      servers: {
        title: 'Ce que voient nos serveurs',
        visit: 'À chaque visite',
        visitBody:
          'Le site est hébergé chez Cloudflare. Comme tout site web, il reçoit ton adresse IP, l’agent utilisateur de ton navigateur et les pages que tu demandes, pour te les servir et protéger le site contre les abus. Cloudflare conserve des journaux d’exploitation pendant une durée limitée, selon sa {policy}. Nous ne les utilisons que pour faire fonctionner et réparer le site.',
        policy: 'propre politique de confidentialité',
        country: 'Ton pays',
        countryBody:
          'Cloudflare indique à notre serveur de quel pays provient chaque requête. L’appli le demande une fois, pour suggérer le drapeau de tes tickets ; tu peux le changer ou le garder privé avant d’acheter. Le serveur ne lit que le pays, pas ton adresse IP, et ne le conserve pas.',
        live: 'La table en direct de la page Jouer',
        liveBody:
          'Tant que la page Jouer est ouverte, ton navigateur garde une connexion avec notre serveur pour que les joueurs puissent voir qui d’autre est là. Il partage trois choses avec les autres personnes sur la page : un identifiant aléatoire propre à cette seule connexion, le drapeau qu’affichent tes tickets (aucun si tu gardes ton pays privé), et le fait que tu sois en train de saisir un numéro, jamais le numéro lui-même. Aucune adresse de portefeuille ni adresse IP n’y figure, et rien de cette connexion n’est stocké ni conservé après sa fermeture.',
        price: 'Le prix du SOL',
        priceBody:
          'Pour afficher les cagnottes en dollars, notre serveur récupère le prix du SOL auprès de Coinbase, ou de CoinGecko si Coinbase ne répond pas, et le met en cache pendant une minute. Ces requêtes partent de notre serveur et ne contiennent rien sur toi.',
      },
      thirdParties: {
        title: 'Services qu’utilise ton navigateur',
        rpc: '{name}, depuis lequel l’appli lit le jeu et par lequel elle envoie tes transactions : {endpoint}. Il reçoit ton adresse IP et les comptes que l’appli consulte, y compris celui de ton portefeuille une fois que tu l’as connecté, selon la politique de son opérateur.',
        rpcName: 'Un endpoint RPC Solana',
        rpcHost: '{host} sur ce site',
        rpcPublic: 'l’endpoint public de Solana pour {cluster}',
        wallet:
          '{name}, comme Phantom, Solflare ou Backpack, qui est un logiciel de son propre éditeur, avec sa propre politique. Le site lui demande seulement de se connecter et de signer les transactions que tu approuves.',
        walletName: 'Ton portefeuille',
        links:
          '{name} : Solana Explorer, le faucet Solana, GitHub et nos comptes sur les réseaux sociaux sont d’autres sites, avec leurs propres politiques.',
        linksName: 'Les liens que tu ouvres',
        own: 'Les polices, les sons et les images viennent de notre propre domaine : charger le site ne contacte donc personne d’autre.',
      },
      browser: {
        title: 'Ce qui reste dans ton navigateur',
        body: 'L’appli garde cinq réglages dans le stockage local de ton navigateur : ton thème, ton dernier portefeuille, ton choix de pays, le réglage du son et ta langue. La page {cookies} les liste.',
      },
      purposes: {
        title: 'Pourquoi, et ce que nous ne faisons jamais',
        body: 'Nous ne traitons les données ci-dessus que pour afficher le site, faire tourner le jeu auquel tu demandes à jouer, sécuriser le site et corriger les problèmes. Nous ne créons pas de profils, n’affichons pas de publicités, ne vendons pas de données et ne les partageons pas avec des annonceurs.',
      },
      rights: {
        title: 'Tes choix et tes droits',
        flag: 'Tu peux jouer sans drapeau de pays : choisis de garder ton pays privé avant d’acheter.',
        clear:
          'Tu peux effacer les réglages enregistrés dans ton navigateur à tout moment, et utiliser un nouveau portefeuille quand tu veux.',
        law: 'Selon l’endroit où tu vis, tu peux avoir le droit d’accéder aux données personnelles te concernant, de les corriger ou de les supprimer, ou de t’opposer à leur utilisation. Écris à {email} et nous te répondrons. Nous ne détenons presque rien sur toi, et nous ne pouvons ni modifier ni supprimer ce qui se trouve sur Solana.',
      },
      children: {
        title: 'Enfants',
        body: 'S☉Lucky s’adresse aux personnes de 18 ans et plus. Nous ne traitons pas sciemment de données concernant des personnes plus jeunes.',
      },
      changes: {
        title: 'Modifications et contact',
        body: 'Nous mettrons à jour cette page quand le site changera sa façon de traiter les données ; la date en haut de la page indique la dernière modification. Questions : {email}.',
      },
    },

    cookies: {
      description:
        'Pas de cookies, pas de traceurs : les cinq réglages que l’appli garde dans ton navigateur, et comment les supprimer.',
      none: {
        title: 'Pas de cookies',
        p1: 'S☉Lucky ne dépose aucun cookie et ne charge aucun script d’analyse, de publicité ou de suivi. La politique de sécurité du site n’autorise que les scripts de son propre domaine.',
        p2: 'Notre hébergeur, Cloudflare, peut déposer des cookies de sécurité strictement nécessaires, comme {cookie}, quand sa protection contre les bots est active. Cloudflare s’en sert pour distinguer les humains des bots, comme l’explique sa {list}.',
        list: 'liste des cookies',
      },
      storage: {
        title: 'Ce que l’appli garde dans ton navigateur',
        intro:
          'L’appli enregistre quelques réglages dans le stockage local de ton navigateur, pour qu’ils soient toujours là la prochaine fois. Ils restent sur ton appareil, à une exception près : le drapeau que tu choisis figure sur les tickets que tu achètes, et s’affiche sur la table en direct de la page Jouer pendant que tu y es.',
        key: 'Clé',
        holds: 'Contenu',
        saved: 'Enregistré',
        wallet: 'L’extension de ton portefeuille garde ses propres données, selon la politique de son éditeur.',
      },
      keys: {
        theme: {
          holds: 'Ton thème clair ou sombre.',
          when: 'Quand tu changes de thème.',
        },
        wallet: {
          holds:
            'Le nom du dernier portefeuille que tu as connecté et son adresse, pour que l’appli puisse le reconnecter.',
          when: 'Quand tu connectes un portefeuille ; supprimé quand tu le déconnectes.',
        },
        country: {
          holds: 'Le drapeau de pays que tu as choisi pour tes tickets, ou le fait que tu le gardes privé.',
          when: 'Quand tu choisis un drapeau.',
        },
        sound: {
          holds: 'Si les sons sont activés ou non.',
          when: 'Quand tu coupes ou réactives le son.',
        },
        lang: {
          holds: 'La langue que tu as choisie, pour que l’appli ne t’en propose plus une autre.',
          when: 'Quand tu choisis une langue, ou réponds à la proposition de lire le site dans la tienne.',
        },
      },
      clear: {
        title: 'Les supprimer',
        disconnect: 'Déconnecte ton portefeuille dans l’appli pour supprimer {key}.',
        site: 'Efface les données de ce site dans les réglages de ton navigateur pour les supprimer toutes.',
        private: 'Dans une fenêtre de navigation privée, elles sont supprimées quand tu la fermes.',
        reset: 'Les supprimer ne fait que réinitialiser ces réglages ; tes tickets sont sur Solana et restent à toi.',
      },
      banner: {
        title: 'Pourquoi il n’y a pas de bandeau cookies',
        body: 'Rien ici ne te suit, et chaque réglage ci-dessus n’existe que parce que tu l’as défini. Il n’y a donc rien à accepter ni à refuser.',
      },
    },

    play: {
      description: 'Comment fonctionnent les chances, et où trouver de l’aide si jouer n’est plus un plaisir.',
      basics: {
        title: 'Avant de jouer',
        age: 'S☉Lucky s’adresse aux personnes de 18 ans et plus, là où les loteries sont légales.',
        test: 'Ce site tourne sur Solana {cluster} : les tickets coûtent du SOL de test, gratuit et sans valeur. C’est un bon moyen de voir comment fonctionne le jeu sans rien dépenser.',
        real: 'Ce site tourne sur Solana Mainnet : les tickets coûtent du SOL réel.',
        fun: 'Joue pour le plaisir, jamais pour gagner de l’argent ou pour récupérer de l’argent perdu.',
      },
      odds: {
        title: 'Connais tes chances',
        same: 'Chaque ticket a la même chance. Ta chance de gagner une manche correspond à tes tickets divisés par tous les tickets vendus dans cette manche.',
        label: 'Le numéro que tu choisis est ton étiquette sur le tableau. Il ne change pas ta chance.',
        fee: 'Le gagnant reçoit la cagnotte moins la commission de la maison, que le programme plafonne à 10 %. Donc, sur l’ensemble des joueurs, les tickets rendent l’argent dépensé pour les acheter moins cette commission : en moyenne, un ticket rapporte moins qu’il ne coûte.',
        nothing: 'Rien sur le site ne change ces chances.',
      },
      final: {
        title: 'Les tickets sont définitifs',
        body: 'Un ticket ne peut être ni annulé ni remboursé une fois acheté. La seule chose que tu récupères, c’est son petit dépôt de loyer, en fermant le ticket une fois sa manche payée.',
      },
      habits: {
        title: 'Que ça reste un plaisir',
        budget: 'Décide à l’avance combien tu acceptes de perdre, et arrête quand cette somme est partie.',
        chase: 'Ne cherche jamais à te refaire, et ne joue jamais avec de l’argent emprunté ou dont tu as besoin.',
        mood: 'Ne joue pas sous le coup de la contrariété ou de la fatigue, ni après avoir bu.',
        breaks: 'Fais des pauses, et que le jeu reste une partie de ta vie parmi beaucoup d’autres.',
      },
      limits: {
        title: 'Fixer tes propres limites',
        intro:
          'S☉Lucky n’a pas de comptes : il ne peut donc ni fixer de limites ni t’exclure. Tu peux fixer les tiennes :',
        wallet: 'Garde un portefeuille séparé qui ne contient que ce que tu acceptes de dépenser.',
        block: 'Utilise un bloqueur de sites ou le contrôle parental de ton appareil pour bloquer le site.',
        trust: 'Parles-en à une personne de confiance, et demande-lui de t’aider à respecter tes limites.',
      },
      help: {
        title: 'Obtenir de l’aide',
        intro:
          'Si jouer n’est plus un plaisir, ou si un proche s’en inquiète, ces organisations indépendantes offrent une aide gratuite et confidentielle. Nous n’avons aucun lien avec elles.',
        worldwide: 'Dans le monde entier : réunions et contacts par pays.',
        us: 'États-Unis.',
        uk: 'Royaume-Uni.',
        emergency: 'Si toi ou quelqu’un d’autre êtes en danger immédiat, appelle le numéro d’urgence local.',
      },
    },
  },
};

export default fr;
