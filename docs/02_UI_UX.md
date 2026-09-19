# UI/UX Specification — EduGen KBC

## 1. Arah Visual

Referensi visual menggunakan screenshot dashboard yang diberikan pengguna: **sidebar kiri permanen, topbar tipis, content area lapang, kartu putih dengan border halus, aksen ungu/indigo, dashboard modular**, dan tipografi modern. Desain **tidak menyalin brand Cake**; hanya memakai pola komposisi dan keterbacaan sebagai inspirasi.

### Design keywords

- clean
- professional
- calm
- education SaaS
- high information density tanpa terasa padat
- clear source badges
- keyboard friendly
- print/export friendly

## 2. Design Tokens

### Warna

- `primary`: Indigo/Violet 600
- `primary-soft`: Indigo/Violet 50–100
- `surface`: White
- `surface-muted`: Slate 50
- `border`: Slate 200
- `text-primary`: Slate 900
- `text-secondary`: Slate 500–600
- `success`: Emerald
- `warning`: Amber
- `danger`: Rose
- `info`: Sky

> Implementasi harus menggunakan design tokens/CSS variables agar tema mudah diganti.

### Radius & spacing

- cards: 12–16px
- inputs/buttons: 8–10px
- sidebar width: 248–272px
- content max width: 1600px
- grid gap desktop: 20–24px

## 3. Information Architecture

### Sidebar utama

1. Dashboard
2. Generator
   - Soal
   - RPP / Modul Ajar
   - TP & ATP
   - Perangkat Guru
3. Bank Soal
4. Dokumen Saya
5. CP & Kurikulum
6. Template
7. Review / Approval
8. Regulasi & Referensi
9. Laporan
10. Pengaturan

Superadmin tambahan:

- Lembaga/Tenant
- Paket & Kuota
- AI Providers
- Regulation Registry
- Audit & System Health

## 4. Topbar

Kiri ke kanan:

- institution/workspace selector;
- tahun ajaran / semester selector;
- onboarding/progress chip;
- global search;
- AI usage chip;
- notifications;
- help;
- profile menu.

## 5. Dashboard Layout

### Row 1 — Heading & alert

- Nama lembaga / sapaan.
- Banner contextual: `Regulasi CP umum aktif: BSKAP 046/2025` atau warning source.

### Row 2 — Summary cards

Grid 12 kolom:

- 3 kolom: quick stats stacked
  - dokumen aktif;
  - paket soal;
  - perangkat dibuat;
  - paket soal.
- 6 kolom: `Kelengkapan Perangkat` donut/progress + kelas/mapel yang belum lengkap.
- 3 kolom: `Aktivitas` 30 hari + action items.

### Row 3

- 8 kolom: recent documents / progress semester.
- 4 kolom: quick actions.

## 6. Dashboard Wireframe

```text
┌───────────────┬─────────────────────────────────────────────────────────────┐
│ Sidebar       │ Workspace ▾  TA 2026/2027 ▾      AI 62%   🔔   User       │
│               ├─────────────────────────────────────────────────────────────┤
│ Dashboard     │ MTs / MI Asrorul Huda                                      │
│ Generator     │ ┌─────────────────────────────────────────────────────────┐ │
│  Soal         │ │ Source aktif: BSKAP 046 • KBC Guide • P&A 2025         │ │
│  RPP          │ └─────────────────────────────────────────────────────────┘ │
│  TP/ATP       │ ┌──────────┬────────────────────────┬─────────────────────┐ │
│ Documents     │ │ Stats    │ Kelengkapan Perangkat │ Activity            │ │
│ CP            │ │ 24 docs  │        72% ◯          │ 12 exports          │ │
│ Bank Soal     │ │ 8 paket  │ Kelas 7: 8/10         │ 4 generated today   │ │
│ References    │ │ 120 soal │ Kelas 8: 6/10         │ AI usage 62%        │ │
│ Settings      │ └──────────┴────────────────────────┴─────────────────────┘ │
│               │ ┌──────────────────────────────────┬──────────────────────┐ │
│               │ │ Dokumen terbaru                  │ Quick Actions        │ │
│               │ │ ...                              │ + Buat RPP           │ │
│               │ │ ...                              │ + Buat Soal          │ │
│               │ └──────────────────────────────────┴──────────────────────┘ │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

## 7. Generator UX Pattern

Gunakan **stepper 4 tahap** agar guru tidak menghadapi satu form panjang.

### Step 1 — Konteks

- Kurikulum: Kurmer / Madrasah-KBC
- Lembaga
- Tahun ajaran
- Jenjang
- Kelas
- Semester
- Mapel

### Step 2 — Sumber & Tujuan

- fase auto-detected;
- source badge;
- CP browser searchable;
- elemen CP;
- TP existing / generate TP;
- topik/materi;
- alokasi waktu.

### Step 3 — Pengaturan Generate

Untuk RPP:

- template;
- model pembelajaran;
- DPL;
- Panca Cinta;
- karakteristik/kesiapan murid;
- style detail.

Untuk soal:

- jumlah;
- type mix;
- difficulty mix;
- cognitive mix;
- stimulus;
- explanation;
- rubric.

### Step 4 — Review

Split screen:

- kiri 65%: editor;
- kanan 35%: validator + sources + AI actions.

## 8. Editor Layout

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ ← RPP Bahasa Inggris | Draft | Save | Review | Export ▾                   │
├───────────────────────────────────────────┬────────────────────────────────┤
│ Document Outline                          │ Validation & Sources           │
│ A. Spesifikasi                            │ ✓ CP locked                    │
│ B. Identifikasi                           │ ✓ Fase sesuai                  │
│ C. Desain Pembelajaran                    │ ! Panca Cinta belum di asesmen │
│ D. Pengalaman Belajar                     │ Sources                        │
│ E. Asesmen                                │ • BSKAP 046/2025               │
│                                           │ • P&A Madrasah 2025            │
│ [Rich editor content...]                  │ [Regenerate section]           │
└───────────────────────────────────────────┴────────────────────────────────┘
```

## 9. CP Browser

Card CP harus menampilkan:

- nama mapel;
- fase;
- elemen;
- teks CP;
- regulation badge;
- status verified;
- version/effective date;
- source locator;
- button `Gunakan CP ini`.

CP resmi ditampilkan read-only.

## 10. Question Bank Screen

Table columns:

- checkbox;
- code;
- mapel;
- fase/kelas;
- TP;
- type;
- difficulty;
- cognitive level;
- status;
- source;
- usage count;
- action menu.

Fitur filter dan bulk action.

## 11. KBC Interaction Design

Panca Cinta ditampilkan sebagai selectable chips:

- Allah & Rasul-Nya
- Ilmu
- Lingkungan
- Diri & Sesama
- Tanah Air

Saat guru memilih salah satu, UI menunjukkan **mengapa direkomendasikan** dan **di bagian mana akan diintegrasikan**:

- tujuan;
- kegiatan;
- refleksi;
- asesmen.

Hindari checkbox dekoratif yang tidak mempengaruhi dokumen.

## 12. Source & Compliance UX

### Source badges

- Hijau: `Verified`
- Kuning: `Needs Review`
- Merah: `Missing Source`
- Abu: `Superseded`

Jika source CP agama belum verified:

```text
CP belum tersedia dari sumber terverifikasi.
Admin kurikulum perlu mempublikasikan master CP terlebih dahulu.
[Hubungi Admin] [Lihat Regulasi]
```

## 13. Responsive Behavior

- Desktop: persistent sidebar, 3-column dashboard.
- Tablet: collapsible sidebar, 2-column dashboard.
- Mobile: bottom/slide navigation, cards 1-column, editor uses tab `Dokumen | Validasi`.

## 14. Accessibility

- WCAG AA contrast target.
- Fokus keyboard jelas.
- Semua icon punya label/tooltip.
- Error tidak hanya dibedakan warna.
- Font body minimal 14–16px.
- Table dapat horizontal scroll di mobile.

## 15. Empty/Loading/Error States

- skeleton cards untuk dashboard;
- generation progress dengan stage: `Membaca konfigurasi → Menyusun outline → Generate → Validasi → Siap ditinjau`;
- retry per stage;
- jika AI gagal, draft/source selection tidak hilang.

## 16. Microcopy

Gunakan bahasa guru yang sederhana:

- `Pilih CP resmi`
- `Buat TP dari CP`
- `Tambahkan konteks kelas`
- `Periksa keselarasan`
- `Kirim untuk ditinjau`

Hindari istilah teknis AI seperti “vector embedding” di UI guru.

## Multi-SaaS Navigation Addendum

### Workspace Switcher

Topbar wajib memiliki selector tenant/workspace sebelum academic context:

```text
[EduGen] [Workspace: Personal Ahmad ▼] [TA 2026/2027 ▼] ... [Profile]
```

Jika user menjadi anggota lembaga:

```text
Workspace
✓ Personal Ahmad
  MI Asrorul Huda
  MTs Asrorul Huda
+ Create/Join Workspace (sesuai hak)
```

Pergantian workspace harus memberi feedback jelas dan tidak boleh mempertahankan filter/data dari tenant sebelumnya jika dapat menimbulkan kebocoran data.

### Super Admin UI

Sidebar portal `/superadmin`:

- Overview
- Clients
  - Individual Teachers
  - Institutions
- Plans & Pricing
- Subscriptions
- Invoices / Transactions
- Usage & AI Cost
- Regulation & CP
- AI Providers
- Templates Global
- Feature Flags
- Announcements
- Audit Logs
- System Health

Dashboard cards: Total Clients, Active Individual, Active Institution, MRR, Trial, Past Due, AI Cost, Generation Volume.

### Individual Client Dashboard

Prioritas:

- quick generate;
- recent documents;
- personal bank soal;
- usage/credit;
- subscription status;
- workspace memberships.

Sidebar individual tidak menampilkan menu Data Guru atau Profil Lembaga.

### Institution Dashboard

Institution memiliki **dua pengalaman UI berdasarkan role**.

#### Admin Institution Dashboard

Sidebar utama:

- Dashboard
- Profil Lembaga
- Data Guru
- Tahun Ajaran
- Template/Kop Dokumen
- Usage & Paket
- Pengaturan

Cards/summary:

- jumlah guru aktif;
- seat terpakai;
- kelengkapan profil lembaga;
- AI/export/storage usage;
- status paket dan masa aktif.

Admin tidak melihat menu Generator sebagai fungsi utama dan tidak memiliki menu approval/review.

#### Teacher Institution Dashboard

Sidebar utama:

- Dashboard
- Generator
  - TP/ATP
  - RPP/Modul Ajar
  - Perangkat Guru
  - Soal
- Bank Soal
- Dokumen Saya
- CP & Referensi
- Export

Cards/summary:

- dokumen saya;
- paket soal saya;
- perangkat semester;
- recent documents;
- quick generate;
- usage sesuai entitlement tenant.

### Client Onboarding

Step 1: `Saya Guru/Individu` atau `Saya mewakili Instansi/Lembaga`.

Individual: Profile → Choose Plan → Personal Workspace Ready.

Institution: Identitas Lembaga → Logo/Kop → Plan/Seats → Buat Admin → Admin Input Data Guru → Guru Mulai Generate.


## 16. Super Admin — Master CP UX

Menu `Kurikulum & Akademik > Master CP` hanya tampil untuk `SUPER_ADMIN`. UI harus mendukung:

- tabel CP dengan filter Kurikulum, Jenjang, Mapel, Fase, Elemen, Status, Regulasi, Versi;
- aksi `Tambah CP`, `Import XLSX/CSV`, `Buat Versi Baru`, `Publish`, `Archive`;
- editor CP dengan source metadata dan locator;
- preview dampak: berapa dokumen/generator yang memakai versi lama;
- published CP tidak diedit inline. Koreksi = create new version;
- audit trail wajib terlihat pada drawer/detail.

`ADMIN` instansi dan `TEACHER` tidak pernah melihat tombol pengelolaan CP. Mereka hanya melihat CP Browser read-only untuk CP berstatus `PUBLISHED`.

## 17. Landing Page — Anti AI-Slop Direction

Landing page menggunakan **editorial SaaS + asymmetric bento grid**, bukan template AI generik. Prinsip visual:

- palet restrained: warm off-white, charcoal, indigo sebagai aksen, satu warna status;
- tidak memakai gradient blob, glassmorphism berlebihan, neon glow, floating orb, atau hero mockup yang tidak berhubungan dengan produk;
- tidak memakai testimonial palsu, logo perusahaan palsu, angka pengguna palsu, atau klaim tanpa sumber;
- hero menampilkan UI produk nyata: CP verified → Generate → Validate → Export;
- bento card memiliki ukuran berbeda dan fungsi informasi yang jelas, bukan deretan tiga card identik;
- copy menggunakan bahasa Indonesia yang spesifik untuk guru/madrasah;
- animasi hanya memperjelas hierarki: stagger reveal, product-step transition, number/progress micro-animation;
- semua motion menghormati `prefers-reduced-motion`;
- touch target minimum 44px, fokus keyboard terlihat, kontras minimum WCAG AA;
- responsive dari 360px mobile sampai desktop besar.

Prototype implementasi ada di folder `landing-page/`.
