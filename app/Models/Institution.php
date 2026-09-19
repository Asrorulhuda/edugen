<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'type',
        'npsn',
        'nsm',
        'address',
        'city',
        'province',
        'postal_code',
        'phone',
        'email',
        'website',
        'logo_path',
        'letterhead_path',
        'header_style',
        'letterhead_line_1',
        'letterhead_line_2',
        'letterhead_line_3',
        'letterhead_subtext',
        'principal_name',
        'principal_id_number',
        'signature_city',
        'signature_title',
        'default_curriculum_mode',
        'status',
    ];

    protected $appends = [
        'effective_logo_url',
        'effective_subtext',
        'effective_line_1',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function teacherProfiles(): HasMany
    {
        return $this->hasMany(TeacherProfile::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'ACTIVE';
    }

    public function isMadrasah(): bool
    {
        $type = strtoupper(trim($this->type ?? ''));
        return in_array($type, ['MADRASAH', 'MI', 'MTS', 'MA', 'MAK', 'PESANTREN']);
    }

    public function getEffectiveLogoUrlAttribute(): string
    {
        if (!empty($this->logo_path) && \Illuminate\Support\Facades\Storage::disk('public')->exists($this->logo_path)) {
            return asset('storage/' . $this->logo_path);
        }

        return $this->isMadrasah()
            ? asset('images/logos/kemenag.svg')
            : asset('images/logos/tutwuri.svg');
    }

    public function getEffectiveLine1Attribute(): string
    {
        if ($this->isMadrasah()) {
            return $this->letterhead_line_1 ?: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA';
        }

        if (!empty($this->letterhead_line_1) && !str_contains(strtoupper($this->letterhead_line_1), 'KEMENTERIAN AGAMA')) {
            return $this->letterhead_line_1;
        }

        $cityName = strtoupper($this->city ?: 'KOTA');
        return "PEMERINTAH {$cityName} / DINAS PENDIDIKAN";
    }

    public function getEffectiveSubtextAttribute(): string
    {
        if (!empty($this->letterhead_subtext) && !str_contains($this->letterhead_subtext, 'Jl. Raya Pendidikan No. 123')) {
            return $this->letterhead_subtext;
        }

        $addressParts = array_filter([
            $this->address,
            $this->city,
            $this->province ? ($this->postal_code ? "{$this->province} {$this->postal_code}" : $this->province) : null,
        ]);

        $contactParts = array_filter([
            $this->phone ? "Telp: {$this->phone}" : null,
            $this->email ? "Email: {$this->email}" : null,
            $this->website,
        ]);

        $line = implode(', ', $addressParts);
        if (!empty($contactParts)) {
            $line .= ($line ? '. ' : '') . implode(' | ', $contactParts);
        }

        return $line ?: ($this->letterhead_subtext ?? '');
    }
}

