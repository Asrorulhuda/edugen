<?php

namespace Tests\Feature\Auth;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
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
}
