# Desain Teknis: Sidebar Navigation Dashboard & CMS Landing Page Superadmin

## 1. Ringkasan Eksekutif
Perubahan ini menyempurnakan arsitektur frontend dan backend EduGen KBC untuk siap produksi:
1. **Sidebar Navigation Shell**: Menggantikan navigasi atas (*top bar*) di `AuthenticatedLayout.tsx` dengan sistem Sidebar vertikal modern yang mendukung *collapsible mode* (desktop) dan *slide-over drawer* (mobile), serta *top action bar* yang ringkas.
2. **Superadmin Landing Page CMS**: Menambahkan subsistem database dan antarmuka manajemen di panel Superadmin (`/admin/landing-page`) agar seluruh konten halaman publik (`Welcome.tsx`) dapat diperbarui secara dinamis tanpa perlu deploy kode.
3. **Pembersihan & Kesiapan Produksi**: Memvalidasi seluruh fungsionalitas, menjalankan unit/feature tests, dan memastikan build aset frontend (`tsc` & `vite build`) bersih tanpa error.

---

## 2. Arsitektur & Perubahan Komponen

### A. Layout Shell (`resources/js/Layouts/`)
- `AuthenticatedLayout.tsx`:
  - Dirombak menjadi layout flex dua kolom: Sidebar vertikal di sebelah kiri dan Area Konten Utama di sebelah kanan.
  - Memiliki state `isSidebarCollapsed` yang tersimpan di `localStorage`.
  - Memiliki state `isMobileNavOpen` untuk tampilan layar kecil.
- Sub-komponen baru:
  - `resources/js/Layouts/Sidebar/SidebarNav.tsx`: Menangani item-item navigasi dengan grouping:
    - **Utama**: Dashboard
    - **Perangkat KBC**: Katalog CP, Bank TP & Alur TP, Modul Ajar KBC, Bank Soal, Rubrik Penilaian
    - **Lembaga (Khusus Admin Sekolah)**: Profil & Kop Surat, Kalender Akademik, Data Guru, Undangan Guru
    - **Super Admin (Khusus Superadmin)**: Master CP, Import CP, Billing & Subscription, Kelola Landing Page
    - **Akun & Billing**: Paket Langganan, Profil
  - `resources/js/Layouts/Sidebar/HeaderBar.tsx`: Bar atas ringkas berisi:
    - Tombol Hamburger / Toggle Sidebar
    - Breadcrumb rute aktif
    - Workspace Selector (Lembaga vs Guru Mandiri)
    - Avatar & User Dropdown (Profil, Logout)
  - `resources/js/Layouts/Sidebar/MobileSidebar.tsx`: Drawer geser responsif dengan backdrop blur untuk mobile screen.

### B. Database & Backend CMS Landing Page
- **Model**: `App\Models\LandingPageSection`
  - Kolom: `id`, `key` (string unique), `title` (string nullable), `content` (json), `is_active` (boolean), `updated_by` (unsignedBigInteger nullable), `timestamps`.
- **Database Seeder**: `LandingPageSectionSeeder`
  - Mengisi default data untuk key:
    - `hero`: headline, subheadline, badge_text, cta_primary_text, cta_secondary_text.
    - `stats`: list metrics (guru aktif, modul diterbitkan, bank soal terverifikasi, kepatuhan regulasi).
    - `workflow`: 4 tahapan alur (Pilih CP, Generate AI, Telaah & Validasi, Ekspor Kop Surat).
    - `features`: daftar fitur kurikulum berbasis cinta, Taksonomi Bloom, dan Deep Learning.
    - `faqs`: daftar pertanyaan dan jawaban interaktif.
    - `footer`: info pengembang, kontak bantuan WhatsApp, email, hak cipta.
- **Controller**: `App\Http\Controllers\Admin\Landing\LandingPageController`
  - `index()`: Merender halaman Inertia `Admin/LandingPage/Index` dengan data seluruh section.
  - `update(Request $request, $key)`: Memvalidasi payload JSON dan menyimpan pembaruan.
  - `resetDefaults($key)`: Mengembalikan section tertentu ke data default.
- **Rute Web (`routes/web.php`)**:
  - Middleware `auth` dan `superadmin`.
  - `GET /admin/landing-page` -> `admin.landing-page.index`
  - `PUT /admin/landing-page/{key}` -> `admin.landing-page.update`
  - Public route `/` mengoper `sections` ke Inertia view `Welcome.tsx`.

### C. Antarmuka Manajemen Superadmin (`resources/js/Pages/Admin/LandingPage/Index.tsx`)
- Tab-based editor:
  1. Hero Section Form
  2. Statistik & Metrik Form
  3. Alur Kerja (Workflow) Editor
  4. Fitur Unggulan Editor
  5. FAQ Builder (Tambah/Hapus Baris dinamis)
  6. Kontak, WhatsApp & Footer Form
- Flash message sukses, tombol "Preview Landing Page", dan handling loading state saat menyimpan.

### D. Halaman Depan Publik (`resources/js/Pages/Welcome.tsx`)
- Menerima prop `sections` opsional dari controller.
- Menggunakan default fallback terkalibrasi jika data di database belum diisi, sehingga landing page 100% aman dari resiko tampilan kosong.

---

## 3. Rencana Pengujian & Verifikasi
1. **Automated Feature Test**:
   - `LandingPageManagementTest.php`:
     - Superadmin dapat melihat halaman kelola landing page.
     - Superadmin dapat memperbarui konten Hero, FAQ, Workflow, dan Kontak.
     - Pengguna biasa / Guru ditolak mengakses rute admin (403 / Redirect).
     - Tamu (unauthenticated) diarahkan ke login (302).
   - Menjalankan `php artisan test` (memastikan seluruh 38+ tes lama + tes baru lulus 100%).
2. **Automated Frontend Compilation**:
   - Menjalankan `npm run build` (`tsc && vite build`) untuk memvalidasi ketiadaan error TypeScript dan aset CSS/JS berhasil dibundel.
3. **Manual Verification Checkpoints**:
   - Periksa toggle sidebar pada desktop (expanded vs collapsed).
   - Periksa responsive drawer pada resolusi mobile/tablet.
   - Periksa update konten pada panel Superadmin dan konfirmasi perubahannya langsung terlihat di halaman `Welcome`.
