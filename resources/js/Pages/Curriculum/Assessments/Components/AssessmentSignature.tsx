import { AssessmentPackageDetail, Institution } from '../types';

interface Props {
    institution: Institution | null | undefined;
    package: AssessmentPackageDetail;
}

export default function AssessmentSignature({ institution, package: pkg }: Props) {
    const signatureCity = institution?.signature_city || institution?.city || 'Jakarta';
    const signatureDate = new Date(pkg.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 text-xs text-center font-serif">
            <div>
                <p className="text-slate-600 dark:text-slate-400 mb-16">
                    Mengetahui,<br />
                    <span className="font-bold">{institution?.signature_title || 'Kepala Madrasah / Sekolah'}</span>
                </p>
                <p className="font-bold underline uppercase">
                    {institution?.principal_name || '( ..................................................... )'}
                </p>
                <p className="text-slate-500 text-[11px]">NIP. {institution?.principal_id_number || '-'}</p>
            </div>

            <div>
                <p className="text-slate-600 dark:text-slate-400 mb-16">
                    {signatureCity}, {signatureDate}<br />
                    <span className="font-bold">Guru Pengampu / Penyusun</span>
                </p>
                <p className="font-bold underline uppercase">
                    {pkg.user?.name || '.....................................'}
                </p>
                <p className="text-slate-500 text-[11px]">
                    NIP. {pkg.user?.teacherProfiles?.[0]?.nip || '-'}
                </p>
            </div>
        </div>
    );
}
