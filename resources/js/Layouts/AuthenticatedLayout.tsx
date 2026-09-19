import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import AppSidebar from './Sidebar/AppSidebar';
import AppHeader from './Sidebar/AppHeader';
import MobileDrawer from './Sidebar/MobileDrawer';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user;
    const currentTenant = auth.current_tenant;
    const availableWorkspaces = auth.available_workspaces || [];
    const isSuperAdmin = auth.is_super_admin;
    const isInstitutionAdmin =
        isSuperAdmin ||
        (currentTenant?.tenant_type === 'INSTITUTION' &&
            (currentTenant?.role === 'ADMIN' || isSuperAdmin));

    // Persist sidebar collapsed state in localStorage
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('edugen_sidebar_collapsed') === 'true';
        }
        return false;
    });

    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('edugen_sidebar_collapsed', String(next));
            }
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex">
            {/* Desktop Left Sidebar */}
            <AppSidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
                isSuperAdmin={isSuperAdmin}
                isInstitutionAdmin={isInstitutionAdmin}
                currentTenant={currentTenant}
            />

            {/* Mobile Slide-Over Drawer */}
            <MobileDrawer
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
                isSuperAdmin={isSuperAdmin}
                isInstitutionAdmin={isInstitutionAdmin}
            />

            {/* Main Area: Top Bar + Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AppHeader
                    user={user}
                    currentTenant={currentTenant}
                    availableWorkspaces={availableWorkspaces}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebar={toggleSidebar}
                    onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
                />

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-600 text-white px-4 py-2.5 text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Specific Header */}
                {header && (
                    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-5 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                )}

                {/* Page Body Content */}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
