import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AiGeneratingModal from '@/Components/Curriculum/AiGeneratingModal';
import { AssessmentItemData } from '@/Components/Curriculum/Assessments/QuestionEditorItem';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateAssessmentForm from './Components/CreateAssessmentForm';
import CreateAssessmentReview from './Components/CreateAssessmentReview';
import { AcademicYearItem, GoalItem, GradeItem, PhaseItem, SubjectItem } from './types';

interface GeneratedPackageData {
    title: string;
    instructions: string;
    duration_minutes: number;
    items: AssessmentItemData[];
}

interface Props {
    subjects: SubjectItem[];
    phases: PhaseItem[];
    grades: GradeItem[];
    academicYears: AcademicYearItem[];
    providers: any;
}

export default function AssessmentCreate({
    subjects,
    phases,
    grades,
    academicYears,
}: Props) {
    const { auth } = usePage().props as any;
    const aiQuota = auth?.current_tenant?.ai_quota;

    const [subjectId, setSubjectId] = useState<number | ''>('');
    const [phaseId, setPhaseId] = useState<number | ''>('');
    const [gradeId, setGradeId] = useState<number | ''>('');
    const [academicYearId, setAcademicYearId] = useState<number | ''>('');
    const [semesterId, setSemesterId] = useState<number | ''>('');

    const [assessmentType, setAssessmentType] = useState<string>('SUMATIF_LINGKUP_MATERI');
    const [curriculumCode, setCurriculumCode] = useState<'MERDEKA' | 'MADRASAH_KBC'>('MADRASAH_KBC');
    const [title, setTitle] = useState('');
    const [durationMinutes, setDurationMinutes] = useState<number>(90);
    const [instructions, setInstructions] = useState<string>('');
    const [teacherPreferences, setTeacherPreferences] = useState<string>('');

    const [jmlPg, setJmlPg] = useState<number>(5);
    const [jmlEssay, setJmlEssay] = useState<number>(0);
    const [opsiPg, setOpsiPg] = useState<number>(4);
    const [tingkat, setTingkat] = useState<string>('Campuran');
    const [berpikir, setBerpikir] = useState<string>('Campuran');
    const [imageCount, setImageCount] = useState<number>(0);

    const [availableGoals, setAvailableGoals] = useState<GoalItem[]>([]);
    const [selectedGoalIds, setSelectedGoalIds] = useState<number[]>([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatedData, setGeneratedData] = useState<GeneratedPackageData | null>(null);
    const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

    const filteredGrades = phaseId
        ? grades.filter((g) => g.phase_id === phaseId)
        : grades;

    useEffect(() => {
        if (subjectId && phaseId) {
            setIsLoadingGoals(true);
            axios
                .get(route('curriculum.modules.api.goals'), {
                    params: { subject_id: subjectId, phase_id: phaseId, grade_id: gradeId || undefined },
                })
                .then((res) => {
                    if (res.data.success && Array.isArray(res.data.goals)) {
                        const validList = res.data.goals.filter(
                            (g: any) => g.code && g.pedagogical_description
                        );
                        setAvailableGoals(validList);
                        setSelectedGoalIds(validList.map((g: GoalItem) => g.id));
                    }
                })
                .catch((err) => {
                    console.error('Failed to load goals:', err);
                    setAvailableGoals([]);
                    setSelectedGoalIds([]);
                })
                .finally(() => setIsLoadingGoals(false));
        } else {
            setAvailableGoals([]);
            setSelectedGoalIds([]);
        }
    }, [subjectId, phaseId, gradeId]);

    const handleSelectAllGoals = () => {
        if (selectedGoalIds.length === availableGoals.length) {
            setSelectedGoalIds([]);
        } else {
            setSelectedGoalIds(availableGoals.map((g) => g.id));
        }
    };

    const handleToggleGoal = (id: number) => {
        setSelectedGoalIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleGenerate = async () => {
        if (!subjectId || !phaseId || !gradeId) {
            alert('Harap pilih Mata Pelajaran, Fase, dan Kelas terlebih dahulu.');
            return;
        }
        if (selectedGoalIds.length === 0) {
            alert('Pilih minimal 1 Tujuan Pembelajaran (TP) sebagai acuan kisi-kisi.');
            return;
        }
        if (!title.trim()) {
            alert('Harap masukkan Judul Paket Asesmen / Nama Ujian.');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);

        try {
            const res = await axios.post(route('curriculum.assessments.generate'), {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId,
                title: title.trim(),
                assessment_type: assessmentType,
                learning_goal_ids: selectedGoalIds,
                jml_pg: jmlPg,
                jml_essay: jmlEssay,
                opsi_pg: opsiPg,
                tingkat,
                berpikir,
                image_count: imageCount,
                total_questions: jmlPg + jmlEssay,
                duration_minutes: durationMinutes,
                teacher_preferences: teacherPreferences,
                curriculum_code: curriculumCode,
            });

            if (res.data.success && res.data.assessment_data) {
                const pkg = res.data.assessment_data;
                setGeneratedData(pkg);
                if (pkg.duration_minutes) setDurationMinutes(pkg.duration_minutes);
                if (pkg.instructions) setInstructions(pkg.instructions);
            } else {
                setGenerationError('Gagal menerima rancangan paket dari AI engine.');
            }
        } catch (err: any) {
            setGenerationError(err.response?.data?.message || 'Terjadi kesalahan saat memproses soal AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = (status: 'DRAFT' | 'FINAL') => {
        if (!generatedData || !generatedData.items || generatedData.items.length === 0) {
            alert('Belum ada butir soal yang dirancang.');
            return;
        }

        const payload = {
            subject_id: subjectId,
            phase_id: phaseId,
            grade_id: gradeId,
            academic_year_id: academicYearId || null,
            semester_id: semesterId || null,
            title: generatedData.title || title,
            curriculum_code: curriculumCode,
            assessment_type: assessmentType,
            total_questions: generatedData.items.length,
            duration_minutes: durationMinutes,
            instructions,
            settings: { jml_pg: jmlPg, jml_essay: jmlEssay, opsi_pg: opsiPg, tingkat, berpikir, image_count: imageCount },
            status,
            items: generatedData.items as any,
        };

        router.post(route('curriculum.assessments.store'), payload as any, {
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                alert('Gagal menyimpan paket asesmen: ' + (firstError || 'Periksa kembali kelengkapan form.'));
            },
        });
    };

    const updateItem = (index: number, field: any, value: any) => {
        if (!generatedData) return;
        const newItems = [...generatedData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setGeneratedData({ ...generatedData, items: newItems });
    };

    const updateOption = (itemIndex: number, optionKey: string, optionValue: string) => {
        if (!generatedData) return;
        const newItems = [...generatedData.items];
        const currentOptions = { ...(newItems[itemIndex].options_data || {}) };
        currentOptions[optionKey] = optionValue;
        newItems[itemIndex].options_data = currentOptions;
        setGeneratedData({ ...generatedData, items: newItems });
    };

    const addOptionToItem = (itemIndex: number) => {
        if (!generatedData) return;
        const newItems = [...generatedData.items];
        const currentOptions = { ...(newItems[itemIndex].options_data || {}) };
        const keys = ['A', 'B', 'C', 'D', 'E'];
        const nextKey = keys.find((k) => !(k in currentOptions));
        if (nextKey) {
            currentOptions[nextKey] = '';
            newItems[itemIndex].options_data = currentOptions;
            setGeneratedData({ ...generatedData, items: newItems });
        }
    };

    const removeOptionFromItem = (itemIndex: number, optionKey: string) => {
        if (!generatedData) return;
        const newItems = [...generatedData.items];
        const currentOptions = { ...(newItems[itemIndex].options_data || {}) };
        delete currentOptions[optionKey];
        newItems[itemIndex].options_data = currentOptions;
        setGeneratedData({ ...generatedData, items: newItems });
    };

    const removeItem = (index: number) => {
        if (!generatedData) return;
        if (!confirm('Hapus butir soal ini?')) return;
        const newItems = generatedData.items.filter((_, idx) => idx !== index);
        const renumbered = newItems.map((item, idx) => ({
            ...item,
            question_number: idx + 1,
        }));
        setGeneratedData({ ...generatedData, items: renumbered });
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (!generatedData) return;
        const newItems = [...generatedData.items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;

        const renumbered = newItems.map((item, idx) => ({
            ...item,
            question_number: idx + 1,
        }));
        setGeneratedData({ ...generatedData, items: renumbered });
    };

    const handleImageUpload = async (file: File, itemIndex: number) => {
        setUploadingImageIndex(itemIndex);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post(route('curriculum.assessments.upload-image'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.success && res.data.path) {
                updateItem(itemIndex, 'image_path', res.data.path);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal mengunggah gambar stimulus.');
        } finally {
            setUploadingImageIndex(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.assessments.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                    Generator Bank Soal
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    curriculumCode === 'MERDEKA'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                                }`}>
                                    {curriculumCode === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC'}
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                Perumusan Soal Bernarasi & Kisi-kisi Evaluasi
                            </h1>
                        </div>
                    </div>

                    {aiQuota && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs">
                                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Kuota AI</div>
                                    <div className="font-bold">
                                        {aiQuota.remaining === -1 ? 'Tanpa Batas' : `${aiQuota.remaining} Sisa`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`Rancang Bank Soal ${curriculumCode === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC'} - EduGen`} />

            <AiGeneratingModal
                isOpen={isGenerating}
                title="Sedang Merancang Bank Soal Bernarasi & Kisi-kisi HOTS..."
                subtitle="AI sedang merumuskan wacana narasi kontekstual, studi kasus nyata, taksonomi Bloom, kunci jawaban, dan rubrik penskoran."
                providerName="EduGen Smart Engine"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
                <CreateAssessmentForm
                    curriculumCode={curriculumCode}
                    setCurriculumCode={setCurriculumCode}
                    subjectId={subjectId}
                    setSubjectId={setSubjectId}
                    phaseId={phaseId}
                    setPhaseId={setPhaseId}
                    gradeId={gradeId}
                    setGradeId={setGradeId}
                    assessmentType={assessmentType}
                    setAssessmentType={setAssessmentType}
                    title={title}
                    setTitle={setTitle}
                    durationMinutes={durationMinutes}
                    setDurationMinutes={setDurationMinutes}
                    teacherPreferences={teacherPreferences}
                    setTeacherPreferences={setTeacherPreferences}
                    jmlPg={jmlPg}
                    setJmlPg={setJmlPg}
                    jmlEssay={jmlEssay}
                    setJmlEssay={setJmlEssay}
                    opsiPg={opsiPg}
                    setOpsiPg={setOpsiPg}
                    tingkat={tingkat}
                    setTingkat={setTingkat}
                    berpikir={berpikir}
                    setBerpikir={setBerpikir}
                    imageCount={imageCount}
                    setImageCount={setImageCount}
                    subjects={subjects}
                    phases={phases}
                    filteredGrades={filteredGrades}
                    availableGoals={availableGoals}
                    selectedGoalIds={selectedGoalIds}
                    isLoadingGoals={isLoadingGoals}
                    isGenerating={isGenerating}
                    generationError={generationError}
                    handleSelectAllGoals={handleSelectAllGoals}
                    handleToggleGoal={handleToggleGoal}
                    handleGenerate={handleGenerate}
                />

                {generatedData && (
                    <CreateAssessmentReview
                        generatedData={generatedData}
                        instructions={instructions}
                        setInstructions={setInstructions}
                        availableGoals={availableGoals}
                        uploadingImageIndex={uploadingImageIndex}
                        handleSave={handleSave}
                        updateItem={updateItem}
                        updateOption={updateOption}
                        addOptionToItem={addOptionToItem}
                        removeOptionFromItem={removeOptionFromItem}
                        removeItem={removeItem}
                        moveItem={moveItem}
                        handleImageUpload={handleImageUpload}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
