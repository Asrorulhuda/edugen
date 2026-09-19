import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Check, Globe, Mail, MapPin, Phone, Save, School, UserCheck } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface Props {
    institution: {
        id: number;
        name: string;
        type: string;
        npsn?: string;
        nsm?: string;
        address?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        phone?: string;
        email?: string;
        website?: string;
        logo_path?: string;
        principal_name?: string;
        principal_id_number?: string;
        default_curriculum_mode: string;
        status: string;
    };
    curricula: Array<{ code: string; name: string }>;
    educationLevels: Array<{ code: string; name: string; category: string }>;
}

export default function Profile({ institution, curricula, educationLevels }: Props) {
    const defaultLogo = institution.type === 'MADRASAH' || ['MI', 'MTS', 'MA'].includes(institution.type)
        ? '/images/logos/kemenag.svg'
        : '/images/logos/tutwuri.svg';

    const [logoPreview, setLogoPreview] = useState<string | null>(
        institution.logo_path
            ? `/storage/${institution.logo_path}`
            : ((institution as any).effective_logo_url || defaultLogo)
    );
    const logoInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: institution.name || '',
        type: institution.type || 'MADRASAH',
        npsn: institution.npsn || '',
        nsm: institution.nsm || '',
        address: institution.address || '',
        city: institution.city || '',
        province: institution.province || '',
        postal_code: institution.postal_code || '',
        phone: institution.phone || '',
        email: institution.email || '',
        website: institution.website || '',
        principal_name: institution.principal_name || '',
        principal_id_number: institution.principal_id_number || '',
        default_curriculum_mode: institution.default_curriculum_mode || 'MADRASAH_KBC',
        logo: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('institution.profile.update'), {
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
                        Profil Sekolah / Madrasah
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Kelola identitas resmi lembaga, NPSN/NSM, kontak, kurikulum utama, dan data kepala sekolah.
                    </p>
                </div>
            }
        >
            <Head title="Profil Lembaga - Admin Sekolah" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    {/* Header: Logo & School Name */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <School className="w-10 h-10 text-slate-400" />
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current?.click()}
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Ganti Logo
                                </button>
                                {(institution.logo_path || data.logo) && (
                                    <>
                                        <span className="text-slate-300 dark:text-slate-700">|</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData((prev: any) => ({ ...prev, logo: null, remove_logo: true }));
                                                setLogoPreview(defaultLogo);
                                                if (logoInputRef.current) logoInputRef.current.value = '';
                                            }}
                                            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                                        >
                                            Reset
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 text-center mt-1">
                                PNG, JPG, SVG (Maks. 5MB)
                            </p>
                            {errors.logo && (
                                <p className="text-rose-500 text-xs mt-1 text-center font-medium max-w-[120px]">
                                    {errors.logo}
                                </p>
                            )}
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Resmi Lembaga / Sekolah <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: MTs Al-Falah Jakarta"
                                    className="w-full text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis / Jenjang Lembaga
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="MADRASAH">Madrasah (Kemenag)</option>
                                        <option value="SCHOOL">Sekolah Umum (Kemendikbud)</option>
                                        <option value="PESANTREN">Pesantren / PDF</option>
                                        {educationLevels.map((lvl) => (
                                            <option key={lvl.code} value={lvl.code}>{lvl.name} ({lvl.code})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NPSN (Nomor Pokok Sekolah)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.npsn}
                                        onChange={(e) => setData('npsn', e.target.value)}
                                        placeholder="Contoh: 20101234"
                                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NSM (Nomor Statistik Madrasah)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nsm}
                                        onChange={(e) => setData('nsm', e.target.value)}
                                        placeholder="Contoh: 121231710001"
                                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum Mode Section */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Kerangka Kurikulum Default Lembaga <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.default_curriculum_mode}
                            onChange={(e) => setData('default_curriculum_mode', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        >
                            {curricula.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Mode kurikulum ini menjadi acuan baku penyusunan RPP/Modul dan filter default bagi guru saat membuat dokumen.
                        </p>
                    </div>

                    {/* Address & Contact Information */}
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            Alamat & Kontak Lembaga
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Alamat Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Jalan, Kelurahan, Kecamatan..."
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Kota / Kabupaten
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Contoh: Jakarta Selatan"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    placeholder="Contoh: DKI Jakarta"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Kode Pos
                                </label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    placeholder="Contoh: 12540"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" /> Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="(021) 7891234"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" /> Email Resmi
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="info@mtsalfalah.sch.id"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-slate-400" /> Website Lembaga
                                </label>
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://mtsalfalah.sch.id"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Principal Information */}
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            Data Kepala Madrasah / Sekolah (Penandatangan Dokumen)
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Lengkap & Gelar Kepala Sekolah
                                </label>
                                <input
                                    type="text"
                                    value={data.principal_name}
                                    onChange={(e) => setData('principal_name', e.target.value)}
                                    placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Pd."
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    NIP / NUPTK Kepala Sekolah
                                </label>
                                <input
                                    type="text"
                                    value={data.principal_id_number}
                                    onChange={(e) => setData('principal_id_number', e.target.value)}
                                    placeholder="Contoh: 197505102000031002"
                                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 disabled:opacity-50 transition"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Profil Lembaga'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
