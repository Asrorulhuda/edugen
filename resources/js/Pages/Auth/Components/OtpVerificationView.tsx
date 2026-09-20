import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle, LoaderCircle, ShieldCheck, KeyRound } from 'lucide-react';

interface OtpVerificationViewProps {
    phone: string;
    displayPhone: string;
    token: string;
    devOtp?: string | null;
    onVerify: (otp: string) => void;
    onResend: () => Promise<boolean>;
    onChangePhone: () => void;
    processing: boolean;
    error?: string | null;
}

export default function OtpVerificationView({
    phone,
    displayPhone,
    token,
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

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
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
        <div className="space-y-5 animate-fadeIn">
            {/* Header Status Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verifikasi WhatsApp Anda
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Kode verifikasi 6-digit telah dikirimkan ke nomor WhatsApp:
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
                    <span>+{phone}</span>
                </div>
            </div>

            {/* Sandbox Developer OTP Quick Pill */}
            {devOtp && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                        🛠️ Mode Uji Coba: Kode OTP Anda adalah{' '}
                        <button
                            type="button"
                            onClick={() => {
                                const digits = devOtp.split('');
                                setOtp(digits);
                                onVerify(devOtp);
                            }}
                            className="font-mono font-black text-amber-900 dark:text-amber-200 underline hover:text-amber-700"
                        >
                            {devOtp} (Klik untuk isi)
                        </button>
                    </span>
                </div>
            )}

            {/* 6 Digit Input Boxes */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className={`flex items-center justify-center gap-2 sm:gap-2.5 ${hasError ? 'animate-shake' : ''}`}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-2xl border transition-all duration-150 select-none shadow-xs
                                ${digit
                                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 scale-102'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                                }
                                focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:scale-105`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-fadeIn">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Verification Button */}
                <button
                    type="submit"
                    disabled={processing || otp.join('').length < 6}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition btn-tactile disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            <span>Memverifikasi Akun Anda...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Konfirmasi & Masuk EduGen</span>
                        </>
                    )}
                </button>
            </form>

            {/* Resend & Edit Number Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* Back to Edit Phone */}
                <button
                    type="button"
                    onClick={onChangePhone}
                    disabled={processing}
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ubah Nomor WhatsApp</span>
                </button>

                {/* Resend OTP */}
                <div>
                    {countdown > 0 ? (
                        <span className="text-slate-400 font-medium">
                            Kirim ulang dalam <strong className="text-emerald-600 dark:text-emerald-400 font-mono">00:{countdown.toString().padStart(2, '0')}</strong>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendClick}
                            disabled={isResending || processing}
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                            <span>Kirim Ulang Kode OTP</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
