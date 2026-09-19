<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'institution_id',
        'employee_no',
        'nuptk',
        'phone',
        'employment_status',
        'primary_subject_id',
        'education_level_scope',
        'grade_scope',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'education_level_scope' => 'array',
            'grade_scope' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
