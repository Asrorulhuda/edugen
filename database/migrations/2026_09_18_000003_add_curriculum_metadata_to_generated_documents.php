<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teaching_modules', function (Blueprint $table) {
            $table->string('curriculum_code', 30)->default('MADRASAH_KBC')->after('semester_id');
            $table->json('generation_metadata')->nullable()->after('bibliography');
            $table->index(['tenant_id', 'curriculum_code']);
        });

        Schema::table('assessment_packages', function (Blueprint $table) {
            $table->string('curriculum_code', 30)->default('MADRASAH_KBC')->after('semester_id');
            $table->json('settings')->nullable()->after('instructions');
            $table->index(['tenant_id', 'curriculum_code']);
        });

        Schema::table('assessment_matrices', function (Blueprint $table) {
            $table->enum('difficulty_level', ['MUDAH', 'SEDANG', 'SULIT'])->default('SEDANG')->after('cognitive_tier');
        });
    }

    public function down(): void
    {
        Schema::table('assessment_matrices', function (Blueprint $table) {
            $table->dropColumn('difficulty_level');
        });

        Schema::table('assessment_packages', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'curriculum_code']);
            $table->dropColumn(['curriculum_code', 'settings']);
        });

        Schema::table('teaching_modules', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'curriculum_code']);
            $table->dropColumn(['curriculum_code', 'generation_metadata']);
        });
    }
};
