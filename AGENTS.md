# Aturan Agent EduGen

Aturan ini berlaku untuk seluruh repository. Aplikasi sudah production di
`https://edugen.asr-desain.my.id` dan deployment berjalan otomatis dari branch
`main` melalui GitHub webhook.

## Prinsip wajib

- Perlakukan hosting dan database hosting sebagai production.
- Jangan membaca, mengubah, menyalin, mencetak, atau melakukan commit terhadap
  `.env`, secret webhook, credential, maupun data pengguna production.
- Jangan pernah memasukkan `database.sqlite`, file `.sql`, file backup, atau
  dump database ke Git.
- Jangan mengubah data atau menjalankan perintah manual di hosting jika alur
  migration dan webhook normal masih dapat digunakan.
- Jangan mengedit migration lama yang sudah mungkin pernah dijalankan di
  production. Selalu buat migration baru.
- Jangan membuat kembali atau menggunakan `update_db.php`. Deployment database
  ditangani oleh `deploy-worker.php` dengan `php artisan migrate --force`.
- Pertahankan perubahan milik pengguna yang tidak berkaitan dengan tugas.
- Sebelum commit, periksa `git status` dan stage hanya file dalam ruang lingkup
  perubahan.
- Push/deploy hanya ketika pengguna meminta deployment atau push secara jelas.

## Klasifikasi perubahan sebelum deploy

Agent wajib menentukan salah satu kategori berikut.

### 1. Perubahan kode tanpa perubahan database

Contoh: controller, service, model tanpa perubahan schema, React/TypeScript,
Blade, route, policy, konfigurasi aplikasi, atau styling.

Langkah wajib:

1. Implementasikan perubahan secara lokal.
2. Jika frontend berubah, jalankan `npm.cmd run build` di Windows atau
   `npm run build` di Linux, dan sertakan hasil terbaru `public/build` karena
   aset production repository ini dilacak Git.
3. Jalankan minimal `php artisan test --compact`.
4. Jalankan pemeriksaan tambahan yang relevan, misalnya `php -l` untuk skrip
   PHP mandiri dan `git diff --check`.
5. Pastikan tidak ada migration yang dibuat tanpa kebutuhan.
6. Commit hanya file terkait, lalu push ke `origin/main` jika deployment memang
   diminta pengguna.

Worker production tetap menjalankan `php artisan migrate --force`. Tanpa
migration baru, hasil yang benar adalah `Nothing to migrate` dan data production
tidak berubah.

### 2. Perubahan kode dengan perubahan database

Perubahan database mencakup tabel, kolom, index, constraint, relasi, tipe data,
atau data master yang wajib tersedia untuk versi aplikasi baru.

Langkah wajib:

1. Buat migration baru dengan `php artisan make:migration ...`.
2. Implementasikan `up()` secara aman dan, jika memungkinkan, `down()` yang
   dapat memulihkan schema.
3. Utamakan migration additive dan backward-compatible. Untuk perubahan
   destruktif seperti menghapus/rename kolom, gunakan deployment bertahap agar
   kode lama dan baru tidak rusak saat transisi.
4. Perubahan data wajib dibuat idempotent: aman jika diperiksa atau dijalankan
   kembali. Jangan menjalankan seeder umum yang dapat menimpa data production.
5. Jangan mengandalkan perubahan manual pada SQLite lokal sebagai migration.
6. Uji lokal dengan `php artisan migrate` lalu `php artisan test --compact`.
7. Jika frontend ikut berubah, jalankan build production dan commit
   `public/build` bersama source.
8. Review SQL/migration untuk risiko kehilangan data sebelum commit.
9. Commit kode dan migration dalam perubahan yang sama, lalu push ke
   `origin/main` jika deployment diminta pengguna.

Saat webhook berjalan, worker otomatis membuat backup SQLite sebelum
menjalankan migration. Backup berada di `storage/app/deploy/backups/` pada
hosting dan tidak boleh di-commit.

## Alur deployment production

Alur normal yang harus dipertahankan:

1. Push commit ke `origin/main`.
2. GitHub mengirim request ke `public/deploy-webhook.php`.
3. Webhook memvalidasi signature, repository, branch, dan commit.
4. Webhook mengantrekan commit lalu segera mengembalikan HTTP `202`.
5. `deploy-worker.php` memperoleh deployment lock.
6. Worker melakukan fetch, mengaktifkan maintenance mode, dan membuat backup
   SQLite.
7. Worker checkout commit yang tepat, menjalankan Composer, migration, dan
   membangun ulang cache Laravel.
8. Worker menonaktifkan maintenance mode dan memverifikasi commit akhir.

HTTP `202` hanya berarti deployment masuk antrean, bukan berarti deployment
sudah selesai.

## Verifikasi setelah deploy

Deployment hanya boleh dilaporkan berhasil jika ada bukti berikut:

- Push Git berhasil ke `origin/main`.
- Commit hosting sama dengan commit yang dipush, diperiksa dengan
  `git rev-parse HEAD` bila akses hosting tersedia.
- Log `storage/logs/deploy.log` berakhir dengan `deployment_succeeded` untuk
  commit tersebut.
- Tidak ada step dengan `exit_code` selain `0`.
- Aplikasi sudah keluar dari maintenance mode.

Perintah diagnosis hosting yang aman:

```bash
git rev-parse HEAD
tail -n 100 storage/logs/deploy.log
php artisan migrate:status
```

Jangan meminta pengguna membuka terminal hosting untuk deployment normal.
Terminal hanya diperlukan untuk verifikasi awal atau diagnosis kegagalan.

## Penanganan kegagalan

- Jangan menekan `Redeliver` berulang kali tanpa membaca log dan memastikan
  tidak ada deployment yang masih berjalan.
- Cari step pertama dengan `exit_code` bukan `0`; perbaiki penyebabnya di source,
  test lokal, lalu deploy commit perbaikan.
- Pastikan aplikasi kembali live. Jika log tidak menunjukkan
  `maintenance-off` berhasil, diagnosis status maintenance sebelum tindakan
  lain.
- Jangan melakukan rollback database production secara otomatis. Nilai dahulu
  migration yang sudah berjalan dan gunakan backup SQLite bila pemulihan memang
  diperlukan.
- Jangan menggunakan `git reset --hard` secara manual di hosting. Reset commit
  production merupakan tanggung jawab worker deployment.

## File deployment yang harus dipertahankan

- `public/deploy-webhook.php`: endpoint GitHub yang cepat dan terautentikasi.
- `deploy-worker.php`: worker CLI untuk deployment, backup, migration, cache,
  locking, dan log.
- `.env.example`: hanya nama variabel dan contoh aman; tidak boleh berisi secret
  production.
