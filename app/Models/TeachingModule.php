<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeachingModule extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'subject_id',
        'phase_id',
        'grade_id',
        'academic_year_id',
        'semester_id',
        'curriculum_code',
        'title',
        'topic_name',
        'total_hours',
        'meeting_count',
        'learning_model',
        'target_students',
        'facilities',
        'prerequisite_knowledge',
        'learning_goal_ids',
        'meaningful_understanding',
        'inquiry_questions',
        'panca_cinta_integration',
        'deep_learning_activities',
        'profil_lulusan_targets',
        'learning_steps',
        'diagnostic_assessment',
        'formative_assessment',
        'summative_assessment',
        'remedial_enrichment',
        'student_worksheet_text',
        'reading_materials',
        'glossary',
        'bibliography',
        'generation_metadata',
        'status',
    ];

    protected $casts = [
        'learning_goal_ids' => 'array',
        'inquiry_questions' => 'array',
        'panca_cinta_integration' => 'array',
        'deep_learning_activities' => 'array',
        'profil_lulusan_targets' => 'array',
        'learning_steps' => 'array',
        'diagnostic_assessment' => 'array',
        'formative_assessment' => 'array',
        'summative_assessment' => 'array',
        'remedial_enrichment' => 'array',
        'glossary' => 'array',
        'generation_metadata' => 'array',
        'total_hours' => 'integer',
        'meeting_count' => 'integer',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
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

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}
