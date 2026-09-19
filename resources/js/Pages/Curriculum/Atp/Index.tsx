import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Eye,
    Filter,
    Layers,
    Plus,
    Printer,
    Route as RouteIcon,
    Sparkles,
    Trash2,
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

interface SequenceItem {
    id: number;
    title: string;
    total_hours_allocated: number;
    status: 'DRAFT' | 'FINAL';
    created_at: string;
    updated_at: string;
    subject: SubjectItem;
    phase: PhaseItem;
    grade?: {
        id: number;
        grade_number: number;
        name: string;
    };
    academicYear?: {
        year_name: string;
    };
    creator?: {
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
    sequences: PaginatedData<SequenceItem>;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filters: {
        subject_id?: string;
        phase_id?: string;
    };
}

export default function AtpIndex({ sequences, subjects, phases, filters }: Props) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');

    const handleFilterChange = (subId: string, phId: string) => {
        setSelectedSubject(subId);
        setSelectedPhase(phId);
        router.get(
            route('curriculum.atp.index'),
            { subject_id: subId || undefined, phase_id: phId || undefined },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus dokumen ATP "${title}"?`)) {
            router.delete(route('curriculum.atp.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <span>Perangkat KBC</span>
                            <span>/</span>
                            <span>Alur Pembelajaran</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Alur Tujuan Pembelajaran (ATP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dokumen kronologis urutan Tujuan Pembelajaran untuk Semester Ganjil & Genap sesuai KMA 1503/2025.
                        </p>
                    </div>

                    <Link
                        href={route('curriculum.atp.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Susun ATP dengan AI
                    </Link>
                </div>
            }
        >
            <Head title="Alur Tujuan Pembelajaran (ATP) - EduGen KBC" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Filter Toolbar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <Filter className="w-4 h-4 text-emerald-600" />
                        <span>Filter Data:</span>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <select
                            value={selectedSubject}
                            onChange={(e) => handleFilterChange(e.target.value, selectedPhase)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-48">
                        <select
                            value={selectedPhase}
                            onChange={(e) => handleFilterChange(selectedSubject, e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Fase</option>
                            {phases.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {(selectedSubject || selectedPhase) && (
                        <button
                            onClick={() => handleFilterChange('', '')}
                            className="text-xs text-slate-500 hover:text-slate-800 underline"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Document List */}
                {sequences.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                            <RouteIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                            Belum Ada Dokumen ATP Tersimpan
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                            Gunakan generator AI untuk menyusun Alur Tujuan Pembelajaran tahunan secara sistematis dan terstruktur.
                        </p>
                        <Link
                            href={route('curriculum.atp.create')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Buat ATP Baru Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sequences.data.map((seq) => (
                            <div
                                key={seq.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                            Fase {seq.phase.code} {seq.grade ? `• Kelas ${seq.grade.grade_number}` : ''}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            seq.status === 'FINAL'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                            {seq.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                            {seq.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {seq.subject.name}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{seq.total_hours_allocated} JP Total</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{seq.academicYear?.year_name || 'Tahun Ini'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <Link
                                        href={route('curriculum.atp.show', seq.id)}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Lihat Alur
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={route('curriculum.atp.print', seq.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                                            title="Cetak Dokumen Resmi"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(seq.id, seq.title)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                            title="Hapus ATP"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {sequences.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {sequences.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={!link.url || link.active}
                                onClick={() => link.url && router.get(link.url)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-emerald-600 text-white'
                                        : link.url
                                        ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                                        : 'text-slate-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
