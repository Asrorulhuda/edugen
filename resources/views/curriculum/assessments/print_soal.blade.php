<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Naskah Soal — {{ $package->title }}</title>
    <style>
        @page { size: A4; margin: 12mm 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.35; background: #fff; padding: 10px; }

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

        .doc-title-box { text-align: center; margin: 10px 0 8px; }
        .doc-title { font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #333; display: inline-block; padding: 0 20px 2px; letter-spacing: 0.5px; }

        .info-tbl { width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 1.5px solid #000; }
        .info-tbl td { padding: 4px 6px; font-size: 9pt; border: 1px solid #444; }
        .info-tbl td.lbl { width: 130px; font-weight: bold; background: #f5f5f5; }
        .info-tbl td.sep { width: 10px; text-align: center; font-weight: bold; }

        .petunjuk { background: #f9f9f9; border: 1px solid #ddd; border-left: 4px solid #333; padding: 6px 10px; margin-bottom: 12px; font-size: 9pt; }
        .petunjuk b { display: block; margin-bottom: 3px; font-size: 9.5pt; text-transform: uppercase; }

        .section-hdr { font-size: 9.5pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 4px 8px; margin: 12px 0 8px; border: 1px solid #ccc; border-left: 4px solid #333; }

        .soal-item { margin-bottom: 15px; page-break-inside: avoid; }
        .soal-flex-wrapper { display: flex; gap: 14px; align-items: flex-start; }
        .soal-flex-main { flex: 1; min-width: 0; line-height: 1.5; }
        .soal-flex-side { width: 170px; flex-shrink: 0; text-align: right; margin-top: 2px; }
        .soal-flex-side img { max-width: 170px; max-height: 130px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: #fff; }
        .soal-no { display: inline-block; width: 24px; font-weight: bold; vertical-align: top; }
        .soal-text { display: inline-block; width: calc(100% - 28px); vertical-align: top; text-align: justify; }
        .opsi-grid { margin: 6px 0 0 24px; display: flex; flex-direction: column; gap: 4px; }
        .opsi-item { display: flex; align-items: flex-start; gap: 6px; padding: 1.5px 0; text-align: justify; line-height: 1.45; }
        .opsi-letter { display: inline-block; min-width: 18px; font-weight: bold; flex-shrink: 0; }

        .footer-sign { margin-top: 25px; width: 100%; page-break-inside: avoid; }
        .footer-sign td { width: 50%; text-align: center; padding: 6px; vertical-align: top; font-size: 9pt; }
        .sign-space { height: 50px; }
        .sign-name { font-weight: bold; text-decoration: underline; text-transform: uppercase; }

        .no-print { padding: 8px 15px; background: #7c3aed; color: #fff; border: 0; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; margin-bottom: 12px; }
        @media print { .no-print { display: none; } body { padding: 0; } }
    </style>
</head>
<body>

<button class="no-print" onclick="window.print()">🖨️ Cetak Naskah Soal</button>

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
    <div class="doc-title">NASKAH SOAL EVALUASI PEMBELAJARAN</div>
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
        <td class="lbl">Pengampu</td><td class="sep">:</td><td>{{ $package->creator->name ?? 'Guru Mata Pelajaran' }}</td>
    </tr>
</table>

@if(!empty($package->instructions))
    <div class="petunjuk">
        <b>Petunjuk Pengerjaan:</b>
        {!! nl2br(e($package->instructions)) !!}
    </div>
@endif

@php
    $questions = $package->questions ?? collect();
    $pgQuestions = $questions->filter(fn($q) => strtoupper($q->question_type) === 'PG');
    $essayQuestions = $questions->filter(fn($q) => strtoupper($q->question_type) !== 'PG');
@endphp

@if($pgQuestions->count() > 0)
    <div class="section-hdr">I. Pilihan Ganda</div>
    @foreach($pgQuestions as $q)
        <div class="soal-item">
            <div class="soal-flex-wrapper">
                <div class="soal-flex-main">
                    <div class="soal-no">{{ $q->question_number }}.</div>
                    <div class="soal-text">{!! nl2br(e($q->question_text)) !!}</div>
                    @if(!empty($q->options_data) && is_array($q->options_data))
                        <div class="opsi-grid">
                            @foreach($q->options_data as $key => $val)
                                <div class="opsi-item">
                                    <span class="opsi-letter">{{ $key }}.</span>
                                    <span>{{ $val }}</span>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
                @if(!empty($q->image_path))
                    <div class="soal-flex-side">
                        <img src="{{ asset($q->image_path) }}" alt="Stimulus Visual">
                    </div>
                @endif
            </div>
        </div>
    @endforeach
@endif

@if($essayQuestions->count() > 0)
    <div class="section-hdr">II. Soal Uraian / Essay</div>
    @foreach($essayQuestions as $q)
        <div class="soal-item">
            <div class="soal-flex-wrapper">
                <div class="soal-flex-main">
                    <div class="soal-no">{{ $q->question_number }}.</div>
                    <div class="soal-text">{!! nl2br(e($q->question_text)) !!}</div>
                </div>
                @if(!empty($q->image_path))
                    <div class="soal-flex-side">
                        <img src="{{ asset($q->image_path) }}" alt="Stimulus Visual">
                    </div>
                @endif
            </div>
        </div>
    @endforeach
@endif

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
