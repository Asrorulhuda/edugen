<?php

namespace Tests\Feature\Admin;

use App\Models\AiProviderSetting;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AiSettingsTest extends TestCase
{
    use DatabaseTransactions;

    protected User $superAdmin;
    protected User $regularTeacher;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Super Admin
        $this->superAdmin = User::firstOrCreate(
            ['email' => 'admin.test@edugen.id'],
            ['name' => 'Super Admin Test', 'password' => bcrypt('password')]
        );

        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        $platformTenant = Tenant::firstOrCreate(
            ['slug' => 'platform-test'],
            ['name' => 'Platform Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->superAdmin->id, 'status' => 'ACTIVE']
        );

        TenantMembership::updateOrCreate(
            ['user_id' => $this->superAdmin->id, 'tenant_id' => $platformTenant->id],
            ['role_id' => $superAdminRole->id, 'membership_status' => 'ACTIVE', 'is_default' => true]
        );

        $this->superAdmin->update(['last_active_tenant_id' => $platformTenant->id]);

        // 2. Setup Regular Teacher
        $this->regularTeacher = User::firstOrCreate(
            ['email' => 'guru.test@edugen.id'],
            ['name' => 'Guru Regular Test', 'password' => bcrypt('password')]
        );
        $teacherRole = Role::where('name', Role::PERSONAL_TEACHER)->first();
        $teacherTenant = Tenant::firstOrCreate(
            ['slug' => 'guru-workspace-test'],
            ['name' => 'Ruang Guru Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->regularTeacher->id, 'status' => 'ACTIVE']
        );
        TenantMembership::updateOrCreate(
            ['user_id' => $this->regularTeacher->id, 'tenant_id' => $teacherTenant->id],
            ['role_id' => $teacherRole->id, 'membership_status' => 'ACTIVE', 'is_default' => true]
        );
    }

    public function test_non_superadmin_cannot_access_ai_settings(): void
    {
        $response = $this->actingAs($this->regularTeacher)->get('/admin/ai-settings');
        $response->assertStatus(403);
    }

    public function test_superadmin_can_view_ai_settings(): void
    {
        $response = $this->actingAs($this->superAdmin)->get('/admin/ai-settings');
        $response->assertStatus(200);
        $response->assertSee('Google Gemini AI');
    }

    public function test_superadmin_can_update_ai_provider_settings(): void
    {
        $response = $this->actingAs($this->superAdmin)->put(route('admin.ai-settings.update', 'gemini'), [
            'api_key' => 'AIzaSyFakeKeyForTesting12345',
            'model' => 'gemini-2.5-flash',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'is_active' => true,
            'is_default' => true,
            'temperature' => 0.4,
            'max_tokens' => 4096,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('ai_provider_settings', [
            'provider' => 'gemini',
            'api_key' => 'AIzaSyFakeKeyForTesting12345',
            'model' => 'gemini-2.5-flash',
            'is_default' => true,
        ]);
    }

    public function test_superadmin_can_trigger_test_connection_endpoint(): void
    {
        $response = $this->actingAs($this->superAdmin)->postJson(route('admin.ai-settings.test', 'gemini'), [
            'api_key' => 'test-invalid-key',
            'model' => 'gemini-2.5-flash',
        ]);

        $response->assertStatus(200);
        $this->assertArrayHasKey('success', $response->json());
        $this->assertArrayHasKey('message', $response->json());
    }
}
