<?php

namespace App\Http\Controllers\Admin\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\LearningElement;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CurriculumConfigController extends Controller
{
    /**
     * Display configuration dashboard for Curricula & Subjects
     */
    public function index(): Response
    {
        $curricula = CurriculumFramework::withCount('learningOutcomes')
            ->with([
                'learningOutcomes' => function ($q) {
                    $q->select('id', 'curriculum_code', 'subject_id', 'learning_element_id', 'phase_id', 'education_level_id', 'code', 'cp_text', 'status', 'version')
                        ->with([
                            'subject:id,code,name',
                            'phase:id,code,name,level_summary',
                            'educationLevel:id,code,name',
                            'element:id,code,name',
                        ])
                        ->orderBy('subject_id', 'asc')
                        ->orderBy('phase_id', 'asc');
                },
            ])
            ->orderBy('id', 'asc')
            ->get();

        $subjects = Subject::withCount(['learningOutcomes', 'elements'])
            ->with([
                'elements' => function ($q) {
                    $q->orderBy('name', 'asc')->withCount('learningOutcomes');
                },
                'learningOutcomes' => function ($q) {
                    $q->select('id', 'subject_id', 'curriculum_code', 'learning_element_id', 'phase_id', 'education_level_id', 'code', 'cp_text', 'status', 'version')
                        ->with([
                            'element:id,code,name',
                            'phase:id,code,name,level_summary',
                            'educationLevel:id,code,name',
                            'curriculum:id,code,name',
                        ])
                        ->orderBy('curriculum_code', 'asc')
                        ->orderBy('phase_id', 'asc');
                },
            ])
            ->orderBy('category', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $educationLevels = EducationLevel::orderBy('order_index', 'asc')->get();

        return Inertia::render('Admin/Curriculum/Config/Index', [
            'curricula' => $curricula,
            'subjects' => $subjects,
            'educationLevels' => $educationLevels,
        ]);
    }

    /**
     * Store a newly created curriculum framework
     */
    public function storeCurriculum(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:30', 'unique:curriculum_frameworks,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'aliases' => ['nullable'],
            'is_active' => ['boolean'],
        ]);

        $aliases = $this->normalizeAliases($validated['aliases'] ?? null);

        CurriculumFramework::create([
            'code' => strtoupper(trim($validated['code'])),
            'name' => trim($validated['name']),
            'description' => $validated['description'] ?? null,
            'aliases' => $aliases,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Kurikulum {$validated['name']} berhasil ditambahkan.");
    }

    /**
     * Update an existing curriculum framework
     */
    public function updateCurriculum(Request $request, CurriculumFramework $framework): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'aliases' => ['nullable'],
            'is_active' => ['boolean'],
        ]);

        $aliases = $this->normalizeAliases($validated['aliases'] ?? null);

        $framework->update([
            'name' => trim($validated['name']),
            'description' => $validated['description'] ?? null,
            'aliases' => $aliases,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Konfigurasi kurikulum {$framework->code} berhasil diperbarui.");
    }

    /**
     * Store a newly created subject
     */
    public function storeSubject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:subjects,code'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:GENERAL,RELIGION,ARABIC,VOCATIONAL,LOCAL'],
            'education_level_scope' => ['nullable', 'array'],
            'description' => ['nullable', 'string'],
            'aliases' => ['nullable'],
            'is_active' => ['boolean'],
        ]);

        $aliases = $this->normalizeAliases($validated['aliases'] ?? null);

        Subject::create([
            'code' => strtoupper(trim($validated['code'])),
            'name' => trim($validated['name']),
            'category' => $validated['category'],
            'education_level_scope' => $validated['education_level_scope'] ?? null,
            'description' => $validated['description'] ?? null,
            'aliases' => $aliases,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Mata pelajaran {$validated['name']} ({$validated['code']}) berhasil ditambahkan.");
    }

    /**
     * Update an existing subject
     */
    public function updateSubject(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:GENERAL,RELIGION,ARABIC,VOCATIONAL,LOCAL'],
            'education_level_scope' => ['nullable', 'array'],
            'description' => ['nullable', 'string'],
            'aliases' => ['nullable'],
            'is_active' => ['boolean'],
        ]);

        $aliases = $this->normalizeAliases($validated['aliases'] ?? null);

        $subject->update([
            'name' => trim($validated['name']),
            'category' => $validated['category'],
            'education_level_scope' => $validated['education_level_scope'] ?? null,
            'description' => $validated['description'] ?? null,
            'aliases' => $aliases,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Mata pelajaran {$subject->code} berhasil diperbarui.");
    }

    /**
     * Store a learning element manually
     */
    public function storeElement(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'code' => ['required', 'string', 'max:50', 'unique:learning_elements,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        LearningElement::create([
            'subject_id' => $validated['subject_id'],
            'code' => strtoupper(trim($validated['code'])),
            'name' => trim($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', "Elemen pembelajaran {$validated['name']} berhasil ditambahkan.");
    }

    /**
     * Update an existing learning element
     */
    public function updateElement(Request $request, LearningElement $element): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $element->update([
            'name' => trim($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', "Elemen {$element->code} berhasil diperbarui.");
    }

    /**
     * Delete a learning element if not used by learning outcomes
     */
    public function destroyElement(LearningElement $element): RedirectResponse
    {
        if ($element->learningOutcomes()->exists()) {
            return back()->with('error', "Elemen {$element->code} tidak dapat dihapus karena masih digunakan oleh Capaian Pembelajaran.");
        }

        $element->delete();

        return back()->with('success', "Elemen {$element->code} berhasil dihapus.");
    }

    /**
     * Convert comma-separated string or array into normalized uppercase alias array
     */
    protected function normalizeAliases(mixed $aliases): ?array
    {
        if (empty($aliases)) {
            return null;
        }

        if (is_string($aliases)) {
            $parts = explode(',', $aliases);
        } elseif (is_array($aliases)) {
            $parts = $aliases;
        } else {
            return null;
        }

        $result = [];
        foreach ($parts as $p) {
            $trimmed = strtoupper(trim((string) $p));
            if ($trimmed !== '' && !in_array($trimmed, $result, true)) {
                $result[] = $trimmed;
            }
        }

        return count($result) > 0 ? $result : null;
    }
}
