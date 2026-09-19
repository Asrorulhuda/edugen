import QuestionEditorItem, { AssessmentItemData } from '@/Components/Curriculum/Assessments/QuestionEditorItem';
import { Save } from 'lucide-react';
import { GoalItem } from '../types';

interface GeneratedPackageData {
    title: string;
    instructions: string;
    duration_minutes: number;
    items: AssessmentItemData[];
}

interface Props {
    generatedData: GeneratedPackageData;
    instructions: string;
    setInstructions: (val: string) => void;
    availableGoals: GoalItem[];
    uploadingImageIndex: number | null;
    handleSave: (status: 'DRAFT' | 'FINAL') => void;
    updateItem: (index: number, field: any, value: any) => void;
    updateOption: (index: number, key: string, value: string) => void;
    addOptionToItem: (index: number) => void;
    removeOptionFromItem: (index: number, key: string) => void;
    removeItem: (index: number) => void;
    moveItem: (index: number, direction: 'up' | 'down') => void;
    handleImageUpload: (file: File, index: number) => Promise<void>;
}

export default function CreateAssessmentReview({
    generatedData,
    instructions,
    setInstructions,
    availableGoals,
    uploadingImageIndex,
    handleSave,
    updateItem,
    updateOption,
    addOptionToItem,
    removeOptionFromItem,
    removeItem,
    moveItem,
    handleImageUpload,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hasil Telaah AI</span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{generatedData.title}</h2>
                    <p className="text-xs text-slate-500">{generatedData.items.length} butir soal siap disunting dan disimpan ke Bank Soal.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleSave('DRAFT')}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                    >
                        Simpan Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSave('FINAL')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                        <Save className="w-4 h-4" />
                        Finalisasi & Siap Cetak
                    </button>
                </div>
            </div>

            {/* Petunjuk Soal */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Petunjuk Pengerjaan Soal Siswa</label>
                <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {/* Butir-butir Soal dengan QuestionEditorItem */}
            <div className="space-y-4">
                {generatedData.items.map((item, idx) => (
                    <QuestionEditorItem
                        key={`gen-item-${item.question_number}-${idx}`}
                        item={item}
                        index={idx}
                        totalItems={generatedData.items.length}
                        learningGoals={availableGoals}
                        onUpdateField={(field, val) => updateItem(idx, field, val)}
                        onUpdateOption={(key, val) => updateOption(idx, key, val)}
                        onAddOption={() => addOptionToItem(idx)}
                        onRemoveOption={(key) => removeOptionFromItem(idx, key)}
                        onRemoveItem={() => removeItem(idx)}
                        onMoveUp={() => moveItem(idx, 'up')}
                        onMoveDown={() => moveItem(idx, 'down')}
                        onUploadImage={(file) => handleImageUpload(file, idx)}
                        isUploadingImage={uploadingImageIndex === idx}
                    />
                ))}
            </div>
        </div>
    );
}
