<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'learning_outcome_id',
        'subject_id',
        'phase_id',
        'grade_id',
        'code',
        'bloom_level',
        'competency_kko',
        'material_content',
        'pedagogical_description',
        'panca_cinta_dimensions',
        'deep_learning_elements',
        'profil_lulusan_dimensions',
        'estimated_hours',
        'is_verified',
    ];

    protected $casts = [
        'panca_cinta_dimensions' => 'array',
        'deep_learning_elements' => 'array',
        'profil_lulusan_dimensions' => 'array',
        'is_verified' => 'boolean',
        'estimated_hours' => 'integer',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function learningOutcome(): BelongsTo
    {
        return $this->belongsTo(LearningOutcome::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function phase(): BelongsTo
    {
        return $this->belongsTo(Phase::class);
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }
}
