import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AiGeneratingModal from '@/Components/Curriculum/AiGeneratingModal';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Bot,
    Check,
    CheckCircle2,
    Heart,
    Layers,
    Loader2,
    Save,
    Sparkles,
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

interface GradeItem {
    id: number;
    grade_number: number;
    name: string;
    phase_id?: number;
}

interface ProviderItem {
    key: string;
    name: string;
    model?: string;
    is_configured: boolean;
    is_default?: boolean;
}

interface CpSearchResult {
    id: number;
    code?: string;
    curriculum_code?: string;
    curriculum_name?: string;
    element_name: string;
    outcome_text?: string;
    cp_text?: string;
    regulation?: string;
    source_policy?: string;
    source_locator?: string;
}

interface CandidateTp {
    code: string;
    bloom_level: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
    competency_kko: string;
    material_content: string;
    pedagogical_description: string;
    panca_cinta_dimensions?: string[];
    deep_learning_elements?: string[];
    profil_lulusan_dimensions?: string[];
    estimated_hours?: number;
    is_selected?: boolean;
}

interface CurriculumItem {
    code: string;
    name: string;
}

interface Props {
    curricula?: CurriculumItem[];
    subjects: SubjectItem[];
    phases: PhaseItem[];
    grades: GradeItem[];
    providers: ProviderItem[] | Record<string, any>;
}

export default function TpCreate({ curricula = [], subjects, phases, grades }: Props) {
    const [curriculumCode, setCurriculumCode] = useState<string>('');
    const [subjectId, setSubjectId] = useState<string>('');
    const [phaseId, setPhaseId] = useState<string>('');
    const [gradeId, setGradeId] = useState<string>('');
    const [targetCount, setTargetCount] = useState<number>(3);
    const [teacherNotes, setTeacherNotes] = useState<string>('');

    // CP search state
    const [isLoadingCp, setIsLoadingCp] = useState<boolean>(false);
    const [availableCps, setAvailableCps] = useState<CpSearchResult[]>([]);
    const [selectedCpId, setSelectedCpId] = useState<number | null>(null);

    // AI Generation state
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [candidateGoals, setCandidateGoals] = useState<CandidateTp[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Load CP automatically when subject, phase, or curriculum are picked
    const loadCp = async (subId: string, phId: string, currCode: string = curriculumCode) => {
        setSubjectId(subId);
        setPhaseId(phId);
        setCurriculumCode(currCode);
        setSelectedCpId(null);
        setCandidateGoals([]);
        setErrorMsg(null);

        if (subId && phId) {
            setIsLoadingCp(true);
            try {
                const params: Record<string, string> = {
                    subject_id: subId,
                    phase_id: phId,
                };
                if (currCode) {
                    params.curriculum_code = currCode;
                }

                const res = await axios.get(route('api.curriculum.cp.search'), { params });
                const items = res.data.data || [];
                setAvailableCps(items);
                if (items.length > 0) {
                    setSelectedCpId(items[0].id);
                }
            } catch (err) {
                console.error(err);
                setErrorMsg('Gagal memuat Capaian Pembelajaran resmi.');
            } finally {
                setIsLoadingCp(false);
            }
        } else {
            setAvailableCps([]);
        }
    };

    const handleGenerate = async () => {
        if (!selectedCpId) {
            setErrorMsg('Pilih Capaian Pembelajaran (CP) resmi terlebih dahulu.');
            return;
        }

        setIsGenerating(true);
        setErrorMsg(null);

        try {
            const res = await axios.post(route('curriculum.tp.generate'), {
                learning_outcome_id: selectedCpId,
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId || null,
                target_count: targetCount,
                provider: null,
                additional_context: teacherNotes || null,
            });

            if (res.data.success && Array.isArray(res.data.learning_goals)) {
                const goalsWithSelection = res.data.learning_goals.map((g: any) => ({
                    ...g,
                    is_selected: true,
                }));
                setCandidateGoals(goalsWithSelection);
            } else {
                setErrorMsg('Format hasil dari AI tidak sesuai. Silakan coba generate kembali.');
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat menghubungi layanan AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleSelectGoal = (index: number) => {
        setCandidateGoals((prev) =>
            prev.map((g, idx) => (idx === index ? { ...g, is_selected: !g.is_selected } : g))
        );
    };

    const updateGoalField = (index: number, field: keyof CandidateTp, value: any) => {
        setCandidateGoals((prev) =>
            prev.map((g, idx) => (idx === index ? { ...g, [field]: value } : g))
        );
    };

    const handleSaveAllSelected = () => {
        const selected = candidateGoals.filter((g) => g.is_selected);
        if (selected.length === 0) {
            alert('Pilih minimal satu Tujuan Pembelajaran (TP) untuk disimpan.');
            return;
        }

        setIsSaving(true);
        router.post(
            route('curriculum.tp.store'),
            {
                learning_outcome_id: selectedCpId as any,
                subject_id: subjectId as any,
                phase_id: phaseId as any,
                grade_id: (gradeId || null) as any,
                goals: selected as any,
            },
            {
                onFinish: () => setIsSaving(false),
            }
        );
    };

    const selectedCp = availableCps.find((c) => c.id === selectedCpId);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <Link href={route('curriculum.tp.index')} className="flex items-center gap-1 hover:underline">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Bank TP
                            </Link>
                            <span>/</span>
                            <span>AI Generator</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Perumusan TP Berbasis Cinta & Bloom
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Bedah naskah Capaian Pembelajaran resmi menjadi rangkaian TP terukur dengan dukungan 4 penyedia AI pilihan.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Generate TP - EduGen KBC" />

            <AiGeneratingModal
                isOpen={isGenerating}
                title="Sedang Merumuskan Tujuan Pembelajaran..."
                subtitle="AI sedang menganalisis naskah Capaian Pembelajaran dan menyelaraskan indikator Bloom & Panca Cinta."
                providerName="EduGen Smart Engine"
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Step 1: Parameters Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                            1
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Tentukan Sasaran & Rujukan Kurikulum
                            </h2>
                            <p className="text-[11px] text-slate-500">
                                Sistem akan otomatis mengunci Capaian Pembelajaran resmi terverifikasi dari regulasi Kemenag/Kemendikbud.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kerangka Kurikulum
                            </label>
                            <select
                                value={curriculumCode}
                                onChange={(e) => loadCp(subjectId, phaseId, e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Semua Regulasi (Otomatis) --</option>
                                {curricula.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Mata Pelajaran *
                            </label>
                            <select
                                value={subjectId}
                                onChange={(e) => loadCp(e.target.value, phaseId, curriculumCode)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Pilih Mata Pelajaran --</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Fase Kurikulum *
                            </label>
                            <select
                                value={phaseId}
                                onChange={(e) => loadCp(subjectId, e.target.value, curriculumCode)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Pilih Fase --</option>
                                {phases.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Tingkat Kelas (Opsional)
                            </label>
                            <select
                                value={gradeId}
                                onChange={(e) => setGradeId(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Seluruh Kelas di Fase Ini --</option>
                                {grades.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        Kelas {g.grade_number} ({g.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Official CP Selection */}
                    {isLoadingCp ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                            Memuat Capaian Pembelajaran resmi dari database master regulasi...
                        </div>
                    ) : availableCps.length > 0 ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Elemen Capaian Pembelajaran (CP) Resmi:
                                </label>
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                    Ditemukan {availableCps.length} Elemen CP Terverifikasi
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {availableCps.map((cp) => (
                                    <div
                                        key={cp.id}
                                        onClick={() => setSelectedCpId(cp.id)}
                                        className={`p-3.5 rounded-xl border cursor-pointer transition ${
                                            selectedCpId === cp.id
                                                ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                {cp.element_name}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {cp.curriculum_name && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                                                        {cp.curriculum_name}
                                                    </span>
                                                )}
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                                                    {cp.regulation || cp.source_locator}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                            "{cp.outcome_text || cp.cp_text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : subjectId && phaseId ? (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                Belum ada naskah Capaian Pembelajaran (CP) terpublikasi resmi untuk kombinasi mata pelajaran dan fase ini.
                                Administrator sistem perlu mengunggah atau mempublikasikan master CP terlebih dahulu.
                            </div>
                        </div>
                    ) : null}

                    {/* Opsi Rumusan TP */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Target Jumlah Rumusan TP
                            </label>
                            <select
                                value={targetCount}
                                onChange={(e) => setTargetCount(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={2}>2 Rumusan TP</option>
                                <option value={3}>3 Rumusan TP (Rekomendasi)</option>
                                <option value={4}>4 Rumusan TP</option>
                                <option value={5}>5 Rumusan TP</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Catatan Khusus Guru (Opsional)
                            </label>
                            <input
                                type="text"
                                value={teacherNotes}
                                onChange={(e) => setTeacherNotes(e.target.value)}
                                placeholder="Contoh: Fokus pada pemanfaatan kearifan lokal..."
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                            {errorMsg}
                        </div>
                    )}

                    {/* Generate Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedCpId}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sedang Merumuskan TP Berbasis KBC...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate TP dengan AI
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Step 2: Candidates Review */}
                {candidateGoals.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    2
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Hasil Generasi Tujuan Pembelajaran
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Periksa rumusan TP, sesuaikan kata kerja operasional, lalu pilih TP yang akan disimpan ke Bank Kurikulum.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveAllSelected}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Simpan TP Terpilih ke Bank Kurikulum'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {candidateGoals.map((goal, index) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl border p-5 transition space-y-3 ${
                                        goal.is_selected
                                            ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10'
                                            : 'border-slate-200 dark:border-slate-800 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={goal.is_selected}
                                                onChange={() => toggleSelectGoal(index)}
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {goal.code}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={goal.bloom_level}
                                                onChange={(e) =>
                                                    updateGoalField(index, 'bloom_level', e.target.value as any)
                                                }
                                                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200"
                                            >
                                                <option value="C1">Bloom C1 (Mengingat)</option>
                                                <option value="C2">Bloom C2 (Memahami)</option>
                                                <option value="C3">Bloom C3 (Menerapkan)</option>
                                                <option value="C4">Bloom C4 (Menganalisis)</option>
                                                <option value="C5">Bloom C5 (Mengevaluasi)</option>
                                                <option value="C6">Bloom C6 (Mencipta)</option>
                                            </select>

                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <span>Alokasi:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={goal.estimated_hours || 2}
                                                    onChange={(e) =>
                                                        updateGoalField(index, 'estimated_hours', Number(e.target.value))
                                                    }
                                                    className="w-14 px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                                                />
                                                <span>JP</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description and Material */}
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                                Rumusan Tujuan Pembelajaran (Dapat Diedit):
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={goal.pedagogical_description}
                                                onChange={(e) =>
                                                    updateGoalField(index, 'pedagogical_description', e.target.value)
                                                }
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 leading-relaxed"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                                    Kompetensi / KKO:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={goal.competency_kko}
                                                    onChange={(e) =>
                                                        updateGoalField(index, 'competency_kko', e.target.value)
                                                    }
                                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                                    Ruang Lingkup Materi:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={goal.material_content}
                                                    onChange={(e) =>
                                                        updateGoalField(index, 'material_content', e.target.value)
                                                    }
                                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags Preview */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 text-[10px]">
                                        {goal.panca_cinta_dimensions?.map((dim, dIdx) => (
                                            <span
                                                key={dIdx}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                                            >
                                                <Heart className="w-2.5 h-2.5" />
                                                {dim}
                                            </span>
                                        ))}

                                        {goal.deep_learning_elements?.map((elem, eIdx) => (
                                            <span
                                                key={eIdx}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900"
                                            >
                                                <Sparkles className="w-2.5 h-2.5" />
                                                {elem}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleSaveAllSelected}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Simpan TP Terpilih ke Bank Kurikulum'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
