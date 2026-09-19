import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, ArrowLeft, CheckCircle2, Download, FileSpreadsheet, Info, ShieldCheck, Upload, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface PreviewRow {
    row_number: number;
    data: {
        curriculum_code: string;
        subject_code: string;
        phase_code: string;
        element_code?: string;
        cp_code: string;
        cp_text: string;
        regulation_code: string;
        source_locator?: string;
    };
    errors: string[];
    warnings: string[];
    is_valid: boolean;
}

interface PreviewResult {
    total_rows: number;
    valid_rows: number;
    errors_count: number;
    warnings_count: number;
    preview_rows: PreviewRow[];
    all_rows: PreviewRow[];
}

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<PreviewResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreview(null);
            setErrorMessage(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setErrorMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(route('admin.import-cp.preview'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPreview(response.data);
        } catch (err: any) {
            setErrorMessage(err.response?.data?.error || 'Gagal memproses file CSV. Pastikan format kolom sesuai template.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCommit = async () => {
        if (!preview || preview.valid_rows === 0) return;

        setIsSubmitting(true);
        const validRowsOnly = preview.all_rows.filter((r) => r.is_valid);

        try {
            const response = await axios.post(route('admin.import-cp.store'), {
                rows: validRowsOnly,
            });

            alert(response.data.message);
            router.get(route('admin.learning-outcomes.index'));
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || 'Gagal menyimpan data ke database.');
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.learning-outcomes.index')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Master Capaian Pembelajaran
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Import Capaian Pembelajaran (CSV/XLSX)
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title="Import CP - Super Admin" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Information Card */}
                <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-sm">Alur Kepatuhan Import Regulasi Resmi</p>
                            <p className="mt-1 text-emerald-800 dark:text-emerald-300">
                                Sesuai spesifikasi, data yang diimpor akan masuk terlebih dahulu sebagai status <strong>DRAFT</strong> untuk peninjauan verifikator sebelum dipublikasikan resmi kepada guru.
                            </p>
                        </div>
                    </div>

                    <a
                        href={route('admin.import-cp.template')}
                        download
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 transition shrink-0"
                    >
                        <Download className="w-4 h-4" />
                        <span>Unduh Template CSV</span>
                    </a>
                </div>

                {/* Upload & Analyze Box */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        1. Unggah File Spreadsheet / CSV
                    </h2>

                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500 transition">
                        <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                        <label className="cursor-pointer">
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                                Pilih file CSV dari komputer
                            </span>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-slate-400 mt-1">
                            {file ? `File dipilih: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : 'Format yang didukung: .csv (UTF-8, pemisah koma), maks 5MB'}
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            disabled={!file || isAnalyzing}
                            onClick={handleAnalyze}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isAnalyzing ? 'Menganalisis Kolom & Validasi...' : 'Validasi & Preview Data'}</span>
                        </button>
                    </div>
                </div>

                {/* Preview Results Table */}
                {preview && (
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    2. Hasil Validasi Pra-Simpan
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Total: <strong>{preview.total_rows}</strong> baris | Valid:{' '}
                                    <span className="text-emerald-600 font-bold">{preview.valid_rows}</span> | Error:{' '}
                                    <span className="text-rose-600 font-bold">{preview.errors_count}</span> | Peringatan:{' '}
                                    <span className="text-amber-600 font-bold">{preview.warnings_count}</span>
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={preview.valid_rows === 0 || isSubmitting}
                                onClick={handleCommit}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 disabled:opacity-50 transition"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isSubmitting ? 'Menyimpan ke Database...' : `Simpan ${preview.valid_rows} Baris Valid Sebagai Draft`}</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase">
                                        <th className="p-3">Baris</th>
                                        <th className="p-3">Kode CP</th>
                                        <th className="p-3">Kurikulum & Mapel</th>
                                        <th className="p-3">Fase</th>
                                        <th className="p-3">Status Validasi</th>
                                        <th className="p-3">Catatan / Error</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {preview.preview_rows.map((r, i) => (
                                        <tr key={i} className={r.is_valid ? '' : 'bg-rose-50/40 dark:bg-rose-950/20'}>
                                            <td className="p-3 font-mono font-bold text-slate-500">#{r.row_number}</td>
                                            <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{r.data.cp_code}</td>
                                            <td className="p-3">
                                                <span className="font-semibold">{r.data.subject_code}</span> ({r.data.curriculum_code})
                                            </td>
                                            <td className="p-3 font-semibold">{r.data.phase_code}</td>
                                            <td className="p-3 whitespace-nowrap">
                                                {r.is_valid ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Siap
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Error
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-[11px]">
                                                {r.errors.length > 0 && (
                                                    <p className="text-rose-600 font-semibold">{r.errors.join(', ')}</p>
                                                )}
                                                {r.warnings.length > 0 && (
                                                    <p className="text-amber-600">{r.warnings.join(', ')}</p>
                                                )}
                                                {r.errors.length === 0 && r.warnings.length === 0 && (
                                                    <span className="text-slate-400">Valid</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
