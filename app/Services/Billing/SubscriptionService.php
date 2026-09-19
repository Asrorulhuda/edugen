<?php

namespace App\Services\Billing;

use App\Models\PaymentOrder;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    /**
     * Get active subscription for a tenant
     */
    public function getActiveSubscription(Tenant|int|null $tenant): ?TenantSubscription
    {
        if (!$tenant) {
            return null;
        }

        $tenantId = $tenant instanceof Tenant ? $tenant->id : $tenant;

        return TenantSubscription::with('plan')
            ->where('tenant_id', $tenantId)
            ->whereIn('status', ['TRIAL', 'ACTIVE'])
            ->where('ends_at', '>', Carbon::now())
            ->orderByDesc('id')
            ->first();
    }

    /**
     * Check if tenant has available AI generation quota
     */
    public function canGenerateAi(Tenant|int|null $tenant): bool
    {
        if (!$tenant) {
            return false;
        }

        $sub = $this->getActiveSubscription($tenant);

        if (!$sub) {
            return false;
        }

        return $sub->ai_quota_used < $sub->ai_quota_limit;
    }

    /**
     * Atomic increment of consumed AI quota
     */
    public function consumeAiQuota(Tenant|int|null $tenant, int $amount = 1): bool
    {
        if (!$tenant) {
            return false;
        }

        $sub = $this->getActiveSubscription($tenant);

        if (!$sub) {
            return false;
        }

        return (bool) DB::table('tenant_subscriptions')
            ->where('id', $sub->id)
            ->where('ai_quota_used', '<', $sub->ai_quota_limit)
            ->increment('ai_quota_used', $amount);
    }

    /**
     * Activate or extend tenant subscription from a paid order
     */
    public function activateSubscription(PaymentOrder $order): TenantSubscription
    {
        return DB::transaction(function () use ($order) {
            $plan = $order->plan;
            $tenantId = $order->tenant_id;

            // Check if tenant already has an active subscription to extend
            $currentSub = TenantSubscription::where('tenant_id', $tenantId)
                ->whereIn('status', ['TRIAL', 'ACTIVE'])
                ->where('ends_at', '>', Carbon::now())
                ->first();

            $startsAt = Carbon::now();
            $endsAt = $currentSub && $currentSub->ends_at->isFuture()
                ? $currentSub->ends_at->copy()->addDays($plan->duration_days)
                : Carbon::now()->addDays($plan->duration_days);

            $subscription = TenantSubscription::create([
                'tenant_id' => $tenantId,
                'subscription_plan_id' => $plan->id,
                'status' => 'ACTIVE',
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'ai_quota_used' => 0,
                'ai_quota_limit' => $plan->ai_generation_quota,
                'seats_limit' => $plan->max_seats,
                'auto_renew' => false,
            ]);

            // Mark previous active subscriptions as EXPIRED / REPLACED
            if ($currentSub && $currentSub->id !== $subscription->id) {
                $currentSub->update(['status' => 'EXPIRED']);
            }

            return $subscription;
        });
    }
}
