<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\TenantSubscription;
use RuntimeException;

class TenantContext
{
    protected ?Tenant $tenant = null;
    protected ?TenantMembership $membership = null;

    public function set(Tenant $tenant, ?TenantMembership $membership = null): void
    {
        $this->tenant = $tenant;
        $this->membership = $membership;
    }

    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    public function tenant(): ?Tenant
    {
        return $this->tenant;
    }

    public function id(): ?int
    {
        return $this->tenant?->id;
    }

    public function membership(): ?TenantMembership
    {
        return $this->membership;
    }

    public function role(): ?Role
    {
        return $this->membership?->role;
    }

    public function roleName(): ?string
    {
        return $this->membership?->role?->name;
    }

    public function institution(): ?Institution
    {
        if ($this->tenant && $this->tenant->isInstitution()) {
            return $this->tenant->institution;
        }

        if ($this->tenant && $this->tenant->institution) {
            return $this->tenant->institution;
        }

        return null;
    }

    public function isIndividual(): bool
    {
        return $this->tenant?->isIndividual() ?? false;
    }

    public function isInstitution(): bool
    {
        return $this->tenant?->isInstitution() ?? false;
    }

    public function can(string $permissionName): bool
    {
        if (!$this->membership || !$this->membership->role) {
            return false;
        }

        return $this->membership->role->hasPermission($permissionName);
    }

    /**
     * Get the active subscription for the current tenant.
     */
    public function activeSubscription(): ?TenantSubscription
    {
        return $this->tenant?->activeSubscription();
    }

    /**
     * Get remaining AI generation quota for the current tenant.
     * Returns -1 if no subscription exists (unlimited/grace mode).
     */
    public function remainingAiQuota(): int
    {
        $subscription = $this->activeSubscription();
        if (!$subscription) {
            return -1;
        }

        return $subscription->remainingAiQuota();
    }

    /**
     * Consume 1 AI quota unit after a successful generation.
     * Silently skips if no active subscription (grace mode).
     */
    public function consumeAiQuota(): void
    {
        $subscription = $this->activeSubscription();
        if ($subscription) {
            $subscription->increment('ai_quota_used');
        }
    }

    /**
     * Assert the tenant has remaining AI quota, or throw.
     */
    public function assertAiQuota(): void
    {
        $remaining = $this->remainingAiQuota();
        if ($remaining === 0) {
            throw new RuntimeException(
                'Kuota generasi AI untuk periode langganan ini telah habis. '
                . 'Silakan upgrade paket berlangganan Anda untuk melanjutkan.'
            );
        }
    }
}
