import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AiGeneratingModal from '@/Components/Curriculum/AiGeneratingModal';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Layers,
    Loader2,
    Route as RouteIcon,
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

interface AcademicYearItem {
    id: number;
    year_name: string;
    is_active: boolean;
}

interface ProviderItem {
    key: string;
    name: string;
    model?: string;
    is_configured: boolean;
    is_default?: boolean;
}

interface AvailableGoal {
    id: number;
    code: string;
    bloom_level: string;
    competency_kko: string;
    material_content: string;
    pedagogical_description: string;
    estimated_hours: number;
}

interface Props {
    subjects: SubjectItem[];
    phases: PhaseItem[];
    grades: GradeItem[];
    academicYears: AcademicYearItem[];
    providers: ProviderItem[] | Record<string, any>;
}

export default function AtpCreate({
    subjects,
    phases,
    grades,
    academicYears,
}: Props) {
    const [subjectId, setSubjectId] = useState<string>('');
    const [phaseId, setPhaseId] = useState<string>('');
    const [gradeId, setGradeId] = useState<string>('');
    const [academicYearId, setAcademicYearId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [rationale, setRationale] = useState<string>('');

    const [availableGoals, setAvailableGoals] = useState<AvailableGoal[]>([]);
    const [selectedGoalIds, setSelectedGoalIds] = useState<number[]>([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState<boolean>(false);

    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [atpData, setAtpData] = useState<any | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleScopeChange = async (subId: string, phId: string, grId: string) => {
        setSubjectId(subId);
        setPhaseId(phId);
        setGradeId(grId);
        setSelectedGoalIds([]);
        setAtpData(null);
        setErrorMsg(null);

        const selSubject = subjects.find((s) => String(s.id) === subId);
        const selGrade = grades.find((g) => String(g.id) === grId);
        if (selSubject && selGrade) {
            setTitle(`Alur Tujuan Pembelajaran (ATP) ${selSubject.name} Kelas ${selGrade.grade_number}`);
        }

        if (subId && phId) {
            setIsLoadingGoals(true);
            try {
                const res = await axios.get(route('curriculum.modules.api.goals'), {
                    params: { subject_id: subId, phase_id: phId, grade_id: grId || undefined },
                });
                if (res.data.success) {
                    setAvailableGoals(res.data.goals);
                    setSelectedGoalIds(res.data.goals.map((g: AvailableGoal) => g.id));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingGoals(false);
            }
        } else {
            setAvailableGoals([]);
        }
    };

    const toggleGoalSelection = (id: number) => {
        if (selectedGoalIds.includes(id)) {
            setSelectedGoalIds(selectedGoalIds.filter((gId) => gId !== id));
        } else {
            setSelectedGoalIds([...selectedGoalIds, id]);
        }
    };

    const selectAllGoals = () => {
        if (selectedGoalIds.length === availableGoals.length) {
            setSelectedGoalIds([]);
        } else {
            setSelectedGoalIds(availableGoals.map((g) => g.id));
        }
    };

    const handleGenerate = async () => {
        if (!subjectId || !phaseId || !gradeId) {
            setErrorMsg('Pilih mata pelajaran, fase, dan kelas terlebih dahulu.');
            return;
        }

        if (selectedGoalIds.length === 0) {
            setErrorMsg('Pilih minimal 1 Tujuan Pembelajaran (TP) untuk dialurkan.');
            return;
        }

        setIsGenerating(true);
        setErrorMsg(null);

        try {
            const res = await axios.post(route('curriculum.atp.generate'), {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId,
                goal_ids: selectedGoalIds,
                rationale: rationale || null,
                provider: null,
            });

            if (res.data.success && res.data.atp_data) {
                setAtpData(res.data.atp_data);
            } else {
                setErrorMsg('Gagal menyusun ATP. Silakan coba kembali.');
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat memproses generasi ATP.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!atpData || !atpData.alur) return;

        setIsSaving(true);
        router.post(
            route('curriculum.atp.store'),
            {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId,
                academic_year_id: academicYearId || null,
                title: title || 'Alur Tujuan Pembelajaran (ATP)',
                rationale: atpData.rasional || rationale,
                total_hours_allocated: atpData.total_jp || atpData.alur.reduce((sum: number, item: any) => sum + (Number(item.alokasi_jp) || 2), 0),
                sequence_data: atpData.alur,
                status: 'FINAL',
            } as any,
            {
                onFinish: () => setIsSaving(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <Link href={route('curriculum.atp.index')} className="flex items-center gap-1 hover:underline">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Alur Tujuan (ATP)
                            </Link>
                            <span>/</span>
                            <span>AI Generator</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Penyusunan Alur Tujuan Pembelajaran (ATP)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Menata urutan logis TP dari Semester Ganjil hingga Genap dengan alokasi JP dan indikator ketercapaian.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Susun ATP Baru - EduGen KBC" />

            <AiGeneratingModal
                isOpen={isGenerating}
                title="Menyusun Alur Tujuan Pembelajaran (ATP)..."
                subtitle="AI sedang memetakan kronologi capaian materi per semester, alokasi jam pelajaran, dan indikator ketercapaian."
                providerName="EduGen Smart Engine"
            />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Step 1: Parameter & TP Selection */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                            1
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Parameter Identitas ATP & Sumber TP
                            </h2>
                            <p className="text-[11px] text-slate-500">
                                Pilih mata pelajaran, fase, dan kelas untuk memuat daftar Tujuan Pembelajaran yang akan dialurkan.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Mata Pelajaran *
                            </label>
                            <select
                                value={subjectId}
                                onChange={(e) => handleScopeChange(e.target.value, phaseId, gradeId)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Pilih Mapel --</option>
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
                                onChange={(e) => handleScopeChange(subjectId, e.target.value, gradeId)}
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
                                Kelas Sasaran *
                            </label>
                            <select
                                value={gradeId}
                                onChange={(e) => handleScopeChange(subjectId, phaseId, e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {grades.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        Kelas {g.grade_number} ({g.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Tahun Pelajaran
                            </label>
                            <select
                                value={academicYearId}
                                onChange={(e) => setAcademicYearId(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">-- Default Aktif --</option>
                                {academicYears.map((ay) => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.year_name} {ay.is_active ? '(Aktif)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Judul Dokumen ATP *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Alur Tujuan Pembelajaran (ATP) Bahasa Indonesia Fase D Kelas 7"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* TP Selection Section */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Pilih Tujuan Pembelajaran (TP) yang akan dimasukkan ke dalam Alur ({selectedGoalIds.length} dari {availableGoals.length} dipilih) *
                            </label>
                            {availableGoals.length > 0 && (
                                <button
                                    type="button"
                                    onClick={selectAllGoals}
                                    className="text-xs text-emerald-600 font-bold hover:underline"
                                >
                                    {selectedGoalIds.length === availableGoals.length ? 'Batal Pilih Semua' : 'Pilih Semua TP'}
                                </button>
                            )}
                        </div>

                        {isLoadingGoals ? (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                Mengambil daftar Tujuan Pembelajaran dari Bank TP...
                            </div>
                        ) : availableGoals.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {availableGoals.map((goal) => {
                                    const isSelected = selectedGoalIds.includes(goal.id);
                                    return (
                                        <div
                                            key={goal.id}
                                            onClick={() => toggleGoalSelection(goal.id)}
                                            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                                                isSelected
                                                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <div className="flex-1 text-xs">
                                                <div className="flex items-center gap-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                                                    <span>{goal.code}</span>
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-sans font-semibold">
                                                        Bloom {goal.bloom_level} • {goal.estimated_hours} JP
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                                    {goal.pedagogical_description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : subjectId && phaseId ? (
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    Belum ada Tujuan Pembelajaran tersimpan untuk mata pelajaran dan fase ini.{' '}
                                    <Link href={route('curriculum.tp.create')} className="font-bold underline" target="_blank">
                                        Buat TP terlebih dahulu di Bank TP
                                    </Link>.
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* AI Provider & Notes */}
                    {/* Catatan / Rasional Khusus Guru */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Catatan / Rasional Khusus Guru (Opsional)
                        </label>
                        <input
                            type="text"
                            value={rationale}
                            onChange={(e) => setRationale(e.target.value)}
                            placeholder="Contoh: Dahulukan materi literasi dasar di Semester Ganjil..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                            {errorMsg}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating || selectedGoalIds.length === 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isGenerating ? 'Sedang Menyusun ATP...' : 'Susun Alur Tujuan Pembelajaran dengan AI'}
                        </button>
                    </div>
                </div>

                {/* Step 2: Live Generated Preview Table */}
                {atpData && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    2
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Hasil Alur Tujuan Pembelajaran (ATP) Terurut
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Periksa urutan kronologis, pembagian semester, dan alokasi jam sebelum disimpan.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan Dokumen...' : 'Simpan Dokumen ATP'}
                            </button>
                        </div>

                        {atpData.rasional && (
                            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                                <p className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                                    Rasional Alur Pembelajaran:
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {atpData.rasional}
                                </p>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold">
                                    <tr>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-12">No</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700 w-20">Semester</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700 w-24">Kode TP</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700">Tujuan Pembelajaran</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700 w-32">Materi Pokok</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-16">JP</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700">Indikator Ketercapaian</th>
                                        <th className="p-2 border border-slate-200 dark:border-slate-700">Profil & Panca Cinta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {atpData.alur?.map((item: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-bold">
                                                {item.nomor_urut || idx + 1}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700">
                                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                                    String(item.semester).toLowerCase().includes('ganjil')
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                }`}>
                                                    {item.semester || 'Ganjil'}
                                                </span>
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono font-bold text-emerald-600">
                                                {item.tp_code}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 leading-relaxed">
                                                {item.deskripsi_tp}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">
                                                {item.materi_pokok}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-bold">
                                                {item.alokasi_jp}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 leading-relaxed">
                                                {item.indikator_ketercapaian}
                                            </td>
                                            <td className="p-2 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                                                {item.dimensi_profil}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan Dokumen...' : 'Simpan Dokumen ATP Sekarang'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
