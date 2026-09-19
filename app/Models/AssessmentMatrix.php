<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentMatrix extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_package_id',
        'learning_goal_id',
        'question_number',
        'indicator_text',
        'bloom_level',
        'cognitive_tier',
        'difficulty_level',
        'question_type',
        'score_weight',
    ];

    protected $casts = [
        'question_number' => 'integer',
        'score_weight' => 'integer',
    ];

    public function assessmentPackage(): BelongsTo
    {
        return $this->belongsTo(AssessmentPackage::class);
    }

    public function learningGoal(): BelongsTo
    {
        return $this->belongsTo(LearningGoal::class);
    }
}
