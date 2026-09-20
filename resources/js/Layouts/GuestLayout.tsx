import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Heart,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { PropsWithChildren } from 'react';

interface GuestProps extends PropsWithChildren {
    title?: string;
    wide?: boolean;
}

export default function Guest({ children, wide = false }: GuestProps) {
    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-600/10" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-600/10" />

            {/* Top Navigation Bar */}
            <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 transition-transform active:scale-95"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/60 bg-gradient-to-tr from-emerald-50 to-teal-50 p-1 shadow-md shadow-emerald-600/10 transition group-hover:scale-105 dark:border-emerald-800/60 dark:from-emerald-950/60 dark:to-teal-950/60">
                        <ApplicationLogo className="drop-shadow-xs h-8 w-8" />
                    </div>
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-base font-black tracking-tight text-slate-900 dark:text-white">
                            EduGen{' '}
                            <span className="font-extrabold text-emerald-600">
                                KBC
                            </span>
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            Kurikulum Berbasis Cinta
                        </span>
                    </div>
                </Link>

                <Link
                    href="/"
                    className="btn-tactile shadow-xs inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-sm transition hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>
            </header>

            {/* Main Auth Container */}
            <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Panel: Brand Showcase (Hidden on small screens) */}
                    <div className="hidden flex-col justify-center space-y-6 lg:col-span-5 lg:flex">
                        {/* Badge */}
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>
                                Platform Perangkat Ajar & KBC Terverifikasi
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
                                Dedikasi Pendidik, Ditenagai Kepastian Regulasi.
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Bebaskan diri dari repotnya administrasi
                                formatif. Rancang modul ajar deep learning dan
                                bank soal HOTS yang selaras dengan nilai
                                keimanan & karakter bangsa.
                            </p>
                        </div>

                        {/* 3 Pillars Value List */}
                        <div className="space-y-3.5 pt-2">
                            <div className="shadow-xs flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-3 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60">
                                <div className="mt-0.5 rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        CP Terkunci & Sah
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        BSKAP 046/2025 & KMA 1503/2025 tanpa
                                        halusinasi buatan.
                                    </p>
                                </div>
                            </div>

                            <div className="shadow-xs flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-3 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60">
                                <div className="mt-0.5 rounded-xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                                    <Heart className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        5 Dimensi Panca Cinta Kemenag
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Mahabbatullah, Hubbul Ilm, Nafs, Biah,
                                        dan Wathan menyatu di aktivitas kelas.
                                    </p>
                                </div>
                            </div>

                            <div className="shadow-xs flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-3 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60">
                                <div className="mt-0.5 rounded-xl bg-amber-100 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Modul Ajar Deep Learning
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Mindful, Meaningful, dan Joyful Learning
                                        siap ekspor kop surat resmi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4">
                            <p className="text-xs italic text-slate-700 dark:text-slate-300">
                                &ldquo;Menyusun modul ajar dan kisi-kisi asesmen
                                jadi jauh lebih tenang karena CP-nya valid dan
                                rubrik karakternya langsung aplikatif.&rdquo;
                            </p>
                            <p className="mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                — Komunitas Guru Madrasah & Sekolah Penggerak
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: The Auth Form Card */}
                    <div className="flex w-full justify-center lg:col-span-7">
                        <div
                            className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none`}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Minimalist */}
            <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8 dark:text-slate-500">
                &copy; {new Date().getFullYear()} EduGen KBC. Hak cipta
                dilindungi undang-undang.
            </footer>
        </div>
    );
}
