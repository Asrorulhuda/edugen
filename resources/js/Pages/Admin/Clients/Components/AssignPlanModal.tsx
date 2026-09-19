import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Package, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { ClientItem, AvailablePlan } from '../types';

interface AssignPlanModalProps {
    client: ClientItem | null;
    plans: AvailablePlan[];
    isOpen: boolean;
    onClose: () => void;
}

export default function AssignPlanModal({
    client,
    plans,
    isOpen,
    onClose,
}: AssignPlanModalProps) {
    if (!isOpen || !client) return null;

    // Filter plans that match the client's tenant_type
    const matchingPlans = plans.filter((p) => p.client_model === client.tenant_type);

    const { data, setData, post, processing, errors, reset } = useForm({
        plan_id: matchingPlans.length > 0 ? matchingPlans[0].id : '',
        duration_days: matchingPlans.length > 0 ? matchingPlans[0].duration_days : 30,
        quota_override: '',
        notes: '',
    });

    const handlePlanSelect = (planId: number) => {
        const selected = plans.find((p) => p.id === planId);
        if (selected) {
            setData({
                ...data,
                plan_id: selected.id,
                duration_days: selected.duration_days,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.clients.assign-subscription', client.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Tetapkan Paket Langganan
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {client.name} ({client.tenant_type === 'INDIVIDUAL' ? 'Guru Mandiri' : 'Sekolah'})
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Select Plan */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Pilih Paket Langganan
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
                            {matchingPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => handlePlanSelect(plan.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                        data.plan_id === plan.id
                                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    <div>
                                        <p className="text-sm font-bold">{plan.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {plan.duration_days} Hari • Kuota {plan.ai_generation_quota} AI • Max {plan.max_seats} User
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                        Rp {Number(plan.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {errors.plan_id && (
                            <p className="text-xs text-rose-500 mt-1">{errors.plan_id}</p>
                        )}
                    </div>

                    {/* Duration Days & Custom Presets */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Durasi Masa Aktif (Bisa Di-custom)
                            </label>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                {data.duration_days} Hari
                            </span>
                        </div>
                        <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="number"
                                min="1"
                                max="1825"
                                value={data.duration_days}
                                onChange={(e) => setData('duration_days', parseInt(e.target.value) || 0)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                placeholder="Masukkan jumlah hari kustom"
                                required
                            />
                        </div>

                        {/* Presets Chips */}
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { label: '7 Hari (Trial)', val: 7 },
                                { label: '30 Hari (1 Bulan)', val: 30 },
                                { label: '90 Hari (3 Bulan)', val: 90 },
                                { label: '180 Hari (1 Semester)', val: 180 },
                                { label: '365 Hari (1 Tahun)', val: 365 },
                            ].map((preset) => (
                                <button
                                    key={preset.val}
                                    type="button"
                                    onClick={() => setData('duration_days', preset.val)}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                        data.duration_days === preset.val
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Override Quota AI */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Override Kuota AI (Opsional)
                        </label>
                        <div className="relative">
                            <Sparkles className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="number"
                                min="0"
                                placeholder="Sesuai kuota paket bawaan"
                                value={data.quota_override}
                                onChange={(e) => setData('quota_override', e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Catatan Administrasi
                        </label>
                        <textarea
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Contoh: Pembayaran manual via transfer bank atau aktivasi kontrak kerja sama"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Submit Actions */}
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
                            disabled={processing || !data.plan_id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{processing ? 'Memproses...' : 'Aktifkan Paket'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
