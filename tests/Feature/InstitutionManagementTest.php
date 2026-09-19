<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Institution;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantInvitation;
use App\Models\TenantMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class InstitutionManagementTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_institution_admin_can_access_institution_routes()
    {
        $admin = User::where('email', 'admin.mtsn1@edugen.id')->firstOrFail();
        $tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/profile');

        $response->assertStatus(200);

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/branding');

        $response->assertStatus(200);

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/academic-years');

        $response->assertStatus(200);

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/teachers');

        $response->assertStatus(200);

        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/invitations');

        $response->assertStatus(200);
    }

    public function test_regular_teacher_cannot_access_institution_admin_routes()
    {
        $teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        $response = $this->actingAs($teacher)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->get('/institution/profile');

        $response->assertStatus(403);
    }

    public function test_teacher_invitation_lifecycle()
    {
        $admin = User::where('email', 'admin.mtsn1@edugen.id')->firstOrFail();
        $tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        $testEmail = 'guru.baru.' . time() . '@edugen.id';

        // Admin sends invite
        $response = $this->actingAs($admin)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->post('/institution/invitations', [
                'email' => $testEmail,
            ]);

        $response->assertRedirect();

        $invitation = TenantInvitation::where('email', $testEmail)->first();
        $this->assertNotNull($invitation);
        $this->assertNotNull($invitation->otp_code);
        $this->assertSame(6, strlen($invitation->otp_code));

        // Public user views invitation page
        $publicResponse = $this->get('/invitations/' . $invitation->token_hash);
        $publicResponse->assertStatus(200);

        // Fail when wrong OTP provided
        $failResponse = $this->post('/invitations/' . $invitation->token_hash, [
            'name' => 'Guru Baru, S.Pd.',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'otp' => '000000',
        ]);
        $failResponse->assertSessionHasErrors('otp');

        // Success when correct OTP provided
        $successResponse = $this->post('/invitations/' . $invitation->token_hash, [
            'name' => 'Guru Baru, S.Pd.',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'otp' => $invitation->otp_code,
        ]);
        $successResponse->assertRedirect('/dashboard');

        $this->assertNotNull($invitation->fresh()->accepted_at);
        $this->assertDatabaseHas('users', ['email' => $testEmail]);
    }
}
