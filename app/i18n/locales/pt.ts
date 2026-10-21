/** Portuguese (Brazil): translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const pt: Dict = {
  meta: {
    title: 'S☉Lucky: a loteria diária na Solana',
    description:
      'Escolha um número, compre um bilhete e ganhe o pote inteiro à meia-noite UTC. Cada bilhete, cada pote e cada sorteio fica na Solana e pode ser conferido por qualquer pessoa.',
    ogImageAlt: 'S☉Lucky, a loteria diária na Solana',
  },

  nav: {
    play: 'Jogar',
    how: 'Como funciona',
    fairness: 'Jogo limpo',
    faq: 'Dúvidas',
  },

  lang: {
    label: 'Idioma',
    choose: 'Idioma: {name}',
  },

  header: {
    beta: 'Beta',
    getSol: 'Obter SOL',
    faucetTip: 'Faucet provisório da beta: pegue SOL de teste grátis para jogar',
    mute: 'Desativar sons',
    unmute: 'Ativar sons',
  },

  faucet: {
    connectFirst: 'Conecte uma carteira primeiro',
    connectFirstHint: 'Depois toque em Obter SOL para abastecê-la com SOL de teste.',
    request: 'Peça SOL de teste no faucet',
    requestHint: 'O endereço da sua carteira foi copiado. Cole-o se o campo estiver vazio e depois confirme.',
    openAgain: 'Abrir de novo',
    airdropped: 'Airdrop de ◎1 recebido',
    airdroppedHint: 'O SOL de teste chegou à {cluster}. Você já pode comprar bilhetes.',
    failed: 'O airdrop falhou',
    slow: 'O airdrop foi aceito, mas o saldo ainda não foi atualizado. Atualize daqui a pouco.',
  },

  footer: {
    license: 'Licença MIT',
    program: 'Programa {address} na {cluster}.',
    age: 'Somente para maiores de 18 anos. Jogue por diversão, e só onde loterias forem legais.',
    legal: 'Jurídico',
    languages: 'Idiomas',
    source: 'Código-fonte',
    builtOn: 'Construído na {solana}',
    madeBy: 'Feito pela {nexow}',
  },

  home: {
    kicker: 'Loteria diária na Solana',
    title: 'Escolha um número.',
    titleEnd: 'Ganhe o pote à meia-noite.',
    lead: 'Um sorteio por dia, um vencedor, o pote inteiro. Cada bilhete, cada lamport e cada sorteio fica na Solana, onde qualquer pessoa pode conferir.',
    playNow: 'Jogar agora',
    howItWorks: 'Como funciona',
    program: 'Programa',
    cluster: 'Cluster',
    draw: 'Sorteio',
    dialCaption:
      'Cada ponto é um dos bilhetes de hoje: em volta do mostrador pela hora em que foi comprado, para fora pelo seu número.',

    how: {
      tag: 'Como funciona',
      title: 'Quatro passos, um sorteio por dia',
      description:
        'As rodadas seguem o calendário UTC: uma nova abre às 00:00 UTC e é sorteada logo depois da meia-noite seguinte.',
      opens: 'Abre a rodada',
      draw: 'Sorteio',
      now: 'Agora',
      steps: {
        wallet: {
          title: 'Conecte uma carteira',
          description:
            'Phantom, Solflare, Backpack ou qualquer carteira compatível com o Wallet Standard. Sem conta, sem e-mail.',
          when: 'A qualquer hora',
        },
        number: {
          title: 'Escolha seu número',
          description:
            'Qualquer número de 0 a {max}. Cada número só pode estar em um bilhete por dia, então não demore.',
          when: 'Até a meia-noite UTC',
        },
        pot: {
          title: 'Veja o pote crescer',
          description:
            'Cada bilhete soma seu preço ao pote, guardado pela própria conta da rodada na Solana. Ninguém mais pode movimentá-lo.',
          when: 'O dia todo',
        },
        win: {
          title: 'Ganhe à meia-noite UTC',
          description:
            'Um bilhete leva o pote inteiro, menos uma pequena taxa da casa. Mais bilhetes, mais chances: cada bilhete conta uma vez.',
          when: 'Logo após a meia-noite UTC',
        },
      },
    },

    fairness: {
      tag: 'Jogo limpo',
      title: 'Não confie em nós. Confira.',
      description:
        'O S☉Lucky é um programa da Solana, não um servidor que guarda o seu dinheiro. Estas regras são impostas pelo código dele.',
      rules: {
        locked: {
          title: 'O pote fica travado no programa',
          description:
            'O dinheiro dos bilhetes vai direto para a conta da rodada. O programa só o paga ao dono do bilhete vencedor, e a taxa à tesouraria. O operador não pode sacá-lo.',
        },
        draw: {
          title: 'Um sorteio que ninguém pode prever',
          description:
            'Cada compra é misturada à entropia da rodada. Quando o dia termina, a rodada fixa um slot alguns segundos no futuro; o hash desse slot, desconhecido por todos até então, escolhe o vencedor.',
        },
        anyone: {
          title: 'Qualquer pessoa pode executar',
          description:
            'Fechar, sortear e pagar estão abertos a todos. Se o operador sumisse amanhã, qualquer jogador ainda poderia concluir todas as rodadas.',
        },
        browser: {
          title: 'Conferível no seu navegador',
          description:
            'A página de cada rodada recalcula o sorteio a partir de dados públicos: a entropia, o hash do slot e o índice vencedor. Mesmas entradas, mesmo vencedor.',
        },
        limits: {
          title: 'Limites rígidos para a casa',
          description:
            'O programa limita a taxa a 10%. Mudanças de preço e de taxa só valem para a rodada do dia seguinte, e um comprador nunca paga mais do que o preço que lhe foi mostrado.',
        },
        open: {
          title: 'Código aberto',
          description: 'O programa, o app e os scripts do operador são públicos, com testes para cada regra.',
        },
      },
    },

    faq: {
      tag: 'Dúvidas',
      title: 'Perguntas',
      description: 'Ainda não tem certeza? O programa, o app e os scripts do operador são de código aberto.',
      readCode: 'Ler o código',
      items: {
        real: {
          q: 'É dinheiro de verdade?',
          a: 'O app público roda na devnet da Solana, onde o SOL é dinheiro de teste gratuito do faucet.solana.com. O programa funciona igual na mainnet, mas operar uma loteria com dinheiro de verdade exige as licenças adequadas onde você opera.',
        },
        price: {
          q: 'Quanto custa um bilhete?',
          a: 'O preço é definido on-chain e mostrado na página Jogar. Além do preço, a conta de um bilhete guarda um pequeno depósito de aluguel, que você recebe de volta ao fechar o bilhete depois que a rodada for paga. O primeiro bilhete do dia também paga o aluguel da conta da rodada, que fica on-chain como registro público dela.',
        },
        odds: {
          q: 'Como são calculadas minhas chances?',
          a: 'Todo bilhete tem a mesma chance: seus bilhetes divididos por todos os bilhetes vendidos naquele dia. O número que você escolhe é o seu rótulo no quadro; ele não muda suas chances.',
        },
        draw: {
          q: 'E se ninguém sortear a rodada?',
          a: 'Um pequeno bot (o crank) fecha, sorteia e paga cada rodada segundos depois da meia-noite, e qualquer pessoa pode fazer o mesmo pelo painel Histórico. Se o slot fixado ficar antigo demais para ser lido (cerca de três minutos), a rodada pode ser fechada de novo para fixar um novo; o programa só permite isso quando o slot antigo está comprovadamente fora de alcance.',
        },
        country: {
          q: 'Por que meu país aparece?',
          a: 'O S☉Lucky sempre mostrou uma bandeira ao lado de cada bilhete. Sugerimos seu país a partir da sua conexão com a hospedagem, sem consultar nenhum terceiro, e você pode mudá-lo ou mantê-lo privado antes de comprar. Ele fica gravado on-chain com o seu bilhete.',
        },
        validator: {
          q: 'Um validador pode trapacear no sorteio?',
          a: 'Os jogadores, não: o hash vencedor não existe quando as vendas fecham. O validador que produz o slot fixado poderia enviesá-lo, escolhendo o que entra naquele bloco ou pulando-o. Isso é aceitável para um jogo com dinheiro de teste; para potes com dinheiro de verdade, o sorteio deveria usar um oráculo de aleatoriedade verificável, e o README explica onde conectar um.',
        },
      },
    },

    cta: {
      title: 'O pote de hoje está esperando',
      description: 'Escolha um número que ninguém pegou ainda. Boa sorte!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Um sorteio por dia · Sorteado após a meia-noite UTC · Todo bilhete na Solana',
    draw: 'Sorteio',
    pot: 'Pote de hoje',
    toDraw: 'até o sorteio · {day}',
    tickets: '{n} bilhete hoje | {n} bilhetes hoje',
    entropy: 'Entropia · {cluster}',
    entropyTitle: 'Entropia: {hex}',
    noTickets: 'nenhum bilhete ainda',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Novo bilhete',
    rules: {
      daily: 'Nova rodada todo dia às 00:00 UTC',
      pot: 'Um bilhete leva o pote',
      numbers: 'Números de 0 a {max}',
      fee: 'Taxa da casa limitada a 10% pelo programa',
      anyone: 'Qualquer pessoa pode fechar, sortear e pagar uma rodada',
      check: 'Recalcule cada sorteio no seu navegador',
      open: 'Código aberto',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Comprovante do sorteio',
    round: 'Rodada',
    noneYet: 'nenhuma liquidada ainda',
    tickets: 'Bilhetes',
    pot: 'Pote',
    entropy: 'Entropia',
    slotHash: 'Hash do slot · slot {slot}',
    formula: 'sha256(entropia ‖ hash do slot ‖ slot ‖ rodada) =',
    mod: 'primeiros 8 bytes como u64 mod {count} = {ticket}',
    ticketCount: 'bilhetes',
    ticket: 'bilhete #{index}',
    number: 'Número',
    paidTo: 'Pago a',
    payout: 'Pagamento',
    check: 'Conferir este sorteio',
    roundPage: 'Página da rodada',
    nextDraw: 'Próximo sorteio depois das 00:00 UTC',
    ok: 'Recalculado no seu navegador: mesmo hash, o bilhete #{index} vence.',
    mismatch: 'O hash recalculado no seu navegador não confere com esta rodada.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Bilhetes',
    players: 'Jogadores',
    countries: 'Países',
    ticket: 'Bilhete',
    yourTickets: 'Seus bilhetes',
    winChance: 'Chance de ganhar',
    chance: 'Chance',
    todaysPot: 'Pote de hoje',
    winners: 'Vencedores',
    averagePot: 'Pote médio',
    biggestPot: 'Maior pote',
  },

  countdown: {
    h: 'h',
    m: 'm',
    s: 's',
    left: 'faltam {time}',
  },

  play: {
    title: 'Jogar',
    description: 'Escolha o número de hoje e veja o pote crescer ao vivo na Solana.',
    testMoney: 'Você está jogando na Solana {cluster}: os bilhetes custam SOL de teste, sem valor real.',
    localFunds: 'Aponte sua carteira para {url} e depois abasteça-a com: {command}',
    phantomFunds:
      'No Phantom: Settings → Developer Settings → ative Testnet Mode → selecione {cluster}. Depois pegue SOL de teste grátis no faucet.',
    openFaucet: 'Abrir faucet',
    retry: 'Tentar de novo',
    rpcError: 'Não foi possível acessar o endpoint RPC da Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Escolha um',
    title: 'Número',
    win: 'Ganhe',
    in: 'em',
    taken: 'Já escolhido hoje',
    range: 'De 0 a {max}, um bilhete por número',
    pad: 'Teclado numérico',
    reset: 'Zerar',
    delete: 'Apagar o último dígito',
    dip: 'Surpresinha',
    searchCountry: 'Buscar um país',
    country: 'País exibido com seu bilhete',
    notSetUp: 'A loteria ainda não está configurada neste cluster.',
    paused: 'A venda de bilhetes está pausada.',
    buy: 'Comprar o {number} por ◎{price}',
    takenToday: 'O {number} já foi escolhido hoje',
    outOfRange: 'Número fora do intervalo',
    notEnough: 'SOL insuficiente',
    keys: 'Teclas 0–9 digitam, ⌫ apaga, Enter compra.',
    rent: 'Um bilhete também guarda ◎{rent} de aluguel da conta, que você recebe de volta depois do sorteio.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    kicker: 'Hoje',
    title: 'SOLPOT',
    closesIn: '{day} · fecha em',
    inPlay: 'Números em jogo',
    empty: 'Nenhum bilhete ainda',
    beFirst: 'Escolha o primeiro número de hoje.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Histórico',
    total: 'Total',
    games: 'partida | partidas',
    waiting: 'Aguardando o sorteio',
    settle: 'Liquidar',
    settleDay: 'Liquidar {day}',
    anyone:
      'Qualquer pessoa pode fechar, sortear e pagar uma rodada encerrada. Custa só as taxas de rede; o prêmio sempre vai para o vencedor.',
    rent: '{n} bilhete antigo guarda ◎{sol} de aluguel | {n} bilhetes antigos guardam ◎{sol} de aluguel',
    rentHint: 'Feche-os para receber esse SOL de volta. A rodada mantém seus resultados.',
    getBack: 'Recuperar',
    winners: 'Vencedores',
    noWinners: 'Nenhum vencedor ainda',
    firstDraw: 'O primeiro sorteio acontece à meia-noite UTC.',
    chart: 'Pote por dia',
    chartEmpty: 'Nenhuma rodada encerrada ainda.',
    chartLabel:
      'Pote de {n} rodada, a mais recente; a lista abaixo traz todos os valores. | Pote das últimas {n} rodadas; a lista abaixo traz todos os valores.',
  },

  status: {
    open: 'Aberta',
    toClose: 'Aguardando fechamento',
    toDraw: 'Aguardando sorteio',
    unpaid: 'Sorteada, não paga',
    paid: 'Paga',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Ao vivo',
    connecting: 'Conectando',
    offline: 'Offline',
    atTable: '{n} na mesa',
    picking: '{n} escolhendo | {n} escolhendo',
    you: 'você',
    joined: 'entrou',
    now: 'agora',
    empty: 'A mesa está aberta. O próximo bilhete aparece aqui assim que chegar.',
    joinedOne: 'Um novo jogador entrou na mesa',
    joinedMany: '{n} novo jogador entrou na mesa | {n} novos jogadores entraram na mesa',
    hereNow: '{n} aqui agora',
    locked: '{who} garantiu o {number}',
    potNow: 'O pote agora é de ◎{pot} com {n} bilhete | O pote agora é de ◎{pot} com {n} bilhetes',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Confirme na sua carteira…',
    done: '{label}: concluído',
    cancelled: '{label}: cancelado',
    failed: '{label}: falhou',
    view: 'Ver transação',
    buying: 'Comprando o número {number}',
    bought: 'O número {number} é seu. Boa sorte!',
    repin: 'Fixando de novo o slot do sorteio de {day}',
    closing: 'Fechando {day}',
    drawing: 'Sorteando {day}',
    paying: 'Pagando o vencedor de {day}',
    paid: '◎{amount} pagos ao vencedor de {day}',
    settleFailed: 'Não foi possível liquidar {day}',
    reclaiming: 'Devolvendo o aluguel dos bilhetes',
    slowSlot: 'O cluster está demorando para chegar ao slot do sorteio. Tente de novo em um minuto.',
    noWinner: 'Não foi possível encontrar o bilhete vencedor.',
  },

  wallet: {
    connect: 'Conectar carteira',
    title: 'Conecte uma carteira',
    description: 'Qualquer carteira da Solana compatível com o Wallet Standard funciona.',
    none: 'Nenhuma carteira da Solana foi encontrada neste navegador. Instale uma e depois recarregue a página:',
    failed: 'Falha ao conectar {wallet}',
    copied: 'Endereço copiado',
    balance: 'Saldo',
    ticketsLeft: '{n} bilhete restante | {n} bilhetes restantes',
    needMore: 'precisa de mais SOL para jogar',
    numbers: 'Seus números de hoje',
    copy: 'Copiar endereço',
    explorer: 'Explorador',
    play: 'Jogar',
    disconnect: 'Desconectar',
  },

  round: {
    title: 'Rodada {day}',
    back: 'Voltar ao jogo',
    notDate: 'Isto não é uma data. As rodadas são nomeadas YYYY-MM-DD.',
    kicker: 'Rodada',
    nobody: 'Ninguém jogou neste dia',
    beFirst: 'Compre o primeiro bilhete de hoje.',
    onlyExists: 'Uma rodada só passa a existir quando o primeiro bilhete dela é vendido.',
    pot: 'Pote',
    usd: '{usd} na cotação de hoje',
    winner: 'Vencedor',
    won: 'Ganhou ◎{payout} · taxa ◎{fee}',
    unpaid: 'Ainda não pago',
    anyone: 'Qualquer pessoa pode concluir esta rodada. Custa só as taxas de rede.',
    settle: 'Liquidar esta rodada',
    sold: 'Bilhetes vendidos',
    price: 'Preço do bilhete',
    fee: 'Taxa da casa',
    slot: 'Slot fixado',
    check: 'Conferir o sorteio',
    formula: 'aleatoriedade = sha256(entropia ‖ hash do slot ‖ slot do sorteio ‖ endereço da rodada)',
    recompute: 'Recalcular no meu navegador',
    entropy: 'Entropia (cada compra, hasheada em ordem)',
    slotHash: 'Hash do slot {slot} (lido pelo programa na sysvar SlotHashes)',
    randomness: 'Aleatoriedade',
    winning: 'Bilhete vencedor',
    winningFormula: 'primeiros 8 bytes como u64 mod {count} = compra #{index}',
    ok: 'O sorteio confere.',
    mismatch: 'Divergência: o resultado gravado não confere com as entradas.',
    got: 'Seu navegador obteve {hash}… e o bilhete #{index}.',
    tickets: 'Bilhetes',
    ticketsHint: 'Bilhetes fechados pelos donos depois do pagamento não aparecem mais aqui; a rodada mantém os totais.',
    noTickets: 'Não restam bilhetes abertos nesta rodada.',
    account: 'Conta da rodada {address} · {day}',
  },

  country: {
    private: 'Privado',
  },

  errors: {
    rejected: 'Você cancelou a solicitação na sua carteira.',
    taken: 'Alguém já tem este número hoje. Escolha outro.',
    funds: 'Não há SOL suficiente na carteira.',
    walletCluster:
      'Sua carteira não conseguiu assinar. No Phantom: Settings → Developer Settings → ative Testnet Mode → selecione Devnet, depois reconecte e tente de novo.',
    unknown: 'Algo deu errado.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Só a autoridade pode fazer isso.',
      invalidTicketPrice: 'O preço do bilhete deve ser de pelo menos 0,001 SOL.',
      feeTooHigh: 'A taxa está acima do limite de 10%.',
      invalidMaxNumber: 'O maior número deve ser maior que zero.',
      paused: 'A venda de bilhetes está pausada.',
      wrongDay: 'Só é possível comprar bilhetes para a rodada de hoje.',
      numberOutOfRange: 'O número está fora do intervalo.',
      invalidCountry: 'O país deve ser um código ISO 3166-1 alpha-2 em maiúsculas.',
      roundNotOpen: 'A rodada não está aberta.',
      roundNotOver: 'A rodada ainda não terminou.',
      roundAlreadyDrawn: 'A rodada já foi sorteada.',
      drawStillPossible: 'O slot fixado ainda pode ser sorteado.',
      roundNotClosed: 'A rodada não está fechada.',
      targetSlotNotReached: 'O slot fixado ainda não foi alcançado.',
      randomnessUnavailable:
        'O hash do slot fixado ainda não pode ser lido; tente de novo em instantes, ou feche a rodada outra vez depois que ele expirar.',
      roundNotDrawn: 'A rodada não foi sorteada.',
      notWinningTicket: 'Este não é o bilhete vencedor.',
      roundNotSettled: 'A rodada não foi liquidada.',
      overflow: 'Overflow aritmético.',
      priceChanged: 'O preço do bilhete é maior do que o preço que você aceitou.',
      feeAlreadyCollected: 'A taxa desta rodada já foi cobrada.',
    },
  },

  legal: {
    kicker: 'Jurídico',
    updated: 'Última atualização: {date}',
    onThisPage: 'Nesta página',
    others: 'Outros documentos legais',
    translated: 'Esta página é uma tradução do original em inglês. Se houver divergência, vale a versão em inglês.',
    readEnglish: 'Ler em inglês',
    repository: 'repositório do código-fonte',

    pages: {
      notice: {
        label: 'Aviso legal',
        description: 'Quem opera o S☉Lucky, como falar com a gente e os documentos que se aplicam.',
      },
      terms: {
        label: 'Termos de Serviço',
        description: 'As regras para usar o site e jogar, e o que o programa promete e o que não promete.',
      },
      privacy: {
        label: 'Política de Privacidade',
        description: 'O que é público na Solana, o que nossos servidores veem e o que nunca coletamos.',
      },
      cookies: {
        label: 'Cookies e armazenamento',
        description: 'Sem cookies, sem rastreadores: as cinco configurações que o app guarda no seu navegador.',
      },
      play: {
        label: 'Jogo responsável',
        description: 'Como funcionam as chances e onde buscar ajuda se jogar deixar de ser divertido.',
      },
    },

    notice: {
      description: 'Quem opera o S☉Lucky, como falar com a gente e os documentos que se aplicam quando você o usa.',
      operator: {
        title: 'Quem opera o S☉Lucky',
        body: 'O S☉Lucky é criado e operado pela {operator}. Você pode falar com a gente pelo e-mail {email} e saber mais sobre nós em {site}.',
      },
      software: {
        title: 'O programa e o site',
        intro: 'O S☉Lucky tem duas partes:',
        program:
          '{name}, um programa da Solana que vende os bilhetes, guarda o pote de cada dia e paga o vencedor. Este site usa o programa em {address} na Solana {cluster}. Qualquer pessoa pode usá-lo diretamente, sem este site.',
        programName: 'O programa',
        site: '{name}, que mostra os dados públicos do programa e ajuda você a enviar transações da sua própria carteira. Ele nunca guarda suas chaves nem o seu SOL.',
        siteName: 'Este site',
      },
      documents: {
        title: 'Documentos',
        intro: 'Usar o site significa aceitar estes documentos:',
      },
      security: {
        title: 'Como relatar um problema de segurança',
        body: 'Por favor, não abra uma issue pública. Envie um e-mail para {email} com o assunto {subject}, e nunca faça testes com os fundos de outros jogadores: use a devnet ou um validador local. A política de segurança, {file} no {repository}, explica o que incluir e o que está no escopo.',
      },
      license: {
        title: 'Licença de código aberto',
        body: 'O programa, o app e os scripts do operador são de código aberto sob a Licença MIT ({file} no {repository}), © {years} {operator}. A licença cobre o código; os {terms} cobrem o uso deste site.',
      },
    },

    terms: {
      description: 'As regras para usar o S☉Lucky, e o que o programa dele promete e o que não promete.',
      agreement: {
        title: 'Estes termos',
        p1: 'Estes termos se aplicam quando você usa o site e o app do S☉Lucky, operados pela {operator} (“nós”). Ao usá-los, você os aceita, junto com a {privacy} e a página {cookies}. Se você não os aceitar, não use o site.',
        p2: 'O jogo em si é um programa da Solana: software de código aberto que roda na rede Solana, não nos nossos servidores. O site é uma forma de usá-lo; qualquer pessoa também pode usar o programa diretamente.',
      },
      eligibility: {
        title: 'Quem pode jogar',
        age: 'Você precisa ter 18 anos ou mais.',
        legal:
          'Você só pode jogar onde loterias e jogos de azar online forem legais para você. Verificar isso é responsabilidade sua; nós não verificamos onde você está.',
        own: 'Não jogue por outra pessoa, nem com SOL que não seja seu.',
      },
      money: {
        title: 'SOL de teste e SOL real',
        test: 'Este site roda na {cluster}. Os bilhetes custam SOL de teste, que é gratuito em um faucet e não tem valor: ele não pode ser trocado por dinheiro real, assim como nada do que você ganhar com ele.',
        real: 'Este site roda na {cluster}. Os bilhetes custam SOL real, e os potes são pagos em SOL real.',
      },
      rounds: {
        title: 'Como funciona uma rodada',
        intro: 'O programa impõe estas regras; o site só as mostra:',
        day: 'Há uma rodada por dia UTC, das 00:00 UTC até a meia-noite seguinte.',
        number:
          'Um bilhete é um número, de 0 até o maior número definido na configuração do programa. Cada número só pode estar em um bilhete por rodada.',
        price:
          'O preço do bilhete e a taxa da casa são copiados da configuração quando uma rodada abre, e ficam fixos durante essa rodada. A taxa nunca pode passar de 10% do pote. Ao comprar, você nunca paga mais do que o preço que lhe foi mostrado.',
        pot: 'O preço de cada bilhete vai para o pote da rodada, guardado pela própria conta da rodada na Solana. Todo bilhete tem a mesma chance: a sua chance é o número de bilhetes seus dividido por todos os bilhetes vendidos naquela rodada. O número que você escolhe não a altera.',
        draw: 'Depois da meia-noite, qualquer pessoa pode fechar a rodada, sorteá-la e pagá-la. O dono do bilhete vencedor recebe o pote menos a taxa da casa, e a taxa vai para a tesouraria.',
        rent: 'A conta de um bilhete também guarda um pequeno depósito de aluguel, que você recebe de volta ao fechar o bilhete depois que a rodada dele for paga. O primeiro bilhete de uma rodada também paga o aluguel da conta da rodada, que fica na Solana como registro público da rodada.',
      },
      wallet: {
        title: 'Sua carteira e suas transações',
        own: 'Você joga com a sua própria carteira. Nunca guardamos suas chaves, seu SOL ou seus bilhetes, e não podemos movimentá-los.',
        sign: 'É você quem assina cada transação, e é você quem paga as taxas de rede da Solana. Transações confirmadas são definitivas: não podemos cancelá-las, revertê-las nem reembolsá-las.',
        public:
          'O número de um bilhete, o endereço do dono dele e a bandeira de país que você escolher para ele ficam públicos na Solana para sempre. A {privacy} explica o que isso significa.',
        keys: 'Guarde bem as chaves da sua carteira. Ninguém, nem mesmo nós, pode recuperá-las para você.',
      },
      operator: {
        title: 'O que o operador pode e não pode fazer',
        intro: 'A configuração do programa tem uma autoridade, que pode:',
        price:
          'alterar o preço do bilhete (no mínimo ◎0,001) e a taxa da casa (no máximo 10%), com efeito a partir da próxima rodada que abrir;',
        pause:
          'pausar e retomar a venda de bilhetes. Uma pausa só impede novos bilhetes: as rodadas já jogadas ainda podem ser sorteadas e pagas;',
        other: 'alterar a tesouraria, o maior número e a própria autoridade.',
        cannot:
          'O código do programa não permite que a autoridade, ou qualquer outra pessoa, pegue o pote de uma rodada ou o envie para outro lugar que não seja o dono do bilhete vencedor, fique com mais do que a taxa ou cobre de um comprador mais do que o preço que lhe foi mostrado.',
        upgrade:
          'O programa é atualizável: quem detém a autoridade de atualização dele poderia implantar um código diferente, então você está confiando em quem a detém até que o programa se torne imutável ou seja entregue a uma multisig. O código-fonte de cada versão é público, e um programa implantado pode ser conferido com ele, como explica a seção “Verifiable builds” do README.',
      },
      risks: {
        title: 'Riscos',
        intro: 'Ao jogar, você aceita que:',
        bugs: 'softwares podem ter bugs, inclusive o programa, o app e a sua carteira, e um bug pode fazer você perder seus bilhetes ou seu SOL;',
        network:
          'a Solana ou o endpoint RPC que o site usa podem ficar lentos, congestionados ou fora do ar, e uma transação pode falhar ou chegar depois que uma rodada fechar;',
        draw: 'o sorteio usa o hash de um slot da Solana que ninguém conhece quando as vendas fecham. Os jogadores não conseguem prevê-lo, mas o validador que produz esse slot poderia enviesá-lo, e quem fecha uma rodada poderia segurar um sorteio desfavorável até que esse slot não possa mais ser lido. Não é um oráculo de aleatoriedade verificável;',
        site: 'o site pode ficar indisponível a qualquer momento. O programa, e os seus bilhetes, continuam funcionando sem ele;',
        law: 'as leis sobre loterias e criptoativos variam entre países e podem mudar.',
      },
      use: {
        title: 'Usar o site de forma justa',
        body: 'Não ataque nem sobrecarregue o site ou os servidores dele, não tente contornar os limites deles, não interfira com outros jogadores e não use o site para infringir a lei. Podemos bloquear o acesso de quem fizer isso.',
      },
      liability: {
        title: 'Sem garantia',
        body: 'O site e o programa são fornecidos “no estado em que se encontram”, sem nenhuma garantia. Na medida permitida por lei, não nos responsabilizamos por nenhuma perda decorrente do uso deles, incluindo bilhetes perdidos, transações que falharam ou atrasaram, bugs, problemas de rede ou um sorteio que você considere injusto. Nada nestes termos limita uma responsabilidade que a lei não nos permite limitar.',
      },
      openSource: {
        title: 'Código aberto',
        body: 'O programa, o app e os scripts do operador são de código aberto sob a Licença MIT: veja o {repository}. Essa licença cobre o código; estes termos cobrem o uso deste site.',
      },
      changes: {
        title: 'Alterações',
        body: 'Podemos atualizar estes termos. A data no topo mostra a última alteração, e a versão mostrada aqui vale a partir dessa data.',
      },
      contact: {
        title: 'Contato',
        body: 'Dúvidas sobre estes termos: {email}.',
      },
    },

    privacy: {
      description: 'O que é público na Solana, o que nossos servidores veem e o que nunca coletamos.',
      summary: {
        title: 'Em resumo',
        account: 'Não há conta, e-mail nem cadastro. Você joga com uma carteira.',
        cookies: 'O site não grava cookies e não carrega ferramentas de análise, anúncios nem rastreadores.',
        database: 'Não mantemos um banco de dados de jogadores, e não vendemos nem compartilhamos dados sobre você.',
        public:
          'Seus bilhetes são públicos na Solana, por design: é isso que permite que qualquer pessoa confira o jogo.',
        controller: 'A {operator} opera o site e é responsável pelos dados que ele trata.',
      },
      onChain: {
        title: 'O que é público na Solana',
        intro: 'Quando você compra um bilhete, a transação e a conta do bilhete registram, publicamente:',
        address: 'o endereço da sua carteira e as transações que ela assina;',
        number: 'o número que você escolheu, a rodada e o horário da compra;',
        flag: 'a bandeira de país que você escolheu para o bilhete, ou nenhuma, se você mantiver o país privado.',
        ledger:
          'Quando uma rodada é sorteada, a conta dela também registra o endereço do vencedor, o número vencedor e a bandeira dele, e o valor pago. A Solana é um registro público: qualquer pessoa pode ler esses dados, muita gente guarda cópias deles e eles ficam lá para sempre. Fechar um bilhete apaga a conta dele e devolve o aluguel, mas as transações que o criaram e o fecharam continuam no registro. Nem nós nem ninguém pode alterá-lo ou apagá-lo.',
        link: 'Um endereço de carteira não é o seu nome, mas pode ser ligado a você, por exemplo por meio de uma exchange que você usou. Use uma carteira separada se quiser manter o seu jogo separado do resto da sua atividade.',
      },
      servers: {
        title: 'O que nossos servidores veem',
        visit: 'Cada visita',
        visitBody:
          'O site é hospedado na Cloudflare. Como qualquer site, ele recebe seu endereço IP, o user agent do seu navegador e as páginas que você solicita, para entregá-las e proteger o site contra abusos. A Cloudflare mantém logs operacionais por tempo limitado, conforme a sua {policy}. Só os usamos para manter o site funcionando e corrigi-lo.',
        policy: 'própria política de privacidade',
        country: 'Seu país',
        countryBody:
          'A Cloudflare informa ao nosso servidor de qual país vem cada solicitação. O app pede essa informação uma vez, para sugerir a bandeira dos seus bilhetes; você pode mudá-la ou mantê-la privada antes de comprar. O servidor lê apenas o país, não o seu endereço IP, e não o guarda.',
        live: 'A mesa ao vivo na página Jogar',
        liveBody:
          'Enquanto a página Jogar está aberta, seu navegador mantém uma conexão com nosso servidor para que os jogadores vejam quem mais está ali. Ela compartilha três coisas com as outras pessoas na página: um id aleatório só daquela conexão, a bandeira que seus bilhetes mostram (nenhuma, se você mantiver seu país privado) e se você está digitando um número, nunca o número em si. Nenhum endereço de carteira nem endereço IP entra nela, e nada sobre a conexão é armazenado ou mantido depois que ela fecha.',
        price: 'O preço do SOL',
        priceBody:
          'Para mostrar os potes em dólares, nosso servidor busca o preço do SOL na Coinbase, ou na CoinGecko se a Coinbase não responder, e o mantém em cache por um minuto. Essas solicitações partem do nosso servidor e não levam nada sobre você.',
      },
      thirdParties: {
        title: 'Serviços que seu navegador usa',
        rpc: '{name}, de onde o app lê o jogo e por onde envia suas transações: {endpoint}. Ele recebe seu endereço IP e as contas que o app consulta, inclusive a da sua carteira depois que você a conecta, conforme a política do operador dele.',
        rpcName: 'Um endpoint RPC da Solana',
        rpcHost: '{host} neste site',
        rpcPublic: 'O endpoint público da Solana para a {cluster}',
        wallet:
          '{name}, como Phantom, Solflare ou Backpack, que é um software do próprio fabricante, com a própria política. O site só pede que ela se conecte e assine as transações que você aprova.',
        walletName: 'Sua carteira',
        links:
          '{name}: o Solana Explorer, o faucet da Solana, o GitHub e nossas redes sociais são outros sites, com as próprias políticas.',
        linksName: 'Links que você abre',
        own: 'Fontes, sons e imagens vêm do nosso próprio domínio, então carregar o site não contata mais ninguém.',
      },
      browser: {
        title: 'O que fica no seu navegador',
        body: 'O app guarda cinco configurações no armazenamento local do seu navegador: seu tema, sua última carteira, sua escolha de país, a configuração de som e seu idioma. A página {cookies} lista todas elas.',
      },
      purposes: {
        title: 'Para quê, e o que nunca fazemos',
        body: 'Tratamos os dados acima apenas para exibir o site, rodar o jogo que você pede para jogar, manter o site seguro e corrigir problemas. Não criamos perfis, não exibimos anúncios, não vendemos dados nem os compartilhamos com anunciantes.',
      },
      rights: {
        title: 'Suas escolhas e direitos',
        flag: 'Você pode jogar sem bandeira de país: escolha mantê-la privada antes de comprar.',
        clear:
          'Você pode limpar as configurações no seu navegador a qualquer momento, e usar uma carteira nova quando quiser.',
        law: 'Dependendo de onde você mora, você pode ter o direito de acessar, corrigir ou excluir dados pessoais sobre você, ou de se opor à forma como eles são usados. Envie um e-mail para {email} e responderemos. Não guardamos quase nada sobre você, e não podemos alterar nem apagar o que está na Solana.',
      },
      children: {
        title: 'Menores de idade',
        body: 'O S☉Lucky é para pessoas com 18 anos ou mais. Não tratamos intencionalmente dados de ninguém mais jovem.',
      },
      changes: {
        title: 'Alterações e contato',
        body: 'Atualizaremos esta página quando o site mudar a forma como trata dados; a data no topo mostra a última alteração. Dúvidas: {email}.',
      },
    },

    cookies: {
      description:
        'Sem cookies, sem rastreadores: as cinco configurações que o app guarda no seu navegador, e como removê-las.',
      none: {
        title: 'Sem cookies',
        p1: 'O S☉Lucky não grava cookies e não carrega scripts de análise, publicidade ou rastreamento. A política de segurança do site só permite scripts do próprio domínio.',
        p2: 'Nossa hospedagem, a Cloudflare, pode gravar cookies de segurança estritamente necessários, como {cookie}, quando a proteção contra bots dela está ativada. A Cloudflare os usa para distinguir pessoas de bots, como explica a {list} dela.',
        list: 'lista de cookies',
      },
      storage: {
        title: 'O que o app guarda no seu navegador',
        intro:
          'O app salva algumas configurações no armazenamento local do seu navegador, para que continuem lá da próxima vez. Elas ficam no seu dispositivo, com uma exceção: a bandeira que você escolhe vai nos bilhetes que você compra, e aparece na mesa ao vivo da página Jogar enquanto você está lá.',
        key: 'Chave',
        holds: 'O que guarda',
        saved: 'Salvo',
        wallet: 'A extensão da sua carteira guarda os próprios dados, conforme a política do fabricante.',
      },
      keys: {
        theme: {
          holds: 'Seu tema claro ou escuro.',
          when: 'Quando você troca o tema.',
        },
        wallet: {
          holds: 'O nome da última carteira que você conectou e o endereço dela, para que o app possa reconectá-la.',
          when: 'Quando você conecta uma carteira; removido quando você a desconecta.',
        },
        country: {
          holds: 'A bandeira de país que você escolheu para seus bilhetes, ou que você prefere mantê-la privada.',
          when: 'Quando você escolhe uma bandeira.',
        },
        sound: {
          holds: 'Se os sons estão ligados ou desligados.',
          when: 'Quando você ativa ou desativa o som.',
        },
        lang: {
          holds: 'O idioma que você escolheu, para que o app não ofereça outro de novo.',
          when: 'Quando você escolhe um idioma, ou responde à sugestão de ler o site no seu.',
        },
      },
      clear: {
        title: 'Como remover',
        disconnect: 'Desconecte sua carteira no app para remover {key}.',
        site: 'Limpe os dados deste site nas configurações do navegador para remover todos eles.',
        private: 'Em uma janela anônima, eles são apagados quando você a fecha.',
        reset: 'Removê-los só redefine essas configurações; seus bilhetes estão na Solana e continuam sendo seus.',
      },
      banner: {
        title: 'Por que não há banner de cookies',
        body: 'Nada aqui rastreia você, e cada configuração acima existe porque você a definiu. Então não há nada para aceitar ou recusar.',
      },
    },

    play: {
      description: 'Como funcionam as chances e onde buscar ajuda se jogar deixar de ser divertido.',
      basics: {
        title: 'Antes de jogar',
        age: 'O S☉Lucky é para pessoas com 18 anos ou mais, onde loterias são legais.',
        test: 'Este site roda na Solana {cluster}: os bilhetes custam SOL de teste, que é gratuito e não tem valor. É uma boa forma de ver como o jogo funciona sem gastar nada.',
        real: 'Este site roda na Solana Mainnet: os bilhetes custam SOL real.',
        fun: 'Jogue por diversão, nunca para ganhar dinheiro ou recuperar dinheiro que você perdeu.',
      },
      odds: {
        title: 'Conheça as chances',
        same: 'Todo bilhete tem a mesma chance. Sua chance de ganhar uma rodada é o número de bilhetes seus dividido por todos os bilhetes vendidos nela.',
        label: 'O número que você escolhe é o seu rótulo no quadro. Ele não muda sua chance.',
        fee: 'O vencedor recebe o pote menos a taxa da casa, que o programa limita a 10%. Assim, considerando todos os jogadores, os bilhetes devolvem o dinheiro gasto neles menos essa taxa: em média, um bilhete retorna menos do que custa.',
        nothing: 'Nada no site muda essas chances.',
      },
      final: {
        title: 'Bilhetes são definitivos',
        body: 'Um bilhete não pode ser cancelado nem reembolsado depois de comprado. A única coisa que você recebe de volta é o pequeno depósito de aluguel dele, ao fechar o bilhete depois que a rodada dele for paga.',
      },
      habits: {
        title: 'Mantenha a diversão',
        budget: 'Decida antes quanto você aceita perder, e pare quando esse valor acabar.',
        chase: 'Nunca tente recuperar perdas, e nunca jogue com dinheiro emprestado ou de que você precisa.',
        mood: 'Não jogue quando estiver chateado, cansado ou tiver bebido.',
        breaks: 'Faça pausas, e deixe o jogo ser só uma parte da sua vida entre muitas.',
      },
      limits: {
        title: 'Defina seus próprios limites',
        intro: 'O S☉Lucky não tem contas, então não pode definir limites nem excluir você. Você pode definir os seus:',
        wallet: 'Tenha uma carteira separada só com o que você aceita gastar.',
        block: 'Use um bloqueador de sites ou o controle parental do seu dispositivo para bloquear o site.',
        trust: 'Conte para alguém de confiança, e peça ajuda para manter seus limites.',
      },
      help: {
        title: 'Como buscar ajuda',
        intro:
          'Se jogar deixou de ser divertido, ou alguém próximo de você está preocupado com isso, estas organizações independentes oferecem ajuda gratuita e confidencial. Não temos vínculo com elas.',
        worldwide: 'No mundo todo: reuniões e contatos por país.',
        us: 'Estados Unidos.',
        uk: 'Reino Unido.',
        emergency: 'Se você ou outra pessoa estiver em perigo imediato, ligue para o número de emergência local.',
      },
    },
  },
};

export default pt;
