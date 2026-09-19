<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_package_id',
        'assessment_matrix_id',
        'question_number',
        'question_type',
        'stimulus_text',
        'image_path',
        'image_prompt',
        'question_text',
        'options_data',
        'correct_answer',
        'explanation',
        'score_weight',
    ];

    protected $casts = [
        'options_data' => 'array',
        'question_number' => 'integer',
        'score_weight' => 'integer',
    ];

    public function assessmentPackage(): BelongsTo
    {
        return $this->belongsTo(AssessmentPackage::class);
    }

    public function matrix(): BelongsTo
    {
        return $this->belongsTo(AssessmentMatrix::class, 'assessment_matrix_id');
    }
}
