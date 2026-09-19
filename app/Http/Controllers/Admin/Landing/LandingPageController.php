<?php

namespace App\Http\Controllers\Admin\Landing;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSection;
use Database\Seeders\LandingPageSectionSeeder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    /**
     * Display the landing page management dashboard.
     */
    public function index(): Response
    {
        $sections = LandingPageSection::with('updatedByUser:id,name')
            ->get()
            ->keyBy('key');

        return Inertia::render('Admin/LandingPage/Index', [
            'sections' => $sections,
        ]);
    }

    /**
     * Update the specified landing page section.
     */
    public function update(Request $request, string $key)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $section = LandingPageSection::firstOrNew(['key' => $key]);
        $section->title = $validated['title'] ?? $section->title;
        $section->content = $validated['content'];
        $section->is_active = $validated['is_active'] ?? true;
        $section->updated_by = auth()->id();
        $section->save();

        return back()->with('success', "Bagian '{$section->title}' berhasil diperbarui.");
    }

    /**
     * Reset a section to default seeder values.
     */
    public function reset(string $key)
    {
        $seeder = new LandingPageSectionSeeder();
        $seeder->run();

        return back()->with('success', "Konten '{$key}' berhasil dikembalikan ke standar awal.");
    }
}
