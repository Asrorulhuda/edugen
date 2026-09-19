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
        Schema::create('ai_provider_settings', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->unique(); // gemini, grok, deepseek, openrouter
            $table->string('name');
            $table->text('api_key')->nullable();
            $table->string('model')->default('gemini-2.5-flash');
            $table->string('base_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->decimal('temperature', 3, 2)->default(0.40);
            $table->unsignedInteger('max_tokens')->default(4096);
            $table->timestamp('last_tested_at')->nullable();
            $table->string('last_test_status', 20)->nullable(); // SUCCESS, FAILED
            $table->text('last_test_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_provider_settings');
    }
};
