/** Spanish: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const es: Dict = {
  meta: {
    title: 'S☉Lucky: la lotería diaria en Solana',
    description:
      'Elige un número, compra un boleto y gana todo el pozo a medianoche UTC. Cada boleto, cada pozo y cada sorteo vive en Solana, y cualquiera puede comprobarlo.',
    ogImageAlt: 'S☉Lucky, la lotería diaria en Solana',
  },

  nav: {
    play: 'Jugar',
    how: 'Cómo funciona',
    fairness: 'Juego limpio',
    faq: 'Preguntas',
  },

  lang: {
    label: 'Idioma',
    choose: 'Idioma: {name}',
  },

  header: {
    beta: 'Beta',
    getSol: 'Obtener SOL',
    faucetTip: 'Faucet provisional de la beta: consigue SOL de prueba gratis para jugar',
    mute: 'Silenciar sonidos',
    unmute: 'Activar sonidos',
  },

  faucet: {
    connectFirst: 'Primero conecta una billetera',
    connectFirstHint: 'Luego toca Obtener SOL para cargarla con SOL de prueba.',
    request: 'Pide SOL de prueba en el faucet',
    requestHint: 'Se copió la dirección de tu billetera. Pégala si el campo está vacío y luego confirma.',
    openAgain: 'Abrir de nuevo',
    airdropped: 'Airdrop de ◎1 recibido',
    airdroppedHint: 'El SOL de prueba llegó a {cluster}. Ya puedes comprar boletos.',
    failed: 'Falló el airdrop',
    slow: 'El airdrop se aceptó, pero el saldo aún no se ha actualizado. Actualiza en un momento.',
  },

  footer: {
    license: 'Licencia MIT',
    program: 'Programa {address} en {cluster}.',
    age: 'Solo para mayores de 18 años. Juega por diversión, y solo donde las loterías sean legales.',
    legal: 'Legal',
    languages: 'Idiomas',
    source: 'Código fuente',
    builtOn: 'Construido en {solana}',
    madeBy: 'Hecho por {nexow}',
  },

  home: {
    kicker: 'Lotería diaria en Solana',
    title: 'Elige un número.',
    titleEnd: 'Gana el pozo a medianoche.',
    lead: 'Un sorteo al día, un ganador, todo el pozo. Cada boleto, cada lamport y cada sorteo vive en Solana, donde cualquiera puede comprobarlo.',
    playNow: 'Jugar ahora',
    howItWorks: 'Cómo funciona',
    program: 'Programa',
    cluster: 'Clúster',
    draw: 'Sorteo',
    dialCaption:
      'Cada punto es uno de los boletos de hoy: alrededor de la esfera según la hora en que se compró, hacia fuera según su número.',

    how: {
      tag: 'Cómo funciona',
      title: 'Cuatro pasos, un sorteo al día',
      description:
        'Las rondas siguen el calendario UTC: una nueva abre a las 00:00 UTC y se sortea justo después de la medianoche siguiente.',
      opens: 'Abre la ronda',
      draw: 'Sorteo',
      now: 'Ahora',
      steps: {
        wallet: {
          title: 'Conecta una billetera',
          description:
            'Phantom, Solflare, Backpack o cualquier billetera compatible con el Wallet Standard. Sin cuenta y sin correo.',
          when: 'En cualquier momento',
        },
        number: {
          title: 'Elige tu número',
          description:
            'Cualquier número del 0 al {max}. Cada número solo puede tenerlo un boleto por día, así que no tardes.',
          when: 'Hasta la medianoche UTC',
        },
        pot: {
          title: 'Mira cómo crece el pozo',
          description:
            'Cada boleto suma su precio al pozo, que guarda la propia cuenta de la ronda en Solana. Nadie más puede moverlo.',
          when: 'Todo el día',
        },
        win: {
          title: 'Gana a medianoche UTC',
          description:
            'Un boleto gana todo el pozo, menos una pequeña comisión de la casa. Más boletos, más probabilidades: cada boleto cuenta una vez.',
          when: 'Justo después de la medianoche UTC',
        },
      },
    },

    fairness: {
      tag: 'Juego limpio',
      title: 'No confíes en nosotros. Compruébalo.',
      description:
        'S☉Lucky es un programa de Solana, no un servidor que guarda tu dinero. Su código hace cumplir estas reglas.',
      rules: {
        locked: {
          title: 'El pozo está bloqueado en el programa',
          description:
            'El dinero de los boletos va directo a la cuenta de la ronda. El programa solo lo paga al dueño del boleto ganador, y la comisión, a la tesorería. El operador no puede retirarlo.',
        },
        draw: {
          title: 'Un sorteo que nadie puede predecir',
          description:
            'Cada compra se mezcla en la entropía de la ronda. Cuando termina el día, la ronda fija un slot unos segundos en el futuro; el hash de ese slot, que nadie conoce hasta entonces, elige al ganador.',
        },
        anyone: {
          title: 'Cualquiera puede ejecutarlo',
          description:
            'Cerrar, sortear y pagar están abiertos a todos. Si el operador desapareciera mañana, cualquier jugador podría igualmente terminar cada ronda.',
        },
        browser: {
          title: 'Verificable en tu navegador',
          description:
            'La página de cada ronda recalcula el sorteo a partir de datos públicos: la entropía, el hash del slot y el índice ganador. Mismas entradas, mismo ganador.',
        },
        limits: {
          title: 'Límites estrictos para la casa',
          description:
            'El programa limita la comisión al 10 %. Los cambios de precio y de comisión solo se aplican a la ronda del día siguiente, y un comprador nunca paga más que el precio que se le mostró.',
        },
        open: {
          title: 'Código abierto',
          description: 'El programa, la app y los scripts del operador son públicos, con pruebas para cada regla.',
        },
      },
    },

    faq: {
      tag: 'Dudas',
      title: 'Preguntas',
      description: '¿Aún no lo tienes claro? El programa, la app y los scripts del operador son de código abierto.',
      readCode: 'Leer el código',
      items: {
        real: {
          q: '¿Es dinero real?',
          a: 'La app pública funciona en la devnet de Solana, donde el SOL es dinero de prueba gratuito de faucet.solana.com. El programa funciona igual en mainnet, pero operar una lotería con dinero real requiere las licencias correspondientes allí donde operes.',
        },
        price: {
          q: '¿Cuánto cuesta un boleto?',
          a: 'El precio se fija on-chain y se muestra en la página Jugar. Además del precio, la cuenta de un boleto guarda un pequeño depósito de renta que recuperas al cerrar el boleto una vez pagada la ronda. El primer boleto del día también paga la renta de la cuenta de la ronda, que queda on-chain como su registro público.',
        },
        odds: {
          q: '¿Cómo se calculan mis probabilidades?',
          a: 'Todos los boletos tienen la misma probabilidad: tus boletos divididos entre todos los boletos vendidos ese día. El número que eliges es tu etiqueta en el tablero; no cambia tus probabilidades.',
        },
        draw: {
          q: '¿Y si nadie sortea la ronda?',
          a: 'Un pequeño bot (el crank) cierra, sortea y paga cada ronda a los pocos segundos de la medianoche, y cualquiera puede hacer lo mismo desde el panel Historial. Si el slot fijado llega a ser demasiado antiguo para leerlo (unos tres minutos), la ronda puede cerrarse de nuevo para fijar uno nuevo; el programa solo lo permite cuando se puede demostrar que el slot anterior está fuera de alcance.',
        },
        country: {
          q: '¿Por qué se muestra mi país?',
          a: 'S☉Lucky siempre ha mostrado una bandera junto a cada boleto. Te sugerimos tu país a partir de tu conexión con el hosting, sin consultar a ningún tercero, y puedes cambiarlo o mantenerlo privado antes de comprar. Se guarda on-chain con tu boleto.',
        },
        validator: {
          q: '¿Puede un validador hacer trampa en el sorteo?',
          a: 'Los jugadores no: el hash ganador no existe cuando se cierran las ventas. El validador que produce el slot fijado podría sesgarlo, eligiendo qué entra en ese bloque o saltándoselo. Eso es aceptable para un juego con dinero de prueba; para pozos con dinero real, el sorteo debería usar un oráculo de aleatoriedad verificable, y el README explica dónde conectar uno.',
        },
      },
    },

    cta: {
      title: 'El pozo de hoy te espera',
      description: 'Elige un número que nadie haya elegido aún. ¡Buena suerte!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Un sorteo al día · Se sortea tras la medianoche UTC · Cada boleto en Solana',
    draw: 'Sorteo',
    pot: 'Pozo de hoy',
    toDraw: 'para el sorteo · {day}',
    tickets: '{n} boleto hoy | {n} boletos hoy',
    entropy: 'Entropía · {cluster}',
    entropyTitle: 'Entropía: {hex}',
    noTickets: 'aún no hay boletos',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Nuevo boleto',
    rules: {
      daily: 'Nueva ronda cada día a las 00:00 UTC',
      pot: 'Un boleto gana el pozo',
      numbers: 'Números del 0 al {max}',
      fee: 'Comisión de la casa limitada al 10 % por el programa',
      anyone: 'Cualquiera puede cerrar, sortear y pagar una ronda',
      check: 'Recalcula cada sorteo en tu navegador',
      open: 'Código abierto',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Recibo del sorteo',
    round: 'Ronda',
    noneYet: 'ninguna liquidada aún',
    tickets: 'Boletos',
    pot: 'Pozo',
    entropy: 'Entropía',
    slotHash: 'Hash del slot · slot {slot}',
    formula: 'sha256(entropía ‖ hash del slot ‖ slot ‖ ronda) =',
    mod: 'primeros 8 bytes como u64 mod {count} = {ticket}',
    ticketCount: 'boletos',
    ticket: 'boleto #{index}',
    number: 'Número',
    paidTo: 'Pagado a',
    payout: 'Pago',
    check: 'Verificar este sorteo',
    roundPage: 'Página de la ronda',
    nextDraw: 'Próximo sorteo después de las 00:00 UTC',
    ok: 'Recalculado en tu navegador: mismo hash, gana el boleto #{index}.',
    mismatch: 'El hash recalculado en tu navegador no coincide con esta ronda.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Boletos',
    players: 'Jugadores',
    countries: 'Países',
    ticket: 'Boleto',
    yourTickets: 'Tus boletos',
    winChance: 'Probabilidad',
    chance: 'Prob.',
    todaysPot: 'Pozo de hoy',
    winners: 'Ganadores',
    averagePot: 'Pozo medio',
    biggestPot: 'Mayor pozo',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: 'quedan {time}',
  },

  play: {
    title: 'Jugar',
    description: 'Elige el número de hoy y mira cómo crece el pozo en tiempo real en Solana.',
    testMoney: 'Estás jugando en Solana {cluster}: los boletos cuestan SOL de prueba sin valor real.',
    localFunds: 'Apunta tu billetera a {url} y luego cárgala con: {command}',
    phantomFunds:
      'En Phantom: Settings → Developer Settings → activa Testnet Mode → selecciona {cluster}. Luego consigue SOL de prueba gratis en el faucet.',
    openFaucet: 'Abrir faucet',
    retry: 'Reintentar',
    rpcError: 'No se pudo conectar con el endpoint RPC de Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Elige un',
    title: 'Número',
    win: 'Gana',
    in: 'en',
    taken: 'Ya ocupado hoy',
    range: 'Del 0 al {max}, un boleto por número',
    pad: 'Teclado numérico',
    reset: 'Reiniciar',
    delete: 'Borrar el último dígito',
    dip: 'Al azar',
    searchCountry: 'Buscar un país',
    country: 'País que se muestra con tu boleto',
    notSetUp: 'La lotería aún no está configurada en este clúster.',
    paused: 'La venta de boletos está en pausa.',
    buy: 'Comprar el {number} por ◎{price}',
    takenToday: 'El {number} ya está ocupado hoy',
    outOfRange: 'Número fuera de rango',
    notEnough: 'SOL insuficiente',
    keys: 'Teclas 0–9 para escribir, ⌫ para borrar, Enter para comprar.',
    rent: 'Un boleto también guarda ◎{rent} de renta de la cuenta, que recuperas después del sorteo.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    kicker: 'Hoy',
    title: 'SOLPOT',
    closesIn: '{day} · cierra en',
    inPlay: 'Números en juego',
    empty: 'Aún no hay boletos',
    beFirst: 'Elige el primer número de hoy.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Historial',
    total: 'Total',
    games: 'partida | partidas',
    waiting: 'Esperando el sorteo',
    settle: 'Liquidar',
    settleDay: 'Liquidar {day}',
    anyone:
      'Cualquiera puede cerrar, sortear y pagar una ronda terminada. Solo cuesta comisiones de red; el premio siempre va al ganador.',
    rent: '{n} boleto antiguo guarda ◎{sol} de renta | {n} boletos antiguos guardan ◎{sol} de renta',
    rentHint: 'Ciérralos para recuperar ese SOL. La ronda conserva sus resultados.',
    getBack: 'Recuperarlo',
    winners: 'Ganadores',
    noWinners: 'Aún no hay ganadores',
    firstDraw: 'El primer sorteo es a medianoche UTC.',
    chart: 'Pozo por día',
    chartEmpty: 'Aún no hay rondas terminadas.',
    chartLabel:
      'Pozo de la última ronda; la lista de abajo tiene todos los valores. | Pozo de las últimas {n} rondas; la lista de abajo tiene todos los valores.',
  },

  status: {
    open: 'Abierta',
    toClose: 'Por cerrar',
    toDraw: 'Por sortear',
    unpaid: 'Sorteada, sin pagar',
    paid: 'Pagada',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'En vivo',
    connecting: 'Conectando',
    offline: 'Sin conexión',
    atTable: '{n} en la mesa',
    picking: '{n} eligiendo | {n} eligiendo',
    you: 'tú',
    joined: 'se unió',
    now: 'ahora',
    empty: 'La mesa está abierta. El próximo boleto aparece aquí en cuanto llega.',
    joinedOne: 'Un jugador nuevo se unió a la mesa',
    joinedMany: '{n} jugador nuevo se unió a la mesa | {n} jugadores nuevos se unieron a la mesa',
    hereNow: '{n} aquí ahora',
    locked: '{who} se quedó con el {number}',
    potNow: 'El pozo ya es de ◎{pot} con {n} boleto | El pozo ya es de ◎{pot} con {n} boletos',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Confirma en tu billetera…',
    done: '{label}: hecho',
    cancelled: '{label}: cancelado',
    failed: '{label}: falló',
    view: 'Ver transacción',
    buying: 'Comprando el número {number}',
    bought: 'El número {number} es tuyo. ¡Buena suerte!',
    repin: 'Volviendo a fijar el slot del sorteo de {day}',
    closing: 'Cerrando {day}',
    drawing: 'Sorteando {day}',
    paying: 'Pagando al ganador del {day}',
    paid: 'Pagados ◎{amount} al ganador del {day}',
    settleFailed: 'No se pudo liquidar {day}',
    reclaiming: 'Devolviendo la renta de los boletos',
    slowSlot: 'El clúster tarda en llegar al slot del sorteo. Inténtalo de nuevo en un minuto.',
    noWinner: 'No se encontró el boleto ganador.',
  },

  wallet: {
    connect: 'Conectar billetera',
    title: 'Conecta una billetera',
    description: 'Funciona cualquier billetera de Solana compatible con el Wallet Standard.',
    none: 'No se encontró ninguna billetera de Solana en este navegador. Instala una y luego recarga la página:',
    failed: 'No se pudo conectar con {wallet}',
    copied: 'Dirección copiada',
    balance: 'Saldo',
    ticketsLeft: '{n} boleto restante | {n} boletos restantes',
    needMore: 'necesitas más SOL para jugar',
    numbers: 'Tus números de hoy',
    copy: 'Copiar dirección',
    explorer: 'Explorador',
    play: 'Jugar',
    disconnect: 'Desconectar',
  },

  round: {
    title: 'Ronda {day}',
    back: 'Volver al juego',
    notDate: 'Esto no es una fecha. Las rondas se nombran YYYY-MM-DD.',
    kicker: 'Ronda',
    nobody: 'Nadie jugó este día',
    beFirst: 'Compra el primer boleto de hoy.',
    onlyExists: 'Una ronda solo existe una vez vendido su primer boleto.',
    pot: 'Pozo',
    usd: '{usd} al precio de hoy',
    winner: 'Ganador',
    won: 'Ganó ◎{payout} · comisión ◎{fee}',
    unpaid: 'Aún sin pagar',
    anyone: 'Cualquiera puede terminar esta ronda. Solo cuesta comisiones de red.',
    settle: 'Liquidar esta ronda',
    sold: 'Boletos vendidos',
    price: 'Precio del boleto',
    fee: 'Comisión de la casa',
    slot: 'Slot fijado',
    check: 'Verificar el sorteo',
    formula: 'aleatoriedad = sha256(entropía ‖ hash del slot ‖ slot del sorteo ‖ dirección de la ronda)',
    recompute: 'Recalcular en mi navegador',
    entropy: 'Entropía (cada compra, hasheada en orden)',
    slotHash: 'Hash del slot {slot} (leído por el programa de la sysvar SlotHashes)',
    randomness: 'Aleatoriedad',
    winning: 'Boleto ganador',
    winningFormula: 'primeros 8 bytes como u64 mod {count} = compra #{index}',
    ok: 'El sorteo es correcto.',
    mismatch: 'No coincide: el resultado guardado no corresponde a las entradas.',
    got: 'Tu navegador obtuvo {hash}… y el boleto #{index}.',
    tickets: 'Boletos',
    ticketsHint:
      'Los boletos que sus dueños cerraron después del pago ya no aparecen aquí; la ronda conserva los totales.',
    noTickets: 'No quedan boletos abiertos en esta ronda.',
    account: 'Cuenta de la ronda {address} · {day}',
  },

  country: {
    private: 'Privado',
  },

  errors: {
    rejected: 'Cancelaste la solicitud en tu billetera.',
    taken: 'Alguien ya tiene este número hoy. Elige otro.',
    funds: 'No hay suficiente SOL en la billetera.',
    walletCluster:
      'Tu billetera no pudo firmar. En Phantom: Settings → Developer Settings → activa Testnet Mode → selecciona Devnet, luego vuelve a conectarla e inténtalo de nuevo.',
    unknown: 'Algo salió mal.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Solo la autoridad puede hacer esto.',
      invalidTicketPrice: 'El precio del boleto debe ser de al menos 0,001 SOL.',
      feeTooHigh: 'La comisión supera el límite del 10 %.',
      invalidMaxNumber: 'El número más alto debe ser mayor que cero.',
      paused: 'La venta de boletos está en pausa.',
      wrongDay: 'Solo se pueden comprar boletos para la ronda de hoy.',
      numberOutOfRange: 'El número está fuera de rango.',
      invalidCountry: 'El país debe ser un código ISO 3166-1 alpha-2 en mayúsculas.',
      roundNotOpen: 'La ronda no está abierta.',
      roundNotOver: 'La ronda aún no ha terminado.',
      roundAlreadyDrawn: 'La ronda ya se sorteó.',
      drawStillPossible: 'El slot fijado todavía se puede sortear.',
      roundNotClosed: 'La ronda no está cerrada.',
      targetSlotNotReached: 'Aún no se ha alcanzado el slot fijado.',
      randomnessUnavailable:
        'El hash del slot fijado aún no se puede leer; inténtalo de nuevo en breve, o vuelve a cerrar la ronda cuando haya expirado.',
      roundNotDrawn: 'La ronda no se ha sorteado.',
      notWinningTicket: 'Este no es el boleto ganador.',
      roundNotSettled: 'La ronda no se ha liquidado.',
      overflow: 'Desbordamiento aritmético.',
      priceChanged: 'El precio del boleto es mayor que el precio que aceptaste.',
      feeAlreadyCollected: 'La comisión de esta ronda ya se cobró.',
    },
  },

  legal: {
    kicker: 'Legal',
    updated: 'Última actualización: {date}',
    onThisPage: 'En esta página',
    others: 'Otros documentos legales',
    translated: 'Esta página es una traducción del original en inglés. Si difieren, se aplica la versión en inglés.',
    readEnglish: 'Leer en inglés',
    repository: 'repositorio del código fuente',

    pages: {
      notice: {
        label: 'Aviso legal',
        description: 'Quién gestiona S☉Lucky, cómo contactarnos y los documentos que se aplican.',
      },
      terms: {
        label: 'Términos del servicio',
        description: 'Las reglas para usar el sitio y jugar, y lo que el programa promete y lo que no.',
      },
      privacy: {
        label: 'Política de privacidad',
        description: 'Qué es público en Solana, qué ven nuestros servidores y qué nunca recopilamos.',
      },
      cookies: {
        label: 'Cookies y almacenamiento',
        description: 'Sin cookies ni rastreadores: los cinco ajustes que la app guarda en tu navegador.',
      },
      play: {
        label: 'Juego responsable',
        description: 'Cómo funcionan las probabilidades y dónde pedir ayuda si jugar deja de ser divertido.',
      },
    },

    notice: {
      description: 'Quién gestiona S☉Lucky, cómo contactarnos y los documentos que se aplican cuando lo usas.',
      operator: {
        title: 'Quién gestiona S☉Lucky',
        body: 'S☉Lucky lo crea y lo gestiona {operator}. Puedes escribirnos por correo a {email} y saber más sobre nosotros en {site}.',
      },
      software: {
        title: 'El programa y el sitio',
        intro: 'S☉Lucky tiene dos partes:',
        program:
          '{name}, un programa de Solana que vende los boletos, guarda el pozo de cada día y paga al ganador. Este sitio usa el programa en {address} en Solana {cluster}. Cualquiera puede usarlo directamente, sin este sitio.',
        programName: 'El programa',
        site: '{name}, que muestra los datos públicos del programa y te ayuda a enviar transacciones desde tu propia billetera. Nunca guarda tus claves ni tu SOL.',
        siteName: 'Este sitio',
      },
      documents: {
        title: 'Documentos',
        intro: 'Usar el sitio implica aceptar estos documentos:',
      },
      security: {
        title: 'Cómo informar de un problema de seguridad',
        body: 'Por favor, no abras un issue público. Escribe a {email} con el asunto {subject}, y nunca hagas pruebas con los fondos de otros jugadores: usa devnet o un validador local. La política de seguridad, {file} en el {repository}, explica qué incluir y qué entra en el alcance.',
      },
      license: {
        title: 'Licencia de código abierto',
        body: 'El programa, la app y los scripts del operador son de código abierto bajo la Licencia MIT ({file} en el {repository}), © {years} {operator}. La licencia cubre el código; los {terms} cubren el uso de este sitio.',
      },
    },

    terms: {
      description: 'Las reglas para usar S☉Lucky, y lo que su programa promete y lo que no.',
      agreement: {
        title: 'Estos términos',
        p1: 'Estos términos se aplican cuando usas el sitio web y la app de S☉Lucky, gestionados por {operator} («nosotros»). Al usarlos, los aceptas, junto con la {privacy} y la página {cookies}. Si no los aceptas, no uses el sitio.',
        p2: 'El juego en sí es un programa de Solana: software de código abierto que se ejecuta en la red de Solana, no en nuestros servidores. El sitio es una forma de usarlo; cualquiera puede usar también el programa directamente.',
      },
      eligibility: {
        title: 'Quién puede jugar',
        age: 'Debes tener 18 años o más.',
        legal:
          'Solo puedes jugar donde las loterías y los juegos de azar en línea sean legales para ti. Comprobarlo es tu responsabilidad; nosotros no comprobamos dónde estás.',
        own: 'No juegues en nombre de otra persona, ni con SOL que no sea tuyo.',
      },
      money: {
        title: 'SOL de prueba y SOL real',
        test: 'Este sitio funciona en {cluster}. Los boletos cuestan SOL de prueba, que se obtiene gratis en un faucet y no tiene valor: no se puede cambiar por dinero real, y nada de lo que ganes con él tampoco.',
        real: 'Este sitio funciona en {cluster}. Los boletos cuestan SOL real, y los pozos se pagan en SOL real.',
      },
      rounds: {
        title: 'Cómo funciona una ronda',
        intro: 'El programa hace cumplir estas reglas; el sitio solo las muestra:',
        day: 'Hay una ronda por día UTC, de las 00:00 UTC a la medianoche siguiente.',
        number:
          'Un boleto es un número, del 0 al número más alto fijado en la configuración del programa. Cada número solo puede tenerlo un boleto por ronda.',
        price:
          'El precio del boleto y la comisión de la casa se copian de la configuración cuando abre una ronda, y se mantienen fijos durante esa ronda. La comisión nunca puede superar el 10 % del pozo. Al comprar, nunca pagas más que el precio que se te mostró.',
        pot: 'El precio de cada boleto va al pozo de la ronda, que guarda la propia cuenta de la ronda en Solana. Todos los boletos tienen la misma probabilidad: tu probabilidad es tus boletos divididos entre todos los boletos vendidos en esa ronda. El número que eliges no la cambia.',
        draw: 'Después de la medianoche, cualquiera puede cerrar la ronda, sortearla y pagarla. El dueño del boleto ganador recibe el pozo menos la comisión de la casa, y la comisión va a la tesorería.',
        rent: 'La cuenta de un boleto también guarda un pequeño depósito de renta, que recuperas al cerrar el boleto una vez pagada su ronda. El primer boleto de una ronda también paga la renta de la cuenta de la ronda, que queda en Solana como registro público de la ronda.',
      },
      wallet: {
        title: 'Tu billetera y tus transacciones',
        own: 'Juegas con tu propia billetera. Nunca guardamos tus claves, tu SOL ni tus boletos, y no podemos moverlos.',
        sign: 'Tú firmas cada transacción y pagas las comisiones de red de Solana. Las transacciones confirmadas son definitivas: no podemos cancelarlas, revertirlas ni reembolsarlas.',
        public:
          'El número de un boleto, la dirección de su dueño y la bandera de país que elijas para él son públicos en Solana para siempre. La {privacy} explica lo que eso significa.',
        keys: 'Guarda bien las claves de tu billetera. Nadie, ni siquiera nosotros, puede recuperarlas por ti.',
      },
      operator: {
        title: 'Lo que el operador puede y no puede hacer',
        intro: 'La configuración del programa tiene una autoridad, que puede:',
        price:
          'cambiar el precio del boleto (como mínimo ◎0,001) y la comisión de la casa (como máximo el 10 %), con efecto desde la próxima ronda que se abra;',
        pause:
          'pausar y reanudar la venta de boletos. Una pausa solo detiene los boletos nuevos: las rondas ya jugadas se pueden seguir sorteando y pagando;',
        other: 'cambiar la tesorería, el número más alto y la propia autoridad.',
        cannot:
          'El código del programa no permite a la autoridad, ni a nadie más, tomar el pozo de una ronda ni enviarlo a otro destino que no sea el dueño del boleto ganador, quedarse con más que la comisión ni cobrar a un comprador más que el precio que se le mostró.',
        upgrade:
          'El programa es actualizable: quien tenga su autoridad de actualización podría desplegar otro código, así que confías en quien la tenga hasta que el programa se haga inmutable o se entregue a una multisig. El código fuente de cada versión es público, y un programa desplegado se puede verificar con él, como explica la sección «Verifiable builds» del README.',
      },
      risks: {
        title: 'Riesgos',
        intro: 'Al jugar, aceptas que:',
        bugs: 'el software puede tener errores, incluidos el programa, la app y tu billetera, y un error podría costarte tus boletos o tu SOL;',
        network:
          'Solana o el endpoint RPC que usa el sitio pueden ser lentos, estar congestionados o caídos, y una transacción puede fallar o llegar después de que se cierre una ronda;',
        draw: 'el sorteo usa el hash de un slot de Solana que nadie conoce cuando se cierran las ventas. Los jugadores no pueden predecirlo, pero el validador que produce ese slot podría sesgarlo, y quien cierra una ronda podría retener un sorteo desfavorable hasta que ese slot ya no se pueda leer. No es un oráculo de aleatoriedad verificable;',
        site: 'el sitio puede dejar de estar disponible en cualquier momento. El programa, y tus boletos, siguen funcionando sin él;',
        law: 'las leyes sobre loterías y criptoactivos varían entre países y pueden cambiar.',
      },
      use: {
        title: 'Usar el sitio de forma justa',
        body: 'No ataques ni sobrecargues el sitio o sus servidores, no intentes eludir sus límites, no interfieras con otros jugadores ni uses el sitio para infringir la ley. Podemos bloquear el acceso a quien lo haga.',
      },
      liability: {
        title: 'Sin garantía',
        body: 'El sitio y el programa se ofrecen «tal cual», sin ninguna garantía. En la medida en que la ley lo permita, no somos responsables de ninguna pérdida derivada de su uso, incluidos boletos perdidos, transacciones fallidas o tardías, errores, problemas de red o un sorteo que consideres injusto. Nada en estos términos limita una responsabilidad que la ley no nos permita limitar.',
      },
      openSource: {
        title: 'Código abierto',
        body: 'El programa, la app y los scripts del operador son de código abierto bajo la Licencia MIT: consulta el {repository}. Esa licencia cubre el código; estos términos cubren el uso de este sitio.',
      },
      changes: {
        title: 'Cambios',
        body: 'Podemos actualizar estos términos. La fecha de arriba indica el último cambio, y la versión que se muestra aquí se aplica desde esa fecha.',
      },
      contact: {
        title: 'Contacto',
        body: 'Preguntas sobre estos términos: {email}.',
      },
    },

    privacy: {
      description: 'Qué es público en Solana, qué ven nuestros servidores y qué nunca recopilamos.',
      summary: {
        title: 'En resumen',
        account: 'No hay cuenta, correo ni registro. Juegas con una billetera.',
        cookies: 'El sitio no instala cookies ni carga analítica, anuncios ni rastreadores.',
        database: 'No guardamos una base de datos de jugadores, y no vendemos ni compartimos datos sobre ti.',
        public:
          'Tus boletos son públicos en Solana, por diseño: eso es lo que permite a cualquiera comprobar el juego.',
        controller: '{operator} gestiona el sitio y es responsable de los datos que trata.',
      },
      onChain: {
        title: 'Qué es público en Solana',
        intro: 'Cuando compras un boleto, la transacción y la cuenta del boleto registran, de forma pública:',
        address: 'la dirección de tu billetera y las transacciones que firma;',
        number: 'el número que elegiste, la ronda y la hora de compra;',
        flag: 'la bandera de país que elegiste para el boleto, o ninguna si lo mantienes privado.',
        ledger:
          'Cuando se sortea una ronda, su cuenta también registra la dirección del ganador, el número ganador y su bandera, y el premio pagado. Solana es un registro público: cualquiera puede leer estos datos, mucha gente guarda copias de ellos y permanecen ahí para siempre. Cerrar un boleto elimina su cuenta y devuelve su renta, pero las transacciones que lo crearon y lo cerraron siguen en el registro. Ni nosotros ni nadie puede cambiarlo ni borrarlo.',
        link: 'Una dirección de billetera no es tu nombre, pero se puede vincular contigo, por ejemplo a través de un exchange que hayas usado. Usa una billetera aparte si quieres mantener tu juego separado del resto de tu actividad.',
      },
      servers: {
        title: 'Qué ven nuestros servidores',
        visit: 'Cada visita',
        visitBody:
          'El sitio está alojado en Cloudflare. Como cualquier sitio web, recibe tu dirección IP, el user agent de tu navegador y las páginas que solicitas, para servirlas y proteger el sitio contra abusos. Cloudflare conserva registros operativos durante un tiempo limitado según su {policy}. Solo los usamos para hacer funcionar el sitio y corregirlo.',
        policy: 'propia política de privacidad',
        country: 'Tu país',
        countryBody:
          'Cloudflare le indica a nuestro servidor de qué país llega cada solicitud. La app lo pide una vez, para sugerir la bandera de tus boletos; puedes cambiarla o mantenerla privada antes de comprar. El servidor solo lee el país, no tu dirección IP, y no lo guarda.',
        live: 'La mesa en vivo de la página Jugar',
        liveBody:
          'Mientras la página Jugar está abierta, tu navegador mantiene una conexión con nuestro servidor para que los jugadores vean quién más está ahí. Comparte tres cosas con las demás personas de la página: un identificador aleatorio solo para esa conexión, la bandera que muestran tus boletos (ninguna si mantienes tu país privado) y si estás introduciendo un número, nunca el número en sí. No incluye ninguna dirección de billetera ni dirección IP, y nada sobre la conexión se almacena ni se conserva después de que se cierra.',
        price: 'El precio del SOL',
        priceBody:
          'Para mostrar los pozos en dólares, nuestro servidor obtiene el precio del SOL de Coinbase, o de CoinGecko si Coinbase no responde, y lo guarda en caché durante un minuto. Estas solicitudes salen de nuestro servidor y no llevan nada sobre ti.',
      },
      thirdParties: {
        title: 'Servicios que usa tu navegador',
        rpc: '{name}, del que la app lee el juego y a través del cual envía tus transacciones: {endpoint}. Recibe tu dirección IP y las cuentas que consulta la app, incluida la de tu billetera una vez que la conectas, según la política de su operador.',
        rpcName: 'Un endpoint RPC de Solana',
        rpcHost: '{host} en este sitio',
        rpcPublic: 'El endpoint público de Solana para {cluster}',
        wallet:
          '{name}, como Phantom, Solflare o Backpack, que es software de su propio fabricante, con su propia política. El sitio solo le pide conectarse y firmar las transacciones que apruebas.',
        walletName: 'Tu billetera',
        links:
          '{name}: Solana Explorer, el faucet de Solana, GitHub y nuestras redes sociales son otros sitios, con sus propias políticas.',
        linksName: 'Los enlaces que abres',
        own: 'Las fuentes, los sonidos y las imágenes vienen de nuestro propio dominio, así que cargar el sitio no contacta con nadie más.',
      },
      browser: {
        title: 'Qué se queda en tu navegador',
        body: 'La app guarda cinco ajustes en el almacenamiento local de tu navegador: tu tema, tu última billetera, tu elección de país, el ajuste de sonido y tu idioma. La página {cookies} los enumera.',
      },
      purposes: {
        title: 'Para qué, y lo que nunca hacemos',
        body: 'Tratamos los datos anteriores solo para mostrar el sitio, ejecutar el juego al que pides jugar, mantener el sitio seguro y corregir problemas. No creamos perfiles, no mostramos anuncios, no vendemos datos ni los compartimos con anunciantes.',
      },
      rights: {
        title: 'Tus opciones y tus derechos',
        flag: 'Puedes jugar sin bandera de país: elige mantenerla privada antes de comprar.',
        clear:
          'Puedes borrar los ajustes de tu navegador en cualquier momento, y usar una billetera nueva cuando quieras.',
        law: 'Según dónde vivas, puedes tener derecho a acceder a tus datos personales, corregirlos o eliminarlos, o a oponerte a cómo se usan. Escribe a {email} y te responderemos. Casi no guardamos nada sobre ti, y no podemos cambiar ni borrar lo que está en Solana.',
      },
      children: {
        title: 'Menores',
        body: 'S☉Lucky es para personas de 18 años o más. No tratamos a sabiendas datos de nadie menor de esa edad.',
      },
      changes: {
        title: 'Cambios y contacto',
        body: 'Actualizaremos esta página cuando el sitio cambie la forma en que trata los datos; la fecha de arriba indica el último cambio. Preguntas: {email}.',
      },
    },

    cookies: {
      description:
        'Sin cookies ni rastreadores: los cinco ajustes que la app guarda en tu navegador, y cómo eliminarlos.',
      none: {
        title: 'Sin cookies',
        p1: 'S☉Lucky no instala cookies ni carga scripts de analítica, publicidad o seguimiento. La política de seguridad del sitio solo permite scripts de su propio dominio.',
        p2: 'Nuestro proveedor de alojamiento, Cloudflare, puede instalar cookies de seguridad estrictamente necesarias, como {cookie}, cuando su protección contra bots está activada. Cloudflare las usa para distinguir a las personas de los bots, como explica su {list}.',
        list: 'lista de cookies',
      },
      storage: {
        title: 'Lo que la app guarda en tu navegador',
        intro:
          'La app guarda algunos ajustes en el almacenamiento local de tu navegador, para que sigan ahí la próxima vez. Se quedan en tu dispositivo, con una excepción: la bandera que eliges va en los boletos que compras, y se muestra en la mesa en vivo de la página Jugar mientras estás ahí.',
        key: 'Clave',
        holds: 'Qué guarda',
        saved: 'Se guarda',
        wallet: 'La extensión de tu billetera guarda sus propios datos, según la política de su fabricante.',
      },
      keys: {
        theme: {
          holds: 'Tu tema claro u oscuro.',
          when: 'Cuando cambias el tema.',
        },
        wallet: {
          holds:
            'El nombre de la última billetera que conectaste y su dirección, para que la app pueda volver a conectarla.',
          when: 'Cuando conectas una billetera; se elimina cuando la desconectas.',
        },
        country: {
          holds: 'La bandera de país que elegiste para tus boletos, o que prefieres mantenerla privada.',
          when: 'Cuando eliges una bandera.',
        },
        sound: {
          holds: 'Si los sonidos están activados o desactivados.',
          when: 'Cuando silencias o activas el sonido.',
        },
        lang: {
          holds: 'El idioma que elegiste, para que la app no vuelva a ofrecerte otro.',
          when: 'Cuando eliges un idioma, o respondes a la propuesta de leer el sitio en el tuyo.',
        },
      },
      clear: {
        title: 'Cómo eliminarlo',
        disconnect: 'Desconecta tu billetera en la app para eliminar {key}.',
        site: 'Borra los datos de este sitio en los ajustes de tu navegador para eliminarlos todos.',
        private: 'En una ventana privada, se borran al cerrarla.',
        reset: 'Eliminarlos solo restablece estos ajustes; tus boletos están en Solana y siguen siendo tuyos.',
      },
      banner: {
        title: 'Por qué no hay banner de cookies',
        body: 'Nada aquí te rastrea, y cada ajuste de arriba existe porque tú lo configuraste. Así que no hay nada que aceptar ni rechazar.',
      },
    },

    play: {
      description: 'Cómo funcionan las probabilidades y dónde pedir ayuda si jugar deja de ser divertido.',
      basics: {
        title: 'Antes de jugar',
        age: 'S☉Lucky es para personas de 18 años o más, allí donde las loterías son legales.',
        test: 'Este sitio funciona en Solana {cluster}: los boletos cuestan SOL de prueba, que es gratis y no tiene valor. Es una buena forma de ver cómo funciona el juego sin gastar nada.',
        real: 'Este sitio funciona en Solana Mainnet: los boletos cuestan SOL real.',
        fun: 'Juega por diversión, nunca para ganar dinero ni para recuperar dinero que hayas perdido.',
      },
      odds: {
        title: 'Conoce las probabilidades',
        same: 'Todos los boletos tienen la misma probabilidad. Tu probabilidad de ganar una ronda es tus boletos divididos entre todos los boletos vendidos en ella.',
        label: 'El número que eliges es tu etiqueta en el tablero. No cambia tu probabilidad.',
        fee: 'El ganador recibe el pozo menos la comisión de la casa, que el programa limita al 10 %. Así que, tomando a todos los jugadores en conjunto, los boletos devuelven el dinero gastado en ellos menos esa comisión: en promedio, un boleto devuelve menos de lo que cuesta.',
        nothing: 'Nada en el sitio cambia estas probabilidades.',
      },
      final: {
        title: 'Los boletos son definitivos',
        body: 'Un boleto no se puede cancelar ni reembolsar una vez comprado. Lo único que recuperas es su pequeño depósito de renta, al cerrar el boleto después de que se pague su ronda.',
      },
      habits: {
        title: 'Que siga siendo divertido',
        budget: 'Decide de antemano cuánto aceptas perder, y para cuando se acabe.',
        chase: 'Nunca intentes recuperar lo perdido, y nunca juegues con dinero prestado ni con dinero que necesites.',
        mood: 'No juegues cuando estés alterado, cansado o hayas bebido.',
        breaks: 'Tómate descansos, y haz que jugar sea solo una parte de tu vida entre muchas.',
      },
      limits: {
        title: 'Pon tus propios límites',
        intro: 'S☉Lucky no tiene cuentas, así que no puede fijar límites ni excluirte. Puedes fijar los tuyos:',
        wallet: 'Ten una billetera aparte con solo lo que aceptas gastar.',
        block: 'Usa un bloqueador de sitios web o el control parental de tu dispositivo para bloquear el sitio.',
        trust: 'Cuéntaselo a alguien de confianza, y pídele que te ayude a respetar tus límites.',
      },
      help: {
        title: 'Cómo pedir ayuda',
        intro:
          'Si jugar ha dejado de ser divertido, o a alguien cercano le preocupa, estas organizaciones independientes ofrecen ayuda gratuita y confidencial. No tenemos relación con ellas.',
        worldwide: 'En todo el mundo: reuniones y contactos por país.',
        us: 'Estados Unidos.',
        uk: 'Reino Unido.',
        emergency: 'Si tú u otra persona están en peligro inmediato, llama al número de emergencias local.',
      },
    },
  },
};

export default es;
