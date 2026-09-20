import InteractiveAuthMascot, {
    MascotMood,
} from '@/Components/InteractiveAuthMascot';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import OtpVerificationView from './Components/OtpVerificationView';
import RegisterFormFields, {
    RegisterField,
    RegisterFormData,
} from './Components/RegisterFormFields';

interface RegistrationResponse {
    success: boolean;
    token: string;
    phone: string;
    dev_otp?: string;
    redirect?: string;
}

interface ErrorResponse {
    message?: string;
    errors?: Record<string, string | string[]>;
}

const emptyForm: RegisterFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
};

function getMessage(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function normalizeErrors(
    errors: ErrorResponse['errors'],
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(errors ?? {}).map(([field, message]) => [
            field,
            getMessage(message) ?? 'Data tidak valid.',
        ]),
    );
}

function getErrorResponse(error: unknown): ErrorResponse {
    return axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data ?? {})
        : {};
}

export default function Register() {
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [mood, setMood] = useState<MascotMood>('idle');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpError, setOtpError] = useState<string | null>(null);
    const [formData, setFormData] = useState<RegisterFormData>(emptyForm);
    const [regToken, setRegToken] = useState('');
    const [verifiedPhone, setVerifiedPhone] = useState('');
    const [devOtp, setDevOtp] = useState<string | null>(null);

    const updateFormData = (key: RegisterField, value: string) => {
        setFormData((current) => ({ ...current, [key]: value }));
        setErrors((current) => {
            if (!current[key]) return current;
            const next = { ...current };
            delete next[key];
            return next;
        });
    };

    const handleFocus = (field: RegisterField) => {
        const moods: Partial<Record<RegisterField, MascotMood>> = {
            name: 'focus-name',
            email: 'focus-email',
            phone: 'focus-phone',
            password: 'focus-password',
            password_confirmation: 'focus-password',
        };
        setMood(moods[field] ?? 'idle');
    };

    const handleRequestOtp = async (event: FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});
        setMood('submitting');

        try {
            const { data } = await axios.post<RegistrationResponse>(
                route('register.request-otp'),
                formData,
            );
            if (data.success) {
                setRegToken(data.token);
                setVerifiedPhone(data.phone);
                setDevOtp(data.dev_otp ?? null);
                setStep('otp');
            }
        } catch (error: unknown) {
            const response = getErrorResponse(error);
            const validationErrors = normalizeErrors(response.errors);
            setErrors(
                Object.keys(validationErrors).length > 0
                    ? validationErrors
                    : {
                          name:
                              response.message ??
                              'Kode OTP gagal dikirim. Periksa nomor WhatsApp Anda.',
                      },
            );
        } finally {
            setProcessing(false);
            setMood('idle');
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        setProcessing(true);
        setOtpError(null);
        setMood('submitting');

        try {
            const { data } = await axios.post<RegistrationResponse>(
                route('register.verify-otp'),
                {
                    token: regToken,
                    otp,
                },
            );
            if (data.success) {
                setMood('success');
                window.setTimeout(() => {
                    window.location.href = data.redirect ?? route('dashboard');
                }, 700);
            }
        } catch (error: unknown) {
            const response = getErrorResponse(error);
            setMood('idle');
            setOtpError(
                getMessage(response.errors?.otp) ??
                    response.message ??
                    'Kode OTP tidak sesuai.',
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleResendOtp = async (): Promise<boolean> => {
        setOtpError(null);
        try {
            const { data } = await axios.post<RegistrationResponse>(
                route('register.resend-otp'),
                {
                    token: regToken,
                },
            );
            setDevOtp(data.dev_otp ?? null);
            return data.success;
        } catch (error: unknown) {
            setOtpError(
                getErrorResponse(error).message ??
                    'Kode OTP gagal dikirim ulang.',
            );
            return false;
        }
    };

    const changePhone = () => {
        setStep('form');
        setOtpError(null);
        setMood('idle');
    };

    return (
        <GuestLayout wide>
            <Head title="Daftar Akun — EduGen KBC" />

            <section className="auth-reveal relative mb-6 overflow-hidden rounded-[1.75rem] bg-slate-950 px-5 py-5 text-white shadow-xl shadow-emerald-950/20 sm:px-6">
                <div className="auth-aurora absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-400/30 blur-3xl" />
                <div className="absolute -bottom-16 left-1/4 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />

                <div className="relative flex items-center gap-4">
                    <InteractiveAuthMascot
                        mood={processing ? 'submitting' : mood}
                        showPassword={showPassword || showPasswordConfirm}
                        className="shrink-0 [&>div:first-child]:!h-20 [&>div:first-child]:!w-20 [&>div:last-child]:hidden"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Ruang kerja pendidik
                        </div>
                        <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                            {step === 'form'
                                ? 'Mulai berkarya bersama EduGen'
                                : 'Satu langkah lagi'}
                        </h1>
                        <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-300">
                            {step === 'form'
                                ? 'Buat akun untuk menyusun perangkat ajar Kurmer dan KBC dalam satu alur kerja.'
                                : 'Konfirmasi nomor WhatsApp agar akun Anda aman dan siap digunakan.'}
                        </p>
                    </div>
                </div>

                <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[11px] font-bold">
                    <div
                        className={`flex items-center gap-2 ${step === 'form' ? 'text-white' : 'text-emerald-300'}`}
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                            {step === 'otp' ? (
                                <Check className="h-3.5 w-3.5" />
                            ) : (
                                '1'
                            )}
                        </span>
                        Data akun
                    </div>
                    <div className="h-px w-10 bg-white/20 sm:w-20">
                        <div
                            className={`h-full bg-emerald-400 transition-all duration-500 ${step === 'otp' ? 'w-full' : 'w-0'}`}
                        />
                    </div>
                    <div
                        className={`flex items-center justify-end gap-2 ${step === 'otp' ? 'text-white' : 'text-slate-500'}`}
                    >
                        <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition ${step === 'otp' ? 'auth-step-pulse bg-emerald-500 text-white' : 'bg-white/10'}`}
                        >
                            2
                        </span>
                        Verifikasi
                    </div>
                </div>
            </section>

            <div key={step} className="auth-content-enter">
                {step === 'form' ? (
                    <RegisterFormFields
                        data={formData}
                        setData={updateFormData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleRequestOtp}
                        onFocusField={handleFocus}
                        onBlurField={() => setMood('idle')}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        showPasswordConfirm={showPasswordConfirm}
                        setShowPasswordConfirm={setShowPasswordConfirm}
                    />
                ) : (
                    <OtpVerificationView
                        phone={verifiedPhone}
                        devOtp={devOtp}
                        onVerify={handleVerifyOtp}
                        onResend={handleResendOtp}
                        onChangePhone={changePhone}
                        processing={processing}
                        error={otpError}
                    />
                )}
            </div>

            {step === 'form' && (
                <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs sm:flex-row dark:border-slate-800">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Verifikasi aman melalui WhatsApp
                    </span>
                    <Link
                        href={route('login')}
                        className="group inline-flex items-center gap-1.5 font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400"
                    >
                        Sudah punya akun? Masuk
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            )}
        </GuestLayout>
    );
}
