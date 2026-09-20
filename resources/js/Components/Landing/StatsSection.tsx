import React from 'react';
import { ShieldCheck, Heart, Sparkles, Printer } from 'lucide-react';

interface StatItem {
    value: string;
    label: string;
    description: string;
}

interface StatsSectionProps {
    items?: StatItem[];
}

const defaultStats: StatItem[] = [
    { value: '100%', label: 'Kepatuhan Regulasi', description: 'Sesuai BSKAP 046/2025 & KMA 1503/2025 tanpa halusinasi prompt.' },
    { value: '5 Dimensi', label: 'Panca Cinta Kemenag', description: 'Mahabbatullah, Hubbul Ilm, Nafs, Biah, dan Wathan terintegrasi.' },
    { value: '3 Pilar', label: 'Deep Learning', description: 'Mindful, Meaningful, dan Joyful Learning dalam modul ajar.' },
    { value: '1 Klik', label: 'Ekspor Kop Surat Resmi', description: 'Tanda tangan Kepala Madrasah & Guru Pengampu siap cetak.' },
];

const icons = [ShieldCheck, Heart, Sparkles, Printer];

export default function StatsSection({ items = defaultStats }: StatsSectionProps) {
    const statList = items && items.length > 0 ? items : defaultStats;

    return (
        <section className="py-12 border-y border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {statList.map((item, idx) => {
                        const Icon = icons[idx % icons.length];
                        return (
                            <div
                                key={idx}
                                className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {item.value}
                                    </span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                    {item.label}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
