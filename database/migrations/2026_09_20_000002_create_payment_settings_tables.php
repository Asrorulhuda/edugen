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
        // 1. Payment Gateway Settings (Tripay, Xendit, etc.)
        Schema::create('payment_gateway_settings', function (Blueprint $table) {
            $table->id();
            $table->string('gateway', 50)->unique(); // tripay, xendit
            $table->string('name', 100);
            $table->enum('environment', ['sandbox', 'production'])->default('sandbox');
            $table->text('api_key')->nullable();
            $table->text('private_key')->nullable(); // For Tripay
            $table->string('merchant_code', 100)->nullable(); // For Tripay
            $table->string('webhook_token', 255)->nullable();
            $table->boolean('is_active')->default(false);
            $table->json('config')->nullable();
            $table->timestamp('last_tested_at')->nullable();
            $table->string('last_test_status', 20)->nullable(); // SUCCESS, FAILED
            $table->text('last_test_message')->nullable();
            $table->timestamps();
        });

        // 2. Manual Bank Transfer Accounts
        Schema::create('manual_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('bank_code', 30); // BSI, BCA, MANDIRI, BRI, etc.
            $table->string('bank_name', 100);
            $table->string('account_number', 50);
            $table->string('account_name', 100);
            $table->string('badge', 50)->nullable(); // e.g. Syariah Terverifikasi, Transfer Otomatis
            $table->boolean('is_active')->default(true);
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 3. QRIS Configuration Setting
        Schema::create('qris_settings', function (Blueprint $table) {
            $table->id();
            $table->string('merchant_name', 100)->default('EDUGEN INDONESIA');
            $table->string('nmid', 50)->nullable();
            $table->text('qr_string')->nullable();
            $table->string('qr_image_path', 255)->nullable();
            $table->text('supported_apps')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qris_settings');
        Schema::dropIfExists('manual_bank_accounts');
        Schema::dropIfExists('payment_gateway_settings');
    }
};
