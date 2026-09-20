import React, { useState } from 'react';
import { Check, CheckCircle2, ChevronRight, FileCheck, Layers, Sparkles, Printer } from 'lucide-react';

interface WorkflowStep {
    number: string;
    tabTitle: string;
    status: string;
    title: string;
    desc: string;
    meta: string;
}

interface WorkflowSectionProps {
    content?: {
        section_badge?: string;
        section_title?: string;
        section_desc?: string;
        steps?: WorkflowStep[];
    };
}

const defaultSteps: WorkflowStep[] = [
    {
        number: '01',
        tabTitle: 'Pilih CP Resmi',
        status: 'CP Siap Digunakan (Read-only)',
        title: 'Guru memilih Capaian Pembelajaran (CP) resmi terverifikasi.',
        desc: 'Tidak ada prompt bebas untuk mengarang atau menebak teks CP. Guru memilih mata pelajaran, fase, dan kelas; sistem menampilkan sumber hukum resmi (BSKAP 046/2025 atau KMA 1503/2025) beserta versinya yang terkunci.',
        meta: 'BSKAP 046/H/KR/2025 & KMA 1503/2025',
    },
    {
        number: '02',
        tabTitle: 'Generate AI',
        status: 'Multi-Provider AI Terkalibrasi',
        title: 'AI menyusun TP, ATP, Modul Ajar KBC, dan Bank Soal.',
        desc: 'Generator AI (Gemini, Grok, DeepSeek, OpenRouter) bekerja berdasarkan acuan Taksonomi Bloom (C1-C6), 5 Pilar Karakter Panca Cinta Kemenag, dan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful).',
        meta: 'Sistem Terintegrasi Panca Cinta',
    },
    {
        number: '03',
        tabTitle: 'Validasi Guru',
        status: 'Pemeriksaan Pedagogis Terukur',
        title: 'Guru memvalidasi, menelaah indikator, dan menyunting butir.',
        desc: 'Guru memiliki kendali penuh untuk menyempurnakan indikator soal, level kognitif (L1/L2/L3), kunci jawaban, rubrik 4 skala deskriptif, dan diferensiasi pembelajaran sebelum disimpan.',
        meta: 'Kendali Penuh di Tangan Pendidik',
    },
    {
        number: '04',
        tabTitle: 'Export Kop Surat',
        status: 'Kop Surat Resmi Siap Pakai',
        title: 'Ekspor naskah ujian, kisi-kisi, modul ajar, dan rubrik ber-Kop Surat.',
        desc: 'Dokumen dicetak langsung dengan format kop surat resmi madrasah/sekolah, lengkap dengan tanda tangan Kepala Madrasah dan Guru Pengampu, bebas watermark.',
        meta: 'Format PDF, Cetak Browser & Kuitansi',
    },
];

export default function WorkflowSection({ content = {} }: WorkflowSectionProps) {
    const [activeStep, setActiveStep] = useState(0);
    const steps = content.steps && content.steps.length > 0 ? content.steps : defaultSteps;
    const current = steps[activeStep] || steps[0];

    return (
        <section id="alur" className="py-20 bg-slate-100/70 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {content.section_badge || 'Alur yang Dapat Diaudit'}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        {content.section_title || 'Dari CP ke dokumen cetak, setiap langkah tersinkronisasi.'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {content.section_desc || 'Setiap tahapan dirancang untuk memastikan guru tetap memegang kendali mutu intelektual dan pedagogis perangkat ajar.'}
                    </p>
                </div>

                {/* Step Tabs Pill Switcher */}
                <div className="flex flex-wrap justify-center gap-2">
                    {steps.map((step, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveStep(idx)}
                            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                                activeStep === idx
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs'
                            }`}
                        >
                            <span className="text-[10px] opacity-80 px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10">
                                {step.number}
                            </span>
                            <span>{step.tabTitle}</span>
                        </button>
                    ))}
                </div>

                {/* Step Display Card */}
                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                            Langkah {current.number} dari 04
                        </span>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                            {current.status}
                        </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {current.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {current.desc}
                    </p>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                        <span>Konteks Regulasi: <strong className="text-slate-700 dark:text-slate-200">{current.meta}</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" /> Terstandarisasi Otomatis
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
