import React from 'react';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    Users,
    Calendar,
    Check,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Star,
    Building2,
    User,
} from 'lucide-react';
import { SubscriptionPlanItem } from '../types';

interface PlanCardProps {
    plan: SubscriptionPlanItem;
    onEdit: (plan: SubscriptionPlanItem) => void;
}

export default function PlanCard({ plan, onEdit }: PlanCardProps) {
    const isInstitution = plan.client_model === 'INSTITUTION';

    const handleToggleStatus = () => {
        router.patch(route('admin.plans.toggle-status', plan.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket "${plan.name}"?`)) {
            router.delete(route('admin.plans.destroy', plan.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div
            className={`relative bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                plan.is_popular
                    ? 'border-indigo-500/80 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700/60'
            } ${!plan.is_active ? 'opacity-70 bg-slate-50/60 dark:bg-slate-800/40' : ''}`}
        >
            {/* Top Badges */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isInstitution
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                        >
                            {isInstitution ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {isInstitution ? 'Sekolah' : 'Guru Mandiri'}
                        </span>

                        {plan.is_popular && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                Terpopuler
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        title={plan.is_active ? 'Nonaktifkan Paket' : 'Aktifkan Paket'}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${
                            plan.is_active
                                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100'
                                : 'text-slate-500 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        {plan.is_active ? (
                            <>
                                <ToggleRight className="w-4 h-4 text-emerald-600" />
                                <span>Aktif</span>
                            </>
                        ) : (
                            <>
                                <ToggleLeft className="w-4 h-4 text-slate-400" />
                                <span>Nonaktif</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Plan Title & Price */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Rp {Number(plan.price).toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            / {plan.duration_days} hari
                        </span>
                    </div>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span><strong>{plan.ai_generation_quota}</strong> AI Generasi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span>Max <strong>{plan.max_seats}</strong> Seat</span>
                    </div>
                </div>

                {/* Features List */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Fitur Utama
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {(plan.features || []).slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom: Client count & Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                    {plan.tenant_subscriptions_count ?? 0} client aktif
                </span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(plan)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Paket"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Hapus / Nonaktifkan Paket"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
