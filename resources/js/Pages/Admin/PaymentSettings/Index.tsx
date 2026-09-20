import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CreditCard, Building2, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import GatewayCard, { GatewayItem } from './Components/GatewayCard';
import BankAccountsSection, { BankAccount } from './Components/BankAccountsSection';
import QrisSection, { QrisData } from './Components/QrisSection';

interface Props {
    gateways: GatewayItem[];
    bankAccounts: BankAccount[];
    qrisSetting: QrisData;
    webhookUrls: Record<string, string>;
}

export default function PaymentSettingsIndex({
    gateways,
    bankAccounts,
    qrisSetting,
    webhookUrls,
}: Props) {
    const [activeTab, setActiveTab] = useState<'gateways' | 'banks' | 'qris'>('gateways');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <span>Super Admin</span>
                            <span>/</span>
                            <span className="text-amber-600 dark:text-amber-400">Pengaturan Pembayaran</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            <span>Konfigurasi Payment Gateway & Saluran Pembayaran</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sistem Billing & Invoice Terintegrasi</span>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Payment Gateway & Metode Pembayaran - Super Admin" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Navigation Tab Switcher */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('gateways')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                            activeTab === 'gateways'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Payment Gateways (Tripay & Xendit)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('banks')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                            activeTab === 'banks'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        <span>Rekening Bank Transfer Manual ({bankAccounts.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('qris')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                            activeTab === 'qris'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <QrCode className="w-4 h-4" />
                        <span>QRIS Standar Bank Indonesia</span>
                    </button>
                </div>

                {/* Tab 1: Payment Gateways */}
                {activeTab === 'gateways' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {gateways.map((gw) => (
                            <GatewayCard
                                key={gw.id}
                                gateway={gw}
                                webhookUrl={webhookUrls[gw.gateway] || ''}
                            />
                        ))}
                    </div>
                )}

                {/* Tab 2: Manual Bank Accounts */}
                {activeTab === 'banks' && (
                    <BankAccountsSection bankAccounts={bankAccounts} />
                )}

                {/* Tab 3: QRIS Setting */}
                {activeTab === 'qris' && (
                    <QrisSection qrisSetting={qrisSetting} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
