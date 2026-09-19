# Landing Page Implementation Notes

## 1. Production Route

Public routes:

- `/` — landing page
- `/login`
- `/register?type=individual`
- `/register?type=institution`
- `/pricing`
- `/faq`
- `/privacy`
- `/terms`

CTA hero harus mengarah langsung ke tipe onboarding agar user tidak mengulang pilihan.

## 2. React/Inertia Component Structure

```text
resources/js/pages/marketing/Home.tsx
resources/js/components/marketing/
  MarketingHeader.tsx
  HeroSection.tsx
  ProductBento.tsx
  RegulationStrip.tsx
  FeatureBento.tsx
  WorkflowDemo.tsx
  ClientModels.tsx
  RegulationControl.tsx
  PricingTeaser.tsx
  FAQ.tsx
  FinalCTA.tsx
  MarketingFooter.tsx
```

## 3. State

Landing page tidak membutuhkan global state store.

Local state:

- mobile menu open/closed;
- active workflow step;
- optional selected client model;
- reduced motion preference.

## 4. Animation

Prefer:

- CSS transitions;
- native `IntersectionObserver` untuk reveal;
- `requestAnimationFrame` hanya bila perlu.

Framer Motion tidak wajib. Bila stack sudah memakai Framer Motion, tetap gunakan transisi singkat dan restrain.

## 5. Data Source

Copy regulasi pada landing page sebaiknya berasal dari config/static CMS yang dikelola platform, bukan hardcoded ke banyak component. Contoh:

```ts
const activeReferences = [
  { label: 'BSKAP 046/H/KR/2025', type: 'CP Umum' },
  { label: 'KMA 1503/2025', type: 'Kurikulum Madrasah' },
  { label: 'Panduan KBC 2025', type: 'KBC' },
]
```

Jangan render CP detail publik tanpa kebutuhan.

## 6. SEO

Minimum:

- descriptive title;
- meta description;
- canonical;
- OpenGraph tags;
- structured data `SoftwareApplication` hanya untuk informasi yang benar;
- FAQ schema hanya bila FAQ benar-benar tampil di halaman;
- do not publish rating/review structured data unless it comes from verified real data.

Suggested title:

`EduGen KBC — Generator RPP, Modul Ajar, Soal & Perangkat Guru`

Suggested description:

`Platform Multi-SaaS untuk guru dan lembaga pendidikan dalam menyusun TP, ATP, RPP/Modul Ajar, soal, kisi-kisi, rubrik, dan perangkat guru dari CP yang terverifikasi.`

## 7. Prototype

Folder `landing-page/` berisi prototype HTML/CSS/JS tanpa dependency yang dapat dibuka langsung di browser. Prototype adalah visual/interaction reference; production implementation tetap dibuat di React/Inertia sesuai arsitektur aplikasi.


## No Dummy Content

Landing page tidak boleh menampilkan jumlah pengguna, jumlah sekolah, rating, persentase validasi, jumlah dokumen, harga, testimonial, logo pelanggan, atau contoh record yang dibuat-buat. Jika belum ada data nyata, gunakan visual abstrak/empty-state dan penjelasan fitur tanpa angka klaim.
