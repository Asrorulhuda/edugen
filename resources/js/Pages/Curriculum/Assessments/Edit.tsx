import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuestionEditorItem, { GoalOption } from '@/Components/Curriculum/Assessments/QuestionEditorItem';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Clock,
    FileQuestion,
    Plus,
    Save,
} from 'lucide-react';

import { useAssessmentEditor } from './hooks/useAssessmentEditor';

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

interface SemesterItem {
    id: number;
    name: string;
    semester_type: string;
    is_active: boolean;
}

interface AcademicYearItem {
    id: number;
    year_name: string;
    is_active: boolean;
    semesters: SemesterItem[];
}

interface QuestionDbItem {
    id: number;
    question_number: number;
    question_type: string;
    stimulus_text?: string | null;
    image_prompt?: string | null;
    image_path?: string | null;
    question_text: string;
    options_data?: Record<string, string> | null;
    correct_answer?: string | null;
    explanation?: string | null;
    score_weight: number;
    matrix?: {
        id: number;
        learning_goal_id?: number | null;
        indicator_text: string;
        bloom_level: string;
        cognitive_tier: string;
        difficulty_level: string;
    } | null;
}

interface AssessmentPackageDetail {
    id: number;
    title: string;
    assessment_type: string;
    curriculum_code: 'MERDEKA' | 'MADRASAH_KBC';
    total_questions: number;
    duration_minutes: number;
    instructions?: string | null;
    status: 'DRAFT' | 'FINAL';
    subject_id: number;
    phase_id: number;
    grade_id: number;
    academic_year_id?: number | null;
    semester_id?: number | null;
    subject: SubjectItem;
    phase: PhaseItem;
    grade: GradeItem;
    questions: QuestionDbItem[];
}

interface Props {
    package: AssessmentPackageDetail;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    grades: GradeItem[];
    academicYears: AcademicYearItem[];
    learningGoals: GoalOption[];
}

export default function AssessmentEdit({
    package: pkg,
    subjects,
    phases,
    grades,
    academicYears,
    learningGoals,
}: Props) {
    const editor = useAssessmentEditor(pkg, learningGoals);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.assessments.show', pkg.id)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Edit Paket Asesmen
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {pkg.subject.name} • Kelas {pkg.grade.grade_number}
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                                {editor.title || pkg.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => editor.handleSubmit()}
                            disabled={editor.isSubmitting}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        >
                            <Save className="w-4 h-4" />
                            {editor.isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Asesmen: ${pkg.title} - EduGen`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-24">
                {editor.submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{editor.submitError}</span>
                    </div>
                )}

                {/* Section 1: Informasi Paket Asesmen */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileQuestion className="w-4 h-4 text-emerald-600" />
                        Identitas & Pengaturan Naskah Ujian
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Judul Naskah Soal <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editor.title}
                                onChange={(e) => editor.setTitle(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Status Publikasi
                            </label>
                            <select
                                value={editor.status}
                                onChange={(e) => editor.setStatus(e.target.value as 'DRAFT' | 'FINAL')}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-bold"
                            >
                                <option value="FINAL">FINAL (Siap Cetak & Diujikan)</option>
                                <option value="DRAFT">DRAFT (Masih Direvisi)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Tipe Asesmen
                            </label>
                            <select
                                value={editor.assessmentType}
                                onChange={(e) => editor.setAssessmentType(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="SUMATIF_LINGKUP_MATERI">Sumatif Lingkup Materi</option>
                                <option value="FORMATIF">Formatif</option>
                                <option value="SUMATIF_AKHIR_SEMESTER">Sumatif Akhir Semester</option>
                                <option value="SUMATIF_AKHIR_FASE">Sumatif Akhir Fase</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Alokasi Waktu (Menit)
                            </label>
                            <input
                                type="number"
                                min={10}
                                max={360}
                                value={editor.durationMinutes}
                                onChange={(e) => editor.setDurationMinutes(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Total Butir Soal
                            </label>
                            <div className="px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                {editor.items.length} Butir Soal ({editor.items.filter(i => i.question_type === 'PG').length} PG, {editor.items.filter(i => i.question_type !== 'PG').length} Uraian)
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Petunjuk Pengerjaan Soal (Untuk Siswa)
                        </label>
                        <textarea
                            rows={2}
                            value={editor.instructions}
                            onChange={(e) => editor.setInstructions(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            placeholder="Contoh: 1. Berdoalah sebelum mengerjakan. 2. Teliti kembali sebelum dikumpulkan."
                        />
                    </div>
                </div>

                {/* Section 2: Editor Butir-butir Soal */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Daftar Butir Soal ({editor.items.length} Soal)
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Edit pertanyaan pokok soal, opsi pilihan ganda, kunci jawaban, dan pembahasan.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => editor.addNewQuestion('PG')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Soal PG
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.addNewQuestion('URAIAN')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Soal Uraian
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {editor.items.map((item, index) => (
                            <QuestionEditorItem
                                key={`edit-item-${item.question_number}-${index}`}
                                item={item}
                                index={index}
                                totalItems={editor.items.length}
                                learningGoals={learningGoals}
                                onUpdateField={(field, val) => editor.updateItemField(index, field, val)}
                                onUpdateOption={(key, val) => editor.updateItemOption(index, key, val)}
                                onAddOption={() => editor.addOptionToItem(index)}
                                onRemoveOption={(key) => editor.removeOptionFromItem(index, key)}
                                onRemoveItem={() => editor.removeQuestion(index)}
                                onMoveUp={() => editor.moveItem(index, 'up')}
                                onMoveDown={() => editor.moveItem(index, 'down')}
                                onUploadImage={(file) => editor.handleUploadImage(file, index)}
                                isUploadingImage={editor.uploadingIndex === index}
                            />
                        ))}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="sticky bottom-6 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => editor.addNewQuestion('PG')}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Butir PG
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.addNewQuestion('URAIAN')}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Butir Uraian
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route('curriculum.assessments.show', pkg.id)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            >
                                Batal
                            </Link>
                            <button
                                type="button"
                                onClick={() => editor.handleSubmit()}
                                disabled={editor.isSubmitting}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition"
                            >
                                <Save className="w-4 h-4" />
                                {editor.isSubmitting ? 'Menyimpan...' : 'Simpan Seluruh Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
