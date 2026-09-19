# Landing Page UI/UX — EduGen KBC

## 1. Objective

Landing page harus menjelaskan produk dalam kurang dari 10 detik: **EduGen membantu guru membuat perangkat pembelajaran dan soal dari CP yang sudah diverifikasi, dengan dukungan Kurikulum Merdeka dan Kurikulum Madrasah/KBC, dalam model Multi-SaaS untuk guru individu dan instansi.**

Landing page bukan sekadar halaman marketing dekoratif. Ia harus menjadi transisi logis dari public website ke onboarding `INDIVIDUAL` atau `INSTITUTION`.

## 2. Anti AI-Slop Rules

Dilarang menggunakan pola visual generik yang sering muncul pada landing page AI:

- gradient blob besar di hero;
- orb AI/neon brain;
- glassmorphism di semua card;
- marquee logo perusahaan palsu;
- testimonial palsu;
- angka user/revenue palsu;
- card fitur 3 kolom dengan ikon generik dan copy kosong;
- mockup dashboard yang tidak sesuai fitur nyata;
- glow ungu berlebihan;
- animasi hanya untuk hiasan;
- copy seperti “revolutionize your workflow” tanpa makna spesifik.

Sebagai gantinya gunakan:

- layout editorial dengan whitespace terukur;
- asymmetric bento grid;
- screenshot/mockup produk yang menjelaskan alur CP → Generate → Validate → Export;
- copy Bahasa Indonesia yang spesifik untuk guru dan lembaga;
- warna restrained dan border tegas;
- motion untuk menjelaskan state/perubahan produk.

## 3. Visual Direction

### Palette

- `--paper`: #F4F1EA
- `--surface`: #FCFBF8
- `--ink`: #171717
- `--muted`: #6B6B67
- `--line`: #D9D5CB
- `--accent`: #5856D6
- `--accent-soft`: #E9E8FF
- `--success`: #17765B
- `--warning`: #9A6200

Tidak ada gradient sebagai default visual language.

### Shape

- radius besar hanya pada card penting: 22–28px;
- button radius 999px hanya untuk CTA kecil/pill yang memang perlu;
- border 1px dengan kontras halus;
- shadow sangat ringan dan jarang.

### Typography

Production recommendation:

- Display: Geist / Plus Jakarta Sans / Manrope;
- Body: Geist / system sans;
- gunakan `clamp()` untuk skala responsif;
- heading pendek, maksimal 2–3 baris di desktop.

Prototype menggunakan system font agar tidak bergantung CDN.

## 4. Page Structure

### A. Navigation

Kiri: wordmark `EduGen KBC`.

Tengah desktop:

- Produk
- Untuk Guru
- Untuk Instansi
- Kurikulum & CP
- FAQ

Kanan:

- Masuk
- `Mulai Sekarang`

Mobile memakai satu button menu dengan panel sederhana. Tidak gunakan mega menu pada MVP.

### B. Hero

Headline:

> **Perangkat guru yang lahir dari CP resmi, bukan tebakan AI.**

Supporting copy:

> Buat TP, ATP, RPP/Modul Ajar, kisi-kisi, soal, rubrik, dan perangkat guru lain dari sumber kurikulum yang dikelola dan diverifikasi di tingkat platform.

CTA:

- Primary: `Mulai sebagai Guru`
- Secondary: `Daftarkan Instansi`

Product visual di sisi kanan berupa bento 2×2:

1. CP Verified
2. RPP/Modul progress
3. Question package
4. Validation + export

### C. Trust / Regulatory Strip

Gunakan text strip, bukan logo palsu:

- BSKAP 046/H/KR/2025
- KMA 1503/2025
- Panduan KBC 2025
- Pembelajaran & Asesmen Madrasah 2025

Tambahkan disclaimer kecil: platform membantu implementasi; regulasi resmi tetap menjadi rujukan utama.

### D. Bento Feature Grid

Grid desktop 12 kolom, asymmetrical:

- 7 kolom × 2 baris: **CP Locked & Verified**
- 5 kolom: **Generator RPP/Modul**
- 5 kolom: **Generator Soal**
- 4 kolom: **Guru Individu**
- 4 kolom: **Instansi**
- 4 kolom: **Admin yang sederhana**

Setiap card harus menjelaskan satu keputusan produk, bukan sekadar slogan.

### E. Workflow Preview

Stepper interaktif 4 tahap:

1. Pilih konteks & CP
2. Generate
3. Validasi
4. Export

Panel preview berubah saat step dipilih/auto-cycle. Auto-cycle berhenti ketika user melakukan interaksi atau ketika reduced motion aktif.

### F. Two Client Models

Dua panel besar:

**Guru Individu**

- personal workspace;
- generator lengkap;
- bank soal & dokumen pribadi;
- paket individual.

**Instansi/Lembaga**

- hanya dua role: Admin dan Guru;
- Admin: profil sekolah, logo, tahun ajaran, data guru;
- Guru: semua perangkat guru & soal;
- subscription per tenant/lembaga.

### G. Regulation Control

Visual CP Browser dengan badge:

- `PUBLISHED`
- mapel
- fase
- elemen
- sumber regulasi
- versi

Copy menjelaskan bahwa hanya Super Admin mengelola master CP; guru hanya menggunakan CP yang sudah published.

### H. Pricing Teaser

Jangan menetapkan harga sebelum strategi billing disepakati.

Tampilkan:

- Paket Guru Individu
- Paket Instansi

CTA: `Lihat Paket` / `Hubungi Kami`.

Tidak tampilkan angka sementara/palsu.

### I. FAQ

Minimal:

- Apakah AI membuat CP?
- Apa beda Kurmer dan KBC?
- Apakah tersedia untuk guru individu?
- Apa role di instansi?
- Bisa export ke Word/PDF?
- Apa yang terjadi jika CP belum tersedia?

### J. Final CTA + Footer

CTA akhir singkat. Footer berisi legal, privacy, terms, contact, docs/regulation note.

## 5. Responsive Behavior

### 360–599px

- single column;
- hero copy lebih dahulu, product bento di bawah;
- bento cards semua 1 kolom;
- nav collapse;
- CTA full-width atau 2 baris;
- tidak ada horizontal scroll.

### 600–899px

- 2-column bento untuk card kecil;
- hero masih stack;
- role model panel bisa 2 kolom jika cukup.

### 900–1199px

- hero 5/7 atau 6/6;
- 12-column bento aktif;
- nav desktop.

### 1200px+

- max content width 1200–1240px;
- jangan stretch card sampai terlalu lebar.

## 6. Motion System

Gunakan tiga level motion saja:

1. **Reveal** — `opacity + translateY(12px)` 400–600ms.
2. **State transition** — stepper preview 220–320ms.
3. **Micro interaction** — button/card hover 120–180ms.

Dilarang continuous floating animation pada banyak elemen.

`prefers-reduced-motion: reduce` harus:

- mematikan auto-cycle;
- menghilangkan transform reveal;
- mematikan smooth scroll;
- menjaga semua content tetap terlihat.

## 7. Accessibility

- semantic landmarks (`header`, `nav`, `main`, `section`, `footer`);
- skip link;
- visible focus ring;
- ARIA hanya bila diperlukan;
- button mobile menu dengan `aria-expanded`;
- tab preview menggunakan button, bukan div clickable;
- kontras minimum WCAG AA;
- ukuran tap target minimum 44×44px.

## 8. Performance

- no external JS dependency pada prototype;
- inline SVG atau CSS icon sederhana;
- gambar produk di production gunakan WebP/AVIF;
- lazy load visual di bawah fold;
- hindari video autoplay pada hero MVP;
- target Lighthouse mobile Performance >= 90 setelah integrasi production.

## 9. Copy Tone

Tone:

- profesional;
- spesifik;
- tidak bombastis;
- tidak mengklaim “100% akurat”;
- tidak menyebut AI sebagai pengganti guru;
- fokus pada konsistensi sumber, penghematan waktu, dan kontrol guru.

