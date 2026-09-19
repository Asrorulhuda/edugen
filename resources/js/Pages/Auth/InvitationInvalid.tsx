import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface Props {
    reason: string;
}

export default function InvitationInvalid({ reason }: Props) {
    return (
        <GuestLayout>
            <Head title="Undangan Tidak Valid - EduGen KBC" />

            <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Tautan Undangan Tidak Dapat Digunakan
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                        {reason}
                    </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 text-left">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Solusi yang dapat dilakukan:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Hubungi Administrator Sekolah / Madrasah Anda untuk mengirim ulang undangan baru.</li>
                        <li>Pastikan tautan yang Anda buka tidak terpotong saat disalin.</li>
                        <li>Jika sudah pernah mendaftar, silakan langsung masuk melalui halaman login.</li>
                    </ul>
                </div>

                <div className="pt-2">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Halaman Masuk
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
