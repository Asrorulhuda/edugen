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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->enum('tenant_type', ['INDIVIDUAL', 'INSTITUTION'])->default('INDIVIDUAL');
            $table->foreignId('primary_admin_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED'])->default('TRIAL');
            $table->string('timezone')->default('Asia/Jakarta');
            $table->string('locale', 10)->default('id');
            $table->boolean('created_by_superadmin')->default(false);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add foreign key constraint to users table for last_active_tenant_id
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('last_active_tenant_id')->references('id')->on('tenants')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['last_active_tenant_id']);
        });

        Schema::dropIfExists('tenants');
    }
};
