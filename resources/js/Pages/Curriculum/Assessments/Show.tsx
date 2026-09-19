import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Edit3,
    FileText,
    Key,
    Layers,
    ListFilter,
    Printer,
    School,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AssessmentExamTab from './Components/AssessmentExamTab';
import AssessmentKeyTab from './Components/AssessmentKeyTab';
import AssessmentLetterhead from './Components/AssessmentLetterhead';
import AssessmentMatrixTab from './Components/AssessmentMatrixTab';
import AssessmentSignature from './Components/AssessmentSignature';
import { AssessmentPackageDetail, Institution } from './types';

interface Props {
    package: AssessmentPackageDetail;
    institution?: Institution | null;
}

export default function AssessmentShow({ package: pkg, institution }: Props) {
    const [activeTab, setActiveTab] = useState<'EXAM' | 'MATRIX' | 'KEY'>('EXAM');

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus Paket Asesmen "${pkg.title}"?`)) {
            router.delete(route('curriculum.assessments.destroy', pkg.id));
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'FORMATIF':
                return 'Formatif';
            case 'SUMATIF_LINGKUP_MATERI':
                return 'Sumatif Lingkup Materi';
            case 'SUMATIF_AKHIR_SEMESTER':
                return 'Sumatif Akhir Semester';
            case 'SUMATIF_AKHIR_FASE':
                return 'Sumatif Akhir Fase';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                            <Link
                                href={route('curriculum.assessments.index')}
                                className="inline-flex items-center gap-1 hover:underline text-slate-500"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Bank Soal
                            </Link>
                            <span>/</span>
                            <span>{pkg.subject?.name}</span>
                            <span>/</span>
                            <span className="text-slate-800 dark:text-slate-200">
                                {pkg.phase?.name} (Kelas {pkg.grade?.grade_number})
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {pkg.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                                <School className="w-3.5 h-3.5" />
                                {institution?.name || 'Satuan Pendidikan'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {pkg.duration_minutes} Menit
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" />
                                {pkg.total_questions} Butir Soal
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 print:hidden">
                        <Link
                            href={route('curriculum.assessments.edit', pkg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Soal
                        </Link>

                        <a
                            href={route('curriculum.assessments.download-word', pkg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Word (.doc)
                        </a>

                        <a
                            href={route('curriculum.assessments.print-soal', pkg.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Naskah
                        </a>

                        <button
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            title="Hapus Asesmen"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${pkg.title} - EduGen`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Mode Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl mb-6 w-fit print:hidden">
                    <button
                        onClick={() => setActiveTab('EXAM')}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                            activeTab === 'EXAM'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Naskah Soal
                    </button>
                    <button
                        onClick={() => setActiveTab('MATRIX')}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                            activeTab === 'MATRIX'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        <ListFilter className="w-3.5 h-3.5" />
                        Kisi-kisi Matriks
                    </button>
                    <button
                        onClick={() => setActiveTab('KEY')}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                            activeTab === 'KEY'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        <Key className="w-3.5 h-3.5" />
                        Kunci & Pembahasan
                    </button>
                </div>

                {/* Printable Document Paper Container */}
                <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 font-serif print:border-none print:shadow-none print:p-0 print:m-0 print:text-black">
                    {/* Official Letterhead (Kop Surat) */}
                    <AssessmentLetterhead
                        institution={institution}
                        curriculumCode={pkg.curriculum_code}
                    />

                    {/* TAB 1: Naskah Soal Siswa */}
                    {activeTab === 'EXAM' && (
                        <AssessmentExamTab
                            package={pkg}
                            typeName={getTypeName(pkg.assessment_type)}
                        />
                    )}

                    {/* TAB 2: Kisi-kisi Asesmen (Matrix) */}
                    {activeTab === 'MATRIX' && (
                        <AssessmentMatrixTab package={pkg} />
                    )}

                    {/* TAB 3: Kunci Jawaban & Pembahasan */}
                    {activeTab === 'KEY' && (
                        <AssessmentKeyTab package={pkg} />
                    )}

                    {/* Official Signature Footer (Tanda Tangan Tunggal Resmi) */}
                    <AssessmentSignature
                        institution={institution}
                        package={pkg}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
