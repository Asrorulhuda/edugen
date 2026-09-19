# Sidebar Navigation & Superadmin Landing Page CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the EduGen KBC dashboard shell to a modern collapsible sidebar navigation and build an end-to-end dynamic Landing Page CMS in the Superadmin panel with complete test verification.

**Architecture:** Database-backed JSON settings model (`LandingPageSection`) with seeder defaults and Inertia CMS editor for Superadmin; modular sidebar architecture (`AppSidebar`, `AppHeader`, `MobileDrawer`) replacing the top navigation in `AuthenticatedLayout.tsx`; dynamic rendering on `Welcome.tsx` with fallback safeguards.

**Tech Stack:** Laravel 11 / PHP 8.2+, Inertia.js (React 18 + TypeScript), Tailwind CSS, Lucide React, PHPUnit.

**Spec:** `docs/superpowers/specs/2026-09-17-sidebar-landing-cms-design.md`

## Global Constraints
- Modern, clean, responsive UI with zero placeholder content.
- All existing tests (38 tests, 211 assertions) must continue passing.
- TypeScript compiler (`tsc`) and Vite production build (`npm run build`) must pass with zero errors.
- Fallback defaults for `Welcome.tsx` ensure zero risk of runtime blank screen if database records are empty.

---

### Task 1: Database Migration, Model, and Seeder for Landing Page Sections

**Files:**
- Create: `database/migrations/2026_09_17_000001_create_landing_page_sections_table.php`
- Create: `app/Models/LandingPageSection.php`
- Create: `database/seeders/LandingPageSectionSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`
- Test: `tests/Feature/LandingPageModelTest.php`

**Interfaces:**
- Model `LandingPageSection`:
  - Columns: `id`, `key` (string, unique), `title` (string, nullable), `content` (json array cast), `is_active` (boolean, default true), `updated_by` (unsignedBigInteger, nullable), `timestamps`.
  - Methods: `public static function getSection(string $key, array $default = []): array`

- [ ] **Step 1: Write the failing model test**

Create `tests/Feature/LandingPageModelTest.php`:
```php
<?php

namespace Tests\Feature;

use App\Models\LandingPageSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_and_retrieve_landing_page_section(): void
    {
        $section = LandingPageSection::create([
            'key' => 'hero',
            'title' => 'Hero Banner Utama',
            'content' => [
                'headline' => 'Platform Perangkat Guru KBC',
                'subheadline' => 'Rancang Modul Ajar dan Bank Soal Berbasis AI',
                'cta_text' => 'Mulai Sekarang',
            ],
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('landing_page_sections', [
            'key' => 'hero',
            'is_active' => true,
        ]);

        $retrieved = LandingPageSection::where('key', 'hero')->first();
        $this->assertNotNull($retrieved);
        $this->assertEquals('Platform Perangkat Guru KBC', $retrieved->content['headline']);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --filter=LandingPageModelTest`
Expected: FAIL because migration and model don't exist.

- [ ] **Step 3: Create Migration, Model, and Seeder**

Create migration `database/migrations/2026_09_17_000001_create_landing_page_sections_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('title')->nullable();
            $table->json('content');
            $table->boolean('is_active')->default(true);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_page_sections');
    }
};
```

Create model `app/Models/LandingPageSection.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'title',
        'content',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function getSection(string $key, array $default = []): array
    {
        $section = static::where('key', $key)->where('is_active', true)->first();
        return $section ? ($section->content ?? $default) : $default;
    }
}
```

Create seeder `database/seeders/LandingPageSectionSeeder.php` with default values matching the current `Welcome.tsx` copy (hero, stats, workflow, features, faqs, footer).

Register `LandingPageSectionSeeder::class` in `database/seeders/DatabaseSeeder.php`.

Run: `php artisan migrate`

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test --filter=LandingPageModelTest`
Expected: PASS

---

### Task 2: Superadmin Landing Page Controller & Routes

**Files:**
- Create: `app/Http/Controllers/Admin/Landing/LandingPageController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/LandingPageManagementTest.php`

**Interfaces:**
- Routes in `admin.` prefix with `superadmin` middleware:
  - `GET /admin/landing-page` -> `LandingPageController@index` (renders `Admin/LandingPage/Index`)
  - `PUT /admin/landing-page/{key}` -> `LandingPageController@update` (validates and updates section)
  - `POST /admin/landing-page/reset/{key}` -> `LandingPageController@reset` (re-seeds default content)

- [ ] **Step 1: Write the failing feature test**

Create `tests/Feature/LandingPageManagementTest.php`:
```php
<?php

namespace Tests\Feature;

use App\Models\LandingPageSection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_superadmin_can_view_landing_page_management(): void
    {
        $superadmin = User::where('email', 'superadmin@edugen.id')->first() ?? User::factory()->create([
            'is_super_admin' => true,
        ]);

        $response = $this->actingAs($superadmin)->get(route('admin.landing-page.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/LandingPage/Index'));
    }

    public function test_superadmin_can_update_hero_section(): void
    {
        $superadmin = User::where('email', 'superadmin@edugen.id')->first() ?? User::factory()->create([
            'is_super_admin' => true,
        ]);

        $response = $this->actingAs($superadmin)->put(route('admin.landing-page.update', 'hero'), [
            'title' => 'Hero Banner Baru',
            'is_active' => true,
            'content' => [
                'headline' => 'Revolusi Perangkat Guru KBC 2026',
                'subheadline' => 'Menyusun RPP dan Soal Lebih Cepat',
                'badge_text' => 'Regulasi KMA & BSKAP Terverifikasi',
                'cta_primary_text' => 'Mulai Buat Modul',
                'cta_secondary_text' => 'Pelajari Alur',
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('landing_page_sections', [
            'key' => 'hero',
            'title' => 'Hero Banner Baru',
        ]);
    }

    public function test_regular_teacher_cannot_access_landing_page_management(): void
    {
        $teacher = User::factory()->create([
            'is_super_admin' => false,
        ]);

        $response = $this->actingAs($teacher)->get(route('admin.landing-page.index'));
        $response->assertStatus(403);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --filter=LandingPageManagementTest`
Expected: FAIL (Route or Controller not found).

- [ ] **Step 3: Implement LandingPageController and Routes**

Create `app/Http/Controllers/Admin/Landing/LandingPageController.php`:
- `index()`: fetches all `LandingPageSection::all()` keyed by `key`, passes to `Inertia::render('Admin/LandingPage/Index', ['sections' => ...])`.
- `update(Request $request, string $key)`: validates `content` (array) and `is_active` (boolean), updates record with `updated_by = auth()->id()`, redirects back with flash message.
- `reset(string $key)`: resets to seeder default.

Update `routes/web.php` inside `Route::middleware('superadmin')->prefix('admin/curriculum')` or separate `admin` group:
Add `admin/landing-page` routes.

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test --filter=LandingPageManagementTest`
Expected: PASS.

---

### Task 3: Superadmin Landing Page Inertia CMS Page

**Files:**
- Create: `resources/js/Pages/Admin/LandingPage/Index.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/HeroSectionForm.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/StatsSectionForm.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/WorkflowSectionForm.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/FeaturesSectionForm.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/FaqSectionForm.tsx`
- Create: `resources/js/Pages/Admin/LandingPage/Partials/FooterSectionForm.tsx`

**Interfaces:**
- Prop `sections`: Record<string, { id: number; key: string; title: string; content: any; is_active: boolean }>
- Tab switching state (`activeTab`: 'hero' | 'stats' | 'workflow' | 'features' | 'faq' | 'footer').
- Form submissions via Inertia `useForm`.
- Dynamic list operations for FAQs (add item, delete item, edit question/answer).

- [ ] **Step 1: Create partial tab form components**
- [ ] **Step 2: Create main Index.tsx page with tabs, live preview button, and alert feedback**
- [ ] **Step 3: Verify TypeScript compilation**
Run: `npm run build`

---

### Task 4: Integrate Dynamic Sections into Public Landing Page (`Welcome.tsx`)

**Files:**
- Modify: `routes/web.php` (update route `/` to retrieve and inject sections)
- Modify: `resources/js/Pages/Welcome.tsx`

**Interfaces:**
- Route `/` loads `LandingPageSection::where('is_active', true)->get()->keyBy('key')` and sends `sections` prop.
- `Welcome.tsx` defines safe fallbacks so if a section is absent, defaults are rendered cleanly.

- [ ] **Step 1: Update routes/web.php**
- [ ] **Step 2: Update Welcome.tsx to use dynamic `sections` props**
- [ ] **Step 3: Verify TypeScript compilation and front-end rendering**
Run: `npm run build`

---

### Task 5: Refactor Authenticated Shell to Modern Collapsible Sidebar Layout

**Files:**
- Create: `resources/js/Layouts/Sidebar/AppSidebar.tsx`
- Create: `resources/js/Layouts/Sidebar/AppHeader.tsx`
- Create: `resources/js/Layouts/Sidebar/MobileDrawer.tsx`
- Modify: `resources/js/Layouts/AuthenticatedLayout.tsx`

**Interfaces:**
- Desktop sidebar:
  - Width: 260px (expanded), 72px (collapsed icon-only mode).
  - Persists state in `localStorage.getItem('edugen_sidebar_collapsed')`.
  - Grouped navigation:
    1. Menu Utama (Dashboard)
    2. Perangkat KBC (CP, TP, Modul Ajar, Bank Soal, Rubrik)
    3. Lembaga / Madrasah (Profil & Kop, Tahun Ajaran, Guru, Undangan) - gated by institution admin
    4. Super Admin (Master CP, Import CP, Kelola Langganan, **Kelola Landing Page**) - gated by superadmin
    5. Billing & Akun (Paket Langganan, Profil)
- Top bar:
  - Sidebar toggle button (desktop) / Hamburger (mobile).
  - Dynamic breadcrumb.
  - Workspace selector dropdown.
  - User profile & logout dropdown.
- Mobile drawer:
  - Fixed off-canvas with transition and backdrop blur.

- [ ] **Step 1: Build AppSidebar component with navigation groups and tooltips for collapsed mode**
- [ ] **Step 2: Build AppHeader component with workspace switcher and user profile**
- [ ] **Step 3: Build MobileDrawer component**
- [ ] **Step 4: Update AuthenticatedLayout.tsx to integrate sidebar and header cleanly**
- [ ] **Step 5: Run tests and TypeScript build**
Run: `npm run build` and `php artisan test`

---

### Task 6: End-to-End Verification & Production Readiness Check

**Files / Commands:**
- Run full suite: `php artisan test`
- Run frontend build: `npm run build`
- Validate routes: `php artisan route:list`
- Optimize caches: `php artisan route:clear`, `php artisan view:clear`

- [ ] **Step 1: Run all backend tests and confirm 100% pass**
- [ ] **Step 2: Run complete frontend build and confirm clean production bundles**
- [ ] **Step 3: Document walkthrough and user instructions**
