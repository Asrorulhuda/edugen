import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Eye,
    FileSpreadsheet,
    Plus,
    School,
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

interface AssessmentRubricItem {
    id: number;
    title: string;
    rubric_type: string;
    description?: string | null;
    dimensions_data: Array<{
        name: string;
        aspect: string;
    }>;
    created_at: string;
    subject: SubjectItem;
    phase: PhaseItem;
    grade?: {
        grade_number: number;
        name: string;
    } | null;
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
    rubrics: PaginatedData<AssessmentRubricItem>;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filters: {
        subject_id?: string;
        phase_id?: string;
        rubric_type?: string;
    };
}

export default function RubricsIndex({ rubrics, subjects, phases, filters }: Props) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');
    const [selectedType, setSelectedType] = useState(filters.rubric_type || '');

    const handleFilterChange = (subId: string, phId: string, type: string) => {
        setSelectedSubject(subId);
        setSelectedPhase(phId);
        setSelectedType(type);
        router.get(
            route('curriculum.rubrics.index'),
            {
                subject_id: subId || undefined,
                phase_id: phId || undefined,
                rubric_type: type || undefined,
            },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus Rubrik "${title}"?`)) {
            router.post(route('curriculum.rubrics.destroy', id), { _method: 'delete' });
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'SIKAP_PANCA_CINTA':
                return 'Sikap Panca Cinta';
            case 'KINERJA_UNJUK_KERJA':
                return 'Kinerja / Unjuk Kerja';
            case 'PROYEK_KOLABORATIF':
                return 'Proyek Kolaboratif';
            case 'PORTOFOLIO_REFLEKTIF':
                return 'Portofolio Reflektif';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                            <Award className="w-4 h-4" />
                            Pedoman Penilaian Karakter KBC
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Rubrik Penilaian & Observasi KBC
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Instrumen evaluasi sikap 5 Pilar Cinta Kasih (Panca Cinta), kinerja unjuk rasa belajar, dan rubrik portofolio reflektif berskala 4 tingkat deskriptif.
                        </p>
                    </div>
                    <Link
                        href={route('curriculum.rubrics.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Rancang Rubrik Baru (AI)
                    </Link>
                </div>
            }
        >
            <Head title="Rubrik Penilaian KBC - EduGen" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Mata Pelajaran
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => handleFilterChange(e.target.value, selectedPhase, selectedType)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                                onChange={(e) => handleFilterChange(selectedSubject, e.target.value, selectedType)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">-- Semua Fase --</option>
                                {phases.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Tipe Rubrik
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => handleFilterChange(selectedSubject, selectedPhase, e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">-- Semua Tipe Rubrik --</option>
                                <option value="SIKAP_PANCA_CINTA">Sikap Panca Cinta</option>
                                <option value="KINERJA_UNJUK_KERJA">Kinerja / Unjuk Kerja</option>
                                <option value="PROYEK_KOLABORATIF">Proyek Kolaboratif</option>
                                <option value="PORTOFOLIO_REFLEKTIF">Portofolio Reflektif</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Rubrics Grid */}
                {rubrics.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
                        <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Rubrik Penilaian
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                            Rancang rubrik penilaian karakter Panca Cinta, unjuk kerja, dan lembar observasi yang terstruktur dengan kriteria 4 skala deskriptif operasional.
                        </p>
                        <Link
                            href={route('curriculum.rubrics.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                        >
                            <Sparkles className="w-4 h-4" />
                            Rancang Rubrik Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rubrics.data.map((rub) => (
                            <div
                                key={rub.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
                                            {getTypeName(rub.rubric_type)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {rub.dimensions_data?.length || 0} Dimensi
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5">
                                        {rub.title}
                                    </h3>

                                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{rub.subject?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>
                                                {rub.phase?.name}
                                                {rub.grade ? ` • Kelas ${rub.grade.grade_number}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-400">
                                        Oleh: {rub.user?.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('curriculum.rubrics.show', rub.id)}
                                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition"
                                            title="Buka & Cetak Rubrik"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(rub.id, rub.title)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                            title="Hapus Rubrik"
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
                {rubrics.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {rubrics.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                                    link.active
                                        ? 'bg-purple-600 text-white font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                                } ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
