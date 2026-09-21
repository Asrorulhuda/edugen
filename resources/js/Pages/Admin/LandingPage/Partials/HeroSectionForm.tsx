import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface HeroSectionProps {
    section?: {
        title: string;
        content: {
            badge_text?: string;
            headline_gradient?: string;
            headline_main?: string;
            subheadline?: string;
            cta_primary_text?: string;
            cta_primary_link?: string;
            cta_secondary_text?: string;
            cta_secondary_link?: string;
            feature_bullets?: string[];
        };
        is_active: boolean;
    };
}

export default function HeroSectionForm({ section }: HeroSectionProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        title: section?.title || 'Hero Banner Utama',
        is_active: section?.is_active ?? true,
        content: {
            badge_text: section?.content?.badge_text || '',
            headline_gradient: section?.content?.headline_gradient || '',
            headline_main: section?.content?.headline_main || '',
            subheadline: section?.content?.subheadline || '',
            cta_primary_text: section?.content?.cta_primary_text || '',
            cta_primary_link: section?.content?.cta_primary_link || '/register',
            cta_secondary_text: section?.content?.cta_secondary_text || '',
            cta_secondary_link: section?.content?.cta_secondary_link || '#workflow',
            feature_bullets: section?.content?.feature_bullets || [
                'CP Resmi Terkunci & Read-Only',
                'Multi-Provider AI Terarah',
                'Format Cetak Kop Resmi Madrasah/Sekolah',
            ],
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.landing-page.update', 'hero'), {
            preserveScroll: true,
        });
    };

    const handleBulletChange = (index: number, val: string) => {
        const bullets = [...data.content.feature_bullets];
        bullets[index] = val;
        setData('content', { ...data.content, feature_bullets: bullets });
    };

    const addBullet = () => {
        setData('content', {
            ...data.content,
            feature_bullets: [...data.content.feature_bullets, 'Fitur Baru Unggulan'],
        });
    };

    const removeBullet = (index: number) => {
        const bullets = data.content.feature_bullets.filter((_, i) => i !== index);
        setData('content', { ...data.content, feature_bullets: bullets });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Hero Banner & Headline Utama
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur pesan pertama yang dilihat pengunjung saat membuka halaman landing page.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <InputLabel htmlFor="badge_text" value="Teks Badge Regulasi (Paling Atas)" />
                    <TextInput
                        id="badge_text"
                        type="text"
                        value={data.content.badge_text}
                        onChange={(e) =>
                            setData('content', { ...data.content, badge_text: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                        placeholder="Contoh: Kurikulum Berbasis Cinta (KBC) • BSKAP 046 & KMA 1503"
                    />
                    <InputError message={errors['content.badge_text']} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="headline_gradient" value="Teks Headline Berwarna / Gradient" />
                    <TextInput
                        id="headline_gradient"
                        type="text"
                        value={data.content.headline_gradient}
                        onChange={(e) =>
                            setData('content', { ...data.content, headline_gradient: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                        placeholder="Contoh: Perangkat Pembelajaran Terintegrasi"
                    />
                    <InputError message={errors['content.headline_gradient']} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="headline_main" value="Teks Headline Utama (Bold Solid)" />
                    <TextInput
                        id="headline_main"
                        type="text"
                        value={data.content.headline_main}
                        onChange={(e) =>
                            setData('content', { ...data.content, headline_main: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                        placeholder="Contoh: Capaian Pembelajaran Resmi, Bukan Karangan AI."
                    />
                    <InputError message={errors['content.headline_main']} className="mt-1" />
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor="subheadline" value="Deskripsi Subheadline" />
                    <textarea
                        id="subheadline"
                        rows={3}
                        value={data.content.subheadline}
                        onChange={(e) =>
                            setData('content', { ...data.content, subheadline: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Uraian pendukung mengenai nilai unggul platform..."
                    />
                    <InputError message={errors['content.subheadline']} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="cta_primary_text" value="Teks Tombol CTA Utama (Hijau)" />
                    <TextInput
                        id="cta_primary_text"
                        type="text"
                        value={data.content.cta_primary_text}
                        onChange={(e) =>
                            setData('content', { ...data.content, cta_primary_text: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="cta_primary_link" value="Target Link CTA Utama" />
                    <TextInput
                        id="cta_primary_link"
                        type="text"
                        value={data.content.cta_primary_link}
                        onChange={(e) =>
                            setData('content', { ...data.content, cta_primary_link: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="cta_secondary_text" value="Teks Tombol CTA Kedua (Outline)" />
                    <TextInput
                        id="cta_secondary_text"
                        type="text"
                        value={data.content.cta_secondary_text}
                        onChange={(e) =>
                            setData('content', { ...data.content, cta_secondary_text: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="cta_secondary_link" value="Target Link CTA Kedua" />
                    <TextInput
                        id="cta_secondary_link"
                        type="text"
                        value={data.content.cta_secondary_link}
                        onChange={(e) =>
                            setData('content', { ...data.content, cta_secondary_link: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <InputLabel value="Poin-Poin Keunggulan Cepat (Bullet Highlight)" />
                        <button
                            type="button"
                            onClick={addBullet}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        >
                            + Tambah Poin
                        </button>
                    </div>
                    <div className="space-y-2">
                        {data.content.feature_bullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <TextInput
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                                    className="block w-full text-sm"
                                />
                                {data.content.feature_bullets.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeBullet(idx)}
                                        className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {recentlySuccessful && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        Perubahan Hero berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Hero Section'}
                </PrimaryButton>
            </div>
        </form>
    );
}
