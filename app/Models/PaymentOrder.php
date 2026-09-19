<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'tenant_id',
        'user_id',
        'subscription_plan_id',
        'amount',
        'payment_method',
        'payment_channel',
        'payment_status',
        'payment_proof_path',
        'payment_proof_notes',
        'verified_by',
        'verified_at',
        'gateway_reference',
        'checkout_url',
        'gateway_response',
        'paid_at',
        'expired_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'verified_at' => 'datetime',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
