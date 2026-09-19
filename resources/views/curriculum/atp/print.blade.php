<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Alur Tujuan Pembelajaran (ATP) - {{ $sequence->title }}</title>
    <style>
        @page { size: A4 landscape; margin: 12mm 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #000; background: #fff; line-height: 1.35; padding: 15px; }

        .kop-surat { display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 15px; text-align: center; }
        .kop-logo { width: 70px; height: 70px; object-fit: contain; }
        .kop-text { flex: 1; }
        .kop-text p.atas { font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
        .kop-text h1 { font-size: 15pt; font-weight: bold; text-transform: uppercase; line-height: 1.1; }
        .kop-text p.info { font-size: 8pt; color: #333; margin-top: 2px; }

        .doc-title-box { text-align: center; margin: 12px 0 10px; }
        .doc-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; display: inline-block; padding: 0 20px 2px; }

        .meta-tbl { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5pt; }
        .meta-tbl td { padding: 3px 6px; }
        .meta-tbl td.lbl { width: 160px; font-weight: bold; }
        .meta-tbl td.sep { width: 10px; text-align: center; }

        .data-tbl { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9pt; }
        .data-tbl th, .data-tbl td { border: 1.5px solid #000; padding: 5px 6px; vertical-align: top; }
        .data-tbl th { background: #f2f2f2; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 8.5pt; }
        .text-center { text-align: center; }

        .footer-sign { margin-top: 30px; width: 100%; page-break-inside: avoid; }
        .footer-sign td { width: 50%; text-align: center; padding: 6px; vertical-align: top; font-size: 9.5pt; }
        .sign-space { height: 55px; }
        .sign-name { font-weight: bold; text-decoration: underline; text-transform: uppercase; }

        .no-print { padding: 8px 16px; background: #059669; color: #fff; border: 0; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; margin-bottom: 15px; }
        @media print { .no-print { display: none; } body { padding: 0; } }
    </style>
</head>
<body>

<button class="no-print" onclick="window.print()">🖨️ Cetak Dokumen ATP</button>

<!-- KOP SURAT -->
<div class="kop-surat">
    @if(!empty($institution->logo_url))
        <div style="width: 75px; text-align: center;">
            <img src="{{ $institution->logo_url }}" class="kop-logo" alt="Logo">
        </div>
    @endif
    <div class="kop-text">
        <p class="atas">{{ $institution->parent_organization ?? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA' }}</p>
        <h1>{{ $institution->name ?? 'MADRASAH / SEKOLAH' }}</h1>
        <p class="info">
            {{ $institution->address ?? '' }}
            @if(!empty($institution->npsn)) | NPSN: {{ $institution->npsn }} @endif
            @if(!empty($institution->phone)) | Telp: {{ $institution->phone }} @endif
            @if(!empty($institution->email)) | Email: {{ $institution->email }} @endif
        </p>
    </div>
</div>

<div class="doc-title-box">
    <div class="doc-title">ALUR TUJUAN PEMBELAJARAN (ATP)</div>
</div>

<!-- INFORMASI IDENTITAS -->
<table class="meta-tbl">
    <tr>
        <td class="lbl">Satuan Pendidikan</td>
        <td class="sep">:</td>
        <td>{{ $institution->name ?? 'EduGen Workspace' }}</td>
        <td class="lbl">Fase / Kelas</td>
        <td class="sep">:</td>
        <td>Fase {{ $sequence->phase->code ?? '-' }} / Kelas {{ $sequence->grade->grade_number ?? '-' }}</td>
    </tr>
    <tr>
        <td class="lbl">Mata Pelajaran</td>
        <td class="sep">:</td>
        <td>{{ $sequence->subject->name ?? '-' }}</td>
        <td class="lbl">Tahun Pelajaran</td>
        <td class="sep">:</td>
        <td>{{ $sequence->academicYear->year_name ?? date('Y') . '/' . (date('Y') + 1) }}</td>
    </tr>
    <tr>
        <td class="lbl">Total Alokasi Waktu</td>
        <td class="sep">:</td>
        <td>{{ $sequence->total_hours_allocated ?? 72 }} Jam Pelajaran (JP)</td>
        <td class="lbl">Penyusun</td>
        <td class="sep">:</td>
        <td>{{ $sequence->user->name ?? 'Guru Pengampu' }}</td>
    </tr>
</table>

@if(!empty($sequence->rationale))
    <div style="margin-bottom: 12px; font-size: 9pt; background: #fdfdfd; border: 1px solid #ddd; padding: 6px 10px;">
        <b>Rasional & Pendekatan Pembelajaran:</b><br>
        {{ $sequence->rationale }}
    </div>
@endif

<!-- TABEL ALUR TUJUAN PEMBELAJARAN -->
<table class="data-tbl">
    <thead>
        <tr>
            <th style="width: 35px;">No</th>
            <th style="width: 65px;">Semester</th>
            <th style="width: 120px;">Elemen CP</th>
            <th>Tujuan Pembelajaran (TP)</th>
            <th style="width: 140px;">Materi / Konten Pokok</th>
            <th style="width: 45px;">Alokasi JP</th>
            <th>Indikator Ketercapaian (IKTP)</th>
            <th style="width: 110px;">Rencana Asesmen</th>
        </tr>
    </thead>
    <tbody>
        @php
            $alur = $sequence->sequence_data['alur'] ?? (is_array($sequence->sequence_data) ? $sequence->sequence_data : []);
        @endphp
        @forelse($alur as $idx => $item)
            <tr>
                <td class="text-center font-bold">{{ $item['nomor_urut'] ?? ($idx + 1) }}</td>
                <td class="text-center font-bold">{{ $item['semester'] ?? ($idx < count($alur)/2 ? 'Ganjil' : 'Genap') }}</td>
                <td><b>{{ $item['elemen'] ?? '-' }}</b></td>
                <td>
                    <b>{{ $item['tp_code'] ?? 'TP' }}:</b>
                    {{ $item['deskripsi_tp'] ?? ($item['description'] ?? '-') }}
                </td>
                <td>{{ $item['materi_pokok'] ?? ($item['content'] ?? '-') }}</td>
                <td class="text-center font-bold">{{ $item['alokasi_jp'] ?? 2 }} JP</td>
                <td>{{ $item['indikator_ketercapaian'] ?? '-' }}</td>
                <td>{{ $item['rencana_asesmen'] ?? 'Formatif & Sumatif' }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="8" class="text-center">Belum ada rincian alur yang tersusun.</td>
            </tr>
        @endforelse
    </tbody>
</table>

<!-- TANDA TANGAN -->
<table class="footer-sign">
    <tr>
        <td>
            Mengetahui,<br>
            <b>Kepala Madrasah / Sekolah</b>
            <div class="sign-space"></div>
            <p class="sign-name">{{ $institution->principal_name ?? '....................................' }}</p>
            <p>NIP. {{ $institution->principal_nip ?? '....................................' }}</p>
        </td>
        <td>
            {{ $institution->city ?? 'Jakarta' }}, {{ date('d F Y') }}<br>
            <b>Guru Pengampu,</b>
            <div class="sign-space"></div>
            <p class="sign-name">{{ $sequence->user->name ?? '....................................' }}</p>
            <p>NIP. {{ $sequence->user->teacherProfiles->first()->nip ?? '....................................' }}</p>
        </td>
    </tr>
</table>

</body>
</html>
