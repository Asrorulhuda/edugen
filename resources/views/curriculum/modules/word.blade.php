<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Modul Ajar - {{ $module->title }}</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page Section1 {
            size: 21.0cm 29.7cm; /* Ukuran Kertas A4 */
            margin: 2.0cm 2.0cm 2.0cm 2.5cm; /* Atas, Kanan, Bawah, Kiri */
            mso-page-orientation: portrait;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
        }
        div.Section1 {
            page: Section1;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.35;
            color: #000000;
            margin: 0;
            padding: 0;
        }

        p, li {
            margin-top: 0pt;
            margin-bottom: 3.5pt;
            line-height: 1.35;
            text-align: justify;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%;
        }

        td, th {
            vertical-align: top;
            padding: 3.5pt 5pt;
            font-size: 11pt;
            line-height: 1.3;
        }

        /* Kop Surat Presisi Berbasis Tabel */
        .tbl-kop {
            width: 100%;
            border-bottom: 2.5pt double #000000;
            margin-bottom: 12pt;
        }
        .tbl-kop td {
            padding: 2pt 4pt;
        }
        .kop-instansi {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
            line-height: 1.2;
        }
        .kop-nama {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 2pt 0;
            line-height: 1.15;
        }
        .kop-sub {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }
        .kop-kontak {
            font-size: 8.5pt;
            color: #222222;
            margin: 3pt 0 0 0;
            line-height: 1.2;
        }

        /* Judul Dokumen */
        .tbl-title {
            width: 100%;
            margin-bottom: 12pt;
            text-align: center;
        }
        .doc-main-title {
            font-size: 12.5pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
            letter-spacing: 0.5pt;
        }
        .doc-sub-title {
            font-size: 9.5pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #334155;
            margin-top: 2.5pt;
        }

        /* Bar Header Seksi */
        .tbl-section-bar {
            width: 100%;
            background-color: #f1f5f9;
            border-top: 1pt solid #cbd5e1;
            border-bottom: 1pt solid #cbd5e1;
            border-left: 4.5pt solid #0f172a;
            margin-top: 12pt;
            margin-bottom: 6pt;
        }
        .tbl-section-bar td {
            padding: 4pt 8pt;
            font-weight: bold;
            font-size: 10.5pt;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4pt;
        }

        /* Tabel Identitas */
        .tbl-identitas {
            width: 100%;
            margin-bottom: 8pt;
        }
        .tbl-identitas td {
            padding: 2.5pt 4pt;
            font-size: 10.5pt;
        }
        .tbl-identitas .lbl {
            width: 26%;
            font-weight: bold;
        }
        .tbl-identitas .sep {
            width: 3%;
            text-align: center;
        }
        .tbl-identitas .val {
            width: 71%;
        }

        /* Box / Kuotasi Capaian Pembelajaran */
        .tbl-cp-box {
            width: 100%;
            margin-bottom: 5pt;
            border-left: 3pt solid #475569;
            background-color: #f8fafc;
        }
        .tbl-cp-box td {
            padding: 4pt 8pt;
            font-size: 10.5pt;
        }

        /* Tabel Tanda Tangan */
        .tbl-ttd {
            width: 100%;
            margin-top: 24pt;
            page-break-inside: avoid;
        }
        .tbl-ttd td {
            width: 50%;
            text-align: center;
            padding: 4pt 6pt;
            font-size: 11pt;
            vertical-align: top;
        }
        .ttd-space {
            height: 52pt;
        }
        .ttd-name {
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            margin-bottom: 1.5pt;
        }
        .ttd-nip {
            font-size: 10pt;
            color: #222222;
        }
    </style>
</head>
<body>
<div class="Section1">

    <!-- 1. KOP SURAT RESMI -->
    @php
        $schoolName = $module->generation_metadata['school_name'] ?? ($institution->name ?? 'Satuan Pendidikan');
        $line1 = $institution->effective_line_1 ?? ($institution->letterhead_line_1 ?? ($module->curriculum_code === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'));
        $line2 = $institution->letterhead_line_2 ?: $schoolName;
        $line3 = $institution->letterhead_line_3 ?: (!empty($institution->npsn) ? 'NPSN: ' . $institution->npsn : 'TERAKREDITASI');
        $subtext = $institution->effective_subtext ?? ($institution->letterhead_subtext ?? '');
    @endphp

    @if($institution && $institution->header_style === 'FULL_IMAGE' && !empty($letterheadBase64))
        <div style="text-align: center; margin-bottom: 12pt; border-bottom: 2.5pt double #000000; padding-bottom: 6pt;">
            <img src="{{ $letterheadBase64 }}" style="max-width: 100%; max-height: 110px;" alt="Kop Surat">
        </div>
    @else
        <table class="tbl-kop" border="0" cellspacing="0" cellpadding="0">
            <tr>
                @if(!empty($logoBase64))
                    <td style="width: 75px; text-align: center; vertical-align: middle;">
                        <img src="{{ $logoBase64 }}" width="65" height="65" style="width: 65px; height: 65px;" alt="Logo">
                    </td>
                @endif
                <td style="text-align: center; vertical-align: middle;">
                    <p class="kop-instansi">{{ $line1 }}</p>
                    <h1 class="kop-nama">{{ $line2 }}</h1>
                    @if(!empty($line3))
                        <p class="kop-sub">{{ $line3 }}</p>
                    @endif
                    <p class="kop-kontak">{{ $subtext }}</p>
                </td>
                @if(!empty($logoBase64))
                    <td style="width: 75px; text-align: center; vertical-align: middle;"></td>
                @endif
            </tr>
        </table>
    @endif

    <!-- 2. JUDUL DOKUMEN -->
    <table class="tbl-title" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td style="text-align: center;">
                <div class="doc-sub-title" style="color: #047857; margin-bottom: 2pt;">
                    {{ $module->curriculum_code === 'MERDEKA'
                        ? 'KURIKULUM MERDEKA (KEMENDIKBUDRISTEK)'
                        : 'KURIKULUM MADRASAH BERBASIS CINTA (KMA 1503 TAHUN 2025)' }}
                </div>
                <div class="doc-main-title">MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN</div>
                <div style="font-size: 11pt; font-weight: bold; margin-top: 3pt;">
                    {{ $module->topic_name ?? $module->title }}
                </div>
            </td>
        </tr>
    </table>

    <!-- I. INFORMASI UMUM -->
    <table class="tbl-section-bar"><tr><td>I. INFORMASI UMUM</td></tr></table>
    <table class="tbl-identitas" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="lbl">Kerangka Kurikulum</td>
            <td class="sep">:</td>
            <td class="val" style="font-weight: bold; color: #1d4ed8;">
                {{ $module->curriculum_code === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC (KMA 1503/2025)' }}
            </td>
        </tr>
        <tr>
            <td class="lbl">Nama Penyusun / Guru</td>
            <td class="sep">:</td>
            <td class="val"><b>{{ $module->user->name ?? 'Guru Pengampu' }}</b></td>
        </tr>
        <tr>
            <td class="lbl">Satuan Pendidikan</td>
            <td class="sep">:</td>
            <td class="val"><b>{{ $schoolName }}</b></td>
        </tr>
        <tr>
            <td class="lbl">Mata Pelajaran</td>
            <td class="sep">:</td>
            <td class="val">{{ $module->subject->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="lbl">Fase / Kelas</td>
            <td class="sep">:</td>
            <td class="val">Fase {{ $module->phase->code ?? '-' }} / Kelas {{ $module->grade->grade_number ?? '-' }}</td>
        </tr>
        <tr>
            <td class="lbl">Topik / Materi Pokok</td>
            <td class="sep">:</td>
            <td class="val"><b>{{ $module->topic_name ?? $module->title }}</b></td>
        </tr>
        <tr>
            <td class="lbl">Alokasi Waktu</td>
            <td class="sep">:</td>
            <td class="val">{{ $module->total_hours ?? 2 }} JP ({{ $module->meeting_count ?? 1 }} Pertemuan)</td>
        </tr>
        <tr>
            <td class="lbl">Tahun Pelajaran / Semester</td>
            <td class="sep">:</td>
            <td class="val">{{ $module->academicYear->year_name ?? date('Y').'/'.(date('Y')+1) }} / {{ $module->semester->type ?? 'Ganjil' }}</td>
        </tr>
    </table>

    <!-- II. KOMPONEN INTI & TUJUAN PEMBELAJARAN -->
    <table class="tbl-section-bar"><tr><td>II. KOMPONEN INTI & TUJUAN PEMBELAJARAN</td></tr></table>

    @if(!empty($learningOutcomes) && count($learningOutcomes) > 0)
        <p><b>A. Capaian Pembelajaran (CP) Acuan Resmi:</b></p>
        @foreach($learningOutcomes as $lo)
            <table class="tbl-cp-box">
                <tr>
                    <td>
                        <b>Elemen: {{ $lo['element'] ?? 'Umum' }}</b><br>
                        <i>"{{ $lo['cp_text'] ?? '' }}"</i>
                    </td>
                </tr>
            </table>
        @endforeach
        <div style="height: 2pt;"></div>
    @endif

    <p><b>{{ (!empty($learningOutcomes) && count($learningOutcomes) > 0) ? 'B' : 'A' }}. Tujuan Pembelajaran (TP) Terpilih:</b></p>
    <div style="margin-left: 14pt;">
        @if(!empty($goals) && $goals->count() > 0)
            @foreach($goals as $idx => $g)
                <p><b>{{ $idx + 1 }}. [{{ $g->code ?? 'TP-'.($idx+1) }}]</b> {{ $g->pedagogical_description ?? $g->code }} <i>(Bloom: {{ $g->bloom_level ?? 'C2' }})</i></p>
            @endforeach
        @else
            <p>1. Peserta didik mampu memahami dan menerapkan materi pembelajaran secara mendalam dan kontekstual.</p>
        @endif
    </div>

    <p><b>{{ (!empty($learningOutcomes) && count($learningOutcomes) > 0) ? 'C' : 'B' }}. {{ $module->curriculum_code === 'MERDEKA' ? 'Profil Pelajar Pancasila (P3)' : 'Dimensi Profil Lulusan (DPL)' }}:</b></p>
    <div style="margin-left: 14pt;">
        @if(is_array($module->profil_lulusan_targets))
            @foreach($module->profil_lulusan_targets as $dpl)
                <p>• {{ $dpl }}</p>
            @endforeach
        @else
            <p>{!! nl2br(e($module->profil_lulusan_targets ?? '-')) !!}</p>
        @endif
    </div>

    <p><b>{{ $module->curriculum_code === 'MERDEKA' ? 'D. Pemahaman Bermakna (Meaningful Learning):' : 'D. Materi Integrasi Nilai KBC & Pemahaman Bermakna:' }}</b></p>
    <p style="margin-left: 14pt;">
        <i>"{!! nl2br(e($module->meaningful_understanding ?? ($module->curriculum_code === 'MERDEKA' ? 'Memahami relevansi fungsional materi dalam kehidupan nyata peserta didik.' : 'Membiasakan murid menjaga adab belajar, kejujuran, dan keselamatan sebagai wujud syukur atas anugerah Allah SWT.'))) !!}"</i>
    </p>

    @if(!empty($module->inquiry_questions) && is_array($module->inquiry_questions))
        <p><b>E. Pertanyaan Pemantik:</b></p>
        <div style="margin-left: 14pt;">
            @foreach($module->inquiry_questions as $q)
                <p>• {{ $q }}</p>
            @endforeach
        </div>
    @endif

    @if($module->curriculum_code === 'MADRASAH_KBC' && !empty($module->panca_cinta_integration) && is_array($module->panca_cinta_integration))
        <p><b>F. Integrasi Nilai Panca Cinta (KMA 1503/2025):</b></p>
        <div style="margin-left: 14pt;">
            @foreach($module->panca_cinta_integration as $pc)
                <p>• {{ $pc }}</p>
            @endforeach
        </div>
    @endif

    <p><b>G. Pendekatan & Pengalaman Belajar (Deep Learning):</b></p>
    <div style="margin-left: 14pt;">
        <p><b>1. Praktik Pedagogis:</b> {!! nl2br(e($module->learning_model ?? 'Problem Based Learning (PBL)')) !!}</p>
        <p><b>2. Mindful Learning:</b> {!! nl2br(e(is_array($module->deep_learning_activities) ? ($module->deep_learning_activities['mindful'] ?? ($module->deep_learning_activities['kemitraan'] ?? 'Melatih kesadaran penuh dan fokus belajar.')) : 'Melatih kesadaran penuh dan fokus belajar.')) !!}</p>
        <p><b>3. Meaningful Learning:</b> {!! nl2br(e(is_array($module->deep_learning_activities) ? ($module->deep_learning_activities['meaningful'] ?? ($module->deep_learning_activities['digital'] ?? 'Mengaitkan materi dengan konteks riil kehidupan murid.')) : 'Mengaitkan materi dengan konteks riil kehidupan murid.')) !!}</p>
        <p><b>4. Joyful Learning:</b> {!! nl2br(e(is_array($module->deep_learning_activities) ? ($module->deep_learning_activities['joyful'] ?? 'Menciptakan iklim pembelajaran yang menyenangkan dan apresiatif.') : 'Menciptakan iklim pembelajaran yang menyenangkan dan apresiatif.')) !!}</p>
    </div>

    <!-- III. KEGIATAN PEMBELAJARAN -->
    <table class="tbl-section-bar"><tr><td>III. KEGIATAN PEMBELAJARAN</td></tr></table>
    @php
        $steps = is_array($module->learning_steps) ? $module->learning_steps : [];
        $dAct = is_array($module->deep_learning_activities) ? $module->deep_learning_activities : [];
    @endphp

    @if(isset($steps[0]['meeting']))
        @foreach($steps as $step)
            <p><b>Pertemuan Ke-{{ $step['meeting'] ?? 1 }} ({{ $step['duration_minutes'] ?? 80 }} Menit)</b></p>
            @if(!empty($step['preliminary']))
                <div style="margin-left: 14pt;">
                    <p><b>1. Kegiatan Pendahuluan (10 Menit):</b></p>
                    @foreach((array)$step['preliminary'] as $line)
                        <p>• {{ $line }}</p>
                    @endforeach
                </div>
            @endif
            @if(!empty($step['core']))
                <div style="margin-left: 14pt;">
                    <p><b>2. Kegiatan Inti ({{ (int)($step['duration_minutes'] ?? 80) - 20 }} Menit):</b></p>
                    @foreach((array)$step['core'] as $line)
                        <p>• {{ $line }}</p>
                    @endforeach
                </div>
            @endif
            @if(!empty($step['closing']))
                <div style="margin-left: 14pt;">
                    <p><b>3. Kegiatan Penutup (10 Menit):</b></p>
                    @foreach((array)$step['closing'] as $line)
                        <p>• {{ $line }}</p>
                    @endforeach
                </div>
            @endif
            <div style="height: 4pt;"></div>
        @endforeach
    @else
        <p><b>1. Kegiatan Awal (Berkesadaran, Bermakna) [Alokasi: {{ $dAct['waktu_pendahuluan'] ?? '10 Menit' }}]</b></p>
        <div style="margin-left: 14pt;">
            <p><b>a. Berkesadaran (Mindful):</b> {!! nl2br(e($steps['awal_berkesadaran'] ?? 'Guru memandu latihan hening sejenak untuk memusatkan konsentrasi.')) !!}</p>
            <p><b>b. Apersepsi:</b> {!! nl2br(e($steps['awal_apersepsi'] ?? 'Guru mengaitkan materi dengan pengalaman nyata murid.')) !!}</p>
        </div>

        <p><b>2. Kegiatan Inti [Alokasi: {{ $dAct['waktu_inti'] ?? '50 Menit' }}]</b></p>
        <div style="margin-left: 14pt;">
            <p><b>a. Memahami (Joyful):</b> {!! nl2br(e($steps['inti_memahami'] ?? 'Murid mengeksplorasi wacana konsep secara interaktif.')) !!}</p>
            <p><b>b. Mengaplikasi (Meaningful):</b> {!! nl2br(e($steps['inti_mengaplikasi'] ?? 'Murid menyelesaikan studi kasus nyata dalam kelompok.')) !!}</p>
            <p><b>c. Merefleksi (Mindful):</b> {!! nl2br(e($steps['inti_merefleksi'] ?? 'Murid memaparkan hasil telaah dan saling mengapresiasi karya.')) !!}</p>
        </div>

        <p><b>3. Kegiatan Penutup (Berkesadaran) [Alokasi: {{ $dAct['waktu_penutup'] ?? '10 Menit' }}]</b></p>
        <div style="margin-left: 14pt;">
            <p>{!! nl2br(e($steps['penutup'] ?? 'Menyimpulkan intisari pembelajaran, refleksi, dan doa bersama.')) !!}</p>
        </div>
    @endif

    <!-- IV. RENCANA ASESMEN -->
    <table class="tbl-section-bar"><tr><td>IV. RENCANA ASESMEN</td></tr></table>
    <table class="tbl-identitas" border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; margin-bottom: 8pt;">
        <tr style="background-color: #f1f5f9;">
            <th style="width: 25%; text-align: left;">Jenis Asesmen</th>
            <th style="width: 35%; text-align: left;">Bentuk & Teknik</th>
            <th style="width: 40%; text-align: left;">Fokus Indikator</th>
        </tr>
        <tr>
            <td><b>1. Asesmen Diagnostik</b></td>
            <td>{{ is_array($module->diagnostic_assessment) ? ($module->diagnostic_assessment['bentuk'] ?? 'Tanya jawab pemantik') : ($module->diagnostic_assessment ?? 'Tanya jawab pemantik') }}</td>
            <td>{{ is_array($module->diagnostic_assessment) ? ($module->diagnostic_assessment['tujuan'] ?? 'Kesiapan awal murid') : 'Kesiapan awal murid' }}</td>
        </tr>
        <tr>
            <td><b>2. Asesmen Formatif</b></td>
            <td>{{ is_array($module->formative_assessment) ? ($module->formative_assessment['bentuk'] ?? 'Observasi keterlibatan & rubrik performa') : ($module->formative_assessment ?? 'Observasi performa') }}</td>
            <td>{{ is_array($module->formative_assessment) ? ($module->formative_assessment['rubrik'] ?? 'Keterlibatan aktif & kolaborasi') : 'Keterlibatan aktif & kolaborasi' }}</td>
        </tr>
        <tr>
            <td><b>3. Asesmen Sumatif</b></td>
            <td>{{ is_array($module->summative_assessment) ? ($module->summative_assessment['bentuk'] ?? 'Tes tertulis & rubrik produk') : ($module->summative_assessment ?? 'Tes tertulis & rubrik produk') }}</td>
            <td>{{ is_array($module->summative_assessment) ? ($module->summative_assessment['kriteria'] ?? 'Ketercapaian TP') : 'Ketercapaian TP' }}</td>
        </tr>
    </table>

    <!-- V. TINDAK LANJUT, LAMPIRAN & REFERENSI -->
    @if($module->remedial_enrichment || $module->student_worksheet_text || $module->reading_materials || $module->bibliography)
        <table class="tbl-section-bar"><tr><td>V. TINDAK LANJUT, LAMPIRAN & REFERENSI</td></tr></table>
        @if($module->remedial_enrichment)
            <p><b>A. Rencana Remedial dan Pengayaan:</b></p>
            <p style="margin-left: 14pt;">{!! nl2br(e(is_array($module->remedial_enrichment) ? ($module->remedial_enrichment['rencana'] ?? '-') : $module->remedial_enrichment)) !!}</p>
        @endif
        @if($module->student_worksheet_text)
            <p><b>B. Lembar Kerja Peserta Didik (LKPD):</b></p>
            <p style="margin-left: 14pt; white-space: pre-line;">{!! e($module->student_worksheet_text) !!}</p>
        @endif
        @if($module->reading_materials)
            <p><b>C. Bahan Bacaan Guru & Peserta Didik:</b></p>
            <p style="margin-left: 14pt; white-space: pre-line;">{!! e($module->reading_materials) !!}</p>
        @endif
        @if($module->bibliography)
            <p><b>D. Daftar Pustaka:</b></p>
            <p style="margin-left: 14pt; white-space: pre-line;">{!! e($module->bibliography) !!}</p>
        @endif
    @endif

    <!-- TANDA TANGAN PENGESAHAN -->
    <table class="tbl-ttd" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td>
                Mengetahui,<br>
                <b>{{ $institution->signature_title ?? ($module->curriculum_code === 'MERDEKA' ? 'Kepala Sekolah' : 'Kepala Madrasah') }}</b>
                <div class="ttd-space"></div>
                <div class="ttd-name">{{ $institution->principal_name ?? '(Nama Kepala Sekolah)' }}</div>
                <div class="ttd-nip">NIP. {{ $institution->principal_id_number ?? '..................................................' }}</div>
            </td>
            <td>
                {{ $institution->signature_city ?? ($institution->city ?? 'Kota') }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
                <b>Guru Pengampu Mata Pelajaran,</b>
                <div class="ttd-space"></div>
                <div class="ttd-name">{{ $module->user?->name ?? '..................................................' }}</div>
                <div class="ttd-nip">
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

</div>
</body>
</html>
