<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CpAuditLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'learning_outcome_id',
        'actor_id',
        'action',
        'reason',
        'before_payload',
        'after_payload',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'before_payload' => 'array',
            'after_payload' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function learningOutcome(): BelongsTo
    {
        return $this->belongsTo(LearningOutcome::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
