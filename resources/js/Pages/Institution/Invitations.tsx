import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Clock,
    Copy,
    KeyRound,
    Mail,
    MessageCircle,
    Phone,
    Plus,
    RefreshCw,
    School,
    Trash2,
    UserCheck,
    X,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface InvitationItem {
    id: number;
    email: string;
    phone?: string | null;
    otp_code?: string | null;
    role_name: string;
    invitation_url: string;
    expires_at: string;
    is_expired: boolean;
    is_accepted: boolean;
    accepted_at: string | null;
    inviter_name: string | null;
}

interface Props {
    invitations: InvitationItem[];
}

export default function Invitations({ invitations }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [copiedOtpId, setCopiedOtpId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        phone: '',
    });

    const handleCreateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('institution.invitations.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleCopyAll = (inv: InvitationItem) => {
        const text = `Halo Bapak/Ibu Guru,\nAnda diundang untuk bergabung ke ruang kerja sekolah resmi di platform EduGen KBC.\n\n🔗 Tautan Pendaftaran: ${inv.invitation_url}\n🔑 Kode OTP Verifikasi: ${inv.otp_code || '-'}\n\n*Tautan dan Kode OTP berlaku selama 7 hari.*`;
        navigator.clipboard.writeText(text);
        setCopiedId(inv.id);
        setTimeout(() => setCopiedId(null), 2500);
    };

    const handleCopyOtp = (id: number, otp: string) => {
        navigator.clipboard.writeText(otp);
        setCopiedOtpId(id);
        setTimeout(() => setCopiedOtpId(null), 2000);
    };

    const handleResend = (id: number, email: string) => {
        if (confirm(`Perbarui tautan & kode OTP undangan untuk ${email}? Masa berlaku akan diperpanjang 7 hari ke depan.`)) {
            router.post(route('institution.invitations.resend', id));
        }
    };

    const handleRevoke = (id: number, email: string) => {
        if (confirm(`Batalkan undangan untuk ${email}? Tautan dan kode OTP tidak akan bisa digunakan lagi.`)) {
            router.post(route('institution.invitations.destroy', id), { _method: 'delete' });
        }
    };

    const getWhatsAppShareUrl = (inv: InvitationItem) => {
        const text = encodeURIComponent(
            `Halo Bapak/Ibu Guru,\n\nAnda diundang untuk bergabung ke ruang kerja resmi sekolah di EduGen KBC.\n\n🔗 Tautan Pendaftaran: ${inv.invitation_url}\n🔑 Kode OTP Verifikasi: ${inv.otp_code || '-'}\n\nSilakan buka tautan di atas dan masukkan Kode OTP 6 digit tersebut untuk verifikasi akun.`
        );
        const phoneParam = inv.phone ? `phone=${inv.phone.startsWith('0') ? '62' + inv.phone.slice(1) : inv.phone}&` : '';
        return `https://api.whatsapp.com/send?${phoneParam}text=${text}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            <School className="w-4 h-4" />
                            Pengaturan Lembaga & Sekolah
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Undangan Dewan Guru & Kode OTP
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Undang guru ke ruang kerja sekolah dengan tautan registrasi dan kode OTP verifikasi aman.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Undangan Guru Baru
                    </button>
                </div>
            }
        >
            <Head title="Undangan Guru & OTP - Admin Sekolah" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    {invitations.length === 0 ? (
                        <div className="p-12 text-center">
                            <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Belum Ada Undangan Guru
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                Buat undangan untuk dewan guru sekolah Anda. Sistem otomatis membuat tautan registrasi dan Kode OTP verifikasi aman.
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                            >
                                <Plus className="w-4 h-4" />
                                Undang Guru Sekarang
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-5 py-3.5">Email & Kontak Guru</th>
                                        <th className="px-5 py-3.5">Kode OTP Verifikasi</th>
                                        <th className="px-5 py-3.5">Status Undangan</th>
                                        <th className="px-5 py-3.5">Masa Berlaku</th>
                                        <th className="px-5 py-3.5 text-right">Aksi & Berbagi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invitations.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                                        >
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span>{inv.email}</span>
                                                </div>
                                                {inv.phone && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-normal mt-0.5">
                                                        <Phone className="w-3 h-3 shrink-0" />
                                                        <span>WA: {inv.phone}</span>
                                                    </div>
                                                )}
                                                {inv.inviter_name && (
                                                    <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                                                        Diundang oleh: {inv.inviter_name}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {inv.otp_code ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                                                        <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                        <span className="font-mono font-bold tracking-widest text-indigo-700 dark:text-indigo-300">
                                                            {inv.otp_code}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyOtp(inv.id, inv.otp_code!)}
                                                            className="ml-1 text-indigo-400 hover:text-indigo-600 transition"
                                                            title="Salin Kode OTP"
                                                        >
                                                            {copiedOtpId === inv.id ? (
                                                                <Check className="w-3 h-3 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">-</span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {inv.is_accepted ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                        Diterima
                                                    </span>
                                                ) : inv.is_expired ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        Kedaluwarsa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Menunggu OTP
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-slate-500 text-[11px]">
                                                {inv.is_accepted
                                                    ? `Diterima: ${new Date(inv.accepted_at!).toLocaleDateString('id-ID')}`
                                                    : `Sampai: ${new Date(inv.expires_at).toLocaleDateString('id-ID')}`}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {!inv.is_accepted && !inv.is_expired && (
                                                        <>
                                                            {/* Salin Tautan & Kode OTP */}
                                                            <button
                                                                onClick={() => handleCopyAll(inv)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                                                                    copiedId === inv.id
                                                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                                                }`}
                                                                title="Salin Tautan dan Kode OTP"
                                                            >
                                                                {copiedId === inv.id ? (
                                                                    <>
                                                                        <Check className="w-3 h-3" />
                                                                        Tersalin!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="w-3 h-3" />
                                                                        Salin Link & OTP
                                                                    </>
                                                                )}
                                                            </button>

                                                            {/* Kirim via WhatsApp */}
                                                            <a
                                                                href={getWhatsAppShareUrl(inv)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                                                                title="Kirim Undangan & OTP via WhatsApp"
                                                            >
                                                                <MessageCircle className="w-3 h-3" />
                                                                <span>Kirim WA</span>
                                                            </a>
                                                        </>
                                                    )}

                                                    {!inv.is_accepted && (
                                                        <button
                                                            onClick={() => handleResend(inv.id, inv.email)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                            title="Perbarui Tautan & Generate OTP Baru"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {!inv.is_accepted && (
                                                        <button
                                                            onClick={() => handleRevoke(inv.id, inv.email)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                                                            title="Batalkan Undangan"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Kirim Undangan Guru Baru
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Alamat Email Guru <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama.guru@sekolah.sch.id"
                                    required
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nomor WhatsApp Guru (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                            </div>

                            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                                <p className="font-bold flex items-center gap-1.5">
                                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                                    Kode OTP Otomatis Dibuat
                                </p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                    Sistem akan otomatis menerbitkan Kode OTP 6-Digit unik yang wajib dimasukkan guru saat membuka link undangan.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs disabled:opacity-50"
                                >
                                    {processing ? 'Membuat...' : 'Buat Undangan & Generate OTP'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
