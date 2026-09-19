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
        Schema::create('teaching_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained('grades')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->nullOnDelete();

            $table->string('title', 255); // e.g. Modul Ajar: Menulis Teks Deskripsi Penuh Empati
            $table->string('topic_name', 150); // e.g. Teks Deskripsi
            $table->integer('total_hours')->default(4); // Alokasi waktu (JP)
            $table->integer('meeting_count')->default(2); // Jumlah pertemuan

            // Identitas & Model Pembelajaran
            $table->string('learning_model', 100)->default('Problem-Based Learning'); // Discovery, PBL, PjBL, Inquiry
            $table->text('target_students')->nullable(); // Reguler / Tipikal / Diferensiasi
            $table->text('facilities')->nullable(); // Sarana & Prasarana
            $table->text('prerequisite_knowledge')->nullable(); // Kompetensi Awal

            // Relasi TP & Pemahaman Bermakna
            $table->json('learning_goal_ids'); // Array ID dari learning_goals yang dituju
            $table->text('meaningful_understanding')->nullable(); // Pemahaman Bermakna
            $table->json('inquiry_questions')->nullable(); // Pertanyaan Pemantik

            // Integrasi Kurikulum Berbasis Cinta (KBC)
            $table->json('panca_cinta_integration')->nullable(); // Penjelasan pengamalan 5 dimensi cinta
            $table->json('deep_learning_activities')->nullable(); // Aktivitas: { mindful: [...], meaningful: [...], joyful: [...] }
            $table->json('profil_lulusan_targets')->nullable(); // 8 Dimensi Profil Lulusan / P5RA

            // Skenario & Langkah Pembelajaran (Structured per Pertemuan)
            $table->json('learning_steps'); // Array pertemuan: [{ meeting: 1, preliminary: [...], core: [...], closing: [...] }]

            // Rencana Asesmen
            $table->json('diagnostic_assessment')->nullable(); // Asesmen awal
            $table->json('formative_assessment')->nullable(); // Rubrik proses & sikap cinta
            $table->json('summative_assessment')->nullable(); // Instrumen tes / unjuk kerja
            $table->json('remedial_enrichment')->nullable(); // Program remedial & pengayaan

            // Lampiran & Referensi
            $table->text('student_worksheet_text')->nullable(); // LKPD ringkas
            $table->text('reading_materials')->nullable(); // Bahan bacaan
            $table->json('glossary')->nullable(); // Glosarium istilah
            $table->text('bibliography')->nullable(); // Daftar pustaka resmi

            $table->enum('status', ['DRAFT', 'FINAL', 'ARCHIVED'])->default('DRAFT');
            $table->timestamps();

            $table->index(['tenant_id', 'subject_id', 'grade_id']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_modules');
    }
};
