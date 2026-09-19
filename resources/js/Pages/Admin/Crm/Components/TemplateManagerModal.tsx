import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { WaTemplate } from '../types';
import {
    FileText,
    Plus,
    Edit2,
    Trash2,
    X,
    Check,
    Lock,
    Sparkles,
} from 'lucide-react';

interface TemplateManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: WaTemplate[];
}

export default function TemplateManagerModal({
    isOpen,
    onClose,
    templates,
}: TemplateManagerModalProps) {
    if (!isOpen) return null;

    const [editingTemplate, setEditingTemplate] = useState<WaTemplate | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const form = useForm({
        title: '',
        code: '',
        category: 'TRANSACTIONAL' as 'TRANSACTIONAL' | 'MARKETING' | 'REMINDER',
        content: '',
        footer: '',
        is_active: true,
    });

    const handleStartCreate = () => {
        setEditingTemplate(null);
        setIsCreating(true);
        form.setData({
            title: '',
            code: '',
            category: 'TRANSACTIONAL',
            content: '',
            footer: '',
            is_active: true,
        });
    };

    const handleStartEdit = (template: WaTemplate) => {
        setIsCreating(false);
        setEditingTemplate(template);
        form.setData({
            title: template.title,
            code: template.code,
            category: template.category,
            content: template.content,
            footer: template.footer || '',
            is_active: template.is_active,
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            form.put(route('admin.crm.templates.update', editingTemplate.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingTemplate(null);
                },
            });
        } else {
            form.post(route('admin.crm.templates.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreating(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = (template: WaTemplate) => {
        if (template.is_system) return;
        if (confirm(`Yakin ingin menghapus template "${template.title}"?`)) {
            router.delete(route('admin.crm.templates.destroy', template.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-scaleUp max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Kelola Template Pesan WhatsApp
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Buat draf pesan standar untuk efisiensi komunikasi CRM dan notifikasi transaksi.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isCreating && !editingTemplate && (
                            <button
                                onClick={handleStartCreate}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Template Baru
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    {/* Create / Edit Form Drawer */}
                    {(isCreating || editingTemplate) && (
                        <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 animate-fadeIn">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {editingTemplate ? `Edit Template: ${editingTemplate.title}` : 'Buat Template Baru'}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingTemplate(null);
                                    }}
                                    className="text-[11px] text-slate-400 hover:text-slate-600"
                                >
                                    Batal Edit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Judul Template
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Sambutan Klien Baru"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kode Template (Unik)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!editingTemplate}
                                        placeholder="KODE_TEMPLATE"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                        className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-mono disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={form.data.category}
                                        onChange={(e) => form.setData('category', e.target.value as any)}
                                        className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <option value="TRANSACTIONAL">Transaksi & OTP</option>
                                        <option value="REMINDER">Pengingat & Retensi</option>
                                        <option value="MARKETING">Promosi & Edukasi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Isi Pesan WhatsApp
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="Gunakan variabel seperti {nama}, {sekolah}, {otp_code}, dll."
                                    value={form.data.content}
                                    onChange={(e) => form.setData('content', e.target.value)}
                                    className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-sans leading-relaxed"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Footer Pesan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={form.data.footer}
                                    onChange={(e) => form.setData('footer', e.target.value)}
                                    placeholder="Contoh: EduGen AI Support"
                                    className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                                >
                                    {form.processing ? 'Menyimpan...' : 'Simpan Template'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Template Cards List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {templates.map((tpl) => (
                            <div
                                key={tpl.id}
                                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                    {tpl.title}
                                                </h4>
                                                {tpl.is_system && (
                                                    <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                                                        <Lock className="w-2.5 h-2.5" /> Sistem
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400">
                                                {tpl.code}
                                            </span>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold">
                                            {tpl.category}
                                        </span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-4 font-mono">
                                        {tpl.content}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                    <span className="text-[10px] text-slate-400">
                                        Footer: {tpl.footer || 'Default'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(tpl)}
                                            className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition"
                                            title="Edit Template"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        {!tpl.is_system && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(tpl)}
                                                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition"
                                                title="Hapus Template"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
