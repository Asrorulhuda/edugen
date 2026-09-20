import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    FileText,
    Layers,
    Printer,
    Route as RouteIcon,
    School,
    Trash2,
} from 'lucide-react';

interface SequenceDetail {
    id: number;
    title: string;
    rationale?: string | null;
    total_hours_allocated: number;
    sequence_data: Array<{
        nomor_urut?: number;
        semester?: string;
        elemen?: string;
        tp_code: string;
        deskripsi_tp: string;
        materi_pokok: string;
        alokasi_jp: number;
        indikator_ketercapaian: string;
        dimensi_profil?: string;
        rencana_asesmen?: string;
    }>;
    status: 'DRAFT' | 'FINAL';
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
    };
    academicYear?: {
        year_name: string;
    };
    user?: {
        name: string;
        teacherProfiles?: Array<{
            nip?: string;
        }>;
    };
}

interface Institution {
    id: number;
    name: string;
    address?: string;
    npsn?: string;
    phone?: string;
    principal_name?: string;
    principal_nip?: string;
    city?: string;
}

interface Props {
    sequence: SequenceDetail;
    institution?: Institution | null;
}

export default function AtpShow({ sequence, institution }: Props) {
    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus dokumen ATP "${sequence.title}"?`)) {
            router.post(route('curriculum.atp.destroy', sequence.id), { _method: 'delete' });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('curriculum.atp.index')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Dokumen Resmi ATP
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    {sequence.status}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                                {sequence.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('curriculum.atp.print', sequence.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            Cetak Dokumen (Landscape)
                        </a>

                        <a
                            href={route('curriculum.atp.download-word', sequence.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                            <Download className="w-4 h-4" />
                            Unduh Word (.doc)
                        </a>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                            title="Hapus Dokumen"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${sequence.title} - EduGen KBC`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Meta Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 block mb-1">Mata Pelajaran</span>
                            <span className="font-bold text-slate-900 dark:text-white">{sequence.subject.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">Fase / Sasaran</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                Fase {sequence.phase.code} {sequence.grade ? `• Kelas ${sequence.grade.grade_number}` : ''}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">Tahun Pelajaran</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {sequence.academicYear?.year_name || 'Tahun Ini'}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">Total Jam Pelajaran</span>
                            <span className="font-bold text-slate-900 dark:text-white text-emerald-600">
                                {sequence.total_hours_allocated} JP
                            </span>
                        </div>
                    </div>

                    {sequence.rationale && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                Rasional & Catatan Pembelajaran:
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {sequence.rationale}
                            </p>
                        </div>
                    )}
                </div>

                {/* Table Preview */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Matriks Alur Tujuan Pembelajaran (ATP)
                        </h2>
                        <span className="text-xs text-slate-500">
                            {sequence.sequence_data?.length || 0} Unit Pembelajaran
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold">
                                <tr>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center w-12">No</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700 w-24">Semester</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700 w-28">Kode TP</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700">Tujuan Pembelajaran (TP)</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700 w-36">Materi Pokok</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center w-16">JP</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700">Indikator Ketercapaian (IKTP)</th>
                                    <th className="p-2.5 border border-slate-200 dark:border-slate-700">Profil & Panca Cinta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sequence.sequence_data?.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold">
                                            {row.nomor_urut || idx + 1}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                                String(row.semester).toLowerCase().includes('ganjil')
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                            }`}>
                                                {row.semester || 'Ganjil'}
                                            </span>
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono font-bold text-emerald-600">
                                            {row.tp_code}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 leading-relaxed">
                                            {row.deskripsi_tp}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-semibold">
                                            {row.materi_pokok}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold">
                                            {row.alokasi_jp}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 leading-relaxed">
                                            {row.indikator_ketercapaian}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                                            {row.dimensi_profil}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
