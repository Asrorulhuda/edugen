<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'title',
        'content',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function getSection(string $key, array $default = []): array
    {
        $section = static::where('key', $key)->where('is_active', true)->first();
        return $section ? ($section->content ?? $default) : $default;
    }
}
