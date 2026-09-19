<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningOutcome extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'DRAFT';
    public const STATUS_PUBLISHED = 'PUBLISHED';
    public const STATUS_ARCHIVED = 'ARCHIVED';

    protected $fillable = [
        'code',
        'curriculum_code',
        'regulation_id',
        'subject_id',
        'education_level_id',
        'phase_id',
        'learning_element_id',
        'cp_text',
        'source_locator',
        'source_page_start',
        'source_page_end',
        'checksum',
        'version',
        'status',
        'verified_by',
        'verified_at',
        'published_at',
        'notes',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public static function generateChecksum(string $text): string
    {
        // Normalize whitespace and calculate sha256
        $normalized = trim(preg_replace('/\s+/', ' ', $text));
        return hash('sha256', $normalized);
    }

    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(CurriculumFramework::class, 'curriculum_code', 'code');
    }

    public function regulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function educationLevel(): BelongsTo
    {
        return $this->belongsTo(EducationLevel::class);
    }

    public function phase(): BelongsTo
    {
        return $this->belongsTo(Phase::class);
    }

    public function element(): BelongsTo
    {
        return $this->belongsTo(LearningElement::class, 'learning_element_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(LearningOutcomeVersion::class)->orderByDesc('version');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(CpAuditLog::class)->orderByDesc('created_at');
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }
}
