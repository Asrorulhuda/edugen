<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrisSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'merchant_name',
        'nmid',
        'qr_string',
        'qr_image_path',
        'supported_apps',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get or create current QRIS setting
     */
    public static function current(): self
    {
        return static::firstOrCreate([], [
            'merchant_name' => 'EDUGEN INDONESIA',
            'nmid' => 'ID1020039281729',
            'qr_string' => '00020101021226580014ID.LINKAJA.WWW0118936009180000000000021500000000000000051440014ID.GO.QRIS.WWW0215ID10200392817290303UME5204581253033605802ID5919EDUGEN INDONESIA6007JAKARTA61051011062070703A01630489AB',
            'supported_apps' => 'BCA Mobile, Livin by Mandiri, BSI Mobile, BRImo, GoPay, OVO, Dana, ShopeePay, LinkAja',
            'is_active' => true,
        ]);
    }
}
