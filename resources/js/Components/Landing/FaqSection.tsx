import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqSectionProps {
    content?: {
        section_badge?: string;
        section_title?: string;
        section_desc?: string;
        items?: FaqItem[];
    };
}

const defaultFaqs: FaqItem[] = [
    {
        q: 'Apakah EduGen bisa digunakan untuk Kurikulum Merdeka (Sekolah Umum) dan KBC (Madrasah)?',
        a: 'Ya, tentu saja! EduGen dirancang fleksibel untuk kedua kurikulum. Guru di sekolah umum (SD, SMP, SMA, SMK) dapat menyusun perangkat berdasarkan Kurikulum Merdeka (BSKAP 046/2025), sedangkan guru di madrasah (RA, MI, MTs, MA) dapat menyusun perangkat berbasis Kurikulum Berbasis Cinta / KBC (KMA 1503/2025) lengkap dengan 5 Dimensi Panca Cinta.',
    },
    {
        q: 'Apakah AI di EduGen membuat atau mengarang teks Capaian Pembelajaran (CP)?',
        a: 'Tidak sama sekali. Seluruh teks CP berasal dari database master resmi yang dikunci (read-only) sesuai regulasi BSKAP dan Kemenag RI. AI hanya membantu menyusun turunan perangkat seperti TP, ATP, Modul Ajar, Kisi-kisi, dan Soal.',
    },
    {
        q: 'Apa perbedaan akun Guru Mandiri (Personal) dan Akun Instansi (Sekolah / Madrasah)?',
        a: 'Guru Mandiri memiliki Personal Workspace untuk merancang perangkat secara independen. Akun Instansi memiliki ruang kerja kelembagaan dengan peran Admin Lembaga (mengatur profil sekolah, kop surat, kalender akademik, dan mengundang guru) serta Guru (merancang seluruh perangkat ajar).',
    },
    {
        q: 'Metode pembayaran apa saja yang didukung untuk langganan?',
        a: 'Kami mendukung Transfer Bank Manual bebas biaya admin (BSI, BCA, Mandiri, BRI), QRIS Standar Bank Indonesia untuk semua aplikasi e-wallet & mobile banking, serta pembayaran instan melalui Payment Gateway Xendit dan Tripay.',
    },
    {
        q: 'Apakah dokumen perangkat ajar dan kisi-kisi dapat langsung dicetak?',
        a: 'Ya! Semua Modul Ajar, Bank Soal Siswa, Kunci Jawaban & Pembahasan, Kisi-kisi Matriks, serta Rubrik Asesmen dilengkapi kop surat resmi sekolah/madrasah dan tanda tangan pejabat yang siap cetak atau simpan sebagai PDF langsung dari peramban.',
    },
];

export default function FaqSection({ content = {} }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = content.items && content.items.length > 0 ? content.items : defaultFaqs;

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {content.section_badge || 'Tanya Jawab'}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        {content.section_title || 'Pertanyaan yang Sering Diajukan'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {content.section_desc || 'Semua yang perlu Anda ketahui tentang EduGen, kurikulum yang didukung, dan cara kerjanya.'}
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group"
                                >
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {faq.q}
                                    </span>
                                    <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600 bg-emerald-50 dark:bg-emerald-950' : ''}`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
