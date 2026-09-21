<?php

namespace Tests\Feature;

use App\Models\LandingPageSection;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class LandingPageManagementTest extends TestCase
{
    use DatabaseTransactions;

    public function test_superadmin_can_view_landing_page_management(): void
    {
        $superadmin = User::where('email', 'admin@edugen.id')->firstOrFail();

        $response = $this->actingAs($superadmin)->get(route('admin.landing-page.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/LandingPage/Index'));
    }

    public function test_superadmin_can_update_hero_section(): void
    {
        $superadmin = User::where('email', 'admin@edugen.id')->firstOrFail();

        $response = $this->actingAs($superadmin)->post(route('admin.landing-page.update', 'hero'), [
            'title' => 'Hero Banner Diperbarui',
            'is_active' => true,
            'content' => [
                'headline_main' => 'Capaian Pembelajaran Resmi Terverifikasi 2026',
                'headline_gradient' => 'Perangkat Pembelajaran Terintegrasi',
                'subheadline' => 'Menyusun RPP KBC dan Soal Lebih Cepat',
                'badge_text' => 'Regulasi KMA & BSKAP Terverifikasi',
                'cta_primary_text' => 'Mulai Sekarang',
                'cta_primary_link' => '/register',
                'cta_secondary_text' => 'Jelajahi Alur',
                'cta_secondary_link' => '#workflow',
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('landing_page_sections', [
            'key' => 'hero',
            'title' => 'Hero Banner Diperbarui',
        ]);
    }

    public function test_regular_teacher_cannot_access_landing_page_management(): void
    {
        $teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();

        $response = $this->actingAs($teacher)->get('/admin/landing-page');
        $response->assertStatus(403);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/admin/landing-page');
        $response->assertRedirect('/login');
    }
}
