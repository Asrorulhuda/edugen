<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaMessageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_number',
        'recipient_name',
        'message',
        'footer',
        'status',
        'source',
        'response_payload',
        'error_message',
        'tenant_id',
        'user_id',
        'sent_at',
    ];

    protected $casts = [
        'response_payload' => 'array',
        'sent_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
