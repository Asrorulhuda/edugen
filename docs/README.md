
## Multi-SaaS Update

Planning pack ini kini menetapkan arsitektur **multi-tenant SaaS** sebagai foundation wajib, dengan:

- Super Admin platform;
- Client `INDIVIDUAL` (guru dengan Personal Workspace);
- Client `INSTITUTION` dengan **hanya role Admin dan Teacher**;
- satu user dapat memiliki beberapa workspace;
- subscription dan entitlement per tenant;
- tenant isolation, usage metering, billing adapter, dan support audit;
- dokumen tambahan `18_MULTI_SAAS_TENANCY.md`, `19_SAAS_BILLING_ENTITLEMENTS.md`, `20_CLIENT_ONBOARDING_WORKFLOWS.md`, `21_INSTITUTION_ADMIN_TEACHER_MODEL.md`, dan spesifikasi final Master CP + landing page.

# EduGen KBC — Planning Pack

> **Working title.** Nama aplikasi dapat diganti. Paket ini adalah blueprint produk dan teknis untuk aplikasi **Generator Soal, Modul Ajar/RPP, dan Perangkat Guru** yang mendukung dua mode kerja: **Kurikulum Merdeka** dan **Kurikulum Madrasah/KBC**.

## Tujuan

Aplikasi membantu guru menghasilkan perangkat pembelajaran dengan sumber regulasi yang terkontrol, bukan sekadar meminta AI menulis dokumen bebas. **CP tidak boleh dikarang AI**: CP harus dipilih dari master CP yang sudah diverifikasi dan memiliki jejak sumber. AI digunakan untuk menurunkan TP, ATP, kegiatan pembelajaran, asesmen, soal, rubrik, dan komponen lain berdasarkan CP yang valid.

## Isi paket

| File | Fungsi |
|---|---|
| `01_PRD.md` | Product Requirements Document lengkap |
| `02_UI_UX.md` | Sistem desain, layout dashboard, alur layar, komponen |
| `03_REGULATION_SOURCE_MAPPING.md` | Pemetaan sumber regulasi dan aturan pemilihan CP |
| `04_FEATURE_SPEC_GENERATORS.md` | Detail generator soal, RPP/modul ajar, dan perangkat guru |
| `05_AI_GENERATION_AND_GUARDRAILS.md` | Arsitektur AI, RAG, validasi, anti-halusinasi |
| `06_SYSTEM_ARCHITECTURE.md` | Arsitektur aplikasi dan deployment |
| `07_DATABASE_SCHEMA.md` | Model data/tabel utama |
| `08_API_SPEC.md` | Rancangan endpoint API |
| `09_ROLES_PERMISSIONS.md` | Hak akses Super Admin, Personal Teacher, Institution Admin, Institution Teacher |
| `10_SECURITY_PRIVACY.md` | Security, audit, data protection |
| `11_TESTING_QA.md` | QA regulasi, functional, AI evaluation, acceptance |
| `12_ROADMAP_MILESTONES.md` | Tahapan MVP sampai production |
| `13_LOCAL_SETUP_DEPLOYMENT.md` | Setup lokal dan rekomendasi produksi |
| `14_CODING_AGENT_PROMPT.md` | Prompt siap pakai untuk coding agent |
| `15_INITIAL_MASTER_DATA_AND_RULES.md` | Master domain awal, aturan kurikulum, kebijakan tanpa data dummy |
| `16_EXPORT_TEMPLATE_SPEC.md` | Spesifikasi export DOCX/PDF dan template dokumen |
| `17_ACCEPTANCE_CRITERIA.md` | Definition of Done dan acceptance criteria |
| `18_MULTI_SAAS_TENANCY.md` | Boundary tenant, workspace, isolasi data |
| `19_SAAS_BILLING_ENTITLEMENTS.md` | Paket, subscription, entitlement, quota/seat |
| `20_CLIENT_ONBOARDING_WORKFLOWS.md` | Onboarding guru individu dan instansi |
| `21_INSTITUTION_ADMIN_TEACHER_MODEL.md` | Model final role instansi: Admin & Guru |
| `22_LANDING_PAGE_UI_UX.md` | Arah landing page responsive bento, anti AI-slop |
| `23_LANDING_PAGE_IMPLEMENTATION.md` | Struktur implementasi React/Inertia, SEO, motion |
| `24_SUPERADMIN_CP_MANAGEMENT.md` | Spesifikasi final input/import/publish/version CP oleh Super Admin |
| `25_NO_DUMMY_DATA_POLICY.md` | Kebijakan keras: tidak ada data dummy; empty state dan bootstrap bersih |
| `landing-page/` | Prototype landing page HTML/CSS/JS tanpa dependency |
| `references/dashboard-visual-reference.png` | Referensi visual dashboard yang diberikan pengguna |



## Kebijakan data awal

**Tidak ada data dummy.** Database awal tidak berisi tenant, sekolah, guru, CP, dokumen, soal, statistik, plan berharga, invoice, atau penggunaan AI buatan. Super Admin dibuat melalui setup eksplisit; CP/regulasi diinput oleh Super Admin; tenant dan user muncul melalui onboarding nyata. UI yang belum memiliki data wajib menampilkan empty state.

## Role final

- **Super Admin**: mengelola seluruh SaaS dan menjadi **satu-satunya role yang menginput/import/verify/publish/version/archive CP**.
- **Client Individu / Personal Teacher**: membuat seluruh perangkat guru pada Personal Workspace.
- **Client Instansi / Admin**: mengelola nama sekolah, logo/kop, data guru, tahun ajaran, dan konfigurasi lembaga; tidak mengelola CP.
- **Client Instansi / Teacher**: membuat seluruh perangkat guru, soal, bank soal, dan export; CP hanya read-only dari master platform.

## Stack yang direkomendasikan

- **Backend:** Laravel 12 / PHP 8.3+
- **Frontend:** Inertia.js + React + TypeScript + Tailwind CSS + shadcn/ui
- **Database:** MySQL 8 / MariaDB 10.11+
- **Queue/cache:** Redis (opsional di MVP, direkomendasikan production)
- **Storage:** local/S3-compatible object storage
- **AI:** provider abstraction (Gemini/OpenAI/Groq/OpenRouter/DeepSeek dapat dipasang melalui adapter)
- **Export:** DOCX + PDF; XLSX/CSV untuk kisi-kisi/bank soal bila diperlukan

## Prinsip produk paling penting

1. **Regulation-first** — semua output harus tahu regulasi, versi kurikulum, mapel, fase, dan CP sumber.
2. **CP locked** — teks CP master tidak boleh dimodifikasi AI kecuali pengguna secara eksplisit membuat turunan/interpretasi, dan hasil turunan tidak disimpan sebagai CP resmi.
3. **Provenance** — setiap dokumen menyimpan `source_document`, `source_version`, halaman/section/locator, dan snapshot CP.
4. **Teacher-controlled output** — guru dapat edit, validasi, finalisasi, dan menyimpan versi; tidak ada approval hierarchy pada MVP.
5. **KBC as a mode of implementation** — aplikasi menampilkan pilihan Kurikulum Merdeka vs Madrasah/KBC, tetapi implementasi KBC tetap mengintegrasikan pembelajaran mendalam, Panca Cinta, DPL, dan asesmen sesuai panduan.
6. **No fabricated regulation** — jika CP belum tersedia dalam master sumber terverifikasi, generator diblokir; hanya **Super Admin platform** yang boleh menambahkan/memverifikasi/mempublish CP.

## Catatan penting sumber CP agama

Requirement awal proyek menyebut **mapel umum → BSKAP 046/H/KR/2025** dan **mapel agama → KMA 1503 Tahun 2025**. Paket ini mempertahankan kebijakan pemilihan tersebut sebagai *business rule*, tetapi juga menambahkan **validation gate**: dari materi terlampir, KMA 1503 berfungsi sebagai kerangka implementasi kurikulum madrasah dan panduan Pembelajaran & Asesmen justru merujuk terpisah pada keputusan Dirjen Pendis tentang CP PAI dan Bahasa Arab. Karena itu, **jangan pernah membiarkan AI menebak CP agama**. Super Admin platform harus memasukkan sumber CP agama yang sudah diverifikasi sebelum generator terkait diaktifkan.
