# Initial Master Data & Domain Rules

## Prinsip: Tidak Ada Dummy Data

Aplikasi **tidak boleh membuat atau menyimpan data dummy, demo, contoh tenant, contoh guru, contoh sekolah, contoh CP, harga fiktif, statistik fiktif, maupun akun bawaan** pada database aplikasi.

Environment baru harus dimulai dalam kondisi bersih. Data operasional hanya muncul melalui aksi nyata pengguna berwenang atau proses onboarding yang eksplisit.

Untuk development dan automated testing, test factory hanya boleh membuat data **sementara di database test terisolasi** dan harus dibersihkan otomatis setelah test. Factory/testing data tidak boleh ikut ke database development bersama, staging publik, ataupun production.

## 1. Master Domain Statis

Master berikut adalah **konstanta/domain configuration**, bukan dummy data, sehingga boleh diinisialisasi oleh migration/configuration karena merupakan bagian definisi sistem.

### Curriculum Modes

- `MERDEKA` — Kurikulum Merdeka
- `MADRASAH_KBC` — Kurikulum Madrasah / KBC

### Panca Cinta

- `ALLAH_RASUL` — Cinta Allah dan Rasul-Nya
- `ILMU` — Cinta Ilmu
- `LINGKUNGAN` — Cinta Lingkungan
- `DIRI_SESAMA` — Cinta Diri dan Sesama Manusia
- `TANAH_AIR` — Cinta Tanah Air

### Dimensi Profil Lulusan

- Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa
- Kewargaan
- Penalaran Kritis
- Kreativitas
- Kolaborasi
- Kemandirian
- Kesehatan
- Komunikasi

### Prinsip Pembelajaran Mendalam

- `BERKESADARAN`
- `BERMAKNA`
- `MENGGEMBIRAKAN`

### Pengalaman Belajar

- `MEMAHAMI`
- `MENGAPLIKASI`
- `MEREFLEKSI`

### Tahap Asesmen

- `INITIAL`
- `FORMATIVE`
- `SUMMATIVE`

### Document Types

- `TP`
- `ATP`
- `LESSON_PLAN`
- `TEACHING_MODULE`
- `QUESTION_BLUEPRINT`
- `QUESTION_PACKAGE`
- `RUBRIC`
- `KKTP_IKTP`
- `REMEDIAL_ENRICHMENT`
- `PROTA`
- `PROMES`
- `TEACHING_JOURNAL`

### Document Status

- `DRAFT`
- `FINAL`
- `ARCHIVED`

### Source Status

- `DRAFT`
- `EXTRACTED`
- `NEEDS_REVIEW`
- `VERIFIED`
- `PUBLISHED`
- `SUPERSEDED`
- `ARCHIVED`

## 2. Platform Bootstrap Tanpa Data Bawaan

### Super Admin

Jangan membuat akun Super Admin default. Instalasi pertama harus menggunakan command/setup wizard yang meminta data nyata:

- nama;
- email;
- password;
- konfirmasi eksplisit.

Contoh implementasi command: `php artisan app:create-superadmin`.

### Tenant

Tidak ada tenant otomatis. Tenant `INDIVIDUAL` hanya dibuat setelah guru mendaftar/onboarding. Tenant `INSTITUTION` hanya dibuat setelah pendaftaran instansi atau dibuat Super Admin secara eksplisit.

### Plans & Pricing

Tidak ada plan dengan harga bawaan yang dianggap aktif. Super Admin membuat dan mempublikasikan paket melalui panel SaaS. Sebelum ada paket aktif, sistem tidak menampilkan harga atau membuat subscription otomatis.

### CP

Database awal **kosong dari CP**. CP hanya masuk melalui panel Super Admin dengan input/import sumber terverifikasi. Tidak ada fixture CP yang dipublikasikan otomatis.

### Regulasi

Tidak ada record regulasi otomatis kecuali metadata teknis yang benar-benar dibutuhkan sistem. Dokumen/sumber regulasi ditambahkan oleh Super Admin dan harus mempunyai identitas sumber serta status verifikasi.

## 3. Feature Keys

Feature key merupakan konfigurasi sistem dan boleh tersedia tanpa nilai kuota sampai Super Admin membuat paket:

- `ai_generations`
- `question_items`
- `exports`
- `storage_mb`
- `member_seats`
- `teacher_management`
- `custom_templates`
- `advanced_analytics`
- `api_access`

## 4. Business Rules

### BR-01 — No published CP, no generation
Generator harus berhenti jika CP yang sesuai belum dipublikasikan Super Admin.

### BR-02 — CP immutable in teacher flow
Teks CP resmi yang ditampilkan pada output harus sama dengan snapshot master sumbernya dan tidak dapat diubah oleh Guru/Admin Instansi.

### BR-03 — KBC integration must be relevant
KBC menggunakan Panca Cinta yang relevan dengan tujuan/materi. Sistem tidak boleh memaksakan topik yang tidak memiliki hubungan pedagogis.

### BR-04 — KBC validator
Jika Panca Cinta dipilih, validator memeriksa keterhubungan dengan aktivitas, refleksi, dan/atau asesmen sesuai kebutuhan dokumen.

### BR-05 — Grade-phase mismatch
Ketidaksesuaian kelas dan fase harus menjadi validation error.

### BR-06 — Teacher finalization
Output AI selalu dimulai sebagai `DRAFT`. Hanya Guru yang dapat memfinalisasi dokumen miliknya menjadi `FINAL`.

### BR-07 — CP update creates a new source version
Perubahan CP resmi tidak menimpa versi yang sudah pernah dipakai dokumen lama.

### BR-08 — Historical provenance preserved
Perubahan sumber/regulasi aktif tidak menulis ulang dokumen lama.

### BR-09 — No fabricated operational data
Dashboard, landing page authenticated state, analytics, invoice, usage, statistik, riwayat, bank soal, dan daftar guru harus mengambil data nyata. Jika data belum ada, tampilkan **empty state**, bukan angka atau record buatan.

### BR-10 — No automatic AI fallback
Jika provider AI belum dikonfigurasi atau credential tidak tersedia, fitur generate dinonaktifkan dengan pesan konfigurasi. Jangan menggunakan adapter yang menghasilkan konten palsu sebagai fallback.

## 5. Empty State Standard

Saat database kosong, gunakan state seperti:

- `Belum ada guru. Tambahkan guru untuk mulai menggunakan workspace instansi.`
- `Belum ada CP yang dipublikasikan untuk kombinasi ini.`
- `Belum ada dokumen.`
- `Belum ada penggunaan AI pada periode ini.`
- `Belum ada paket aktif.`

Jangan mengganti empty state dengan data buatan.
