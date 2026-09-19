<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Role;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\TenantMembership;
use App\Models\User;
use App\Services\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionTeacherController extends Controller
{
    /**
     * List all teachers in this institution
     */
    public function index(Request $request, TenantContext $tenantContext): Response
    {
        $tenantId = $tenantContext->id();
        $institution = $tenantContext->institution();

        $query = TenantMembership::with([
            'user',
            'role',
            'user.teacherProfiles' => function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            },
        ])
        ->where('tenant_id', $tenantId)
        ->whereHas('role', function ($q) {
            $q->where('name', 'TEACHER');
        });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $memberships = $query->paginate(12)->withQueryString();

        $activeTeachersCount = TenantMembership::where('tenant_id', $tenantId)
            ->whereHas('role', fn($q) => $q->where('name', 'TEACHER'))
            ->where('membership_status', 'ACTIVE')
            ->count();

        return Inertia::render('Institution/Teachers/Index', [
            'memberships' => $memberships,
            'filters' => $request->only(['search']),
            'stats' => [
                'active_teachers' => $activeTeachersCount,
                'total_teachers' => $memberships->total(),
            ],
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'education_level_id']),
        ]);
    }

    /**
     * Create teacher manually and assign TEACHER role in institution
     */
    public function store(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
            'employee_no' => ['nullable', 'string', 'max:50'], // NIP
            'nuptk' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'employment_status' => ['required', 'in:PNS,PPPK,GTY,GTT,HONORER'],
            'primary_subject_id' => ['nullable', 'exists:subjects,id'],
            'grade_scope' => ['nullable', 'array'],
        ]);

        $tenantId = $tenantContext->id();
        $institutionId = $tenantContext->institution()?->id;

        // Check if user already exists or create new
        $user = User::firstOrNew(['email' => $validated['email']]);
        if (!$user->exists) {
            $user->name = $validated['name'];
            $user->password = Hash::make($validated['password'] ?: Str::random(12));
            $user->status = 'ACTIVE';
            $user->email_verified_at = now();
            $user->save();
        }

        $teacherRole = Role::where('name', Role::TEACHER)->firstOrFail();

        // Check if already member
        $existingMembership = TenantMembership::where('tenant_id', $tenantId)
            ->where('user_id', $user->id)
            ->first();

        if ($existingMembership) {
            return back()->with('error', "Pengguna dengan email {$user->email} sudah terdaftar sebagai anggota di sekolah ini.");
        }

        TenantMembership::create([
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'role_id' => $teacherRole->id,
            'membership_status' => 'ACTIVE',
            'invited_by' => $request->user()->id,
            'joined_at' => now(),
            'is_default' => true,
        ]);

        TeacherProfile::updateOrCreate(
            [
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
            ],
            [
                'institution_id' => $institutionId,
                'employee_no' => $validated['employee_no'],
                'nuptk' => $validated['nuptk'],
                'phone' => $validated['phone'],
                'employment_status' => $validated['employment_status'],
                'primary_subject_id' => $validated['primary_subject_id'],
                'grade_scope' => $validated['grade_scope'] ?? [],
                'is_active' => true,
            ]
        );

        if (!$user->last_active_tenant_id) {
            $user->update(['last_active_tenant_id' => $tenantId]);
        }

        return back()->with('success', "Akun guru {$user->name} ({$user->email}) berhasil ditambahkan ke lembaga.");
    }

    /**
     * Update teacher profile details
     */
    public function update(Request $request, TeacherProfile $teacherProfile, TenantContext $tenantContext): RedirectResponse
    {
        if ($teacherProfile->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'employee_no' => ['nullable', 'string', 'max:50'],
            'nuptk' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'employment_status' => ['required', 'in:PNS,PPPK,GTY,GTT,HONORER'],
            'primary_subject_id' => ['nullable', 'exists:subjects,id'],
            'grade_scope' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $teacherProfile->user->update(['name' => $validated['name']]);

        $teacherProfile->update([
            'employee_no' => $validated['employee_no'],
            'nuptk' => $validated['nuptk'],
            'phone' => $validated['phone'],
            'employment_status' => $validated['employment_status'],
            'primary_subject_id' => $validated['primary_subject_id'],
            'grade_scope' => $validated['grade_scope'] ?? [],
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Sync membership status
        TenantMembership::where('tenant_id', $teacherProfile->tenant_id)
            ->where('user_id', $teacherProfile->user_id)
            ->update([
                'membership_status' => $request->boolean('is_active', true) ? 'ACTIVE' : 'SUSPENDED',
            ]);

        return back()->with('success', "Data profil guru {$teacherProfile->user->name} berhasil diperbarui.");
    }

    /**
     * Toggle teacher active/inactive status
     */
    public function toggleStatus(TeacherProfile $teacherProfile, TenantContext $tenantContext): RedirectResponse
    {
        if ($teacherProfile->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        $newStatus = !$teacherProfile->is_active;
        $teacherProfile->update(['is_active' => $newStatus]);

        TenantMembership::where('tenant_id', $teacherProfile->tenant_id)
            ->where('user_id', $teacherProfile->user_id)
            ->update([
                'membership_status' => $newStatus ? 'ACTIVE' : 'SUSPENDED',
            ]);

        $actionText = $newStatus ? 'diaktifkan kembali' : 'dinonaktifkan sementara';
        return back()->with('success', "Akun guru {$teacherProfile->user->name} berhasil {$actionText}.");
    }
}
