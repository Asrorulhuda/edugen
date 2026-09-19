import React from 'react';
import { School, Eye } from 'lucide-react';

interface SchoolLetterheadPreviewProps {
    headerStyle: 'LOGO_LEFT' | 'TEXT_ONLY' | 'FULL_IMAGE' | string;
    logoPreview: string | null;
    fullImagePreview: string | null;
    line1?: string;
    line2?: string;
    line3?: string;
    subtext?: string;
    name?: string;
    npsn?: string;
    address?: string;
}

export default function SchoolLetterheadPreview({
    headerStyle,
    logoPreview,
    fullImagePreview,
    line1,
    line2,
    line3,
    subtext,
    name,
    npsn,
    address,
}: SchoolLetterheadPreviewProps) {
    return (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                Pratinjau Kop Dokumen
            </p>
            <div className="bg-white text-slate-900 p-4 rounded-lg border border-slate-200 shadow-xs">
                {headerStyle === 'FULL_IMAGE' ? (
                    fullImagePreview ? (
                        <img
                            src={fullImagePreview}
                            alt="Preview KOP"
                            className="w-full max-h-24 object-contain mx-auto"
                        />
                    ) : (
                        <p className="text-center text-xs text-slate-400 py-3 italic">
                            Silakan upload gambar banner / kop surat utuh
                        </p>
                    )
                ) : (
                    <div className="flex items-center gap-4">
                        {headerStyle === 'LOGO_LEFT' && (
                            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <School className="w-10 h-10 text-slate-400" />
                                )}
                            </div>
                        )}
                        <div className="flex-1 text-center font-serif space-y-0.5">
                            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-700">
                                {line1 || 'DINAS PENDIDIKAN / KEMENTERIAN AGAMA'}
                            </p>
                            <p className="text-sm font-bold uppercase tracking-wide text-slate-900">
                                {line2 || name || 'NAMA SATUAN PENDIDIKAN'}
                            </p>
                            <p className="text-[10px] font-medium text-slate-600">
                                {line3 || (npsn ? `NPSN: ${npsn}` : 'TERAKREDITASI')}
                            </p>
                            <p className="text-[9px] text-slate-500 pt-0.5 border-t border-slate-300 mt-1">
                                {subtext || address || 'Alamat dan kontak sekolah/madrasah'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
