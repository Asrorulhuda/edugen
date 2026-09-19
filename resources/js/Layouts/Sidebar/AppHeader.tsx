import Dropdown from '@/Components/Dropdown';
import { Link, router } from '@inertiajs/react';
import {
    Menu,
    Building2,
    User as UserIcon,
    ChevronDown,
    Check,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

interface AppHeaderProps {
    user: any;
    currentTenant: any;
    availableWorkspaces: any[];
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onOpenMobileDrawer: () => void;
}

export default function AppHeader({
    user,
    currentTenant,
    availableWorkspaces = [],
    isSidebarCollapsed,
    onToggleSidebar,
    onOpenMobileDrawer,
}: AppHeaderProps) {
    const handleSwitchWorkspace = (tenantId: number) => {
        router.post(
            route('workspace.switch'),
            { tenant_id: tenantId },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger button */}
                <button
                    type="button"
                    onClick={onOpenMobileDrawer}
                    className="p-2 lg:hidden rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Buka Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Desktop sidebar toggle button */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                >
                    {isSidebarCollapsed ? (
                        <PanelLeftOpen className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    ) : (
                        <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    )}
                </button>

                {/* Workspace Selector */}
                {currentTenant && (
                    <div className="relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition shadow-2xs"
                                >
                                    {currentTenant.tenant_type === 'INSTITUTION' ? (
                                        <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    ) : (
                                        <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    )}
                                    <span className="max-w-[130px] sm:max-w-[200px] truncate font-semibold">
                                        {currentTenant.name}
                                    </span>
                                    <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold uppercase">
                                        {currentTenant.role_display || currentTenant.role}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content width="64">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    Pilih Ruang Kerja (Workspace)
                                </div>
                                {availableWorkspaces.map((ws) => (
                                    <button
                                        key={ws.tenant_id}
                                        type="button"
                                        onClick={() => handleSwitchWorkspace(ws.tenant_id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                                            ws.is_current
                                                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                                                : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            {ws.tenant_type === 'INSTITUTION' ? (
                                                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                            ) : (
                                                <UserIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            )}
                                            <div className="truncate">
                                                <div className="truncate font-medium">{ws.name}</div>
                                                <div className="text-[10px] text-slate-400">
                                                    {ws.role_display}
                                                </div>
                                            </div>
                                        </div>
                                        {ws.is_current && (
                                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                                        )}
                                    </button>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                )}
            </div>

            {/* Right Action Icons & User Dropdown */}
            <div className="flex items-center gap-3">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                        >
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user?.name || 'User'}
                                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <div className="text-xs font-bold text-slate-900 dark:text-white max-w-[130px] truncate leading-tight">
                                    {user?.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate leading-tight">
                                    {user?.email}
                                </div>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content width="48">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 md:hidden">
                            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {user?.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                        </div>

                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Profil Akun</span>
                        </Dropdown.Link>

                        <Dropdown.Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 text-rose-600 dark:text-rose-400"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Keluar (Logout)</span>
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
