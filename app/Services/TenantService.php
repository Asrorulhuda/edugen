<?php

namespace App\Services;

use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\TenantSubscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantService
{
    /**
     * Provision a personal workspace with trial subscription for a teacher.
     */
    public function provisionPersonalWorkspace(User $user): Tenant
    {
        return DB::transaction(function () use ($user) {
            // Check if user already has an individual tenant
            $existingMembership = TenantMembership::where('user_id', $user->id)
                ->whereHas('tenant', function ($q) {
                    $q->where('tenant_type', 'INDIVIDUAL');
                })
                ->where('membership_status', 'ACTIVE')
                ->first();

            if ($existingMembership && $existingMembership->tenant) {
                if ($user->last_active_tenant_id !== $existingMembership->tenant_id) {
                    $user->update(['last_active_tenant_id' => $existingMembership->tenant_id]);
                }
                return $existingMembership->tenant;
            }

            // Create personal tenant
            $tenant = Tenant::create([
                'name' => 'Ruang Kerja ' . ($user->name ?: 'Guru Mandiri'),
                'slug' => 'guru-' . $user->id . '-' . strtolower(Str::random(6)),
                'tenant_type' => 'INDIVIDUAL',
                'primary_admin_user_id' => $user->id,
                'status' => 'ACTIVE',
                'timezone' => 'Asia/Jakarta',
                'locale' => 'id',
            ]);

            // Assign PERSONAL_TEACHER role
            $role = Role::where('name', Role::PERSONAL_TEACHER)->first();

            TenantMembership::create([
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'role_id' => $role?->id,
                'membership_status' => 'ACTIVE',
                'is_default' => true,
                'joined_at' => Carbon::now(),
            ]);

            // Provision Trial Subscription
            $trialPlan = SubscriptionPlan::where('slug', 'guru-mandiri-trial')->first()
                ?? SubscriptionPlan::where('client_model', 'INDIVIDUAL')->first();

            if ($trialPlan) {
                TenantSubscription::create([
                    'tenant_id' => $tenant->id,
                    'subscription_plan_id' => $trialPlan->id,
                    'status' => 'TRIAL',
                    'starts_at' => Carbon::now(),
                    'ends_at' => Carbon::now()->addDays($trialPlan->duration_days ?: 14),
                    'ai_quota_used' => 0,
                    'ai_quota_limit' => $trialPlan->ai_generation_quota,
                    'seats_limit' => 1,
                    'auto_renew' => false,
                ]);
            }

            $user->update(['last_active_tenant_id' => $tenant->id]);

            return $tenant;
        });
    }
}
