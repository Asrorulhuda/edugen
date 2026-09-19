import { AssessmentPackageDetail } from '../types';

interface Props {
    package: AssessmentPackageDetail;
}

export default function AssessmentMatrixTab({ package: pkg }: Props) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-base font-bold uppercase tracking-wide">
                    KISI-KISI ASESMEN PEMBELAJARAN (ASSESSMENT BLUEPRINT)
                </h2>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {pkg.title}
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-300 dark:border-slate-700">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center w-12">
                                No
                            </th>
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2">
                                Tujuan Pembelajaran (TP)
                            </th>
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2">
                                Indikator Soal
                            </th>
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center w-20">
                                Level
                            </th>
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center w-20">
                                Bentuk
                            </th>
                            <th className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center w-16">
                                Bobot
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pkg.matrices.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center font-bold">
                                    {m.question_number}
                                </td>
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2">
                                    {m.learningGoal ? (
                                        <div>
                                            <strong className="text-emerald-600 block">
                                                {m.learningGoal.code}
                                            </strong>
                                            <span className="line-clamp-2 text-slate-600 dark:text-slate-300">
                                                {m.learningGoal.pedagogical_description}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Umum / Tematik</span>
                                    )}
                                </td>
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2">
                                    {m.indicator_text}
                                </td>
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center">
                                    <span className="font-semibold text-blue-600 block">{m.bloom_level}</span>
                                    <span className="text-[10px] text-slate-400">{m.cognitive_tier}</span>
                                </td>
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center font-medium">
                                    {m.question_type}
                                </td>
                                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center font-bold">
                                    {m.score_weight}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
