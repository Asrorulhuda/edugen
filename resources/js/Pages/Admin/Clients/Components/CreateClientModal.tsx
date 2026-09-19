import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, UserPlus, Building2, User, Mail, Lock, School } from 'lucide-react';
import { AvailablePlan } from '../types';

interface CreateClientModalProps {
    plans: AvailablePlan[];
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateClientModal({ plans, isOpen, onClose }: CreateClientModalProps) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        tenant_type: 'INSTITUTION' as 'INDIVIDUAL' | 'INSTITUTION',
        name: '',
        admin_name: '',
        admin_email: '',
        password: '',
        npsn: '',
        education_level: 'SMA',
        plan_id: '',
    });

    const matchingPlans = plans.filter((p) => p.client_model === data.tenant_type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.clients.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Daftarkan Client Baru
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Buat akun sekolah atau guru mandiri secara langsung
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
                    {/* Client Type Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Kategori Client
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setData({ ...data, tenant_type: 'INSTITUTION', plan_id: '' });
                                }}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.tenant_type === 'INSTITUTION'
                                        ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Building2 className="w-4 h-4" />
                                Sekolah / Lembaga
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setData({ ...data, tenant_type: 'INDIVIDUAL', plan_id: '' });
                                }}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    data.tenant_type === 'INDIVIDUAL'
                                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Guru Mandiri
                            </button>
                        </div>
                    </div>

                    {/* Client Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {data.tenant_type === 'INSTITUTION' ? 'Nama Sekolah / Institusi' : 'Nama Lengkap Guru'}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={data.tenant_type === 'INSTITUTION' ? 'Contoh: SMA Negeri 1 Surabaya' : 'Contoh: Budi Santoso, S.Pd.'}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Institution-specific fields */}
                    {data.tenant_type === 'INSTITUTION' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    NPSN (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.npsn}
                                    onChange={(e) => setData('npsn', e.target.value)}
                                    placeholder="8 digit NPSN"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Jenjang Pendidikan
                                </label>
                                <select
                                    value={data.education_level}
                                    onChange={(e) => setData('education_level', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                >
                                    <option value="SD">SD / MI</option>
                                    <option value="SMP">SMP / MTs</option>
                                    <option value="SMA">SMA / MA</option>
                                    <option value="SMK">SMK</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Administrator / User Details */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Akun Login Penanggung Jawab
                        </h4>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Nama Pengguna
                            </label>
                            <input
                                type="text"
                                value={data.admin_name}
                                onChange={(e) => setData('admin_name', e.target.value)}
                                placeholder="Nama penanggung jawab"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            />
                            {errors.admin_name && <p className="text-xs text-rose-500 mt-1">{errors.admin_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="email"
                                    value={data.admin_email}
                                    onChange={(e) => setData('admin_email', e.target.value)}
                                    placeholder="alamat@sekolah.sch.id"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {errors.admin_email && <p className="text-xs text-rose-500 mt-1">{errors.admin_email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Password Awal
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    {/* Initial Plan Assignment */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Paket Langganan Awal (Opsional)
                        </label>
                        <select
                            value={data.plan_id}
                            onChange={(e) => setData('plan_id', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="">Default Trial 14 Hari</option>
                            {matchingPlans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} (Rp {Number(p.price).toLocaleString('id-ID')} • {p.duration_days} Hari)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action buttons */}
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
                            {processing ? 'Menyimpan...' : 'Daftarkan Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
