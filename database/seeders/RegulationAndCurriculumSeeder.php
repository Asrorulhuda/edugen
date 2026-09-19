<?php

namespace Database\Seeders;

use App\Models\CurriculumFramework;
use App\Models\Regulation;
use App\Models\SourcePolicy;
use Illuminate\Database\Seeder;

class RegulationAndCurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Curricula
        $merdeka = CurriculumFramework::firstOrCreate(
            ['code' => CurriculumFramework::MERDEKA],
            [
                'name' => 'Kurikulum Merdeka',
                'description' => 'Kerangka kurikulum nasional berfokus pada materi esensial, pengembangan karakter, dan kompetensi peserta didik.',
                'config_json' => [
                    'principles' => ['Berpusat pada peserta didik', 'Kontekstual', 'Fleksibel', 'Holistik'],
                    'graduate_dimensions' => [
                        'Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa',
                        'Kewargaan',
                        'Penalaran Kritis',
                        'Kreativitas',
                        'Kolaborasi',
                        'Kemandirian',
                        'Kesehatan',
                        'Komunikasi',
                    ],
                ],
                'is_active' => true,
            ]
        );

        $madrasahKbc = CurriculumFramework::firstOrCreate(
            ['code' => CurriculumFramework::MADRASAH_KBC],
            [
                'name' => 'Kurikulum Madrasah (KBC & Pembelajaran Mendalam)',
                'description' => 'Pedoman kurikulum madrasah terintegrasi Kurikulum Berbasis Cinta (KBC) dan prinsip Pembelajaran Mendalam sesuai KMA 1503/2025.',
                'config_json' => [
                    'panca_cinta' => [
                        [
                            'key' => 'ALLAH_RASUL',
                            'name' => 'Cinta Allah dan Rasul-Nya',
                            'description' => 'Mewujudkan tauhid, ketaatan ibadah, adab sunnah, dan rasa syukur yang mendalam.',
                        ],
                        [
                            'key' => 'ILMU',
                            'name' => 'Cinta Ilmu',
                            'description' => 'Rasa ingin tahu tinggi, gemar membaca, berpikir kritis, dan menjunjung kebenaran ilmiah.',
                        ],
                        [
                            'key' => 'LINGKUNGAN',
                            'name' => 'Cinta Lingkungan',
                            'description' => 'Menjaga kelestarian alam, adab terhadap makhluk hidup, kebersihan, dan ekologi berkelanjutan.',
                        ],
                        [
                            'key' => 'DIRI_SESAMA',
                            'name' => 'Cinta Diri dan Sesama Manusia',
                            'description' => 'Menghargai martabat diri, empati, tolong-menolong, toleransi, dan anti-perundungan.',
                        ],
                        [
                            'key' => 'TANAH_AIR',
                            'name' => 'Cinta Tanah Air',
                            'description' => 'Komitmen kebangsaan, moderasi beragama, menghargai jasa pahlawan, dan persatuan NKRI.',
                        ],
                    ],
                    'deep_learning_principles' => [
                        ['code' => 'BERKESADARAN', 'name' => 'Berkesadaran (Mindful)', 'description' => 'Pembelajaran yang hadir secara utuh, sadar tujuan belajar, dan berfokus pada makna hakiki.'],
                        ['code' => 'BERMAKNA', 'name' => 'Bermakna (Meaningful)', 'description' => 'Keterhubungan materi dengan kehidupan nyata, pemecahan masalah autentik, dan kebermanfaatan sosial.'],
                        ['code' => 'MENGGEMBIRAKAN', 'name' => 'Menggembirakan (Joyful)', 'description' => 'Suasana belajar ramah, memotivasi, menumbuhkan gairah eksplorasi tanpa rasa takut.'],
                    ],
                    'learning_experiences' => [
                        ['code' => 'MEMAHAMI', 'name' => 'Memahami', 'description' => 'Eksplorasi konsep, menemukan fakta, dan membangun pemahaman mendalam.'],
                        ['code' => 'MENGAPLIKASI', 'name' => 'Mengaplikasi', 'description' => 'Mempraktikkan konsep, mencipta karya, dan menyelesaikan masalah nyata.'],
                        ['code' => 'MEREFLEKSI', 'name' => 'Merefleksi', 'description' => 'Mengevaluasi proses belajar, mengambil hikmah (ibrah), dan menginternalisasi nilai cinta.'],
                    ],
                    'assessment_stages' => [
                        ['code' => 'INITIAL', 'name' => 'Asesmen Awal (Diagnostik)'],
                        ['code' => 'FORMATIVE', 'name' => 'Asesmen Formatif (Berkelanjutan)'],
                        ['code' => 'SUMMATIVE', 'name' => 'Asesmen Sumatif (Akhir Lingkup Materi / Semester)'],
                    ],
                ],
                'is_active' => true,
            ]
        );

        // 2. Official Regulations
        $regBskap = Regulation::firstOrCreate(
            ['code' => 'BSKAP_046_2025'],
            [
                'title' => 'Keputusan Kepala BSKAP No. 046/H/KR/2025 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah pada Kurikulum Merdeka',
                'authority' => 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) Kemendikbudristek RI',
                'year' => 2025,
                'issued_at' => '2025-02-15',
                'effective_at' => '2025-07-01',
                'status' => 'ACTIVE',
                'notes' => 'Master rujukan CP resmi mata pelajaran umum SD/MI, SMP/MTs, SMA/MA/SMK.',
            ]
        );

        $regKma = Regulation::firstOrCreate(
            ['code' => 'KMA_1503_2025'],
            [
                'title' => 'Keputusan Menteri Agama No. 1503 Tahun 2025 tentang Perubahan atas KMA No. 450 Tahun 2024 tentang Pedoman Implementasi Kurikulum pada Madrasah',
                'authority' => 'Kementerian Agama Republik Indonesia',
                'year' => 2025,
                'issued_at' => '2025-01-20',
                'effective_at' => '2025-07-01',
                'status' => 'ACTIVE',
                'notes' => 'Pedoman implementasi kurikulum madrasah, pembelajaran mendalam, dan integrasi KBC.',
            ]
        );

        $regPendis = Regulation::firstOrCreate(
            ['code' => 'DIRJEN_PENDIS_6077_2025'],
            [
                'title' => 'Keputusan Direktur Jenderal Pendidikan Islam No. 6077 Tahun 2025 tentang Panduan Kurikulum Berbasis Cinta (KBC) pada Madrasah',
                'authority' => 'Direktorat Jenderal Pendidikan Islam Kementerian Agama RI',
                'year' => 2025,
                'issued_at' => '2025-02-01',
                'effective_at' => '2025-07-01',
                'status' => 'ACTIVE',
                'notes' => 'Panduan operasional implementasi Panca Cinta pada perencanaan dan modul ajar madrasah.',
            ]
        );

        // 3. Source Policies (Routing Matrix)
        $policies = [
            // Kurikulum Merdeka - Mapel Umum -> BSKAP 046/2025
            [
                'curriculum_code' => 'MERDEKA',
                'subject_category' => 'GENERAL',
                'regulation_id' => $regBskap->id,
                'priority' => 1,
            ],
            // Madrasah KBC - Mapel Umum -> BSKAP 046/2025
            [
                'curriculum_code' => 'MADRASAH_KBC',
                'subject_category' => 'GENERAL',
                'regulation_id' => $regBskap->id,
                'priority' => 1,
            ],
            // Madrasah KBC - Mapel Agama (PAI) -> KMA 1503/2025
            [
                'curriculum_code' => 'MADRASAH_KBC',
                'subject_category' => 'RELIGION',
                'regulation_id' => $regKma->id,
                'priority' => 1,
            ],
            // Madrasah KBC - Bahasa Arab -> KMA 1503/2025
            [
                'curriculum_code' => 'MADRASAH_KBC',
                'subject_category' => 'ARABIC',
                'regulation_id' => $regKma->id,
                'priority' => 1,
            ],
        ];

        foreach ($policies as $p) {
            SourcePolicy::firstOrCreate(
                [
                    'curriculum_code' => $p['curriculum_code'],
                    'subject_category' => $p['subject_category'],
                    'regulation_id' => $p['regulation_id'],
                ],
                [
                    'priority' => $p['priority'],
                    'is_active' => true,
                ]
            );
        }
    }
}
