import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Check, Sparkles, Building2, User, ShieldCheck, Zap, CreditCard, ChevronRight } from 'lucide-react';

export interface PlanItem {
    id: number;
    name: string;
    slug: string;
    client_model: 'INDIVIDUAL' | 'INSTITUTION' | 'BOTH';
    price: number;
    duration_days: number;
    max_seats: number;
    ai_generation_quota: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
}

interface PricingSectionProps {
    plans?: PlanItem[];
    auth?: {
        user?: any;
    };
}

const fallbackPlans: PlanItem[] = [
    {
        id: 1,
        name: 'Guru Mandiri (Uji Coba)',
        slug: 'guru-mandiri-trial',
        client_model: 'INDIVIDUAL',
        price: 0,
        duration_days: 14,
        max_seats: 1,
        ai_generation_quota: 25,
        features: [
            'Katalog Resmi CP BSKAP 046 & KMA 1503',
            'Generator TP & Alur TP Dasar',
            'Maksimal 25 request AI per periode (Kurmer & KBC)',
            'Cetak RPP & Asesmen format standar',
        ],
        is_active: true,
        is_popular: false,
    },
    {
        id: 2,
        name: 'Guru Mandiri (Pro)',
        slug: 'guru-mandiri-pro',
        client_model: 'INDIVIDUAL',
        price: 49000,
        duration_days: 30,
        max_seats: 1,
        ai_generation_quota: 250,
        features: [
            'Semua fitur Guru Mandiri Uji Coba',
            'Generator Modul Ajar Kurikulum Merdeka & KBC Lengkap',
            'Bank Soal HOTS & Kisi-kisi Asesmen Otomatis',
            'Rubrik Sikap Panca Cinta & Profil Kelulusan Deskriptif',
            '250 kuota generasi AI cerdas setiap bulan',
            'Cetak Lembar Ujian & Kunci Jawaban Resmi',
        ],
        is_active: true,
        is_popular: true,
    },
    {
        id: 3,
        name: 'Madrasah / Sekolah (Standar)',
        slug: 'sekolah-madrasah-standar',
        client_model: 'INSTITUTION',
        price: 299000,
        duration_days: 30,
        max_seats: 15,
        ai_generation_quota: 1500,
        features: [
            'Termasuk 15 Lisensi Akun Guru Madrasah / Sekolah',
            'Kop Surat & Logo Resmi Lembaga Otomatis',
            'Pengaturan Kalender Akademik & Semester',
            '1.500 kuota bersama generasi AI per bulan',
            'Dukungan 4 AI Provider (Gemini, Grok, DeepSeek, OpenRouter)',
            'Dashboard Pantauan Perangkat Ajar Guru',
        ],
        is_active: true,
        is_popular: false,
    },
    {
        id: 4,
        name: 'Madrasah / Sekolah (Unggulan)',
        slug: 'sekolah-madrasah-unggulan',
        client_model: 'INSTITUTION',
        price: 699000,
        duration_days: 30,
        max_seats: 50,
        ai_generation_quota: 5000,
        features: [
            'Termasuk 50 Lisensi Guru Aktif Lembaga',
            'Semua fitur Sekolah Standar',
            '5.000 kuota bersama generasi AI per bulan',
            'Prioritas Kecepatan Generasi AI Server EduGen',
            'Arsip & Export Portofolio Kurikulum (Kurmer & KBC)',
            'Layanan Bantuan Prioritas via WhatsApp VIP',
        ],
        is_active: true,
        is_popular: true,
    },
];

export default function PricingSection({ plans, auth }: PricingSectionProps) {
    const [selectedTab, setSelectedTab] = useState<'INDIVIDUAL' | 'INSTITUTION'>('INDIVIDUAL');

    const activePlans = plans && plans.length > 0 ? plans : fallbackPlans;
    const displayedPlans = activePlans.filter(
        (p) => p.client_model === selectedTab || p.client_model === 'BOTH'
    );

    const formatRupiah = (amount: number) => {
        if (amount === 0) return 'Gratis';
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <section id="harga" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Investasi Transparan & Akuntabel</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        Pilihan Paket Sesuai Kebutuhan Anda
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Tersedia untuk Pendidik Mandiri maupun Lembaga Madrasah / Sekolah dengan sistem kuota terukur dan bebas halusinasi.
                    </p>

                    {/* Category Tab Switcher with Tactile Animation */}
                    <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setSelectedTab('INDIVIDUAL')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                                selectedTab === 'INDIVIDUAL'
                                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Guru Mandiri (Personal)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('INSTITUTION')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                                selectedTab === 'INSTITUTION'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Building2 className="w-4 h-4" />
                            <span>Madrasah / Sekolah (Instansi)</span>
                        </button>
                    </div>
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                    {displayedPlans.map((plan) => {
                        const isHighlight = plan.is_popular;
                        const ctaHref = auth?.user
                            ? route('billing.checkout', plan.slug)
                            : route('register');

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                                    isHighlight
                                        ? 'bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white border-2 border-emerald-500/80 shadow-xl shadow-emerald-950/30'
                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40'
                                }`}
                            >
                                {isHighlight && (
                                    <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Paling Populer</span>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isHighlight ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {plan.client_model === 'INDIVIDUAL' ? 'Personal Workspace' : 'Institution Workspace'}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHighlight ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                            Maks. {plan.max_seats} Akun
                                        </span>
                                    </div>

                                    <h3 className={`text-xl font-black mt-1 ${isHighlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        {plan.name}
                                    </h3>

                                    <div className="mt-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-3xl sm:text-4xl font-black ${isHighlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                {formatRupiah(plan.price)}
                                            </span>
                                            <span className={`text-xs ${isHighlight ? 'text-slate-300' : 'text-slate-400'}`}>
                                                / {plan.duration_days} hari
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs font-semibold flex items-center gap-1.5 text-emerald-500">
                                            <Zap className="w-3.5 h-3.5 shrink-0" />
                                            <span>{plan.ai_generation_quota.toLocaleString('id-ID')} Kuota Generasi AI Cerdas</span>
                                        </div>
                                    </div>

                                    {/* Features Checklist */}
                                    <ul className="space-y-3 text-xs mb-8">
                                        {plan.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2.5">
                                                <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${isHighlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'}`}>
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                                <span className={isHighlight ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button with Tactile Physics */}
                                <Link
                                    href={ctaHref}
                                    className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 ${
                                        isHighlight
                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                                            : plan.price === 0
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                    }`}
                                >
                                    <span>
                                        {plan.price === 0
                                            ? 'Mulai Gratis 14 Hari'
                                            : auth?.user
                                            ? 'Pilih & Checkout Paket'
                                            : 'Daftar & Langganan Sekarang'}
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Indonesian Payment Methods & Guarantees Bar */}
                <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            <span>Metode Pembayaran Resmi Indonesia</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>Verifikasi Otomatis & Bebas Biaya Admin Bank</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                BSI (Bank Syariah Indonesia)
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                BCA
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Mandiri
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                BRI
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                QRIS Instan
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Xendit / Tripay
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Faktur & Kuitansi Ber-Kop Resmi Tersedia</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
