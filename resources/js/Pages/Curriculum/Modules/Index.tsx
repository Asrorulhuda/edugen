import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    Eye,
    FileText,
    Filter,
    Plus,
    School,
    Sparkles,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface SubjectItem {
    id: number;
    code: string;
    name: string;
}

interface PhaseItem {
    id: number;
    code: string;
    name: string;
}

interface TeachingModuleItem {
    id: number;
    title: string;
    curriculum_code?: 'MERDEKA' | 'MADRASAH_KBC';
    topic_name: string;
    total_hours: number;
    meeting_count: number;
    learning_model: string;
    status: 'DRAFT' | 'FINAL' | 'ARCHIVED';
    created_at: string;
    subject: SubjectItem;
    phase: PhaseItem;
    grade: {
        grade_number: number;
        name: string;
    };
    user: {
        name: string;
    };
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
    modules: PaginatedData<TeachingModuleItem>;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filters: {
        subject_id?: string;
        phase_id?: string;
        curriculum_code?: string;
    };
}

export default function ModulesIndex({ modules, subjects, phases, filters }: Props) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');
    const [selectedCurriculum, setSelectedCurriculum] = useState(filters.curriculum_code || '');

    const handleFilterChange = (subId: string, phId: string, curCode: string) => {
        setSelectedSubject(subId);
        setSelectedPhase(phId);
        setSelectedCurriculum(curCode);
        router.get(
            route('curriculum.modules.index'),
            {
                subject_id: subId || undefined,
                phase_id: phId || undefined,
                curriculum_code: curCode || undefined,
            },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus Modul Ajar "${title}"?`)) {
            router.delete(route('curriculum.modules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <School className="w-4 h-4" />
                            Kurikulum Merdeka & Madrasah KBC
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Perangkat Ajar & Modul (RPP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Modul Ajar operasional terintegrasi Kurikulum Merdeka (Kemendikbudristek) & Madrasah KBC (KMA 1503/2025), asesmen bermakna, dan format resmi siap cetak.
                        </p>
                    </div>
                    <Link
                        href={route('curriculum.modules.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Rancang Modul Ajar Baru (AI)
                    </Link>
                </div>
            }
        >
            <Head title="Modul Ajar - Kurikulum Merdeka & KBC - EduGen" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Kurikulum
                            </label>
                            <select
                                value={selectedCurriculum}
                                onChange={(e) => handleFilterChange(selectedSubject, selectedPhase, e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="">-- Semua Kurikulum --</option>
                                <option value="MERDEKA">Kurikulum Merdeka</option>
                                <option value="MADRASAH_KBC">Madrasah KBC (KMA 1503/2025)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Mata Pelajaran
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => handleFilterChange(e.target.value, selectedPhase, selectedCurriculum)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Semua Mata Pelajaran --</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Fase Pembelajaran
                            </label>
                            <select
                                value={selectedPhase}
                                onChange={(e) => handleFilterChange(selectedSubject, e.target.value, selectedCurriculum)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Semua Fase --</option>
                                {phases.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modules Grid */}
                {modules.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Modul Ajar
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                            Mulai rancang Modul Ajar Kurikulum Merdeka atau Madrasah KBC lengkap dengan skenario pertemuan, lembar kerja murid, dan asesmen autentik.
                        </p>
                        <Link
                            href={route('curriculum.modules.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                        >
                            <Sparkles className="w-4 h-4" />
                            Rancang Modul Ajar Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.data.map((mod) => (
                            <div
                                key={mod.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition space-y-4"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                                mod.curriculum_code === 'MERDEKA'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                                            }`}>
                                                {mod.curriculum_code === 'MERDEKA' ? 'Kurmer' : 'KBC'}
                                            </span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {mod.subject.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                            Kelas {mod.grade.grade_number} ({mod.phase.name})
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                        {mod.title}
                                    </h3>

                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        Topik: <strong>{mod.topic_name}</strong>
                                    </p>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{mod.meeting_count} Pertemuan ({mod.total_hours} JP)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{mod.user.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-slate-400">
                                        Model: {mod.learning_model}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <Link
                                            href={route('curriculum.modules.show', mod.id)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg transition"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Lihat & Cetak
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(mod.id, mod.title)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                                            title="Hapus Modul"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {modules.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div>
                            Halaman {modules.current_page} dari {modules.last_page} ({modules.total} Modul)
                        </div>
                        <div className="flex gap-1">
                            {modules.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border text-xs ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    } disabled:opacity-40`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
