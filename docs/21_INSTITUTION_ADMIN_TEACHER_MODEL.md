# Institution Admin & Teacher Model — Final MVP Rule

## 1. Aturan Utama

Untuk setiap client `INSTITUTION`, hanya ada:

1. `ADMIN`
2. `TEACHER`

Super Admin adalah role platform dan bukan role sekolah.

## 2. Admin

Fokus Admin adalah **menyiapkan identitas dan data operasional lembaga** agar guru bisa langsung bekerja.

Admin mengelola:

- nama sekolah/lembaga;
- logo;
- NPSN/NSM;
- jenjang/jenis lembaga;
- alamat dan kontak;
- website/email;
- kop/header/footer/template export;
- tahun ajaran dan semester aktif;
- data guru;
- akun guru;
- status aktif/nonaktif guru;
- mapel/kelas guru bila diperlukan;
- seat, usage, dan status paket yang boleh dilihat.

Admin tidak menjadi reviewer akademik dan tidak memiliki approval workflow.

## 3. Teacher

Fokus Teacher adalah **seluruh pekerjaan perangkat pembelajaran**:

- CP browser;
- TP;
- ATP;
- RPP;
- Modul Ajar;
- perangkat guru;
- LKPD/bahan ajar bila modul tersedia;
- kisi-kisi;
- generator soal;
- kunci jawaban;
- pembahasan;
- rubrik;
- remedial;
- pengayaan;
- jurnal/refleksi;
- bank soal;
- paket ujian;
- export dokumen.

## 4. Navigation

### Admin

```text
Dashboard
Profil Lembaga
Data Guru
Tahun Ajaran
Template/Kop
Usage & Paket
Pengaturan
```

### Teacher

```text
Dashboard
Generator
├─ TP / ATP
├─ RPP / Modul Ajar
├─ Perangkat Guru
└─ Soal
Bank Soal
Dokumen Saya
CP & Referensi
Export
```

## 5. Authorization Rule

```text
ADMIN   -> institution.settings.*, teachers.*, tenant.usage.read
TEACHER -> generators.*, documents.own.*, questions.own.*, exports.own.*
```

Semua policy harus divalidasi di backend. Menyembunyikan menu di frontend saja tidak cukup.

## 6. Status Dokumen

```text
DRAFT -> FINAL -> ARCHIVED
```

Validator otomatis tetap memeriksa kesesuaian CP, fase, struktur RPP, KBC/DPL, dan asesmen. Tidak ada reviewer manusia pada alur MVP.


## Master CP

Master CP **bukan tanggung jawab Admin Instansi**. Hanya Super Admin platform yang menginput/import/verify/publish/version CP. Admin Instansi tidak memiliki menu Master CP; Teacher hanya memakai CP Browser read-only.
