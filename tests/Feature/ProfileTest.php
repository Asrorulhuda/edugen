<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use DatabaseTransactions;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_teacher_can_upload_and_remove_profile_photo(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');

        $user = User::factory()->create();

        $file = \Illuminate\Http\UploadedFile::fake()->image('guru.jpg', 300, 300);

        $response = $this
            ->actingAs($user)
            ->post('/profile', [
                'name' => 'Guru Hebat, S.Pd.',
                'email' => $user->email,
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();
        $this->assertNotNull($user->avatar_path);
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($user->avatar_path);
        $this->assertStringContainsString('storage/' . $user->avatar_path, $user->avatar_url);

        // Test remove avatar
        $removeResponse = $this
            ->actingAs($user)
            ->post('/profile', [
                'name' => 'Guru Hebat, S.Pd.',
                'email' => $user->email,
                'remove_avatar' => true,
            ]);

        $removeResponse
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();
        $this->assertNull($user->avatar_path);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_individual_teacher_can_update_school_profile_and_letterhead(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/profile/school', [
                'name' => 'SMP Negeri 1 Merdeka Belajar',
                'type' => 'SMP',
                'npsn' => '20123456',
                'city' => 'Surabaya',
                'address' => 'Jl. Pemuda No. 10',
                'principal_name' => 'Dr. H. Budi Santoso, M.Pd.',
                'principal_id_number' => '197501012000031001',
                'signature_title' => 'Kepala Sekolah',
                'signature_city' => 'Surabaya',
                'header_style' => 'LOGO_LEFT',
                'letterhead_line_1' => 'PEMERINTAH KOTA SURABAYA / DINAS PENDIDIKAN',
                'letterhead_line_2' => 'SMP NEGERI 1 MERDEKA BELAJAR',
                'letterhead_line_3' => 'NPSN: 20123456 | TERAKREDITASI A',
                'letterhead_subtext' => 'Jl. Pemuda No. 10 Surabaya, Telp. 031-123456',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('institutions', [
            'name' => 'SMP Negeri 1 Merdeka Belajar',
            'npsn' => '20123456',
            'city' => 'Surabaya',
            'principal_name' => 'Dr. H. Budi Santoso, M.Pd.',
            'header_style' => 'LOGO_LEFT',
        ]);
    }

    public function test_institution_teacher_cannot_update_school_profile_directly(): void
    {
        $user = User::factory()->create();

        $tenant = \App\Models\Tenant::create([
            'name' => 'SMA Teladan Bangsa',
            'slug' => 'sma-teladan-bangsa-' . uniqid(),
            'tenant_type' => 'INSTITUTION',
            'status' => 'ACTIVE',
        ]);

        $role = \App\Models\Role::firstOrCreate(
            ['name' => 'TEACHER'],
            ['display_name' => 'Guru', 'scope' => 'TENANT']
        );

        \App\Models\TenantMembership::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'role_id' => $role->id,
            'membership_status' => 'ACTIVE',
            'is_default' => true,
        ]);

        $user->update(['last_active_tenant_id' => $tenant->id]);

        $response = $this
            ->actingAs($user)
            ->withSession(['current_tenant_id' => $tenant->id])
            ->post('/profile/school', [
                'name' => 'Nama Sekolah Ilegal',
                'type' => 'SMA',
                'header_style' => 'TEXT_ONLY',
            ]);

        $response->assertForbidden();
    }
}
