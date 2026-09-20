<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'education_level_scope',
        'description',
        'aliases',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'education_level_scope' => 'array',
            'aliases' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function elements(): HasMany
    {
        return $this->hasMany(LearningElement::class);
    }

    public function learningOutcomes(): HasMany
    {
        return $this->hasMany(LearningOutcome::class);
    }
}
