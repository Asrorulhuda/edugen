<?php

declare(strict_types=1);

/**
 * Fast GitHub webhook endpoint.
 *
 * This endpoint only authenticates and queues a deployment. The long-running
 * work is handled by deploy-worker.php so GitHub receives a response before
 * its HTTP timeout.
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

        return trim(trim(substr($line, strlen($key) + 1)), "\"'");
    }

    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    respond(405, ['status' => 'error', 'message' => 'Method not allowed.']);
}

$projectDir = dirname(__DIR__);
$envFile = $projectDir . '/.env';
$secret = envValue($envFile, 'DEPLOY_WEBHOOK_SECRET');

if ($secret === null || strlen($secret) < 32) {
    respond(503, [
        'status' => 'error',
        'message' => 'Deployment webhook is not configured securely.',
    ]);
}

$rawPayload = file_get_contents('php://input') ?: '';
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$signatureIsValid = $signature !== ''
    && hash_equals('sha256=' . hash_hmac('sha256', $rawPayload, $secret), $signature);

if (!$signatureIsValid) {
    respond(403, ['status' => 'error', 'message' => 'Invalid webhook signature.']);
}

$event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? '';
$deliveryId = $_SERVER['HTTP_X_GITHUB_DELIVERY'] ?? '';
$payload = json_decode($rawPayload, true);

if (!is_array($payload)) {
    respond(400, ['status' => 'error', 'message' => 'Invalid JSON payload.']);
}

if ($event === 'ping') {
    respond(200, ['status' => 'success', 'message' => 'Webhook is configured.']);
}

if ($event !== 'push') {
    respond(202, ['status' => 'ignored', 'message' => 'Only push events trigger deployment.']);
}

if (($payload['ref'] ?? '') !== 'refs/heads/main') {
    respond(202, [
        'status' => 'ignored',
        'message' => 'Push was not for the main branch.',
        'ref' => $payload['ref'] ?? null,
    ]);
}

$expectedRepository = envValue($envFile, 'DEPLOY_GITHUB_REPOSITORY');
$payloadRepository = $payload['repository']['full_name'] ?? '';
if ($expectedRepository && !hash_equals($expectedRepository, $payloadRepository)) {
    respond(403, ['status' => 'error', 'message' => 'Repository does not match deployment configuration.']);
}

$expectedCommit = strtolower((string) ($payload['after'] ?? ''));
if (!preg_match('/^[a-f0-9]{40}$/', $expectedCommit)) {
    respond(400, ['status' => 'error', 'message' => 'Push payload does not contain a valid commit.']);
}

if (!is_dir($projectDir . '/.git') || !is_file($projectDir . '/deploy-worker.php')) {
    respond(500, ['status' => 'error', 'message' => 'Deployment files are incomplete.']);
}

if (!is_callable('exec')) {
    respond(500, ['status' => 'error', 'message' => 'Command execution is disabled on this server.']);
}

$queueDir = $projectDir . '/storage/app/deploy';
if (!is_dir($queueDir) && !mkdir($queueDir, 0750, true) && !is_dir($queueDir)) {
    respond(500, ['status' => 'error', 'message' => 'Unable to create deployment queue directory.']);
}

$request = [
    'commit' => $expectedCommit,
    'delivery_id' => preg_replace('/[^a-zA-Z0-9-]/', '', $deliveryId),
    'repository' => $payloadRepository,
    'queued_at' => date(DATE_ATOM),
];
$pendingFile = $queueDir . '/pending.json';
$temporaryFile = $queueDir . '/pending.' . bin2hex(random_bytes(8)) . '.tmp';
$encodedRequest = json_encode($request, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

if ($encodedRequest === false || file_put_contents($temporaryFile, $encodedRequest, LOCK_EX) === false) {
    respond(500, ['status' => 'error', 'message' => 'Unable to write deployment request.']);
}

if (!rename($temporaryFile, $pendingFile)) {
    @unlink($temporaryFile);
    respond(500, ['status' => 'error', 'message' => 'Unable to queue deployment request.']);
}

$phpBinary = envValue($envFile, 'DEPLOY_PHP_BINARY') ?: 'php';
$workerCommand = sprintf(
    'nohup %s %s > /dev/null 2>&1 &',
    escapeshellarg($phpBinary),
    escapeshellarg($projectDir . '/deploy-worker.php')
);
$output = [];
$exitCode = 0;
exec($workerCommand, $output, $exitCode);

if ($exitCode !== 0) {
    respond(500, [
        'status' => 'error',
        'message' => 'Deployment was queued but the background worker could not be started.',
    ]);
}

respond(202, [
    'status' => 'queued',
    'message' => 'Deployment accepted and will continue in the background.',
    'commit' => $expectedCommit,
    'delivery_id' => $request['delivery_id'],
]);
