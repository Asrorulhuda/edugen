<?php

namespace App\Services\AI\Adapters;

use App\Services\AI\Contracts\AiProviderInterface;
use App\Services\AI\DTOs\AiResponse;

class MockAdapter implements AiProviderInterface
{
    public function getName(): string
    {
        return 'MOCK';
    }

    public function isConfigured(): bool
    {
        return true;
    }

    public function generate(string $systemPrompt, string $userPrompt, array $options = []): AiResponse
    {
        $json = $this->generateJson($systemPrompt, $userPrompt, $options);
        $content = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return new AiResponse(
            content: $content,
            provider: $this->getName(),
            model: 'mock-kbc-engine-v1',
            promptTokens: 250,
            completionTokens: 850,
            totalTokens: 1100,
            latencyMs: 120,
            metadata: ['simulated' => true]
        );
    }

    public function generateJson(string $systemPrompt, string $userPrompt, array $options = []): array
    {
        $isTeachingModule = str_contains($userPrompt, 'MODUL_AJAR') || str_contains($systemPrompt, 'Modul Ajar') || str_contains($userPrompt, 'modul ajar');
        $isAtp = str_contains($userPrompt, 'ATP') || str_contains($systemPrompt, 'Alur Tujuan') || str_contains($userPrompt, 'alur tujuan');
        $isAssessment = str_contains($userPrompt, 'Asesmen') || str_contains($systemPrompt, 'Kisi-kisi') || str_contains($userPrompt, 'soal');
        $isRubric = str_contains($userPrompt, 'Rubrik') || str_contains($systemPrompt, 'Rubrik');

        if ($isTeachingModule) {
            return $this->generateMockTeachingModule($userPrompt);
        }

        if ($isAtp) {
            return $this->generateMockAtp($userPrompt);
        }

        if ($isAssessment) {
            return $this->generateMockAssessmentPackage($userPrompt);
        }

        if ($isRubric) {
            return $this->generateMockRubric($userPrompt);
        }

        return $this->generateMockLearningGoals($userPrompt);
    }

    private function generateMockLearningGoals(string $prompt): array
    {
        return [
            'learning_goals' => [
                [
                    'code' => 'TP-01',
                    'bloom_level' => 'C2',
                    'competency_kko' => 'Memahami',
                    'material_content' => 'Struktur dan gagasan pokok teks deskripsi',
                    'pedagogical_description' => 'Peserta didik mampu memahami struktur dan gagasan pokok dalam teks deskripsi secara kritis dan penuh penghayatan.',
                    'panca_cinta_dimensions' => [
                        'Cinta Ilmu Pengetahuan (Hubbul \'Ilm)',
                        'Cinta Diri dan Sesama (Hubbun Nafs wal Insan)',
                    ],
                    'deep_learning_elements' => [
                        'Mindful (Menyimak dengan penuh kesadaran dan kehadiran utuh)',
                        'Meaningful (Menemukan keindahan bahasa dalam menggambarkan ciptaan Tuhan)',
                    ],
                    'profil_lulusan_dimensions' => ['Bernalar Kritis', 'Mandiri'],
                    'estimated_hours' => 2,
                ],
                [
                    'code' => 'TP-02',
                    'bloom_level' => 'C4',
                    'competency_kko' => 'Menganalisis',
                    'material_content' => 'Penggunaan diksi bernada positif dan apresiatif dalam mendeskripsikan objek',
                    'pedagogical_description' => 'Peserta didik mampu menganalisis pemilihan kata (diksi) bernada positif dan apresiatif saat mendeskripsikan objek lingkungan dan budaya sekitar.',
                    'panca_cinta_dimensions' => [
                        'Cinta Lingkungan dan Alam Sekitar (Hubbul Bi\'ah)',
                        'Cinta Bangsa dan Tanah Air (Hubbul Wathan)',
                    ],
                    'deep_learning_elements' => [
                        'Meaningful (Menghubungkan teks dengan pelestarian lingkungan lokal)',
                        'Joyful (Diskusi interaktif menemukan sudut pandang apresiatif)',
                    ],
                    'profil_lulusan_dimensions' => ['Bernalar Kritis', 'Kreatif'],
                    'estimated_hours' => 2,
                ],
                [
                    'code' => 'TP-03',
                    'bloom_level' => 'C6',
                    'competency_kko' => 'Merancang dan Menulis',
                    'material_content' => 'Penyusunan teks deskripsi berbasis empati dan cinta sesama',
                    'pedagogical_description' => 'Peserta didik mampu merancang dan menulis teks deskripsi orisinal mengenai sosok inspiratif di madrasah/sekolah dengan menjunjung tinggi empati dan cinta sesama.',
                    'panca_cinta_dimensions' => [
                        'Cinta Allah dan Rasul-Nya (Mahabbatullah wa Rasulihi)',
                        'Cinta Diri dan Sesama (Hubbun Nafs wal Insan)',
                    ],
                    'deep_learning_elements' => [
                        'Mindful (Refleksi niat menulis untuk menginspirasi kebaikan)',
                        'Joyful (Pameran karya dan saling memberi umpan balik apresiatif)',
                    ],
                    'profil_lulusan_dimensions' => ['Gotong Royong', 'Kreatif', 'Berakhlak Mulia'],
                    'estimated_hours' => 4,
                ],
            ],
        ];
    }

    private function generateMockAtp(string $prompt): array
    {
        return [
            'title' => 'Alur Tujuan Pembelajaran (ATP) Berbasis Cinta',
            'rationale' => 'Alur disusun secara bertahap dari pemahaman konsep dasar (konkret), analisis kontekstual lingkungan, hingga kreasi karya otentik yang berjiwa panca cinta.',
            'total_hours_allocated' => 36,
            'sequence' => [
                [
                    'semester' => 1,
                    'order' => 1,
                    'tp_code' => 'TP-01',
                    'topic' => 'Menemukan Gagasan Pokok Teks Deskripsi',
                    'hours' => 6,
                    'panca_cinta_focus' => 'Cinta Ilmu',
                ],
                [
                    'semester' => 1,
                    'order' => 2,
                    'tp_code' => 'TP-02',
                    'topic' => 'Menganalisis Diksi Bernuansa Apresiatif Lingkungan',
                    'hours' => 8,
                    'panca_cinta_focus' => 'Cinta Lingkungan',
                ],
                [
                    'semester' => 1,
                    'order' => 3,
                    'tp_code' => 'TP-03',
                    'topic' => 'Karya Tulis Kreatif Sosok Pendidik & Sahabat',
                    'hours' => 8,
                    'panca_cinta_focus' => 'Cinta Sesama',
                ],
            ],
        ];
    }

    private function generateMockTeachingModule(string $prompt): array
    {
        return [
            'kesiapan' => 'Guru memetakan pengetahuan awal melalui tiga pertanyaan diagnostik dan mengelompokkan dukungan belajar berdasarkan bukti jawaban murid.',
            'dimensi_dpl' => 'Penalaran Kritis: murid membedah struktur dan diksi teks. Kolaborasi: murid memberi umpan balik dengan santun. Kreativitas: murid menghasilkan teks deskripsi orisinal.',
            'topik_panca_cinta' => 'Cinta Ilmu, Cinta Sesama, dan Cinta Lingkungan diterapkan melalui pengamatan teliti, umpan balik apresiatif, dan pemilihan objek lokal.',
            'materi_integrasi_kbc' => 'Murid memahami bahwa bahasa yang cermat dan santun dapat menumbuhkan kepedulian terhadap sesama serta lingkungan.',
            'tujuan' => '1. Melalui analisis contoh, murid mampu menjelaskan struktur teks deskripsi dengan tepat.\n2. Melalui pengamatan lingkungan, murid mampu menulis teks deskripsi orisinal dengan diksi yang santun.',
            'praktik_pedagogis' => 'Problem-Based Learning: orientasi pada contoh nyata, penyelidikan unsur teks, penyusunan karya, presentasi, dan umpan balik berbasis rubrik.',
            'kemitraan_pembelajaran' => 'Murid bekerja dalam kelompok heterogen dengan peran pengamat, pencatat, penelaah bahasa, dan penyaji.',
            'lingkungan_pembelajaran' => 'Kelas diatur aman dan inklusif dengan area observasi lingkungan sekolah serta pilihan media sesuai kebutuhan murid.',
            'pemanfaatan_digital' => 'Guru menggunakan foto lingkungan lokal dan dokumen kolaboratif untuk menyusun serta menelaah teks.',
            'kegiatan_awal_berkesadaran' => 'Guru memandu fokus singkat, menyampaikan tujuan, dan memastikan kesiapan alat belajar; murid menuliskan satu detail yang diamati.',
            'kegiatan_awal_apersepsi' => 'Guru menampilkan dua deskripsi objek; murid membandingkan mana yang lebih konkret dan menjelaskan alasannya.',
            'inti_memahami' => 'Guru memodelkan analisis struktur dan diksi; murid menandai identifikasi, deskripsi bagian, serta kata indrawi pada teks contoh.',
            'inti_mengaplikasi' => 'Murid mengamati objek lokal, menyusun kerangka, menulis draf, lalu bertukar karya untuk memperoleh umpan balik berbasis rubrik.',
            'inti_merefleksi' => 'Murid memperbaiki satu bagian karya berdasarkan umpan balik dan menuliskan strategi menulis yang paling membantu.',
            'kegiatan_penutup' => 'Guru dan murid menyimpulkan kriteria teks yang baik, mengumpulkan exit ticket, serta menentukan tindak lanjut.',
            'asesmen_awal' => 'Tiga pertanyaan diagnostik tentang struktur dan diksi; hasilnya digunakan untuk menentukan contoh serta scaffolding.',
            'asesmen_proses' => 'Observasi analisis teks dan ceklis umpan balik teman dengan indikator ketepatan struktur, diksi, dan kesantunan.',
            'asesmen_akhir' => 'Produk teks deskripsi dinilai dengan rubrik isi, struktur, kebahasaan, orisinalitas, dan ketepatan revisi.',
            'pertanyaan_pemantik' => "1. Bagaimana kata-kata kita bisa membuat orang lain merasakan keindahan suatu tempat?\n2. Mengapa mendeskripsikan sesuatu harus dilandasi rasa cinta dan kejujuran?",
            'mindful' => 'Latihan hening 2 menit sebelum mulai menulis untuk memfokuskan panca indra dan menata niat menebar kebaikan.',
            'meaningful' => 'Menghubungkan tulisan dengan aksi nyata menjaga kebersihan sudut sekolah yang dideskripsikan.',
            'joyful' => 'Aktivitas Gallery Walk bertajuk "Pasar Apresiasi" di mana setiap siswa menempelkan catatan bintang cinta pada karya rekannya.',
            'asesmen_awal_fokus' => 'Pemetaan kepekaan indrawi dan kekayaan kosakata awal siswa.',
            'asesmen_proses_fokus' => 'Penilaian proses draf tulisan dan partisipasi dalam Gallery Walk.',
            'asesmen_akhir_fokus' => 'Rubrik ketercapaian Tujuan Pembelajaran pada produk teks deskripsi.',
            'remedial_pengayaan' => 'Remedial menggunakan kerangka kalimat dan contoh terbimbing; pengayaan mengubah karya menjadi deskripsi foto digital.',
            'lkpd' => 'Tujuan: menyusun teks deskripsi. Amati objek, catat lima detail indrawi, buat kerangka, tulis draf, telaah, lalu simpulkan perbaikan.',
            'bahan_bacaan' => 'Ringkasan struktur teks deskripsi, contoh diksi indrawi, dan panduan memberi umpan balik yang spesifik.',
            'glosarium' => ['diksi: pilihan kata', 'deskripsi: penggambaran objek secara terperinci'],
            'daftar_pustaka' => 'Buku teks resmi mata pelajaran dan sumber CP yang dipilih guru pada sistem.',
            'waktu_pendahuluan' => '10 Menit',
            'waktu_inti' => '60 Menit',
            'waktu_penutup' => '10 Menit',
            'title' => 'Modul Ajar: Menulis Teks Deskripsi Berbasis Empati & Cinta Lingkungan',
            'topic_name' => 'Teks Deskripsi Apresiatif',
            'total_hours' => 4,
            'meeting_count' => 2,
            'learning_model' => 'Problem-Based Learning terintegrasi Panca Cinta',
            'target_students' => 'Peserta didik reguler dengan diferensiasi konten audio-visual dan kinestetik',
            'facilities' => 'Laptop/LCD, teks bacaan otentik tentang cagar budaya lokal, lembar kerja refleksi',
            'prerequisite_knowledge' => 'Peserta didik telah mengenal kalimat utama dan kalimat penjelas',
            'meaningful_understanding' => 'Bahasa adalah sarana menebarkan kasih sayang dan mengagumi mahakarya ciptaan Allah melalui kata-kata yang santun dan menginspirasi.',
            'inquiry_questions' => [
                'Bagaimana kata-kata kita bisa membuat orang lain merasakan keindahan suatu tempat?',
                'Mengapa mendeskripsikan sesuatu harus dilandasi rasa cinta dan kejujuran?',
            ],
            'panca_cinta_integration' => [
                'Cinta Allah: Mengagumi detail keindahan alam semesta ciptaan-Nya.',
                'Cinta Ilmu: Meneliti kosakata baku dan majas personifikasi secara tekun.',
                'Cinta Sesama: Menggunakan kalimat yang menghargai keberagaman saat mendeskripsikan tokoh.',
                'Cinta Lingkungan: Memilih objek deskripsi berupa kelestarian alam madrasah/sekolah.',
            ],
            'deep_learning_activities' => [
                'mindful' => 'Latihan hening 2 menit sebelum mulai menulis untuk memfokuskan panca indra dan menata niat menebar kebaikan.',
                'meaningful' => 'Menghubungkan tulisan dengan aksi nyata menjaga kebersihan sudut sekolah yang dideskripsikan.',
                'joyful' => 'Aktivitas Gallery Walk bertajuk "Pasar Apresiasi" di mana setiap siswa menempelkan catatan bintang cinta pada karya rekannya.',
            ],
            'profil_lulusan_targets' => [
                'Beriman dan Berakhlak Mulia',
                'Bernalar Kritis',
                'Gotong Royong',
            ],
            'learning_steps' => [
                [
                    'meeting' => 1,
                    'duration_minutes' => 80,
                    'preliminary' => [
                        'Guru membuka pembelajaran dengan salam penuh kasih sayang dan doa bersama.',
                        'Apersepsi: Guru menampilkan video singkat taman sekolah asri dan mengajak siswa merasakan suasana damai (Mindful).',
                        'Penyampaian tujuan pembelajaran dan kontrak belajar saling menghargai (Cinta Sesama).',
                    ],
                    'core' => [
                        'Siswa mengamati contoh teks deskripsi yang memuji keindahan lingkungan.',
                        'Diskusi kelompok kecil membedah struktur teks dan diksi yang membangkitkan rasa syukur (Meaningful).',
                        'Siswa berlatih mendeskripsikan satu benda di sekitarnya dengan 3 kata sifat bernada positif.',
                    ],
                    'closing' => [
                        'Refleksi pembelajaran bersama: Apa hikmah dan rasa cinta baru yang tumbuh hari ini?',
                        'Guru memberi apresiasi verbal kepada seluruh siswa atas kerja sama yang hangat (Joyful).',
                        'Doa penutup majelis.',
                    ],
                ],
                [
                    'meeting' => 2,
                    'duration_minutes' => 80,
                    'preliminary' => [
                        'Review singkat materi pertemuan 1 dengan kuis tebak kata deskripsi menggembirakan (Joyful).',
                        'Menyiapkan draf tulisan mandiri.',
                    ],
                    'core' => [
                        'Siswa menulis teks deskripsi 3 paragraf mengenai lingkungan madrasah/sekolah.',
                        'Peer review berpasangan dengan panduan rubrik apresiasi empati.',
                        'Pameran karya sederhana di dinding kelas.',
                    ],
                    'closing' => [
                        'Pemberian stiker bintang cinta untuk karya inspiratif.',
                        'Rangkuman bersama dan penugasan publikasi di mading kelas.',
                    ],
                ],
            ],
            'diagnostic_assessment' => [
                'Bentuk: Tanya jawab lisan pemantik tentang pengalaman mengunjungi tempat favorit.',
                'Tujuan: Memetakan kepekaan indrawi dan kekayaan kosakata awal siswa.',
            ],
            'formative_assessment' => [
                'Bentuk: Lembar observasi sikap panca cinta (kerja sama, kejujuran menulis, empati apresiasi).',
                'Rubrik: Penilaian proses draf tulisan dan partisipasi dalam Gallery Walk.',
            ],
            'summative_assessment' => [
                'Bentuk: Produk teks deskripsi otentik 150-250 kata.',
                'Kriteria: Kesesuaian struktur, ketepatan diksi, kekuatan rasa, dan ketepatan tanda baca.',
            ],
            'remedial_enrichment' => [
                'Remedial: Bimbingan terbimbing menyusun kerangka teks menggunakan kartu panduan 5W+1H indrawi.',
                'Pengayaan: Menulis teks deskripsi dalam format blog mikro atau deskripsi foto media sekolah.',
            ],
            'student_worksheet_text' => 'LKPD: "Menulis dengan Mata Hati" - Amati sudut taman sekolah, catat apa yang kamu lihat, dengar, dan rasakan, lalu ubah menjadi untaian kalimat penuh keindahan!',
            'reading_materials' => 'Kumpulan Esai Deskriptif Sastra Nusantara, Kamus Besar Bahasa Indonesia (KBBI), Panduan Kurikulum KBC Kemenag RI.',
            'glossary' => [
                ['term' => 'Deskripsi', 'meaning' => 'Pemaparan atau penggambaran dengan kata-kata secara jelas dan terperinci.'],
                ['term' => 'Mindful Learning', 'meaning' => 'Pendekatan belajar dengan kesadaran penuh, fokus, dan ketenangan batin.'],
                ['term' => 'Panca Cinta', 'meaning' => 'Lima pilar nilai cinta kasih dalam kurikulum madrasah menurut KMA 1503/2025.'],
            ],
            'bibliography' => 'Kemendikbudristek (BSKAP 046/2025). Kemenag RI (KMA 1503/2025). Dirjen Pendis No. 6077/2025.',
        ];
    }

    private function generateMockAssessmentPackage(string $prompt): array
    {
        return [
            'title' => 'Asesmen Sumatif Akhir Semester (SAS) Berbasis KBC',
            'instructions' => 'Bacalah setiap stimulus bacaan dengan tenang dan saksama. Pilihlah satu jawaban yang paling tepat atau berikan uraian yang santun dan bernalar kritis.',
            'duration_minutes' => 90,
            'items' => [
                [
                    'question_number' => 1,
                    'learning_goal_id' => null,
                    'indicator_text' => 'Disajikan kutipan teks narasi inspiratif, peserta didik dapat mengidentifikasi sikap cinta sesama tokoh utama.',
                    'bloom_level' => 'C2',
                    'cognitive_tier' => 'L1',
                    'difficulty_level' => 'MUDAH',
                    'question_type' => 'PG',
                    'score_weight' => 1,
                    'stimulus_text' => 'Di tengah teriknya siang, Ahmad melihat seorang kakek kesulitan menyeberang jalan sambil membawa sekeranjang sayuran dagangan. Tanpa ragu, Ahmad menghampiri dan membantunya dengan senyum tulus serta tutur kata yang santun.',
                    'question_text' => 'Berdasarkan kutipan peristiwa di atas, nilai karakter luhur yang paling menonjol dicerminkan oleh Ahmad adalah...',
                    'options_data' => [
                        'A' => 'Cinta Diri dan Sesama (kepedulian sosial yang tulus)',
                        'B' => 'Kewajiban aturan lalu lintas secara terpaksa',
                        'C' => 'Keinginan memperoleh pujian masyarakat sekitar',
                        'D' => 'Rasa penasaran terhadap isi keranjang dagangan',
                    ],
                    'correct_answer' => 'A',
                    'explanation' => null,
                ],
                [
                    'question_number' => 2,
                    'learning_goal_id' => null,
                    'indicator_text' => 'Disajikan kasus pelestarian lingkungan madrasah, peserta didik dapat menganalisis dampak positif kepedulian ekologis (Cinta Lingkungan).',
                    'bloom_level' => 'C4',
                    'cognitive_tier' => 'L3',
                    'difficulty_level' => 'SULIT',
                    'question_type' => 'PG',
                    'score_weight' => 1,
                    'stimulus_text' => 'Kader Adiwiyata Madrasah mencanangkan program "Satu Murid Satu Biopori" dan pemilahan sampah organik untuk kompos. Dalam waktu tiga bulan, genangan air di halaman berkurang drastis dan tanaman hias tumbuh subur.',
                    'question_text' => 'Analisis yang paling tepat mengenai kaitan antara program tersebut dengan pilar Cinta Lingkungan (Hubbul Bi\'ah) adalah...',
                    'options_data' => [
                        'A' => 'Wujud syukur nyata atas karunia alam dari Tuhan',
                        'B' => 'Upaya semata-mata demi meraih piagam penghargaan',
                        'C' => 'Langkah penghematan biaya kebersihan madrasah',
                        'D' => 'Pemenuhan instruksi dinas tanpa dampak nyata',
                    ],
                    'correct_answer' => 'A',
                    'explanation' => null,
                ],
                [
                    'question_number' => 3,
                    'learning_goal_id' => null,
                    'indicator_text' => 'Disajikan masalah perbedaan pendapat dalam kerja kelompok, peserta didik dapat merumuskan solusi berbasis musyawarah dan adab cinta damai.',
                    'bloom_level' => 'C5',
                    'cognitive_tier' => 'L3',
                    'difficulty_level' => 'SULIT',
                    'question_type' => 'URAIAN',
                    'score_weight' => 3,
                    'stimulus_text' => 'Saat merancang mading kelas, terjadi silang pendapat sengit antara kelompok visual dan kelompok konten literasi. Suasana mulai memanas karena masing-masing merasa konsepnya paling istimewa.',
                    'question_text' => 'Bagaimanakah langkah konkret yang harus Anda ambil sebagai ketua kelas untuk merajut kembali persaudaraan dan menyatukan ide-ide tersebut berlandaskan prinsip Cinta Sesama dan Musyawarah?',
                    'options_data' => null,
                    'correct_answer' => 'Mengajak bermusyawarah dengan saling mendengarkan, memadukan keunggulan desain visual dan konten literasi secara kolaboratif, serta mengutamakan ukhuwah.',
                    'explanation' => null,
                ],
            ],
        ];
    }

    private function generateMockRubric(string $prompt): array
    {
        return [
            'title' => 'Rubrik Penilaian Karakter Panca Cinta & Kolaborasi',
            'rubric_type' => 'SIKAP_PANCA_CINTA',
            'description' => 'Instrumen observasi perkembangan karakter cinta kasih, kesadaran spiritual, kepedulian lingkungan, dan semangat kebangsaan.',
            'scoring_guidelines' => 'Skor Akhir = (Total Skor Perolehan / Skor Maksimal) x 100. Predikat: 86-100 (Sangat Baik / Membudaya), 71-85 (Baik / Berkembang), 56-70 (Cukup / Mulai Terlihat), <56 (Perlu Bimbingan).',
            'dimensions' => [
                [
                    'name' => 'Cinta Allah dan Rasul-Nya (Mahabbatullah wa Rasulihi)',
                    'aspect' => 'Keikhlasan, Kejujuran Akademik & Ketundukan Berdoa',
                    'descriptors' => [
                        'perlu_bimbingan' => 'Masih perlu diingatkan berulang kali untuk memulai kegiatan dengan doa dan bersikap jujur saat evaluasi.',
                        'cukup' => 'Menjalankan doa dengan khusyuk saat diawasi, sesekali menunjukkan kesadaran berbuat jujur.',
                        'baik' => 'Selalu berdoa dengan penuh penghayatan secara mandiri dan konsisten menjaga kejujuran dalam berucap dan bertindak.',
                        'sangat_baik' => 'Menunjukkan keteladanan spiritual, konsisten menjaga integritas tinggi, dan mampu mengajak teman berbuat kebaikan dengan santun.',
                    ],
                ],
                [
                    'name' => 'Cinta Diri dan Sesama (Hubbun Nafs wal Insan)',
                    'aspect' => 'Empati, Menghargai Perbedaan & Kerja Sama',
                    'descriptors' => [
                        'perlu_bimbingan' => 'Cenderung memaksakan kehendak dan enggan bekerja sama dengan teman yang berbeda latar belakang.',
                        'cukup' => 'Mau bekerja sama dalam kelompok yang ditentukan, namun belum berinisiatif mendengarkan pendapat rekan.',
                        'baik' => 'Mendengarkan gagasan teman secara apresiatif dan aktif berbagi peran dalam tugas kelompok.',
                        'sangat_baik' => 'Menjadi jembatan perdamaian, sangat peduli terhadap kesulitan rekan, serta proaktif menciptakan atmosfer kelas yang inklusif dan menyenangkan.',
                    ],
                ],
                [
                    'name' => 'Cinta Lingkungan dan Alam Sekitar (Hubbul Bi\'ah)',
                    'aspect' => 'Kebersihan, Penghematan Energi & Kepedulian Alam',
                    'descriptors' => [
                        'perlu_bimbingan' => 'Masih meninggalkan sampah di meja/lantai dan bersikap acuh terhadap kondisi lingkungan kelas.',
                        'cukup' => 'Membuang sampah pada tempatnya jika diperingatkan oleh guru atau petugas piket.',
                        'baik' => 'Secara mandiri menjaga kebersihan area belajarnya dan mematikan perangkat listrik yang tidak digunakan.',
                        'sangat_baik' => 'Pelopor gerakan bersih lingkungan kelas/madrasah, aktif memilah sampah, dan gemar merawat tanaman di sekitar.',
                    ],
                ],
            ],
        ];
    }
}
