<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | Supported: "gemini", "grok", "deepseek", "openrouter", "mock"
    |
    */
    'default' => env('AI_DEFAULT_PROVIDER', 'gemini'),

    /*
    |--------------------------------------------------------------------------
    | Mock / Development Mode
    |--------------------------------------------------------------------------
    |
    | When enabled or when provider API key is missing, system falls back to
    | high-fidelity realistic curriculum generator responses without failing.
    |
    */
    'mock_mode' => env('AI_MOCK_MODE', false),

    /*
    |--------------------------------------------------------------------------
    | Provider Configurations (3 Slots: Gemini, OpenRouter Key 1, OpenRouter Key 2)
    |--------------------------------------------------------------------------
    */
    'providers' => [
        'gemini' => [
            'name' => 'Google Gemini AI',
            'api_key' => env('GEMINI_API_KEY'),
            'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'temperature' => 0.4,
            'max_tokens' => 16384,
        ],

        'openrouter' => [
            'name' => 'OpenRouter AI (Key 1 - Utama)',
            'api_key' => env('OPENROUTER_API_KEY'),
            'model' => env('OPENROUTER_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
            'base_url' => 'https://openrouter.ai/api/v1',
            'temperature' => 0.4,
            'max_tokens' => 16384,
        ],

        'openrouter_secondary' => [
            'name' => 'OpenRouter AI (Key 2 - Cadangan)',
            'api_key' => env('OPENROUTER_SECONDARY_API_KEY'),
            'model' => env('OPENROUTER_SECONDARY_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
            'base_url' => 'https://openrouter.ai/api/v1',
            'temperature' => 0.4,
            'max_tokens' => 16384,
        ],
    ],
];
