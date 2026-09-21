import React from 'react';
import { useForm } from '@inertiajs/react';
import { QrCode, Sparkles, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';

export interface QrisData {
    id?: number;
    merchant_name: string;
    nmid?: string | null;
    qr_string?: string | null;
    supported_apps?: string | null;
    is_active: boolean;
}

interface Props {
    qrisSetting: QrisData;
}

export default function QrisSection({ qrisSetting }: Props) {
    const { data, setData, post, processing } = useForm({
        merchant_name: qrisSetting.merchant_name || 'EDUGEN INDONESIA',
        nmid: qrisSetting.nmid || '',
        qr_string: qrisSetting.qr_string || '',
        supported_apps: qrisSetting.supported_apps || 'BCA Mobile, Livin Mandiri, BSI Mobile, BRImo, GoPay, OVO, Dana, ShopeePay, LinkAja',
        is_active: Boolean(qrisSetting.is_active),
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.payment-settings.qris.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-600 font-bold">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            Konfigurasi QRIS Standar Bank Indonesia
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pengaturan QRIS statis/manual untuk pembayaran instan via e-wallet dan seluruh mobile banking
                        </p>
                    </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Form */}
                <form onSubmit={handleSave} className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                Nama Merchant (Tampil di QRIS)
                            </label>
                            <input
                                type="text"
                                value={data.merchant_name}
                                onChange={(e) => setData('merchant_name', e.target.value)}
                                placeholder="Contoh: EDUGEN INDONESIA"
                                required
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                NMID (National Merchant ID)
                            </label>
                            <input
                                type="text"
                                value={data.nmid}
                                onChange={(e) => setData('nmid', e.target.value)}
                                placeholder="Contoh: ID1020039281729"
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            Payload String QRIS (Format EMVCo Standar Bank Indonesia)
                        </label>
                        <textarea
                            rows={3}
                            value={data.qr_string}
                            onChange={(e) => setData('qr_string', e.target.value)}
                            placeholder="00020101021226580014ID.LINKAJA.WWW0118936009180000000000021500000000000000051440014ID.GO.QRIS..."
                            className="w-full font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                            String payload ini akan secara otomatis di-generate menjadi barcode QR pada invoice pelanggan.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            Daftar Aplikasi E-Wallet & Mobile Banking yang Didukung
                        </label>
                        <input
                            type="text"
                            value={data.supported_apps}
                            onChange={(e) => setData('supported_apps', e.target.value)}
                            placeholder="BCA Mobile, Livin Mandiri, BSI Mobile, BRImo, GoPay, OVO, Dana..."
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan QRIS'}
                        </button>
                    </div>
                </form>

                {/* Right: Mockup Card Preview */}
                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center text-center space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Pratinjau QRIS di Invoice Pelanggan
                    </span>

                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                        <QrCode className="w-28 h-28 text-slate-900" />
                    </div>

                    <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                            {data.merchant_name || 'MERCHANT QRIS'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            NMID: {data.nmid || 'IDxxxxxxxxxxxxx'}
                        </div>
                    </div>

                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>QRIS Standar Nasional (ASPI & BI)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
