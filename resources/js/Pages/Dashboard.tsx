import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Award,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    CreditCard,
    Database,
    ExternalLink,
    Eye,
    FileSpreadsheet,
    FileText,
    Heart,
    HelpCircle,
    Layers,
    Plus,
    Receipt,
    School,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UploadCloud,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { PageProps } from '@/types';

interface AdminStats {
    total_users: number;
    total_tenants: number;
    total_institutions: number;
    total_master_cp: number;
    total_modules_platform: number;
    pending_payments_count: number;
    total_revenue: number;
}

interface WorkspaceStats {
    tp_count: number;
    module_count: number;
    assessment_count: number;
    rubric_count: number;
    teacher_count: number;
}

interface DashboardProps {
    isSuperAdmin: boolean;
    adminStats: AdminStats | null;
    pendingPayments: Array<any>;
    recentTenants: Array<any>;
    workspaceStats: WorkspaceStats;
    activeSubscription: any;
    recentModules: Array<any>;
    recentAssessments: Array<any>;
    activeAcademicYear: any;
    activeSemester: any;
    tenant: any;
}

export default function Dashboard({
    isSuperAdmin,
    adminStats,
    pendingPayments = [],
    recentTenants = [],
    workspaceStats,
    activeSubscription,
    recentModules = [],
    recentAssessments = [],
    activeAcademicYear,
    activeSemester,
    tenant,
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    // Time-based Indonesian greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 3 && hour < 11) return 'Selamat Pagi';
        if (hour >= 11 && hour < 15) return 'Selamat Siang';
        if (hour >= 15 && hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const quotaLimit = activeSubscription?.ai_quota_limit || 100;
    const quotaUsed = activeSubscription?.ai_quota_used || 0;
    const quotaRemaining = Math.max(0, quotaLimit - quotaUsed);
    const quotaPercent = Math.min(100, Math.round((quotaUsed / quotaLimit) * 100));

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Utama - EduGen KBC" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                {/* 1. HERO WELCOME & WORKSPACE HEADER */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    Kurikulum Berbasis Cinta (KBC)
                                </span>
                                {isSuperAdmin ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Super Admin Control
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-700/60 text-slate-300 border border-slate-600">
                                        <Building2 className="w-3 h-3 text-emerald-400" />
                                        {tenant?.name || 'Workspace Mandiri'}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                {getGreeting()}, {user.name}!
                            </h1>
                            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                                {isSuperAdmin 
                                    ? 'Pusat kontrol platform EduGen KBC. Pantau pertumbuhan pengguna, kelola master capaian pembelajaran BSKAP 046 & KMA 1503, dan verifikasi langganan.'
                                    : 'Selamat datang di ruang kerja perangkat ajar. Rancang modul ajar, bank soal, dan rubrik asesmen autentik dengan integrasi 5 pilar karakter cinta.'
                                }
                            </p>
                        </div>

                        {/* Subscription & AI Quota Pill */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 min-w-[260px] space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                                    {activeSubscription?.plan?.name || 'Paket Aktif'}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white uppercase">
                                    {activeSubscription?.status || 'TRIAL'}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">Sisa Kuota AI:</span>
                                    <span className="font-bold text-white">
                                        {quotaRemaining} / {quotaLimit} request
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            quotaPercent > 80 ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                                        }`}
                                        style={{ width: `${quotaPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-xs">
                                <span className="text-[11px] text-slate-400">
                                    {activeSubscription?.ends_at ? `Aktif s.d ${new Date(activeSubscription.ends_at).toLocaleDateString('id-ID')}` : 'Masa Percobaan'}
                                </span>
                                <Link
                                    href={route('billing.index')}
                                    className="font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-xs transition"
                                >
                                    Kelola <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SUPER ADMIN CONTROL PANEL SECTION (If Super Admin) */}
                {isSuperAdmin && adminStats && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Panel Kontrol Super Admin Platform
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Metrik menyeluruh sistem EduGen KBC skala nasional
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('admin.billing.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                                >
                                    <Receipt className="w-3.5 h-3.5" />
                                    Verifikasi Pembayaran
                                    {adminStats.pending_payments_count > 0 && (
                                        <span className="ml-1 px-1.5 py-0.2 bg-white text-emerald-700 rounded-full text-[10px] font-bold">
                                            {adminStats.pending_payments_count}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Top KPI Cards Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Card 1: Users */}
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna Aktif</span>
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">
                                    {adminStats.total_users.toLocaleString('id-ID')}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">Guru & Staf terdaftar</div>
                            </div>

                            {/* Card 2: Institutions */}
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 transition">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Madrasah & Sekolah</span>
                                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">
                                    {adminStats.total_institutions.toLocaleString('id-ID')}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">Lembaga di {adminStats.total_tenants} workspace</div>
                            </div>

                            {/* Card 3: Master CP */}
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Master CP Resmi</span>
                                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                                        <Database className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">
                                    {adminStats.total_master_cp.toLocaleString('id-ID')}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">Elemen CP BSKAP & KMA</div>
                            </div>

                            {/* Card 4: Total Revenue */}
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 transition">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendapatan SaaS</span>
                                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                                        <Receipt className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-xl font-black text-slate-900 dark:text-white truncate">
                                    Rp {adminStats.total_revenue.toLocaleString('id-ID')}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">Total invoice lunas</div>
                            </div>

                            {/* Card 5: Pending Approvals */}
                            <div className={`p-4 rounded-xl border shadow-xs transition ${
                                adminStats.pending_payments_count > 0
                                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Perlu Approval</span>
                                    <div className={`p-2 rounded-lg ${adminStats.pending_payments_count > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className={`text-2xl font-black ${adminStats.pending_payments_count > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                    {adminStats.pending_payments_count}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">Bukti transfer manual</div>
                            </div>
                        </div>

                        {/* Pending Payments Queue Section (if any) */}
                        {pendingPayments.length > 0 && (
                            <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            Antrean Pembayaran Menunggu Verifikasi ({pendingPayments.length})
                                        </h3>
                                    </div>
                                    <Link
                                        href={route('admin.billing.index')}
                                        className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                                    >
                                        Buka Semua Antrean <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                <div className="divide-y divide-amber-200/60 dark:divide-amber-900/40">
                                    {pendingPayments.map((order) => (
                                        <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white">{order.order_number}</span>
                                                <span className="text-slate-500 mx-1.5">•</span>
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">{order.tenant?.name}</span>
                                                <span className="text-slate-500 mx-1.5">•</span>
                                                <span className="text-slate-500">{order.user?.name} ({order.user?.email})</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    Rp {parseFloat(order.amount).toLocaleString('id-ID')}
                                                </span>
                                                <Link
                                                    href={route('admin.billing.index')}
                                                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold transition"
                                                >
                                                    Tinjau Bukti
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. WORKSPACE METRICS & QUICK GENERATOR ACTIONS */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Ruang Kerja Perangkat Ajar KBC
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Ringkasan data perangkat pembelajaran pada {tenant?.name || 'Workspace Aktif'}
                                </p>
                            </div>
                        </div>

                        {/* Current Academic Period Badge */}
                        <div className="hidden sm:flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                Tahun Ajaran: <strong>{activeAcademicYear?.year || '2026/2027'}</strong>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                Semester: <strong>{activeSemester?.label || (activeSemester?.type === 'EVEN' ? 'Genap' : 'Ganjil')}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Workspace Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-500">Bank TP</span>
                                <Layers className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">
                                {workspaceStats.tp_count}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">Tujuan Pembelajaran</div>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-500">Modul Ajar KBC</span>
                                <School className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">
                                {workspaceStats.module_count}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">RPP 5 Pilar Panca Cinta</div>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-500">Paket Bank Soal</span>
                                <ClipboardList className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">
                                {workspaceStats.assessment_count}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">Kisi-kisi & Naskah Soal</div>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-500">Rubrik Penilaian</span>
                                <Award className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">
                                {workspaceStats.rubric_count}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">4 Skala Autentik KBC</div>
                        </div>
                    </div>

                    {/* Quick Creator Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Link
                            href={route('curriculum.modules.create')}
                            className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition"
                        >
                            <div className="space-y-0.5">
                                <div className="text-xs text-blue-200 font-medium">Buat Baru</div>
                                <div className="font-bold text-sm">Modul Ajar KBC</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                        </Link>

                        <Link
                            href={route('curriculum.assessments.create')}
                            className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition"
                        >
                            <div className="space-y-0.5">
                                <div className="text-xs text-amber-200 font-medium">Generator AI</div>
                                <div className="font-bold text-sm">Bank Soal & Kisi-kisi</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </Link>

                        <Link
                            href={route('curriculum.tp.create')}
                            className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition"
                        >
                            <div className="space-y-0.5">
                                <div className="text-xs text-emerald-200 font-medium">Rumuskan</div>
                                <div className="font-bold text-sm">TP & Alur Pembelajaran</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                        </Link>

                        <Link
                            href={route('curriculum.rubrics.create')}
                            className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition"
                        >
                            <div className="space-y-0.5">
                                <div className="text-xs text-purple-200 font-medium">Skala Penilaian</div>
                                <div className="font-bold text-sm">Rubrik Panca Cinta</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 4. MAIN TWO-COLUMN DASHBOARD SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2 Cols): Recent Modules & Recent Assessments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Modules Card */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <School className="w-4 h-4 text-blue-600" />
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                        Modul Ajar KBC Terakhir
                                    </h3>
                                </div>
                                <Link
                                    href={route('curriculum.modules.index')}
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                >
                                    Lihat Semua <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {recentModules.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentModules.map((mod) => (
                                        <div key={mod.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <div className="space-y-1 max-w-[70%]">
                                                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                                    {mod.title}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                                    <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                                                        {mod.subject?.name || 'Mata Pelajaran'}
                                                    </span>
                                                    <span>Fase {mod.phase?.name || '-'}</span>
                                                    <span>•</span>
                                                    <span>{mod.allocations_meetings || 1} Pertemuan</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('curriculum.modules.show', mod.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Buka
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <School className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="text-xs text-slate-500">Belum ada modul ajar yang dibuat.</p>
                                    <Link
                                        href={route('curriculum.modules.create')}
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                                    >
                                        + Buat Modul Ajar Pertama Anda
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Assessments Card */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-amber-600" />
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                        Bank Soal & Kisi-kisi Terakhir
                                    </h3>
                                </div>
                                <Link
                                    href={route('curriculum.assessments.index')}
                                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                                >
                                    Lihat Semua <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {recentAssessments.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentAssessments.map((ass) => (
                                        <div key={ass.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <div className="space-y-1 max-w-[70%]">
                                                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                                    {ass.title}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
                                                        {ass.subject?.name || 'Mata Pelajaran'}
                                                    </span>
                                                    <span>{ass.assessment_type?.replace(/_/g, ' ')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('curriculum.assessments.show', ass.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Cetak / Kunci
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="text-xs text-slate-500">Belum ada paket bank soal yang digenerate.</p>
                                    <Link
                                        href={route('curriculum.assessments.create')}
                                        className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold hover:underline"
                                    >
                                        + Generate Bank Soal Baru
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (1 Col): 5 Pilar Cinta Info & Quick Links */}
                    <div className="space-y-6">
                        {/* 5 Pilar Cinta KBC Card */}
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 p-5 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                <h3 className="font-bold text-sm">5 Pilar Panca Cinta KBC</h3>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Setiap perangkat ajar dan rubrik yang dihasilkan AI secara otomatis mengintegrasikan pilar karakter cinta:
                            </p>
                            <ul className="space-y-2 text-xs">
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cinta Allah & Rasul:</strong>
                                        <span className="text-slate-500 ml-1">Ketaatan beribadah dan akhlak mulia.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cinta Ilmu & Kebenaran:</strong>
                                        <span className="text-slate-500 ml-1">Semangat literasi, nalar kritis & kejujuran.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cinta Diri Sendiri:</strong>
                                        <span className="text-slate-500 ml-1">Menjaga kesehatan fisik, mental, & disiplin.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cinta Sesama Manusia:</strong>
                                        <span className="text-slate-500 ml-1">Empati, gotong royong, & toleransi.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cinta Alam & Lingkungan:</strong>
                                        <span className="text-slate-500 ml-1">Kepedulian kelestarian bumi & kebersihan.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Official Regulations Reference Card */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                                Landasan Regulasi Resmi
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-0.5">
                                    <div className="font-bold text-slate-800 dark:text-slate-200">
                                        BSKAP 046/H/KR/2024
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Capaian Pembelajaran PAUD, SD, SMP, SMA/SMK
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-0.5">
                                    <div className="font-bold text-slate-800 dark:text-slate-200">
                                        KMA 1503 Tahun 2025
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Standar Kurikulum Madrasah (Kemenag RI)
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={route('curriculum.cp.index')}
                                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Jelajahi Katalog CP Lengkap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
