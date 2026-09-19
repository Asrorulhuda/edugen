<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\Institution;
use App\Services\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionProfileController extends Controller
{
    /**
     * Show institution profile edit form
     */
    public function edit(TenantContext $tenantContext): Response
    {
        $tenant = $tenantContext->get();
        if (!$tenant) {
            abort(404, 'Tenant tidak ditemukan.');
        }

        // Retrieve or create institution profile record for this tenant
        $institution = Institution::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'name' => $tenant->name,
                'type' => 'MADRASAH',
                'default_curriculum_mode' => 'MADRASAH_KBC',
                'status' => 'ACTIVE',
            ]
        );

        return Inertia::render('Institution/Profile', [
            'institution' => $institution,
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'educationLevels' => EducationLevel::orderBy('order_index')->get(['code', 'name', 'category']),
        ]);
    }

    /**
     * Update institution profile information
     */
    public function update(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $tenant = $tenantContext->get();
        if (!$tenant) {
            abort(404, 'Tenant tidak ditemukan.');
        }

        $institution = $tenant->institution ?? Institution::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'name' => $tenant->name,
                'type' => 'SD',
                'default_curriculum_mode' => 'MERDEKA',
                'status' => 'ACTIVE',
            ]
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'npsn' => ['nullable', 'string', 'max:20'],
            'nsm' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:100'],
            'website' => ['nullable', 'string', 'max:150'],
            'principal_name' => ['nullable', 'string', 'max:150'],
            'principal_id_number' => ['nullable', 'string', 'max:50'],
            'default_curriculum_mode' => ['required', 'string', 'exists:curriculum_frameworks,code'],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:5120'],
            'remove_logo' => ['nullable', 'boolean'],
        ]);

        if ($request->boolean('remove_logo')) {
            if ($institution->logo_path && Storage::disk('public')->exists($institution->logo_path)) {
                Storage::disk('public')->delete($institution->logo_path);
            }
            $validated['logo_path'] = null;
        } elseif ($request->hasFile('logo')) {
            if ($institution->logo_path && Storage::disk('public')->exists($institution->logo_path)) {
                Storage::disk('public')->delete($institution->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('institutions/logos', 'public');
        }

        // Auto-sync letterhead defaults with real profile information
        if (empty($institution->letterhead_line_2) || $institution->letterhead_line_2 === $institution->name) {
            $validated['letterhead_line_2'] = $validated['name'];
        }

        if (!empty($validated['city'])) {
            if (empty($institution->signature_city) || $institution->signature_city === 'Jakarta') {
                $validated['signature_city'] = $validated['city'];
            }
        }

        $isMadrasah = in_array(strtoupper($validated['type']), ['MADRASAH', 'MI', 'MTS', 'MA', 'MAK', 'PESANTREN']);
        if (!$isMadrasah && (empty($institution->letterhead_line_1) || str_contains(strtoupper($institution->letterhead_line_1), 'KEMENTERIAN AGAMA'))) {
            $cityName = strtoupper($validated['city'] ?: 'KOTA');
            $validated['letterhead_line_1'] = "PEMERINTAH {$cityName} / DINAS PENDIDIKAN";
        } elseif ($isMadrasah && empty($institution->letterhead_line_1)) {
            $validated['letterhead_line_1'] = 'KEMENTERIAN AGAMA REPUBLIK INDONESIA';
        }

        // Auto-generate official letterhead subtext from address and contacts if still dummy
        if (empty($institution->letterhead_subtext) || str_contains($institution->letterhead_subtext, 'Jl. Raya Pendidikan No. 123')) {
            $addressParts = array_filter([
                $validated['address'] ?? null,
                $validated['city'] ?? null,
                !empty($validated['province']) ? (!empty($validated['postal_code']) ? "{$validated['province']} {$validated['postal_code']}" : $validated['province']) : null,
            ]);
            $contactParts = array_filter([
                !empty($validated['phone']) ? "Telp: {$validated['phone']}" : null,
                !empty($validated['email']) ? "Email: {$validated['email']}" : null,
                $validated['website'] ?? null,
            ]);
            $sub = implode(', ', $addressParts);
            if (!empty($contactParts)) {
                $sub .= ($sub ? '. ' : '') . implode(' | ', $contactParts);
            }
            if (!empty($sub)) {
                $validated['letterhead_subtext'] = $sub;
            }
        }

        $institution->update($validated);

        // Sync tenant name if updated
        if ($tenant->name !== $validated['name']) {
            $tenant->update(['name' => $validated['name']]);
        }

        return back()->with('success', 'Profil lembaga dan data kepala sekolah berhasil diperbarui.');
    }

    /**
     * Show branding & letterhead template settings
     */
    public function branding(TenantContext $tenantContext): Response
    {
        $tenant = $tenantContext->get();
        $institution = $tenant->institution;

        return Inertia::render('Institution/Branding', [
            'institution' => $institution,
        ]);
    }

    /**
     * Update branding and letterhead template
     */
    public function updateBranding(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $tenant = $tenantContext->get();
        $institution = $tenant->institution;

        $validated = $request->validate([
            'header_style' => ['required', 'in:LOGO_LEFT,TEXT_ONLY,FULL_IMAGE'],
            'letterhead_line_1' => ['nullable', 'string', 'max:255'],
            'letterhead_line_2' => ['nullable', 'string', 'max:255'],
            'letterhead_line_3' => ['nullable', 'string', 'max:255'],
            'letterhead_subtext' => ['nullable', 'string', 'max:500'],
            'signature_city' => ['nullable', 'string', 'max:100'],
            'signature_title' => ['required', 'string', 'max:100'],
            'letterhead_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ]);

        if ($request->hasFile('letterhead_image')) {
            if ($institution->letterhead_path && Storage::disk('public')->exists($institution->letterhead_path)) {
                Storage::disk('public')->delete($institution->letterhead_path);
            }
            $validated['letterhead_path'] = $request->file('letterhead_image')->store('institutions/letterheads', 'public');
        }

        $institution->update($validated);

        return back()->with('success', 'Format kop surat dan template dokumen export berhasil diperbarui.');
    }
}
