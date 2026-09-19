import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdjustQuotaModal from './Components/AdjustQuotaModal';
import AdjustDurationModal from './Components/AdjustDurationModal';
import AssignPlanModal from './Components/AssignPlanModal';
import { ClientItem, AvailablePlan } from './types';
import {
    Building2,
    User,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    Calendar,
    BookOpen,
    FileText,
    Cpu,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    Mail,
    Phone,
} from 'lucide-react';

interface ShowProps {
    client: any;
    activeSubscription: any;
    stats: {
        modules_count: number;
        assessments_count: number;
        goals_count: number;
        ai_logs_count: number;
    };
    recentAiLogs: Array<{
        id: number;
        feature_type: string;
        provider: string;
        model_name: string;
        completion_tokens: number;
        status: string;
        created_at: string;
    }>;
    recentOrders: Array<{
        id: number;
        order_number: string;
        plan_name: string;
        amount: number;
        payment_status: string;
        payment_method: string;
        created_at: string;
    }>;
    availablePlans: AvailablePlan[];
}

export default function Show({
    client,
    activeSubscription,
    stats,
    recentAiLogs,
    recentOrders,
    availablePlans,
}: ShowProps) {
    const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    const isInstitution = client.tenant_type === 'INSTITUTION';

    const handleStatusChange = (newStatus: string) => {
        if (confirm(`Ubah status client menjadi ${newStatus}?`)) {
            router.patch(route('admin.clients.update-status', client.id), {
                status: newStatus,
            }, { preserveScroll: true });
        }
    };

    // Client item for modals
    const modalClientItem: ClientItem = {
        id: client.id,
        name: client.name,
        slug: client.slug,
        tenant_type: client.tenant_type,
        status: client.status,
        created_at: client.created_at,
        active_subscription: activeSubscription ? {
            id: activeSubscription.id,
            plan_name: activeSubscription.plan?.name ?? 'Custom Plan',
            status: activeSubscription.status,
            starts_at: activeSubscription.starts_at,
            ends_at: activeSubscription.ends_at,
            days_remaining: 30,
            ai_quota_used: activeSubscription.ai_quota_used,
            ai_quota_limit: activeSubscription.ai_quota_limit,
            ai_quota_remaining: Math.max(0, activeSubscription.ai_quota_limit - activeSubscription.ai_quota_used),
            seats_limit: activeSubscription.seats_limit,
        } : null,
        members_count: client.memberships?.length ?? 0,
        teachers_count: client.teacher_profiles?.length ?? 0,
    };

    const quotaPercent = activeSubscription && activeSubscription.ai_quota_limit > 0
        ? Math.min(100, Math.round((activeSubscription.ai_quota_used / activeSubscription.ai_quota_limit) * 100))
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.clients.index')}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {client.name}
                                </h2>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        isInstitution
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                                    }`}
                                >
                                    {isInstitution ? 'Sekolah / Lembaga' : 'Guru Mandiri'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Terdaftar sejak {new Date(client.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2">
                        <select
                            value={client.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`font-semibold text-xs px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                                client.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                                    : client.status === 'TRIAL'
                                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                                    : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}
                        >
                            <option value="ACTIVE">Status: AKTIF</option>
                            <option value="TRIAL">Status: TRIAL</option>
                            <option value="SUSPENDED">Status: SUSPENDED</option>
                            <option value="EXPIRED">Status: EXPIRED</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setIsDurationModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            Atur Masa Aktif
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsQuotaModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Atur Kuota AI
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsPlanModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Tetapkan Paket
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Client - ${client.name}`} />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.modules_count}</p>
                            <p className="text-xs text-slate-500">Modul Ajar RPP</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.assessments_count}</p>
                            <p className="text-xs text-slate-500">Paket Asesmen</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.ai_logs_count}</p>
                            <p className="text-xs text-slate-500">Generasi AI</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {client.memberships?.length ?? 0}
                            </p>
                            <p className="text-xs text-slate-500">Pengguna Terdaftar</p>
                        </div>
                    </div>
                </div>

                {/* 2-Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Sub & Info */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Active Subscription Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Paket & Kuota AI Aktif
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    activeSubscription?.status === 'ACTIVE'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {activeSubscription?.status ?? 'TIDAK ADA'}
                                </span>
                            </div>

                            {activeSubscription ? (
                                <div className="space-y-3 text-xs">
                                    <div>
                                        <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                                            {activeSubscription.plan?.name ?? 'Paket Kustom'}
                                        </p>
                                        <p className="text-slate-500">
                                            Berlaku: {activeSubscription.starts_at?.slice(0, 10)} s/d {activeSubscription.ends_at?.slice(0, 10)}
                                        </p>
                                    </div>

                                    {/* Quota bar */}
                                    <div className="space-y-1.5 pt-2">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-slate-600 dark:text-slate-300">Penggunaan Kuota AI</span>
                                            <span className="text-slate-900 dark:text-white">
                                                {activeSubscription.ai_quota_used} / {activeSubscription.ai_quota_limit} ({quotaPercent}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    quotaPercent >= 90 ? 'bg-rose-500' : 'bg-indigo-600'
                                                }`}
                                                style={{ width: `${quotaPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-right text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                            Sisa Kuota: {Math.max(0, activeSubscription.ai_quota_limit - activeSubscription.ai_quota_used)} Generasi
                                        </p>
                                    </div>

                                    <div className="pt-2 flex justify-between border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                        <span>Batas Kursi (Seats):</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {activeSubscription.seats_limit} Pengguna
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 text-xs">
                                    <p>Client ini belum memiliki langganan aktif.</p>
                                    <button
                                        type="button"
                                        onClick={() => setIsPlanModalOpen(true)}
                                        className="mt-2 text-indigo-600 dark:text-indigo-400 font-semibold underline"
                                    >
                                        Tetapkan paket sekarang
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profil & PIC Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3 text-xs">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
                                Informasi Client
                            </h3>
                            <div className="space-y-2 text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Nama Tenant:</span>
                                    <span className="font-semibold">{client.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Slug / Subdomain:</span>
                                    <span className="font-semibold font-mono">{client.slug}</span>
                                </div>
                                {isInstitution && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">NPSN:</span>
                                            <span className="font-semibold">{client.institution?.npsn ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Jenjang Pendidikan:</span>
                                            <span className="font-semibold">{client.institution?.education_level?.name ?? '-'}</span>
                                        </div>
                                    </>
                                )}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Admin Penanggung Jawab:</p>
                                    <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        {client.primary_admin?.name ?? '-'}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        {client.primary_admin?.email ?? '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Logs & Payment History */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* AI Logs */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                                <span>Aktivitas Generasi AI Terbaru</span>
                                <span className="text-xs font-normal text-slate-500">{recentAiLogs.length} Terakhir</span>
                            </h3>
                            {recentAiLogs.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {recentAiLogs.map((log) => (
                                        <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                                                    {log.feature_type}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    {log.provider} • {log.model_name} • {log.completion_tokens} token
                                                </p>
                                            </div>
                                            <span className="text-[11px] text-slate-500">
                                                {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-6">Belum ada aktivitas AI</p>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                                <span>Riwayat Pesanan Langganan</span>
                                <span className="text-xs font-normal text-slate-500">{recentOrders.length} Terakhir</span>
                            </h3>
                            {recentOrders.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {order.plan_name} • <span className="font-mono text-[11px] text-slate-500">{order.order_number}</span>
                                                </p>
                                                <p className="text-[11px] text-indigo-600 font-bold">
                                                    Rp {Number(order.amount).toLocaleString('id-ID')} ({order.payment_method})
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                order.payment_status === 'PAID'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat pesanan</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AdjustQuotaModal
                client={modalClientItem}
                isOpen={isQuotaModalOpen}
                onClose={() => setIsQuotaModalOpen(false)}
            />

            <AdjustDurationModal
                client={modalClientItem}
                isOpen={isDurationModalOpen}
                onClose={() => setIsDurationModalOpen(false)}
            />

            <AssignPlanModal
                client={modalClientItem}
                plans={availablePlans}
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
