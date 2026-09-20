import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { WaGatewaySetting } from '../types';
import {
    Radio,
    Key,
    Smartphone,
    Globe,
    Send,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Info,
} from 'lucide-react';

interface GatewayConfigCardProps {
    setting: WaGatewaySetting;
}

export default function GatewayConfigCard({ setting }: GatewayConfigCardProps) {
    const [isTesting, setIsTesting] = useState(false);
    const [testPhone, setTestPhone] = useState('');

    const form = useForm({
        endpoint_url: setting.endpoint_url || 'https://gateway.asr-desain.my.id/send-message',
        api_key: setting.api_key || '',
        sender: setting.sender || '',
        admin_notify_number: setting.admin_notify_number || '',
        notify_on_registration: setting.notify_on_registration ?? true,
        default_footer: setting.default_footer || 'EduGen AI - Platform Perangkat Ajar Modern',
        is_active: setting.is_active,
        full_response: setting.full_response ?? true,
    });

    const testForm = useForm({
        test_number: '',
        custom_message: '🔔 *Tes Koneksi EduGen AI WhatsApp Gateway*\n\nKoneksi berhasil terhubung dari server EduGen AI ke WhatsApp Gateway.',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('admin.crm.settings.update'), {
            preserveScroll: true,
        });
    };

    const handleRunTest = (e: React.FormEvent) => {
        e.preventDefault();
        testForm.post(route('admin.crm.test'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsTesting(false);
                testForm.reset();
            },
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Radio className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Konfigurasi WhatsApp Gateway
                            {setting.is_active ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" /> Aktif
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <AlertCircle className="w-3 h-3" /> Dinonaktifkan
                                </span>
                            )}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Hubungkan API Gateway WhatsApp untuk pesan transaksi, undangan OTP, & retensi pelanggan.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsTesting(!isTesting)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 hover:bg-emerald-100 transition shadow-sm active:scale-95"
                    >
                        <Send className="w-3.5 h-3.5" />
                        {isTesting ? 'Tutup Tes Koneksi' : 'Tes Kirim Pesan'}
                    </button>
                </div>
            </div>

            {/* Test Connection Form Drawer */}
            {isTesting && (
                <form onSubmit={handleRunTest} className="mt-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        Tes Pengiriman Pesan ke WhatsApp Nyata
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        Pastikan device WhatsApp telah terhubung dan scan QR di dashboard gateway Anda.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                            <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nomor WhatsApp Tujuan
                            </label>
                            <input
                                type="text"
                                placeholder="08123456789 / 62812..."
                                value={testForm.data.test_number}
                                onChange={(e) => testForm.setData('test_number', e.target.value)}
                                required
                                className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-end gap-2">
                            <div className="flex-1">
                                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Pesan Uji Coba
                                </label>
                                <input
                                    type="text"
                                    value={testForm.data.custom_message}
                                    onChange={(e) => testForm.setData('custom_message', e.target.value)}
                                    className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={testForm.processing}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm active:scale-95 shrink-0"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {testForm.processing ? 'Mengirim...' : 'Kirim Sekarang'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Gateway Setting Form */}
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Endpoint URL */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            Endpoint API URL
                        </label>
                        <input
                            type="url"
                            value={form.data.endpoint_url}
                            onChange={(e) => form.setData('endpoint_url', e.target.value)}
                            required
                            placeholder="https://gateway.asr-desain.my.id/send-message"
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Endpoint resmi dari dokumentasi WA Gateway Anda (Default: https://gateway.asr-desain.my.id/send-message).
                        </span>
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            API Key (Token)
                        </label>
                        <input
                            type="password"
                            value={form.data.api_key}
                            onChange={(e) => form.setData('api_key', e.target.value)}
                            placeholder="Masukkan API Key Gateway Anda"
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 focus:ring-emerald-500 focus:border-emerald-500 font-mono transition"
                        />
                    </div>

                    {/* Sender Device Number */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                            Nomor Perangkat Pengirim (Sender)
                        </label>
                        <input
                            type="text"
                            value={form.data.sender}
                            onChange={(e) => form.setData('sender', e.target.value)}
                            placeholder="628xxxxxxxx / Nomor device terdaftar"
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Admin Notification Number */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                            Nomor WhatsApp Admin (Notifikasi Pendaftar Baru)
                        </label>
                        <input
                            type="text"
                            value={form.data.admin_notify_number}
                            onChange={(e) => form.setData('admin_notify_number', e.target.value)}
                            placeholder="Contoh: 081234567890 / 6281234567890"
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Nomor WhatsApp Super Admin yang otomatis menerima notifikasi data pendaftar baru secara real-time.
                        </span>
                    </div>

                    {/* Default Footer */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Default Footer Pesan (Opsional)
                        </label>
                        <input
                            type="text"
                            value={form.data.default_footer}
                            onChange={(e) => form.setData('default_footer', e.target.value)}
                            placeholder="Contoh: EduGen AI - Platform Kurikulum Merdeka"
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Teks kecil yang muncul di bagian bawah pesan WhatsApp.
                        </span>
                    </div>

                    {/* Toggle Active Status */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="is_active" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                            Aktifkan Layanan WhatsApp Gateway Otomatis
                        </label>
                    </div>

                    {/* Toggle Notify on Registration */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <input
                            type="checkbox"
                            id="notify_on_registration"
                            checked={form.data.notify_on_registration}
                            onChange={(e) => form.setData('notify_on_registration', e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="notify_on_registration" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                            Kirim Notifikasi Real-Time ke Admin Saat Ada Pendaftar Baru
                        </label>
                    </div>

                    {/* Toggle Full Response */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <input
                            type="checkbox"
                            id="full_response"
                            checked={form.data.full_response}
                            onChange={(e) => form.setData('full_response', e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="full_response" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                            Minta Full Response dari WhatsApp (full = 1)
                        </label>
                    </div>
                </div>

                {/* Last Tested Status Badge */}
                {setting.last_tested_at && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        Terakhir diuji:{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(setting.last_tested_at).toLocaleString('id-ID')}
                        </span>{' '}
                        — Status:{' '}
                        <span
                            className={`font-bold ${
                                setting.last_test_status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                        >
                            {setting.last_test_status}
                        </span>
                        {setting.last_test_message && ` (${setting.last_test_message})`}
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm active:scale-95"
                    >
                        {form.processing ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                Simpan Konfigurasi Gateway
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
