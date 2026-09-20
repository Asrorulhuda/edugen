<?php

namespace Tests\Feature\Auth;

use App\Models\Tenant;
use App\Models\User;
use App\Models\WaGatewaySetting;
use App\Models\WaMessageLog;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register_and_access_dashboard(): void
    {
        $uniqueEmail = 'guru.' . uniqid() . '@edugen.id';

        $response = $this->post('/register', [
            'name' => 'Ustadz Fikri Baihaqi',
            'email' => $uniqueEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', $uniqueEmail)->first();
        $this->assertNotNull($user);

        // Verify that personal workspace tenant was provisioned
        $tenant = Tenant::where('primary_admin_user_id', $user->id)
            ->where('tenant_type', 'INDIVIDUAL')
            ->first();
        $this->assertNotNull($tenant);

        // Verify active trial subscription
        $membership = $user->memberships()->where('tenant_id', $tenant->id)->first();
        $this->assertNotNull($membership);
        $this->assertEquals('ACTIVE', $membership->membership_status);

        // Access dashboard as the newly registered user
        $dashboardResponse = $this->actingAs($user)->get('/dashboard');
        $dashboardResponse->assertStatus(200);
    }

    public function test_user_can_request_whatsapp_otp(): void
    {
        $uniqueEmail = 'guru.wa.' . uniqid() . '@edugen.id';

        $response = $this->postJson(route('register.request-otp'), [
            'name' => 'Ahmad Baihaqi, M.Pd.',
            'email' => $uniqueEmail,
            'phone' => '081234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'token',
            'phone',
            'message',
            'expires_in',
        ]);

        $this->assertEquals('6281234567890', $response->json('phone'));

        $token = $response->json('token');
        $cachedData = Cache::get("reg_otp_{$token}");
        $this->assertNotNull($cachedData);
        $this->assertEquals('6281234567890', $cachedData['phone']);
        $this->assertSame(6, strlen((string) $cachedData['otp_code']));
    }

    public function test_user_can_verify_otp_and_complete_registration(): void
    {
        $uniqueEmail = 'guru.verified.' . uniqid() . '@edugen.id';

        $otpResponse = $this->postJson(route('register.request-otp'), [
            'name' => 'Siti Nurhaliza, S.Pd.',
            'email' => $uniqueEmail,
            'phone' => '085712345678',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $token = $otpResponse->json('token');
        $cachedData = Cache::get("reg_otp_{$token}");
        $otpCode = $cachedData['otp_code'];

        $verifyResponse = $this->postJson(route('register.verify-otp'), [
            'token' => $token,
            'otp' => $otpCode,
        ]);

        $verifyResponse->assertStatus(200);
        $verifyResponse->assertJson(['success' => true]);

        $this->assertAuthenticated();

        $user = User::where('email', $uniqueEmail)->first();
        $this->assertNotNull($user);
        $this->assertEquals('6285712345678', $user->phone);
        $this->assertNotNull($user->phone_verified_at);

        // Verify that personal workspace tenant was provisioned
        $tenant = Tenant::where('primary_admin_user_id', $user->id)
            ->where('tenant_type', 'INDIVIDUAL')
            ->first();
        $this->assertNotNull($tenant);
    }

    public function test_registration_fails_with_invalid_otp(): void
    {
        $uniqueEmail = 'guru.invalid.' . uniqid() . '@edugen.id';

        $otpResponse = $this->postJson(route('register.request-otp'), [
            'name' => 'Guru Testing',
            'email' => $uniqueEmail,
            'phone' => '087812345678',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $token = $otpResponse->json('token');

        $verifyResponse = $this->postJson(route('register.verify-otp'), [
            'token' => $token,
            'otp' => '000000', // incorrect OTP
        ]);

        $verifyResponse->assertStatus(422);
        $verifyResponse->assertJsonValidationErrors(['otp']);
        $this->assertGuest();
    }

    public function test_registration_notifies_admin_via_whatsapp(): void
    {
        $setting = WaGatewaySetting::current();
        $setting->update([
            'is_active' => true,
            'api_key' => 'test-api-key',
            'sender' => '628111111111',
            'admin_notify_number' => '628999999999',
            'notify_on_registration' => true,
        ]);

        $uniqueEmail = 'guru.notify.' . uniqid() . '@edugen.id';

        $otpResponse = $this->postJson(route('register.request-otp'), [
            'name' => 'Ustadz Notifikasi',
            'email' => $uniqueEmail,
            'phone' => '089876543210',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $token = $otpResponse->json('token');
        $cachedData = Cache::get("reg_otp_{$token}");

        $this->postJson(route('register.verify-otp'), [
            'token' => $token,
            'otp' => $cachedData['otp_code'],
        ]);

        // Check if WaMessageLog was recorded for admin notification
        $log = WaMessageLog::where('source', 'ADMIN_NOTIFICATION')
            ->where('recipient_number', '628999999999')
            ->latest('id')
            ->first();

        $this->assertNotNull($log);
        $this->assertStringContainsString('Pemberitahuan Pendaftar Baru EduGen', $log->message);
        $this->assertStringContainsString('Ustadz Notifikasi', $log->message);
    }
}
