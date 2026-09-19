<?php

namespace Database\Seeders;

use App\Models\LandingPageSection;
use Illuminate\Database\Seeder;

class LandingPageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            'hero' => [
                'title' => 'Hero Banner Utama',
                'content' => [
                    'badge_text' => 'Kurikulum Berbasis Cinta (KBC) • BSKAP 046 & KMA 1503',
                    'headline_gradient' => 'Perangkat Pembelajaran Terintegrasi',
                    'headline_main' => 'Capaian Pembelajaran Resmi, Bukan Karangan AI.',
                    'subheadline' => 'EduGen KBC memadukan kecerdasan buatan multi-provider terkalibrasi dengan Capaian Pembelajaran nasional resmi BSKAP dan Kemenag. Susun TP, ATP, Modul Ajar KBC, Bank Soal HOTS, dan Rubrik Panca Cinta secara presisi, akuntabel, dan siap cetak berkop dinas.',
                    'cta_primary_text' => 'Mulai Susun Perangkat Sekarang',
                    'cta_primary_link' => '/register',
                    'cta_secondary_text' => 'Jelajahi Alur 4 Langkah',
                    'cta_secondary_link' => '#workflow',
                    'feature_bullets' => [
                        'CP Resmi Terkunci & Read-Only',
                        'Multi-Provider AI Terarah',
                        'Format Cetak Kop Resmi Madrasah/Sekolah',
                    ],
                ],
                'is_active' => true,
            ],
            'stats' => [
                'title' => 'Statistik & Metrik Dampak',
                'content' => [
                    'items' => [
                        [
                            'value' => '100%',
                            'label' => 'Kepatuhan Regulasi',
                            'description' => 'Sesuai BSKAP 046/2025 & KMA 1503/2025 tanpa halusinasi prompt.',
                        ],
                        [
                            'value' => '5 Dimensi',
                            'label' => 'Panca Cinta Kemenag',
                            'description' => 'Mahabbatullah, Hubbul Ilm, Nafs, Biah, dan Wathan terintegrasi.',
                        ],
                        [
                            'value' => '3 Pilar',
                            'label' => 'Deep Learning',
                            'description' => 'Mindful, Meaningful, dan Joyful Learning dalam modul ajar.',
                        ],
                        [
                            'value' => '1 Klik',
                            'label' => 'Ekspor Kop Surat Resmi',
                            'description' => 'Tanda tangan Kepala Madrasah & Guru Pengampu siap cetak.',
                        ],
                    ],
                ],
                'is_active' => true,
            ],
            'workflow' => [
                'title' => 'Alur Kerja 4 Langkah',
                'content' => [
                    'section_badge' => 'Alur Terstruktur',
                    'section_title' => 'Bekerja dengan Alur yang Menjamin Kualitas Pedagogis',
                    'section_desc' => 'Setiap tahapan dirancang untuk memastikan guru tetap memegang kendali mutu intelektual dan pedagogis perangkat ajar.',
                    'steps' => [
                        [
                            'number' => '01',
                            'tabTitle' => 'Pilih CP',
                            'status' => 'CP Siap Digunakan (Read-only)',
                            'title' => 'Guru memilih Capaian Pembelajaran (CP) resmi terverifikasi.',
                            'desc' => 'Tidak ada prompt bebas untuk mengarang atau menebak teks CP. Guru memilih mata pelajaran, fase, dan kelas; sistem menampilkan sumber hukum resmi (BSKAP 046/2025 atau KMA 1503/2025) beserta versinya yang terkunci.',
                            'meta' => 'BSKAP 046/H/KR/2025 & KMA 1503/2025',
                        ],
                        [
                            'number' => '02',
                            'tabTitle' => 'Generate',
                            'status' => 'Multi-Provider AI Terkalibrasi',
                            'title' => 'AI menyusun TP, ATP, Modul Ajar KBC, dan Bank Soal.',
                            'desc' => 'Generator AI (Gemini, Grok, DeepSeek, OpenRouter) bekerja berdasarkan acuan Taksonomi Bloom (C1-C6), 5 Pilar Karakter Panca Cinta Kemenag, dan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful).',
                            'meta' => 'Sistem Terintegrasi Panca Cinta',
                        ],
                        [
                            'number' => '03',
                            'tabTitle' => 'Validasi',
                            'status' => 'Pemeriksaan Pedagogis Terukur',
                            'title' => 'Guru memvalidasi, menelaah indikator, dan menyunting butir.',
                            'desc' => 'Guru memiliki kendali penuh untuk menyempurnakan indikator soal, level kognitif (L1/L2/L3), kunci jawaban, rubrik 4 skala deskriptif, dan diferensiasi pembelajaran sebelum disimpan.',
                            'meta' => 'Kontrol Penuh di Tangan Pendidik',
                        ],
                        [
                            'number' => '04',
                            'tabTitle' => 'Export & Cetak',
                            'status' => 'Kop Surat Resmi Siap Pakai',
                            'title' => 'Ekspor naskah ujian, kisi-kisi, modul ajar, dan rubrik ber-Kop Surat.',
                            'desc' => 'Dokumen dicetak langsung dengan format kop surat resmi madrasah/sekolah, lengkap dengan tanda tangan Kepala Madrasah dan Guru Pengampu, bebas watermark.',
                            'meta' => 'Format PDF, Cetak Browser & Kuitansi',
                        ],
                    ],
                ],
                'is_active' => true,
            ],
            'features' => [
                'title' => 'Fitur & Keunggulan EduGen KBC',
                'content' => [
                    'section_badge' => 'Integrasi Karakter & Pedagogi',
                    'section_title' => 'Bukan Sekadar Generator Biasa, Ini Ekosistem Kurikulum Utuh',
                    'section_desc' => 'Didesain khusus untuk pendidik di Indonesia dengan standar regulasi Kemendikdasmen dan Kementerian Agama RI.',
                    'cards' => [
                        [
                            'title' => 'Kurikulum Berbasis Cinta (KBC)',
                            'description' => 'Menerjemahkan 5 Dimensi Panca Cinta dan 8 Dimensi Profil Lulusan ke dalam rencana aktivitas nyata, apersepsi bermakna, dan rubrik asesmen karakter.',
                            'tag' => 'Kemenag RI',
                        ],
                        [
                            'title' => 'Asesmen HOTS & Kisi-Kisi Matriks',
                            'description' => 'Pembuatan paket soal Pilihan Ganda Kompleks, Menjodohkan, Isian, dan Uraian lengkap dengan stimulus kontekstual dan level kognitif L1, L2, L3.',
                            'tag' => 'Standar Asesmen',
                        ],
                        [
                            'title' => 'Modul Ajar Deep Learning',
                            'description' => 'Skenario pembelajaran berprinsip Mindful (berkesadaran), Meaningful (bermakna), dan Joyful (menggembirakan) dengan diferensiasi konten dan proses.',
                            'tag' => 'Pedagogi Modern',
                        ],
                    ],
                ],
                'is_active' => true,
            ],
            'faqs' => [
                'title' => 'Pertanyaan yang Sering Diajukan (FAQ)',
                'content' => [
                    'section_badge' => 'Tanya Jawab',
                    'section_title' => 'Pertanyaan yang Sering Diajukan',
                    'section_desc' => 'Semua yang perlu Anda ketahui tentang EduGen KBC, kepatuhan regulasi, dan cara kerjanya.',
                    'items' => [
                        [
                            'q' => 'Apakah AI di EduGen KBC membuat atau mengarang teks Capaian Pembelajaran (CP)?',
                            'a' => 'Tidak. CP berasal dari database master platform yang dikelola Super Admin dari regulasi resmi pemerintah (BSKAP 046/2025 dan KMA 1503/2025). AI hanya merumuskan turunan perangkat (TP, ATP, RPP/Modul Ajar, Kisi-kisi, Soal) berdasarkan CP resmi tersebut.',
                        ],
                        [
                            'q' => 'Apa perbedaan akun Guru Mandiri (Personal) dan Akun Instansi (Madrasah/Sekolah)?',
                            'a' => 'Guru Mandiri memiliki Personal Workspace untuk merancang perangkat secara independen. Akun Instansi memiliki ruang kerja kelembagaan dengan 2 peran: Admin Madrasah (mengatur profil, kop surat, tahun ajaran, dan mengundang guru) serta Guru (merancang seluruh perangkat ajar). Satu akun bisa berpindah workspace kapan saja.',
                        ],
                        [
                            'q' => 'Bagaimana integrasi Kurikulum Berbasis Cinta (KBC) diterapkan di platform ini?',
                            'a' => 'EduGen KBC mengintegrasikan 5 Dimensi Panca Cinta (Mahabbatullah, Hubbul Ilm, Hubbun Nafs wal Insan, Hubbul Biah, Hubbul Wathan), 3 Pilar Pembelajaran Mendalam (Mindful, Meaningful, Joyful), dan 8 Dimensi Profil Lulusan ke dalam skenario kegiatan belajar, asesmen, dan rubrik observasi sikap.',
                        ],
                        [
                            'q' => 'Metode pembayaran apa saja yang didukung untuk langganan?',
                            'a' => 'Kami mendukung Transfer Bank Manual bebas biaya admin (Bank Syariah Indonesia / BSI, BCA, Mandiri, BRI), QRIS Standar Bank Indonesia untuk semua aplikasi e-wallet & mobile banking, serta pembayaran instan melalui Payment Gateway Xendit dan Tripay.',
                        ],
                        [
                            'q' => 'Apakah dokumen perangkat ajar dan soal dapat langsung dicetak?',
                            'a' => 'Ya! Semua Modul Ajar KBC, Bank Soal Siswa, Kunci Jawaban & Pembahasan, Kisi-kisi (Blueprint), serta Rubrik Penilaian dilengkapi kop surat resmi madrasah/sekolah dan tanda tangan pejabat yang siap cetak atau simpan sebagai PDF langsung dari peramban.',
                        ],
                    ],
                ],
                'is_active' => true,
            ],
            'footer' => [
                'title' => 'Footer, Bantuan & Kontak',
                'content' => [
                    'brand_name' => 'EduGen KBC',
                    'tagline' => 'Platform Generator Perangkat Pembelajaran & Modul Ajar Berbasis Cinta (KBC) dengan Capaian Pembelajaran Resmi BSKAP 046/2025 & KMA 1503/2025.',
                    'contact_email' => 'support@edugen.id',
                    'contact_whatsapp' => '0812-3456-7890',
                    'contact_address' => 'Jakarta, Indonesia',
                    'copyright_text' => 'Hak Cipta Terpelihara • EduGen KBC Indonesia.',
                    'social_links' => [
                        'instagram' => 'https://instagram.com',
                        'youtube' => 'https://youtube.com',
                        'telegram' => 'https://telegram.org',
                    ],
                ],
                'is_active' => true,
            ],
        ];

        foreach ($sections as $key => $data) {
            LandingPageSection::updateOrCreate(
                ['key' => $key],
                [
                    'title' => $data['title'],
                    'content' => $data['content'],
                    'is_active' => $data['is_active'],
                ]
            );
        }
    }
}
