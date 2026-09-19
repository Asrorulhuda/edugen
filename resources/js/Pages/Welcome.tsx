import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    FileCheck,
    FileSpreadsheet,
    FileText,
    Layers,
    Menu,
    School,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

interface WelcomeProps extends PageProps {
    sections?: Record<
        string,
        {
            id: number;
            key: string;
            title: string;
            content: any;
            is_active: boolean;
        }
    >;
}

export default function Welcome({ auth, sections }: WelcomeProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Dynamic sections with fallback defaults
    const hero = sections?.hero?.content || {};
    const statsItems = sections?.stats?.content?.items || [
        { value: '100%', label: 'Kepatuhan Regulasi', description: 'Sesuai BSKAP 046/2025 & KMA 1503/2025 tanpa halusinasi prompt.' },
        { value: '5 Dimensi', label: 'Panca Cinta Kemenag', description: 'Mahabbatullah, Hubbul Ilm, Nafs, Biah, dan Wathan terintegrasi.' },
        { value: '3 Pilar', label: 'Deep Learning', description: 'Mindful, Meaningful, dan Joyful Learning dalam modul ajar.' },
        { value: '1 Klik', label: 'Ekspor Kop Surat Resmi', description: 'Tanda tangan Kepala Madrasah & Guru Pengampu siap cetak.' },
    ];

    const workflow = sections?.workflow?.content || {};
    const workflowSteps = workflow.steps || [
        {
            number: '01',
            tabTitle: 'Pilih CP',
            status: 'CP Siap Digunakan (Read-only)',
            title: 'Guru memilih Capaian Pembelajaran (CP) resmi terverifikasi.',
            desc: 'Tidak ada prompt bebas untuk mengarang atau menebak teks CP. Guru memilih mata pelajaran, fase, dan kelas; sistem menampilkan sumber hukum resmi (BSKAP 046/2025 atau KMA 1503/2025) beserta versinya yang terkunci.',
            meta: 'BSKAP 046/H/KR/2025 & KMA 1503/2025',
        },
        {
            number: '02',
            tabTitle: 'Generate',
            status: 'Multi-Provider AI Terkalibrasi',
            title: 'AI menyusun TP, ATP, Modul Ajar KBC, dan Bank Soal.',
            desc: 'Generator AI (Gemini, Grok, DeepSeek, OpenRouter) bekerja berdasarkan acuan Taksonomi Bloom (C1-C6), 5 Pilar Karakter Panca Cinta Kemenag, dan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful).',
            meta: 'Sistem Terintegrasi Panca Cinta',
        },
        {
            number: '03',
            tabTitle: 'Validasi',
            status: 'Pemeriksaan Pedagogis Terukur',
            title: 'Guru memvalidasi, menelaah indikator, dan menyunting butir.',
            desc: 'Guru memiliki kendali penuh untuk menyempurnakan indikator soal, level kognitif (L1/L2/L3), kunci jawaban, rubrik 4 skala deskriptif, dan diferensiasi pembelajaran sebelum disimpan.',
            meta: 'Kontrol Penuh di Tangan Pendidik',
        },
        {
            number: '04',
            tabTitle: 'Export & Cetak',
            status: 'Kop Surat Resmi Siap Pakai',
            title: 'Ekspor naskah ujian, kisi-kisi, modul ajar, dan rubrik ber-Kop Surat.',
            desc: 'Dokumen dicetak langsung dengan format kop surat resmi madrasah/sekolah, lengkap dengan tanda tangan Kepala Madrasah dan Guru Pengampu, bebas watermark.',
            meta: 'Format PDF, Cetak Browser & Kuitansi',
        },
    ];

    const features = sections?.features?.content || {};
    const featureCards = features.cards || [
        {
            title: 'Kurikulum Berbasis Cinta (KBC)',
            description: 'Menerjemahkan 5 Dimensi Panca Cinta dan 8 Dimensi Profil Lulusan ke dalam rencana aktivitas nyata, apersepsi bermakna, dan rubrik asesmen karakter.',
            tag: 'Kemenag RI',
        },
        {
            title: 'Asesmen HOTS & Kisi-Kisi Matriks',
            description: 'Pembuatan paket soal Pilihan Ganda Kompleks, Menjodohkan, Isian, dan Uraian lengkap dengan stimulus kontekstual dan level kognitif L1, L2, L3.',
            tag: 'Standar Asesmen',
        },
        {
            title: 'Modul Ajar Deep Learning',
            description: 'Skenario pembelajaran berprinsip Mindful (berkesadaran), Meaningful (bermakna), dan Joyful (menggembirakan) dengan diferensiasi konten dan proses.',
            tag: 'Pedagogi Modern',
        },
    ];

    const faqData = sections?.faqs?.content || {};
    const faqs = faqData.items || [
        {
            q: 'Apakah AI di EduGen KBC membuat atau mengarang teks Capaian Pembelajaran (CP)?',
            a: 'Tidak. CP berasal dari database master platform yang dikelola Super Admin dari regulasi resmi pemerintah (BSKAP 046/2025 dan KMA 1503/2025). AI hanya merumuskan turunan perangkat (TP, ATP, RPP/Modul Ajar, Kisi-kisi, Soal) berdasarkan CP resmi tersebut.',
        },
        {
            q: 'Apa perbedaan akun Guru Mandiri (Personal) dan Akun Instansi (Madrasah/Sekolah)?',
            a: 'Guru Mandiri memiliki Personal Workspace untuk merancang perangkat secara independen. Akun Instansi memiliki ruang kerja kelembagaan dengan 2 peran: Admin Madrasah (mengatur profil, kop surat, tahun ajaran, dan mengundang guru) serta Guru (merancang seluruh perangkat ajar). Satu akun bisa berpindah workspace kapan saja.',
        },
        {
            q: 'Bagaimana integrasi Kurikulum Berbasis Cinta (KBC) diterapkan di platform ini?',
            a: 'EduGen KBC mengintegrasikan 5 Dimensi Panca Cinta (Mahabbatullah, Hubbul Ilm, Hubbun Nafs wal Insan, Hubbul Biah, Hubbul Wathan), 3 Pilar Pembelajaran Mendalam (Mindful, Meaningful, Joyful), dan 8 Dimensi Profil Lulusan ke dalam skenario kegiatan belajar, asesmen, dan rubrik observasi sikap.',
        },
        {
            q: 'Metode pembayaran apa saja yang didukung untuk langganan?',
            a: 'Kami mendukung Transfer Bank Manual bebas biaya admin (Bank Syariah Indonesia / BSI, BCA, Mandiri, BRI), QRIS Standar Bank Indonesia untuk semua aplikasi e-wallet & mobile banking, serta pembayaran instan melalui Payment Gateway Xendit dan Tripay.',
        },
        {
            q: 'Apakah dokumen perangkat ajar dan soal dapat langsung dicetak?',
            a: 'Ya! Semua Modul Ajar KBC, Bank Soal Siswa, Kunci Jawaban & Pembahasan, Kisi-kisi (Blueprint), serta Rubrik Penilaian dilengkapi kop surat resmi madrasah/sekolah dan tanda tangan pejabat yang siap cetak atau simpan sebagai PDF langsung dari peramban.',
        },
    ];

    const footer = sections?.footer?.content || {};

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
            <Head>
                <title>EduGen KBC — Platform Perangkat Guru & Modul Ajar dari CP Terverifikasi</title>
                <meta
                    name="description"
                    content="EduGen KBC adalah platform Multi-SaaS untuk menyusun TP, ATP, Modul Ajar KBC, Bank Soal HOTS, kisi-kisi, dan rubrik Panca Cinta dari Capaian Pembelajaran resmi."
                />
            </Head>

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-sm">
                                E
                            </div>
                            <div>
                                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                                    EduGen <span className="text-emerald-600 dark:text-emerald-400">KBC</span>
                                </span>
                                <span className="hidden sm:block text-[9px] uppercase font-bold tracking-wider text-slate-400">
                                    Kurikulum Berbasis Cinta
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <a href="#produk" className="hover:text-emerald-600 transition">Produk</a>
                            <a href="#alur" className="hover:text-emerald-600 transition">Alur Kerja</a>
                            <a href="#model" className="hover:text-emerald-600 transition">Guru & Madrasah</a>
                            <a href="#harga" className="hover:text-emerald-600 transition">Harga Paket</a>
                            <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                            >
                                Dashboard <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                >
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 md:hidden rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 text-xs font-semibold">
                        <a href="#produk" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Produk</a>
                        <a href="#alur" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Alur Kerja</a>
                        <a href="#model" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Guru & Madrasah</a>
                        <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Harga Paket</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">FAQ</a>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-16 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                    {hero.badge_text || 'Kurikulum Berbasis Cinta (KBC) • BSKAP 046 & KMA 1503'}
                                </div>

                                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {hero.headline_gradient || 'Perangkat guru yang lahir dari'}{' '}
                                    <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 underline-offset-4">
                                        {hero.headline_main || 'CP resmi, bukan tebakan AI.'}
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {hero.subheadline ||
                                        'Susun Tujuan Pembelajaran (TP), Alur TP (ATP), Modul Ajar KBC, kisi-kisi asesmen, butir soal HOTS, dan rubrik karakter Panca Cinta dengan kendali pedagogis penuh di tangan pendidik.'}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                                    <Link
                                        href={hero.cta_primary_link || route('register')}
                                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                                    >
                                        {hero.cta_primary_text || 'Mulai sebagai Guru Mandiri'}{' '}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={hero.cta_secondary_link || route('register')}
                                        className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4 text-emerald-600" />
                                        {hero.cta_secondary_text || 'Daftarkan Madrasah / Sekolah'}
                                    </Link>
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-[11px] font-semibold text-slate-400">
                                    {(hero.feature_bullets || [
                                        'BSKAP 046 & KMA 1503',
                                        'Multi-SaaS Tenancy',
                                        'Panca Cinta & Deep Learning',
                                        'Siap Cetak Ber-Kop Surat',
                                    ]).map((bullet: string, idx: number) => (
                                        <span key={idx} className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            {bullet}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Interactive Bento Preview */}
                            <div className="lg:col-span-5">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                Modul Ajar KBC Preview
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                            Tervalidasi Resmi
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                                            <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">
                                                Capaian Pembelajaran (CP Terkunci)
                                            </span>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                Menganalisis adab pergaulan, empati sosial, dan akhlak terpuji.
                                            </p>
                                            <span className="text-[10px] text-slate-400 block mt-1">
                                                Rujukan: KMA 1503/2025 • Fase D • Kelas 7
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                                                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
                                                    Panca Cinta KBC
                                                </span>
                                                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                                                    Hubbun Nafs wal Insan (Cinta Sesama)
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                                                <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1">
                                                    Deep Learning
                                                </span>
                                                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                                                    Mindful, Meaningful, Joyful
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                    Naskah Soal & Rubrik Asesmen
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    Soal HOTS Stimulus Kontekstual & 4 Skala Deskriptif
                                                </span>
                                            </div>
                                            <FileCheck className="w-5 h-5 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regulation Strip */}
                <section className="bg-slate-900 text-white py-4 border-y border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                            Rujukan Regulasi Nasional Terverifikasi:
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                BSKAP 046/H/KR/2025 (Kemendikbudristek)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                KMA 1503/2025 (Kemenag RI)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                Panduan KBC & Dirjen Pendis 6077/2025
                            </span>
                        </div>
                    </div>
                </section>

                {/* Dynamic Stats Grid */}
                {sections?.stats?.is_active !== false && statsItems.length > 0 && (
                    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {statsItems.map((stat: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-center space-y-1.5 transition hover:shadow-xs"
                                    >
                                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {stat.label}
                                        </div>
                                        <div className="text-[11px] text-slate-400 leading-snug">
                                            {stat.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Feature Bento Section */}
                <section id="produk" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                {features.section_badge || 'Ekosistem Kurikulum Lengkap'}
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {features.section_title ||
                                    'Satu sistem yang menjaga hubungan antara sumber, perangkat, dan evaluasi.'}
                            </h2>
                            {features.section_desc && (
                                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                                    {features.section_desc}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featureCards.map((card: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3 transition hover:border-emerald-500/40"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-black">
                                            0{idx + 1}
                                        </div>
                                        {card.tag && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                                                {card.tag}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Interactive Tabs */}
                <section id="alur" className="py-20 bg-slate-100 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                Alur yang Dapat Diaudit
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                Dari CP ke dokumen cetak, setiap langkah tersinkronisasi.
                            </h2>
                        </div>

                        {/* Step Tabs */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {workflowSteps.map((step: any, idx: number) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveWorkflowStep(idx)}
                                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                                        activeWorkflowStep === idx
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="text-[10px] opacity-70">{step.number}</span>
                                    <span>{step.tabTitle}</span>
                                </button>
                            ))}
                        </div>

                        {/* Step Display Card */}
                        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400">
                                    Langkah {workflowSteps[activeWorkflowStep].number} dari 04
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    {workflowSteps[activeWorkflowStep].status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {workflowSteps[activeWorkflowStep].title}
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {workflowSteps[activeWorkflowStep].desc}
                            </p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span>Konteks: {workflowSteps[activeWorkflowStep].meta}</span>
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Terstandarisasi
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Plans Teaser */}
                <section id="harga" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                Model Langganan Transparan
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                Disesuaikan untuk Guru Mandiri dan Lembaga Pendidikan
                            </h2>
                            <p className="text-xs text-slate-500 mt-2">
                                Dukungan transfer bank manual (BSI, BCA, Mandiri, BRI), QRIS instan, dan gateway Xendit/Tripay.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Individual Teacher Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs flex flex-col justify-between space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                                        Personal Workspace
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Guru Mandiri (Pro)
                                    </h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                                            Rp 49.000
                                        </span>
                                        <span className="text-xs text-slate-400 ml-1">/ bulan</span>
                                    </div>

                                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            250 Kuota Generasi AI Cerdas per bulan
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            Generator TP, Alur TP, dan Modul Ajar KBC Lengkap
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            Bank Soal HOTS & Rubrik Sikap Panca Cinta
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            Cetak Lembar Ujian & Kunci Jawaban Siap Pakai
                                        </li>
                                    </ul>
                                </div>

                                <Link
                                    href={route('register')}
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl text-center hover:bg-slate-800 transition shadow-xs"
                                >
                                    Daftar Guru Mandiri
                                </Link>
                            </div>

                            {/* Institution Card */}
                            <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-3xl border border-emerald-800/40 p-8 shadow-lg text-white flex flex-col justify-between space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                        Madrasah / Sekolah Workspace
                                    </span>
                                    <h3 className="text-xl font-bold text-white">
                                        Paket Madrasah & Sekolah
                                    </h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-black text-white">
                                            Rp 299.000
                                        </span>
                                        <span className="text-xs text-slate-300 ml-1">/ bulan (Maks. 15 Guru)</span>
                                    </div>

                                    <ul className="space-y-3 text-xs text-slate-200">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                            1.500 Kuota Bersama Generasi AI per bulan
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                            Termasuk Lisensi 15 Akun Guru Madrasah
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                            Kop Surat & Logo Resmi Lembaga Otomatis
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                            Dukungan Multi-Provider AI (Gemini, Grok, DeepSeek, OpenRouter)
                                        </li>
                                    </ul>
                                </div>

                                <Link
                                    href={route('register')}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl text-center transition shadow-md"
                                >
                                    Daftarkan Madrasah Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-slate-100 dark:bg-slate-900/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        <div className="text-center">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                Pertanyaan Umum (FAQ)
                            </p>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                Informasi Penting Sebelum Memulai
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-slate-400 transition-transform ${
                                                openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''
                                            }`}
                                        />
                                    </button>
                                    {openFaqIndex === idx && (
                                        <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                            Mulai dari sumber yang benar sekarang.
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
                            Buat perangkat guru lebih cepat tanpa melepaskan kontrol pedagogis. Bergabunglah bersama para pendidik inspiratif di seluruh Indonesia.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-950 hover:bg-slate-100 text-xs font-bold rounded-2xl transition shadow-lg"
                            >
                                Daftar Akun Gratis
                            </Link>
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-8 py-3.5 border border-white/30 hover:bg-white/10 text-white text-xs font-bold rounded-2xl transition"
                            >
                                Masuk ke Workspace
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-3 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                                E
                            </div>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {footer.brand_name || 'EduGen KBC'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                            {footer.tagline ||
                                'Platform SaaS penyusunan perangkat guru dan modul ajar berbasis Capaian Pembelajaran resmi BSKAP Kemendikbudristek dan KMA Kemenag RI.'}
                        </p>
                        {footer.contact_whatsapp && (
                            <div className="pt-1">
                                <a
                                    href={`https://wa.me/${footer.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-100 transition"
                                >
                                    <span>Bantuan WhatsApp: {footer.contact_whatsapp}</span>
                                </a>
                            </div>
                        )}
                    </div>

                    <div>
                        <strong className="text-slate-900 dark:text-white block mb-2 font-semibold">
                            Navigasi
                        </strong>
                        <ul className="space-y-1.5">
                            <li><a href="#produk" className="hover:text-emerald-600">Fitur & Modul Ajar</a></li>
                            <li><a href="#alur" className="hover:text-emerald-600">Alur Kerja Guru</a></li>
                            <li><a href="#harga" className="hover:text-emerald-600">Harga Paket</a></li>
                            <li><a href="#faq" className="hover:text-emerald-600">Tanya Jawab</a></li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-slate-900 dark:text-white block mb-2 font-semibold">
                            Legal & Kontak
                        </strong>
                        <ul className="space-y-1.5">
                            <li><span>BSKAP 046/H/KR/2025</span></li>
                            <li><span>KMA 1503/2025</span></li>
                            {footer.contact_email && (
                                <li><span>Email: {footer.contact_email}</span></li>
                            )}
                            {footer.contact_address && (
                                <li><span>{footer.contact_address}</span></li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>{footer.copyright_text || '© 2026 EduGen KBC Indonesia. Hak Cipta Dilindungi.'}</span>
                    <span>Regulasi kurikulum resmi Republik Indonesia tetap menjadi rujukan utama.</span>
                </div>
            </footer>
        </div>
    );
}
