<?php

namespace App\Services\Billing;

use App\Models\PaymentOrder;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Create a payment transaction / invoice
     *
     * @return array{
     *   success: bool,
     *   gateway_reference: string,
     *   checkout_url: string|null,
     *   qr_string?: string|null,
     *   expired_at?: string|null,
     *   raw_response: array
     * }
     */
    public function createTransaction(PaymentOrder $order): array;

    /**
     * Verify incoming webhook notification from gateway
     *
     * @return array{
     *   valid: bool,
     *   order_number: string,
     *   status: 'PAID'|'FAILED'|'EXPIRED'|'PENDING',
     *   paid_at?: string|null,
     *   raw_data: array
     * }
     */
    public function verifyWebhook(Request $request): array;

    /**
     * Check transaction status on gateway
     */
    public function checkStatus(string $reference): array;
}
