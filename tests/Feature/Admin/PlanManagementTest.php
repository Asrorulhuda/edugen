<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class PlanManagementTest extends TestCase
{
    use DatabaseTransactions;

    protected User $superAdmin;
    protected User $regularTeacher;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Super Admin
        $this->superAdmin = User::firstOrCreate(
            ['email' => 'admin.plans.test@edugen.id'],
            ['name' => 'Super Admin Plans Test', 'password' => bcrypt('password')]
        );

        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        $platformTenant = Tenant::firstOrCreate(
            ['slug' => 'platform-plans-test'],
            ['name' => 'Platform Plans Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->superAdmin->id, 'status' => 'ACTIVE']
        );

        TenantMembership::updateOrCreate(
            ['user_id' => $this->superAdmin->id, 'tenant_id' => $platformTenant->id],
            ['role_id' => $superAdminRole->id, 'membership_status' => 'ACTIVE', 'is_default' => true]
        );

        $this->superAdmin->update(['last_active_tenant_id' => $platformTenant->id]);

        // 2. Setup Regular Teacher
        $this->regularTeacher = User::firstOrCreate(
            ['email' => 'guru.regular.plans@edugen.id'],
            ['name' => 'Guru Regular Plans Test', 'password' => bcrypt('password')]
        );
    }

    public function test_non_superadmin_cannot_access_plan_management(): void
    {
        $response = $this->actingAs($this->regularTeacher)->get(route('admin.plans.index'));
        $this->assertTrue(in_array($response->getStatusCode(), [403, 302]));
    }

    public function test_superadmin_can_view_plan_list(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.plans.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Plans/Index'));
    }

    public function test_superadmin_can_store_new_plan(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('admin.plans.store'), [
            'name' => 'Paket Guru Mandiri Juara',
            'client_model' => 'INDIVIDUAL',
            'price' => 125000,
            'duration_days' => 30,
            'max_seats' => 1,
            'ai_generation_quota' => 200,
            'features' => ['RPP Otomatis', 'Bank Soal Lengkap'],
            'is_active' => true,
            'is_popular' => true,
        ]);

        $response->assertRedirect();

        $plan = SubscriptionPlan::where('name', 'Paket Guru Mandiri Juara')->first();
        $this->assertNotNull($plan);
        $this->assertEquals('INDIVIDUAL', $plan->client_model);
        $this->assertEquals(125000, $plan->price);
        $this->assertEquals(200, $plan->ai_generation_quota);
        $this->assertTrue($plan->is_popular);
    }

    public function test_superadmin_can_update_plan(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket Lama',
            'slug' => 'paket-lama-test',
            'client_model' => 'INSTITUTION',
            'price' => 499000,
            'duration_days' => 30,
            'max_seats' => 10,
            'ai_generation_quota' => 300,
            'features' => ['Fitur 1'],
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)->put(route('admin.plans.update', $plan->id), [
            'name' => 'Paket Diperbarui',
            'client_model' => 'INSTITUTION',
            'price' => 599000,
            'duration_days' => 60,
            'max_seats' => 15,
            'ai_generation_quota' => 500,
            'features' => ['Fitur 1 Baru', 'Fitur 2 Baru'],
            'is_active' => true,
            'is_popular' => false,
        ]);

        $response->assertRedirect();

        $updated = $plan->fresh();
        $this->assertEquals('Paket Diperbarui', $updated->name);
        $this->assertEquals(599000, $updated->price);
        $this->assertEquals(60, $updated->duration_days);
        $this->assertEquals(500, $updated->ai_generation_quota);
    }

    public function test_superadmin_can_toggle_plan_status(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket Toggle Test',
            'slug' => 'paket-toggle-test',
            'client_model' => 'INDIVIDUAL',
            'price' => 75000,
            'duration_days' => 30,
            'max_seats' => 1,
            'ai_generation_quota' => 50,
            'features' => ['Fitur'],
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)->patch(route('admin.plans.toggle-status', $plan->id));
        $response->assertRedirect();
        $this->assertFalse($plan->fresh()->is_active);

        // Toggle back
        $response2 = $this->actingAs($this->superAdmin)->patch(route('admin.plans.toggle-status', $plan->id));
        $response2->assertRedirect();
        $this->assertTrue($plan->fresh()->is_active);
    }

    public function test_superadmin_can_delete_unused_plan(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket Hapus Test',
            'slug' => 'paket-hapus-test',
            'client_model' => 'INDIVIDUAL',
            'price' => 50000,
            'duration_days' => 15,
            'max_seats' => 1,
            'ai_generation_quota' => 20,
            'features' => ['Fitur'],
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)->delete(route('admin.plans.destroy', $plan->id));
        $response->assertRedirect();

        $this->assertNull(SubscriptionPlan::find($plan->id));
    }
}
