import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, BookOpen, Check, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    learningOutcome: {
        id: number;
        code: string;
        curriculum_code: string;
        regulation_id: number;
        subject_id: number;
        education_level_id?: number;
        phase_id: number;
        learning_element_id?: number;
        cp_text: string;
        source_locator?: string;
        source_page_start?: number;
        source_page_end?: number;
        version: number;
        status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
        notes?: string;
    } | null;
    curricula: Array<{ code: string; name: string }>;
    regulations: Array<{ id: number; code: string; title: string }>;
    subjects: Array<{
        id: number;
        code: string;
        name: string;
        elements: Array<{ id: number; subject_id: number; code: string; name: string }>;
    }>;
    phases: Array<{ id: number; code: string; name: string; level_summary: string }>;
    levels: Array<{ id: number; code: string; name: string }>;
}

export default function Form({
    learningOutcome,
    curricula,
    regulations,
    subjects,
    phases,
    levels,
}: Props) {
    const isEdit = !!learningOutcome;
    const isPublished = learningOutcome?.status === 'PUBLISHED';

    const { data, setData, post, processing, errors } = useForm({
        code: learningOutcome?.code || '',
        curriculum_code: learningOutcome?.curriculum_code || curricula[0]?.code || '',
        regulation_id: learningOutcome?.regulation_id || regulations[0]?.id || '',
        subject_id: learningOutcome?.subject_id || subjects[0]?.id || '',
        education_level_id: learningOutcome?.education_level_id || '',
        phase_id: learningOutcome?.phase_id || phases[0]?.id || '',
        learning_element_id: learningOutcome?.learning_element_id || '',
        cp_text: learningOutcome?.cp_text || '',
        source_locator: learningOutcome?.source_locator || '',
        source_page_start: learningOutcome?.source_page_start || '',
        source_page_end: learningOutcome?.source_page_end || '',
        notes: learningOutcome?.notes || '',
        change_reason: '',
    });

    const selectedSubjectObj = subjects.find((s) => s.id === Number(data.subject_id));
    const availableElements = selectedSubjectObj?.elements || [];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.learning-outcomes.update', learningOutcome.id));
        } else {
            post(route('admin.learning-outcomes.store'));
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
                            {isEdit ? `Edit CP [${learningOutcome.code}]` : 'Tambah Capaian Pembelajaran Baru'}
                        </h1>
                    </div>
                </div>
            }
        >
            <Head title={isEdit ? `Edit CP ${learningOutcome.code}` : 'Tambah CP'} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {isPublished && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex gap-3 text-xs">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Perhatian: Rekord CP Ini Telah Dipublikasikan (PUBLISHED v{learningOutcome.version})</p>
                            <p className="mt-1 text-amber-800 dark:text-amber-300">
                                Sesuai prinsip integritas regulasi dokumen resmi, perubahan pada CP yang telah terbit akan secara otomatis membuat <strong>Versi Baru (v{learningOutcome.version + 1})</strong> berstatus DRAFT. Versi sebelumnya tetap tersimpan secara permanen untuk arsip dokumen yang telah dibuat guru.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    {/* Top Row: Code & Curriculum */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kode Unik CP <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Contoh: CP-BIN-FA-01"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.code && <p className="text-rose-500 text-[11px] mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kerangka Kurikulum <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.curriculum_code}
                                onChange={(e) => setData('curriculum_code', e.target.value)}
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                {curricula.map((c) => (
                                    <option key={c.code} value={c.code}>{c.name}</option>
                                ))}
                            </select>
                            {errors.curriculum_code && <p className="text-rose-500 text-[11px] mt-1">{errors.curriculum_code}</p>}
                        </div>
                    </div>

                    {/* Regulation Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Regulasi Rujukan Resmi <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.regulation_id}
                            onChange={(e) => setData('regulation_id', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        >
                            {regulations.map((r) => (
                                <option key={r.id} value={r.id}>
                                    [{r.code}] {r.title}
                                </option>
                            ))}
                        </select>
                        {errors.regulation_id && <p className="text-rose-500 text-[11px] mt-1">{errors.regulation_id}</p>}
                    </div>

                    {/* Subject, Phase, Element */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Mata Pelajaran <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.subject_id}
                                onChange={(e) => {
                                    setData((prev) => ({
                                        ...prev,
                                        subject_id: e.target.value,
                                        learning_element_id: '', // Reset element on subject change
                                    }));
                                }}
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                            {errors.subject_id && <p className="text-rose-500 text-[11px] mt-1">{errors.subject_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Fase Kurikulum <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.phase_id}
                                onChange={(e) => setData('phase_id', e.target.value)}
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                {phases.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.level_summary})</option>
                                ))}
                            </select>
                            {errors.phase_id && <p className="text-rose-500 text-[11px] mt-1">{errors.phase_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Elemen Pembelajaran
                            </label>
                            <select
                                value={data.learning_element_id}
                                onChange={(e) => setData('learning_element_id', e.target.value)}
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Tanpa Elemen / Umum</option>
                                {availableElements.map((el) => (
                                    <option key={el.id} value={el.id}>{el.name}</option>
                                ))}
                            </select>
                            {errors.learning_element_id && <p className="text-rose-500 text-[11px] mt-1">{errors.learning_element_id}</p>}
                        </div>
                    </div>

                    {/* Official CP Text */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Teks Lengkap Capaian Pembelajaran Resmi <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows={6}
                            value={data.cp_text}
                            onChange={(e) => setData('cp_text', e.target.value)}
                            placeholder="Salin atau ketik teks resmi Capaian Pembelajaran persis seperti yang tertulis dalam keputusan regulasi resmi..."
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.cp_text && <p className="text-rose-500 text-[11px] mt-1">{errors.cp_text}</p>}
                        <p className="text-[11px] text-slate-400 mt-1">
                            Panjang karakter: {data.cp_text.length}. Sistem akan menghitung SHA-256 Checksum secara otomatis untuk verifikasi integritas data.
                        </p>
                    </div>

                    {/* Source Locator Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Source Locator / Rujukan
                            </label>
                            <input
                                type="text"
                                value={data.source_locator}
                                onChange={(e) => setData('source_locator', e.target.value)}
                                placeholder="Contoh: BSKAP 046/2025 Hal. 48"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Halaman Awal
                            </label>
                            <input
                                type="number"
                                value={data.source_page_start}
                                onChange={(e) => setData('source_page_start', e.target.value)}
                                placeholder="48"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Halaman Akhir
                            </label>
                            <input
                                type="number"
                                value={data.source_page_end}
                                onChange={(e) => setData('source_page_end', e.target.value)}
                                placeholder="49"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Change Reason for Published CP */}
                    {isPublished && (
                        <div>
                            <label className="block text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                                Alasan Perubahan / Revisi Versi <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.change_reason}
                                onChange={(e) => setData('change_reason', e.target.value)}
                                placeholder="Contoh: Penyesuaian kata hubung sesuai surat edaran BSKAP No..."
                                className="w-full text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                            />
                            {errors.change_reason && <p className="text-rose-500 text-[11px] mt-1">{errors.change_reason}</p>}
                        </div>
                    )}

                    {/* Internal Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Catatan Internal Verifikasi
                        </label>
                        <input
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Catatan verifikator mengenai naskah..."
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href={route('admin.learning-outcomes.index')}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isPublished ? 'Simpan Sebagai Versi Baru (Draft)' : isEdit ? 'Simpan Perubahan Draft' : 'Simpan Sebagai Draft'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
