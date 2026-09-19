import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, BookOpen, Check, Copy, Filter, Info, Layers, Search, ShieldCheck } from 'lucide-react';
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
            educationLevel?: { name: string };
            cp_text: string;
            source_locator?: string;
            checksum: string;
            version: number;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        curriculum_code?: string;
        subject_id?: string;
        phase_id?: string;
        element_id?: string;
        search?: string;
    };
    curricula: Array<{ code: string; name: string }>;
    subjects: Array<{ id: number; code: string; name: string; category: string }>;
    phases: Array<{ id: number; code: string; name: string; level_summary: string }>;
    elements: Array<{ id: number; code: string; name: string }>;
}

export default function BrowseCp({
    learningOutcomes,
    filters,
    curricula,
    subjects,
    phases,
    elements,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [curriculumCode, setCurriculumCode] = useState(filters.curriculum_code || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [phaseId, setPhaseId] = useState(filters.phase_id || '');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleApply = () => {
        router.get(
            route('curriculum.cp.index'),
            {
                search: search || undefined,
                curriculum_code: curriculumCode || undefined,
                subject_id: subjectId || undefined,
                phase_id: phaseId || undefined,
            },
            { preserveState: true }
        );
    };

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
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
            }
        >
            <Head title="Katalog Capaian Pembelajaran (CP)" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Search & Filter Header */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                                placeholder="Cari kata kunci CP..."
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Curriculum Selection */}
                        <select
                            value={curriculumCode}
                            onChange={(e) => setCurriculumCode(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Kerangka Kurikulum</option>
                            {curricula.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>

                        {/* Subject Selection */}
                        <select
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>

                        {/* Phase Selection */}
                        <select
                            value={phaseId}
                            onChange={(e) => setPhaseId(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Semua Fase</option>
                            {phases.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.level_summary})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleApply}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Tampilkan Capaian Pembelajaran
                        </button>
                    </div>
                </div>

                {/* Empty State Warning (strictly per specification) */}
                {learningOutcomes.data.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            CP Belum Tersedia Pada Master Platform
                        </h3>
                        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                            CP untuk kombinasi mata pelajaran dan fase ini belum tersedia pada master terverifikasi. Sesuai kebijakan kepatuhan regulasi, generator perangkat dinonaktifkan sementara dan tidak diperbolehkan menggunakan teks fiktif AI.
                        </p>
                    </div>
                ) : (
                    /* CP Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {learningOutcomes.data.map((item) => (
                            <div
                                key={item.id}
                                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    {/* Badges Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                                {item.phase?.name}
                                            </span>
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {item.element?.name || 'Umum'}
                                            </span>
                                        </div>

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
                                            {item.curriculum?.name} • {item.phase?.level_summary}
                                        </p>
                                    </div>

                                    {/* Official Text */}
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
                                        "{item.cp_text}"
                                    </div>
                                </div>

                                {/* Footer & Action */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                                    <div className="truncate text-[11px] text-slate-400">
                                        Rujukan: <strong className="text-slate-600 dark:text-slate-300">{item.source_locator || item.regulation?.code}</strong>
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
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {learningOutcomes.links.length > 3 && (
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-500">
                            Menampilkan {learningOutcomes.data.length} dari {learningOutcomes.total} Capaian Pembelajaran
                        </span>
                        <div className="flex items-center gap-1">
                            {learningOutcomes.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
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
        </AuthenticatedLayout>
    );
}
