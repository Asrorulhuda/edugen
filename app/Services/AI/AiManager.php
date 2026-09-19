<?php

namespace App\Services\AI;

use App\Models\AiGenerationLog;
use App\Models\AiProviderSetting;
use App\Services\AI\Adapters\DeepSeekAdapter;
use App\Services\AI\Adapters\GeminiAdapter;
use App\Services\AI\Adapters\GrokAdapter;
use App\Services\AI\Adapters\MockAdapter;
use App\Services\AI\Adapters\OpenRouterAdapter;
use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;
use App\Services\TenantContext;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Throwable;

class AiManager
{
    /**
     * @var array<string, AiProviderInterface>
     */
    protected array $adapters = [];

    public function __construct(
        protected TenantContext $tenantContext
    ) {
        $this->syncDbSettings();

        $this->adapters = [
            'gemini' => new GeminiAdapter(),
            'openrouter' => new OpenRouterAdapter('openrouter', 'OPENROUTER (Key 1)'),
            'openrouter_secondary' => new OpenRouterAdapter('openrouter_secondary', 'OPENROUTER (Key 2)'),
            'mock' => new MockAdapter(),
        ];
    }

    /**
     * Sync database settings into Laravel runtime config
     */
    public function syncDbSettings(): void
    {
        try {
            if (!Schema::hasTable('ai_provider_settings')) {
                return;
            }

            $settings = AiProviderSetting::all();
            foreach ($settings as $setting) {
                if (!empty($setting->api_key)) {
                    config(["ai.providers.{$setting->provider}.api_key" => $setting->api_key]);
                }
                if (!empty($setting->model)) {
                    config(["ai.providers.{$setting->provider}.model" => $setting->model]);
                }
                if (!empty($setting->base_url)) {
                    config(["ai.providers.{$setting->provider}.base_url" => $setting->base_url]);
                }
                config(["ai.providers.{$setting->provider}.is_active" => $setting->is_active]);

                if ($setting->is_default && $setting->is_active) {
                    config(['ai.default' => $setting->provider]);
                }
            }
        } catch (Throwable $e) {
            // Graceful fallback if database connection isn't available yet
        }
    }

    /**
     * Resolve provider adapter by key with automatic default resolution
     */
    public function provider(?string $name = null): AiProviderInterface
    {
        $this->syncDbSettings();

        $trimmed = strtolower(trim($name ?? ''));
        if ($trimmed === '' || $trimmed === 'auto' || $trimmed === 'null') {
            $key = strtolower(trim(config('ai.default', 'gemini')));
        } else {
            $key = $trimmed;
        }

        if (config('ai.mock_mode', false)) {
            return $this->adapters['mock'];
        }

        if (isset($this->adapters[$key]) && $this->adapters[$key]->isConfigured()) {
            return $this->adapters[$key];
        }

        // Fallback chain: check other configured providers
        $fallbackChain = ['gemini', 'openrouter', 'openrouter_secondary'];
        foreach ($fallbackChain as $fallbackKey) {
            if (isset($this->adapters[$fallbackKey]) && $this->adapters[$fallbackKey]->isConfigured()) {
                return $this->adapters[$fallbackKey];
            }
        }

        if ($key === 'mock') {
            return $this->adapters['mock'];
        }

        throw new RuntimeException('Tidak ada AI provider aktif yang memiliki API key. Atur provider di Super Admin > Pengaturan AI atau aktifkan AI_MOCK_MODE hanya untuk pengembangan.');
    }

    /**
     * Helper to map provider response name back to adapter key
     */
    protected function resolveAdapterKey(string $providerName): string
    {
        $upper = strtoupper($providerName);
        if (str_contains($upper, 'GEMINI')) {
            return 'gemini';
        }
        if (str_contains($upper, 'KEY 2') || str_contains($upper, 'SECONDARY')) {
            return 'openrouter_secondary';
        }
        if (str_contains($upper, 'OPENROUTER')) {
            return 'openrouter';
        }
        return 'gemini';
    }

    /**
     * Generate content with automatic logging and metrics
     */
    public function generate(
        string $systemPrompt,
        string $userPrompt,
        string $featureType = 'GENERAL',
        ?string $providerName = null,
        array $options = []
    ): AiResponse {
        $adapter = $this->provider($providerName);
        $tenantId = $this->tenantContext->id();
        $userId = auth()->id();
        $startTime = microtime(true);

        try {
            $response = $adapter->generate($systemPrompt, $userPrompt, $options);

            // Log successful generation
            AiGenerationLog::create([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'feature_type' => $featureType,
                'provider' => $response->provider,
                'model_name' => $response->model,
                'prompt_tokens' => $response->promptTokens,
                'completion_tokens' => $response->completionTokens,
                'total_tokens' => $response->totalTokens,
                'latency_ms' => $response->latencyMs,
                'status' => 'SUCCESS',
                'metadata' => $response->metadata,
            ]);

            // Consume 1 AI quota unit from the tenant's active subscription
            $this->tenantContext->consumeAiQuota();

            return $response;
        } catch (Throwable $e) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

            AiGenerationLog::create([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'feature_type' => $featureType,
                'provider' => $adapter->getName(),
                'model_name' => $options['model'] ?? 'unknown',
                'prompt_tokens' => 0,
                'completion_tokens' => 0,
                'total_tokens' => 0,
                'latency_ms' => $latencyMs,
                'status' => 'FAILED',
                'error_message' => $e->getMessage(),
            ]);

            Log::error("EduGen AI Generation Failed [{$adapter->getName()}]: " . $e->getMessage());

            // Multi-provider live failover: try next configured provider before failing
            $candidateProviders = ['gemini', 'openrouter', 'openrouter_secondary'];
            foreach ($candidateProviders as $candidateKey) {
                if (isset($this->adapters[$candidateKey]) 
                    && $this->adapters[$candidateKey] !== $adapter 
                    && $this->adapters[$candidateKey]->isConfigured()
                ) {
                    Log::info("Failover: Attempting alternate AI provider [{$candidateKey}]...");
                    try {
                        $failoverAdapter = $this->adapters[$candidateKey];
                        $failoverResponse = $failoverAdapter->generate($systemPrompt, $userPrompt, $options);

                        AiGenerationLog::create([
                            'tenant_id' => $tenantId,
                            'user_id' => $userId,
                            'feature_type' => $featureType,
                            'provider' => $failoverResponse->provider . " (Failover)",
                            'model_name' => $failoverResponse->model,
                            'prompt_tokens' => $failoverResponse->promptTokens,
                            'completion_tokens' => $failoverResponse->completionTokens,
                            'total_tokens' => $failoverResponse->totalTokens,
                            'latency_ms' => $failoverResponse->latencyMs,
                            'status' => 'SUCCESS',
                            'metadata' => array_merge($failoverResponse->metadata, ['failover_from' => $adapter->getName()]),
                        ]);

                        // Consume 1 AI quota on failover success too
                        $this->tenantContext->consumeAiQuota();

                        return $failoverResponse;
                    } catch (Throwable $fe) {
                        Log::warning("Failover attempt on [{$candidateKey}] also failed: " . $fe->getMessage());
                    }
                }
            }

            // Only use mock if explicitly enabled in config
            if (config('ai.mock_mode', false)) {
                Log::warning("Falling back to MOCK engine because mock_mode is explicitly enabled.");
                return $this->adapters['mock']->generate($systemPrompt, $userPrompt, $options);
            }

            throw new RuntimeException("Koneksi ke AI Provider ({$adapter->getName()}) gagal: " . $e->getMessage() . ". Pastikan API Key telah terisi dan valid di menu Super Admin > Pengaturan AI.");
        }
    }

    /**
     * Generate structured JSON with automatic multi-provider live failover
     */
    public function generateJson(
        string $systemPrompt,
        string $userPrompt,
        string $featureType = 'GENERAL',
        ?string $providerName = null,
        array $options = []
    ): array {
        $response = $this->generate($systemPrompt, $userPrompt, $featureType, $providerName, $options);

        $data = $response->json();

        if (!empty($data)) {
            return $data;
        }

        // Live failover if primary provider returned empty or unparseable JSON
        Log::warning("AI Provider [{$response->provider}] mengembalikan JSON kosong/tidak valid untuk [{$featureType}]. Melakukan failover otomatis...");

        $activeKey = $this->resolveAdapterKey($response->provider);
        $candidateKeys = ['gemini', 'openrouter', 'openrouter_secondary'];

        foreach ($candidateKeys as $candKey) {
            if ($candKey === $activeKey) {
                continue;
            }
            if (!isset($this->adapters[$candKey]) || !$this->adapters[$candKey]->isConfigured()) {
                continue;
            }

            try {
                Log::info("Failover JSON: Mencoba provider cadangan [{$candKey}]...");
                $failoverAdapter = $this->adapters[$candKey];
                $failoverResponse = $failoverAdapter->generate($systemPrompt, $userPrompt, $options);
                $failoverData = $failoverResponse->json();

                if (!empty($failoverData)) {
                    Log::info("Failover JSON: Berhasil mendapatkan respons JSON valid dari [{$candKey}].");

                    AiGenerationLog::create([
                        'tenant_id' => $this->tenantContext->id(),
                        'user_id' => auth()->id(),
                        'feature_type' => $featureType,
                        'provider' => $failoverResponse->provider . " (JSON Failover)",
                        'model_name' => $failoverResponse->model,
                        'prompt_tokens' => $failoverResponse->promptTokens,
                        'completion_tokens' => $failoverResponse->completionTokens,
                        'total_tokens' => $failoverResponse->totalTokens,
                        'latency_ms' => $failoverResponse->latencyMs,
                        'status' => 'SUCCESS',
                        'metadata' => array_merge($failoverResponse->metadata, ['failover_from' => $response->provider]),
                    ]);

                    return $failoverData;
                }
            } catch (Throwable $fe) {
                Log::warning("Failover JSON pada [{$candKey}] gagal: " . $fe->getMessage());
            }
        }

        if (config('ai.mock_mode', false)) {
            Log::warning("Fallback ke MOCK engine karena semua provider menghasilkan JSON tidak valid.");
            return $this->adapters['mock']->generateJson($systemPrompt, $userPrompt, $options);
        }

        throw new RuntimeException("AI Provider {$response->provider} mengembalikan format yang tidak dapat diproses. Silakan klik 'Coba Lagi'.");
    }

    /**
     * Get provider availability status for UI dropdowns (dictionary)
     */
    public function getProviderStatuses(): array
    {
        $this->syncDbSettings();

        return [
            'gemini' => [
                'name' => 'Google Gemini (' . config('ai.providers.gemini.model', 'gemini-2.5-flash') . ')',
                'is_configured' => $this->adapters['gemini']->isConfigured(),
            ],
            'openrouter' => [
                'name' => 'OpenRouter Key 1 (' . config('ai.providers.openrouter.model', 'nvidia/nemotron-3-ultra-550b-a55b:free') . ')',
                'is_configured' => $this->adapters['openrouter']->isConfigured(),
            ],
            'openrouter_secondary' => [
                'name' => 'OpenRouter Key 2 (' . config('ai.providers.openrouter_secondary.model', 'nvidia/nemotron-3-ultra-550b-a55b:free') . ')',
                'is_configured' => $this->adapters['openrouter_secondary']->isConfigured(),
            ],
        ];
    }

    /**
     * Get provider list formatted uniformly for UI dropdowns (array of objects)
     */
    public function getProviderStatusesList(): array
    {
        $this->syncDbSettings();

        $defaultProvider = config('ai.default', 'openrouter');

        return [
            [
                'key' => 'openrouter',
                'name' => 'OpenRouter AI (Key 1 - Utama)',
                'model' => config('ai.providers.openrouter.model', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
                'is_configured' => $this->adapters['openrouter']->isConfigured(),
                'is_default' => $defaultProvider === 'openrouter',
            ],
            [
                'key' => 'openrouter_secondary',
                'name' => 'OpenRouter AI (Key 2 - Cadangan)',
                'model' => config('ai.providers.openrouter_secondary.model', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
                'is_configured' => $this->adapters['openrouter_secondary']->isConfigured(),
                'is_default' => $defaultProvider === 'openrouter_secondary',
            ],
            [
                'key' => 'gemini',
                'name' => 'Google Gemini AI',
                'model' => config('ai.providers.gemini.model', 'gemini-2.5-flash'),
                'is_configured' => $this->adapters['gemini']->isConfigured(),
                'is_default' => $defaultProvider === 'gemini',
            ],
        ];
    }

    /**
     * Live test connection for a specific provider
     */
    public function testConnection(string $provider, ?string $apiKey = null, ?string $model = null): array
    {
        $key = strtolower(trim($provider));
        $dbSetting = AiProviderSetting::where('provider', $key)->first();

        $activeApiKey = $apiKey ?: ($dbSetting?->api_key ?: config("ai.providers.{$key}.api_key"));
        $activeModel = $model ?: ($dbSetting?->model ?: config("ai.providers.{$key}.model"));
        $baseUrl = $dbSetting?->base_url ?: config("ai.providers.{$key}.base_url");

        if (empty($activeApiKey)) {
            return [
                'success' => false,
                'latency_ms' => 0,
                'message' => "API Key untuk provider {$key} belum diisi.",
            ];
        }

        $startTime = microtime(true);

        try {
            if ($key === 'gemini') {
                $activeModel = $activeModel ?: 'gemini-2.5-flash';
                $url = "{$baseUrl}/models/{$activeModel}:generateContent?key={$activeApiKey}";
                $response = Http::timeout(15)->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => 'Ping. Jawab dengan satu kata: OK']]],
                    ],
                ]);
            } else {
                // OpenAI compatible format (OpenRouter Key 1 & 2)
                $url = "{$baseUrl}/chat/completions";
                $httpClient = Http::timeout(20)->withToken($activeApiKey);

                if (in_array($key, ['openrouter', 'openrouter_secondary'])) {
                    $httpClient = $httpClient->withHeaders([
                        'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                        'X-Title' => 'EduGen KBC Platform',
                    ]);
                }

                $response = $httpClient->post($url, [
                    'model' => $activeModel,
                    'messages' => [
                        ['role' => 'user', 'content' => 'Ping. Jawab satu kata: OK'],
                    ],
                    'max_tokens' => 15,
                ]);
            }

            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $status = 'SUCCESS';
                $msg = "Koneksi berhasil! Model: {$activeModel} (Respon: {$latencyMs}ms)";
                
                if ($dbSetting) {
                    $dbSetting->update([
                        'last_tested_at' => now(),
                        'last_test_status' => $status,
                        'last_test_message' => $msg,
                    ]);
                }

                return [
                    'success' => true,
                    'latency_ms' => $latencyMs,
                    'message' => $msg,
                    'status_code' => $response->status(),
                ];
            } else {
                $status = 'FAILED';
                $errorBody = $response->json('error.message') 
                    ?? $response->json('error') 
                    ?? $response->body();

                if (is_array($errorBody)) {
                    $errorBody = json_encode($errorBody);
                }

                $msg = "Koneksi gagal ({$response->status()}): " . substr((string) $errorBody, 0, 200);

                if ($dbSetting) {
                    $dbSetting->update([
                        'last_tested_at' => now(),
                        'last_test_status' => $status,
                        'last_test_message' => $msg,
                    ]);
                }

                return [
                    'success' => false,
                    'latency_ms' => $latencyMs,
                    'message' => $msg,
                    'status_code' => $response->status(),
                ];
            }
        } catch (Throwable $e) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            $msg = "Error jaringan/koneksi: " . $e->getMessage();

            if ($dbSetting) {
                $dbSetting->update([
                    'last_tested_at' => now(),
                    'last_test_status' => 'FAILED',
                    'last_test_message' => $msg,
                ]);
            }

            return [
                'success' => false,
                'latency_ms' => $latencyMs,
                'message' => $msg,
            ];
        }
    }
}
