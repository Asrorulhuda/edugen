<?php

namespace App\Services\AI\Adapters;

use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GrokAdapter implements AiProviderInterface
{
    public function getName(): string
    {
        return 'GROK';
    }

    public function isConfigured(): bool
    {
        return !empty(config('ai.providers.grok.api_key'));
    }

    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse
    {
        $apiKey = config('ai.providers.grok.api_key');
        $model = $options['model'] ?? config('ai.providers.grok.model', 'grok-2-latest');
        $baseUrl = config('ai.providers.grok.base_url', 'https://api.x.ai/v1');
        $temperature = $options['temperature'] ?? config('ai.providers.grok.temperature', 0.4);

        if (!$apiKey) {
            throw new RuntimeException('Grok/xAI API key is not configured.');
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
            'max_tokens' => $options['max_tokens'] ?? config('ai.providers.grok.max_tokens', 4096),
        ];

        $startTime = microtime(true);

        $response = Http::timeout(60)
            ->withToken($apiKey)
            ->post("{$baseUrl}/chat/completions", $payload);

        $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

        if (!$response->successful()) {
            $err = $response->json('error') ?? $response->json('error.message') ?? $response->body();
            throw new RuntimeException("Grok API error ({$response->status()}): " . (is_string($err) ? $err : json_encode($err)));
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
        $systemWithJsonInstruction = $systemPrompt . "\n\nPENTING: Berikan output HANYA berupa JSON valid. Jangan berikan teks pembuka atau penutup.";
        $response = $this->generate($systemWithJsonInstruction, $userPrompt, $options);

        return $response->json();
    }
}
