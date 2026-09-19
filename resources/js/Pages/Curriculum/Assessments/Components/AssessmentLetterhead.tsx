import { Institution } from '../types';

interface Props {
    institution: Institution | null | undefined;
    curriculumCode: 'MERDEKA' | 'MADRASAH_KBC';
}

export default function AssessmentLetterhead({ institution, curriculumCode }: Props) {
    if (!institution) return null;

    return (
        <div className="mb-6 pb-4 border-b-2 border-black">
            {institution.header_style === 'FULL_IMAGE' && institution.letterhead_path ? (
                <img
                    src={`/storage/${institution.letterhead_path}`}
                    alt="Kop Surat"
                    className="w-full max-h-36 object-contain mx-auto"
                />
            ) : institution.header_style === 'TEXT_ONLY' ? (
                <div className="text-center font-serif">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                        {institution.effective_line_1 || institution.letterhead_line_1 || (curriculumCode === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA')}
                    </h4>
                    <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
                        {institution.letterhead_line_2 || institution.name || 'Satuan Pendidikan'}
                    </h2>
                    {institution.letterhead_line_3 && (
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
                            {institution.letterhead_line_3}
                        </h4>
                    )}
                    <p className="text-[11px] text-slate-600 font-sans mt-1">
                        {institution.effective_subtext || institution.letterhead_subtext}
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                        <img
                            src={
                                institution.effective_logo_url
                                || (institution.logo_path ? `/storage/${institution.logo_path}` : (
                                    curriculumCode === 'MERDEKA'
                                        ? '/images/logos/tutwuri.svg'
                                        : '/images/logos/kemenag.svg'
                                ))
                            }
                            alt="Logo Sekolah"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 text-center font-serif">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                            {institution.effective_line_1 || institution.letterhead_line_1 || (curriculumCode === 'MERDEKA' ? 'DINAS PENDIDIKAN DAN KEBUDAYAAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA')}
                        </h4>
                        <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
                            {institution.letterhead_line_2 || institution.name || 'Satuan Pendidikan'}
                        </h2>
                        {institution.letterhead_line_3 && (
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
                                {institution.letterhead_line_3}
                            </h4>
                        )}
                        <p className="text-[11px] text-slate-600 font-sans mt-1 leading-tight">
                            {institution.effective_subtext || institution.letterhead_subtext}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
