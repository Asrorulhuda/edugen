<?php

namespace Tests\Feature;

use App\Models\LandingPageSection;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class LandingPageModelTest extends TestCase
{
    use DatabaseTransactions;

    public function test_can_create_and_retrieve_landing_page_section(): void
    {
        $section = LandingPageSection::create([
            'key' => 'test_custom_section',
            'title' => 'Hero Banner Test',
            'content' => [
                'headline' => 'Platform Perangkat Guru KBC Test',
                'subheadline' => 'Rancang Modul Ajar dan Bank Soal Berbasis AI',
                'cta_text' => 'Mulai Sekarang',
            ],
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('landing_page_sections', [
            'key' => 'test_custom_section',
            'is_active' => true,
        ]);

        $retrieved = LandingPageSection::where('key', 'test_custom_section')->first();
        $this->assertNotNull($retrieved);
        $this->assertEquals('Platform Perangkat Guru KBC Test', $retrieved->content['headline']);
    }

    public function test_get_section_helper_returns_default_when_not_found(): void
    {
        $default = ['title' => 'Default Title'];
        $result = LandingPageSection::getSection('non_existent_key', $default);
        $this->assertEquals($default, $result);
    }
}
