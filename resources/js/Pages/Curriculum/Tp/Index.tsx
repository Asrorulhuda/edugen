import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Filter,
    Heart,
    Layers,
    Plus,
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

interface LearningGoalItem {
    id: number;
    code: string;
    bloom_level: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
    competency_kko: string;
    material_content: string;
    pedagogical_description: string;
    panca_cinta_dimensions?: string[];
    deep_learning_elements?: string[];
    profil_lulusan_dimensions?: string[];
    estimated_hours: number;
    subject: SubjectItem;
    phase: PhaseItem;
    grade?: {
        grade_number: number;
        name: string;
    };
    learning_outcome?: {
        element?: {
            name: string;
        };
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
    goals: PaginatedData<LearningGoalItem>;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filters: {
        subject_id?: string;
        phase_id?: string;
    };
}

export default function TpIndex({ goals, subjects, phases, filters }: Props) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');

    const handleFilterChange = (subId: string, phId: string) => {
        setSelectedSubject(subId);
        setSelectedPhase(phId);
        router.get(
            route('curriculum.tp.index'),
            { subject_id: subId || undefined, phase_id: phId || undefined },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, code: string) => {
        if (confirm(`Yakin ingin menghapus Tujuan Pembelajaran ${code}?`)) {
            router.post(route('curriculum.tp.destroy', id), { _method: 'delete' });
        }
    };

    const getBloomBadgeColor = (level: string) => {
        switch (level) {
            case 'C1':
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            case 'C2':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300';
            case 'C3':
                return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300';
            case 'C4':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300';
            case 'C5':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
            case 'C6':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <Layers className="w-4 h-4" />
                            Kurikulum Berbasis Cinta (KBC)
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Bank Tujuan Pembelajaran (TP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kumpulan rumusan TP turunan Capaian Pembelajaran resmi dengan Taksonomi Bloom Revisi & integrasi Panca Cinta.
                        </p>
                    </div>
                    <Link
                        href={route('curriculum.tp.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate TP Baru (AI)
                    </Link>
                </div>
            }
        >
            <Head title="Bank Tujuan Pembelajaran (TP) - EduGen KBC" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Mata Pelajaran
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => handleFilterChange(e.target.value, selectedPhase)}
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
                                onChange={(e) => handleFilterChange(selectedSubject, e.target.value)}
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

                {/* TP Cards List */}
                {goals.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
                        <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Tujuan Pembelajaran
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                            Gunakan Generator AI EduGen KBC untuk membedah Capaian Pembelajaran (CP) resmi menjadi rumusan TP yang terstruktur dan bermakna.
                        </p>
                        <Link
                            href={route('curriculum.tp.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                        >
                            <Sparkles className="w-4 h-4" />
                            Mulai Generate TP Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {goals.data.map((goal) => (
                            <div
                                key={goal.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                            {goal.code}
                                        </span>
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getBloomBadgeColor(
                                                goal.bloom_level
                                            )}`}
                                        >
                                            Bloom {goal.bloom_level} ({goal.competency_kko})
                                        </span>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {goal.subject.name} • {goal.phase.name}
                                            {goal.grade ? ` (Kelas ${goal.grade.grade_number})` : ''}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <span className="text-[11px] text-slate-400">
                                            Alokasi: {goal.estimated_hours} JP
                                        </span>
                                        <button
                                            onClick={() => handleDelete(goal.id, goal.code)}
                                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                                            title="Hapus TP"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* TP Pedagogical Description */}
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                                        {goal.pedagogical_description}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        <strong>Ruang Lingkup Materi:</strong> {goal.material_content}
                                    </p>
                                </div>

                                {/* Tags: Panca Cinta & Deep Learning */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-[10px]">
                                    {goal.panca_cinta_dimensions?.map((dim, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-medium"
                                        >
                                            <Heart className="w-2.5 h-2.5" />
                                            {dim}
                                        </span>
                                    ))}

                                    {goal.deep_learning_elements?.map((elem, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 font-medium"
                                        >
                                            <Sparkles className="w-2.5 h-2.5" />
                                            {elem}
                                        </span>
                                    ))}

                                    {goal.profil_lulusan_dimensions?.map((prof, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            <Award className="w-2.5 h-2.5 text-amber-500" />
                                            {prof}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {goals.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <div>
                                    Halaman {goals.current_page} dari {goals.last_page} ({goals.total} TP)
                                </div>
                                <div className="flex gap-1">
                                    {goals.links.map((link, idx) => (
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
                )}
            </div>
        </AuthenticatedLayout>
    );
}
