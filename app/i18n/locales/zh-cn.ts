/** Chinese (Simplified): translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const zhcn: Dict = {
  meta: {
    title: 'S☉Lucky：Solana 上的彩票游戏',
    description:
      '在每日或每小时彩票中选一个号码，或者找出隐藏的号码。赢家拿走奖池的 80%。每一张彩票、每一个奖池、每一次开奖都在 Solana 上，任何人都能查验。',
    ogImageAlt: 'S☉Lucky，Solana 上的彩票游戏',
  },

  nav: {
    play: '游戏',
    how: '运作方式',
    fairness: '公平性',
    faq: '常见问题',
  },

  lang: {
    label: '语言',
    choose: '语言：{name}',
  },

  update: {
    title: '新版本已就绪',
    hint: '重新加载即可立即使用。下次切换页面时也会自动加载。',
    reload: '重新加载',
  },

  install: {
    label: '安装应用',
    ios: '要安装 S☉Lucky，请打开浏览器的“共享”菜单，然后选择“添加到主屏幕”。',
  },

  push: {
    on: '这个游戏每期开出赢家时通知我',
    off: '关闭这个游戏的通知',
    enabled: '通知已开启',
    enabledHint: '{game}：每当有一期产生赢家，你都会收到通知。',
    disabled: '通知已关闭',
    blocked: '此网站的通知已被屏蔽。请在浏览器设置中允许通知，然后重试。',
    failed: '无法更改通知，请重试。',
    lottery: '{round} 期：开出号码 {drawn}。最接近的彩票 {winning} 赢得 ◎{prize}。',
    guess: '{round} 期：号码是 {winning}。找到它的猜测赢得 ◎{prize}。',
  },

  header: {
    beta: '测试版',
    getSol: '获取 SOL',
    faucetTip: '测试版临时水龙头：免费获取测试 SOL 来玩',
    mute: '关闭音效',
    unmute: '开启音效',
  },

  faucet: {
    connectFirst: '请先连接钱包',
    connectFirstHint: '然后点按“获取 SOL”，为它充入测试 SOL。',
    request: '在水龙头中申请测试 SOL',
    requestHint: '你的钱包地址已复制。如果输入框是空的，请粘贴进去，然后确认。',
    openAgain: '再次打开',
    airdropped: '已空投 ◎1',
    airdroppedHint: '测试 SOL 已在 {cluster} 上到账。现在可以买彩票了。',
    failed: '空投失败',
    slow: '空投已被接受，但余额尚未更新。请稍后刷新。',
  },

  footer: {
    license: 'MIT 许可证',
    program: '{cluster} 上的程序 {address}。',
    age: '仅限年满 18 岁者。只为娱乐而玩，并且只在彩票合法的地方玩。',
    legal: '法律信息',
    languages: '语言',
    source: '源代码',
    builtOn: '基于 {solana} 构建',
    madeBy: '由 {nexow} 打造',
  },

  home: {
    kicker: 'Solana 上的彩票游戏',
    title: '选一个号码。',
    titleEnd: '午夜赢取奖金。',
    lead: '每天开奖一次，每小时开奖一次，还有一个等你找出的隐藏号码。赢家拿走奖池的 80%，其余部分滚入下一期。每一张彩票、每一个 lamport、每一次开奖都在 Solana 上，任何人都能查验。',
    playNow: '立即开玩',
    howItWorks: '运作方式',
    program: '程序',
    cluster: '集群',
    draw: '开奖',
    dialCaption: '每个点代表今天的一张彩票：绕表盘一圈的位置代表购买时间，向外的距离代表它的号码。',

    how: {
      tag: '运作方式',
      title: '四个步骤，每天开奖一次',
      description: '每期按 UTC 日历进行：新的一期在 UTC 00:00 开放，并在下一个午夜过后立即开奖。',
      opens: '本期开始',
      draw: '开奖',
      now: '现在',
      steps: {
        wallet: {
          title: '连接钱包',
          description: 'Phantom、Solflare、Backpack，或任何支持 Wallet Standard 的钱包。无需账号，无需邮箱。',
          when: '随时',
        },
        number: {
          title: '选择你的号码',
          description: '0 到 {max} 之间的任意号码。每个号码每天只能由一张彩票持有，所以要快。',
          when: '直到 UTC 午夜',
        },
        pot: {
          title: '看着奖池增长',
          description: '每张彩票都会把票价加入奖池，奖池由该期在 Solana 上的专属账户持有。其他任何人都动不了它。',
          when: '全天',
        },
        win: {
          title: '在 UTC 午夜赢得奖池',
          description:
            '开出一个随机号码，离它最近的彩票赢得奖池的 80%。平台手续费从剩余部分中扣除，余下的滚入第二天的一期。',
          when: 'UTC 午夜过后立即',
        },
      },
    },

    fairness: {
      tag: '公平性',
      title: '别信我们，自己查。',
      description: 'S☉Lucky 是一个 Solana 程序，而不是替你保管资金的服务器。以下规则由它的代码强制执行。',
      rules: {
        locked: {
          title: '奖池锁定在程序中',
          description:
            '购票款直接进入该期的账户。程序只会把其中的 80% 支付给中奖彩票的持有者，把手续费支付给金库，把其余部分转入该游戏的下一期。运营方无法提取它。',
        },
        draw: {
          title: '无人能预测的开奖',
          description:
            '每一笔购买都会混入该期的熵。一期结束时，它会锁定一个几秒后才到来的插槽；这个插槽的哈希在那之前没有任何人知道，由它选出用来衡量各张彩票的号码。',
        },
        anyone: {
          title: '任何人都能执行',
          description: '关闭、开奖和派奖向所有人开放。即使运营方明天消失，任何玩家仍能完成每一期。',
        },
        browser: {
          title: '在浏览器中即可查验',
          description:
            '每一期的页面都会用公开数据重新计算开奖：熵、插槽哈希、开出的号码和最近的彩票。输入相同，赢家就相同。',
        },
        limits: {
          title: '对平台的硬性限制',
          description:
            '程序始终把奖池的 80% 支付给赢家，并将手续费上限定为 20%。票价和手续费的变更只适用于之后开放的各期，而且买家支付的金额绝不会超过向其显示的价格。',
        },
        open: {
          title: '开源',
          description: '程序、应用和运营脚本全部公开，每条规则都有测试。',
        },
      },
    },

    faq: {
      tag: '常见问题',
      title: '问题',
      description: '还有疑问？程序、应用和运营脚本都是开源的。',
      readCode: '阅读代码',
      items: {
        real: {
          q: '这是真钱吗？',
          a: '公开的应用运行在 Solana devnet 上，那里的 SOL 是来自 faucet.solana.com 的免费测试币。程序在 mainnet 上的运作方式相同，但运营真钱彩票需要在运营所在地取得相应的牌照。',
        },
        price: {
          q: '一张彩票多少钱？',
          a: '每个游戏的票价设定在链上，并显示在其游戏页面。除了票价，彩票账户还会占用一小笔租金押金，在该期派奖后关闭彩票即可取回。一期的第一张彩票还要支付该期账户的租金，该账户会作为该期的公开记录保留在链上；在每日和每小时彩票中，每张彩票还要为其号码在该账户中占用的 4 个字节付费。',
        },
        odds: {
          q: '我的中奖概率怎么算？',
          a: '在每日和每小时彩票中，离开出号码最近的彩票中奖，所以你的概率是号码范围中离你的号码比离其他任何人的号码更近的那部分所占的比例：离其他彩票越远的号码，覆盖的范围越大。在“猜数字”中，每次检查找到号码的概率，等于新猜测数除以尚未尝试的号码数。',
        },
        draw: {
          q: '如果没人开奖怎么办？',
          a: '一个小机器人（crank）会在每一期彩票结束后几秒内关闭、开奖并派奖，并每隔几秒检查一次新的猜测。任何人也都可以在游戏页面做同样的事。如果锁定的插槽过旧而无法读取（大约三分钟），可以再次关闭该期，以锁定一个新的插槽；程序只有在旧插槽可被证明已无法读取时才允许这样做。',
        },
        country: {
          q: '为什么要显示我的国家？',
          a: 'S☉Lucky 一直会在每张彩票旁显示一面国旗。我们根据你与我们托管服务之间的连接推荐你的国家，不借助任何第三方查询，你也可以在购买前更改它或设为不公开。它会和你的彩票一起存储在链上。',
        },
        validator: {
          q: '验证者能在开奖中作弊吗？',
          a: '玩家不能：停止售票时，中奖哈希还不存在。产出锁定插槽的验证者可能使结果产生偏向，方式是选择该区块包含哪些内容，或跳过该区块。对测试币游戏来说，这是可以接受的；对真钱奖池来说，开奖应使用可验证随机数预言机，README 说明了在哪里接入。',
        },
      },
    },

    cta: {
      title: '今天的奖池在等你',
      description: '选一个还没人选的号码。祝你好运！',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: '每天开奖一次 · UTC 午夜后开奖 · 每张彩票都在 Solana 上',
    draw: '开奖',
    pot: '今日奖池',
    toDraw: '距开奖 · {day}',
    tickets: '今日 {n} 张彩票',
    entropy: '熵 · {cluster}',
    entropyTitle: '熵：{hex}',
    noTickets: '还没有彩票',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: '新彩票',
    rules: {
      daily: '每天 UTC 00:00 开始新的一期',
      hourly: '每小时也有一期',
      pot: '最接近的号码赢得奖池的 80%',
      carry: '其余部分滚入下一期',
      guess: '猜数字：没有截止时间，直到有人猜中',
      numbers: '号码从 0 到 {max}',
      fee: '程序将平台手续费上限定为 20%',
      anyone: '任何人都能关闭一期、开奖并派奖',
      check: '在你的浏览器中重新计算每一次开奖',
      open: '开源',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: '开奖小票',
    round: '期号',
    noneYet: '尚无已结算的一期',
    tickets: '票数',
    pot: '奖池',
    entropy: '熵',
    slotHash: '插槽哈希 · 插槽 {slot}',
    formula: 'sha256(熵 ‖ 插槽哈希 ‖ 插槽 ‖ 期) =',
    mod: '前 8 个字节作为 u64 mod {count} = {drawn}',
    ticketCount: '号码数',
    closest: '最近的彩票：{number}',
    number: '号码',
    paidTo: '支付给',
    payout: '派奖金额',
    check: '查验这次开奖',
    roundPage: '该期页面',
    nextDraw: '下次开奖在 UTC 00:00 之后',
    ok: '已在你的浏览器中重新计算：哈希相同，号码 {number} 中奖。',
    mismatch: '在你的浏览器中重新计算的哈希与这一期不符。',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: '票数',
    players: '玩家',
    countries: '国家',
    ticket: '票价',
    yourTickets: '你的彩票',
    winChance: '中奖概率',
    chance: '概率',
    todaysPot: '奖池',
    checked: '已检查',
    waiting: '待检查',
    numbersLeft: '剩余号码',
    winners: '中奖者',
    averagePot: '平均奖池',
    biggestPot: '最大奖池',
  },

  countdown: {
    h: '时',
    m: '分',
    s: '秒',
    left: '剩余 {time}',
  },

  play: {
    title: '游戏',
    description: '在每日或每小时彩票中选一个号码，或者找出隐藏的号码，在 Solana 上实时看着奖池增长。',
    testMoney: '你正在 Solana {cluster} 上游戏：彩票用测试 SOL 支付，没有实际价值。',
    localFunds: '把你的钱包指向 {url}，然后用这条命令为它充值：{command}',
    phantomFunds:
      '在 Phantom 中：Settings → Developer Settings → 开启 Testnet Mode → 选择 {cluster}。然后从水龙头领取免费的测试 SOL。',
    openFaucet: '打开水龙头',
    retry: '重试',
    rpcError: '无法连接 Solana RPC 节点（{reason}）',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: '选一个',
    title: '号码',
    win: '赢取',
    in: '倒计时',
    taken: '本期已被选走',
    range: '0 到 {max}，每个号码一张彩票',
    pad: '数字键盘',
    reset: '重置',
    delete: '删除最后一位',
    dip: '机选',
    searchCountry: '搜索国家',
    country: '随彩票显示的国家',
    notSetUp: '这个集群上还没有设置这个游戏。',
    paused: '彩票销售已暂停。',
    buy: '以 ◎{price} 购买 {number}',
    takenToday: '{number} 已被选走',
    outOfRange: '号码超出范围',
    notEnough: 'SOL 不足',
    keys: '按 0–9 输入，⌫ 删除，Enter 购买。',
    rent: '每张彩票还会占用 ◎{rent} 的账户租金，开奖后可以取回。',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · 截止倒计时',
    carried: '含从上一期滚入的 ◎{carry}',
    split: '80% 归赢家 · {fee} 平台手续费 · 其余滚入下一期',
    inPlay: '已选号码',
    empty: '还没有彩票',
    beFirst: '成为本期第一个选号的人。',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: '游戏',
    title: '三种玩法',
    description: '号码范围都一样，从 0 到 {max}。赢家拿走奖池的 80%；平台手续费从剩余部分中扣除，余下的滚入下一期。',
    play: '开玩',
    daily: {
      name: '每日彩票',
      short: '每日',
      description: '每天 UTC 午夜后开奖。离开出号码最近的彩票中奖。',
    },
    hourly: {
      name: '每小时彩票',
      short: '每小时',
      description: '每小时整点（UTC）开奖。离开出号码最近的彩票中奖。',
    },
    guess: {
      name: '猜数字',
      short: '猜数字',
      description: '没有截止时间。新的猜测每隔几秒检查一次，直到其中一个找到本期的号码；随后新的一期开始。',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: '直到有人猜中',
    odds: '每次检查找到号码的概率，等于新猜测数除以尚未尝试的 {n} 个号码。',
    bought: '猜测 {number} 已提交，几秒后就会检查。',
    sealing: '封存 {day} 期的最新猜测',
    checkNow: '立即检查',
    checkHint: '机器人每隔几秒检查一次新的猜测。任何人都可以执行检查，需支付网络手续费。',
    missed: '不是这个号码：{numbers}',
    left: '答案是尚未尝试的 {n} 个号码之一。',
    foundByYou: '你猜中了！号码就是 {number}',
    foundByOther: '另一位玩家找到了号码',
    nextRound: '新的一期已开售，号码也是新的。',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: '历史',
    total: '共',
    games: '期',
    waiting: '等待开奖',
    settle: '结算',
    settleDay: '结算 {day}',
    anyone: '任何人都能对已结束的一期执行关闭、开奖和派奖。只需支付网络手续费；奖金始终归中奖者所有。',
    rent: '{n} 张旧彩票占用着 ◎{sol} 的租金',
    rentHint: '关闭它们即可取回这些 SOL。该期会保留其结果。',
    getBack: '取回',
    winners: '中奖者',
    noWinners: '还没有中奖者',
    firstDraw: '第一位中奖者会显示在这里。',
    chart: '每期奖池',
    chartEmpty: '还没有已结束的一期。',
    chartLabel: '最近 {n} 期的奖池；下方列表列出了每一个数值。',
  },

  status: {
    open: '开放中',
    toClose: '等待关闭',
    toDraw: '等待开奖',
    checking: '正在检查猜测',
    unpaid: '已开奖，未派奖',
    paid: '已派奖',
  },

  /** The strip across the top of the play page. */
  live: {
    live: '实时',
    connecting: '连接中',
    offline: '离线',
    atTable: '牌桌上 {n} 人',
    picking: '{n} 人正在选号',
    you: '你',
    joined: '加入',
    now: '刚刚',
    empty: '牌桌已开放。下一张彩票一上链，就会立即显示在这里。',
    joinedOne: '一位新玩家加入了牌桌',
    joinedMany: '{n} 位新玩家加入了牌桌',
    hereNow: '此刻 {n} 人在场',
    locked: '{who} 选定了 {number}',
    potNow: '奖池现为 ◎{pot}，共 {n} 张彩票',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: '请在钱包中确认…',
    done: '{label}：已完成',
    cancelled: '{label}：已取消',
    failed: '{label}：失败',
    view: '查看交易',
    buying: '购买号码 {number}',
    bought: '号码 {number} 归你了。祝你好运！',
    repin: '为 {day} 期重新锁定开奖插槽',
    closing: '关闭 {day} 期',
    drawing: '{day} 期开奖',
    paying: '向 {day} 期中奖者派奖',
    paid: '已向 {day} 期中奖者支付 ◎{amount}',
    settleFailed: '无法结算 {day} 期',
    reclaiming: '退还彩票租金',
    slowSlot: '集群到达开奖插槽的速度较慢。请一分钟后再试。',
    noWinner: '找不到中奖彩票。',
  },

  wallet: {
    connect: '连接钱包',
    title: '连接钱包',
    description: '任何支持 Wallet Standard 的 Solana 钱包都可以使用。',
    none: '在此浏览器中没有找到 Solana 钱包。请安装一个，然后重新加载页面：',
    failed: '无法连接 {wallet}',
    copied: '地址已复制',
    balance: '余额',
    ticketsLeft: '还够买 {n} 张彩票',
    needMore: '需要更多 SOL 才能玩',
    numbers: '你本期的号码',
    copy: '复制地址',
    explorer: '区块浏览器',
    play: '游戏',
    disconnect: '断开连接',
  },

  round: {
    title: '{day} 期',
    back: '返回游戏',
    notDate:
      '这不是本游戏的一期。每日彩票的各期以 YYYY-MM-DD 命名，每小时彩票的各期以 YYYY-MM-DDTHH 命名，“猜数字”的各期则以编号命名。',
    kicker: '期号',
    nobody: '这一期没有人玩',
    beFirst: '成为本期第一个买彩票的人。',
    onlyExists: '一期只有在第一张彩票售出后才会存在。',
    pot: '奖池',
    usd: '按今日价格计为 {usd}',
    winner: '中奖者',
    won: '赢得 ◎{payout} · 手续费 ◎{fee}',
    unpaid: '尚未派奖',
    anyone: '任何人都能完成这一期。只需支付网络手续费。',
    settle: '结算这一期',
    sold: '已售彩票',
    price: '票价',
    fee: '平台手续费',
    slot: '锁定的插槽',
    check: '查验开奖',
    formula: '随机数 = sha256(熵 ‖ 插槽哈希 ‖ 开奖插槽 ‖ 该期地址)',
    recompute: '在我的浏览器中重新计算',
    entropy: '熵（每一笔购买，按顺序哈希）',
    slotHash: '插槽 {slot} 的哈希（由程序从 SlotHashes 系统变量读取）',
    randomness: '随机数',
    winning: '中奖彩票',
    winningFormula: '前 8 个字节作为 u64 mod {count} = {drawn}；最近的彩票持有 {number}',
    guessFormula:
      '前 8 个字节作为 u64 mod {left}（尚未尝试的号码数）= {r}，小于 {batch}（本次检查的猜测数）：购买 #{index} 找到了号码',
    ok: '开奖结果查验无误。',
    mismatch: '不一致：存储的结果与输入不符。',
    got: '你的浏览器算出了 {hash}… 和号码 {number}。',
    tickets: '彩票',
    ticketsHint: '派奖后被持有者关闭的彩票不再显示在这里；该期仍保留总数。',
    noTickets: '这一期已没有未关闭的彩票。',
    account: '该期账户 {address} · {day}',
  },

  country: {
    private: '不公开',
  },

  errors: {
    rejected: '你在钱包中取消了请求。',
    taken: '本期已有人持有这个号码。请另选一个。',
    funds: '钱包中的 SOL 不足。',
    walletCluster:
      '你的钱包无法签名。在 Phantom 中：Settings → Developer Settings → 开启 Testnet Mode → 选择 Devnet，然后重新连接并再试一次。',
    unknown: '出了点问题。',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: '只有管理员才能执行此操作。',
      invalidTicketPrice: '票价必须至少为 0.002 SOL。',
      feeTooHigh: '手续费超过了 20% 的上限。',
      invalidMaxNumber: '最大号码必须大于零。',
      paused: '彩票销售已暂停。',
      wrongRound: '只能购买正在销售的这一期的彩票。',
      numberOutOfRange: '号码超出范围。',
      invalidCountry: '国家必须是大写的 ISO 3166-1 alpha-2 代码。',
      roundNotOpen: '该期未开放。',
      roundNotOver: '该期尚未结束。',
      roundAlreadyDrawn: '该期已经开过奖。',
      drawStillPossible: '锁定的插槽仍可用于开奖。',
      roundNotClosed: '该期尚未关闭。',
      targetSlotNotReached: '尚未到达锁定的插槽。',
      randomnessUnavailable: '锁定插槽的哈希暂时还无法读取；请稍后再试，或在它过期后再次关闭该期。',
      roundNotDrawn: '该期尚未开奖。',
      notWinningTicket: '这不是中奖彩票。',
      roundNotSettled: '该期尚未结算。',
      overflow: '算术溢出。',
      priceChanged: '票价高于你接受的价格。',
      feeAlreadyCollected: '该期的手续费已被收取。',
      roundFull: '这一期能容纳的彩票已全部售出。',
      nothingToCheck: '没有需要检查的新猜测。',
      batchSealed: '最新的猜测正在检查中；请几秒后再试。',
      invalidGame: '未知的游戏。',
    },
  },

  legal: {
    kicker: '法律信息',
    updated: '最后更新：{date}',
    onThisPage: '本页内容',
    others: '其他法律文件',
    translated: '本页是英文原文的译文。如两者不一致，以英文版本为准。',
    readEnglish: '阅读英文版',
    repository: '源代码仓库',

    pages: {
      notice: {
        label: '法律声明',
        description: '谁在运营 S☉Lucky、如何联系我们，以及适用的文件。',
      },
      terms: {
        label: '服务条款',
        description: '使用本网站和参与游戏的规则，以及程序承诺什么、不承诺什么。',
      },
      privacy: {
        label: '隐私政策',
        description: '哪些信息在 Solana 上公开、我们的服务器能看到什么，以及我们从不收集什么。',
      },
      cookies: {
        label: 'Cookie 与存储',
        description: '没有 Cookie，没有追踪器：应用在你的浏览器中保存的五项设置。',
      },
      play: {
        label: '理性游戏',
        description: '中奖概率如何运作，以及如果游戏不再有趣，可以去哪里寻求帮助。',
      },
    },

    notice: {
      description: '谁在运营 S☉Lucky、如何联系我们，以及你使用它时适用的文件。',
      operator: {
        title: '谁在运营 S☉Lucky',
        body: 'S☉Lucky 由 {operator} 打造并运营。你可以发邮件至 {email} 联系我们，并在 {site} 进一步了解我们。',
      },
      software: {
        title: '程序与网站',
        intro: 'S☉Lucky 由两部分组成：',
        program:
          '{name}：一个 Solana 程序，负责出售彩票、持有每天的奖池并向中奖者付款。本网站使用 Solana {cluster} 上地址为 {address} 的程序。任何人都可以不经本网站直接使用它。',
        programName: '程序',
        site: '{name}：展示程序的公开数据，并帮助你从自己的钱包发送交易。它从不持有你的私钥或你的 SOL。',
        siteName: '本网站',
      },
      documents: {
        title: '文件',
        intro: '使用本网站即表示接受以下文件：',
      },
      security: {
        title: '报告安全问题',
        body: '请不要公开提交 issue。请发送邮件至 {email}，主题为 {subject}，并且绝不要拿其他玩家的资金做测试：请使用 devnet 或本地验证者。安全策略（{repository}中的 {file}）说明了报告应包含哪些内容，以及哪些问题属于范围之内。',
      },
      license: {
        title: '开源许可证',
        body: '程序、应用和运营脚本均依据 MIT 许可证开源（见{repository}中的 {file}），© {years} {operator}。该许可证适用于代码；{terms}适用于本网站的使用。',
      },
    },

    terms: {
      description: '使用 S☉Lucky 的规则，以及其程序承诺什么、不承诺什么。',
      agreement: {
        title: '本条款',
        p1: '当你使用由 {operator}（“我们”）运营的 S☉Lucky 网站和应用时，适用本条款。使用即表示你接受本条款，以及{privacy}和 {cookies}页面。如果你不接受，请不要使用本网站。',
        p2: '游戏本身是一个 Solana 程序：在 Solana 网络上运行的开源软件，而不是在我们的服务器上运行。本网站是使用它的一种方式；任何人也都可以直接使用该程序。',
      },
      eligibility: {
        title: '谁可以参与',
        age: '你必须年满 18 岁。',
        legal: '你只能在彩票和在线博彩游戏对你而言合法的地方参与。核实这一点是你自己的责任；我们不会核实你身在何处。',
        own: '不要替他人参与，也不要用不属于你的 SOL 参与。',
      },
      money: {
        title: '测试 SOL 与真实 SOL',
        test: '本网站运行在 {cluster} 上。彩票以测试 SOL 支付，测试 SOL 可从水龙头免费获取，没有任何价值：它不能兑换成真钱，你用它赢得的任何东西也不能。',
        real: '本网站运行在 {cluster} 上。彩票以真实 SOL 支付，奖池也以真实 SOL 派发。',
      },
      rounds: {
        title: '一期如何进行',
        intro: '以下规则由程序强制执行；本网站只是展示它们：',
        day: 'S☉Lucky 有三个游戏。在每日彩票中，每个 UTC 日进行一期，从 UTC 00:00 到下一个午夜；在每小时彩票中，每个 UTC 小时进行一期。在“猜数字”中，一期没有结束时间：它会一直进行，直到有一个猜测找到它的号码。',
        number: '一张彩票对应一个号码，范围从 0 到程序配置中设定的最大号码。每个号码在每一期只能由一张彩票持有。',
        price:
          '每个游戏都有自己的票价和平台手续费。它们会在一期开放时连同最大号码一起被复制，并在该期内保持不变。手续费永远不能超过奖池的 20%。购买时，你支付的金额绝不会超过向你显示的价格。',
        pot: '每张彩票的票价都会进入该期的奖池，由该期在 Solana 上的专属账户持有。在每日和每小时彩票中，会从 0 到最大号码之间开出一个随机号码，离它最近的彩票中奖；距离相同时，较小的号码胜出。在“猜数字”中，新的猜测会分批检查：一批猜测包含该号码的概率，等于这批猜测的数量除以尚未尝试的号码数，与在该期开放时就藏好一个号码的概率相同。',
        draw: '一期彩票结束后，或者一旦有新的猜测等待检查，任何人都可以关闭该期、开奖并派奖。中奖彩票的持有者获得奖池的 80%，平台手续费归入金库，其余部分留在程序中，供该游戏的下一期开奖。',
        rent: '彩票账户还会占用一小笔租金押金，在其所属的一期派奖后关闭彩票即可取回。一期的第一张彩票还要支付该期账户的租金，该账户会作为该期的公开记录保留在 Solana 上。在每日和每小时彩票中，每张彩票还要支付其号码在该账户中占用的 4 个字节的租金，这部分不予退还。',
      },
      wallet: {
        title: '你的钱包与交易',
        own: '你用自己的钱包参与。我们从不持有你的私钥、你的 SOL 或你的彩票，也无法转移它们。',
        sign: '每笔交易都由你自己签名，并由你支付 Solana 的网络手续费。已确认的交易是最终的：我们无法取消、撤销或退款。',
        public: '彩票的号码、持有者的地址以及你为它选择的国旗会永久公开在 Solana 上。{privacy}解释了这意味着什么。',
        keys: '请妥善保管你钱包的私钥。包括我们在内，任何人都无法帮你找回。',
      },
      operator: {
        title: '运营方能做什么、不能做什么',
        intro: '程序的配置设有一个管理员，它可以：',
        price: '更改每个游戏的票价（至少 ◎0.002）和平台手续费（最多 20%），自该游戏下一个开放的期起生效；',
        pause: '暂停和恢复彩票销售。暂停只会阻止新的彩票：已经进行的期仍然可以开奖和派奖；',
        other: '更改金库、最大号码以及管理员本身。',
        cannot:
          '程序的代码不允许管理员或其他任何人拿走一期的奖池，或把它发送到中奖彩票的持有者、金库的手续费和该游戏的下一期以外的任何地方，不允许收取超过手续费的金额，也不允许向买家收取超过向其显示的价格。',
        upgrade:
          '该程序可以升级：持有其升级权限的人可以部署不同的代码，因此在程序被设为不可变或移交给多签之前，你是在信任他们。每个版本的源代码都是公开的，已部署的程序可以按照 README 中“Verifiable builds”一节的说明与源代码进行核对。',
      },
      risks: {
        title: '风险',
        intro: '参与即表示你接受：',
        bugs: '软件可能存在漏洞，包括程序、应用和你的钱包，而漏洞可能让你损失彩票或 SOL；',
        network: 'Solana 或本网站使用的 RPC 节点可能缓慢、拥堵或宕机，交易可能失败，或在一期关闭后才到达；',
        draw: '开奖使用的是一个在一期关闭或一批猜测被封存时无人知晓的 Solana 插槽的哈希。玩家无法预测它，但产出该插槽的验证者可能使结果产生偏向，而关闭一期的人可能会压下一次不利的开奖，直到该插槽再也无法读取。它不是可验证随机数预言机；',
        site: '本网站可能随时无法访问。程序以及你的彩票在没有它的情况下仍会继续运作；',
        law: '各国关于彩票和加密资产的法律各不相同，并且可能发生变化。',
      },
      use: {
        title: '公平使用本网站',
        body: '不要攻击本网站或其服务器、使其过载、试图绕过其限制、干扰其他玩家，或利用本网站违法。我们可能会封禁任何这样做的人的访问。',
      },
      liability: {
        title: '不提供担保',
        body: '本网站和程序按“原样”提供，不附带任何担保。在法律允许的范围内，对于因使用它们而产生的任何损失，我们概不负责，包括丢失的彩票、失败或延迟的交易、漏洞、网络问题，或你认为不公平的开奖。本条款中的任何内容均不限制法律不允许我们限制的责任。',
      },
      openSource: {
        title: '开源',
        body: '程序、应用和运营脚本均依据 MIT 许可证开源：参见{repository}。该许可证适用于代码；本条款适用于本网站的使用。',
      },
      changes: {
        title: '变更',
        body: '我们可能会更新本条款。顶部的日期显示最后一次变更，此处显示的版本自该日期起适用。',
      },
      contact: {
        title: '联系方式',
        body: '关于本条款的问题：{email}。',
      },
    },

    privacy: {
      description: '哪些信息在 Solana 上公开、我们的服务器能看到什么，以及我们从不收集什么。',
      summary: {
        title: '简而言之',
        account: '没有账号、邮箱或注册。你用钱包参与。',
        cookies: '本网站不设置 Cookie，也不加载任何分析工具、广告或追踪器。',
        database: '我们不保存玩家数据库，也不出售或分享关于你的数据。',
        public: '你的彩票在 Solana 上是公开的，这是有意的设计：正因如此，任何人都能查验这个游戏。',
        controller: '{operator} 运营本网站，并对其处理的数据负责。',
      },
      onChain: {
        title: '哪些信息在 Solana 上公开',
        intro: '当你购买彩票时，交易和彩票的账户会公开记录：',
        address: '你的钱包地址，以及它签名的交易；',
        number: '你选的号码、所属的期和购买时间；',
        flag: '你为彩票选择的国旗，如果你设为不公开则没有。',
        ledger:
          '一期开奖后，其账户还会记录中奖者的地址、中奖号码及其国旗，以及派奖金额。Solana 是公开账本：任何人都能读取这些数据，许多人保存着它的副本，而且它会永久保留。关闭彩票会删除其账户并退还租金，但创建和关闭它的交易仍保留在账本中。我们和其他任何人都无法更改或删除它。',
        link: '钱包地址不是你的名字，但它可能与你关联起来，例如通过你使用过的交易所。如果你想让游戏与你的其他活动分开，请使用单独的钱包。',
      },
      servers: {
        title: '我们的服务器能看到什么',
        visit: '每次访问',
        visitBody:
          '本网站托管在 Cloudflare 上。和任何网站一样，它会接收你的 IP 地址、浏览器的用户代理以及你请求的页面，用于传送这些页面并保护网站免遭滥用。Cloudflare 会根据其{policy}在有限时间内保留运营日志。我们仅将这些日志用于运行和修复网站。',
        policy: '自身的隐私政策',
        country: '你的国家',
        countryBody:
          'Cloudflare 会告诉我们的服务器每个请求来自哪个国家。应用会询问一次，用于为你的彩票推荐国旗；你可以在购买前更改它或设为不公开。服务器只读取国家，不读取你的 IP 地址，也不保存它。',
        live: '游戏页面上的实时牌桌',
        liveBody:
          '在游戏页面打开期间，你的浏览器会与我们的服务器保持连接，以便玩家能看到还有谁在场。它会与页面上的其他人分享三样东西：一个仅用于该连接的随机 ID、你的彩票显示的国旗（如果你将国家设为不公开则没有），以及你是否正在输入号码，但绝不包括号码本身。其中不包含任何钱包地址或 IP 地址，关于该连接的任何信息都不会被存储，也不会在连接关闭后保留。',
        price: 'SOL 价格',
        priceBody:
          '为了以美元显示奖池，我们的服务器会从 Coinbase 获取 SOL 价格，如果 Coinbase 没有响应则从 CoinGecko 获取，并缓存一分钟。这些请求由我们的服务器发出，不携带任何关于你的信息。',
        push: '开奖通知',
        pushBody:
          '如果你为某个游戏开启通知，你的浏览器会向我们的服务器提供一个推送订阅：你浏览器的推送服务（根据浏览器不同，由 Google、Mozilla、Apple 或 Microsoft 运营）上的一个地址，以及用于为其加密消息的密钥。我们将它与你的语言和你选择的游戏一起保存，除此之外什么都不保存：没有钱包地址，也没有 IP 地址。当这些游戏中有一期产生赢家时，我们的服务器会通过该推送服务发送加密后的结果，由它按照自己的政策送达你的浏览器。关闭通知会删除该订阅；当推送服务告诉我们订阅已不存在时，我们也会将其删除。',
      },
      thirdParties: {
        title: '你的浏览器使用的服务',
        rpc: '{name}：应用从这里读取游戏数据，并通过它发送你的交易：{endpoint}。它会接收你的 IP 地址和应用查询的账户（连接钱包后也包括你钱包的账户），并适用其运营方的政策。',
        rpcName: '一个 Solana RPC 节点',
        rpcHost: '本网站上的 {host}',
        rpcPublic: 'Solana 为 {cluster} 提供的公共节点',
        wallet:
          '{name}：例如 Phantom、Solflare 或 Backpack，是其开发商提供的软件，有自己的政策。本网站只会请求它连接，以及签署你批准的交易。',
        walletName: '你的钱包',
        links: '{name}：Solana Explorer、Solana 水龙头、GitHub 以及我们的社交账号都是其他网站，有各自的政策。',
        linksName: '你打开的链接',
        own: '字体、音效和图片都来自我们自己的域名，因此加载本网站不会联系其他任何人。',
      },
      browser: {
        title: '保存在你浏览器中的内容',
        body: '应用会在你浏览器的本地存储中保存五项设置：你的主题、你上次使用的钱包、你选择的国家、音效设置和你的语言。{cookies}页面列出了这些设置。',
        cache:
          '为了在没有网络时也能打开，应用还会在你浏览器的缓存存储中保存你访问过的页面及其自身文件的副本。网站的每个新版本都会替换它们。',
      },
      purposes: {
        title: '目的，以及我们绝不做的事',
        body: '我们处理上述数据，仅用于展示本网站、运行你要求参与的游戏、保障网站安全以及修复问题。我们不建立用户画像，不展示广告，不出售数据，也不与广告商分享数据。',
      },
      rights: {
        title: '你的选择与权利',
        flag: '你可以不带国旗参与：在购买前选择设为不公开即可。',
        clear: '你可以随时清除浏览器中的设置，也可以随时使用新钱包。',
        law: '根据你所在的地区，你可能有权访问、更正或删除与你相关的个人数据，或反对其使用方式。请发送邮件至 {email}，我们会回复。我们几乎不持有关于你的任何数据，也无法更改或删除 Solana 上的内容。',
      },
      children: {
        title: '儿童',
        body: 'S☉Lucky 面向 18 岁及以上人士。我们不会在知情的情况下处理任何未满此年龄者的数据。',
      },
      changes: {
        title: '变更与联系方式',
        body: '当本网站处理数据的方式发生变化时，我们会更新本页面；顶部的日期显示最后一次变更。如有问题：{email}。',
      },
    },

    cookies: {
      description: '没有 Cookie，没有追踪器：应用在你的浏览器中保存的五项设置，以及如何删除它们。',
      none: {
        title: '没有 Cookie',
        p1: 'S☉Lucky 不设置 Cookie，也不加载任何分析、广告或追踪脚本。本网站的安全策略只允许来自其自身域名的脚本。',
        p2: '我们的托管服务商 Cloudflare 在开启其机器人防护时，可能会设置严格必要的安全 Cookie，例如 {cookie}。Cloudflare 用它们来区分真人和机器人，详见其 {list}。',
        list: 'Cookie 列表',
      },
      storage: {
        title: '应用在你的浏览器中保存了什么',
        intro:
          '应用会在你浏览器的本地存储中保存几项设置，以便下次仍然可用。它们保留在你的设备上，只有一个例外：你选择的国旗会显示在你购买的彩票上，并在你停留在游戏页面时显示在实时牌桌上。',
        key: '键名',
        holds: '保存内容',
        saved: '保存时机',
        wallet: '你的钱包扩展程序会按照其开发商的政策保存自己的数据。',
        cache:
          '为了在没有网络时也能打开，应用还会在你浏览器的缓存存储中保存你访问过的页面及其自身文件的副本，网站的每个新版本都会替换它们。如果你开启开奖通知，你的浏览器还会保存推送订阅，直到你关闭通知。清除此网站的数据会将这些全部删除。',
      },
      keys: {
        theme: {
          holds: '你的浅色或深色主题。',
          when: '当你切换主题时。',
        },
        wallet: {
          holds: '你上次连接的钱包名称及其地址，以便应用重新连接它。',
          when: '当你连接钱包时；断开连接时删除。',
        },
        country: {
          holds: '你为彩票选择的国旗，或你选择不公开。',
          when: '当你选择国旗时。',
        },
        sound: {
          holds: '音效是开启还是关闭。',
          when: '当你开启或关闭音效时。',
        },
        lang: {
          holds: '你选择的语言，这样应用就不会再向你推荐其他语言。',
          when: '当你选择语言，或回应以你的语言阅读本网站的提示时。',
        },
      },
      clear: {
        title: '如何删除',
        disconnect: '在应用中断开钱包连接，即可删除 {key}。',
        site: '在浏览器设置中清除本网站的数据，即可全部删除。',
        private: '在无痕窗口中，关闭窗口时它们就会被删除。',
        reset: '删除它们只会重置这些设置；你的彩票在 Solana 上，仍然归你所有。',
      },
      banner: {
        title: '为什么没有 Cookie 横幅',
        body: '这里没有任何东西会追踪你，上面的每项设置都是因为你自己设置才存在的。所以没有什么需要接受或拒绝。',
      },
    },

    play: {
      description: '中奖概率如何运作，以及如果游戏不再有趣，可以去哪里寻求帮助。',
      basics: {
        title: '参与之前',
        age: 'S☉Lucky 面向 18 岁及以上、且所在地彩票合法的人士。',
        test: '本网站运行在 Solana {cluster} 上：彩票以测试 SOL 支付，测试 SOL 免费且没有价值。这是不花任何钱就能了解游戏运作方式的好办法。',
        real: '本网站运行在 Solana Mainnet 上：彩票以真实 SOL 支付。',
        fun: '只为娱乐而玩，绝不是为了赚钱或赢回输掉的钱。',
      },
      odds: {
        title: '了解中奖概率',
        same: '在每日和每小时彩票中，离随机号码最近的彩票中奖：你的概率是号码范围中离你的号码比离其他任何人的号码更近的那部分所占的比例。在“猜数字”中，每次检查找到号码的概率，等于新猜测数除以尚未尝试的号码数。',
        label: '没有哪个号码比别的号码更幸运：开出的号码是范围内任何一个号码的可能性都相同。',
        fee: '中奖者获得奖池的 80%。平台手续费（程序将其上限定为 20%）从剩余部分中扣除，余下的转入该游戏的下一期。因此，从所有玩家整体来看，彩票返还的是购票所花的钱减去这笔手续费：平均而言，一张彩票的回报低于它的成本。',
        nothing: '本网站上没有任何东西会改变这些概率。',
      },
      final: {
        title: '彩票一经购买即为最终',
        body: '彩票一经购买，便无法取消或退款。你唯一能取回的是它的小额租金押金，方法是在其所属的一期派奖后关闭彩票。',
      },
      habits: {
        title: '让它保持有趣',
        budget: '事先决定你准备输掉多少，输完就停。',
        chase: '绝不追逐损失，也绝不用借来的钱或你需要的钱参与。',
        mood: '心情不好、疲惫或喝了酒时，不要参与。',
        breaks: '适时休息，让游戏只是你生活众多部分中的一部分。',
      },
      limits: {
        title: '设定你自己的限制',
        intro: 'S☉Lucky 没有账号，因此无法为你设定限制或将你排除在外。你可以自己设定：',
        wallet: '使用一个单独的钱包，只存放你准备花掉的金额。',
        block: '使用网站拦截工具或设备的家长控制功能来屏蔽本网站。',
        trust: '告诉一个你信任的人，并请对方帮助你坚守自己的限制。',
      },
      help: {
        title: '寻求帮助',
        intro:
          '如果游戏已经不再有趣，或者你身边的人对此感到担忧，以下独立机构提供免费且保密的帮助。我们与它们没有关联。',
        worldwide: '全球：按国家列出的聚会与联系方式。',
        us: '美国。',
        uk: '英国。',
        emergency: '如果你或他人正处于紧急危险中，请拨打当地的紧急电话。',
      },
    },
  },
};

export default zhcn;
