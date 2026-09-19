import { FormEventHandler, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import InteractiveAuthMascot, { MascotMood } from '@/Components/InteractiveAuthMascot';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, LoaderCircle, ShieldCheck, Check } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [mood, setMood] = useState<MascotMood>('idle');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setMood('submitting');

        post(route('password.store'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
                setMood('idle');
            },
            onError: () => setMood('idle'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi — EduGen KBC" />

            <div className="flex flex-col items-center mb-5">
                <InteractiveAuthMascot
                    mood={processing ? 'submitting' : mood}
                    showPassword={showPassword || showPasswordConfirm}
                />

                <div className="text-center mt-2.5 space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Atur Kata Sandi Baru
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Tentukan kata sandi baru yang aman untuk akun EduGen KBC Anda.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-bold text-slate-700 dark:text-slate-200" />

                    <div className="relative mt-1 rounded-2xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                            autoComplete="username"
                            disabled
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1 text-xs text-rose-500" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-xs font-bold text-slate-700 dark:text-slate-200" />

                    <div className="relative mt-1 rounded-2xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            autoComplete="new-password"
                            autoFocus
                            onFocus={() => setMood('focus-password')}
                            onBlur={() => setMood('idle')}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1 text-xs text-rose-500" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi Baru" className="text-xs font-bold text-slate-700 dark:text-slate-200" />

                    <div className="relative mt-1 rounded-2xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi baru"
                            className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            autoComplete="new-password"
                            onFocus={() => setMood('focus-password')}
                            onBlur={() => setMood('idle')}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                            {showPasswordConfirm ? (
                                <EyeOff className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {data.password_confirmation && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                            {data.password === data.password_confirmation ? (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                                    <Check className="w-3.5 h-3.5" /> Kata sandi cocok
                                </span>
                            ) : (
                                <span className="text-rose-500 font-medium">
                                    Kata sandi belum sama
                                </span>
                            )}
                        </div>
                    )}
                    <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-500" />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition btn-tactile disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                <span>Menyimpan Sandi Baru...</span>
                            </>
                        ) : (
                            <>
                                <span>Simpan Kata Sandi & Masuk</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Masuk</span>
                </Link>
            </div>
        </GuestLayout>
    );
}
