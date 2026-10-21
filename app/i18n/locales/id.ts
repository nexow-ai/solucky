/** Indonesian: translated from en.ts. Same keys, same {placeholders}. */
import type { Dict } from './en';

const id: Dict = {
  meta: {
    title: 'S☉Lucky: permainan lotre di Solana',
    description:
      'Pilih angka di lotre harian atau lotre per jam, atau buru angka yang tersembunyi. Pemenang mendapat 80% pot. Setiap tiket, pot, dan undian ada di Solana dan bisa diperiksa siapa pun.',
    ogImageAlt: 'S☉Lucky, permainan lotre di Solana',
  },

  nav: {
    play: 'Main',
    how: 'Cara kerja',
    fairness: 'Keadilan',
    faq: 'FAQ',
  },

  lang: {
    label: 'Bahasa',
    choose: 'Bahasa: {name}',
  },

  update: {
    title: 'Versi baru sudah siap',
    hint: 'Muat ulang untuk langsung memakainya. Versi baru juga dimuat otomatis saat kamu pindah halaman berikutnya.',
    reload: 'Muat ulang',
  },

  header: {
    beta: 'Beta',
    getSol: 'Dapatkan SOL',
    faucetTip: 'Faucet beta sementara: dapatkan SOL uji coba gratis untuk bermain',
    mute: 'Matikan suara',
    unmute: 'Nyalakan suara',
  },

  faucet: {
    connectFirst: 'Hubungkan dompet dulu',
    connectFirstHint: 'Lalu ketuk Dapatkan SOL untuk mengisinya dengan SOL uji coba.',
    request: 'Minta SOL uji coba di faucet',
    requestHint: 'Alamat dompetmu sudah disalin. Tempel jika kolomnya kosong, lalu konfirmasi.',
    openAgain: 'Buka lagi',
    airdropped: '◎1 berhasil di-airdrop',
    airdroppedHint: 'SOL uji coba sudah masuk di {cluster}. Kamu bisa membeli tiket sekarang.',
    failed: 'Airdrop gagal',
    slow: 'Airdrop diterima, tetapi saldo belum diperbarui. Muat ulang sebentar lagi.',
  },

  footer: {
    license: 'Lisensi MIT',
    program: 'Program {address} di {cluster}.',
    age: 'Khusus 18+. Bermainlah untuk bersenang-senang, dan hanya di tempat lotre legal.',
    legal: 'Legal',
    languages: 'Bahasa',
    source: 'Kode sumber',
    builtOn: 'Dibangun di atas {solana}',
    madeBy: 'Dibuat oleh {nexow}',
  },

  home: {
    kicker: 'Permainan lotre di Solana',
    title: 'Pilih angka.',
    titleEnd: 'Menang saat tengah malam.',
    lead: 'Undian setiap hari, undian setiap jam, dan angka tersembunyi untuk diburu. Pemenang mendapat 80% pot, dan sisanya dibawa ke ronde berikutnya. Setiap tiket, setiap lamport, dan setiap undian ada di Solana, tempat siapa pun bisa memeriksanya.',
    playNow: 'Main sekarang',
    howItWorks: 'Cara kerja',
    program: 'Program',
    cluster: 'Jaringan',
    draw: 'Undian',
    dialCaption:
      'Setiap titik adalah salah satu tiket hari ini: posisinya di sekeliling dial menunjukkan waktu pembeliannya, dan jaraknya ke luar menunjukkan angkanya.',

    how: {
      tag: 'Cara kerja',
      title: 'Empat langkah, satu undian sehari',
      description:
        'Ronde mengikuti kalender UTC: ronde baru dibuka pukul 00:00 UTC dan diundi tepat setelah tengah malam berikutnya.',
      opens: 'Ronde dibuka',
      draw: 'Undian',
      now: 'Sekarang',
      steps: {
        wallet: {
          title: 'Hubungkan dompet',
          description:
            'Phantom, Solflare, Backpack, atau dompet apa pun yang mendukung Wallet Standard. Tanpa akun, tanpa email.',
          when: 'Kapan saja',
        },
        number: {
          title: 'Pilih angkamu',
          description:
            'Angka berapa pun dari 0 sampai {max}. Setiap angka hanya bisa dipegang satu tiket per hari, jadi cepatlah.',
          when: 'Hingga tengah malam UTC',
        },
        pot: {
          title: 'Saksikan pot bertambah',
          description:
            'Setiap tiket menambahkan harganya ke pot, yang disimpan di akun milik ronde itu sendiri di Solana. Tidak ada orang lain yang bisa memindahkannya.',
          when: 'Sepanjang hari',
        },
        win: {
          title: 'Menang saat tengah malam UTC',
          description:
            'Sebuah angka acak diundi, dan tiket yang paling dekat dengannya memenangkan 80% pot. Biaya pengelola diambil dari sisanya, dan yang tersisa dibawa ke hari berikutnya.',
          when: 'Tepat setelah tengah malam UTC',
        },
      },
    },

    fairness: {
      tag: 'Keadilan',
      title: 'Jangan percaya kami. Periksa sendiri.',
      description:
        'S☉Lucky adalah program Solana, bukan server yang memegang uangmu. Aturan-aturan ini ditegakkan oleh kodenya.',
      rules: {
        locked: {
          title: 'Pot terkunci di dalam program',
          description:
            'Uang tiket langsung masuk ke akun ronde. Program hanya membayarkan 80% darinya kepada pemilik tiket pemenang, biayanya ke treasury, dan sisanya ke ronde berikutnya dari permainan itu. Operator tidak bisa menariknya.',
        },
        draw: {
          title: 'Undian yang tak bisa ditebak siapa pun',
          description:
            'Setiap pembelian dicampurkan ke dalam entropi ronde. Saat sebuah ronde berakhir, ronde itu menetapkan sebuah slot beberapa detik ke depan; hash slot itu, yang tidak diketahui siapa pun sampai saat itu, memilih angka yang menjadi patokan semua tiket.',
        },
        anyone: {
          title: 'Siapa pun bisa menjalankannya',
          description:
            'Menutup, mengundi, dan membayar terbuka untuk semua orang. Jika operator menghilang besok, pemain mana pun tetap bisa menuntaskan setiap ronde.',
        },
        browser: {
          title: 'Bisa diperiksa di browser-mu',
          description:
            'Setiap halaman ronde menghitung ulang undian dari data publik: entropi, hash slot, angka yang diundi, dan tiket terdekat. Input sama, pemenang sama.',
        },
        limits: {
          title: 'Batas tegas bagi pengelola',
          description:
            'Program selalu membayar pemenang 80% pot dan membatasi biaya maksimal 20%. Perubahan harga dan biaya hanya berlaku untuk ronde yang dibuka sesudahnya, dan pembeli tidak pernah membayar lebih dari harga yang ditampilkan kepadanya.',
        },
        open: {
          title: 'Sumber terbuka',
          description: 'Program, aplikasi, dan skrip operator bersifat publik, dengan pengujian untuk setiap aturan.',
        },
      },
    },

    faq: {
      tag: 'FAQ',
      title: 'Pertanyaan',
      description: 'Masih ragu? Program, aplikasi, dan skrip operator bersifat sumber terbuka.',
      readCode: 'Baca kodenya',
      items: {
        real: {
          q: 'Apakah ini uang sungguhan?',
          a: 'Aplikasi publik berjalan di Solana devnet, tempat SOL adalah uang uji coba gratis dari faucet.solana.com. Program bekerja dengan cara yang sama di mainnet, tetapi menjalankan lotre dengan uang sungguhan memerlukan lisensi yang sesuai di tempat kamu beroperasi.',
        },
        price: {
          q: 'Berapa harga satu tiket?',
          a: 'Harga setiap permainan ditetapkan on-chain dan ditampilkan di halaman Main-nya. Selain harga, akun tiket menyimpan deposit sewa kecil yang kamu dapatkan kembali dengan menutup tiket setelah ronde dibayar. Tiket pertama sebuah ronde juga membayar sewa akun ronde, yang tetap on-chain sebagai catatan publiknya; di lotre, setiap tiket juga membayar 4 byte yang dipakai angkanya di sana.',
        },
        odds: {
          q: 'Bagaimana peluangku dihitung?',
          a: 'Di lotre, tiket yang paling dekat dengan angka yang diundi akan menang, jadi peluangmu adalah bagian rentang angka yang lebih dekat ke angkamu daripada ke angka orang lain: angka yang jauh dari tiket lain mencakup bagian yang lebih besar. Di Tebak Angka, setiap pemeriksaan menemukan angkanya dengan peluang sebesar jumlah tebakan baru dibagi angka yang belum dicoba.',
        },
        draw: {
          q: 'Bagaimana jika tidak ada yang mengundi ronde?',
          a: 'Sebuah bot kecil (crank) menutup, mengundi, dan membayar setiap ronde lotre dalam hitungan detik setelah ronde itu berakhir, dan memeriksa tebakan baru setiap beberapa detik. Siapa pun bisa melakukan hal yang sama dari halaman Main. Jika slot yang ditetapkan suatu saat menjadi terlalu lama untuk dibaca (sekitar tiga menit), ronde bisa ditutup lagi untuk menetapkan slot baru; program hanya mengizinkannya setelah slot lama terbukti sudah tidak terjangkau.',
        },
        country: {
          q: 'Kenapa negaraku ditampilkan?',
          a: 'S☉Lucky sejak dulu menampilkan bendera di samping setiap tiket. Kami menyarankan negaramu berdasarkan koneksimu ke host kami, tanpa pencarian pihak ketiga, dan kamu bisa mengubahnya atau merahasiakannya sebelum membeli. Negara itu disimpan on-chain bersama tiketmu.',
        },
        validator: {
          q: 'Bisakah validator mencurangi undian?',
          a: 'Pemain tidak bisa: hash pemenang belum ada saat penjualan ditutup. Validator yang menghasilkan slot yang ditetapkan bisa memengaruhinya, dengan memilih apa yang masuk ke blok itu atau dengan melewatkannya. Hal itu masih bisa diterima untuk permainan dengan uang uji coba; untuk pot berisi uang sungguhan, undian sebaiknya memakai oracle keacakan yang dapat diverifikasi, dan README menjelaskan di mana memasangnya.',
        },
      },
    },

    cta: {
      title: 'Pot hari ini sudah menunggu',
      description: 'Pilih angka yang belum diambil siapa pun. Semoga beruntung!',
    },
  },

  /** The solar dial on the landing page. */
  dial: {
    bezel: 'Satu undian sehari · Diundi setelah tengah malam UTC · Setiap tiket di Solana',
    draw: 'Undian',
    pot: 'Pot hari ini',
    toDraw: 'menuju undian · {day}',
    tickets: '{n} tiket hari ini',
    entropy: 'Entropi · {cluster}',
    entropyTitle: 'Entropi: {hex}',
    noTickets: 'belum ada tiket',
  },

  /** The band of news under the landing's hero. */
  ticker: {
    newTicket: 'Tiket baru',
    rules: {
      daily: 'Ronde baru setiap hari pukul 00:00 UTC',
      hourly: 'Dan satu setiap jam',
      pot: 'Angka terdekat memenangkan 80% pot',
      carry: 'Sisanya dibawa ke ronde berikutnya',
      guess: 'Tebak Angka: tanpa batas waktu, sampai ada yang menemukannya',
      numbers: 'Angka dari 0 sampai {max}',
      fee: 'Biaya pengelola dibatasi maksimal 20% oleh program',
      anyone: 'Siapa pun bisa menutup, mengundi, dan membayar ronde',
      check: 'Hitung ulang setiap undian di browser-mu',
      open: 'Sumber terbuka',
    },
  },

  /** The last draw, printed like a receipt, in the Fairness section. */
  receipt: {
    title: 'Struk undian',
    round: 'Ronde',
    noneYet: 'belum ada yang diselesaikan',
    tickets: 'Tiket',
    pot: 'Pot',
    entropy: 'Entropi',
    slotHash: 'Hash slot · slot {slot}',
    formula: 'sha256(entropi ‖ hash slot ‖ slot ‖ ronde) =',
    mod: '8 byte pertama sebagai u64 mod {count} = {drawn}',
    ticketCount: 'angka',
    closest: 'tiket terdekat: {number}',
    number: 'Angka',
    paidTo: 'Dibayar ke',
    payout: 'Pembayaran',
    check: 'Periksa undian ini',
    roundPage: 'Halaman ronde',
    nextDraw: 'Undian berikutnya setelah 00:00 UTC',
    ok: 'Dihitung ulang di browser-mu: hash sama, angka {number} menang.',
    mismatch: 'Hash yang dihitung ulang di browser-mu tidak cocok dengan ronde ini.',
  },

  /** Short labels over the numbers in the panels. */
  stat: {
    tickets: 'Tiket',
    players: 'Pemain',
    countries: 'Negara',
    ticket: 'Tiket',
    yourTickets: 'Tiketmu',
    winChance: 'Peluang menang',
    chance: 'Peluang',
    todaysPot: 'Pot',
    checked: 'Diperiksa',
    waiting: 'Menunggu',
    numbersLeft: 'Angka tersisa',
    winners: 'Pemenang',
    averagePot: 'Rata-rata pot',
    biggestPot: 'Pot terbesar',
  },

  countdown: {
    h: 'j',
    m: 'm',
    s: 'd',
    left: 'sisa {time}',
  },

  play: {
    title: 'Main',
    description:
      'Pilih angka di lotre harian atau lotre per jam, atau buru angka yang tersembunyi, dan saksikan pot bertambah secara langsung di Solana.',
    testMoney: 'Kamu bermain di Solana {cluster}: tiket dibayar dengan SOL uji coba yang tidak punya nilai sungguhan.',
    localFunds: 'Arahkan dompetmu ke {url}, lalu isi saldonya dengan: {command}',
    phantomFunds:
      'Di Phantom: Settings → Developer Settings → aktifkan Testnet Mode → pilih {cluster}. Lalu dapatkan SOL uji coba gratis dari faucet.',
    openFaucet: 'Buka faucet',
    retry: 'Coba lagi',
    rpcError: 'Tidak dapat menjangkau endpoint RPC Solana ({reason})',
  },

  /** The middle panel of the play page, where a number is picked and bought. */
  pick: {
    kicker: 'Pilih',
    title: 'Angka',
    win: 'Menangkan',
    in: 'dalam',
    taken: 'Sudah diambil di ronde ini',
    range: '0 sampai {max}, satu tiket per angka',
    pad: 'Papan angka',
    reset: 'Atur ulang',
    delete: 'Hapus digit terakhir',
    dip: 'Pilih acak',
    searchCountry: 'Cari negara',
    country: 'Negara yang ditampilkan bersama tiketmu',
    notSetUp: 'Permainan ini belum disiapkan di jaringan ini.',
    paused: 'Penjualan tiket sedang dijeda.',
    buy: 'Beli {number} seharga ◎{price}',
    takenToday: '{number} sudah diambil',
    outOfRange: 'Angka di luar rentang',
    notEnough: 'SOL tidak cukup',
    keys: 'Tombol 0–9 untuk mengetik, ⌫ untuk menghapus, Enter untuk membeli.',
    rent: 'Satu tiket juga menyimpan ◎{rent} sewa akun, yang kamu dapatkan kembali setelah undian.',
  },

  /** The left panel of the play page: today's pot and tickets. */
  pot: {
    title: 'SOLPOT',
    closesIn: '{day} · tutup dalam',
    carried: 'Termasuk ◎{carry} yang dibawa dari ronde sebelumnya',
    split: '80% untuk pemenang · {fee} biaya pengelola · sisanya ke ronde berikutnya',
    inPlay: 'Angka yang dimainkan',
    empty: 'Belum ada tiket',
    beFirst: 'Jadilah yang pertama memilih angka di ronde ini.',
  },

  /** The three games, as the play page's switcher and the landing page name them. */
  games: {
    tag: 'Permainan',
    title: 'Tiga cara bermain',
    description:
      'Angka yang sama, dari 0 sampai {max}. Pemenang mendapat 80% pot; biaya pengelola diambil dari sisanya, dan yang tersisa dibawa ke ronde berikutnya.',
    play: 'Main',
    daily: {
      name: 'Lotre harian',
      short: 'Harian',
      description:
        'Undian setiap hari setelah tengah malam UTC. Tiket yang paling dekat dengan angka yang diundi akan menang.',
    },
    hourly: {
      name: 'Lotre per jam',
      short: 'Per jam',
      description:
        'Undian setiap jam, tepat di awal jam (UTC). Tiket yang paling dekat dengan angka yang diundi akan menang.',
    },
    guess: {
      name: 'Tebak Angka',
      short: 'Tebak',
      description:
        'Tanpa batas waktu. Tebakan baru diperiksa setiap beberapa detik sampai salah satunya menemukan angka ronde; lalu ronde baru dimulai.',
    },
  },

  /** Guess the number: the checks and their results. */
  guess: {
    noDeadline: 'Sampai ada yang menemukannya',
    odds: 'Setiap pemeriksaan menemukan angkanya dengan peluang sebesar jumlah tebakan baru dibagi {n} angka yang belum dicoba.',
    bought: 'Tebakan {number} sudah masuk. Tebakan itu diperiksa dalam beberapa detik.',
    sealing: 'Mengunci tebakan terbaru ronde {day}',
    checkNow: 'Periksa sekarang',
    checkHint:
      'Sebuah bot memeriksa tebakan baru setiap beberapa detik. Siapa pun bisa menjalankan pemeriksaan; biayanya hanya biaya jaringan.',
    missed: 'Bukan angkanya: {numbers}',
    left: 'Angkanya adalah salah satu dari {n} angka yang belum dicoba.',
    foundByYou: 'Kamu menemukannya! Angkanya {number}',
    foundByOther: 'Pemain lain menemukan angkanya',
    nextRound: 'Ronde baru dengan angka baru sedang dijual.',
  },

  /** The right panel of the play page: past rounds. */
  history: {
    title: 'Riwayat',
    total: 'Total',
    games: 'permainan',
    waiting: 'Menunggu undian',
    settle: 'Selesaikan',
    settleDay: 'Selesaikan {day}',
    anyone:
      'Siapa pun bisa menutup, mengundi, dan membayar ronde yang sudah selesai. Biayanya hanya biaya jaringan; hadiahnya selalu masuk ke pemenang.',
    rent: '{n} tiket lama menyimpan ◎{sol} sewa',
    rentHint: 'Tutup tiket-tiket itu untuk mendapatkan kembali SOL tersebut. Ronde tetap menyimpan hasilnya.',
    getBack: 'Ambil kembali',
    winners: 'Pemenang',
    noWinners: 'Belum ada pemenang',
    firstDraw: 'Pemenang pertama akan muncul di sini.',
    chart: 'Pot per ronde',
    chartEmpty: 'Belum ada ronde yang selesai.',
    chartLabel: 'Pot dari {n} ronde terakhir; daftar di bawah memuat setiap nilainya.',
  },

  status: {
    open: 'Terbuka',
    toClose: 'Menunggu ditutup',
    toDraw: 'Menunggu undian',
    checking: 'Memeriksa tebakan',
    unpaid: 'Diundi, belum dibayar',
    paid: 'Dibayar',
  },

  /** The strip across the top of the play page. */
  live: {
    live: 'Langsung',
    connecting: 'Menghubungkan',
    offline: 'Terputus',
    atTable: '{n} di meja',
    picking: '{n} sedang memilih',
    you: 'kamu',
    joined: 'bergabung',
    now: 'sekarang',
    empty: 'Meja sudah dibuka. Tiket berikutnya muncul di sini begitu masuk.',
    joinedOne: 'Seorang pemain baru bergabung ke meja',
    joinedMany: '{n} pemain baru bergabung ke meja',
    hereNow: '{n} di sini sekarang',
    locked: '{who} mengunci {number}',
    potNow: 'Pot kini ◎{pot} dengan {n} tiket',
  },

  /** Progress toasts for a transaction: {label} is one of the actions below. */
  tx: {
    confirm: 'Konfirmasi di dompetmu…',
    done: '{label}: selesai',
    cancelled: '{label}: dibatalkan',
    failed: '{label} gagal',
    view: 'Lihat transaksi',
    buying: 'Membeli angka {number}',
    bought: 'Angka {number} milikmu. Semoga beruntung!',
    repin: 'Menetapkan ulang slot undian untuk {day}',
    closing: 'Menutup {day}',
    drawing: 'Mengundi {day}',
    paying: 'Membayar pemenang {day}',
    paid: '◎{amount} dibayarkan ke pemenang {day}',
    settleFailed: 'Tidak dapat menyelesaikan {day}',
    reclaiming: 'Mengembalikan sewa tiket',
    slowSlot: 'Jaringan lambat mencapai slot undian. Coba lagi dalam semenit.',
    noWinner: 'Tiket pemenang tidak dapat ditemukan.',
  },

  wallet: {
    connect: 'Hubungkan dompet',
    title: 'Hubungkan dompet',
    description: 'Dompet Solana apa pun yang mendukung Wallet Standard bisa dipakai.',
    none: 'Tidak ada dompet Solana di browser ini. Pasang salah satunya, lalu muat ulang halaman:',
    failed: 'Tidak dapat menghubungkan {wallet}',
    copied: 'Alamat disalin',
    balance: 'Saldo',
    ticketsLeft: 'cukup untuk {n} tiket',
    needMore: 'perlu lebih banyak SOL untuk bermain',
    numbers: 'Angkamu di ronde ini',
    copy: 'Salin alamat',
    explorer: 'Explorer',
    play: 'Main',
    disconnect: 'Putuskan',
  },

  round: {
    title: 'Ronde {day}',
    back: 'Kembali ke permainan',
    notDate:
      'Ini bukan ronde dari permainan ini. Ronde harian diberi nama YYYY-MM-DD, ronde per jam YYYY-MM-DDTHH, dan ronde Tebak Angka dengan nomornya.',
    kicker: 'Ronde',
    nobody: 'Tidak ada yang bermain di ronde ini',
    beFirst: 'Jadilah yang pertama membeli tiket di ronde ini.',
    onlyExists: 'Ronde baru ada setelah tiket pertamanya terjual.',
    pot: 'Pot',
    usd: '{usd} dengan harga hari ini',
    winner: 'Pemenang',
    won: 'Menang ◎{payout} · biaya ◎{fee}',
    unpaid: 'Belum dibayar',
    anyone: 'Siapa pun bisa menuntaskan ronde ini. Biayanya hanya biaya jaringan.',
    settle: 'Selesaikan ronde ini',
    sold: 'Tiket terjual',
    price: 'Harga tiket',
    fee: 'Biaya pengelola',
    slot: 'Slot yang ditetapkan',
    check: 'Periksa undian',
    formula: 'keacakan = sha256(entropi ‖ hash slot ‖ slot undian ‖ alamat ronde)',
    recompute: 'Hitung ulang di browser-ku',
    entropy: 'Entropi (setiap pembelian, di-hash berurutan)',
    slotHash: 'Hash slot dari slot {slot} (dibaca program dari sysvar SlotHashes)',
    randomness: 'Keacakan',
    winning: 'Tiket pemenang',
    winningFormula: '8 byte pertama sebagai u64 mod {count} = {drawn}; tiket terdekat memegang {number}',
    guessFormula:
      '8 byte pertama sebagai u64 mod {left} (angka yang belum dicoba) = {r}, di bawah {batch} (tebakan dalam pemeriksaan): pembelian #{index} menemukan angkanya',
    ok: 'Undiannya terbukti benar.',
    mismatch: 'Tidak cocok: hasil yang tersimpan tidak sesuai dengan inputnya.',
    got: 'Browser-mu mendapatkan {hash}… dan angka {number}.',
    tickets: 'Tiket',
    ticketsHint:
      'Tiket yang ditutup pemiliknya setelah pembayaran tidak lagi tampil di sini; ronde tetap menyimpan totalnya.',
    noTickets: 'Tidak ada tiket terbuka yang tersisa untuk ronde ini.',
    account: 'Akun ronde {address} · {day}',
  },

  country: {
    private: 'Privat',
  },

  errors: {
    rejected: 'Kamu membatalkan permintaan di dompetmu.',
    taken: 'Seseorang sudah memegang angka ini di ronde ini. Pilih angka lain.',
    funds: 'SOL di dompet tidak cukup.',
    walletCluster:
      'Dompetmu tidak dapat menandatangani. Di Phantom: Settings → Developer Settings → aktifkan Testnet Mode → pilih Devnet, lalu hubungkan ulang dan coba lagi.',
    unknown: 'Terjadi kesalahan.',
    /** The program's own errors, in the order of programs/solucky/src/error.rs (codes 6000 and up). */
    program: {
      unauthorized: 'Hanya otoritas yang dapat melakukan ini.',
      invalidTicketPrice: 'Harga tiket minimal 0,002 SOL.',
      feeTooHigh: 'Biaya melebihi batas 20%.',
      invalidMaxNumber: 'Angka tertinggi harus lebih besar dari nol.',
      paused: 'Penjualan tiket sedang dijeda.',
      wrongRound: 'Tiket hanya bisa dibeli untuk ronde yang sedang dijual.',
      numberOutOfRange: 'Angka di luar rentang.',
      invalidCountry: 'Negara harus berupa kode ISO 3166-1 alpha-2 dengan huruf kapital.',
      roundNotOpen: 'Ronde tidak terbuka.',
      roundNotOver: 'Ronde belum berakhir.',
      roundAlreadyDrawn: 'Ronde sudah diundi.',
      drawStillPossible: 'Slot yang ditetapkan masih bisa diundi.',
      roundNotClosed: 'Ronde belum ditutup.',
      targetSlotNotReached: 'Slot yang ditetapkan belum tercapai.',
      randomnessUnavailable:
        'Hash slot yang ditetapkan belum bisa dibaca; coba lagi sebentar lagi, atau tutup ronde lagi setelah slot itu kedaluwarsa.',
      roundNotDrawn: 'Ronde belum diundi.',
      notWinningTicket: 'Ini bukan tiket pemenang.',
      roundNotSettled: 'Ronde belum diselesaikan.',
      overflow: 'Overflow aritmetika.',
      priceChanged: 'Harga tiket lebih tinggi daripada harga yang kamu setujui.',
      feeAlreadyCollected: 'Biaya ronde ini sudah ditarik.',
      roundFull: 'Ronde ini sudah menjual semua tiket yang bisa ditampungnya.',
      nothingToCheck: 'Tidak ada tebakan baru untuk diperiksa.',
      batchSealed: 'Tebakan terbaru sedang diperiksa; coba lagi dalam beberapa detik.',
      invalidGame: 'Permainan tidak dikenal.',
    },
  },

  legal: {
    kicker: 'Legal',
    updated: 'Terakhir diperbarui {date}',
    onThisPage: 'Di halaman ini',
    others: 'Dokumen legal lainnya',
    translated:
      'Halaman ini adalah terjemahan dari versi asli berbahasa Inggris. Jika keduanya berbeda, yang berlaku adalah versi bahasa Inggris.',
    readEnglish: 'Baca dalam bahasa Inggris',
    repository: 'repositori sumber',

    pages: {
      notice: {
        label: 'Pemberitahuan hukum',
        description: 'Siapa yang menjalankan S☉Lucky, cara menghubungi kami, dan dokumen yang berlaku.',
      },
      terms: {
        label: 'Ketentuan Layanan',
        description:
          'Aturan untuk menggunakan situs dan bermain, serta apa yang dijanjikan dan tidak dijanjikan oleh program.',
      },
      privacy: {
        label: 'Kebijakan Privasi',
        description:
          'Apa yang publik di Solana, apa yang dilihat server kami, dan apa yang tidak pernah kami kumpulkan.',
      },
      cookies: {
        label: 'Cookie & penyimpanan',
        description: 'Tanpa cookie, tanpa pelacak: lima pengaturan yang disimpan aplikasi di browser-mu.',
      },
      play: {
        label: 'Bermain bertanggung jawab',
        description: 'Cara kerja peluang, dan ke mana mencari bantuan jika bermain tidak lagi menyenangkan.',
      },
    },

    notice: {
      description:
        'Siapa yang menjalankan S☉Lucky, cara menghubungi kami, dan dokumen yang berlaku saat kamu menggunakannya.',
      operator: {
        title: 'Siapa yang menjalankan S☉Lucky',
        body: 'S☉Lucky dibuat dan dijalankan oleh {operator}. Kamu bisa menghubungi kami lewat email di {email} dan mengenal kami lebih jauh di {site}.',
      },
      software: {
        title: 'Program dan situs',
        intro: 'S☉Lucky terdiri dari dua bagian:',
        program:
          '{name}, program Solana yang menjual tiket, menyimpan pot setiap hari, dan membayar pemenang. Situs ini menggunakan program di {address} pada Solana {cluster}. Siapa pun bisa menggunakannya secara langsung, tanpa situs ini.',
        programName: 'Program',
        site: '{name}, yang menampilkan data publik program dan membantumu mengirim transaksi dari dompetmu sendiri. Situs ini tidak pernah memegang kunci atau SOL milikmu.',
        siteName: 'Situs ini',
      },
      documents: {
        title: 'Dokumen',
        intro: 'Menggunakan situs berarti menerima dokumen-dokumen berikut:',
      },
      security: {
        title: 'Melaporkan masalah keamanan',
        body: 'Mohon jangan membuka issue publik. Kirim email ke {email} dengan subjek {subject}, dan jangan pernah melakukan pengujian terhadap dana pemain lain: gunakan devnet atau validator lokal. Kebijakan keamanan, {file} di {repository}, menjelaskan apa saja yang perlu disertakan dan apa saja yang termasuk dalam cakupan.',
      },
      license: {
        title: 'Lisensi sumber terbuka',
        body: 'Program, aplikasi, dan skrip operator bersifat sumber terbuka di bawah Lisensi MIT ({file} di {repository}), © {years} {operator}. Lisensi tersebut mencakup kodenya; {terms} mencakup penggunaan situs ini.',
      },
    },

    terms: {
      description: 'Aturan penggunaan S☉Lucky, serta apa yang dijanjikan dan tidak dijanjikan oleh programnya.',
      agreement: {
        title: 'Ketentuan ini',
        p1: 'Ketentuan ini berlaku saat kamu menggunakan situs web dan aplikasi S☉Lucky, yang dijalankan oleh {operator} (“kami”). Dengan menggunakannya, kamu menerima ketentuan ini, beserta {privacy} dan halaman {cookies}. Jika kamu tidak menerimanya, jangan gunakan situs ini.',
        p2: 'Permainannya sendiri adalah program Solana: perangkat lunak sumber terbuka yang berjalan di jaringan Solana, bukan di server kami. Situs ini adalah salah satu cara untuk menggunakannya; siapa pun juga bisa menggunakan program secara langsung.',
      },
      eligibility: {
        title: 'Siapa yang boleh bermain',
        age: 'Kamu harus berusia 18 tahun atau lebih.',
        legal:
          'Kamu hanya boleh bermain di tempat lotre dan permainan untung-untungan daring legal bagimu. Memeriksa hal itu adalah tanggung jawabmu; kami tidak memeriksa di mana kamu berada.',
        own: 'Jangan bermain atas nama orang lain, atau dengan SOL yang bukan milikmu.',
      },
      money: {
        title: 'SOL uji coba dan SOL sungguhan',
        test: 'Situs ini berjalan di {cluster}. Tiket dibayar dengan SOL uji coba, yang gratis dari faucet dan tidak bernilai: SOL uji coba tidak bisa ditukar dengan uang sungguhan, begitu pula apa pun yang kamu menangkan dengannya.',
        real: 'Situs ini berjalan di {cluster}. Tiket dibayar dengan SOL sungguhan, dan pot dibayarkan dalam SOL sungguhan.',
      },
      rounds: {
        title: 'Cara kerja ronde',
        intro: 'Program menegakkan aturan-aturan ini; situs hanya menampilkannya:',
        day: 'S☉Lucky punya tiga permainan. Di lotre harian, satu ronde berjalan setiap hari UTC, dari pukul 00:00 UTC hingga tengah malam berikutnya; di lotre per jam, setiap jam UTC. Di Tebak Angka, ronde tidak punya waktu berakhir: ronde berjalan sampai sebuah tebakan menemukan angkanya.',
        number:
          'Satu tiket adalah satu angka, dari 0 hingga angka tertinggi yang ditetapkan dalam konfigurasi program. Setiap angka hanya bisa dipegang satu tiket per ronde.',
        price:
          'Setiap permainan punya harga tiket dan biaya pengelolanya sendiri. Keduanya disalin, bersama angka tertinggi, saat ronde dibuka, dan tetap sama selama ronde itu. Biaya tidak pernah bisa lebih dari 20% pot. Saat membeli, kamu tidak pernah membayar lebih dari harga yang ditampilkan kepadamu.',
        pot: 'Harga setiap tiket masuk ke pot ronde, yang disimpan di akun milik ronde itu sendiri di Solana. Di lotre, sebuah angka acak dari 0 sampai angka tertinggi diundi dan tiket yang paling dekat dengannya menang; jika seri, angka yang lebih kecil yang menang. Di Tebak Angka, tebakan baru diperiksa per kelompok: sebuah kelompok memuat angkanya dengan peluang sebesar jumlah tebakannya dibagi angka yang belum dicoba, peluang yang sama seperti untuk angka yang disembunyikan saat ronde dibuka.',
        draw: 'Setelah sebuah ronde lotre berakhir, atau begitu ada tebakan baru yang menunggu pemeriksaan, siapa pun bisa menutup ronde, mengundinya, dan membayarnya. Pemilik tiket pemenang menerima 80% pot, biaya pengelola masuk ke treasury, dan sisanya tetap di program untuk ronde berikutnya dari permainan itu yang akan diundi.',
        rent: 'Akun tiket juga menyimpan deposit sewa kecil, yang kamu dapatkan kembali dengan menutup tiket setelah rondenya dibayar. Tiket pertama dalam sebuah ronde juga membayar sewa akun ronde, yang tetap ada di Solana sebagai catatan publik ronde itu. Di lotre, setiap tiket juga membayar sewa untuk 4 byte yang dipakai angkanya di akun itu, dan sewa ini tidak dikembalikan.',
      },
      wallet: {
        title: 'Dompet dan transaksimu',
        own: 'Kamu bermain dengan dompetmu sendiri. Kami tidak pernah memegang kunci, SOL, atau tiketmu, dan kami tidak bisa memindahkannya.',
        sign: 'Kamu menandatangani sendiri setiap transaksi, dan kamu membayar biaya jaringan Solana. Transaksi yang sudah dikonfirmasi bersifat final: kami tidak bisa membatalkan, membalikkan, atau mengembalikan dananya.',
        public:
          'Angka sebuah tiket, alamat pemiliknya, dan bendera negara yang kamu pilih untuknya bersifat publik di Solana untuk selamanya. {privacy} menjelaskan apa artinya.',
        keys: 'Jaga kunci dompetmu tetap aman. Tidak ada siapa pun, termasuk kami, yang bisa memulihkannya untukmu.',
      },
      operator: {
        title: 'Apa yang bisa dan tidak bisa dilakukan operator',
        intro: 'Konfigurasi program memiliki otoritas, yang dapat:',
        price:
          'mengubah harga tiket (minimal ◎0,002) dan biaya pengelola (maksimal 20%) setiap permainan, berlaku mulai ronde berikutnya dari permainan itu yang dibuka;',
        pause:
          'menjeda dan melanjutkan penjualan tiket. Jeda hanya menghentikan tiket baru: ronde yang sudah dimainkan tetap bisa diundi dan dibayar;',
        other: 'mengubah treasury, angka tertinggi, dan otoritas itu sendiri.',
        cannot:
          'Kode program tidak mengizinkan otoritas, atau siapa pun, mengambil pot sebuah ronde atau mengirimkannya ke mana pun selain kepada pemilik tiket pemenang, biaya ke treasury, dan ronde berikutnya dari permainan itu, mengambil lebih dari biaya, atau menagih pembeli lebih dari harga yang ditampilkan kepadanya.',
        upgrade:
          'Program ini dapat di-upgrade: siapa pun yang memegang otoritas upgrade-nya bisa men-deploy kode yang berbeda, jadi kamu memercayai mereka sampai program dibuat tidak dapat diubah atau diserahkan ke multisig. Kode sumber setiap versi bersifat publik, dan program yang sudah di-deploy dapat dicocokkan dengannya seperti dijelaskan di bagian “Verifiable builds” pada README.',
      },
      risks: {
        title: 'Risiko',
        intro: 'Dengan bermain, kamu menerima bahwa:',
        bugs: 'perangkat lunak bisa memiliki bug, termasuk program, aplikasi, dan dompetmu, dan sebuah bug bisa membuatmu kehilangan tiket atau SOL;',
        network:
          'Solana atau endpoint RPC yang digunakan situs bisa lambat, padat, atau mati, dan sebuah transaksi bisa gagal atau baru tiba setelah ronde ditutup;',
        draw: 'undian menggunakan hash dari sebuah slot Solana yang tidak diketahui siapa pun saat sebuah ronde ditutup atau sekelompok tebakan dikunci. Pemain tidak bisa menebaknya, tetapi validator yang menghasilkan slot itu bisa memengaruhinya, dan siapa pun yang menutup ronde bisa menahan hasil undian yang tidak menguntungkan sampai slot itu tidak bisa dibaca lagi. Ini bukan oracle keacakan yang dapat diverifikasi;',
        site: 'situs bisa tidak tersedia kapan saja. Program, dan tiketmu, tetap berfungsi tanpanya;',
        law: 'hukum tentang lotre dan aset kripto berbeda di setiap negara dan bisa berubah.',
      },
      use: {
        title: 'Menggunakan situs secara wajar',
        body: 'Jangan menyerang atau membebani situs atau servernya, mencoba mengakali batasannya, mengganggu pemain lain, atau menggunakan situs untuk melanggar hukum. Kami dapat memblokir akses siapa pun yang melakukannya.',
      },
      liability: {
        title: 'Tanpa jaminan',
        body: 'Situs dan program disediakan “apa adanya”, tanpa jaminan apa pun. Sejauh diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian apa pun yang timbul dari penggunaannya, termasuk tiket yang hilang, transaksi yang gagal atau terlambat, bug, masalah jaringan, atau undian yang kamu anggap tidak adil. Tidak ada isi ketentuan ini yang membatasi tanggung jawab yang menurut hukum tidak boleh kami batasi.',
      },
      openSource: {
        title: 'Sumber terbuka',
        body: 'Program, aplikasi, dan skrip operator bersifat sumber terbuka di bawah Lisensi MIT: lihat {repository}. Lisensi itu mencakup kodenya; ketentuan ini mencakup penggunaan situs ini.',
      },
      changes: {
        title: 'Perubahan',
        body: 'Kami dapat memperbarui ketentuan ini. Tanggal di bagian atas menunjukkan perubahan terakhir, dan versi yang ditampilkan di sini berlaku sejak tanggal tersebut.',
      },
      contact: {
        title: 'Kontak',
        body: 'Pertanyaan tentang ketentuan ini: {email}.',
      },
    },

    privacy: {
      description: 'Apa yang publik di Solana, apa yang dilihat server kami, dan apa yang tidak pernah kami kumpulkan.',
      summary: {
        title: 'Singkatnya',
        account: 'Tidak ada akun, email, atau pendaftaran. Kamu bermain dengan dompet.',
        cookies: 'Situs ini tidak memasang cookie dan tidak memuat analitik, iklan, atau pelacak.',
        database: 'Kami tidak menyimpan basis data pemain, dan kami tidak menjual atau membagikan data tentang dirimu.',
        public:
          'Tiketmu bersifat publik di Solana, memang dirancang begitu: itulah yang memungkinkan siapa pun memeriksa permainannya.',
        controller: '{operator} menjalankan situs ini dan bertanggung jawab atas data yang ditanganinya.',
      },
      onChain: {
        title: 'Apa yang publik di Solana',
        intro: 'Saat kamu membeli tiket, transaksi dan akun tiket mencatat secara publik:',
        address: 'alamat dompetmu, dan transaksi yang ditandatanganinya;',
        number: 'angka yang kamu pilih, rondenya, dan waktu pembelian;',
        flag: 'bendera negara yang kamu pilih untuk tiket itu, atau tidak ada jika kamu merahasiakannya.',
        ledger:
          'Saat sebuah ronde diundi, akunnya juga mencatat alamat pemenang, angka pemenang beserta benderanya, dan jumlah pembayarannya. Solana adalah buku besar publik: siapa pun bisa membaca data ini, banyak orang menyimpan salinannya, dan data itu tetap ada di sana selamanya. Menutup tiket akan menghapus akunnya dan mengembalikan sewanya, tetapi transaksi yang membuat dan menutupnya tetap ada di buku besar. Baik kami maupun siapa pun tidak bisa mengubah atau menghapusnya.',
        link: 'Alamat dompet bukanlah namamu, tetapi bisa dikaitkan denganmu, misalnya melalui exchange yang pernah kamu gunakan. Gunakan dompet terpisah jika kamu ingin memisahkan aktivitas bermainmu dari aktivitasmu yang lain.',
      },
      servers: {
        title: 'Apa yang dilihat server kami',
        visit: 'Setiap kunjungan',
        visitBody:
          'Situs ini di-hosting di Cloudflare. Seperti situs web lainnya, situs ini menerima alamat IP-mu, user agent browser-mu, dan halaman yang kamu minta, untuk menyajikannya dan melindungi situs dari penyalahgunaan. Cloudflare menyimpan log operasional untuk waktu terbatas sesuai {policy}. Kami menggunakannya hanya untuk menjalankan dan memperbaiki situs.',
        policy: 'kebijakan privasinya sendiri',
        country: 'Negaramu',
        countryBody:
          'Cloudflare memberi tahu server kami dari negara mana setiap permintaan berasal. Aplikasi menanyakannya sekali, untuk menyarankan bendera bagi tiketmu; kamu bisa mengubahnya atau merahasiakannya sebelum membeli. Server hanya membaca negaranya, bukan alamat IP-mu, dan tidak menyimpannya.',
        live: 'Meja langsung di halaman Main',
        liveBody:
          'Selama halaman Main terbuka, browser-mu menjaga koneksi ke server kami agar para pemain bisa melihat siapa lagi yang ada di sana. Koneksi itu membagikan tiga hal kepada orang lain di halaman tersebut: ID acak khusus untuk koneksi itu, bendera yang ditampilkan tiketmu (tidak ada jika kamu merahasiakan negaramu), dan apakah kamu sedang memasukkan angka, tidak pernah angkanya sendiri. Tidak ada alamat dompet atau alamat IP yang masuk ke dalamnya, dan tidak ada apa pun tentang koneksi itu yang disimpan atau dipertahankan setelah koneksi ditutup.',
        price: 'Harga SOL',
        priceBody:
          'Untuk menampilkan pot dalam dolar, server kami mengambil harga SOL dari Coinbase, atau dari CoinGecko jika Coinbase tidak menjawab, lalu menyimpannya di cache selama satu menit. Permintaan ini berasal dari server kami dan tidak membawa apa pun tentang dirimu.',
      },
      thirdParties: {
        title: 'Layanan yang digunakan browser-mu',
        rpc: '{name}, tempat aplikasi membaca data permainan dan mengirimkan transaksimu: {endpoint}. Endpoint ini menerima alamat IP-mu dan akun-akun yang dicari aplikasi, termasuk akun dompetmu setelah kamu menghubungkannya, sesuai kebijakan operatornya.',
        rpcName: 'Endpoint RPC Solana',
        rpcHost: '{host} di situs ini',
        rpcPublic: 'endpoint publik Solana untuk {cluster}',
        wallet:
          '{name}, seperti Phantom, Solflare, atau Backpack, yang merupakan perangkat lunak dari pembuatnya sendiri, dengan kebijakannya sendiri. Situs ini hanya memintanya untuk terhubung dan menandatangani transaksi yang kamu setujui.',
        walletName: 'Dompetmu',
        links:
          '{name}: Solana Explorer, faucet Solana, GitHub, dan akun media sosial kami adalah situs lain, dengan kebijakannya masing-masing.',
        linksName: 'Tautan yang kamu buka',
        own: 'Font, suara, dan gambar berasal dari domain kami sendiri, jadi memuat situs ini tidak menghubungi pihak lain mana pun.',
      },
      browser: {
        title: 'Apa yang tetap ada di browser-mu',
        body: 'Aplikasi menyimpan lima pengaturan di penyimpanan lokal browser-mu: tema, dompet terakhir, pilihan negara, pengaturan suara, dan bahasamu. Halaman {cookies} mencantumkannya.',
      },
      purposes: {
        title: 'Untuk apa, dan apa yang tidak pernah kami lakukan',
        body: 'Kami menangani data di atas hanya untuk menampilkan situs, menjalankan permainan yang ingin kamu mainkan, menjaga keamanan situs, dan memperbaiki masalah. Kami tidak membuat profil, menampilkan iklan, menjual data, atau membagikannya kepada pengiklan.',
      },
      rights: {
        title: 'Pilihan dan hakmu',
        flag: 'Kamu bisa bermain tanpa bendera negara: pilih untuk merahasiakannya sebelum membeli.',
        clear:
          'Kamu bisa menghapus pengaturan di browser-mu kapan saja, dan menggunakan dompet baru kapan pun kamu mau.',
        law: 'Tergantung tempat tinggalmu, kamu mungkin berhak mengakses, memperbaiki, atau menghapus data pribadi tentang dirimu, atau menolak cara data itu digunakan. Kirim email ke {email} dan kami akan menjawab. Kami hampir tidak menyimpan apa pun tentang dirimu, dan kami tidak bisa mengubah atau menghapus apa yang ada di Solana.',
      },
      children: {
        title: 'Anak-anak',
        body: 'S☉Lucky ditujukan untuk orang berusia 18 tahun ke atas. Kami tidak dengan sengaja menangani data siapa pun yang lebih muda.',
      },
      changes: {
        title: 'Perubahan dan kontak',
        body: 'Kami akan memperbarui halaman ini saat situs mengubah cara menangani data; tanggal di bagian atas menunjukkan perubahan terakhir. Pertanyaan: {email}.',
      },
    },

    cookies: {
      description:
        'Tanpa cookie, tanpa pelacak: lima pengaturan yang disimpan aplikasi di browser-mu, dan cara menghapusnya.',
      none: {
        title: 'Tanpa cookie',
        p1: 'S☉Lucky tidak memasang cookie, dan tidak memuat skrip analitik, iklan, atau pelacakan. Kebijakan keamanan situs hanya mengizinkan skrip dari domainnya sendiri.',
        p2: 'Host kami, Cloudflare, dapat memasang cookie keamanan yang benar-benar diperlukan, seperti {cookie}, saat perlindungan botnya aktif. Cloudflare menggunakannya untuk membedakan manusia dari bot, seperti dijelaskan dalam {list}.',
        list: 'daftar cookie-nya',
      },
      storage: {
        title: 'Apa yang disimpan aplikasi di browser-mu',
        intro:
          'Aplikasi menyimpan beberapa pengaturan di penyimpanan lokal browser-mu, agar tetap ada di kunjungan berikutnya. Pengaturan ini tetap di perangkatmu, dengan satu pengecualian: bendera yang kamu pilih disertakan pada tiket yang kamu beli, dan ditampilkan di meja langsung halaman Main selama kamu ada di sana.',
        key: 'Kunci',
        holds: 'Isinya',
        saved: 'Disimpan',
        wallet: 'Ekstensi dompetmu menyimpan datanya sendiri, sesuai kebijakan pembuatnya.',
      },
      keys: {
        theme: {
          holds: 'Tema terang atau gelapmu.',
          when: 'Saat kamu mengganti tema.',
        },
        wallet: {
          holds:
            'Nama dompet yang terakhir kamu hubungkan beserta alamatnya, agar aplikasi bisa menghubungkannya kembali.',
          when: 'Saat kamu menghubungkan dompet; dihapus saat kamu memutuskannya.',
        },
        country: {
          holds: 'Bendera negara yang kamu pilih untuk tiketmu, atau bahwa kamu merahasiakannya.',
          when: 'Saat kamu memilih bendera.',
        },
        sound: {
          holds: 'Apakah suara menyala atau mati.',
          when: 'Saat kamu mematikan atau menyalakan suara.',
        },
        lang: {
          holds: 'Bahasa yang kamu pilih, agar aplikasi tidak menawarkan bahasa lain lagi kepadamu.',
          when: 'Saat kamu memilih bahasa, atau menanggapi tawaran untuk membaca situs dalam bahasamu.',
        },
      },
      clear: {
        title: 'Menghapusnya',
        disconnect: 'Putuskan dompetmu di aplikasi untuk menghapus {key}.',
        site: 'Hapus data situs ini di pengaturan browser-mu untuk menghapus semuanya.',
        private: 'Di jendela pribadi, semuanya terhapus saat kamu menutup jendela itu.',
        reset: 'Menghapusnya hanya mengatur ulang pengaturan ini; tiketmu ada di Solana dan tetap milikmu.',
      },
      banner: {
        title: 'Mengapa tidak ada banner cookie',
        body: 'Tidak ada apa pun di sini yang melacakmu, dan setiap pengaturan di atas ada karena kamu yang mengaturnya. Jadi tidak ada yang perlu diterima atau ditolak.',
      },
    },

    play: {
      description: 'Cara kerja peluang, dan ke mana mencari bantuan jika bermain tidak lagi menyenangkan.',
      basics: {
        title: 'Sebelum bermain',
        age: 'S☉Lucky ditujukan untuk orang berusia 18 tahun ke atas, di tempat lotre legal.',
        test: 'Situs ini berjalan di Solana {cluster}: tiket dibayar dengan SOL uji coba, yang gratis dan tidak bernilai. Ini cara yang baik untuk melihat cara kerja permainan tanpa mengeluarkan apa pun.',
        real: 'Situs ini berjalan di Solana Mainnet: tiket dibayar dengan SOL sungguhan.',
        fun: 'Bermainlah untuk bersenang-senang, jangan pernah untuk mencari uang atau memenangkan kembali uang yang hilang.',
      },
      odds: {
        title: 'Ketahui peluangnya',
        same: 'Di lotre, tiket yang paling dekat dengan sebuah angka acak akan menang: peluangmu adalah bagian rentang angka yang lebih dekat ke angkamu daripada ke angka orang lain. Di Tebak Angka, setiap pemeriksaan menemukan angkanya dengan peluang sebesar jumlah tebakan baru dibagi angka yang belum dicoba.',
        label:
          'Tidak ada angka yang lebih beruntung daripada yang lain: angka yang diundi berpeluang sama untuk menjadi angka mana pun dalam rentang.',
        fee: 'Pemenang menerima 80% pot. Biaya pengelola, yang dibatasi program maksimal 20%, diambil dari sisanya, dan yang tersisa masuk ke ronde berikutnya dari permainan itu. Jadi, jika dihitung untuk semua pemain, tiket mengembalikan uang yang dibelanjakan untuknya dikurangi biaya itu: rata-rata, sebuah tiket menghasilkan kembali lebih sedikit daripada harganya.',
        nothing: 'Tidak ada apa pun di situs ini yang mengubah peluang tersebut.',
      },
      final: {
        title: 'Tiket bersifat final',
        body: 'Tiket tidak bisa dibatalkan atau dikembalikan dananya setelah dibeli. Satu-satunya yang kamu dapatkan kembali adalah deposit sewanya yang kecil, dengan menutup tiket setelah rondenya dibayar.',
      },
      habits: {
        title: 'Tetap menyenangkan',
        budget:
          'Tentukan sebelumnya berapa banyak yang siap kamu relakan hilang, dan berhentilah saat jumlah itu habis.',
        chase:
          'Jangan pernah mengejar kerugian, dan jangan pernah bermain dengan uang pinjaman atau uang yang kamu butuhkan.',
        mood: 'Jangan bermain saat kamu sedang kesal, lelah, atau habis minum alkohol.',
        breaks: 'Ambil jeda, dan jadikan bermain hanya satu bagian dari banyak hal dalam hidupmu.',
      },
      limits: {
        title: 'Menetapkan batasmu sendiri',
        intro:
          'S☉Lucky tidak punya akun, jadi tidak bisa menetapkan batas atau melarangmu bermain. Kamu bisa menetapkan batasmu sendiri:',
        wallet: 'Gunakan dompet terpisah yang hanya berisi jumlah yang siap kamu belanjakan.',
        block: 'Gunakan pemblokir situs web atau kontrol orang tua di perangkatmu untuk memblokir situs ini.',
        trust: 'Ceritakan kepada orang yang kamu percayai, dan minta mereka membantumu mematuhi batasmu.',
      },
      help: {
        title: 'Mendapatkan bantuan',
        intro:
          'Jika bermain tidak lagi menyenangkan, atau seseorang yang dekat denganmu mengkhawatirkannya, organisasi independen berikut menawarkan bantuan gratis dan rahasia. Kami tidak berafiliasi dengan mereka.',
        worldwide: 'Seluruh dunia: pertemuan dan kontak per negara.',
        us: 'Amerika Serikat.',
        uk: 'Britania Raya.',
        emergency: 'Jika kamu atau orang lain berada dalam bahaya langsung, hubungi nomor darurat setempat.',
      },
    },
  },
};

export default id;
