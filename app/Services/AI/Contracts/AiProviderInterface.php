<?php

namespace App\Services\AI\Contracts;

use App\Services\AI\DTOs\AiResponse;

interface AiProviderInterface
{
    /**
     * Get unique provider key name (GEMINI, GROK, DEEPSEEK, OPENROUTER, MOCK)
     */
    public function getName(): string;

    /**
     * Check if this provider has valid credentials/configuration
     */
    public function isConfigured(): bool;

    /**
     * Execute text completion with system prompt and user prompt
     */
    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse;

    /**
     * Execute structured JSON generation
     */
    public function generateJson(string $systemPrompt, string $userPrompt, array $options = []): array;
}
