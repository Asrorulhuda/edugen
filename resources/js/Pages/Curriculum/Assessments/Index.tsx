import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    CheckCircle2,
    ClipboardList,
    Clock,
    Edit3,
    Eye,
    FileQuestion,
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

interface AssessmentPackageItem {
    id: number;
    title: string;
    curriculum_code?: 'MERDEKA' | 'MADRASAH_KBC';
    assessment_type: string;
    total_questions: number;
    duration_minutes: number;
    status: 'DRAFT' | 'FINAL';
    created_at: string;
    questions_count: number;
    matrices_count: number;
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
    packages: PaginatedData<AssessmentPackageItem>;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filters: {
        subject_id?: string;
        phase_id?: string;
        assessment_type?: string;
        curriculum_code?: string;
    };
}

export default function AssessmentIndex({ packages, subjects, phases, filters }: Props) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject_id || '');
    const [selectedPhase, setSelectedPhase] = useState(filters.phase_id || '');
    const [selectedType, setSelectedType] = useState(filters.assessment_type || '');
    const [selectedCurriculum, setSelectedCurriculum] = useState(filters.curriculum_code || '');

    const handleFilterChange = (subId: string, phId: string, type: string, curCode: string) => {
        setSelectedSubject(subId);
        setSelectedPhase(phId);
        setSelectedType(type);
        setSelectedCurriculum(curCode);
        router.get(
            route('curriculum.assessments.index'),
            {
                subject_id: subId || undefined,
                phase_id: phId || undefined,
                assessment_type: type || undefined,
                curriculum_code: curCode || undefined,
            },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus Paket Asesmen "${title}"?`)) {
            router.post(route('curriculum.assessments.destroy', id), { _method: 'delete' });
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'FORMATIF':
                return 'Formatif';
            case 'SUMATIF_LINGKUP_MATERI':
                return 'Sumatif Lingkup Materi';
            case 'SUMATIF_AKHIR_SEMESTER':
                return 'Sumatif Akhir Semester';
            case 'SUMATIF_AKHIR_FASE':
                return 'Sumatif Akhir Fase';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <ClipboardList className="w-4 h-4" />
                            Kurikulum Merdeka & Madrasah KBC
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Bank Soal & Kisi-kisi Asesmen
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Bank butir soal HOTS, pilihan ganda, dan uraian berstandar Kurikulum Merdeka & Madrasah KBC, dilengkapi kisi-kisi terukur dan lembar cetak ujian resmi.
                        </p>
                    </div>
                    <Link
                        href={route('curriculum.assessments.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Rancang Asesmen Baru (AI)
                    </Link>
                </div>
            }
        >
            <Head title="Bank Soal & Kisi-kisi Asesmen - Kurikulum Merdeka & KBC - EduGen" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Saring Kurikulum
                            </label>
                            <select
                                value={selectedCurriculum}
                                onChange={(e) => handleFilterChange(selectedSubject, selectedPhase, selectedType, e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                                onChange={(e) => handleFilterChange(e.target.value, selectedPhase, selectedType, selectedCurriculum)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
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
                                Saring Fase
                            </label>
                            <select
                                value={selectedPhase}
                                onChange={(e) => handleFilterChange(selectedSubject, e.target.value, selectedType, selectedCurriculum)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
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
                                Saring Jenis Asesmen
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => handleFilterChange(selectedSubject, selectedPhase, e.target.value, selectedCurriculum)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Semua Jenis Asesmen --</option>
                                <option value="FORMATIF">Formatif</option>
                                <option value="SUMATIF_LINGKUP_MATERI">Sumatif Lingkup Materi</option>
                                <option value="SUMATIF_AKHIR_SEMESTER">Sumatif Akhir Semester</option>
                                <option value="SUMATIF_AKHIR_FASE">Sumatif Akhir Fase</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Assessment Packages Grid */}
                {packages.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
                        <FileQuestion className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Paket Asesmen
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                            Rancang naskah ujian dan kisi-kisi asesmen otomatis berdasarkan Tujuan Pembelajaran (TP) Kurikulum Merdeka atau Madrasah KBC.
                        </p>
                        <Link
                            href={route('curriculum.assessments.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                        >
                            <Sparkles className="w-4 h-4" />
                            Rancang Asesmen Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {packages.data.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                                pkg.curriculum_code === 'MERDEKA'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                                            }`}>
                                                {pkg.curriculum_code === 'MERDEKA' ? 'Kurmer' : 'KBC'}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {getTypeName(pkg.assessment_type)}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            pkg.status === 'FINAL'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                            {pkg.status}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5">
                                        {pkg.title}
                                    </h3>

                                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{pkg.subject?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{pkg.phase?.name} • Kelas {pkg.grade?.grade_number}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                                            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                                <ClipboardList className="w-3 h-3" />
                                                {pkg.questions_count || pkg.total_questions} Soal
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {pkg.duration_minutes} Menit
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-400">
                                        Oleh: {pkg.user?.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('curriculum.assessments.show', pkg.id)}
                                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition"
                                            title="Buka & Cetak Lembar Asesmen"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route('curriculum.assessments.edit', pkg.id)}
                                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition"
                                            title="Edit Soal & Kisi-kisi"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(pkg.id, pkg.title)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                            title="Hapus Paket Soal"
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
                {packages.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {packages.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                                    link.active
                                        ? 'bg-emerald-600 text-white font-semibold'
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
