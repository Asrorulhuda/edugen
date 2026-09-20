<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_code',
        'bank_name',
        'account_number',
        'account_name',
        'badge',
        'is_active',
        'order_index',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order_index' => 'integer',
    ];
}
