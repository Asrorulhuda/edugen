import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, BookOpen, CheckCircle, CheckCircle2, Clock, Database, Edit, Eye, Filter, Plus, Search, ShieldAlert, ShieldCheck, Trash2, UploadCloud, X, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    learningOutcomes: {
        data: Array<{
            id: number;
            code: string;
            curriculum_code: string;
            curriculum?: { name: string };
            regulation?: { code: string; title: string };
            subject?: { name: string; code: string; category: string };
            phase?: { name: string; level_summary: string };
            element?: { name: string };
            educationLevel?: { name: string };
            cp_text: string;
            source_locator?: string;
            version: number;
            status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
            verifier?: { name: string };
            updated_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        search?: string;
        curriculum_code?: string;
        subject_id?: string;
        phase_id?: string;
        education_level_id?: string;
        status?: string;
        regulation_id?: string;
    };
    curricula: Array<{ code: string; name: string }>;
    subjects: Array<{ id: number; code: string; name: string; category: string }>;
    phases: Array<{ id: number; code: string; name: string; level_summary: string }>;
    levels: Array<{ id: number; code: string; name: string }>;
    regulations: Array<{ id: number; code: string; title: string }>;
    draftCount?: number;
}

export default function Index({
    learningOutcomes,
    filters,
    curricula,
    subjects,
    phases,
    levels,
    regulations,
    draftCount = 0,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCurriculum, setSelectedCurriculum] = useState(filters.curriculum_code || '');
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    
    // Delete All State
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
    const [deleteScope, setDeleteScope] = useState<string>('ALL');
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Publish All (Approve All Drafts) State
    const [isPublishAllOpen, setIsPublishAllOpen] = useState(false);
    const [publishScope, setPublishScope] = useState<string>('ALL');
    const [publishReason, setPublishReason] = useState('Persetujuan dan verifikasi naskah resmi CP Draft selesai.');
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublishAll = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPublishing(true);
        router.post(route('admin.learning-outcomes.publish-all'), {
            curriculum_code: publishScope,
            reason: publishReason,
        }, {
            onFinish: () => {
                setIsPublishing(false);
                setIsPublishAllOpen(false);
            },
        });
    };

    const handleDeleteAll = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmText !== 'HAPUS') return;

        setIsDeleting(true);
        router.post(route('admin.learning-outcomes.destroy-all'), {
            _method: 'delete',
            curriculum_code: deleteScope,
        }, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteAllOpen(false);
                setConfirmText('');
            },
        });
    };

    const applyFilters = () => {
        router.get(
            route('admin.learning-outcomes.index'),
            {
                search: search || undefined,
                curriculum_code: selectedCurriculum || undefined,
                subject_id: selectedSubject || undefined,
                phase_id: selectedPhase || undefined,
                status: selectedStatus || undefined,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCurriculum('');
        setSelectedSubject('');
        setSelectedPhase('');
        setSelectedStatus('');
        router.get(route('admin.learning-outcomes.index'));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3" /> Published (Aktif)
                    </span>
                );
            case 'DRAFT':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Clock className="w-3 h-3" /> Draft (Review)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        <XCircle className="w-3 h-3" /> Archived
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <Database className="w-4 h-4" />
                            Control Plane Platform
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Master Capaian Pembelajaran (CP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola sumber teks resmi kurikulum, siklus verifikasi publikasi, versi, dan audit log.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {draftCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsPublishAllOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Setujui Semua Draft ({draftCount})</span>
                            </button>
                        )}
                        {learningOutcomes.total > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsDeleteAllOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 shadow-xs transition"
                            >
                                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span>Hapus Semua CP</span>
                            </button>
                        )}
                        <Link
                            href={route('admin.import-cp.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition"
                        >
                            <UploadCloud className="w-4 h-4 text-emerald-600" />
                            <span>Import CSV</span>
                        </Link>
                        <Link
                            href={route('admin.learning-outcomes.create')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah CP Manual</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Master Capaian Pembelajaran (CP) - Super Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Draft CP Review Banner */}
                {draftCount > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs shadow-xs">
                        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
                            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    Terdapat {draftCount} Data CP Menunggu Peninjauan (DRAFT)
                                </span>
                                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                                    CP berstatus DRAFT belum aktif untuk guru. Anda dapat meninjau naskah atau langsung menyetujui seluruhnya agar resmi dipublikasikan.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublishAllOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition shrink-0"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Setujui & Publikasikan Seluruh Draft ({draftCount})</span>
                        </button>
                    </div>
                )}
                {/* Filter Bar */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Cari kode atau isi teks CP..."
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            />
                        </div>

                        {/* Curriculum Filter */}
                        <select
                            value={selectedCurriculum}
                            onChange={(e) => setSelectedCurriculum(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Kurikulum</option>
                            {curricula.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>

                        {/* Subject Filter */}
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>

                        {/* Phase Filter */}
                        <select
                            value={selectedPhase}
                            onChange={(e) => setSelectedPhase(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Fase</option>
                            {phases.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.level_summary})</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="PUBLISHED">Published (Aktif)</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                        >
                            Reset Filter
                        </button>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Terapkan Filter
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Kode & Versi</th>
                                    <th className="px-4 py-3">Kurikulum & Regulasi</th>
                                    <th className="px-4 py-3">Mata Pelajaran & Fase</th>
                                    <th className="px-4 py-3">Elemen</th>
                                    <th className="px-4 py-3">Teks Ringkas</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {learningOutcomes.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                            Tidak ada data Capaian Pembelajaran yang sesuai dengan kriteria filter.
                                        </td>
                                    </tr>
                                ) : (
                                    learningOutcomes.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{item.code}</span>
                                                <div className="text-[10px] text-slate-400 font-mono">v{item.version}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{item.curriculum?.name || item.curriculum_code}</div>
                                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">
                                                    {item.regulation?.code || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{item.subject?.name}</div>
                                                <div className="text-[10px] text-slate-500 font-semibold">{item.phase?.name} ({item.phase?.level_summary})</div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                                    {item.element?.name || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="line-clamp-2 text-slate-600 dark:text-slate-400 max-w-sm">
                                                    {item.cp_text}
                                                </p>
                                                {item.source_locator && (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        Sumber: {item.source_locator}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route('admin.learning-outcomes.show', item.id)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                        title="Detail & Histori Versi"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.learning-outcomes.edit', item.id)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                        title="Edit / Buat Versi Baru"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {learningOutcomes.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                Total: <strong>{learningOutcomes.total}</strong> Capaian Pembelajaran
                            </span>
                            <div className="flex items-center gap-1">
                                {learningOutcomes.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-xs rounded-lg transition ${
                                            link.active
                                                ? 'bg-emerald-600 text-white font-bold'
                                                : link.url
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: KONFIRMASI HAPUS SEMUA CP */}
            {isDeleteAllOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Hapus Semua Capaian Pembelajaran?
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteAllOpen(false);
                                    setConfirmText('');
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 space-y-1.5">
                            <p className="font-semibold">
                                Perhatian Super Admin:
                            </p>
                            <p>
                                Seluruh riwayat versi CP, data tujuan pembelajaran (TP), dan draft terkait akan ikut terhapus. Log audit penghapusan akan tetap disimpan untuk kepatuhan sistem.
                            </p>
                        </div>

                        <form onSubmit={handleDeleteAll} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Cakupan Kurikulum yang Dihapus:
                                </label>
                                <select
                                    value={deleteScope}
                                    onChange={(e) => setDeleteScope(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="ALL">Semua Kurikulum (Total: {learningOutcomes.total} CP)</option>
                                    {curricula.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            Hanya Kurikulum {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Ketik <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">HAPUS</span> untuk mengonfirmasi:
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="Ketik HAPUS di sini"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={() => {
                                        setIsDeleteAllOpen(false);
                                        setConfirmText('');
                                    }}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={confirmText !== 'HAPUS' || isDeleting}
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition disabled:opacity-40 flex items-center gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: PERSETUJUAN & PUBLIKASI MASSAL CP DRAFT */}
            {isPublishAllOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Setujui & Publikasikan Semua CP Draft?
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Data akan berstatus PUBLISHED dan langsung aktif untuk guru.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPublishAllOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                            <p className="font-semibold">
                                Informasi Verifikasi:
                            </p>
                            <p>
                                Sebanyak <strong>{draftCount}</strong> Capaian Pembelajaran berstatus DRAFT akan diverifikasi secara massal atas nama akun Super Admin Anda.
                            </p>
                        </div>

                        <form onSubmit={handlePublishAll} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Cakupan Kurikulum yang Disetujui:
                                </label>
                                <select
                                    value={publishScope}
                                    onChange={(e) => setPublishScope(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="ALL">Semua Kurikulum ({draftCount} Draft CP)</option>
                                    {curricula.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            Hanya Kurikulum {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Alasan Verifikasi & Publikasi:
                                </label>
                                <textarea
                                    rows={2}
                                    value={publishReason}
                                    onChange={(e) => setPublishReason(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    placeholder="e.g. Verifikasi dan persetujuan naskah resmi selesai."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    disabled={isPublishing}
                                    onClick={() => setIsPublishAllOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{isPublishing ? 'Menyetujui & Mempublikasikan...' : 'Setujui & Publikasikan Sekarang'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
