import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Check,
    Copy,
    Filter,
    GraduationCap,
    Layers,
    RotateCcw,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    learningOutcomes: {
        data: Array<{
            id: number;
            code: string;
            curriculum_code: string;
            curriculum?: { name: string };
            regulation?: { code: string; title: string; authority: string; year: number };
            subject?: { name: string; code: string; category: string };
            phase?: { name: string; level_summary: string };
            element?: { name: string };
            educationLevel?: { id: number; code: string; name: string };
            cp_text: string;
            source_locator?: string;
            checksum: string;
            version: number;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
        from?: number;
        to?: number;
    };
    filters: {
        curriculum_code?: string;
        education_level_id?: string;
        subject_id?: string;
        phase_id?: string;
        element_id?: string;
        search?: string;
    };
    curricula: Array<{ code: string; name: string }>;
    educationLevels: Array<{ id: number; code: string; name: string }>;
    subjects: Array<{ id: number; code: string; name: string; category: string }>;
    phases: Array<{ id: number; code: string; name: string; level_summary: string }>;
    elements: Array<{ id: number; code: string; name: string }>;
}

export default function BrowseCp({
    learningOutcomes,
    filters,
    curricula,
    educationLevels,
    subjects,
    phases,
    elements,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [curriculumCode, setCurriculumCode] = useState(filters.curriculum_code || '');
    const [educationLevelId, setEducationLevelId] = useState(filters.education_level_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [phaseId, setPhaseId] = useState(filters.phase_id || '');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleApply = (overrides?: {
        search?: string;
        curriculum_code?: string;
        education_level_id?: string;
        subject_id?: string;
        phase_id?: string;
    }) => {
        const nextSearch = overrides?.search !== undefined ? overrides.search : search;
        const nextCurriculum = overrides?.curriculum_code !== undefined ? overrides.curriculum_code : curriculumCode;
        const nextLevel = overrides?.education_level_id !== undefined ? overrides.education_level_id : educationLevelId;
        const nextSubject = overrides?.subject_id !== undefined ? overrides.subject_id : subjectId;
        const nextPhase = overrides?.phase_id !== undefined ? overrides.phase_id : phaseId;

        router.get(
            route('curriculum.cp.index'),
            {
                search: nextSearch.trim() || undefined,
                curriculum_code: nextCurriculum || undefined,
                education_level_id: nextLevel || undefined,
                subject_id: nextSubject || undefined,
                phase_id: nextPhase || undefined,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setCurriculumCode('');
        setEducationLevelId('');
        setSubjectId('');
        setPhaseId('');
        router.get(route('curriculum.cp.index'), {}, { preserveState: true });
    };

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.curriculum_code ||
        filters.education_level_id ||
        filters.subject_id ||
        filters.phase_id
    );

    // Group subjects by category for cleaner display
    const generalSubjects = subjects.filter((s) => s.category === 'GENERAL' || !s.category);
    const religionSubjects = subjects.filter((s) => s.category === 'RELIGION');
    const arabicSubjects = subjects.filter((s) => s.category === 'ARABIC');
    const otherSubjects = subjects.filter(
        (s) => !['GENERAL', 'RELIGION', 'ARABIC'].includes(s.category)
    );

    // Helper to get names for active badges
    const getCurriculumName = (code?: string) => curricula.find((c) => c.code === code)?.name || code;
    const getLevelName = (id?: string) => educationLevels.find((l) => String(l.id) === String(id))?.name;
    const getSubjectName = (id?: string) => subjects.find((s) => String(s.id) === String(id))?.name;
    const getPhaseName = (id?: string) => phases.find((p) => String(p.id) === String(id))?.name;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <BookOpen className="w-4 h-4" />
                            Katalog Capaian Pembelajaran Resmi
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Eksplorasi Capaian Pembelajaran (CP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Rujukan resmi teks Capaian Pembelajaran dari BSKAP Kemendikbudristek No. 046/2025 dan KMA Kemenag No. 1503/2025.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Sparkles className="w-3.5 h-3.5" />
                            {learningOutcomes.total} CP Terverifikasi
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Katalog Capaian Pembelajaran (CP)" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
                {/* Search & Filter Card */}
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    {/* Top Row: Search Input & Apply/Reset Actions */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                                placeholder="Cari kata kunci materi, kode CP, atau teks capaian pembelajaran..."
                                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        handleApply({ search: '' });
                                    }}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    title="Hapus pencarian"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                                    title="Reset seluruh filter ke default"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleApply()}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Terapkan Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Grid: Kurikulum, Jenjang, Mapel, Fase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* 1. Kurikulum Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Kerangka Kurikulum
                            </label>
                            <select
                                value={curriculumCode}
                                onChange={(e) => {
                                    setCurriculumCode(e.target.value);
                                    handleApply({ curriculum_code: e.target.value });
                                }}
                                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-medium"
                            >
                                <option value="">Semua Kerangka Kurikulum</option>
                                {curricula.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Jenjang Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Jenjang Pendidikan
                            </label>
                            <select
                                value={educationLevelId}
                                onChange={(e) => {
                                    setEducationLevelId(e.target.value);
                                    handleApply({ education_level_id: e.target.value });
                                }}
                                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-medium"
                            >
                                <option value="">Semua Jenjang</option>
                                {educationLevels.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.code} ({l.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Mata Pelajaran Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Mata Pelajaran
                            </label>
                            <select
                                value={subjectId}
                                onChange={(e) => {
                                    setSubjectId(e.target.value);
                                    handleApply({ subject_id: e.target.value });
                                }}
                                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-medium"
                            >
                                <option value="">Semua Mata Pelajaran</option>

                                {religionSubjects.length > 0 && (
                                    <optgroup label="Muatan PAI / Keagamaan Madrasah">
                                        {religionSubjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {arabicSubjects.length > 0 && (
                                    <optgroup label="Bahasa Asing / Arab">
                                        {arabicSubjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {generalSubjects.length > 0 && (
                                    <optgroup label="Mata Pelajaran Umum">
                                        {generalSubjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {otherSubjects.length > 0 && (
                                    <optgroup label="Lainnya">
                                        {otherSubjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>

                        {/* 4. Fase Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Fase Capaian
                            </label>
                            <select
                                value={phaseId}
                                onChange={(e) => {
                                    setPhaseId(e.target.value);
                                    handleApply({ phase_id: e.target.value });
                                }}
                                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-medium"
                            >
                                <option value="">Semua Fase</option>
                                {phases.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.level_summary})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filter Badges */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                Filter Aktif:
                            </span>

                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        handleApply({ search: '' });
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                >
                                    <span>Cari: "{filters.search}"</span>
                                    <X className="w-3 h-3 text-slate-400" />
                                </button>
                            )}

                            {filters.curriculum_code && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurriculumCode('');
                                        handleApply({ curriculum_code: '' });
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                                >
                                    <span>Kurikulum: {getCurriculumName(filters.curriculum_code)}</span>
                                    <X className="w-3 h-3 text-emerald-600" />
                                </button>
                            )}

                            {filters.education_level_id && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEducationLevelId('');
                                        handleApply({ education_level_id: '' });
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                                >
                                    <span>Jenjang: {getLevelName(filters.education_level_id)}</span>
                                    <X className="w-3 h-3 text-indigo-600" />
                                </button>
                            )}

                            {filters.subject_id && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubjectId('');
                                        handleApply({ subject_id: '' });
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 transition"
                                >
                                    <span>Mapel: {getSubjectName(filters.subject_id)}</span>
                                    <X className="w-3 h-3 text-amber-600" />
                                </button>
                            )}

                            {filters.phase_id && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhaseId('');
                                        handleApply({ phase_id: '' });
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 transition"
                                >
                                    <span>Fase: {getPhaseName(filters.phase_id)}</span>
                                    <X className="w-3 h-3 text-sky-600" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 ml-auto"
                            >
                                Hapus Semua
                            </button>
                        </div>
                    )}
                </div>

                {/* Empty State Warning */}
                {learningOutcomes.data.length === 0 ? (
                    <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Capaian Pembelajaran Tidak Ditemukan
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Tidak ada CP resmi yang cocok dengan kombinasi filter yang Anda pilih. Silakan sesuaikan pencarian atau reset filter untuk melihat seluruh katalog CP.
                            </p>
                        </div>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset Seluruh Filter
                            </button>
                        )}
                    </div>
                ) : (
                    /* CP Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {learningOutcomes.data.map((item) => {
                            const isMadrasah = item.curriculum_code === 'MADRASAH_KBC';

                            return (
                                <div
                                    key={item.id}
                                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-3">
                                        {/* Badges Bar: Curriculum, Level, Phase, Element */}
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {/* Curriculum Badge */}
                                                <span
                                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                                                        isMadrasah
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                                    }`}
                                                >
                                                    {isMadrasah ? 'Kurikulum Madrasah (KBC)' : 'Kurikulum Merdeka'}
                                                </span>

                                                {/* Jenjang Badge */}
                                                {item.educationLevel && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                        {item.educationLevel.code}
                                                    </span>
                                                )}

                                                {/* Phase Badge */}
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {item.phase?.name}
                                                </span>

                                                {/* Element Badge */}
                                                {item.element?.name && (
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        Elemen: {item.element.name}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Code & Version */}
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                {item.code} (v{item.version})
                                            </span>
                                        </div>

                                        {/* Subject Title */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {item.subject?.name}
                                            </h3>
                                            <p className="text-[11px] text-slate-500">
                                                {item.educationLevel ? `${item.educationLevel.name} • ` : ''}
                                                {item.phase?.level_summary}
                                                {item.regulation?.authority && ` • ${item.regulation.authority}`}
                                            </p>
                                        </div>

                                        {/* Official Text Box */}
                                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
                                            "{item.cp_text}"
                                        </div>
                                    </div>

                                    {/* Footer & Copy Action */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                                        <div className="truncate text-[11px] text-slate-400" title={item.source_locator || item.regulation?.title}>
                                            Rujukan:{' '}
                                            <strong className="text-slate-600 dark:text-slate-300">
                                                {item.source_locator || item.regulation?.code || item.regulation?.title}
                                            </strong>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.id, item.cp_text)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shrink-0"
                                        >
                                            {copiedId === item.id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-emerald-600">Tersalin!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Salin Teks CP</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {learningOutcomes.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-500">
                            Menampilkan {learningOutcomes.data.length} dari {learningOutcomes.total} Capaian Pembelajaran
                        </span>
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {learningOutcomes.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs rounded-lg transition ${
                                        link.active
                                            ? 'bg-emerald-600 text-white font-bold'
                                            : link.url
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
