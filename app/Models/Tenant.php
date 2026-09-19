<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany as HasManyRelation;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'tenant_type',
        'primary_admin_user_id',
        'status',
        'timezone',
        'locale',
        'created_by_superadmin',
        'trial_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'created_by_superadmin' => 'boolean',
            'trial_ends_at' => 'datetime',
        ];
    }

    public function primaryAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'primary_admin_user_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(TenantMembership::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_memberships')
            ->withPivot('role_id', 'membership_status', 'is_default')
            ->withTimestamps();
    }

    public function institution(): HasOne
    {
        return $this->hasOne(Institution::class);
    }

    public function teacherProfiles(): HasMany
    {
        return $this->hasMany(TeacherProfile::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TenantInvitation::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(TenantSubscription::class);
    }

    /**
     * Get the currently active subscription (TRIAL or ACTIVE, not expired).
     */
    public function activeSubscription(): ?TenantSubscription
    {
        return $this->subscriptions()
            ->whereIn('status', ['TRIAL', 'ACTIVE'])
            ->where('ends_at', '>', now())
            ->orderByDesc('ends_at')
            ->first();
    }

    public function isIndividual(): bool
    {
        return $this->tenant_type === 'INDIVIDUAL';
    }

    public function isInstitution(): bool
    {
        return $this->tenant_type === 'INSTITUTION';
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['TRIAL', 'ACTIVE'], true);
    }
}
