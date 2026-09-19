<?php

namespace Database\Seeders;

use App\Models\EducationLevel;
use App\Models\Grade;
use App\Models\LearningElement;
use App\Models\Phase;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class AcademicMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Education Levels
        $levels = [
            ['code' => 'RA', 'name' => 'Raudhatul Athfal', 'category' => 'EARLY_CHILDHOOD', 'order_index' => 1],
            ['code' => 'SD', 'name' => 'Sekolah Dasar', 'category' => 'FORMAL', 'order_index' => 2],
            ['code' => 'MI', 'name' => 'Madrasah Ibtidaiyah', 'category' => 'MADRASAH', 'order_index' => 3],
            ['code' => 'SMP', 'name' => 'Sekolah Menengah Pertama', 'category' => 'FORMAL', 'order_index' => 4],
            ['code' => 'MTS', 'name' => 'Madrasah Tsanawiyah', 'category' => 'MADRASAH', 'order_index' => 5],
            ['code' => 'SMA', 'name' => 'Sekolah Menengah Atas', 'category' => 'FORMAL', 'order_index' => 6],
            ['code' => 'MA', 'name' => 'Madrasah Aliyah', 'category' => 'MADRASAH', 'order_index' => 7],
            ['code' => 'SMK', 'name' => 'Sekolah Menengah Kejuruan', 'category' => 'VOCATIONAL', 'order_index' => 8],
            ['code' => 'MAK', 'name' => 'Madrasah Aliyah Kejuruan', 'category' => 'VOCATIONAL', 'order_index' => 9],
        ];

        $levelMap = [];
        foreach ($levels as $lvl) {
            $levelMap[$lvl['code']] = EducationLevel::firstOrCreate(['code' => $lvl['code']], $lvl);
        }

        // 2. Phases
        $phases = [
            ['code' => 'FASE_FONDASI', 'name' => 'Fase Fondasi', 'level_summary' => 'PAUD / RA', 'order_index' => 1],
            ['code' => 'FASE_A', 'name' => 'Fase A', 'level_summary' => 'SD/MI Kelas 1 - 2', 'order_index' => 2],
            ['code' => 'FASE_B', 'name' => 'Fase B', 'level_summary' => 'SD/MI Kelas 3 - 4', 'order_index' => 3],
            ['code' => 'FASE_C', 'name' => 'Fase C', 'level_summary' => 'SD/MI Kelas 5 - 6', 'order_index' => 4],
            ['code' => 'FASE_D', 'name' => 'Fase D', 'level_summary' => 'SMP/MTs Kelas 7 - 9', 'order_index' => 5],
            ['code' => 'FASE_E', 'name' => 'Fase E', 'level_summary' => 'SMA/MA/SMK Kelas 10', 'order_index' => 6],
            ['code' => 'FASE_F', 'name' => 'Fase F', 'level_summary' => 'SMA/MA/SMK Kelas 11 - 12', 'order_index' => 7],
        ];

        $phaseMap = [];
        foreach ($phases as $ph) {
            $phaseMap[$ph['code']] = Phase::firstOrCreate(['code' => $ph['code']], $ph);
        }

        // 3. Grades
        $gradeDefinitions = [
            // RA
            ['level' => 'RA', 'phase' => 'FASE_FONDASI', 'number' => 'A', 'name' => 'Kelompok A', 'order' => 1],
            ['level' => 'RA', 'phase' => 'FASE_FONDASI', 'number' => 'B', 'name' => 'Kelompok B', 'order' => 2],
            // SD
            ['level' => 'SD', 'phase' => 'FASE_A', 'number' => '1', 'name' => 'Kelas 1 SD', 'order' => 1],
            ['level' => 'SD', 'phase' => 'FASE_A', 'number' => '2', 'name' => 'Kelas 2 SD', 'order' => 2],
            ['level' => 'SD', 'phase' => 'FASE_B', 'number' => '3', 'name' => 'Kelas 3 SD', 'order' => 3],
            ['level' => 'SD', 'phase' => 'FASE_B', 'number' => '4', 'name' => 'Kelas 4 SD', 'order' => 4],
            ['level' => 'SD', 'phase' => 'FASE_C', 'number' => '5', 'name' => 'Kelas 5 SD', 'order' => 5],
            ['level' => 'SD', 'phase' => 'FASE_C', 'number' => '6', 'name' => 'Kelas 6 SD', 'order' => 6],
            // MI
            ['level' => 'MI', 'phase' => 'FASE_A', 'number' => '1', 'name' => 'Kelas 1 MI', 'order' => 1],
            ['level' => 'MI', 'phase' => 'FASE_A', 'number' => '2', 'name' => 'Kelas 2 MI', 'order' => 2],
            ['level' => 'MI', 'phase' => 'FASE_B', 'number' => '3', 'name' => 'Kelas 3 MI', 'order' => 3],
            ['level' => 'MI', 'phase' => 'FASE_B', 'number' => '4', 'name' => 'Kelas 4 MI', 'order' => 4],
            ['level' => 'MI', 'phase' => 'FASE_C', 'number' => '5', 'name' => 'Kelas 5 MI', 'order' => 5],
            ['level' => 'MI', 'phase' => 'FASE_C', 'number' => '6', 'name' => 'Kelas 6 MI', 'order' => 6],
            // SMP
            ['level' => 'SMP', 'phase' => 'FASE_D', 'number' => '7', 'name' => 'Kelas 7 SMP', 'order' => 7],
            ['level' => 'SMP', 'phase' => 'FASE_D', 'number' => '8', 'name' => 'Kelas 8 SMP', 'order' => 8],
            ['level' => 'SMP', 'phase' => 'FASE_D', 'number' => '9', 'name' => 'Kelas 9 SMP', 'order' => 9],
            // MTs
            ['level' => 'MTS', 'phase' => 'FASE_D', 'number' => '7', 'name' => 'Kelas 7 MTs', 'order' => 7],
            ['level' => 'MTS', 'phase' => 'FASE_D', 'number' => '8', 'name' => 'Kelas 8 MTs', 'order' => 8],
            ['level' => 'MTS', 'phase' => 'FASE_D', 'number' => '9', 'name' => 'Kelas 9 MTs', 'order' => 9],
            // SMA
            ['level' => 'SMA', 'phase' => 'FASE_E', 'number' => '10', 'name' => 'Kelas 10 SMA', 'order' => 10],
            ['level' => 'SMA', 'phase' => 'FASE_F', 'number' => '11', 'name' => 'Kelas 11 SMA', 'order' => 11],
            ['level' => 'SMA', 'phase' => 'FASE_F', 'number' => '12', 'name' => 'Kelas 12 SMA', 'order' => 12],
            // MA
            ['level' => 'MA', 'phase' => 'FASE_E', 'number' => '10', 'name' => 'Kelas 10 MA', 'order' => 10],
            ['level' => 'MA', 'phase' => 'FASE_F', 'number' => '11', 'name' => 'Kelas 11 MA', 'order' => 11],
            ['level' => 'MA', 'phase' => 'FASE_F', 'number' => '12', 'name' => 'Kelas 12 MA', 'order' => 12],
            // SMK
            ['level' => 'SMK', 'phase' => 'FASE_E', 'number' => '10', 'name' => 'Kelas 10 SMK', 'order' => 10],
            ['level' => 'SMK', 'phase' => 'FASE_F', 'number' => '11', 'name' => 'Kelas 11 SMK', 'order' => 11],
            ['level' => 'SMK', 'phase' => 'FASE_F', 'number' => '12', 'name' => 'Kelas 12 SMK', 'order' => 12],
        ];

        foreach ($gradeDefinitions as $g) {
            Grade::firstOrCreate(
                [
                    'education_level_id' => $levelMap[$g['level']]->id,
                    'grade_number' => $g['number'],
                ],
                [
                    'phase_id' => $phaseMap[$g['phase']]->id,
                    'name' => $g['name'],
                    'order_index' => $g['order'],
                ]
            );
        }

        // 4. Subjects
        $subjects = [
            [
                'code' => 'BIN',
                'name' => 'Bahasa Indonesia',
                'category' => 'GENERAL',
                'education_level_scope' => ['SD', 'MI', 'SMP', 'MTS', 'SMA', 'MA', 'SMK', 'MAK'],
                'description' => 'Mata pelajaran Bahasa Indonesia Kurikulum Merdeka & Madrasah.',
                'elements' => [
                    ['code' => 'BIN-SIMAK', 'name' => 'Menyimak', 'description' => 'Kemampuan memahami, menginterpretasi, dan mengevaluasi informasi yang didengar.'],
                    ['code' => 'BIN-BACA', 'name' => 'Membaca dan Memirsa', 'description' => 'Kemampuan memahami, menafsirkan, dan merefleksi teks visual dan tertulis.'],
                    ['code' => 'BIN-BICARA', 'name' => 'Berbicara dan Mempresentasikan', 'description' => 'Kemampuan menyampaikan gagasan, pikiran, dan perasaan secara lisan dan terstruktur.'],
                    ['code' => 'BIN-TULIS', 'name' => 'Menulis', 'description' => 'Kemampuan menyampaikan gagasan, pikiran, dan perasaan dalam bentuk teks tertulis.'],
                ],
            ],
            [
                'code' => 'MAT',
                'name' => 'Matematika',
                'category' => 'GENERAL',
                'education_level_scope' => ['SD', 'MI', 'SMP', 'MTS', 'SMA', 'MA', 'SMK', 'MAK'],
                'description' => 'Mata pelajaran Matematika Kurikulum Merdeka & Madrasah.',
                'elements' => [
                    ['code' => 'MAT-BIL', 'name' => 'Bilangan', 'description' => 'Representasi, operasi, dan relasi antar bilangan.'],
                    ['code' => 'MAT-ALJ', 'name' => 'Aljabar', 'description' => 'Pola, relasi, fungsi, persamaan dan pertidaksamaan.'],
                    ['code' => 'MAT-UKUR', 'name' => 'Pengukuran', 'description' => 'Besaran dan satuan ukuran matematis.'],
                    ['code' => 'MAT-GEO', 'name' => 'Geometri', 'description' => 'Sifat, bentuk, posisi spasial objek bangun datar dan ruang.'],
                    ['code' => 'MAT-DATA', 'name' => 'Analisis Data dan Peluang', 'description' => 'Penyajian, interpretasi data dan penentuan peluang.'],
                ],
            ],
            [
                'code' => 'IPAS',
                'name' => 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
                'category' => 'GENERAL',
                'education_level_scope' => ['SD', 'MI'],
                'description' => 'Integrasi IPA dan IPS untuk jenjang SD/MI Fase B dan C.',
                'elements' => [
                    ['code' => 'IPAS-PEM', 'name' => 'Pemahaman IPAS (Sains dan Sosial)', 'description' => 'Pemahaman konsep dasar sains alam dan interaksi sosial budaya.'],
                    ['code' => 'IPAS-PROS', 'name' => 'Keterampilan Proses', 'description' => 'Mengamati, mempertanyakan, menyelidiki, menganalisis, dan mengomunikasikan.'],
                ],
            ],
            [
                'code' => 'IPA',
                'name' => 'Ilmu Pengetahuan Alam (IPA)',
                'category' => 'GENERAL',
                'education_level_scope' => ['SMP', 'MTS'],
                'description' => 'Mata pelajaran IPA jenjang SMP/MTs Fase D.',
                'elements' => [
                    ['code' => 'IPA-PEM', 'name' => 'Pemahaman IPA', 'description' => 'Penguasaan konsep sains fisika, biologi, dan kimia dasar.'],
                    ['code' => 'IPA-PROS', 'name' => 'Keterampilan Proses', 'description' => 'Inkuiri ilmiah dan pemecahan masalah empiris.'],
                ],
            ],
            [
                'code' => 'IPS',
                'name' => 'Ilmu Pengetahuan Sosial (IPS)',
                'category' => 'GENERAL',
                'education_level_scope' => ['SMP', 'MTS'],
                'description' => 'Mata pelajaran IPS jenjang SMP/MTs Fase D.',
                'elements' => [
                    ['code' => 'IPS-PEM', 'name' => 'Pemahaman Konsep', 'description' => 'Pemahaman ruang, interaksi sosial, ekonomi, dan sejarah bangsa.'],
                    ['code' => 'IPS-PROS', 'name' => 'Keterampilan Proses', 'description' => 'Meneliti fenomena sosial dan berpikir kritis kebangsaan.'],
                ],
            ],
            [
                'code' => 'PPKN',
                'name' => 'Pendidikan Pancasila',
                'category' => 'GENERAL',
                'education_level_scope' => ['SD', 'MI', 'SMP', 'MTS', 'SMA', 'MA', 'SMK', 'MAK'],
                'description' => 'Pendidikan Pancasila dan Kewarganegaraan.',
                'elements' => [
                    ['code' => 'PPKN-PANCA', 'name' => 'Pancasila', 'description' => 'Nilai-nilai luhur dan implementasi sila-sila Pancasila.'],
                    ['code' => 'PPKN-UUD', 'name' => 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945', 'description' => 'Konstitusi, hak dan kewajiban warga negara.'],
                    ['code' => 'PPKN-BHINNEKA', 'name' => 'Bhinneka Tunggal Ika', 'description' => 'Keragaman suku, agama, ras, dan kebudayaan nusantara.'],
                    ['code' => 'PPKN-NKRI', 'name' => 'Negara Kesatuan Republik Indonesia', 'description' => 'Keutuhan wilayah, kedaulatan, dan persatuan bangsa.'],
                ],
            ],
            [
                'code' => 'BIG',
                'name' => 'Bahasa Inggris',
                'category' => 'GENERAL',
                'education_level_scope' => ['SD', 'MI', 'SMP', 'MTS', 'SMA', 'MA', 'SMK', 'MAK'],
                'description' => 'Mata pelajaran Bahasa Inggris.',
                'elements' => [
                    ['code' => 'BIG-LISSPEAK', 'name' => 'Menyimak - Berbicara (Listening - Speaking)', 'description' => 'Interaksi dan komunikasi lisan.'],
                    ['code' => 'BIG-READVIEW', 'name' => 'Membaca - Memirsa (Reading - Viewing)', 'description' => 'Pemahaman teks bahasa Inggris multimodal.'],
                    ['code' => 'BIG-WRITEPRES', 'name' => 'Menulis - Mempresentasikan (Writing - Presenting)', 'description' => 'Produksi teks tertulis dan presentasi ide.'],
                ],
            ],
            [
                'code' => 'INF',
                'name' => 'Informatika',
                'category' => 'GENERAL',
                'education_level_scope' => ['SMP', 'MTS', 'SMA', 'MA', 'SMK'],
                'description' => 'Berpikir komputasional, sistem komputer, dan literasi digital.',
                'elements' => [
                    ['code' => 'INF-BK', 'name' => 'Berpikir Komputasional (BK)', 'description' => 'Problem solving berbantuan logika komputasi.'],
                    ['code' => 'INF-TIK', 'name' => 'Teknologi Informasi dan Komunikasi (TIK)', 'description' => 'Pemanfaatan peranti lunak dan aplikasi digital.'],
                    ['code' => 'INF-SK', 'name' => 'Sistem Komputer (SK)', 'description' => 'Arsitektur perangkat keras dan perangkat lunak.'],
                    ['code' => 'INF-JKI', 'name' => 'Jaringan Komputer dan Internet (JKI)', 'description' => 'Konektivitas dan komunikasi data internet.'],
                    ['code' => 'INF-AD', 'name' => 'Analisis Data (AD)', 'description' => 'Pengolahan, pemodelan, dan analisis data empiris.'],
                    ['code' => 'INF-AP', 'name' => 'Algoritma dan Pemrograman (AP)', 'description' => 'Rancang bangun solusi algoritma dan koding.'],
                    ['code' => 'INF-DSI', 'name' => 'Dampak Sosial Informatika (DSI)', 'description' => 'Etika, keamanan siber, dan aspek hukum digital.'],
                    ['code' => 'INF-PLB', 'name' => 'Praktik Lintas Bidang (PLB)', 'description' => 'Proyek kolaboratif informatika kontekstual.'],
                ],
            ],
            // PAI & Bahasa Arab Madrasah (Kemenag)
            [
                'code' => 'QH',
                'name' => 'Al-Qur\'an Hadis',
                'category' => 'RELIGION',
                'education_level_scope' => ['MI', 'MTS', 'MA'],
                'description' => 'Mapel Pendidikan Agama Islam Madrasah (Kemenag).',
                'elements' => [
                    ['code' => 'QH-QURAN', 'name' => 'Al-Qur\'an', 'description' => 'Kajian ayat, hukum bacaan tajwid, dan pemahaman kandungan surat pilihan.'],
                    ['code' => 'QH-HADIS', 'name' => 'Hadis', 'description' => 'Kajian matan hadis nabi, pemaknaan, dan aplikasi akhlak sunnah.'],
                ],
            ],
            [
                'code' => 'AA',
                'name' => 'Akidah Akhlak',
                'category' => 'RELIGION',
                'education_level_scope' => ['MI', 'MTS', 'MA'],
                'description' => 'Mapel Akidah dan Pembinaan Karakter Akhlak Mulia Madrasah.',
                'elements' => [
                    ['code' => 'AA-AKIDAH', 'name' => 'Akidah', 'description' => 'Rukun iman, asmaul husna, dan keimanan mendalam.'],
                    ['code' => 'AA-AKHLAK', 'name' => 'Akhlak Terpuji', 'description' => 'Adab keseharian, cinta sesama, dan penghindaran akhlak mazmumah.'],
                ],
            ],
            [
                'code' => 'FIQ',
                'name' => 'Fikih',
                'category' => 'RELIGION',
                'education_level_scope' => ['MI', 'MTS', 'MA'],
                'description' => 'Mapel Hukum Ibadah dan Muamalah Islam Madrasah.',
                'elements' => [
                    ['code' => 'FIQ-IBADAH', 'name' => 'Fikih Ibadah', 'description' => 'Thaharah, shalat, zakat, puasa, dan haji.'],
                    ['code' => 'FIQ-MUAMALAH', 'name' => 'Fikih Muamalah', 'description' => 'Akad transaksi, keadilan ekonomi, dan hukum sosial kemasyarakatan.'],
                ],
            ],
            [
                'code' => 'SKI',
                'name' => 'Sejarah Kebudayaan Islam (SKI)',
                'category' => 'RELIGION',
                'education_level_scope' => ['MI', 'MTS', 'MA'],
                'description' => 'Sejarah dakwah Nabi, Khulafaur Rasyidin, dan peradaban Islam.',
                'elements' => [
                    ['code' => 'SKI-NABI', 'name' => 'Periode Kenabian', 'description' => 'Dakwah Rasulullah di Makkah dan Madinah.'],
                    ['code' => 'SKI-PERADABAN', 'name' => 'Peradaban Islam Nusantara & Dunia', 'description' => 'Penyebaran Islam damai dan kebudayaan nusantara.'],
                ],
            ],
            [
                'code' => 'BAR',
                'name' => 'Bahasa Arab',
                'category' => 'ARABIC',
                'education_level_scope' => ['MI', 'MTS', 'MA'],
                'description' => 'Mata pelajaran Bahasa Arab Madrasah.',
                'elements' => [
                    ['code' => 'BAR-ISTIMA', 'name' => 'Menyimak (Istima\')', 'description' => 'Keterampilan mendengarkan intonasi dan kosa kata bahasa Arab.'],
                    ['code' => 'BAR-KALAM', 'name' => 'Berbicara (Kalam)', 'description' => 'Percakapan dan ungkapan komunikatif lisan harian.'],
                    ['code' => 'BAR-QIRAAT', 'name' => 'Membaca (Qira\'ah)', 'description' => 'Membaca teks Arab fusha dengan intonasi tepat.'],
                    ['code' => 'BAR-KITABAH', 'name' => 'Menulis (Kitabah)', 'description' => 'Menulis khat dan struktur kalimat bahasa Arab sederhana.'],
                ],
            ],
        ];

        foreach ($subjects as $s) {
            $elements = $s['elements'] ?? [];
            unset($s['elements']);

            $subject = Subject::firstOrCreate(['code' => $s['code']], $s);

            foreach ($elements as $el) {
                LearningElement::firstOrCreate(
                    [
                        'subject_id' => $subject->id,
                        'code' => $el['code'],
                    ],
                    [
                        'name' => $el['name'],
                        'description' => $el['description'],
                    ]
                );
            }
        }
    }
}
