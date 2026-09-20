import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface NavbarProps {
    auth?: {
        user?: any;
    };
    canLogin?: boolean;
    canRegister?: boolean;
}

export default function Navbar({ auth, canLogin = true, canRegister = true }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <ApplicationLogo className="w-9 h-9 drop-shadow-xs group-hover:scale-110 transition-transform" />
                        <div className="leading-tight">
                            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                                EduGen
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    Kurmer & KBC
                                </span>
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 block tracking-wider">
                                Platform Perangkat Guru & Lembaga
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#kurikulum" className="px-3 py-1.5 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition">
                            2 Kurikulum
                        </a>
                        <a href="#alur" className="px-3 py-1.5 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition">
                            Alur Kerja
                        </a>
                        <a href="#harga" className="px-3 py-1.5 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition">
                            Paket & Biaya
                        </a>
                        <a href="#faq" className="px-3 py-1.5 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition">
                            FAQ
                        </a>
                    </nav>
                </div>

                {/* Right CTA */}
                <div className="flex items-center gap-3">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
                        >
                            <span>Buka Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Masuk
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/20 active:scale-95"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Coba Gratis 14 Hari</span>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 space-y-3">
                    <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#kurikulum" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            2 Kurikulum (Kurmer & KBC)
                        </a>
                        <a href="#alur" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            Alur Kerja
                        </a>
                        <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            Paket & Biaya
                        </a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            FAQ
                        </a>
                    </nav>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                        {canLogin && (
                            <Link href={route('login')} className="w-full text-center py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl">
                                Masuk Akun
                            </Link>
                        )}
                        {canRegister && (
                            <Link href={route('register')} className="w-full text-center py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                                Daftar & Uji Coba Gratis
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
