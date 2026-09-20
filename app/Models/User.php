<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'phone_verified_at',
        'password',
        'status',
        'avatar_path',
        'last_active_tenant_id',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the avatar URL or generate fallback initials.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar_path) {
            return asset('storage/' . $this->avatar_path);
        }

        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=4F46E5&background=EEF2FF';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Tenant memberships
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(TenantMembership::class);
    }

    /**
     * Tenants this user belongs to
     */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_memberships')
            ->withPivot('role_id', 'membership_status', 'is_default')
            ->withTimestamps();
    }

    /**
     * The last active tenant workspace
     */
    public function lastActiveTenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'last_active_tenant_id');
    }

    /**
     * Teacher profile in the current context
     */
    public function teacherProfiles(): HasMany
    {
        return $this->hasMany(TeacherProfile::class);
    }

    /**
     * Check if user is Super Admin (has SUPER_ADMIN role in system scope)
     */
    public function isSuperAdmin(): bool
    {
        if ($this->id === 1) {
            return true;
        }

        $superAdminEmails = array_filter(array_map('trim', [
            'admin@edugen.id',
            'asrorulhuda@gmail.com',
            (string) env('SUPERADMIN_EMAIL', ''),
        ]));

        if ($this->email && in_array(strtolower($this->email), array_map('strtolower', $superAdminEmails), true)) {
            return true;
        }

        return $this->memberships()
            ->whereHas('role', function ($query) {
                $query->where('name', 'SUPER_ADMIN');
            })
            ->exists();
    }

    /**
     * Get user membership in a specific tenant
     */
    public function getMembership(int|string|null $tenantId = null): ?TenantMembership
    {
        $targetTenantId = $tenantId ?? $this->last_active_tenant_id;
        if (!$targetTenantId) {
            return $this->memberships()->where('is_default', true)->first()
                ?? $this->memberships()->first();
        }

        return $this->memberships()
            ->where('tenant_id', $targetTenantId)
            ->where('membership_status', 'ACTIVE')
            ->first();
    }

    /**
     * Check if user has specific role in tenant
     */
    public function hasRole(string $roleName, int|string|null $tenantId = null): bool
    {
        if ($roleName === 'SUPER_ADMIN' && $this->isSuperAdmin()) {
            return true;
        }

        $membership = $this->getMembership($tenantId);
        return $membership && $membership->role?->name === $roleName;
    }

    /**
     * Check if user has permission in tenant
     */
    public function hasPermission(string $permissionName, int|string|null $tenantId = null): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        $membership = $this->getMembership($tenantId);
        if (!$membership || !$membership->role) {
            return false;
        }

        return $membership->role->permissions()
            ->where('name', $permissionName)
            ->exists();
    }
}
