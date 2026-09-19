<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use App\Models\WaGatewaySetting;
use App\Models\WaMessageLog;
use App\Models\WaTemplate;
use App\Services\WhatsApp\WhatsAppGatewayService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WhatsAppGatewayTest extends TestCase
{
    use DatabaseTransactions;

    protected User $superAdmin;
    protected User $regularTeacher;
    protected WhatsAppGatewayService $waService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->waService = new WhatsAppGatewayService();

        // Setup Super Admin
        $this->superAdmin = User::firstOrCreate(
            ['email' => 'superadmin.wa.test@edugen.id'],
            ['name' => 'Super Admin WA Test', 'password' => bcrypt('password')]
        );

        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        $platformTenant = Tenant::firstOrCreate(
            ['slug' => 'platform-wa-test'],
            ['name' => 'Platform WA Test', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->superAdmin->id, 'status' => 'ACTIVE']
        );

        TenantMembership::updateOrCreate(
            ['user_id' => $this->superAdmin->id, 'tenant_id' => $platformTenant->id],
            ['role_id' => $superAdminRole->id, 'status' => 'ACTIVE', 'is_default' => true]
        );

        $this->superAdmin->update(['last_active_tenant_id' => $platformTenant->id]);

        // Setup Regular Teacher
        $this->regularTeacher = User::firstOrCreate(
            ['email' => 'guru.wa.test@edugen.id'],
            ['name' => 'Guru WA Test', 'password' => bcrypt('password')]
        );
        $teacherRole = Role::where('name', Role::TEACHER)->first();
        $teacherTenant = Tenant::firstOrCreate(
            ['slug' => 'guru-wa-tenant'],
            ['name' => 'Guru WA Workspace', 'tenant_type' => 'INDIVIDUAL', 'primary_admin_user_id' => $this->regularTeacher->id, 'status' => 'ACTIVE']
        );
        TenantMembership::updateOrCreate(
            ['user_id' => $this->regularTeacher->id, 'tenant_id' => $teacherTenant->id],
            ['role_id' => $teacherRole->id, 'status' => 'ACTIVE', 'is_default' => true]
        );
        $this->regularTeacher->update(['last_active_tenant_id' => $teacherTenant->id]);
    }

    public function test_superadmin_can_access_crm_dashboard(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.crm.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Crm/Index'));
    }

    public function test_regular_user_cannot_access_crm_dashboard(): void
    {
        $response = $this->actingAs($this->regularTeacher)->get(route('admin.crm.index'));
        $response->assertStatus(403);
    }

    public function test_superadmin_can_update_gateway_settings(): void
    {
        $response = $this->actingAs($this->superAdmin)->put(route('admin.crm.settings.update'), [
            'endpoint_url' => 'https://gateway.asr-desain.my.id/send-message',
            'api_key' => 'secret_api_key_test_123',
            'sender' => '6281234567890',
            'default_footer' => 'EduGen AI Test Footer',
            'is_active' => true,
            'full_response' => true,
        ]);

        $response->assertSessionHas('success');
        $setting = WaGatewaySetting::current();
        $this->assertEquals('secret_api_key_test_123', $setting->api_key);
        $this->assertEquals('6281234567890', $setting->sender);
        $this->assertTrue($setting->is_active);
    }

    public function test_phone_number_normalization(): void
    {
        $this->assertEquals('628123456789', $this->waService->normalizePhoneNumber('08123456789'));
        $this->assertEquals('628123456789', $this->waService->normalizePhoneNumber('+628123456789'));
        $this->assertEquals('628123456789', $this->waService->normalizePhoneNumber('8123456789'));
        $this->assertEquals('628123456789', $this->waService->normalizePhoneNumber('0812-3456-789'));
    }

    public function test_superadmin_can_send_manual_message(): void
    {
        WaGatewaySetting::current()->update([
            'api_key' => 'test_key',
            'sender' => '6289999999',
            'is_active' => true,
        ]);

        Http::fake([
            'https://gateway.asr-desain.my.id/send-message' => Http::response([
                'status' => true,
                'msg' => 'Pesan terkirim',
            ], 200),
        ]);

        $response = $this->actingAs($this->superAdmin)->post(route('admin.crm.send'), [
            'recipient_number' => '081299988877',
            'recipient_name' => 'Bapak Kepala Sekolah',
            'message' => 'Halo dari EduGen AI CRM Test!',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('wa_message_logs', [
            'recipient_number' => '6281299988877',
            'status' => 'SENT',
            'source' => 'MANUAL',
        ]);
    }

    public function test_superadmin_can_broadcast_to_teachers(): void
    {
        WaGatewaySetting::current()->update([
            'api_key' => 'test_key',
            'sender' => '6289999999',
            'is_active' => true,
        ]);

        Http::fake([
            'https://gateway.asr-desain.my.id/send-message' => Http::response([
                'status' => true,
                'msg' => 'Broadcast item sent',
            ], 200),
        ]);

        $response = $this->actingAs($this->superAdmin)->post(route('admin.crm.broadcast'), [
            'audience_segment' => 'CUSTOM',
            'custom_numbers' => "0811111111\n0822222222",
            'message_template' => 'Pemberitahuan: {nama} akun aktif.',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('wa_message_logs', [
            'recipient_number' => '62811111111',
            'source' => 'BROADCAST',
            'status' => 'SENT',
        ]);
    }

    public function test_superadmin_can_manage_templates(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('admin.crm.templates.store'), [
            'title' => 'Template Diskon Khusus',
            'code' => 'PROMO_SEKOLAH_2026',
            'category' => 'MARKETING',
            'content' => 'Halo {nama}, dapatkan diskon 30% untuk sekolah {sekolah}!',
            'footer' => 'EduGen Promo',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('wa_templates', ['code' => 'PROMO_SEKOLAH_2026']);
    }

    public function test_teacher_invitation_triggers_whatsapp_gateway(): void
    {
        // 1. Setup institution
        $schoolTenant = Tenant::firstOrCreate(
            ['slug' => 'smpn-wa-test'],
            ['name' => 'SMP Negeri 1 WA Test', 'tenant_type' => 'INSTITUTION', 'primary_admin_user_id' => $this->superAdmin->id, 'status' => 'ACTIVE']
        );
        $adminRole = Role::where('name', Role::ADMIN)->first();
        TenantMembership::updateOrCreate(
            ['user_id' => $this->superAdmin->id, 'tenant_id' => $schoolTenant->id],
            ['role_id' => $adminRole->id, 'status' => 'ACTIVE', 'is_default' => true]
        );
        $this->superAdmin->update(['last_active_tenant_id' => $schoolTenant->id]);

        // 2. Configure WA gateway as active
        WaGatewaySetting::current()->update([
            'api_key' => 'test_key_active',
            'sender' => '6289999999',
            'is_active' => true,
        ]);

        Http::fake([
            'https://gateway.asr-desain.my.id/send-message' => Http::response([
                'status' => true,
                'msg' => 'OTP dispatched',
            ], 200),
        ]);

        // 3. Store invitation
        $response = $this->actingAs($this->superAdmin)->post(route('institution.invitations.store'), [
            'email' => 'calonguru.wa@example.com',
            'phone' => '087766554433',
        ]);

        $response->assertSessionHas('success');

        // 4. Assert WhatsApp message log was created
        $this->assertDatabaseHas('wa_message_logs', [
            'recipient_number' => '6287766554433',
            'source' => 'INVITATION_OTP',
            'status' => 'SENT',
        ]);
    }
}
