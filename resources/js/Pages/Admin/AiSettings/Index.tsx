import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Cpu,
    ExternalLink,
    Eye,
    EyeOff,
    Flame,
    Key,
    Loader2,
    Save,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { modelOptions, portalUrls } from './providerOptions';

interface AiProvider {
    id: number;
    provider: string;
    name: string;
    api_key: string | null;
    model: string;
    base_url: string | null;
    is_active: boolean;
    is_default: boolean;
    temperature: number;
    max_tokens: number;
    last_tested_at: string | null;
    last_test_status: 'SUCCESS' | 'FAILED' | null;
    last_test_message: string | null;
}

interface AiLog {
    id: number;
    user?: { name: string; email: string };
    feature_type: string;
    provider: string;
    model_name: string;
    total_tokens: number;
    latency_ms: number;
    status: 'SUCCESS' | 'FAILED';
    error_message?: string;
    created_at: string;
}

interface Props {
    providers: AiProvider[];
    recentLogs: AiLog[];
    defaultProvider: string;
}

export default function AiSettingsIndex({ providers, recentLogs, defaultProvider }: Props) {
    const [testResults, setTestResults] = useState<Record<string, {
        loading: boolean;
        success?: boolean;
        message?: string;
        latency_ms?: number;
    }>>({});

    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const toggleShowKey = (provider: string) => {
        setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
    };

    const runTestConnection = async (provider: AiProvider, currentFormKey: string, currentFormModel: string) => {
        setTestResults((prev) => ({
            ...prev,
            [provider.provider]: { loading: true },
        }));

        try {
            const res = await axios.post(route('admin.ai-settings.test', provider.provider), {
                api_key: currentFormKey,
                model: currentFormModel,
            });

            setTestResults((prev) => ({
                ...prev,
                [provider.provider]: {
                    loading: false,
                    success: res.data.success,
                    message: res.data.message,
                    latency_ms: res.data.latency_ms,
                },
            }));
        } catch (err: any) {
            setTestResults((prev) => ({
                ...prev,
                [provider.provider]: {
                    loading: false,
                    success: false,
                    message: err.response?.data?.message || err.message || 'Gagal menghubungi server.',
                },
            }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                            <span>Super Admin Control Plane</span>
                            <span>/</span>
                            <span>AI Engine & API Keys</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-amber-500" />
                            <span>Pengaturan Provider AI & API Key</span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola kunci API resmi (Google Gemini, OpenRouter Key 1, dan OpenRouter Key 2 Cadangan) untuk memberdayakan generator modul ajar & asesmen KBC.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Default Provider: <span className="uppercase text-slate-900 dark:text-white font-black">{defaultProvider}</span></span>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan AI & API Key — Super Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Info Notice Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-900 dark:text-white">Arsitektur Multi-Provider Berdaya Tahan Tinggi: </span>
                        Jika API key salah satu provider habis kuota atau mengalami downtime, sistem secara otomatis beralih ke provider aktif berikutnya (failover otomatis ke OpenRouter Key 2 / Gemini) tanpa mengganggu aktivitas guru yang sedang merancang modul ajar.
                    </div>
                </div>

                {/* Grid of 3 AI Providers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((p) => (
                        <ProviderCard
                            key={p.id}
                            provider={p}
                            showKey={!!showKey[p.provider]}
                            toggleShowKey={() => toggleShowKey(p.provider)}
                            testState={testResults[p.provider]}
                            onRunTest={(key, model) => runTestConnection(p, key, model)}
                        />
                    ))}
                </div>

                {/* Recent AI Generation Logs Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Riwayat Panggilan AI Terbaru (Live Logs)
                            </h3>
                        </div>
                        <span className="text-[11px] text-slate-500">
                            10 Aktivitas Terakhir
                        </span>
                    </div>

                    {recentLogs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                                        <th className="pb-2.5">Waktu</th>
                                        <th className="pb-2.5">Pengguna / Guru</th>
                                        <th className="pb-2.5">Fitur</th>
                                        <th className="pb-2.5">Provider & Model</th>
                                        <th className="pb-2.5">Status</th>
                                        <th className="pb-2.5 text-right">Tokens</th>
                                        <th className="pb-2.5 text-right">Latensi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                                    {recentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="py-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </td>
                                            <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                                                {log.user?.name || 'Sistem EduGen'}
                                            </td>
                                            <td className="py-2.5">
                                                <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                                                    {log.feature_type}
                                                </span>
                                            </td>
                                            <td className="py-2.5 font-medium">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.provider}</span>
                                                <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({log.model_name})</span>
                                            </td>
                                            <td className="py-2.5">
                                                {log.status === 'SUCCESS' ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                                        <CheckCircle2 className="w-3 h-3" /> Berhasil
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md" title={log.error_message}>
                                                        <AlertCircle className="w-3 h-3" /> Gagal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2.5 text-right font-mono text-[11px]">
                                                {log.total_tokens ? log.total_tokens.toLocaleString() : '-'}
                                            </td>
                                            <td className="py-2.5 text-right font-mono text-[11px] text-slate-500">
                                                {log.latency_ms}ms
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-xs text-slate-400">
                            Belum ada riwayat aktivitas generasi AI yang tercatat.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

interface ProviderCardProps {
    provider: AiProvider;
    showKey: boolean;
    toggleShowKey: () => void;
    testState?: {
        loading: boolean;
        success?: boolean;
        message?: string;
        latency_ms?: number;
    };
    onRunTest: (key: string, model: string) => void;
}

function ProviderCard({
    provider,
    showKey,
    toggleShowKey,
    testState,
    onRunTest,
}: ProviderCardProps) {
    const { data, setData, post, processing } = useForm({
        api_key: provider.api_key || '',
        model: provider.model,
        base_url: provider.base_url || '',
        is_active: provider.is_active,
        is_default: provider.is_default,
        temperature: provider.temperature,
        max_tokens: provider.max_tokens,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.ai-settings.update', provider.provider), {
            preserveScroll: true,
        });
    };

    const presetList = modelOptions[provider.provider] || [];
    const currentModels = Array.from(new Set([provider.model, ...presetList].filter(Boolean)));

    const portal = portalUrls[provider.provider];

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all shadow-xs p-6 space-y-5 relative ${
            data.is_default
                ? 'border-amber-500/80 ring-1 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-800'
        }`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm ${
                        provider.provider === 'gemini' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600' :
                        provider.provider === 'openrouter' ? 'bg-gradient-to-tr from-violet-600 to-purple-700' :
                        'bg-gradient-to-tr from-fuchsia-600 to-pink-600'
                    }`}>
                        {provider.provider === 'gemini' ? 'G' :
                         provider.provider === 'openrouter' ? 'OR1' : 'OR2'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                {provider.name}
                            </h2>
                            {data.is_default && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                            slug: {provider.provider}
                        </p>
                    </div>
                </div>

                {portal && (
                    <a
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        <span>Dapatkan API Key</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* API Key Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-slate-400" />
                            <span>API Key {provider.name}</span>
                        </span>
                        {data.api_key ? (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Terpasang ({data.api_key.length} karakter)
                            </span>
                        ) : (
                            <span className="text-[10px] font-semibold text-amber-500">
                                Belum Terisi
                            </span>
                        )}
                    </label>

                    <div className="relative rounded-2xl shadow-xs">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={data.api_key}
                            onChange={(e) => setData('api_key', e.target.value)}
                            placeholder={`Masukkan API Key ${provider.name} Anda...`}
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                        <button
                            type="button"
                            onClick={toggleShowKey}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            {showKey ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Model Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Model AI Terpilih
                        </label>
                        <select
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        >
                            {currentModels.map((m) => (
                                <option key={m} value={m}>
                                    {m} {m.endsWith(':free') ? '⭐ (Model Gratis)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Custom Model (Opsional)
                        </label>
                        <input
                            type="text"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                            placeholder="Ketik nama model..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {provider.provider === 'openrouter' && (
                    <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 text-[11px] text-violet-800 dark:text-violet-300 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                        <span>
                            <strong>Slot OpenRouter Key 1 (Utama):</strong> Gunakan model gratis berakhiran <strong className="font-mono text-emerald-600 dark:text-emerald-400">:free</strong> seperti <strong className="font-mono">nvidia/nemotron-3-ultra-550b-a55b:free</strong> jika akun belum memiliki saldo kredit berbayar.
                        </span>
                    </div>
                )}

                {provider.provider === 'openrouter_secondary' && (
                    <div className="p-2.5 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-200 dark:border-fuchsia-800/50 text-[11px] text-fuchsia-800 dark:text-fuchsia-300 flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-fuchsia-600 shrink-0 mt-0.5" />
                        <span>
                            <strong>Slot OpenRouter Key 2 (Cadangan):</strong> Masukkan API Key kedua Anda. Sistem akan otomatis beralih (*failover*) ke kunci ini apabila Key 1 mencapai batas kuota request per menit.
                        </span>
                    </div>
                )}

                {/* Toggles: Active & Default */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Aktifkan Provider Ini
                        </span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.is_default}
                            onChange={(e) => setData('is_default', e.target.checked)}
                            className="rounded-lg border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                            Jadikan Provider Utama (Default)
                        </span>
                    </label>
                </div>

                {/* Test Connection Result Box */}
                {(testState?.message || provider.last_tested_at) && (
                    <div className={`p-3 rounded-2xl text-xs flex items-start gap-2 border ${
                        testState?.success ?? (provider.last_test_status === 'SUCCESS')
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    }`}>
                        {testState?.success ?? (provider.last_test_status === 'SUCCESS') ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 text-[11px] leading-relaxed">
                            <span className="font-bold">
                                {testState?.success ?? (provider.last_test_status === 'SUCCESS') ? 'Status: KONEKSI VALID' : 'Status: GAGAL'}
                            </span>
                            <p className="mt-0.5">
                                {testState?.message || provider.last_test_message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons: Test Connection & Save */}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => onRunTest(data.api_key, data.model)}
                        disabled={testState?.loading || !data.api_key}
                        className="flex-1 py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition btn-tactile disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                        {testState?.loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                                <span>Menguji Ping...</span>
                            </>
                        ) : (
                            <>
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                <span>Uji Koneksi API</span>
                            </>
                        )}
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition btn-tactile shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                        {processing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Simpan Pengaturan</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
