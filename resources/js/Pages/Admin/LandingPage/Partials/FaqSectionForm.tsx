import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import { HelpCircle, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqSectionProps {
    section?: {
        title: string;
        content: {
            section_badge?: string;
            section_title?: string;
            section_desc?: string;
            items?: FaqItem[];
        };
        is_active: boolean;
    };
}

export default function FaqSectionForm({ section }: FaqSectionProps) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        title: section?.title || 'Pertanyaan yang Sering Diajukan (FAQ)',
        is_active: section?.is_active ?? true,
        content: {
            section_badge: section?.content?.section_badge || 'Tanya Jawab',
            section_title: section?.content?.section_title || 'Pertanyaan yang Sering Diajukan',
            section_desc:
                section?.content?.section_desc ||
                'Semua yang perlu Anda ketahui tentang EduGen KBC, kepatuhan regulasi, dan cara kerjanya.',
            items: section?.content?.items || [
                {
                    q: 'Apakah AI di EduGen KBC membuat atau mengarang teks Capaian Pembelajaran (CP)?',
                    a: 'Tidak. CP berasal dari database master platform yang dikelola Super Admin dari regulasi resmi pemerintah (BSKAP 046/2025 dan KMA 1503/2025). AI hanya merumuskan turunan perangkat (TP, ATP, RPP/Modul Ajar, Kisi-kisi, Soal) berdasarkan CP resmi tersebut.',
                },
                {
                    q: 'Apa perbedaan akun Guru Mandiri (Personal) dan Akun Instansi (Madrasah/Sekolah)?',
                    a: 'Guru Mandiri memiliki Personal Workspace untuk merancang perangkat secara independen. Akun Instansi memiliki ruang kerja kelembagaan dengan 2 peran: Admin Madrasah (mengatur profil, kop surat, tahun ajaran, dan mengundang guru) serta Guru (merancang seluruh perangkat ajar). Satu akun bisa berpindah workspace kapan saja.',
                },
            ],
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.landing-page.update', 'faqs'), {
            preserveScroll: true,
        });
    };

    const handleFaqChange = (index: number, field: keyof FaqItem, val: string) => {
        const items = [...data.content.items];
        items[index] = { ...items[index], [field]: val };
        setData('content', { ...data.content, items });
    };

    const addFaq = () => {
        setData('content', {
            ...data.content,
            items: [
                ...data.content.items,
                {
                    q: 'Pertanyaan baru?',
                    a: 'Jawaban penjelasan untuk pertanyaan ini...',
                },
            ],
        });
    };

    const removeFaq = (index: number) => {
        const items = data.content.items.filter((_, i) => i !== index);
        setData('content', { ...data.content, items });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Tanya Jawab & FAQ Interaktif
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola pertanyaan yang sering diajukan calon pengguna dan guru.
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
                    <InputLabel value="Judul Bagian FAQ" />
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
                        Daftar FAQ ({data.content.items.length})
                    </h4>
                    <button
                        type="button"
                        onClick={addFaq}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Pertanyaan (FAQ)
                    </button>
                </div>

                <div className="space-y-4">
                    {data.content.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    Pertanyaan #{idx + 1}
                                </span>
                                {data.content.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFaq(idx)}
                                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <InputLabel value="Teks Pertanyaan (Q)" />
                                <TextInput
                                    type="text"
                                    value={item.q}
                                    onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                                    className="mt-1 block w-full text-sm font-semibold"
                                />
                            </div>

                            <div>
                                <InputLabel value="Teks Jawaban (A)" />
                                <textarea
                                    rows={3}
                                    value={item.a}
                                    onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
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
                        Perubahan FAQ berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan FAQ'}
                </PrimaryButton>
            </div>
        </form>
    );
}
