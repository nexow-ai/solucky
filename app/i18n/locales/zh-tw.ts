/** Chinese (Traditional, Taiwan): translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const zhtw: Dict = {
  meta: {
    title: 'S☉Lucky：Solana 上的每日彩券',
    description:
      '選一個號碼，買一張彩券，在 UTC 午夜贏走整個獎池。每一張彩券、每一個獎池、每一次開獎都在 Solana 上，任何人都能查證。',
    ogImageAlt: 'S☉Lucky，Solana 上的每日彩券',
  },

  nav: {
    play: '遊玩',
    how: '運作方式',
    fairness: '公平性',
    faq: '常見問題',
  },

  lang: {
    label: '語言',
    choose: '語言：{name}',
  },

  header: {
    beta: '測試版',
    getSol: '取得 SOL',
    faucetTip: '測試版臨時水龍頭：免費取得測試 SOL 來玩',
    mute: '關閉音效',
    unmute: '開啟音效',
  },

  faucet: {
    connectFirst: '請先連接錢包',
    connectFirstHint: '然後輕觸「取得 SOL」，為錢包儲值測試 SOL。',
    request: '在水龍頭申請測試 SOL',
    requestHint: '你的錢包地址已複製。如果欄位是空的，請貼上，然後確認。',
    openAgain: '再次開啟',
    airdropped: '已空投 ◎1',
    airdroppedHint: '測試 SOL 已在 {cluster} 上入帳。現在可以買彩券了。',
    failed: '空投失敗',
    slow: '空投已被接受，但餘額尚未更新。請稍後重新整理。',
  },

  footer: {
    license: 'MIT 授權條款',
    program: '{cluster} 上的程式 {address}。',
    age: '僅限年滿 18 歲者。只為娛樂而玩，而且只在彩券合法的地方玩。',
    legal: '法律資訊',
    languages: '語言',
    source: '原始碼',
    builtOn: '基於 {solana} 打造',
    madeBy: '由 {nexow} 打造',
  },

  home: {
    kicker: 'Solana 上的每日彩券',
    title: '選一個號碼。',
    titleEnd: '午夜贏走獎池。',
    lead: '每天開獎一次，一位贏家，獨得整個獎池。每一張彩券、每一個 lamport、每一次開獎都在 Solana 上，任何人都能查證。',
    playNow: '立即開玩',
    howItWorks: '運作方式',
    program: '程式',
    cluster: '叢集',
    draw: '開獎',
    dialCaption: '每個點代表今天的一張彩券：繞錶盤一圈的位置代表購買時間，往外的距離代表它的號碼。',

    how: {
      tag: '運作方式',
      title: '四個步驟，每天開獎一次',
      description: '每期依 UTC 日曆進行：新的一期在 UTC 00:00 開放，並在下一個午夜過後立即開獎。',
      opens: '本期開始',
      draw: '開獎',
      now: '現在',
      steps: {
        wallet: {
          title: '連接錢包',
          description: 'Phantom、Solflare、Backpack，或任何支援 Wallet Standard 的錢包。不需要帳號，也不需要電子郵件。',
          when: '隨時',
        },
        number: {
          title: '選擇你的號碼',
          description: '0 到 {max} 之間的任何號碼。每個號碼每天只能由一張彩券持有，所以動作要快。',
          when: '直到 UTC 午夜',
        },
        pot: {
          title: '看著獎池變大',
          description: '每張彩券都會把票價加進獎池，獎池由該期在 Solana 上的專屬帳戶持有。其他任何人都動不了它。',
          when: '全天',
        },
        win: {
          title: '在 UTC 午夜贏得獎池',
          description: '一張彩券贏走整個獎池，扣除一小筆平台手續費。彩券越多，機率越高：每張彩券只算一次。',
          when: 'UTC 午夜過後立即',
        },
      },
    },

    fairness: {
      tag: '公平性',
      title: '別相信我們，自己查證。',
      description: 'S☉Lucky 是一個 Solana 程式，而不是替你保管資金的伺服器。以下規則由它的程式碼強制執行。',
      rules: {
        locked: {
          title: '獎池鎖在程式裡',
          description:
            '購買彩券的款項直接進入該期的帳戶。程式只會把它支付給中獎彩券的持有者，並把手續費支付給金庫。營運方無法提領。',
        },
        draw: {
          title: '沒有人能預測的開獎',
          description:
            '每一筆購買都會混入該期的熵。當天結束時，該期會鎖定一個幾秒後才會出現的插槽；這個插槽的雜湊值在那之前沒有人知道，由它選出贏家。',
        },
        anyone: {
          title: '任何人都能執行',
          description: '關閉、開獎和派彩對所有人開放。就算營運方明天消失，任何玩家仍然可以完成每一期。',
        },
        browser: {
          title: '在瀏覽器中就能查證',
          description: '每一期的頁面都會用公開資料重新計算開獎：熵、插槽雜湊值和中獎索引。輸入相同，贏家就相同。',
        },
        limits: {
          title: '對平台的硬性限制',
          description:
            '程式將手續費上限設為 10%。票價和手續費的變更只會套用到隔天的那一期，而且買家支付的金額絕不會超過畫面上顯示給他的價格。',
        },
        open: {
          title: '開源',
          description: '程式、應用程式和營運腳本全部公開，每條規則都有測試。',
        },
      },
    },

    faq: {
      tag: '常見問題',
      title: '問題',
      description: '還有疑問嗎？程式、應用程式和營運腳本都是開源的。',
      readCode: '閱讀程式碼',
      items: {
        real: {
          q: '這是真錢嗎？',
          a: '公開的應用程式在 Solana devnet 上運作，那裡的 SOL 是來自 faucet.solana.com 的免費測試幣。程式在 mainnet 上的運作方式相同，但經營真錢彩券需要在營運所在地取得相應的執照。',
        },
        price: {
          q: '一張彩券多少錢？',
          a: '票價設定在鏈上，並顯示在遊玩頁面。除了票價，彩券帳戶還會占用一小筆租金押金，在該期派彩後關閉彩券即可取回。當天的第一張彩券還要支付該期帳戶的租金，這個帳戶會作為該期的公開紀錄保留在鏈上。',
        },
        odds: {
          q: '我的中獎機率怎麼算？',
          a: '每張彩券的機率都相同：你的彩券數除以當天售出的所有彩券數。你選的號碼只是你在號碼板上的標籤，不會改變你的中獎機率。',
        },
        draw: {
          q: '如果沒有人開獎怎麼辦？',
          a: '一個小型機器人（crank）會在午夜後幾秒內關閉、開獎並派彩每一期，任何人也都可以在「歷史」面板中做同樣的事。如果鎖定的插槽變得太舊而無法讀取（大約三分鐘），可以再次關閉該期，以鎖定一個新的插槽；程式只有在舊插槽可被證明已無法讀取時，才允許這樣做。',
        },
        country: {
          q: '為什麼要顯示我的國家？',
          a: 'S☉Lucky 一直都會在每張彩券旁顯示一面國旗。我們根據你與我們主機之間的連線建議你的國家，不透過任何第三方查詢，而且你可以在購買前更改或設為不公開。它會和你的彩券一起儲存在鏈上。',
        },
        validator: {
          q: '驗證者能在開獎時作弊嗎？',
          a: '玩家不能：停止銷售時，中獎雜湊值還不存在。產生鎖定插槽的驗證者可能讓結果產生偏差，方法是選擇該區塊要放入哪些內容，或略過該區塊。對測試幣遊戲來說，這是可以接受的；若是真錢獎池，開獎應該使用可驗證的隨機數預言機，README 說明了要在哪裡接上。',
        },
      },
    },

    cta: {
      title: '今天的獎池在等你',
      description: '選一個還沒有人選的號碼。祝你好運！',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: '每天開獎一次 · UTC 午夜後開獎 · 每張彩券都在 Solana 上',
    draw: '開獎',
    pot: '今日獎池',
    toDraw: '距離開獎 · {day}',
    tickets: '今天 {n} 張彩券',
    entropy: '熵 · {cluster}',
    entropyTitle: '熵：{hex}',
    noTickets: '還沒有彩券',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: '新彩券',
    rules: {
      daily: '每天 UTC 00:00 開始新的一期',
      pot: '一張彩券贏走獎池',
      numbers: '號碼從 0 到 {max}',
      fee: '程式將平台手續費上限設為 10%',
      anyone: '任何人都能關閉一期、開獎並派彩',
      check: '在你的瀏覽器中重新計算每一次開獎',
      open: '開源',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: '開獎收據',
    round: '期別',
    noneYet: '尚無已結算的一期',
    tickets: '彩券數',
    pot: '獎池',
    entropy: '熵',
    slotHash: '插槽雜湊值 · 插槽 {slot}',
    formula: 'sha256(熵 ‖ 插槽雜湊值 ‖ 插槽 ‖ 期) =',
    mod: '前 8 個位元組作為 u64 mod {count} = {ticket}',
    ticketCount: '彩券數',
    ticket: '彩券 #{index}',
    number: '號碼',
    paidTo: '支付給',
    payout: '派彩金額',
    check: '查證這次開獎',
    roundPage: '該期頁面',
    nextDraw: '下次開獎在 UTC 00:00 之後',
    ok: '已在你的瀏覽器中重新計算：雜湊值相同，彩券 #{index} 中獎。',
    mismatch: '在你的瀏覽器中重新計算的雜湊值與這一期不符。',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: '彩券數',
    players: '玩家',
    countries: '國家',
    ticket: '票價',
    yourTickets: '你的彩券',
    winChance: '中獎機率',
    chance: '機率',
    todaysPot: '今日獎池',
    winners: '中獎者',
    averagePot: '平均獎池',
    biggestPot: '最大獎池',
  },

  countdown: {
    h: '時',
    m: '分',
    s: '秒',
    left: '剩餘 {time}',
  },

  play: {
    title: '遊玩',
    description: '選好今天的號碼，在 Solana 上即時看著獎池變大。',
    testMoney: '你正在 Solana {cluster} 上遊玩：彩券以測試 SOL 支付，沒有實際價值。',
    localFunds: '將你的錢包指向 {url}，然後用以下指令為它儲值：{command}',
    phantomFunds:
      '在 Phantom 中：Settings → Developer Settings → 開啟 Testnet Mode → 選擇 {cluster}。然後從水龍頭取得免費的測試 SOL。',
    openFaucet: '開啟水龍頭',
    retry: '重試',
    rpcError: '無法連上 Solana RPC 節點（{reason}）',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: '選一個',
    title: '號碼',
    win: '贏得',
    in: '倒數',
    taken: '今天已被選走',
    range: '0 到 {max}，每個號碼一張彩券',
    pad: '數字鍵盤',
    reset: '重設',
    delete: '刪除最後一位數字',
    dip: '電腦選號',
    searchCountry: '搜尋國家',
    country: '與你的彩券一起顯示的國家',
    notSetUp: '這個叢集上還沒有設定彩券。',
    paused: '彩券銷售已暫停。',
    buy: '以 ◎{price} 購買 {number}',
    takenToday: '{number} 今天已被選走',
    outOfRange: '號碼超出範圍',
    notEnough: 'SOL 不足',
    keys: '按 0–9 輸入，⌫ 刪除，Enter 購買。',
    rent: '每張彩券還會占用 ◎{rent} 的帳戶租金，開獎後可以取回。',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    kicker: '今日',
    title: 'SOLPOT',
    closesIn: '{day} · 截止倒數',
    inPlay: '已選號碼',
    empty: '還沒有彩券',
    beFirst: '成為今天第一個選號的人。',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: '歷史',
    total: '共',
    games: '期',
    waiting: '等待開獎',
    settle: '結算',
    settleDay: '結算 {day}',
    anyone: '任何人都能對已結束的一期執行關閉、開獎和派彩。只需支付網路手續費；獎金一定歸中獎者所有。',
    rent: '{n} 張舊彩券占用了 ◎{sol} 的租金',
    rentHint: '關閉它們即可取回這些 SOL。該期會保留其結果。',
    getBack: '取回',
    winners: '中獎者',
    noWinners: '還沒有中獎者',
    firstDraw: '第一次開獎在 UTC 午夜。',
    chart: '每日獎池',
    chartEmpty: '還沒有已結束的一期。',
    chartLabel: '最近 {n} 期的獎池；下方列表列出了每一個數值。',
  },

  status: {
    open: '開放中',
    toClose: '等待關閉',
    toDraw: '等待開獎',
    unpaid: '已開獎，未派彩',
    paid: '已派彩',
  },

  /** The strip across the top of the play page. */
  live: {
    live: '即時',
    connecting: '連線中',
    offline: '離線',
    atTable: '牌桌上 {n} 人',
    picking: '{n} 人正在選號',
    you: '你',
    joined: '加入',
    now: '剛剛',
    empty: '牌桌已開放。下一張彩券一上鏈，就會立刻顯示在這裡。',
    joinedOne: '一位新玩家加入了牌桌',
    joinedMany: '{n} 位新玩家加入了牌桌',
    hereNow: '目前 {n} 人在場',
    locked: '{who} 選定了 {number}',
    potNow: '獎池目前為 ◎{pot}，共 {n} 張彩券',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: '請在錢包中確認…',
    done: '{label}：完成',
    cancelled: '{label}：已取消',
    failed: '{label}：失敗',
    view: '查看交易',
    buying: '購買號碼 {number}',
    bought: '號碼 {number} 是你的了。祝你好運！',
    repin: '為 {day} 期重新鎖定開獎插槽',
    closing: '關閉 {day} 期',
    drawing: '{day} 期開獎',
    paying: '派彩給 {day} 期中獎者',
    paid: '已派彩 ◎{amount} 給 {day} 期中獎者',
    settleFailed: '無法結算 {day} 期',
    reclaiming: '退還彩券租金',
    slowSlot: '叢集到達開獎插槽的速度較慢。請一分鐘後再試。',
    noWinner: '找不到中獎彩券。',
  },

  wallet: {
    connect: '連接錢包',
    title: '連接錢包',
    description: '任何支援 Wallet Standard 的 Solana 錢包都能使用。',
    none: '在這個瀏覽器中找不到 Solana 錢包。請安裝一個，然後重新載入頁面：',
    failed: '無法連接 {wallet}',
    copied: '已複製地址',
    balance: '餘額',
    ticketsLeft: '還夠買 {n} 張彩券',
    needMore: '需要更多 SOL 才能玩',
    numbers: '你今天的號碼',
    copy: '複製地址',
    explorer: '區塊鏈瀏覽器',
    play: '遊玩',
    disconnect: '中斷連線',
  },

  round: {
    title: '{day} 期',
    back: '返回遊戲',
    notDate: '這不是日期。每一期以 YYYY-MM-DD 命名。',
    kicker: '期別',
    nobody: '這一天沒有人玩',
    beFirst: '成為今天第一個買彩券的人。',
    onlyExists: '一期只有在第一張彩券售出後才會存在。',
    pot: '獎池',
    usd: '以今日價格計為 {usd}',
    winner: '中獎者',
    won: '贏得 ◎{payout} · 手續費 ◎{fee}',
    unpaid: '尚未派彩',
    anyone: '任何人都能完成這一期。只需支付網路手續費。',
    settle: '結算這一期',
    sold: '已售出彩券',
    price: '票價',
    fee: '平台手續費',
    slot: '鎖定的插槽',
    check: '查證開獎',
    formula: '隨機數 = sha256(熵 ‖ 插槽雜湊值 ‖ 開獎插槽 ‖ 該期地址)',
    recompute: '在我的瀏覽器中重新計算',
    entropy: '熵（每一筆購買，依序雜湊）',
    slotHash: '插槽 {slot} 的雜湊值（由程式從 SlotHashes 系統變數讀取）',
    randomness: '隨機數',
    winning: '中獎彩券',
    winningFormula: '前 8 個位元組作為 u64 mod {count} = 購買 #{index}',
    ok: '開獎結果查證無誤。',
    mismatch: '不符：儲存的結果與輸入不一致。',
    got: '你的瀏覽器算出了 {hash}… 和彩券 #{index}。',
    tickets: '彩券',
    ticketsHint: '派彩後被持有者關閉的彩券不會再顯示在這裡；該期仍保留總數。',
    noTickets: '這一期已沒有未關閉的彩券。',
    account: '該期帳戶 {address} · {day}',
  },

  country: {
    private: '不公開',
  },

  errors: {
    rejected: '你在錢包中取消了請求。',
    taken: '今天已有人持有這個號碼。請另選一個。',
    funds: '錢包中的 SOL 不足。',
    walletCluster:
      '你的錢包無法簽署。在 Phantom 中：Settings → Developer Settings → 開啟 Testnet Mode → 選擇 Devnet，然後重新連接並再試一次。',
    unknown: '發生錯誤。',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: '只有管理員才能執行此操作。',
      invalidTicketPrice: '票價至少必須為 0.001 SOL。',
      feeTooHigh: '手續費超過 10% 的上限。',
      invalidMaxNumber: '最大號碼必須大於零。',
      paused: '彩券銷售已暫停。',
      wrongDay: '只能購買當天這一期的彩券。',
      numberOutOfRange: '號碼超出範圍。',
      invalidCountry: '國家必須是大寫的 ISO 3166-1 alpha-2 代碼。',
      roundNotOpen: '該期未開放。',
      roundNotOver: '該期尚未結束。',
      roundAlreadyDrawn: '該期已經開過獎。',
      drawStillPossible: '鎖定的插槽仍可用於開獎。',
      roundNotClosed: '該期尚未關閉。',
      targetSlotNotReached: '尚未到達鎖定的插槽。',
      randomnessUnavailable: '鎖定插槽的雜湊值目前還無法讀取；請稍後再試，或在它過期後再次關閉該期。',
      roundNotDrawn: '該期尚未開獎。',
      notWinningTicket: '這不是中獎彩券。',
      roundNotSettled: '該期尚未結算。',
      overflow: '算術溢位。',
      priceChanged: '票價高於你接受的價格。',
      feeAlreadyCollected: '該期的手續費已經收取。',
    },
  },

  legal: {
    kicker: '法律資訊',
    updated: '最後更新：{date}',
    onThisPage: '本頁內容',
    others: '其他法律文件',
    translated: '本頁為英文原文的翻譯。如兩者有所出入，以英文版本為準。',
    readEnglish: '閱讀英文版',
    repository: '原始碼儲存庫',

    pages: {
      notice: {
        label: '法律聲明',
        description: '誰在經營 S☉Lucky、如何聯絡我們，以及適用的文件。',
      },
      terms: {
        label: '服務條款',
        description: '使用本網站和遊玩的規則，以及程式承諾什麼、不承諾什麼。',
      },
      privacy: {
        label: '隱私權政策',
        description: '哪些資訊在 Solana 上公開、我們的伺服器會看到什麼，以及我們絕不蒐集什麼。',
      },
      cookies: {
        label: 'Cookie 與儲存',
        description: '沒有 Cookie，沒有追蹤器：應用程式在你的瀏覽器中保存的五項設定。',
      },
      play: {
        label: '理性遊玩',
        description: '中獎機率如何運作，以及當遊玩不再有趣時，可以去哪裡尋求協助。',
      },
    },

    notice: {
      description: '誰在經營 S☉Lucky、如何聯絡我們，以及你使用時適用的文件。',
      operator: {
        title: '誰在經營 S☉Lucky',
        body: 'S☉Lucky 由 {operator} 打造並經營。你可以寫信至 {email} 與我們聯絡，並在 {site} 進一步認識我們。',
      },
      software: {
        title: '程式與網站',
        intro: 'S☉Lucky 由兩個部分組成：',
        program:
          '{name}：一個 Solana 程式，負責銷售彩券、持有每天的獎池並支付給中獎者。本網站使用 Solana {cluster} 上位於 {address} 的程式。任何人都可以不透過本網站直接使用它。',
        programName: '程式',
        site: '{name}：顯示程式的公開資料，並協助你從自己的錢包送出交易。它從不持有你的私鑰或你的 SOL。',
        siteName: '本網站',
      },
      documents: {
        title: '文件',
        intro: '使用本網站即表示接受以下文件：',
      },
      security: {
        title: '回報安全性問題',
        body: '請不要開公開的 issue。請寄信至 {email}，主旨為 {subject}，並且絕對不要拿其他玩家的資金做測試：請使用 devnet 或本機驗證者。安全性政策（{repository}中的 {file}）說明了回報應包含哪些內容，以及哪些問題屬於範圍內。',
      },
      license: {
        title: '開源授權條款',
        body: '程式、應用程式和營運腳本皆依 MIT 授權條款開源（見{repository}中的 {file}），© {years} {operator}。授權條款涵蓋程式碼；{terms}涵蓋本網站的使用。',
      },
    },

    terms: {
      description: '使用 S☉Lucky 的規則，以及其程式承諾什麼、不承諾什麼。',
      agreement: {
        title: '本條款',
        p1: '當你使用由 {operator}（「我們」）經營的 S☉Lucky 網站和應用程式時，適用本條款。使用即表示你接受本條款，以及{privacy}和 {cookies}頁面。如果你不接受，請不要使用本網站。',
        p2: '遊戲本身是一個 Solana 程式：在 Solana 網路上執行的開源軟體，而不是在我們的伺服器上執行。本網站是使用它的一種方式；任何人也都可以直接使用該程式。',
      },
      eligibility: {
        title: '誰可以遊玩',
        age: '你必須年滿 18 歲。',
        legal: '你只能在彩券和線上博弈遊戲對你而言合法的地方遊玩。確認這一點是你的責任；我們不會確認你身在何處。',
        own: '不要代替他人遊玩，也不要使用不屬於你的 SOL 遊玩。',
      },
      money: {
        title: '測試 SOL 與真實 SOL',
        test: '本網站在 {cluster} 上運作。彩券以測試 SOL 支付，測試 SOL 可從水龍頭免費取得，沒有任何價值：它不能兌換成真錢，你用它贏得的任何東西也不能。',
        real: '本網站在 {cluster} 上運作。彩券以真實 SOL 支付，獎池也以真實 SOL 派彩。',
      },
      rounds: {
        title: '一期如何進行',
        intro: '以下規則由程式強制執行；本網站只是顯示它們：',
        day: '每個 UTC 日進行一期，從 UTC 00:00 到下一個午夜。',
        number: '一張彩券就是一個號碼，範圍從 0 到程式設定中的最大號碼。每個號碼在每一期只能由一張彩券持有。',
        price:
          '票價和平台手續費會在一期開放時從設定中複製，並在該期內保持不變。手續費絕不能超過獎池的 10%。購買時，你支付的金額絕不會超過畫面上顯示給你的價格。',
        pot: '每張彩券的票價都會進入該期的獎池，由該期在 Solana 上的專屬帳戶持有。每張彩券的機率相同：你的機率等於你的彩券數除以該期售出的所有彩券數。你選的號碼不會改變它。',
        draw: '午夜過後，任何人都可以關閉該期、開獎並派彩。中獎彩券的持有者會獲得扣除平台手續費後的獎池，手續費則進入金庫。',
        rent: '彩券帳戶還會占用一小筆租金押金，在其所屬的一期派彩後關閉彩券即可取回。一期的第一張彩券還要支付該期帳戶的租金，這個帳戶會作為該期的公開紀錄保留在 Solana 上。',
      },
      wallet: {
        title: '你的錢包與交易',
        own: '你用自己的錢包遊玩。我們從不持有你的私鑰、你的 SOL 或你的彩券，也無法移動它們。',
        sign: '每筆交易都由你親自簽署，並由你支付 Solana 的網路手續費。已確認的交易即為最終結果：我們無法取消、撤銷或退款。',
        public: '彩券的號碼、持有者的地址，以及你為它選擇的國旗，都會永久公開在 Solana 上。{privacy}說明了這代表什麼。',
        keys: '請妥善保管你錢包的私鑰。包括我們在內，沒有人能幫你找回。',
      },
      operator: {
        title: '營運方能做什麼、不能做什麼',
        intro: '程式的設定有一位管理員，可以：',
        price: '變更票價（至少 ◎0.001）和平台手續費（最多 10%），自下一個開放的期起生效；',
        pause: '暫停和恢復彩券銷售。暫停只會阻止新的彩券：已經進行的期仍然可以開獎和派彩；',
        other: '變更金庫、最大號碼，以及管理員本身。',
        cannot:
          '程式的程式碼不允許管理員或其他任何人拿走一期的獎池，或將它送到中獎彩券持有者以外的任何地方，不允許收取超過手續費的金額，也不允許向買家收取超過畫面上顯示給他們的價格。',
        upgrade:
          '本程式可以升級：持有其升級權限的人可以部署不同的程式碼，因此在程式被設為不可變更或移交給多重簽名帳戶之前，你等於是在信任他們。每個版本的原始碼都是公開的，已部署的程式可以依照 README 中「Verifiable builds」一節的說明與原始碼進行比對。',
      },
      risks: {
        title: '風險',
        intro: '遊玩即表示你接受：',
        bugs: '軟體可能有程式錯誤，包括程式、應用程式和你的錢包，而程式錯誤可能讓你損失彩券或 SOL；',
        network: 'Solana 或本網站使用的 RPC 節點可能緩慢、壅塞或當機，交易可能失敗，或在一期關閉後才送達；',
        draw: '開獎使用的是一個在停止銷售時沒有人知道的 Solana 插槽的雜湊值。玩家無法預測它，但產生該插槽的驗證者可能讓結果產生偏差，而關閉一期的人可能會壓著一次不利的開獎不執行，直到該插槽再也無法讀取。它不是可驗證的隨機數預言機；',
        site: '本網站可能隨時無法使用。程式和你的彩券在沒有它的情況下仍會繼續運作；',
        law: '各國關於彩券和加密資產的法律各不相同，而且可能改變。',
      },
      use: {
        title: '公平使用本網站',
        body: '請勿攻擊本網站或其伺服器、使其超載、試圖規避其限制、干擾其他玩家，或利用本網站從事違法行為。我們可能會封鎖任何這樣做的人的存取。',
      },
      liability: {
        title: '不提供保證',
        body: '本網站和程式按「現狀」提供，不附帶任何保證。在法律允許的範圍內，對於因使用它們而產生的任何損失，我們概不負責，包括遺失的彩券、失敗或延遲的交易、程式錯誤、網路問題，或你認為不公平的開獎。本條款中的任何內容均不限制法律不允許我們限制的責任。',
      },
      openSource: {
        title: '開源',
        body: '程式、應用程式和營運腳本皆依 MIT 授權條款開源：請見{repository}。該授權條款涵蓋程式碼；本條款涵蓋本網站的使用。',
      },
      changes: {
        title: '變更',
        body: '我們可能會更新本條款。頁面頂端的日期顯示最後一次變更，此處顯示的版本自該日期起適用。',
      },
      contact: {
        title: '聯絡方式',
        body: '關於本條款的問題：{email}。',
      },
    },

    privacy: {
      description: '哪些資訊在 Solana 上公開、我們的伺服器會看到什麼，以及我們絕不蒐集什麼。',
      summary: {
        title: '簡而言之',
        account: '沒有帳號、電子郵件或註冊。你用錢包遊玩。',
        cookies: '本網站不設定 Cookie，也不載入任何分析工具、廣告或追蹤器。',
        database: '我們不保存玩家資料庫，也不販售或分享關於你的資料。',
        public: '你的彩券在 Solana 上是公開的，這是刻意的設計：正因如此，任何人都能查證這個遊戲。',
        controller: '{operator} 經營本網站，並對其處理的資料負責。',
      },
      onChain: {
        title: '哪些資訊在 Solana 上公開',
        intro: '當你購買彩券時，交易和彩券的帳戶會公開記錄：',
        address: '你的錢包地址，以及它簽署的交易；',
        number: '你選的號碼、所屬的期和購買時間；',
        flag: '你為彩券選擇的國旗，如果你設為不公開則沒有。',
        ledger:
          '一期開獎後，其帳戶還會記錄中獎者的地址、中獎號碼及其國旗，以及派彩金額。Solana 是公開帳本：任何人都能讀取這些資料，許多人保存著它的副本，而且它會永久留存。關閉彩券會刪除它的帳戶並退還租金，但建立和關閉它的交易仍會保留在帳本中。我們和其他任何人都無法變更或刪除它。',
        link: '錢包地址不是你的姓名，但可能和你產生關聯，例如透過你使用過的交易所。如果你想讓遊玩與你的其他活動分開，請使用另一個錢包。',
      },
      servers: {
        title: '我們的伺服器會看到什麼',
        visit: '每次造訪',
        visitBody:
          '本網站由 Cloudflare 代管。和任何網站一樣，它會收到你的 IP 位址、瀏覽器的使用者代理程式，以及你請求的頁面，用來傳送這些頁面並保護網站免受濫用。Cloudflare 會依照其{policy}，在有限期間內保留營運日誌。我們只將這些日誌用於維持和修復網站。',
        policy: '自身的隱私權政策',
        country: '你的國家',
        countryBody:
          'Cloudflare 會告訴我們的伺服器每個請求來自哪個國家。應用程式會詢問一次，用來為你的彩券建議國旗；你可以在購買前更改或設為不公開。伺服器只讀取國家，不讀取你的 IP 位址，也不會保存。',
        live: '遊玩頁面上的即時牌桌',
        liveBody:
          '遊玩頁面開啟時，你的瀏覽器會與我們的伺服器保持連線，讓玩家能看到還有誰在場。它會與頁面上的其他人分享三件事：一個只用於這次連線的隨機 ID、你的彩券顯示的國旗（如果你將國家設為不公開則沒有），以及你是否正在輸入號碼，但絕不包括號碼本身。其中不含任何錢包地址或 IP 位址，關於這次連線的任何資訊都不會被儲存，也不會在連線關閉後保留。',
        price: 'SOL 價格',
        priceBody:
          '為了以美元顯示獎池，我們的伺服器會從 Coinbase 取得 SOL 價格，如果 Coinbase 沒有回應則改從 CoinGecko 取得，並快取一分鐘。這些請求由我們的伺服器發出，不帶有任何關於你的資訊。',
      },
      thirdParties: {
        title: '你的瀏覽器使用的服務',
        rpc: '{name}：應用程式從這裡讀取遊戲資料，並透過它送出你的交易：{endpoint}。它會收到你的 IP 位址和應用程式查詢的帳戶（連接錢包後也包括你的錢包帳戶），並適用其營運者的政策。',
        rpcName: '一個 Solana RPC 節點',
        rpcHost: '本網站上的 {host}',
        rpcPublic: 'Solana 為 {cluster} 提供的公開節點',
        wallet:
          '{name}：例如 Phantom、Solflare 或 Backpack，是由其開發商提供的軟體，有自己的政策。本網站只會請它連接，以及簽署你核准的交易。',
        walletName: '你的錢包',
        links: '{name}：Solana Explorer、Solana 水龍頭、GitHub 和我們的社群帳號都是其他網站，有各自的政策。',
        linksName: '你開啟的連結',
        own: '字型、音效和圖片都來自我們自己的網域，所以載入本網站不會連線到任何其他人。',
      },
      browser: {
        title: '保存在你瀏覽器中的內容',
        body: '應用程式會在你瀏覽器的本機儲存空間中保存五項設定：你的主題、你上次使用的錢包、你選擇的國家、音效設定和你的語言。{cookies}頁面列出了這些設定。',
      },
      purposes: {
        title: '目的，以及我們絕不做的事',
        body: '我們處理上述資料，只為了顯示本網站、執行你要求遊玩的遊戲、確保網站安全以及修正問題。我們不建立個人檔案、不顯示廣告、不販售資料，也不與廣告商分享資料。',
      },
      rights: {
        title: '你的選擇與權利',
        flag: '你可以不帶國旗遊玩：在購買前選擇設為不公開即可。',
        clear: '你可以隨時清除瀏覽器中的設定，也可以隨時使用新的錢包。',
        law: '視你居住的地區而定，你可能有權存取、更正或刪除與你相關的個人資料，或反對其使用方式。請寄信至 {email}，我們會回覆。我們幾乎不持有任何關於你的資料，也無法變更或刪除 Solana 上的內容。',
      },
      children: {
        title: '兒童',
        body: 'S☉Lucky 適用於 18 歲以上的人士。我們不會在知情的情況下處理任何未滿此年齡者的資料。',
      },
      changes: {
        title: '變更與聯絡方式',
        body: '當本網站處理資料的方式改變時，我們會更新本頁；頁面頂端的日期顯示最後一次變更。如有問題：{email}。',
      },
    },

    cookies: {
      description: '沒有 Cookie，沒有追蹤器：應用程式在你的瀏覽器中保存的五項設定，以及如何移除它們。',
      none: {
        title: '沒有 Cookie',
        p1: 'S☉Lucky 不設定 Cookie，也不載入任何分析、廣告或追蹤腳本。本網站的安全性政策只允許來自自身網域的腳本。',
        p2: '我們的主機服務商 Cloudflare 在開啟其機器人防護時，可能會設定絕對必要的安全性 Cookie，例如 {cookie}。Cloudflare 用它們來分辨真人和機器人，詳見其 {list}。',
        list: 'Cookie 清單',
      },
      storage: {
        title: '應用程式在你的瀏覽器中保存了什麼',
        intro:
          '應用程式會在你瀏覽器的本機儲存空間中保存幾項設定，讓它們下次仍然存在。它們會留在你的裝置上，只有一個例外：你選擇的國旗會出現在你購買的彩券上，並在你停留於遊玩頁面時顯示在即時牌桌上。',
        key: '鍵名',
        holds: '保存內容',
        saved: '保存時機',
        wallet: '你的錢包擴充功能會依照其開發商的政策保存自己的資料。',
      },
      keys: {
        theme: {
          holds: '你的淺色或深色主題。',
          when: '當你切換主題時。',
        },
        wallet: {
          holds: '你上次連接的錢包名稱及其地址，讓應用程式可以重新連接。',
          when: '當你連接錢包時；中斷連線時會移除。',
        },
        country: {
          holds: '你為彩券選擇的國旗，或你選擇不公開。',
          when: '當你選擇國旗時。',
        },
        sound: {
          holds: '音效是開啟還是關閉。',
          when: '當你開啟或關閉音效時。',
        },
        lang: {
          holds: '你選擇的語言，讓應用程式不會再向你推薦其他語言。',
          when: '當你選擇語言，或回應以你的語言閱讀本網站的提示時。',
        },
      },
      clear: {
        title: '移除方式',
        disconnect: '在應用程式中中斷錢包連線，即可移除 {key}。',
        site: '在瀏覽器設定中清除本網站的資料，即可全部移除。',
        private: '在無痕視窗中，關閉視窗時它們就會被刪除。',
        reset: '移除它們只會重設這些設定；你的彩券在 Solana 上，仍然屬於你。',
      },
      banner: {
        title: '為什麼沒有 Cookie 橫幅',
        body: '這裡沒有任何東西會追蹤你，上面的每一項設定都是因為你自己設定才存在。所以沒有什麼需要接受或拒絕。',
      },
    },

    play: {
      description: '中獎機率如何運作，以及當遊玩不再有趣時，可以去哪裡尋求協助。',
      basics: {
        title: '遊玩之前',
        age: 'S☉Lucky 適用於 18 歲以上、且所在地彩券合法的人士。',
        test: '本網站在 Solana {cluster} 上運作：彩券以測試 SOL 支付，測試 SOL 免費且沒有價值。這是不花任何錢就能了解遊戲運作方式的好方法。',
        real: '本網站在 Solana Mainnet 上運作：彩券以真實 SOL 支付。',
        fun: '只為娛樂而玩，絕不是為了賺錢或贏回輸掉的錢。',
      },
      odds: {
        title: '了解中獎機率',
        same: '每張彩券的機率都相同。你贏得一期的機率，等於你的彩券數除以該期售出的所有彩券數。',
        label: '你選的號碼是你在號碼板上的標籤。它不會改變你的機率。',
        fee: '中獎者會獲得扣除平台手續費後的獎池，而程式將手續費上限設為 10%。因此，就所有玩家整體來看，彩券退還的是購買彩券所花的錢減去這筆手續費：平均而言，一張彩券的回報低於它的成本。',
        nothing: '本網站上沒有任何東西會改變這些機率。',
      },
      final: {
        title: '彩券一經購買即為最終',
        body: '彩券一經購買，便無法取消或退款。你唯一能取回的是它的小額租金押金，方法是在其所屬的一期派彩後關閉彩券。',
      },
      habits: {
        title: '保持樂趣',
        budget: '事先決定你準備輸掉多少，輸完就停。',
        chase: '絕不追逐損失，也絕不用借來的錢或你需要的錢遊玩。',
        mood: '心情不好、疲倦或喝了酒時，不要遊玩。',
        breaks: '適時休息，讓遊玩只是你生活眾多部分中的一部分。',
      },
      limits: {
        title: '設定你自己的限制',
        intro: 'S☉Lucky 沒有帳號，因此無法為你設定限制或將你排除。你可以自己設定：',
        wallet: '使用另一個錢包，只存放你準備花掉的金額。',
        block: '使用網站封鎖工具或裝置的家長監護功能來封鎖本網站。',
        trust: '告訴一位你信任的人，並請對方幫助你遵守自己的限制。',
      },
      help: {
        title: '尋求協助',
        intro:
          '如果遊玩已經不再有趣，或你身邊的人對此感到擔心，以下獨立機構提供免費且保密的協助。我們與它們沒有隸屬關係。',
        worldwide: '全球：依國家列出的聚會與聯絡方式。',
        us: '美國。',
        uk: '英國。',
        emergency: '如果你或他人正處於立即的危險中，請撥打當地的緊急電話。',
      },
    },
  },
};

export default zhtw;
