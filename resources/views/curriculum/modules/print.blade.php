<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modul Ajar Resmi - {{ $module->title }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm 15mm 18mm 18mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 11pt;
            color: #0f172a;
            line-height: 1.5;
            background: #ffffff;
            padding: 20px;
        }

        .no-print-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            margin-bottom: 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .btn-print {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            background: #059669;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-print:hover {
            background: #047857;
        }

        .btn-close {
            padding: 8px 16px;
            background: #ffffff;
            color: #475569;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }

        /* Official Letterhead (Kop Surat) */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 3px double #000000;
            padding-bottom: 8px;
            margin-bottom: 18px;
        }

        .kop-logo {
            width: 80px;
            height: 80px;
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

        /* Document Title Section */
        .doc-title-container {
            text-align: center;
            padding-bottom: 14px;
            margin-bottom: 18px;
            border-bottom: 2px solid #0f172a;
        }

        .curriculum-tag {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8.5pt;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #047857;
            text-transform: uppercase;
        }

        .doc-main-title {
            font-size: 13pt;
            font-weight: 800;
            text-transform: uppercase;
            margin: 4px 0 2px;
            color: #000000;
        }

        .doc-topic-subtitle {
            font-size: 11pt;
            font-weight: 700;
            color: #1e293b;
        }

        /* Section Headings */
        .sec-title {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 10.5pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #090d16;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 4px;
            margin: 18px 0 10px;
        }

        /* Info Table */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5pt;
            margin-bottom: 14px;
        }

        .meta-table td {
            padding: 3.5px 6px;
            vertical-align: top;
            border-bottom: 1px solid #f1f5f9;
        }

        .meta-table td.lbl {
            width: 200px;
            font-weight: 700;
            color: #334155;
        }

        .meta-table td.sep {
            width: 12px;
            text-align: center;
        }

        /* Boxes & Cards */
        .card-box {
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            margin: 6px 0 10px;
            font-size: 10.5pt;
            line-height: 1.5;
        }

        .card-box.highlight {
            border-left: 4px solid #059669;
            background-color: #f0fdf4;
        }

        .card-box.mindful {
            border-left: 4px solid #3b82f6;
            background-color: #eff6ff;
        }

        .card-box.joyful {
            border-left: 4px solid #f59e0b;
            background-color: #fffbeb;
        }

        .sub-header {
            font-weight: 700;
            color: #1e293b;
            margin: 10px 0 4px;
            font-size: 10.5pt;
        }

        .list-numbered, .list-bullet {
            margin-left: 22px;
            margin-bottom: 8px;
            font-size: 10.5pt;
        }

        .list-numbered li, .list-bullet li {
            margin-bottom: 3px;
        }

        /* Tables for Assessments */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            margin: 8px 0 14px;
        }

        .data-table th, .data-table td {
            border: 1px solid #94a3b8;
            padding: 6px 8px;
            vertical-align: top;
        }

        .data-table th {
            background-color: #f1f5f9;
            font-weight: 700;
            text-align: left;
            color: #0f172a;
        }

        /* 3 Columns Grid for Deep Learning */
        .grid-3-col {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0 12px;
        }

        .grid-3-col td {
            width: 33.33%;
            border: 1px solid #cbd5e1;
            padding: 8px;
            vertical-align: top;
            font-size: 9.5pt;
            background: #fafafa;
        }

        /* Signatures */
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 28px;
            page-break-inside: avoid;
            font-size: 10.5pt;
        }

        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 6px;
        }

        .ttd-spacer {
            height: 65px;
        }

        .ttd-name {
            font-weight: 700;
            text-decoration: underline;
            text-transform: uppercase;
        }

        @media print {
            .no-print-bar {
                display: none !important;
            }
            body {
                padding: 0 !important;
                background: #ffffff !important;
            }
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>

<div class="no-print-bar">
    <div>
        <strong style="color: #0f172a; font-size: 14px;">Pratinjau Dokumen Siap Cetak A4</strong>
        <p style="color: #64748b; font-size: 12px; margin-top: 2px;">Format resmi telah disesuaikan 100% presisi dengan tampilan RPP EduGen.</p>
    </div>
    <div style="display: flex; gap: 8px;">
        <button class="btn-print" onclick="window.print()">
            🖨️ Cetak Sekarang (Ctrl+P)
        </button>
        <button class="btn-close" onclick="window.close()">Tutup</button>
    </div>
</div>

@php
    $logoUrl = $institution->effective_logo_url
        ?? (!empty($institution->logo_path) ? asset('storage/' . $institution->logo_path) : ($institution && method_exists($institution, 'isMadrasah') && $institution->isMadrasah() ? asset('images/logos/kemenag.svg') : asset('images/logos/tutwuri.svg')));

    $schoolName = $module->generation_metadata['school_name']
        ?? ($institution->name ?? 'Satuan Pendidikan');

    $line1 = $institution->effective_line_1
        ?? ($institution->letterhead_line_1 ?? ($module->curriculum_code === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'));

    $line2 = $institution->letterhead_line_2 ?: $schoolName;
    $line3 = $institution->letterhead_line_3 ?: (!empty($institution->npsn) ? 'NPSN: ' . $institution->npsn : 'TERAKREDITASI');
    $subtext = $institution->effective_subtext ?? ($institution->letterhead_subtext ?? '');
@endphp

<!-- OFFICIAL LETTERHEAD (KOP SURAT) -->
@if($institution && $institution->header_style === 'FULL_IMAGE' && !empty($institution->letterhead_path))
    <div style="text-align: center; margin-bottom: 18px; border-bottom: 3px double #000; padding-bottom: 8px;">
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
                <div class="kop-subtext">{{ $subtext }}</div>
            </td>
            <td style="width: 85px; text-align: center; vertical-align: middle;">
                <!-- Balancer right column -->
            </td>
        </tr>
    </table>
@endif

<!-- DOCUMENT TITLE -->
<div class="doc-title-container">
    <div class="curriculum-tag">
        {{ $module->curriculum_code === 'MERDEKA'
            ? 'KURIKULUM MERDEKA (KEMENDIKBUDRISTEK)'
            : 'KURIKULUM MADRASAH BERBASIS CINTA (KMA 1503 TAHUN 2025)' }}
    </div>
    <h1 class="doc-main-title">MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN</h1>
    <div class="doc-topic-subtitle">{{ $module->topic_name ?? $module->title }}</div>
</div>

<!-- I. INFORMASI UMUM -->
<div class="sec-title">I. INFORMASI UMUM</div>
<table class="meta-table">
    <tr>
        <td class="lbl">Kerangka Kurikulum</td>
        <td class="sep">:</td>
        <td style="font-weight: 700; color: #1d4ed8;">
            {{ $module->curriculum_code === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC (KMA 1503/2025)' }}
        </td>
    </tr>
    <tr>
        <td class="lbl">Nama Penyusun / Guru</td>
        <td class="sep">:</td>
        <td style="font-weight: 600;">{{ $module->user->name ?? 'Guru Pengampu' }}</td>
    </tr>
    <tr>
        <td class="lbl">Satuan Pendidikan</td>
        <td class="sep">:</td>
        <td style="font-weight: 700; color: #0f172a;">{{ $schoolName }}</td>
    </tr>
    <tr>
        <td class="lbl">Mata Pelajaran</td>
        <td class="sep">:</td>
        <td>{{ $module->subject->name ?? '-' }}</td>
    </tr>
    <tr>
        <td class="lbl">Fase / Kelas / Semester</td>
        <td class="sep">:</td>
        <td>
            Fase {{ $module->phase->name ?? ($module->phase->code ?? '-') }} / Kelas {{ $module->grade->grade_number ?? '-' }}
            @if($module->semester) / {{ $module->semester->label ?? $module->semester->type }} @endif
        </td>
    </tr>
    <tr>
        <td class="lbl">Alokasi Waktu</td>
        <td class="sep">:</td>
        <td>{{ $module->meeting_count ?? 1 }} Pertemuan ({{ $module->total_hours ?? 2 }} JP @ 40 menit)</td>
    </tr>
    <tr>
        <td class="lbl">Model Pembelajaran</td>
        <td class="sep">:</td>
        <td>{{ $module->learning_model ?? 'Problem Based Learning (PBL)' }}</td>
    </tr>
    @if(!empty($module->prerequisite_knowledge))
        <tr>
            <td class="lbl">Kompetensi Awal</td>
            <td class="sep">:</td>
            <td>{{ $module->prerequisite_knowledge }}</td>
        </tr>
    @endif
</table>

<!-- II. KOMPONEN INTI & TUJUAN PEMBELAJARAN -->
<div class="sec-title">II. KOMPONEN INTI & TUJUAN PEMBELAJARAN</div>

<!-- CP Acuan Resmi -->
@if(!empty($learningOutcomes) && count($learningOutcomes) > 0)
    <div class="sub-header">A. Capaian Pembelajaran (CP) Acuan Resmi:</div>
    @foreach($learningOutcomes as $lo)
        <div class="card-box highlight">
            <strong style="color: #065f46; display: block; margin-bottom: 2px;">Elemen {{ $lo['element'] ?? 'Terkait' }}:</strong>
            <span style="font-style: italic;">"{{ $lo['cp_text'] ?? '' }}"</span>
        </div>
    @endforeach
@endif

<!-- TP Terpilih -->
<div class="sub-header">
    {{ (!empty($learningOutcomes) && count($learningOutcomes) > 0) ? 'B. Tujuan Pembelajaran (TP) Terpilih:' : 'A. Tujuan Pembelajaran (TP):' }}
</div>
<ol class="list-numbered">
    @if(!empty($goals) && $goals->count() > 0)
        @foreach($goals as $idx => $g)
            <li>
                <strong>[{{ $g->code ?? 'TP-'.($idx+1) }}]</strong>
                {{ $g->pedagogical_description ?? ($g->material_content ?? '-') }}
                @if(!empty($g->bloom_level)) (Bloom {{ $g->bloom_level }}) @endif
            </li>
        @endforeach
    @else
        <li>Peserta didik mampu memahami dan menyelesaikan masalah kontekstual materi secara mendalam.</li>
    @endif
</ol>

<!-- Profil Pelajar Pancasila / DPL -->
@if(!empty($module->profil_lulusan_targets) && is_array($module->profil_lulusan_targets))
    <div class="sub-header">
        {{ (!empty($learningOutcomes) && count($learningOutcomes) > 0) ? 'C. ' : 'B. ' }}
        {{ $module->curriculum_code === 'MERDEKA' ? 'Profil Pelajar Pancasila (P3):' : 'Dimensi Profil Lulusan (DPL):' }}
    </div>
    <div style="margin-bottom: 10px;">
        @foreach($module->profil_lulusan_targets as $tgt)
            <span style="display: inline-block; padding: 2px 8px; margin: 2px 4px 2px 0; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 9.5pt; font-weight: 600;">
                {{ $tgt }}
            </span>
        @endforeach
    </div>
@endif

<!-- Pemahaman Bermakna & Pertanyaan Pemantik -->
<div class="sub-header">
    {{ $module->curriculum_code === 'MERDEKA' ? 'D. Pemahaman Bermakna (Meaningful Learning):' : 'D. Materi Integrasi KBC & Pemahaman Bermakna:' }}
</div>
<div class="card-box" style="font-style: italic;">
    "{{ $module->meaningful_understanding ?? 'Memahami relevansi fungsional materi dalam pemecahan masalah kehidupan nyata murid.' }}"
</div>

@if(!empty($module->inquiry_questions) && is_array($module->inquiry_questions))
    <div class="sub-header">E. Pertanyaan Pemantik:</div>
    <ul class="list-bullet">
        @foreach($module->inquiry_questions as $q)
            <li>{{ $q }}</li>
        @endforeach
    </ul>
@endif

<!-- Panca Cinta KBC -->
@if($module->curriculum_code === 'MADRASAH_KBC' && !empty($module->panca_cinta_integration) && is_array($module->panca_cinta_integration))
    <div class="sub-header" style="color: #9f1239;">F. Integrasi Nilai Panca Cinta (KMA 1503/2025):</div>
    <div style="margin-bottom: 10px;">
        @foreach($module->panca_cinta_integration as $pc)
            <div style="padding: 4px 8px; margin-bottom: 4px; background: #fff1f2; border-left: 3px solid #f43f5e; font-size: 9.5pt;">
                {{ $pc }}
            </div>
        @endforeach
    </div>
@endif

<!-- Pendekatan 3 Pilar Deep Learning -->
@if(!empty($module->deep_learning_activities) && is_array($module->deep_learning_activities))
    <div class="sub-header" style="color: #3730a3;">
        {{ $module->curriculum_code === 'MERDEKA' ? 'G. Desain Pengalaman Belajar:' : 'G. Pendekatan 3 Pilar Deep Learning:' }}
    </div>
    <table class="grid-3-col">
        <tr>
            <td>
                <strong style="color: #1e3a8a; display: block; margin-bottom: 4px;">1. Mindful Learning:</strong>
                {{ $module->deep_learning_activities['mindful'] ?? ($module->deep_learning_activities['kemitraan'] ?? 'Melatih kesadaran penuh, konsentrasi, dan kehadiran utuh sebelum belajar.') }}
            </td>
            <td>
                <strong style="color: #1e3a8a; display: block; margin-bottom: 4px;">2. Meaningful Learning:</strong>
                {{ $module->deep_learning_activities['meaningful'] ?? ($module->deep_learning_activities['digital'] ?? 'Menghubungkan materi dengan konteks riil kehidupan dan pemanfaatannya.') }}
            </td>
            <td>
                <strong style="color: #1e3a8a; display: block; margin-bottom: 4px;">3. Joyful Learning:</strong>
                {{ $module->deep_learning_activities['joyful'] ?? 'Menciptakan suasana eksplorasi belajar yang menggembirakan dan suportif.' }}
            </td>
        </tr>
    </table>
@endif

<!-- III. KEGIATAN PEMBELAJARAN -->
<div class="sec-title">III. KEGIATAN PEMBELAJARAN</div>

@if(is_array($module->learning_steps) && isset($module->learning_steps[0]['meeting']))
    @foreach($module->learning_steps as $step)
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px; page-break-inside: avoid;">
            <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: 800; font-size: 10.5pt; text-transform: uppercase; margin-bottom: 8px;">
                Pertemuan Ke-{{ $step['meeting'] ?? 1 }} ({{ $step['duration_minutes'] ?? 80 }} Menit)
            </div>

            @if(!empty($step['preliminary']))
                <div style="margin-bottom: 6px;">
                    <strong style="color: #1e293b;">1. Kegiatan Pendahuluan (10 Menit):</strong>
                    <ul class="list-bullet" style="margin-top: 2px;">
                        @foreach((array)$step['preliminary'] as $line)
                            <li>{{ $line }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(!empty($step['core']))
                <div style="margin-bottom: 6px;">
                    <strong style="color: #1e293b;">2. Kegiatan Inti ({{ (int)($step['duration_minutes'] ?? 80) - 20 }} Menit):</strong>
                    <ul class="list-bullet" style="margin-top: 2px;">
                        @foreach((array)$step['core'] as $line)
                            <li>{{ $line }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(!empty($step['closing']))
                <div>
                    <strong style="color: #1e293b;">3. Kegiatan Penutup & Refleksi (10 Menit):</strong>
                    <ul class="list-bullet" style="margin-top: 2px;">
                        @foreach((array)$step['closing'] as $line)
                            <li>{{ $line }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>
    @endforeach
@elseif(is_array($module->learning_steps))
    <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px;">
        <div style="margin-bottom: 10px;">
            <div style="background: #f1f5f9; padding: 3px 8px; font-weight: 700; font-size: 10pt; text-transform: uppercase; margin-bottom: 4px;">
                1. Kegiatan Pendahuluan / Awal (10-15 Menit)
            </div>
            @if(!empty($module->learning_steps['awal_berkesadaran']))
                <div class="card-box mindful">
                    <strong>a. Berkesadaran (Mindful / Pembiasaan Diri):</strong><br>
                    {!! nl2br(e($module->learning_steps['awal_berkesadaran'])) !!}
                </div>
            @endif
            @if(!empty($module->learning_steps['awal_apersepsi']))
                <div class="card-box highlight">
                    <strong>b. Apersepsi & Pertanyaan Pemantik:</strong><br>
                    {!! nl2br(e($module->learning_steps['awal_apersepsi'])) !!}
                </div>
            @endif
        </div>

        <div style="margin-bottom: 10px;">
            <div style="background: #f1f5f9; padding: 3px 8px; font-weight: 700; font-size: 10pt; text-transform: uppercase; margin-bottom: 4px;">
                2. Kegiatan Inti (Eksplorasi & Diferensiasi) (50-60 Menit)
            </div>
            @if(!empty($module->learning_steps['inti_memahami']))
                <div class="card-box">
                    <strong>a. Memahami (Literasi & Pembentukan Konsep):</strong><br>
                    {!! nl2br(e($module->learning_steps['inti_memahami'])) !!}
                </div>
            @endif
            @if(!empty($module->learning_steps['inti_mengaplikasi']))
                <div class="card-box">
                    <strong>b. Mengaplikasikan (Studi Kasus & Kolaborasi):</strong><br>
                    {!! nl2br(e($module->learning_steps['inti_mengaplikasi'])) !!}
                </div>
            @endif
            @if(!empty($module->learning_steps['inti_merefleksi']))
                <div class="card-box">
                    <strong>c. Merefleksikan (Umpan Balik & Penguatan):</strong><br>
                    {!! nl2br(e($module->learning_steps['inti_merefleksi'])) !!}
                </div>
            @endif
        </div>

        <div>
            <div style="background: #f1f5f9; padding: 3px 8px; font-weight: 700; font-size: 10pt; text-transform: uppercase; margin-bottom: 4px;">
                3. Kegiatan Penutup & Refleksi (10-15 Menit)
            </div>
            @if(!empty($module->learning_steps['penutup']))
                <div class="card-box joyful">
                    {!! nl2br(e($module->learning_steps['penutup'])) !!}
                </div>
            @endif
        </div>
    </div>
@endif

<!-- IV. RENCANA ASESMEN -->
<div class="sec-title">IV. RENCANA ASESMEN</div>
<table class="data-table">
    <thead>
        <tr>
            <th style="width: 25%;">Jenis Asesmen</th>
            <th style="width: 35%;">Bentuk & Teknik</th>
            <th style="width: 40%;">Fokus Indikator Ketercapaian</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>1. Asesmen Diagnostik (Awal)</strong></td>
            <td>{{ is_array($module->diagnostic_assessment) ? ($module->diagnostic_assessment['bentuk'] ?? 'Tanya jawab pemantik & observasi kesiapan') : ($module->diagnostic_assessment ?? 'Tanya jawab pemantik') }}</td>
            <td>{{ is_array($module->diagnostic_assessment) ? ($module->diagnostic_assessment['tujuan'] ?? 'Kesiapan belajar & pemetaan awal murid') : 'Kesiapan & pemahaman awal peserta didik' }}</td>
        </tr>
        <tr>
            <td><strong>2. Asesmen Formatif (Proses)</strong></td>
            <td>{{ is_array($module->formative_assessment) ? ($module->formative_assessment['bentuk'] ?? 'Observasi keterlibatan, LKPD, rubrik performa') : ($module->formative_assessment ?? 'Observasi keterlibatan & rubrik performa') }}</td>
            <td>{{ is_array($module->formative_assessment) ? ($module->formative_assessment['rubrik'] ?? 'Keterlibatan aktif, kolaborasi, dan adab belajar') : 'Keterlibatan aktif & sikap kolaboratif' }}</td>
        </tr>
        <tr>
            <td><strong>3. Asesmen Sumatif (Akhir)</strong></td>
            <td>{{ is_array($module->summative_assessment) ? ($module->summative_assessment['bentuk'] ?? 'Tes tertulis / unjuk kerja / produk karya') : ($module->summative_assessment ?? 'Tes tertulis & rubrik produk') }}</td>
            <td>{{ is_array($module->summative_assessment) ? ($module->summative_assessment['kriteria'] ?? 'Ketercapaian Tujuan Pembelajaran (TP) secara tuntas') : 'Ketercapaian Tujuan Pembelajaran (TP)' }}</td>
        </tr>
    </tbody>
</table>

<!-- V. TINDAK LANJUT, LAMPIRAN & REFERENSI -->
@if(!empty($module->student_worksheet_text) || !empty($module->reading_materials) || !empty($module->glossary) || !empty($module->bibliography))
    <div class="sec-title">V. TINDAK LANJUT, LAMPIRAN & REFERENSI</div>

    @if(!empty($module->student_worksheet_text))
        <div class="sub-header">A. Lembar Kerja Peserta Didik (LKPD):</div>
        <div class="card-box" style="white-space: pre-line;">{!! e($module->student_worksheet_text) !!}</div>
    @endif

    @if(!empty($module->reading_materials))
        <div class="sub-header">B. Bahan Bacaan Guru & Peserta Didik:</div>
        <div class="card-box" style="white-space: pre-line;">{!! e($module->reading_materials) !!}</div>
    @endif

    @if(!empty($module->glossary) && is_array($module->glossary))
        <div class="sub-header">C. Glosarium Istilah:</div>
        <ul class="list-bullet">
            @foreach($module->glossary as $item)
                <li>
                    @if(is_array($item))
                        <strong>{{ $item['term'] ?? ($item['istilah'] ?? '') }}:</strong> {{ $item['meaning'] ?? ($item['definisi'] ?? '') }}
                    @else
                        {{ $item }}
                    @endif
                </li>
            @endforeach
        </ul>
    @endif

    @if(!empty($module->bibliography))
        <div class="sub-header">D. Daftar Pustaka:</div>
        <div class="card-box" style="white-space: pre-line;">{!! e($module->bibliography) !!}</div>
    @endif
@endif

<!-- OFFICIAL SIGNATURES -->
<table class="signature-table">
    <tr>
        <td>
            Mengetahui,<br>
            <strong>{{ $institution->signature_title ?? ($module->curriculum_code === 'MERDEKA' ? 'Kepala Sekolah' : 'Kepala Madrasah') }}</strong>
            <div class="ttd-spacer"></div>
            <div class="ttd-name">{{ $institution->principal_name ?? '(Nama Kepala Sekolah)' }}</div>
            <div style="font-size: 9.5pt; color: #334155; margin-top: 2px;">
                NIP. {{ $institution->principal_id_number ?? '....................................' }}
            </div>
        </td>
        <td>
            {{ $institution->signature_city ?? ($institution->city ?? 'Bekasi') }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
            <strong>Guru Mata Pelajaran</strong>
            <div class="ttd-spacer"></div>
            <div class="ttd-name">{{ $module->user->name ?? 'Pendidik Resmi' }}</div>
            <div style="font-size: 9.5pt; color: #334155; margin-top: 2px;">
                @if($module->user?->teacherProfiles?->first()?->employee_no)
                    NIP. {{ $module->user->teacherProfiles->first()->employee_no }}
                @elseif($module->user?->teacherProfiles?->first()?->nuptk)
                    NUPTK. {{ $module->user->teacherProfiles->first()->nuptk }}
                @else
                    Pendidik Resmi EduGen
                @endif
            </div>
        </td>
    </tr>
</table>

</body>
</html>
