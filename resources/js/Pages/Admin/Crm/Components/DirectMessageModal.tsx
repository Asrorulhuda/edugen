import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ClientRecipient, WaTemplate } from '../types';
import {
    Send,
    X,
    User,
    FileText,
    MessageSquare,
    Sparkles,
    Check,
} from 'lucide-react';

interface DirectMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientRecipients: ClientRecipient[];
    templates: WaTemplate[];
}

export default function DirectMessageModal({
    isOpen,
    onClose,
    clientRecipients,
    templates,
}: DirectMessageModalProps) {
    if (!isOpen) return null;

    const [selectedClient, setSelectedClient] = useState<string>('');
    const form = useForm({
        recipient_number: '',
        recipient_name: '',
        message: '',
        footer: '',
        tenant_id: null as number | null,
    });

    const handleSelectClient = (clientId: string) => {
        setSelectedClient(clientId);
        if (!clientId) {
            form.setData((prev) => ({
                ...prev,
                recipient_number: '',
                recipient_name: '',
                tenant_id: null,
            }));
            return;
        }

        const client = clientRecipients.find((c) => c.id.toString() === clientId);
        if (client) {
            form.setData((prev) => ({
                ...prev,
                recipient_number: client.phone || '',
                recipient_name: client.contact_name || client.name,
                tenant_id: client.id,
            }));
        }
    };

    const handleApplyTemplate = (template: WaTemplate) => {
        let content = template.content;
        const name = form.data.recipient_name || 'Bapak/Ibu Guru';
        content = content.replace('{nama}', name);
        content = content.replace('{nama_guru}', name);

        form.setData((prev) => ({
            ...prev,
            message: content,
            footer: template.footer || prev.footer,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.crm.send'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-scaleUp">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Kirim Pesan WhatsApp Langsung
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Kirim notifikasi, pengingat, atau bantuan langsung ke nomor WA klien.
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
                    {/* Quick Template Picker */}
                    {templates.length > 0 && (
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Pilih Template Siap Pakai (Opsional)
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {templates.map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        type="button"
                                        onClick={() => handleApplyTemplate(tpl)}
                                        className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 transition"
                                    >
                                        {tpl.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Target Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Pilih Klien Terdaftar (Opsional)
                            </label>
                            <select
                                value={selectedClient}
                                onChange={(e) => handleSelectClient(e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="">-- Masukkan Nomor Manual --</option>
                                {clientRecipients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.type === 'INSTITUTION' ? 'Sekolah' : 'Guru'}) {c.phone ? `- ${c.phone}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Penerima
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Pak Budi / SDN 01"
                                value={form.data.recipient_name}
                                onChange={(e) => form.setData('recipient_name', e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Recipient Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nomor WhatsApp Penerima <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: 08123456789 atau 628123456789"
                            value={form.data.recipient_number}
                            onChange={(e) => form.setData('recipient_number', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Format otomatis dikonversi ke format standar WhatsApp internasional (628...).
                        </span>
                    </div>

                    {/* Message Body */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Isi Pesan WhatsApp <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[10px] text-slate-400">
                                {form.data.message.length} karakter
                            </span>
                        </div>
                        <textarea
                            rows={5}
                            required
                            placeholder="Ketik isi pesan WhatsApp di sini... Gunakan *tebal*, _miring_, ~coret~ untuk format WhatsApp."
                            value={form.data.message}
                            onChange={(e) => form.setData('message', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500 font-sans leading-relaxed"
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
                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
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
                            disabled={form.processing || !form.data.recipient_number || !form.data.message}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm active:scale-95"
                        >
                            <Send className="w-3.5 h-3.5" />
                            {form.processing ? 'Mengirim...' : 'Kirim Pesan WA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
