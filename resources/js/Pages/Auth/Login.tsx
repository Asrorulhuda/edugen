import { FormEventHandler, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import InteractiveAuthMascot, { MascotMood } from '@/Components/InteractiveAuthMascot';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LoaderCircle, CheckCircle2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [mood, setMood] = useState<MascotMood>('idle');
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setMood('submitting');

        post(route('login'), {
            onFinish: () => {
                reset('password');
                setMood('idle');
            },
            onError: () => {
                setMood('idle');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun — EduGen KBC" />

            {/* Cute Interactive Mascot Header */}
            <div className="flex flex-col items-center mb-6">
                <InteractiveAuthMascot
                    mood={processing ? 'submitting' : mood}
                    showPassword={showPassword}
                />

                <div className="text-center mt-3 space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Selamat Datang Kembali!
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Masuk untuk melanjutkan penyusunan modul ajar & asesmen terintegrasi.
                    </p>
                </div>
            </div>

            {/* Status Alert */}
            {status && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{status}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-bold text-slate-700 dark:text-slate-200" />

                    <div className="relative mt-1.5 rounded-2xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="nama@madrasah.sch.id / guru@gmail.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            autoComplete="username"
                            autoFocus
                            onFocus={() => setMood('focus-email')}
                            onBlur={() => setMood('idle')}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 text-xs text-rose-500" />
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="text-xs font-bold text-slate-700 dark:text-slate-200" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline transition"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>

                    <div className="relative mt-1.5 rounded-2xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Masukkan kata sandi akun Anda"
                            className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            autoComplete="current-password"
                            onFocus={() => setMood('focus-password')}
                            onBlur={() => setMood('idle')}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5 text-xs text-rose-500" />
                </div>

                {/* Remember Me */}
                <div className="pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                            className="rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            Ingat saya di perangkat ini
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition btn-tactile disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                <span>Memverifikasi Akun...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk ke Ruang Kerja</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Belum memiliki akun EduGen KBC?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline transition"
                    >
                        Daftar Akun Baru
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
