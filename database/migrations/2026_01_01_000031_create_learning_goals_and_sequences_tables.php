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
        // Tujuan Pembelajaran (TP)
        Schema::create('learning_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('learning_outcome_id')->constrained('learning_outcomes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('grade_id')->nullable()->constrained('grades')->nullOnDelete();

            $table->string('code', 50)->index(); // TP-BIN-A-01
            $table->enum('bloom_level', ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'])->default('C2');
            $table->string('competency_kko', 100); // e.g. Menjelaskan, Mengidentifikasi, Merancang
            $table->string('material_content', 255); // Ruang lingkup materi pokok
            $table->text('pedagogical_description'); // Rumusan TP lengkap

            // Dimensi Kurikulum Berbasis Cinta & Deep Learning
            $table->json('panca_cinta_dimensions')->nullable(); // Array dimensi panca cinta
            $table->json('deep_learning_elements')->nullable(); // Mindful, Meaningful, Joyful
            $table->json('profil_lulusan_dimensions')->nullable(); // P5RA / Profil Lulusan

            $table->integer('estimated_hours')->default(2); // Alokasi jam pelajaran (JP)
            $table->boolean('is_verified')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'subject_id', 'phase_id']);
        });

        // Alur Tujuan Pembelajaran (ATP)
        Schema::create('learning_goal_sequences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained('grades')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();

            $table->string('title', 255);
            $table->text('rationale')->nullable(); // Rasional alur pembelajaran
            $table->integer('total_hours_allocated')->default(36); // Total alokasi JP dalam 1 tahun / fase
            $table->json('sequence_data'); // Array terurut dari TP yang dipetakan per semester & bab/topik
            $table->enum('status', ['DRAFT', 'FINAL'])->default('DRAFT');
            $table->timestamps();

            $table->index(['tenant_id', 'subject_id', 'grade_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_goal_sequences');
        Schema::dropIfExists('learning_goals');
    }
};
