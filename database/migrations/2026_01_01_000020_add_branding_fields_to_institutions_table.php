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
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('header_style', 30)->default('LOGO_LEFT')->after('letterhead_path'); // LOGO_LEFT, TEXT_ONLY, FULL_IMAGE
            $table->string('letterhead_line_1')->nullable()->after('header_style');
            $table->string('letterhead_line_2')->nullable()->after('letterhead_line_1');
            $table->string('letterhead_line_3')->nullable()->after('letterhead_line_2');
            $table->text('letterhead_subtext')->nullable()->after('letterhead_line_3');
            $table->string('signature_city')->nullable()->after('principal_id_number');
            $table->string('signature_title')->default('Kepala Sekolah')->after('signature_city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn([
                'header_style',
                'letterhead_line_1',
                'letterhead_line_2',
                'letterhead_line_3',
                'letterhead_subtext',
                'signature_city',
                'signature_title',
            ]);
        });
    }
};
