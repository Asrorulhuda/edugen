<?php

namespace App\Services\Billing\Adapters;

use App\Models\PaymentOrder;
use Carbon\Carbon;

class ManualPaymentAdapter
{
    /**
     * Get list of official destination bank accounts for manual transfer
     */
    public function getDestinationAccounts(): array
    {
        $dbAccounts = \App\Models\ManualBankAccount::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        if ($dbAccounts->isNotEmpty()) {
            return $dbAccounts->map(fn ($b) => [
                'bank_code' => $b->bank_code,
                'bank_name' => $b->bank_name,
                'account_number' => $b->account_number,
                'account_name' => $b->account_name,
                'badge' => $b->badge,
            ])->toArray();
        }

        return [
            [
                'bank_code' => 'BSI',
                'bank_name' => 'Bank Syariah Indonesia',
                'account_number' => '7188291034',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Syariah Terverifikasi',
            ],
            [
                'bank_code' => 'BCA',
                'bank_name' => 'Bank Central Asia',
                'account_number' => '8040291823',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Transfer Otomatis',
            ],
            [
                'bank_code' => 'MANDIRI',
                'bank_name' => 'Bank Mandiri',
                'account_number' => '1370019284729',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'BUMN Terpercaya',
            ],
            [
                'bank_code' => 'BRI',
                'bank_name' => 'Bank Rakyat Indonesia',
                'account_number' => '034101002948301',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Jangkauan Nusantara',
            ],
        ];
    }

    /**
     * Get QRIS details for QRIS transfer
     */
    public function getQrisDetails(): array
    {
        $qris = \App\Models\QrisSetting::where('is_active', true)->first();

        if ($qris) {
            return [
                'merchant_name' => $qris->merchant_name,
                'nmid' => $qris->nmid,
                'qr_string' => $qris->qr_string,
                'support' => $qris->supported_apps,
            ];
        }

        return [
            'merchant_name' => 'EDUGEN INDONESIA',
            'nmid' => 'ID1020039281729',
            'qr_string' => '00020101021226580014ID.LINKAJA.WWW0118936009180000000000021500000000000000051440014ID.GO.QRIS.WWW0215ID10200392817290303UME5204581253033605802ID5919EDUGEN INDONESIA6007JAKARTA61051011062070703A01630489AB',
            'support' => 'BCA Mobile, Livin by Mandiri, BSI Mobile, BRImo, GoPay, OVO, Dana, ShopeePay, LinkAja',
        ];
    }

    /**
     * Create manual order transaction metadata
     */
    public function createTransaction(PaymentOrder $order): array
    {
        return [
            'success' => true,
            'gateway_reference' => 'MANUAL-' . $order->order_number,
            'checkout_url' => route('billing.invoice', $order->order_number),
            'expired_at' => Carbon::now()->addHours(48)->toIso8601String(),
            'raw_response' => [
                'type' => 'MANUAL',
                'instructions' => 'Silakan transfer tepat sejumlah nilai tagihan dan unggah bukti transfer.',
            ],
        ];
    }
}
