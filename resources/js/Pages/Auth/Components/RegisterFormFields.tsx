import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { User, Mail, Smartphone, Lock, Eye, EyeOff, ShieldCheck, Check, ArrowRight, LoaderCircle } from 'lucide-react';

interface RegisterFormFieldsProps {
    data: {
        name: string;
        email: string;
        phone: string;
        password: string;
        password_confirmation: string;
    };
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onFocusField: (field: string) => void;
    onBlurField: () => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showPasswordConfirm: boolean;
    setShowPasswordConfirm: (show: boolean) => void;
}

export default function RegisterFormFields({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onFocusField,
    onBlurField,
    showPassword,
    setShowPassword,
    showPasswordConfirm,
    setShowPasswordConfirm,
}: RegisterFormFieldsProps) {
    // Password strength logic
    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 10) score++;
        return score; // 0, 1, 2, 3
    };

    const strength = calculateStrength(data.password);
    const strengthLabels = ['Belum memadai', 'Cukup aman', 'Kuat & Aman', 'Sangat Kuat'];
    const strengthColors = ['bg-slate-200 dark:bg-slate-700', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500'];

    return (
        <form onSubmit={onSubmit} className="space-y-3.5 animate-fadeIn">
            {/* Name Field */}
            <div>
                <InputLabel htmlFor="name" value="Nama Lengkap & Gelar" className="text-xs font-bold text-slate-700 dark:text-slate-200" />
                <div className="relative mt-1 rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                    </div>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        placeholder="Contoh: Ahmad Baihaqi, S.Pd., M.Pd."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        autoComplete="name"
                        autoFocus
                        onFocus={() => onFocusField('name')}
                        onBlur={onBlurField}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </div>
                <InputError message={errors.name} className="mt-1 text-xs text-rose-500" />
            </div>

            {/* Email Field */}
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
                        placeholder="nama@madrasah.sch.id / guru@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        autoComplete="username"
                        onFocus={() => onFocusField('email')}
                        onBlur={onBlurField}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                </div>
                <InputError message={errors.email} className="mt-1 text-xs text-rose-500" />
            </div>

            {/* WhatsApp Phone Number Field */}
            <div>
                <div className="flex items-center justify-between">
                    <InputLabel htmlFor="phone" value="Nomor WhatsApp Aktif" className="text-xs font-bold text-slate-700 dark:text-slate-200" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Kirim OTP WhatsApp
                    </span>
                </div>
                <div className="relative mt-1 rounded-2xl shadow-xs flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        placeholder="081234567890 / 62812..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition font-mono"
                        autoComplete="tel"
                        onFocus={() => onFocusField('phone')}
                        onBlur={onBlurField}
                        onChange={(e) => setData('phone', e.target.value.replace(/[^0-9+]/g, ''))}
                        required
                    />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Kode verifikasi OTP 6-digit akan dikirimkan otomatis ke nomor WhatsApp ini.
                </p>
                <InputError message={errors.phone} className="mt-1 text-xs text-rose-500" />
            </div>

            {/* Password Field */}
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
                        onFocus={() => onFocusField('password')}
                        onBlur={onBlurField}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                {/* Password Strength Indicator */}
                {data.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full flex-1 transition-all ${strength >= 1 ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${strength >= 2 ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${strength >= 3 ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <span>Kekuatan sandi: <strong className="text-slate-700 dark:text-slate-200">{strengthLabels[strength]}</strong></span>
                            <span className={data.password.length >= 8 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                                {data.password.length}/8 karakter
                            </span>
                        </div>
                    </div>
                )}
                <InputError message={errors.password} className="mt-1 text-xs text-rose-500" />
            </div>

            {/* Confirm Password Field */}
            <div>
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="text-xs font-bold text-slate-700 dark:text-slate-200" />
                <div className="relative mt-1 rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                        id="password_confirmation"
                        type={showPasswordConfirm ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Ulangi kata sandi di atas"
                        className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        autoComplete="new-password"
                        onFocus={() => onFocusField('password')}
                        onBlur={onBlurField}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title={showPasswordConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                    >
                        {showPasswordConfirm ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
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

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition btn-tactile disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            <span>Memproses Kode OTP...</span>
                        </>
                    ) : (
                        <>
                            <span>Lanjut ke Verifikasi OTP</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
