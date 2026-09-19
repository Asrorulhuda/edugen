import { AssessmentItemData, GoalOption } from '@/Components/Curriculum/Assessments/QuestionEditorItem';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useState } from 'react';

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

interface PackageData {
    id: number;
    title: string;
    assessment_type: string;
    curriculum_code: 'MERDEKA' | 'MADRASAH_KBC';
    duration_minutes: number;
    instructions?: string | null;
    status: 'DRAFT' | 'FINAL';
    subject_id: number;
    phase_id: number;
    grade_id: number;
    academic_year_id?: number | null;
    semester_id?: number | null;
    questions: QuestionDbItem[];
}

function buildInitialItems(questions: QuestionDbItem[]): AssessmentItemData[] {
    return (questions || [])
        .slice()
        .sort((a, b) => a.question_number - b.question_number)
        .map((q, idx) => ({
            question_number: q.question_number || idx + 1,
            learning_goal_id: q.matrix?.learning_goal_id || null,
            indicator_text: q.matrix?.indicator_text || `Peserta didik dapat memahami materi soal nomor ${idx + 1}`,
            bloom_level: q.matrix?.bloom_level || 'C3',
            cognitive_tier: q.matrix?.cognitive_tier || 'L2',
            difficulty_level: (q.matrix?.difficulty_level as any) || 'SEDANG',
            question_type: q.question_type || 'PG',
            score_weight: q.score_weight || 1,
            stimulus_text: q.stimulus_text || null,
            image_prompt: q.image_prompt || null,
            image_path: q.image_path || null,
            question_text: q.question_text || '',
            options_data: q.options_data || { A: '', B: '', C: '', D: '' },
            correct_answer: q.correct_answer || 'A',
            explanation: q.explanation || null,
        }));
}

export function useAssessmentEditor(pkg: PackageData, learningGoals: GoalOption[]) {
    const [title, setTitle] = useState(pkg.title);
    const [durationMinutes, setDurationMinutes] = useState(pkg.duration_minutes);
    const [instructions, setInstructions] = useState(pkg.instructions || '');
    const [status, setStatus] = useState<'DRAFT' | 'FINAL'>(pkg.status);
    const [assessmentType, setAssessmentType] = useState(pkg.assessment_type);
    const [curriculumCode, setCurriculumCode] = useState(pkg.curriculum_code);
    const [items, setItems] = useState<AssessmentItemData[]>(buildInitialItems(pkg.questions));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const updateItemField = <K extends keyof AssessmentItemData>(
        index: number,
        field: K,
        value: AssessmentItemData[K]
    ) => {
        setItems((current) =>
            current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const updateItemOption = (itemIndex: number, key: string, value: string) => {
        setItems((current) =>
            current.map((item, i) => {
                if (i !== itemIndex) return item;
                const newOpts = { ...(item.options_data || {}), [key]: value };
                return { ...item, options_data: newOpts };
            })
        );
    };

    const addOptionToItem = (itemIndex: number) => {
        setItems((current) =>
            current.map((item, i) => {
                if (i !== itemIndex) return item;
                const currentKeys = item.options_data ? Object.keys(item.options_data) : [];
                const nextKey = String.fromCharCode(65 + currentKeys.length);
                if (currentKeys.length >= 5) return item;
                return {
                    ...item,
                    options_data: { ...(item.options_data || {}), [nextKey]: '' },
                };
            })
        );
    };

    const removeOptionFromItem = (itemIndex: number, keyToRemove: string) => {
        setItems((current) =>
            current.map((item, i) => {
                if (i !== itemIndex || !item.options_data) return item;
                const newOpts: Record<string, string> = {};
                Object.keys(item.options_data)
                    .filter((k) => k !== keyToRemove)
                    .forEach((k) => {
                        newOpts[k] = item.options_data![k];
                    });
                let newAnswer = item.correct_answer;
                if (newAnswer === keyToRemove) {
                    newAnswer = Object.keys(newOpts)[0] || 'A';
                }
                return { ...item, options_data: newOpts, correct_answer: newAnswer };
            })
        );
    };

    const addNewQuestion = (type: 'PG' | 'URAIAN' = 'PG') => {
        const nextNum = items.length + 1;
        const newItem: AssessmentItemData = {
            question_number: nextNum,
            learning_goal_id: learningGoals[0]?.id || null,
            indicator_text: `Disajikan wacana masalah kontekstual, peserta didik dapat menyelesaikan soal nomor ${nextNum}`,
            bloom_level: 'C4',
            cognitive_tier: 'L3',
            difficulty_level: 'SEDANG',
            question_type: type,
            score_weight: type === 'PG' ? 1 : 3,
            stimulus_text: '',
            image_prompt: null,
            image_path: null,
            question_text: '',
            options_data: type === 'PG' ? { A: '', B: '', C: '', D: '' } : null,
            correct_answer: type === 'PG' ? 'A' : '',
            explanation: '',
        };
        setItems([...items, newItem]);
    };

    const removeQuestion = (index: number) => {
        if (items.length <= 1) {
            alert('Paket soal minimal harus memiliki 1 butir soal.');
            return;
        }
        if (confirm(`Yakin ingin menghapus butir soal #${items[index].question_number}?`)) {
            const reindexed = items
                .filter((_, i) => i !== index)
                .map((item, i) => ({ ...item, question_number: i + 1 }));
            setItems(reindexed);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const updated = [...items];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const renumbered = updated.map((item, i) => ({ ...item, question_number: i + 1 }));
        setItems(renumbered);
    };

    const handleUploadImage = async (file: File, index: number) => {
        setUploadingIndex(index);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(route('curriculum.assessments.upload-image'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.success && res.data.image_path) {
                updateItemField(index, 'image_path', res.data.image_path);
            }
        } catch (err: any) {
            alert('Gagal mengunggah gambar: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        setSubmitError(null);

        if (!title.trim()) {
            setSubmitError('Judul naskah soal asesmen wajib diisi.');
            return;
        }

        if (items.length === 0) {
            setSubmitError('Paket asesmen harus memiliki minimal 1 butir soal.');
            return;
        }

        for (let i = 0; i < items.length; i++) {
            if (!items[i].question_text.trim()) {
                setSubmitError(`Teks pertanyaan butir nomor #${i + 1} belum diisi.`);
                return;
            }
        }

        setIsSubmitting(true);

        const payload = {
            _method: 'PUT' as const,
            subject_id: pkg.subject_id,
            phase_id: pkg.phase_id,
            grade_id: pkg.grade_id,
            academic_year_id: pkg.academic_year_id ?? '',
            semester_id: pkg.semester_id ?? '',
            curriculum_code: curriculumCode,
            title: title.trim(),
            assessment_type: assessmentType,
            total_questions: items.length,
            duration_minutes: Number(durationMinutes),
            instructions: instructions.trim() || '',
            settings: {},
            status,
            items: items.map((item) => ({
                ...item,
                stimulus_text: item.stimulus_text ?? '',
                image_prompt: item.image_prompt ?? '',
                image_path: item.image_path ?? '',
                options_data: item.options_data ?? {},
                correct_answer: item.correct_answer ?? '',
                explanation: item.explanation ?? '',
            })),
        };

        router.post(
            route('curriculum.assessments.update', pkg.id),
            payload as any,
            {
                onError: (errs) => {
                    setIsSubmitting(false);
                    const firstError = Object.values(errs)[0] as string;
                    setSubmitError(firstError || 'Terjadi kesalahan saat menyimpan perubahan.');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return {
        // Form state
        title, setTitle,
        durationMinutes, setDurationMinutes,
        instructions, setInstructions,
        status, setStatus,
        assessmentType, setAssessmentType,
        curriculumCode, setCurriculumCode,
        items,
        isSubmitting,
        submitError,
        uploadingIndex,

        // Item operations
        updateItemField,
        updateItemOption,
        addOptionToItem,
        removeOptionFromItem,
        addNewQuestion,
        removeQuestion,
        moveItem,
        handleUploadImage,
        handleSubmit,
    };
}
