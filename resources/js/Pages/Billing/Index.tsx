import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    ExternalLink,
    FileText,
    Flame,
    Receipt,
    School,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
    Users,
    Zap,
} from 'lucide-react';

interface PlanItem {
    id: number;
    name: string;
    slug: string;
    client_model: 'INDIVIDUAL' | 'INSTITUTION' | 'BOTH';
    price: number;
    duration_days: number;
    max_seats: number;
    ai_generation_quota: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
}

interface SubscriptionItem {
    id: number;
    status: 'TRIAL' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED';
    starts_at: string;
    ends_at: string;
    ai_quota_used: number;
    ai_quota_limit: number;
    seats_limit: number;
    plan: PlanItem;
}

interface OrderItem {
    id: number;
    order_number: string;
    amount: number;
    payment_method: string;
    payment_status: 'PENDING' | 'PENDING_REVIEW' | 'PAID' | 'FAILED' | 'EXPIRED';
    created_at: string;
    plan: PlanItem;
}

interface Props {
    tenant: {
        id: number;
        name: string;
        tenant_type: 'INDIVIDUAL' | 'INSTITUTION';
    };
    activeSubscription?: SubscriptionItem | null;
    plans: PlanItem[];
    recentOrders: OrderItem[];
}

export default function BillingIndex({
    tenant,
    activeSubscription,
    plans,
    recentOrders,
}: Props) {
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const quotaPercentage = activeSubscription
        ? Math.min(
              100,
              Math.round(
                  (activeSubscription.ai_quota_used / activeSubscription.ai_quota_limit) * 100
              )
          )
        : 0;

    const remainingDays = activeSubscription
        ? Math.max(
              0,
              Math.ceil(
                  (new Date(activeSubscription.ends_at).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
              )
          )
        : 0;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
            case 'ACTIVE':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'TRIAL':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'PENDING_REVIEW':
                return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            default:
                return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <CreditCard className="w-4 h-4" />
                            Langganan & Kuota Generasi AI
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Paket Layanan EduGen KBC
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola kuota AI, lisensi guru madrasah/sekolah, dan opsi pembayaran fleksibel (Transfer Bank, QRIS, Xendit, & Tripay).
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Langganan & Kuota AI - EduGen" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
                {/* Active Subscription Status Banner */}
                {activeSubscription ? (
                    <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wide">
                                        Paket Aktif: {activeSubscription.plan.name}
                                    </span>
                                    <span className="text-xs text-slate-300 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                        Sisa {remainingDays} Hari
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                    {tenant.name}
                                </h2>
                                <p className="text-xs text-slate-300 mt-1">
                                    Berlaku hingga{' '}
                                    <strong className="text-white">
                                        {new Date(activeSubscription.ends_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </strong>
                                </p>
                            </div>

                            {/* Quota Meter */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[280px]">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        Kuota Generasi AI
                                    </span>
                                    <span className="font-bold text-white">
                                        {activeSubscription.ai_quota_used} / {activeSubscription.ai_quota_limit}
                                    </span>
                                </div>

                                <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${quotaPercentage}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2">
                                    <span>
                                        Sisa: {Math.max(0, activeSubscription.ai_quota_limit - activeSubscription.ai_quota_used)} request
                                    </span>
                                    <span>Maks. {activeSubscription.seats_limit} Akun Guru</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Belum Ada Paket Langganan Aktif
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Pilih paket langganan di bawah ini untuk membuka kuota generasi AI TP/ATP, Modul Ajar KBC, dan Bank Soal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Pricing Plans */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Pilihan Paket Langganan EduGen KBC
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Dirancang khusus untuk kebutuhan Guru Mandiri dan Sekolah/Madrasah di Indonesia dengan dukungan pembayaran lokal dan sertifikasi kurikulum resmi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((p) => {
                            const isCurrentPlan = activeSubscription?.plan.id === p.id;

                            return (
                                <div
                                    key={p.id}
                                    className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                                        p.is_popular
                                            ? 'border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    {p.is_popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            Paling Populer
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                                                {p.client_model === 'INDIVIDUAL' ? 'Guru Mandiri' : 'Madrasah / Sekolah'}
                                            </span>
                                            {isCurrentPlan && (
                                                <span className="text-[10px] font-bold text-emerald-600">
                                                    Paket Anda
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                            {p.name}
                                        </h3>

                                        <div className="mb-4">
                                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                {p.price > 0 ? formatRupiah(p.price) : 'Gratis'}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-1">
                                                / {p.duration_days} hari
                                            </span>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4 text-xs space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Kuota AI:</span>
                                                <strong className="text-slate-900 dark:text-white">
                                                    {p.ai_generation_quota} generasi
                                                </strong>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Lisensi Akun:</span>
                                                <strong className="text-slate-900 dark:text-white">
                                                    {p.max_seats} Pengguna
                                                </strong>
                                            </div>
                                        </div>

                                        {/* Features List */}
                                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                                            {p.features?.map((feat, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        {p.price > 0 ? (
                                            <Link
                                                href={route('billing.checkout', p.slug)}
                                                className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition shadow-xs ${
                                                    p.is_popular
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900'
                                                }`}
                                            >
                                                Pilih Paket Ini
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                            >
                                                Trial Tersedia Otomatis
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Invoices / Orders */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        Riwayat Tagihan & Pesanan Pembayaran
                    </h3>

                    {recentOrders.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                            Belum ada riwayat pembayaran yang tercatat.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                                        <th className="pb-2.5">No. Invoice</th>
                                        <th className="pb-2.5">Paket Layanan</th>
                                        <th className="pb-2.5">Nominal</th>
                                        <th className="pb-2.5">Metode</th>
                                        <th className="pb-2.5">Status</th>
                                        <th className="pb-2.5">Tanggal</th>
                                        <th className="pb-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentOrders.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="py-3 font-bold text-slate-900 dark:text-white">
                                                {ord.order_number}
                                            </td>
                                            <td className="py-3">{ord.plan?.name}</td>
                                            <td className="py-3 font-semibold">
                                                {formatRupiah(ord.amount)}
                                            </td>
                                            <td className="py-3">
                                                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                                    {ord.payment_method.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                                        ord.payment_status
                                                    )}`}
                                                >
                                                    {ord.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-400">
                                                {new Date(ord.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Link
                                                    href={route('billing.invoice', ord.order_number)}
                                                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                                                >
                                                    Invoice <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
