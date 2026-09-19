<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'category',
        'content',
        'footer',
        'is_active',
        'is_system',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    /**
     * Scope active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
