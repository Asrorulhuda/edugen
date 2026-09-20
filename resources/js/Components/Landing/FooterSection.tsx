import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterContent {
    brand_name?: string;
    tagline?: string;
    contact_email?: string;
    contact_whatsapp?: string;
    contact_address?: string;
    copyright_text?: string;
    social_links?: Record<string, string>;
}

interface FooterSectionProps {
    content?: FooterContent;
}

export default function FooterSection({ content = {} }: FooterSectionProps) {
    const brandName = content.brand_name || 'EduGen';
    const tagline =
        content.tagline ||
        'Platform Generator Perangkat Guru & Modul Ajar Terintegrasi untuk Kurikulum Merdeka (Kemendikdasmen BSKAP 046/2025) & Kurikulum Berbasis Cinta / KBC (Kemenag KMA 1503/2025).';
    const contactEmail = content.contact_email || 'support@edugen.id';
    const contactWhatsapp = content.contact_whatsapp || '0812-3456-7890';
    const contactAddress = content.contact_address || 'Jakarta, Indonesia';
    const copyright = content.copyright_text || 'Hak Cipta Terpelihara • EduGen Indonesia.';

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand info */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="text-base font-black text-slate-900 dark:text-white">
                                {brandName}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {tagline}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Navigasi
                        </div>
                        <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <li><a href="#alur" className="hover:text-emerald-600 transition">Alur Kerja 4 Tahap</a></li>
                            <li><a href="#keunggulan" className="hover:text-emerald-600 transition">Keunggulan KBC & Deep Learning</a></li>
                            <li><a href="#harga" className="hover:text-emerald-600 transition">Daftar Paket & Biaya</a></li>
                            <li><a href="#faq" className="hover:text-emerald-600 transition">Tanya Jawab (FAQ)</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Bantuan & Layanan
                        </div>
                        <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <li className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{contactEmail}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{contactWhatsapp}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{contactAddress}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <p>{copyright}</p>
                    <p className="flex items-center gap-1">
                        Didesain dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Guru & Madrasah Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
}
