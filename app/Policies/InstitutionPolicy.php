<?php

namespace App\Policies;

use App\Models\Institution;
use App\Models\User;

class InstitutionPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return null;
    }

    public function view(User $user, Institution $institution): bool
    {
        return $user->memberships()
            ->where('tenant_id', $institution->tenant_id)
            ->where('membership_status', 'ACTIVE')
            ->exists();
    }

    public function update(User $user, Institution $institution): bool
    {
        $membership = $user->getMembership($institution->tenant_id);
        return $membership && $membership->role?->name === 'ADMIN';
    }
}
