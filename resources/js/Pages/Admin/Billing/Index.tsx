import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    Eye,
    FileImage,
    Filter,
    Receipt,
    Search,
    ShieldAlert,
    ShieldCheck,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: number;
    order_number: string;
    amount: number;
    payment_method: string;
    payment_channel?: string | null;
    payment_status: 'PENDING' | 'PENDING_REVIEW' | 'PAID' | 'FAILED' | 'EXPIRED';
    payment_proof_path?: string | null;
    payment_proof_notes?: string | null;
    created_at: string;
    paid_at?: string | null;
    notes?: string | null;
    plan: {
        name: string;
        price: number;
    };
    tenant: {
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

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    orders: PaginatedData<OrderItem>;
    stats: {
        pending_review_count: number;
        total_paid_count: number;
        total_revenue: number;
    };
    filters: {
        payment_status?: string;
        payment_method?: string;
        search?: string;
    };
}

export default function AdminBillingIndex({ orders, stats, filters }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [statusFilter, setStatusFilter] = useState(filters.payment_status || '');
    const [methodFilter, setMethodFilter] = useState(filters.payment_method || '');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const { data, setData, post, processing, reset } = useForm({
        action: 'APPROVE' as 'APPROVE' | 'REJECT',
        notes: '',
    });

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleFilterChange = (status: string, method: string, search: string) => {
        setStatusFilter(status);
        setMethodFilter(method);
        setSearchQuery(search);
        router.get(
            route('admin.billing.index'),
            {
                payment_status: status || undefined,
                payment_method: method || undefined,
                search: search || undefined,
            },
            { preserveState: true }
        );
    };

    const handleOpenReview = (order: OrderItem) => {
        setSelectedOrder(order);
        setData({
            action: 'APPROVE',
            notes: 'Pembayaran telah diverifikasi masuk ke rekening resmi.',
        });
    };

    const handleCloseReview = () => {
        setSelectedOrder(null);
        reset();
    };

    const handleVerifySubmit = (action: 'APPROVE' | 'REJECT') => {
        if (!selectedOrder) return;

        post(route('admin.billing.verify', selectedOrder.id), {
            preserveScroll: true,
            onSuccess: () => handleCloseReview(),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
            case 'PENDING_REVIEW':
                return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
            default:
                return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        Control Plane Super Admin
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        Verifikasi Pembayaran & Langganan
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Tinjau bukti transfer manual/QRIS dan pantau transaksi otomatis payment gateway Xendit & Tripay.
                    </p>
                </div>
            }
        >
            <Head title="Verifikasi Billing - Super Admin" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="font-semibold uppercase tracking-wider">Perlu Ditinjau</span>
                            <Clock className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                            {stats.pending_review_count} Pesanan
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                            Bukti transfer menunggu persetujuan
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="font-semibold uppercase tracking-wider">Total Lunas</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {stats.total_paid_count} Pesanan
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                            Langganan aktif di tenant
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="font-semibold uppercase tracking-wider">Total Pendapatan</span>
                            <DollarSign className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {formatRupiah(stats.total_revenue)}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                            Akumulasi pendapatan SaaS
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Status Pembayaran
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleFilterChange(e.target.value, methodFilter, searchQuery)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Semua Status --</option>
                                <option value="PENDING_REVIEW">Menunggu Review (Unggah Bukti)</option>
                                <option value="PAID">Lunas (Aktif)</option>
                                <option value="PENDING">Menunggu Pembayaran</option>
                                <option value="FAILED">Gagal / Ditolak</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Metode Pembayaran
                            </label>
                            <select
                                value={methodFilter}
                                onChange={(e) => handleFilterChange(statusFilter, e.target.value, searchQuery)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Semua Metode --</option>
                                <option value="MANUAL_TRANSFER">Transfer Bank</option>
                                <option value="MANUAL_QRIS">QRIS Manual</option>
                                <option value="XENDIT">Xendit Gateway</option>
                                <option value="TRIPAY">Tripay Gateway</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Cari Invoice / Pelanggan
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleFilterChange(statusFilter, methodFilter, e.target.value)}
                                placeholder="Nomor invoice, nama guru, sekolah..."
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                    <th className="p-3">No. Tagihan</th>
                                    <th className="p-3">Tenant & Pengguna</th>
                                    <th className="p-3">Paket</th>
                                    <th className="p-3">Nominal</th>
                                    <th className="p-3">Metode</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Tanggal</th>
                                    <th className="p-3 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-400">
                                            Tidak ada data tagihan yang sesuai kriteria saringan.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                                                {ord.order_number}
                                            </td>
                                            <td className="p-3">
                                                <strong className="block font-semibold text-slate-900 dark:text-white">
                                                    {ord.tenant?.name}
                                                </strong>
                                                <span className="text-[11px] text-slate-400">
                                                    {ord.user?.name} ({ord.user?.email})
                                                </span>
                                            </td>
                                            <td className="p-3">{ord.plan?.name}</td>
                                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                                                {formatRupiah(ord.amount)}
                                            </td>
                                            <td className="p-3">
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                                    {ord.payment_method}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                                        ord.payment_status
                                                    )}`}
                                                >
                                                    {ord.payment_status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-400">
                                                {new Date(ord.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="p-3 text-right">
                                                {ord.payment_status === 'PENDING_REVIEW' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenReview(ord)}
                                                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition shadow-xs"
                                                    >
                                                        Tinjau Bukti
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href={route('billing.invoice', ord.order_number)}
                                                        className="text-slate-500 hover:text-emerald-600 font-semibold text-xs"
                                                    >
                                                        Detail
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Review & Approval Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Verifikasi Pembayaran Manual ({selectedOrder.order_number})
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleCloseReview}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <span className="text-slate-400">Tenant:</span>
                                        <p className="font-bold">{selectedOrder.tenant?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Paket:</span>
                                        <p className="font-bold">{selectedOrder.plan?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Nominal Transfer:</span>
                                        <p className="font-black text-emerald-600 text-sm">
                                            {formatRupiah(selectedOrder.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Bank Tujuan:</span>
                                        <p className="font-bold">{selectedOrder.payment_channel || 'BSI'}</p>
                                    </div>
                                </div>

                                {/* Payment Proof Image Viewer */}
                                {selectedOrder.payment_proof_path && (
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center">
                                        <span className="text-[11px] text-slate-400 block mb-1">
                                            Bukti Transfer yang Diunggah Pengguna:
                                        </span>
                                        <img
                                            src={`/storage/${selectedOrder.payment_proof_path}`}
                                            alt="Bukti Transfer"
                                            className="max-h-60 mx-auto rounded-lg object-contain"
                                        />
                                        <p className="text-[10px] text-slate-500 italic mt-1">
                                            "{selectedOrder.payment_proof_notes || 'Tanpa catatan'}"
                                        </p>
                                    </div>
                                )}

                                {/* Admin notes */}
                                <div>
                                    <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                        Catatan Verifikasi Admin:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                                {/* Decision Buttons */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => {
                                            setData('action', 'REJECT');
                                            handleVerifySubmit('REJECT');
                                        }}
                                        className="px-4 py-2 border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
                                    >
                                        Tolak Transfer
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => {
                                            setData('action', 'APPROVE');
                                            handleVerifySubmit('APPROVE');
                                        }}
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                                    >
                                        <Check className="w-4 h-4" />
                                        Setujui & Aktifkan Langganan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
