import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Sparkles,
    BarChart3,
    Layers,
    Award,
    HelpCircle,
    PhoneCall,
    ExternalLink,
    Sliders,
    Globe,
} from 'lucide-react';
import HeroSectionForm from './Partials/HeroSectionForm';
import StatsSectionForm from './Partials/StatsSectionForm';
import WorkflowSectionForm from './Partials/WorkflowSectionForm';
import FeaturesSectionForm from './Partials/FeaturesSectionForm';
import FaqSectionForm from './Partials/FaqSectionForm';
import FooterSectionForm from './Partials/FooterSectionForm';

interface Props {
    sections: Record<
        string,
        {
            id: number;
            key: string;
            title: string;
            content: any;
            is_active: boolean;
            updated_by_user?: { id: number; name: string };
            updated_at?: string;
        }
    >;
}

export default function LandingPageIndex({ sections }: Props) {
    const [activeTab, setActiveTab] = useState<
        'hero' | 'stats' | 'workflow' | 'features' | 'faqs' | 'footer'
    >('hero');

    const tabs = [
        { id: 'hero', label: 'Hero Banner', icon: Sparkles },
        { id: 'stats', label: 'Statistik', icon: BarChart3 },
        { id: 'workflow', label: 'Alur Kerja', icon: Layers },
        { id: 'features', label: 'Fitur Unggulan', icon: Award },
        { id: 'faqs', label: 'Tanya Jawab (FAQ)', icon: HelpCircle },
        { id: 'footer', label: 'Kontak & Footer', icon: PhoneCall },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                Super Admin CMS
                            </span>
                            <span className="text-xs text-slate-400">• Manajemen Konten Publik</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Kelola Landing Page Platform
                        </h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
                        >
                            <span>Buka Halaman Depan</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Kelola Landing Page — Super Admin" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Information Card */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-emerald-600" />
                            Pusat Kendali Tampilan Publik EduGen KBC
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Semua perubahan yang Anda simpan di sini akan langsung diperbarui di halaman depan (Welcome) tanpa perlu build atau deploy ulang.
                        </p>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        Total Section Terdaftar: <strong className="text-emerald-600">{Object.keys(sections || {}).length}</strong> Bagian
                    </div>
                </div>

                {/* Main Content Layout with Tabs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                    {/* Navigation Tabs Bar */}
                    <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const sectionItem = sections?.[tab.id];

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                        isActive
                                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span>{tab.label}</span>
                                    {sectionItem && !sectionItem.is_active && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                            isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                        }`}>
                                            Nonaktif
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Form Content */}
                    <div className="p-6">
                        {activeTab === 'hero' && (
                            <HeroSectionForm section={sections?.['hero']} />
                        )}
                        {activeTab === 'stats' && (
                            <StatsSectionForm section={sections?.['stats']} />
                        )}
                        {activeTab === 'workflow' && (
                            <WorkflowSectionForm section={sections?.['workflow']} />
                        )}
                        {activeTab === 'features' && (
                            <FeaturesSectionForm section={sections?.['features']} />
                        )}
                        {activeTab === 'faqs' && (
                            <FaqSectionForm section={sections?.['faqs']} />
                        )}
                        {activeTab === 'footer' && (
                            <FooterSectionForm section={sections?.['footer']} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
