import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { CrmAudiences, WaTemplate } from '../types';
import {
    Radio,
    X,
    Users,
    Clock,
    AlertTriangle,
    FileText,
    Sparkles,
    Send,
    Tag,
} from 'lucide-react';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    audiences: CrmAudiences;
    templates: WaTemplate[];
}

export default function BroadcastModal({
    isOpen,
    onClose,
    audiences,
    templates,
}: BroadcastModalProps) {
    if (!isOpen) return null;

    const form = useForm({
        audience_segment: 'ALL_TEACHERS',
        message_template: '',
        footer: '',
        custom_numbers: '',
    });

    const handleApplyTemplate = (template: WaTemplate) => {
        form.setData((prev) => ({
            ...prev,
            message_template: template.content,
            footer: template.footer || prev.footer,
        }));
    };

    const handleInsertTag = (tag: string) => {
        form.setData('message_template', form.data.message_template + ' ' + tag);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.crm.broadcast'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    const segments = [
        {
            id: 'ALL_TEACHERS',
            title: 'Semua Guru Pribadi',
            desc: 'Klien akun guru independen',
            count: audiences.teachers_count,
            icon: Users,
            color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
        },
        {
            id: 'ALL_SCHOOLS',
            title: 'Semua Sekolah / Madrasah',
            desc: 'Akun institusi pendidikan',
            count: audiences.schools_count,
            icon: Users,
            color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
        },
        {
            id: 'EXPIRING_SOON',
            title: 'Masa Aktif Habis ≤ 7 Hari',
            desc: 'Retensi & pengingat perpanjangan',
            count: audiences.expiring_count,
            icon: Clock,
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
        },
        {
            id: 'LOW_QUOTA',
            title: 'Sisa Kuota Rendah (≤ 5)',
            desc: 'Pemberitahuan kuota RPP menipis',
            count: audiences.low_quota_count,
            icon: AlertTriangle,
            color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
        },
        {
            id: 'CUSTOM',
            title: 'Daftar Nomor Kustom',
            desc: 'Input nomor manual bebas',
            count: null,
            icon: FileText,
            color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
        },
    ];

    const tags = [
        { label: 'Nama Klien', tag: '{nama}' },
        { label: 'Nama Sekolah', tag: '{sekolah}' },
        { label: 'Nama Paket', tag: '{paket}' },
        { label: 'Sisa Kuota', tag: '{sisa_kuota}' },
        { label: 'Hari Tersisa', tag: '{hari_tersisa}' },
        { label: 'Tanggal Expired', tag: '{tanggal_expired}' },
        { label: 'Link Perpanjangan', tag: '{link_perpanjang}' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Radio className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Broadcast Massal WhatsApp (CRM Campaign)
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Kirim pesan terpersonalisasi ke target audiens klien secara serentak.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Audience Segment Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Pilih Segmen Target Penerima <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {segments.map((seg) => {
                                const Icon = seg.icon;
                                const isSelected = form.data.audience_segment === seg.id;
                                return (
                                    <button
                                        key={seg.id}
                                        type="button"
                                        onClick={() => form.setData('audience_segment', seg.id)}
                                        className={`text-left p-3 rounded-xl border transition-all ${
                                            isSelected
                                                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-500'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className={`p-1.5 rounded-lg ${seg.color}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                            </div>
                                            {seg.count !== null && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    {seg.count} Klien
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {seg.title}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            {seg.desc}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom numbers textarea if custom segment */}
                    {form.data.audience_segment === 'CUSTOM' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Masukkan Daftar Nomor WhatsApp
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Masukkan satu nomor per baris atau pisahkan dengan koma. Contoh:&#10;08123456789&#10;628987654321"
                                value={form.data.custom_numbers}
                                onChange={(e) => form.setData('custom_numbers', e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-purple-500 focus:border-purple-500 font-mono"
                            />
                        </div>
                    )}

                    {/* Quick Template Picker */}
                    {templates.length > 0 && (
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Gunakan Isi Template Pesan
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {templates.map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        type="button"
                                        onClick={() => handleApplyTemplate(tpl)}
                                        className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 transition"
                                    >
                                        {tpl.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Variable Tokens Helper */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-purple-500" />
                            Klik Variabel untuk Menyisipkan ke Pesan:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((t) => (
                                <button
                                    key={t.tag}
                                    type="button"
                                    onClick={() => handleInsertTag(t.tag)}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 transition"
                                >
                                    {t.tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Template Textarea */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Format Pesan Broadcast <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows={6}
                            required
                            placeholder="Ketik draf pesan broadcast... Variabel seperti {nama} akan digantikan secara otomatis sesuai data tiap klien."
                            value={form.data.message_template}
                            onChange={(e) => form.setData('message_template', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-purple-500 focus:border-purple-500 leading-relaxed font-sans"
                        />
                    </div>

                    {/* Footer */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Footer Pesan (Opsional)
                        </label>
                        <input
                            type="text"
                            placeholder="Biarkan kosong untuk menggunakan default footer"
                            value={form.data.footer}
                            onChange={(e) => form.setData('footer', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.message_template}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition shadow-sm active:scale-95"
                        >
                            <Send className="w-3.5 h-3.5" />
                            {form.processing ? 'Memproses Broadcast...' : 'Luncurkan Broadcast WhatsApp'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
