<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Kisi-Kisi Asesmen — {{ $package->title }}</title>
    <style>
        @page { size: A4 landscape; margin: 12mm 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.4; background: #fff; padding: 15px; }

        /* Official Letterhead (Kop Surat) */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 3px double #000000;
            padding-bottom: 8px;
            margin-bottom: 14px;
        }

        .kop-logo {
            width: 75px;
            height: 75px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        .kop-text {
            text-align: center;
            padding: 0 10px;
        }

        .kop-line-1 {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1e293b;
            margin-bottom: 1px;
        }

        .kop-line-2 {
            font-size: 14pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #000000;
            line-height: 1.15;
            margin: 2px 0;
        }

        .kop-line-3 {
            font-size: 9.5pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #1e293b;
            margin: 1px 0;
        }

        .kop-subtext {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8pt;
            color: #334155;
            line-height: 1.25;
            margin-top: 3px;
        }

        .doc-title-box { text-align: center; margin: 12px 0 10px; }
        .doc-title { font-size: 12pt; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #333; display: inline-block; padding: 0 25px 4px; }

        .info-tbl { width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1.5px solid #000; }
        .info-tbl td { padding: 4px 8px; font-size: 9pt; border: 1px solid #444; }
        .info-tbl td.lbl { width: 130px; font-weight: bold; background: #f5f5f5; }
        .info-tbl td.sep { width: 8px; text-align: center; font-weight: bold; }

        .kisi-tbl { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .kisi-tbl th, .kisi-tbl td { border: 1.5px solid #000; padding: 5px 7px; font-size: 9pt; vertical-align: top; }
        .kisi-tbl th { background: #e5e7eb; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 8.5pt; }
        .text-center { text-align: center; }

        .footer-sign { margin-top: 30px; width: 100%; page-break-inside: avoid; }
        .footer-sign td { width: 50%; text-align: center; padding: 6px; vertical-align: top; font-size: 9.5pt; }
        .sign-space { height: 55px; }
        .sign-name { font-weight: bold; text-decoration: underline; text-transform: uppercase; }

        .no-print { padding: 8px 16px; background: #d97706; color: #fff; border: 0; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; margin-bottom: 15px; }
        @media print { .no-print { display: none; } body { padding: 0; } }
    </style>
</head>
<body>

<button class="no-print" onclick="window.print()">🖨️ Cetak Kisi-Kisi Asesmen</button>

@php
    $logoUrl = $institution->effective_logo_url
        ?? (!empty($institution->logo_path) ? asset('storage/' . $institution->logo_path) : ($institution && method_exists($institution, 'isMadrasah') && $institution->isMadrasah() ? asset('images/logos/kemenag.svg') : asset('images/logos/tutwuri.svg')));

    $schoolName = $institution->name ?? 'Satuan Pendidikan';

    $line1 = $institution->effective_line_1
        ?? ($institution->letterhead_line_1 ?? ($package->curriculum_code === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'));

    $line2 = $institution->letterhead_line_2 ?: $schoolName;
    $line3 = $institution->letterhead_line_3 ?: (!empty($institution->npsn) ? 'NPSN: ' . $institution->npsn : 'TERAKREDITASI');
    $subtext = $institution->effective_subtext ?? ($institution->letterhead_subtext ?? '');
@endphp

<!-- OFFICIAL LETTERHEAD (KOP SURAT) -->
@if($institution && $institution->header_style === 'FULL_IMAGE' && !empty($institution->letterhead_path))
    <div style="text-align: center; margin-bottom: 14px; border-bottom: 3px double #000; padding-bottom: 8px;">
        <img src="{{ asset('storage/' . $institution->letterhead_path) }}" style="max-width: 100%; max-height: 120px;" alt="Kop Surat">
    </div>
@else
    <table class="kop-table">
        <tr>
            <td style="width: 85px; text-align: center; vertical-align: middle;">
                <img src="{{ $logoUrl }}" class="kop-logo" alt="Logo">
            </td>
            <td class="kop-text" style="vertical-align: middle;">
                <div class="kop-line-1">{{ $line1 }}</div>
                <div class="kop-line-2">{{ $line2 }}</div>
                @if(!empty($line3))
                    <div class="kop-line-3">{{ $line3 }}</div>
                @endif
                @if(!empty($subtext))
                    <div class="kop-subtext">{{ $subtext }}</div>
                @endif
            </td>
            <td style="width: 85px; text-align: center; vertical-align: middle;">
                <!-- Balancer right column -->
            </td>
        </tr>
    </table>
@endif

<div class="doc-title-box">
    <div class="doc-title">KISI-KISI PENULISAN SOAL EVALUASI PEMBELAJARAN</div>
</div>

<table class="info-tbl">
    <tr>
        <td class="lbl">Kurikulum</td><td class="sep">:</td><td>{{ $package->curriculum_code === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC' }}</td>
        <td class="lbl">Jenis Asesmen</td><td class="sep">:</td><td>{{ str_replace('_', ' ', $package->assessment_type) }}</td>
    </tr>
    <tr>
        <td class="lbl">Mata Pelajaran</td><td class="sep">:</td><td>{{ $package->subject->name ?? '-' }}</td>
        <td class="lbl">Fase / Kelas</td><td class="sep">:</td><td>Fase {{ $package->phase->code ?? '-' }} / Kelas {{ $package->grade->grade_number ?? '-' }}</td>
    </tr>
    <tr>
        <td class="lbl">Nama Asesmen</td><td class="sep">:</td><td><b>{{ $package->title }}</b></td>
        <td class="lbl">Alokasi Waktu</td><td class="sep">:</td><td>{{ $package->duration_minutes ?? 90 }} Menit</td>
    </tr>
    <tr>
        <td class="lbl">Tahun Ajaran</td><td class="sep">:</td><td>{{ $package->academicYear->year_name ?? date('Y').'/'.(date('Y')+1) }}</td>
        <td class="lbl">Penyusun</td><td class="sep">:</td><td>{{ $package->creator->name ?? 'Guru Mata Pelajaran' }}</td>
    </tr>
</table>

<table class="kisi-tbl">
    <thead>
        <tr>
            <th style="width: 35px;">No</th>
            <th style="width: 140px;">Capaian / Tujuan Pembelajaran</th>
            <th>Indikator Soal</th>
            <th style="width: 75px;">Bentuk Soal</th>
            <th style="width: 65px;">Level Kognitif</th>
            <th style="width: 60px;">Tingkat Kognitif</th>
            <th style="width: 60px;">Kesulitan</th>
            <th style="width: 50px;">Bobot</th>
        </tr>
    </thead>
    <tbody>
        @forelse($package->matrices as $m)
            <tr>
                <td class="text-center font-bold">{{ $m->question_number }}</td>
                <td>{{ $m->learningGoal->code ?? 'TP' }}: {{ $m->learningGoal->pedagogical_description ?? '-' }}</td>
                <td>{{ $m->indicator_text }}</td>
                <td class="text-center font-bold">{{ $m->question_type }}</td>
                <td class="text-center font-bold">{{ $m->bloom_level }}</td>
                <td class="text-center">{{ $m->cognitive_tier }}</td>
                <td class="text-center">{{ $m->difficulty_level }}</td>
                <td class="text-center font-bold">{{ $m->score_weight }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="8" class="text-center">Belum ada kisi-kisi terdaftar.</td>
            </tr>
        @endforelse
    </tbody>
</table>

<!-- TANDA TANGAN -->
<table class="footer-sign">
    <tr>
        <td>
            Mengetahui,<br>
            <b>{{ $institution->signature_title ?? 'Kepala Madrasah / Sekolah' }}</b>
            <div class="sign-space"></div>
            <p class="sign-name">{{ $institution->principal_name ?? '....................................' }}</p>
            <p>NIP. {{ $institution->principal_id_number ?? '....................................' }}</p>
        </td>
        <td>
            {{ $institution->signature_city ?: ($institution->city ?: '................') }}, {{ date('d F Y') }}<br>
            <b>Guru Pengampu / Penyusun,</b>
            <div class="sign-space"></div>
            <p class="sign-name">{{ $package->creator->name ?? '....................................' }}</p>
            <p>NIP. {{ $package->creator->teacherProfiles->first()->nip ?? '....................................' }}</p>
        </td>
    </tr>
</table>

</body>
</html>
