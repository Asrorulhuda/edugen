<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Regulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'authority',
        'year',
        'issued_at',
        'effective_at',
        'status',
        'replaces_regulation_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'date',
            'effective_at' => 'date',
        ];
    }

    public function replacesRegulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class, 'replaces_regulation_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(RegulationDocument::class);
    }

    public function sourcePolicies(): HasMany
    {
        return $this->hasMany(SourcePolicy::class);
    }

    public function learningOutcomes(): HasMany
    {
        return $this->hasMany(LearningOutcome::class);
    }
}
