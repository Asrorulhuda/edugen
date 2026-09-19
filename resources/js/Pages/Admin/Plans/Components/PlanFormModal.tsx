import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Package, Plus, Trash2, Check, Sparkles, Users, Calendar } from 'lucide-react';
import { SubscriptionPlanItem } from '../types';

interface PlanFormModalProps {
    plan: SubscriptionPlanItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PlanFormModal({ plan, isOpen, onClose }: PlanFormModalProps) {
    if (!isOpen) return null;

    const isEdit = !!plan;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: plan?.name ?? '',
        client_model: (plan?.client_model ?? 'INDIVIDUAL') as 'INDIVIDUAL' | 'INSTITUTION',
        price: plan?.price ?? 99000,
        duration_days: plan?.duration_days ?? 30,
        max_seats: plan?.max_seats ?? 1,
        ai_generation_quota: plan?.ai_generation_quota ?? 100,
        features: plan?.features && plan.features.length > 0
            ? [...plan.features]
            : [
                'Akses Generator Modul Ajar RPP KBC',
                'Generator Bank Soal & Kisi-Kisi',
                'Download Format Word & PDF',
            ],
        is_active: plan?.is_active ?? true,
        is_popular: plan?.is_popular ?? false,
        order_index: plan?.order_index ?? 0,
    });

    const [newFeatureText, setNewFeatureText] = useState('');

    const handleAddFeature = () => {
        if (!newFeatureText.trim()) return;
        setData('features', [...data.features, newFeatureText.trim()]);
        setNewFeatureText('');
    };

    const handleRemoveFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.plans.update', plan.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.plans.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isEdit ? 'Edit Paket Langganan' : 'Tambah Paket Langganan Baru'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Konfigurasi harga, kuota AI, durasi, dan fitur paket
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
                    {/* Category Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Target Pengguna (Model Client)
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setData({ ...data, client_model: 'INDIVIDUAL', max_seats: 1 })}
                                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.client_model === 'INDIVIDUAL'
                                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                Guru Mandiri (Individual)
                            </button>
                            <button
                                type="button"
                                onClick={() => setData({ ...data, client_model: 'INSTITUTION', max_seats: 15 })}
                                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.client_model === 'INSTITUTION'
                                        ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                Sekolah / Madrasah (Institusi)
                            </button>
                        </div>
                    </div>

                    {/* Plan Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Nama Paket Langganan
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Paket Guru Juara (Tahunan)"
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Price & Duration */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Harga (Rupiah)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={data.price}
                                onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            />
                            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Durasi Aktif (Hari)
                                </label>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
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
                                    required
                                />
                            </div>
                            {/* Preset chips */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {[30, 90, 180, 365].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setData('duration_days', d)}
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-all ${
                                            data.duration_days === d
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {d} Hari
                                    </button>
                                ))}
                            </div>
                            {errors.duration_days && <p className="text-xs text-rose-500 mt-1">{errors.duration_days}</p>}
                        </div>
                    </div>

                    {/* AI Quota & Max Seats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Kuota Generasi AI
                            </label>
                            <div className="relative">
                                <Sparkles className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="number"
                                    min="0"
                                    value={data.ai_generation_quota}
                                    onChange={(e) => setData('ai_generation_quota', parseInt(e.target.value) || 0)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {errors.ai_generation_quota && <p className="text-xs text-rose-500 mt-1">{errors.ai_generation_quota}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Maksimal Kursi (Seats)
                            </label>
                            <div className="relative">
                                <Users className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="number"
                                    min="1"
                                    value={data.max_seats}
                                    onChange={(e) => setData('max_seats', parseInt(e.target.value) || 1)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {errors.max_seats && <p className="text-xs text-rose-500 mt-1">{errors.max_seats}</p>}
                        </div>
                    </div>

                    {/* Features List */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Daftar Fitur Paket
                        </label>
                        <div className="space-y-2 mb-2">
                            {data.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg flex-1">
                                        {feature}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFeatureText}
                                onChange={(e) => setNewFeatureText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddFeature();
                                    }
                                }}
                                placeholder="Tambah poin fitur baru..."
                                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>

                    {/* Options (Popular, Active) */}
                    <div className="flex items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={data.is_popular}
                                onChange={(e) => setData('is_popular', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            Tandai Sebagai "Terpopuler"
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            Paket Aktif & Tampil di Publik
                        </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3">
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
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Paket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
