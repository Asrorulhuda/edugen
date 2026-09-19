<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrder;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use App\Services\Billing\Adapters\ManualPaymentAdapter;
use App\Services\Billing\Adapters\TripayGatewayAdapter;
use App\Services\Billing\Adapters\XenditGatewayAdapter;
use App\Services\Billing\SubscriptionService;
use App\Services\TenantContext;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __construct(
        protected TenantContext $tenantContext,
        protected SubscriptionService $subscriptionService,
        protected ManualPaymentAdapter $manualAdapter,
        protected XenditGatewayAdapter $xenditAdapter,
        protected TripayGatewayAdapter $tripayAdapter
    ) {}

    /**
     * Show current subscription overview & upgrade options
     */
    public function index(): Response
    {
        $tenantId = $this->tenantContext->id();
        $tenant = $this->tenantContext->tenant();

        $activeSubscription = $this->subscriptionService->getActiveSubscription($tenantId);

        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        $recentOrders = PaymentOrder::with('plan')
            ->where('tenant_id', $tenantId)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Billing/Index', [
            'tenant' => $tenant,
            'activeSubscription' => $activeSubscription,
            'plans' => $plans,
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Show checkout page for a specific plan
     */
    public function checkout(SubscriptionPlan $plan): Response
    {
        $tenant = $this->tenantContext->tenant();
        $bankAccounts = $this->manualAdapter->getDestinationAccounts();
        $qrisDetails = $this->manualAdapter->getQrisDetails();

        return Inertia::render('Billing/Checkout', [
            'plan' => $plan,
            'tenant' => $tenant,
            'bankAccounts' => $bankAccounts,
            'qrisDetails' => $qrisDetails,
        ]);
    }

    /**
     * Create payment order and initiate gateway / manual invoice
     */
    public function storeOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subscription_plan_id' => ['required', 'exists:subscription_plans,id'],
            'payment_method' => ['required', 'in:MANUAL_TRANSFER,MANUAL_QRIS,XENDIT,TRIPAY'],
            'payment_channel' => ['nullable', 'string', 'max:50'],
        ]);

        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;
        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);

        // Generate unique order number (e.g. INV-202609-8392)
        $orderNumber = 'INV-' . date('Ym') . '-' . strtoupper(substr(uniqid(), -6));

        $order = PaymentOrder::create([
            'order_number' => $orderNumber,
            'tenant_id' => $tenantId,
            'user_id' => $userId,
            'subscription_plan_id' => $plan->id,
            'amount' => $plan->price,
            'payment_method' => $validated['payment_method'],
            'payment_channel' => $validated['payment_channel'] ?? null,
            'payment_status' => 'PENDING',
            'expired_at' => Carbon::now()->addHours(24),
        ]);

        // Process based on payment method
        if ($order->payment_method === 'XENDIT') {
            $gatewayRes = $this->xenditAdapter->createTransaction($order);
            $order->update([
                'gateway_reference' => $gatewayRes['gateway_reference'],
                'checkout_url' => $gatewayRes['checkout_url'],
                'gateway_response' => $gatewayRes['raw_response'] ?? null,
            ]);
        } elseif ($order->payment_method === 'TRIPAY') {
            $gatewayRes = $this->tripayAdapter->createTransaction($order);
            $order->update([
                'gateway_reference' => $gatewayRes['gateway_reference'],
                'checkout_url' => $gatewayRes['checkout_url'],
                'gateway_response' => $gatewayRes['raw_response'] ?? null,
            ]);
        } else {
            $manualRes = $this->manualAdapter->createTransaction($order);
            $order->update([
                'gateway_reference' => $manualRes['gateway_reference'],
                'checkout_url' => $manualRes['checkout_url'],
                'gateway_response' => $manualRes['raw_response'] ?? null,
            ]);
        }

        return redirect()->route('billing.invoice', $order->order_number)
            ->with('success', 'Pesanan langganan berhasil dibuat. Silakan selesaikan pembayaran.');
    }

    /**
     * Show official invoice and payment instruction
     */
    public function showInvoice(string $orderNumber): Response
    {
        $tenantId = $this->tenantContext->id();

        $order = PaymentOrder::with(['plan', 'tenant', 'user', 'verifier'])
            ->where('order_number', $orderNumber)
            ->where('tenant_id', $tenantId)
            ->firstOrFail();

        $bankAccounts = $this->manualAdapter->getDestinationAccounts();
        $qrisDetails = $this->manualAdapter->getQrisDetails();

        return Inertia::render('Billing/Invoice', [
            'order' => $order,
            'bankAccounts' => $bankAccounts,
            'qrisDetails' => $qrisDetails,
        ]);
    }

    /**
     * Upload payment proof for manual transfer / manual QRIS
     */
    public function uploadProof(string $orderNumber, Request $request): RedirectResponse
    {
        $tenantId = $this->tenantContext->id();

        $order = PaymentOrder::where('order_number', $orderNumber)
            ->where('tenant_id', $tenantId)
            ->firstOrFail();

        $validated = $request->validate([
            'payment_proof' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'payment_proof_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->update([
            'payment_proof_path' => $path,
            'payment_proof_notes' => $validated['payment_proof_notes'] ?? null,
            'payment_status' => 'PENDING_REVIEW',
        ]);

        return redirect()->route('billing.invoice', $order->order_number)
            ->with('success', 'Bukti pembayaran berhasil diunggah. Tim Super Admin akan segera memverifikasi dalam 1x24 jam.');
    }
}
