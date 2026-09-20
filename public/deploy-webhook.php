<?php
/**
 * EduGen AI - Auto Deployment Webhook
 *
 * Endpoint ini menerima pemicu (trigger) dari GitHub Webhook atau pemanggilan URL langsung
 * untuk melakukan pembaruan otomatis di cPanel tanpa membutuhkan port SSH eksternal.
 */

// Token keamanan rahasia (bisa Anda sesuaikan)
$secretToken = 'edugen_deploy_secret_2026';

// 1. Verifikasi Keamanan
$token = $_GET['token'] ?? null;
$hubSignature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? null;
$rawPayload = file_get_contents('php://input');

$isAuthorized = false;

// Verifikasi via URL parameter ?token=...
if ($token && hash_equals($secretToken, $token)) {
    $isAuthorized = true;
}

// Verifikasi via GitHub Webhook Signature Header
if ($hubSignature && $rawPayload) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $rawPayload, $secretToken);
    if (hash_equals($expectedSignature, $hubSignature)) {
        $isAuthorized = true;
    }
}

if (!$isAuthorized) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized: Invalid deploy token or webhook signature.',
    ], JSON_PRETTY_PRINT);
    exit;
}

// 2. Jika dari GitHub Webhook, pastikan branch yang di-push adalah 'main'
if ($rawPayload) {
    $payloadData = json_decode($rawPayload, true);
    if (isset($payloadData['ref']) && $payloadData['ref'] !== 'refs/heads/main') {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'ignored',
            'message' => 'Ignored: Push was not to refs/heads/main branch.',
            'ref' => $payloadData['ref'],
        ], JSON_PRETTY_PRINT);
        exit;
    }
}

// 3. Masuk ke folder root proyek Laravel
$projectDir = dirname(__DIR__);
if (!is_dir($projectDir) || !chdir($projectDir)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to change directory to project root: ' . $projectDir,
    ], JSON_PRETTY_PRINT);
    exit;
}

// 4. Eksekusi rangkaian perintah deployment
$commands = [
    'git fetch origin main',
    'git reset --hard origin/main',
    'php public/update_db.php',
];

$outputLog = [];
$startTime = microtime(true);

foreach ($commands as $cmd) {
    $cmdOutput = [];
    $exitCode = 0;
    exec($cmd . ' 2>&1', $cmdOutput, $exitCode);
    $outputLog[] = [
        'command' => $cmd,
        'exit_code' => $exitCode,
        'output' => implode("\n", $cmdOutput),
    ];
}

$duration = round(microtime(true) - $startTime, 2);

// 5. Kembalikan Respon
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'timestamp' => date('Y-m-d H:i:s'),
    'duration_seconds' => $duration,
    'message' => 'EduGen deployment executed successfully via Webhook!',
    'log' => $outputLog,
], JSON_PRETTY_PRINT);
