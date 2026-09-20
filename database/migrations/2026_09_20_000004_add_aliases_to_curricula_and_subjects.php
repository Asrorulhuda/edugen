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

        // Ensure Keterampilan Proses elements exist independently per-subject for Madrasah
        if (Schema::hasTable('learning_elements') && Schema::hasTable('subjects')) {
            $qh = DB::table('subjects')->where('code', 'QH')->first();
            $fiq = DB::table('subjects')->where('code', 'FIQ')->first();
            $ski = DB::table('subjects')->where('code', 'SKI')->first();

            if ($qh) {
                $qhElemId = DB::table('learning_elements')->where('subject_id', $qh->id)->where('name', 'Keterampilan Proses')->value('id');
                if (!$qhElemId) {
                    $qhElemId = DB::table('learning_elements')->insertGetId([
                        'subject_id' => $qh->id,
                        'code' => 'Keterampilan Proses',
                        'name' => 'Keterampilan Proses',
                        'description' => 'Elemen keterampilan proses pada mata pelajaran Al-Qur\'an Hadis',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                if (Schema::hasTable('learning_outcomes')) {
                    DB::table('learning_outcomes')->where('subject_id', $qh->id)
                        ->whereIn('code', ['CP-QH-FA-04', 'CP-QH-FB-04', 'CP-QH-FC-04'])
                        ->update(['learning_element_id' => $qhElemId]);
                }
            }

            if ($fiq) {
                $fiqElemId = DB::table('learning_elements')->where('subject_id', $fiq->id)->where('name', 'Keterampilan Proses')->value('id');
                if (!$fiqElemId) {
                    $fiqElemId = DB::table('learning_elements')->insertGetId([
                        'subject_id' => $fiq->id,
                        'code' => 'Keterampilan Proses',
                        'name' => 'Keterampilan Proses',
                        'description' => 'Elemen keterampilan proses pada mata pelajaran Fikih',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                if (Schema::hasTable('learning_outcomes')) {
                    DB::table('learning_outcomes')->where('subject_id', $fiq->id)
                        ->whereIn('code', ['CP-FIK-FA-02', 'CP-FIK-FB-02', 'CP-FIK-FC-03'])
                        ->update(['learning_element_id' => $fiqElemId]);
                }
            }

            if ($ski) {
                $skiElemId = DB::table('learning_elements')->where('subject_id', $ski->id)->where('name', 'Keterampilan Proses')->value('id');
                if (!$skiElemId) {
                    $skiElemId = DB::table('learning_elements')->insertGetId([
                        'subject_id' => $ski->id,
                        'code' => 'Keterampilan Proses',
                        'name' => 'Keterampilan Proses',
                        'description' => 'Elemen keterampilan proses pada mata pelajaran Sejarah Kebudayaan Islam',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                if (Schema::hasTable('learning_outcomes')) {
                    DB::table('learning_outcomes')->where('subject_id', $ski->id)
                        ->whereIn('code', ['CP-SKI-FB-02', 'CP-SKI-FC-02'])
                        ->update(['learning_element_id' => $skiElemId]);
                }
            }
        }
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
