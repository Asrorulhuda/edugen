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
    FileSpreadsheet,
    Lightbulb,
    Loader2,
    Plus,
    Save,
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

interface GradeItem {
    id: number;
    grade_number: number;
    name: string;
    phase_id: number;
}

interface ProviderStatus {
    key: string;
    name: string;
    model?: string;
    is_configured?: boolean;
    is_default?: boolean;
    status?: 'ACTIVE' | 'MOCK_FALLBACK' | 'ERROR';
    is_mock?: boolean;
}

interface DimensionItem {
    name: string;
    aspect: string;
    descriptors: {
        perlu_bimbingan: string;
        cukup: string;
        baik: string;
        sangat_baik: string;
    };
}

interface GeneratedRubricData {
    title: string;
    rubric_type: string;
    description: string;
    scoring_guidelines: string;
    dimensions: DimensionItem[];
}

interface Props {
    subjects: SubjectItem[];
    phases: PhaseItem[];
    grades: GradeItem[];
    providers: ProviderStatus[] | Record<string, any>;
}

export default function RubricCreate({
    subjects,
    phases,
    grades,
}: Props) {
    const [subjectId, setSubjectId] = useState<number | ''>('');
    const [phaseId, setPhaseId] = useState<number | ''>('');
    const [gradeId, setGradeId] = useState<number | ''>('');
    const [title, setTitle] = useState('');
    const [rubricType, setRubricType] = useState('SIKAP_PANCA_CINTA');
    const [context, setContext] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatedData, setGeneratedData] = useState<GeneratedRubricData | null>(null);

    const filteredGrades = grades.filter((g) => phaseId === '' || g.phase_id === Number(phaseId));

    const handleGenerate = async () => {
        if (!subjectId || !phaseId) {
            alert('Mohon pilih Mata Pelajaran dan Fase terlebih dahulu.');
            return;
        }

        if (!title.trim()) {
            alert('Mohon masukkan Judul Rubrik.');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);

        try {
            const res = await axios.post(route('curriculum.rubrics.generate'), {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId || null,
                title: title,
                rubric_type: rubricType,
                context: context || null,
                provider: null,
            });

            if (res.data.success && res.data.rubric_data) {
                setGeneratedData(res.data.rubric_data);
            } else {
                setGenerationError('Gagal menerima rancangan rubrik dari AI provider.');
            }
        } catch (err: any) {
            console.error('Generation failed:', err);
            setGenerationError(
                err.response?.data?.message || 'Terjadi kesalahan saat berkomunikasi dengan AI provider.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedData || !generatedData.dimensions || generatedData.dimensions.length === 0) {
            alert('Belum ada dimensi rubrik yang dirancang.');
            return;
        }

        const payload = {
            subject_id: subjectId,
            phase_id: phaseId,
            grade_id: gradeId || null,
            title: generatedData.title || title,
            rubric_type: rubricType,
            description: generatedData.description,
            dimensions_data: generatedData.dimensions as any,
            scoring_guidelines: generatedData.scoring_guidelines,
        };

        router.post(route('curriculum.rubrics.store'), payload as any);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.rubrics.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                                Authentic Character Assessment
                            </span>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                Generator Rubrik Penilaian KBC
                            </h1>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Rancang Rubrik Penilaian - EduGen" />

            <AiGeneratingModal
                isOpen={isGenerating}
                title="Sedang Merumuskan Rubrik Penilaian..."
                subtitle="AI sedang merancang kriteria penilaian autentik, gradasi level deskriptor, dan panduan penskoran."
                providerName="EduGen Smart Engine"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
                {/* Form Input */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                            1
                        </span>
                        Identitas & Karakteristik Rubrik
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                Mata Pelajaran <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(Number(e.target.value) || '')}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                Fase Kurikulum <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={phaseId}
                                onChange={(e) => {
                                    setPhaseId(Number(e.target.value) || '');
                                    setGradeId('');
                                }}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                Rombel / Kelas (Opsional)
                            </label>
                            <select
                                value={gradeId}
                                onChange={(e) => setGradeId(Number(e.target.value) || '')}
                                disabled={!phaseId}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                <option value="">-- Semua Kelas di Fase Ini --</option>
                                {filteredGrades.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        Kelas {g.grade_number} ({g.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Tipe Instrumen Rubrik <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={rubricType}
                            onChange={(e) => setRubricType(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="SIKAP_PANCA_CINTA">Sikap Panca Cinta (Spiritual, Sosial, Lingkungan, Bangsa)</option>
                            <option value="KINERJA_UNJUK_KERJA">Kinerja / Unjuk Kerja Praktik</option>
                            <option value="PROYEK_KOLABORATIF">Proyek Kolaboratif & Gotong Royong</option>
                            <option value="PORTOFOLIO_REFLEKTIF">Portofolio Reflektif & Jurnal Diri</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Judul Rubrik <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Rubrik Observasi Sikap Panca Cinta: Meneladani Empati & Integritas"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Konteks Pembelajaran / Kegiatan Siswa (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Contoh: Digunakan saat aktivitas kerja kelompok proyek kampanye cinta kebersihan dan kepedulian sosial"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Rubrik disusun dengan 4 skala deskriptif: Perlu Bimbingan (1), Cukup (2), Baik (3), Sangat Baik (4).</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating || !subjectId || !phaseId || !title.trim()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Menyusun Rubrik Observasi...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Hasilkan Rubrik KBC (AI)
                                </>
                            )}
                        </button>
                    </div>

                    {generationError && (
                        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{generationError}</span>
                        </div>
                    )}
                </div>

                {/* Preview and Save */}
                {generatedData && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                    Hasil Telaah AI
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {generatedData.title}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {generatedData.dimensions.length} dimensi karakter/aspek siap disimpan ke lembar observasi resmi.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Rubrik Penilaian
                            </button>
                        </div>

                        {/* Description & Scoring Guidelines */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 text-xs">
                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Deskripsi Instrumen:
                                </span>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {generatedData.description}
                                </p>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Pedoman Konversi Nilai & Penskoran:
                                </span>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                                    {generatedData.scoring_guidelines}
                                </p>
                            </div>
                        </div>

                        {/* Dimensions Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                            <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-1/4">
                                                Dimensi / Aspek
                                            </th>
                                            <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-1/5 text-rose-700 dark:text-rose-400">
                                                Perlu Bimbingan (1)
                                            </th>
                                            <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-1/5 text-amber-700 dark:text-amber-400">
                                                Cukup (2)
                                            </th>
                                            <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-1/5 text-blue-700 dark:text-blue-400">
                                                Baik (3)
                                            </th>
                                            <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-1/5 text-emerald-700 dark:text-emerald-400">
                                                Sangat Baik (4)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {generatedData.dimensions.map((dim, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                                <td className="p-3 align-top">
                                                    <strong className="text-slate-900 dark:text-white block font-semibold mb-1">
                                                        {dim.name}
                                                    </strong>
                                                    <span className="text-[11px] text-slate-500 block">
                                                        Fokus: {dim.aspect}
                                                    </span>
                                                </td>
                                                <td className="p-3 align-top text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-rose-50/20 dark:bg-rose-950/10">
                                                    {dim.descriptors?.perlu_bimbingan}
                                                </td>
                                                <td className="p-3 align-top text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-amber-50/20 dark:bg-amber-950/10">
                                                    {dim.descriptors?.cukup}
                                                </td>
                                                <td className="p-3 align-top text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-blue-50/20 dark:bg-blue-950/10">
                                                    {dim.descriptors?.baik}
                                                </td>
                                                <td className="p-3 align-top text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-emerald-50/20 dark:bg-emerald-950/10 font-medium">
                                                    {dim.descriptors?.sangat_baik}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
