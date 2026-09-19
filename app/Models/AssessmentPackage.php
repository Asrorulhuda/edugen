<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentPackage extends Model
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
        'assessment_type',
        'total_questions',
        'duration_minutes',
        'instructions',
        'settings',
        'status',
    ];

    protected $casts = [
        'total_questions' => 'integer',
        'duration_minutes' => 'integer',
        'settings' => 'array',
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

    public function matrices(): HasMany
    {
        return $this->hasMany(AssessmentMatrix::class)->orderBy('question_number');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AssessmentQuestion::class)->orderBy('question_number');
    }
}
