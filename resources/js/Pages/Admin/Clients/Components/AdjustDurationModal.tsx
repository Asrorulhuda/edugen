import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Calendar, Plus, Clock, AlertCircle } from 'lucide-react';
import { ClientItem } from '../types';

interface AdjustDurationModalProps {
    client: ClientItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdjustDurationModal({
    client,
    isOpen,
    onClose,
}: AdjustDurationModalProps) {
    if (!isOpen || !client) return null;

    const sub = client.active_subscription;

    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'add' as 'add' | 'set',
        days: 30,
        ends_at: '',
        notes: '',
    });

    const handleQuickAddDays = (days: number) => {
        setData('action', 'add');
        setData('days', days);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.clients.adjust-duration', client.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const remainingDays = sub ? Math.ceil(sub.days_remaining) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Atur Masa Aktif & Durasi
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
                        <span className="text-slate-500">Paket Saat Ini:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub?.plan_name ?? 'Tidak Ada Paket Aktif'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal Berakhir:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub?.ends_at ?? '-'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Sisa Masa Aktif:</span>
                        <span className={`font-bold ${remainingDays > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                            {remainingDays > 0 ? `${remainingDays} Hari` : 'Sudah Habis / Kedaluwarsa'}
                        </span>
                    </div>
                </div>

                {!sub && (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>
                            Client belum memiliki paket aktif. Mengatur durasi akan otomatis mengaktifkan langganan dari hari ini.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Method Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Metode Penyesuaian Durasi
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
                                Tambah Hari
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
                                <Clock className="w-3.5 h-3.5" />
                                Pilih Tanggal
                            </button>
                        </div>
                    </div>

                    {/* Mode Add: Days Input & Quick Presets */}
                    {data.action === 'add' ? (
                        <div className="space-y-2.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Jumlah Hari yang Ditambahkan
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1825"
                                value={data.days}
                                onChange={(e) => setData('days', parseInt(e.target.value) || 0)}
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            />
                            {errors.days && <p className="text-xs text-rose-500">{errors.days}</p>}

                            {/* Quick Presets */}
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { label: '+7 Hari', val: 7 },
                                    { label: '+14 Hari', val: 14 },
                                    { label: '+30 Hari', val: 30 },
                                    { label: '+90 Hari', val: 90 },
                                    { label: '+180 Hari', val: 180 },
                                    { label: '+365 Hari', val: 365 },
                                ].map((preset) => (
                                    <button
                                        key={preset.val}
                                        type="button"
                                        onClick={() => handleQuickAddDays(preset.val)}
                                        className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                            data.days === preset.val
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Tanggal Berakhir Baru
                            </label>
                            <input
                                type="date"
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            />
                            {errors.ends_at && <p className="text-xs text-rose-500 mt-1">{errors.ends_at}</p>}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Catatan Perpanjangan (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Contoh: Perpanjangan masa trial atau bonus kontrak tahunan"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
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
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Masa Aktif'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
