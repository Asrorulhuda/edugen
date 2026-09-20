<?php
/**
 * EduGen AI - Database Auto Updater & Migration Synchronizer
 *
 * Skrip ini digunakan untuk migrasi database, seeding pintar, dan optimasi cache
 * secara otomatis saat push git, webhook deployment, atau pemanggilan mandiri (CLI / Browser).
 *
 * Penggunaan:
 * - Browser: https://domain.anda/update_db.php?token=edugen_deploy_secret_2026
 * - CLI: php public/update_db.php
 */

define('LARAVEL_START', microtime(true));

// 1. Deteksi Lingkungan (CLI atau Web HTTP)
$isCli = (php_sapi_name() === 'cli' || empty($_SERVER['REMOTE_ADDR']));

// 2. Token Keamanan
$secretToken = getenv('DEPLOY_WEBHOOK_SECRET') ?: 'edugen_deploy_secret_2026';

if (!$isCli) {
    $token = $_GET['token'] ?? null;
    if (!$token || !hash_equals($secretToken, $token)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized: Invalid update token.',
            'tip' => 'Tambahkan ?token=edugen_deploy_secret_2026 pada URL.',
        ], JSON_PRETTY_PRINT);
        exit;
    }
}

// 3. Masuk ke root direktori proyek & autoload Laravel
$rootDir = dirname(__DIR__);
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    $rootDir = dirname(__DIR__);
} elseif (file_exists(__DIR__ . '/vendor/autoload.php')) {
    $rootDir = __DIR__;
}

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

// 4. Eksekusi Migrasi Database Utama
$logs[] = runArtisanCommand('migrate', ['--force' => true]);

// 5. Smart Seeding (Hanya seed jika tabel kosong / belum terisi data wajib)
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

// 6. Optimasi Cache & Storage Link
$logs[] = runArtisanCommand('optimize:clear');
$logs[] = runArtisanCommand('config:cache');
$logs[] = runArtisanCommand('route:cache');
$logs[] = runArtisanCommand('view:cache');

// Storage Symlink (opsional jika belum ada)
if (!file_exists($rootDir . '/public/storage') && is_link($rootDir . '/public/storage') === false) {
    $logs[] = runArtisanCommand('storage:link');
}

$totalDuration = round(microtime(true) - $startTime, 2);

// 7. Format Output Respons
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

// Respon Web (JSON atau HTML jika ?format=html)
if (isset($_GET['format']) && $_GET['format'] === 'html') {
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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
            .container { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
            h1 { font-size: 1.25rem; font-weight: 800; color: #10b981; margin-top: 0; }
            .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: #065f46; color: #a7f3d0; }
            .log-item { background: #0f172a; border-radius: 8px; padding: 0.75rem 1rem; margin-top: 0.75rem; border: 1px solid #334155; font-family: monospace; font-size: 0.8rem; }
            .log-header { display: flex; justify-content: space-between; align-items: center; color: #38bdf8; font-weight: 600; }
            .log-output { color: #94a3b8; margin-top: 0.35rem; white-space: pre-wrap; word-break: break-all; }
            .success { color: #34d399; }
            .failed { color: #f87171; }
        </style>
    </head>
    <body>
        <div class="container">
            <span class="badge">EduGen Auto Updater</span>
            <h1>Pembaruan Database & Cache Sukses</h1>
            <p style="font-size: 0.85rem; color: #94a3b8;">Waktu: <?= $response['timestamp'] ?> | Durasi: <?= $response['total_duration'] ?></p>
            <div style="margin-top: 1.5rem;">
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
        </div>
    </body>
    </html>
    <?php
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
