<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Institution;
use App\Services\TenantContext;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request, TenantContext $tenantContext): Response
    {
        $tenant = $tenantContext->get();
        $isIndividual = $tenant && $tenant->tenant_type === 'INDIVIDUAL';

        $institution = null;
        if ($tenant) {
            $institution = $tenant->institution;
            if (!$institution && $isIndividual) {
                $institution = Institution::create([
                    'tenant_id' => $tenant->id,
                    'name' => $tenant->name ?: 'Satuan Pendidikan',
                    'type' => 'SEKOLAH',
                    'default_curriculum_mode' => 'MERDEKA',
                    'status' => 'ACTIVE',
                ]);
            }
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'isIndividualTeacher' => $isIndividual,
            'institution' => $institution ? [
                'id' => $institution->id,
                'name' => $institution->name,
                'type' => $institution->type ?? 'SEKOLAH',
                'npsn' => $institution->npsn,
                'address' => $institution->address,
                'city' => $institution->city,
                'principal_name' => $institution->principal_name,
                'principal_id_number' => $institution->principal_id_number,
                'signature_city' => $institution->signature_city,
                'signature_title' => $institution->signature_title,
                'header_style' => $institution->header_style ?? 'LOGO_LEFT',
                'letterhead_line_1' => $institution->letterhead_line_1,
                'letterhead_line_2' => $institution->letterhead_line_2,
                'letterhead_line_3' => $institution->letterhead_line_3,
                'letterhead_subtext' => $institution->letterhead_subtext,
                'logo_path' => $institution->logo_path,
                'letterhead_path' => $institution->letterhead_path,
                'effective_logo_url' => $institution->effective_logo_url,
            ] : null,
        ]);
    }

    /**
     * Update school profile & letterhead for Individual Teacher
     */
    public function updateSchool(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $tenant = $tenantContext->get();
        if (!$tenant || $tenant->tenant_type !== 'INDIVIDUAL') {
            abort(403, 'Identitas sekolah untuk client institusi dikelola oleh Administrator Sekolah.');
        }

        $institution = $tenant->institution ?? Institution::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'name' => $tenant->name ?: 'Satuan Pendidikan',
                'type' => 'SEKOLAH',
                'default_curriculum_mode' => 'MERDEKA',
                'status' => 'ACTIVE',
            ]
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'npsn' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'principal_name' => ['nullable', 'string', 'max:150'],
            'principal_id_number' => ['nullable', 'string', 'max:50'],
            'signature_city' => ['nullable', 'string', 'max:100'],
            'signature_title' => ['nullable', 'string', 'max:100'],
            'header_style' => ['required', 'in:LOGO_LEFT,TEXT_ONLY,FULL_IMAGE'],
            'letterhead_line_1' => ['nullable', 'string', 'max:255'],
            'letterhead_line_2' => ['nullable', 'string', 'max:255'],
            'letterhead_line_3' => ['nullable', 'string', 'max:255'],
            'letterhead_subtext' => ['nullable', 'string', 'max:500'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'letterhead_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_logo' => ['nullable', 'boolean'],
            'remove_letterhead' => ['nullable', 'boolean'],
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

        if ($request->boolean('remove_letterhead')) {
            if ($institution->letterhead_path && Storage::disk('public')->exists($institution->letterhead_path)) {
                Storage::disk('public')->delete($institution->letterhead_path);
            }
            $validated['letterhead_path'] = null;
        } elseif ($request->hasFile('letterhead_image')) {
            if ($institution->letterhead_path && Storage::disk('public')->exists($institution->letterhead_path)) {
                Storage::disk('public')->delete($institution->letterhead_path);
            }
            $validated['letterhead_path'] = $request->file('letterhead_image')->store('institutions/letterheads', 'public');
        }

        if (empty($validated['letterhead_line_2'])) {
            $validated['letterhead_line_2'] = $validated['name'];
        }

        if (empty($validated['signature_city']) && !empty($validated['city'])) {
            $validated['signature_city'] = $validated['city'];
        }

        $institution->update($validated);

        return back()->with('success', 'Data sekolah/madrasah dan format kop surat berhasil disimpan.');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->boolean('remove_avatar')) {
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $user->avatar_path = null;
        } elseif ($request->hasFile('avatar')) {
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $user->avatar_path = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
