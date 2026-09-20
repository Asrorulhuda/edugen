<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGatewaySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'gateway',
        'name',
        'environment',
        'api_key',
        'private_key',
        'merchant_code',
        'webhook_token',
        'is_active',
        'config',
        'last_tested_at',
        'last_test_status',
        'last_test_message',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'array',
        'last_tested_at' => 'datetime',
    ];

    /**
     * Get or create setting for specific gateway
     */
    public static function forGateway(string $gateway, array $defaultAttributes = []): self
    {
        return static::firstOrCreate(
            ['gateway' => $gateway],
            array_merge([
                'name' => strtoupper($gateway) . ' Payment Gateway',
                'environment' => 'sandbox',
                'is_active' => false,
            ], $defaultAttributes)
        );
    }
}
