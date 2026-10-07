# Affiliate Genius AI v21

Platform affiliate marketing realtime berbasis **Next.js App Router**, **Supabase**, dan **Gemini AI**. Project ini menyediakan dashboard untuk mengelola link affiliate, planner konten, profil brand, mini-store, A/B testing, tracking klik, tracking konversi, dan generator prompt foto produk.

> Dokumentasi ini dibuat untuk programmer, contributor, dan developer yang ingin menjalankan project secara lokal, memahami struktur folder, melakukan konfigurasi Supabase/Gemini, serta melakukan deployment.

---

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Kelebihan](#kelebihan)
3. [Teknologi](#teknologi)
4. [Prasyarat](#prasyarat)
5. [Instalasi Lokal](#instalasi-lokal)
6. [Konfigurasi Environment](#konfigurasi-environment)
7. [Setup Supabase](#setup-supabase)
8. [Menjalankan Aplikasi](#menjalankan-aplikasi)
9. [Struktur Project](#struktur-project)
10. [Daftar Halaman](#daftar-halaman)
11. [Daftar API](#daftar-api)
12. [Cara Testing](#cara-testing)
13. [Realtime](#realtime)
14. [Multi-Tenant dan Banyak Customer](#multi-tenant-dan-banyak-customer)
15. [Deployment](#deployment)
16. [Panduan Kontribusi](#panduan-kontribusi)
17. [Troubleshooting](#troubleshooting)
18. [Keamanan](#keamanan)
19. [Roadmap](#roadmap)

---

## Fitur Utama

### 1. Dashboard

Route:

```text
/dashboard
```

Menampilkan:

- Total komisi.
- Total klik.
- Total konversi.
- Conversion rate.
- Chart performa klik.
- Funnel konversi.
- Daftar link affiliate.
- Status kesehatan integrasi.
- Realtime refresh melalui Supabase Realtime.

### 2. Content Planner

Route:

```text
/planner
```

Kegunaan:

- Menjadwalkan konten Facebook, Instagram, dan TikTok.
- Memilih tipe konten.
- Menentukan judul dan tanggal publikasi.
- Menyimpan jadwal ke tabel `content_plans`.
- Menghapus jadwal dari Supabase.
- Menghitung jumlah draft, scheduled, dan published.

### 3. AI Image Prompt Generator

Route:

```text
/image-generator
```

Kegunaan:

- Membuat prompt foto produk e-commerce.
- Pilihan style commercial, lifestyle, minimalist, luxury, dan flat lay.
- Menggunakan Gemini jika API key tersedia.
- Fallback prompt jika Gemini tidak aktif.
- Menyimpan histori prompt ke tabel `image_prompts`.

### 4. Business Memory AI

Route:

```text
/memory-ai
```

Menyimpan konteks bisnis:

- Nama brand.
- Target audience.
- Tone of voice.
- Produk utama.
- Niche bisnis.

Data ini bisa digunakan sebagai konteks fitur AI berikutnya.

### 5. Link Tracker

Route:

```text
/link-tracker
```

Menampilkan:

- Komisi bulan ini.
- EPC atau earnings per click.
- Link aktif.
- Link mati.
- Produk affiliate.
- Conversion rate per produk.

### 6. Mini Store

Route:

```text
/mini-store
```

Kegunaan:

- Membuat halaman link-in-bio.
- Menyimpan slug toko.
- Menyimpan judul toko.
- Menyimpan bio.
- Memilih tema.
- Menampilkan preview tampilan mobile.
- Menampilkan link produk dari Supabase.

### 7. A/B Testing

Route:

```text
/ab-testing
```

Kegunaan:

- Menampilkan beberapa test landing page.
- Membandingkan visitor dan conversion.
- Menghitung conversion rate.
- Menandai varian dengan performa terbaik.

### 8. Offline Mode

Route:

```text
/offline
```

Kegunaan:

- Menampilkan status koneksi.
- Menampilkan antrean sinkronisasi.
- Menyediakan arsitektur awal untuk mode offline.

### 9. Login dan Registrasi

Route:

```text
/login
```

Menggunakan Supabase Auth untuk:

- Registrasi email dan password.
- Login pelanggan.
- Persist session.
- Proteksi halaman aplikasi.

---

## Kelebihan

- Berbasis Next.js App Router.
- Data tidak lagi bergantung pada dummy data.
- Supabase menyediakan database PostgreSQL, Auth, RLS, dan Realtime.
- Gemini AI digunakan hanya di server-side data layer sehingga API key tidak perlu diekspos ke browser.
- Tracking klik memakai shortlink.
- Tracking konversi tersedia melalui API.
- Struktur data dapat dikembangkan menjadi SaaS multi-tenant.
- RLS membantu memisahkan data antar customer.
- Fallback aman saat environment variable belum tersedia.
- Cocok dikembangkan untuk ribuan customer dengan indexing dan query per tenant.
- Tidak membutuhkan backend terpisah untuk tahap awal.

---

## Teknologi

- Next.js 16
- React
- JavaScript
- Supabase PostgreSQL
- Supabase Auth
- Supabase Realtime
- `@supabase/supabase-js`
- Google Gemini API
- `@google/generative-ai`

---

## Prasyarat

Install terlebih dahulu:

- Node.js 20 atau versi LTS terbaru.
- npm.
- Git.
- Akun GitHub.
- Akun Supabase.
- Gemini API key jika ingin mengaktifkan AI.

Cek versi:

```powershell
node --version
npm --version
git --version
```

---

## Instalasi Lokal

Clone repository:

```powershell
git clone https://github.com/USERNAME/affiliate-genius-ai-v21.git
cd affiliate-genius-ai-v21
```

Install dependency:

```powershell
npm install
```

Jalankan development server:

```powershell
npm run dev
```

Buka browser:

```text
http://localhost:3000
```

---

## Konfigurasi Environment

Buat file berikut di root project:

```text
.env.local
```

Isi:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Keterangan:

| Variable | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key untuk client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key untuk API tracking |
| `GEMINI_API_KEY` | Key Google Gemini |

Jangan commit file `.env.local`.

---

## Setup Supabase

### Langkah 1 — Buat project

1. Buka https://supabase.com.
2. Login.
3. Klik **New project**.
4. Buat nama project.
5. Pilih region terdekat.
6. Tunggu sampai database aktif.

### Langkah 2 — Jalankan schema dasar

Buka:

```text
Supabase Dashboard → SQL Editor → New query
```

Copy isi file:

```text
database/schema.sql
```

Klik **Run**.

Schema ini membuat tabel:

```text
business_memory
affiliate_links
link_clicks
conversions
content_plans
landing_tests
store_profiles
store_links
image_prompts
```

### Langkah 3 — Jalankan migration multi-tenant

Setelah schema dasar selesai, copy isi:

```text
database/multitenant.sql
```

Klik **Run**.

Migration ini:

- Menambahkan `owner_id`.
- Menghubungkan data dengan `auth.users`.
- Mengaktifkan RLS tenant.
- Membuat policy owner-only.
- Membuat index tenant.
- Membuat fungsi counter atomic untuk klik dan order.

### Langkah 4 — Aktifkan Email Auth

Buka:

```text
Supabase Dashboard → Authentication → Providers → Email
```

Aktifkan Email Provider.

Untuk testing, email confirmation dapat dimatikan sementara. Untuk production, sebaiknya tetap aktif.

### Langkah 5 — Aktifkan Realtime

Buka Database Replication atau Publications, lalu aktifkan tabel:

```text
affiliate_links
link_clicks
conversions
content_plans
landing_tests
store_links
```

---

## Menjalankan Aplikasi

Mode development:

```powershell
npm run dev
```

Build production:

```powershell
npm run build
```

Menjalankan build production:

```powershell
npm run start
```

---

## Struktur Project

```text
app/
├── layout.js                    Layout global dan AuthGate
├── page.js                      Redirect ke dashboard
├── globals.css                  Tema global
├── login/page.js                Login dan registrasi
├── dashboard/page.js            Dashboard realtime
├── planner/page.js              Content planner
├── image-generator/page.js      Generator prompt AI
├── memory-ai/page.js            Profil bisnis
├── link-tracker/page.js         Analitik affiliate
├── mini-store/page.js           Mini store
├── ab-testing/page.js           A/B testing
├── offline/page.js              Offline architecture
├── components/
│   ├── AuthGate.js              Proteksi halaman
│   └── Sidebar.js               Navigasi samping
└── api/
    ├── r/[code]/route.js        Shortlink dan tracking klik
    └── track/route.js            Tracking konversi

lib/
├── supabase.js                  Browser Supabase client dan safe query
├── supabase-server.js            Server Supabase client
├── useRealtime.js                Hook Supabase Realtime
├── dashboard-data.js             Data dashboard
├── tracker-data.js               Data tracker
├── planner-data.js               Data planner
├── image-generator-data.js      Gemini dan histori prompt
├── memory-ai-data.js             Business memory
├── mini-store-data.js            Mini store
├── ab-testing-data.js             A/B testing
├── offline-data.js                Offline data
└── link-tracker.js                Helper link lama

database/
├── schema.sql                    Schema awal database
└── multitenant.sql               Migration Auth, owner, dan RLS
```

---

## Daftar API

### Tracking klik dan redirect

Endpoint:

```text
GET /api/r/[code]
```

Contoh:

```text
http://localhost:3000/api/r/tumbler-viral
```

Alur:

1. Cari affiliate link berdasarkan `code`.
2. Validasi link aktif.
3. Simpan log ke `link_clicks`.
4. Tambah counter klik secara atomic.
5. Redirect ke URL tujuan.

### Tracking konversi

Endpoint:

```text
POST /api/track
```

Contoh request:

```json
{
  "link_id": 1,
  "order_id": "ORDER-001",
  "amount": 250000,
  "commission": 12500
}
```

Contoh PowerShell:

```powershell
Invoke-RestMethod `
  -Uri http://localhost:3000/api/track `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"link_id":1,"order_id":"ORDER-001","amount":250000,"commission":12500}'
```

---

## Cara Testing

### Test login

1. Buka `/login`.
2. Klik **Buat akun baru**.
3. Isi email dan password minimal 6 karakter.
4. Daftar.
5. Login jika email confirmation aktif.
6. Pastikan diarahkan ke `/dashboard`.

### Test planner

1. Buka `/planner`.
2. Isi judul dan tanggal.
3. Klik **Tambah**.
4. Cek tabel `content_plans` di Supabase.
5. Klik tombol hapus.
6. Pastikan row terhapus.

### Test Memory AI

1. Buka `/memory-ai`.
2. Isi brand, audience, tone, produk, dan niche.
3. Klik **Simpan**.
4. Reload halaman.
5. Pastikan data tetap ada.

### Test Gemini

1. Isi `GEMINI_API_KEY`.
2. Restart server.
3. Buka `/image-generator`.
4. Masukkan nama produk.
5. Pilih style.
6. Klik **Generate Prompt**.
7. Cek tabel `image_prompts`.

### Test shortlink

Masukkan sample link di Supabase:

```sql
insert into public.affiliate_links
  (owner_id, code, product, url)
values
  (
    'UUID_USER_LOGIN',
    'test-link',
    'Produk Test',
    'https://example.com'
  );
```

Buka:

```text
http://localhost:3000/api/r/test-link
```

Pastikan browser redirect dan row `link_clicks` bertambah.

### Test build

```powershell
npm run build
```

Build harus selesai tanpa error compile.

---

## Realtime

Hook realtime tersedia di:

```text
lib/useRealtime.js
```

Contoh penggunaan:

```javascript
import { useRealtimeTable } from '@/lib/useRealtime'
import { getLinks } from '@/lib/dashboard-data'

const links = useRealtimeTable('affiliate_links', getLinks)
```

Realtime bekerja jika:

1. Supabase environment benar.
2. User memiliki session valid.
3. Tabel masuk publication Realtime.
4. RLS policy mengizinkan user membaca row miliknya.

---

## Multi-Tenant dan Banyak Customer

Arsitektur multi-tenant menggunakan pola:

```text
satu user Supabase Auth = satu workspace
```

Setiap tabel bisnis memiliki:

```text
owner_id uuid
```

Data harus selalu disimpan dengan owner ID user yang sedang login. Query harus selalu memakai filter owner.

Contoh konsep query:

```javascript
const { data: session } = await supabase.auth.getUser()
const ownerId = session.user.id

const { data } = await supabase
  .from('content_plans')
  .select('*')
  .eq('owner_id', ownerId)
```

Keamanan utama berasal dari RLS, bukan hanya filter di frontend. Jika frontend salah query, policy database tetap harus menolak data tenant lain.

Untuk ribuan customer:

- Gunakan index pada `owner_id`.
- Gunakan pagination untuk tabel besar.
- Jangan mengambil seluruh tabel tanpa filter.
- Gunakan server-side API untuk secret key.
- Gunakan atomic database function untuk counter.
- Aktifkan monitoring Supabase.
- Gunakan paket Supabase sesuai volume trafik.
- Tambahkan rate limiting pada endpoint publik.

---

## Deployment ke GitHub

### 1. Buat repository

1. Login GitHub.
2. Klik **New repository**.
3. Beri nama, misalnya:

```text
affiliate-genius-ai-v21
```

4. Pilih Public atau Private.
5. Jangan centang initialize README jika README project sudah ada.
6. Klik **Create repository**.

### 2. Pastikan secret tidak ikut terupload

Sebelum commit, pastikan file berikut tidak di Git:

```text
.env
.env.local
.env.*.local
node_modules/
.next/
```

### 3. Commit dan push

```powershell
git init
git add .
git status
git commit -m "Initial Affiliate Genius AI v21"
git branch -M main
git remote add origin https://github.com/USERNAME/affiliate-genius-ai-v21.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub.

### 4. Jika repository sudah memiliki remote

```powershell
git remote -v
git add .
git commit -m "Update realtime multi-tenant features"
git push
```

---

## Deployment ke Vercel

Cara termudah adalah Vercel.

1. Buka https://vercel.com.
2. Login dengan GitHub.
3. Klik **Add New Project**.
4. Import repository.
5. Framework otomatis terdeteksi sebagai Next.js.
6. Tambahkan environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

7. Klik **Deploy**.
8. Setelah deploy, tes `/login`, `/dashboard`, dan API tracking.

Jangan menaruh `SUPABASE_SERVICE_ROLE_KEY` sebagai variable `NEXT_PUBLIC_`.

---

## Panduan Kontribusi

1. Fork repository.
2. Buat branch baru:

```powershell
git checkout -b feature/nama-fitur
```

3. Kerjakan perubahan.
4. Jalankan build:

```powershell
npm run build
```

5. Commit dengan pesan jelas:

```powershell
git add .
git commit -m "Add feature description"
```

6. Push branch:

```powershell
git push origin feature/nama-fitur
```

7. Buat Pull Request.

Konvensi branch yang disarankan:

```text
feature/nama-fitur
fix/nama-bug
refactor/nama-area
docs/nama-dokumentasi
```

---

## Troubleshooting

### `Invalid API key`

Periksa:

- URL Supabase benar.
- Anon key benar.
- Tidak ada spasi di `.env.local`.
- Server sudah direstart.

### `LOGIN_REQUIRED`

Artinya user belum login atau session expired.

Solusi:

```text
Buka /login lalu login kembali.
```

### Data kosong setelah migration

Data lama mungkin memiliki:

```text
owner_id = null
```

Data tersebut tidak tampil untuk user yang login. Jika data memang milik user tertentu, isi owner ID dengan hati-hati menggunakan SQL migration.

### `permission denied for table`

Periksa:

- RLS aktif.
- Migration `database/multitenant.sql` sudah dijalankan.
- User memiliki session.
- Row memiliki `owner_id` yang sesuai.

### Gemini fallback terus

Periksa:

- `GEMINI_API_KEY` sudah diisi.
- Nama variable tepat.
- Server sudah direstart.
- API key masih aktif.
- Model Gemini tersedia untuk project tersebut.

### Tracking klik gagal

Periksa:

- `SUPABASE_SERVICE_ROLE_KEY` tersedia di server.
- Fungsi database atomic sudah dijalankan.
- Link memiliki `code` dan `active = true`.
- URL target valid.

### Build gagal

Jalankan:

```powershell
rm -r .next
npm install
npm run build
```

Di PowerShell Windows, jika `rm` tidak tersedia gunakan:

```powershell
Remove-Item .next -Recurse -Force
npm install
npm run build
```

---

## Keamanan

- Jangan commit `.env.local`.
- Jangan membagikan service role key.
- Jangan memakai service role key di client component.
- Gunakan RLS untuk semua tabel tenant.
- Validasi input API.
- Tambahkan rate limiting sebelum membuka endpoint tracking ke publik luas.
- Jangan percaya `owner_id` yang dikirim browser; ambil identitas dari session atau server.
- Gunakan HTTPS pada production.
- Aktifkan email verification.
- Atur backup database Supabase.
- Audit policy RLS sebelum menerima customer berbayar.

---

## Roadmap

- Pagination dashboard dan tracker.
- Rate limiting API publik.
- Webhook konversi dari affiliate network.
- CRUD affiliate links dari UI.
- CRUD store links dari UI.
- Supabase Storage untuk gambar produk.
- Export CSV laporan.
- Billing dan paket subscription.
- Role owner, admin, editor, dan viewer.
- Audit log tenant.
- Background job untuk link health monitor.
- Automated tests dan CI GitHub Actions.

---

## Lisensi

Tambahkan lisensi sesuai kebutuhan project sebelum repository dibuka untuk publik. Pilihan umum:

- MIT untuk project open source yang permisif.
- Apache-2.0 untuk perlindungan paten dan penggunaan komersial.
- Proprietary jika source code tidak boleh digunakan ulang.

---

## Perbaikan Bug dan Hardening Terbaru

Perbaikan yang sudah diterapkan:

- Memperbaiki duplicate declaration pada `lib/tracker-data.js` yang menyebabkan build gagal.
- Menambahkan filter `owner_id` pada dashboard, tracker, A/B testing, image prompt, planner, memory, dan mini-store.
- Memastikan query tidak berjalan saat Supabase atau session belum tersedia.
- Menambahkan validasi angka pada endpoint `/api/track`.
- Menambahkan validasi `link_id`, `amount`, `commission`, dan panjang `order_id`.
- Menyimpan `owner_id` pada record konversi.
- Membatasi shortlink hanya pada link aktif.
- Menambahkan pencatatan error tracking tanpa menggagalkan redirect affiliate.
- Menggunakan atomic counter database untuk klik dan order.
- Memastikan update Memory AI dan Mini Store hanya dapat dilakukan oleh owner row.
- Membatasi penghapusan planner berdasarkan `owner_id`.
- Menambahkan `.gitignore` untuk mencegah secret, build, dan dependency ikut ter-upload.
- Menjalankan validasi production build dengan Webpack; kompilasi, TypeScript, dan static page generation berhasil.

### Verifikasi build

```powershell
npx next build --webpack
```

Output penting yang harus terlihat:

```text
Compiled successfully
Finished TypeScript
Generating static pages
```

Jika proses terminal berhenti saat tahap `Finalizing page optimization`, periksa kembali output sebelumnya. Source compile dan route generation harus tetap berhasil terlebih dahulu.

---

## Status Project

Affiliate Genius AI v21 saat ini memiliki fondasi:

- Next.js App Router.
- Supabase database.
- Supabase Auth.
- RLS multi-tenant.
- Supabase Realtime.
- Gemini prompt generation.
- Tracking klik.
- Tracking konversi.
- Planner persistence.
- Business Memory persistence.
- Mini Store persistence.

Sebelum digunakan untuk customer production dalam skala besar:

1. Jalankan `database/schema.sql`.
2. Jalankan `database/multitenant.sql`.
3. Isi semua environment variable.
4. Buat dua akun customer berbeda.
5. Uji bahwa customer A tidak dapat melihat data customer B.
6. Aktifkan Email Confirmation.
7. Tambahkan rate limiting pada endpoint publik.
8. Tambahkan pagination untuk dataset besar.
9. Pastikan fungsi RPC atomic sudah tersedia.
10. Jalankan `npm run build` sebelum deployment.

Semua getter utama yang sudah terhubung ke database harus mempertahankan filter `owner_id`. Jangan menghapus RLS untuk mengatasi error permission; perbaiki policy atau data owner-nya.
