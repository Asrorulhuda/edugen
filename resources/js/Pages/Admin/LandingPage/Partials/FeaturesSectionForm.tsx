import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import { Award, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface FeatureCard {
    title: string;
    description: string;
    tag: string;
}

interface FeaturesSectionProps {
    section?: {
        title: string;
        content: {
            section_badge?: string;
            section_title?: string;
            section_desc?: string;
            cards?: FeatureCard[];
        };
        is_active: boolean;
    };
}

export default function FeaturesSectionForm({ section }: FeaturesSectionProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        title: section?.title || 'Fitur & Keunggulan EduGen KBC',
        is_active: section?.is_active ?? true,
        content: {
            section_badge: section?.content?.section_badge || 'Integrasi Karakter & Pedagogi',
            section_title:
                section?.content?.section_title ||
                'Bukan Sekadar Generator Biasa, Ini Ekosistem Kurikulum Utuh',
            section_desc:
                section?.content?.section_desc ||
                'Didesain khusus untuk pendidik di Indonesia dengan standar regulasi Kemendikdasmen dan Kementerian Agama RI.',
            cards: section?.content?.cards || [
                {
                    title: 'Kurikulum Berbasis Cinta (KBC)',
                    description:
                        'Menerjemahkan 5 Dimensi Panca Cinta dan 8 Dimensi Profil Lulusan ke dalam rencana aktivitas nyata, apersepsi bermakna, dan rubrik asesmen karakter.',
                    tag: 'Kemenag RI',
                },
                {
                    title: 'Asesmen HOTS & Kisi-Kisi Matriks',
                    description:
                        'Pembuatan paket soal Pilihan Ganda Kompleks, Menjodohkan, Isian, dan Uraian lengkap dengan stimulus kontekstual dan level kognitif L1, L2, L3.',
                    tag: 'Standar Asesmen',
                },
                {
                    title: 'Modul Ajar Deep Learning',
                    description:
                        'Skenario pembelajaran berprinsip Mindful (berkesadaran), Meaningful (bermakna), dan Joyful (menggembirakan) dengan diferensiasi konten dan proses.',
                    tag: 'Pedagogi Modern',
                },
            ],
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.landing-page.update', 'features'), {
            preserveScroll: true,
        });
    };

    const handleCardChange = (index: number, field: keyof FeatureCard, val: string) => {
        const cards = [...data.content.cards];
        cards[index] = { ...cards[index], [field]: val };
        setData('content', { ...data.content, cards });
    };

    const addCard = () => {
        setData('content', {
            ...data.content,
            cards: [
                ...data.content.cards,
                {
                    title: 'Fitur Unggulan Baru',
                    description: 'Deskripsi manfaat fitur baru...',
                    tag: 'Kategori',
                },
            ],
        });
    };

    const removeCard = (index: number) => {
        const cards = data.content.cards.filter((_, i) => i !== index);
        setData('content', { ...data.content, cards });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Fitur Unggulan & Pilar KBC
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola kartu-kartu keunggulan (KBC, Asesmen HOTS, Deep Learning).
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
                    <InputLabel value="Teks Badge Bagian" />
                    <TextInput
                        type="text"
                        value={data.content.section_badge}
                        onChange={(e) =>
                            setData('content', { ...data.content, section_badge: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>

                <div>
                    <InputLabel value="Judul Bagian Fitur" />
                    <TextInput
                        type="text"
                        value={data.content.section_title}
                        onChange={(e) =>
                            setData('content', { ...data.content, section_title: e.target.value })
                        }
                        className="mt-1 block w-full text-sm font-semibold"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Deskripsi Pengantar" />
                    <TextInput
                        type="text"
                        value={data.content.section_desc}
                        onChange={(e) =>
                            setData('content', { ...data.content, section_desc: e.target.value })
                        }
                        className="mt-1 block w-full text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Kartu Fitur ({data.content.cards.length})
                    </h4>
                    <button
                        type="button"
                        onClick={addCard}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Kartu Fitur
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.content.cards.map((card, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3 relative"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                    {card.tag || 'Fitur'}
                                </span>
                                {data.content.cards.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCard(idx)}
                                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <InputLabel value="Tag Kategori" />
                                <TextInput
                                    type="text"
                                    value={card.tag}
                                    onChange={(e) => handleCardChange(idx, 'tag', e.target.value)}
                                    className="mt-1 block w-full text-xs"
                                    placeholder="Contoh: Kemenag RI"
                                />
                            </div>

                            <div>
                                <InputLabel value="Judul Fitur" />
                                <TextInput
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                                    className="mt-1 block w-full text-sm font-semibold"
                                />
                            </div>

                            <div>
                                <InputLabel value="Deskripsi Fitur" />
                                <textarea
                                    rows={3}
                                    value={card.description}
                                    onChange={(e) =>
                                        handleCardChange(idx, 'description', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-xs shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {recentlySuccessful && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Perubahan Fitur berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Fitur'}
                </PrimaryButton>
            </div>
        </form>
    );
}
