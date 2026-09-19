<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegulationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'regulation_id',
        'file_path',
        'sha256',
        'version_label',
        'page_count',
        'extraction_status',
    ];

    public function regulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class);
    }
}
