import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import { PhoneCall, Save, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface FooterSectionProps {
    section?: {
        title: string;
        content: {
            brand_name?: string;
            tagline?: string;
            contact_email?: string;
            contact_whatsapp?: string;
            contact_address?: string;
            copyright_text?: string;
            social_links?: {
                instagram?: string;
                youtube?: string;
                telegram?: string;
            };
        };
        is_active: boolean;
    };
}

export default function FooterSectionForm({ section }: FooterSectionProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        title: section?.title || 'Footer, Bantuan & Kontak',
        is_active: section?.is_active ?? true,
        content: {
            brand_name: section?.content?.brand_name || 'EduGen KBC',
            tagline:
                section?.content?.tagline ||
                'Platform Generator Perangkat Pembelajaran & Modul Ajar Berbasis Cinta (KBC) dengan Capaian Pembelajaran Resmi BSKAP 046/2025 & KMA 1503/2025.',
            contact_email: section?.content?.contact_email || 'support@edugen.id',
            contact_whatsapp: section?.content?.contact_whatsapp || '0812-3456-7890',
            contact_address: section?.content?.contact_address || 'Jakarta, Indonesia',
            copyright_text:
                section?.content?.copyright_text ||
                'Hak Cipta Terpelihara • EduGen KBC Indonesia.',
            social_links: {
                instagram: section?.content?.social_links?.instagram || 'https://instagram.com',
                youtube: section?.content?.social_links?.youtube || 'https://youtube.com',
                telegram: section?.content?.social_links?.telegram || 'https://telegram.org',
            },
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.landing-page.update', 'footer'), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Footer, Bantuan & Kontak WhatsApp
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur nomor kontak WhatsApp bantuan, email support, dan tautan sosial media.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        Aktifkan Section
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel value="Nama Brand Footer" />
                    <TextInput
                        type="text"
                        value={data.content.brand_name}
                        onChange={(e) =>
                            setData('content', { ...data.content, brand_name: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel value="Email Support / Layanan" />
                    <TextInput
                        type="email"
                        value={data.content.contact_email}
                        onChange={(e) =>
                            setData('content', { ...data.content, contact_email: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel value="Nomor WhatsApp Bantuan (CS Guru)" />
                    <TextInput
                        type="text"
                        value={data.content.contact_whatsapp}
                        onChange={(e) =>
                            setData('content', { ...data.content, contact_whatsapp: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                        placeholder="Contoh: 0812-3456-7890"
                    />
                </div>

                <div>
                    <InputLabel value="Alamat / Kota Domisili" />
                    <TextInput
                        type="text"
                        value={data.content.contact_address}
                        onChange={(e) =>
                            setData('content', { ...data.content, contact_address: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Tagline / Ringkasan Lembaga Footer" />
                    <textarea
                        rows={2}
                        value={data.content.tagline}
                        onChange={(e) =>
                            setData('content', { ...data.content, tagline: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-xs shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Teks Hak Cipta (Copyright)" />
                    <TextInput
                        type="text"
                        value={data.content.copyright_text}
                        onChange={(e) =>
                            setData('content', { ...data.content, copyright_text: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel value="Link Instagram" />
                    <TextInput
                        type="text"
                        value={data.content.social_links.instagram}
                        onChange={(e) =>
                            setData('content', {
                                ...data.content,
                                social_links: {
                                    ...data.content.social_links,
                                    instagram: e.target.value,
                                },
                            })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel value="Link YouTube" />
                    <TextInput
                        type="text"
                        value={data.content.social_links.youtube}
                        onChange={(e) =>
                            setData('content', {
                                ...data.content,
                                social_links: {
                                    ...data.content.social_links,
                                    youtube: e.target.value,
                                },
                            })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {recentlySuccessful && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Perubahan Footer berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Footer'}
                </PrimaryButton>
            </div>
        </form>
    );
}
