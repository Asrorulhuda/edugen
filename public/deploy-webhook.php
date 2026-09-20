<?php

declare(strict_types=1);

/**
 * GitHub deployment webhook for EduGen.
 *
 * Required .env value:
 * DEPLOY_WEBHOOK_SECRET=<same value configured in GitHub webhook>
 *
 * Optional hardening:
 * DEPLOY_GITHUB_REPOSITORY=owner/repository
 */

header('Content-Type: application/json; charset=utf-8');

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
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

        $value = trim(substr($line, strlen($key) + 1));

        return trim($value, "\"'");
    }

    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    respond(405, ['status' => 'error', 'message' => 'Method not allowed.']);
}

$projectDir = dirname(__DIR__);
$secret = envValue($projectDir . '/.env', 'DEPLOY_WEBHOOK_SECRET');

if ($secret === null || strlen($secret) < 32) {
    respond(503, [
        'status' => 'error',
        'message' => 'Deployment webhook is not configured securely.',
    ]);
}

$rawPayload = file_get_contents('php://input') ?: '';
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$manualToken = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
$signatureIsValid = $signature !== ''
    && hash_equals('sha256=' . hash_hmac('sha256', $rawPayload, $secret), $signature);
$manualTokenIsValid = $manualToken !== '' && hash_equals($secret, $manualToken);

if (!$signatureIsValid && !$manualTokenIsValid) {
    respond(403, ['status' => 'error', 'message' => 'Invalid webhook signature.']);
}

$event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? '';
$payload = $rawPayload !== '' ? json_decode($rawPayload, true) : [];

if ($rawPayload !== '' && !is_array($payload)) {
    respond(400, ['status' => 'error', 'message' => 'Invalid JSON payload.']);
}

if ($event === 'ping') {
    respond(200, ['status' => 'success', 'message' => 'Webhook is configured.']);
}

if ($signatureIsValid && $event !== 'push') {
    respond(202, ['status' => 'ignored', 'message' => 'Only push events trigger deployment.']);
}

if (isset($payload['ref']) && $payload['ref'] !== 'refs/heads/main') {
    respond(202, [
        'status' => 'ignored',
        'message' => 'Push was not for the main branch.',
        'ref' => $payload['ref'],
    ]);
}

$expectedRepository = envValue($projectDir . '/.env', 'DEPLOY_GITHUB_REPOSITORY');
$payloadRepository = $payload['repository']['full_name'] ?? null;
if ($expectedRepository && $payloadRepository && !hash_equals($expectedRepository, $payloadRepository)) {
    respond(403, ['status' => 'error', 'message' => 'Repository does not match deployment configuration.']);
}

if (!is_dir($projectDir . '/.git') || !chdir($projectDir)) {
    respond(500, ['status' => 'error', 'message' => 'Deployment directory is invalid.']);
}

if (!is_callable('exec')) {
    respond(500, ['status' => 'error', 'message' => 'Command execution is disabled on this server.']);
}

$lockHandle = fopen(sys_get_temp_dir() . '/edugen-deploy.lock', 'c');
if ($lockHandle === false || !flock($lockHandle, LOCK_EX | LOCK_NB)) {
    respond(409, ['status' => 'busy', 'message' => 'Another deployment is currently running.']);
}

$commands = [
    ['name' => 'fetch', 'command' => 'git fetch --prune origin main'],
    ['name' => 'checkout', 'command' => 'git reset --hard origin/main'],
    ['name' => 'dependencies', 'command' => 'composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress'],
    ['name' => 'application', 'command' => 'php public/update_db.php'],
];

$logs = [];
$startedAt = microtime(true);
$failed = false;

foreach ($commands as $step) {
    $output = [];
    $exitCode = 0;
    exec($step['command'] . ' 2>&1', $output, $exitCode);

    $logs[] = [
        'step' => $step['name'],
        'exit_code' => $exitCode,
        'output' => substr(implode("\n", $output), 0, 12000),
    ];

    if ($exitCode !== 0) {
        $failed = true;
        break;
    }
}

$expectedCommit = $payload['after'] ?? null;
$commitOutput = [];
$commitExitCode = 0;
exec('git rev-parse HEAD 2>&1', $commitOutput, $commitExitCode);
$deployedCommit = $commitExitCode === 0 ? trim(implode("\n", $commitOutput)) : '';
if (!$failed && $commitExitCode !== 0) {
    $failed = true;
    $logs[] = [
        'step' => 'verify-commit',
        'exit_code' => $commitExitCode,
        'output' => substr(implode("\n", $commitOutput), 0, 12000),
    ];
}
if (!$failed && $expectedCommit && !hash_equals($expectedCommit, $deployedCommit)) {
    $failed = true;
    $logs[] = [
        'step' => 'verify-commit',
        'exit_code' => 1,
        'output' => 'Deployed commit does not match the GitHub push payload.',
    ];
}

flock($lockHandle, LOCK_UN);
fclose($lockHandle);

respond($failed ? 500 : 200, [
    'status' => $failed ? 'error' : 'success',
    'message' => $failed ? 'Deployment stopped because a step failed.' : 'Deployment completed successfully.',
    'commit' => $deployedCommit,
    'duration_seconds' => round(microtime(true) - $startedAt, 2),
    'log' => $logs,
]);
