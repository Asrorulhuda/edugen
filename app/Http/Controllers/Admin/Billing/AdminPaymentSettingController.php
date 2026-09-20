<?php

namespace App\Http\Controllers\Admin\Billing;

use App\Http\Controllers\Controller;
use App\Models\ManualBankAccount;
use App\Models\PaymentGatewaySetting;
use App\Models\QrisSetting;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class AdminPaymentSettingController extends Controller
{
    /**
     * Display Payment Settings & Gateways configuration dashboard
     */
    public function index(): Response
    {
        $gateways = PaymentGatewaySetting::orderBy('id')->get();
        $bankAccounts = ManualBankAccount::orderBy('order_index')->get();
        $qrisSetting = QrisSetting::current();

        $webhookUrls = [
            'tripay' => url('/webhooks/tripay'),
            'xendit' => url('/webhooks/xendit'),
        ];

        return Inertia::render('Admin/PaymentSettings/Index', [
            'gateways' => $gateways,
            'bankAccounts' => $bankAccounts,
            'qrisSetting' => $qrisSetting,
            'webhookUrls' => $webhookUrls,
        ]);
    }

    /**
     * Update payment gateway credentials & settings
     */
    public function updateGateway(Request $request, string $gateway): RedirectResponse
    {
        $setting = PaymentGatewaySetting::where('gateway', $gateway)->firstOrFail();

        $validated = $request->validate([
            'environment' => ['required', 'in:sandbox,production'],
            'api_key' => ['nullable', 'string', 'max:500'],
            'private_key' => ['nullable', 'string', 'max:500'],
            'merchant_code' => ['nullable', 'string', 'max:100'],
            'webhook_token' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $setting->update($validated);

        return redirect()->back()
            ->with('success', "Pengaturan gateway {$setting->name} berhasil disimpan.");
    }

    /**
     * Live test connection for payment gateway API
     */
    public function testGateway(Request $request, string $gateway): JsonResponse
    {
        $setting = PaymentGatewaySetting::where('gateway', $gateway)->firstOrFail();

        $apiKey = $request->input('api_key') ?: $setting->api_key;
        $privateKey = $request->input('private_key') ?: $setting->private_key;
        $merchantCode = $request->input('merchant_code') ?: $setting->merchant_code;
        $env = $request->input('environment') ?: $setting->environment;

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'API Key masih kosong. Masukkan API Key sebelum melakukan tes.',
            ], 422);
        }

        try {
            if ($gateway === 'tripay') {
                $baseUrl = $env === 'production'
                    ? 'https://tripay.co.id/api'
                    : 'https://tripay.co.id/api-sandbox';

                $response = Http::withToken($apiKey)->timeout(10)->get("{$baseUrl}/merchant/payment-channel");
                $isSuccess = $response->successful();
                $msg = $isSuccess
                    ? 'Koneksi ke Tripay API berhasil! Akun merchant terverifikasi.'
                    : 'Respon Tripay gagal: ' . ($response->json('message') ?? 'HTTP ' . $response->status());
            } elseif ($gateway === 'xendit') {
                $response = Http::withBasicAuth($apiKey, '')->timeout(10)->get('https://api.xendit.co/balance');
                $isSuccess = $response->successful();
                $msg = $isSuccess
                    ? 'Koneksi ke Xendit API berhasil! Saldo akun terdeteksi.'
                    : 'Respon Xendit gagal: ' . ($response->json('message') ?? 'HTTP ' . $response->status());
            } else {
                return response()->json(['success' => false, 'message' => 'Gateway tidak didukung untuk live ping.'], 400);
            }

            $setting->update([
                'last_tested_at' => Carbon::now(),
                'last_test_status' => $isSuccess ? 'SUCCESS' : 'FAILED',
                'last_test_message' => $msg,
            ]);

            return response()->json([
                'success' => $isSuccess,
                'message' => $msg,
            ]);
        } catch (\Exception $e) {
            $setting->update([
                'last_tested_at' => Carbon::now(),
                'last_test_status' => 'FAILED',
                'last_test_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan koneksi ke server gateway: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new manual destination bank account
     */
    public function storeBank(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bank_code' => ['required', 'string', 'max:30'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'account_name' => ['required', 'string', 'max:100'],
            'badge' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'order_index' => ['nullable', 'integer'],
        ]);

        ManualBankAccount::create([
            'bank_code' => strtoupper($validated['bank_code']),
            'bank_name' => $validated['bank_name'],
            'account_number' => $validated['account_number'],
            'account_name' => $validated['account_name'],
            'badge' => $validated['badge'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order_index' => $validated['order_index'] ?? 0,
        ]);

        return redirect()->back()
            ->with('success', "Rekening bank {$validated['bank_name']} berhasil ditambahkan.");
    }

    /**
     * Update manual destination bank account
     */
    public function updateBank(Request $request, ManualBankAccount $bank): RedirectResponse
    {
        $validated = $request->validate([
            'bank_code' => ['required', 'string', 'max:30'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'account_name' => ['required', 'string', 'max:100'],
            'badge' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'order_index' => ['nullable', 'integer'],
        ]);

        $bank->update([
            'bank_code' => strtoupper($validated['bank_code']),
            'bank_name' => $validated['bank_name'],
            'account_number' => $validated['account_number'],
            'account_name' => $validated['account_name'],
            'badge' => $validated['badge'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order_index' => $validated['order_index'] ?? 0,
        ]);

        return redirect()->back()
            ->with('success', "Rekening {$bank->bank_name} berhasil diperbarui.");
    }

    /**
     * Delete manual destination bank account
     */
    public function destroyBank(ManualBankAccount $bank): RedirectResponse
    {
        $name = $bank->bank_name;
        $bank->delete();

        return redirect()->back()
            ->with('success', "Rekening {$name} berhasil dihapus.");
    }

    /**
     * Update QRIS settings
     */
    public function updateQris(Request $request): RedirectResponse
    {
        $qris = QrisSetting::current();

        $validated = $request->validate([
            'merchant_name' => ['required', 'string', 'max:100'],
            'nmid' => ['nullable', 'string', 'max:50'],
            'qr_string' => ['nullable', 'string'],
            'supported_apps' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $qris->update($validated);

        return redirect()->back()
            ->with('success', 'Pengaturan QRIS berhasil diperbarui.');
    }
}
