<?php

declare(strict_types=1);

/**
 * EduGen background deployment worker.
 *
 * This file is intentionally outside public/. It may only run through PHP CLI.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

set_time_limit(0);

$projectDir = __DIR__;
$queueDir = $projectDir . '/storage/app/deploy';
$pendingFile = $queueDir . '/pending.json';
$logFile = $projectDir . '/storage/logs/deploy.log';
$lockFile = $queueDir . '/worker.lock';

if (!is_dir($queueDir) && !mkdir($queueDir, 0750, true) && !is_dir($queueDir)) {
    fwrite(STDERR, "Unable to create deployment queue directory.\n");
    exit(1);
}

function deployLog(string $logFile, string $message, array $context = []): void
{
    $line = sprintf('[%s] %s', date('Y-m-d H:i:s'), $message);
    if ($context !== []) {
        $encoded = json_encode($context, JSON_UNESCAPED_SLASHES);
        $line .= ' ' . ($encoded === false ? '{"log_error":true}' : $encoded);
    }

    file_put_contents($logFile, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function envValue(string $envFile, string $key): ?string
{
    if (!is_readable($envFile)) {
        return null;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return null;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_starts_with($line, $key . '=')) {
            continue;
        }

        return trim(trim(substr($line, strlen($key) + 1)), "\"'");
    }

    return null;
}

function runCommand(string $name, string $command, string $projectDir, string $logFile): bool
{
    $output = [];
    $exitCode = 0;
    $startedAt = microtime(true);

    exec('cd ' . escapeshellarg($projectDir) . ' && ' . $command . ' 2>&1', $output, $exitCode);

    deployLog($logFile, 'step', [
        'name' => $name,
        'exit_code' => $exitCode,
        'duration_seconds' => round(microtime(true) - $startedAt, 2),
        'output' => substr(implode("\n", $output), 0, 12000),
    ]);

    return $exitCode === 0;
}

function backupSqliteDatabase(string $projectDir, string $commit, string $logFile): bool
{
    $envFile = $projectDir . '/.env';
    $connection = envValue($envFile, 'DB_CONNECTION') ?: 'sqlite';
    if ($connection !== 'sqlite') {
        deployLog($logFile, 'database_backup_skipped', ['connection' => $connection]);
        return true;
    }

    $configuredPath = envValue($envFile, 'DB_DATABASE');
    $databasePath = $configuredPath ?: $projectDir . '/database/database.sqlite';
    $isAbsolute = str_starts_with($databasePath, '/')
        || preg_match('/^[a-zA-Z]:[\\\\\/]/', $databasePath) === 1;
    if (!$isAbsolute) {
        $databasePath = $projectDir . '/' . ltrim($databasePath, '/\\');
    }

    if (!is_file($databasePath)) {
        deployLog($logFile, 'database_backup_failed', [
            'message' => 'SQLite database file was not found.',
            'database' => $databasePath,
        ]);
        return false;
    }

    $backupDir = $projectDir . '/storage/app/deploy/backups';
    if (!is_dir($backupDir) && !mkdir($backupDir, 0750, true) && !is_dir($backupDir)) {
        deployLog($logFile, 'database_backup_failed', ['message' => 'Unable to create backup directory.']);
        return false;
    }

    $backupPath = sprintf(
        '%s/database-%s-%s.sqlite',
        $backupDir,
        date('Ymd-His'),
        substr($commit, 0, 12)
    );

    if (!copy($databasePath, $backupPath)) {
        deployLog($logFile, 'database_backup_failed', ['message' => 'Unable to copy SQLite database.']);
        return false;
    }

    deployLog($logFile, 'database_backup_created', [
        'file' => $backupPath,
        'size_bytes' => filesize($backupPath),
    ]);

    return true;
}

$lockHandle = fopen($lockFile, 'c');
if ($lockHandle === false) {
    deployLog($logFile, 'worker_error', ['message' => 'Unable to open deployment lock.']);
    exit(1);
}

if (!flock($lockHandle, LOCK_EX | LOCK_NB)) {
    // An active worker will consume pending.json after its current deployment.
    fclose($lockHandle);
    exit(0);
}

$phpBinary = envValue($projectDir . '/.env', 'DEPLOY_PHP_BINARY') ?: 'php';
$composerBinary = envValue($projectDir . '/.env', 'DEPLOY_COMPOSER_BINARY') ?: 'composer';
$composerHome = envValue($projectDir . '/.env', 'DEPLOY_COMPOSER_HOME')
    ?: $queueDir . '/composer-home';
if (!is_dir($composerHome) && !mkdir($composerHome, 0750, true) && !is_dir($composerHome)) {
    deployLog($logFile, 'worker_error', ['message' => 'Unable to create Composer home directory.']);
    flock($lockHandle, LOCK_UN);
    fclose($lockHandle);
    exit(1);
}

// Web-server background processes commonly have no HOME. Composer only needs
// its own writable home directory, so keep it isolated inside deployment data.
putenv('COMPOSER_HOME=' . $composerHome);
$_ENV['COMPOSER_HOME'] = $composerHome;
$_SERVER['COMPOSER_HOME'] = $composerHome;

$php = escapeshellarg($phpBinary);
$composer = escapeshellarg($composerBinary);
$processed = 0;
$workerFailed = false;

while (is_file($pendingFile) && $processed < 10) {
    $rawRequest = file_get_contents($pendingFile);
    $request = $rawRequest === false ? null : json_decode($rawRequest, true);

    if (!is_array($request) || !preg_match('/^[a-f0-9]{40}$/', (string) ($request['commit'] ?? ''))) {
        deployLog($logFile, 'request_rejected', ['message' => 'Invalid queued deployment request.']);
        @unlink($pendingFile);
        $workerFailed = true;
        break;
    }

    $commit = (string) $request['commit'];
    $deliveryId = (string) ($request['delivery_id'] ?? '');
    @unlink($pendingFile);
    $processed++;

    deployLog($logFile, 'deployment_started', [
        'commit' => $commit,
        'delivery_id' => $deliveryId,
    ]);

    $startedAt = microtime(true);
    $maintenanceEnabled = false;
    $success = runCommand('fetch', 'git fetch --prune origin main', $projectDir, $logFile);

    if ($success) {
        $maintenanceEnabled = runCommand(
            'maintenance-on',
            $php . ' artisan down --retry=60 --refresh=15',
            $projectDir,
            $logFile
        );
        $success = $maintenanceEnabled;
    }

    if ($success) {
        $success = backupSqliteDatabase($projectDir, $commit, $logFile);
    }

    $commands = [
        ['checkout', 'git reset --hard ' . escapeshellarg($commit)],
        ['dependencies', $composer . ' install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress'],
        ['migrations', $php . ' artisan migrate --force --no-interaction'],
        ['cache-clear', $php . ' artisan optimize:clear'],
        ['config-cache', $php . ' artisan config:cache'],
        ['route-cache', $php . ' artisan route:cache'],
        ['view-cache', $php . ' artisan view:cache'],
    ];

    foreach ($commands as [$name, $command]) {
        if (!$success) {
            break;
        }
        $success = runCommand($name, $command, $projectDir, $logFile);
    }

    $headOutput = [];
    $headExitCode = 0;
    exec('cd ' . escapeshellarg($projectDir) . ' && git rev-parse HEAD 2>&1', $headOutput, $headExitCode);
    $deployedCommit = $headExitCode === 0 ? trim(implode("\n", $headOutput)) : '';
    if ($success && !hash_equals($commit, $deployedCommit)) {
        $success = false;
        deployLog($logFile, 'step', [
            'name' => 'verify-commit',
            'exit_code' => 1,
            'output' => 'Deployed commit does not match the queued commit.',
        ]);
    }

    if ($maintenanceEnabled) {
        $siteRestored = runCommand('maintenance-off', $php . ' artisan up', $projectDir, $logFile);
        $success = $success && $siteRestored;
    }

    deployLog($logFile, $success ? 'deployment_succeeded' : 'deployment_failed', [
        'commit' => $deployedCommit,
        'expected_commit' => $commit,
        'duration_seconds' => round(microtime(true) - $startedAt, 2),
    ]);

    if (!$success) {
        $workerFailed = true;
        break;
    }
}

flock($lockHandle, LOCK_UN);
fclose($lockHandle);

exit($workerFailed ? 1 : 0);
