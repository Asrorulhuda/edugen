<?php
/**
 * EduGen AI - Database Auto Updater & Migration Synchronizer
 *
 * Skrip ini digunakan untuk migrasi database, seeding pintar, dan optimasi cache
 * secara otomatis saat push git, webhook deployment, atau pemanggilan mandiri (CLI / Browser).
 */

define('LARAVEL_START', microtime(true));

// 1. Deteksi Lingkungan (CLI atau Web HTTP)
$isCli = (php_sapi_name() === 'cli' || empty($_SERVER['REMOTE_ADDR']));

// 2. Baca Root Folder & .env untuk Token Keamanan
$rootDir = dirname(__DIR__);
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    $rootDir = dirname(__DIR__);
} elseif (file_exists(__DIR__ . '/vendor/autoload.php')) {
    $rootDir = __DIR__;
}

$secretToken = 'edugen_deploy_secret_2026';
if (file_exists($rootDir . '/.env')) {
    $envLines = @file($rootDir . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($envLines) {
        foreach ($envLines as $line) {
            $trimmed = trim($line);
            if (str_starts_with($trimmed, 'DEPLOY_WEBHOOK_SECRET=')) {
                $val = trim(substr($trimmed, 22));
                $parsed = trim($val, '"\'');
                if (!empty($parsed)) {
                    $secretToken = $parsed;
                }
                break;
            }
        }
    }
}

// 3. Autentikasi Token (Bisa dari GET, POST, atau Header)
$inputToken = $_POST['token'] ?? $_GET['token'] ?? $_SERVER['HTTP_X_UPDATE_TOKEN'] ?? null;
$tokenError = null;

if (!$isCli) {
    if (!$inputToken) {
        // Tampilkan Form Interaktif jika dibuka langsung di Browser tanpa parameter
        header('Content-Type: text/html; charset=utf-8');
        ?>
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>EduGen AI - Database & Cache Updater</title>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg">
            <style>
                * { box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem 1rem; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
                .card { max-width: 520px; width: 100%; background: #1e293b; border-radius: 20px; border: 1px solid #334155; padding: 2.25rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5); text-align: center; }
                .icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(16, 185, 129, 0.15); color: #10b981; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; font-size: 28px; }
                h1 { font-size: 1.35rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0; }
                p { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin: 0 0 1.5rem 0; }
                .input-group { text-align: left; margin-bottom: 1.25rem; }
                label { display: block; font-size: 0.75rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                input[type="text"], input[type="password"] { width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid #475569; background: #0f172a; color: #ffffff; font-size: 0.9rem; font-family: monospace; outline: none; transition: border-color 0.2s; }
                input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
                button { width: 100%; padding: 0.85rem; border-radius: 12px; border: none; background: #10b981; color: #ffffff; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.15s; }
                button:hover { background: #059669; transform: translateY(-1px); }
                button:active { transform: translateY(1px); }
                .quick-link { margin-top: 1.25rem; font-size: 0.75rem; color: #64748b; }
                .quick-link a { color: #10b981; text-decoration: none; font-weight: 600; }
                .quick-link a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">⚡</div>
                <h1>EduGen Database Updater</h1>
                <p>Jalankan migrasi database, seeding pintar, dan optimasi cache Laravel tanpa membutuhkan akses terminal SSH.</p>
                <form method="POST" action="update_db.php?format=html">
                    <div class="input-group">
                        <label for="token">Token Keamanan Deployment</label>
                        <input type="text" id="token" name="token" value="edugen_deploy_secret_2026" required autofocus placeholder="Masukkan token rahasia">
                    </div>
                    <button type="submit">Jalankan Update Database Sekarang ➔</button>
                </form>
                <div class="quick-link">
                    Atau gunakan URL langsung:<br>
                    <a href="update_db.php?token=edugen_deploy_secret_2026&format=html">update_db.php?token=edugen_deploy_secret_2026</a>
                </div>
            </div>
        </body>
        </html>
        <?php
        exit;
    }

    if (!hash_equals($secretToken, $inputToken)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized: Token keamanan tidak cocok.',
            'tip' => 'Gunakan token default: edugen_deploy_secret_2026 atau atur DEPLOY_WEBHOOK_SECRET di .env.',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

// 4. Autoload Laravel & Bootstrap Console
require $rootDir . '/vendor/autoload.php';
$app = require_once $rootDir . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$startTime = microtime(true);
$logs = [];

function runArtisanCommand(string $command, array $params = []): array
{
    $start = microtime(true);
    try {
        $exitCode = Artisan::call($command, $params);
        $output = trim(Artisan::output());
        return [
            'command' => $command . ($params ? ' ' . json_encode($params) : ''),
            'status' => $exitCode === 0 ? 'SUCCESS' : 'FAILED',
            'exit_code' => $exitCode,
            'duration' => round(microtime(true) - $start, 3) . 's',
            'output' => $output,
        ];
    } catch (\Throwable $e) {
        return [
            'command' => $command,
            'status' => 'EXCEPTION',
            'exit_code' => 1,
            'duration' => round(microtime(true) - $start, 3) . 's',
            'output' => $e->getMessage(),
        ];
    }
}

// 5. Eksekusi Migrasi Database Utama
$logs[] = runArtisanCommand('migrate', ['--force' => true]);

// 6. Smart Seeding (Hanya seed jika tabel kosong / belum terisi data wajib)
$smartSeeders = [
    [
        'table' => 'roles',
        'seeder' => 'RoleAndPermissionSeeder',
        'desc' => 'Hak Akses & Role Master',
    ],
    [
        'table' => 'subscription_plans',
        'seeder' => 'SubscriptionPlanSeeder',
        'desc' => 'Paket Langganan & Billing',
    ],
    [
        'table' => 'payment_gateway_settings',
        'seeder' => 'PaymentSettingSeeder',
        'desc' => 'Pengaturan Payment Gateway & Bank',
    ],
    [
        'table' => 'ai_provider_settings',
        'seeder' => 'AiProviderSettingSeeder',
        'desc' => 'Pengaturan Provider AI',
    ],
    [
        'table' => 'landing_page_sections',
        'seeder' => 'LandingPageSectionSeeder',
        'desc' => 'Data Section Landing Page',
    ],
    [
        'table' => 'regulations',
        'seeder' => 'RegulationAndCurriculumSeeder',
        'desc' => 'Regulasi Kurmer & KBC',
    ],
    [
        'table' => 'academic_years',
        'seeder' => 'AcademicMasterSeeder',
        'desc' => 'Master Tahun Ajaran & Mapel',
    ],
];

foreach ($smartSeeders as $seed) {
    if (Schema::hasTable($seed['table'])) {
        $count = DB::table($seed['table'])->count();
        if ($count === 0) {
            $logs[] = runArtisanCommand('db:seed', [
                '--class' => $seed['seeder'],
                '--force' => true,
            ]);
        }
    }
}

// 7. Optimasi Cache & Storage Link
$logs[] = runArtisanCommand('optimize:clear');
$logs[] = runArtisanCommand('config:cache');
$logs[] = runArtisanCommand('route:cache');
$logs[] = runArtisanCommand('view:cache');

// Storage Symlink (opsional jika belum ada)
if (!file_exists($rootDir . '/public/storage') && is_link($rootDir . '/public/storage') === false) {
    $logs[] = runArtisanCommand('storage:link');
}

$totalDuration = round(microtime(true) - $startTime, 2);

// 8. Format Output Respons
$response = [
    'status' => 'success',
    'app_name' => config('app.name', 'EduGen'),
    'environment' => config('app.env'),
    'timestamp' => date('Y-m-d H:i:s') . ' WIB',
    'total_duration' => $totalDuration . 's',
    'tasks_executed' => count($logs),
    'logs' => $logs,
];

if ($isCli) {
    echo "========================================================\n";
    echo "  EduGen AI - Database Auto Updater & Cache Optimizer   \n";
    echo "========================================================\n";
    echo "Waktu: " . $response['timestamp'] . "\n";
    echo "Durasi Total: " . $response['total_duration'] . "\n\n";

    foreach ($logs as $log) {
        $prefix = $log['status'] === 'SUCCESS' ? '[✓ OK]' : '[✗ ERR]';
        echo "{$prefix} {$log['command']} ({$log['duration']})\n";
        if (!empty($log['output'])) {
            echo "   Output: " . str_replace("\n", "\n   ", $log['output']) . "\n";
        }
    }
    echo "\n>> Selesai! Database dan cache EduGen telah terbarui.\n";
    exit(0);
}

// Respon Web (HTML jika ?format=html atau form POST)
$isHtml = (isset($_GET['format']) && $_GET['format'] === 'html') || ($_SERVER['REQUEST_METHOD'] === 'POST');

if ($isHtml) {
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduGen AI - Database Updater</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem 1rem; margin: 0; min-height: 100vh; }
            .container { max-width: 820px; margin: 0 auto; background: #1e293b; border-radius: 20px; border: 1px solid #334155; padding: 2rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5); }
            h1 { font-size: 1.35rem; font-weight: 800; color: #10b981; margin: 0.5rem 0 0.25rem 0; }
            .badge { display: inline-block; padding: 0.3rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
            .log-item { background: #0f172a; border-radius: 12px; padding: 0.85rem 1.15rem; margin-top: 0.85rem; border: 1px solid #334155; font-family: monospace; font-size: 0.8rem; }
            .log-header { display: flex; justify-content: space-between; align-items: center; color: #38bdf8; font-weight: 600; }
            .log-output { color: #94a3b8; margin-top: 0.4rem; white-space: pre-wrap; word-break: break-all; }
            .success { color: #34d399; font-weight: 700; }
            .failed { color: #f87171; font-weight: 700; }
            .btn-home { display: inline-block; margin-top: 1.5rem; padding: 0.65rem 1.25rem; border-radius: 10px; background: #10b981; color: #ffffff; text-decoration: none; font-size: 0.85rem; font-weight: 700; }
            .btn-home:hover { background: #059669; }
        </style>
    </head>
    <body>
        <div class="container">
            <span class="badge">EduGen Auto Updater</span>
            <h1>Pembaruan Database & Cache Berhasil!</h1>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">Waktu: <?= $response['timestamp'] ?> | Durasi: <?= $response['total_duration'] ?></p>
            <div>
                <?php foreach ($logs as $log): ?>
                    <div class="log-item">
                        <div class="log-header">
                            <span><?= htmlspecialchars($log['command']) ?></span>
                            <span class="<?= $log['status'] === 'SUCCESS' ? 'success' : 'failed' ?>"><?= $log['status'] ?> (<?= $log['duration'] ?>)</span>
                        </div>
                        <?php if (!empty($log['output'])): ?>
                            <div class="log-output"><?= htmlspecialchars($log['output']) ?></div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <a href="/" class="btn-home">➔ Buka Halaman Utama EduGen</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
