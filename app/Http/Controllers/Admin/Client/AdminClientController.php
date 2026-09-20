<?php

namespace App\Http\Controllers\Admin\Client;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\TenantSubscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminClientController extends Controller
{
    /**
     * Display paginated list of all clients (Individual Teachers & Institutions)
     */
    public function index(Request $request): Response
    {
        $query = Tenant::with([
            'primaryAdmin:id,name,email',
            'institution:id,tenant_id,name,npsn,type',
            'subscriptions' => function ($sq) {
                $sq->with('plan:id,name,slug,client_model,price,duration_days')
                   ->whereIn('status', ['TRIAL', 'ACTIVE'])
                   ->where('ends_at', '>', Carbon::now())
                   ->orderByDesc('id');
            },
        ])->withCount(['memberships', 'teacherProfiles']);

        if ($request->filled('tenant_type')) {
            $query->where('tenant_type', $request->input('tenant_type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhereHas('primaryAdmin', function ($adminQ) use ($search) {
                      $adminQ->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('institution', function ($instQ) use ($search) {
                      $instQ->where('name', 'like', "%{$search}%")
                            ->orWhere('npsn', 'like', "%{$search}%");
                  });
            });
        }

        $clients = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        // Transform collection to append clean active subscription details
        $clients->getCollection()->transform(function ($tenant) {
            $activeSub = $tenant->subscriptions->first();
            return [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'tenant_type' => $tenant->tenant_type,
                'status' => $tenant->status,
                'created_at' => $tenant->created_at?->toISOString(),
                'primary_admin' => $tenant->primaryAdmin ? [
                    'id' => $tenant->primaryAdmin->id,
                    'name' => $tenant->primaryAdmin->name,
                    'email' => $tenant->primaryAdmin->email,
                ] : null,
                'institution' => $tenant->institution ? [
                    'id' => $tenant->institution->id,
                    'name' => $tenant->institution->name,
                    'npsn' => $tenant->institution->npsn,
                    'level' => $tenant->institution->type,
                ] : null,
                'active_subscription' => $activeSub ? [
                    'id' => $activeSub->id,
                    'plan_name' => $activeSub->plan?->name ?? 'Custom Plan',
                    'status' => $activeSub->status,
                    'starts_at' => $activeSub->starts_at?->format('d M Y'),
                    'ends_at' => $activeSub->ends_at?->format('d M Y'),
                    'days_remaining' => max(0, (int) ceil(Carbon::now()->diffInSeconds($activeSub->ends_at, false) / 86400)),
                    'ai_quota_used' => (int) $activeSub->ai_quota_used,
                    'ai_quota_limit' => (int) $activeSub->ai_quota_limit,
                    'ai_quota_remaining' => max(0, (int) $activeSub->ai_quota_limit - (int) $activeSub->ai_quota_used),
                    'seats_limit' => (int) $activeSub->seats_limit,
                ] : null,
                'members_count' => $tenant->memberships_count ?? 0,
                'teachers_count' => $tenant->teacher_profiles_count ?? 0,
            ];
        });

        $stats = [
            'total_clients' => Tenant::count(),
            'total_institutions' => Tenant::where('tenant_type', 'INSTITUTION')->count(),
            'total_individuals' => Tenant::where('tenant_type', 'INDIVIDUAL')->count(),
            'total_active' => Tenant::whereIn('status', ['TRIAL', 'ACTIVE'])->count(),
        ];

        $availablePlans = SubscriptionPlan::where('is_active', true)
            ->orderBy('order_index')
            ->get(['id', 'name', 'client_model', 'price', 'duration_days', 'ai_generation_quota', 'max_seats']);

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'stats' => $stats,
            'plans' => $availablePlans,
            'filters' => $request->only(['tenant_type', 'status', 'search']),
        ]);
    }

    /**
     * Display detailed profile and management view for a specific client
     */
    public function show(Tenant $tenant): Response
    {
        $tenant->load([
            'primaryAdmin',
            'institution',
            'memberships.user',
            'memberships.role',
            'teacherProfiles.user',
            'subscriptions.plan',
        ]);

        $activeSub = $tenant->subscriptions()
            ->with('plan')
            ->whereIn('status', ['TRIAL', 'ACTIVE'])
            ->where('ends_at', '>', Carbon::now())
            ->orderByDesc('id')
            ->first();

        // Calculate teaching curriculum generation stats
        $stats = [
            'modules_count' => DB::table('teaching_modules')->where('tenant_id', $tenant->id)->count(),
            'assessments_count' => DB::table('assessment_packages')->where('tenant_id', $tenant->id)->count(),
            'goals_count' => DB::table('learning_goals')->where('tenant_id', $tenant->id)->count(),
            'ai_logs_count' => DB::table('ai_generation_logs')->where('tenant_id', $tenant->id)->count(),
        ];

        $recentAiLogs = DB::table('ai_generation_logs')
            ->where('tenant_id', $tenant->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'feature_type', 'provider', 'model_name', 'completion_tokens', 'status', 'created_at']);

        $recentOrders = DB::table('payment_orders')
            ->leftJoin('subscription_plans', 'payment_orders.subscription_plan_id', '=', 'subscription_plans.id')
            ->where('payment_orders.tenant_id', $tenant->id)
            ->orderByDesc('payment_orders.created_at')
            ->limit(5)
            ->select([
                'payment_orders.id',
                'payment_orders.order_number',
                DB::raw('COALESCE(subscription_plans.name, "Custom Plan") as plan_name'),
                'payment_orders.amount',
                'payment_orders.payment_status',
                'payment_orders.payment_method',
                'payment_orders.created_at',
            ])
            ->get();

        $availablePlans = SubscriptionPlan::where('is_active', true)
            ->where('client_model', $tenant->tenant_type)
            ->orderBy('order_index')
            ->get();

        $invitations = $tenant->tenant_type === 'INSTITUTION'
            ? $tenant->invitations()->with(['role', 'inviter:id,name'])->orderByDesc('created_at')->get()->map(fn($inv) => [
                'id' => $inv->id,
                'email' => $inv->email,
                'phone' => $inv->phone,
                'otp_code' => $inv->otp_code,
                'role_name' => $inv->role?->display_name ?? 'Guru',
                'invitation_url' => url("/invitations/{$inv->token_hash}"),
                'is_accepted' => $inv->isAccepted(),
                'is_expired' => $inv->isExpired(),
                'expires_at' => $inv->expires_at?->format('d M Y'),
                'accepted_at' => $inv->accepted_at?->format('d M Y'),
            ])
            : [];

        return Inertia::render('Admin/Clients/Show', [
            'client' => $tenant,
            'activeSubscription' => $activeSub,
            'stats' => $stats,
            'recentAiLogs' => $recentAiLogs,
            'recentOrders' => $recentOrders,
            'availablePlans' => $availablePlans,
            'invitations' => $invitations,
        ]);
    }

    /**
     * Update client status (ACTIVE, SUSPENDED, TRIAL, EXPIRED)
     */
    public function updateStatus(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'])],
        ]);

        $tenant->update(['status' => $validated['status']]);

        return back()->with('success', "Status client \"{$tenant->name}\" berhasil diperbarui menjadi {$validated['status']}.");
    }

    /**
     * Adjust AI generation quota directly
     */
    public function adjustQuota(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer'],
            'action' => ['nullable', Rule::in(['add', 'set'])],
            'mode' => ['nullable', Rule::in(['add', 'set'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $mode = $validated['action'] ?? $validated['mode'] ?? 'add';
        $amount = (int) $validated['amount'];

        DB::transaction(function () use ($tenant, $mode, $amount) {
            $activeSub = $tenant->subscriptions()
                ->whereIn('status', ['TRIAL', 'ACTIVE'])
                ->where('ends_at', '>', Carbon::now())
                ->orderByDesc('id')
                ->first();

            if (!$activeSub) {
                $fallbackPlan = SubscriptionPlan::where('client_model', $tenant->tenant_type)->first();
                $limit = $mode === 'set' ? max(0, $amount) : max(0, 100 + $amount);

                TenantSubscription::create([
                    'tenant_id' => $tenant->id,
                    'subscription_plan_id' => $fallbackPlan?->id,
                    'status' => 'ACTIVE',
                    'starts_at' => Carbon::now(),
                    'ends_at' => Carbon::now()->addDays(30),
                    'ai_quota_used' => 0,
                    'ai_quota_limit' => $limit,
                    'seats_limit' => $tenant->tenant_type === 'INSTITUTION' ? 50 : 1,
                    'auto_renew' => false,
                ]);
            } else {
                if ($mode === 'set') {
                    $newLimit = max($activeSub->ai_quota_used, $amount);
                    $activeSub->update(['ai_quota_limit' => $newLimit]);
                } else {
                    $activeSub->increment('ai_quota_limit', $amount);
                }
            }
        });

        return back()->with('success', "Kuota AI untuk client \"{$tenant->name}\" berhasil disesuaikan.");
    }

    /**
     * Adjust subscription active duration / expiration date directly
     */
    public function adjustDuration(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['add', 'set'])],
            'days' => ['required_if:action,add', 'nullable', 'integer', 'min:1', 'max:1825'],
            'ends_at' => ['required_if:action,set', 'nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($tenant, $validated) {
            $activeSub = $tenant->subscriptions()
                ->whereIn('status', ['TRIAL', 'ACTIVE'])
                ->where('ends_at', '>', Carbon::now())
                ->orderByDesc('id')
                ->first();

            if (!$activeSub) {
                $fallbackPlan = SubscriptionPlan::where('client_model', $tenant->tenant_type)->first();
                $newEndsAt = $validated['action'] === 'set'
                    ? Carbon::parse($validated['ends_at'])->endOfDay()
                    : Carbon::now()->addDays((int) $validated['days']);

                TenantSubscription::create([
                    'tenant_id' => $tenant->id,
                    'subscription_plan_id' => $fallbackPlan?->id,
                    'status' => 'ACTIVE',
                    'starts_at' => Carbon::now(),
                    'ends_at' => $newEndsAt,
                    'ai_quota_used' => 0,
                    'ai_quota_limit' => $fallbackPlan?->ai_generation_quota ?? 100,
                    'seats_limit' => $tenant->tenant_type === 'INSTITUTION' ? 50 : 1,
                    'auto_renew' => false,
                ]);
            } else {
                if ($validated['action'] === 'set') {
                    $activeSub->update([
                        'ends_at' => Carbon::parse($validated['ends_at'])->endOfDay(),
                    ]);
                } else {
                    $baseDate = $activeSub->ends_at->isFuture() ? $activeSub->ends_at : Carbon::now();
                    $activeSub->update([
                        'ends_at' => $baseDate->copy()->addDays((int) $validated['days']),
                    ]);
                }
            }

            $tenant->update(['status' => 'ACTIVE']);
        });

        return back()->with('success', "Masa aktif langganan client \"{$tenant->name}\" berhasil diperbarui.");
    }

    /**
     * Manually assign or extend a subscription plan for a client
     */
    public function assignSubscription(Request $request, Tenant $tenant): RedirectResponse
    {
        $planId = $request->input('plan_id') ?? $request->input('subscription_plan_id');
        $request->merge(['resolved_plan_id' => $planId]);

        $validated = $request->validate([
            'resolved_plan_id' => ['required', 'exists:subscription_plans,id'],
            'duration_days' => ['nullable', 'integer', 'min:1', 'max:1825'],
            'quota_override' => ['nullable', 'integer', 'min:0'],
            'ai_quota' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['resolved_plan_id']);
        $durationDays = !empty($validated['duration_days']) ? (int) $validated['duration_days'] : $plan->duration_days;
        $quota = isset($validated['quota_override']) && $validated['quota_override'] !== ''
            ? (int) $validated['quota_override']
            : (!empty($validated['ai_quota']) ? (int) $validated['ai_quota'] : $plan->ai_generation_quota);

        DB::transaction(function () use ($tenant, $plan, $durationDays, $quota) {
            $currentSub = $tenant->subscriptions()
                ->whereIn('status', ['TRIAL', 'ACTIVE'])
                ->where('ends_at', '>', Carbon::now())
                ->first();

            $startsAt = Carbon::now();
            $endsAt = $currentSub && $currentSub->ends_at->isFuture()
                ? $currentSub->ends_at->copy()->addDays($durationDays)
                : Carbon::now()->addDays($durationDays);

            if ($currentSub) {
                $currentSub->update(['status' => 'EXPIRED']);
            }

            TenantSubscription::create([
                'tenant_id' => $tenant->id,
                'subscription_plan_id' => $plan->id,
                'status' => 'ACTIVE',
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'ai_quota_used' => 0,
                'ai_quota_limit' => $quota,
                'seats_limit' => $plan->max_seats,
                'auto_renew' => false,
            ]);

            $tenant->update(['status' => 'ACTIVE']);
        });

        return back()->with('success', "Paket \"{$plan->name}\" berhasil ditetapkan untuk {$tenant->name}.");
    }

    /**
     * Create a new client (Individual or Institution) manually by Superadmin
     */
    public function store(Request $request): RedirectResponse
    {
        $clientType = $request->input('tenant_type') ?? $request->input('client_type');
        $clientName = $request->input('name') ?? $request->input('client_name');
        $adminPassword = $request->input('password') ?? $request->input('admin_password');
        $request->merge([
            'resolved_client_type' => $clientType,
            'resolved_client_name' => $clientName,
            'resolved_password' => $adminPassword,
        ]);

        $validated = $request->validate([
            'resolved_client_type' => ['required', Rule::in(['INDIVIDUAL', 'INSTITUTION'])],
            'resolved_client_name' => ['required', 'string', 'max:255'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'resolved_password' => ['required', 'string', 'min:8'],
            'plan_id' => ['nullable', 'exists:subscription_plans,id'],
            'npsn' => ['nullable', 'string', 'max:20'],
        ]);

        $type = $validated['resolved_client_type'];
        $name = $validated['resolved_client_name'];

        DB::transaction(function () use ($validated, $type, $name) {
            $user = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['resolved_password']),
                'email_verified_at' => Carbon::now(),
            ]);

            $baseSlug = Str::slug($name);
            $slug = $baseSlug;
            $counter = 1;
            while (Tenant::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            $tenant = Tenant::create([
                'name' => $name,
                'slug' => $slug,
                'tenant_type' => $type,
                'primary_admin_user_id' => $user->id,
                'status' => 'ACTIVE',
                'created_by_superadmin' => true,
            ]);

            $roleName = $type === 'INSTITUTION' ? Role::ADMIN : Role::PERSONAL_TEACHER;
            $role = Role::where('name', $roleName)->first();

            TenantMembership::create([
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'role_id' => $role?->id ?? 2,
                'membership_status' => 'ACTIVE',
                'is_default' => true,
            ]);

            if ($type === 'INSTITUTION') {
                Institution::create([
                    'tenant_id' => $tenant->id,
                    'name' => $name,
                    'npsn' => $validated['npsn'] ?? null,
                ]);
            }

            $plan = !empty($validated['plan_id'])
                ? SubscriptionPlan::find($validated['plan_id'])
                : SubscriptionPlan::where('client_model', $type)->first();

            if ($plan) {
                TenantSubscription::create([
                    'tenant_id' => $tenant->id,
                    'subscription_plan_id' => $plan->id,
                    'status' => 'ACTIVE',
                    'starts_at' => Carbon::now(),
                    'ends_at' => Carbon::now()->addDays($plan->duration_days),
                    'ai_quota_used' => 0,
                    'ai_quota_limit' => $plan->ai_generation_quota,
                    'seats_limit' => $plan->max_seats,
                    'auto_renew' => false,
                ]);
            }
        });

        return back()->with('success', "Client baru \"{$name}\" berhasil didaftarkan.");
    }

    /**
     * Permanently delete client tenant and associated data
     */
    public function destroy(Tenant $tenant): RedirectResponse
    {
        $name = $tenant->name;

        DB::transaction(function () use ($tenant) {
            User::where('last_active_tenant_id', $tenant->id)->update(['last_active_tenant_id' => null]);
            $tenant->delete();
        });

        return redirect()->route('admin.clients.index')
            ->with('success', "Client \"{$name}\" berhasil dihapus secara permanen beserta seluruh datanya.");
    }
}
