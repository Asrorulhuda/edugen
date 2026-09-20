import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    BookOpen,
    LayoutDashboard,
    Layers,
    FileText,
    ClipboardList,
    Award,
    Route as RouteIcon,
    School,
    Palette,
    Calendar,
    Users,
    Mail,
    Database,
    UploadCloud,
    Receipt,
    Globe,
    CreditCard,
    User as UserIcon,
    X,
    Sparkles,
    Cpu,
    Package,
    MessageSquare,
    Settings2,
} from 'lucide-react';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    isSuperAdmin?: boolean;
    isInstitutionAdmin?: boolean;
}

export default function MobileDrawer({
    isOpen,
    onClose,
    isSuperAdmin = false,
    isInstitutionAdmin = false,
}: MobileDrawerProps) {
    if (!isOpen) return null;

    const isCurrentRoute = (pattern: string) => {
        return route().current(pattern);
    };

    const { auth } = usePage<any>().props;
    const currentTenant = auth?.current_tenant;
    const institutionLogo = currentTenant?.institution?.logo_path
        ? `/storage/${currentTenant.institution.logo_path}`
        : currentTenant?.institution?.logo_url;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Blur Overlay */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Content Drawer */}
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10 animate-slide-in">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center p-0.5 shadow-sm shadow-emerald-500/10 overflow-hidden shrink-0">
                            {institutionLogo ? (
                                <img src={institutionLogo} alt="Logo" className="w-7 h-7 object-contain" />
                            ) : (
                                <ApplicationLogo className="w-7 h-7 drop-shadow-xs" />
                            )}
                        </div>
                        <div className="truncate">
                            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block truncate">
                                {currentTenant?.institution?.name || (
                                    <>EduGen <span className="text-emerald-600">KBC</span></>
                                )}
                            </span>
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">
                                {currentTenant?.institution?.type ? `${currentTenant.institution.type} • Kurikulum AI` : 'Kurikulum AI'}
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                    {/* Menu Utama */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Menu Utama
                        </div>
                        <Link
                            href={route('dashboard')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                isCurrentRoute('dashboard')
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold border-l-2 border-emerald-600'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    {/* Perangkat KBC */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Perangkat KBC
                        </div>

                        <Link
                            href={route('curriculum.cp.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.cp.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Katalog CP Nasional</span>
                        </Link>

                        <Link
                            href={route('curriculum.tp.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.tp.*')
                                ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>Bank TP</span>
                        </Link>

                        <Link
                            href={route('curriculum.atp.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.atp.*')
                                ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <RouteIcon className="w-4 h-4" />
                            <span>Alur Tujuan (ATP)</span>
                        </Link>

                        <Link
                            href={route('curriculum.modules.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.modules.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Modul Ajar / RPP KBC</span>
                        </Link>

                        <Link
                            href={route('curriculum.assessments.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.assessments.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <ClipboardList className="w-4 h-4" />
                            <span>Bank Soal & Kisi-kisi</span>
                        </Link>

                        <Link
                            href={route('curriculum.rubrics.index')}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('curriculum.rubrics.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <Award className="w-4 h-4" />
                            <span>Rubrik Panca Cinta</span>
                        </Link>
                    </div>

                    {/* Madrasah / Sekolah */}
                    {isInstitutionAdmin && (
                        <div className="space-y-1">
                            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Madrasah / Sekolah
                            </div>

                            <Link
                                href={route('institution.profile.edit')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <School className="w-4 h-4" />
                                <span>Profil & Kop Surat</span>
                            </Link>

                            <Link
                                href={route('institution.branding.edit')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Palette className="w-4 h-4" />
                                <span>Logo & Branding Kop</span>
                            </Link>

                            <Link
                                href={route('institution.academic-years.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Kalender Akademik</span>
                            </Link>

                            <Link
                                href={route('institution.teachers.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Users className="w-4 h-4" />
                                <span>Data Dewan Guru</span>
                            </Link>

                            <Link
                                href={route('institution.invitations.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Undangan Guru</span>
                            </Link>
                        </div>
                    )}

                    {/* Super Admin */}
                    {isSuperAdmin && (
                        <div className="space-y-1">
                            <div className="px-3 text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Super Admin
                            </div>

                            <Link
                                href={route('admin.clients.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            >
                                <Users className="w-4 h-4 text-amber-500" />
                                <span>Kelola Client (Guru & Sekolah)</span>
                            </Link>

                            <Link
                                href={route('admin.plans.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            >
                                <Package className="w-4 h-4 text-amber-500" />
                                <span>Konfigurasi Paket</span>
                            </Link>

                            <Link
                                href={route('admin.crm.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            >
                                <MessageSquare className="w-4 h-4 text-emerald-500" />
                                <span>CRM & WA Gateway</span>
                            </Link>

                            <Link
                                href={route('admin.learning-outcomes.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Database className="w-4 h-4" />
                                <span>Master CP Nasional</span>
                            </Link>

                            <Link
                                href={route('admin.import-cp.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span>Import CP (Excel/CSV)</span>
                            </Link>

                            <Link
                                href={route('admin.curriculum-config.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Settings2 className="w-4 h-4 text-amber-500" />
                                <span>Konfigurasi Kurikulum & Mapel</span>
                            </Link>

                            <Link
                                href={route('admin.billing.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            >
                                <Receipt className="w-4 h-4" />
                                <span>Verifikasi Langganan</span>
                            </Link>

                            <Link
                                href={route('admin.landing-page.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold"
                            >
                                <Globe className="w-4 h-4" />
                                <span>Kelola Landing Page (CMS)</span>
                            </Link>

                            <Link
                                href={route('admin.ai-settings.index')}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            >
                                <Cpu className="w-4 h-4" />
                                <span>Pengaturan AI & API</span>
                            </Link>
                        </div>
                    )}

                    {/* Akun & Langganan */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Akun & Langganan
                        </div>

                        <Link
                            href={route('billing.index')}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Paket & Tagihan</span>
                        </Link>

                        <Link
                            href={route('profile.edit')}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        >
                            <UserIcon className="w-4 h-4" />
                            <span>Pengaturan Profil</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
