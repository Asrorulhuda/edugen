import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Sparkles, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { ClientItem } from '../types';

interface AdjustQuotaModalProps {
    client: ClientItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdjustQuotaModal({ client, isOpen, onClose }: AdjustQuotaModalProps) {
    if (!isOpen || !client) return null;

    const sub = client.active_subscription;

    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'add' as 'add' | 'set',
        amount: 100,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.clients.adjust-quota', client.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleQuickAdd = (amount: number) => {
        setData('action', 'add');
        setData('amount', amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Atur Kuota AI
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {client.name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub status summary */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Paket Langganan:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub?.plan_name ?? 'Tidak Ada Paket Aktif'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Kuota Saat Ini:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub ? `${sub.ai_quota_used} / ${sub.ai_quota_limit} Terpakai` : '0'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Sisa Kuota:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {sub ? `${sub.ai_quota_remaining} Generasi` : '0'}
                        </span>
                    </div>
                </div>

                {!sub && (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>
                            Client ini belum memiliki langganan aktif. Menambahkan kuota akan otomatis membuat paket kustom aktif selama 30 hari.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Action Toggle */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Metode Penyesuaian
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setData('action', 'add')}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.action === 'add'
                                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Tambah Kuota
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('action', 'set')}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.action === 'set'
                                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Tetapkan Total
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {data.action === 'add' ? 'Jumlah Kuota yang Ditambahkan' : 'Total Limit Baru'}
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={data.amount}
                            onChange={(e) => setData('amount', parseInt(e.target.value) || 0)}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                        />
                        {errors.amount && (
                            <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Quick presets for adding */}
                    {data.action === 'add' && (
                        <div className="flex items-center gap-2">
                            {[50, 100, 250, 500].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => handleQuickAdd(preset)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                        data.amount === preset
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    +{preset}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Catatan / Alasan Penyesuaian (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Contoh: Bonus kompensasi maintenance server atau promo institusi"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.amount <= 0}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Kuota'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
