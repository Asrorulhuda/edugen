<?php

namespace App\Policies;

use App\Models\TeacherProfile;
use App\Models\User;

class TeacherProfilePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return null;
    }

    public function view(User $user, TeacherProfile $profile): bool
    {
        // Admin of the institution or the teacher themselves
        if ($user->id === $profile->user_id) {
            return true;
        }

        $membership = $user->getMembership($profile->tenant_id);
        return $membership && $membership->role?->name === 'ADMIN';
    }

    public function update(User $user, TeacherProfile $profile): bool
    {
        // Admin can update all fields; teacher can update certain allowed personal fields
        if ($user->id === $profile->user_id) {
            return true;
        }

        $membership = $user->getMembership($profile->tenant_id);
        return $membership && $membership->role?->name === 'ADMIN';
    }

    public function manage(User $user, int $tenantId): bool
    {
        $membership = $user->getMembership($tenantId);
        return $membership && $membership->role?->name === 'ADMIN';
    }
}
