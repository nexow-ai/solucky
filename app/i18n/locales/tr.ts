/** Turkish: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const tr: Dict = {
  meta: {
    title: 'S☉Lucky: Solana’da piyango oyunları',
    description:
      'Günlük ya da saatlik piyangoda bir sayı seçin veya gizli sayının peşine düşün. Kazanan, havuzun %80’ini alır. Her bilet, havuz ve çekiliş Solana’da yer alır ve herkes tarafından kontrol edilebilir.',
    ogImageAlt: 'S☉Lucky, Solana’da piyango oyunları',
  },

  nav: {
    play: 'Oyna',
    how: 'Nasıl çalışır',
    fairness: 'Adillik',
    faq: 'SSS',
  },

  lang: {
    label: 'Dil',
    choose: 'Dil: {name}',
  },

  update: {
    title: 'Yeni bir sürüm hazır',
    hint: 'Hemen almak için yeniden yükleyin. Bir sonraki sayfa geçişinde kendiliğinden de yüklenir.',
    reload: 'Yeniden yükle',
  },

  install: {
    label: 'Uygulamayı yükle',
    ios: 'S☉Lucky’yi yüklemek için tarayıcınızın Paylaş menüsünü açın ve Ana Ekrana Ekle’yi seçin.',
  },

  push: {
    on: 'Bu oyunun bir turu kazanıldığında bana haber ver',
    off: 'Bu oyunun bildirimlerini kapat',
    enabled: 'Bildirimler açık',
    enabledHint: '{game}: Her tur kazanıldığında bir bildirim alacaksınız.',
    disabled: 'Bildirimler kapalı',
    blocked: 'Bu site için bildirimler engellenmiş. Tarayıcınızın ayarlarından izin verin, sonra yeniden deneyin.',
    failed: 'Bildirimler değiştirilemedi. Yeniden deneyin.',
    lottery: 'Tur {round}: {drawn} çekildi. En yakın bilet, {winning}, ◎{prize} kazanıyor.',
    guess: 'Tur {round}: Sayı {winning} idi. Onu bulan tahmin ◎{prize} kazanıyor.',
  },

  header: {
    beta: 'Beta',
    getSol: 'SOL alın',
    faucetTip: 'Geçici beta faucet’i: oynamak için ücretsiz test SOL alın',
    mute: 'Sesleri kapatın',
    unmute: 'Sesleri açın',
  },

  faucet: {
    connectFirst: 'Önce bir cüzdan bağlayın',
    connectFirstHint: 'Ardından cüzdanınıza test SOL yüklemek için “SOL alın” düğmesine dokunun.',
    request: 'Faucet üzerinden test SOL isteyin',
    requestHint: 'Cüzdan adresiniz kopyalandı. Alan boşsa yapıştırın, ardından onaylayın.',
    openAgain: 'Yeniden açın',
    airdropped: '◎1 airdrop edildi',
    airdroppedHint: 'Test SOL {cluster} ağına ulaştı. Artık bilet alabilirsiniz.',
    failed: 'Airdrop başarısız oldu',
    slow: 'Airdrop kabul edildi ancak bakiye henüz güncellenmedi. Birazdan sayfayı yenileyin.',
  },

  footer: {
    license: 'MIT Lisansı',
    program: '{cluster} üzerindeki program: {address}.',
    age: 'Yalnızca 18 yaş ve üzeri. Eğlence için ve yalnızca piyangoların yasal olduğu yerlerde oynayın.',
    legal: 'Yasal',
    languages: 'Diller',
    source: 'Kaynak kod',
    builtOn: '{solana} üzerinde geliştirildi',
    madeBy: '{nexow} tarafından yapıldı',
  },

  home: {
    kicker: 'Solana’da piyango oyunları',
    title: 'Bir sayı seçin.',
    titleEnd: 'Gece yarısı kazanın.',
    lead: 'Her gün bir çekiliş, her saat bir çekiliş ve bulunmayı bekleyen gizli bir sayı. Kazanan, havuzun %80’ini alır; kalanı bir sonraki tura aktarılır. Her bilet, her lamport ve her çekiliş Solana’da yer alır; orada herkes kontrol edebilir.',
    playNow: 'Hemen oynayın',
    howItWorks: 'Nasıl çalışır',
    program: 'Program',
    cluster: 'Ağ',
    draw: 'Çekiliş',
    dialCaption:
      'Her nokta bugünkü biletlerden biridir: kadranın çevresindeki yeri satın alındığı saati, merkezden uzaklığı numarasını gösterir.',

    how: {
      tag: 'Nasıl çalışır',
      title: 'Dört adım, günde bir çekiliş',
      description:
        'Turlar UTC takvimini izler: yeni tur 00:00 UTC’de açılır ve bir sonraki gece yarısının hemen ardından çekilir.',
      opens: 'Tur açılır',
      draw: 'Çekiliş',
      now: 'Şimdi',
      steps: {
        wallet: {
          title: 'Bir cüzdan bağlayın',
          description:
            'Phantom, Solflare, Backpack ya da Wallet Standard ile uyumlu herhangi bir cüzdan. Hesap yok, e-posta yok.',
          when: 'Her zaman',
        },
        number: {
          title: 'Sayınızı seçin',
          description:
            '0 ile {max} arasında herhangi bir sayı. Her sayı günde yalnızca bir bilete ait olabilir; bu yüzden çabuk olun.',
          when: 'UTC gece yarısına kadar',
        },
        pot: {
          title: 'Havuzun büyümesini izleyin',
          description:
            'Her bilet, fiyatını havuza ekler; havuz, turun Solana’daki kendi hesabında tutulur. Onu başka hiç kimse hareket ettiremez.',
          when: 'Gün boyu',
        },
        win: {
          title: 'UTC gece yarısı kazanın',
          description:
            'Rastgele bir sayı çekilir ve ona en yakın bilet havuzun %80’ini kazanır. Kasa payı kalandan düşülür; geriye kalan da ertesi güne aktarılır.',
          when: 'UTC gece yarısından hemen sonra',
        },
      },
    },

    fairness: {
      tag: 'Adillik',
      title: 'Bize güvenmeyin. Kontrol edin.',
      description: 'S☉Lucky, paranızı tutan bir sunucu değil, bir Solana programıdır. Bu kuralları onun kodu uygular.',
      rules: {
        locked: {
          title: 'Havuz programda kilitli',
          description:
            'Bilet ücretleri doğrudan turun hesabına gider. Program bu paranın yalnızca %80’ini kazanan biletin sahibine, kasa payını hazineye, kalanını da oyunun bir sonraki turuna öder. Operatör onu çekemez.',
        },
        draw: {
          title: 'Kimsenin tahmin edemeyeceği bir çekiliş',
          description:
            'Her satın alma, turun entropisine karıştırılır. Bir tur bittiğinde, birkaç saniye sonrasındaki bir slotu sabitler; o ana kadar kimsenin bilmediği bu slotun hash’i, biletlerin karşılaştırılacağı sayıyı seçer.',
        },
        anyone: {
          title: 'Herkes çalıştırabilir',
          description:
            'Kapatma, çekiliş ve ödeme herkese açıktır. Operatör yarın ortadan kaybolsa bile herhangi bir oyuncu her turu yine de tamamlayabilir.',
        },
        browser: {
          title: 'Tarayıcınızda kontrol edilebilir',
          description:
            'Her tur sayfası çekilişi herkese açık verilerden yeniden hesaplar: entropi, slot hash’i, çekilen sayı ve en yakın bilet. Aynı girdiler, aynı kazanan.',
        },
        limits: {
          title: 'Kasaya kesin sınırlar',
          description:
            'Program kazanana her zaman havuzun %80’ini öder ve kasa payını %20 ile sınırlar. Fiyat ve pay değişiklikleri yalnızca sonradan açılan turlarda geçerli olur ve bir alıcı, kendisine gösterilen fiyattan asla fazlasını ödemez.',
        },
        open: {
          title: 'Açık kaynak',
          description: 'Program, uygulama ve operatör betikleri herkese açıktır; her kural için testleri vardır.',
        },
      },
    },

    faq: {
      tag: 'SSS',
      title: 'Sorular',
      description: 'Hâlâ emin değil misiniz? Program, uygulama ve operatör betikleri açık kaynaktır.',
      readCode: 'Kodu okuyun',
      items: {
        real: {
          q: 'Bu gerçek para mı?',
          a: 'Herkese açık uygulama, SOL’un faucet.solana.com’dan alınan ücretsiz test parası olduğu Solana devnet üzerinde çalışır. Program mainnet’te de aynı şekilde çalışır, ancak gerçek parayla piyango işletmek, faaliyet gösterdiğiniz yerde gerekli lisanslara sahip olmayı gerektirir.',
        },
        price: {
          q: 'Bir bilet ne kadar?',
          a: 'Her oyunun fiyatı zincir üstünde belirlenir ve o oyunun Oyna sayfasında gösterilir. Bilet hesabı, fiyatın yanı sıra küçük bir kira depozitosu da tutar; tur ödendikten sonra bileti kapatarak bunu geri alırsınız. Bir turun ilk bileti ayrıca turun hesabının kirasını da öder; bu hesap, turun herkese açık kaydı olarak zincir üstünde kalır. Piyangolarda her bilet, sayısının orada kapladığı 4 baytın bedelini de öder.',
        },
        odds: {
          q: 'Kazanma şansım nasıl hesaplanır?',
          a: 'Piyangolarda çekilen sayıya en yakın bilet kazanır; bu yüzden şansınız, sayı aralığının sizin sayılarınıza başkalarınınkinden daha yakın olan payıdır: diğer biletlerden uzak bir sayı bu aralığın daha büyük bir kısmını kapsar. Sayıyı Tahmin Et oyununda her kontrol, sayıyı yeni tahminlerin henüz denenmemiş sayılara oranı kadar bir olasılıkla bulur.',
        },
        draw: {
          q: 'Turun çekilişini kimse yapmazsa ne olur?',
          a: 'Küçük bir bot (crank), her piyango turunu bitişinden sonraki saniyeler içinde kapatır, çekilişini yapar ve ödemesini gerçekleştirir; yeni tahminleri de birkaç saniyede bir kontrol eder. Aynısını Oyna sayfasından herkes yapabilir. Sabitlenen slot okunamayacak kadar eskirse (yaklaşık üç dakika), yeni bir slot sabitlemek için tur yeniden kapatılabilir; program buna yalnızca eski slota artık erişilemeyeceği kanıtlanabildiğinde izin verir.',
        },
        country: {
          q: 'Ülkemi neden gösteriyorsunuz?',
          a: 'S☉Lucky her zaman her biletin yanında bir bayrak göstermiştir. Ülkenizi, üçüncü taraf bir sorgulama yapmadan, barındırma hizmetimize olan bağlantınızdan öneririz; satın almadan önce değiştirebilir ya da gizli tutabilirsiniz. Ülke, biletinizle birlikte zincir üstünde saklanır.',
        },
        validator: {
          q: 'Bir doğrulayıcı çekilişte hile yapabilir mi?',
          a: 'Oyuncular yapamaz: satışlar kapandığında kazanan hash henüz mevcut değildir. Sabitlenen slotu üreten doğrulayıcı ise o bloğa neyin gireceğini seçerek ya da bloğu atlayarak sonucu etkileyebilir. Test parasıyla oynanan bir oyun için bu kabul edilebilir; gerçek paralı havuzlarda çekiliş doğrulanabilir bir rastgelelik oracle’ı kullanmalıdır ve README bunun nereye bağlanacağını açıklar.',
        },
      },
    },

    cta: {
      title: 'Bugünkü havuz sizi bekliyor',
      description: 'Henüz kimsenin almadığı bir sayı seçin. Bol şans!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Günde bir çekiliş · UTC gece yarısından sonra çekilir · Her bilet Solana’da',
    draw: 'Çekiliş',
    pot: 'Bugünkü havuz',
    toDraw: 'çekilişe kalan · {day}',
    tickets: 'bugün {n} bilet | bugün {n} bilet',
    entropy: 'Entropi · {cluster}',
    entropyTitle: 'Entropi: {hex}',
    noTickets: 'henüz bilet yok',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Yeni bilet',
    rules: {
      daily: 'Her gün 00:00 UTC’de yeni tur',
      hourly: 'Ve her saat bir tane',
      pot: 'En yakın sayı havuzun %80’ini kazanır',
      carry: 'Kalanı bir sonraki tura aktarılır',
      guess: 'Sayıyı Tahmin Et: süre sınırı yok, biri bulana kadar',
      numbers: '0 ile {max} arası sayılar',
      fee: 'Kasa payı program tarafından %20 ile sınırlı',
      anyone: 'Herkes bir turu kapatabilir, çekilişini yapabilir ve ödeyebilir',
      check: 'Her çekilişi tarayıcınızda yeniden hesaplayın',
      open: 'Açık kaynak',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Çekiliş makbuzu',
    round: 'Tur',
    noneYet: 'henüz sonuçlanan tur yok',
    tickets: 'Biletler',
    pot: 'Havuz',
    entropy: 'Entropi',
    slotHash: 'Slot hash’i · slot {slot}',
    formula: 'sha256(entropi ‖ slot hash’i ‖ slot ‖ tur) =',
    mod: 'ilk 8 bayt u64 olarak mod {count} = {drawn}',
    ticketCount: 'sayı',
    closest: 'en yakın bilet: {number}',
    number: 'Sayı',
    paidTo: 'Alıcı',
    payout: 'Ödeme',
    check: 'Bu çekilişi kontrol edin',
    roundPage: 'Tur sayfası',
    nextDraw: 'Sonraki çekiliş 00:00 UTC’den sonra',
    ok: 'Tarayıcınızda yeniden hesaplandı: aynı hash, {number} sayısı kazanır.',
    mismatch: 'Tarayıcınızda yeniden hesaplanan hash bu turla eşleşmiyor.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Biletler',
    players: 'Oyuncular',
    countries: 'Ülkeler',
    ticket: 'Bilet',
    yourTickets: 'Biletleriniz',
    winChance: 'Kazanma şansı',
    chance: 'Şans',
    todaysPot: 'Havuz',
    checked: 'Kontrol edilen',
    waiting: 'Bekleyen',
    numbersLeft: 'Kalan sayılar',
    winners: 'Kazananlar',
    averagePot: 'Ortalama havuz',
    biggestPot: 'En büyük havuz',
  },

  countdown: {
    h: 'sa',
    m: 'dk',
    s: 'sn',
    left: '{time} kaldı',
  },

  play: {
    title: 'Oyna',
    description:
      'Günlük ya da saatlik piyangoda bir sayı seçin veya gizli sayının peşine düşün ve havuzun Solana’da canlı olarak büyümesini izleyin.',
    testMoney: 'Solana {cluster} üzerinde oynuyorsunuz: biletlerin bedeli, gerçek değeri olmayan test SOL ile ödenir.',
    localFunds: 'Cüzdanınızı {url} adresine yönlendirin, ardından şu komutla bakiye yükleyin: {command}',
    phantomFunds:
      'Phantom’da: Settings → Developer Settings → Testnet Mode seçeneğini etkinleştirin → {cluster} ağını seçin. Ardından faucet’ten ücretsiz test SOL alın.',
    openFaucet: 'Faucet’i açın',
    retry: 'Tekrar deneyin',
    rpcError: 'Solana RPC uç noktasına ulaşılamadı ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Bir sayı',
    title: 'Seçin',
    win: 'Kazanın',
    in: 'kalan',
    taken: 'Bu turda zaten alınmış',
    range: '0 ile {max} arası, her sayı için bir bilet',
    pad: 'Sayı tuş takımı',
    reset: 'Sıfırlayın',
    delete: 'Son rakamı silin',
    dip: 'Rastgele sayı',
    searchCountry: 'Ülke arayın',
    country: 'Biletinizle birlikte gösterilen ülke',
    notSetUp: 'Bu oyun bu ağda henüz kurulmadı.',
    paused: 'Bilet satışları duraklatıldı.',
    buy: '◎{price} karşılığında {number} sayısını alın',
    takenToday: '{number} sayısı alınmış',
    outOfRange: 'Sayı aralık dışında',
    notEnough: 'Yeterli SOL yok',
    keys: '0–9 tuşları yazar, ⌫ siler, Enter satın alır.',
    rent: 'Bir bilet ayrıca ◎{rent} hesap kirası tutar; bunu çekilişten sonra geri alırsınız.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · kapanışa kalan',
    carried: 'Önceki turdan aktarılan ◎{carry} dahil',
    split: 'Kazanana %80 · {fee} kasa payı · kalanı bir sonraki tura',
    inPlay: 'Oyundaki sayılar',
    empty: 'Henüz bilet yok',
    beFirst: 'Bu turda bir sayı seçen ilk kişi siz olun.',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Oyunlar',
    title: 'Oynamanın üç yolu',
    description:
      'Aynı sayılar, 0 ile {max} arası. Kazanan, havuzun %80’ini alır; kasa payı kalandan düşülür, geriye kalan da bir sonraki tura aktarılır.',
    play: 'Oyna',
    daily: {
      name: 'Günlük piyango',
      short: 'Günlük',
      description: 'Her gün UTC gece yarısından sonra bir çekiliş. Çekilen sayıya en yakın bilet kazanır.',
    },
    hourly: {
      name: 'Saatlik piyango',
      short: 'Saatlik',
      description: 'Her saat başı bir çekiliş (UTC). Çekilen sayıya en yakın bilet kazanır.',
    },
    guess: {
      name: 'Sayıyı Tahmin Et',
      short: 'Tahmin',
      description:
        'Süre sınırı yok. Yeni tahminler, biri turun sayısını bulana kadar birkaç saniyede bir kontrol edilir; ardından yeni bir tur başlar.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Biri bulana kadar',
    odds: 'Her kontrol, sayıyı yeni tahminlerin henüz denenmemiş {n} sayıya oranı kadar bir olasılıkla bulur.',
    bought: '{number} tahmininiz alındı. Birkaç saniye içinde kontrol edilecek.',
    sealing: '{day} turunun son tahminleri mühürleniyor',
    checkNow: 'Şimdi kontrol edin',
    checkHint:
      'Bir bot yeni tahminleri birkaç saniyede bir kontrol eder. Kontrolü herkes çalıştırabilir; maliyeti ağ ücretleridir.',
    missed: 'Sayı bu değil: {numbers}',
    left: 'Sayı, henüz denenmemiş {n} sayıdan biri.',
    foundByYou: 'Buldunuz! Sayı {number} idi',
    foundByOther: 'Başka bir oyuncu sayıyı buldu',
    nextRound: 'Yeni bir sayıyla yeni bir tur satışta.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Geçmiş',
    total: 'Toplam',
    games: 'oyun | oyun',
    waiting: 'Çekiliş bekleniyor',
    settle: 'Sonuçlandırın',
    settleDay: '{day} turunu sonuçlandırın',
    anyone:
      'Biten bir turu herkes kapatabilir, çekilişini yapabilir ve ödemesini gerçekleştirebilir. Bunun maliyeti yalnızca ağ ücretleridir; ödül her zaman kazanana gider.',
    rent: '{n} eski bilette ◎{sol} kira duruyor | {n} eski bilette ◎{sol} kira duruyor',
    rentHint: 'O SOL’u geri almak için biletleri kapatın. Tur, sonuçlarını korur.',
    getBack: 'Geri alın',
    winners: 'Kazananlar',
    noWinners: 'Henüz kazanan yok',
    firstDraw: 'İlk kazanan burada görünecek.',
    chart: 'Tur başına havuz',
    chartEmpty: 'Henüz biten tur yok.',
    chartLabel:
      'Son turun havuzu; tüm değerler aşağıdaki listede. | Son {n} turun havuzu; tüm değerler aşağıdaki listede.',
  },

  status: {
    open: 'Açık',
    toClose: 'Kapanış bekleniyor',
    toDraw: 'Çekiliş bekleniyor',
    checking: 'Tahminler kontrol ediliyor',
    unpaid: 'Çekildi, ödenmedi',
    paid: 'Ödendi',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Canlı',
    connecting: 'Bağlanıyor',
    offline: 'Çevrimdışı',
    atTable: 'Masada {n} kişi',
    picking: '{n} kişi seçiyor | {n} kişi seçiyor',
    you: 'siz',
    joined: 'katıldı',
    now: 'şimdi',
    empty: 'Masa açık. Bir sonraki bilet, alındığı anda burada görünür.',
    joinedOne: 'Masaya yeni bir oyuncu katıldı',
    joinedMany: 'Masaya {n} yeni oyuncu katıldı | Masaya {n} yeni oyuncu katıldı',
    hereNow: 'Şu an burada {n} kişi',
    locked: '{who}: {number} sayısı kilitlendi',
    potNow: 'Havuz {n} biletle ◎{pot} oldu | Havuz {n} biletle ◎{pot} oldu',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Cüzdanınızda onaylayın…',
    done: '{label}: tamamlandı',
    cancelled: '{label}: iptal edildi',
    failed: '{label}: başarısız oldu',
    view: 'İşlemi görüntüleyin',
    buying: '{number} sayısı alınıyor',
    bought: '{number} sayısı artık sizin. Bol şans!',
    repin: '{day} turunun çekiliş slotu yeniden sabitleniyor',
    closing: '{day} turu kapatılıyor',
    drawing: '{day} turunun çekilişi yapılıyor',
    paying: '{day} turunun kazananına ödeme yapılıyor',
    paid: '{day} turunun kazananına ◎{amount} ödendi',
    settleFailed: '{day} turu sonuçlandırılamadı',
    reclaiming: 'Bilet kirası iade ediliyor',
    slowSlot: 'Ağ, çekiliş slotuna ulaşmakta yavaş. Bir dakika sonra tekrar deneyin.',
    noWinner: 'Kazanan bilet bulunamadı.',
  },

  wallet: {
    connect: 'Cüzdan bağlayın',
    title: 'Bir cüzdan bağlayın',
    description: 'Wallet Standard destekli her Solana cüzdanı çalışır.',
    none: 'Bu tarayıcıda Solana cüzdanı bulunamadı. Bir tane kurun, ardından sayfayı yenileyin:',
    failed: '{wallet} bağlanamadı',
    copied: 'Adres kopyalandı',
    balance: 'Bakiye',
    ticketsLeft: '{n} bilete yeter | {n} bilete yeter',
    needMore: 'oynamak için daha fazla SOL gerekli',
    numbers: 'Bu turdaki sayılarınız',
    copy: 'Adresi kopyalayın',
    explorer: 'Explorer',
    play: 'Oyna',
    disconnect: 'Bağlantıyı kesin',
  },

  round: {
    title: '{day} turu',
    back: 'Oyuna dönün',
    notDate:
      'Bu, bu oyunun bir turu değil. Günlük turlar YYYY-MM-DD, saatlik turlar YYYY-MM-DDTHH biçiminde, Sayıyı Tahmin Et turları ise numaralarıyla adlandırılır.',
    kicker: 'Tur',
    nobody: 'Bu turda kimse oynamadı',
    beFirst: 'Bu turda bilet alan ilk kişi siz olun.',
    onlyExists: 'Bir tur ancak ilk bileti satıldığında var olur.',
    pot: 'Havuz',
    usd: 'bugünkü fiyatla {usd}',
    winner: 'Kazanan',
    won: 'Kazanç ◎{payout} · kasa payı ◎{fee}',
    unpaid: 'Henüz ödenmedi',
    anyone: 'Bu turu herkes tamamlayabilir. Bunun maliyeti yalnızca ağ ücretleridir.',
    settle: 'Bu turu sonuçlandırın',
    sold: 'Satılan biletler',
    price: 'Bilet fiyatı',
    fee: 'Kasa payı',
    slot: 'Sabitlenen slot',
    check: 'Çekilişi kontrol edin',
    formula: 'rastgelelik = sha256(entropi ‖ slot hash’i ‖ çekiliş slotu ‖ tur adresi)',
    recompute: 'Tarayıcımda yeniden hesapla',
    entropy: 'Entropi (her satın alma, sırayla hash’lenmiş)',
    slotHash: '{slot} numaralı slotun hash’i (program tarafından SlotHashes sysvar’ından okunur)',
    randomness: 'Rastgelelik',
    winning: 'Kazanan bilet',
    winningFormula: 'ilk 8 bayt u64 olarak mod {count} = {drawn}; en yakın biletin sayısı {number}',
    guessFormula:
      'ilk 8 bayt u64 olarak mod {left} (henüz denenmemiş sayılar) = {r}, {batch} değerinin altında (kontroldeki tahminler): #{index} numaralı satın alma sayıyı buldu',
    ok: 'Çekiliş doğrulandı.',
    mismatch: 'Uyuşmazlık: kayıtlı sonuç girdilerle eşleşmiyor.',
    got: 'Tarayıcınızın sonucu: {hash}… ve {number} sayısı.',
    tickets: 'Biletler',
    ticketsHint: 'Ödemeden sonra sahipleri tarafından kapatılan biletler artık burada görünmez; tur, toplamları korur.',
    noTickets: 'Bu tur için açık bilet kalmadı.',
    account: 'Tur hesabı {address} · {day}',
  },

  country: {
    private: 'Gizli',
  },

  errors: {
    rejected: 'İsteği cüzdanınızda iptal ettiniz.',
    taken: 'Bu sayı bu turda başka birine ait. Başka bir sayı seçin.',
    funds: 'Cüzdanda yeterli SOL yok.',
    walletCluster:
      'Cüzdanınız imzalayamadı. Phantom’da: Settings → Developer Settings → Testnet Mode seçeneğini etkinleştirin → Devnet’i seçin; ardından yeniden bağlanıp tekrar deneyin.',
    unknown: 'Bir şeyler ters gitti.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Bunu yalnızca yetkili yapabilir.',
      invalidTicketPrice: 'Bilet fiyatı en az 0,002 SOL olmalıdır.',
      feeTooHigh: 'Kasa payı %20 sınırının üzerinde.',
      invalidMaxNumber: 'En yüksek sayı sıfırdan büyük olmalıdır.',
      paused: 'Bilet satışları duraklatıldı.',
      wrongRound: 'Biletler yalnızca satıştaki tur için alınabilir.',
      numberOutOfRange: 'Sayı aralık dışında.',
      invalidCountry: 'Ülke, büyük harfli bir ISO 3166-1 alpha-2 kodu olmalıdır.',
      roundNotOpen: 'Tur açık değil.',
      roundNotOver: 'Tur henüz bitmedi.',
      roundAlreadyDrawn: 'Turun çekilişi zaten yapıldı.',
      drawStillPossible: 'Sabitlenen slot ile hâlâ çekiliş yapılabilir.',
      roundNotClosed: 'Tur kapalı değil.',
      targetSlotNotReached: 'Sabitlenen slota henüz ulaşılmadı.',
      randomnessUnavailable:
        'Sabitlenen slotun hash’i henüz okunamıyor; birazdan tekrar deneyin ya da süresi dolduğunda turu yeniden kapatın.',
      roundNotDrawn: 'Turun çekilişi yapılmadı.',
      notWinningTicket: 'Bu, kazanan bilet değil.',
      roundNotSettled: 'Tur sonuçlandırılmadı.',
      overflow: 'Aritmetik taşma.',
      priceChanged: 'Bilet fiyatı, kabul ettiğiniz fiyattan yüksek.',
      feeAlreadyCollected: 'Bu turun kasa payı zaten tahsil edildi.',
      roundFull: 'Bu tur, alabileceği tüm biletleri sattı.',
      nothingToCheck: 'Kontrol edilecek yeni tahmin yok.',
      batchSealed: 'Son tahminler kontrol ediliyor; birkaç saniye sonra tekrar deneyin.',
      invalidGame: 'Bilinmeyen oyun.',
    },
  },

  legal: {
    kicker: 'Yasal',
    updated: 'Son güncelleme: {date}',
    onThisPage: 'Bu sayfada',
    others: 'Diğer yasal belgeler',
    translated:
      'Bu sayfa, İngilizce aslının bir çevirisidir. Aralarında fark olması hâlinde İngilizce sürüm geçerlidir.',
    readEnglish: 'İngilizcesini okuyun',
    repository: 'kaynak kod deposu',

    pages: {
      notice: {
        label: 'Yasal bilgiler',
        description: 'S☉Lucky’yi kimin işlettiği, bize nasıl ulaşabileceğiniz ve geçerli belgeler.',
      },
      terms: {
        label: 'Kullanım Koşulları',
        description: 'Siteyi kullanma ve oynama kuralları; programın neyi vaat ettiği ve neyi etmediği.',
      },
      privacy: {
        label: 'Gizlilik Politikası',
        description: 'Solana’da neyin herkese açık olduğu, sunucularımızın neyi gördüğü ve neyi asla toplamadığımız.',
      },
      cookies: {
        label: 'Çerezler ve depolama',
        description: 'Çerez yok, izleyici yok: uygulamanın tarayıcınızda sakladığı beş ayar.',
      },
      play: {
        label: 'Sorumlu oyun',
        description: 'Şansın nasıl işlediği ve oynamak eğlenceli olmaktan çıkarsa nereden yardım alabileceğiniz.',
      },
    },

    notice: {
      description:
        'S☉Lucky’yi kimin işlettiği, bize nasıl ulaşabileceğiniz ve onu kullandığınızda geçerli olan belgeler.',
      operator: {
        title: 'S☉Lucky’yi kim işletiyor',
        body: 'S☉Lucky, {operator} tarafından yapılır ve işletilir. Bize {email} adresinden e-postayla ulaşabilir, hakkımızda daha fazla bilgiyi {site} adresinde bulabilirsiniz.',
      },
      software: {
        title: 'Program ve site',
        intro: 'S☉Lucky iki bölümden oluşur:',
        program:
          '{name}: biletleri satan, her günün havuzunu tutan ve kazanana ödeme yapan bir Solana programı. Bu site, Solana {cluster} üzerinde {address} adresindeki programı kullanır. Herkes onu bu site olmadan, doğrudan kullanabilir.',
        programName: 'Program',
        site: '{name}: programın herkese açık verilerini gösterir ve kendi cüzdanınızdan işlem göndermenize yardımcı olur. Anahtarlarınızı ya da SOL’unuzu asla tutmaz.',
        siteName: 'Bu site',
      },
      documents: {
        title: 'Belgeler',
        intro: 'Siteyi kullanmak, şu belgeleri kabul etmek anlamına gelir:',
      },
      security: {
        title: 'Güvenlik açığı bildirme',
        body: 'Lütfen herkese açık bir issue açmayın. {email} adresine {subject} konulu bir e-posta gönderin ve asla diğer oyuncuların fonları üzerinde test yapmayın: devnet ya da yerel bir doğrulayıcı kullanın. {repository} içindeki {file} dosyası olan güvenlik politikası, neleri eklemeniz gerektiğini ve nelerin kapsamda olduğunu açıklar.',
      },
      license: {
        title: 'Açık kaynak lisansı',
        body: 'Program, uygulama ve operatör betikleri MIT Lisansı altında açık kaynaktır ({repository} içindeki {file} dosyası), © {years} {operator}. Lisans kodu kapsar; bu sitenin kullanımını ise {terms} kapsar.',
      },
    },

    terms: {
      description: 'S☉Lucky’yi kullanma kuralları; programının neyi vaat ettiği ve neyi etmediği.',
      agreement: {
        title: 'Bu koşullar',
        p1: 'Bu koşullar, {operator} (“biz”) tarafından işletilen S☉Lucky web sitesini ve uygulamasını kullandığınızda geçerlidir. Siteyi kullanarak bu koşulları {privacy} ve {cookies} sayfasıyla birlikte kabul etmiş olursunuz. Kabul etmiyorsanız siteyi kullanmayın.',
        p2: 'Oyunun kendisi bir Solana programıdır: sunucularımızda değil, Solana ağında çalışan açık kaynaklı bir yazılım. Site, onu kullanmanın yollarından biridir; programı herkes doğrudan da kullanabilir.',
      },
      eligibility: {
        title: 'Kimler oynayabilir',
        age: '18 yaşında veya daha büyük olmalısınız.',
        legal:
          'Yalnızca piyangoların ve çevrim içi şans oyunlarının sizin için yasal olduğu yerlerde oynayabilirsiniz. Bunu kontrol etmek sizin sorumluluğunuzdadır; nerede olduğunuzu biz kontrol etmeyiz.',
        own: 'Başkası adına ya da size ait olmayan SOL ile oynamayın.',
      },
      money: {
        title: 'Test SOL ve gerçek SOL',
        test: 'Bu site {cluster} üzerinde çalışır. Biletlerin bedeli test SOL ile ödenir; test SOL bir faucet’ten ücretsiz alınır ve hiçbir değeri yoktur: gerçek parayla takas edilemez, onunla kazandığınız hiçbir şey de takas edilemez.',
        real: 'Bu site {cluster} üzerinde çalışır. Biletlerin bedeli gerçek SOL ile ödenir ve havuzlar gerçek SOL olarak ödenir.',
      },
      rounds: {
        title: 'Bir tur nasıl işler',
        intro: 'Bu kuralları program uygular; site yalnızca gösterir:',
        day: 'S☉Lucky’de üç oyun vardır. Günlük piyangoda her UTC gününde, 00:00 UTC’den bir sonraki gece yarısına kadar bir tur sürer; saatlik piyangoda ise her UTC saatinde. Sayıyı Tahmin Et oyununda bir turun bitiş zamanı yoktur: bir tahmin sayısını bulana kadar sürer.',
        number:
          'Bir bilet, 0 ile programın yapılandırmasında belirlenen en yüksek sayı arasındaki tek bir sayıdır. Her sayı, tur başına yalnızca bir bilete ait olabilir.',
        price:
          'Her oyunun kendi bilet fiyatı ve kasa payı vardır. Bunlar, bir tur açıldığında en yüksek sayıyla birlikte kopyalanır ve o tur boyunca sabit kalır. Kasa payı hiçbir zaman havuzun %20’sinden fazla olamaz. Satın alırken, size gösterilen fiyattan asla fazlasını ödemezsiniz.',
        pot: 'Her biletin fiyatı, turun Solana’daki kendi hesabında tutulan tur havuzuna girer. Piyangolarda 0 ile en yüksek sayı arasında rastgele bir sayı çekilir ve ona en yakın bilet kazanır; eşitlik durumunda küçük sayı kazanır. Sayıyı Tahmin Et oyununda yeni tahminler gruplar hâlinde kontrol edilir: bir grubun sayıyı içerme olasılığı, tahminlerinin henüz denenmemiş sayılara oranıdır; bu, tur açılırken gizlenmiş bir sayı için geçerli olasılığın aynısıdır.',
        draw: 'Bir piyango turu sona erdiğinde ya da yeni tahminler kontrol beklemeye başlar başlamaz, herkes turu kapatabilir, çekilişini yapabilir ve ödemesini gerçekleştirebilir. Kazanan biletin sahibi havuzun %80’ini alır, kasa payı hazineye gider ve kalanı, oyunun çekilecek bir sonraki turu için programda kalır.',
        rent: 'Bir bilet hesabı ayrıca küçük bir kira depozitosu tutar; bileti, turu ödendikten sonra kapatarak bunu geri alırsınız. Bir turun ilk bileti, turun hesabının kirasını da öder; bu hesap, turun herkese açık kaydı olarak Solana’da kalır. Piyangolarda her bilet, sayısının bu hesapta kapladığı 4 baytın kirasını da öder; bu kira iade edilmez.',
      },
      wallet: {
        title: 'Cüzdanınız ve işlemleriniz',
        own: 'Kendi cüzdanınızla oynarsınız. Anahtarlarınızı, SOL’unuzu ya da biletlerinizi asla tutmayız ve bunları hareket ettiremeyiz.',
        sign: 'Her işlemi kendiniz imzalarsınız ve Solana’nın ağ ücretlerini siz ödersiniz. Onaylanmış işlemler kesindir: bunları iptal edemez, geri çeviremez ya da iade edemeyiz.',
        public:
          'Bir biletin sayısı, sahibinin adresi ve bilet için seçtiğiniz ülke bayrağı Solana’da kalıcı olarak herkese açıktır. Bunun ne anlama geldiğini {privacy} açıklar.',
        keys: 'Cüzdanınızın anahtarlarını güvende tutun. Biz dahil hiç kimse onları sizin için kurtaramaz.',
      },
      operator: {
        title: 'Operatörün yapabildikleri ve yapamadıkları',
        intro: 'Programın yapılandırmasında bir yetkili tanımlıdır; yetkili şunları yapabilir:',
        price:
          'her oyunun bilet fiyatını (en az ◎0,002) ve kasa payını (en fazla %20) değiştirmek; değişiklik, o oyunun açılacak bir sonraki turundan itibaren geçerli olur;',
        pause:
          'bilet satışlarını duraklatmak ve yeniden başlatmak. Duraklatma yalnızca yeni biletleri durdurur: zaten oynanmış turların çekilişi ve ödemesi yine yapılabilir;',
        other: 'hazineyi, en yüksek sayıyı ve yetkilinin kendisini değiştirmek.',
        cannot:
          'Programın kodu, yetkilinin ya da başka birinin bir turun havuzunu almasına veya onu kazanan biletin sahibi, hazinenin kasa payı ve oyunun bir sonraki turu dışında bir yere göndermesine, kasa payından fazlasını almasına ya da bir alıcıdan kendisine gösterilen fiyattan fazlasını tahsil etmesine izin vermez.',
        upgrade:
          'Program yükseltilebilir: yükseltme yetkisini elinde tutan kişi farklı bir kod dağıtabilir; bu nedenle program değiştirilemez hâle getirilene ya da bir multisig’e devredilene kadar o kişiye güvenmiş olursunuz. Her sürümün kaynak kodu herkese açıktır ve dağıtılmış bir program, README’nin “Verifiable builds” bölümünde açıklandığı şekilde bu kaynakla karşılaştırılarak kontrol edilebilir.',
      },
      risks: {
        title: 'Riskler',
        intro: 'Oynayarak şunları kabul etmiş olursunuz:',
        bugs: 'program, uygulama ve cüzdanınız dahil yazılımlarda hata olabilir ve bir hata biletlerinizi ya da SOL’unuzu kaybetmenize yol açabilir;',
        network:
          'Solana ya da sitenin kullandığı RPC uç noktası yavaş, yoğun ya da kapalı olabilir ve bir işlem başarısız olabilir ya da tur kapandıktan sonra ulaşabilir;',
        draw: 'çekiliş, bir tur kapandığında ya da bir tahmin grubu mühürlendiğinde kimsenin bilmediği bir Solana slotunun hash’ini kullanır. Oyuncular bunu tahmin edemez, ancak o slotu üreten doğrulayıcı sonucu etkileyebilir ve bir turu kapatan kişi, elverişsiz bir çekilişi o slot artık okunamayana kadar bekletebilir. Bu, doğrulanabilir bir rastgelelik oracle’ı değildir;',
        site: 'site herhangi bir zamanda erişilemez olabilir. Program ve biletleriniz onsuz da çalışmaya devam eder;',
        law: 'piyangolar ve kripto varlıklarla ilgili yasalar ülkeden ülkeye farklıdır ve değişebilir.',
      },
      use: {
        title: 'Siteyi adil kullanmak',
        body: 'Siteye veya sunucularına saldırmayın, onları aşırı yüklemeyin, sınırlarını aşmaya çalışmayın, diğer oyunculara müdahale etmeyin ya da siteyi yasaları çiğnemek için kullanmayın. Bunu yapan herkesin erişimini engelleyebiliriz.',
      },
      liability: {
        title: 'Garanti yok',
        body: 'Site ve program, hiçbir garanti olmaksızın “olduğu gibi” sunulur. Yasanın izin verdiği ölçüde; kaybedilen biletler, başarısız ya da gecikmiş işlemler, hatalar, ağ sorunları veya adil bulmadığınız bir çekiliş dahil, bunların kullanımından doğan hiçbir kayıptan sorumlu değiliz. Bu koşullardaki hiçbir hüküm, yasanın sınırlamamıza izin vermediği bir sorumluluğu sınırlamaz.',
      },
      openSource: {
        title: 'Açık kaynak',
        body: 'Program, uygulama ve operatör betikleri MIT Lisansı altında açık kaynaktır: bkz. {repository}. Bu lisans kodu kapsar; bu koşullar ise bu sitenin kullanımını kapsar.',
      },
      changes: {
        title: 'Değişiklikler',
        body: 'Bu koşulları güncelleyebiliriz. En üstteki tarih son değişikliği gösterir ve burada gösterilen sürüm o tarihten itibaren geçerlidir.',
      },
      contact: {
        title: 'İletişim',
        body: 'Bu koşullarla ilgili sorular için: {email}.',
      },
    },

    privacy: {
      description: 'Solana’da neyin herkese açık olduğu, sunucularımızın neyi gördüğü ve neyi asla toplamadığımız.',
      summary: {
        title: 'Kısaca',
        account: 'Hesap, e-posta ya da kayıt yok. Bir cüzdanla oynarsınız.',
        cookies: 'Site hiçbir çerez yerleştirmez; analiz, reklam ya da izleme aracı yüklemez.',
        database: 'Oyunculara ait bir veritabanı tutmayız ve sizinle ilgili verileri satmayız ya da paylaşmayız.',
        public:
          'Biletleriniz tasarım gereği Solana’da herkese açıktır: oyunu herkesin kontrol edebilmesini sağlayan şey budur.',
        controller: 'Siteyi {operator} işletir ve sitenin işlediği verilerden sorumludur.',
      },
      onChain: {
        title: 'Solana’da neler herkese açık',
        intro: 'Bir bilet aldığınızda işlem ve biletin hesabı, şunları herkese açık olarak kaydeder:',
        address: 'cüzdan adresiniz ve imzaladığı işlemler;',
        number: 'seçtiğiniz sayı, tur ve satın alma zamanı;',
        flag: 'bilet için seçtiğiniz ülke bayrağı ya da ülkenizi gizli tutuyorsanız hiçbiri.',
        ledger:
          'Bir turun çekilişi yapıldığında, turun hesabı ayrıca kazananın adresini, kazanan sayıyı ve bayrağını ve ödeme tutarını kaydeder. Solana herkese açık bir defterdir: bu verileri herkes okuyabilir, birçok kişi kopyalarını saklar ve veriler orada kalıcı olarak kalır. Bir bileti kapatmak hesabını siler ve kirasını iade eder, ancak onu oluşturan ve kapatan işlemler defterde kalır. Ne biz ne de bir başkası bunları değiştirebilir veya silebilir.',
        link: 'Bir cüzdan adresi adınız değildir, ancak örneğin kullandığınız bir borsa aracılığıyla sizinle ilişkilendirilebilir. Oyununuzu diğer etkinliklerinizden ayrı tutmak istiyorsanız ayrı bir cüzdan kullanın.',
      },
      servers: {
        title: 'Sunucularımız neleri görür',
        visit: 'Her ziyaret',
        visitBody:
          'Site Cloudflare üzerinde barındırılır. Her web sitesi gibi, sayfaları sunmak ve siteyi kötüye kullanıma karşı korumak için IP adresinizi, tarayıcınızın user agent bilgisini ve istediğiniz sayfaları alır. Cloudflare operasyonel kayıtları {policy} kapsamında sınırlı bir süre saklar. Biz bunları yalnızca siteyi çalıştırmak ve sorunlarını gidermek için kullanırız.',
        policy: 'kendi gizlilik politikası',
        country: 'Ülkeniz',
        countryBody:
          'Cloudflare, sunucumuza her isteğin hangi ülkeden geldiğini bildirir. Uygulama, biletlerinizin bayrağını önermek için bunu bir kez sorar; satın almadan önce değiştirebilir ya da gizli tutabilirsiniz. Sunucu yalnızca ülkeyi okur, IP adresinizi okumaz ve ülkeyi saklamaz.',
        live: 'Oyna sayfasındaki canlı masa',
        liveBody:
          'Oyna sayfası açıkken tarayıcınız, oyuncuların orada başka kimlerin olduğunu görebilmesi için sunucumuzla bir bağlantı sürdürür. Bu bağlantı, sayfadaki diğer kişilerle üç şey paylaşır: yalnızca o bağlantıya özgü rastgele bir kimlik, biletlerinizin gösterdiği bayrak (ülkenizi gizli tutuyorsanız hiçbiri) ve bir sayı girip girmediğiniz; sayının kendisi asla paylaşılmaz. Buna hiçbir cüzdan adresi ya da IP adresi dahil edilmez ve bağlantıyla ilgili hiçbir şey kaydedilmez ya da bağlantı kapandıktan sonra saklanmaz.',
        price: 'SOL fiyatı',
        priceBody:
          'Havuzları dolar cinsinden göstermek için sunucumuz SOL fiyatını Coinbase’den, Coinbase yanıt vermezse CoinGecko’dan alır ve bir dakika boyunca önbellekte tutar. Bu istekler sunucumuzdan gelir ve sizinle ilgili hiçbir bilgi taşımaz.',
        push: 'Çekiliş bildirimleri',
        pushBody:
          'Bir oyun için bildirimleri açarsanız, tarayıcınız sunucumuza bir anlık bildirim aboneliği verir: tarayıcınızın anlık bildirim hizmetindeki bir adres (tarayıcıya göre Google, Mozilla, Apple veya Microsoft tarafından işletilir) ve ona gönderilecek mesajları şifrelemek için anahtarlar. Bunu dilinizle ve seçtiğiniz oyunlarla birlikte saklarız, başka hiçbir şeyi değil: cüzdan adresi yok, IP adresi yok. Bu oyunlardan birinin bir turu kazanıldığında sunucumuz sonucu şifreli olarak bu hizmet üzerinden gönderir; hizmet de onu kendi politikası kapsamında tarayıcınıza iletir. Bildirimleri kapatmak aboneliği siler; anlık bildirim hizmeti aboneliğin artık var olmadığını bildirdiğinde de onu sileriz.',
      },
      thirdParties: {
        title: 'Tarayıcınızın kullandığı hizmetler',
        rpc: '{name} ({endpoint}): uygulama oyunu buradan okur ve işlemlerinizi buradan gönderir. Bu uç nokta, operatörünün politikası kapsamında IP adresinizi ve uygulamanın sorguladığı hesapları (cüzdanınızı bağladıktan sonra cüzdanınızınki de dahil) alır.',
        rpcName: 'Bir Solana RPC uç noktası',
        rpcHost: 'bu sitedeki {host}',
        rpcPublic: 'Solana’nın {cluster} için herkese açık uç noktası',
        wallet:
          '{name} (Phantom, Solflare ya da Backpack gibi): kendi üreticisinin yazılımıdır ve kendi politikasına tabidir. Site ondan yalnızca bağlanmasını ve onayladığınız işlemleri imzalamasını ister.',
        walletName: 'Cüzdanınız',
        links:
          '{name}: Solana Explorer, Solana faucet sitesi, GitHub ve sosyal medya hesaplarımız, kendi politikaları olan başka sitelerdir.',
        linksName: 'Açtığınız bağlantılar',
        own: 'Yazı tipleri, sesler ve görseller kendi alan adımızdan gelir; bu yüzden siteyi yüklemek başka hiç kimseyle bağlantı kurmaz.',
      },
      browser: {
        title: 'Tarayıcınızda neler kalır',
        body: 'Uygulama, tarayıcınızın yerel depolamasında beş ayar saklar: temanız, son cüzdanınız, ülke tercihiniz, ses ayarı ve diliniz. {cookies} sayfası bunları listeler.',
        cache:
          'Uygulama, bağlantı olmadan da açılabilmek için ziyaret ettiğiniz sayfaların ve kendi dosyalarının kopyalarını tarayıcınızın önbellek deposunda da saklar. Sitenin her yeni sürümü bunların yerini alır.',
      },
      purposes: {
        title: 'Neden ve asla yapmadıklarımız',
        body: 'Yukarıdaki verileri yalnızca siteyi göstermek, oynamak istediğiniz oyunu çalıştırmak, siteyi güvende tutmak ve sorunları gidermek için işleriz. Profil oluşturmayız, reklam göstermeyiz, veri satmayız ve verileri reklamverenlerle paylaşmayız.',
      },
      rights: {
        title: 'Seçenekleriniz ve haklarınız',
        flag: 'Ülke bayrağı olmadan oynayabilirsiniz: satın almadan önce ülkenizi gizli tutmayı seçin.',
        clear:
          'Tarayıcınızdaki ayarları istediğiniz zaman silebilir, dilediğiniz zaman yeni bir cüzdan kullanabilirsiniz.',
        law: 'Yaşadığınız yere bağlı olarak, hakkınızdaki kişisel verilere erişme, bunları düzeltme veya silme ya da nasıl kullanıldıklarına itiraz etme hakkınız olabilir. {email} adresine e-posta gönderin, size yanıt verelim. Hakkınızda neredeyse hiçbir şey tutmuyoruz ve Solana’da olanı değiştiremez ya da silemeyiz.',
      },
      children: {
        title: 'Çocuklar',
        body: 'S☉Lucky, 18 yaş ve üzeri kişiler içindir. Daha küçük yaştaki hiç kimseye ait verileri bilerek işlemeyiz.',
      },
      changes: {
        title: 'Değişiklikler ve iletişim',
        body: 'Site verileri işleme biçimini değiştirdiğinde bu sayfayı güncelleyeceğiz; en üstteki tarih son değişikliği gösterir. Sorular için: {email}.',
      },
    },

    cookies: {
      description:
        'Çerez yok, izleyici yok: uygulamanın tarayıcınızda sakladığı beş ayar ve bunları nasıl kaldıracağınız.',
      none: {
        title: 'Çerez yok',
        p1: 'S☉Lucky hiçbir çerez yerleştirmez ve hiçbir analiz, reklam ya da izleme betiği yüklemez. Sitenin güvenlik politikası yalnızca kendi alan adından gelen betiklere izin verir.',
        p2: 'Barındırma sağlayıcımız Cloudflare, bot koruması açıkken {cookie} gibi kesinlikle gerekli güvenlik çerezleri yerleştirebilir. Cloudflare bunları, {list} açıkladığı gibi, insanları botlardan ayırt etmek için kullanır.',
        list: 'kendi çerez listesinde',
      },
      storage: {
        title: 'Uygulamanın tarayıcınızda sakladıkları',
        intro:
          'Uygulama, bir sonraki ziyaretinizde de yerinde olmaları için birkaç ayarı tarayıcınızın yerel depolamasına kaydeder. Bunlar cihazınızda kalır, tek bir istisna dışında: seçtiğiniz bayrak, satın aldığınız biletlere eklenir ve siz oradayken Oyna sayfasındaki canlı masada gösterilir.',
        key: 'Anahtar',
        holds: 'Ne içerir',
        saved: 'Kayıt zamanı',
        wallet: 'Cüzdan eklentiniz kendi verilerini, üreticisinin politikası kapsamında kendisi saklar.',
        cache:
          'Uygulama, bağlantı olmadan da açılabilmek için ziyaret ettiğiniz sayfaların ve kendi dosyalarının kopyalarını tarayıcınızın önbellek deposunda da saklar; sitenin her yeni sürümü bunların yerini alır. Çekiliş bildirimlerini açarsanız tarayıcınız, siz kapatana kadar anlık bildirim aboneliğini de saklar. Bu sitenin verilerini temizlemek hepsini kaldırır.',
      },
      keys: {
        theme: {
          holds: 'Açık ya da koyu temanız.',
          when: 'Temayı değiştirdiğinizde.',
        },
        wallet: {
          holds: 'Uygulamanın yeniden bağlanabilmesi için en son bağladığınız cüzdanın adı ve adresi.',
          when: 'Bir cüzdan bağladığınızda; bağlantısını kestiğinizde silinir.',
        },
        country: {
          holds: 'Biletleriniz için seçtiğiniz ülke bayrağı ya da ülkenizi gizli tuttuğunuz bilgisi.',
          when: 'Bir bayrak seçtiğinizde.',
        },
        sound: {
          holds: 'Seslerin açık mı kapalı mı olduğu.',
          when: 'Sesi kapattığınızda ya da açtığınızda.',
        },
        lang: {
          holds: 'Seçtiğiniz dil; böylece uygulama size tekrar başka bir dil önermez.',
          when: 'Bir dil seçtiğinizde ya da siteyi kendi dilinizde okuma önerisine yanıt verdiğinizde.',
        },
      },
      clear: {
        title: 'Kaldırma',
        disconnect: '{key} anahtarını kaldırmak için uygulamada cüzdanınızın bağlantısını kesin.',
        site: 'Hepsini kaldırmak için tarayıcınızın ayarlarından bu sitenin verilerini temizleyin.',
        private: 'Gizli bir pencerede, pencereyi kapattığınızda silinirler.',
        reset: 'Bunları kaldırmak yalnızca bu ayarları sıfırlar; biletleriniz Solana’dadır ve sizin olmaya devam eder.',
      },
      banner: {
        title: 'Neden çerez bildirimi yok',
        body: 'Burada hiçbir şey sizi izlemez ve yukarıdaki her ayar, siz ayarladığınız için vardır. Bu yüzden kabul edecek ya da reddedecek bir şey yok.',
      },
    },

    play: {
      description: 'Şansın nasıl işlediği ve oynamak eğlenceli olmaktan çıkarsa nereden yardım alabileceğiniz.',
      basics: {
        title: 'Oynamadan önce',
        age: 'S☉Lucky, piyangoların yasal olduğu yerlerde 18 yaş ve üzeri kişiler içindir.',
        test: 'Bu site Solana {cluster} üzerinde çalışır: biletlerin bedeli, ücretsiz ve değersiz olan test SOL ile ödenir. Hiç para harcamadan oyunun nasıl işlediğini görmenin iyi bir yoludur.',
        real: 'Bu site Solana Mainnet üzerinde çalışır: biletlerin bedeli gerçek SOL ile ödenir.',
        fun: 'Eğlence için oynayın; asla para kazanmak ya da kaybettiğiniz parayı geri kazanmak için oynamayın.',
      },
      odds: {
        title: 'Şansınızı bilin',
        same: 'Piyangolarda rastgele bir sayıya en yakın bilet kazanır: şansınız, sayı aralığının sizin sayılarınıza başkalarınınkinden daha yakın olan payıdır. Sayıyı Tahmin Et oyununda her kontrol, sayıyı yeni tahminlerin henüz denenmemiş sayılara oranı kadar bir olasılıkla bulur.',
        label:
          'Hiçbir sayı diğerinden daha şanslı değildir: çekilen sayının aralıktaki herhangi bir sayı olma olasılığı eşittir.',
        fee: 'Kazanan, havuzun %80’ini alır. Program tarafından %20 ile sınırlanan kasa payı kalandan düşülür; geriye kalan da oyunun bir sonraki turuna gider. Yani tüm oyuncular birlikte ele alındığında biletler, onlara harcanan parayı bu pay düşülmüş olarak geri öder: ortalamada bir bilet, maliyetinden daha azını geri getirir.',
        nothing: 'Sitedeki hiçbir şey bu şansı değiştirmez.',
      },
      final: {
        title: 'Biletler kesindir',
        body: 'Bir bilet satın alındıktan sonra iptal edilemez ve bedeli iade edilemez. Geri alabileceğiniz tek şey, turu ödendikten sonra bileti kapatarak alacağınız küçük kira depozitosudur.',
      },
      habits: {
        title: 'Eğlenceli tutun',
        budget: 'Ne kadar kaybetmeyi göze aldığınıza önceden karar verin ve o miktar bitince durun.',
        chase:
          'Kayıplarınızın peşinden asla koşmayın; asla borç aldığınız parayla ya da ihtiyacınız olan parayla oynamayın.',
        mood: 'Üzgün, yorgun ya da alkollüyken oynamayın.',
        breaks: 'Ara verin ve oyunu hayatınızın birçok parçasından yalnızca biri olarak tutun.',
      },
      limits: {
        title: 'Kendi sınırlarınızı koymak',
        intro:
          'S☉Lucky’de hesap olmadığı için size sınır koyamaz ya da sizi oyundan men edemez. Kendi sınırlarınızı koyabilirsiniz:',
        wallet: 'Yalnızca harcamayı göze aldığınız miktarı tutan ayrı bir cüzdan kullanın.',
        block: 'Siteyi engellemek için bir web sitesi engelleyici ya da cihazınızın ebeveyn denetimlerini kullanın.',
        trust: 'Güvendiğiniz birine anlatın ve sınırlarınıza bağlı kalmanız için ondan yardım isteyin.',
      },
      help: {
        title: 'Yardım almak',
        intro:
          'Oynamak artık eğlenceli değilse ya da yakınınızdaki biri bu konuda endişeliyse, bu bağımsız kuruluşlar ücretsiz ve gizli yardım sunar. Onlarla bir bağlantımız yoktur.',
        worldwide: 'Dünya genelinde: ülkelere göre toplantılar ve iletişim bilgileri.',
        us: 'Amerika Birleşik Devletleri.',
        uk: 'Birleşik Krallık.',
        emergency: 'Siz ya da bir başkası acil tehlike altındaysanız yerel acil durum numarasını arayın.',
      },
    },
  },
};

export default tr;
