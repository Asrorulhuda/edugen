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
        Schema::create('ai_generation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('feature_type', 50)->index(); // TP, ATP, MODUL_AJAR, BANK_SOAL, RUBRIK
            $table->string('provider', 50)->index(); // GEMINI, GROK, DEEPSEEK, OPENROUTER
            $table->string('model_name', 100);
            $table->integer('prompt_tokens')->default(0);
            $table->integer('completion_tokens')->default(0);
            $table->integer('total_tokens')->default(0);
            $table->integer('latency_ms')->default(0);
            $table->string('status', 30)->default('SUCCESS'); // SUCCESS, FAILED, TIMEOUT
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable(); // temperature, seed, finish_reason
            $table->timestamp('created_at')->useCurrent();

            $table->index(['tenant_id', 'created_at']);
            $table->index(['user_id', 'feature_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_generation_logs');
    }
};
