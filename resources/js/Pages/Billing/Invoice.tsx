import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    ExternalLink,
    FileImage,
    Lock,
    Printer,
    QrCode,
    ShieldCheck,
    UploadCloud,
    User as UserIcon,
    Wallet,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

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

interface OrderDetail {
    id: number;
    order_number: string;
    amount: number;
    payment_method: 'MANUAL_TRANSFER' | 'MANUAL_QRIS' | 'XENDIT' | 'TRIPAY';
    payment_channel?: string | null;
    payment_status: 'PENDING' | 'PENDING_REVIEW' | 'PAID' | 'FAILED' | 'EXPIRED';
    payment_proof_path?: string | null;
    payment_proof_notes?: string | null;
    checkout_url?: string | null;
    created_at: string;
    expired_at?: string | null;
    paid_at?: string | null;
    verified_at?: string | null;
    plan: {
        id: number;
        name: string;
        price: number;
        duration_days: number;
        max_seats: number;
        ai_generation_quota: number;
    };
    tenant: {
        id: number;
        name: string;
    };
    user: {
        name: string;
        email: string;
    };
    verifier?: {
        name: string;
    } | null;
}

interface Props {
    order: OrderDetail;
    bankAccounts: BankAccount[];
    qrisDetails: QrisDetails;
}

export default function BillingInvoice({ order, bankAccounts, qrisDetails }: Props) {
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null as File | null,
        payment_proof_notes: '',
    });

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

    const handleUploadProof = (e: FormEvent) => {
        e.preventDefault();
        post(route('billing.invoice.upload-proof', order.order_number), {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
            case 'PENDING_REVIEW':
                return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
            default:
                return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800';
        }
    };

    const matchedBank = bankAccounts.find((b) => b.bank_code === order.payment_channel) || bankAccounts[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('billing.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Invoice Tagihan
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                {order.order_number}
                            </h1>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
                    >
                        <Printer className="w-4 h-4" />
                        Cetak Kuitansi
                    </button>
                </div>
            }
        >
            <Head title={`Invoice ${order.order_number} - EduGen`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
                {/* Status Banners */}
                {order.payment_status === 'PAID' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
                        <div>
                            <strong className="block text-sm font-bold">Pembayaran Berhasil Terverifikasi!</strong>
                            Langganan paket {order.plan.name} telah aktif dan kuota AI siap digunakan untuk seluruh ruang kerja Anda.
                        </div>
                    </div>
                )}

                {order.payment_status === 'PENDING_REVIEW' && (
                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-3 text-purple-800 dark:text-purple-300 text-xs font-medium">
                        <Clock className="w-6 h-6 shrink-0 text-purple-600" />
                        <div>
                            <strong className="block text-sm font-bold">Bukti Transfer Sedang Ditinjau</strong>
                            Tim Super Admin EduGen KBC sedang memverifikasi bukti transfer Anda. Langganan akan aktif secara otomatis setelah diverifikasi.
                        </div>
                    </div>
                )}

                {/* Printable Invoice Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm print:p-0 print:border-none print:shadow-none space-y-8">
                    {/* Invoice Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                        <div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                                EduGen <span className="text-emerald-600">KBC</span>
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Platform Kurikulum Berbasis Cinta & Generator AI Nasional
                            </p>
                        </div>

                        <div className="text-left sm:text-right text-xs">
                            <span className="font-mono font-bold text-sm block text-slate-900 dark:text-white">
                                {order.order_number}
                            </span>
                            <span className="text-slate-400">
                                Tanggal:{' '}
                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Bill To Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div>
                            <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">
                                Ditagihkan Kepada:
                            </span>
                            <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                                {order.tenant.name}
                            </strong>
                            <p className="text-slate-500">Nama Kontak: {order.user.name}</p>
                            <p className="text-slate-500">Email: {order.user.email}</p>
                        </div>

                        <div>
                            <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">
                                Informasi Metode Bayar:
                            </span>
                            <strong className="text-sm font-bold text-slate-900 dark:text-white block uppercase">
                                {order.payment_method.replace('_', ' ')}
                            </strong>
                            <p className="text-slate-500">
                                Saluran: {order.payment_channel || 'Semua Saluran Didukung'}
                            </p>
                            <p className="text-slate-500">
                                Status: <strong className="uppercase">{order.payment_status}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500">
                                    <th className="py-2.5">Deskripsi Layanan</th>
                                    <th className="py-2.5 text-center">Durasi</th>
                                    <th className="py-2.5 text-center">Kuota AI</th>
                                    <th className="py-2.5 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr>
                                    <td className="py-3">
                                        <strong className="text-slate-900 dark:text-white block">
                                            Paket {order.plan.name}
                                        </strong>
                                        <span className="text-[11px] text-slate-400">
                                            Termasuk lisensi maks. {order.plan.max_seats} akun & generator KBC lengkap
                                        </span>
                                    </td>
                                    <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                                        {order.plan.duration_days} Hari
                                    </td>
                                    <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                                        {order.plan.ai_generation_quota} Req
                                    </td>
                                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                                        {formatRupiah(order.amount)}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-200 dark:border-slate-800">
                                    <td colSpan={3} className="pt-3 text-right font-bold text-slate-600 dark:text-slate-300">
                                        Total Pembayaran:
                                    </td>
                                    <td className="pt-3 text-right text-base font-black text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(order.amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Payment Action Box (Only if not yet paid) */}
                    {order.payment_status === 'PENDING' && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4 print:hidden">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-600" />
                                Instruksi Penyelesaian Pembayaran
                            </h3>

                            {/* Manual Bank Transfer Box */}
                            {order.payment_method === 'MANUAL_TRANSFER' && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                                Transfer Ke Bank {matchedBank.bank_name}:
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-mono text-base font-black tracking-wider text-slate-900 dark:text-white">
                                                    {matchedBank.account_number}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(matchedBank.account_number)}
                                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold rounded-md hover:text-emerald-600 flex items-center gap-1"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    {copiedAccount === matchedBank.account_number ? 'Tersalin' : 'Salin Rekening'}
                                                </button>
                                            </div>
                                            <span className="text-xs text-slate-500 block mt-0.5">
                                                Atas Nama: <strong>{matchedBank.account_name}</strong>
                                            </span>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                                Nominal Transfer Tepat:
                                            </span>
                                            <span className="text-lg font-black text-emerald-600">
                                                {formatRupiah(order.amount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Upload Form */}
                                    <form onSubmit={handleUploadProof} className="space-y-3 pt-2">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                            Unggah Bukti Transfer / Resi Pembayaran:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={(e) => setData('payment_proof', e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        />
                                        {errors.payment_proof && (
                                            <p className="text-xs text-rose-500">{errors.payment_proof}</p>
                                        )}

                                        <input
                                            type="text"
                                            value={data.payment_proof_notes}
                                            onChange={(e) => setData('payment_proof_notes', e.target.value)}
                                            placeholder="Catatan transfer (contoh: transfer dari rekening atas nama Budi Santoso)"
                                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                        />

                                        <button
                                            type="submit"
                                            disabled={processing || !data.payment_proof}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                                        >
                                            <UploadCloud className="w-4 h-4" />
                                            {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Manual QRIS Box */}
                            {order.payment_method === 'MANUAL_QRIS' && (
                                <div className="space-y-4 text-center">
                                    <div className="inline-block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                                        <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-400">
                                            <QrCode className="w-32 h-32 text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                            {qrisDetails.merchant_name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">
                                            NMID: {qrisDetails.nmid}
                                        </span>
                                    </div>

                                    {/* Upload Form for QRIS */}
                                    <form onSubmit={handleUploadProof} className="max-w-md mx-auto space-y-3 text-left">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                            Unggah Tangkapan Layar (Screenshot) Bukti Bayar QRIS:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={(e) => setData('payment_proof', e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.payment_proof}
                                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                                        >
                                            <UploadCloud className="w-4 h-4" />
                                            {processing ? 'Mengunggah...' : 'Kirim Bukti QRIS'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Gateway Button (Xendit or Tripay) */}
                            {(order.payment_method === 'XENDIT' || order.payment_method === 'TRIPAY') && (
                                <div className="text-center py-4 space-y-3">
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        Selesaikan pembayaran instan melalui portal resmi {order.payment_method}.
                                    </p>
                                    <a
                                        href={order.checkout_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Buka Portal Pembayaran {order.payment_method}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* If proof already uploaded, show uploaded proof preview */}
                    {order.payment_proof_path && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block">
                                Bukti Pembayaran yang Terunggah:
                            </span>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileImage className="w-4 h-4 text-emerald-600" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {order.payment_proof_notes || 'Bukti transfer pembayaran langganan'}
                                    </span>
                                </div>
                                <a
                                    href={`/storage/${order.payment_proof_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                                >
                                    Lihat Berkas <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
