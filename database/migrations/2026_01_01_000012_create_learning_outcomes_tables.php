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
        // 1. Learning Outcomes (Master Capaian Pembelajaran)
        Schema::create('learning_outcomes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->index(); // CP-BIN-FA-01
            $table->string('curriculum_code', 30);
            $table->foreignId('regulation_id')->constrained('regulations')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('education_level_id')->nullable()->constrained('education_levels')->nullOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('learning_element_id')->nullable()->constrained('learning_elements')->nullOnDelete();
            $table->longText('cp_text'); // Official text
            $table->string('source_locator')->nullable(); // e.g. BSKAP 046/2025 Halaman 48
            $table->integer('source_page_start')->nullable();
            $table->integer('source_page_end')->nullable();
            $table->string('checksum', 64)->index();
            $table->integer('version')->default(1);
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->foreign('curriculum_code')->references('code')->on('curriculum_frameworks')->cascadeOnDelete();
            $table->index(['curriculum_code', 'subject_id', 'phase_id', 'status'], 'cp_query_lookup_idx');
        });

        // 2. Learning Outcome Versions (Immutable revision history)
        Schema::create('learning_outcome_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_outcome_id')->constrained('learning_outcomes')->cascadeOnDelete();
            $table->integer('version');
            $table->longText('cp_text');
            $table->string('element_name')->nullable();
            $table->text('change_summary')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['learning_outcome_id', 'version']);
        });

        // 3. CP Audit Logs (Traceable compliance logs)
        Schema::create('cp_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_outcome_id')->nullable()->constrained('learning_outcomes')->cascadeOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 50); // CREATE, UPDATE_DRAFT, NEW_VERSION, PUBLISH, ARCHIVE, IMPORT
            $table->text('reason')->nullable();
            $table->json('before_payload')->nullable();
            $table->json('after_payload')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['learning_outcome_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cp_audit_logs');
        Schema::dropIfExists('learning_outcome_versions');
        Schema::dropIfExists('learning_outcomes');
    }
};
