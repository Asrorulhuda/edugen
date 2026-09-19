<?php

namespace Tests\Feature;

use App\Models\PaymentOrder;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BillingAndSubscriptionTest extends TestCase
{
    use DatabaseTransactions;

    protected User $teacher;
    protected User $superAdmin;
    protected Tenant $tenant;
    protected SubscriptionPlan $proPlan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $this->superAdmin = User::where('email', 'admin@edugen.id')->firstOrFail();
        $this->tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();
        $this->proPlan = SubscriptionPlan::where('slug', 'guru-mandiri-pro')->firstOrFail();

        Storage::fake('public');
    }

    public function test_user_can_view_billing_and_checkout_page()
    {
        $response = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('billing.index'));

        $response->assertStatus(200);

        $checkoutResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('billing.checkout', $this->proPlan->slug));

        $checkoutResponse->assertStatus(200);
    }

    public function test_user_can_create_order_and_upload_payment_proof()
    {
        // 1. Create Order
        $orderResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post(route('billing.order.store'), [
                'subscription_plan_id' => $this->proPlan->id,
                'payment_method' => 'MANUAL_TRANSFER',
                'payment_channel' => 'BSI',
            ]);

        $orderResponse->assertRedirect();

        $order = PaymentOrder::where('tenant_id', $this->tenant->id)
            ->where('subscription_plan_id', $this->proPlan->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($order);
        $this->assertEquals('PENDING', $order->payment_status);
        $this->assertEquals($this->proPlan->price, $order->amount);

        // 2. Upload Payment Proof
        $file = UploadedFile::fake()->image('bukti_transfer.jpg', 600, 800);

        $uploadResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post(route('billing.invoice.upload-proof', $order->order_number), [
                'payment_proof' => $file,
                'payment_proof_notes' => 'Transfer dari BSI atas nama Guru PAI',
            ]);

        $uploadResponse->assertRedirect(route('billing.invoice', $order->order_number));

        $order->refresh();
        $this->assertEquals('PENDING_REVIEW', $order->payment_status);
        $this->assertNotNull($order->payment_proof_path);
        Storage::disk('public')->assertExists($order->payment_proof_path);
    }

    public function test_superadmin_can_verify_and_activate_subscription()
    {
        // Create pending review order
        $order = PaymentOrder::create([
            'order_number' => 'INV-TEST-998811',
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->teacher->id,
            'subscription_plan_id' => $this->proPlan->id,
            'amount' => $this->proPlan->price,
            'payment_method' => 'MANUAL_TRANSFER',
            'payment_channel' => 'BSI',
            'payment_status' => 'PENDING_REVIEW',
            'payment_proof_path' => 'payment_proofs/test.jpg',
        ]);

        // Super admin approves payment
        $verifyResponse = $this->actingAs($this->superAdmin)
            ->post(route('admin.billing.verify', $order->id), [
                'action' => 'APPROVE',
                'notes' => 'Dana transfer telah masuk mutasi bank.',
            ]);

        $verifyResponse->assertRedirect();

        $order->refresh();
        $this->assertEquals('PAID', $order->payment_status);
        $this->assertEquals($this->superAdmin->id, $order->verified_by);
        $this->assertNotNull($order->paid_at);

        // Assert tenant has active subscription with plan limits
        $subscription = TenantSubscription::where('tenant_id', $this->tenant->id)
            ->where('subscription_plan_id', $this->proPlan->id)
            ->where('status', 'ACTIVE')
            ->latest('id')
            ->first();

        $this->assertNotNull($subscription);
        $this->assertEquals($this->proPlan->ai_generation_quota, $subscription->ai_quota_limit);
        $this->assertEquals(0, $subscription->ai_quota_used);
        $this->assertTrue($subscription->ends_at->isFuture());
    }

    public function test_payment_gateway_webhooks_activate_subscription()
    {
        // Create an unpaid Xendit order
        $order = PaymentOrder::create([
            'order_number' => 'INV-XENDIT-5544',
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->teacher->id,
            'subscription_plan_id' => $this->proPlan->id,
            'amount' => $this->proPlan->price,
            'payment_method' => 'XENDIT',
            'payment_status' => 'PENDING',
        ]);

        // Call Xendit Webhook
        $webhookResponse = $this->postJson(route('webhooks.xendit'), [
            'external_id' => $order->order_number,
            'status' => 'PAID',
            'paid_amount' => (int) $order->amount,
            'payment_method' => 'BANK_TRANSFER',
            'payment_channel' => 'BCA',
        ]);

        $webhookResponse->assertStatus(200);
        $webhookResponse->assertJson(['success' => true]);

        $order->refresh();
        $this->assertEquals('PAID', $order->payment_status);
        $this->assertNotNull($order->paid_at);

        // Assert subscription is activated
        $sub = TenantSubscription::where('tenant_id', $this->tenant->id)
            ->where('subscription_plan_id', $this->proPlan->id)
            ->where('status', 'ACTIVE')
            ->latest('id')
            ->first();

        $this->assertNotNull($sub);
    }
}
