import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Coffee, BookOpen } from 'lucide-react';

interface CuteCompanionProps {
    className?: string;
}

const cuteMessages = [
    { text: 'Halo Guru Hebat! Mau susun perangkat Kurikulum Merdeka atau KBC?', icon: Sparkles, color: 'text-amber-500' },
    { text: 'CP Resmi BSKAP 046 & KMA 1503 terkunci aman tanpa halusinasi!', icon: BookOpen, color: 'text-emerald-500' },
    { text: 'Mendukung SD, SMP, SMA/SMK serta RA, MI, MTs, dan MA lengkap!', icon: Heart, color: 'text-rose-500' },
    { text: 'Tinggal seduh kopi, biarkan EduGen rapikan modul ajar & kisi-kisi ☕', icon: Coffee, color: 'text-amber-600' },
];

export default function CuteCompanion({ className = '' }: CuteCompanionProps) {
    const [msgIndex, setMsgIndex] = useState(0);
    const [isWinking, setIsWinking] = useState(false);
    const [isHappy, setIsHappy] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % cuteMessages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        setIsWinking(true);
        setIsHappy(true);
        setMsgIndex((prev) => (prev + 1) % cuteMessages.length);
        setTimeout(() => setIsWinking(false), 800);
        setTimeout(() => setIsHappy(false), 1200);
    };

    const currentMsg = cuteMessages[msgIndex];
    const IconComponent = currentMsg.icon;

    return (
        <div className={`relative inline-flex flex-col items-center group cursor-pointer ${className}`} onClick={handleClick}>
            {/* Speech Bubble */}
            <div className="relative mb-3 max-w-xs sm:max-w-sm px-4 py-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/50 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                    <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 shrink-0">
                        <IconComponent className={`w-3.5 h-3.5 ${currentMsg.color} animate-pulse`} />
                    </span>
                    <span>{currentMsg.text}</span>
                </div>
                {/* Speech Bubble Triangle Tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-slate-800" />
            </div>

            {/* Animated Mascot Body */}
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 ${isHappy ? 'scale-110 -translate-y-2' : 'hover:scale-105'}`}>
                {/* Floating Bobbing Glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-xl animate-pulse" />

                <svg
                    viewBox="0 0 140 140"
                    className="w-full h-full drop-shadow-lg select-none overflow-visible transition-transform duration-500"
                    style={{ animation: 'float 3.5s ease-in-out infinite' }}
                >
                    <defs>
                        <linearGradient id="compBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                        <linearGradient id="compBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f0fdf4" />
                            <stop offset="100%" stopColor="#dcfce7" />
                        </linearGradient>
                    </defs>

                    {/* Cute Ears / Tuft with bounce */}
                    <path d="M 32 45 L 20 18 L 48 34 Z" fill="#059669" className="transition-all duration-300" />
                    <path d="M 108 45 L 120 18 L 92 34 Z" fill="#047857" className="transition-all duration-300" />

                    {/* Main Owl Body */}
                    <rect x="24" y="30" width="92" height="90" rx="46" fill="url(#compBodyGrad)" />

                    {/* Belly */}
                    <ellipse cx="70" cy="92" rx="30" ry="24" fill="url(#compBellyGrad)" opacity="0.95" />

                    {/* Belly Feather Heart Marks */}
                    <path
                        d="M 64 85 Q 70 88 76 85 M 60 92 Q 70 96 80 92 M 65 99 Q 70 102 75 99"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Rosy Blushing Cheeks */}
                    <circle cx="36" cy="74" r="6" fill="#fb7185" opacity={isHappy ? 0.7 : 0.4} />
                    <circle cx="104" cy="74" r="6" fill="#fb7185" opacity={isHappy ? 0.7 : 0.4} />

                    {/* Eyes Background */}
                    <circle cx="50" cy="62" r="16" fill="#ffffff" />
                    <circle cx="90" cy="62" r="16" fill="#ffffff" />

                    {/* Left Eye */}
                    {isWinking ? (
                        <path d="M 40 64 Q 50 56 60 64" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" fill="none" />
                    ) : (
                        <g className="transition-all duration-200">
                            <circle cx="50" cy="62" r="8" fill="#064e3b" />
                            <circle cx="47" cy="59" r="3" fill="#ffffff" />
                            <circle cx="53" cy="64" r="1.5" fill="#ffffff" />
                        </g>
                    )}

                    {/* Right Eye */}
                    <g className="transition-all duration-200">
                        <circle cx="90" cy="62" r="8" fill="#064e3b" />
                        <circle cx="87" cy="59" r="3" fill="#ffffff" />
                        <circle cx="93" cy="64" r="1.5" fill="#ffffff" />
                    </g>

                    {/* Cute Orange Beak */}
                    <polygon points="70,68 63,78 77,78" fill="#f59e0b" />

                    {/* Small graduation cap on top */}
                    <polygon points="70,16 96,24 70,32 44,24" fill="#0f172a" />
                    <line x1="88" y1="26" x2="92" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="92" cy="38" r="2" fill="#f59e0b" />

                    {/* Cute Waving Wing on Hover */}
                    <path
                        d={isHappy ? "M 112 70 C 128 55 132 75 116 88 Z" : "M 112 75 C 124 78 124 88 116 92 Z"}
                        fill="#059669"
                        className="transition-all duration-300"
                    />
                </svg>
            </div>

            <span className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                ✨ Klik aku: EduBot Asisten Guru
            </span>
        </div>
    );
}
