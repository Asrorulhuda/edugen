import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import { Layers, Save, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface WorkflowStep {
    number: string;
    tabTitle: string;
    status: string;
    title: string;
    desc: string;
    meta: string;
}

interface WorkflowSectionProps {
    section?: {
        title: string;
        content: {
            section_badge?: string;
            section_title?: string;
            section_desc?: string;
            steps?: WorkflowStep[];
        };
        is_active: boolean;
    };
}

export default function WorkflowSectionForm({ section }: WorkflowSectionProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        title: section?.title || 'Alur Kerja 4 Langkah',
        is_active: section?.is_active ?? true,
        content: {
            section_badge: section?.content?.section_badge || 'Alur Terstruktur',
            section_title:
                section?.content?.section_title ||
                'Bekerja dengan Alur yang Menjamin Kualitas Pedagogis',
            section_desc:
                section?.content?.section_desc ||
                'Setiap tahapan dirancang untuk memastikan guru tetap memegang kendali mutu intelektual dan pedagogis perangkat ajar.',
            steps: section?.content?.steps || [
                {
                    number: '01',
                    tabTitle: 'Pilih CP',
                    status: 'CP Siap Digunakan (Read-only)',
                    title: 'Guru memilih Capaian Pembelajaran (CP) resmi terverifikasi.',
                    desc: 'Tidak ada prompt bebas untuk mengarang atau menebak teks CP. Guru memilih mata pelajaran, fase, dan kelas; sistem menampilkan sumber hukum resmi (BSKAP 046/2025 atau KMA 1503/2025) beserta versinya yang terkunci.',
                    meta: 'BSKAP 046/H/KR/2025 & KMA 1503/2025',
                },
                {
                    number: '02',
                    tabTitle: 'Generate',
                    status: 'Multi-Provider AI Terkalibrasi',
                    title: 'AI menyusun TP, ATP, Modul Ajar KBC, dan Bank Soal.',
                    desc: 'Generator AI (Gemini, Grok, DeepSeek, OpenRouter) bekerja berdasarkan acuan Taksonomi Bloom (C1-C6), 5 Pilar Karakter Panca Cinta Kemenag, dan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful).',
                    meta: 'Sistem Terintegrasi Panca Cinta',
                },
                {
                    number: '03',
                    tabTitle: 'Validasi',
                    status: 'Pemeriksaan Pedagogis Terukur',
                    title: 'Guru memvalidasi, menelaah indikator, dan menyunting butir.',
                    desc: 'Guru memiliki kendali penuh untuk menyempurnakan indikator soal, level kognitif (L1/L2/L3), kunci jawaban, rubrik 4 skala deskriptif, dan diferensiasi pembelajaran sebelum disimpan.',
                    meta: 'Kontrol Penuh di Tangan Pendidik',
                },
                {
                    number: '04',
                    tabTitle: 'Export & Cetak',
                    status: 'Kop Surat Resmi Siap Pakai',
                    title: 'Ekspor naskah ujian, kisi-kisi, modul ajar, dan rubrik ber-Kop Surat.',
                    desc: 'Dokumen dicetak langsung dengan format kop surat resmi madrasah/sekolah, lengkap dengan tanda tangan Kepala Madrasah dan Guru Pengampu, bebas watermark.',
                    meta: 'Format PDF, Cetak Browser & Kuitansi',
                },
            ],
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.landing-page.update', 'workflow'), {
            preserveScroll: true,
        });
    };

    const handleStepChange = (index: number, field: keyof WorkflowStep, val: string) => {
        const steps = [...data.content.steps];
        steps[index] = { ...steps[index], [field]: val };
        setData('content', { ...data.content, steps });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Alur Kerja & Panduan Interaktif
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur 4 tahapan alur kerja interaktif (Pilih CP, Generate, Validasi, Ekspor Kop).
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
                    <InputLabel value="Judul Bagian Workflow" />
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Langkah-Langkah Workflow ({data.content.steps.length})
                </h4>

                <div className="space-y-4">
                    {data.content.steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                                    {step.number}
                                </span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    Tahap {step.number}: {step.tabTitle}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <InputLabel value="Nama Tab" />
                                    <TextInput
                                        type="text"
                                        value={step.tabTitle}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'tabTitle', e.target.value)
                                        }
                                        className="mt-1 block w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Badge Status" />
                                    <TextInput
                                        type="text"
                                        value={step.status}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'status', e.target.value)
                                        }
                                        className="mt-1 block w-full text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel value="Judul Utama Langkah" />
                                    <TextInput
                                        type="text"
                                        value={step.title}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'title', e.target.value)
                                        }
                                        className="mt-1 block w-full text-sm font-medium"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel value="Uraian Rinci" />
                                    <textarea
                                        rows={2}
                                        value={step.desc}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'desc', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-xs shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel value="Tag Regulasi / Keterangan Kaki" />
                                    <TextInput
                                        type="text"
                                        value={step.meta}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'meta', e.target.value)
                                        }
                                        className="mt-1 block w-full text-xs text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {recentlySuccessful && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Perubahan Alur Kerja berhasil disimpan!
                    </span>
                )}
                <PrimaryButton disabled={processing} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {processing ? 'Menyimpan...' : 'Simpan Workflow'}
                </PrimaryButton>
            </div>
        </form>
    );
}
