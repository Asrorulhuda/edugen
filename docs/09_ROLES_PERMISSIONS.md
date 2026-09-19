# Roles & Permissions — Multi-SaaS v3

## 1. Prinsip Role

Aplikasi memiliki role sesederhana mungkin:

- `SUPER_ADMIN` — level platform.
- `PERSONAL_TEACHER` — client individu/guru.
- `ADMIN` — client instansi/lembaga.
- `TEACHER` — client instansi/lembaga.

**Khusus tenant `INSTITUTION`, hanya ada dua role client: `ADMIN` dan `TEACHER`.** Tidak ada Owner, Waka Kurikulum, Kepala/Reviewer, Viewer, atau approval hierarchy pada MVP.

Satu user dapat memiliki membership di beberapa tenant. Contoh: seseorang dapat memiliki Personal Workspace sebagai `PERSONAL_TEACHER` dan menjadi `TEACHER` pada sekolah tempat ia bekerja.

## 2. Super Admin

Super Admin berada di platform/control plane dan berfungsi untuk:

- melihat serta mengelola semua client individu dan instansi;
- membuat, mengaktifkan, menangguhkan, memperpanjang, atau menutup tenant;
- mengatur paket, harga, seat, masa aktif, trial, entitlement, invoice/transaksi;
- mengatur master regulasi dan **seluruh siklus CP** (input/import/verify/publish/version/archive), KBC, template global, AI provider/model/fallback;
- memantau usage, biaya AI, storage, export, dan kesehatan sistem;
- melakukan support session/impersonation terkontrol dengan audit log.

Super Admin tidak menjadi role operasional di dalam tenant sekolah.

## 3. Client Individu — PERSONAL_TEACHER

Guru individu dapat:

- mengelola profil personal;
- membuat TP/ATP;
- membuat RPP/Modul Ajar dan seluruh perangkat guru;
- membuat soal, kisi-kisi, kunci, pembahasan, rubrik, paket soal;
- mengelola bank soal dan dokumen personal;
- export sesuai entitlement;
- melihat usage dan status paket pribadi.

Tidak ada menu Data Guru atau Profil Sekolah untuk tenant individu.

## 4. Client Instansi — ADMIN

Admin adalah pengelola data lembaga, **bukan role pembuat utama perangkat pembelajaran**.

Admin dapat:

- mengubah nama sekolah/lembaga;
- upload/ganti logo sekolah;
- mengatur NPSN/NSM, jenjang/jenis lembaga, alamat, kota/provinsi, telepon, email, website;
- mengatur kop/header/footer/template export lembaga;
- mengatur tahun ajaran dan semester aktif;
- input data guru;
- membuat atau mengundang akun guru;
- mengubah data guru;
- mengaktifkan/menonaktifkan akun guru;
- mengatur mapel utama, jenjang, dan kelas yang diampu guru bila diperlukan;
- melihat jumlah guru aktif/seat terpakai;
- melihat usage AI/export/storage dan status paket tenant.

Admin tidak dapat:

- mengubah teks CP resmi;
- mengubah master regulasi global;
- membuat atau mengedit dokumen milik guru sebagai fungsi normal;
- melakukan approval/review akademik karena workflow tersebut tidak ada pada MVP.

## 5. Client Instansi — TEACHER

Teacher menggunakan identitas sekolah yang telah diatur Admin. Teacher dapat:

- melihat CP resmi sesuai mapel/fase;
- generate dan edit TP;
- generate dan susun ATP;
- generate/edit RPP atau Modul Ajar;
- membuat perangkat guru lain sesuai fitur aktif;
- membuat soal, kisi-kisi, kunci jawaban, pembahasan, rubrik, remedial, pengayaan;
- mengelola bank soal dan paket soal;
- menyimpan dokumen sebagai `DRAFT` atau `FINAL`;
- export DOCX/PDF/XLSX/CSV sesuai tipe dokumen dan entitlement;
- melihat histori/versi dokumen sendiri;
- melihat usage miliknya bila UI menyediakan.

Teacher tidak dapat:

- menambah/menghapus guru lain;
- mengubah profil/logo/kop sekolah;
- mengubah plan/entitlement tenant;
- mengubah master CP/regulasi global.

## 6. Permission Matrix

| Permission | Super Admin | Personal Teacher | Institution Admin | Institution Teacher |
|---|:---:|:---:|:---:|:---:|
| Manage semua tenant | ✓ |  |  |  |
| Manage paket/entitlement | ✓ | own plan* | view only |  |
| Manage master regulasi/CP | ✓ |  |  |  |
| Manage profil lembaga | support |  | ✓ |  |
| Upload logo/kop lembaga | support |  | ✓ |  |
| Manage tahun ajaran lembaga | support |  | ✓ |  |
| Manage data & akun guru | support |  | ✓ |  |
| Lihat usage tenant | ✓ | own | ✓ | own/optional |
| Generate TP/ATP | support | ✓ |  | ✓ |
| Generate RPP/Modul | support | ✓ |  | ✓ |
| Generate perangkat guru | support | ✓ |  | ✓ |
| Generate soal | support | ✓ |  | ✓ |
| Kelola bank soal | support | ✓ |  | ✓ |
| Edit dokumen guru | support session | own |  | own |
| Export | support | ✓ |  | ✓ |

`*` bergantung apakah billing individual dibuat self-service atau dikelola Super Admin.

## 7. Dokumen & Kepemilikan

- Dokumen Personal Workspace dimiliki tenant individual.
- Dokumen yang dibuat guru pada tenant institution berada di tenant institution dan selalu mencatat `created_by`/`owner_id` guru.
- Secara operasional guru hanya mengelola dokumen miliknya sendiri pada MVP.
- Admin tidak otomatis memperoleh hak edit isi dokumen guru.
- Saat guru dinonaktifkan, dokumennya tetap berada di tenant institution dan dapat dipertahankan untuk arsip; kebijakan reassignment dapat ditambahkan pada fase lanjutan.

## 8. Status Dokumen

MVP tidak menggunakan workflow approval. Status utama:

`DRAFT → FINAL → ARCHIVED`

Guru sendiri yang menentukan dokumennya siap final. Validator sistem tetap memberi warning/error berdasarkan CP, fase, KBC, dan kelengkapan struktur tanpa memerlukan reviewer manusia.


## 9. CP Permission Rule

- `SUPER_ADMIN` adalah **satu-satunya role yang dapat menginput CP**.
- `ADMIN` instansi tidak boleh menambah, mengedit, menghapus, mem-publish, atau mengimpor CP.
- `TEACHER` dan `PERSONAL_TEACHER` hanya browse/select CP published.
- AI engine tidak memiliki permission menulis master CP.
- Perubahan CP published wajib melalui versioning + audit log.
