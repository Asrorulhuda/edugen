import React, { useRef } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Image as ImageIcon,
    Loader2,
    Plus,
    Trash2,
    Upload,
} from 'lucide-react';

export interface AssessmentItemData {
    question_number: number;
    learning_goal_id?: number | null;
    indicator_text: string;
    bloom_level: string;
    cognitive_tier: string;
    difficulty_level: 'MUDAH' | 'SEDANG' | 'SULIT';
    question_type: string;
    score_weight: number;
    stimulus_text?: string | null;
    image_prompt?: string | null;
    image_path?: string | null;
    question_text: string;
    options_data?: Record<string, string> | null;
    correct_answer: string;
    explanation?: string | null;
}

export interface GoalOption {
    id: number;
    code: string;
    pedagogical_description?: string;
}

interface Props {
    item: AssessmentItemData;
    index: number;
    totalItems: number;
    learningGoals?: GoalOption[];
    onUpdateField: <K extends keyof AssessmentItemData>(field: K, value: AssessmentItemData[K]) => void;
    onUpdateOption: (key: string, value: string) => void;
    onAddOption?: () => void;
    onRemoveOption?: (key: string) => void;
    onRemoveItem: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onUploadImage: (file: File) => Promise<void>;
    isUploadingImage?: boolean;
}

export default function QuestionEditorItem({
    item,
    index,
    totalItems,
    learningGoals = [],
    onUpdateField,
    onUpdateOption,
    onAddOption,
    onRemoveOption,
    onRemoveItem,
    onMoveUp,
    onMoveDown,
    onUploadImage,
    isUploadingImage = false,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copiedPrompt, setCopiedPrompt] = React.useState(false);

    const handleCopyPrompt = () => {
        if (!item.image_prompt) return;
        navigator.clipboard.writeText(item.image_prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    };

    const isPg = item.question_type === 'PG' || item.question_type === 'PG_KOMPLEKS';
    const optionKeys = item.options_data ? Object.keys(item.options_data).sort() : ['A', 'B', 'C', 'D'];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
            {/* Header Butir Soal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
                        {item.question_number}
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Butir Soal #{item.question_number}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPg
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                                    : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                            }`}>
                                {item.question_type}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {item.bloom_level} • {item.cognitive_tier}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {onMoveUp && (
                        <button
                            type="button"
                            onClick={onMoveUp}
                            disabled={index === 0}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-200 dark:border-slate-700"
                            title="Geser Ke Atas"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}
                    {onMoveDown && (
                        <button
                            type="button"
                            onClick={onMoveDown}
                            disabled={index === totalItems - 1}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-200 dark:border-slate-700"
                            title="Geser Ke Bawah"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onRemoveItem}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-300 transition"
                        title="Hapus Butir Soal Ini"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                {/* 1. POKOK SOAL / PERTANYAAN LANGSUNG */}
                <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                        Teks Pokok Soal (Deskripsi Kasus & Kalimat Pertanyaan) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={item.question_text}
                        onChange={(e) => onUpdateField('question_text', e.target.value)}
                        placeholder="Rumuskan pokok soal secara lengkap dan komprehensif, memuat deskripsi kasus kontekstual (2-4 kalimat) dan kalimat pertanyaan/instruksi..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                    />
                </div>

                {/* 2. STIMULUS GAMBAR / PROMPT GAMBAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                            <span>Gambar / Diagram Soal</span>
                            {item.image_path && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateField('image_path', null)}
                                    className="text-[10px] text-rose-500 hover:underline"
                                >
                                    Hapus Gambar
                                </button>
                            )}
                        </label>

                        {item.image_path ? (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 max-h-40 flex items-center justify-center p-2">
                                <img
                                    src={item.image_path}
                                    alt={`Soal ${item.question_number}`}
                                    className="max-h-36 object-contain rounded-lg"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-[10px] font-bold rounded-lg shadow-xs hover:bg-white"
                                    >
                                        Ganti Gambar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition bg-white dark:bg-slate-900"
                            >
                                {isUploadingImage ? (
                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> Mengunggah gambar...
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 mx-auto flex items-center justify-center">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                            Klik untuk unggah gambar ilustrasi
                                        </p>
                                        <p className="text-[10px] text-slate-400">PNG, JPG, WEBP (Maksimal 5MB)</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUploadImage(file);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                            <span>Prompt AI Pembuat Gambar Visual</span>
                            {item.image_prompt && (
                                <button
                                    type="button"
                                    onClick={handleCopyPrompt}
                                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                                >
                                    <Copy className="w-3 h-3" />
                                    {copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}
                                </button>
                            )}
                        </label>
                        <textarea
                            rows={3}
                            value={item.image_prompt || ''}
                            onChange={(e) => onUpdateField('image_prompt', e.target.value)}
                            placeholder="Prompt deskripsi visual untuk disalin ke AI image generator (misal: 'Diagram alur daur air lengkap dengan keterangan presipitasi...')"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                        />
                    </div>
                </div>

                {/* 2. PILIHAN JAWABAN (JIKA PG) */}
                {isPg && (
                    <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Opsi Pilihan Jawaban (Tandai huruf opsi untuk Kunci Jawaban Benar) <span className="text-rose-500">*</span>
                            </label>
                            {onAddOption && optionKeys.length < 5 && (
                                <button
                                    type="button"
                                    onClick={onAddOption}
                                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Tambah Opsi
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            {optionKeys.map((key) => {
                                const isCorrect = item.correct_answer?.trim().toUpperCase() === key;
                                const val = item.options_data ? item.options_data[key] || '' : '';

                                return (
                                    <div
                                        key={key}
                                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition ${
                                            isCorrect
                                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onUpdateField('correct_answer', key)}
                                            className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition mt-0.5 ${
                                                isCorrect
                                                    ? 'bg-emerald-600 text-white shadow-xs'
                                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                                            }`}
                                            title="Klik untuk jadikan kunci jawaban"
                                        >
                                            {key}
                                        </button>
                                        <textarea
                                            rows={2}
                                            value={val}
                                            onChange={(e) => onUpdateOption(key, e.target.value)}
                                            placeholder={`Uraian substantif pilihan jawaban ${key}...`}
                                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-y leading-relaxed"
                                        />
                                        {onRemoveOption && optionKeys.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => onRemoveOption(key)}
                                                className="p-1 text-slate-400 hover:text-rose-500 rounded-md mt-1"
                                                title="Hapus opsi ini"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* KUNCI JAWABAN URAIAN (JIKA BUKAN PG) */}
                {!isPg && (
                    <div>
                        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                            Kunci Jawaban / Pedoman Penskoran Uraian <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={item.correct_answer || ''}
                            onChange={(e) => onUpdateField('correct_answer', e.target.value)}
                            placeholder="Tuliskan kunci jawaban dan pedoman kriteria skor untuk soal uraian ini..."
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-medium"
                        />
                    </div>
                )}

                {/* 5. PEMBAHASAN & TELAAH PEDAGOGIS */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Pembahasan & Telaah Kunci Jawaban
                    </label>
                    <textarea
                        rows={2}
                        value={item.explanation || ''}
                        onChange={(e) => onUpdateField('explanation', e.target.value)}
                        placeholder="Penjelasan rinci mengapa jawaban tersebut benar berdasarkan fakta/konsep pada wacana..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* 6. METADATA KISI-KISI & ASESMEN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="lg:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Indikator Soal
                        </label>
                        <input
                            type="text"
                            value={item.indicator_text}
                            onChange={(e) => onUpdateField('indicator_text', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Tingkat Kesulitan
                        </label>
                        <select
                            value={item.difficulty_level}
                            onChange={(e) => onUpdateField('difficulty_level', e.target.value as any)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="MUDAH">Mudah</option>
                            <option value="SEDANG">Sedang</option>
                            <option value="SULIT">Sulit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Level Kognitif
                        </label>
                        <select
                            value={item.bloom_level}
                            onChange={(e) => onUpdateField('bloom_level', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="C1">C1 - Mengingat</option>
                            <option value="C2">C2 - Memahami</option>
                            <option value="C3">C3 - Menerapkan</option>
                            <option value="C4">C4 - Menganalisis</option>
                            <option value="C5">C5 - Mengevaluasi</option>
                            <option value="C6">C6 - Mencipta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Bobot Nilai / Skor
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={item.score_weight}
                            onChange={(e) => onUpdateField('score_weight', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
