import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AiGeneratingModal from '@/Components/Curriculum/AiGeneratingModal';
import GeneratedModuleEditor from './GeneratedModuleEditor';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Check,
    CheckCircle2,
    Clock,
    FileText,
    Heart,
    HelpCircle,
    Layers,
    Loader2,
    RotateCcw,
    Save,
    School,
    Sparkles,
    UserCheck,
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

interface SemesterItem {
    id: number;
    type: string;
    label: string;
    is_active: boolean;
}

interface AcademicYearItem {
    id: number;
    year_name?: string;
    label?: string;
    is_active: boolean;
    semesters?: SemesterItem[];
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
    institution?: {
        name?: string;
        npsn?: string;
        logo_path?: string;
    } | null;
}

import { DPL_OPTIONS, P3_OPTIONS, PC_OPTIONS, PEDAGOGIS_OPTIONS } from './moduleConstants';

export default function ModulesCreate({
    subjects,
    phases,
    grades,
    academicYears,
    providers,
    institution,
}: Props) {
    const { auth } = usePage<any>().props;
    const aiQuota = auth?.current_tenant?.ai_quota;

    // Scope & Metadata state
    const [schoolName, setSchoolName] = useState<string>(
        institution?.name || auth?.current_tenant?.institution?.name || (auth?.current_tenant?.name && !['Personal', 'Individu'].includes(auth?.current_tenant?.name) ? auth?.current_tenant?.name : '')
    );
    const [subjectId, setSubjectId] = useState<string>('');
    const [phaseId, setPhaseId] = useState<string>('');
    const [gradeId, setGradeId] = useState<string>('');
    const [academicYearId, setAcademicYearId] = useState<string>('');
    const [semesterId, setSemesterId] = useState<string>('');
    const [topicName, setTopicName] = useState<string>('');
    
    // SIPANDA2 Advanced Parameters
    const [kurikulumType, setKurikulumType] = useState<'MERDEKA' | 'MADRASAH_KBC'>('MADRASAH_KBC');
    const [alokasiJp, setAlokasiJp] = useState<number>(2);
    const [menitPerJp, setMenitPerJp] = useState<number>(40);
    const [selectedDpl, setSelectedDpl] = useState<string[]>([]);
    const [selectedPc, setSelectedPc] = useState<string[]>([]);
    const [selectedPedagogis, setSelectedPedagogis] = useState<string[]>([]);

    const [teacherNotes, setTeacherNotes] = useState<string>('');

    // Available TPs state
    const [isLoadingGoals, setIsLoadingGoals] = useState<boolean>(false);
    const [availableGoals, setAvailableGoals] = useState<AvailableGoal[]>([]);
    const [selectedGoalIds, setSelectedGoalIds] = useState<number[]>([]);

    // AI Generation state
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [moduleData, setModuleData] = useState<any | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const updateModuleField = (field: string, value: string) => {
        setModuleData((current: any) => current ? { ...current, [field]: value } : current);
    };

    // Toggle Multi-select helpers
    const toggleDpl = (dpl: string) => {
        if (selectedDpl.includes(dpl)) {
            setSelectedDpl(selectedDpl.filter((item) => item !== dpl));
        } else {
            if (selectedDpl.length >= 3) {
                alert('Maksimal 3 Dimensi Profil Lulusan (DPL).');
                return;
            }
            setSelectedDpl([...selectedDpl, dpl]);
        }
    };

    const togglePc = (pc: string) => {
        if (selectedPc.includes(pc)) {
            setSelectedPc(selectedPc.filter((item) => item !== pc));
        } else {
            if (selectedPc.length >= 3) {
                alert('Maksimal 3 Nilai Panca Cinta.');
                return;
            }
            setSelectedPc([...selectedPc, pc]);
        }
    };

    const togglePedagogis = (model: string) => {
        if (selectedPedagogis.includes(model)) {
            setSelectedPedagogis(selectedPedagogis.filter((item) => item !== model));
        } else {
            if (selectedPedagogis.length >= 2) {
                alert('Maksimal 2 Praktik Pedagogis.');
                return;
            }
            setSelectedPedagogis([...selectedPedagogis, model]);
        }
    };

    const handleScopeChange = async (subId: string, phId: string, grId: string) => {
        setSubjectId(subId);
        setPhaseId(phId);
        setGradeId(grId);
        setSelectedGoalIds([]);
        setModuleData(null);
        setErrorMsg(null);

        if (subId && phId) {
            setIsLoadingGoals(true);
            try {
                const res = await axios.get(route('curriculum.modules.api.goals'), {
                    params: { subject_id: subId, phase_id: phId, grade_id: grId || undefined },
                });
                if (res.data.success) {
                    setAvailableGoals(res.data.goals);
                    if (res.data.goals.length > 0) {
                        setSelectedGoalIds([res.data.goals[0].id]);
                    }
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

    const handleGenerate = async () => {
        if (!subjectId || !phaseId || !gradeId) {
            setErrorMsg('Lengkapi mata pelajaran, fase, dan kelas sasaran terlebih dahulu.');
            return;
        }

        if (!topicName.trim()) {
            setErrorMsg('Tentukan Topik Pembelajaran terlebih dahulu.');
            return;
        }

        if (selectedGoalIds.length === 0) {
            setErrorMsg('Pilih minimal 1 Tujuan Pembelajaran (TP) acuan dari Bank TP.');
            return;
        }

        setIsGenerating(true);
        setErrorMsg(null);

        try {
            const res = await axios.post(route('curriculum.modules.generate'), {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId,
                goal_ids: selectedGoalIds,
                topic_name: topicName,
                alokasi_jp: alokasiJp,
                menit_per_jp: menitPerJp,
                curriculum_code: kurikulumType,
                school_name: schoolName || null,
                dpl_selected: selectedDpl.join(', '),
                pc_selected: selectedPc.join(', '),
                pedagogis_selected: selectedPedagogis.join(', '),
                provider: null,
                teacher_notes: teacherNotes || null,
            });

            if (res.data.success && res.data.module_data) {
                setModuleData(res.data.module_data);
                if (res.data.module_data.school_name && !schoolName) {
                    setSchoolName(res.data.module_data.school_name);
                }
            } else {
                setErrorMsg('Gagal merancang modul. Silakan coba kembali.');
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat memproses generasi modul.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = (status: 'DRAFT' | 'FINAL') => {
        if (!moduleData) return;

        setIsSaving(true);
        setErrorMsg(null);

        const parseList = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string' && val.trim() !== '') {
                return val.split(/[\n,;]+/).map(s => s.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean);
            }
            return [];
        };

        const resolvedLearningModel = selectedPedagogis.length > 0
            ? selectedPedagogis.join(', ')
            : (moduleData.praktik_pedagogis?.split('\n')[0]?.replace(/^Model Pembelajaran:\s*/i, '') || 'Problem Based Learning (PBL)');

        const resolvedDpl = selectedDpl.length > 0 ? selectedDpl : parseList(moduleData.dimensi_dpl);
        const resolvedPc = selectedPc.length > 0 ? selectedPc : parseList(moduleData.topik_panca_cinta);

        const resolvedInquiryQuestions = moduleData.pertanyaan_pemantik
            ? parseList(moduleData.pertanyaan_pemantik)
            : (moduleData.kegiatan_awal_apersepsi ? [moduleData.kegiatan_awal_apersepsi] : []);

        router.post(
            route('curriculum.modules.store'),
            {
                subject_id: subjectId,
                phase_id: phaseId,
                grade_id: gradeId,
                academic_year_id: academicYearId || null,
                semester_id: semesterId || null,
                curriculum_code: kurikulumType,
                title: `${kurikulumType === 'MADRASAH_KBC' ? 'Modul Ajar KBC' : 'Modul Ajar Kurikulum Merdeka'}: ${topicName}`,
                topic_name: topicName,
                total_hours: alokasiJp,
                meeting_count: Math.ceil(alokasiJp / 2),
                learning_model: resolvedLearningModel,
                target_students: moduleData.target_students || moduleData.kesiapan || 'Peserta didik reguler dengan diferensiasi proses belajar.',
                facilities: moduleData.facilities || moduleData.lingkungan_pembelajaran || 'Ruang kelas kondusif, media pembelajaran relevan, dan lembar kerja.',
                prerequisite_knowledge: moduleData.prerequisite_knowledge || moduleData.kesiapan || '',
                learning_goal_ids: selectedGoalIds,
                meaningful_understanding: moduleData.materi_integrasi_kbc || '',
                inquiry_questions: resolvedInquiryQuestions.length > 0 ? resolvedInquiryQuestions : ['Bagaimana materi ini dapat diterapkan dalam kehidupan bermakna?'],
                panca_cinta_integration: resolvedPc,
                deep_learning_activities: {
                    mindful: moduleData.mindful || moduleData.kegiatan_awal_berkesadaran || '',
                    meaningful: moduleData.meaningful || moduleData.materi_integrasi_kbc || '',
                    joyful: moduleData.joyful || '',
                    kemitraan: moduleData.kemitraan_pembelajaran || '',
                    digital: moduleData.pemanfaatan_digital || '',
                    waktu_pendahuluan: moduleData.waktu_pendahuluan || '10 Menit',
                    waktu_inti: moduleData.waktu_inti || '50 Menit',
                    waktu_penutup: moduleData.waktu_penutup || '10 Menit',
                },
                profil_lulusan_targets: resolvedDpl,
                learning_steps: {
                    awal_berkesadaran: moduleData.kegiatan_awal_berkesadaran || '',
                    awal_apersepsi: moduleData.kegiatan_awal_apersepsi || '',
                    inti_memahami: moduleData.inti_memahami || '',
                    inti_mengaplikasi: moduleData.inti_mengaplikasi || '',
                    inti_merefleksi: moduleData.inti_merefleksi || '',
                    penutup: moduleData.kegiatan_penutup || '',
                },
                diagnostic_assessment: {
                    bentuk: moduleData.asesmen_awal || '',
                    tujuan: moduleData.asesmen_awal_fokus || 'Pemetaan kesiapan awal peserta didik',
                },
                formative_assessment: {
                    bentuk: moduleData.asesmen_proses || '',
                    rubrik: moduleData.asesmen_proses_fokus || 'Observasi proses, partisipasi aktif, dan diskusi terbimbing',
                },
                summative_assessment: {
                    bentuk: moduleData.asesmen_akhir || '',
                    kriteria: moduleData.asesmen_akhir_fokus || 'Ketercapaian Tujuan Pembelajaran secara tuntas',
                },
                remedial_enrichment: { rencana: moduleData.remedial_pengayaan || '' },
                student_worksheet_text: moduleData.lkpd || null,
                reading_materials: moduleData.bahan_bacaan || null,
                glossary: moduleData.glosarium ? [moduleData.glosarium] : null,
                bibliography: moduleData.daftar_pustaka || null,
                status: status,
                generation_metadata: {
                    school_name: schoolName || institution?.name || null,
                    generated_at: new Date().toISOString(),
                    provider: 'edugen-ai',
                },
            } as any,
            {
                onError: (errors) => {
                    setIsSaving(false);
                    const errorMessages = Object.values(errors).flat().join(', ');
                    setErrorMsg(`Gagal menyimpan modul: ${errorMessages}`);
                },
                onFinish: () => setIsSaving(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <Link href={route('curriculum.modules.index')} className="flex items-center gap-1 hover:underline">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Perangkat Ajar & Modul
                            </Link>
                            <span>/</span>
                            <span>{kurikulumType === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC'}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {kurikulumType === 'MERDEKA'
                                ? 'Rancang Modul Ajar Kurikulum Merdeka'
                                : 'Rancang Modul Ajar / RPP KBC (KMA 1503/2025)'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {kurikulumType === 'MERDEKA'
                                ? 'Format resmi Kurikulum Merdeka dengan Capaian Pembelajaran, Profil Pelajar Pancasila (P3), dan Pembelajaran Berdiferensiasi.'
                                : 'Format resmi 14 seksi terstruktur KBC, integrasi Panca Cinta, dan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful).'}
                        </p>
                    </div>

                    {/* AI Quota Badge */}
                    {aiQuota && (
                        <div className="shrink-0">
                            {aiQuota.remaining === 0 ? (
                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                    <div>
                                        <div className="font-bold">Kuota AI Habis</div>
                                        <Link href={route('billing.index')} className="block text-[11px] underline font-semibold text-rose-600 hover:text-rose-700">
                                            Upgrade Langganan &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs">
                                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <div>
                                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Kuota Generasi AI</div>
                                        <div className="font-bold">
                                            {aiQuota.remaining === -1 ? 'Tanpa Batas (Grace Mode)' : `${aiQuota.remaining} Sisa (${aiQuota.used}/${aiQuota.total} Terpakai)`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }
        >
            <Head title={kurikulumType === 'MERDEKA' ? 'Rancang Modul Ajar Kurikulum Merdeka' : 'Rancang Modul Ajar KBC'} />

            <AiGeneratingModal
                isOpen={isGenerating}
                title={kurikulumType === 'MERDEKA'
                    ? 'Sedang Merancang Modul Ajar Kurikulum Merdeka...'
                    : 'Sedang Merancang Modul Ajar / RPP KBC...'}
                subtitle={kurikulumType === 'MERDEKA'
                    ? 'AI sedang merumuskan komponen inti Modul Ajar, Profil Pelajar Pancasila, langkah berdiferensiasi, dan asesmen.'
                    : 'AI sedang merumuskan 14 seksi KBC & Deep Learning model PEDATTI berbasis KMA 1503/2025.'}
                providerName="EduGen Smart Engine"
            />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Step 1: Configuration Form */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                            1
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Identitas Modul & Kerangka Kurikulum
                            </h2>
                            <p className="text-[11px] text-slate-500">
                                Pilih sasaran kurikulum, alokasi waktu, topik pokok, serta Tujuan Pembelajaran acuan.
                            </p>
                        </div>
                    </div>

                    {/* Scope Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kurikulum
                            </label>
                            <select
                                value={kurikulumType}
                                onChange={(e) => {
                                    const value = e.target.value as 'MERDEKA' | 'MADRASAH_KBC';
                                    setKurikulumType(value);
                                    setModuleData(null);
                                    setErrorMsg(null);
                                    if (value === 'MERDEKA') {
                                        setSelectedPc([]);
                                        setSelectedDpl(['Bernalar Kritis', 'Kreatif']);
                                    } else {
                                        setSelectedDpl(['Penalaran Kritis', 'Keimanan dan Ketakwaan kepada Tuhan YME']);
                                        setSelectedPc([
                                            "Cinta kepada Allah dan Rasul-Nya (Mahabbatullah wa Rasulihi)",
                                            "Cinta kepada Ilmu Pengetahuan (Hubbul 'Ilm)",
                                        ]);
                                    }
                                }}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                            >
                                <option value="MADRASAH_KBC">Kurikulum Madrasah KBC (KMA 1503/2025)</option>
                                <option value="MERDEKA">Kurikulum Merdeka (Kemendikbudristek)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Mata Pelajaran *
                            </label>
                            <select
                                value={subjectId}
                                onChange={(e) => handleScopeChange(e.target.value, phaseId, gradeId)}
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
                                Tingkat Kelas *
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
                    </div>

                    {/* Topic Name, School Name & Time Allocation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Satuan Pendidikan / Nama Sekolah *
                            </label>
                            <div className="relative">
                                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                    placeholder="Contoh: MAN 1 Jakarta / MTs Al-Hidayah / SMP..."
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Topik / Materi Pokok *
                            </label>
                            <input
                                type="text"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                placeholder="Contoh: Menghayati Kasih Sayang Allah melalui Nilai Kejujuran"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Alokasi Waktu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Alokasi Waktu (JP)
                            </label>
                            <select
                                value={alokasiJp}
                                onChange={(e) => setAlokasiJp(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                            >
                                <option value={1}>1 JP</option>
                                <option value={2}>2 JP (1 Pertemuan)</option>
                                <option value={3}>3 JP</option>
                                <option value={4}>4 JP (2 Pertemuan)</option>
                                <option value={6}>6 JP (3 Pertemuan)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Menit per JP
                            </label>
                            <select
                                value={menitPerJp}
                                onChange={(e) => setMenitPerJp(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value={35}>35 Menit (SD/MI)</option>
                                <option value={40}>40 Menit (SMP/MTs)</option>
                                <option value={45}>45 Menit (SMA/MA)</option>
                            </select>
                        </div>
                    </div>

                    {/* Karakter: DPL untuk KBC atau Profil Pelajar Pancasila untuk Kurikulum Merdeka */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                {kurikulumType === 'MERDEKA'
                                    ? 'Dimensi Profil Pelajar Pancasila (P3)'
                                    : 'Dimensi Profil Lulusan (DPL - KMA 1503/2025)'}
                            </label>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                kurikulumType === 'MERDEKA'
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                                    : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                            }`}>
                                {selectedDpl.length > 0 ? `${selectedDpl.length}/3 dipilih (Maksimal 3)` : 'Otomatis dianalisis AI (atau pilih manual)'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(kurikulumType === 'MERDEKA' ? P3_OPTIONS : DPL_OPTIONS).map((item) => {
                                const isSelected = selectedDpl.includes(item);
                                return (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => toggleDpl(item)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                                            isSelected
                                                ? kurikulumType === 'MERDEKA'
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                    : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        {isSelected ? '✓ ' : '+ '}{item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SIPANDA2 Multi-Select: Panca Cinta (Maks 3) */}
                    {kurikulumType === 'MADRASAH_KBC' && <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                Nilai Panca Cinta (KMA 1503/2025)
                            </label>
                            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                                {selectedPc.length > 0 ? `${selectedPc.length}/3 dipilih (Maksimal 3)` : 'Otomatis dianalisis AI (atau pilih manual)'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PC_OPTIONS.map((pc) => {
                                const isSelected = selectedPc.includes(pc);
                                return (
                                    <button
                                        type="button"
                                        key={pc}
                                        onClick={() => togglePc(pc)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                                            isSelected
                                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        {isSelected ? '✓ ' : '+ '}{pc}
                                    </button>
                                );
                            })}
                        </div>
                    </div>}

                    {/* SIPANDA2 Multi-Select: Praktik Pedagogis (Maks 2) */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                Model / Praktik Pedagogis
                            </label>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                                {selectedPedagogis.length > 0 ? `${selectedPedagogis.length}/2 dipilih (Maksimal 2)` : 'Otomatis dianalisis AI (atau pilih manual)'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PEDAGOGIS_OPTIONS.map((model) => {
                                const isSelected = selectedPedagogis.includes(model);
                                return (
                                    <button
                                        type="button"
                                        key={model}
                                        onClick={() => togglePedagogis(model)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        {isSelected ? '✓ ' : '+ '}{model}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* TP Selection Section */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                Pilih Tujuan Pembelajaran (TP) Acuan dari Bank TP *
                            </label>
                            <Link
                                href={route('curriculum.tp.create')}
                                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                                target="_blank"
                            >
                                <Sparkles className="w-3 h-3" />
                                Buat TP Baru di Bank TP
                            </Link>
                        </div>

                        {isLoadingGoals ? (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                Mencari Tujuan Pembelajaran di Bank TP...
                            </div>
                        ) : availableGoals.length > 0 ? (
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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
                                                        Bloom {goal.bloom_level} ({goal.competency_kko})
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
                                    Belum ada Tujuan Pembelajaran (TP) tersimpan untuk mata pelajaran dan fase ini.{' '}
                                    <Link href={route('curriculum.tp.create')} className="font-bold underline" target="_blank">
                                        Klik di sini untuk membuat TP terlebih dahulu
                                    </Link>.
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Catatan Tambahan Guru */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Catatan Tambahan Guru / Konteks Khusus (Opsional)
                        </label>
                        <input
                            type="text"
                            value={teacherNotes}
                            onChange={(e) => setTeacherNotes(e.target.value)}
                            placeholder="Contoh: Perbanyak aktivitas kinestetik ramah anak, integrasikan studi kasus riil..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                                <div>
                                    <p className="font-semibold">{errorMsg}</p>
                                    {aiQuota?.remaining === 0 && (
                                        <Link
                                            href={route('billing.index')}
                                            className="inline-flex items-center gap-1 font-bold underline text-red-700 dark:text-red-300 hover:text-red-800 mt-1"
                                        >
                                            Buka Halaman Langganan untuk Tambah Kuota &rarr;
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {aiQuota?.remaining !== 0 && (
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || selectedGoalIds.length === 0 || !topicName.trim()}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-end sm:self-auto shrink-0 disabled:opacity-50"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Coba Lagi
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating || selectedGoalIds.length === 0 || !topicName.trim() || aiQuota?.remaining === 0}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 ${
                                kurikulumType === 'MERDEKA'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            {isGenerating 
                                ? (kurikulumType === 'MERDEKA' ? 'Sedang Merancang Modul Ajar Kurikulum Merdeka...' : 'Sedang Merancang Modul Ajar KBC...') 
                                : aiQuota?.remaining === 0 
                                ? 'Kuota AI Telah Habis' 
                                : (kurikulumType === 'MERDEKA' ? 'Rancang Modul Ajar Kurikulum Merdeka (AI)' : 'Rancang Modul Ajar KBC (AI)')}
                        </button>
                    </div>
                </div>

                {/* Step 2: Live Generated 14 Seksi Preview */}
                {moduleData && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    2
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {kurikulumType === 'MERDEKA'
                                            ? 'Hasil Rancangan Modul Ajar Kurikulum Merdeka'
                                            : 'Hasil Rancangan RPP / Modul Ajar KBC (14 Seksi Terstruktur)'}
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Periksa seluruh komponen sebelum menyimpan ke database resmi madrasah / sekolah.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSave('FINAL')}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-2 px-6 py-2.5 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 ${
                                    kurikulumType === 'MERDEKA'
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Finalisasi Modul'}
                            </button>
                        </div>

                        <GeneratedModuleEditor
                            moduleData={moduleData}
                            kurikulumType={kurikulumType}
                            schoolName={schoolName}
                            updateModuleField={updateModuleField}
                        />

                        {/* Error Alert in Step 2 if saving fails */}
                        {errorMsg && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                                <p className="font-semibold">{errorMsg}</p>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => handleSave('DRAFT')}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
                            >
                                Simpan Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSave('FINAL')}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Finalisasi Modul'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
