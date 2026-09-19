import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Heart, BookOpen } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface GuestProps extends PropsWithChildren {
    title?: string;
}

export default function Guest({ children }: GuestProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            {/* Top Navigation Bar */}
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between relative z-10">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group transition-transform active:scale-95"
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center p-1 shadow-md shadow-emerald-600/10 group-hover:scale-105 transition">
                        <ApplicationLogo className="w-8 h-8 drop-shadow-xs" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                            EduGen <span className="text-emerald-600 font-extrabold">KBC</span>
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            Kurikulum Berbasis Cinta
                        </span>
                    </div>
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition btn-tactile shadow-xs"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>
            </header>

            {/* Main Auth Container */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
                <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Panel: Brand Showcase (Hidden on small screens) */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold w-fit">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Platform Perangkat Ajar & KBC Terverifikasi</span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                Dedikasi Pendidik, Ditenagai Kepastian Regulasi.
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Bebaskan diri dari repotnya administrasi formatif. Rancang modul ajar deep learning dan bank soal HOTS yang selaras dengan nilai keimanan & karakter bangsa.
                            </p>
                        </div>

                        {/* 3 Pillars Value List */}
                        <div className="space-y-3.5 pt-2">
                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
                                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">CP Terkunci & Sah</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">BSKAP 046/2025 & KMA 1503/2025 tanpa halusinasi buatan.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
                                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mt-0.5">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">5 Dimensi Panca Cinta Kemenag</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Mahabbatullah, Hubbul Ilm, Nafs, Biah, dan Wathan menyatu di aktivitas kelas.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
                                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mt-0.5">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Modul Ajar Deep Learning</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Mindful, Meaningful, dan Joyful Learning siap ekspor kop surat resmi.</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                            <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                                &ldquo;Menyusun modul ajar dan kisi-kisi asesmen jadi jauh lebih tenang karena CP-nya valid dan rubrik karakternya langsung aplikatif.&rdquo;
                            </p>
                            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                                — Komunitas Guru Madrasah & Sekolah Penggerak
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: The Auth Form Card */}
                    <div className="lg:col-span-7 flex justify-center w-full">
                        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 backdrop-blur-sm relative transition-all">
                            {children}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer Minimalist */}
            <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 dark:text-slate-500 relative z-10">
                &copy; {new Date().getFullYear()} EduGen KBC. Hak cipta dilindungi undang-undang.
            </footer>
        </div>
    );
}
