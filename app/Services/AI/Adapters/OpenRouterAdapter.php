<?php

namespace App\Services\AI\Adapters;

use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenRouterAdapter implements AiProviderInterface
{
    public function __construct(
        protected string $configKey = 'openrouter',
        protected string $name = 'OPENROUTER'
    ) {}

    public function getName(): string
    {
        return $this->name;
    }

    public function isConfigured(): bool
    {
        return !empty(config("ai.providers.{$this->configKey}.api_key"));
    }

    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse
    {
        $apiKey = config("ai.providers.{$this->configKey}.api_key");
        $model = $options['model'] ?? config("ai.providers.{$this->configKey}.model", 'nvidia/nemotron-3-ultra-550b-a55b:free');
        $baseUrl = config("ai.providers.{$this->configKey}.base_url", 'https://openrouter.ai/api/v1');
        $temperature = $options['temperature'] ?? config("ai.providers.{$this->configKey}.temperature", 0.4);

        if (!$apiKey) {
            throw new RuntimeException("OpenRouter API key ({$this->configKey}) belum diatur.");
        }

        $startTime = microtime(true);

        $messages = [];
        if (!empty($systemPrompt)) {
            $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        }
        $messages[] = ['role' => 'user', 'content' => $userPrompt];

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $options['max_tokens'] ?? config('ai.providers.openrouter.max_tokens', 8192),
            'response_format' => ['type' => 'json_object'],
        ];

        $candidateModels = array_unique(array_filter([
            $model,
            'google/gemma-4-26b-a4b-it:free',
            'meta-llama/llama-3.3-70b-instruct:free',
            'mistralai/mistral-7b-instruct:free',
        ]));

        $lastException = null;
        $response = null;
        $usedModel = $model;

        foreach ($candidateModels as $candidate) {
            $payload['model'] = $candidate;
            $usedModel = $candidate;

            try {
                $response = Http::timeout(120)
                    ->withToken($apiKey)
                    ->withHeaders([
                        'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                        'X-Title' => 'EduGen KBC Platform',
                    ])
                    ->post("{$baseUrl}/chat/completions", $payload);

                // Fallback retry if candidate does not accept system role
                if (!$response->successful() && !empty($systemPrompt) && str_contains(strtolower($response->body()), 'system')) {
                    $combinedUserPrompt = "[Instruksi Sistem]\n{$systemPrompt}\n\n[Permintaan]\n{$userPrompt}";
                    $retryPayload = $payload;
                    $retryPayload['messages'] = [
                        ['role' => 'user', 'content' => $combinedUserPrompt],
                    ];

                    $response = Http::timeout(120)
                        ->withToken($apiKey)
                        ->withHeaders([
                            'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                            'X-Title' => 'EduGen KBC Platform',
                        ])
                        ->post("{$baseUrl}/chat/completions", $retryPayload);
                }

                if ($response->successful()) {
                    break;
                }

                $lastException = new RuntimeException("OpenRouter [{$candidate}] API error ({$response->status()}): " . $response->body());
            } catch (\Throwable $e) {
                $lastException = $e;
                continue;
            }
        }

        $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

        if (!$response || !$response->successful()) {
            throw $lastException ?? new RuntimeException("OpenRouter API calls failed across all candidate models.");
        }

        $data = $response->json();
        $choice = $data['choices'][0]['message'] ?? [];
        $text = $choice['content'] ?? '';

        // If content is empty but model provided reasoning text (e.g. reasoning LLMs)
        if (empty(trim($text)) && !empty($choice['reasoning'])) {
            $text = $choice['reasoning'];
        }

        $usage = $data['usage'] ?? [];

        return new AiResponse(
            content: $text,
            provider: $this->getName(),
            model: $usedModel,
            promptTokens: $usage['prompt_tokens'] ?? 0,
            completionTokens: $usage['completion_tokens'] ?? 0,
            totalTokens: $usage['total_tokens'] ?? 0,
            latencyMs: $latencyMs,
            metadata: [
                'finish_reason' => $data['choices'][0]['finish_reason'] ?? null,
            ]
        );
    }

    public function generateJson(string $systemPrompt, string $userPrompt, array $options = []): array
    {
        $systemWithJsonInstruction = $systemPrompt . "\n\nPENTING: Berikan output HANYA berupa JSON valid. Jangan berikan teks pembuka atau penutup.";
        $response = $this->generate($systemWithJsonInstruction, $userPrompt, $options);

        return $response->json();
    }
}
