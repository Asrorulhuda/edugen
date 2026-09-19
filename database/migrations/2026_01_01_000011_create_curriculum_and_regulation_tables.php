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
        // 1. Curriculum Frameworks (MERDEKA, MADRASAH_KBC)
        Schema::create('curriculum_frameworks', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique(); // MERDEKA, MADRASAH_KBC
            $table->string('name'); // Kurikulum Merdeka, Kurikulum Madrasah (KBC)
            $table->text('description')->nullable();
            $table->json('config_json')->nullable(); // Panca Cinta, Dimensi Profil Lulusan, Prinsip Pembelajaran Mendalam
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Regulations (Regulasi Master)
        Schema::create('regulations', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique(); // BSKAP_046_2025, KMA_1503_2025, DIRJEN_PENDIS_6077_2025
            $table->string('title');
            $table->string('authority'); // Kemendikbudristek / Kementerian Agama RI
            $table->year('year');
            $table->date('issued_at')->nullable();
            $table->date('effective_at')->nullable();
            $table->enum('status', ['ACTIVE', 'SUPERSEDED', 'DRAFT'])->default('ACTIVE');
            $table->foreignId('replaces_regulation_id')->nullable()->constrained('regulations')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 3. Regulation Documents
        Schema::create('regulation_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('regulation_id')->constrained('regulations')->cascadeOnDelete();
            $table->string('file_path')->nullable();
            $table->string('sha256', 64)->nullable();
            $table->string('version_label')->default('1.0');
            $table->integer('page_count')->default(0);
            $table->enum('extraction_status', ['DRAFT', 'EXTRACTED', 'VERIFIED'])->default('VERIFIED');
            $table->timestamps();
        });

        // 4. Source Policies (Routing matrix between Curriculum + Subject Category -> Regulation)
        Schema::create('source_policies', function (Blueprint $table) {
            $table->id();
            $table->string('curriculum_code', 30);
            $table->enum('subject_category', ['GENERAL', 'RELIGION', 'ARABIC', 'VOCATIONAL', 'LOCAL']);
            $table->foreignId('education_level_id')->nullable()->constrained('education_levels')->nullOnDelete();
            $table->foreignId('regulation_id')->constrained('regulations')->cascadeOnDelete();
            $table->integer('priority')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('curriculum_code')->references('code')->on('curriculum_frameworks')->cascadeOnDelete();
            $table->index(['curriculum_code', 'subject_category', 'is_active'], 'source_policy_lookup_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('source_policies');
        Schema::dropIfExists('regulation_documents');
        Schema::dropIfExists('regulations');
        Schema::dropIfExists('curriculum_frameworks');
    }
};
