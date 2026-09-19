# Panduan Setup Auto Deploy GitHub Actions ke cPanel

Workflow GitHub Actions telah dibuat di [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
Setiap kali Anda menjalankan `git push origin main`, workflow ini akan secara otomatis:
1. Menjalankan test suite backend (`php artisan test`) dan kompilasi frontend (`npm run build`).
2. Mentransfer asset build ke server cPanel via SCP (mengatasi keterbatasan RAM / ketiadaan Node.js di cPanel).
3. Melakukan `git pull`, `composer install`, migrasi database, dan optimasi cache melalui SSH di cPanel.

---

## 1. Menyiapkan Repository Secrets di GitHub

Buka repository GitHub Anda di:
👉 **https://github.com/Asrorulhuda/edugen/settings/secrets/actions**

Klik **New repository secret** dan tambahkan variabel berikut:

| Nama Secret | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `CPANEL_SSH_HOST` | `server.domainanda.com` atau IP server | Host atau IP address server hosting cPanel |
| `CPANEL_SSH_PORT` | `22` (atau port custom misal `2222`, `65002`) | Port SSH cPanel Anda |
| `CPANEL_SSH_USER` | `u1234567` / username cPanel Anda | Username login cPanel |
| `CPANEL_SSH_KEY` | *(Isi Private Key SSH)* | Rekomendasi: Gunakan SSH Private Key |
| `CPANEL_SSH_PASSWORD` | *(Password cPanel)* | Alternatif jika tidak memakai SSH key |
| `CPANEL_PROJECT_PATH` | `/home/username/edugen` | Path absolut folder proyek Laravel di server cPanel |

> [!TIP]
> Jika Anda menggunakan `CPANEL_SSH_KEY`, pastikan public key-nya sudah didaftarkan di menu **cPanel > SSH Access > Manage SSH Keys > Authorize**.

---

## 2. Setup Awal di Server cPanel (Dilakukan 1x Saja)

Sebelum auto deploy pertama kali berjalan, siapkan clone repository dan `.env` di cPanel melalui Terminal SSH cPanel:

```bash
# 1. Masuk ke home direktori
cd ~

# 2. Clone repository untuk pertama kali
git clone https://github.com/Asrorulhuda/edugen.git edugen

# 3. Masuk ke folder proyek
cd edugen

# 4. Buat file .env produksi
cp .env.example .env

# 5. Generate Application Key
php artisan key:generate

# 6. Hubungkan storage publik
php artisan storage:link
```

Edit file `.env` di cPanel (via File Manager atau nano) dan masukkan kredensial database hosting Anda serta set:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domainanda.com
```

---

## 3. Menghubungkan Domain / Subdomain ke Folder `public`

Di cPanel, buka menu **Domains**:
* Pastikan **Document Root** domain Anda mengarah ke:
  `/home/username/edugen/public`
  *(Bukan ke `/home/username/edugen/`)*.

---

## 4. Cara Menjalankan Deploy

Setelah langkah 1, 2, dan 3 selesai:
Cukup jalankan push dari komputer lokal:
```bash
git add .
git commit -m "update fitur baru"
git push origin main
```
Workflow GitHub Actions akan otomatis aktif dan meng-update server cPanel Anda secara real-time!
