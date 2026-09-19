<?php

namespace App\Http\Controllers\Admin\Billing;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrder;
use App\Services\Billing\SubscriptionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBillingController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService
    ) {}

    /**
     * List all billing orders across all tenants
     */
    public function index(Request $request): Response
    {
        $query = PaymentOrder::with(['plan', 'tenant', 'user', 'verifier']);

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->input('payment_status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->input('payment_method'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                  ->orWhereHas('tenant', fn ($tq) => $tq->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        $stats = [
            'pending_review_count' => PaymentOrder::where('payment_status', 'PENDING_REVIEW')->count(),
            'total_paid_count' => PaymentOrder::where('payment_status', 'PAID')->count(),
            'total_revenue' => PaymentOrder::where('payment_status', 'PAID')->sum('amount'),
        ];

        return Inertia::render('Admin/Billing/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['payment_status', 'payment_method', 'search']),
        ]);
    }

    /**
     * Verify manual payment order (Approve or Reject)
     */
    public function verifyPayment(PaymentOrder $order, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:APPROVE,REJECT'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $adminId = $request->user()->id;

        if ($validated['action'] === 'APPROVE') {
            $order->update([
                'payment_status' => 'PAID',
                'verified_by' => $adminId,
                'verified_at' => Carbon::now(),
                'paid_at' => Carbon::now(),
                'notes' => $validated['notes'] ?? 'Diverifikasi manual oleh Super Admin',
            ]);

            $this->subscriptionService->activateSubscription($order);

            return redirect()->back()
                ->with('success', "Pembayaran pesanan {$order->order_number} berhasil diverifikasi dan langganan aktif!");
        } else {
            $order->update([
                'payment_status' => 'FAILED',
                'verified_by' => $adminId,
                'verified_at' => Carbon::now(),
                'notes' => $validated['notes'] ?? 'Bukti transfer tidak valid atau dana tidak masuk.',
            ]);

            return redirect()->back()
                ->with('error', "Pesanan {$order->order_number} telah ditolak.");
        }
    }
}
