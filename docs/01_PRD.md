# PRD — EduGen KBC

## 1. Ringkasan Produk

EduGen KBC adalah aplikasi web untuk membantu guru menyusun **soal, RPP/Modul Ajar, dan perangkat guru** secara cepat, konsisten, terdokumentasi, serta memiliki jejak regulasi. Sistem menyediakan dua pilihan mode di UI:

- **Kurikulum Merdeka** — fokus pada CP nasional dan perencanaan pembelajaran umum.
- **Kurikulum Madrasah / KBC** — menggunakan CP yang sesuai sumber mapel, lalu mengintegrasikan **Pembelajaran Mendalam**, **Panca Cinta**, **Delapan Dimensi Profil Lulusan**, serta asesmen madrasah.

Aplikasi tidak memperlakukan AI sebagai sumber regulasi. Regulasi dan CP dikelola sebagai **master data terverifikasi**; AI hanya membangun dokumen turunan berdasarkan data tersebut. **Seluruh CRUD/import/publish/versioning CP hanya dilakukan oleh `SUPER_ADMIN` pada level platform.** Admin instansi dan guru tidak memiliki permission untuk membuat, mengubah, mem-publish, atau menghapus CP.

## 2. Latar Belakang

Guru sering menghabiskan waktu besar untuk menyusun perangkat pembelajaran dan asesmen, sementara format dan terminologi berubah mengikuti kebijakan. Risiko utama generator AI generik adalah:

- CP salah fase/mapel;
- CP diubah atau dihaluskan AI sehingga bukan lagi teks sumber;
- dokumen KBC hanya menempelkan label Panca Cinta tanpa integrasi nyata;
- asesmen tidak selaras dengan TP/IKTP;
- format RPP/modul berbeda-beda dan sulit ditinjau;
- tidak ada audit tentang regulasi yang dipakai.

EduGen KBC menyelesaikan masalah tersebut melalui **source registry + structured generator + validation rules + versioned documents**.

## 3. Sasaran Pengguna & Model SaaS

EduGen KBC sejak awal dirancang sebagai **multi-tenant SaaS** dengan satu platform pusat dan dua model client.

### 3.1 Super Admin Platform

Super Admin adalah operator SaaS dan memiliki kontrol lintas tenant untuk:

- membuat, mengaktifkan, menangguhkan, dan menutup tenant/client;
- mengelola paket, harga, kuota, masa aktif, invoice, dan subscription;
- memantau penggunaan AI, storage, export, dan seat;
- mengelola regulasi global dan **seluruh master CP**: input manual, import massal, mapping jenjang/mapel/fase/elemen, verifikasi, publish, arsip, versioning, dan source locator;
- mengelola template global, model AI, feature flag, dan maintenance;
- impersonation/support session yang tercatat audit log;
- melihat kesehatan sistem dan laporan bisnis tanpa mencampur data privat antarclient.

### 3.2 Client Model A — Individu Guru

Client individu adalah guru yang berlangganan sendiri. Saat registrasi, sistem membuat **Personal Workspace** yang menjadi tenant milik guru tersebut.

Hak utama:

- membuat CP turunan/TP/ATP/RPP/modul/soal sesuai entitlement paket;
- memiliki library, template, bank soal, export, dan histori sendiri;
- tidak memiliki fitur organisasi seperti pengelolaan data guru dan profil sekolah;
- dapat diundang ke tenant instansi tanpa kehilangan Personal Workspace;
- dapat berpindah workspace dari selector di topbar.

### 3.3 Client Model B — Instansi/Lembaga

Client instansi adalah sekolah, madrasah, yayasan, atau lembaga pendidikan yang berlangganan sebagai organisasi. Pada model ini, **role internal sengaja disederhanakan hanya menjadi dua role: `ADMIN` dan `TEACHER`**.

1. **Admin** — mengelola data dan konfigurasi lembaga, terutama nama sekolah/lembaga, logo, identitas sekolah, kop/header dokumen, tahun ajaran, data guru, akun guru, status guru, dan pengaturan dasar tenant. Admin **tidak menjadi pembuat utama perangkat pembelajaran**.
2. **Guru / Teacher** — menggunakan data lembaga yang sudah disiapkan Admin untuk membuat seluruh perangkat guru: TP, ATP, RPP/Modul Ajar, LKPD/bahan ajar jika tersedia, kisi-kisi, soal, kunci jawaban, pembahasan, rubrik, remedial, pengayaan, jurnal/refleksi, bank soal, paket soal, dan export dokumen sesuai paket.

Tidak ada role Owner, Waka Kurikulum, Kepala/Reviewer, Viewer, atau approval berjenjang pada MVP. Pengelolaan subscription, aktivasi/suspend client, paket, masa aktif, dan dukungan lintas tenant tetap berada pada **Super Admin platform**. Admin lembaga dapat melihat status paket/usage bila diperlukan, tetapi tidak mengubah katalog paket global.

### 3.4 Multi-workspace user

Satu akun `user` boleh memiliki beberapa membership sekaligus, contoh:

- Personal Workspace Ahmad Fauzi;
- MI Asrorul Huda;
- MTs Asrorul Huda.

Semua data domain selalu terikat `tenant_id`; konteks tenant aktif dipilih melalui **Workspace Switcher**.

## 4. Goals

- Menjadi platform multi-SaaS yang aman untuk guru individu maupun lembaga.
- Memastikan isolasi data antartenant dan entitlement paket dijalankan di backend.
- Mengurangi waktu pembuatan perangkat guru tanpa mengurangi kendali guru.
- Menjamin CP berasal dari sumber master yang telah diverifikasi.
- Menyelaraskan CP → TP → ATP → kegiatan → asesmen → soal.
- Menyediakan mode KBC dengan integrasi nilai yang nyata di tujuan, aktivitas, refleksi, dan asesmen.
- Menghasilkan dokumen siap edit dan siap export ke DOCX/PDF.
- Menyimpan histori versi dan audit sumber.

## 5. Non-Goals MVP

- Menggantikan keputusan profesional guru.
- Menjadi sumber hukum/regulasi resmi.
- Menentukan nilai rapor otomatis tanpa konfigurasi sekolah.
- Mengunggah dokumen ke sistem pemerintah tanpa API resmi.
- Menyalin seluruh isi regulasi ke prompt AI setiap kali generate.

## 6. Prinsip Domain

### 6.1 Phase mapping

Master fase mengikuti sumber CP yang dipakai. Untuk jenjang umum pada BSKAP 046/H/KR/2025, sistem mendukung pemetaan fase A–F dan melakukan validasi kelas terhadap fase.

### 6.2 Mode kurikulum

`curriculum_mode`:

- `MERDEKA`
- `MADRASAH_KBC`

Pada `MADRASAH_KBC`, field berikut menjadi aktif:

- Panca Cinta;
- materi integrasi KBC;
- DPL;
- prinsip pembelajaran mendalam;
- pengalaman belajar memahami–mengaplikasi–merefleksi;
- asesmen autentik dan refleksi.

### 6.3 CP routing

- Mapel umum: default source `BSKAP_046_2025`.
- Mapel agama/Bahasa Arab pada proyek ini: source policy mengikuti konfigurasi sumber resmi yang diverifikasi platform. KMA 1503/2025 tetap menjadi referensi implementasi kurikulum madrasah/KBC, sedangkan teks CP agama **hanya boleh aktif setelah `SUPER_ADMIN` memasukkan dan memverifikasi sumber CP resmi yang spesifik**.
- Jika CP source belum tersedia: tombol generate dinonaktifkan, muncul status `Sumber CP belum diverifikasi`.


### 6.4 Ownership Master CP

Master CP adalah **platform-global master data**. Aturan wajib:

- hanya `SUPER_ADMIN` dapat `create`, `import`, `edit metadata`, `publish`, `archive`, dan membuat versi baru CP;
- teks CP yang sudah `PUBLISHED` bersifat immutable; koreksi dilakukan dengan versioning, bukan overwrite diam-diam;
- `ADMIN` instansi hanya mengelola identitas lembaga dan data guru;
- `TEACHER`/`PERSONAL_TEACHER` hanya dapat mencari, melihat, memilih, dan menggunakan CP published;
- generator diblokir ketika CP yang sesuai belum tersedia atau belum published;
- setiap output menyimpan snapshot CP + `cp_version_id` + sumber regulasi + locator halaman/section jika tersedia.

## 6A. SaaS Tenancy & Subscription Rules

### 6A.1 Tenant types

`tenant_type`:

- `INDIVIDUAL` — Personal Workspace milik satu guru;
- `INSTITUTION` — workspace sekolah/madrasah/yayasan/lembaga.

### 6A.2 Subscription ownership

Subscription melekat ke `tenant`, bukan langsung ke `user`. Dengan demikian satu user dapat memiliki Personal Workspace berbayar dan sekaligus menjadi anggota tenant lembaga yang memiliki paket berbeda.

### 6A.3 Entitlement engine

Setiap request fitur berbayar wajib melewati `EntitlementService`, misalnya:

- `ai_generations_monthly`;
- `question_items_monthly`;
- `exports_monthly`;
- `storage_mb`;
- `member_seats`;
- `regulation_custom_upload`;
- `teacher_management`;
- `advanced_analytics`;
- `custom_template`;
- `api_access`.

Frontend hanya menampilkan informasi paket; keputusan akses tetap dilakukan backend.

### 6A.4 Tenant isolation

Semua tabel data client memakai `tenant_id`. Query domain wajib melalui tenant scope. Super Admin memakai scope khusus platform dan setiap akses lintas tenant masuk audit log. Tidak boleh ada query berbasis `user_id` saja untuk mengambil dokumen tenant.

### 6A.5 Individual → Institution

Dokumen Personal Workspace tidak otomatis menjadi milik lembaga ketika guru bergabung ke tenant instansi. Fitur `Copy to workspace` membuat salinan baru dengan provenance dan permission yang jelas.

### 6A.6 Institution structure

Tenant instansi dapat mewakili satu sekolah atau satu yayasan. Jika satu yayasan menaungi banyak satuan pendidikan, tabel `institutions` dapat berisi beberapa unit di bawah tenant yang sama dan membership dapat dibatasi per unit.

## 7. Ruang Lingkup Fitur

### 7.1 Dashboard

Dashboard menyesuaikan tenant aktif. **Personal Workspace** berfokus pada produktivitas individu, sedangkan **Institution Workspace** memisahkan area Admin untuk master data lembaga/guru dan area Guru untuk pembuatan perangkat pembelajaran.

Dashboard menampilkan:

- jumlah dokumen yang dibuat;
- dokumen draft/final;
- penggunaan AI/kuota;
- perangkat yang belum lengkap per kelas/mapel;
- aktivitas 30 hari;
- quick actions;
- regulasi aktif;
- progress onboarding sekolah.

### 7.2 Generator Soal

Input inti:

- mode kurikulum;
- jenjang, kelas, fase;
- mapel;
- CP terpilih;
- TP/ATP opsional;
- materi/topik;
- tujuan asesmen (formatif/sumatif/diagnostik);
- jumlah soal;
- jenis soal;
- tingkat kesulitan;
- level kognitif;
- opsi HOTS/stimulus;
- opsi integrasi KBC;
- bahasa soal;
- bentuk output.

Output:

- soal;
- kunci jawaban;
- pembahasan;
- kisi-kisi;
- indikator soal;
- level kognitif;
- tingkat kesulitan;
- skor/bobot;
- rubrik esai/praktik jika diperlukan;
- source provenance.

### 7.3 Generator RPP/Modul Ajar

Mendukung:

- template Kurikulum Merdeka;
- template KBC/Pembelajaran Mendalam;
- identitas;
- kesiapan murid/asesmen awal;
- CP;
- TP;
- IKTP/KKTP;
- DPL;
- Panca Cinta + materi integrasi;
- model/metode;
- kemitraan pembelajaran;
- lingkungan pembelajaran;
- pemanfaatan digital;
- kegiatan awal–inti–penutup;
- pengalaman memahami–mengaplikasi–merefleksi;
- asesmen awal–proses–akhir;
- rubrik;
- refleksi;
- tindak lanjut remedial/pengayaan;
- lampiran LKPD bila dipilih.

### 7.4 Generator Perangkat Guru

MVP:

- CP Browser;
- TP Generator;
- ATP Generator;
- Modul Ajar/RPP;
- Kisi-kisi;
- Soal + kunci + pembahasan;
- Rubrik;
- KKTP/IKTP;
- Program remedial/pengayaan;
- jurnal/refleksi pembelajaran.

Phase 2:

- Prota;
- Promes;
- kalender/pekan efektif;
- modul projek/kokurikuler;
- bank soal terstruktur;
- analisis hasil asesmen;
- laporan supervisi perangkat.

> Prota/Promes dan beberapa perangkat tambahan adalah scope produk, bukan klaim bahwa semua item tersebut diwajibkan oleh dokumen sumber terlampir.

### 7.5 CP & Regulation Library

Admin dapat:

- upload dokumen sumber;
- mengatur jenis regulasi;
- membuat versi;
- memetakan mapel/jenjang/fase;
- import CP ke master;
- review CP;
- publish/unpublish;
- menetapkan sumber default;
- melihat diff versi.

Guru hanya melihat CP berstatus `VERIFIED_PUBLISHED`.

### 7.6 Document Workspace

Setiap dokumen memiliki status:

`DRAFT → READY_FOR_REVIEW → REVISION_REQUESTED → APPROVED → ARCHIVED`

Fitur:

- autosave;
- edit manual;
- regenerate per-section;
- compare version;
- comments;
- source panel;
- duplicate;
- export.


### 7.7 Super Admin SaaS Console

Super Admin memiliki portal terpisah `/superadmin` yang mencakup:

- Clients/Tenants: filter individu vs instansi, status, plan, expiry, MRR/ARR;
- Subscription & Billing: plans, prices, invoices, coupons, trial, grace period;
- Usage: AI token/cost, generation, storage, exports, active seats;
- Global Regulation & CP Registry;
- AI Provider/Model Routing dan fallback;
- Feature Flags;
- System announcements;
- support session/impersonation dengan alasan dan audit;
- health, queue, failed jobs, storage, error metrics.

### 7.8 Client Admin Console — Institution

Admin instansi dapat:

- mengubah profil lembaga: nama, logo, jenis/jenjang, NPSN/NSM bila ada, alamat, kontak, website, dan identitas kop dokumen;
- mengelola tahun ajaran/semester dan konfigurasi dasar lembaga;
- menambah, mengubah, mengaktifkan, menonaktifkan, atau mengundang akun guru;
- mengisi data guru seperti nama, email/login, NIP/NUPTK opsional, mapel, kelas/jenjang, nomor kontak, dan status;
- melihat jumlah guru aktif, seat terpakai, penggunaan AI/export/storage, serta status paket;
- mengatur template/kop lembaga yang dipakai otomatis pada hasil export guru;
- **tidak mengubah CP resmi dan tidak menjadi pembuat utama RPP/soal/perangkat**.

Guru instansi memiliki workspace kerja sendiri di dalam tenant lembaga untuk seluruh generator dan bank dokumen/soal.

### 7.9 Personal Account Console — Individual

Guru individu dapat:

- melihat paket, pemakaian, masa aktif, invoice;
- mengatur profil dan preferensi dokumen;
- mengelola Personal Workspace;
- melihat workspace lembaga tempat ia menjadi anggota;
- upgrade/downgrade paket sesuai kebijakan billing.

## 8. User Journey Utama

### Journey A — Guru membuat RPP KBC

1. Login.
2. Pilih workspace/sekolah, tahun ajaran, semester.
3. Klik `Buat RPP/Modul Ajar`.
4. Pilih `Madrasah / KBC`.
5. Pilih jenjang, kelas, mapel.
6. Sistem menentukan fase dan sumber CP.
7. Guru memilih CP dari master.
8. Guru mengisi topik, JP, karakteristik/kesiapan murid.
9. Sistem merekomendasikan DPL dan Panca Cinta; guru boleh mengubah.
10. AI menyusun draft terstruktur.
11. Validator memeriksa konsistensi CP–TP–asesmen–alokasi waktu.
12. Guru edit.
13. Simpan sebagai draft/final atau export.

### Journey B — Guru membuat paket soal

1. Pilih kelas/mapel/CP/TP.
2. Pilih format soal dan distribusi kesulitan.
3. Pilih formatif/sumatif.
4. Generate blueprint/kisi-kisi lebih dulu.
5. Guru meninjau dan mengedit blueprint.
6. Generate soal dari blueprint.
7. Sistem menjalankan duplicate/similarity check dan answer consistency check.
8. Guru approve item atau regenerate item tertentu.
9. Export paket siswa + paket guru.


### Journey C — Registrasi guru individu

1. Pengguna membuat akun.
2. Pilih `Saya Guru / Individu`.
3. Sistem membuat tenant `INDIVIDUAL` dan Personal Workspace.
4. Pilih paket/trial.
5. Sistem mengaktifkan entitlement.
6. Pengguna masuk dashboard personal dan mulai membuat perangkat.

### Journey D — Onboarding instansi

1. Client memilih model Instansi/Lembaga.
2. Buat tenant `INSTITUTION`.
3. Isi identitas sekolah/lembaga dan upload logo.
4. Tentukan paket, seat guru, masa trial/aktif melalui Super Admin atau self-service sesuai konfigurasi bisnis.
5. Buat akun **Admin** pertama.
6. Admin melengkapi profil lembaga, tahun ajaran, kop/template, dan data guru.
7. Admin membuat/mengundang akun **Teacher**.
8. Teacher login dan mulai membuat perangkat guru, RPP/Modul Ajar, TP/ATP, serta soal.

### Journey E — Guru memiliki dua workspace

1. Guru login satu kali.
2. Topbar menampilkan Workspace Switcher.
3. Guru dapat pindah dari `Personal` ke `MI Asrorul Huda`.
4. Permission, kuota, template, bank soal, dan dokumen berubah sesuai tenant aktif.
5. Data tidak bercampur antarworkspace.

## 9. Functional Requirements

### FR-01 Source-locked CP

- CP berasal dari database master.
- UI menampilkan source badge.
- AI menerima CP sebagai immutable field.
- Output harus menyimpan snapshot CP.

### FR-02 Curriculum switching

- Pergantian mode menyesuaikan field, template, validator, dan prompt.
- Mode KBC tidak boleh sekadar menambah paragraf generik; Panca Cinta harus dipetakan ke aktivitas/asesmen yang relevan.

### FR-03 Structured AI output

Semua generator wajib meminta output JSON terstruktur sesuai schema; rendering dokumen dilakukan di aplikasi.

### FR-04 Section regeneration

Guru dapat regenerate hanya satu bagian tanpa mengganti CP dan bagian lain.

### FR-05 Document versioning

Setiap save penting menghasilkan revision dengan actor, timestamp, dan change summary.

### FR-06 Export

- DOCX editable;
- PDF print-ready;
- Excel/CSV untuk bank soal/kisi-kisi bila dipilih.

### FR-07 Audit trail

Simpan minimal:

- user;
- action;
- document;
- prompt template version;
- model/provider;
- source IDs;
- generated at;
- validation result.

## 10. Non-Functional Requirements

- Responsive desktop/tablet/mobile.
- Dashboard first load target < 2.5 s pada koneksi normal.
- Generate AI async dengan progress state.
- Retry-safe job execution.
- Tidak menyimpan API key AI plaintext.
- RBAC.
- Audit log.
- Backup database harian production.
- Locale Indonesia default.
- Print A4 optimized.

## 11. Metrics

- median time membuat RPP lengkap;
- % output yang lolos validator tanpa perbaikan struktur;
- % dokumen yang di-approve;
- regeneration rate per section;
- source mismatch rate = target 0;
- CP hallucination = target 0;
- export success rate;
- active teachers/week.

## 12. Risks & Mitigations

| Risiko | Mitigasi |
|---|---|
| AI mengubah CP | CP locked + checksum + validator |
| Sumber CP agama belum valid | validation gate + admin approval |
| KBC menjadi label tempelan | mapping Panca Cinta per aktivitas/asesmen |
| Output terlalu panjang | style profiles: ringkas/standar/detail |
| Format sekolah berbeda | template builder + institution defaults |
| Biaya AI tinggi | caching, token budget, provider router, section generation |
| Dokumen hukum berubah | regulation versioning + effective dates |

## 13. MVP Definition

MVP dianggap selesai bila guru dapat:

1. login dan memilih lembaga;
2. memilih Kurmer atau Madrasah/KBC;
3. memilih CP valid berdasarkan mapel/fase;
4. membuat TP/ATP;
5. membuat RPP/modul;
6. membuat soal+kunci+pembahasan+kisi-kisi;
7. edit per-section;
8. melihat sumber;
9. export DOCX/PDF;
10. menyimpan riwayat versi.

### FR-10 Multi-tenant isolation

- Semua data client memiliki `tenant_id`.
- Tenant context wajib tersedia untuk operasi domain.
- Cross-tenant access ditolak default.
- Automated test wajib mencoba horizontal privilege escalation.

### FR-11 Two client models

- Registrasi mendukung `INDIVIDUAL` dan `INSTITUTION`.
- Individual mendapatkan Personal Workspace otomatis.
- Institution dapat memiliki banyak member dan unit pendidikan.

### FR-12 Workspace switcher

- Satu user dapat memiliki lebih dari satu tenant membership.
- Pergantian tenant mengubah permission, entitlement, academic context, template, dan data.

### FR-13 Subscription & entitlements

- Plan tidak di-hard-code pada UI.
- Plan menghasilkan entitlement/limit yang dibaca backend.
- Sistem mendukung trial, active, past_due, grace, suspended, cancelled.
- Usage counter bersifat tenant-scoped dan periodized.

### FR-14 SaaS Super Admin

- Super Admin dapat manage tenant, plan, subscription, global regulation, AI config, feature flag, dan audit.
- Impersonation/support access membutuhkan alasan, batas waktu, dan audit.


### FR-15 Institution Role Simplicity

- Tenant `INSTITUTION` hanya memiliki role client `ADMIN` dan `TEACHER`.
- `ADMIN` mengelola profil lembaga, logo/kop, tahun ajaran, data dan akun guru, serta usage/status paket.
- `TEACHER` mengelola dan menghasilkan perangkat pembelajaran miliknya di tenant lembaga.
- Tidak ada approval/reviewer hierarchy pada MVP.
- Super Admin tetap mengelola lifecycle tenant, paket, entitlement, billing, regulation master, dan support.

## No Dummy Data — Hard Requirement

- Fresh install tidak boleh berisi tenant, sekolah, guru, CP, regulasi terverifikasi, dokumen, soal, subscription, invoice, AI usage, statistik, ataupun harga buatan.
- First Super Admin dibuat melalui setup eksplisit dengan data nyata.
- CP hanya tersedia setelah Super Admin melakukan input/import, verifikasi, dan publish.
- Jika data belum ada, UI menampilkan empty state.
- Jika AI provider belum dikonfigurasi, generation disabled; tidak ada output simulasi.
- Test factory hanya boleh hidup pada database automated-test yang terisolasi.

