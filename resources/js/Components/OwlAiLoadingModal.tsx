import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export interface OwlAiLoadingModalProps {
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    providerName?: string;
    modelName?: string;
    type?: 'module' | 'assessment' | 'general';
}

const MODULE_STAGES = [
    { text: 'Owly sedang terbang menelaah Capaian Pembelajaran & TP acuan...', hint: 'Analisis Taksonomi & Kedalaman Materi' },
    { text: 'Meramu aktivitas pembelajaran Mindful, Meaningful, & Joyful...', hint: 'Desain Pengalaman Belajar KBC' },
    { text: 'Menyusun diferensiasi proses, konten, dan asesmen murid...', hint: 'Prinsip Inklusif & Kebutuhan Peserta Didik' },
    { text: 'Mengharmoniskan karakter Panca Cinta & Profil Kelulusan...', hint: 'Integrasi Nilai Karakter Islami' },
    { text: 'Sedikit lagi ya Ustadz/Ustadzah! Owly sedang mendaratkan format siap cetak...', hint: 'Finalisasi Struktur 14 Komponen Modul' },
];

const ASSESSMENT_STAGES = [
    { text: 'Owly sedang terbang merumuskan butir-butir soal berkualitas...', hint: 'Penyusunan Butir Soal Terarah' },
    { text: 'Merancang butir soal HOTS & taksonomi Bloom terukur...', hint: 'Variasi Level Kognitif C1 - C6' },
    { text: 'Menyiapkan opsi pengecoh berbobot dan kunci jawaban terverifikasi...', hint: 'Standar Mutu Pilihan Ganda & Uraian' },
    { text: 'Menyusun kisi-kisi dan rubrik penskoran terperinci...', hint: 'Pedoman Penilaian Otentik' },
    { text: 'Hampir selesai! Owly sedang membawa paket asesmen siap unduh...', hint: 'Finalisasi Paket Soal & Siap Uji' },
];

const GENERAL_STAGES = [
    { text: 'Owly sedang meluncur memproses instruksi kurikulum resmi...', hint: 'Sintesis Pengetahuan AI' },
    { text: 'Menyelaraskan struktur materi dengan panduan regulasi...', hint: 'Kepatuhan Standar Pendidikan' },
    { text: 'Merapikan redaksi bahasa agar ramah, jelas, dan bermakna...', hint: 'Sentuhan Pedagogis Cinta' },
    { text: 'Sebentar lagi mendarat! Dokumen berkualitas tinggi siap...', hint: 'Penyempurnaan Akhir' },
];

export default function OwlAiLoadingModal({
    isOpen,
    title = 'Owly Sedang Merancang Dokumen...',
    subtitle,
    providerName,
    modelName,
    type,
}: OwlAiLoadingModalProps) {
    const resolvedType = type || (
        title?.toLowerCase().includes('soal') || subtitle?.toLowerCase().includes('soal')
            ? 'assessment'
            : title?.toLowerCase().includes('modul') || subtitle?.toLowerCase().includes('modul') || title?.toLowerCase().includes('rpp')
            ? 'module'
            : 'general'
    );

    const stages = resolvedType === 'module' 
        ? MODULE_STAGES 
        : resolvedType === 'assessment' 
        ? ASSESSMENT_STAGES 
        : GENERAL_STAGES;

    const [stageIndex, setStageIndex] = useState(0);
    const [progress, setProgress] = useState(15);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setStageIndex(0);
            setProgress(15);
            return;
        }

        const stageInterval = setInterval(() => {
            setStageIndex((prev) => (prev + 1) % stages.length);
        }, 3600);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 40) return prev + 2.8;
                if (prev < 75) return prev + 1.6;
                if (prev < 93) return prev + 0.5;
                return 94;
            });
        }, 750);

        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 240);
        }, 2800);

        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
            clearInterval(blinkInterval);
        };
    }, [isOpen, stages.length]);

    if (!isOpen) return null;

    const currentStage = stages[stageIndex];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden"
            role="dialog" 
            aria-modal="true"
        >
            {/* Ambient Frosted Backdrop */}
            <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-md transition-opacity duration-300 animate-fade-in" />

            {/* Glowing Sky Aura behind Modal */}
            <div className="absolute w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none translate-x-28 -translate-y-20 animate-pulse" />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/25 text-center flex flex-col items-center animate-scale-up">
                
                {/* BIG FLYING OWL STAGE */}
                <div className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden mb-2">
                    {/* Horizontal Wind Lines */}
                    <div className="absolute w-16 h-0.5 rounded-full bg-emerald-300/40 dark:bg-emerald-500/30 top-10 left-6 animate-wind-1" />
                    <div className="absolute w-24 h-0.5 rounded-full bg-teal-300/50 dark:bg-teal-500/40 top-20 right-8 animate-wind-2" />
                    <div className="absolute w-14 h-0.5 rounded-full bg-amber-300/40 dark:bg-amber-500/30 bottom-14 left-10 animate-wind-3" />

                    {/* Fluffy Clouds Drifting Below */}
                    <div className="absolute -bottom-2 w-48 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 blur-sm animate-cloud-drift" />

                    {/* Magical Star Sparkles Floating in Flight */}
                    <span className="absolute top-2 left-8 text-amber-400 text-lg animate-bounce" style={{ animationDuration: '2s' }}>
                        ✦
                    </span>
                    <span className="absolute top-6 right-10 text-emerald-400 text-sm animate-pulse" style={{ animationDuration: '1.4s' }}>
                        ★
                    </span>
                    <span className="absolute bottom-8 right-14 text-teal-400 text-base animate-pulse" style={{ animationDuration: '2.5s' }}>
                        ✨
                    </span>

                    {/* Big Flying Owl SVG with Soaring Body Motion */}
                    <div className="w-56 h-44 sm:w-64 sm:h-52 animate-owl-soar drop-shadow-xl">
                        <svg
                            viewBox="0 0 200 160"
                            className="w-full h-full overflow-visible"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="flyOwlBody" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#047857" />
                                </linearGradient>
                                <linearGradient id="flyOwlBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#f0fdf4" />
                                    <stop offset="100%" stopColor="#dcfce7" />
                                </linearGradient>
                                <linearGradient id="flyOwlWing" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="flyBeak" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                                <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#fef3c7" />
                                    <stop offset="100%" stopColor="#fde68a" />
                                </linearGradient>
                            </defs>

                            {/* FLAPPING LEFT WING */}
                            <g className="animate-wing-left">
                                {/* Wing Outer Feathers */}
                                <path
                                    d="M 65 72 C 35 55, 5 60, -8 82 C 6 95, 30 92, 60 82 Z"
                                    fill="url(#flyOwlWing)"
                                    className="drop-shadow-sm"
                                />
                                {/* Inner Feather Detail */}
                                <path
                                    d="M 62 76 C 40 68, 18 72, 8 86 C 20 92, 42 86, 58 82 Z"
                                    fill="#047857"
                                    opacity="0.6"
                                />
                            </g>

                            {/* FLAPPING RIGHT WING */}
                            <g className="animate-wing-right">
                                {/* Wing Outer Feathers */}
                                <path
                                    d="M 135 72 C 165 55, 195 60, 208 82 C 194 95, 170 92, 140 82 Z"
                                    fill="url(#flyOwlWing)"
                                    className="drop-shadow-sm"
                                />
                                {/* Inner Feather Detail */}
                                <path
                                    d="M 138 76 C 160 68, 182 72, 192 86 C 180 92, 158 86, 142 82 Z"
                                    fill="#047857"
                                    opacity="0.6"
                                />
                            </g>

                            {/* MAIN OWL BODY (Tilted forward in flight) */}
                            <g>
                                {/* Feather Tufts on Head */}
                                <path d="M 72 40 L 60 14 L 84 28 Z" fill="#059669" />
                                <path d="M 128 40 L 140 14 L 116 28 Z" fill="#047857" />

                                {/* Oval Body Base */}
                                <rect
                                    x="62"
                                    y="24"
                                    width="76"
                                    height="82"
                                    rx="38"
                                    fill="url(#flyOwlBody)"
                                />

                                {/* Cute Belly */}
                                <ellipse
                                    cx="100"
                                    cy="78"
                                    rx="25"
                                    ry="22"
                                    fill="url(#flyOwlBelly)"
                                    opacity="0.96"
                                />

                                {/* Belly Feather Marks */}
                                <path
                                    d="M 94 72 Q 100 75 106 72 M 90 79 Q 100 83 110 79 M 95 86 Q 100 89 105 86"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                    opacity="0.8"
                                />

                                {/* Cheerful Blushing Cheeks */}
                                <circle cx="73" cy="62" r="5.5" fill="#f43f5e" opacity="0.45" />
                                <circle cx="127" cy="62" r="5.5" fill="#f43f5e" opacity="0.45" />

                                {/* Big White Eyes */}
                                <circle cx="83" cy="52" r="14.5" fill="#ffffff" />
                                <circle cx="117" cy="52" r="14.5" fill="#ffffff" />

                                {/* Dynamic Expressive Pupils */}
                                {isBlinking ? (
                                    <>
                                        <path
                                            d="M 76 52 Q 83 46 90 52"
                                            stroke="#0f172a"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            fill="none"
                                        />
                                        <path
                                            d="M 110 52 Q 117 46 124 52"
                                            stroke="#0f172a"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            fill="none"
                                        />
                                    </>
                                ) : (
                                    <g>
                                        <circle cx="83" cy="52" r="7.5" fill="#0f172a" />
                                        <circle cx="81" cy="49" r="2.8" fill="#ffffff" />
                                        <circle cx="86" cy="54" r="1.3" fill="#ffffff" />

                                        <circle cx="117" cy="52" r="7.5" fill="#0f172a" />
                                        <circle cx="115" cy="49" r="2.8" fill="#ffffff" />
                                        <circle cx="120" cy="54" r="1.3" fill="#ffffff" />
                                    </g>
                                )}

                                {/* Academic Round Glasses */}
                                <circle cx="83" cy="52" r="16" stroke="#065f46" strokeWidth="2.4" fill="none" />
                                <circle cx="117" cy="52" r="16" stroke="#065f46" strokeWidth="2.4" fill="none" />
                                <path d="M 99 50 Q 100 47 101 50" stroke="#065f46" strokeWidth="2.4" fill="none" />

                                {/* Cute Orange Beak */}
                                <polygon points="96,57 104,57 100,66" fill="url(#flyBeak)" />

                                {/* Scholar Toga Cap (Tilted with wind) */}
                                <g>
                                    <ellipse cx="100" cy="22" rx="13" ry="4.5" fill="#1e293b" />
                                    <polygon points="100,8 124,18 100,25 76,18" fill="#0f172a" />
                                    {/* Fluttering Tassel */}
                                    <g className="animate-tassel-fly origin-[100px_16px]">
                                        <path d="M 100 16 Q 116 14 122 24" stroke="#fbbf24" strokeWidth="2" fill="none" />
                                        <circle cx="122" cy="25" r="2.5" fill="#f59e0b" />
                                        <circle cx="100" cy="16" r="1.8" fill="#fbbf24" />
                                    </g>
                                </g>

                                {/* Flying Bird Talons tucked back */}
                                <ellipse cx="88" cy="106" rx="5" ry="3" fill="#f59e0b" transform="rotate(-15 88 106)" />
                                <ellipse cx="112" cy="106" rx="5" ry="3" fill="#f59e0b" transform="rotate(15 112 106)" />

                                {/* Golden Educational Scroll carried in Flight */}
                                <g transform="translate(74, 108)">
                                    <rect x="0" y="0" width="52" height="12" rx="3" fill="url(#scrollGrad)" stroke="#d97706" strokeWidth="1.2" />
                                    <line x1="6" y1="4" x2="46" y2="4" stroke="#b45309" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="6" y1="8" x2="38" y2="8" stroke="#b45309" strokeWidth="1" strokeDasharray="2,2" />
                                    {/* Red Ribbon on Scroll */}
                                    <rect x="23" y="-1" width="6" height="14" rx="1" fill="#ef4444" />
                                    <circle cx="26" cy="6" r="1.5" fill="#fef08a" />
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Owly Sedang Terbang Meracik Kurikulum</span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-1">
                    {title}
                </h3>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 max-w-sm leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {/* Speech Bubble / Dynamic Stage Box */}
                <div className="w-full mt-1 mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 min-h-[76px] flex flex-col justify-center text-center shadow-xs">
                    <p className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-relaxed transition-opacity duration-300">
                        "{currentStage.text}"
                    </p>
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Tahap: {currentStage.hint}
                    </span>
                </div>

                {/* Tactile Shimmer Progress Bar */}
                <div className="w-full space-y-1.5">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700 ease-out shadow-xs"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1">
                        <span>Penyusunan Berbasis Regulasi Resmi</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Engine Info if supplied */}
                {(providerName || modelName) && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Ditenagai:</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {providerName || 'EduGen Smart Engine'}
                        </span>
                        {modelName && (
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-500">
                                {modelName}
                            </span>
                        )}
                    </div>
                )}

                {/* Polite Reassurance Footnote */}
                <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 max-w-xs leading-tight">
                    ✨ Harap tetap di halaman ini. Owly akan segera mendarat membawa dokumen Anda.
                </p>
            </div>
        </div>
    );
}
