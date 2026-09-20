<?php

namespace Database\Seeders;

use App\Models\ManualBankAccount;
use App\Models\PaymentGatewaySetting;
use App\Models\QrisSetting;
use Illuminate\Database\Seeder;

class PaymentSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Gateways
        PaymentGatewaySetting::updateOrCreate(
            ['gateway' => 'tripay'],
            [
                'name' => 'Tripay Payment Gateway',
                'environment' => env('TRIPAY_ENV', 'sandbox'),
                'api_key' => env('TRIPAY_API_KEY'),
                'private_key' => env('TRIPAY_PRIVATE_KEY'),
                'merchant_code' => env('TRIPAY_MERCHANT_CODE'),
                'is_active' => false,
            ]
        );

        PaymentGatewaySetting::updateOrCreate(
            ['gateway' => 'xendit'],
            [
                'name' => 'Xendit Payment Gateway',
                'environment' => env('XENDIT_ENV', 'sandbox'),
                'api_key' => env('XENDIT_SECRET_KEY'),
                'webhook_token' => env('XENDIT_WEBHOOK_TOKEN'),
                'is_active' => false,
            ]
        );

        // 2. Bank Accounts
        $banks = [
            [
                'bank_code' => 'BSI',
                'bank_name' => 'Bank Syariah Indonesia',
                'account_number' => '7188291034',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Syariah Terverifikasi',
                'is_active' => true,
                'order_index' => 1,
            ],
            [
                'bank_code' => 'BCA',
                'bank_name' => 'Bank Central Asia',
                'account_number' => '8040291823',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Transfer Otomatis',
                'is_active' => true,
                'order_index' => 2,
            ],
            [
                'bank_code' => 'MANDIRI',
                'bank_name' => 'Bank Mandiri',
                'account_number' => '1370019284729',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'BUMN Terpercaya',
                'is_active' => true,
                'order_index' => 3,
            ],
            [
                'bank_code' => 'BRI',
                'bank_name' => 'Bank Rakyat Indonesia',
                'account_number' => '034101002948301',
                'account_name' => 'PT EduGen Media Karakter',
                'badge' => 'Jangkauan Nusantara',
                'is_active' => true,
                'order_index' => 4,
            ],
        ];

        foreach ($banks as $b) {
            ManualBankAccount::updateOrCreate(
                ['bank_code' => $b['bank_code']],
                $b
            );
        }

        // 3. QRIS Setting
        QrisSetting::current();
    }
}
