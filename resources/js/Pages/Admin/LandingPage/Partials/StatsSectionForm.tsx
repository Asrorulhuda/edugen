import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import { BarChart3, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface StatsItem {
    value: string;
    label: string;
    description: string;
}

interface StatsSectionProps {
    section?: {
        title: string;
        content: {
            items?: StatsItem[];
        };
        is_active: boolean;
    };
}

export default function StatsSectionForm({ section }: StatsSectionProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        title: section?.title || 'Statistik & Metrik Dampak',
        is_active: section?.is_active ?? true,
        content: {
            items: section?.content?.items || [
                {
                    value: '100%',
                    label: 'Kepatuhan Regulasi',
                    description: 'Sesuai BSKAP 046/2025 & KMA 1503/2025.',
                },
                {
                    value: '5 Dimensi',
                    label: 'Panca Cinta Kemenag',
                    description: 'Mahabbatullah, Hubbul Ilm, Nafs, Biah, Wathan.',
                },
                {
                    value: '3 Pilar',
                    label: 'Deep Learning',
                    description: 'Mindful, Meaningful, dan Joyful Learning.',
                },
                {
                    value: '1 Klik',
                    label: 'Ekspor Kop Surat Resmi',
                    description: 'Tanda tangan Kepala Madrasah & Guru Pengampu.',
                },
            ],
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.landing-page.update', 'stats'), {
            preserveScroll: true,
        });
    };

    const handleItemChange = (index: number, field: keyof StatsItem, val: string) => {
        const items = [...data.content.items];
        items[index] = { ...items[index], [field]: val };
        setData('content', { ...data.content, items });
    };

    const addItem = () => {
        setData('content', {
            ...data.content,
            items: [
                ...data.content.items,
                { value: '500+', label: 'Metrik Baru', description: 'Keterangan dampak metrik' },
            ],
        });
    };

    const removeItem = (index: number) => {
        const items = data.content.items.filter((_, i) => i !== index);
        setData('content', { ...data.content, items });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Statistik & Angka Dampak Platform
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pamerkan angka pencapaian, kepatuhan kurikulum, dan efisiensi platform.
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

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Daftar Kartu Statistik ({data.content.items.length})
                    </span>
                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Kartu Metrik
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.content.items.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    Metrik #{index + 1}
                                </span>
                                {data.content.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                        title="Hapus metrik ini"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <InputLabel value="Angka / Nilai Utama (Value)" />
                                <TextInput
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                                    className="mt-1 block w-full text-sm font-bold text-emerald-600"
                                    placeholder="Contoh: 100% atau 12.000+"
                                />
                            </div>

                            <div>
                                <InputLabel value="Judul Label" />
                                <TextInput
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                                    className="mt-1 block w-full text-sm font-semibold"
                                    placeholder="Contoh: Kepatuhan Regulasi"
                                />
                            </div>

                            <div>
                                <InputLabel value="Keterangan Singkat" />
                                <TextInput
                                    type="text"
                                    value={item.description}
                                    onChange={(e) =>
                                        handleItemChange(index, 'description', e.target.value)
                                    }
                                    className="mt-1 block w-full text-xs text-slate-500"
                                    placeholder="Penjelasan ringkas tentang metrik..."
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
                        Perubahan Statistik berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Statistik'}
                </PrimaryButton>
            </div>
        </form>
    );
}
