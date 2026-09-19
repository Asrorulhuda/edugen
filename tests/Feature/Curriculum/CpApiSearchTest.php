<?php

namespace Tests\Feature\Curriculum;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CpApiSearchTest extends TestCase
{
    use DatabaseTransactions;

    public function test_teacher_can_search_cp_without_curriculum_code_filter(): void
    {
        $user = User::first();

        // Subject 1 (Bahasa Indonesia), Phase 2 (Fase A)
        $response = $this->actingAs($user)->getJson(route('api.curriculum.cp.search', [
            'subject_id' => 1,
            'phase_id' => 2,
        ]));

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'is_available' => true,
        ]);

        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);
        $this->assertArrayHasKey('outcome_text', $data[0]);
        $this->assertArrayHasKey('cp_text', $data[0]);
        $this->assertNotEmpty($data[0]['cp_text']);
    }

    public function test_teacher_can_filter_cp_by_curriculum_code(): void
    {
        $user = User::first();

        $response = $this->actingAs($user)->getJson(route('api.curriculum.cp.search', [
            'subject_id' => 1,
            'phase_id' => 2,
            'curriculum_code' => 'MERDEKA',
        ]));

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'is_available' => true,
        ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals('MERDEKA', $item['curriculum_code']);
        }
    }
}
