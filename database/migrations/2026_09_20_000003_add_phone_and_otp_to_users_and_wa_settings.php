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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 30)->nullable()->unique()->after('email');
            }
            if (!Schema::hasColumn('users', 'phone_verified_at')) {
                $table->timestamp('phone_verified_at')->nullable()->after('phone');
            }
        });

        Schema::table('wa_gateway_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('wa_gateway_settings', 'admin_notify_number')) {
                $table->string('admin_notify_number', 30)->nullable()->after('sender');
            }
            if (!Schema::hasColumn('wa_gateway_settings', 'notify_on_registration')) {
                $table->boolean('notify_on_registration')->default(true)->after('admin_notify_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone_verified_at')) {
                $table->dropColumn('phone_verified_at');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });

        Schema::table('wa_gateway_settings', function (Blueprint $table) {
            if (Schema::hasColumn('wa_gateway_settings', 'notify_on_registration')) {
                $table->dropColumn('notify_on_registration');
            }
            if (Schema::hasColumn('wa_gateway_settings', 'admin_notify_number')) {
                $table->dropColumn('admin_notify_number');
            }
        });
    }
};
