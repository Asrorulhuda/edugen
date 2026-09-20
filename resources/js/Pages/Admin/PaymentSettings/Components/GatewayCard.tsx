import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Copy,
    Check,
    Radio,
    Sparkles,
    Key,
    Shield,
    RefreshCw,
    ExternalLink,
} from 'lucide-react';

export interface GatewayItem {
    id: number;
    gateway: 'tripay' | 'xendit' | string;
    name: string;
    environment: 'sandbox' | 'production';
    api_key?: string | null;
    private_key?: string | null;
    merchant_code?: string | null;
    webhook_token?: string | null;
    is_active: boolean;
    last_tested_at?: string | null;
    last_test_status?: string | null;
    last_test_message?: string | null;
}

interface Props {
    gateway: GatewayItem;
    webhookUrl: string;
}

export default function GatewayCard({ gateway, webhookUrl }: Props) {
    const [isCopied, setIsCopied] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const { data, setData, put, processing } = useForm({
        environment: gateway.environment || 'sandbox',
        api_key: gateway.api_key || '',
        private_key: gateway.private_key || '',
        merchant_code: gateway.merchant_code || '',
        webhook_token: gateway.webhook_token || '',
        is_active: Boolean(gateway.is_active),
    });

    const handleCopyWebhook = () => {
        navigator.clipboard.writeText(webhookUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.payment-settings.gateways.update', gateway.gateway), {
            preserveScroll: true,
        });
    };

    const handleTestConnection = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await axios.post(
                route('admin.payment-settings.gateways.test', gateway.gateway),
                {
                    api_key: data.api_key,
                    private_key: data.private_key,
                    merchant_code: data.merchant_code,
                    environment: data.environment,
                }
            );
            setTestResult(res.data);
        } catch (err: any) {
            setTestResult({
                success: false,
                message: err.response?.data?.message || 'Gagal menghubungi server gateway.',
            });
        } finally {
            setTesting(false);
        }
    };

    const isTripay = gateway.gateway === 'tripay';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Header with Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 font-bold">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                {gateway.name}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                {data.is_active ? 'AKTIF' : 'NON-AKTIF'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isTripay ? 'Saluran QRIS, Virtual Account, & Minimarket Indonesia' : 'Xendit Invoice & Pembayaran Digital Otomatis'}
                        </p>
                    </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
                {/* Environment radio */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Mode Lingkungan (Environment)
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                            <input
                                type="radio"
                                name={`env-${gateway.gateway}`}
                                value="sandbox"
                                checked={data.environment === 'sandbox'}
                                onChange={() => setData('environment', 'sandbox')}
                                className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>Sandbox (Uji Coba)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                            <input
                                type="radio"
                                name={`env-${gateway.gateway}`}
                                value="production"
                                checked={data.environment === 'production'}
                                onChange={() => setData('environment', 'production')}
                                className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>Production (Transaksi Nyata)</span>
                        </label>
                    </div>
                </div>

                {/* API Key */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        API Key / Secret Key
                    </label>
                    <input
                        type="password"
                        value={data.api_key}
                        onChange={(e) => setData('api_key', e.target.value)}
                        placeholder="DEV-... atau PROD-..."
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                    />
                </div>

                {/* Tripay Specific Fields */}
                {isTripay && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                Private Key
                            </label>
                            <input
                                type="password"
                                value={data.private_key}
                                onChange={(e) => setData('private_key', e.target.value)}
                                placeholder="Private Key Tripay..."
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                Kode Merchant (Merchant Code)
                            </label>
                            <input
                                type="text"
                                value={data.merchant_code}
                                onChange={(e) => setData('merchant_code', e.target.value)}
                                placeholder="Contoh: T12345"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>
                )}

                {/* Webhook Token / Secret */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Webhook Verification Token / Callback Secret (Opsional)
                    </label>
                    <input
                        type="text"
                        value={data.webhook_token}
                        onChange={(e) => setData('webhook_token', e.target.value)}
                        placeholder="Token verifikasi webhook..."
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                    />
                </div>

                {/* Webhook URL Helper Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>URL Callback Webhook (Pasang di Dashboard {gateway.name})</span>
                        <button
                            type="button"
                            onClick={handleCopyWebhook}
                            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                        >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Tersalin!' : 'Salin URL'}</span>
                        </button>
                    </div>
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                        {webhookUrl}
                    </div>
                </div>

                {/* Test Result Message Box */}
                {testResult && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${testResult.success ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}`}>
                        {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                        <span>{testResult.message}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={testing || !data.api_key}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                        <span>{testing ? 'Menguji API...' : 'Tes Koneksi'}</span>
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
