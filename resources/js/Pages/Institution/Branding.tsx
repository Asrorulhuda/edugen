import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Eye, FileText, Image as ImageIcon, Info, Save, School, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface Props {
    institution: {
        id: number;
        name: string;
        logo_path?: string;
        header_style?: 'LOGO_LEFT' | 'TEXT_ONLY' | 'FULL_IMAGE';
        letterhead_line_1?: string;
        letterhead_line_2?: string;
        letterhead_line_3?: string;
        letterhead_subtext?: string;
        signature_city?: string;
        signature_title?: string;
        letterhead_path?: string;
        principal_name?: string;
        principal_id_number?: string;
    };
}

export default function Branding({ institution }: Props) {
    const [letterheadPreview, setLetterheadPreview] = useState<string | null>(
        institution.letterhead_path ? `/storage/${institution.letterhead_path}` : null
    );
    const letterheadInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        header_style: institution.header_style || 'LOGO_LEFT',
        letterhead_line_1: institution.letterhead_line_1 || 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
        letterhead_line_2: institution.letterhead_line_2 || institution.name || '',
        letterhead_line_3: institution.letterhead_line_3 || 'TERAKREDITASI A (UNGGUL)',
        letterhead_subtext: institution.letterhead_subtext || 'Jl. Raya Pendidikan No. 123, Kota / Kabupaten, Provinsi. Telp: (021) 1234567 | Email: info@sekolah.sch.id',
        signature_city: institution.signature_city || 'Jakarta',
        signature_title: institution.signature_title || 'Kepala Sekolah',
        letterhead_image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('letterhead_image', file);
            setLetterheadPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('institution.branding.update'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                        <School className="w-4 h-4" />
                        Pengaturan Lembaga & Sekolah
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        Kop Surat & Template Dokumen
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Kustomisasi kop surat resmi, stempel, dan tanda tangan kepala sekolah untuk seluruh dokumen ekspor (RPP, Modul Ajar, Kisi-kisi, & Bank Soal).
                    </p>
                </div>
            }
        >
            <Head title="Kop Surat & Template - Admin Sekolah" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Live Preview Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Pratinjau Kop Surat Resmi
                            </h2>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            Format Cetak A4
                        </span>
                    </div>

                    {/* Paper Mockup */}
                    <div className="mt-5 p-6 sm:p-8 bg-white text-black rounded-xl border border-slate-300 shadow-inner font-serif">
                        {data.header_style === 'FULL_IMAGE' ? (
                            <div className="w-full flex justify-center items-center min-h-[100px] border border-dashed border-slate-300 rounded-md p-2">
                                {letterheadPreview ? (
                                    <img src={letterheadPreview} alt="Full Banner Kop Surat" className="w-full max-h-36 object-contain" />
                                ) : (
                                    <div className="text-center py-6 text-slate-400">
                                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs font-sans">Belum ada gambar kop surat banner yang diunggah</p>
                                    </div>
                                )}
                            </div>
                        ) : data.header_style === 'LOGO_LEFT' ? (
                            <div className="flex items-center gap-6 border-b-2 border-black pb-4">
                                <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                                    {institution.logo_path ? (
                                        <img src={`/storage/${institution.logo_path}`} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-500 uppercase font-sans">
                                            LOGO
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center font-serif">
                                    <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-800">{data.letterhead_line_1 || 'LEMBAGA PENDIDIKAN'}</h4>
                                    <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">{data.letterhead_line_2 || institution.name}</h2>
                                    {data.letterhead_line_3 && (
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">{data.letterhead_line_3}</h4>
                                    )}
                                    <p className="text-[11px] text-slate-600 font-sans mt-1 leading-tight">{data.letterhead_subtext}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center border-b-2 border-black pb-4 font-serif">
                                <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-800">{data.letterhead_line_1 || 'LEMBAGA PENDIDIKAN'}</h4>
                                <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">{data.letterhead_line_2 || institution.name}</h2>
                                {data.letterhead_line_3 && (
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">{data.letterhead_line_3}</h4>
                                )}
                                <p className="text-[11px] text-slate-600 font-sans mt-1 leading-tight">{data.letterhead_subtext}</p>
                            </div>
                        )}

                        {/* Sample Signature Box */}
                        <div className="mt-8 flex justify-end font-sans text-xs">
                            <div className="text-center w-64 space-y-1">
                                <p className="text-slate-600">{data.signature_city || 'Kota'}, ........................ 2026</p>
                                <p className="font-semibold text-slate-900">{data.signature_title || 'Kepala Sekolah'}</p>
                                <div className="h-16 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan & Stempel ]</span>
                                </div>
                                <p className="font-bold underline text-slate-950">{institution.principal_name || '(Nama Kepala Sekolah)'}</p>
                                <p className="text-[11px] text-slate-600">NIP. {institution.principal_id_number || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Konfigurasi Header & Pengesahan
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pilih gaya header dan sesuaikan teks baris identitas kop surat.
                            </p>
                        </div>
                    </div>

                    {/* Header Style Radio */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Gaya Kop Surat (Header Style)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition ${
                                data.header_style === 'LOGO_LEFT'
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="header_style"
                                    value="LOGO_LEFT"
                                    checked={data.header_style === 'LOGO_LEFT'}
                                    onChange={(e) => setData('header_style', e.target.value as any)}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-sm text-slate-900 dark:text-white">Logo Kiri + Teks</span>
                                <span className="text-xs text-slate-500 mt-1">Standar resmi madrasah/sekolah negeri & swasta dengan logo di sisi kiri.</span>
                            </label>

                            <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition ${
                                data.header_style === 'TEXT_ONLY'
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="header_style"
                                    value="TEXT_ONLY"
                                    checked={data.header_style === 'TEXT_ONLY'}
                                    onChange={(e) => setData('header_style', e.target.value as any)}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-sm text-slate-900 dark:text-white">Teks Tengah (Simpel)</span>
                                <span className="text-xs text-slate-500 mt-1">Hanya teks identitas instansi di tengah tanpa logo grafis.</span>
                            </label>

                            <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition ${
                                data.header_style === 'FULL_IMAGE'
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="header_style"
                                    value="FULL_IMAGE"
                                    checked={data.header_style === 'FULL_IMAGE'}
                                    onChange={(e) => setData('header_style', e.target.value as any)}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-sm text-slate-900 dark:text-white">Banner Gambar Penuh</span>
                                <span className="text-xs text-slate-500 mt-1">Unggah berkas PNG kop surat siap cetak yang sudah didesain sebelumnya.</span>
                            </label>
                        </div>
                    </div>

                    {/* Banner Image Upload if FULL_IMAGE */}
                    {data.header_style === 'FULL_IMAGE' && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Unggah Berkas Banner Kop Surat (PNG/JPG, Maks 4MB)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    ref={letterheadInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => letterheadInputRef.current?.click()}
                                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                                >
                                    Pilih Gambar Banner
                                </button>
                                <span className="text-xs text-slate-500">
                                    Disarankan resolusi minimal 1200 x 250 px dengan latar belakang transparan/putih.
                                </span>
                            </div>
                            {errors.letterhead_image && <p className="text-xs text-red-500">{errors.letterhead_image}</p>}
                        </div>
                    )}

                    {/* Lines Configuration */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Baris 1: Yayasan / Kementerian / Dinas Terkait
                            </label>
                            <input
                                type="text"
                                value={data.letterhead_line_1}
                                onChange={(e) => setData('letterhead_line_1', e.target.value)}
                                placeholder="Contoh: KEMENTERIAN AGAMA REPUBLIK INDONESIA"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.letterhead_line_1 && <p className="text-xs text-red-500 mt-1">{errors.letterhead_line_1}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Baris 2: Nama Resmi Satuan Pendidikan (Header Utama)
                            </label>
                            <input
                                type="text"
                                value={data.letterhead_line_2}
                                onChange={(e) => setData('letterhead_line_2', e.target.value)}
                                placeholder="Contoh: MADRASAH TSANAWIYAH AL-IKHLAS BANDUNG"
                                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.letterhead_line_2 && <p className="text-xs text-red-500 mt-1">{errors.letterhead_line_2}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Baris 3: Status Akreditasi / SK Operasional (Opsional)
                            </label>
                            <input
                                type="text"
                                value={data.letterhead_line_3}
                                onChange={(e) => setData('letterhead_line_3', e.target.value)}
                                placeholder="Contoh: TERAKREDITASI A (UNGGUL) - NPSN: 12345678"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.letterhead_line_3 && <p className="text-xs text-red-500 mt-1">{errors.letterhead_line_3}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Subteks: Alamat Lengkap, Kontak, & Email Sekolah
                            </label>
                            <textarea
                                rows={2}
                                value={data.letterhead_subtext}
                                onChange={(e) => setData('letterhead_subtext', e.target.value)}
                                placeholder="Contoh: Jl. Diponegoro No. 12, Kel. Sukamaju, Kec. Cibeunying, Bandung 40123. Telp: (022) 7654321 | Email: info@sekolah.sch.id"
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.letterhead_subtext && <p className="text-xs text-red-500 mt-1">{errors.letterhead_subtext}</p>}
                        </div>
                    </div>

                    {/* Signature Settings */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Kota Lokasi Tanda Tangan
                            </label>
                            <input
                                type="text"
                                value={data.signature_city}
                                onChange={(e) => setData('signature_city', e.target.value)}
                                placeholder="Contoh: Bandung"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.signature_city && <p className="text-xs text-red-500 mt-1">{errors.signature_city}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nomenklatur Jabatan Pengesah
                            </label>
                            <input
                                type="text"
                                value={data.signature_title}
                                onChange={(e) => setData('signature_title', e.target.value)}
                                placeholder="Contoh: Kepala Madrasah / Kepala Sekolah"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.signature_title && <p className="text-xs text-red-500 mt-1">{errors.signature_title}</p>}
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            Nama kepala sekolah dan NIP/NUPTK akan otomatis diambil dari data yang terdaftar di{' '}
                            <strong>Profil Sekolah</strong>. Format kop ini akan berlaku untuk seluruh guru yang berada di bawah naungan lembaga ini saat mengekspor dokumen.
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Format Kop Surat'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
