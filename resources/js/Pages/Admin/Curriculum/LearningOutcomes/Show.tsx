import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Archive, ArrowLeft, CheckCircle2, Clock, Edit, FileText, History, Shield, ShieldCheck, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface Props {
    learningOutcome: {
        id: number;
        code: string;
        curriculum_code: string;
        curriculum?: { name: string };
        regulation?: { code: string; title: string; authority: string; year: number };
        subject?: { name: string; code: string; category: string };
        phase?: { name: string; level_summary: string };
        element?: { name: string };
        educationLevel?: { name: string };
        cp_text: string;
        source_locator?: string;
        source_page_start?: number;
        source_page_end?: number;
        checksum: string;
        version: number;
        status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
        verified_by?: number;
        verifier?: { name: string; email: string };
        verified_at?: string;
        published_at?: string;
        notes?: string;
        updater?: { name: string };
        created_at: string;
        updated_at: string;
        versions: Array<{
            id: number;
            version: number;
            cp_text: string;
            element_name?: string;
            change_summary?: string;
            changer?: { name: string };
            created_at: string;
        }>;
        audit_logs: Array<{
            id: number;
            action: string;
            reason?: string;
            actor?: { name: string };
            created_at: string;
        }>;
    };
}

export default function Show({ learningOutcome }: Props) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishReason, setPublishReason] = useState('Verifikasi naskah resmi selesai.');

    const handlePublish = () => {
        router.post(
            route('admin.learning-outcomes.publish', learningOutcome.id),
            { reason: publishReason },
            {
                onSuccess: () => setIsPublishing(false),
            }
        );
    };

    const handleArchive = () => {
        const reason = prompt('Masukkan alasan pengarsipan CP ini:');
        if (reason) {
            router.post(route('admin.learning-outcomes.archive', learningOutcome.id), { reason });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.learning-outcomes.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    {learningOutcome.code}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    v{learningOutcome.version}
                                </span>
                                {learningOutcome.status === 'PUBLISHED' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        ✓ Published
                                    </span>
                                )}
                                {learningOutcome.status === 'DRAFT' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Draft Review
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                {learningOutcome.subject?.name} — {learningOutcome.phase?.name}
                            </h1>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {learningOutcome.status === 'DRAFT' && (
                            <button
                                type="button"
                                onClick={() => setIsPublishing(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Publikasikan Sekarang</span>
                            </button>
                        )}

                        {learningOutcome.status === 'PUBLISHED' && (
                            <button
                                type="button"
                                onClick={handleArchive}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            >
                                <Archive className="w-4 h-4" />
                                <span>Arsipkan</span>
                            </button>
                        )}

                        <Link
                            href={route('admin.learning-outcomes.edit', learningOutcome.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                        >
                            <Edit className="w-4 h-4" />
                            <span>{learningOutcome.status === 'PUBLISHED' ? 'Buat Versi Baru' : 'Edit Draft'}</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail CP ${learningOutcome.code}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Publish Modal */}
                {isPublishing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Konfirmasi Publikasi CP
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        CP yang dipublikasikan akan langsung aktif dan terbaca oleh seluruh guru pada workspace.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Verifikator Publikasi:
                                </label>
                                <textarea
                                    rows={3}
                                    value={publishReason}
                                    onChange={(e) => setPublishReason(e.target.value)}
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPublishing(false)}
                                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                                >
                                    Ya, Publikasikan Resmi
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Official Text & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* CP Official Text Card */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Naskah Resmi Capaian Pembelajaran
                                </span>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    Elemen: {learningOutcome.element?.name || 'Umum'}
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                                <p className="text-sm leading-relaxed font-serif text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                    {learningOutcome.cp_text}
                                </p>
                            </div>

                            {/* Checksum & Integrity Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>SHA-256 Checksum:</span>
                                    <code className="font-mono text-slate-600 dark:text-slate-300">
                                        {learningOutcome.checksum.substring(0, 16)}...
                                    </code>
                                </div>
                                <div>
                                    Sumber: <strong>{learningOutcome.source_locator || '-'}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Immutable Version History */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <History className="w-4 h-4 text-emerald-600" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Histori Versi Naskah (Immutable Revisions)
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {learningOutcome.versions.map((ver) => (
                                    <div
                                        key={ver.id}
                                        className={`p-4 rounded-xl border text-xs space-y-2 transition ${
                                            ver.version === learningOutcome.version
                                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                                                Versi {ver.version} {ver.version === learningOutcome.version && '(Versi Aktif)'}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(ver.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 italic line-clamp-3">
                                            "{ver.cp_text}"
                                        </p>

                                        {ver.change_summary && (
                                            <p className="text-[11px] text-slate-400">
                                                Ringkasan perubahan: <strong>{ver.change_summary}</strong>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Metadata & Audit Timeline */}
                    <div className="space-y-6">
                        {/* Metadata Box */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                            <h3 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                                Metadata Regulasi & Akademik
                            </h3>

                            <div className="space-y-2.5">
                                <div>
                                    <span className="text-slate-400 text-[11px]">Kurikulum:</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {learningOutcome.curriculum?.name}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px]">Regulasi Rujukan:</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        [{learningOutcome.regulation?.code}] {learningOutcome.regulation?.title}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px]">Fase & Jenjang:</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {learningOutcome.phase?.name} ({learningOutcome.phase?.level_summary})
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px]">Verifikator:</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {learningOutcome.verifier?.name || 'Belum diverifikasi'}
                                    </p>
                                </div>
                                {learningOutcome.published_at && (
                                    <div>
                                        <span className="text-slate-400 text-[11px]">Waktu Publikasi:</span>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {new Date(learningOutcome.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Audit Trail Timeline */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                                Audit Trail & Log Kepatuhan
                            </h3>

                            <div className="space-y-4">
                                {learningOutcome.audit_logs.map((log) => (
                                    <div key={log.id} className="relative pl-5 border-l border-slate-200 dark:border-slate-700 text-xs space-y-1">
                                        <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            {log.reason || 'Tidak ada alasan tercatat.'}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Oleh: <strong>{log.actor?.name || 'Sistem'}</strong>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
