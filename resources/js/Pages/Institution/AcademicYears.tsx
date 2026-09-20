import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CalendarCheck2,
    Check,
    CheckCircle2,
    Clock,
    Plus,
    School,
    Trash2,
    X,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface SemesterItem {
    id: number;
    type: 'ODD' | 'EVEN';
    label: string;
    is_active: boolean;
}

interface AcademicYearItem {
    id: number;
    label: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    semesters: SemesterItem[];
}

interface Props {
    academicYears: AcademicYearItem[];
}

export default function AcademicYears({ academicYears }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        label: '2026/2027',
        starts_at: '2026-07-01',
        ends_at: '2027-06-30',
        set_active: true,
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('institution.academic-years.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleActivateYear = (id: number) => {
        if (confirm('Aktifkan tahun ajaran ini sebagai acuan kurikulum aktif seluruh guru?')) {
            router.post(route('institution.academic-years.activate', id));
        }
    };

    const handleActivateSemester = (id: number, label: string) => {
        router.post(route('institution.semesters.activate', id));
    };

    const handleDeleteYear = (id: number, label: string) => {
        if (confirm(`Yakin ingin menghapus tahun ajaran ${label}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.post(route('institution.academic-years.destroy', id), { _method: 'delete' });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <School className="w-4 h-4" />
                            Pengaturan Lembaga & Sekolah
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Kalender & Tahun Ajaran
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Atur tahun pelajaran dan semester aktif (Ganjil/Genap) untuk sinkronisasi seluruh perangkat ajar guru.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Tahun Ajaran
                    </button>
                </div>
            }
        >
            <Head title="Tahun Ajaran - Admin Sekolah" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {academicYears.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Tahun Ajaran
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                            Tambahkan tahun ajaran pertama untuk sekolah ini agar guru dapat menyusun RPP dan Modul Ajar sesuai kalender akademik aktif.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Tahun Ajaran Sekarang
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {academicYears.map((ay) => (
                            <div
                                key={ay.id}
                                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition shadow-xs ${
                                    ay.is_active
                                        ? 'border-blue-500 ring-2 ring-blue-500/10 dark:border-blue-500'
                                        : 'border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                ay.is_active
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}
                                        >
                                            <CalendarCheck2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    Tahun Pelajaran {ay.label}
                                                </h3>
                                                {ay.is_active && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        TAHUN AKTIF
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                Periode: {ay.starts_at} s.d. {ay.ends_at}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        {!ay.is_active && (
                                            <button
                                                onClick={() => handleActivateYear(ay.id)}
                                                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                                            >
                                                Jadikan Tahun Aktif
                                            </button>
                                        )}
                                        {!ay.is_active && (
                                            <button
                                                onClick={() => handleDeleteYear(ay.id, ay.label)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                                                title="Hapus Tahun Ajaran"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Semesters List */}
                                <div className="mt-4 pt-1">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Status Semester
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {ay.semesters.map((sem) => (
                                            <div
                                                key={sem.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border ${
                                                    sem.is_active
                                                        ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800'
                                                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {sem.label}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {sem.type === 'ODD' ? 'Juli - Desember' : 'Januari - Juni'}
                                                    </p>
                                                </div>

                                                <div>
                                                    {sem.is_active ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                            <Check className="w-3 h-3" />
                                                            Sedang Berjalan
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateSemester(sem.id, sem.label)}
                                                            className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg transition"
                                                        >
                                                            Aktifkan Semester Ini
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Academic Year Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Tambah Tahun Ajaran Baru
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Label Tahun Ajaran
                                </label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Contoh: 2026/2027"
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.starts_at && <p className="text-xs text-red-500 mt-1">{errors.starts_at}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.ends_at}
                                        onChange={(e) => setData('ends_at', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.ends_at && <p className="text-xs text-red-500 mt-1">{errors.ends_at}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="set_active"
                                    type="checkbox"
                                    checked={data.set_active}
                                    onChange={(e) => setData('set_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="set_active" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Tetapkan langsung sebagai tahun ajaran aktif
                                </label>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 space-y-1">
                                <p>Sistem akan otomatis membuat:</p>
                                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                                    <li><strong>Semester Ganjil</strong> (Juli - Desember)</li>
                                    <li><strong>Semester Genap</strong> (Januari - Juni)</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Tahun Ajaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
