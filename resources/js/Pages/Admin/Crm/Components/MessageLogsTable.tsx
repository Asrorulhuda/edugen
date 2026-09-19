import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { WaMessageLog } from '../types';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    Eye,
    MessageSquare,
    X,
    ExternalLink,
} from 'lucide-react';

interface MessageLogsTableProps {
    logs: {
        data: WaMessageLog[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        source?: string;
        search?: string;
    };
}

export default function MessageLogsTable({ logs, filters }: MessageLogsTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedLog, setSelectedLog] = useState<WaMessageLog | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.crm.index'),
            { ...filters, search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('admin.crm.index'),
            { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleRetry = (logId: number) => {
        router.post(route('admin.crm.logs.retry', logId), {}, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SENT':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Berhasil
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-3 h-3" /> Gagal
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Clock className="w-3 h-3" /> Proses
                    </span>
                );
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'INVITATION_OTP':
                return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">OTP Guru</span>;
            case 'BROADCAST':
                return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold">Broadcast</span>;
            case 'SYSTEM':
                return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold">Sistem / Tes</span>;
            default:
                return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">Manual</span>;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nomor HP, penerima, pesan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </form>

                <div className="flex items-center gap-2">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 py-1.5"
                    >
                        <option value="">Semua Status</option>
                        <option value="SENT">Berhasil Terkirim</option>
                        <option value="FAILED">Gagal</option>
                        <option value="PENDING">Menunggu</option>
                    </select>

                    <select
                        value={filters.source || ''}
                        onChange={(e) => handleFilterChange('source', e.target.value)}
                        className="text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 py-1.5"
                    >
                        <option value="">Semua Sumber</option>
                        <option value="INVITATION_OTP">OTP Undangan</option>
                        <option value="BROADCAST">Broadcast</option>
                        <option value="MANUAL">Manual</option>
                        <option value="SYSTEM">Sistem</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                        <tr>
                            <th className="py-3 px-4">Penerima & Nomor</th>
                            <th className="py-3 px-4">Sumber</th>
                            <th className="py-3 px-4">Isi Pesan</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Waktu</th>
                            <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400">
                                    Belum ada catatan riwayat pesan WhatsApp.
                                </td>
                            </tr>
                        ) : (
                            logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">
                                            {log.recipient_name || 'Tanpa Nama'}
                                        </div>
                                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                                            {log.recipient_number}
                                        </div>
                                        {log.tenant && (
                                            <div className="text-[10px] text-slate-400">
                                                {log.tenant.name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getSourceLabel(log.source)}
                                    </td>
                                    <td className="py-3 px-4 max-w-xs">
                                        <p className="truncate text-slate-600 dark:text-slate-300 font-sans" title={log.message}>
                                            {log.message}
                                        </p>
                                        {log.footer && (
                                            <span className="text-[10px] text-slate-400 block truncate">
                                                Footer: {log.footer}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLog(log)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                title="Lihat Detail Pesan"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            {log.status === 'FAILED' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRetry(log.id)}
                                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                                                    title="Kirim Ulang Pesan"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {logs.links && logs.links.length > 3 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div>Total {logs.total} pesan tercatat</div>
                    <div className="flex gap-1">
                        {logs.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-2.5 py-1 rounded-lg ${
                                    link.active
                                        ? 'bg-emerald-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scaleUp">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                Detail Pesan WhatsApp #{selectedLog.id}
                            </h4>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-1 text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Penerima:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {selectedLog.recipient_name || '-'} ({selectedLog.recipient_number})
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status:</span>
                                <div>{getStatusBadge(selectedLog.status)}</div>
                            </div>
                            {selectedLog.error_message && (
                                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[11px]">
                                    <strong>Pesan Kesalahan:</strong> {selectedLog.error_message}
                                </div>
                            )}
                            <div>
                                <span className="text-slate-400 block mb-1">Isi Lengkap Pesan:</span>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 whitespace-pre-line text-[11px] font-mono leading-relaxed">
                                    {selectedLog.message}
                                </div>
                            </div>
                            {selectedLog.response_payload && (
                                <div>
                                    <span className="text-slate-400 block mb-1">Response Gateway:</span>
                                    <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[10px] overflow-x-auto font-mono">
                                        {JSON.stringify(selectedLog.response_payload, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
