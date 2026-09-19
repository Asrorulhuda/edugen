<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrder;
use App\Services\Billing\Adapters\TripayGatewayAdapter;
use App\Services\Billing\Adapters\XenditGatewayAdapter;
use App\Services\Billing\SubscriptionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GatewayWebhookController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService,
        protected XenditGatewayAdapter $xenditAdapter,
        protected TripayGatewayAdapter $tripayAdapter
    ) {}

    /**
     * Handle Xendit Webhook callback
     */
    public function xendit(Request $request): JsonResponse
    {
        Log::info('Incoming Xendit Webhook:', $request->all());

        $verified = $this->xenditAdapter->verifyWebhook($request);

        if (!$verified['valid']) {
            return response()->json(['success' => false, 'message' => 'Invalid webhook token'], 401);
        }

        $order = PaymentOrder::where('order_number', $verified['order_number'])->first();

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($verified['status'] === 'PAID' && $order->payment_status !== 'PAID') {
            $order->update([
                'payment_status' => 'PAID',
                'paid_at' => Carbon::now(),
                'gateway_response' => array_merge($order->gateway_response ?? [], $verified['raw_data']),
            ]);

            $this->subscriptionService->activateSubscription($order);
        } elseif ($verified['status'] === 'EXPIRED') {
            $order->update(['payment_status' => 'EXPIRED']);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Handle Tripay Webhook callback
     */
    public function tripay(Request $request): JsonResponse
    {
        Log::info('Incoming Tripay Webhook:', $request->all());

        $verified = $this->tripayAdapter->verifyWebhook($request);

        if (!$verified['valid']) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 400);
        }

        $order = PaymentOrder::where('order_number', $verified['order_number'])->first();

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($verified['status'] === 'PAID' && $order->payment_status !== 'PAID') {
            $order->update([
                'payment_status' => 'PAID',
                'paid_at' => Carbon::now(),
                'gateway_response' => array_merge($order->gateway_response ?? [], $verified['raw_data']),
            ]);

            $this->subscriptionService->activateSubscription($order);
        } elseif ($verified['status'] === 'EXPIRED') {
            $order->update(['payment_status' => 'EXPIRED']);
        }

        return response()->json(['success' => true]);
    }
}
