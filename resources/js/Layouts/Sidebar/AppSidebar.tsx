import { Link } from '@inertiajs/react';
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
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Cpu,
    Package,
    MessageSquare,
    Settings2,
} from 'lucide-react';

interface AppSidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isSuperAdmin?: boolean;
    isInstitutionAdmin?: boolean;
    currentTenant?: any;
}

export default function AppSidebar({
    isCollapsed,
    onToggleCollapse,
    isSuperAdmin = false,
    isInstitutionAdmin = false,
    currentTenant,
}: AppSidebarProps) {
    const isCurrentRoute = (pattern: string) => {
        return route().current(pattern);
    };

    const institutionLogo = currentTenant?.institution?.logo_path
        ? `/storage/${currentTenant.institution.logo_path}`
        : currentTenant?.institution?.logo_url;

    return (
        <aside
            className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out select-none z-30 sticky top-0 h-screen ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Sidebar Brand Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <Link
                    href="/"
                    className={`flex items-center gap-3 group overflow-hidden ${
                        isCollapsed ? 'justify-center w-full' : ''
                    }`}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center p-1 shadow-sm shadow-emerald-500/10 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                        {institutionLogo ? (
                            <img src={institutionLogo} alt="Logo" className="w-8 h-8 object-contain" />
                        ) : (
                            <ApplicationLogo className="w-8 h-8 drop-shadow-xs" />
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="truncate">
                            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent block truncate">
                                {currentTenant?.institution?.name ? currentTenant.institution.name : (
                                    <>EduGen <span className="text-emerald-600 dark:text-emerald-400">KBC</span></>
                                )}
                            </span>
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">
                                {currentTenant?.institution?.type ? `${currentTenant.institution.type} • Kurikulum AI` : 'Kurikulum AI'}
                            </span>
                        </div>
                    )}
                </Link>

                {!isCollapsed && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                        title="Ciutkan Sidebar"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Navigation Menu Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {/* Section: Menu Utama */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Menu Utama
                        </div>
                    )}
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            isCurrentRoute('dashboard')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-600 dark:border-emerald-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Dashboard' : undefined}
                    >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                </div>

                {/* Section: Perangkat KBC */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Perangkat KBC
                        </div>
                    )}

                    <Link
                        href={route('curriculum.cp.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.cp.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Katalog CP Nasional' : undefined}
                    >
                        <BookOpen className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Katalog CP Nasional</span>}
                    </Link>

                    <Link
                        href={route('curriculum.tp.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.tp.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Bank TP' : undefined}
                    >
                        <Layers className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Bank TP</span>}
                    </Link>

                    <Link
                        href={route('curriculum.atp.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.atp.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Alur Tujuan (ATP)' : undefined}
                    >
                        <RouteIcon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Alur Tujuan (ATP)</span>}
                    </Link>

                    <Link
                        href={route('curriculum.modules.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.modules.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Modul Ajar / RPP KBC' : undefined}
                    >
                        <FileText className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Modul Ajar / RPP KBC</span>}
                    </Link>

                    <Link
                        href={route('curriculum.assessments.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.assessments.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Bank Soal & Kisi-kisi' : undefined}
                    >
                        <ClipboardList className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Bank Soal & Kisi-kisi</span>}
                    </Link>

                    <Link
                        href={route('curriculum.rubrics.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('curriculum.rubrics.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Rubrik Panca Cinta' : undefined}
                    >
                        <Award className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Rubrik Panca Cinta</span>}
                    </Link>
                </div>

                {/* Section: Madrasah / Sekolah (Gated) */}
                {isInstitutionAdmin && (
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Madrasah / Sekolah
                            </div>
                        )}

                        <Link
                            href={route('institution.profile.edit')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('institution.profile.*')
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Profil & Kop Surat' : undefined}
                        >
                            <School className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Profil & Kop Surat</span>}
                        </Link>

                        <Link
                            href={route('institution.branding.edit')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('institution.branding.*')
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Logo & Branding Kop' : undefined}
                        >
                            <Palette className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Logo & Branding Kop</span>}
                        </Link>

                        <Link
                            href={route('institution.academic-years.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('institution.academic-years.*')
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Tahun Ajaran & Semester' : undefined}
                        >
                            <Calendar className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Kalender Akademik</span>}
                        </Link>

                        <Link
                            href={route('institution.teachers.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('institution.teachers.*')
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Data Dewan Guru' : undefined}
                        >
                            <Users className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Data Dewan Guru</span>}
                        </Link>

                        <Link
                            href={route('institution.invitations.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('institution.invitations.*')
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Undangan Guru' : undefined}
                        >
                            <Mail className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Undangan Guru</span>}
                        </Link>
                    </div>
                )}

                {/* Section: Super Admin (Gated) */}
                {isSuperAdmin && (
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-3 text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Super Admin
                            </div>
                        )}

                        <Link
                            href={route('admin.clients.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.clients.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Kelola Client (Guru & Sekolah)' : undefined}
                        >
                            <Users className="w-4 h-4 shrink-0 text-amber-500" />
                            {!isCollapsed && <span className="truncate">Kelola Client (Guru & Sekolah)</span>}
                        </Link>

                        <Link
                            href={route('admin.plans.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.plans.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Konfigurasi Paket' : undefined}
                        >
                            <Package className="w-4 h-4 shrink-0 text-amber-500" />
                            {!isCollapsed && <span className="truncate">Konfigurasi Paket</span>}
                        </Link>

                        <Link
                            href={route('admin.crm.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.crm.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'CRM & WhatsApp Gateway' : undefined}
                        >
                            <MessageSquare className="w-4 h-4 shrink-0 text-emerald-500" />
                            {!isCollapsed && (
                                <div className="flex items-center justify-between w-full">
                                    <span className="truncate">CRM & WA Gateway</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                                        WA
                                    </span>
                                </div>
                            )}
                        </Link>

                        <Link
                            href={route('admin.learning-outcomes.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.learning-outcomes.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Master CP Nasional' : undefined}
                        >
                            <Database className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Master CP Nasional</span>}
                        </Link>

                        <Link
                            href={route('admin.import-cp.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.import-cp.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Import CP Excel' : undefined}
                        >
                            <UploadCloud className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Import CP (Excel/CSV)</span>}
                        </Link>

                        <Link
                            href={route('admin.curriculum-config.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.curriculum-config.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Konfigurasi Kurikulum & Mapel' : undefined}
                        >
                            <Settings2 className="w-4 h-4 shrink-0 text-amber-500" />
                            {!isCollapsed && <span className="truncate">Konfigurasi Kurikulum & Mapel</span>}
                        </Link>

                        <Link
                            href={route('admin.billing.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.billing.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Verifikasi Berlangganan' : undefined}
                        >
                            <Receipt className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">Verifikasi Langganan</span>}
                        </Link>

                        <Link
                            href={route('admin.payment-settings.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.payment-settings.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Pengaturan Pembayaran & Gateway' : undefined}
                        >
                            <CreditCard className="w-4 h-4 shrink-0 text-amber-500" />
                            {!isCollapsed && (
                                <div className="flex items-center justify-between w-full">
                                    <span className="truncate">Pengaturan Pembayaran</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                                        PAY
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* CMS Landing Page Menu */}
                        <Link
                            href={route('admin.landing-page.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.landing-page.*')
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Kelola Landing Page' : undefined}
                        >
                            <Globe className="w-4 h-4 shrink-0 text-emerald-600" />
                            {!isCollapsed && (
                                <div className="flex items-center justify-between w-full">
                                    <span className="truncate">Kelola Landing Page</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                                        CMS
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* AI Providers & API Keys Settings */}
                        <Link
                            href={route('admin.ai-settings.index')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isCurrentRoute('admin.ai-settings.*')
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? 'Pengaturan AI & API' : undefined}
                        >
                            <Cpu className="w-4 h-4 shrink-0 text-amber-500" />
                            {!isCollapsed && (
                                <div className="flex items-center justify-between w-full">
                                    <span className="truncate">Pengaturan AI & API</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                                        API
                                    </span>
                                </div>
                            )}
                        </Link>
                    </div>
                )}

                {/* Section: Akun & Billing */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Akun & Langganan
                        </div>
                    )}

                    <Link
                        href={route('billing.index')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('billing.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Paket & Tagihan' : undefined}
                    >
                        <CreditCard className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Paket & Tagihan</span>}
                    </Link>

                    <Link
                        href={route('profile.edit')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isCurrentRoute('profile.*')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Pengaturan Profil' : undefined}
                    >
                        <UserIcon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">Pengaturan Profil</span>}
                    </Link>
                </div>
            </div>

            {/* Sidebar Bottom Collapse Button for collapsed mode */}
            {isCollapsed && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition"
                        title="Perluas Sidebar"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </aside>
    );
}
