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
        // 1. Education Levels (Jenjang: RA, MI, MTs, MA, MAK, SD, SMP, SMA, SMK)
        Schema::create('education_levels', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique(); // RA, MI, MTS, MA, MAK, SD, SMP, SMA, SMK
            $table->string('name'); // e.g. Madrasah Ibtidaiyah / Sekolah Dasar
            $table->string('category', 20)->default('FORMAL'); // FORMAL, MADRASAH, VOCATIONAL, EARLY_CHILDHOOD
            $table->integer('order_index')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Phases (Fase: FONDASI, A, B, C, D, E, F)
        Schema::create('phases', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique(); // FASE_FONDASI, FASE_A, FASE_B, FASE_C, FASE_D, FASE_E, FASE_F
            $table->string('name'); // Fase A (Kelas 1 - 2)
            $table->string('level_summary'); // SD/MI Kelas 1-2
            $table->integer('order_index')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Grades (Kelas / Tingkat)
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('education_level_id')->constrained('education_levels')->cascadeOnDelete();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->string('grade_number', 10); // 1, 2, ..., 12, or TK-A, TK-B
            $table->string('name'); // Kelas 1, Kelas 7, dsb.
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 4. Academic Years (Tenant/Institution scoped)
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('institution_id')->nullable()->constrained('institutions')->cascadeOnDelete();
            $table->string('label'); // e.g. 2026/2027
            $table->date('starts_at');
            $table->date('ends_at');
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });

        // 5. Semesters
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->enum('type', ['ODD', 'EVEN'])->default('ODD'); // Ganjil / Genap
            $table->string('label'); // Semester Ganjil / Semester Genap
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // 6. Subjects (Mata Pelajaran Master)
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->enum('category', ['GENERAL', 'RELIGION', 'ARABIC', 'VOCATIONAL', 'LOCAL'])->default('GENERAL');
            $table->json('education_level_scope')->nullable(); // ['SD', 'MI', 'SMP', 'MTS', ...]
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 7. Learning Elements (Elemen CP: Pemahaman, Keterampilan Proses, Menyimak, Membaca, dll.)
        Schema::create('learning_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->cascadeOnDelete();
            $table->string('code', 50)->nullable();
            $table->string('name'); // e.g. Menyimak, Membaca dan Memirsa, Bilangan, Aljabar
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 8. Institution Subjects (Custom mapping / active subject in institution)
        Schema::create('institution_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('custom_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_subjects');
        Schema::dropIfExists('learning_elements');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('semesters');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('grades');
        Schema::dropIfExists('phases');
        Schema::dropIfExists('education_levels');
    }
};
