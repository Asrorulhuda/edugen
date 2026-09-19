import { AlertCircle, Check, Loader2, Sparkles } from 'lucide-react';
import { GoalItem, GradeItem, PhaseItem, SubjectItem } from '../types';

interface Props {
    curriculumCode: 'MERDEKA' | 'MADRASAH_KBC';
    setCurriculumCode: (code: 'MERDEKA' | 'MADRASAH_KBC') => void;
    subjectId: number | '';
    setSubjectId: (id: number | '') => void;
    phaseId: number | '';
    setPhaseId: (id: number | '') => void;
    gradeId: number | '';
    setGradeId: (id: number | '') => void;
    assessmentType: string;
    setAssessmentType: (type: string) => void;
    title: string;
    setTitle: (title: string) => void;
    durationMinutes: number;
    setDurationMinutes: (min: number) => void;
    teacherPreferences: string;
    setTeacherPreferences: (pref: string) => void;
    jmlPg: number;
    setJmlPg: (num: number) => void;
    jmlEssay: number;
    setJmlEssay: (num: number) => void;
    opsiPg: number;
    setOpsiPg: (num: number) => void;
    tingkat: string;
    setTingkat: (val: string) => void;
    berpikir: string;
    setBerpikir: (val: string) => void;
    imageCount: number;
    setImageCount: (val: number) => void;
    subjects: SubjectItem[];
    phases: PhaseItem[];
    filteredGrades: GradeItem[];
    availableGoals: GoalItem[];
    selectedGoalIds: number[];
    isLoadingGoals: boolean;
    isGenerating: boolean;
    generationError: string | null;
    handleSelectAllGoals: () => void;
    handleToggleGoal: (id: number) => void;
    handleGenerate: () => void;
}

export default function CreateAssessmentForm({
    curriculumCode,
    setCurriculumCode,
    subjectId,
    setSubjectId,
    phaseId,
    setPhaseId,
    gradeId,
    setGradeId,
    assessmentType,
    setAssessmentType,
    title,
    setTitle,
    durationMinutes,
    setDurationMinutes,
    teacherPreferences,
    setTeacherPreferences,
    jmlPg,
    setJmlPg,
    jmlEssay,
    setJmlEssay,
    opsiPg,
    setOpsiPg,
    tingkat,
    setTingkat,
    berpikir,
    setBerpikir,
    imageCount,
    setImageCount,
    subjects,
    phases,
    filteredGrades,
    availableGoals,
    selectedGoalIds,
    isLoadingGoals,
    isGenerating,
    generationError,
    handleSelectAllGoals,
    handleToggleGoal,
    handleGenerate,
}: Props) {
    return (
        <div className="space-y-6">
            {/* Step 1: Form Parameter */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">1</span>
                    Parameter Asesmen & Identitas Ujian
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Kurikulum <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={curriculumCode}
                            onChange={(e) => setCurriculumCode(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        >
                            <option value="MADRASAH_KBC">Kurikulum Madrasah KBC (KMA 1503/2025)</option>
                            <option value="MERDEKA">Kurikulum Merdeka (Kemendikbudristek)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Mata Pelajaran <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={subjectId}
                            onChange={(e) => setSubjectId(Number(e.target.value) || '')}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="">-- Pilih Mata Pelajaran --</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Fase Kurikulum <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={phaseId}
                            onChange={(e) => {
                                setPhaseId(Number(e.target.value) || '');
                                setGradeId('');
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="">-- Pilih Fase --</option>
                            {phases.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Rombel / Kelas <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={gradeId}
                            onChange={(e) => setGradeId(Number(e.target.value) || '')}
                            disabled={!phaseId}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                        >
                            <option value="">-- Pilih Kelas --</option>
                            {filteredGrades.map((g) => (
                                <option key={g.id} value={g.id}>Kelas {g.grade_number} ({g.name})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Tipe Asesmen <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        >
                            <option value="SUMATIF_LINGKUP_MATERI">Sumatif Lingkup Materi</option>
                            <option value="FORMATIF">Formatif (Kuis / Latihan Harian)</option>
                            <option value="SUMATIF_AKHIR_SEMESTER">Sumatif Akhir Semester (SAS)</option>
                            <option value="SUMATIF_AKHIR_FASE">Sumatif Akhir Fase (Ujian Sekolah)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Jumlah Soal PG <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={50}
                            value={jmlPg}
                            onChange={(e) => setJmlPg(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Jumlah Soal Essay
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={20}
                            value={jmlEssay}
                            onChange={(e) => setJmlEssay(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Pilihan Opsi PG
                        </label>
                        <select
                            value={opsiPg}
                            onChange={(e) => setOpsiPg(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value={3}>3 Pilihan (A, B, C)</option>
                            <option value={4}>4 Pilihan (A, B, C, D)</option>
                            <option value={5}>5 Pilihan (A, B, C, D, E)</option>
                        </select>
                    </div>
                </div>

                {/* Karakteristik Soal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Tingkat Kesulitan
                        </label>
                        <select
                            value={tingkat}
                            onChange={(e) => setTingkat(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="Campuran">Campuran (30% M, 50% S, 20% H)</option>
                            <option value="Mudah">Dominan Mudah</option>
                            <option value="Sedang">Dominan Sedang</option>
                            <option value="Sulit">Dominan Sulit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Tingkat Berpikir
                        </label>
                        <select
                            value={berpikir}
                            onChange={(e) => setBerpikir(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="Campuran">Campuran (Bloom C1 - C6)</option>
                            <option value="LOTS">LOTS (C1-C3)</option>
                            <option value="HOTS">HOTS (C4-C6)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Ilustrasi / Gambar Pendukung
                        </label>
                        <select
                            value={imageCount}
                            onChange={(e) => setImageCount(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value={0}>0 Soal (Murni Teks, Tanpa Gambar)</option>
                            <option value={1}>1 Butir Soal Bergambar</option>
                            <option value={2}>2 Butir Soal Bergambar</option>
                            <option value={3}>3 Butir Soal Bergambar</option>
                            <option value={5}>5 Butir Soal Bergambar</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Judul Naskah Asesmen <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Asesmen Sumatif Lingkup Materi: Merawat Ekosistem dan Karakter Peduli Lingkungan"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Alokasi Waktu (Menit)
                        </label>
                        <input
                            type="number"
                            min={10}
                            max={240}
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Petunjuk Tambahan Guru (Opsional)
                    </label>
                    <input
                        type="text"
                        value={teacherPreferences}
                        onChange={(e) => setTeacherPreferences(e.target.value)}
                        placeholder="Contoh: Berikan penekanan studi kasus daur ulang sampah dan nilai gotong royong."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Step 2: Pemilihan TP */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">2</span>
                        Pilih Tujuan Pembelajaran (TP) Acuan ({selectedGoalIds.length} Terpilih)
                    </h2>
                    {availableGoals.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSelectAllGoals}
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                            {selectedGoalIds.length === availableGoals.length ? 'Batalkan Semua' : 'Pilih Semua TP'}
                        </button>
                    )}
                </div>

                {isLoadingGoals ? (
                    <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Memuat TP dari database...
                    </div>
                ) : availableGoals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        Silakan pilih Mapel dan Fase di atas untuk menampilkan daftar Tujuan Pembelajaran yang tersedia.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                        {availableGoals.map((tp) => {
                            const isSelected = selectedGoalIds.includes(tp.id);
                            return (
                                <div
                                    key={tp.id}
                                    onClick={() => handleToggleGoal(tp.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                                        isSelected
                                            ? 'bg-emerald-50/70 border-emerald-500 dark:bg-emerald-950/30'
                                            : 'bg-slate-50/50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center text-white ${
                                        isSelected ? 'bg-emerald-600' : 'border border-slate-300 dark:border-slate-600'
                                    }`}>
                                        {isSelected && <Check className="w-3 h-3" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{tp.code}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{tp.bloom_level}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{tp.pedagogical_description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tombol Eksekusi AI */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        {selectedGoalIds.length > 0
                            ? `Siap merancang butir soal berdasarkan ${selectedGoalIds.length} Tujuan Pembelajaran.`
                            : 'Pilih minimal 1 TP di atas untuk melanjutkan perumusan.'}
                    </p>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating || selectedGoalIds.length === 0 || !title.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Hasilkan Bank Soal & Kisi-kisi (AI)
                    </button>
                </div>

                {generationError && (
                    <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{generationError}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
