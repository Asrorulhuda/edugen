import React, { FormEventHandler, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { School, Building2, Upload, Trash2, ShieldCheck, Check } from 'lucide-react';
import SchoolLetterheadPreview from './SchoolLetterheadPreview';
import SchoolSignatureFields from './SchoolSignatureFields';

interface Props {
    institution: {
        id?: number;
        name?: string;
        type?: string;
        npsn?: string;
        address?: string;
        city?: string;
        principal_name?: string;
        principal_id_number?: string;
        signature_city?: string;
        signature_title?: string;
        header_style?: 'LOGO_LEFT' | 'TEXT_ONLY' | 'FULL_IMAGE';
        letterhead_line_1?: string;
        letterhead_line_2?: string;
        letterhead_line_3?: string;
        letterhead_subtext?: string;
        logo_path?: string;
        letterhead_path?: string;
        effective_logo_url?: string;
    } | null;
    isIndividualTeacher: boolean;
    className?: string;
}

export default function UpdateSchoolProfileForm({ institution, isIndividualTeacher, className = '' }: Props) {
    const isMadrasahInitial = institution?.type && ['MADRASAH', 'MI', 'MTS', 'MA', 'MAK'].includes(institution.type.toUpperCase());

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: institution?.name || '',
        type: institution?.type || 'SEKOLAH',
        npsn: institution?.npsn || '',
        address: institution?.address || '',
        city: institution?.city || '',
        principal_name: institution?.principal_name || '',
        principal_id_number: institution?.principal_id_number || '',
        signature_city: institution?.signature_city || institution?.city || '',
        signature_title: institution?.signature_title || (isMadrasahInitial ? 'Kepala Madrasah' : 'Kepala Sekolah'),
        header_style: institution?.header_style || 'LOGO_LEFT',
        letterhead_line_1: institution?.letterhead_line_1 || (isMadrasahInitial ? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA' : 'DINAS PENDIDIKAN DAN KEBUDAYAAN'),
        letterhead_line_2: institution?.letterhead_line_2 || institution?.name || '',
        letterhead_line_3: institution?.letterhead_line_3 || (institution?.npsn ? `NPSN: ${institution.npsn}` : 'TERAKREDITASI'),
        letterhead_subtext: institution?.letterhead_subtext || '',
        logo: null as File | null,
        letterhead_image: null as File | null,
        remove_logo: false,
        remove_letterhead: false,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        institution?.logo_path ? `/storage/${institution.logo_path}` : (institution?.effective_logo_url || null)
    );
    const [fullImagePreview, setFullImagePreview] = useState<string | null>(
        institution?.letterhead_path ? `/storage/${institution.letterhead_path}` : null
    );

    const logoInputRef = useRef<HTMLInputElement>(null);
    const letterheadInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData((prev) => ({ ...prev, logo: file, remove_logo: false }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFullImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData((prev) => ({ ...prev, letterhead_image: file, remove_letterhead: false }));
            setFullImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        setData((prev) => ({ ...prev, logo: null, remove_logo: true }));
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const handleRemoveFullImage = () => {
        setData((prev) => ({ ...prev, letterhead_image: null, remove_letterhead: true }));
        setFullImagePreview(null);
        if (letterheadInputRef.current) letterheadInputRef.current.value = '';
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.school.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // If belongs to School Client (INSTITUTION tenant)
    if (!isIndividualTeacher) {
        return (
            <section className={className}>
                <header className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        Identitas Satuan Pendidikan & Kop Surat
                    </h2>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        Informasi sekolah dan kop resmi yang digunakan pada seluruh cetak dokumen RPP dan Asesmen.
                    </p>
                </header>

                <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">
                            Terdaftar di Client Sekolah: {institution?.name || 'Sekolah Terhubung'}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Format kop surat resmi, logo lembaga, dan nama kepala sekolah dikelola terpusat oleh <strong>Administrator Sekolah</strong> Anda demi keseragaman seluruh dokumen resmi.
                        </p>
                        {institution?.npsn && (
                            <p className="mt-1 font-semibold text-purple-700 dark:text-purple-300">
                                NPSN: {institution.npsn}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={className}>
            <header className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Sekolah / Madrasah & Kop Dokumen
                    </h2>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Atur nama sekolah/madrasah dan format kop surat yang otomatis tercetak pada dokumen Word dan PDF (RPP, Modul Ajar, & Bank Soal).
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                {/* School Profile Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nama Satuan Pendidikan / Madrasah <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                    letterhead_line_2: prev.letterhead_line_2 === prev.name || !prev.letterhead_line_2 ? e.target.value : prev.letterhead_line_2,
                                }));
                            }}
                            placeholder="Contoh: SMP Negeri 1 Surabaya / MA Al-Hikmah"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Bentuk / Tipe Lembaga
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => {
                                const newType = e.target.value;
                                const isMad = ['MADRASAH', 'MI', 'MTS', 'MA', 'MAK'].includes(newType.toUpperCase());
                                setData((prev) => ({
                                    ...prev,
                                    type: newType,
                                    signature_title: isMad ? 'Kepala Madrasah' : 'Kepala Sekolah',
                                    letterhead_line_1: isMad ? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA' : 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
                                }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="SEKOLAH">Sekolah Umum</option>
                            <option value="MADRASAH">Madrasah (Kemenag)</option>
                            <option value="SD">SD / Sekolah Dasar</option>
                            <option value="SMP">SMP / Sekolah Menengah Pertama</option>
                            <option value="SMA">SMA / Sekolah Menengah Atas</option>
                            <option value="SMK">SMK / Sekolah Menengah Kejuruan</option>
                            <option value="MI">MI / Madrasah Ibtidaiyah</option>
                            <option value="MTS">MTs / Madrasah Tsanawiyah</option>
                            <option value="MA">MA / Madrasah Aliyah</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            NPSN (Opsional)
                        </label>
                        <input
                            type="text"
                            value={data.npsn}
                            onChange={(e) => setData('npsn', e.target.value)}
                            placeholder="8 digit NPSN"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Kota / Kabupaten Lokasi Sekolah
                        </label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                    signature_city: prev.signature_city === prev.city || !prev.signature_city ? e.target.value : prev.signature_city,
                                }));
                            }}
                            placeholder="Contoh: Surabaya / Bandung"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Alamat Lengkap Sekolah (Opsional)
                        </label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Jl. Raya Pendidikan No. 10"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Principal Signature Fields */}
                <SchoolSignatureFields
                    principalName={data.principal_name}
                    onPrincipalNameChange={(val) => setData('principal_name', val)}
                    principalIdNumber={data.principal_id_number}
                    onPrincipalIdNumberChange={(val) => setData('principal_id_number', val)}
                    signatureTitle={data.signature_title}
                    onSignatureTitleChange={(val) => setData('signature_title', val)}
                    signatureCity={data.signature_city}
                    onSignatureCityChange={(val) => setData('signature_city', val)}
                />

                {/* Letterhead Configuration */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Model Format Kop Surat
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pilih bagaimana kop surat ditampilkan di bagian atas lembar dokumen cetak.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'LOGO_LEFT', title: 'Logo + Teks Resmi', desc: 'Standar resmi kedinasan/kemenag' },
                            { id: 'TEXT_ONLY', title: 'Teks Saja', desc: 'Hanya teks tanpa logo instansi' },
                            { id: 'FULL_IMAGE', title: 'Gambar KOP Utuh', desc: 'Scan KOP atau banner gambar' },
                        ].map((style) => (
                            <button
                                key={style.id}
                                type="button"
                                onClick={() => setData('header_style', style.id as any)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.header_style === style.id
                                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <p className="text-xs font-bold">{style.title}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{style.desc}</p>
                            </button>
                        ))}
                    </div>

                    {data.header_style !== 'FULL_IMAGE' ? (
                        <div className="space-y-3 pt-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Baris 1: Instansi Atasan
                                </label>
                                <input
                                    type="text"
                                    value={data.letterhead_line_1}
                                    onChange={(e) => setData('letterhead_line_1', e.target.value)}
                                    placeholder="Contoh: PEMERINTAH PROVINSI JAWA TIMUR / DINAS PENDIDIKAN"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Baris 2: Nama Satuan Pendidikan (Kop Utama)
                                </label>
                                <input
                                    type="text"
                                    value={data.letterhead_line_2}
                                    onChange={(e) => setData('letterhead_line_2', e.target.value)}
                                    placeholder="Contoh: SMP NEGERI 1 SURABAYA"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Baris 3: Akreditasi / NPSN
                                </label>
                                <input
                                    type="text"
                                    value={data.letterhead_line_3}
                                    onChange={(e) => setData('letterhead_line_3', e.target.value)}
                                    placeholder="Contoh: NPSN: 20531234 | TERAKREDITASI A"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Subtext: Alamat, Telepon, Email & Website
                                </label>
                                <input
                                    type="text"
                                    value={data.letterhead_subtext}
                                    onChange={(e) => setData('letterhead_subtext', e.target.value)}
                                    placeholder="Contoh: Jl. Wijaya Kusuma No. 48 Telp. (031) 5345678 Website: smpn1surabaya.sch.id"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            {data.header_style === 'LOGO_LEFT' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Upload Logo Sekolah (PNG / JPG / WebP)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        {logoPreview ? (
                                            <div className="relative w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 flex items-center justify-center">
                                                <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveLogo}
                                                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                        )}
                                        <input
                                            ref={logoInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                            onChange={handleLogoChange}
                                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer"
                                        />
                                    </div>
                                    {errors.logo && <p className="text-xs text-rose-500 mt-1">{errors.logo}</p>}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Upload Gambar KOP Surat Utuh (File Hasil Scan / Gambar Banner KOP)
                            </label>
                            {fullImagePreview && (
                                <div className="relative mb-3 p-2 bg-white rounded-xl border border-slate-200 max-w-lg">
                                    <img src={fullImagePreview} alt="KOP Banner" className="w-full max-h-24 object-contain rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFullImage}
                                        className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-xs flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            )}
                            <input
                                ref={letterheadInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFullImageChange}
                                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer"
                            />
                            {errors.letterhead_image && <p className="text-xs text-rose-500 mt-1">{errors.letterhead_image}</p>}
                        </div>
                    )}

                    {/* Live Preview of Letterhead */}
                    <SchoolLetterheadPreview
                        headerStyle={data.header_style}
                        logoPreview={logoPreview}
                        fullImagePreview={fullImagePreview}
                        line1={data.letterhead_line_1}
                        line2={data.letterhead_line_2}
                        line3={data.letterhead_line_3}
                        subtext={data.letterhead_subtext}
                        name={data.name}
                        npsn={data.npsn}
                        address={data.address}
                    />
                </div>

                {/* Submit Action */}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                        <Check className="w-4 h-4" />
                        <span>{processing ? 'Menyimpan...' : 'Simpan Data Sekolah & Kop'}</span>
                    </button>

                    {recentlySuccessful && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                            ✓ Data berhasil disimpan
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
