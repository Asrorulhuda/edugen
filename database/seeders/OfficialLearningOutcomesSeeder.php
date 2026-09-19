<?php

namespace Database\Seeders;

use App\Models\CpAuditLog;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\LearningElement;
use App\Models\LearningOutcome;
use App\Models\LearningOutcomeVersion;
use App\Models\Phase;
use App\Models\Regulation;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class OfficialLearningOutcomesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::whereHas('memberships.role', function ($q) {
            $q->where('name', 'SUPER_ADMIN');
        })->first();

        $adminId = $superAdmin?->id;

        $regBskap = Regulation::where('code', 'BSKAP_046_2025')->firstOrFail();
        $regKma = Regulation::where('code', 'KMA_1503_2025')->firstOrFail();

        $phases = Phase::all()->keyBy('code');
        $levels = EducationLevel::all()->keyBy('code');
        $subjects = Subject::all()->keyBy('code');

        // Helper to retrieve element
        $getElement = function ($subjectCode, $elementCode) use ($subjects) {
            if (!isset($subjects[$subjectCode])) {
                return null;
            }
            return LearningElement::where('subject_id', $subjects[$subjectCode]->id)
                ->where('code', $elementCode)
                ->first();
        };

        // Master Authentic CP Data (BSKAP 046/2025 & KMA 1503/2025)
        $cpItems = [
            // ==========================================
            // BAHASA INDONESIA - FASE A (Kelas 1-2 SD/MI)
            // ==========================================
            [
                'code' => 'CP-BIN-FA-SIMAK',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'BIN-SIMAK',
                'source_locator' => 'BSKAP 046/2025 Hal. 48',
                'cp_text' => 'Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian. Peserta didik menunjukkan minat pada tuturan yang didengar serta mampu memahami pesan lisan dan informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), instruksi lisan, dan percakapan yang berkaitan dengan diri, keluarga, dan/atau lingkungan.',
            ],
            [
                'code' => 'CP-BIN-FA-BACA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'BIN-BACA',
                'source_locator' => 'BSKAP 046/2025 Hal. 48',
                'cp_text' => 'Peserta didik mampu bersikap menjadi pembaca dan pemirsa yang menunjukkan minat terhadap teks yang dibaca atau dipirsa. Peserta didik mampu membaca kata-kata yang dikenalinya sehari-hari dengan fasih. Peserta didik mampu memahami informasi dari bacaan dan tayangan yang dipirsa tentang diri dan lingkungan, narasi imajinatif, dan puisi anak. Peserta didik mampu memaknai kosakata baru dan/atau kosakata bahasa isyarat dari teks yang dibaca atau tayangan yang dipirsa dengan bantuan ilustrasi.',
            ],
            [
                'code' => 'CP-BIN-FA-BICARA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'BIN-BICARA',
                'source_locator' => 'BSKAP 046/2025 Hal. 49',
                'cp_text' => 'Peserta didik mampu berbicara dengan santun tentang beragam topik yang dikenali menggunakan volume dan intonasi yang tepat sesuai konteks. Peserta didik mampu merespons dengan bertanya tentang sesuatu, menjawab, dan menanggapi komentar orang lain (teman, guru, dan/atau orang dewasa) dengan baik dan santun dalam suatu percakapan. Peserta didik mampu mengungkapkan perasaan dan gagasan secara lisan dengan atau tanpa bantuan gambar/ilustrasi. Peserta didik mampu menceritakan kembali suatu isi teks yang dibaca atau didengar secara lisan dan/atau isyarat.',
            ],
            [
                'code' => 'CP-BIN-FA-TULIS',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'BIN-TULIS',
                'source_locator' => 'BSKAP 046/2025 Hal. 49',
                'cp_text' => 'Peserta didik mampu menunjukkan keterampilan menulis permulaan dengan benar (memegang alat tulis, menggerakkan alat tulis, mencoret/menebalkan, menyalin huruf, suku kata, kata, dan kalimat sederhana) di atas kertas dan/atau melalui media digital. Peserta didik mampu mengembangkan tulisan tangan yang semakin baik. Peserta didik mampu menulis berbagai teks sederhana tentang diri dan lingkungan menggunakan beberapa kalimat sederhana.',
            ],

            // ==========================================
            // BAHASA INDONESIA - FASE B (Kelas 3-4 SD/MI)
            // ==========================================
            [
                'code' => 'CP-BIN-FB-SIMAK',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'BIN-SIMAK',
                'source_locator' => 'BSKAP 046/2025 Hal. 50',
                'cp_text' => 'Peserta didik mampu memahami ide pokok (gagasan) suatu pesan lisan, informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), dan instruksi lisan yang berkaitan dengan hal-hal menarik di lingkungan sekitar. Peserta didik mampu memahami dan memaknai teks narasi yang dibacakan atau dari media audio.',
            ],
            [
                'code' => 'CP-BIN-FB-BACA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'BIN-BACA',
                'source_locator' => 'BSKAP 046/2025 Hal. 50',
                'cp_text' => 'Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari, teks narasi, dan puisi anak dalam bentuk cetak atau elektronik. Peserta didik mampu membaca kata-kata baru berdasarkan pola kombinasi huruf yang telah dikenali dengan fasih. Peserta didik mampu memahami ide pokok dan ide pendukung pada teks informatif serta menjelaskan hal-hal yang dihadapi oleh tokoh cerita pada teks narasi.',
            ],
            [
                'code' => 'CP-BIN-FB-BICARA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'BIN-BICARA',
                'source_locator' => 'BSKAP 046/2025 Hal. 51',
                'cp_text' => 'Peserta didik mampu berbicara dengan pilihan kata dan sikap tubuh/gestur yang santun, menggunakan volume dan intonasi yang tepat sesuai konteks. Peserta didik mampu mengajukan dan menanggapi pertanyaan dalam suatu percakapan dan diskusi dengan aktif. Peserta didik mampu menceritakan kembali suatu informasi yang dibaca atau didengar serta mempresentasikan ide atau topik dengan fasih.',
            ],
            [
                'code' => 'CP-BIN-FB-TULIS',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'BIN-TULIS',
                'source_locator' => 'BSKAP 046/2025 Hal. 51',
                'cp_text' => 'Peserta didik mampu menulis berbagai teks narasi dan teks deskripsi dengan rangkaian kalimat yang beragam, informasi yang lebih terperinci dan akurat dengan topik yang beragam. Peserta didik terampil menulis tegak bersambung.',
            ],

            // ==========================================
            // BAHASA INDONESIA - FASE D (Kelas 7-9 SMP/MTs)
            // ==========================================
            [
                'code' => 'CP-BIN-FD-SIMAK',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SMP',
                'phase' => 'FASE_D',
                'element_code' => 'BIN-SIMAK',
                'source_locator' => 'BSKAP 046/2025 Hal. 56',
                'cp_text' => 'Peserta didik mampu menganalisis dan mengevaluasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari berbagai tipe teks (fiksi dan nonfiksi) aural, audio visual dan teks visual. Peserta didik menginterpretasi informasi untuk mengungkapkan simpati, kepedulian, empati atau pendapat pro/kontra dari teks audiovisual dan aural secara kreatif.',
            ],
            [
                'code' => 'CP-BIN-FD-BACA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'BIN',
                'level' => 'SMP',
                'phase' => 'FASE_D',
                'element_code' => 'BIN-BACA',
                'source_locator' => 'BSKAP 046/2025 Hal. 57',
                'cp_text' => 'Peserta didik mampu memahami informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari teks deskripsi, narasi, puisi, eksplanasi dan eksposisi dari teks visual dan audiovisual untuk menemukan makna yang tersurat dan tersirat. Peserta didik menginterpretasikan informasi untuk mengungkapkan simpati, kepedulian, empati atau pendapat pro dan kontra dari teks visual dan audiovisual.',
            ],

            // ==========================================
            // MATEMATIKA - FASE A (Kelas 1-2 SD/MI)
            // ==========================================
            [
                'code' => 'CP-MAT-FA-BIL',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'MAT-BIL',
                'source_locator' => 'BSKAP 046/2025 Hal. 82',
                'cp_text' => 'Pada akhir fase A, peserta didik menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100. Mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan. Mereka juga dapat melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret yang banyaknya sampai 20.',
            ],
            [
                'code' => 'CP-MAT-FA-GEO',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'MAT-GEO',
                'source_locator' => 'BSKAP 046/2025 Hal. 83',
                'cp_text' => 'Pada akhir fase A, peserta didik dapat mengenal berbagai bangun datar (segitiga, segiempat, segi banyak, lingkaran) dan bangun ruang (balok, kubus, kerucut, dan bola). Mereka dapat menyusun (komposisi) dan mengurai (dekomposisi) suatu bangun datar (segitiga, segiempat, dan segi banyak). Peserta didik juga dapat menentukan posisi benda terhadap benda lain (kanan, kiri, depan, belakang, atas, bawah).',
            ],

            // ==========================================
            // MATEMATIKA - FASE B (Kelas 3-4 SD/MI)
            // ==========================================
            [
                'code' => 'CP-MAT-FB-BIL',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'MAT-BIL',
                'source_locator' => 'BSKAP 046/2025 Hal. 84',
                'cp_text' => 'Pada akhir fase B, peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000. Mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, menggunakan nilai tempat, melakukan komposisi dan dekomposisi bilangan tersebut. Mereka juga dapat menyelesaikan masalah berkaitan dengan uang menggunakan ribuan sebagai satuan. Mereka dapat melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 1.000 serta perkalian dan pembagian bilangan cacah sampai 100.',
            ],
            [
                'code' => 'CP-MAT-FB-UKUR',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'MAT-UKUR',
                'source_locator' => 'BSKAP 046/2025 Hal. 85',
                'cp_text' => 'Pada akhir fase B, peserta didik dapat mengukur panjang dan berat benda menggunakan satuan baku. Mereka dapat menentukan hubungan antar-satuan baku panjang (cm, m). Mereka dapat mengukur dan mengestimasi luas dan volume menggunakan satuan tidak baku dan satuan baku berupa bilangan cacah.',
            ],

            // ==========================================
            // MATEMATIKA - FASE D (Kelas 7-9 SMP/MTs)
            // ==========================================
            [
                'code' => 'CP-MAT-FD-BIL',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SMP',
                'phase' => 'FASE_D',
                'element_code' => 'MAT-BIL',
                'source_locator' => 'BSKAP 046/2025 Hal. 90',
                'cp_text' => 'Pada akhir fase D, peserta didik dapat membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional dan irasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah. Mereka dapat menerapkan operasi aritmetika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah (termasuk berkaitan dengan literasi finansial). Peserta didik dapat menggunakan faktorisasi prima dan pengertian rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah.',
            ],
            [
                'code' => 'CP-MAT-FD-ALJ',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'MAT',
                'level' => 'SMP',
                'phase' => 'FASE_D',
                'element_code' => 'MAT-ALJ',
                'source_locator' => 'BSKAP 046/2025 Hal. 91',
                'cp_text' => 'Pada akhir fase D, peserta didik dapat mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan objek dan bilangan. Mereka dapat menyatakan suatu situasi ke dalam bentuk aljabar. Mereka dapat menggunakan sifat-sifat operasi (komutatif, asosiatif, dan distributif) untuk menghasilkan bentuk aljabar yang ekuivalen. Peserta didik dapat memahami relasi dan fungsi (domain, kodomain, range) serta menyajikannya dalam bentuk diagram panah, tabel, himpunan pasangan berurutan, dan grafik. Mereka dapat membedakan beberapa fungsi nonlinear dari fungsi linear secara grafik.',
            ],

            // ==========================================
            // IPAS - FASE B (Kelas 3-4 SD/MI)
            // ==========================================
            [
                'code' => 'CP-IPAS-FB-PEM',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'IPAS',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'IPAS-PEM',
                'source_locator' => 'BSKAP 046/2025 Hal. 120',
                'cp_text' => 'Di akhir Fase B, peserta didik memahami bentuk dan fungsi panca indra; siklus hidup makhluk hidup; wujud zat dan perubahannya; bentuk dan sumber energi serta perubahannya dalam kehidupan sehari-hari; gejala kemagnetan dan kelistrikan; ragam bentang alam dan keterkaitannya dengan profesi masyarakat; peta lingkungan sekitar; kearifan lokal; keragaman budaya dan upaya pelestariannya; kebutuhan dan keinginan; serta nilai mata uang dan kegiatan ekonomi.',
            ],
            [
                'code' => 'CP-IPAS-FB-PROS',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'IPAS',
                'level' => 'SD',
                'phase' => 'FASE_B',
                'element_code' => 'IPAS-PROS',
                'source_locator' => 'BSKAP 046/2025 Hal. 121',
                'cp_text' => 'Peserta didik mengamati fenomena dan peristiwa secara sederhana dengan menggunakan panca indra, mencatat hasil pengamatannya, serta mencari persamaan dan perbedaannya. Dengan panduan, peserta didik dapat mengajukan pertanyaan lebih lanjut untuk memperjelas hasil pengamatan dan membuat prediksi tentang penyelidikan ilmiah. Peserta didik merencanakan dan melakukan langkah-langkah operasional berdasarkan instruksi serta mengomunikasikan hasil penyelidikan secara lisan dan tertulis dalam berbagai format.',
            ],

            // ==========================================
            // PENDIDIKAN PANCASILA - FASE A (Kelas 1-2 SD/MI)
            // ==========================================
            [
                'code' => 'CP-PPKN-FA-PANCA',
                'curriculum' => 'MERDEKA',
                'regulation' => $regBskap->id,
                'subject' => 'PPKN',
                'level' => 'SD',
                'phase' => 'FASE_A',
                'element_code' => 'PPKN-PANCA',
                'source_locator' => 'BSKAP 046/2025 Hal. 31',
                'cp_text' => 'Peserta didik mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila, dan menerapkan nilai-nilai Pancasila di lingkungan keluarga; mengenal para perumus Pancasila.',
            ],

            // ==========================================
            // AL-QUR'AN HADIS - FASE A (MI / Madrasah KBC)
            // ==========================================
            [
                'code' => 'CP-QH-FA-QURAN',
                'curriculum' => 'MADRASAH_KBC',
                'regulation' => $regKma->id,
                'subject' => 'QH',
                'level' => 'MI',
                'phase' => 'FASE_A',
                'element_code' => 'QH-QURAN',
                'source_locator' => 'KMA 1503/2025 Pedoman Kurikulum Madrasah',
                'cp_text' => 'Peserta didik mampu mengenal huruf hijaiyyah secara terpisah dan bersambung beserta tanda bacanya, membaca surah-surah pendek pilihan (al-Fatihah, an-Nas, al-Falaq, al-Ikhlas) dengan makhraj dan tajwid yang benar, serta menumbuhkan rasa cinta kepada kitab suci Al-Qur\'an sebagai pedoman hidup.',
            ],
            [
                'code' => 'CP-AA-FA-AKHLAK',
                'curriculum' => 'MADRASAH_KBC',
                'regulation' => $regKma->id,
                'subject' => 'AA',
                'level' => 'MI',
                'phase' => 'FASE_A',
                'element_code' => 'AA-AKHLAK',
                'source_locator' => 'KMA 1503/2025 Lampiran Kurikulum Berbasis Cinta',
                'cp_text' => 'Peserta didik mampu mempraktikkan adab bersin, menguap, makan, minum, dan berbicara santun kepada orang tua dan guru; menunjukkan kasih sayang dan cinta terhadap diri dan sesama teman, serta menjauhi perilaku menyakiti dalam kehidupan sehari-hari.',
            ],
            // ==========================================
            // FIKIH - FASE D (MTs / Madrasah KBC)
            // ==========================================
            [
                'code' => 'CP-FIQ-FD-IBADAH',
                'curriculum' => 'MADRASAH_KBC',
                'regulation' => $regKma->id,
                'subject' => 'FIQ',
                'level' => 'MTS',
                'phase' => 'FASE_D',
                'element_code' => 'FIQ-IBADAH',
                'source_locator' => 'KMA 1503/2025 Pedoman Kurikulum Madrasah',
                'cp_text' => 'Peserta didik mampu menganalisis tata cara thaharah dari najis dan hadas, shalat fardhu dan shalat sunnah, sujud sahwi, sujud tilawah, dan sujud syukur, serta zakat dan puasa sebagai bentuk ketundukan dan wujud cinta kepada Allah SWT dan sesama makhluk.',
            ],
        ];

        foreach ($cpItems as $item) {
            $subject = $subjects[$item['subject']] ?? null;
            $phase = $phases[$item['phase']] ?? null;
            $level = $levels[$item['level']] ?? null;
            $element = $getElement($item['subject'], $item['element_code']);

            if (!$subject || !$phase) {
                continue;
            }

            $checksum = LearningOutcome::generateChecksum($item['cp_text']);

            $lo = LearningOutcome::updateOrCreate(
                [
                    'code' => $item['code'],
                    'curriculum_code' => $item['curriculum'],
                ],
                [
                    'regulation_id' => $item['regulation'],
                    'subject_id' => $subject->id,
                    'education_level_id' => $level?->id,
                    'phase_id' => $phase->id,
                    'learning_element_id' => $element?->id,
                    'cp_text' => $item['cp_text'],
                    'source_locator' => $item['source_locator'],
                    'checksum' => $checksum,
                    'version' => 1,
                    'status' => LearningOutcome::STATUS_PUBLISHED,
                    'verified_by' => $adminId,
                    'verified_at' => now(),
                    'published_at' => now(),
                    'notes' => 'Authentic official CP master baseline.',
                    'updated_by' => $adminId,
                ]
            );

            // Record immutable version 1
            LearningOutcomeVersion::firstOrCreate(
                [
                    'learning_outcome_id' => $lo->id,
                    'version' => 1,
                ],
                [
                    'cp_text' => $item['cp_text'],
                    'element_name' => $element?->name,
                    'change_summary' => 'Initial verified official publication from BSKAP/KMA.',
                    'changed_by' => $adminId,
                    'created_at' => now(),
                ]
            );

            // Record audit log
            CpAuditLog::firstOrCreate(
                [
                    'learning_outcome_id' => $lo->id,
                    'action' => 'PUBLISH',
                ],
                [
                    'actor_id' => $adminId,
                    'reason' => 'Official baseline published for curriculum routing.',
                    'after_payload' => [
                        'code' => $lo->code,
                        'status' => $lo->status,
                        'checksum' => $lo->checksum,
                    ],
                    'created_at' => now(),
                ]
            );
        }
    }
}
