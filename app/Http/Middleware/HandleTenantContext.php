<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleTenantContext
{
    public function __construct(
        protected TenantContext $tenantContext
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // Determine active tenant id
            $tenantId = $request->header('X-Tenant-ID')
                ?? $request->session()->get('current_tenant_id')
                ?? $user->last_active_tenant_id;

            $membership = null;
            $tenant = null;

            if ($tenantId) {
                // If super admin, allow access or find tenant directly
                if ($user->isSuperAdmin()) {
                    $tenant = Tenant::find($tenantId);
                } else {
                    $membership = $user->memberships()
                        ->with(['tenant', 'role'])
                        ->where('tenant_id', $tenantId)
                        ->where('membership_status', 'ACTIVE')
                        ->first();

                    $tenant = $membership?->tenant;
                }
            }

            // Fallback to default membership if no active tenant found or access denied
            if (!$tenant) {
                $membership = $user->memberships()
                    ->with(['tenant', 'role'])
                    ->where('is_default', true)
                    ->where('membership_status', 'ACTIVE')
                    ->first()
                    ?? $user->memberships()
                        ->with(['tenant', 'role'])
                        ->where('membership_status', 'ACTIVE')
                        ->first();

                $tenant = $membership?->tenant;
            }

            // Auto-provision personal workspace fallback if user still has no tenant and is not superadmin
            if (!$tenant && !$user->isSuperAdmin()) {
                $tenantService = app(\App\Services\TenantService::class);
                $tenant = $tenantService->provisionPersonalWorkspace($user);
                $membership = $user->memberships()
                    ->with(['tenant', 'role'])
                    ->where('tenant_id', $tenant->id)
                    ->where('membership_status', 'ACTIVE')
                    ->first();
            }

            if ($tenant) {
                $this->tenantContext->set($tenant, $membership);
                $request->session()->put('current_tenant_id', $tenant->id);

                if ($user->last_active_tenant_id !== $tenant->id) {
                    $user->update(['last_active_tenant_id' => $tenant->id]);
                }
            }

            // Share tenant context to Inertia frontend
            Inertia::share([
                'auth' => [
                    'user' => $user,
                    'is_super_admin' => $user->isSuperAdmin(),
                    'current_tenant' => $tenant ? [
                        'id' => $tenant->id,
                        'name' => $tenant->name,
                        'slug' => $tenant->slug,
                        'tenant_type' => $tenant->tenant_type,
                        'role' => $membership?->role?->name ?? ($user->isSuperAdmin() ? 'SUPER_ADMIN' : null),
                        'role_display' => $membership?->role?->display_name ?? ($user->isSuperAdmin() ? 'Super Admin' : null),
                        'institution' => $tenant->institution ? [
                            'name' => $tenant->institution->name,
                            'type' => $tenant->institution->type,
                            'npsn' => $tenant->institution->npsn,
                            'logo_path' => $tenant->institution->logo_path,
                            'logo_url' => $tenant->institution->effective_logo_url,
                        ] : null,
                        'ai_quota' => [
                            'remaining' => $this->tenantContext->remainingAiQuota(),
                            'has_subscription' => $this->tenantContext->activeSubscription() !== null,
                            'total' => $this->tenantContext->activeSubscription()?->ai_quota_total ?? 0,
                            'used' => $this->tenantContext->activeSubscription()?->ai_quota_used ?? 0,
                        ],
                    ] : null,
                    'available_workspaces' => $user->memberships()
                        ->with(['tenant', 'role'])
                        ->where('membership_status', 'ACTIVE')
                        ->get()
                        ->map(function ($m) {
                            return [
                                'tenant_id' => $m->tenant_id,
                                'name' => $m->tenant?->name,
                                'slug' => $m->tenant?->slug,
                                'tenant_type' => $m->tenant?->tenant_type,
                                'role_name' => $m->role?->name,
                                'role_display' => $m->role?->display_name,
                                'is_current' => $this->tenantContext->id() === $m->tenant_id,
                            ];
                        }),
                ],
            ]);
        }

        return $next($request);
    }
}
