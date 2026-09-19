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
        // 1. Paket Asesmen / Ujian
        Schema::create('assessment_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained('grades')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->nullOnDelete();

            $table->string('title', 255); // e.g. Asesmen Sumatif Akhir Semester (SAS) Ganjil
            $table->string('assessment_type', 50)->default('SUMATIF_AKHIR_SEMESTER');

            $table->integer('total_questions')->default(10);
            $table->integer('duration_minutes')->default(90);
            $table->text('instructions')->nullable(); // Petunjuk pengerjaan soal
            $table->enum('status', ['DRAFT', 'FINAL', 'ARCHIVED'])->default('FINAL');
            $table->timestamps();

            $table->index(['tenant_id', 'subject_id', 'grade_id']);
        });

        // 2. Kisi-kisi Asesmen (Assessment Blueprints)
        Schema::create('assessment_matrices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_package_id')->constrained('assessment_packages')->cascadeOnDelete();
            $table->foreignId('learning_goal_id')->nullable()->constrained('learning_goals')->nullOnDelete();

            $table->integer('question_number');
            $table->text('indicator_text'); // Indikator soal
            $table->enum('bloom_level', ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'])->default('C3');
            $table->enum('cognitive_tier', ['L1', 'L2', 'L3'])->default('L2'); // L1 (Pemahaman), L2 (Aplikasi), L3 (HOTS)
            $table->enum('question_type', ['PG', 'PG_KOMPLEKS', 'MENJODOHKAN', 'ISIAN', 'URAIAN'])->default('PG');
            $table->integer('score_weight')->default(1);
            $table->timestamps();

            $table->index(['assessment_package_id', 'question_number']);
        });

        // 3. Butir Soal Lengkap (Questions & Answers)
        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_package_id')->constrained('assessment_packages')->cascadeOnDelete();
            $table->foreignId('assessment_matrix_id')->nullable()->constrained('assessment_matrices')->nullOnDelete();

            $table->integer('question_number');
            $table->enum('question_type', ['PG', 'PG_KOMPLEKS', 'MENJODOHKAN', 'ISIAN', 'URAIAN'])->default('PG');
            $table->text('stimulus_text')->nullable(); // Wacana, narasi kontekstual cinta lingkungan/sosial
            $table->text('question_text');
            $table->json('options_data')->nullable(); // Pilihan [A => '...', B => '...', ...]
            $table->text('correct_answer'); // Kunci jawaban
            $table->text('explanation')->nullable(); // Pembahasan & telaah pedagogis
            $table->integer('score_weight')->default(1);
            $table->timestamps();

            $table->index(['assessment_package_id', 'question_number']);
        });

        // 4. Rubrik Penilaian KBC
        Schema::create('assessment_rubrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('grade_id')->nullable()->constrained('grades')->nullOnDelete();

            $table->string('title', 255); // e.g. Rubrik Sikap Panca Cinta: Menghargai Sesama & Lingkungan
            $table->string('rubric_type', 50)->default('SIKAP_PANCA_CINTA');

            $table->text('description')->nullable();
            $table->json('dimensions_data'); // Dimensi sikap/aspek yang dinilai
            $table->json('criteria_data')->nullable(); // Skala penilaian opsional
            $table->text('scoring_guidelines')->nullable(); // Pedoman penskoran & konversi nilai
            $table->timestamps();

            $table->index(['tenant_id', 'rubric_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_rubrics');
        Schema::dropIfExists('assessment_questions');
        Schema::dropIfExists('assessment_matrices');
        Schema::dropIfExists('assessment_packages');
    }
};
