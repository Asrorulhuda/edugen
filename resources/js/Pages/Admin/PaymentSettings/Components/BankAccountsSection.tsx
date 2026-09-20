import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Building2, Plus, Edit2, Trash2, Check, X, ShieldCheck } from 'lucide-react';
import Modal from '@/Components/Modal';

export interface BankAccount {
    id: number;
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    badge?: string | null;
    is_active: boolean;
    order_index: number;
}

interface Props {
    bankAccounts: BankAccount[];
}

export default function BankAccountsSection({ bankAccounts }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

    const { data, setData, post, put, reset, processing } = useForm({
        bank_code: '',
        bank_name: '',
        account_number: '',
        account_name: '',
        badge: '',
        is_active: true,
        order_index: 0,
    });

    const openCreateModal = () => {
        setEditingAccount(null);
        reset();
        setData({
            bank_code: '',
            bank_name: '',
            account_number: '',
            account_name: '',
            badge: '',
            is_active: true,
            order_index: bankAccounts.length + 1,
        });
        setModalOpen(true);
    };

    const openEditModal = (acc: BankAccount) => {
        setEditingAccount(acc);
        setData({
            bank_code: acc.bank_code,
            bank_name: acc.bank_name,
            account_number: acc.account_number,
            account_name: acc.account_name,
            badge: acc.badge || '',
            is_active: acc.is_active,
            order_index: acc.order_index,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAccount) {
            put(route('admin.payment-settings.banks.update', editingAccount.id), {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post(route('admin.payment-settings.banks.store'), {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (acc: BankAccount) => {
        if (confirm(`Hapus rekening ${acc.bank_name} (${acc.account_number})?`)) {
            router.delete(route('admin.payment-settings.banks.destroy', acc.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 font-bold">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            Rekening Bank Transfer Manual
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Daftar rekening tujuan transfer yang tampil pada invoice dan instruksi pembayaran pelanggan
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Rekening</span>
                </button>
            </div>

            {/* Bank Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankAccounts.map((acc) => (
                    <div
                        key={acc.id}
                        className={`p-4 rounded-xl border transition-all ${
                            acc.is_active
                                ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
                                : 'bg-slate-100/40 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600">
                                        {acc.bank_code}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {acc.bank_name}
                                    </h4>
                                </div>
                                {acc.badge && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                                        ✓ {acc.badge}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => openEditModal(acc)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                                    title="Edit"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(acc)}
                                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                            <div>
                                <span className="font-mono font-bold text-slate-900 dark:text-white block">
                                    {acc.account_number}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                    a.n. {acc.account_name}
                                </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.is_active ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                                {acc.is_active ? 'Aktif' : 'Non-aktif'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Create/Edit */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {editingAccount ? 'Edit Rekening Bank' : 'Tambah Rekening Bank Baru'}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Kode Bank</label>
                            <input
                                type="text"
                                value={data.bank_code}
                                onChange={(e) => setData('bank_code', e.target.value)}
                                placeholder="BSI, BCA, BRI, dll"
                                required
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nama Bank</label>
                            <input
                                type="text"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                                placeholder="Bank Syariah Indonesia"
                                required
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nomor Rekening</label>
                        <input
                            type="text"
                            value={data.account_number}
                            onChange={(e) => setData('account_number', e.target.value)}
                            placeholder="7188291034"
                            required
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Atas Nama Rekening</label>
                        <input
                            type="text"
                            value={data.account_name}
                            onChange={(e) => setData('account_name', e.target.value)}
                            placeholder="PT EduGen Media Karakter"
                            required
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Badge Keterangan (Opsional)</label>
                        <input
                            type="text"
                            value={data.badge}
                            onChange={(e) => setData('badge', e.target.value)}
                            placeholder="Syariah Terverifikasi, BUMN, Transfer Otomatis"
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="bank_is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="bank_is_active" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                            Rekening Aktif dan Tampil di Halaman Checkout
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Rekening'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
