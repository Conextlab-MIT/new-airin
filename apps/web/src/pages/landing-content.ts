/**
 * Landing page copy and demo data. Every example is labelled as such in the UI.
 */

const integrations = [
  { icon: "whatsapp.svg", name: "WhatsApp" },
  { icon: "gmail.svg", name: "Gmail" },
  { icon: "google-drive.svg", name: "Google Drive" },
  { icon: "slack.svg", name: "Slack" },
  { icon: "telegram.svg", name: "Telegram" },
  { icon: "google-meet.png", name: "Google Meet" },
  { icon: "discord.svg", name: "Discord" },
  { icon: "teams.svg", name: "Microsoft Teams" },
];

const team = [
  {
    app: "whatsapp.svg",
    avatar: "hana",
    file: "12 draf pesan pelanggan",
    kind: "support",
    name: "Hana",
    reply:
      "Ada 12 pesanan siap diambil. Aku cocokkan nomor pesanan dan siapkan pesan untuk masing-masing pelanggan.",
    role: "Customer Support",
    task: "Bantu kabari pelanggan yang cuciannya sudah siap diambil.",
  },
  {
    app: "gmail.svg",
    avatar: "dimas",
    file: "Ringkasan penjualan & piutang",
    kind: "finance",
    name: "Dimas",
    reply:
      "Penjualan minggu ini Rp18,45 juta. Ada 3 invoice jatuh tempo. Ini daftar yang perlu tim tindak lanjuti.",
    role: "Finance",
    task: "Sebelum tutup toko, cek penjualan dan tagihan yang belum lunas.",
  },
  {
    app: "google-drive.svg",
    avatar: "kezia",
    file: "Desain promo & caption",
    kind: "marketing",
    name: "Kezia",
    reply:
      "Aku siapkan konsep visual dan caption untuk paket makan siang. Tim tinggal cek harga dan stok sebelum tayang.",
    role: "Marketing",
    task: "Bikin promo makan siang untuk hari Selasa yang biasanya sepi.",
  },
] as const;

const featuredAgents = [
  {
    avatar: "jovan",
    name: "Jovan",
    role: "Chief of Staff",
    task: "Koordinasi tim dan pembagian tugas.",
  },
  {
    avatar: "alya",
    name: "Alya",
    role: "Human Resources",
    task: "Rekrutmen, onboarding, dan panduan tim.",
  },
  {
    avatar: "dimas",
    name: "Dimas",
    role: "Finance",
    task: "Ringkasan keuangan dan tindak lanjut invoice.",
  },
  {
    avatar: "fajar",
    name: "Fajar",
    role: "Sales",
    task: "Persiapan penawaran dan follow-up prospek.",
  },
  {
    avatar: "hana",
    name: "Hana",
    role: "Customer Support",
    task: "Balasan pelanggan yang sesuai panduan bisnis.",
  },
  {
    avatar: "kezia",
    name: "Kezia",
    role: "Social Media",
    task: "Ide kampanye, caption, dan materi konten.",
  },
  {
    avatar: "bima",
    name: "Bima",
    role: "Operations",
    task: "SOP, checklist, dan koordinasi operasional.",
  },
  {
    avatar: "nisa",
    name: "Nisa",
    role: "Legal Support",
    task: "Draf dokumen untuk ditinjau penasihat hukum.",
  },
] as const;

const industries = [
  {
    action: "Pesan jemput cucian",
    brand: "PUTAR LAUNDRY",
    credit: "Mathias Reding",
    detail: "Waktumu untuk hal yang lebih seru.",
    headline: ["CUCIAN RAPI.", "WEEKEND", "SANTAI."],
    id: "laundry",
    job: "Hana menyiapkan balasan status cucian. Kezia bantu bikin promo jemput antar dari brief tim.",
    label: "Laundry",
    offer: "Cuci. Lipat. Antar.",
    owner:
      "Tim loket memeriksa pesanan dan menangani kebutuhan khusus pelanggan.",
    photo: "https://www.pexels.com/photo/11213210/",
    task: "Siapkan promo jemput cucian untuk pelanggan sekitar toko.",
    title: "Cucian beres. Pelanggan dapat kabar.",
  },
  {
    action: "Booking lewat WhatsApp",
    brand: "KILAP GARAGE",
    credit: "Tima Miroshnichenko",
    detail: "Mobil siap. Jalan lagi.",
    headline: ["BERSIH.", "BALIK", "KILAP."],
    id: "carwash",
    job: "Hana merangkum permintaan booking. Kezia siapkan materi promo paket cuci dan vakum.",
    label: "Car wash",
    offer: "Cuci luar + vakum interior",
    owner:
      "Tim mengecek slot, mengonfirmasi jadwal, dan memastikan hasil cucian.",
    photo: "https://www.pexels.com/photo/6873122/",
    task: "Bikin promo paket cuci dan vakum untuk akhir pekan.",
    title: "Tim fokus cuci. Booking tetap tertata.",
  },
  {
    action: "Cek menu hari ini",
    brand: "DAPUR SORE",
    credit: "Tuğba Özsoy",
    detail: "Istirahat sebentar. Makan yang benar.",
    headline: ["JAM LAPAR.", "MENU", "ANDALAN."],
    id: "restaurant",
    job: "Dimas membaca laporan penjualan. Kezia mengubah temuan itu jadi konsep promo untuk jam sepi.",
    label: "Restoran",
    offer: "Paket makan siang",
    owner:
      "Pemilik dan tim dapur menentukan harga, stok, dan promo yang layak dijalankan.",
    photo: "https://www.pexels.com/photo/37431302/",
    task: "Bantu isi jam makan siang dengan promo menu favorit.",
    title: "Dari laporan penjualan ke menu andalan.",
  },
  {
    action: "Tanya stok ke kasir",
    brand: "RAK LOKAL",
    credit: "ha ha",
    detail: "Daftar belanja panjang? Mampir sini.",
    headline: ["ISI ULANG.", "BELANJA", "HEMAT."],
    id: "retail",
    job: "Dimas merangkum stok yang menipis. Kezia siapkan materi promo dari daftar produk pilihan tim.",
    label: "Retail",
    offer: "Kebutuhan rumah, dekat rumah",
    owner:
      "Tim toko mengecek stok fisik, memilih produk, dan menyetujui pesanan ke pemasok.",
    photo: "https://www.pexels.com/photo/16211537/",
    task: "Bikin promo kebutuhan mingguan dari produk yang stoknya tersedia.",
    title: "Stok terbaca. Promo lebih terarah.",
  },
] as const;

const comparison = [
  [
    "Pembagian kerja",
    "Spesialis dengan peran dan instruksi masing-masing.",
    "Satu asisten mengikuti arahan di percakapan.",
  ],
  [
    "Konteks bisnis",
    "Panduan dan memori untuk tiap agen.",
    "Konteks diberikan lewat chat atau lampiran.",
  ],
  [
    "Kerja bersama",
    "Agen berbagi brief dan meneruskan tugas dalam grup.",
    "Kamu membawa hasil dari satu percakapan ke pekerjaan berikutnya.",
  ],
  [
    "Rutinitas",
    "Jadwal untuk ringkasan dan pengingat.",
    "Tugas dimulai saat kamu membuka chat dan meminta.",
  ],
  [
    "Akses aplikasi",
    "Aplikasi dan alat diatur untuk tiap agen.",
    "Mengikuti alat yang tersedia pada asisten.",
  ],
];

export { comparison, featuredAgents, industries, integrations, team };
