import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PlanCard from './Components/PlanCard';
import PlanFormModal from './Components/PlanFormModal';
import { SubscriptionPlanItem, PlanStats } from './types';
import {
    Package,
    Plus,
    Building2,
    User,
    CheckCircle2,
    Sparkles,
    Shield,
} from 'lucide-react';

interface IndexProps {
    plans: SubscriptionPlanItem[];
    stats: PlanStats;
}

export default function Index({ plans, stats }: IndexProps) {
    const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'INDIVIDUAL' | 'INSTITUTION'>('ALL');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);

    const filteredPlans = plans.filter((plan) => {
        if (selectedCategory === 'ALL') return true;
        return plan.client_model === selectedCategory;
    });

    const handleCreateNew = () => {
        setEditingPlan(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (plan: SubscriptionPlanItem) => {
        setEditingPlan(plan);
        setIsFormModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                            Konfigurasi Paket Langganan
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Atur tier harga, kuota generasi AI, batas kursi sekolah, dan fitur paket
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Paket Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Konfigurasi Paket - Superadmin" />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total_plans}</p>
                            <p className="text-xs text-slate-500">Total Paket</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.active_plans}</p>
                            <p className="text-xs text-slate-500">Paket Aktif Publik</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.individual_plans}</p>
                            <p className="text-xs text-slate-500">Paket Guru Mandiri</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.institution_plans}</p>
                            <p className="text-xs text-slate-500">Paket Sekolah / Lembaga</p>
                        </div>
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 w-fit">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === 'ALL'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Semua Paket ({plans.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('INDIVIDUAL')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === 'INDIVIDUAL'
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        Guru Mandiri ({stats.individual_plans})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('INSTITUTION')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === 'INSTITUTION'
                                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        Sekolah / Lembaga ({stats.institution_plans})
                    </button>
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
                        <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            Belum Ada Paket di Kategori Ini
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 mb-4">
                            Buat paket baru untuk kategori Guru Mandiri atau Sekolah
                        </p>
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Paket
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            <PlanFormModal
                plan={editingPlan}
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingPlan(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
