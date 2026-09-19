<?php

namespace App\Http\Controllers\Admin\Ai;

use App\Http\Controllers\Controller;
use App\Models\AiGenerationLog;
use App\Models\AiProviderSetting;
use App\Services\AI\AiManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiSettingController extends Controller
{
    public function __construct(
        protected AiManager $aiManager
    ) {}

    /**
     * Display AI providers configuration page
     */
    public function index(): Response
    {
        $providers = AiProviderSetting::orderBy('id')->get();
        $recentLogs = AiGenerationLog::with('user:id,name,email')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/AiSettings/Index', [
            'providers' => $providers,
            'recentLogs' => $recentLogs,
            'defaultProvider' => config('ai.default', 'gemini'),
        ]);
    }

    /**
     * Update settings for an AI provider
     */
    public function update(Request $request, string $provider): RedirectResponse
    {
        $setting = AiProviderSetting::where('provider', $provider)->firstOrFail();

        $validated = $request->validate([
            'api_key' => ['nullable', 'string', 'max:500'],
            'model' => ['required', 'string', 'max:100'],
            'base_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'temperature' => ['numeric', 'min:0', 'max:1'],
            'max_tokens' => ['integer', 'min:256', 'max:16384'],
        ]);

        $setting->update($validated);

        if (!empty($validated['is_default']) && $validated['is_default'] == true) {
            AiProviderSetting::setDefault($provider);
        }

        // Resync runtime config
        $this->aiManager->syncDbSettings();

        return redirect()->back()->with('success', "Pengaturan provider {$setting->name} berhasil diperbarui.");
    }

    /**
     * Live test connection with provider API Key
     */
    public function test(Request $request, string $provider): JsonResponse
    {
        $apiKey = $request->input('api_key');
        $model = $request->input('model');

        $result = $this->aiManager->testConnection($provider, $apiKey, $model);

        return response()->json($result);
    }
}
