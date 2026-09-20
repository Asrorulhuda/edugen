<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('curriculum_frameworks') && !Schema::hasColumn('curriculum_frameworks', 'aliases')) {
            Schema::table('curriculum_frameworks', function (Blueprint $table) {
                $table->json('aliases')->nullable()->after('description');
            });
        }

        if (Schema::hasTable('subjects') && !Schema::hasColumn('subjects', 'aliases')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->json('aliases')->nullable()->after('description');
            });
        }

        // Seed initial alias for MADRASAH_KBC -> ['KBC', 'MADRASAH']
        DB::table('curriculum_frameworks')
            ->where('code', 'MADRASAH_KBC')
            ->update([
                'aliases' => json_encode(['KBC', 'MADRASAH']),
            ]);

        // Seed initial alias for FIQ -> ['FIK', 'FIQIH']
        DB::table('subjects')
            ->where('code', 'FIQ')
            ->update([
                'aliases' => json_encode(['FIK', 'FIQIH']),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('curriculum_frameworks') && Schema::hasColumn('curriculum_frameworks', 'aliases')) {
            Schema::table('curriculum_frameworks', function (Blueprint $table) {
                $table->dropColumn('aliases');
            });
        }

        if (Schema::hasTable('subjects') && Schema::hasColumn('subjects', 'aliases')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->dropColumn('aliases');
            });
        }
    }
};
