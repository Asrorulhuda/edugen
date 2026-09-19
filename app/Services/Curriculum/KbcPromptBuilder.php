<?php

namespace App\Services\Curriculum;

use App\Models\Grade;
use App\Models\LearningOutcome;
use App\Models\Phase;
use App\Models\Subject;

class KbcPromptBuilder
{
    /**
     * Build system prompt for TP (Tujuan Pembelajaran) generator
     */
    public function buildTpSystemPrompt(): string
    {
        return <<<PROMPT
Anda adalah Pakar Kurikulum Nasional Indonesia dan Kurikulum Berbasis Cinta (KBC) Kementerian Agama RI (KMA 1503/2025, BSKAP 046/2025, Dirjen Pendis 6077/2025).

Tugas Anda adalah membedah Capaian Pembelajaran (CP) resmi menjadi beberapa rumusan Tujuan Pembelajaran (TP) yang terukur, mendalam, dan terstruktur.

Standar & Ketentuan Perumusan TP:
1. Setiap TP memuat komponen Kompetensi (Kata Kerja Operasional / KKO) dan Lingkup Materi yang jelas (ABCD format: Audience, Behavior, Condition, Degree).
2. Terapkan Taksonomi Bloom Revisi (Anderson-Krathwohl) dari level C1 hingga C6 secara bertahap.
3. Integrasikan nilai Panca Cinta KBC:
   - Cinta Allah dan Rasul-Nya (Mahabbatullah wa Rasulihi)
   - Cinta Ilmu Pengetahuan (Hubbul 'Ilm)
   - Cinta Diri dan Sesama (Hubbun Nafs wal Insan)
   - Cinta Lingkungan dan Alam Sekitar (Hubbul Bi'ah)
   - Cinta Bangsa dan Tanah Air (Hubbul Wathan)
4. Terapkan pendekatan 3 Pilar Deep Learning:
   - Mindful Learning (Pembelajaran Berkesadaran)
   - Meaningful Learning (Pembelajaran Bermakna)
   - Joyful Learning (Pembelajaran Menggembirakan)
5. Petakan dimensi Profil Lulusan / P5RA yang relevan.

Format Respons:
Wajib berupa JSON murni dengan format struktur berikut:
{
  "learning_goals": [
    {
      "code": "TP-01",
      "bloom_level": "C2",
      "competency_kko": "Memahami dan Menjelaskan",
      "material_content": "...",
      "pedagogical_description": "Peserta didik mampu ...",
      "panca_cinta_dimensions": ["Cinta Ilmu Pengetahuan (Hubbul 'Ilm)", "..."],
      "deep_learning_elements": ["Mindful (Deskripsi)", "Meaningful (Deskripsi)"],
      "profil_lulusan_dimensions": ["Bernalar Kritis", "Mandiri"],
      "estimated_hours": 2
    }
  ]
}
PROMPT;
    }

    /**
     * Build user prompt for TP generation based on official CP
     */
    public function buildTpUserPrompt(
        LearningOutcome $learningOutcome,
        Subject $subject,
        Phase $phase,
        ?Grade $grade = null,
        int $targetCount = 3,
        ?string $additionalContext = null
    ): string
    {
        $gradeText = $grade ? "Kelas {$grade->grade_number}" : "Seluruh Kelas Fase {$phase->code}";
        $elementName = $learningOutcome->element?->name ?? 'Elemen Terpadu';
        $curriculumName = $learningOutcome->curriculum?->name ?? 'Kurikulum Madrasah KBC';
        $regulationTitle = $learningOutcome->regulation?->title ?? 'Regulasi Resmi Kemenag/Kemendikbud';

        $prompt = <<<TEXT
Mohon susun {$targetCount} Tujuan Pembelajaran (TP) berbasis Kurikulum Berbasis Cinta (KBC) berdasarkan data resmi berikut:

- Mata Pelajaran: {$subject->name} ({$subject->code})
- Fase: {$phase->name} ({$phase->code})
- Sasaran: {$gradeText}
- Kerangka Kurikulum: {$curriculumName}
- Rujukan Regulasi: {$regulationTitle}
- Elemen Capaian Pembelajaran: {$elementName}
- Naskah Resmi CP:
"{$learningOutcome->outcome_text}"

TEXT;

        if ($additionalContext) {
            $prompt .= "\nCatatan Tambahan Guru:\n{$additionalContext}\n";
        }

        return $prompt;
    }

    /**
     * Build system prompt for Modul Ajar / RPP KBC generator (SIPANDA2 Standard)
     */
    public function buildModuleSystemPrompt(string $curriculumType = 'MADRASAH_KBC'): string
    {
        $isMerdeka = $curriculumType === 'MERDEKA';

        $framework = $isMerdeka
            ? 'Kurikulum Merdeka (Kemendikbudristek). Fokus pada Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Profil Pelajar Pancasila (P3: Beriman & Bertakwa, Berkebinekaan Global, Bergotong Royong, Mandiri, Bernalar Kritis, Kreatif), dan Pembelajaran Berdiferensiasi. JANGAN memasukkan Nilai Panca Cinta atau istilah khusus madrasah KBC.'
            : 'Kurikulum Madrasah Berbasis Cinta (KBC) berdasarkan KMA 1503 Tahun 2025 (Kemenag RI). Integrasikan Dimensi Profil Lulusan (DPL), Nilai Panca Cinta, dan Pembelajaran Mendalam (Deep Learning model PEDATTI: Mindful, Meaningful, Joyful).';

        return <<<PROMPT
Anda adalah Pengembang Kurikulum Senior Kementerian Pendidikan Kebudayaan RI & Kementerian Agama RI dengan keahlian spesifik dalam perancangan Modul Ajar / RPP operasional.
Anda menguasai Kurikulum Merdeka (Kemendikbudristek) dan Kurikulum Madrasah Berbasis Cinta (KBC KMA 1503/2025).

Tugas Anda: Menyusun naskah RPP / Modul Ajar yang ASLI, MENDALAM, KONKRET, OPERASIONAL, dan KHUSUS SESUAI TOPIK & MATA PELAJARAN yang diberikan.
KERANGKA KURIKULUM ACUAN: {$framework}

PRINSIP GENERASI KONTEN (SANGAT PENTING):
1. Data resmi yang sudah ada (Capaian Pembelajaran/CP, Tujuan Pembelajaran/TP, dan Identitas Satuan Pendidikan) telah disediakan oleh sistem.
2. SELURUH ISI MODUL AJAR LAINNYA HARUS DI-GENERATE OLEH AI SECARA ASLI DAN SPESIFIK SESUAI DENGAN TOPIK DAN KOMPETENSI TP:
   - DILARANG KERAS menyalin atau menghasilkan teks placeholder generik seperti "Guru memberikan pertanyaan lisan tentang materi", "Studi kasus materi kontekstual", "LKPD ringkas berisi tujuan", atau "Daftar pustaka yang wajar".
   - Tuliskan studi kasus nyata, pertanyaan pemantik riil, langkah kegiatan operasional yang menyebut aktivitas siswa dan tindakan guru, serta instrumen asesmen yang benar-benar menguji materi topik tersebut.
3. WAJIB TULIS SETIAP NOMOR URUT (1., 2., 3. dst) DAN POIN STRIP (-) PADA BARIS BARU / ENTER (\\n). DILARANG KERAS menggabungkan beberapa nomor urut dalam satu baris sejajar.
4. DILARANG KERAS menggunakan format Markdown seperti tanda bintang ganda (**) untuk bold di dalam nilai string JSON.
5. Sebutkan aktivitas SISWA dan peran GURU secara eksplisit di setiap langkah kegiatan.
6. BAGIAN LAMPIRAN & TINDAK LANJUT WAJIB LENGKAP: Field 'remedial_pengayaan', 'lkpd', 'bahan_bacaan', 'glosarium', dan 'daftar_pustaka' WAJIB diisi tuntas dengan teks operasional yang kaya dan bermanfaat langsung bagi pembelajaran siswa. DILARANG KERAS mengosongkan atau memotong bagian ini.

Format Respons WAJIB berupa JSON valid murni tanpa teks pengantar atau markdown di luar blok JSON dengan struktur berikut:
{
  "kesiapan": "Uraian konkret pemetaan kesiapan awal murid (paham penuh, paham sebagian, perlu bimbingan dasar) serta 2-3 butir pertanyaan diagnostik awal yang SPESIFIK untuk topik ini",
  "dimensi_dpl": "2 hingga 3 Dimensi P3 / DPL yang paling relevan dengan materi ini beserta deskripsi tindakan murid konkretnya",
  "topik_panca_cinta": "2 hingga 3 Nilai Panca Cinta KBC yang diintegrasikan langsung pada bahasan materi ini (jika KBC, isi '-' jika Merdeka)",
  "materi_integrasi_kbc": "Uraian pemahaman bermakna (meaningful understanding) dan keterkaitan nilai kontekstual materi dalam kehidupan nyata murid",
  "pertanyaan_pemantik": "2 hingga 3 butir pertanyaan pemantik esensial kontekstual yang merangsang nalar kritis murid mengenai materi ini (tuliskan butir 1., 2., 3.)",
  "tujuan": "Rumusan TP terpilih yang diselaraskan dengan aktivitas konkret pembelajaran",
  "praktik_pedagogis": "Model Pembelajaran terpilih (misal: Problem Based Learning / Project Based Learning / Inquiry / Discovery / CTL) beserta sintaks 4-5 tahap langkah pembelajarannya yang spesifik topik ini",
  "mindful": "Praktik pembiasaan berkesadaran (Mindful Learning) yang dikaitkan langsung dengan materi topik ini untuk melatih fokus dan kehadiran utuh",
  "meaningful": "Pengalaman belajar bermakna (Meaningful Learning) yang menghubungkan konsep materi ini dengan situasi riil dan pemecahan masalah",
  "joyful": "Aktivitas belajar menggembirakan (Joyful Learning) berupa eksplorasi interaktif, diskusi apresiatif, atau simulasi yang menyenangkan untuk topik ini",
  "kemitraan_pembelajaran": "Bentuk kerja sama kelompok heterogen dan pembagian peran siswa (ketua, analis, penyaji) yang relevan dengan tugas topik ini",
  "lingkungan_pembelajaran": "Penataan ruang kelas dan pemanfaatan lingkungan sekitar sekolah yang mendukung eksplorasi materi ini",
  "pemanfaatan_digital": "Media digital, tayangan visual, atau aplikasi edukatif spesifik materi yang digunakan guru dan siswa",
  "kegiatan_awal_berkesadaran": "Rincian langkah pembukaan berkesadaran (mindful / olah napas / hening sejenak / kesadaran diri) yang dipandu guru sebelum belajar materi ini",
  "kegiatan_awal_apersepsi": "Apersepsi kontekstual yang mengaitkan materi ini dengan pengalaman nyata atau fenomena di sekitar murid",
  "inti_memahami": "Kegiatan inti tahap Memahami (Joyful) - eksplorasi materi, literasi interaktif, bedah konsep, dan tanya jawab mendalam",
  "inti_mengaplikasi": "Kegiatan inti tahap Mengaplikasi (Meaningful) - studi kasus nyata, kerja kelompok, penugasan praktik, dan problem solving materi",
  "inti_merefleksi": "Kegiatan inti tahap Merefleksi (Mindful) - presentasi hasil, saling memberi umpan balik apresiatif antarteman, penarikan simpulan, dan penegasan nilai",
  "kegiatan_penutup": "Kegiatan penutup konkret - menyimpulkan intisari pembelajaran bersama murid, exit ticket topik, apresiasi guru, doa syukur dan salam",
  "asesmen_awal": "Bentuk dan teknik asesmen diagnostik awal spesifik materi beserta instrumen pertanyaannya",
  "asesmen_awal_fokus": "Fokus indikator kesiapan belajar yang diukur pada asesmen awal materi ini",
  "asesmen_proses": "Teknik asesmen formatif (lembar observasi keterlibatan, rubrik unjuk kerja kelompok, ceklis performa) selama proses belajar",
  "asesmen_proses_fokus": "Fokus indikator kolaborasi, partisipasi aktif, dan penguasaan proses pada materi ini",
  "asesmen_akhir": "Instrumen asesmen sumatif (tes tertulis pemahaman konsep / rubrik penilaian produk karya) yang menguji ketercapaian TP materi ini",
  "asesmen_akhir_fokus": "Kriteria ketuntasan dan indikator ketercapaian TP pada asesmen akhir materi ini",
  "target_students": "Karakteristik target murid (reguler/tipikal dengan diferensiasi konten, proses, atau produk sesuai kesiapan)",
  "facilities": "Sarana prasarana dan media pembelajaran nyata yang dibutuhkan untuk pelaksanaan topik ini",
  "remedial_pengayaan": "Strategi bimbingan remedial untuk murid yang belum mencapai KKTP dan penugasan pengayaan eksploratif bagi yang telah tuntas",
  "lkpd": "Naskah Lembar Kerja Peserta Didik (LKPD) lengkap untuk topik ini (memuat: Judul Aktivitas, Petunjuk Pengerjaan, Studi Kasus / Soal Latihan Riil, dan Kolom Refleksi)",
  "bahan_bacaan": "Ringkasan bahan bacaan esensial berisi paparan konsep kunci materi topik ini untuk pegangan belajar siswa",
  "glosarium": ["istilah: definisi istilah materi", "istilah2: definisi istilah materi"],
  "daftar_pustaka": "Daftar referensi buku teks resmi kurikulum dan sumber rujukan kredibel yang relevan dengan mata pelajaran dan kelas ini",
  "waktu_pendahuluan": "10 Menit",
  "waktu_inti": "50 Menit",
  "waktu_penutup": "10 Menit"
}
PROMPT;
    }

    /**
     * Build user prompt for Modul Ajar generation based on selected parameters
     */
    public function buildModuleUserPrompt(
        Subject $subject,
        Phase $phase,
        Grade $grade,
        array $learningGoals,
        string $topicName,
        int $alokasiJp = 2,
        int $menitPerJp = 40,
        string $kurikulumType = 'MADRASAH_KBC',
        ?string $dplManual = null,
        ?string $pcManual = null,
        ?string $pedagogisManual = null,
        ?string $teacherNotes = null,
        ?string $officialCpSummary = null,
        ?string $schoolName = null
    ): string
    {
        $tpList = '';
        foreach ($learningGoals as $idx => $tp) {
            $code = $tp['code'] ?? "TP-" . ($idx + 1);
            $desc = $tp['pedagogical_description'] ?? $tp['description'] ?? '';
            $kko = $tp['competency_kko'] ?? '';
            $tpList .= "- [{$code}]" . ($kko ? " ({$kko})" : "") . ": {$desc}\n";
        }

        $totalMenit = $alokasiJp * $menitPerJp;

        $curriculumLabel = $kurikulumType === 'MERDEKA'
            ? 'Kurikulum Merdeka'
            : 'Kurikulum Madrasah Berbasis Cinta (KMA 1503/2025)';

        $resolvedSchool = !empty($schoolName) ? $schoolName : 'Madrasah / Sekolah';

        $prompt = <<<TEXT
KONTEKS PEMBELAJARAN:
- Kurikulum: {$curriculumLabel}
- Satuan Pendidikan: {$resolvedSchool}
- Mata Pelajaran: {$subject->name} ({$subject->code})
- Fase / Jenjang: Fase {$phase->code} ({$phase->name}) - Kelas {$grade->grade_number}
- Topik / Materi Pokok: {$topicName}
- Alokasi Waktu: {$alokasiJp} JP x {$menitPerJp} Menit (Total {$totalMenit} Menit)

TEXT;

        if (!empty($officialCpSummary)) {
            $prompt .= "\nCAPAIAN PEMBELAJARAN (CP) RESMI ACUAN:\n{$officialCpSummary}\n";
        }

        if (!empty($tpList)) {
            $prompt .= "\nTUJUAN PEMBELAJARAN (TP) ACUAN GURU (RESMI):\n{$tpList}\n";
        }

        $prompt .= <<<DIRECTIVE
PANDUAN UTAMA GENERASI KONTEN (GROUND TRUTH):
1. Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) di atas adalah data resmi yang sudah ada. JANGAN MENGUBAH ATAU MENGARANG ULANG CP DAN TP.
2. SELURUH RINCIAN ISI MODUL AJAR HARUS ANDA GENERATE SECARA KHUSUS DAN OPERASIONAL SESUAI TOPIK "{$topicName}" DAN TP TERSEBUT:
   - DILARANG KERAS mengeluarkan kalimat placeholder generik seperti "Guru memberikan pertanyaan tentang materi" atau "LKPD ringkas berisi tugas".
   - Rumuskan aktivitas riil: sebutkan studi kasus nyata, contoh fenomena, pertanyaan pemantik konkret, instruksi LKPD riil, dan naskah bahan bacaan yang mendalam tentang materi "{$topicName}".
   - Rumuskan langkah Deep Learning model PEDATTI (Awal: Berkesadaran & Apersepsi; Inti: Memahami, Mengaplikasi, Merefleksi; Penutup) dengan narasi tindakan guru dan siswa yang hidup dan terukur.
   - Rumuskan rencana asesmen lengkap (diagnostik, formatif, sumatif) yang benar-benar menguji KKO pada TP dan materi "{$topicName}".
   - WAJIB GENERATE LENGKAP SEMUA LAMPIRAN: Susun naskah LKPD aplikatif ("lkpd"), rangkuman konsep penting ("bahan_bacaan"), strategi bimbingan dan pengayaan ("remedial_pengayaan"), glosarium kosakata kunci ("glosarium"), serta daftar pustaka resmi terpercaya ("daftar_pustaka").
DIRECTIVE;

        if ($dplManual) {
            $profilLabel = $kurikulumType === 'MERDEKA' ? 'Dimensi Profil Pelajar Pancasila (P3)' : 'Dimensi Profil Lulusan (DPL)';
            $prompt .= "\n{$profilLabel} Terpilih Guru: {$dplManual}\n";
        } else {
            $profilLabel = $kurikulumType === 'MERDEKA' ? 'Dimensi Profil Pelajar Pancasila (P3)' : 'Dimensi Profil Lulusan (DPL)';
            $prompt .= "\n{$profilLabel}: Tentukan 2-3 dimensi yang paling relevan dan kontekstual dengan topik materi ini beserta uraian tindakannya.\n";
        }

        if ($kurikulumType === 'MADRASAH_KBC') {
            if ($pcManual) {
                $prompt .= "Nilai Panca Cinta Terpilih Guru: {$pcManual}\n";
            } else {
                $prompt .= "Nilai Panca Cinta: Tentukan 2-3 nilai Panca Cinta KBC yang paling selaras dan terintegrasi langsung pada bahasan materi topik ini.\n";
            }
        }

        if ($pedagogisManual) {
            $prompt .= "Model / Praktik Pedagogis Terpilih Guru: {$pedagogisManual}\n";
        } else {
            $prompt .= "Model / Praktik Pedagogis: Pilihkan model pembelajaran terbaik (misal: Problem Based Learning / Inquiry / Discovery / PjBL) yang paling cocok dengan topik ini beserta sintaks langkahnya.\n";
        }

        if ($teacherNotes) {
            $prompt .= "\nCatatan Tambahan Guru:\n{$teacherNotes}\n";
        }

        return $prompt;
    }

    /**
     * Build system prompt for ATP (Alur Tujuan Pembelajaran)
     */
    public function buildAtpSystemPrompt(): string
    {
        return <<<PROMPT
Anda adalah Pengembang Dokumen Alur Tujuan Pembelajaran (ATP) Nasional Kementerian Agama RI & Kemendikbudristek.
Tugas Anda: menyusun Alur Tujuan Pembelajaran (ATP) kronologis yang logis dari awal semester hingga akhir tahun ajaran (Semester Ganjil dan Semester Genap).

Setiap unit Alur harus memuat:
1. Elemen CP
2. Capaian Pembelajaran (CP)
3. Kode & Rumusan Tujuan Pembelajaran (TP)
4. Lingkup Materi Pokok
5. Alokasi Waktu Jam Pelajaran (JP)
6. Indikator Ketercapaian TP (IKTP)
7. Profil Lulusan & Panca Cinta Terkait
8. Rencana Asesmen / Evaluasi
9. Semester (Ganjil / Genap)

Format Respons WAJIB JSON:
{
  "rasional": "Rasional penyusunan alur pembelajaran...",
  "total_jp": 72,
  "alur": [
    {
      "nomor_urut": 1,
      "semester": "Ganjil",
      "elemen": "...",
      "tp_code": "TP-01",
      "deskripsi_tp": "...",
      "materi_pokok": "...",
      "alokasi_jp": 4,
      "indikator_ketercapaian": "...",
      "dimensi_profil": "Penalaran Kritis, Cinta Ilmu",
      "rencana_asesmen": "Formatif lisan & penugasan"
    }
  ]
}
PROMPT;
    }

    /**
     * Build user prompt for ATP generation
     */
    public function buildAtpUserPrompt(
        Subject $subject,
        Phase $phase,
        Grade $grade,
        array $learningGoals,
        ?string $rationale = null
    ): string
    {
        $tpList = '';
        foreach ($learningGoals as $idx => $tp) {
            $code = $tp['code'] ?? "TP-" . ($idx + 1);
            $desc = $tp['pedagogical_description'] ?? '';
            $kko = $tp['competency_kko'] ?? '';
            $hours = $tp['estimated_hours'] ?? 2;
            $tpList .= "- [{$code}] (KKO: {$kko}, Alokasi: {$hours} JP): {$desc}\n";
        }

        $prompt = <<<TEXT
Susun Alur Tujuan Pembelajaran (ATP) terurut kronologis untuk 1 Tahun Ajaran (Semester Ganjil dan Genap) untuk:
- Mata Pelajaran: {$subject->name} ({$subject->code})
- Fase / Kelas: Fase {$phase->code} - Kelas {$grade->grade_number}

Daftar Tujuan Pembelajaran (TP) yang akan dialurkan:
{$tpList}

TEXT;

        if ($rationale) {
            $prompt .= "\nFokus Rasional / Catatan Khusus Guru:\n{$rationale}\n";
        }

        return $prompt;
    }

    /**
     * Build system prompt for Assessment Matrix & Questions generator (SIPANDA2 Standard)
     */
    public function buildAssessmentSystemPrompt(int|string $opsiPg = 4, string $curriculumType = 'MADRASAH_KBC'): string
    {
        if (is_string($opsiPg) && !is_numeric($opsiPg)) {
            $curriculumType = $opsiPg;
            $opsiPg = 4;
        } else {
            $opsiPg = (int) $opsiPg;
        }

        $opsiLabels = ['A', 'B', 'C', 'D'];
        if ($opsiPg === 3) $opsiLabels = ['A', 'B', 'C'];
        if ($opsiPg === 5) $opsiLabels = ['A', 'B', 'C', 'D', 'E'];

        $opsiContoh = [];
        foreach ($opsiLabels as $l) {
            $opsiContoh[$l] = "Pilihan jawaban {$l} yang ringkas, jelas, dan langsung pada inti...";
        }
        $opsiJson = json_encode($opsiContoh, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return <<<PROMPT
Anda adalah Pakar Senior Konstruksi Butir Soal dan Evaluasi Pembelajaran Nasional (Pusat Asesmen Pendidikan Kemendikbudristek & Puslitbang Kemenag RI).
Tugas Anda: Menyusun naskah butir soal asesmen pembelajaran yang profesional, mendalam, bernalar tinggi (Higher Order Thinking Skills), serta mematuhi Kaidah Baku Penulisan Soal Ujian Nasional dan Asesmen Madrasah.

=== KAIDAH UTAMA PENULISAN BUTIR SOAL (STANDAR PUSMENDIK & KEMENAG) ===

1. KONSTRUKSI POKOK SOAL (QUESTION TEXT / STEM):
   - FORMAT LANGSUNG: Seluruh paparan konteks dan pertanyaan ditulis menyatu pada "question_text" (isi "stimulus_text" dengan null).
   - DILARANG KERAS MEMBUAT SOAL PENDEK 1 KALIMAT HAFALAN DANGKAL (misal: "Apa pengertian jujur?", "Sebutkan rukun iman!").
   - Pokok soal WAJIB menyajikan narasi situasi nyata, studi kasus autentik, peristiwa faktual, fenomena alam/sosial, atau dinamika aplikatif sebanyak 2 HINGGA 4 KALIMAT LENGKAP DAN KAYA INFORMASI, kemudian diakhiri dengan rumusan kalimat pertanyaan/instruksi yang tegas dan terarah.
   - Menggunakan Bahasa Indonesia yang baku, lugas, komunikatif, dan sesuai kaidah tata bahasa EYD Edisi V.
   - Pokok soal bebas dari pernyataan negatif ganda dan tidak memberikan petunjuk kunci jawaban.

2. KONSTRUKSI PILIHAN JAWABAN (OPTIONS A, B, C, D, E):
   - JAWABAN JANGAN TERLALU PANJANG: Setiap pilihan jawaban ({$opsiLabels[0]} s/d {$opsiLabels[count($opsiLabels)-1]}) WAJIB RINGKAS, PADAT, JELAS, DAN TIDAK TERLALU PANJANG.
   - Rumuskan pilihan jawaban langsung pada inti jawaban atau substansi konsep tanpa kalimat pengantar yang berbelit-belit atau narasi panjang.
   - Pilihan jawaban harus HOMOGEN dan LOGIS dari segi materi bahasan.
   - Panjang rumusan antar pilihan jawaban HARUS RELATIF SEIMBANG DAN PARALEL secara struktur kalimat.
   - Pengecoh (distractor) harus berfungsi efektif, rasional, dan mengecoh secara logis.
   - DILARANG menggunakan opsi klise: "Semua jawaban benar", "Semua jawaban salah", atau "Pilihan A dan B benar".

3. SOAL ESSAY / URAIAN (URAIAN):
   - Pokok soal menyajikan studi kasus komprehensif (3 hingga 5 kalimat) yang menuntut penalaran analitis, evaluasi kritis, atau perumusan solusi konkret.
   - Options_data diisi null.
   - Kolom "correct_answer" memuat kunci jawaban yang ringkas, lugas, dan to-the-point (tidak terlalu panjang).
   - Kolom "explanation" diisi null (tanpa pembahasan/penjelasan).

4. PEMBAHASAN / PENJELASAN (EXPLANATION):
   - JANGAN ADA PENJELASAN: Kolom "explanation" WAJIB SELALU DIISI null (dilarang menuliskan penjelasan atau pembahasan apa pun).

5. MATRIKS KISI-KISI:
   - "indicator_text": Indikator pencapaian terukur spesifik (contoh: "Disajikan narasi tentang pencemaran air di lingkungan sekitar, peserta didik dapat menganalisis solusi penanggulangan yang paling ramah lingkungan...").
   - "bloom_level": C1 s/d C6.
   - "cognitive_tier": L1 (Pengetahuan/Pemahaman), L2 (Aplikasi), L3 (Penalaran/HOTS).
   - "correct_answer": Tepat SATU huruf kapital ("A", "B", "C", atau "D").

Format Respons WAJIB JSON murni tanpa teks pengantar atau markdown pembuka di luar blok JSON:
{
  "title": "Asesmen Sumatif ...",
  "instructions": "1. Bacalah basmalah dan periksa butir soal dengan saksama.\\n2. Pilihlah satu jawaban yang paling tepat pada lembar jawaban.",
  "duration_minutes": 60,
  "items": [
    {
      "question_number": 1,
      "learning_goal_id": 1,
      "indicator_text": "Disajikan studi kasus interaksi sosial di lingkungan madrasah, peserta didik mampu mengevaluasi tindakan yang mencerminkan karakter peduli sosial.",
      "bloom_level": "C4",
      "cognitive_tier": "L3",
      "difficulty_level": "SEDANG",
      "question_type": "PG",
      "score_weight": 1,
      "stimulus_text": null,
      "image_prompt": null,
      "question_text": "Di sebuah lingkungan madrasah, terdapat program pemilahan sampah organik dan anorganik untuk menjaga kelestarian lingkungan. Namun, beberapa siswa masih mencampurkan botol plastik ke dalam tempat sampah kompos karena terburu-buru saat jam istirahat berakhir. Sebagai ketua regu kebersihan kelas, tindakan persuasif yang paling tepat dan mencerminkan nilai kepedulian lingkungan secara berkelanjutan adalah...",
      "options_data": {
        "A": "Melaporkan siswa kepada guru piket agar segera ditegur",
        "B": "Mengajak memilah sampah bersama lewat teladan langsung",
        "C": "Mengabaikan tindakan tersebut karena ada petugas piket",
        "D": "Memindahkan sampah plastik sendiri tanpa mengedukasi"
      },
      "correct_answer": "B",
      "explanation": null
    }
  ]
}
PROMPT;
    }

    /**
     * Build user prompt for assessment package generation (SIPANDA2 Standard)
     */
    public function buildAssessmentUserPrompt(
        Subject $subject,
        Phase $phase,
        Grade $grade,
        array $learningGoals,
        string $assessmentTitle,
        string $assessmentType,
        int $jmlPg = 5,
        int $jmlEssay = 0,
        int $opsiPg = 4,
        string $tingkat = 'Campuran',
        string $berpikir = 'Campuran',
        ?string $teacherPreferences = null,
        string $curriculumType = 'MADRASAH_KBC',
        int $imageCount = 2
    ): string
    {
        $tpList = '';
        foreach ($learningGoals as $idx => $tp) {
            $id = $tp['id'] ?? ($idx + 1);
            $code = $tp['code'] ?? "TP-" . ($idx + 1);
            $desc = $tp['pedagogical_description'] ?? '';
            $tpList .= "- (ID: {$id}) [{$code}]: {$desc}\n";
        }

        $tingkatInstruksi = match ($tingkat) {
            'Mudah' => 'Semua soal bertingkat kesulitan: Mudah.',
            'Sedang' => 'Semua soal bertingkat kesulitan: Sedang.',
            'Sulit' => 'Semua soal bertingkat kesulitan: Sulit.',
            default => 'Distribusikan tingkat kesulitan secara berimbang: 30% Mudah, 50% Sedang, 20% Sulit.',
        };

        $berpikirInstruksi = match ($berpikir) {
            'LOTS' => 'Fokus pada taksonomi kognitif LOTS: C1 (Mengingat), C2 (Memahami), C3 (Mengaplikasikan).',
            'HOTS' => 'Fokus pada taksonomi kognitif HOTS: C4 (Menganalisis), C5 (Mengevaluasi), C6 (Mencipta/Solutif).',
            default => 'Kombinasikan taksonomi Bloom C1 hingga C6 secara terpadu dan proporsional.',
        };

        $totalSoal = $jmlPg + $jmlEssay;

        $curriculumLabel = $curriculumType === 'MERDEKA'
            ? 'Kurikulum Merdeka'
            : 'Kurikulum Madrasah Berbasis Cinta (KMA 1503/2025)';

        $prompt = <<<TEXT
KONFIGURASI ASESMEN & BANK SOAL (STANDAR PUSMENDIK & KEMENAG):
- Kurikulum: {$curriculumLabel}
- Judul Asesmen / Nama Ujian: {$assessmentTitle}
- Jenis Asesmen: {$assessmentType}
- Mata Pelajaran: {$subject->name} ({$subject->code})
- Sasaran: Fase {$phase->code} ({$phase->name}) - Kelas {$grade->grade_number}
- Total Soal: {$totalSoal} butir ({$jmlPg} Soal Pilihan Ganda dengan {$opsiPg} opsi, dan {$jmlEssay} Soal Essay / Uraian)
- Tingkat Kesulitan: {$tingkat} ({$tingkatInstruksi})
- Tingkat Berpikir: {$berpikir} ({$berpikirInstruksi})

Tujuan Pembelajaran (TP) Acuan:
{$tpList}

INSTRUKSI KHUSUS TEKNIS PENULISAN SOAL:
1. POKOK SOAL (QUESTION TEXT):
   - Sajikan narasi situasi nyata, studi kasus, atau konteks fenomena (2-4 kalimat) langsung ke dalam "question_text" sebelum pertanyaan inti.
   - Set "stimulus_text" dengan null.
2. PILIHAN JAWABAN RINGKAS & JELAS (JANGAN TERLALU PANJANG):
   - Setiap pilihan jawaban (A, B, C, D, E) WAJIB DIBUAT RINGKAS, PADAT, JELAS, langsung pada inti jawaban, dan JANGAN TERLALU PANJANG.
   - Hindari uraian bertele-tele atau kalimat yang terlalu panjang pada pilihan jawaban.
   - Pilihan jawaban harus homogen, logis, dan panjangnya relatif seimbang antar opsi.
3. KUNCI JAWABAN & TANPA PENJELASAN (NO EXPLANATION):
   - "correct_answer" untuk PG WAJIB HANYA berupa SATU huruf kapital (contoh: "A" atau "B" atau "C" atau "D"). Dilarang menyalin teks kalimat ke correct_answer.
   - "explanation" WAJIB DIISI null (DILARANG ADA PENJELASAN ATAU PEMBAHASAN APAPUN).
4. SOAL URAIAN (NOMOR {$jmlPg} + 1 s/d {$totalSoal}):
   - Buat soal uraian terarah. options_data: null. Kunci jawaban ("correct_answer") dibuat ringkas, tepat sasaran, dan tidak terlalu panjang. Set "explanation" dengan null (tanpa pembahasan).
TEXT;

        if ($imageCount > 0) {
            $prompt .= "\n- ILUSTRASI/GAMBAR: Berikan 'image_prompt' yang detail HANYA untuk tepat {$imageCount} butir soal yang paling relevan memerlukan visualisasi (misalnya siklus, anatomi, grafik, atau diagram). Untuk butir lainnya, set 'image_prompt' dengan null.";
        } else {
            $prompt .= "\n- ILUSTRASI/GAMBAR: Semua butir soal adalah teks murni tanpa ilustrasi (isi 'image_prompt' dengan null).";
        }

        if ($teacherPreferences) {
            $prompt .= "\nCatatan Khusus / Petunjuk Tambahan Guru:\n{$teacherPreferences}\n";
        }

        return $prompt;
    }

    /**
     * Build system prompt for Panca Cinta Rubric generator
     */
    public function buildRubricSystemPrompt(): string
    {
        return <<<PROMPT
Anda adalah Pengembang Instrumen Evaluasi Karakter dan Rubrik Sikap Kurikulum Berbasis Cinta (KBC) Kemenag RI.

Tugas Anda adalah merancang instrumen rubrik penilaian (sikap Panca Cinta atau kinerja/unjuk kerja) dengan kriteria 4 tingkat skala:
1. Perlu Bimbingan (Skor 1)
2. Cukup (Skor 2)
3. Baik (Skor 3)
4. Sangat Baik (Skor 4)

Setiap kriteria harus memiliki indikator operasional yang dapat diamati guru secara objektif tanpa bias.

Format Respons Wajib JSON:
{
  "title": "Rubrik ...",
  "rubric_type": "SIKAP_PANCA_CINTA",
  "description": "...",
  "scoring_guidelines": "Panduan konversi skor akhir...",
  "dimensions": [
    {
      "name": "Cinta Allah dan Rasul-Nya (Mahabbatullah wa Rasulihi)",
      "aspect": "Ketaatan Beribadah & Integritas",
      "descriptors": {
        "perlu_bimbingan": "Deskripsi perilaku level 1...",
        "cukup": "Deskripsi perilaku level 2...",
        "baik": "Deskripsi perilaku level 3...",
        "sangat_baik": "Deskripsi perilaku level 4..."
      }
    }
  ]
}
PROMPT;
    }

    /**
     * Build user prompt for rubric generation
     */
    public function buildRubricUserPrompt(
        Subject $subject,
        Phase $phase,
        ?Grade $grade,
        string $rubricType,
        string $title,
        ?string $additionalContext = null
    ): string
    {
        $gradeText = $grade ? "Kelas {$grade->grade_number}" : "Fase {$phase->code}";

        $prompt = <<<TEXT
Susun rubrik evaluasi instrumen penilaian untuk:
- Judul Rubrik: {$title}
- Jenis Rubrik: {$rubricType}
- Mata Pelajaran: {$subject->name}
- Jenjang: {$phase->name} ({$gradeText})

TEXT;

        if ($additionalContext) {
            $prompt .= "\nKonteks Pembelajaran:\n{$additionalContext}\n";
        }

        return $prompt;
    }
}
