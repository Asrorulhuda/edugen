import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    LoaderCircle,
    RefreshCw,
    Smartphone,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface OtpVerificationViewProps {
    phone: string;
    devOtp?: string | null;
    onVerify: (otp: string) => void;
    onResend: () => Promise<boolean>;
    onChangePhone: () => void;
    processing: boolean;
    error?: string | null;
}

export default function OtpVerificationView({
    phone,
    devOtp,
    onVerify,
    onResend,
    onChangePhone,
    processing,
    error,
}: OtpVerificationViewProps) {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState<number>(60);
    const [isResending, setIsResending] = useState(false);
    const [hasError, setHasError] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown Timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Shake animation trigger on error
    useEffect(() => {
        if (error) {
            setHasError(true);
            const t = setTimeout(() => setHasError(false), 800);
            return () => clearTimeout(t);
        }
    }, [error]);

    const handleDigitChange = (index: number, value: string) => {
        const cleaned = value.replace(/[^0-9]/g, '');
        if (!cleaned) {
            const next = [...otp];
            next[index] = '';
            setOtp(next);
            return;
        }

        const digit = cleaned.slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);

        // Auto-advance
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else {
            // If all 6 digits are complete, trigger auto-submit
            const fullOtp = next.join('');
            if (fullOtp.length === 6) {
                onVerify(fullOtp);
            }
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/[^0-9]/g, '')
            .slice(0, 6);
        if (!pasted) return;

        const next = [...otp];
        for (let i = 0; i < 6; i++) {
            next[i] = pasted[i] || '';
        }
        setOtp(next);

        const targetFocus = Math.min(pasted.length, 5);
        inputRefs.current[targetFocus]?.focus();

        if (pasted.length === 6) {
            onVerify(pasted);
        }
    };

    const handleResendClick = async () => {
        if (countdown > 0 || isResending) return;
        setIsResending(true);
        const ok = await onResend();
        setIsResending(false);
        if (ok) {
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length === 6) {
            onVerify(fullOtp);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header Status Card */}
            <div className="space-y-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-center dark:border-emerald-800/80 dark:bg-emerald-950/40">
                <div className="shadow-xs mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400">
                    <Smartphone className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verifikasi WhatsApp Anda
                </h3>
                <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Kode verifikasi 6-digit telah dikirimkan ke nomor WhatsApp:
                </p>
                <div className="shadow-2xs inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                    <span>+{phone}</span>
                </div>
            </div>

            {/* Sandbox Developer OTP Quick Pill */}
            {devOtp && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-center dark:border-amber-800 dark:bg-amber-950/40">
                    <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
                        🛠️ Mode Uji Coba: Kode OTP Anda adalah{' '}
                        <button
                            type="button"
                            onClick={() => {
                                const digits = devOtp.split('');
                                setOtp(digits);
                                onVerify(devOtp);
                            }}
                            className="font-mono font-black text-amber-900 underline hover:text-amber-700 dark:text-amber-200"
                        >
                            {devOtp} (Klik untuk isi)
                        </button>
                    </span>
                </div>
            )}

            {/* 6 Digit Input Boxes */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div
                    className={`flex items-center justify-center gap-2 sm:gap-2.5 ${hasError ? 'animate-shake' : ''}`}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleDigitChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`h-13 shadow-xs w-11 select-none rounded-2xl border text-center font-mono text-xl font-black transition-all duration-150 sm:h-14 sm:w-12 sm:text-2xl ${
                                digit
                                    ? 'scale-102 border-emerald-500 bg-emerald-50/40 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300'
                                    : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                            } focus:scale-105 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="animate-fade-in flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-800/80 dark:bg-rose-950/30 dark:text-rose-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Verification Button */}
                <button
                    type="submit"
                    disabled={processing || otp.join('').length < 6}
                    className="btn-tactile flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-95 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Memverifikasi Akun Anda...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Konfirmasi & Masuk EduGen</span>
                        </>
                    )}
                </button>
            </form>

            {/* Resend & Edit Number Action Footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs sm:flex-row dark:border-slate-800">
                {/* Back to Edit Phone */}
                <button
                    type="button"
                    onClick={onChangePhone}
                    disabled={processing}
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Ubah Nomor WhatsApp</span>
                </button>

                {/* Resend OTP */}
                <div>
                    {countdown > 0 ? (
                        <span className="font-medium text-slate-400">
                            Kirim ulang dalam{' '}
                            <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                                00:{countdown.toString().padStart(2, '0')}
                            </strong>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendClick}
                            disabled={isResending || processing}
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            <RefreshCw
                                className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`}
                            />
                            <span>Kirim Ulang Kode OTP</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
