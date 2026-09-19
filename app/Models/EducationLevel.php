<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'order_index',
        'description',
    ];

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class)->orderBy('order_index');
    }

    public function learningOutcomes(): HasMany
    {
        return $this->hasMany(LearningOutcome::class);
    }
}
