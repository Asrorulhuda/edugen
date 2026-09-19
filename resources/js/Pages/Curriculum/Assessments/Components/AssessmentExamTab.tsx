import { AssessmentPackageDetail } from '../types';

interface Props {
    package: AssessmentPackageDetail;
    typeName: string;
}

export default function AssessmentExamTab({ package: pkg, typeName }: Props) {
    return (
        <div className="space-y-6">
            {/* Exam Title & Meta Box */}
            <div className="text-center mb-6">
                <h2 className="text-base font-bold uppercase tracking-wide">
                    NASKAH BUTIR SOAL {typeName}
                </h2>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {pkg.title}
                </h3>
            </div>

            {/* Student Fill-in Box */}
            <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-xs grid grid-cols-2 gap-y-2">
                <div>
                    <span className="font-semibold text-slate-500 mr-2">Mata Pelajaran:</span>
                    <span className="font-bold">{pkg.subject?.name}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-500 mr-2">Nama Siswa:</span>
                    <span>................................................</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-500 mr-2">Fase / Kelas:</span>
                    <span>{pkg.phase?.name} / Kelas {pkg.grade?.grade_number}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-500 mr-2">No. Absen:</span>
                    <span>................................................</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-500 mr-2">Alokasi Waktu:</span>
                    <span>{pkg.duration_minutes} Menit</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-500 mr-2">Hari / Tanggal:</span>
                    <span>................................................</span>
                </div>
            </div>

            {/* General Instructions */}
            {pkg.instructions && (
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Petunjuk Pengerjaan:
                    </span>
                    <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pkg.instructions}
                    </p>
                </div>
            )}

            {/* Questions */}
            <div className="space-y-6 pt-2">
                {pkg.questions.map((q) => (
                    <div key={q.id} className="text-xs pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                                {/* Question text */}
                                <div className="flex items-start gap-2">
                                    <span className="font-bold shrink-0">{q.question_number}.</span>
                                    <div className="flex-1 leading-relaxed">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {q.question_text}
                                        </p>

                                        {/* Options if PG */}
                                        {q.options_data && Object.keys(q.options_data).length > 0 && (
                                            <div className="space-y-2 mt-3 pl-1">
                                                {Object.entries(q.options_data).map(([optKey, optVal]) => (
                                                    <div key={optKey} className="flex items-start gap-2.5">
                                                        <span className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                                                            {optKey}
                                                        </span>
                                                        <span className="leading-relaxed text-slate-700 dark:text-slate-300 flex-1">{optVal}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Essay Blank Space */}
                                        {q.question_type === 'URAIAN' && (
                                            <div className="mt-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg h-24 flex items-center justify-center text-[11px] text-slate-400 print:h-28">
                                                [ Lembar Jawaban Uraian ]
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stimulus Image on the side */}
                            {q.image_path && (
                                <div className="w-full md:w-56 shrink-0 text-center md:text-right mt-1">
                                    <img
                                        src={q.image_path}
                                        alt={`Stimulus Soal ${q.question_number}`}
                                        className="max-h-48 max-w-full inline-block rounded-xl border border-slate-200 dark:border-slate-700 object-contain shadow-xs bg-white dark:bg-slate-900 p-1.5"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
