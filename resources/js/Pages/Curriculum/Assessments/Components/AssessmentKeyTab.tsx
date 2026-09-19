import { AssessmentPackageDetail } from '../types';

interface Props {
    package: AssessmentPackageDetail;
}

export default function AssessmentKeyTab({ package: pkg }: Props) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-base font-bold uppercase tracking-wide">
                    KUNCI JAWABAN & PEDOMAN PENSKORAN
                </h2>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {pkg.title}
                </h3>
            </div>

            <div className="space-y-4">
                {pkg.questions.map((q) => (
                    <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                                Nomor {q.question_number} ({q.question_type})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                                Bobot: {q.score_weight}
                            </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                            {q.question_text}
                        </p>

                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                            <span className="font-bold mr-1">Kunci Jawaban:</span>
                            <span>{q.correct_answer || 'Terlampir pada pembahasan'}</span>
                        </div>

                        {q.explanation && (
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                <span className="font-bold block mb-0.5 text-slate-700 dark:text-slate-300">
                                    Pembahasan / Rubrik Penskoran:
                                </span>
                                <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
