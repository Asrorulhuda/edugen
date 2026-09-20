import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Heart,
    HelpCircle,
    Printer,
    School,
    Sparkles,
    Trash2,
} from 'lucide-react';

interface Props {
    module: {
        id: number;
        title: string;
        curriculum_code: 'MERDEKA' | 'MADRASAH_KBC';
        topic_name: string;
        total_hours: number;
        meeting_count: number;
        learning_model: string;
        target_students?: string;
        facilities?: string;
        prerequisite_knowledge?: string;
        meaningful_understanding?: string;
        inquiry_questions?: string[];
        panca_cinta_integration?: string[];
        deep_learning_activities?: {
            mindful?: string;
            meaningful?: string;
            joyful?: string;
        };
        profil_lulusan_targets?: string[];
        learning_steps?: Array<{
            meeting: number;
            duration_minutes?: number;
            preliminary?: string[];
            core?: string[];
            closing?: string[];
        }>;
        diagnostic_assessment?: any;
        formative_assessment?: any;
        summative_assessment?: any;
        remedial_enrichment?: any;
        student_worksheet_text?: string;
        reading_materials?: string;
        glossary?: Array<{ term: string; meaning: string }>;
        bibliography?: string;
        generation_metadata?: Record<string, any> | null;
        status: string;
        created_at: string;
        subject: {
            name: string;
            code: string;
        };
        phase: {
            name: string;
            code: string;
        };
        grade: {
            grade_number: number;
            name: string;
        };
        academic_year?: {
            label: string;
        };
        semester?: {
            label: string;
        };
        user: {
            name: string;
            teacher_profiles?: Array<{
                employee_no?: string;
                nuptk?: string;
            }>;
        };
    };
    goals: Array<{
        id: number;
        code: string;
        bloom_level: string;
        competency_kko: string;
        pedagogical_description: string;
    }>;
    learningOutcomes?: Array<{
        id: number;
        element: string;
        cp_text: string;
    }>;
    institution?: {
        name: string;
        type?: string;
        header_style?: string;
        letterhead_line_1?: string;
        letterhead_line_2?: string;
        letterhead_line_3?: string;
        letterhead_subtext?: string;
        letterhead_path?: string;
        logo_path?: string;
        effective_logo_url?: string;
        effective_subtext?: string;
        effective_line_1?: string;
        signature_city?: string;
        signature_title?: string;
        principal_name?: string;
        principal_id_number?: string;
    } | null;
}

export default function ModulesShow({ module, goals, institution, learningOutcomes = [] }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus Modul Ajar "${module.title}"?`)) {
            router.post(route('curriculum.modules.destroy', module.id), { _method: 'delete' });
        }
    };

    const teacherProfile = module.user?.teacher_profiles?.[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.modules.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
                                {module.curriculum_code === 'MERDEKA' ? 'Modul Ajar Kurikulum Merdeka' : 'Modul Ajar KBC Resmi (KMA 1503/2025)'}
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {module.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('curriculum.modules.print', module.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            Cetak Dokumen Resmi
                        </a>

                        <a
                            href={route('curriculum.modules.download-word', module.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                            <Download className="w-4 h-4" />
                            Unduh Word (.doc)
                        </a>

                        <button
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                            title="Hapus Modul"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${module.title} - EduGen KBC`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Document Paper Container */}
                <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 font-serif print:border-none print:shadow-none print:p-0 print:m-0 print:text-black">
                    {/* Official Letterhead (Kop Surat) */}
                    {institution && (
                        <div className="mb-6 pb-4 border-b-2 border-black">
                            {institution.header_style === 'FULL_IMAGE' && institution.letterhead_path ? (
                                <img
                                    src={`/storage/${institution.letterhead_path}`}
                                    alt="Kop Surat"
                                    className="w-full max-h-36 object-contain mx-auto"
                                />
                            ) : institution.header_style === 'TEXT_ONLY' ? (
                                <div className="text-center font-serif">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                                        {institution.effective_line_1 || institution.letterhead_line_1 || (module.curriculum_code === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA')}
                                    </h4>
                                    <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
                                        {institution.letterhead_line_2 || module.generation_metadata?.school_name || institution.name || 'SDN SIMANALAGI 2'}
                                    </h2>
                                    {institution.letterhead_line_3 && (
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
                                            {institution.letterhead_line_3}
                                        </h4>
                                    )}
                                    <p className="text-[11px] text-slate-600 font-sans mt-1">
                                        {institution.effective_subtext || institution.letterhead_subtext}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                                        <img
                                            src={
                                                institution.effective_logo_url
                                                || (institution.logo_path ? `/storage/${institution.logo_path}` : (
                                                    module.curriculum_code === 'MERDEKA'
                                                        ? '/images/logos/tutwuri.svg'
                                                        : '/images/logos/kemenag.svg'
                                                ))
                                            }
                                            alt="Logo Sekolah"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 text-center font-serif">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                                            {institution.effective_line_1 || institution.letterhead_line_1 || (module.curriculum_code === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA')}
                                        </h4>
                                        <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
                                            {institution.letterhead_line_2 || module.generation_metadata?.school_name || institution.name || 'SDN SIMANALAGI 2'}
                                        </h2>
                                        {institution.letterhead_line_3 && (
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
                                                {institution.letterhead_line_3}
                                            </h4>
                                        )}
                                        <p className="text-[11px] text-slate-600 font-sans mt-1 leading-tight">
                                            {institution.effective_subtext || institution.letterhead_subtext}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Header Kop & Title */}
                    <div className="text-center pb-6 border-b-2 border-slate-900">
                        <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase">
                            {module.curriculum_code === 'MERDEKA'
                                ? 'KURIKULUM MERDEKA (KEMENDIKBUDRISTEK)'
                                : 'KURIKULUM MADRASAH BERBASIS CINTA (KMA 1503 TAHUN 2025)'}
                        </span>
                        <h2 className="text-xl font-extrabold uppercase mt-1">
                            MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN
                        </h2>
                        <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                            {module.topic_name}
                        </h3>
                    </div>

                    {/* 1. Informasi Umum */}
                    <div className="space-y-6 font-sans text-xs">
                        <div>
                            <h4 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 uppercase tracking-wider">
                                I. INFORMASI UMUM
                            </h4>
                            <table className="w-full mt-3 text-xs leading-relaxed">
                                <tbody>
                                    <tr className="border-b border-slate-100">
                                        <td className="w-48 py-1.5 font-semibold text-slate-700">Kerangka Kurikulum</td>
                                        <td className="py-1.5 font-bold text-blue-700">
                                            {module.curriculum_code === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Madrasah KBC (KMA 1503/2025)'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="w-48 py-1.5 font-semibold text-slate-700">Nama Penyusun / Guru</td>
                                        <td className="py-1.5 font-medium">{module.user.name}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-1.5 font-semibold text-slate-700">Satuan Pendidikan</td>
                                        <td className="py-1.5 font-bold text-slate-900">{module.generation_metadata?.school_name || institution?.name || 'Madrasah / Sekolah'}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-1.5 font-semibold text-slate-700">Mata Pelajaran</td>
                                        <td className="py-1.5">{module.subject.name}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-1.5 font-semibold text-slate-700">Fase / Kelas / Semester</td>
                                        <td className="py-1.5">
                                            {module.phase.name} / Kelas {module.grade.grade_number}
                                            {module.semester ? ` / ${module.semester.label}` : ''}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-1.5 font-semibold text-slate-700">Alokasi Waktu</td>
                                        <td className="py-1.5">
                                            {module.meeting_count} Pertemuan ({module.total_hours} JP @ 40 menit)
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-1.5 font-semibold text-slate-700">Model Pembelajaran</td>
                                        <td className="py-1.5">{module.learning_model}</td>
                                    </tr>
                                    {module.prerequisite_knowledge && (
                                        <tr className="border-b border-slate-100">
                                            <td className="py-1.5 font-semibold text-slate-700">Kompetensi Awal</td>
                                            <td className="py-1.5">{module.prerequisite_knowledge}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Komponen Inti & TP */}
                        <div>
                            <h4 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 uppercase tracking-wider">
                                II. KOMPONEN INTI & TUJUAN PEMBELAJARAN
                            </h4>

                            {/* CP Acuan Resmi */}
                            {learningOutcomes && learningOutcomes.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <p className="font-bold text-slate-800">A. Capaian Pembelajaran (CP) Acuan Resmi:</p>
                                    <div className="space-y-2 pl-2">
                                        {learningOutcomes.map((lo, idx) => (
                                            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed">
                                                <span className="font-bold text-emerald-800 block mb-0.5">Elemen {lo.element}:</span>
                                                <p className="text-slate-700 italic leading-relaxed">"{lo.cp_text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TP List */}
                            <div className="mt-4 space-y-2">
                                <p className="font-bold text-slate-800">
                                    {learningOutcomes && learningOutcomes.length > 0 ? 'B. Tujuan Pembelajaran (TP) Terpilih:' : 'A. Tujuan Pembelajaran (TP):'}
                                </p>
                                <ul className="list-decimal pl-5 space-y-1">
                                    {goals.map((goal) => (
                                        <li key={goal.id} className="leading-relaxed">
                                            <strong>[{goal.code}]</strong> {goal.pedagogical_description} (Bloom {goal.bloom_level})
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Profil Pelajar Pancasila / DPL Targets */}
                            {Array.isArray(module.profil_lulusan_targets) && module.profil_lulusan_targets.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-bold text-slate-800">
                                        {learningOutcomes && learningOutcomes.length > 0 ? 'C. ' : 'B. '}
                                        {module.curriculum_code === 'MERDEKA' ? 'Profil Pelajar Pancasila (P3):' : 'Dimensi Profil Lulusan (DPL):'}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {module.profil_lulusan_targets.map((tgt, idx) => (
                                            <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                                                {tgt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meaningful & Inquiry */}
                            <div className="mt-4 space-y-3">
                                <div>
                                    <p className="font-bold text-slate-800">
                                        {module.curriculum_code === 'MERDEKA' ? 'C. Pemahaman Bermakna (Meaningful Learning):' : 'C. Materi Integrasi KBC & Pemahaman Bermakna:'}
                                    </p>
                                    <p className="mt-1 text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                        "{module.meaningful_understanding || 'Memahami relevansi fungsional materi dalam kehidupan sehari-hari.'}"
                                    </p>
                                </div>

                                {Array.isArray(module.inquiry_questions) && module.inquiry_questions.length > 0 && (
                                    <div>
                                        <p className="font-bold text-slate-800">D. Pertanyaan Pemantik:</p>
                                        <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-700">
                                            {module.inquiry_questions.map((q, idx) => (
                                                <li key={idx}>{q}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Panca Cinta KBC */}
                            {module.curriculum_code === 'MADRASAH_KBC' && Array.isArray(module.panca_cinta_integration) && module.panca_cinta_integration.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-bold text-rose-800">E. Integrasi Nilai Panca Cinta (KMA 1503/2025):</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                                        {module.panca_cinta_integration.map((pc, idx) => (
                                            <div key={idx} className="p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-950 text-[11px]">
                                                {pc}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3 Pilar Deep Learning / Desain Pembelajaran */}
                            {module.deep_learning_activities && (
                                <div className="mt-4">
                                    <p className="font-bold text-indigo-800">
                                        {module.curriculum_code === 'MERDEKA' ? 'E. Desain Pengalaman Belajar:' : 'E. Pendekatan 3 Pilar Deep Learning:'}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5 text-[11px]">
                                        {(module.deep_learning_activities.mindful || (module.deep_learning_activities as any).kemitraan) && (
                                            <div className="p-2.5 rounded-md bg-indigo-50 border border-indigo-200">
                                                <strong className="block text-indigo-900 mb-1">
                                                    {module.deep_learning_activities.mindful ? '1. Mindful Learning:' : '1. Kemitraan Pembelajaran:'}
                                                </strong>
                                                <span>{module.deep_learning_activities.mindful || (module.deep_learning_activities as any).kemitraan}</span>
                                            </div>
                                        )}
                                        {(module.deep_learning_activities.meaningful || (module.deep_learning_activities as any).digital) && (
                                            <div className="p-2.5 rounded-md bg-indigo-50 border border-indigo-200">
                                                <strong className="block text-indigo-900 mb-1">
                                                    {module.deep_learning_activities.meaningful ? '2. Meaningful Learning:' : '2. Pemanfaatan Digital:'}
                                                </strong>
                                                <span>{module.deep_learning_activities.meaningful || (module.deep_learning_activities as any).digital}</span>
                                            </div>
                                        )}
                                        {(module.deep_learning_activities.joyful || (module.deep_learning_activities as any).waktu_inti) && (
                                            <div className="p-2.5 rounded-md bg-indigo-50 border border-indigo-200">
                                                <strong className="block text-indigo-900 mb-1">
                                                    {module.deep_learning_activities.joyful ? '3. Joyful Learning:' : '3. Distribusi Alokasi Waktu:'}
                                                </strong>
                                                <span>
                                                    {module.deep_learning_activities.joyful ||
                                                        `Awal: ${(module.deep_learning_activities as any).waktu_pendahuluan || '10 Menit'} | Inti: ${(module.deep_learning_activities as any).waktu_inti || '50 Menit'} | Penutup: ${(module.deep_learning_activities as any).waktu_penutup || '10 Menit'}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Langkah-Langkah Pembelajaran */}
                        <div>
                            <h4 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 uppercase tracking-wider">
                                III. KEGIATAN PEMBELAJARAN
                            </h4>

                            <div className="mt-3 space-y-4">
                                {Array.isArray(module.learning_steps) ? (
                                    module.learning_steps.map((step) => (
                                        <div key={step.meeting} className="border border-slate-200 rounded-xl p-4 space-y-3">
                                            <h5 className="font-bold text-xs uppercase text-slate-900 bg-slate-100 p-1.5 rounded">
                                                Pertemuan Ke-{step.meeting} ({step.duration_minutes || 80} Menit)
                                            </h5>

                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-800">1. Kegiatan Pendahuluan (10 Menit):</p>
                                                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                                                    {step.preliminary?.map((line, idx) => (
                                                        <li key={idx}>{line}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-800">2. Kegiatan Inti ({Number(step.duration_minutes || 80) - 20} Menit):</p>
                                                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                                                    {step.core?.map((line, idx) => (
                                                        <li key={idx}>{line}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-800">3. Kegiatan Penutup & Refleksi (10 Menit):</p>
                                                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                                                    {step.closing?.map((line, idx) => (
                                                        <li key={idx}>{line}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                ) : module.learning_steps && typeof module.learning_steps === 'object' ? (
                                    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                                        {/* 1. Kegiatan Awal */}
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-slate-900 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                                                <span>1. Kegiatan Pendahuluan / Awal</span>
                                                <span className="text-[11px] font-normal text-slate-600">
                                                    {(module.deep_learning_activities as any)?.waktu_pendahuluan || '10-15 Menit'}
                                                </span>
                                            </h5>
                                            {(module.learning_steps as any).awal_berkesadaran && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-emerald-400">
                                                    <strong className="block text-slate-900 mb-0.5">a. Berkesadaran (Mindful / Pembiasaan Diri):</strong>
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).awal_berkesadaran}</p>
                                                </div>
                                            )}
                                            {(module.learning_steps as any).awal_apersepsi && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-emerald-400">
                                                    <strong className="block text-slate-900 mb-0.5">b. Apersepsi & Pertanyaan Pemantik:</strong>
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).awal_apersepsi}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 2. Kegiatan Inti */}
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-slate-900 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                                                <span>2. Kegiatan Inti (Eksplorasi & Diferensiasi)</span>
                                                <span className="text-[11px] font-normal text-slate-600">
                                                    {(module.deep_learning_activities as any)?.waktu_inti || '50-60 Menit'}
                                                </span>
                                            </h5>
                                            {(module.learning_steps as any).inti_memahami && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-blue-400">
                                                    <strong className="block text-slate-900 mb-0.5">a. Memahami (Literasi & Pembentukan Konsep):</strong>
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).inti_memahami}</p>
                                                </div>
                                            )}
                                            {(module.learning_steps as any).inti_mengaplikasi && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-blue-400">
                                                    <strong className="block text-slate-900 mb-0.5">b. Mengaplikasikan (Studi Kasus & Kolaborasi):</strong>
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).inti_mengaplikasi}</p>
                                                </div>
                                            )}
                                            {(module.learning_steps as any).inti_merefleksi && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-blue-400">
                                                    <strong className="block text-slate-900 mb-0.5">c. Merefleksikan (Umpan Balik & Penguatan):</strong>
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).inti_merefleksi}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Kegiatan Penutup */}
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-slate-900 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                                                <span>3. Kegiatan Penutup & Refleksi</span>
                                                <span className="text-[11px] font-normal text-slate-600">
                                                    {(module.deep_learning_activities as any)?.waktu_penutup || '10-15 Menit'}
                                                </span>
                                            </h5>
                                            {(module.learning_steps as any).penutup && (
                                                <div className="text-xs text-slate-700 pl-2.5 border-l-2 border-amber-400">
                                                    <p className="whitespace-pre-line leading-relaxed">{(module.learning_steps as any).penutup}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic text-xs">Langkah kegiatan belum terdefinisi.</p>
                                )}
                            </div>
                        </div>

                        {/* 4. Rencana Asesmen */}
                        <div>
                            <h4 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 uppercase tracking-wider">
                                IV. RENCANA ASESMEN
                            </h4>
                            <table className="w-full mt-3 border text-xs">
                                <thead className="bg-slate-100 text-slate-800">
                                    <tr>
                                        <th className="border p-2 text-left">Jenis Asesmen</th>
                                        <th className="border p-2 text-left">Bentuk & Teknik</th>
                                        <th className="border p-2 text-left">Fokus Indikator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2 font-semibold">1. Asesmen Diagnostik (Awal)</td>
                                        <td className="border p-2">{module.diagnostic_assessment?.bentuk || (typeof module.diagnostic_assessment === 'string' ? module.diagnostic_assessment : 'Tanya Jawab Pemantik')}</td>
                                        <td className="border p-2">{module.diagnostic_assessment?.tujuan || 'Kesiapan & pemahaman awal peserta didik'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold">2. Asesmen Formatif (Proses)</td>
                                        <td className="border p-2">{module.formative_assessment?.bentuk || (typeof module.formative_assessment === 'string' ? module.formative_assessment : 'Observasi Partisipasi & Rubrik')}</td>
                                        <td className="border p-2">{module.formative_assessment?.rubrik || 'Keterlibatan aktif, kolaborasi, dan sikap'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold">3. Asesmen Sumatif (Akhir)</td>
                                        <td className="border p-2">{module.summative_assessment?.bentuk || (typeof module.summative_assessment === 'string' ? module.summative_assessment : 'Produk Karya & Tes Tertulis')}</td>
                                        <td className="border p-2">{module.summative_assessment?.kriteria || 'Ketercapaian Tujuan Pembelajaran (TP)'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 5. Lampiran & Referensi */}
                        {(module.student_worksheet_text || module.reading_materials || (Array.isArray(module.glossary) && module.glossary.length > 0) || module.bibliography) && (
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 uppercase tracking-wider">
                                    V. TINDAK LANJUT, LAMPIRAN & REFERENSI
                                </h4>

                                {module.student_worksheet_text && (
                                    <div>
                                        <p className="font-bold text-slate-800 mb-1">A. Lembar Kerja Peserta Didik (LKPD):</p>
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed whitespace-pre-line text-xs">
                                            {module.student_worksheet_text}
                                        </div>
                                    </div>
                                )}

                                {module.reading_materials && (
                                    <div>
                                        <p className="font-bold text-slate-800 mb-1">B. Bahan Bacaan Guru & Peserta Didik:</p>
                                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed whitespace-pre-line text-xs text-slate-700">
                                            {module.reading_materials}
                                        </div>
                                    </div>
                                )}

                                {Array.isArray(module.glossary) && module.glossary.length > 0 && (
                                    <div>
                                        <p className="font-bold text-slate-800 mb-1">C. Glosarium Istilah:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                                            {module.glossary.map((item: any, idx: number) => (
                                                <li key={idx}>
                                                    {typeof item === 'string' ? item : `${item.term || item.istilah || ''}: ${item.meaning || item.definisi || ''}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {module.bibliography && (
                                    <div>
                                        <p className="font-bold text-slate-800 mb-1">D. Daftar Pustaka:</p>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed whitespace-pre-line text-xs text-slate-700">
                                            {module.bibliography}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Official Signatures Block */}
                        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 text-xs font-sans">
                            <div className="text-center">
                                <p>Mengetahui,</p>
                                <p className="font-semibold">{institution?.signature_title || 'Kepala Madrasah / Sekolah'}</p>
                                <div className="h-20 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan & Stempel ]</span>
                                </div>
                                <p className="font-bold underline text-slate-950">
                                    {institution?.principal_name || '(Nama Kepala Sekolah)'}
                                </p>
                                <p className="text-[11px] text-slate-600">
                                    NIP. {institution?.principal_id_number || '-'}
                                </p>
                            </div>

                            <div className="text-center">
                                <p>{institution?.signature_city || 'Jakarta'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="font-semibold">Guru Mata Pelajaran</p>
                                <div className="h-20 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan Guru ]</span>
                                </div>
                                <p className="font-bold underline text-slate-950">
                                    {module.user.name}
                                </p>
                                <p className="text-[11px] text-slate-600">
                                    {teacherProfile?.employee_no ? `NIP. ${teacherProfile.employee_no}` : (teacherProfile?.nuptk ? `NUPTK. ${teacherProfile.nuptk}` : 'Pendidik Resmi')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
