<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiProviderSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'name',
        'api_key',
        'model',
        'base_url',
        'is_active',
        'is_default',
        'temperature',
        'max_tokens',
        'last_tested_at',
        'last_test_status',
        'last_test_message',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'temperature' => 'float',
        'max_tokens' => 'integer',
        'last_tested_at' => 'datetime',
    ];

    /**
     * Set one provider as default and unset others.
     */
    public static function setDefault(string $provider): void
    {
        static::query()->update(['is_default' => false]);
        static::where('provider', $provider)->update(['is_default' => true]);
    }
}
