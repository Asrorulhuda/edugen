<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Services\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    /**
     * List all academic years and semesters in the institution
     */
    public function index(TenantContext $tenantContext): Response
    {
        $tenantId = $tenantContext->id();
        $institutionId = $tenantContext->institution()?->id;

        $academicYears = AcademicYear::with('semesters')
            ->where('tenant_id', $tenantId)
            ->orderByDesc('starts_at')
            ->get();

        return Inertia::render('Institution/AcademicYears', [
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a newly created academic year with 2 default semesters (Ganjil & Genap)
     */
    public function store(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'], // e.g. 2026/2027
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'set_active' => ['boolean'],
        ]);

        $tenantId = $tenantContext->id();
        $institutionId = $tenantContext->institution()?->id;
        $setActive = $request->boolean('set_active', false);

        if ($setActive) {
            AcademicYear::where('tenant_id', $tenantId)->update(['is_active' => false]);
        }

        $ay = AcademicYear::create([
            'tenant_id' => $tenantId,
            'institution_id' => $institutionId,
            'label' => $validated['label'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'is_active' => $setActive,
        ]);

        // Automatically create Semester Ganjil & Genap
        Semester::create([
            'academic_year_id' => $ay->id,
            'type' => 'ODD',
            'label' => 'Semester Ganjil',
            'is_active' => $setActive, // Active by default if academic year is active
        ]);

        Semester::create([
            'academic_year_id' => $ay->id,
            'type' => 'EVEN',
            'label' => 'Semester Genap',
            'is_active' => false,
        ]);

        return back()->with('success', "Tahun ajaran {$ay->label} beserta Semester Ganjil & Genap berhasil dibuat.");
    }

    /**
     * Set specific academic year as active
     */
    public function activate(AcademicYear $academicYear, TenantContext $tenantContext): RedirectResponse
    {
        if ($academicYear->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        AcademicYear::where('tenant_id', $tenantContext->id())->update(['is_active' => false]);
        $academicYear->update(['is_active' => true]);

        return back()->with('success', "Tahun ajaran {$academicYear->label} telah ditetapkan sebagai tahun aktif.");
    }

    /**
     * Set specific semester as active
     */
    public function activateSemester(Semester $semester, TenantContext $tenantContext): RedirectResponse
    {
        $academicYear = $semester->academicYear;
        if ($academicYear->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        Semester::where('academic_year_id', $academicYear->id)->update(['is_active' => false]);
        $semester->update(['is_active' => true]);

        return back()->with('success', "{$semester->label} telah diaktifkan untuk tahun ajaran {$academicYear->label}.");
    }

    /**
     * Delete an academic year
     */
    public function destroy(AcademicYear $academicYear, TenantContext $tenantContext): RedirectResponse
    {
        if ($academicYear->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        if ($academicYear->is_active) {
            return back()->with('error', 'Tahun ajaran aktif tidak dapat dihapus. Aktifkan tahun ajaran lain terlebih dahulu.');
        }

        $label = $academicYear->label;
        $academicYear->delete();

        return back()->with('success', "Tahun ajaran {$label} berhasil dihapus.");
    }
}
