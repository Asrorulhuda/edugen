<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_teacher_can_access_dashboard(): void
    {
        $teacher = \App\Models\User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $tenant = \App\Models\Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        $response = $this->actingAs($teacher)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_superadmin_can_access_dashboard(): void
    {
        $admin = \App\Models\User::where('email', 'admin@edugen.id')->firstOrFail();
        $tenant = \App\Models\Tenant::where('slug', 'platform-core')->firstOrFail();

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/dashboard');

        $response->assertStatus(200);
    }
}
