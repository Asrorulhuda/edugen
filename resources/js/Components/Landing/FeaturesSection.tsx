import React from 'react';
import { Heart, Sparkles, BookOpen, Layers, Award, CheckCircle2, School, GraduationCap } from 'lucide-react';

interface FeatureCard {
    title: string;
    description: string;
    tag?: string;
}

interface FeaturesSectionProps {
    content?: {
        section_badge?: string;
        section_title?: string;
        section_desc?: string;
        cards?: FeatureCard[];
    };
}

export default function FeaturesSection({ content = {} }: FeaturesSectionProps) {
    return (
        <section id="kurikulum" className="py-20 bg-slate-100/50 dark:bg-slate-900/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Fleksibilitas Kurikulum Nasional
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        Satu Akun EduGen untuk 2 Kurikulum Resmi
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Baik Anda mengajar di sekolah umum maupun madrasah, EduGen menyediakan alur perumusan perangkat ajar yang patuh pada acuan hukum masing-masing kementerian.
                    </p>
                </div>

                {/* 2 Kurikulum Berdampingan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Kurikulum Merdeka Card */}
                    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-200/80 dark:border-blue-900/50 p-7 sm:p-8 shadow-xs space-y-5 transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <School className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 tracking-wide uppercase">
                                Kemendikdasmen
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                                Regulasi BSKAP 046/H/KR/2025
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Kurikulum Merdeka
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Untuk Sekolah Umum: SD, SMP, SMA, dan SMK (Fase A s.d. Fase F)
                            </p>
                        </div>

                        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span><strong>Capaian Pembelajaran (CP) Resmi Terkunci</strong> sesuai mata pelajaran dan fase umum.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span><strong>3 Pilar Pembelajaran Mendalam (Deep Learning)</strong>: Mindful, Meaningful, dan Joyful Learning.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span><strong>Diferensiasi Pembelajaran</strong> konten, proses, dan produk sesuai kesiapan peserta didik.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Kurikulum Berbasis Cinta (KBC) Card */}
                    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-200/80 dark:border-emerald-900/50 p-7 sm:p-8 shadow-xs space-y-5 transition-all duration-300 hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Heart className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                                Kementerian Agama RI
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                                Regulasi KMA No. 1503 Tahun 2025
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Kurikulum Berbasis Cinta (KBC)
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Untuk Madrasah: RA, MI, MTs, dan MA (Fase Fondasi s.d. Fase F)
                            </p>
                        </div>

                        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Integrasi 5 Dimensi Panca Cinta</strong>: Mahabbatullah, Hubbul Ilm, Hubbun Nafs, Biah, dan Wathan.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Katalog CP Kemenag Terverifikasi</strong> termasuk mapel PAI dan Bahasa Arab madrasah.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Rubrik Observasi Sikap Panca Cinta</strong> dengan 4 skala deskriptif terukur.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Common Capabilities Banner */}
                <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 shrink-0">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Bank Soal HOTS & Kisi-Kisi</h4>
                            <p className="text-[11px] text-slate-500">Stimulus kontekstual level L1, L2, L3</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-600 shrink-0">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Multi-Provider AI Terkalibrasi</h4>
                            <p className="text-[11px] text-slate-500">Gemini, Grok, DeepSeek & OpenRouter</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 shrink-0">
                            <Award className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Kop Surat & TTD Resmi</h4>
                            <p className="text-[11px] text-slate-500">Format cetak siap pakai tanpa watermark</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
