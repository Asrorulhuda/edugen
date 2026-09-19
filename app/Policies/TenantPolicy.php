<?php

namespace App\Policies;

use App\Models\Tenant;
use App\Models\User;

class TenantPolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view the tenant.
     */
    public function view(User $user, Tenant $tenant): bool
    {
        return $user->memberships()
            ->where('tenant_id', $tenant->id)
            ->where('membership_status', 'ACTIVE')
            ->exists();
    }

    /**
     * Determine whether the user can update the tenant.
     */
    public function update(User $user, Tenant $tenant): bool
    {
        $membership = $user->getMembership($tenant->id);
        if (!$membership || !$membership->role) {
            return false;
        }

        return in_array($membership->role->name, ['ADMIN', 'PERSONAL_TEACHER'], true);
    }
}
