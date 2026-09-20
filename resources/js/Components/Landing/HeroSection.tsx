import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, BookOpen, Layers, Award, School } from 'lucide-react';
import CuteCompanion from './CuteCompanion';

interface HeroSectionProps {
    content?: {
        badge_text?: string;
        headline_gradient?: string;
        headline_main?: string;
        subheadline?: string;
        cta_primary_text?: string;
        cta_primary_link?: string;
        cta_secondary_text?: string;
        cta_secondary_link?: string;
        feature_bullets?: string[];
    };
}

export default function HeroSection({ content = {} }: HeroSectionProps) {
    const badgeText = content.badge_text || 'Resmi: BSKAP 046/2025 (Kurmer) & KMA 1503/2025 (KBC)';
    const headlineGradient = content.headline_gradient || 'Satu Platform Perangkat Guru';
    const headlineMain = content.headline_main || 'Untuk Kurikulum Merdeka & Kurikulum Berbasis Cinta (KBC).';
    const subheadline =
        content.subheadline ||
        'EduGen memadukan kecerdasan buatan multi-provider terkalibrasi dengan database master Capaian Pembelajaran resmi nasional. Rancang TP, Alur TP, Modul Ajar, Bank Soal HOTS, kisi-kisi, dan rubrik asesmen untuk sekolah umum maupun madrasah dalam satu ekosistem presisi dan siap cetak.';
    const featureBullets = content.feature_bullets || [
        'Kurikulum Merdeka (SD, SMP, SMA, SMK)',
        'Kurikulum KBC Panca Cinta (RA, MI, MTs, MA)',
        'Capaian Pembelajaran (CP) Resmi Terkunci & Bebas Halusinasi',
    ];

    return (
        <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400/10 dark:bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Copy & Actions */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        {/* Dual Curriculum Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide shadow-2xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{badgeText}</span>
                        </div>

                        {/* Main Typography */}
                        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                                {headlineGradient}
                            </span>
                            <br />
                            <span className="text-slate-800 dark:text-slate-100">{headlineMain}</span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {subheadline}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                            <Link
                                href={content.cta_primary_link || route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{content.cta_primary_text || 'Mulai Coba Gratis 14 Hari'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href={content.cta_secondary_link || '#kurikulum'}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                            >
                                <span>{content.cta_secondary_text || 'Bandingkan 2 Kurikulum'}</span>
                            </a>
                        </div>

                        {/* Feature Bullets */}
                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {featureBullets.map((bullet, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Cute Mascot Companion & Dual Curriculum Preview */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                        {/* Cute Mascot Companion */}
                        <div className="mb-4">
                            <CuteCompanion />
                        </div>

                        {/* Preview Card with 2 Curriculum Badges */}
                        <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-colors">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                        Kurikulum Merdeka
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        Kurikulum KBC
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    Pilih Sesuai Lembaga
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sumber Regulasi Master</div>
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 flex items-center justify-between">
                                        <span>BSKAP 046 & KMA 1503 Resmi</span>
                                        <span className="text-emerald-600 font-bold text-[10px]">Terkunci ✓</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilihan Integrasi Pedagogi</div>
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                                        Deep Learning (Mindful, Meaningful, Joyful) & 5 Panca Cinta
                                    </div>
                                </div>

                                <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Kop Surat Dinas Siap Cetak</span>
                                    </div>
                                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">1-Klik Ekspor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
