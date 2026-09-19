import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    Printer,
    School,
    Sparkles,
    Trash2,
} from 'lucide-react';

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

interface AssessmentRubricDetail {
    id: number;
    title: string;
    rubric_type: string;
    description?: string | null;
    scoring_guidelines?: string | null;
    dimensions_data: DimensionItem[];
    created_at: string;
    subject: {
        code: string;
        name: string;
    };
    phase: {
        code: string;
        name: string;
    };
    grade?: {
        grade_number: number;
        name: string;
    } | null;
    user: {
        name: string;
        teacherProfiles?: Array<{
            nip?: string;
        }>;
    };
}

interface Institution {
    id: number;
    name: string;
    npsn?: string;
    nsm?: string;
    level?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_path?: string;
    letterhead_top_line?: string;
    letterhead_middle_line?: string;
    letterhead_bottom_line?: string;
}

interface Props {
    rubric: AssessmentRubricDetail;
    institution?: Institution | null;
}

export default function RubricShow({ rubric, institution }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus Rubrik "${rubric.title}"?`)) {
            router.delete(route('curriculum.rubrics.destroy', rubric.id));
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'SIKAP_PANCA_CINTA':
                return 'Sikap Panca Cinta';
            case 'KINERJA_UNJUK_KERJA':
                return 'Kinerja / Unjuk Kerja';
            case 'PROYEK_KOLABORATIF':
                return 'Proyek Kolaboratif';
            case 'PORTOFOLIO_REFLEKTIF':
                return 'Portofolio Reflektif';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.rubrics.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                {getTypeName(rubric.rubric_type)}
                            </span>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                                {rubric.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            Cetak / Unduh PDF
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition"
                            title="Hapus Rubrik"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${rubric.title} - Rubrik KBC EduGen`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
                {/* Printable Document Sheet */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm print:p-0 print:border-none print:shadow-none text-slate-900 dark:text-slate-100">
                    {/* Official Kop Surat */}
                    <div className="border-b-4 border-double border-slate-800 dark:border-slate-200 pb-4 mb-6">
                        <div className="flex items-center gap-4">
                            {institution?.logo_path ? (
                                <img
                                    src={`/storage/${institution.logo_path}`}
                                    alt="Logo"
                                    className="w-20 h-20 object-contain shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 font-bold text-2xl">
                                    <School className="w-8 h-8" />
                                </div>
                            )}

                            <div className="flex-1 text-center">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    {institution?.letterhead_top_line || 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'}
                                </h3>
                                <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 dark:text-white tracking-wide">
                                    {institution?.letterhead_middle_line || institution?.name || 'MADRASAH / SEKOLAH KBC'}
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                    {institution?.letterhead_bottom_line || institution?.address || 'Jl. Pendidikan Karakter No. 1, Jakarta'}
                                </p>
                                {(institution?.phone || institution?.email) && (
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Telp: {institution.phone || '-'} | Email: {institution.email || '-'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title & Metadata */}
                    <div className="text-center mb-6">
                        <h2 className="text-base font-bold uppercase tracking-wide">
                            RUBRIK PENILAIAN AUTENTIK & OBSERVASI SIKAP (KBC)
                        </h2>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                            {rubric.title}
                        </h3>
                    </div>

                    {/* Meta Box */}
                    <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-xs grid grid-cols-2 gap-y-2 mb-6">
                        <div>
                            <span className="font-semibold text-slate-500 mr-2">Mata Pelajaran:</span>
                            <span className="font-bold">{rubric.subject?.name}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-slate-500 mr-2">Tipe Rubrik:</span>
                            <span className="font-bold">{getTypeName(rubric.rubric_type)}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-slate-500 mr-2">Fase / Sasaran:</span>
                            <span>
                                {rubric.phase?.name}
                                {rubric.grade ? ` / Kelas ${rubric.grade.grade_number}` : ''}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-slate-500 mr-2">Guru Pengampu:</span>
                            <span>{rubric.user?.name}</span>
                        </div>
                    </div>

                    {/* Description & Guidelines */}
                    {(rubric.description || rubric.scoring_guidelines) && (
                        <div className="space-y-3 mb-6 text-xs">
                            {rubric.description && (
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                        Deskripsi Operasional:
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {rubric.description}
                                    </p>
                                </div>
                            )}

                            {rubric.scoring_guidelines && (
                                <div className="bg-purple-50/40 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                                    <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">
                                        Pedoman Konversi Nilai:
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {rubric.scoring_guidelines}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rubric Matrix Table */}
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full text-xs text-left border-collapse border border-slate-300 dark:border-slate-700">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-1/4">
                                        Dimensi / Aspek
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-1/5 text-rose-800 dark:text-rose-400">
                                        Perlu Bimbingan (1)
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-1/5 text-amber-800 dark:text-amber-400">
                                        Cukup (2)
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-1/5 text-blue-800 dark:text-blue-400">
                                        Baik (3)
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-1/5 text-emerald-800 dark:text-emerald-400">
                                        Sangat Baik (4)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rubric.dimensions_data?.map((dim, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="border border-slate-300 dark:border-slate-700 p-2.5 align-top">
                                            <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                                                {dim.name}
                                            </strong>
                                            <span className="text-[11px] text-slate-500 block">
                                                Fokus: {dim.aspect}
                                            </span>
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 p-2.5 align-top text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {dim.descriptors?.perlu_bimbingan}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 p-2.5 align-top text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {dim.descriptors?.cukup}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 p-2.5 align-top text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {dim.descriptors?.baik}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 p-2.5 align-top text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                            {dim.descriptors?.sangat_baik}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Signatures */}
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 text-xs text-center">
                        <div>
                            <p className="text-slate-500 mb-16">Mengetahui,<br />Kepala Madrasah / Sekolah</p>
                            <p className="font-bold underline uppercase">
                                ( ..................................................... )
                            </p>
                            <p className="text-slate-400 text-[10px]">NIP. -</p>
                        </div>

                        <div>
                            <p className="text-slate-500 mb-16">
                                Jakarta, {new Date(rubric.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                                Guru Mata Pelajaran
                            </p>
                            <p className="font-bold underline uppercase">
                                {rubric.user?.name}
                            </p>
                            <p className="text-slate-400 text-[10px]">
                                NIP. {rubric.user?.teacherProfiles?.[0]?.nip || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
