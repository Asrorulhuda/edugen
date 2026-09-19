<?php

namespace App\Http\Controllers\Admin\Billing;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminPlanController extends Controller
{
    /**
     * Display all subscription packages grouped by client category
     */
    public function index(): Response
    {
        $plans = SubscriptionPlan::withCount('tenantSubscriptions')
            ->orderBy('order_index')
            ->orderBy('id')
            ->get();

        $stats = [
            'total_plans' => $plans->count(),
            'active_plans' => $plans->where('is_active', true)->count(),
            'individual_plans' => $plans->where('client_model', 'INDIVIDUAL')->count(),
            'institution_plans' => $plans->where('client_model', 'INSTITUTION')->count(),
        ];

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created subscription plan
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:subscription_plans,slug'],
            'client_model' => ['required', Rule::in(['INDIVIDUAL', 'INSTITUTION'])],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'max_seats' => ['required', 'integer', 'min:1'],
            'ai_generation_quota' => ['required', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'is_active' => ['boolean'],
            'is_popular' => ['boolean'],
            'order_index' => ['nullable', 'integer'],
        ]);

        $slug = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name'] . '-' . strtolower($validated['client_model']));

        // Ensure slug uniqueness
        $baseSlug = $slug;
        $counter = 1;
        while (SubscriptionPlan::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $features = $validated['features'] ?? [
            'Akses Penuh RPP & Modul Ajar KBC',
            'Bank Soal & Asesmen Otomatis',
            "Kuota AI: {$validated['ai_generation_quota']} Generasi",
            'Download Word & Cetak PDF Resmi',
        ];

        SubscriptionPlan::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'client_model' => $validated['client_model'],
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'max_seats' => $validated['max_seats'],
            'ai_generation_quota' => $validated['ai_generation_quota'],
            'features' => array_values(array_filter($features)),
            'is_active' => $validated['is_active'] ?? true,
            'is_popular' => $validated['is_popular'] ?? false,
            'order_index' => $validated['order_index'] ?? 0,
        ]);

        return back()->with('success', "Paket langganan \"{$validated['name']}\" berhasil ditambahkan.");
    }

    /**
     * Update existing subscription plan configuration
     */
    public function update(Request $request, SubscriptionPlan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'client_model' => ['required', Rule::in(['INDIVIDUAL', 'INSTITUTION'])],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'max_seats' => ['required', 'integer', 'min:1'],
            'ai_generation_quota' => ['required', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'is_active' => ['boolean'],
            'is_popular' => ['boolean'],
            'order_index' => ['nullable', 'integer'],
        ]);

        $features = !empty($validated['features'])
            ? array_values(array_filter($validated['features']))
            : $plan->features;

        $plan->update([
            'name' => $validated['name'],
            'client_model' => $validated['client_model'],
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'max_seats' => $validated['max_seats'],
            'ai_generation_quota' => $validated['ai_generation_quota'],
            'features' => $features,
            'is_active' => $validated['is_active'] ?? $plan->is_active,
            'is_popular' => $validated['is_popular'] ?? $plan->is_popular,
            'order_index' => $validated['order_index'] ?? $plan->order_index,
        ]);

        return back()->with('success', "Paket langganan \"{$plan->name}\" berhasil diperbarui.");
    }

    /**
     * Toggle active visibility status of a plan
     */
    public function toggleStatus(SubscriptionPlan $plan): RedirectResponse
    {
        $plan->update(['is_active' => !$plan->is_active]);

        $statusText = $plan->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Paket \"{$plan->name}\" berhasil {$statusText}.");
    }

    /**
     * Remove or safely deactivate a subscription plan
     */
    public function destroy(SubscriptionPlan $plan): RedirectResponse
    {
        $activeUsage = $plan->tenantSubscriptions()->whereIn('status', ['TRIAL', 'ACTIVE'])->count();

        if ($activeUsage > 0) {
            $plan->update(['is_active' => false]);
            return back()->with('success', "Paket \"{$plan->name}\" memiliki langganan aktif, status diubah menjadi Nonaktif untuk keamanan data.");
        }

        $plan->delete();
        return back()->with('success', "Paket \"{$plan->name}\" berhasil dihapus.");
    }
}
