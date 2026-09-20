import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
    ShieldCheck,
    Smartphone,
    User,
} from 'lucide-react';
import { FormEvent } from 'react';

export interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export type RegisterField = keyof RegisterFormData;

interface RegisterFormFieldsProps {
    data: RegisterFormData;
    setData: (key: RegisterField, value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (event: FormEvent) => void;
    onFocusField: (field: RegisterField) => void;
    onBlurField: () => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showPasswordConfirm: boolean;
    setShowPasswordConfirm: (show: boolean) => void;
}

const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-xs text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:bg-slate-900';

function passwordStrength(password: string): number {
    if (!password) return 0;
    return [
        password.length >= 8,
        /[A-Z]/.test(password) || /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password) && password.length >= 10,
    ].filter(Boolean).length;
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
    const strength = passwordStrength(data.password);
    const strengthLabel = [
        'Masukkan kata sandi',
        'Cukup',
        'Kuat',
        'Sangat kuat',
    ][strength];
    const passwordsMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama lengkap & gelar"
                        className="text-xs font-bold text-slate-700 dark:text-slate-200"
                    />
                    <div className="group relative mt-1.5">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500" />
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="Ahmad Baihaqi, S.Pd."
                            className={inputClass}
                            autoComplete="name"
                            autoFocus
                            onFocus={() => onFocusField('name')}
                            onBlur={onBlurField}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            required
                        />
                    </div>
                    <InputError
                        message={errors.name}
                        className="mt-1.5 text-xs text-rose-500"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Alamat email"
                        className="text-xs font-bold text-slate-700 dark:text-slate-200"
                    />
                    <div className="group relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="guru@sekolah.sch.id"
                            className={inputClass}
                            autoComplete="email"
                            onFocus={() => onFocusField('email')}
                            onBlur={onBlurField}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            required
                        />
                    </div>
                    <InputError
                        message={errors.email}
                        className="mt-1.5 text-xs text-rose-500"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between gap-3">
                    <InputLabel
                        htmlFor="phone"
                        value="Nomor WhatsApp aktif"
                        className="text-xs font-bold text-slate-700 dark:text-slate-200"
                    />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Tujuan kode OTP
                    </span>
                </div>
                <div className="group relative mt-1.5">
                    <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        placeholder="081234567890"
                        className={`${inputClass} font-mono`}
                        autoComplete="tel"
                        inputMode="tel"
                        onFocus={() => onFocusField('phone')}
                        onBlur={onBlurField}
                        onChange={(event) =>
                            setData(
                                'phone',
                                event.target.value.replace(/[^0-9+]/g, ''),
                            )
                        }
                        required
                    />
                </div>
                <InputError
                    message={errors.phone}
                    className="mt-1.5 text-xs text-rose-500"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Kata sandi"
                        className="text-xs font-bold text-slate-700 dark:text-slate-200"
                    />
                    <div className="group relative mt-1.5">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            className={`${inputClass} pr-11`}
                            autoComplete="new-password"
                            onFocus={() => onFocusField('password')}
                            onBlur={onBlurField}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-emerald-600"
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-1.5 text-xs text-rose-500"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi kata sandi"
                        className="text-xs font-bold text-slate-700 dark:text-slate-200"
                    />
                    <div className="group relative mt-1.5">
                        <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500" />
                        <input
                            id="password_confirmation"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi"
                            className={`${inputClass} pr-11`}
                            autoComplete="new-password"
                            onFocus={() =>
                                onFocusField('password_confirmation')
                            }
                            onBlur={onBlurField}
                            onChange={(event) =>
                                setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordConfirm(!showPasswordConfirm)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-emerald-600"
                            aria-label={
                                showPasswordConfirm
                                    ? 'Sembunyikan konfirmasi kata sandi'
                                    : 'Tampilkan konfirmasi kata sandi'
                            }
                        >
                            {showPasswordConfirm ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5 text-xs text-rose-500"
                    />
                </div>
            </div>

            {data.password && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                            Kekuatan sandi: {strengthLabel}
                        </span>
                        {data.password_confirmation && (
                            <span
                                className={`inline-flex items-center gap-1 font-bold ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}
                            >
                                {passwordsMatch && (
                                    <Check className="h-3.5 w-3.5" />
                                )}
                                {passwordsMatch ? 'Cocok' : 'Belum cocok'}
                            </span>
                        )}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {[1, 2, 3].map((level) => (
                            <span
                                key={level}
                                className={`h-1.5 rounded-full transition-all duration-300 ${strength >= level ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={processing}
                className="auth-submit btn-tactile relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-4 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {processing ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Mengirim kode OTP...
                        </>
                    ) : (
                        <>
                            Buat akun & verifikasi
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </span>
            </button>
        </form>
    );
}
