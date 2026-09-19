import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Briefcase,
    CheckCircle,
    Edit3,
    GraduationCap,
    Mail,
    Phone,
    Plus,
    Power,
    Search,
    UserCheck,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface SubjectItem {
    id: number;
    code: string;
    name: string;
}

interface GradeItem {
    id: number;
    grade_number: number;
    name: string;
    education_level_id: number;
    education_level?: {
        code: string;
        name: string;
    };
}

interface TeacherProfileItem {
    id: number;
    employee_no?: string;
    nuptk?: string;
    phone?: string;
    employment_status: 'PNS' | 'PPPK' | 'GTY' | 'GTT' | 'HONORER';
    primary_subject_id?: number;
    grade_scope?: string[] | number[];
    is_active: boolean;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    teacher_profiles?: TeacherProfileItem[];
}

interface MembershipItem {
    id: number;
    user_id: number;
    membership_status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
    user: UserItem;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    memberships: PaginatedData<MembershipItem>;
    filters: {
        search?: string;
    };
    stats: {
        active_teachers: number;
        total_teachers: number;
    };
    subjects: SubjectItem[];
    grades: GradeItem[];
}

export default function TeachersIndex({
    memberships,
    filters,
    stats,
    subjects,
    grades,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<{
        profileId: number;
        user: UserItem;
        profile: TeacherProfileItem;
    } | null>(null);

    // Form for manual teacher creation
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        employee_no: '',
        nuptk: '',
        phone: '',
        employment_status: 'GTY' as const,
        primary_subject_id: '' as string | number,
        grade_scope: [] as number[],
    });

    // Form for editing teacher
    const editForm = useForm({
        _method: 'PUT',
        name: '',
        employee_no: '',
        nuptk: '',
        phone: '',
        employment_status: 'GTY' as 'PNS' | 'PPPK' | 'GTY' | 'GTT' | 'HONORER',
        primary_subject_id: '' as string | number,
        grade_scope: [] as number[],
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('institution.teachers.index'), { search }, { preserveState: true });
    };

    const handleCreateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route('institution.teachers.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditClick = (user: UserItem, profile: TeacherProfileItem) => {
        setEditingTeacher({ profileId: profile.id, user, profile });
        editForm.setData({
            _method: 'PUT',
            name: user.name,
            employee_no: profile.employee_no || '',
            nuptk: profile.nuptk || '',
            phone: profile.phone || '',
            employment_status: profile.employment_status,
            primary_subject_id: profile.primary_subject_id || '',
            grade_scope: (profile.grade_scope as number[]) || [],
            is_active: profile.is_active,
        });
    };

    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingTeacher) return;
        editForm.post(route('institution.teachers.update', editingTeacher.profileId), {
            onSuccess: () => {
                setEditingTeacher(null);
            },
        });
    };

    const handleToggleStatus = (profileId: number, name: string, currentlyActive: boolean) => {
        const action = currentlyActive ? 'menonaktifkan' : 'mengaktifkan kembali';
        if (confirm(`Yakin ingin ${action} akun guru ${name}?`)) {
            router.post(route('institution.teachers.toggle-status', profileId));
        }
    };

    const toggleCreateGradeScope = (gradeId: number) => {
        const current = createForm.data.grade_scope as number[];
        if (current.includes(gradeId)) {
            createForm.setData('grade_scope', current.filter((id) => id !== gradeId));
        } else {
            createForm.setData('grade_scope', [...current, gradeId]);
        }
    };

    const toggleEditGradeScope = (gradeId: number) => {
        const current = editForm.data.grade_scope as number[];
        if (current.includes(gradeId)) {
            editForm.setData('grade_scope', current.filter((id) => id !== gradeId));
        } else {
            editForm.setData('grade_scope', [...current, gradeId]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <Users className="w-4 h-4" />
                            Manajemen Guru & Staf Pengajar
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Daftar Pendidik
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola profil guru, mata pelajaran yang diampu, jenjang kelas, serta status kepegawaian resmi (PNS, PPPK, GTY, GTT, Honorer).
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Guru Manual
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Guru - Admin Sekolah" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Guru Terdaftar</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.total_teachers} <span className="text-xs font-normal text-slate-400">orang</span>
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Guru Status Aktif</p>
                            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {stats.active_teachers} <span className="text-xs font-normal text-slate-400">orang aktif</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama guru atau alamat email..."
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Teachers Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    {memberships.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Belum Ada Data Guru
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                Tambahkan guru secara manual atau undang via tautan email agar para pendidik dapat mulai menyusun modul ajar.
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Guru
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-5 py-3.5">Nama & Identitas Guru</th>
                                        <th className="px-5 py-3.5">Status Kepegawaian</th>
                                        <th className="px-5 py-3.5">Mata Pelajaran & Kelas</th>
                                        <th className="px-5 py-3.5">Status Akun</th>
                                        <th className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {memberships.data.map((membership) => {
                                        const profile = membership.user.teacher_profiles?.[0];
                                        const subject = profile?.primary_subject_id
                                            ? subjects.find((s) => s.id === profile.primary_subject_id)
                                            : null;

                                        return (
                                            <tr
                                                key={membership.id}
                                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                                        {membership.user.name}
                                                    </div>
                                                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {membership.user.email}
                                                    </div>
                                                    {(profile?.employee_no || profile?.nuptk) && (
                                                        <div className="text-[10px] text-slate-400 mt-1">
                                                            {profile.employee_no && <span>NIP: {profile.employee_no} </span>}
                                                            {profile.nuptk && <span>| NUPTK: {profile.nuptk}</span>}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {profile?.employment_status || 'GTY'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-slate-800 dark:text-slate-200">
                                                        {subject ? subject.name : <span className="text-slate-400 italic">Belum diatur</span>}
                                                    </div>
                                                    {profile?.grade_scope && (profile.grade_scope as number[]).length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {(profile.grade_scope as number[]).map((gid) => {
                                                                const gr = grades.find((g) => g.id === gid);
                                                                return gr ? (
                                                                    <span
                                                                        key={gid}
                                                                        className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                                                                    >
                                                                        Kelas {gr.grade_number}
                                                                    </span>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {membership.membership_status === 'ACTIVE' ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Dinonaktifkan
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {profile && (
                                                            <button
                                                                onClick={() => handleEditClick(membership.user, profile)}
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                                title="Ubah Profil Guru"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {profile && (
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        profile.id,
                                                                        membership.user.name,
                                                                        membership.membership_status === 'ACTIVE'
                                                                    )
                                                                }
                                                                className={`p-1.5 rounded-lg transition ${
                                                                    membership.membership_status === 'ACTIVE'
                                                                        ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                                                                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                                                                }`}
                                                                title={
                                                                    membership.membership_status === 'ACTIVE'
                                                                        ? 'Nonaktifkan Akun'
                                                                        : 'Aktifkan Kembali'
                                                                }
                                                            >
                                                                <Power className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {memberships.last_page > 1 && (
                        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                Menampilkan data ke-{memberships.current_page} dari {memberships.last_page} halaman ({memberships.total} guru)
                            </div>
                            <div className="flex gap-1">
                                {memberships.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg border text-xs ${
                                            link.active
                                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        } disabled:opacity-40`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Teacher Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Tambah Akun Guru Baru
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Lengkap (dengan Gelar) *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Muhammad Ilham, S.Pd."
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                    {createForm.errors.name && <p className="text-xs text-red-500 mt-1">{createForm.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Alamat Email Akun *
                                    </label>
                                    <input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="guru@sekolah.sch.id"
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                    {createForm.errors.email && <p className="text-xs text-red-500 mt-1">{createForm.errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Status Kepegawaian *
                                    </label>
                                    <select
                                        value={createForm.data.employment_status}
                                        onChange={(e) => createForm.setData('employment_status', e.target.value as any)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                                        <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                                        <option value="PPPK">PPPK</option>
                                        <option value="GTT">GTT (Guru Tidak Tetap)</option>
                                        <option value="HONORER">Honorer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NIP (Jika PNS/PPPK)
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.employee_no}
                                        onChange={(e) => createForm.setData('employee_no', e.target.value)}
                                        placeholder="19850101..."
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NUPTK
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.nuptk}
                                        onChange={(e) => createForm.setData('nuptk', e.target.value)}
                                        placeholder="16 Digit NUPTK"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Mata Pelajaran Utama
                                    </label>
                                    <select
                                        value={createForm.data.primary_subject_id}
                                        onChange={(e) => createForm.setData('primary_subject_id', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                        {subjects.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name} ({sub.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kata Sandi Awal (Opsional)
                                    </label>
                                    <input
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        placeholder="Kosongkan untuk kata sandi acak"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Cakupan Jenjang Kelas yang Diampu
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {grades.map((gr) => {
                                        const isSelected = (createForm.data.grade_scope as number[]).includes(gr.id);
                                        return (
                                            <button
                                                type="button"
                                                key={gr.id}
                                                onClick={() => toggleCreateGradeScope(gr.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Kelas {gr.grade_number} ({gr.education_level?.code})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Akun Guru'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Teacher Modal */}
            {editingTeacher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Perbarui Profil Guru
                                </h3>
                                <p className="text-xs text-slate-500">{editingTeacher.user.email}</p>
                            </div>
                            <button
                                onClick={() => setEditingTeacher(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Lengkap Guru *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {editForm.errors.name && <p className="text-xs text-red-500 mt-1">{editForm.errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Status Kepegawaian *
                                    </label>
                                    <select
                                        value={editForm.data.employment_status}
                                        onChange={(e) => editForm.setData('employment_status', e.target.value as any)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                                        <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                                        <option value="PPPK">PPPK</option>
                                        <option value="GTT">GTT (Guru Tidak Tetap)</option>
                                        <option value="HONORER">Honorer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NIP
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.employee_no}
                                        onChange={(e) => editForm.setData('employee_no', e.target.value)}
                                        placeholder="1985..."
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NUPTK
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.nuptk}
                                        onChange={(e) => editForm.setData('nuptk', e.target.value)}
                                        placeholder="16 Digit NUPTK"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Mata Pelajaran Utama
                                    </label>
                                    <select
                                        value={editForm.data.primary_subject_id}
                                        onChange={(e) => editForm.setData('primary_subject_id', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                        {subjects.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name} ({sub.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Telepon / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        placeholder="08123456789"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Cakupan Jenjang Kelas yang Diampu
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {grades.map((gr) => {
                                        const isSelected = (editForm.data.grade_scope as number[]).includes(gr.id);
                                        return (
                                            <button
                                                type="button"
                                                key={gr.id}
                                                onClick={() => toggleEditGradeScope(gr.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Kelas {gr.grade_number} ({gr.education_level?.code})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingTeacher(null)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Data Guru'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
