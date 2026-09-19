<?php

namespace Database\Seeders;

use App\Models\AiProviderSetting;
use Illuminate\Database\Seeder;

class AiProviderSettingSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'provider' => 'gemini',
                'name' => 'Google Gemini AI',
                'api_key' => env('GEMINI_API_KEY'),
                'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
                'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
                'is_active' => true,
                'is_default' => true,
                'temperature' => 0.40,
                'max_tokens' => 4096,
            ],
            [
                'provider' => 'openrouter',
                'name' => 'OpenRouter AI (Key 1 - Utama)',
                'api_key' => env('OPENROUTER_API_KEY'),
                'model' => env('OPENROUTER_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
                'base_url' => 'https://openrouter.ai/api/v1',
                'is_active' => true,
                'is_default' => false,
                'temperature' => 0.40,
                'max_tokens' => 4096,
            ],
            [
                'provider' => 'openrouter_secondary',
                'name' => 'OpenRouter AI (Key 2 - Cadangan)',
                'api_key' => env('OPENROUTER_SECONDARY_API_KEY'),
                'model' => env('OPENROUTER_SECONDARY_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
                'base_url' => 'https://openrouter.ai/api/v1',
                'is_active' => true,
                'is_default' => false,
                'temperature' => 0.40,
                'max_tokens' => 4096,
            ],
        ];

        foreach ($providers as $item) {
            $existing = AiProviderSetting::where('provider', $item['provider'])->first();

            if ($existing) {
                $updateData = [
                    'name' => $item['name'],
                    'model' => $existing->model ?: $item['model'],
                    'base_url' => $item['base_url'],
                    'is_active' => $existing->is_active,
                    'is_default' => $existing->is_default,
                    'temperature' => $item['temperature'],
                    'max_tokens' => $item['max_tokens'],
                ];
                if (!empty($item['api_key'])) {
                    $updateData['api_key'] = $item['api_key'];
                }
                $existing->update($updateData);
            } else {
                AiProviderSetting::create($item);
            }
        }

        // Remove deprecated providers
        AiProviderSetting::whereIn('provider', ['grok', 'deepseek'])->delete();
    }
}
