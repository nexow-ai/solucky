/** Vietnamese: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const vi: Dict = {
  meta: {
    title: 'S☉Lucky: các trò chơi xổ số trên Solana',
    description:
      'Chọn một con số trong xổ số hằng ngày hoặc hằng giờ, hoặc truy tìm con số ẩn. Người thắng nhận 80% quỹ thưởng. Mọi vé, quỹ thưởng và lượt quay số đều nằm trên Solana và ai cũng có thể kiểm tra.',
    ogImageAlt: 'S☉Lucky, các trò chơi xổ số trên Solana',
  },

  nav: {
    play: 'Chơi',
    how: 'Cách hoạt động',
    fairness: 'Công bằng',
    faq: 'Hỏi đáp',
  },

  lang: {
    label: 'Ngôn ngữ',
    choose: 'Ngôn ngữ: {name}',
  },

  update: {
    title: 'Đã có phiên bản mới',
    hint: 'Tải lại để dùng ngay. Phiên bản mới cũng tự tải khi bạn chuyển sang trang khác.',
    reload: 'Tải lại',
  },

  header: {
    beta: 'Beta',
    getSol: 'Nhận SOL',
    faucetTip: 'Faucet tạm thời cho bản beta: nhận SOL thử nghiệm miễn phí để chơi',
    mute: 'Tắt âm thanh',
    unmute: 'Bật âm thanh',
  },

  faucet: {
    connectFirst: 'Hãy kết nối ví trước',
    connectFirstHint: 'Sau đó chạm vào Nhận SOL để nạp SOL thử nghiệm vào ví.',
    request: 'Yêu cầu SOL thử nghiệm trên faucet',
    requestHint: 'Địa chỉ ví của bạn đã được sao chép. Hãy dán vào nếu ô còn trống, rồi xác nhận.',
    openAgain: 'Mở lại',
    airdropped: 'Đã airdrop ◎1',
    airdroppedHint: 'SOL thử nghiệm đã về ví trên {cluster}. Giờ bạn có thể mua vé.',
    failed: 'Airdrop thất bại',
    slow: 'Airdrop đã được chấp nhận nhưng số dư chưa cập nhật. Hãy làm mới sau giây lát.',
  },

  footer: {
    license: 'Giấy phép MIT',
    program: 'Chương trình {address} trên {cluster}.',
    age: 'Chỉ dành cho người từ 18 tuổi trở lên. Chơi để giải trí, và chỉ ở nơi xổ số là hợp pháp.',
    legal: 'Pháp lý',
    languages: 'Ngôn ngữ',
    source: 'Mã nguồn',
    builtOn: 'Xây dựng trên {solana}',
    madeBy: 'Được tạo bởi {nexow}',
  },

  home: {
    kicker: 'Trò chơi xổ số trên Solana',
    title: 'Chọn một con số.',
    titleEnd: 'Thắng lúc nửa đêm.',
    lead: 'Mỗi ngày một lượt quay số, mỗi giờ một lượt quay số, và một con số ẩn để truy tìm. Người thắng nhận 80% quỹ thưởng, phần còn lại được chuyển sang vòng tiếp theo. Mọi vé, mọi lamport và mọi lượt quay số đều nằm trên Solana, nơi ai cũng có thể kiểm tra.',
    playNow: 'Chơi ngay',
    howItWorks: 'Cách hoạt động',
    program: 'Chương trình',
    cluster: 'Cụm',
    draw: 'Quay số',
    dialCaption:
      'Mỗi chấm là một vé của hôm nay: vị trí quanh mặt đồng hồ theo thời điểm mua, khoảng cách ra phía ngoài theo con số của vé.',

    how: {
      tag: 'Cách hoạt động',
      title: 'Bốn bước, mỗi ngày một lượt quay số',
      description: 'Các vòng theo lịch UTC: vòng mới mở lúc 00:00 UTC và được quay số ngay sau nửa đêm tiếp theo.',
      opens: 'Vòng mở',
      draw: 'Quay số',
      now: 'Bây giờ',
      steps: {
        wallet: {
          title: 'Kết nối ví',
          description:
            'Phantom, Solflare, Backpack hoặc bất kỳ ví nào hỗ trợ Wallet Standard. Không cần tài khoản, không cần email.',
          when: 'Bất cứ lúc nào',
        },
        number: {
          title: 'Chọn con số của bạn',
          description: 'Bất kỳ số nào từ 0 đến {max}. Mỗi ngày, mỗi số chỉ thuộc về một vé, nên hãy nhanh tay.',
          when: 'Đến nửa đêm UTC',
        },
        pot: {
          title: 'Xem quỹ thưởng tăng lên',
          description:
            'Mỗi vé cộng giá của nó vào quỹ thưởng, do chính tài khoản của vòng trên Solana nắm giữ. Không ai khác có thể di chuyển số tiền đó.',
          when: 'Cả ngày',
        },
        win: {
          title: 'Thắng lúc nửa đêm UTC',
          description:
            'Một số ngẫu nhiên được quay ra, và vé gần nó nhất giành 80% quỹ thưởng. Phí nhà cái được trừ từ phần còn lại, và phần dư được chuyển sang ngày hôm sau.',
          when: 'Ngay sau nửa đêm UTC',
        },
      },
    },

    fairness: {
      tag: 'Công bằng',
      title: 'Đừng tin chúng tôi. Hãy kiểm tra.',
      description:
        'S☉Lucky là một chương trình Solana, không phải một máy chủ giữ tiền của bạn. Các quy tắc này được mã của nó thực thi.',
      rules: {
        locked: {
          title: 'Quỹ thưởng bị khóa trong chương trình',
          description:
            'Tiền mua vé đi thẳng vào tài khoản của vòng. Chương trình chỉ trả 80% số tiền đó cho chủ sở hữu vé thắng, trả phí cho kho bạc, và chuyển phần còn lại sang vòng tiếp theo của trò chơi. Bên vận hành không thể rút số tiền đó.',
        },
        draw: {
          title: 'Lượt quay số không ai đoán trước được',
          description:
            'Mỗi lượt mua được trộn vào entropy của vòng. Khi một vòng kết thúc, nó ghim một slot vài giây trong tương lai; hash của slot đó, điều không ai biết cho đến lúc ấy, sẽ chọn ra con số dùng để đo khoảng cách của các vé.',
        },
        anyone: {
          title: 'Ai cũng có thể thực hiện',
          description:
            'Việc đóng vòng, quay số và trả thưởng mở cho tất cả mọi người. Nếu ngày mai bên vận hành biến mất, bất kỳ người chơi nào vẫn có thể hoàn tất mọi vòng.',
        },
        browser: {
          title: 'Kiểm tra được ngay trong trình duyệt',
          description:
            'Trang của mỗi vòng tính lại kết quả quay số từ dữ liệu công khai: entropy, hash của slot, số được quay ra và vé gần nhất. Cùng đầu vào, cùng người thắng.',
        },
        limits: {
          title: 'Giới hạn cứng đối với nhà cái',
          description:
            'Chương trình luôn trả cho người thắng 80% quỹ thưởng và giới hạn phí ở mức tối đa 20%. Thay đổi về giá và phí chỉ áp dụng cho các vòng mở sau đó, và người mua không bao giờ trả nhiều hơn mức giá đã được hiển thị cho họ.',
        },
        open: {
          title: 'Mã nguồn mở',
          description: 'Chương trình, ứng dụng và các script vận hành đều công khai, với kiểm thử cho mọi quy tắc.',
        },
      },
    },

    faq: {
      tag: 'Hỏi đáp',
      title: 'Câu hỏi',
      description: 'Vẫn còn băn khoăn? Chương trình, ứng dụng và các script vận hành đều là mã nguồn mở.',
      readCode: 'Đọc mã nguồn',
      items: {
        real: {
          q: 'Đây có phải tiền thật không?',
          a: 'Ứng dụng công khai chạy trên Solana devnet, nơi SOL là tiền thử nghiệm miễn phí từ faucet.solana.com. Chương trình hoạt động y hệt trên mainnet, nhưng vận hành một xổ số bằng tiền thật cần có giấy phép phù hợp ở nơi bạn hoạt động.',
        },
        price: {
          q: 'Một vé giá bao nhiêu?',
          a: 'Giá vé của mỗi trò chơi được đặt trên chuỗi và hiển thị trên trang Chơi của trò chơi đó. Ngoài giá vé, tài khoản vé còn giữ một khoản đặt cọc tiền thuê nhỏ, bạn sẽ nhận lại khi đóng vé sau khi vòng đã được trả thưởng. Vé đầu tiên của một vòng còn trả tiền thuê cho tài khoản của vòng, tài khoản này ở lại trên chuỗi làm hồ sơ công khai của vòng; trong các trò xổ số, mỗi vé còn trả cho 4 byte mà con số của nó chiếm trong đó.',
        },
        odds: {
          q: 'Tỉ lệ thắng của tôi được tính thế nào?',
          a: 'Trong các trò xổ số, vé gần số được quay ra nhất sẽ thắng, nên cơ hội của bạn là phần của dải số nằm gần các số của bạn hơn số của bất kỳ ai khác: một số nằm xa các vé khác sẽ chiếm phần lớn hơn. Trong Đoán số, mỗi lần kiểm tra tìm ra con số với tỉ lệ bằng số lượt đoán mới chia cho số con số chưa được thử.',
        },
        draw: {
          q: 'Nếu không ai quay số cho vòng thì sao?',
          a: 'Một bot nhỏ (crank) đóng, quay số và trả thưởng mọi vòng xổ số chỉ vài giây sau khi vòng kết thúc, và kiểm tra các lượt đoán mới sau mỗi vài giây. Ai cũng có thể làm điều tương tự từ trang Chơi. Nếu slot đã ghim trở nên quá cũ để đọc (khoảng ba phút), vòng có thể được đóng lại lần nữa để ghim một slot mới; chương trình chỉ cho phép điều đó khi có thể chứng minh slot cũ không còn đọc được nữa.',
        },
        country: {
          q: 'Vì sao lại hiển thị quốc gia của tôi?',
          a: 'S☉Lucky luôn hiển thị một lá cờ bên cạnh mỗi vé. Chúng tôi gợi ý quốc gia của bạn dựa trên kết nối tới máy chủ lưu trữ của chúng tôi, không dùng bất kỳ dịch vụ tra cứu bên thứ ba nào, và bạn có thể thay đổi hoặc giữ kín trước khi mua. Thông tin này được lưu trên chuỗi cùng với vé của bạn.',
        },
        validator: {
          q: 'Validator có thể gian lận khi quay số không?',
          a: 'Người chơi thì không: hash thắng chưa tồn tại khi việc bán vé kết thúc. Validator tạo ra slot đã ghim có thể làm lệch kết quả, bằng cách chọn những gì đưa vào khối đó hoặc bỏ qua khối đó. Điều này chấp nhận được với một trò chơi dùng tiền thử nghiệm; với quỹ thưởng bằng tiền thật, việc quay số nên dùng một oracle ngẫu nhiên có thể kiểm chứng, và README giải thích chỗ để tích hợp nó.',
        },
      },
    },

    cta: {
      title: 'Quỹ thưởng hôm nay đang chờ',
      description: 'Chọn một con số chưa ai lấy. Chúc may mắn!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Mỗi ngày một lượt quay số · Quay sau nửa đêm UTC · Mọi vé trên Solana',
    draw: 'Quay số',
    pot: 'Quỹ thưởng hôm nay',
    toDraw: 'đến giờ quay số · {day}',
    tickets: '{n} vé hôm nay',
    entropy: 'Entropy · {cluster}',
    entropyTitle: 'Entropy: {hex}',
    noTickets: 'chưa có vé nào',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Vé mới',
    rules: {
      daily: 'Vòng mới mỗi ngày lúc 00:00 UTC',
      hourly: 'Và một vòng mỗi giờ',
      pot: 'Số gần nhất giành 80% quỹ thưởng',
      carry: 'Phần còn lại chuyển sang vòng tiếp theo',
      guess: 'Đoán số: không có hạn chót, cho đến khi có người tìm ra',
      numbers: 'Các số từ 0 đến {max}',
      fee: 'Phí nhà cái được chương trình giới hạn ở 20%',
      anyone: 'Ai cũng có thể đóng, quay số và trả thưởng một vòng',
      check: 'Tính lại mọi lượt quay số trong trình duyệt của bạn',
      open: 'Mã nguồn mở',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Biên nhận quay số',
    round: 'Vòng',
    noneYet: 'chưa có vòng nào được tất toán',
    tickets: 'Vé',
    pot: 'Quỹ thưởng',
    entropy: 'Entropy',
    slotHash: 'Hash của slot · slot {slot}',
    formula: 'sha256(entropy ‖ hash của slot ‖ slot ‖ vòng) =',
    mod: '8 byte đầu dưới dạng u64 mod {count} = {drawn}',
    ticketCount: 'số lượng số',
    closest: 'vé gần nhất: {number}',
    number: 'Số',
    paidTo: 'Trả cho',
    payout: 'Tiền thưởng',
    check: 'Kiểm tra lượt quay số này',
    roundPage: 'Trang của vòng',
    nextDraw: 'Lượt quay số tiếp theo sau 00:00 UTC',
    ok: 'Đã tính lại trong trình duyệt của bạn: cùng hash, số {number} thắng.',
    mismatch: 'Hash được tính lại trong trình duyệt của bạn không khớp với vòng này.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Vé',
    players: 'Người chơi',
    countries: 'Quốc gia',
    ticket: 'Giá vé',
    yourTickets: 'Vé của bạn',
    winChance: 'Cơ hội thắng',
    chance: 'Cơ hội',
    todaysPot: 'Quỹ thưởng',
    checked: 'Đã kiểm tra',
    waiting: 'Đang chờ',
    numbersLeft: 'Số còn lại',
    winners: 'Người thắng',
    averagePot: 'Quỹ thưởng trung bình',
    biggestPot: 'Quỹ thưởng lớn nhất',
  },

  countdown: {
    h: 'g',
    m: 'p',
    s: 's',
    left: 'còn {time}',
  },

  play: {
    title: 'Chơi',
    description:
      'Chọn một con số trong xổ số hằng ngày hoặc hằng giờ, hoặc truy tìm con số ẩn, và xem quỹ thưởng tăng lên trực tiếp trên Solana.',
    testMoney: 'Bạn đang chơi trên Solana {cluster}: vé được trả bằng SOL thử nghiệm, không có giá trị thật.',
    localFunds: 'Trỏ ví của bạn đến {url}, rồi nạp tiền vào ví bằng lệnh: {command}',
    phantomFunds:
      'Trong Phantom: Settings → Developer Settings → bật Testnet Mode → chọn {cluster}. Sau đó nhận SOL thử nghiệm miễn phí từ faucet.',
    openFaucet: 'Mở faucet',
    retry: 'Thử lại',
    rpcError: 'Không thể kết nối đến endpoint RPC của Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Chọn một',
    title: 'Con số',
    win: 'Thắng',
    in: 'sau',
    taken: 'Đã có người chọn trong vòng này',
    range: '0 đến {max}, mỗi số một vé',
    pad: 'Bàn phím số',
    reset: 'Đặt lại',
    delete: 'Xóa chữ số cuối',
    dip: 'Chọn ngẫu nhiên',
    searchCountry: 'Tìm quốc gia',
    country: 'Quốc gia hiển thị cùng vé của bạn',
    notSetUp: 'Trò chơi này chưa được thiết lập trên cụm này.',
    paused: 'Việc bán vé đang tạm dừng.',
    buy: 'Mua số {number} với giá ◎{price}',
    takenToday: 'Số {number} đã có người chọn',
    outOfRange: 'Số nằm ngoài phạm vi',
    notEnough: 'Không đủ SOL',
    keys: 'Phím 0–9 để nhập, ⌫ để xóa, Enter để mua.',
    rent: 'Mỗi vé còn giữ ◎{rent} tiền thuê tài khoản, bạn sẽ nhận lại sau khi quay số.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · đóng sau',
    carried: 'Bao gồm ◎{carry} chuyển sang từ vòng trước',
    split: '80% cho người thắng · {fee} phí nhà cái · phần còn lại cho vòng tiếp theo',
    inPlay: 'Các số đang chơi',
    empty: 'Chưa có vé nào',
    beFirst: 'Hãy là người đầu tiên chọn số trong vòng này.',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Trò chơi',
    title: 'Ba cách để chơi',
    description:
      'Cùng các số, từ 0 đến {max}. Người thắng nhận 80% quỹ thưởng; phí nhà cái được trừ từ phần còn lại, và phần dư được chuyển sang vòng tiếp theo.',
    play: 'Chơi',
    daily: {
      name: 'Xổ số hằng ngày',
      short: 'Hằng ngày',
      description: 'Mỗi ngày một lượt quay số sau nửa đêm UTC. Vé gần số được quay ra nhất sẽ thắng.',
    },
    hourly: {
      name: 'Xổ số hằng giờ',
      short: 'Hằng giờ',
      description: 'Mỗi giờ một lượt quay số, đúng đầu giờ (UTC). Vé gần số được quay ra nhất sẽ thắng.',
    },
    guess: {
      name: 'Đoán số',
      short: 'Đoán số',
      description:
        'Không có hạn chót. Các lượt đoán mới được kiểm tra sau mỗi vài giây cho đến khi một lượt tìm ra con số của vòng; sau đó một vòng mới bắt đầu.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Cho đến khi có người tìm ra',
    odds: 'Mỗi lần kiểm tra tìm ra con số với tỉ lệ bằng số lượt đoán mới chia cho {n} con số chưa được thử.',
    bought: 'Đã ghi nhận lượt đoán {number}. Nó sẽ được kiểm tra sau vài giây.',
    sealing: 'Đang niêm phong các lượt đoán mới nhất của vòng {day}',
    checkNow: 'Kiểm tra ngay',
    checkHint:
      'Một bot kiểm tra các lượt đoán mới sau mỗi vài giây. Ai cũng có thể chạy việc kiểm tra; việc này tốn phí mạng.',
    missed: 'Không phải con số: {numbers}',
    left: 'Con số là một trong {n} con số chưa được thử.',
    foundByYou: 'Bạn đã tìm ra! Con số là {number}',
    foundByOther: 'Một người chơi khác đã tìm ra con số',
    nextRound: 'Một vòng mới với con số mới đang mở bán.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Lịch sử',
    total: 'Tổng',
    games: 'vòng',
    waiting: 'Đang chờ quay số',
    settle: 'Tất toán',
    settleDay: 'Tất toán {day}',
    anyone:
      'Ai cũng có thể đóng, quay số và trả thưởng một vòng đã kết thúc. Chỉ tốn phí mạng; giải thưởng luôn thuộc về người thắng.',
    rent: '{n} vé cũ đang giữ ◎{sol} tiền thuê',
    rentHint: 'Đóng chúng để lấy lại số SOL đó. Vòng vẫn giữ kết quả của nó.',
    getBack: 'Lấy lại',
    winners: 'Người thắng',
    noWinners: 'Chưa có người thắng',
    firstDraw: 'Người thắng đầu tiên sẽ xuất hiện ở đây.',
    chart: 'Quỹ thưởng theo vòng',
    chartEmpty: 'Chưa có vòng nào kết thúc.',
    chartLabel: 'Quỹ thưởng của {n} vòng gần nhất; danh sách bên dưới có mọi giá trị.',
  },

  status: {
    open: 'Đang mở',
    toClose: 'Chờ đóng',
    toDraw: 'Chờ quay số',
    checking: 'Đang kiểm tra lượt đoán',
    unpaid: 'Đã quay, chưa trả',
    paid: 'Đã trả thưởng',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Trực tiếp',
    connecting: 'Đang kết nối',
    offline: 'Ngoại tuyến',
    atTable: '{n} người tại bàn',
    picking: '{n} người đang chọn',
    you: 'bạn',
    joined: 'đã vào',
    now: 'vừa xong',
    empty: 'Bàn đang mở. Vé tiếp theo sẽ hiện ở đây ngay khi nó lên chuỗi.',
    joinedOne: 'Một người chơi mới đã vào bàn',
    joinedMany: '{n} người chơi mới đã vào bàn',
    hereNow: '{n} người đang ở đây',
    locked: '{who} đã chốt số {number}',
    potNow: 'Quỹ thưởng hiện là ◎{pot} với {n} vé',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Xác nhận trong ví của bạn…',
    done: '{label}: xong',
    cancelled: '{label}: đã hủy',
    failed: '{label} thất bại',
    view: 'Xem giao dịch',
    buying: 'Mua số {number}',
    bought: 'Số {number} là của bạn. Chúc may mắn!',
    repin: 'Ghim lại slot quay số cho {day}',
    closing: 'Đóng vòng {day}',
    drawing: 'Quay số vòng {day}',
    paying: 'Trả thưởng cho người thắng vòng {day}',
    paid: 'Đã trả ◎{amount} cho người thắng vòng {day}',
    settleFailed: 'Không thể tất toán vòng {day}',
    reclaiming: 'Hoàn trả tiền thuê vé',
    slowSlot: 'Cụm đang chậm đạt tới slot quay số. Hãy thử lại sau một phút.',
    noWinner: 'Không tìm thấy vé thắng.',
  },

  wallet: {
    connect: 'Kết nối ví',
    title: 'Kết nối ví',
    description: 'Mọi ví Solana hỗ trợ Wallet Standard đều dùng được.',
    none: 'Không tìm thấy ví Solana nào trong trình duyệt này. Hãy cài một ví, rồi tải lại trang:',
    failed: 'Không thể kết nối {wallet}',
    copied: 'Đã sao chép địa chỉ',
    balance: 'Số dư',
    ticketsLeft: 'Còn đủ mua {n} vé',
    needMore: 'cần thêm SOL để chơi',
    numbers: 'Số của bạn trong vòng này',
    copy: 'Sao chép địa chỉ',
    explorer: 'Explorer',
    play: 'Chơi',
    disconnect: 'Ngắt kết nối',
  },

  round: {
    title: 'Vòng {day}',
    back: 'Quay lại trò chơi',
    notDate:
      'Đây không phải là một vòng của trò chơi này. Vòng hằng ngày được đặt tên theo dạng YYYY-MM-DD, vòng hằng giờ theo dạng YYYY-MM-DDTHH, và vòng Đoán số theo số thứ tự của chúng.',
    kicker: 'Vòng',
    nobody: 'Không ai chơi trong vòng này',
    beFirst: 'Hãy là người đầu tiên mua vé trong vòng này.',
    onlyExists: 'Một vòng chỉ tồn tại khi vé đầu tiên của nó được bán.',
    pot: 'Quỹ thưởng',
    usd: '{usd} theo giá hôm nay',
    winner: 'Người thắng',
    won: 'Thắng ◎{payout} · phí ◎{fee}',
    unpaid: 'Chưa trả thưởng',
    anyone: 'Ai cũng có thể hoàn tất vòng này. Chỉ tốn phí mạng.',
    settle: 'Tất toán vòng này',
    sold: 'Vé đã bán',
    price: 'Giá vé',
    fee: 'Phí nhà cái',
    slot: 'Slot đã ghim',
    check: 'Kiểm tra lượt quay số',
    formula: 'giá trị ngẫu nhiên = sha256(entropy ‖ hash của slot ‖ slot quay số ‖ địa chỉ vòng)',
    recompute: 'Tính lại trong trình duyệt của tôi',
    entropy: 'Entropy (mọi lượt mua, được băm theo thứ tự)',
    slotHash: 'Hash của slot {slot} (chương trình đọc từ sysvar SlotHashes)',
    randomness: 'Giá trị ngẫu nhiên',
    winning: 'Vé thắng',
    winningFormula: '8 byte đầu dưới dạng u64 mod {count} = {drawn}; vé gần nhất giữ số {number}',
    guessFormula:
      '8 byte đầu dưới dạng u64 mod {left} (số con số chưa được thử) = {r}, nhỏ hơn {batch} (số lượt đoán trong lần kiểm tra): lượt mua #{index} đã tìm ra con số',
    ok: 'Kết quả quay số khớp.',
    mismatch: 'Không khớp: kết quả đã lưu không khớp với đầu vào.',
    got: 'Trình duyệt của bạn tính ra {hash}… và số {number}.',
    tickets: 'Vé',
    ticketsHint: 'Vé đã được chủ sở hữu đóng sau khi trả thưởng sẽ không còn hiển thị ở đây; vòng vẫn giữ các số tổng.',
    noTickets: 'Vòng này không còn vé nào đang mở.',
    account: 'Tài khoản vòng {address} · {day}',
  },

  country: {
    private: 'Riêng tư',
  },

  errors: {
    rejected: 'Bạn đã hủy yêu cầu trong ví.',
    taken: 'Đã có người giữ số này trong vòng này. Hãy chọn số khác.',
    funds: 'Ví không đủ SOL.',
    walletCluster:
      'Ví của bạn không thể ký. Trong Phantom: Settings → Developer Settings → bật Testnet Mode → chọn Devnet, rồi kết nối lại và thử lại.',
    unknown: 'Đã xảy ra lỗi.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Chỉ quản trị viên mới có thể làm việc này.',
      invalidTicketPrice: 'Giá vé phải ít nhất là 0.002 SOL.',
      feeTooHigh: 'Phí vượt quá mức trần 20%.',
      invalidMaxNumber: 'Số lớn nhất phải lớn hơn không.',
      paused: 'Việc bán vé đang tạm dừng.',
      wrongRound: 'Chỉ có thể mua vé cho vòng đang mở bán.',
      numberOutOfRange: 'Số nằm ngoài phạm vi.',
      invalidCountry: 'Quốc gia phải là mã ISO 3166-1 alpha-2 viết hoa.',
      roundNotOpen: 'Vòng hiện không mở.',
      roundNotOver: 'Vòng chưa kết thúc.',
      roundAlreadyDrawn: 'Vòng đã được quay số.',
      drawStillPossible: 'Vẫn có thể quay số với slot đã ghim.',
      roundNotClosed: 'Vòng chưa được đóng.',
      targetSlotNotReached: 'Chưa đạt tới slot đã ghim.',
      randomnessUnavailable:
        'Chưa đọc được hash của slot đã ghim; hãy thử lại sau ít phút, hoặc đóng lại vòng khi slot đó đã hết hạn.',
      roundNotDrawn: 'Vòng chưa được quay số.',
      notWinningTicket: 'Đây không phải vé thắng.',
      roundNotSettled: 'Vòng chưa được tất toán.',
      overflow: 'Tràn số học.',
      priceChanged: 'Giá vé cao hơn mức giá bạn đã chấp nhận.',
      feeAlreadyCollected: 'Phí của vòng này đã được thu.',
      roundFull: 'Vòng này đã bán hết số vé mà nó có thể chứa.',
      nothingToCheck: 'Không có lượt đoán mới nào để kiểm tra.',
      batchSealed: 'Các lượt đoán mới nhất đang được kiểm tra; hãy thử lại sau vài giây.',
      invalidGame: 'Trò chơi không xác định.',
    },
  },

  legal: {
    kicker: 'Pháp lý',
    updated: 'Cập nhật lần cuối: {date}',
    onThisPage: 'Trên trang này',
    others: 'Các văn bản pháp lý khác',
    translated: 'Trang này là bản dịch từ bản gốc tiếng Anh. Nếu có khác biệt, bản tiếng Anh được áp dụng.',
    readEnglish: 'Đọc bằng tiếng Anh',
    repository: 'kho mã nguồn',

    pages: {
      notice: {
        label: 'Thông tin pháp lý',
        description: 'Ai vận hành S☉Lucky, cách liên hệ với chúng tôi và các văn bản được áp dụng.',
      },
      terms: {
        label: 'Điều khoản dịch vụ',
        description: 'Các quy tắc khi sử dụng trang web và chơi, cùng những gì chương trình cam kết và không cam kết.',
      },
      privacy: {
        label: 'Chính sách quyền riêng tư',
        description:
          'Những gì công khai trên Solana, những gì máy chủ của chúng tôi thấy, và những gì chúng tôi không bao giờ thu thập.',
      },
      cookies: {
        label: 'Cookie và lưu trữ',
        description: 'Không cookie, không trình theo dõi: năm thiết lập mà ứng dụng lưu trong trình duyệt của bạn.',
      },
      play: {
        label: 'Chơi có trách nhiệm',
        description: 'Tỉ lệ thắng hoạt động thế nào, và nơi tìm trợ giúp nếu việc chơi không còn vui.',
      },
    },

    notice: {
      description: 'Ai vận hành S☉Lucky, cách liên hệ với chúng tôi và các văn bản được áp dụng khi bạn sử dụng nó.',
      operator: {
        title: 'Ai vận hành S☉Lucky',
        body: 'S☉Lucky do {operator} phát triển và vận hành. Bạn có thể liên hệ với chúng tôi qua email {email} và tìm hiểu thêm về chúng tôi tại {site}.',
      },
      software: {
        title: 'Chương trình và trang web',
        intro: 'S☉Lucky gồm hai phần:',
        program:
          '{name}, một chương trình Solana bán vé, giữ quỹ thưởng của mỗi ngày và trả thưởng cho người thắng. Trang web này sử dụng chương trình tại {address} trên Solana {cluster}. Bất kỳ ai cũng có thể dùng trực tiếp chương trình mà không cần trang web này.',
        programName: 'Chương trình',
        site: '{name}, nơi hiển thị dữ liệu công khai của chương trình và giúp bạn gửi giao dịch từ chính ví của mình. Trang web không bao giờ giữ khóa hay SOL của bạn.',
        siteName: 'Trang web này',
      },
      documents: {
        title: 'Văn bản',
        intro: 'Sử dụng trang web nghĩa là chấp nhận các văn bản sau:',
      },
      security: {
        title: 'Báo cáo sự cố bảo mật',
        body: 'Vui lòng không mở issue công khai. Hãy gửi email đến {email} với tiêu đề {subject}, và không bao giờ thử nghiệm trên tiền của người chơi khác: hãy dùng devnet hoặc một validator cục bộ. Chính sách bảo mật, tệp {file} trong {repository}, giải thích những gì cần đưa vào báo cáo và những gì thuộc phạm vi.',
      },
      license: {
        title: 'Giấy phép mã nguồn mở',
        body: 'Chương trình, ứng dụng và các script vận hành là mã nguồn mở theo Giấy phép MIT ({file} trong {repository}), © {years} {operator}. Giấy phép áp dụng cho mã nguồn; {terms} áp dụng cho việc sử dụng trang web này.',
      },
    },

    terms: {
      description: 'Các quy tắc khi sử dụng S☉Lucky, cùng những gì chương trình của nó cam kết và không cam kết.',
      agreement: {
        title: 'Các điều khoản này',
        p1: 'Các điều khoản này áp dụng khi bạn sử dụng trang web và ứng dụng S☉Lucky do {operator} (“chúng tôi”) vận hành. Khi sử dụng, bạn chấp nhận các điều khoản này, cùng với {privacy} và trang {cookies}. Nếu bạn không chấp nhận, đừng sử dụng trang web.',
        p2: 'Bản thân trò chơi là một chương trình Solana: phần mềm mã nguồn mở chạy trên mạng Solana, không phải trên máy chủ của chúng tôi. Trang web là một cách để sử dụng nó; bất kỳ ai cũng có thể dùng trực tiếp chương trình.',
      },
      eligibility: {
        title: 'Ai có thể chơi',
        age: 'Bạn phải từ 18 tuổi trở lên.',
        legal:
          'Bạn chỉ được chơi ở nơi xổ số và trò chơi may rủi trực tuyến là hợp pháp đối với bạn. Việc kiểm tra điều đó là trách nhiệm của bạn; chúng tôi không kiểm tra bạn đang ở đâu.',
        own: 'Không chơi thay cho người khác, hoặc bằng SOL không phải của bạn.',
      },
      money: {
        title: 'SOL thử nghiệm và SOL thật',
        test: 'Trang web này chạy trên {cluster}. Vé được trả bằng SOL thử nghiệm, nhận miễn phí từ faucet và không có giá trị: không thể đổi thành tiền thật, và mọi thứ bạn thắng được bằng nó cũng vậy.',
        real: 'Trang web này chạy trên {cluster}. Vé được trả bằng SOL thật, và quỹ thưởng được trả bằng SOL thật.',
      },
      rounds: {
        title: 'Một vòng diễn ra thế nào',
        intro: 'Chương trình thực thi các quy tắc này; trang web chỉ hiển thị chúng:',
        day: 'S☉Lucky có ba trò chơi. Trong xổ số hằng ngày, mỗi ngày UTC có một vòng, từ 00:00 UTC đến nửa đêm tiếp theo; trong xổ số hằng giờ, mỗi giờ UTC có một vòng. Trong Đoán số, một vòng không có thời điểm kết thúc: nó kéo dài cho đến khi một lượt đoán tìm ra con số của vòng.',
        number:
          'Một vé là một con số, từ 0 đến số lớn nhất được đặt trong cấu hình của chương trình. Mỗi số chỉ thuộc về một vé trong mỗi vòng.',
        price:
          'Mỗi trò chơi có giá vé và phí nhà cái riêng. Chúng được sao chép, cùng với số lớn nhất, khi một vòng mở, và giữ nguyên trong suốt vòng đó. Phí không bao giờ được vượt quá 20% quỹ thưởng. Khi mua, bạn không bao giờ trả nhiều hơn mức giá đã được hiển thị cho bạn.',
        pot: 'Giá của mỗi vé được đưa vào quỹ thưởng của vòng, do chính tài khoản của vòng trên Solana nắm giữ. Trong các trò xổ số, một số ngẫu nhiên từ 0 đến số lớn nhất được quay ra và vé gần nó nhất sẽ thắng; nếu hòa, số nhỏ hơn thắng. Trong Đoán số, các lượt đoán mới được kiểm tra theo từng lô: một lô chứa con số với tỉ lệ bằng số lượt đoán trong lô chia cho số con số chưa được thử, đúng bằng tỉ lệ đối với một con số được giấu từ khi vòng mở.',
        draw: 'Khi một vòng xổ số đã kết thúc, hoặc ngay khi có lượt đoán mới đang chờ kiểm tra, bất kỳ ai cũng có thể đóng vòng, quay số và trả thưởng. Chủ sở hữu vé thắng nhận 80% quỹ thưởng, phí nhà cái được chuyển vào kho bạc, và phần còn lại ở lại trong chương trình cho vòng tiếp theo của trò chơi được quay số.',
        rent: 'Tài khoản vé còn giữ một khoản đặt cọc tiền thuê nhỏ, bạn sẽ nhận lại khi đóng vé sau khi vòng của nó đã được trả thưởng. Vé đầu tiên của một vòng còn trả tiền thuê cho tài khoản của vòng, tài khoản này ở lại trên Solana làm hồ sơ công khai của vòng. Trong các trò xổ số, mỗi vé còn trả tiền thuê cho 4 byte mà con số của nó chiếm trong tài khoản đó, khoản này không được hoàn lại.',
      },
      wallet: {
        title: 'Ví và giao dịch của bạn',
        own: 'Bạn chơi bằng ví của chính mình. Chúng tôi không bao giờ giữ khóa, SOL hay vé của bạn, và chúng tôi không thể di chuyển chúng.',
        sign: 'Bạn tự ký mọi giao dịch và tự trả phí mạng của Solana. Giao dịch đã được xác nhận là chung cuộc: chúng tôi không thể hủy, đảo ngược hay hoàn tiền.',
        public:
          'Con số của vé, địa chỉ của chủ sở hữu và lá cờ quốc gia bạn chọn cho vé sẽ công khai vĩnh viễn trên Solana. {privacy} giải thích điều đó có nghĩa là gì.',
        keys: 'Hãy giữ an toàn khóa ví của bạn. Không ai, kể cả chúng tôi, có thể khôi phục chúng cho bạn.',
      },
      operator: {
        title: 'Những gì bên vận hành có thể và không thể làm',
        intro: 'Cấu hình của chương trình có một quản trị viên, có thể:',
        price:
          'thay đổi giá vé (ít nhất ◎0.002) và phí nhà cái (tối đa 20%) của từng trò chơi, có hiệu lực từ vòng tiếp theo được mở của trò chơi đó;',
        pause:
          'tạm dừng và tiếp tục bán vé. Việc tạm dừng chỉ ngăn vé mới: các vòng đã chơi vẫn có thể được quay số và trả thưởng;',
        other: 'thay đổi kho bạc, số lớn nhất, và chính quản trị viên.',
        cannot:
          'Mã của chương trình không cho phép quản trị viên, hay bất kỳ ai khác, lấy quỹ thưởng của một vòng hoặc gửi nó đến bất kỳ đâu ngoài chủ sở hữu vé thắng, khoản phí của kho bạc và vòng tiếp theo của trò chơi, lấy nhiều hơn khoản phí, hoặc thu của người mua nhiều hơn mức giá đã được hiển thị cho họ.',
        upgrade:
          'Chương trình có thể nâng cấp: người nắm giữ quyền nâng cấp của nó có thể triển khai mã khác, vì vậy bạn đang tin tưởng họ cho đến khi chương trình được đặt thành bất biến hoặc được chuyển giao cho một ví đa chữ ký. Mã nguồn của mọi phiên bản đều công khai, và một chương trình đã triển khai có thể được đối chiếu với mã nguồn như mục “Verifiable builds” trong README giải thích.',
      },
      risks: {
        title: 'Rủi ro',
        intro: 'Khi chơi, bạn chấp nhận rằng:',
        bugs: 'phần mềm có thể có lỗi, kể cả chương trình, ứng dụng và ví của bạn, và một lỗi có thể khiến bạn mất vé hoặc SOL;',
        network:
          'Solana hoặc endpoint RPC mà trang web sử dụng có thể chậm, tắc nghẽn hoặc ngừng hoạt động, và một giao dịch có thể thất bại hoặc đến sau khi vòng đã đóng;',
        draw: 'việc quay số dùng hash của một slot Solana mà không ai biết khi một vòng đóng hoặc khi một lô lượt đoán được niêm phong. Người chơi không thể đoán trước nó, nhưng validator tạo ra slot đó có thể làm lệch kết quả, và người đóng một vòng có thể trì hoãn một lượt quay số bất lợi cho đến khi slot đó không còn đọc được. Đây không phải một oracle ngẫu nhiên có thể kiểm chứng;',
        site: 'trang web có thể không truy cập được vào bất cứ lúc nào. Chương trình, và vé của bạn, vẫn tiếp tục hoạt động mà không cần nó;',
        law: 'luật về xổ số và tài sản mã hóa khác nhau giữa các quốc gia và có thể thay đổi.',
      },
      use: {
        title: 'Sử dụng trang web một cách công bằng',
        body: 'Không tấn công hoặc làm quá tải trang web hay máy chủ của nó, cố lách các giới hạn của chúng, gây cản trở người chơi khác, hoặc dùng trang web để vi phạm pháp luật. Chúng tôi có thể chặn quyền truy cập của bất kỳ ai làm vậy.',
      },
      liability: {
        title: 'Không bảo đảm',
        body: 'Trang web và chương trình được cung cấp “nguyên trạng”, không có bất kỳ bảo đảm nào. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc sử dụng chúng, bao gồm mất vé, giao dịch thất bại hoặc chậm trễ, lỗi phần mềm, sự cố mạng, hoặc một lượt quay số mà bạn cho là không công bằng. Không điều gì trong các điều khoản này giới hạn một trách nhiệm mà pháp luật không cho phép chúng tôi giới hạn.',
      },
      openSource: {
        title: 'Mã nguồn mở',
        body: 'Chương trình, ứng dụng và các script vận hành là mã nguồn mở theo Giấy phép MIT: xem {repository}. Giấy phép đó áp dụng cho mã nguồn; các điều khoản này áp dụng cho việc sử dụng trang web này.',
      },
      changes: {
        title: 'Thay đổi',
        body: 'Chúng tôi có thể cập nhật các điều khoản này. Ngày ở đầu trang cho biết lần thay đổi gần nhất, và phiên bản hiển thị ở đây được áp dụng từ ngày đó.',
      },
      contact: {
        title: 'Liên hệ',
        body: 'Câu hỏi về các điều khoản này: {email}.',
      },
    },

    privacy: {
      description:
        'Những gì công khai trên Solana, những gì máy chủ của chúng tôi thấy, và những gì chúng tôi không bao giờ thu thập.',
      summary: {
        title: 'Tóm tắt',
        account: 'Không có tài khoản, email hay đăng ký. Bạn chơi bằng một ví.',
        cookies: 'Trang web không đặt cookie và không tải công cụ phân tích, quảng cáo hay trình theo dõi nào.',
        database: 'Chúng tôi không lưu cơ sở dữ liệu người chơi, và chúng tôi không bán hay chia sẻ dữ liệu về bạn.',
        public: 'Vé của bạn công khai trên Solana, theo thiết kế: đó là điều cho phép bất kỳ ai kiểm tra trò chơi.',
        controller: '{operator} vận hành trang web và chịu trách nhiệm về dữ liệu mà trang web xử lý.',
      },
      onChain: {
        title: 'Những gì công khai trên Solana',
        intro: 'Khi bạn mua vé, giao dịch và tài khoản của vé ghi lại công khai:',
        address: 'địa chỉ ví của bạn, và các giao dịch mà ví đó ký;',
        number: 'con số bạn chọn, vòng và thời điểm mua;',
        flag: 'lá cờ quốc gia bạn chọn cho vé, hoặc không có cờ nếu bạn giữ kín.',
        ledger:
          'Khi một vòng được quay số, tài khoản của vòng còn ghi lại địa chỉ người thắng, con số thắng và lá cờ của nó, cùng số tiền thưởng. Solana là một sổ cái công khai: ai cũng có thể đọc dữ liệu này, nhiều người lưu bản sao của nó, và nó ở đó vĩnh viễn. Đóng một vé sẽ xóa tài khoản của vé và hoàn lại tiền thuê, nhưng các giao dịch đã tạo và đóng vé vẫn còn trong sổ cái. Cả chúng tôi lẫn bất kỳ ai khác đều không thể thay đổi hay xóa nó.',
        link: 'Địa chỉ ví không phải là tên của bạn, nhưng có thể được liên kết với bạn, chẳng hạn qua một sàn giao dịch bạn đã dùng. Hãy dùng một ví riêng nếu bạn muốn tách việc chơi khỏi các hoạt động khác của mình.',
      },
      servers: {
        title: 'Những gì máy chủ của chúng tôi thấy',
        visit: 'Mỗi lượt truy cập',
        visitBody:
          'Trang web được lưu trữ trên Cloudflare. Như mọi trang web, nó nhận địa chỉ IP, user agent của trình duyệt và các trang bạn yêu cầu, để phân phối các trang đó và bảo vệ trang web khỏi bị lạm dụng. Cloudflare lưu nhật ký vận hành trong một thời gian giới hạn theo {policy}. Chúng tôi chỉ dùng chúng để vận hành và sửa lỗi trang web.',
        policy: 'chính sách quyền riêng tư của chính họ',
        country: 'Quốc gia của bạn',
        countryBody:
          'Cloudflare cho máy chủ của chúng tôi biết mỗi yêu cầu đến từ quốc gia nào. Ứng dụng hỏi thông tin này một lần, để gợi ý lá cờ cho vé của bạn; bạn có thể thay đổi hoặc giữ kín trước khi mua. Máy chủ chỉ đọc quốc gia, không đọc địa chỉ IP của bạn, và không lưu lại.',
        live: 'Bàn trực tiếp trên trang Chơi',
        liveBody:
          'Khi trang Chơi đang mở, trình duyệt của bạn giữ một kết nối tới máy chủ của chúng tôi để người chơi thấy còn ai khác đang ở đó. Kết nối này chia sẻ ba thứ với những người khác trên trang: một id ngẫu nhiên chỉ dành cho kết nối đó, lá cờ mà vé của bạn hiển thị (không có nếu bạn giữ kín quốc gia), và việc bạn có đang nhập một con số hay không, không bao giờ là chính con số đó. Không có địa chỉ ví hay địa chỉ IP nào trong đó, và không có gì về kết nối được lưu trữ hay giữ lại sau khi nó đóng.',
        price: 'Giá SOL',
        priceBody:
          'Để hiển thị quỹ thưởng bằng đô la, máy chủ của chúng tôi lấy giá SOL từ Coinbase, hoặc từ CoinGecko nếu Coinbase không phản hồi, và lưu vào bộ nhớ đệm trong một phút. Các yêu cầu này xuất phát từ máy chủ của chúng tôi và không mang thông tin gì về bạn.',
      },
      thirdParties: {
        title: 'Các dịch vụ trình duyệt của bạn sử dụng',
        rpc: '{name}, nơi ứng dụng đọc dữ liệu trò chơi và gửi giao dịch của bạn qua đó: {endpoint}. Nó nhận địa chỉ IP của bạn và các tài khoản mà ứng dụng tra cứu, bao gồm tài khoản ví của bạn khi bạn đã kết nối, theo chính sách của bên vận hành nó.',
        rpcName: 'Một endpoint RPC của Solana',
        rpcHost: '{host} trên trang web này',
        rpcPublic: 'endpoint công khai của Solana cho {cluster}',
        wallet:
          '{name}, chẳng hạn Phantom, Solflare hoặc Backpack, là phần mềm của nhà phát triển riêng, với chính sách riêng. Trang web chỉ yêu cầu ví kết nối và ký các giao dịch bạn chấp thuận.',
        walletName: 'Ví của bạn',
        links:
          '{name}: Solana Explorer, faucet của Solana, GitHub và các tài khoản mạng xã hội của chúng tôi là những trang web khác, với chính sách riêng.',
        linksName: 'Các liên kết bạn mở',
        own: 'Phông chữ, âm thanh và hình ảnh đến từ chính tên miền của chúng tôi, nên việc tải trang web không liên hệ với bất kỳ ai khác.',
      },
      browser: {
        title: 'Những gì lưu lại trong trình duyệt của bạn',
        body: 'Ứng dụng lưu năm thiết lập trong bộ nhớ cục bộ của trình duyệt: giao diện, ví dùng gần nhất, lựa chọn quốc gia, thiết lập âm thanh và ngôn ngữ của bạn. Trang {cookies} liệt kê chúng.',
      },
      purposes: {
        title: 'Vì sao, và những gì chúng tôi không bao giờ làm',
        body: 'Chúng tôi chỉ xử lý dữ liệu nêu trên để hiển thị trang web, vận hành trò chơi mà bạn yêu cầu chơi, giữ an toàn cho trang web và khắc phục sự cố. Chúng tôi không lập hồ sơ người dùng, không hiển thị quảng cáo, không bán dữ liệu hay chia sẻ dữ liệu với nhà quảng cáo.',
      },
      rights: {
        title: 'Lựa chọn và quyền của bạn',
        flag: 'Bạn có thể chơi mà không có cờ quốc gia: hãy chọn giữ kín trước khi mua.',
        clear: 'Bạn có thể xóa các thiết lập trong trình duyệt bất cứ lúc nào, và dùng ví mới bất cứ khi nào bạn muốn.',
        law: 'Tùy theo nơi bạn sống, bạn có thể có quyền truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân về bạn, hoặc phản đối cách dữ liệu đó được sử dụng. Hãy gửi email đến {email} và chúng tôi sẽ trả lời. Chúng tôi gần như không nắm giữ gì về bạn, và chúng tôi không thể thay đổi hay xóa những gì nằm trên Solana.',
      },
      children: {
        title: 'Trẻ em',
        body: 'S☉Lucky dành cho người từ 18 tuổi trở lên. Chúng tôi không cố ý xử lý dữ liệu của bất kỳ ai nhỏ tuổi hơn.',
      },
      changes: {
        title: 'Thay đổi và liên hệ',
        body: 'Chúng tôi sẽ cập nhật trang này khi trang web thay đổi cách xử lý dữ liệu; ngày ở đầu trang cho biết lần thay đổi gần nhất. Câu hỏi: {email}.',
      },
    },

    cookies: {
      description:
        'Không cookie, không trình theo dõi: năm thiết lập mà ứng dụng lưu trong trình duyệt của bạn, và cách xóa chúng.',
      none: {
        title: 'Không cookie',
        p1: 'S☉Lucky không đặt cookie, và không tải bất kỳ script phân tích, quảng cáo hay theo dõi nào. Chính sách bảo mật của trang web chỉ cho phép script từ chính tên miền của nó.',
        p2: 'Nhà cung cấp dịch vụ lưu trữ của chúng tôi, Cloudflare, có thể đặt các cookie bảo mật thực sự cần thiết, chẳng hạn {cookie}, khi tính năng chống bot của họ được bật. Cloudflare dùng chúng để phân biệt người với bot, như {list} của họ giải thích.',
        list: 'danh sách cookie',
      },
      storage: {
        title: 'Những gì ứng dụng lưu trong trình duyệt của bạn',
        intro:
          'Ứng dụng lưu một vài thiết lập trong bộ nhớ cục bộ của trình duyệt, để lần sau chúng vẫn còn đó. Chúng ở lại trên thiết bị của bạn, với một ngoại lệ: lá cờ bạn chọn sẽ xuất hiện trên vé bạn mua, và được hiển thị trên bàn trực tiếp của trang Chơi khi bạn ở đó.',
        key: 'Khóa',
        holds: 'Nội dung lưu',
        saved: 'Thời điểm lưu',
        wallet: 'Tiện ích ví của bạn lưu dữ liệu riêng của nó, theo chính sách của nhà phát triển.',
      },
      keys: {
        theme: {
          holds: 'Giao diện sáng hoặc tối của bạn.',
          when: 'Khi bạn đổi giao diện.',
        },
        wallet: {
          holds: 'Tên của ví bạn kết nối gần nhất và địa chỉ của nó, để ứng dụng có thể kết nối lại.',
          when: 'Khi bạn kết nối ví; bị xóa khi bạn ngắt kết nối.',
        },
        country: {
          holds: 'Lá cờ quốc gia bạn chọn cho vé, hoặc việc bạn giữ kín nó.',
          when: 'Khi bạn chọn một lá cờ.',
        },
        sound: {
          holds: 'Âm thanh đang bật hay tắt.',
          when: 'Khi bạn tắt hoặc bật âm thanh.',
        },
        lang: {
          holds: 'Ngôn ngữ bạn đã chọn, để ứng dụng không gợi ý ngôn ngữ khác cho bạn nữa.',
          when: 'Khi bạn chọn một ngôn ngữ, hoặc trả lời gợi ý đọc trang web bằng ngôn ngữ của bạn.',
        },
      },
      clear: {
        title: 'Cách xóa',
        disconnect: 'Ngắt kết nối ví trong ứng dụng để xóa {key}.',
        site: 'Xóa dữ liệu của trang web này trong phần cài đặt trình duyệt để xóa tất cả.',
        private: 'Trong cửa sổ ẩn danh, chúng bị xóa khi bạn đóng cửa sổ.',
        reset: 'Xóa chúng chỉ đặt lại các thiết lập này; vé của bạn nằm trên Solana và vẫn là của bạn.',
      },
      banner: {
        title: 'Vì sao không có banner cookie',
        body: 'Không có gì ở đây theo dõi bạn, và mọi thiết lập ở trên chỉ tồn tại vì bạn đã đặt nó. Vì vậy không có gì để chấp nhận hay từ chối.',
      },
    },

    play: {
      description: 'Tỉ lệ thắng hoạt động thế nào, và nơi tìm trợ giúp nếu việc chơi không còn vui.',
      basics: {
        title: 'Trước khi chơi',
        age: 'S☉Lucky dành cho người từ 18 tuổi trở lên, ở nơi xổ số là hợp pháp.',
        test: 'Trang web này chạy trên Solana {cluster}: vé được trả bằng SOL thử nghiệm, miễn phí và không có giá trị. Đây là một cách tốt để xem trò chơi hoạt động thế nào mà không tốn gì.',
        real: 'Trang web này chạy trên Solana Mainnet: vé được trả bằng SOL thật.',
        fun: 'Chơi để giải trí, không bao giờ để kiếm tiền hay gỡ lại số tiền đã thua.',
      },
      odds: {
        title: 'Hiểu rõ tỉ lệ thắng',
        same: 'Trong các trò xổ số, vé gần một số ngẫu nhiên nhất sẽ thắng: cơ hội của bạn là phần của dải số nằm gần các số của bạn hơn số của bất kỳ ai khác. Trong Đoán số, mỗi lần kiểm tra tìm ra con số với tỉ lệ bằng số lượt đoán mới chia cho số con số chưa được thử.',
        label: 'Không có số nào may mắn hơn số nào: số được quay ra có khả năng như nhau là bất kỳ số nào trong dải.',
        fee: 'Người thắng nhận 80% quỹ thưởng. Phí nhà cái, khoản phí mà chương trình giới hạn ở mức 20%, được trừ từ phần còn lại, và phần dư được chuyển sang vòng tiếp theo của trò chơi. Vì vậy, tính trên tất cả người chơi, vé trả lại số tiền đã bỏ ra mua chúng trừ đi khoản phí đó: tính trung bình, một vé mang lại ít hơn giá của nó.',
        nothing: 'Không có gì trên trang web thay đổi được tỉ lệ này.',
      },
      final: {
        title: 'Vé đã mua là không thể hủy',
        body: 'Vé không thể bị hủy hay hoàn tiền sau khi đã mua. Thứ duy nhất bạn nhận lại là khoản đặt cọc tiền thuê nhỏ của nó, bằng cách đóng vé sau khi vòng của nó đã được trả thưởng.',
      },
      habits: {
        title: 'Hãy giữ cho nó vui',
        budget: 'Quyết định trước bạn sẵn sàng thua bao nhiêu, và dừng lại khi đã hết.',
        chase: 'Đừng bao giờ cố gỡ lại khoản đã thua, và đừng bao giờ chơi bằng tiền đi vay hay tiền bạn cần dùng.',
        mood: 'Đừng chơi khi bạn đang buồn bực, mệt mỏi hoặc đã uống rượu bia.',
        breaks: 'Hãy nghỉ giải lao, và để việc chơi chỉ là một phần trong nhiều phần của cuộc sống.',
      },
      limits: {
        title: 'Tự đặt giới hạn cho mình',
        intro: 'S☉Lucky không có tài khoản, nên không thể đặt giới hạn hay loại trừ bạn. Bạn có thể tự đặt giới hạn:',
        wallet: 'Dùng một ví riêng chỉ chứa số tiền bạn sẵn sàng chi.',
        block:
          'Dùng công cụ chặn trang web hoặc tính năng kiểm soát của phụ huynh trên thiết bị để chặn trang web này.',
        trust: 'Nói với một người bạn tin tưởng, và nhờ họ giúp bạn giữ đúng giới hạn của mình.',
      },
      help: {
        title: 'Tìm trợ giúp',
        intro:
          'Nếu việc chơi không còn vui nữa, hoặc một người thân thiết với bạn lo lắng về điều đó, các tổ chức độc lập sau cung cấp trợ giúp miễn phí và bảo mật. Chúng tôi không liên kết với họ.',
        worldwide: 'Toàn cầu: các buổi gặp mặt và đầu mối liên hệ theo quốc gia.',
        us: 'Hoa Kỳ.',
        uk: 'Vương quốc Anh.',
        emergency: 'Nếu bạn hoặc người khác đang gặp nguy hiểm tức thời, hãy gọi số khẩn cấp tại địa phương.',
      },
    },
  },
};

export default vi;
