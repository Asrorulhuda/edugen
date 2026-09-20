import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import GuestLayout from '@/Layouts/GuestLayout';
import InteractiveAuthMascot, { MascotMood } from '@/Components/InteractiveAuthMascot';
import RegisterFormFields from './Components/RegisterFormFields';
import OtpVerificationView from './Components/OtpVerificationView';

export default function Register() {
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [mood, setMood] = useState<MascotMood>('idle');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpError, setOtpError] = useState<string | null>(null);

    // Form values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    // Verification token & state from backend
    const [regToken, setRegToken] = useState<string>('');
    const [verifiedPhone, setVerifiedPhone] = useState<string>('');
    const [devOtp, setDevOtp] = useState<string | null>(null);

    const updateFormData = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    // Step 1: Submit form & Request WhatsApp OTP
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMood('submitting');

        try {
            const response = await axios.post(route('register.request-otp'), formData);
            if (response.data.success) {
                setRegToken(response.data.token);
                setVerifiedPhone(response.data.phone);
                setDevOtp(response.data.dev_otp || null);
                setStep('otp');
                setMood('idle');
            }
        } catch (err: any) {
            setMood('idle');
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({
                    name: err.response?.data?.message || 'Gagal mengirim kode OTP. Periksa nomor WhatsApp Anda.',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (otpCode: string) => {
        setProcessing(true);
        setOtpError(null);
        setMood('submitting');

        try {
            const response = await axios.post(route('register.verify-otp'), {
                token: regToken,
                otp: otpCode,
            });

            if (response.data.success) {
                setMood('success');
                setTimeout(() => {
                    window.location.href = response.data.redirect || route('dashboard');
                }, 700);
            }
        } catch (err: any) {
            setMood('idle');
            const errorMsg =
                err.response?.data?.errors?.otp?.[0] ||
                err.response?.data?.message ||
                'Kode OTP yang Anda masukkan tidak sesuai.';
            setOtpError(errorMsg);
        } finally {
            setProcessing(false);
        }
    };

    // Resend OTP via WhatsApp
    const handleResendOtp = async (): Promise<boolean> => {
        setOtpError(null);
        try {
            const response = await axios.post(route('register.resend-otp'), {
                token: regToken,
            });
            if (response.data.success) {
                if (response.data.dev_otp) {
                    setDevOtp(response.data.dev_otp);
                }
                return true;
            }
            return false;
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Gagal mengirim ulang OTP.');
            return false;
        }
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru — EduGen (Kurmer & KBC)" />

            {/* Cute Interactive Mascot Header */}
            <div className="flex flex-col items-center mb-5">
                <InteractiveAuthMascot
                    mood={processing ? 'submitting' : mood}
                    showPassword={showPassword || showPasswordConfirm}
                />

                <div className="text-center mt-2.5 space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {step === 'form' ? 'Mulai Perjalanan EduGen Anda!' : 'Verifikasi Kode OTP WhatsApp'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        {step === 'form'
                            ? 'Daftar akun untuk menyusun modul ajar Kurmer & KBC dengan regulasi resmi.'
                            : 'Masukkan 6-digit kode OTP yang telah dikirimkan ke WhatsApp Anda.'}
                    </p>
                </div>
            </div>

            {/* Dynamic Step Content */}
            {step === 'form' ? (
                <RegisterFormFields
                    data={formData}
                    setData={updateFormData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleRequestOtp}
                    onFocusField={(field) => {
                        if (field === 'name') setMood('focus-name');
                        else if (field === 'email') setMood('focus-email');
                        else if (field === 'phone') setMood('focus-phone');
                        else if (field === 'password') setMood('focus-password');
                    }}
                    onBlurField={() => setMood('idle')}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showPasswordConfirm={showPasswordConfirm}
                    setShowPasswordConfirm={setShowPasswordConfirm}
                />
            ) : (
                <OtpVerificationView
                    phone={verifiedPhone}
                    displayPhone={formData.phone}
                    token={regToken}
                    devOtp={devOtp}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                    onChangePhone={() => {
                        setStep('form');
                        setOtpError(null);
                        setMood('idle');
                    }}
                    processing={processing}
                    error={otpError}
                />
            )}

            {/* Switch to Login Link */}
            {step === 'form' && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sudah memiliki akun EduGen?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline transition"
                        >
                            Masuk di Sini
                        </Link>
                    </p>
                </div>
            )}
        </GuestLayout>
    );
}
