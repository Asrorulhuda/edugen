<?php

namespace App\Services\AI\Adapters;

use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiAdapter implements AiProviderInterface
{
    public function getName(): string
    {
        return 'GEMINI';
    }

    public function isConfigured(): bool
    {
        return !empty(config('ai.providers.gemini.api_key'));
    }

    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse
    {
        $apiKey = config('ai.providers.gemini.api_key');
        $model = $options['model'] ?? config('ai.providers.gemini.model', 'gemini-2.5-flash');
        $baseUrl = config('ai.providers.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
        $temperature = $options['temperature'] ?? config('ai.providers.gemini.temperature', 0.4);

        if (!$apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $url = "{$baseUrl}/models/{$model}:generateContent?key={$apiKey}";

        $maxOutputTokens = (int) ($options['max_tokens'] ?? config('ai.providers.gemini.max_tokens', 16384));

        $generationConfig = [
            'temperature' => $temperature,
            'maxOutputTokens' => $maxOutputTokens,
            'responseMimeType' => 'application/json',
        ];

        // For Gemini 2.0/2.5 models, disable internal thinking overhead to maximize completion token capacity
        if (str_contains($model, '2.5') || str_contains($model, '2.0')) {
            $generationConfig['thinkingConfig'] = [
                'thinkingBudget' => $options['thinking_budget'] ?? 0,
            ];
        }

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $userPrompt],
                    ],
                ],
            ],
            'generationConfig' => $generationConfig,
        ];

        if (!empty($systemPrompt)) {
            $payload['systemInstruction'] = [
                'parts' => [
                    ['text' => $systemPrompt],
                ],
            ];
        }

        $startTime = microtime(true);

        $response = Http::timeout(90)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($url, $payload);

        $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

        if (!$response->successful()) {
            throw new RuntimeException("Gemini API error ({$response->status()}): " . $response->body());
        }

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $usage = $data['usageMetadata'] ?? [];

        return new AiResponse(
            content: $text,
            provider: $this->getName(),
            model: $model,
            promptTokens: $usage['promptTokenCount'] ?? 0,
            completionTokens: $usage['candidatesTokenCount'] ?? 0,
            totalTokens: $usage['totalTokenCount'] ?? 0,
            latencyMs: $latencyMs,
            metadata: [
                'finish_reason' => $data['candidates'][0]['finishReason'] ?? null,
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
