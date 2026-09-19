import React from 'react';

interface Props {
    moduleData: any;
    kurikulumType: 'MERDEKA' | 'MADRASAH_KBC';
    schoolName: string;
    updateModuleField: (field: string, value: any) => void;
}

export default function GeneratedModuleEditor({
    moduleData,
    kurikulumType,
    schoolName,
    updateModuleField,
}: Props) {
    return (
        <div className="space-y-6">
            {/* Section A: Satuan Pendidikan & Identitas Terkonfirmasi */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Satuan Pendidikan / Sekolah</span>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{schoolName || 'Madrasah / Sekolah'}</div>
                </div>
                <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Kerangka Kurikulum</span>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {kurikulumType === 'MERDEKA' ? 'Kurikulum Merdeka' : 'Kurikulum Madrasah KBC (KMA 1503/2025)'}
                    </div>
                </div>
            </div>

            {/* Section B: Karakter */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    B. Rancangan Pengembangan Karakter
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Kesiapan Murid:</span>
                        <textarea
                            rows={5}
                            value={moduleData.kesiapan || ''}
                            onChange={(e) => updateModuleField('kesiapan', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {kurikulumType === 'MERDEKA' ? '2. Profil Pelajar Pancasila (P3):' : '2. Dimensi Profil Lulusan (DPL):'}
                        </span>
                        <textarea
                            rows={5}
                            value={moduleData.dimensi_dpl || ''}
                            onChange={(e) => updateModuleField('dimensi_dpl', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                    {kurikulumType === 'MADRASAH_KBC' && (
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Topik Panca Cinta:</span>
                            <textarea
                                rows={4}
                                value={moduleData.topik_panca_cinta || ''}
                                onChange={(e) => updateModuleField('topik_panca_cinta', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    )}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {kurikulumType === 'MERDEKA' ? '3. Pemahaman Bermakna & Kontekstual:' : '4. Materi Integrasi KBC:'}
                        </span>
                        <textarea
                            rows={4}
                            value={moduleData.materi_integrasi_kbc || ''}
                            onChange={(e) => updateModuleField('materi_integrasi_kbc', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                </div>
            </div>

            {/* Section C: Desain Pembelajaran */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    C. Desain Pembelajaran
                </h3>

                <div className="space-y-3 text-xs">
                    {moduleData.capaian_pembelajaran && (
                        <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800/60 space-y-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Capaian Pembelajaran (CP) Acuan Resmi:</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold">Tersinkronisasi Regulasi</span>
                            </div>
                            <textarea
                                rows={4}
                                value={moduleData.capaian_pembelajaran || ''}
                                onChange={(e) => updateModuleField('capaian_pembelajaran', e.target.value)}
                                className="w-full rounded-lg border-emerald-200 bg-white text-xs dark:border-emerald-800 dark:bg-slate-900 leading-relaxed font-sans"
                            />
                        </div>
                    )}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Tujuan Pembelajaran (TP) Terpilih:</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold">Bank TP Resmi</span>
                        </div>
                        <textarea
                            rows={5}
                            value={moduleData.tujuan || ''}
                            onChange={(e) => updateModuleField('tujuan', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800 leading-relaxed font-sans"
                        />
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Model / Praktik Pedagogis:</span>
                        <textarea
                            rows={4}
                            value={moduleData.praktik_pedagogis || ''}
                            onChange={(e) => updateModuleField('praktik_pedagogis', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Pertanyaan Pemantik:</span>
                        <textarea
                            rows={3}
                            value={moduleData.pertanyaan_pemantik || ''}
                            onChange={(e) => updateModuleField('pertanyaan_pemantik', e.target.value)}
                            placeholder="Contoh: 1. Mengapa materi ini penting? 2. Bagaimana penerapannya dalam kehidupan?"
                            className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800 leading-relaxed"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">4. Target Peserta Didik:</span>
                            <textarea
                                rows={3}
                                value={moduleData.target_students || ''}
                                onChange={(e) => updateModuleField('target_students', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">5. Sarana & Prasarana:</span>
                            <textarea
                                rows={3}
                                value={moduleData.facilities || ''}
                                onChange={(e) => updateModuleField('facilities', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">6. Kemitraan:</span>
                            <textarea
                                rows={3}
                                value={moduleData.kemitraan_pembelajaran || ''}
                                onChange={(e) => updateModuleField('kemitraan_pembelajaran', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">7. Lingkungan:</span>
                            <textarea
                                rows={3}
                                value={moduleData.lingkungan_pembelajaran || ''}
                                onChange={(e) => updateModuleField('lingkungan_pembelajaran', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">8. Digital:</span>
                            <textarea
                                rows={3}
                                value={moduleData.pemanfaatan_digital || ''}
                                onChange={(e) => updateModuleField('pemanfaatan_digital', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section D: Pengalaman Belajar */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    D. Pengalaman Belajar & Deep Learning
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20 space-y-1">
                        <span className="font-bold text-purple-900 dark:text-purple-300 block">1. Mindful Learning:</span>
                        <textarea
                            rows={3}
                            value={moduleData.mindful || ''}
                            onChange={(e) => updateModuleField('mindful', e.target.value)}
                            placeholder="Fokus kesadaran penuh, hening sejenak, menata niat..."
                            className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20 space-y-1">
                        <span className="font-bold text-blue-900 dark:text-blue-300 block">2. Meaningful Learning:</span>
                        <textarea
                            rows={3}
                            value={moduleData.meaningful || ''}
                            onChange={(e) => updateModuleField('meaningful', e.target.value)}
                            placeholder="Keterkaitan nyata dengan kehidupan & hikmah materi..."
                            className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20 space-y-1">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block">3. Joyful Learning:</span>
                        <textarea
                            rows={3}
                            value={moduleData.joyful || ''}
                            onChange={(e) => updateModuleField('joyful', e.target.value)}
                            placeholder="Suasana menggembirakan, eksplorasi aktif, apresiasi..."
                            className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                </div>

                <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            Kegiatan Awal ({moduleData.waktu_pendahuluan || '10 Menit'}):
                        </span>
                        <div className="space-y-1.5">
                            <b>a. Berkesadaran (Mindful):</b>
                            <textarea
                                rows={3}
                                value={moduleData.kegiatan_awal_berkesadaran || ''}
                                onChange={(e) => updateModuleField('kegiatan_awal_berkesadaran', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                            />
                            <b>b. Apersepsi:</b>
                            <textarea
                                rows={3}
                                value={moduleData.kegiatan_awal_apersepsi || ''}
                                onChange={(e) => updateModuleField('kegiatan_awal_apersepsi', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                            />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            Kegiatan Inti ({moduleData.waktu_inti || '50 Menit'}):
                        </span>
                        <div className="pl-3 space-y-2 border-l-2 border-blue-500">
                            <div>
                                <b>a. Memahami (Joyful):</b>
                                <textarea
                                    rows={4}
                                    value={moduleData.inti_memahami || ''}
                                    onChange={(e) => updateModuleField('inti_memahami', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                                />
                            </div>
                            <div>
                                <b>b. Mengaplikasi (Meaningful):</b>
                                <textarea
                                    rows={4}
                                    value={moduleData.inti_mengaplikasi || ''}
                                    onChange={(e) => updateModuleField('inti_mengaplikasi', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                                />
                            </div>
                            <div>
                                <b>c. Merefleksi (Mindful):</b>
                                <textarea
                                    rows={4}
                                    value={moduleData.inti_merefleksi || ''}
                                    onChange={(e) => updateModuleField('inti_merefleksi', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            Kegiatan Penutup ({moduleData.waktu_penutup || '10 Menit'}):
                        </span>
                        <textarea
                            rows={3}
                            value={moduleData.kegiatan_penutup || ''}
                            onChange={(e) => updateModuleField('kegiatan_penutup', e.target.value)}
                            className="w-full rounded-lg border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                </div>
            </div>

            {/* Section E: Asesmen */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    E. Asesmen Pembelajaran
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Asesmen Awal (Diagnostik):</span>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Bentuk / Teknik:</span>
                            <textarea
                                rows={3}
                                value={moduleData.asesmen_awal || ''}
                                onChange={(e) => updateModuleField('asesmen_awal', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Fokus Indikator:</span>
                            <textarea
                                rows={2}
                                value={moduleData.asesmen_awal_fokus || ''}
                                onChange={(e) => updateModuleField('asesmen_awal_fokus', e.target.value)}
                                placeholder="Fokus indikator pemetaan kesiapan awal murid..."
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Asesmen Proses (Formatif):</span>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Bentuk / Teknik:</span>
                            <textarea
                                rows={3}
                                value={moduleData.asesmen_proses || ''}
                                onChange={(e) => updateModuleField('asesmen_proses', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Fokus / Rubrik:</span>
                            <textarea
                                rows={2}
                                value={moduleData.asesmen_proses_fokus || ''}
                                onChange={(e) => updateModuleField('asesmen_proses_fokus', e.target.value)}
                                placeholder="Rubrik penilaian keterlibatan, adab, dan proses..."
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Asesmen Akhir (Sumatif):</span>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Bentuk / Teknik:</span>
                            <textarea
                                rows={3}
                                value={moduleData.asesmen_akhir || ''}
                                onChange={(e) => updateModuleField('asesmen_akhir', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Kriteria Ketercapaian:</span>
                            <textarea
                                rows={2}
                                value={moduleData.asesmen_akhir_fokus || ''}
                                onChange={(e) => updateModuleField('asesmen_akhir_fokus', e.target.value)}
                                placeholder="Kriteria ketercapaian TP secara menyeluruh..."
                                className="w-full rounded-lg border-slate-200 bg-slate-50 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section F: Tindak Lanjut & Lampiran */}
            <div className="space-y-4">
                <h3 className="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:border-slate-800 dark:text-amber-400">
                    F. Tindak Lanjut & Lampiran
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                        ['remedial_pengayaan', 'Remedial dan Pengayaan'],
                        ['lkpd', 'LKPD'],
                        ['bahan_bacaan', 'Bahan Bacaan'],
                        ['daftar_pustaka', 'Daftar Pustaka'],
                    ].map(([field, label]) => (
                        <label key={field} className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {label}
                            <textarea
                                rows={5}
                                value={moduleData[field] || ''}
                                onChange={(e) => updateModuleField(field, e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-200 bg-slate-50 text-xs font-normal dark:border-slate-700 dark:bg-slate-800"
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
