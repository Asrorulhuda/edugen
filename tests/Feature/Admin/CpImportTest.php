<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CpImportTest extends TestCase
{
    use DatabaseTransactions;

    public function test_superadmin_can_commit_valid_cp_import_rows(): void
    {
        $superAdmin = User::where('email', 'admin@edugen.id')->firstOrFail();

        $response = $this->actingAs($superAdmin)->postJson(route('admin.import-cp.store'), [
            'rows' => [[
                'data' => [
                    'curriculum_code' => 'MERDEKA',
                    'level_code' => 'SD',
                    'subject_code' => 'BIN',
                    'phase_code' => 'FASE_A',
                    'element_code' => 'BIN-SIMAK',
                    'cp_code' => 'CP-IMPORT-TEST-001',
                    'cp_text' => 'Peserta didik mampu menyimak informasi dan menjelaskan kembali isi teks dengan runtut.',
                    'regulation_code' => 'BSKAP_046_2025',
                    'source_locator' => 'Test suite',
                    'notes' => 'Data uji import CP.',
                ],
            ]],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('imported_count', 1);

        $this->assertDatabaseHas('learning_outcomes', [
            'code' => 'CP-IMPORT-TEST-001',
            'status' => 'DRAFT',
            'updated_by' => $superAdmin->id,
        ]);
    }

    public function test_regular_teacher_cannot_commit_cp_import_rows(): void
    {
        $teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();

        $this->actingAs($teacher)
            ->postJson(route('admin.import-cp.store'), ['rows' => []])
            ->assertForbidden();
    }
}
