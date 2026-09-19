import React from 'react';
import { Users, School, User, CheckCircle2 } from 'lucide-react';
import { ClientStats } from '../types';

interface Props {
    stats: ClientStats;
}

export default function ClientStatsCard({ stats }: Props) {
    const cards = [
        {
            label: 'Total Client Terdaftar',
            value: stats.total_clients,
            desc: 'Guru Mandiri & Sekolah',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
        },
        {
            label: 'Sekolah / Madrasah',
            value: stats.total_institutions,
            desc: 'Workspace Institusi',
            icon: School,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
        },
        {
            label: 'Guru Pribadi',
            value: stats.total_individuals,
            desc: 'Akun Mandiri',
            icon: User,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
        },
        {
            label: 'Status Aktif / Trial',
            value: stats.total_active,
            desc: 'Memiliki akses aktif',
            icon: CheckCircle2,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                    <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-xs ${item.bg}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {item.label}
                            </span>
                            <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs ${item.color}`}>
                                <IconComponent className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {item.value}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.desc}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
