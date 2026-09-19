<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'subscription_plan_id',
        'status',
        'starts_at',
        'ends_at',
        'ai_quota_used',
        'ai_quota_limit',
        'seats_limit',
        'auto_renew',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'ai_quota_used' => 'integer',
        'ai_quota_limit' => 'integer',
        'seats_limit' => 'integer',
        'auto_renew' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['TRIAL', 'ACTIVE']) && $this->ends_at->isFuture();
    }

    public function remainingAiQuota(): int
    {
        return max(0, $this->ai_quota_limit - $this->ai_quota_used);
    }
}
