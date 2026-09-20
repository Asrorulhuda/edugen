import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    Copy,
    Edit,
    ExternalLink,
    Eye,
    FileText,
    Filter,
    Info,
    Layers,
    Plus,
    RotateCcw,
    Search,
    Settings2,
    Sparkles,
    Tag,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface LearningElementItem {
    id: number;
    subject_id: number;
    code: string;
    name: string;
    description: string | null;
    learning_outcomes_count?: number;
}

interface LearningOutcomeItem {
    id: number;
    subject_id: number;
    curriculum_code: string;
    learning_element_id: number | null;
    phase_id: number;
    education_level_id: number | null;
    code: string;
    cp_text: string;
    status: string;
    version: number;
    element?: { id: number; code: string; name: string };
    phase?: { id: number; code: string; name: string; level_summary: string };
    educationLevel?: { id: number; code: string; name: string };
    curriculum?: { id: number; code: string; name: string };
    subject?: { id: number; code: string; name: string };
}

interface CurriculumFramework {
    id: number;
    code: string;
    name: string;
    description: string | null;
    aliases: string[] | null;
    is_active: boolean;
    learning_outcomes_count: number;
    learning_outcomes?: LearningOutcomeItem[];
}

interface Subject {
    id: number;
    code: string;
    name: string;
    category: 'GENERAL' | 'RELIGION' | 'ARABIC' | 'VOCATIONAL' | 'LOCAL';
    education_level_scope: string[] | null;
    description: string | null;
    aliases: string[] | null;
    is_active: boolean;
    learning_outcomes_count: number;
    elements_count: number;
    elements?: LearningElementItem[];
    learning_outcomes?: LearningOutcomeItem[];
}

interface EducationLevel {
    id: number;
    code: string;
    name: string;
}

interface Props {
    curricula: CurriculumFramework[];
    subjects: Subject[];
    educationLevels: EducationLevel[];
}

export default function Index({ curricula, subjects, educationLevels }: Props) {
    const [activeTab, setActiveTab] = useState<'subjects' | 'curricula' | 'info'>('subjects');
    const [searchSubject, setSearchSubject] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    // Subject Detail Modal (Inspect CP & Elements)
    const [detailSubject, setDetailSubject] = useState<Subject | null>(null);
    const [detailSubTab, setDetailSubTab] = useState<'elements' | 'cps'>('elements');
    const [cpCurriculumFilter, setCpCurriculumFilter] = useState<string>('ALL');
    const [cpSearchText, setCpSearchText] = useState<string>('');
    const [copiedCpId, setCopiedCpId] = useState<number | null>(null);

    // Curriculum Detail Modal (Inspect CPs under Curriculum)
    const [detailCurriculum, setDetailCurriculum] = useState<CurriculumFramework | null>(null);
    const [currCpSearchText, setCurrCpSearchText] = useState<string>('');

    // Modals for CRUD
    const [curriculumModal, setCurriculumModal] = useState<{
        open: boolean;
        mode: 'create' | 'edit';
        item: CurriculumFramework | null;
    }>({ open: false, mode: 'create', item: null });

    const [subjectModal, setSubjectModal] = useState<{
        open: boolean;
        mode: 'create' | 'edit';
        item: Subject | null;
    }>({ open: false, mode: 'create', item: null });

    const [elementModal, setElementModal] = useState<{
        open: boolean;
        mode: 'create' | 'edit';
        subjectId: number;
        item: LearningElementItem | null;
    }>({ open: false, mode: 'create', subjectId: 0, item: null });

    // Forms
    const currForm = useForm({
        code: '',
        name: '',
        description: '',
        aliases: '',
        is_active: true,
    });

    const subjForm = useForm({
        code: '',
        name: '',
        category: 'GENERAL' as Subject['category'],
        education_level_scope: [] as string[],
        description: '',
        aliases: '',
        is_active: true,
    });

    const elemForm = useForm({
        subject_id: 0,
        code: '',
        name: '',
        description: '',
    });

    // Curriculum Modal Handlers
    const openCreateCurriculum = () => {
        currForm.reset();
        currForm.setData({
            code: '',
            name: '',
            description: '',
            aliases: '',
            is_active: true,
        });
        setCurriculumModal({ open: true, mode: 'create', item: null });
    };

    const openEditCurriculum = (item: CurriculumFramework) => {
        currForm.setData({
            code: item.code,
            name: item.name,
            description: item.description || '',
            aliases: item.aliases ? item.aliases.join(', ') : '',
            is_active: item.is_active,
        });
        setCurriculumModal({ open: true, mode: 'edit', item });
    };

    const handleCurriculumSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (curriculumModal.mode === 'create') {
            currForm.post(route('admin.curriculum-config.curriculum.store'), {
                onSuccess: () => setCurriculumModal({ open: false, mode: 'create', item: null }),
            });
        } else if (curriculumModal.item) {
            currForm.post(route('admin.curriculum-config.curriculum.update', curriculumModal.item.id), {
                onSuccess: () => setCurriculumModal({ open: false, mode: 'edit', item: null }),
            });
        }
    };

    // Subject Modal Handlers
    const openCreateSubject = () => {
        subjForm.reset();
        subjForm.setData({
            code: '',
            name: '',
            category: 'GENERAL',
            education_level_scope: educationLevels.map((l) => l.code),
            description: '',
            aliases: '',
            is_active: true,
        });
        setSubjectModal({ open: true, mode: 'create', item: null });
    };

    const openEditSubject = (item: Subject) => {
        subjForm.setData({
            code: item.code,
            name: item.name,
            category: item.category,
            education_level_scope: item.education_level_scope || [],
            description: item.description || '',
            aliases: item.aliases ? item.aliases.join(', ') : '',
            is_active: item.is_active,
        });
        setSubjectModal({ open: true, mode: 'edit', item });
    };

    const handleSubjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subjectModal.mode === 'create') {
            subjForm.post(route('admin.curriculum-config.subject.store'), {
                onSuccess: () => setSubjectModal({ open: false, mode: 'create', item: null }),
            });
        } else if (subjectModal.item) {
            subjForm.post(route('admin.curriculum-config.subject.update', subjectModal.item.id), {
                onSuccess: () => setSubjectModal({ open: false, mode: 'edit', item: null }),
            });
        }
    };

    // Element Modal Handlers
    const openCreateElement = (subjectId: number) => {
        elemForm.reset();
        elemForm.setData({
            subject_id: subjectId,
            code: '',
            name: '',
            description: '',
        });
        setElementModal({ open: true, mode: 'create', subjectId, item: null });
    };

    const openEditElement = (item: LearningElementItem) => {
        elemForm.setData({
            subject_id: item.subject_id,
            code: item.code,
            name: item.name,
            description: item.description || '',
        });
        setElementModal({ open: true, mode: 'edit', subjectId: item.subject_id, item });
    };

    const handleElementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (elementModal.mode === 'create') {
            elemForm.post(route('admin.curriculum-config.element.store'), {
                onSuccess: () => {
                    setElementModal({ open: false, mode: 'create', subjectId: 0, item: null });
                    // Refresh current detail subject if open
                    if (detailSubject) {
                        const updated = subjects.find((s) => s.id === detailSubject.id);
                        if (updated) setDetailSubject(updated);
                    }
                },
            });
        } else if (elementModal.item) {
            elemForm.post(route('admin.curriculum-config.element.update', elementModal.item.id), {
                onSuccess: () => {
                    setElementModal({ open: false, mode: 'edit', subjectId: 0, item: null });
                    if (detailSubject) {
                        const updated = subjects.find((s) => s.id === detailSubject.id);
                        if (updated) setDetailSubject(updated);
                    }
                },
            });
        }
    };

    const handleDeleteElement = (element: LearningElementItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus elemen "${element.name}" (${element.code})?`)) {
            router.post(route('admin.curriculum-config.element.destroy', element.id), { _method: 'delete' }, {
                onSuccess: () => {
                    if (detailSubject) {
                        const updated = subjects.find((s) => s.id === detailSubject.id);
                        if (updated) setDetailSubject(updated);
                    }
                },
            });
        }
    };

    // Open detail inspector for subject
    const openSubjectDetail = (subject: Subject, tab: 'elements' | 'cps' = 'elements') => {
        setDetailSubject(subject);
        setDetailSubTab(tab);
        setCpCurriculumFilter('ALL');
        setCpSearchText('');
    };

    // Copy CP text helper
    const handleCopyCp = (id: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCpId(id);
        setTimeout(() => setCopiedCpId(null), 2000);
    };

    const filteredSubjects = subjects.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(searchSubject.toLowerCase()) ||
            s.code.toLowerCase().includes(searchSubject.toLowerCase()) ||
            (s.aliases && s.aliases.some((a) => a.toLowerCase().includes(searchSubject.toLowerCase())));
        const matchCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const categoryBadge = (cat: Subject['category']) => {
        switch (cat) {
            case 'RELIGION':
                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Pendidikan Agama Islam
                    </span>
                );
            case 'ARABIC':
                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        Bahasa Arab
                    </span>
                );
            case 'VOCATIONAL':
                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                        Kejuruan
                    </span>
                );
            case 'LOCAL':
                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Muatan Lokal
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                        Umum
                    </span>
                );
        }
    };

    // Filter CPs inside subject detail
    const filteredSubjectCps = (detailSubject?.learning_outcomes || []).filter((cp) => {
        const matchCurr = cpCurriculumFilter === 'ALL' || cp.curriculum_code === cpCurriculumFilter;
        const matchText =
            !cpSearchText ||
            cp.code.toLowerCase().includes(cpSearchText.toLowerCase()) ||
            cp.cp_text.toLowerCase().includes(cpSearchText.toLowerCase()) ||
            (cp.phase?.name && cp.phase.name.toLowerCase().includes(cpSearchText.toLowerCase())) ||
            (cp.element?.name && cp.element.name.toLowerCase().includes(cpSearchText.toLowerCase()));
        return matchCurr && matchText;
    });

    // Filter CPs inside curriculum detail
    const filteredCurriculumCps = (detailCurriculum?.learning_outcomes || []).filter((cp) => {
        return (
            !currCpSearchText ||
            cp.code.toLowerCase().includes(currCpSearchText.toLowerCase()) ||
            cp.cp_text.toLowerCase().includes(currCpSearchText.toLowerCase()) ||
            (cp.subject?.name && cp.subject.name.toLowerCase().includes(currCpSearchText.toLowerCase())) ||
            (cp.phase?.name && cp.phase.name.toLowerCase().includes(currCpSearchText.toLowerCase()))
        );
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                            <Settings2 className="w-3.5 h-3.5" />
                            <span>Super Admin Master Hub</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Konfigurasi Kurikulum & Mata Pelajaran
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola kerangka kurikulum, mata pelajaran, serta periksa detail Capaian Pembelajaran (CP) dan elemen kompetensinya.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.get(route('admin.learning-outcomes.index'))}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            <span>Buka Master CP Nasional</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Konfigurasi Kurikulum & Mapel - Super Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
                {/* Information Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                            Pusat Eksplorasi & Konfigurasi Dinamis CP & Elemen
                        </p>
                        <p className="mt-0.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Anda dapat mengklik jumlah <strong>Data CP</strong> atau <strong>Elemen</strong> pada setiap baris mata pelajaran untuk memeriksa detail teks CP, fase, jenjang, dan elemen secara mendalam tanpa harus membuka halaman lain.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('subjects')}
                        className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                            activeTab === 'subjects'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Mata Pelajaran ({subjects.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('curricula')}
                        className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                            activeTab === 'curricula'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        <span>Kerangka Kurikulum ({curricula.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                            activeTab === 'info'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Info className="w-4 h-4" />
                        <span>Panduan & Aturan Alias</span>
                    </button>
                </div>

                {/* TAB 1: SUBJECTS */}
                {activeTab === 'subjects' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-72">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari kode, nama, atau alias mapel..."
                                        value={searchSubject}
                                        onChange={(e) => setSearchSubject(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                    />
                                </div>

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                >
                                    <option value="ALL">Semua Kategori</option>
                                    <option value="GENERAL">Umum</option>
                                    <option value="RELIGION">PAI / Agama</option>
                                    <option value="ARABIC">Bahasa Arab</option>
                                    <option value="VOCATIONAL">Kejuruan</option>
                                    <option value="LOCAL">Muatan Lokal</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={openCreateSubject}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Mapel Baru</span>
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase">
                                            <th className="p-3.5">Kode Resmi</th>
                                            <th className="p-3.5">Nama Mata Pelajaran</th>
                                            <th className="p-3.5">Kategori</th>
                                            <th className="p-3.5">Alias Import</th>
                                            <th className="p-3.5 text-center">Data CP</th>
                                            <th className="p-3.5 text-center">Elemen</th>
                                            <th className="p-3.5 text-center">Status</th>
                                            <th className="p-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredSubjects.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-slate-400">
                                                    Tidak ada mata pelajaran yang cocok dengan filter.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredSubjects.map((s) => (
                                                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                                                        {s.code}
                                                    </td>
                                                    <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                                                        {s.name}
                                                    </td>
                                                    <td className="p-3.5">{categoryBadge(s.category)}</td>
                                                    <td className="p-3.5">
                                                        {s.aliases && s.aliases.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {s.aliases.map((alias, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                                                                    >
                                                                        {alias}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-[11px]">-</span>
                                                        )}
                                                    </td>

                                                    {/* Data CP Clickable Badge */}
                                                    <td className="p-3.5 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => openSubjectDetail(s, 'cps')}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                                                s.learning_outcomes_count > 0
                                                                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-pointer'
                                                            }`}
                                                            title="Klik untuk melihat detail seluruh Capaian Pembelajaran (CP) mapel ini"
                                                        >
                                                            <span>{s.learning_outcomes_count} CP</span>
                                                            <Eye className="w-3 h-3 opacity-60" />
                                                        </button>
                                                    </td>

                                                    {/* Elemen Clickable Badge */}
                                                    <td className="p-3.5 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => openSubjectDetail(s, 'elements')}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                                                s.elements_count > 0
                                                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-pointer'
                                                            }`}
                                                            title="Klik untuk memeriksa & mengelola elemen pembelajaran mapel ini"
                                                        >
                                                            <span>{s.elements_count} Elemen</span>
                                                            <Eye className="w-3 h-3 opacity-60" />
                                                        </button>
                                                    </td>

                                                    <td className="p-3.5 text-center">
                                                        {s.is_active ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                                                <XCircle className="w-3.5 h-3.5" /> Nonaktif
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="p-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openSubjectDetail(s, 'elements')}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition text-[11px] font-semibold"
                                                                title="Cek Detail CP & Elemen"
                                                            >
                                                                <Eye className="w-3.5 h-3.5 text-amber-500" />
                                                                <span className="hidden sm:inline">Detail</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openEditSubject(s)}
                                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                                                                title="Edit Mapel & Alias"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: CURRICULA */}
                {activeTab === 'curricula' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-slate-500">
                                Daftar kerangka kurikulum yang aktif dalam platform. Klik untuk melihat daftar CP di bawah kurikulum tersebut.
                            </p>
                            <button
                                type="button"
                                onClick={openCreateCurriculum}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Kurikulum Baru</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {curricula.map((curr) => (
                                <div
                                    key={curr.id}
                                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    {curr.code}
                                                </span>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                                                    {curr.name}
                                                </h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => openEditCurriculum(curr)}
                                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                                                title="Edit Kurikulum"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {curr.description || 'Tidak ada deskripsi.'}
                                        </p>

                                        <div className="pt-2">
                                            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                                                Alias Kode untuk Import CSV:
                                            </span>
                                            {curr.aliases && curr.aliases.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {curr.aliases.map((alias, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                                                        >
                                                            {alias}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum ada alias khusus</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDetailCurriculum(curr);
                                                setCurrCpSearchText('');
                                            }}
                                            className="inline-flex items-center gap-1.5 font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Lihat {curr.learning_outcomes_count} CP Terdaftar</span>
                                        </button>

                                        <span
                                            className={`font-semibold ${
                                                curr.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                            }`}
                                        >
                                            {curr.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 3: INFO */}
                {activeTab === 'info' && (
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-4 h-4 text-amber-500" />
                            Cara Kerja Pemetaan Otomatis (Alias) Saat Import CP
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Ketika guru atau admin mengunggah file CSV Capaian Pembelajaran, sistem akan mencocokkan kolom <code>curriculum_code</code> dan <code>subject_code</code>:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>
                                <strong>Pencocokan Kode Utama:</strong> Sistem pertama-tama mengecek apakah kode sesuai dengan kode resmi (contoh: <code>MERDEKA</code>, <code>MADRASAH_KBC</code>, <code>BIN</code>, <code>FIQ</code>).
                            </li>
                            <li>
                                <strong>Pencocokan Alias:</strong> Jika tidak ditemukan, sistem mengecek daftar alias yang dikonfigurasi di halaman ini (contoh: <code>KBC</code> otomatis dipetakan ke <code>MADRASAH_KBC</code>, dan <code>FIK</code> otomatis dipetakan ke <code>FIQ</code>).
                            </li>
                            <li>
                                <strong>Elemen Pembelajaran Fleksibel:</strong> Jika file CSV mencantumkan kode elemen baru (seperti <code>AA-ADAB</code>, <code>AA-KISAH</code>, <code>AA-KP</code>, <code>QH-TAJWID</code>), sistem akan otomatis mendaftarkannya ke database pada mata pelajaran tersebut tanpa menolak atau mengosongkan baris import.
                            </li>
                        </ol>
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: DETAIL SUBJECT (CHECK CP & ELEMENTS)                             */}
            {/* ========================================================================= */}
            {detailSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                                        {detailSubject.code}
                                    </span>
                                    {categoryBadge(detailSubject.category)}
                                    {detailSubject.aliases && detailSubject.aliases.length > 0 && (
                                        <span className="text-[11px] text-slate-500 font-mono">
                                            Alias: {detailSubject.aliases.join(', ')}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {detailSubject.name}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tinjau seluruh daftar elemen kompetensi dan rujukan teks Capaian Pembelajaran resmi.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDetailSubject(null)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Subtabs: Elemen vs CP */}
                        <div className="flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setDetailSubTab('elements')}
                                    className={`py-3.5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                                        detailSubTab === 'elements'
                                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Layers className="w-4 h-4" />
                                    <span>Elemen Pembelajaran ({detailSubject.elements?.length || 0})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDetailSubTab('cps')}
                                    className={`py-3.5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                                        detailSubTab === 'cps'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Daftar Capaian Pembelajaran (CP) ({detailSubject.learning_outcomes?.length || 0})</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={route('admin.learning-outcomes.index', { subject_id: detailSubject.id })}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    <span>Buka di Master CP</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {/* SUBTAB 1: ELEMENTS */}
                            {detailSubTab === 'elements' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-slate-500">
                                            Elemen kompetensi merupakan domain/aspek materi utama dalam mata pelajaran ini.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => openCreateElement(detailSubject.id)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition shrink-0"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Tambah Elemen</span>
                                        </button>
                                    </div>

                                    {(!detailSubject.elements || detailSubject.elements.length === 0) ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Belum Ada Elemen Pembelajaran Terdaftar
                                            </p>
                                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                                Mata pelajaran ini belum memiliki elemen. Anda dapat menambahkannya manual melalui tombol di atas atau mengunggah file CSV CP.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {detailSubject.elements.map((elem) => (
                                                <div
                                                    key={elem.id}
                                                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-2"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                                                                {elem.code}
                                                            </span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                                                {elem.learning_outcomes_count ?? 0} CP Menggunakan
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                                                            {elem.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            {elem.description || 'Tidak ada deskripsi elemen.'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-2 text-xs">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditElement(elem)}
                                                            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                                            title="Edit Elemen"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={(elem.learning_outcomes_count ?? 0) > 0}
                                                            onClick={() => handleDeleteElement(elem)}
                                                            className={`p-1 rounded-md transition ${
                                                                (elem.learning_outcomes_count ?? 0) > 0
                                                                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                                    : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                                                            }`}
                                                            title={
                                                                (elem.learning_outcomes_count ?? 0) > 0
                                                                    ? 'Tidak dapat dihapus karena masih digunakan oleh CP'
                                                                    : 'Hapus Elemen'
                                                            }
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SUBTAB 2: CPS */}
                            {detailSubTab === 'cps' && (
                                <div className="space-y-4">
                                    {/* Filters Bar for CPs */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <div className="relative flex-1 w-full sm:w-auto">
                                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Cari kode CP, kata dalam teks CP, atau fase..."
                                                value={cpSearchText}
                                                onChange={(e) => setCpSearchText(e.target.value)}
                                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <select
                                                value={cpCurriculumFilter}
                                                onChange={(e) => setCpCurriculumFilter(e.target.value)}
                                                className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="ALL">Semua Kurikulum</option>
                                                <option value="MERDEKA">Kurikulum Merdeka</option>
                                                <option value="MADRASAH_KBC">Kurikulum Madrasah (KBC)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* CP Items List */}
                                    {filteredSubjectCps.length === 0 ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Tidak Ada CP yang Sesuai
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Belum ada rujukan CP yang cocok dengan kata kunci atau kurikulum yang dipilih.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredSubjectCps.map((cp) => {
                                                const isMadrasah = cp.curriculum_code === 'MADRASAH_KBC';
                                                return (
                                                    <div
                                                        key={cp.id}
                                                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 shadow-2xs space-y-3 transition"
                                                    >
                                                        {/* Header Badges */}
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <span
                                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                                        isMadrasah
                                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                                                    }`}
                                                                >
                                                                    {isMadrasah ? 'Kurikulum Madrasah (KBC)' : 'Kurikulum Merdeka'}
                                                                </span>

                                                                {cp.educationLevel && (
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                                        {cp.educationLevel.code}
                                                                    </span>
                                                                )}

                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                                    {cp.phase?.name} ({cp.phase?.level_summary})
                                                                </span>

                                                                {cp.element && (
                                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                        Elemen: {cp.element.name}
                                                                    </span>
                                                                )}

                                                                <span
                                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                                        cp.status === 'PUBLISHED'
                                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                                    }`}
                                                                >
                                                                    {cp.status}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                                                    {cp.code} (v{cp.version})
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopyCp(cp.id, cp.cp_text)}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                                                                >
                                                                    {copiedCpId === cp.id ? (
                                                                        <>
                                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                                            <span className="text-emerald-600">Tersalin</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="w-3 h-3" />
                                                                            <span>Salin</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Official CP Text */}
                                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
                                                            "{cp.cp_text}"
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: DETAIL CURRICULUM (CHECK ALL CPS UNDER CURRICULUM)               */}
            {/* ========================================================================= */}
            {detailCurriculum && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                                        {detailCurriculum.code}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">
                                        Total: {detailCurriculum.learning_outcomes_count} Capaian Pembelajaran
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {detailCurriculum.name}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Daftar lengkap teks Capaian Pembelajaran terdaftar di bawah kerangka kurikulum ini.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDetailCurriculum(null)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari mapel, kode CP, teks capaian pembelajaran, atau fase..."
                                    value={currCpSearchText}
                                    onChange={(e) => setCurrCpSearchText(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        {/* CP List */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-3">
                            {filteredCurriculumCps.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                    Tidak ada CP yang cocok dengan kata kunci pencarian.
                                </div>
                            ) : (
                                filteredCurriculumCps.map((cp) => (
                                    <div
                                        key={cp.id}
                                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                    {cp.subject?.name} ({cp.subject?.code})
                                                </span>

                                                {cp.educationLevel && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                        {cp.educationLevel.code}
                                                    </span>
                                                )}

                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {cp.phase?.name}
                                                </span>

                                                {cp.element && (
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        Elemen: {cp.element.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                                    {cp.code}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyCp(cp.id, cp.cp_text)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                                                >
                                                    {copiedCpId === cp.id ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                            <span className="text-emerald-600">Tersalin</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span>Salin</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
                                            "{cp.cp_text}"
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 3: ELEMENT CREATE / EDIT                                            */}
            {/* ========================================================================= */}
            {elementModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {elementModal.mode === 'create' ? 'Tambah Elemen Pembelajaran' : 'Edit Elemen Pembelajaran'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setElementModal({ open: false, mode: 'create', subjectId: 0, item: null })}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleElementSubmit} className="space-y-4 text-xs">
                            {elementModal.mode === 'create' && (
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kode Elemen (Unik, Kapital)
                                    </label>
                                    <input
                                        type="text"
                                        value={elemForm.data.code}
                                        onChange={(e) => elemForm.setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. QH-TAJWID, BIN-SIMAK"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                        required
                                    />
                                    {elemForm.errors.code && (
                                        <p className="text-rose-500 mt-1">{elemForm.errors.code}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Elemen
                                </label>
                                <input
                                    type="text"
                                    value={elemForm.data.name}
                                    onChange={(e) => elemForm.setData('name', e.target.value)}
                                    placeholder="e.g. Tajwid, Menyimak, Al-Qur'an"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                />
                                {elemForm.errors.name && (
                                    <p className="text-rose-500 mt-1">{elemForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi / Lingkup Elemen (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={elemForm.data.description}
                                    onChange={(e) => elemForm.setData('description', e.target.value)}
                                    placeholder="Penjelasan ringkas mengenai kompetensi elemen ini..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setElementModal({ open: false, mode: 'create', subjectId: 0, item: null })}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={elemForm.processing}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50"
                                >
                                    {elemForm.processing ? 'Menyimpan...' : 'Simpan Elemen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 4: CURRICULUM CREATE / EDIT                                         */}
            {/* ========================================================================= */}
            {curriculumModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {curriculumModal.mode === 'create' ? 'Tambah Kerangka Kurikulum' : 'Edit Kurikulum & Alias'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCurriculumModal({ open: false, mode: 'create', item: null })}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCurriculumSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Kode Kurikulum (Huruf Kapital, Unik)
                                </label>
                                <input
                                    type="text"
                                    disabled={curriculumModal.mode === 'edit'}
                                    value={currForm.data.code}
                                    onChange={(e) => currForm.setData('code', e.target.value.toUpperCase())}
                                    placeholder="e.g. MADRASAH_KBC"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 font-mono"
                                    required
                                />
                                {currForm.errors.code && (
                                    <p className="text-rose-500 mt-1">{currForm.errors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Lengkap Kurikulum
                                </label>
                                <input
                                    type="text"
                                    value={currForm.data.name}
                                    onChange={(e) => currForm.setData('name', e.target.value)}
                                    placeholder="e.g. Kurikulum Madrasah (KBC)"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Daftar Alias Kode (Pisahkan dengan koma)
                                </label>
                                <input
                                    type="text"
                                    value={currForm.data.aliases}
                                    onChange={(e) => currForm.setData('aliases', e.target.value)}
                                    placeholder="e.g. KBC, MADRASAH, KMA_1503"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                />
                                <span className="text-[11px] text-slate-400 block mt-1">
                                    Bila file CSV menggunakan kode ini, sistem akan otomatis mencocokkannya ke kurikulum ini.
                                </span>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    rows={2}
                                    value={currForm.data.description}
                                    onChange={(e) => currForm.setData('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="curr_is_active"
                                    checked={currForm.data.is_active}
                                    onChange={(e) => currForm.setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                />
                                <label htmlFor="curr_is_active" className="text-slate-700 dark:text-slate-300">
                                    Status Aktif
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setCurriculumModal({ open: false, mode: 'create', item: null })}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={currForm.processing}
                                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition disabled:opacity-50"
                                >
                                    {currForm.processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 5: SUBJECT CREATE / EDIT                                            */}
            {/* ========================================================================= */}
            {subjectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {subjectModal.mode === 'create' ? 'Tambah Mata Pelajaran Baru' : 'Edit Mapel & Alias'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSubjectModal({ open: false, mode: 'create', item: null })}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubjectSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kode Resmi (Singkat)
                                    </label>
                                    <input
                                        type="text"
                                        disabled={subjectModal.mode === 'edit'}
                                        value={subjForm.data.code}
                                        onChange={(e) => subjForm.setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. FIQ"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 font-mono"
                                        required
                                    />
                                    {subjForm.errors.code && (
                                        <p className="text-rose-500 mt-1">{subjForm.errors.code}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori Mapel
                                    </label>
                                    <select
                                        value={subjForm.data.category}
                                        onChange={(e) => subjForm.setData('category', e.target.value as any)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="GENERAL">Umum</option>
                                        <option value="RELIGION">PAI / Agama</option>
                                        <option value="ARABIC">Bahasa Arab</option>
                                        <option value="VOCATIONAL">Kejuruan</option>
                                        <option value="LOCAL">Muatan Lokal</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Lengkap Mata Pelajaran
                                </label>
                                <input
                                    type="text"
                                    value={subjForm.data.name}
                                    onChange={(e) => subjForm.setData('name', e.target.value)}
                                    placeholder="e.g. Fikih"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Daftar Alias Kode (Pisahkan dengan koma)
                                </label>
                                <input
                                    type="text"
                                    value={subjForm.data.aliases}
                                    onChange={(e) => subjForm.setData('aliases', e.target.value)}
                                    placeholder="e.g. FIK, FIQIH"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                />
                                <span className="text-[11px] text-slate-400 block mt-1">
                                    Contoh: jika file CSV bertuliskan <code>FIK</code>, sistem akan otomatis mencocokkan ke mapel <code>FIQ</code> ini.
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="subj_is_active"
                                    checked={subjForm.data.is_active}
                                    onChange={(e) => subjForm.setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                />
                                <label htmlFor="subj_is_active" className="text-slate-700 dark:text-slate-300">
                                    Status Aktif
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setSubjectModal({ open: false, mode: 'create', item: null })}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={subjForm.processing}
                                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition disabled:opacity-50"
                                >
                                    {subjForm.processing ? 'Menyimpan...' : 'Simpan Mapel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
