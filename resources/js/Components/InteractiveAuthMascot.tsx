import React from 'react';

export type MascotMood = 'idle' | 'focus-name' | 'focus-email' | 'focus-password' | 'submitting' | 'success';

interface InteractiveAuthMascotProps {
    mood?: MascotMood;
    showPassword?: boolean;
    className?: string;
}

export default function InteractiveAuthMascot({
    mood = 'idle',
    showPassword = false,
    className = '',
}: InteractiveAuthMascotProps) {
    const isCoveringEyes = (mood === 'focus-password') && !showPassword;
    const isPeeking = (mood === 'focus-password') && showPassword;
    const isLookingDown = mood === 'focus-email' || mood === 'focus-name';
    const isSubmitting = mood === 'submitting';

    return (
        <div className={`relative flex flex-col items-center select-none ${className}`}>
            {/* Mascot Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 transition-transform duration-300">
                <svg
                    viewBox="0 0 140 140"
                    className="w-full h-full drop-shadow-md overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Body Gradient */}
                        <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                        {/* Belly Gradient */}
                        <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f0fdf4" />
                            <stop offset="100%" stopColor="#dcfce7" />
                        </linearGradient>
                        {/* Beak Gradient */}
                        <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>

                    {/* Ears / Tuft */}
                    <path
                        d="M 32 45 L 20 20 L 48 34 Z"
                        fill="#059669"
                        className="transition-transform duration-300"
                    />
                    <path
                        d="M 108 45 L 120 20 L 92 34 Z"
                        fill="#047857"
                        className="transition-transform duration-300"
                    />

                    {/* Body/Head Round Base */}
                    <rect
                        x="24"
                        y="30"
                        width="92"
                        height="90"
                        rx="46"
                        fill="url(#owlBodyGrad)"
                        className="transition-all duration-300"
                    />

                    {/* Cute Belly */}
                    <ellipse
                        cx="70"
                        cy="92"
                        rx="30"
                        ry="24"
                        fill="url(#owlBellyGrad)"
                        opacity="0.95"
                    />

                    {/* Belly Feather Marks */}
                    <path
                        d="M 64 85 Q 70 88 76 85 M 60 92 Q 70 96 80 92 M 65 99 Q 70 102 75 99"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.7"
                    />

                    {/* Blushing Cheeks */}
                    <circle cx="36" cy="74" r="6" fill="#f43f5e" opacity="0.35" />
                    <circle cx="104" cy="74" r="6" fill="#f43f5e" opacity="0.35" />

                    {/* Eyes Background (White circles) */}
                    <circle cx="50" cy="62" r="16" fill="#ffffff" />
                    <circle cx="90" cy="62" r="16" fill="#ffffff" />

                    {/* Eye Left (Pupil & Highlight) */}
                    <g
                        className="transition-transform duration-200"
                        style={{
                            transform: isLookingDown
                                ? 'translate(0px, 4px)'
                                : isSubmitting
                                ? 'translate(0px, -2px)'
                                : 'translate(0px, 0px)',
                        }}
                    >
                        {isCoveringEyes ? (
                            // Eye Closed (Happy curve)
                            <path
                                d="M 42 63 Q 50 69 58 63"
                                stroke="#0f172a"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                        ) : (
                            <>
                                <circle cx="50" cy="62" r="9" fill="#0f172a" />
                                <circle cx="47" cy="59" r="3.5" fill="#ffffff" />
                                <circle cx="53" cy="65" r="1.5" fill="#ffffff" />
                            </>
                        )}
                    </g>

                    {/* Eye Right (Pupil & Highlight) */}
                    <g
                        className="transition-transform duration-200"
                        style={{
                            transform: isLookingDown
                                ? 'translate(0px, 4px)'
                                : isSubmitting
                                ? 'translate(0px, -2px)'
                                : 'translate(0px, 0px)',
                        }}
                    >
                        {isCoveringEyes ? (
                            // Eye Closed (Happy curve)
                            <path
                                d="M 82 63 Q 90 69 98 63"
                                stroke="#0f172a"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                        ) : (
                            <>
                                <circle cx="90" cy="62" r="9" fill="#0f172a" />
                                <circle cx="87" cy="59" r="3.5" fill="#ffffff" />
                                <circle cx="93" cy="65" r="1.5" fill="#ffffff" />
                            </>
                        )}
                    </g>

                    {/* Cute Round Glasses */}
                    <circle
                        cx="50"
                        cy="62"
                        r="18"
                        stroke="#047857"
                        strokeWidth="2.5"
                        fill="none"
                    />
                    <circle
                        cx="90"
                        cy="62"
                        r="18"
                        stroke="#047857"
                        strokeWidth="2.5"
                        fill="none"
                    />
                    {/* Glasses bridge */}
                    <path
                        d="M 68 60 Q 70 57 72 60"
                        stroke="#047857"
                        strokeWidth="2.5"
                        fill="none"
                    />

                    {/* Cute Beak */}
                    <polygon
                        points="66,68 74,68 70,78"
                        fill="url(#beakGrad)"
                        className="transition-transform duration-300"
                    />

                    {/* Graduation / Scholar Cap (Mini Toga) */}
                    <g className="transition-transform duration-300 hover:rotate-6 origin-[70px_24px]">
                        {/* Cap Base */}
                        <ellipse cx="70" cy="27" rx="14" ry="5" fill="#1e293b" />
                        {/* Cap Diamond */}
                        <polygon
                            points="70,12 96,23 70,30 44,23"
                            fill="#0f172a"
                        />
                        {/* Tassel String & Ball */}
                        <path
                            d="M 70 20 Q 84 22 88 32"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle cx="88" cy="33" r="2.5" fill="#f59e0b" />
                        <circle cx="70" cy="21" r="2" fill="#fbbf24" />
                    </g>

                    {/* Left Hand / Wing */}
                    <g
                        className="transition-all duration-300 origin-[26px_90px]"
                        style={{
                            transform: isCoveringEyes || isPeeking
                                ? 'translate(20px, -24px) rotate(42deg)'
                                : 'translate(0px, 0px) rotate(0deg)',
                        }}
                    >
                        <path
                            d="M 24 75 Q 12 88 22 104 Q 30 102 34 88 Z"
                            fill="#065f46"
                            className="drop-shadow-sm"
                        />
                    </g>

                    {/* Right Hand / Wing */}
                    <g
                        className="transition-all duration-300 origin-[114px_90px]"
                        style={{
                            transform: isCoveringEyes
                                ? 'translate(-20px, -24px) rotate(-42deg)'
                                : isPeeking
                                ? 'translate(-10px, -6px) rotate(-18deg)'
                                : 'translate(0px, 0px) rotate(0deg)',
                        }}
                    >
                        <path
                            d="M 116 75 Q 128 88 118 104 Q 110 102 106 88 Z"
                            fill="#047857"
                            className="drop-shadow-sm"
                        />
                    </g>

                    {/* Feet */}
                    <ellipse cx="56" cy="120" rx="7" ry="4" fill="#f59e0b" />
                    <ellipse cx="84" cy="120" rx="7" ry="4" fill="#f59e0b" />
                </svg>
            </div>

            {/* Micro Caption Bubble */}
            <div className="mt-2 h-6 flex items-center justify-center transition-all duration-300">
                {isCoveringEyes && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 animate-bounce shadow-xs">
                        🙈 Tenang, saya tutup mata kok!
                    </span>
                )}
                {isPeeking && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40 animate-pulse shadow-xs">
                        👀 Mengintip sedikit untuk verifikasi...
                    </span>
                )}
                {isLookingDown && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                        ✍️ Mengetik dengan teliti ya, Ustadz/Ustadzah!
                    </span>
                )}
                {mood === 'idle' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400">
                        ✨ Sahabat Guru & Perangkat KBC
                    </span>
                )}
                {isSubmitting && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500 text-white animate-pulse shadow-xs">
                        🚀 Sedang memproses...
                    </span>
                )}
            </div>
        </div>
    );
}
