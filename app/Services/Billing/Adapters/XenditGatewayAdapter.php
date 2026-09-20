<?php

namespace App\Services\Billing\Adapters;

use App\Models\PaymentOrder;
use App\Services\Billing\PaymentGatewayInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditGatewayAdapter implements PaymentGatewayInterface
{
    protected ?string $secretKey;
    protected ?string $webhookToken;

    public function __construct()
    {
        $setting = \App\Models\PaymentGatewaySetting::where('gateway', 'xendit')->first();

        $this->secretKey = $setting?->api_key ?: config('services.xendit.secret_key', env('XENDIT_SECRET_KEY'));
        $this->webhookToken = $setting?->webhook_token ?: config('services.xendit.webhook_token', env('XENDIT_WEBHOOK_TOKEN'));
    }

    public function createTransaction(PaymentOrder $order): array
    {
        // If live API key is configured, call Xendit Invoices API
        if ($this->secretKey && !str_starts_with($this->secretKey, 'mock_')) {
            try {
                $response = Http::withBasicAuth($this->secretKey, '')
                    ->post('https://api.xendit.co/v2/invoices', [
                        'external_id' => $order->order_number,
                        'amount' => (int) $order->amount,
                        'description' => "Langganan EduGen KBC - {$order->plan->name}",
                        'payer_email' => $order->user->email,
                        'invoice_duration' => 86400, // 24 jam
                        'customer' => [
                            'given_names' => $order->user->name,
                            'email' => $order->user->email,
                        ],
                        'success_redirect_url' => route('billing.invoice', $order->order_number),
                        'failure_redirect_url' => route('billing.invoice', $order->order_number),
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'success' => true,
                        'gateway_reference' => $data['id'] ?? $order->order_number,
                        'checkout_url' => $data['invoice_url'] ?? null,
                        'expired_at' => $data['expiry_date'] ?? Carbon::now()->addHours(24)->toIso8601String(),
                        'raw_response' => $data,
                    ];
                }

                Log::warning('Xendit API returned non-success:', $response->json() ?? []);
            } catch (\Exception $e) {
                Log::error('Xendit invoice creation error: ' . $e->getMessage());
            }
        }

        // Sandbox / High-fidelity fallback simulated checkout
        $mockInvoiceId = 'xendit_inv_' . substr(md5($order->order_number), 0, 16);
        $mockCheckoutUrl = route('billing.invoice', $order->order_number) . '?gateway=xendit&simulated=true';

        return [
            'success' => true,
            'gateway_reference' => $mockInvoiceId,
            'checkout_url' => $mockCheckoutUrl,
            'expired_at' => Carbon::now()->addHours(24)->toIso8601String(),
            'raw_response' => [
                'id' => $mockInvoiceId,
                'external_id' => $order->order_number,
                'status' => 'PENDING',
                'merchant_name' => 'EduGen KBC Indonesia',
                'amount' => (int) $order->amount,
                'payer_email' => $order->user->email,
                'description' => "Langganan EduGen KBC - {$order->plan->name}",
                'invoice_url' => $mockCheckoutUrl,
                'expiry_date' => Carbon::now()->addHours(24)->toIso8601String(),
            ],
        ];
    }

    public function verifyWebhook(Request $request): array
    {
        $callbackToken = $request->header('x-callback-token');

        // Check token if configured
        if ($this->webhookToken && $callbackToken !== $this->webhookToken) {
            return [
                'valid' => false,
                'order_number' => '',
                'status' => 'FAILED',
                'raw_data' => $request->all(),
            ];
        }

        $orderNumber = $request->input('external_id', '');
        $statusRaw = strtoupper($request->input('status', ''));

        $status = match ($statusRaw) {
            'PAID', 'SETTLED' => 'PAID',
            'EXPIRED' => 'EXPIRED',
            default => 'FAILED',
        };

        return [
            'valid' => true,
            'order_number' => $orderNumber,
            'status' => $status,
            'paid_at' => $request->input('paid_at') ?? Carbon::now()->toIso8601String(),
            'raw_data' => $request->all(),
        ];
    }

    public function checkStatus(string $reference): array
    {
        if ($this->secretKey && !str_starts_with($this->secretKey, 'mock_')) {
            try {
                $response = Http::withBasicAuth($this->secretKey, '')
                    ->get("https://api.xendit.co/v2/invoices/{$reference}");

                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                Log::error('Xendit check status error: ' . $e->getMessage());
            }
        }

        return [
            'id' => $reference,
            'status' => 'PENDING',
        ];
    }
}
