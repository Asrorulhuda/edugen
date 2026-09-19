# Client Onboarding Workflows — v3

## 1. Pilihan Client

Saat signup/pricing, pengguna memilih:

- **Guru / Individu**
- **Instansi / Lembaga**

## 2. Individual

1. Verifikasi email.
2. Lengkapi profil guru.
3. Sistem membuat Personal Tenant `INDIVIDUAL`.
4. Pilih trial/plan atau aktivasi dari Super Admin.
5. Pilih preferensi jenjang/mapel opsional.
6. Masuk Personal Dashboard dan mulai generate.

## 3. Institution Self-Service

1. Verifikasi email calon Admin.
2. Sistem membuat tenant `INSTITUTION`.
3. Isi nama sekolah/lembaga.
4. Pilih jenis/jenjang lembaga.
5. Isi NPSN/NSM opsional dan alamat/kontak.
6. Upload logo dan kop/template bila ada.
7. Pilih paket + jumlah seat guru atau gunakan paket yang sudah ditetapkan Super Admin.
8. Sistem membuat membership pertama dengan role `ADMIN`.
9. Admin menetapkan tahun ajaran/semester aktif.
10. Admin membuka menu **Data Guru** dan menginput/mengundang guru.
11. Setiap guru mendapat role `TEACHER`.
12. Teacher login dan mulai membuat TP/ATP, RPP/Modul Ajar, perangkat guru, soal dan bank soal.

Tidak ada langkah pembuatan Owner, Waka, Reviewer, Kepala, atau Viewer.

## 4. Super Admin Provisioned Institution

Untuk client sales/offline:

1. Super Admin membuat tenant.
2. Pilih `INSTITUTION`.
3. Isi nama client dan paket/masa aktif/seat.
4. Buat atau undang akun Admin pertama.
5. Admin menerima link aktivasi.
6. Admin melengkapi profil sekolah dan data guru.
7. Teacher mulai menggunakan generator.

## 5. Data Guru oleh Admin

Form minimal:

- nama lengkap;
- email/username;
- NIP/nomor pegawai opsional;
- NUPTK opsional;
- nomor HP opsional;
- mapel utama;
- jenjang/kelas yang diampu opsional;
- status aktif/nonaktif.

Admin dapat membuat akun dengan password sementara atau mengirim invitation/reset-link sesuai konfigurasi keamanan.

## 6. Guru yang Sudah Punya Akun Individu

Jika email guru sudah memiliki Personal Workspace:

- login dengan akun yang sama;
- accept invitation dari instansi;
- workspace sekolah muncul pada Workspace Switcher;
- Personal Workspace tetap ada;
- di workspace sekolah user ber-role `TEACHER`.

## 7. Guru Keluar / Dinonaktifkan

- Admin menonaktifkan membership Teacher;
- akses ke tenant sekolah dicabut;
- dokumen yang dibuat di tenant sekolah tetap berada di tenant sekolah;
- Personal Workspace guru tidak terpengaruh;
- seat dapat digunakan untuk guru lain sesuai billing policy.


## 9. CP Is Not Part of Tenant Onboarding

Tenant Admin tidak diminta mengunggah atau menginput CP saat onboarding. CP berasal dari platform master yang dikelola Super Admin. Jika mapel/fase belum memiliki CP published, guru melihat status unavailable dan generator terkait diblokir sampai Super Admin menerbitkan sumber yang valid.
