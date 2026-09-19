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
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('SCHOOL'); // SCHOOL, MADRASAH, RA, MI, MTS, MA, MAK, SD, SMP, SMA, SMK
            $table->string('npsn')->nullable()->index();
            $table->string('nsm')->nullable()->index();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('letterhead_path')->nullable();
            $table->string('principal_name')->nullable();
            $table->string('principal_id_number')->nullable(); // NIP/NUPTK Kepala Sekolah
            $table->string('default_curriculum_mode')->default('MERDEKA'); // MERDEKA, K13, KTSP, DEEP_LEARNING
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
