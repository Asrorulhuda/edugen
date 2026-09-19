import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GatewayConfigCard from './Components/GatewayConfigCard';
import DirectMessageModal from './Components/DirectMessageModal';
import BroadcastModal from './Components/BroadcastModal';
import TemplateManagerModal from './Components/TemplateManagerModal';
import MessageLogsTable from './Components/MessageLogsTable';
import {
    WaGatewaySetting,
    WaTemplate,
    WaMessageLog,
    CrmStats,
    CrmAudiences,
    ClientRecipient,
} from './types';
import {
    MessageSquare,
    Radio,
    Send,
    FileText,
    CheckCircle2,
    XCircle,
    Percent,
    Layers,
    Sparkles,
} from 'lucide-react';

interface IndexProps {
    setting: WaGatewaySetting;
    templates: WaTemplate[];
    logs: {
        data: WaMessageLog[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        source?: string;
        search?: string;
    };
    stats: CrmStats;
    audiences: CrmAudiences;
    clientRecipients: ClientRecipient[];
}

export default function Index({
    setting,
    templates,
    logs,
    filters,
    stats,
    audiences,
    clientRecipients,
}: IndexProps) {
    const [activeTab, setActiveTab] = useState<'LOGS' | 'SETTINGS'>('LOGS');
    const [isDirectOpen, setIsDirectOpen] = useState(false);
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="CRM & WhatsApp Gateway - Super Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Title & Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                WhatsApp Gateway CRM
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Super Admin
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                            <MessageSquare className="w-6 h-6 text-emerald-600" />
                            CRM & WhatsApp Gateway
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Kelola pengiriman WhatsApp gateway, broadcast kampanye retensi, template pesan, dan log komunikasi.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsDirectOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm active:scale-95"
                        >
                            <Send className="w-3.5 h-3.5" />
                            Kirim Pesan
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsBroadcastOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm active:scale-95"
                        >
                            <Radio className="w-3.5 h-3.5" />
                            Broadcast Massal
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsTemplatesOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Template ({templates.length})
                        </button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-medium text-slate-500">Pesan Berhasil</div>
                            <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                                {stats.total_sent}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-medium text-slate-500">Pesan Gagal</div>
                            <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                                {stats.total_failed}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Percent className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-medium text-slate-500">Tingkat Sukses</div>
                            <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                                {stats.success_rate}%
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-medium text-slate-500">Status Gateway</div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {setting.is_active ? 'Online & Aktif' : 'Dinonaktifkan'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('LOGS')}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
                            activeTab === 'LOGS'
                                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Riwayat & Log Pesan
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('SETTINGS')}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
                            activeTab === 'SETTINGS'
                                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Radio className="w-4 h-4" />
                        Pengaturan WhatsApp Gateway
                    </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'SETTINGS' ? (
                    <GatewayConfigCard setting={setting} />
                ) : (
                    <MessageLogsTable logs={logs} filters={filters} />
                )}
            </div>

            {/* Direct Message Modal */}
            <DirectMessageModal
                isOpen={isDirectOpen}
                onClose={() => setIsDirectOpen(false)}
                clientRecipients={clientRecipients}
                templates={templates}
            />

            {/* Broadcast Massal Modal */}
            <BroadcastModal
                isOpen={isBroadcastOpen}
                onClose={() => setIsBroadcastOpen(false)}
                audiences={audiences}
                templates={templates}
            />

            {/* Template Manager Modal */}
            <TemplateManagerModal
                isOpen={isTemplatesOpen}
                onClose={() => setIsTemplatesOpen(false)}
                templates={templates}
            />
        </AuthenticatedLayout>
    );
}
