<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaGatewaySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'endpoint_url',
        'api_key',
        'sender',
        'admin_notify_number',
        'notify_on_registration',
        'default_footer',
        'is_active',
        'full_response',
        'last_tested_at',
        'last_test_status',
        'last_test_message',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'full_response' => 'boolean',
        'notify_on_registration' => 'boolean',
        'last_tested_at' => 'datetime',
    ];

    /**
     * Get the singleton or primary setting instance.
     */
    public static function current(): self
    {
        return static::firstOrCreate(
            ['id' => 1],
            [
                'endpoint_url' => 'https://gateway.asr-desain.my.id/send-message',
                'default_footer' => 'EduGen AI - Platform Perangkat Ajar Modern',
                'is_active' => false,
                'full_response' => true,
            ]
        );
    }
}
