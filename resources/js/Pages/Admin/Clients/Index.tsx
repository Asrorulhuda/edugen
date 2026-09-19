import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ClientStatsCard from './Components/ClientStatsCard';
import ClientFilterBar from './Components/ClientFilterBar';
import ClientTableRow from './Components/ClientTableRow';
import AdjustQuotaModal from './Components/AdjustQuotaModal';
import AdjustDurationModal from './Components/AdjustDurationModal';
import AssignPlanModal from './Components/AssignPlanModal';
import CreateClientModal from './Components/CreateClientModal';
import { ClientItem, ClientStats, AvailablePlan } from './types';
import { Users, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface IndexProps {
    clients: PaginatedData<ClientItem>;
    stats: ClientStats;
    plans: AvailablePlan[];
    filters: {
        tenant_type?: string;
        status?: string;
        search?: string;
    };
}

export default function Index({ clients, stats, plans, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [tenantType, setTenantType] = useState(filters.tenant_type || '');
    const [status, setStatus] = useState(filters.status || '');

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedClientForQuota, setSelectedClientForQuota] = useState<ClientItem | null>(null);
    const [selectedClientForDuration, setSelectedClientForDuration] = useState<ClientItem | null>(null);
    const [selectedClientForPlan, setSelectedClientForPlan] = useState<ClientItem | null>(null);

    const applyFilters = (newParams: Record<string, string>) => {
        router.get(
            route('admin.clients.index'),
            {
                search,
                tenant_type: tenantType,
                status,
                ...newParams,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleTenantTypeChange = (type: string) => {
        setTenantType(type);
        applyFilters({ tenant_type: type });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        applyFilters({ status: newStatus });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                            Manajemen Client & Sekolah
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Kelola data tenant sekolah, guru mandiri, kuota AI, dan status langganan
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Client - Superadmin" />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Stats row */}
                <ClientStatsCard stats={stats} />

                {/* Filter and Action Bar */}
                <ClientFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearchSubmit}
                    tenantType={tenantType}
                    onTenantTypeChange={handleTenantTypeChange}
                    status={status}
                    onStatusChange={handleStatusChange}
                    onOpenCreateModal={() => setIsCreateOpen(true)}
                />

                {/* Client List Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-700/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <th className="px-5 py-3.5">Nama Client / Sekolah</th>
                                    <th className="px-5 py-3.5">Admin Penanggung Jawab</th>
                                    <th className="px-5 py-3.5">Status Akun</th>
                                    <th className="px-5 py-3.5">Paket & Kuota AI</th>
                                    <th className="px-5 py-3.5 text-center">Anggota</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                                {clients.data.length > 0 ? (
                                    clients.data.map((client) => (
                                        <ClientTableRow
                                            key={client.id}
                                            client={client}
                                            onAdjustQuota={(c) => setSelectedClientForQuota(c)}
                                            onAdjustDuration={(c) => setSelectedClientForDuration(c)}
                                            onAssignPlan={(c) => setSelectedClientForPlan(c)}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Inbox className="w-10 h-10 mb-2 opacity-60" />
                                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                    Tidak ada client yang ditemukan
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Coba ubah filter pencarian atau daftarkan client baru.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {clients.total > 0 && (
                        <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                            <div>
                                Menampilkan <span className="font-semibold">{clients.data.length}</span> dari{' '}
                                <span className="font-semibold">{clients.total}</span> client
                            </div>
                            <div className="flex items-center gap-1">
                                {clients.links.map((link, idx) => {
                                    if (link.label.includes('Previous') || link.label.includes('&laquo;')) {
                                        return link.url ? (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => router.get(link.url!)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        ) : null;
                                    }
                                    if (link.label.includes('Next') || link.label.includes('&raquo;')) {
                                        return link.url ? (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => router.get(link.url!)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : null;
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`min-w-[32px] h-8 px-2 rounded-lg font-semibold transition-all ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateClientModal
                plans={plans}
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <AdjustQuotaModal
                client={selectedClientForQuota}
                isOpen={!!selectedClientForQuota}
                onClose={() => setSelectedClientForQuota(null)}
            />

            <AdjustDurationModal
                client={selectedClientForDuration}
                isOpen={!!selectedClientForDuration}
                onClose={() => setSelectedClientForDuration(null)}
            />

            <AssignPlanModal
                client={selectedClientForPlan}
                plans={plans}
                isOpen={!!selectedClientForPlan}
                onClose={() => setSelectedClientForPlan(null)}
            />
        </AuthenticatedLayout>
    );
}
