<?php

namespace App\Services\AI\Adapters;

use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class DeepSeekAdapter implements AiProviderInterface
{
    public function getName(): string
    {
        return 'DEEPSEEK';
    }

    public function isConfigured(): bool
    {
        return !empty(config('ai.providers.deepseek.api_key'));
    }

    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse
    {
        $apiKey = config('ai.providers.deepseek.api_key');
        $model = $options['model'] ?? config('ai.providers.deepseek.model', 'deepseek-chat');
        $baseUrl = config('ai.providers.deepseek.base_url', 'https://api.deepseek.com/v1');
        $temperature = $options['temperature'] ?? config('ai.providers.deepseek.temperature', 0.3);

        if (!$apiKey) {
            throw new RuntimeException('DeepSeek API key is not configured.');
        }

        $messages = [];
        if (!empty($systemPrompt)) {
            $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        }
        $messages[] = ['role' => 'user', 'content' => $userPrompt];

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $options['max_tokens'] ?? config('ai.providers.deepseek.max_tokens', 4096),
        ];

        $startTime = microtime(true);

        $response = Http::timeout(60)
            ->withToken($apiKey)
            ->post("{$baseUrl}/chat/completions", $payload);

        $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

        if (!$response->successful()) {
            throw new RuntimeException("DeepSeek API error ({$response->status()}): " . $response->body());
        }

        $data = $response->json();
        $text = $data['choices'][0]['message']['content'] ?? '';
        $usage = $data['usage'] ?? [];

        return new AiResponse(
            content: $text,
            provider: $this->getName(),
            model: $model,
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
        $systemWithJsonInstruction = $systemPrompt . "\n\nPENTING: Berikan respons HANYA dalam format JSON valid tanpa tanda markdown (```json).";
        $response = $this->generate($systemWithJsonInstruction, $userPrompt, $options);

        return $response->json();
    }
}
