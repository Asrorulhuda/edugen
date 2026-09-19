<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Katalog Paket Langganan SaaS
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->enum('client_model', ['INDIVIDUAL', 'INSTITUTION', 'BOTH'])->default('BOTH');
            $table->decimal('price', 12, 2)->default(0); // Rupiah
            $table->integer('duration_days')->default(30); // 30 hari / 365 hari
            $table->integer('max_seats')->default(1); // 1 untuk Guru Mandiri, N untuk Sekolah
            $table->integer('ai_generation_quota')->default(100); // Kuota generasi per periode
            $table->json('features'); // Fitur-fitur entitlement
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false);
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 2. Langganan Aktif Tenant
        Schema::create('tenant_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->cascadeOnDelete();
            $table->enum('status', ['TRIAL', 'ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'CANCELLED'])->default('TRIAL');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->integer('ai_quota_used')->default(0);
            $table->integer('ai_quota_limit')->default(100);
            $table->integer('seats_limit')->default(1);
            $table->boolean('auto_renew')->default(false);
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });

        // 3. Pesanan Pembayaran & Invoice (Manual Transfer, QRIS, Xendit, Tripay)
        Schema::create('payment_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique(); // e.g. INV-202609-0001
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->enum('payment_method', ['MANUAL_TRANSFER', 'MANUAL_QRIS', 'XENDIT', 'TRIPAY'])->default('MANUAL_TRANSFER');
            $table->string('payment_channel', 50)->nullable(); // e.g. BCA, BSI, MANDIRI, QRIS, GOPAY, OVO
            $table->enum('payment_status', ['PENDING', 'PENDING_REVIEW', 'PAID', 'FAILED', 'EXPIRED'])->default('PENDING');
            
            // Bukti transfer manual
            $table->string('payment_proof_path')->nullable();
            $table->text('payment_proof_notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();

            // Gateway reference
            $table->string('gateway_reference', 150)->nullable();
            $table->string('checkout_url', 255)->nullable();
            $table->json('gateway_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'payment_status']);
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
        Schema::dropIfExists('tenant_subscriptions');
        Schema::dropIfExists('subscription_plans');
    }
};
