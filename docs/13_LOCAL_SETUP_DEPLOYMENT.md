# Local Setup & Deployment

## 1. Local Requirements

- PHP 8.3+
- Composer 2
- Node.js 22 LTS+
- MySQL 8 / MariaDB 10.11+
- Redis optional for local
- LibreOffice headless optional depending on export strategy

## 2. Recommended Project Bootstrap

```bash
composer create-project laravel/laravel edugen-kbc
cd edugen-kbc
composer require laravel/sanctum
npm install
```

Add Inertia/React/TypeScript/Tailwind according to preferred starter stack.

## 3. Environment

```env
APP_NAME="EduGen KBC"
APP_ENV=local
APP_URL=http://edugen.test

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=edugen_kbc
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=local

AI_DEFAULT_PROVIDER=gemini
```

Secrets provider tidak ditulis ke repo.

## 4. Suggested Directory Architecture

```text
app/
  Domain/
    Curriculum/
    Regulation/
    Planning/
    Assessment/
    QuestionBank/
    AI/
    Export/
  Http/
  Jobs/
  Policies/
resources/js/
  components/
  features/
  layouts/
  pages/
```

## 5. Bootstrap Master Domain

Fresh install hanya menginisialisasi definisi sistem yang deterministik, bukan data operasional:

1. role/permission keys;
2. status/enums;
3. education level/grade/phase mapping yang ditetapkan aplikasi;
4. curriculum mode keys;
5. DPL;
6. Panca Cinta;
7. feature keys.

Tidak ada tenant, guru, sekolah, regulasi, CP, subject record operasional, paket berharga, subscription, dokumen, soal, statistik, maupun template lembaga yang dibuat otomatis. Data tersebut diisi melalui workflow nyata sesuai role.

## 6. Local Worker

```bash
php artisan queue:work
```

For development with Laravel scheduler if needed:

```bash
php artisan schedule:work
```

## 7. Production

Recommended:

- Nginx;
- PHP-FPM;
- MySQL/MariaDB;
- Redis;
- Supervisor/systemd queue workers;
- S3-compatible storage;
- HTTPS;
- daily backups.

## 8. Deployment Checklist

- `APP_DEBUG=false`;
- correct trusted proxies;
- storage private;
- queue worker running;
- scheduler configured;
- migration backup;
- source documents verified;
- AI provider health check;
- rate limits;
- CSP/HSTS;
- backup restore test.

## 9. Migration Strategy

Each future regulation update must be data migration/import, not code rewrite. `source_policies` chooses active source by effective period.

## SaaS Environment Variables

```env
APP_SAAS_MODE=true
DEFAULT_TRIAL_DAYS=14
BILLING_PROVIDER=
BILLING_WEBHOOK_SECRET=
TENANT_STORAGE_PREFIX=tenants
SUPERADMIN_HOST=admin.example.com
```

Tidak ada provider billing palsu. Jika payment gateway belum dikonfigurasi, billing online dinonaktifkan. Bila bisnis membutuhkan pembayaran manual, gunakan provider `manual` yang mencatat transaksi nyata yang diverifikasi Super Admin—bukan transaksi buatan.

Instalasi tidak membuat tenant, guru, sekolah, CP, plan berharga, atau data operasional bawaan. Buat Super Admin melalui setup/Artisan command interaktif dengan kredensial nyata, lalu isi konfigurasi platform melalui panel Super Admin.
