<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CurriculumFramework extends Model
{
    use HasFactory;

    public const MERDEKA = 'MERDEKA';
    public const MADRASAH_KBC = 'MADRASAH_KBC';

    protected $fillable = [
        'code',
        'name',
        'description',
        'config_json',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'config_json' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function sourcePolicies(): HasMany
    {
        return $this->hasMany(SourcePolicy::class, 'curriculum_code', 'code');
    }

    public function learningOutcomes(): HasMany
    {
        return $this->hasMany(LearningOutcome::class, 'curriculum_code', 'code');
    }
}
