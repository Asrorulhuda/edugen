import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, KeyRound, School, UserCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    invitation: {
        token: string;
        email: string;
        tenant_name: string;
        institution: {
            name: string;
            type: string;
            city?: string;
        } | null;
        role_name: string;
    };
    is_existing_user: boolean;
}

export default function AcceptInvitation({ invitation, is_existing_user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        password: '',
        password_confirmation: '',
        otp: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('invitations.process', invitation.token));
    };

    return (
        <GuestLayout>
            <Head title="Terima Undangan Sekolah - EduGen KBC" />

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 mx-auto flex items-center justify-center">
                        <School className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Undangan Bergabung ke Sekolah
                    </h2>
                    <p className="text-xs text-slate-500">
                        Anda diundang untuk bergabung ke ruang kerja resmi satuan pendidikan berikut:
                    </p>
                </div>

                {/* Institution Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {invitation.institution?.type || 'INSTITUSI'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                            Peran: {invitation.role_name}
                        </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {invitation.institution?.name || invitation.tenant_name}
                    </h3>
                    {invitation.institution?.city && (
                        <p className="text-xs text-slate-500">{invitation.institution.city}</p>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                        Email akun Anda: <strong>{invitation.email}</strong>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* OTP Verification Input */}
                    <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <label className="text-xs font-bold text-slate-900 dark:text-white">
                                Kode OTP Verifikasi Sekolah (6 Digit) *
                            </label>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Masukkan kode 6 digit OTP yang Anda dapatkan dari Administrator Sekolah untuk mengonfirmasi keaslian undangan.
                        </p>
                        <input
                            type="text"
                            maxLength={6}
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Contoh: 749201"
                            required
                            className="w-full text-center tracking-[0.4em] font-mono text-lg font-black px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                        {errors.otp && (
                            <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {errors.otp}
                            </p>
                        )}
                    </div>
                    {!is_existing_user ? (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Lengkap (dengan Gelar) *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Siti Rahma, S.Pd."
                                    required
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Buat Kata Sandi Akun Baru *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Konfirmasi Kata Sandi *
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi"
                                    required
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                            Email Anda sudah terdaftar di platform EduGen KBC. Klik tombol di bawah untuk langsung menautkan ruang kerja sekolah ke akun Anda.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <UserCheck className="w-4 h-4" />
                        {processing ? 'Memproses...' : 'Terima Undangan & Masuk Ruang Kerja'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
