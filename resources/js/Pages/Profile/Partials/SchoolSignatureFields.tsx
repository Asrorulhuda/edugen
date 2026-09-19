import React from 'react';

interface SchoolSignatureFieldsProps {
    principalName: string;
    onPrincipalNameChange: (val: string) => void;
    principalIdNumber: string;
    onPrincipalIdNumberChange: (val: string) => void;
    signatureTitle: string;
    onSignatureTitleChange: (val: string) => void;
    signatureCity: string;
    onSignatureCityChange: (val: string) => void;
}

export default function SchoolSignatureFields({
    principalName,
    onPrincipalNameChange,
    principalIdNumber,
    onPrincipalIdNumberChange,
    signatureTitle,
    onSignatureTitleChange,
    signatureCity,
    onSignatureCityChange,
}: SchoolSignatureFieldsProps) {
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Kolom Pengesahan / Tanda Tangan Dokumen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Kepala Sekolah / Madrasah
                    </label>
                    <input
                        type="text"
                        value={principalName}
                        onChange={(e) => onPrincipalNameChange(e.target.value)}
                        placeholder="Contoh: Drs. H. Budi Santoso, M.Pd."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        NIP Kepala Sekolah (Opsional)
                    </label>
                    <input
                        type="text"
                        value={principalIdNumber}
                        onChange={(e) => onPrincipalIdNumberChange(e.target.value)}
                        placeholder="19750512 200003 1 002"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Jabatan Pengesahan
                    </label>
                    <input
                        type="text"
                        value={signatureTitle}
                        onChange={(e) => onSignatureTitleChange(e.target.value)}
                        placeholder="Kepala Sekolah / Kepala Madrasah"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Kota Tempat Tanda Tangan
                    </label>
                    <input
                        type="text"
                        value={signatureCity}
                        onChange={(e) => onSignatureCityChange(e.target.value)}
                        placeholder="Contoh: Surabaya"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
