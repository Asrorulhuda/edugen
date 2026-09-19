<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\TenantSubscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    use DatabaseTransactions;

    protected User $superAdmin;
    protected User $regularTeacher;
    protected Tenant $testTenant;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Super Admin
        $this->superAdmin = User::firstOrCreate(
            ['email' => 'admin.clients.test@edugen.id'],
            ['name' => 'Super Admin Client Test', 'password' => bcrypt('password')]
        );

        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        $platformTenant = Tenant::firstOrCreate(
            ['slug' => 'platform-clients-test'],
            ['name' => 'Platform Clients Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->superAdmin->id, 'status' => 'ACTIVE']
        );

        TenantMembership::updateOrCreate(
            ['user_id' => $this->superAdmin->id, 'tenant_id' => $platformTenant->id],
            ['role_id' => $superAdminRole->id, 'membership_status' => 'ACTIVE', 'is_default' => true]
        );

        $this->superAdmin->update(['last_active_tenant_id' => $platformTenant->id]);

        // 2. Setup Regular Teacher
        $this->regularTeacher = User::firstOrCreate(
            ['email' => 'guru.regular.test@edugen.id'],
            ['name' => 'Guru Regular Test', 'password' => bcrypt('password')]
        );
        $teacherRole = Role::where('name', Role::PERSONAL_TEACHER)->first();
        $teacherTenant = Tenant::firstOrCreate(
            ['slug' => 'guru-mandiri-test'],
            ['name' => 'Ruang Guru Mandiri Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->regularTeacher->id, 'status' => 'ACTIVE']
        );
        TenantMembership::updateOrCreate(
            ['user_id' => $this->regularTeacher->id, 'tenant_id' => $teacherTenant->id],
            ['role_id' => $teacherRole->id, 'membership_status' => 'ACTIVE', 'is_default' => true]
        );

        // 3. Setup Test School Tenant
        $this->testTenant = Tenant::create([
            'name' => 'SMA Test Nusantara',
            'slug' => 'sma-test-nusantara',
            'tenant_type' => 'INSTITUTION',
            'status' => 'ACTIVE',
        ]);
    }

    public function test_non_superadmin_cannot_access_client_management(): void
    {
        $response = $this->actingAs($this->regularTeacher)->get(route('admin.clients.index'));
        $this->assertTrue(in_array($response->getStatusCode(), [403, 302]));
    }

    public function test_superadmin_can_access_client_list(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.clients.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Clients/Index'));
    }

    public function test_superadmin_can_filter_clients(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.clients.index', [
            'tenant_type' => 'INSTITUTION',
            'status' => 'ACTIVE',
            'search' => 'Nusantara',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Clients/Index'));
    }

    public function test_superadmin_can_view_client_detail(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.clients.show', $this->testTenant->id));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Clients/Show'));
    }

    public function test_superadmin_can_update_client_status(): void
    {
        $response = $this->actingAs($this->superAdmin)->patch(route('admin.clients.update-status', $this->testTenant->id), [
            'status' => 'SUSPENDED',
        ]);

        $response->assertRedirect();
        $this->assertEquals('SUSPENDED', $this->testTenant->fresh()->status);
    }

    public function test_superadmin_can_adjust_client_ai_quota(): void
    {
        // Setup initial subscription
        $plan = SubscriptionPlan::first() ?? SubscriptionPlan::create([
            'name' => 'Plan Test',
            'slug' => 'plan-test',
            'client_model' => 'INSTITUTION',
            'price' => 500000,
            'duration_days' => 30,
            'max_seats' => 10,
            'ai_generation_quota' => 100,
            'features' => ['All Features'],
            'is_active' => true,
        ]);

        $sub = TenantSubscription::create([
            'tenant_id' => $this->testTenant->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'ACTIVE',
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addDays(30),
            'ai_quota_limit' => 100,
            'ai_quota_used' => 20,
            'seats_limit' => 10,
        ]);

        // Add 150 more quota
        $response = $this->actingAs($this->superAdmin)->post(route('admin.clients.adjust-quota', $this->testTenant->id), [
            'action' => 'add',
            'amount' => 150,
            'notes' => 'Bonus promo institusi',
        ]);

        $response->assertRedirect();
        $this->assertEquals(250, $sub->fresh()->ai_quota_limit);

        // Set quota directly to 500
        $response2 = $this->actingAs($this->superAdmin)->post(route('admin.clients.adjust-quota', $this->testTenant->id), [
            'action' => 'set',
            'amount' => 500,
        ]);

        $response2->assertRedirect();
        $this->assertEquals(500, $sub->fresh()->ai_quota_limit);
    }

    public function test_superadmin_can_adjust_client_duration(): void
    {
        $plan = SubscriptionPlan::first() ?? SubscriptionPlan::create([
            'name' => 'Plan Test Duration',
            'slug' => 'plan-test-duration-' . uniqid(),
            'client_model' => 'INSTITUTION',
            'price' => 500000,
            'duration_days' => 30,
            'max_seats' => 10,
            'ai_generation_quota' => 100,
            'features' => ['All Features'],
            'is_active' => true,
        ]);

        $sub = TenantSubscription::create([
            'tenant_id' => $this->testTenant->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'ACTIVE',
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addDays(30),
            'ai_quota_limit' => 100,
            'ai_quota_used' => 0,
            'seats_limit' => 10,
        ]);

        // Add 60 days
        $response = $this->actingAs($this->superAdmin)->post(route('admin.clients.adjust-duration', $this->testTenant->id), [
            'action' => 'add',
            'days' => 60,
        ]);

        $response->assertRedirect();
        $this->assertTrue($sub->fresh()->ends_at->isFuture());

        // Set exact end date
        $targetDate = Carbon::now()->addDays(120)->format('Y-m-d');
        $response2 = $this->actingAs($this->superAdmin)->post(route('admin.clients.adjust-duration', $this->testTenant->id), [
            'action' => 'set',
            'ends_at' => $targetDate,
        ]);

        $response2->assertRedirect();
        $this->assertEquals($targetDate, $sub->fresh()->ends_at->format('Y-m-d'));
    }

    public function test_superadmin_can_assign_subscription_plan(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Plan Institusi Premium ' . uniqid(),
            'slug' => 'plan-institusi-premium-' . uniqid(),
            'client_model' => 'INSTITUTION',
            'price' => 1500000,
            'duration_days' => 365,
            'max_seats' => 25,
            'ai_generation_quota' => 1500,
            'features' => ['Full School Access'],
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)->post(route('admin.clients.assign-subscription', $this->testTenant->id), [
            'plan_id' => $plan->id,
            'duration_days' => 180,
            'quota_override' => 2000,
            'notes' => 'Kerja sama dinas pendidikan',
        ]);

        $response->assertRedirect();

        $activeSub = $this->testTenant->subscriptions()->where('status', 'ACTIVE')->latest('id')->first();
        $this->assertNotNull($activeSub);
        $this->assertEquals(2000, $activeSub->ai_quota_limit);
        $this->assertEquals(25, $activeSub->seats_limit);
    }

    public function test_superadmin_can_store_new_client(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('admin.clients.store'), [
            'tenant_type' => 'INSTITUTION',
            'name' => 'SMA Harapan Bangsa',
            'admin_name' => 'Drs. Ahmad Dahlan',
            'admin_email' => 'ahmad@harapanbangsa.sch.id',
            'password' => 'SecurePass123!',
            'npsn' => '20199988',
            'education_level' => 'SMA',
        ]);

        $response->assertRedirect();

        $createdTenant = Tenant::where('name', 'SMA Harapan Bangsa')->first();
        $this->assertNotNull($createdTenant);
        $this->assertEquals('INSTITUTION', $createdTenant->tenant_type);

        $createdUser = User::where('email', 'ahmad@harapanbangsa.sch.id')->first();
        $this->assertNotNull($createdUser);
    }
}
