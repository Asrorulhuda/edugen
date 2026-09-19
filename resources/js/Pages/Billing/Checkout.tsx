import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    Lock,
    QrCode,
    ShieldCheck,
    Sparkles,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface BankAccount {
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    badge: string;
}

interface QrisDetails {
    merchant_name: string;
    nmid: string;
    qr_string: string;
    support: string;
}

interface PlanItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    duration_days: number;
    max_seats: number;
    ai_generation_quota: number;
    features: string[];
}

interface Props {
    plan: PlanItem;
    tenant: {
        id: number;
        name: string;
    };
    bankAccounts: BankAccount[];
    qrisDetails: QrisDetails;
}

export default function BillingCheckout({
    plan,
    tenant,
    bankAccounts,
    qrisDetails,
}: Props) {
    const [paymentMethod, setPaymentMethod] = useState<'MANUAL_TRANSFER' | 'MANUAL_QRIS' | 'XENDIT' | 'TRIPAY'>('MANUAL_TRANSFER');
    const [selectedBank, setSelectedBank] = useState<string>('BSI');
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedAccount(text);
        setTimeout(() => setCopiedAccount(null), 2000);
    };

    const handleSubmitOrder = () => {
        router.post(route('billing.order.store'), {
            subscription_plan_id: plan.id,
            payment_method: paymentMethod,
            payment_channel: paymentMethod === 'MANUAL_TRANSFER' ? selectedBank : paymentMethod === 'MANUAL_QRIS' ? 'QRIS' : null,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('billing.index')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            Pembayaran Aman & Terverifikasi
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Checkout Langganan EduGen KBC
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={`Checkout ${plan.name} - EduGen`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Method Selector */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                                1. Pilih Metode Pembayaran
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {/* Option 1: Manual Transfer Bank */}
                                <div
                                    onClick={() => setPaymentMethod('MANUAL_TRANSFER')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                                        paymentMethod === 'MANUAL_TRANSFER'
                                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Building2 className="w-5 h-5 text-emerald-600" />
                                            {paymentMethod === 'MANUAL_TRANSFER' && (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Transfer Bank (Manual)
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            BSI, BCA, Mandiri, BRI dengan verifikasi bukti transfer.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                                        Bebas Biaya Admin
                                    </span>
                                </div>

                                {/* Option 2: QRIS Manual */}
                                <div
                                    onClick={() => setPaymentMethod('MANUAL_QRIS')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                                        paymentMethod === 'MANUAL_QRIS'
                                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <QrCode className="w-5 h-5 text-emerald-600" />
                                            {paymentMethod === 'MANUAL_QRIS' && (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            QRIS (Scan & Unggah)
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Scan QRIS lewat GoPay, OVO, Dana, ShopeePay, atau m-Banking.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                                        Instan Semua E-Wallet
                                    </span>
                                </div>

                                {/* Option 3: Gateway Xendit */}
                                <div
                                    onClick={() => setPaymentMethod('XENDIT')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                                        paymentMethod === 'XENDIT'
                                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                            {paymentMethod === 'XENDIT' && (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Xendit Payment Gateway
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Otomatis aktif langsung setelah bayar Virtual Account / Kartu.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-blue-600 mt-2">
                                        Verifikasi Otomatis
                                    </span>
                                </div>

                                {/* Option 4: Gateway Tripay */}
                                <div
                                    onClick={() => setPaymentMethod('TRIPAY')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                                        paymentMethod === 'TRIPAY'
                                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Wallet className="w-5 h-5 text-purple-600" />
                                            {paymentMethod === 'TRIPAY' && (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Tripay Payment Gateway
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Checkout aman QRIS Real-time dan Virtual Account multi-bank.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-purple-600 mt-2">
                                        Verifikasi Otomatis
                                    </span>
                                </div>
                            </div>

                            {/* Details for Manual Bank Transfer */}
                            {paymentMethod === 'MANUAL_TRANSFER' && (
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                                        Pilih Rekening Tujuan Transfer:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {bankAccounts.map((b) => (
                                            <div
                                                key={b.bank_code}
                                                onClick={() => setSelectedBank(b.bank_code)}
                                                className={`p-3 rounded-xl border cursor-pointer transition ${
                                                    selectedBank === b.bank_code
                                                        ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xs'
                                                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {b.bank_name}
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600 font-semibold">
                                                        {b.badge}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="font-mono text-xs font-bold tracking-wider text-slate-700 dark:text-slate-200">
                                                        {b.account_number}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(b.account_number);
                                                        }}
                                                        className="text-[10px] text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        {copiedAccount === b.account_number ? 'Tersalin' : 'Salin'}
                                                    </button>
                                                </div>
                                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                                    a.n. {b.account_name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Details for Manual QRIS */}
                            {paymentMethod === 'MANUAL_QRIS' && (
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                                        QRIS Standar Bank Indonesia
                                    </span>
                                    <p className="text-[11px] text-slate-500">
                                        Kode QRIS dinamis akan dibuat otomatis pada halaman invoice tagihan.
                                    </p>
                                    <span className="text-[10px] text-slate-400 block">
                                        Mendukung: {qrisDetails.support}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                                Ringkasan Pesanan
                            </h3>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Paket:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {plan.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Untuk Ruang Kerja:</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {tenant.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Durasi:</span>
                                    <span>{plan.duration_days} Hari</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Kuota AI:</span>
                                    <span>{plan.ai_generation_quota} Generasi</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Lisensi Akun:</span>
                                    <span>Maks. {plan.max_seats} Pengguna</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Total Tagihan:
                                </span>
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                    {formatRupiah(plan.price)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmitOrder}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Lanjutkan ke Pembayaran
                            </button>

                            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                Transaksi terenkripsi & data kurikulum terlindungi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
