import React from 'react';
import { Search, Filter, Plus, Building2, User } from 'lucide-react';

interface ClientFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    tenantType: string;
    onTenantTypeChange: (type: string) => void;
    status: string;
    onStatusChange: (status: string) => void;
    onOpenCreateModal: () => void;
}

export default function ClientFilterBar({
    search,
    onSearchChange,
    onSearchSubmit,
    tenantType,
    onTenantTypeChange,
    status,
    onStatusChange,
    onOpenCreateModal,
}: ClientFilterBarProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
            {/* Top row: Category Tabs & Create Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Client Type Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => onTenantTypeChange('')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            tenantType === ''
                                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Semua Client
                    </button>
                    <button
                        type="button"
                        onClick={() => onTenantTypeChange('INDIVIDUAL')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            tenantType === 'INDIVIDUAL'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        Guru Mandiri
                    </button>
                    <button
                        type="button"
                        onClick={() => onTenantTypeChange('INSTITUTION')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            tenantType === 'INSTITUTION'
                                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        Sekolah / Madrasah
                    </button>
                </div>

                {/* Create Action Button */}
                <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Daftarkan Client</span>
                </button>
            </div>

            {/* Bottom row: Search & Status dropdown */}
            <form onSubmit={onSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="relative md:col-span-8">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari nama sekolah, guru, NPSN, atau email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                </div>

                <div className="relative md:col-span-4">
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                        <option value="">Semua Status Akun</option>
                        <option value="ACTIVE">Aktif (ACTIVE)</option>
                        <option value="TRIAL">Masa Uji Coba (TRIAL)</option>
                        <option value="SUSPENDED">Ditangguhkan (SUSPENDED)</option>
                        <option value="EXPIRED">Kedaluwarsa (EXPIRED)</option>
                    </select>
                </div>
            </form>
        </div>
    );
}
