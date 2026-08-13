# Sistem Informasi HRD Mini

## Overview
Sistem Informasi HRD Mini adalah aplikasi manajemen kepegawaian fullstack berbasis **Nuxt 3** dan **Node.js (Nitro)** yang terintegrasi dengan database relational **MySQL / MariaDB**. Aplikasi ini dikembangkan secara komprehensif untuk mengelola data pegawai, hak akses pengguna (RBAC), setting tarif & perhitungan otomatis tunjangan transport pegawai berbasis presensi dan jarak, serta audit aktivitas pengguna (*activity log*).

---

## Features
- **Autentikasi & Keamanan Sesi**: Login Multi-identifier (Username, Email, No. HP), Captcha Verification, Dynamic Session Expiration (3m / 7d), serta proteksi cookie `httpOnly`, `sameSite: lax`, dan pure `bcrypt.compare`.
- **Manajemen User & Role (RBAC)**: Pengelolaan pengguna aplikasi (Superadmin, Manager HRD, Admin HRD) dengan hak akses dinamis per modul.
- **Manajemen Data Pegawai (RESTful)**: Filter SQL presisi (Masa Kerja, Multi-select Jabatan, Status Kontrak), pengurutan whitelist, detail riwayat pendidikan, dan bulk status update.
- **Setting & Kalkulasi Tunjangan Transport**: Tarif per KM berbasis tanggal efektif (*effective date*), presensi bulanan riil dari database, proteksi duplikat, dan **MySQL Database Transaction API** (`BEGIN`, `COMMIT`, `ROLLBACK`).
- **Audit Log Aktivitas**: Pencatatan otomatis setiap aksi pengguna beserta User Agent dan alamat IP.
- **Swagger OpenAPI 3.0**: Dokumentasi API interaktif yang dapat diakses secara langsung pada `/api/docs`.

---

## Tech Stack
- **Frontend Framework**: Nuxt 4 / Nuxt 3 (Vue 3, Tabler Admin UI Template, Vite)
- **Backend Framework**: Nitro Engine (Node.js Server Engine)
- **Database Engine**: MySQL 5.7+ / MariaDB 10.x+ (`mysql2/promise`)
- **Security & Utilities**: BcryptJS, JSON Web Token (JWT), SVG Captcha

---

## Requirements
- **Node.js**: versi LTS (`v18.x`, `v20.x`, `v22.x`, `v24.x`)
- **Database**: MariaDB 10.4+ atau MySQL 5.7+
- **Package Manager**: npm

---

## Installation
1. Clone repository project ke komputer lokal Anda:
   ```bash
   git clone <repository-url>
   cd JMC/app
   ```
2. Install seluruh package dependensi:
   ```bash
   npm install
   ```

---

## Environment Variables
Salin file `.env.example` menjadi `.env` di dalam direktori `app/`:
```bash
cp .env.example .env
```
Isi konfigurasi pada file `app/.env`:
```env
NODE_ENV=development
PORT=3000

APP_NAME=JMC_Kepegawaian
APP_CLIENT=JMC_Teknis_Test

# Database Config (Mariadb / MySQL Connection Credentials)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_kepegawaian

# JWT Secret Key (Kunci Enkripsi Token Autentikasi JWT)
JWT_SECRET=super_secret_jmc_kepegawaian_jwt_key_2026
```

### Penjelasan Variabel Lingkungan:
- `DB_HOST`: Alamat host server MySQL/MariaDB (default `localhost`).
- `DB_PORT`: Port service MySQL/MariaDB (default `3306`).
- `DB_USER`: Username akun basis data (misal: `root`).
- `DB_PASSWORD`: Kata sandi basis data (kosongkan jika tanpa password).
- `DB_NAME`: Nama schema database relasional (`db_kepegawaian`).
- `JWT_SECRET`: Untaian kunci rahasia acak untuk menandatangani (*signing*) token JWT pengguna.

---

## Database Setup & Schema
1. Jalankan server database MySQL/MariaDB (misal via XAMPP / Native MariaDB).
2. Buat database baru bernama `db_kepegawaian`:
   ```sql
   CREATE DATABASE db_kepegawaian;
   ```
3. Struktur tabel utama yang wajib tersedia:
   - `user`, `user_role`, `role_permission`
   - `pegawai`, `pegawai_pendidikan`, `master_data`, `master_wilayah`
   - `setting_tunjangan_transport`, `tunjangan_transport`, `tunjangan_transport_detail`, `total_masuk_pegawai`
   - `activities`

---

## Migration / Seed
Import skema database & data seed awal dari file SQL reproducible yang tersedia di repository:
- File SQL: `Database/sql-db-kepegawaian/sql-db-kepegawaian/kepegawaian-db.sql`

Cara import via Command Line:
```bash
mysql -u root -p db_kepegawaian < "../Database/sql-db-kepegawaian/sql-db-kepegawaian/kepegawaian-db.sql"
```

---

## Run Development
Jalankan server pengembangan Nuxt:
```bash
npm run dev
```
Akses aplikasi melalui peramban web di: `http://localhost:3000`

---

## Production Build
Untuk membangun bundle aplikasi siap produksi:
```bash
npm run build
```
Menjalankan server produksi:
```bash
node .output/server/index.mjs
```

---

## Authentication
- Menggunakan skema gabungan **httpOnly Cookie** (`token`) untuk web browser dan **Bearer Token Header** (`Authorization: Bearer <JWT>`) untuk API Client/Swagger.
- Menggunakan pure `bcrypt.compare` (Tanpa fallback password plaintext atau mock bypass).
- Durasi sesi ter-sinkronisasi: **3 Menit** (Remember Me OFF) dan **7 Hari** (Remember Me ON).

---

## RBAC
Matriks Otorisasi Hak Akses Sistem:
- **Superadmin**: Akses Penuh Kelola User, Role, Dashboard, dan Log System. (Forbidden menghapus pegawai Superadmin).
- **Manager HRD**: Akses Read-Only pada Dashboard HRD, Rekap Tunjangan, dan Profil. (Forbidden melakukan WRITE operation).
- **Admin HRD**: Akses WRITE/CRUD Data Pegawai, Setting Tarif Tunjangan, dan Kalkulasi Tunjangan.

---

## Employee Management
- API RESTful: `GET /api/pegawai/:id`, `PUT /api/pegawai/:id`, `DELETE /api/pegawai/:id`.
- Saringan SQL mutakhir berbasis `TIMESTAMPDIFF` untuk masa kerja, status kontrak, dan multi-select jabatan.
- Proteksi server-side melempar `403 Forbidden` jika Admin HRD mencoba menghapus pegawai dengan peran Superadmin.

---

## Transport Allowance
- Formula Perhitungan: $Nominal = BaseFare \times KM \times HariMasuk$.
- Presensi / jumlah hari masuk kerja per bulan disimpan pada tabel database `total_masuk_pegawai` dan digunakan sebagai dasar otomatis perhitungan tunjangan transport.
- Kalkulasi dieksekusi di dalam **MySQL Database Transaction** (`BEGIN`, `FOR UPDATE`, `DELETE/INSERT`, `COMMIT`, `ROLLBACK`) untuk mencegah parsial data header/detail.
- Constraint Unik Database `(id_tunjangan_transport, id_pegawai)` mencegah duplikasi kalkulasi.

---

## Activity Log
Pencatatan otomatis audit log pada tabel `activities` saat pengguna melakukan login, logout, atau manipulasi data penting.

---

## API
Seluruh API terstruktur secara RESTful di bawah prefix `/api/`:
- Auth: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- User & Role: `/api/user`, `/api/role`
- Pegawai: `/api/pegawai`, `/api/pegawai/:id`, `/api/pegawai/bulk-status`
- Tunjangan: `/api/tunjangan`, `/api/tunjangan/:id`, `/api/tunjangan/setting`, `/api/tunjangan/hitung`

---

## Swagger
Dokumentasi OpenAPI 3.0 interaktif dapat diakses saat aplikasi berjalan pada peramban web:
👉 **`http://localhost:3000/api/docs`** (Atau file fisik `public/swagger.json`).

---

## Demo Account
Seluruh password terenkripsi asli dengan **Bcrypt Hash**:

| Role | Username | Password | Deskripsi Peran |
| :--- | :--- | :--- | :--- |
| **Superadmin** | `superadmin` | `Password123!` | Akses Penuh Kelola System & User |
| **Manager HRD** | `sitiaminah` | `Password123!` | Read-Only Dashboard & Tunjangan |
| **Admin HRD** | `ahmadrizki` | `Password123!` | CRUD Pegawai & Setting Tunjangan |

---

## Project Structure
```text
JMC/
├── Database/
│   └── sql-db-kepegawaian/
│       └── sql-db-kepegawaian/
│           └── kepegawaian-db.sql   # Reproducible Database Schema & Seeds
├── PRD1.4.md                        # Final Specification Document
├── README.md                        # Project Comprehensive Documentation
└── app/
    ├── app/                         # Frontend Vue Components & Pages
    │   ├── components/
    │   ├── pages/
    │   └── data/                    # UI Configuration Data (Menu layout)
    ├── public/
    │   └── swagger.json             # OpenAPI 3.0 Schema
    ├── server/                      # Backend Nitro API & Utilities
    │   ├── api/                     # Native Nitro Endpoint Handlers
    │   └── utils/                   # DB Connection & Auth Utilities
    ├── .env.example                 # Environment Template
    ├── nuxt.config.js               # Nuxt 3 Engine Configuration
    └── package.json
```

---

## Security
- **CSRF Defense**: Dual-Layer Strategy via Cookie Attribute `sameSite: 'lax'`, `httpOnly: true`, dan `requireRoles` backend validation.
- **XSS Defense**: Interpolasi Teks Otomatis Vue `{{ text }}` (Tanpa eksekusi HTML/Script).
- **SQL Injection Defense**: Prepared Statements Parameterized Query (`?`) dan Whitelisted Sort Column Maps pada seluruh klausul SQL.

---

## Deployment
Untuk mendepoy aplikasi ke server produksi:
1. Pastikan variabel `NODE_ENV=production` dan `JWT_SECRET` terpasang di `.env`.
2. Jalankan `npm run build`.
3. Jalankan service via Process Manager (misal: PM2):
   ```bash
   pm2 start .output/server/index.mjs --name "jmc-hrd"
   ```

---

