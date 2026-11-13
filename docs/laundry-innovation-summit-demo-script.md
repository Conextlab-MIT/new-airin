# Naskah demo — Laundry Innovation Summit (±6 menit)

**Audiens:** 500+ pemilik laundry SME, usia 40+, Bahasa Indonesia.  
**Tone:** sederhana seperti ChatGPT — tanpa istilah teknis, tanpa MCP/provider/worker.  
**UI:** Mode **Owner**, org **Conextlab**, onboarding **mati**.  
**Base URL:** `http://localhost:3003` (ganti dengan domain produksi jika perlu).

---

## Persiapan (sebelum naik panggung)

1. Login sekali; biarkan sesi aktif.
2. Pin di sidebar: **Kezia, Hana, Bima, Dimas, Fajar** (opsional **Jovan**).
3. Buka tab bookmark (urutan):

   - `http://localhost:3003/chat?new=1` (pilih Kezia dari sidebar)
   - Atau langsung:  
     - Kezia: `/chat/gtTtoXn1iCQ4vs23QA5t1?new=1`  
     - Hana: `/chat/nGUJaUQuNsYFEs7OKA5hH?new=1`  
     - Bima: `/chat/USutb4x8J0cfftGCfcamo?new=1`  
     - Dimas: `/chat/3Ssx1u7mldEUAYUMYWe99?new=1`  
     - Fajar: `/chat/0AyBNucJ6YHYOTLE0uBSI?new=1`
4. HP WhatsApp sudah pairing (jika live); jika tidak, baca **fallback Hana**.
5. Jangan buka **Advanced**, MCP, atau Workers.

---

## 0 — Buka ruang kerja laundry (±45 detik)

| | |
|---|---|
| **KATAKAN** | “Ini Airin — bukan satu chatbot, tapi **tim agen AI** untuk bisnis laundry Anda. Di kiri ada tim: media sosial, layanan WhatsApp, analis data, keuangan, dan visibilitas di Google Maps. Saya klik nama, tanya seperti ChatGPT, mereka kerja.” |
| **TAMPILKAN** | Sidebar Owner dengan 5–6 nama. Klik **Kezia**. |
| **JANGAN** | Settings, model picker, token usage. |

---

## 1 — Media sosial: rencana bulanan + carousel (±55 detik)

| | |
|---|---|
| **AGEN** | **Kezia** |
| **KETIK (copy-paste)** | `Buat rencana konten Instagram 30 hari untuk laundry kiloan keluarga di Jakarta Selatan. Tema: promo cuci sepatu, cuci boneka, dan membership bulanan. Formatkan: (1) kalender mingguan singkat, (2) 5 ide carousel dengan judul slide, (3) teks caption siap tempel per posting.` |
| **KATAKAN (sambil menunggu)** | “Kezia merencanakan konten — owner tidak perlu mikir tiap hari mau posting apa.” |
| **HARAPKAN** | Kalender + ide carousel + caption (boleh minta `generate_image` untuk 1 slide jika gambar jadi). |
| **FALLBACK** | Jika lambat: “Hasilnya bisa disimpan sebagai dokumen; yang penting rencananya jadi dalam hitungan menit, bukan berminggu-minggu.” |

---

## 2 — Layanan WhatsApp: jawab pelanggan + catat ke Sheet (±55 detik)

| | |
|---|---|
| **AGEN** | **Hana** (web) **+** HP WhatsApp jika worker hidup |
| **KETIK (di web)** | `Pelanggan WhatsApp tanya: "Pak, cuci kiloan berapa per kg? Bisa pickup hari ini?" Jawab singkat ramah dalam bahasa Indonesia. Lalu buat ringkasan 1 baris untuk dicatat: tanggal, pertanyaan, jawaban, status.` |
| **KATAKAN** | “Hana menjawab seperti CS Anda — sopan, singkat, cocok WhatsApp.” |
| **LIVE (opsional)** | Kirim pertanyaan sama ke nomor bot; tunjukkan jawaban di HP. |
| **Sheet** | Jika Composio Google Sheets sudah connect: tambahkan prompt `Catat ringkasan ini ke Sheet tab LogChat.` **Jika belum:** katakan “Integrasi Sheets tinggal sambung sekali di Connections — konten jawabannya sudah siap.” |
| **FALLBACK** | Hanya web chat + tunjukkan teks jawaban; jangan klaim file masuk Sheet. |

---

## 3 — Analis data: ramalan + cuaca + promo hujan (±55 detik)

| | |
|---|---|
| **AGEN** | **Bima** |
| **KETIK** | `Data 4 minggu terakhir laundry saya: minggu 1: 180 kg, minggu 2: 210 kg, minggu 3: 195 kg, minggu 4: 230 kg. Cek prakiraan hujan Jakarta 7 hari ke depan. Ramalkan beban cuci minggu depan, dan sarankan apakah perlu promo "diskon hari hujan" — jelaskan alasannya dalam 5 bullet, bahasa sederhana.` |
| **KATAKAN** | “Bima gabungkan data kita dan cuaca — owner dapat saran promo, bukan tebak-tebakan.” |
| **FALLBACK** | Jika weather API belum ada: agent pakai `web_search` untuk cuaca; presenter bilang “Cuaca diambil dari sumber publik, angka beban dari contoh tadi.” **Jangan** mengarang angka cuaca spesifik jika tool gagal. |

---

## 4 — Keuangan: baca data POS dari Google Sheet (±55 detik)

| | |
|---|---|
| **AGEN** | **Dimas** |
| **KETIK** | `Ini ringkasan POS minggu ini dari Sheet (salin jika perlu): total omzet Rp 42.500.000, COGS Rp 18.200.000, listrik+air Rp 3.100.000, gaji Rp 12.000.000. Hitung laba kotor dan laba bersih perkiraan. Beri 3 saran singkat untuk owner laundry.` |
| **KATAKAN** | “Dimas baca angka dari Sheet — seperti bendahara yang tidak capek hitung manual.” |
| **Data View** | Opsional buka plugin **Data View** di tab lain jika Sheet live sync sudah diset. |
| **FALLBACK** | User ketik angka di prompt (sudah di atas); jangan klaim live POS jika Sheet belum connect. |

---

## 5 — Visibilitas: ulasan Google Maps via riset web / Apify (±55 detik)

| | |
|---|---|
| **AGEN** | **Fajar** |
| **KETIK** | `Cari dan ringkas ulasan publik untuk "laundry kiloan" di area Jakarta Selatan: (1) apa pujian yang sering muncul, (2) apa keluhan yang sering muncul, (3) 3 saran perbaikan untuk laundry saya. Kutip sumber jika ada. Jangan mengarang nama toko spesifik jika tidak ada data.` |
| **KATAKAN** | “Fajar membantu baca apa yang pelanggan bilang di Maps — kita bisa perbaiki layanan dari pola ulasan.” |
| **Apify** | Jika tool Apify sudah wire: ganti prompt dengan `Gunakan alat riset visibilitas untuk Google Maps listing laundry di [area Anda] dan ringkas seperti di atas.` |
| **FALLBACK** | `web_search` / MCP Exa; katakan “Ini riset web publik — bukan dashboard resmi Google.” |

---

## 6 — Tutup + waitlist (±40 detik)

| | |
|---|---|
| **KATAKAN** | “Airin tidak mengganti karyawan — ia bantu owner yang kekurangan waktu. Nanti kami hubungi yang isi waitlist untuk akses awal.” |
| **BUKA** | `http://localhost:3003/laundry-innovation-summit` |
| **TAMPILKAN** | Form: nama, nama laundry, WhatsApp, email → submit → konfirmasi. |
| **JANGAN** | Daftar akun, bayar, atau login di landing. |

---

## Daftar “jangan tunjuk”

MCP, AI Providers, Workers, bash, plugin install, Advanced mode, command palette, token counter.

---

## Q&A singkat (jujur)

- **Posting otomatis ke Instagram?** “Draft dulu; posting otomatis butuh sambung akun — kami bantu setelah waitlist.”
- **Apakah mengganti pegawai?** “Tidak. Ini asisten untuk owner dan tim kecil.”
- **Data aman?** “Data organisasi terpisah; demo ini di lingkungan kami.”

---

*End of stage script.*
