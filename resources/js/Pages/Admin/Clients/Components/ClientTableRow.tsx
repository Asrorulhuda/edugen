import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Building2, User, Sparkles, MoreVertical, Eye, ShieldCheck, Ban, RefreshCw, Calendar, Trash2 } from 'lucide-react';
import { ClientItem } from '../types';

interface ClientTableRowProps {
    client: ClientItem;
    onAdjustQuota: (client: ClientItem) => void;
    onAdjustDuration: (client: ClientItem) => void;
    onAssignPlan: (client: ClientItem) => void;
    onDeleteClient?: (client: ClientItem) => void;
}

export default function ClientTableRow({
    client,
    onAdjustQuota,
    onAdjustDuration,
    onAssignPlan,
    onDeleteClient,
}: ClientTableRowProps) {
    const isInstitution = client.tenant_type === 'INSTITUTION';
    const sub = client.active_subscription;

    const handleStatusChange = (newStatus: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status client "${client.name}" menjadi ${newStatus}?`)) {
            router.patch(route('admin.clients.update-status', client.id), {
                status: newStatus,
            }, {
                preserveScroll: true,
            });
        }
    };

    const quotaPercent = sub && sub.ai_quota_limit > 0
        ? Math.min(100, Math.round((sub.ai_quota_used / sub.ai_quota_limit) * 100))
        : 0;

    const remainingDays = sub ? Math.ceil(Number(sub.days_remaining)) : 0;

    const handleDeleteClient = () => {
        if (onDeleteClient) {
            onDeleteClient(client);
            return;
        }

        if (
            confirm(
                `PERINGATAN: Apakah Anda yakin ingin menghapus permanen client "${client.name}"?\n\nSeluruh data modul ajar, bank soal, akun guru, dan langganan akan dihapus selamanya dan tidak dapat dikembalikan.`
            )
        ) {
            router.delete(route('admin.clients.destroy', client.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-200/70 dark:border-slate-700/60">
            {/* Client / School info */}
            <td className="px-5 py-4">
                <div className="flex items-start gap-3">
                    <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isInstitution
                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                        }`}
                    >
                        {isInstitution ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.clients.show', client.id)}
                                className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                {client.name}
                            </Link>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    isInstitution
                                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                }`}
                            >
                                {isInstitution ? 'Sekolah' : 'Guru'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isInstitution && client.institution?.npsn ? `NPSN: ${client.institution.npsn}` : client.slug}
                            {client.institution?.level ? ` • ${client.institution.level}` : ''}
                        </p>
                    </div>
                </div>
            </td>

            {/* PIC / Admin User */}
            <td className="px-5 py-4 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {client.primary_admin?.name ?? '-'}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                    {client.primary_admin?.email ?? '-'}
                </p>
            </td>

            {/* Status Badge & Dropdown */}
            <td className="px-5 py-4 text-xs">
                <select
                    value={client.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`font-semibold text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-1 transition-all ${
                        client.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                            : client.status === 'TRIAL'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                            : client.status === 'SUSPENDED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                >
                    <option value="ACTIVE">Aktif</option>
                    <option value="TRIAL">Trial</option>
                    <option value="SUSPENDED">Ditangguhkan</option>
                    <option value="EXPIRED">Expired</option>
                </select>
            </td>

            {/* Subscription & AI Quota */}
            <td className="px-5 py-4 text-xs min-w-[230px]">
                {sub ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <span
                                title={sub.plan_name}
                                className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[140px]"
                            >
                                {sub.plan_name}
                            </span>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                    remainingDays > 5
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                        : remainingDays > 0
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                }`}
                            >
                                {remainingDays > 0 ? `Sisa ${remainingDays} Hari` : 'Habis'}
                            </span>
                        </div>

                        {/* Quota Progress Bar */}
                        <div className="space-y-1">
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        quotaPercent >= 90
                                            ? 'bg-rose-500'
                                            : quotaPercent >= 70
                                            ? 'bg-amber-500'
                                            : 'bg-indigo-600'
                                    }`}
                                    style={{ width: `${quotaPercent}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">{sub.ai_quota_used} / {sub.ai_quota_limit} AI</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    Sisa {sub.ai_quota_remaining}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-400 italic text-xs">Belum ada paket aktif</span>
                )}
            </td>

            {/* Member count */}
            <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                {client.members_count}
                {isInstitution && (
                    <span className="block text-[10px] font-normal text-slate-500">
                        {client.teachers_count} guru
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onAdjustDuration(client)}
                        title="Atur Masa Aktif & Durasi"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onAdjustQuota(client)}
                        title="Atur Kuota AI"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onAssignPlan(client)}
                        title="Tetapkan Paket"
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                    >
                        <ShieldCheck className="w-4 h-4" />
                    </button>
                    <Link
                        href={route('admin.clients.show', client.id)}
                        title="Lihat Detail Profil"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleDeleteClient}
                        title="Hapus Permanen Client"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
