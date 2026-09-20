<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\LearningElement;
use App\Models\LearningOutcome;
use App\Models\Phase;
use App\Models\Subject;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherCpBrowserController extends Controller
{
    /**
     * Display the read-only Teacher CP Browser
     */
    public function index(Request $request, TenantContext $tenantContext): Response
    {
        $curriculumCode = $request->input('curriculum_code');
        $educationLevelId = $request->input('education_level_id');
        $subjectId = $request->input('subject_id');
        $phaseId = $request->input('phase_id');
        $elementId = $request->input('element_id');
        $search = $request->input('search');

        $query = LearningOutcome::with([
            'curriculum:id,code,name',
            'regulation:id,code,title,authority,year',
            'subject:id,code,name,category',
            'phase:id,code,name,level_summary',
            'element:id,code,name',
            'educationLevel:id,code,name',
        ])
        ->where('status', LearningOutcome::STATUS_PUBLISHED); // Strict: only published CP

        // If specific curriculum is selected (not empty and not ALL)
        if (!empty($curriculumCode) && $curriculumCode !== 'ALL') {
            $query->where('curriculum_code', $curriculumCode);
        }

        if (!empty($educationLevelId) && $educationLevelId !== 'ALL') {
            $query->where('education_level_id', $educationLevelId);
        }

        if (!empty($subjectId) && $subjectId !== 'ALL') {
            $query->where('subject_id', $subjectId);
        }

        if (!empty($phaseId) && $phaseId !== 'ALL') {
            $query->where('phase_id', $phaseId);
        }

        if (!empty($elementId) && $elementId !== 'ALL') {
            $query->where('learning_element_id', $elementId);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('cp_text', 'like', "%{$search}%");
            });
        }

        $learningOutcomes = $query->orderBy('curriculum_code')
            ->orderBy('education_level_id')
            ->orderBy('subject_id')
            ->orderBy('phase_id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Curriculum/BrowseCp', [
            'learningOutcomes' => $learningOutcomes,
            'filters' => [
                'curriculum_code' => $curriculumCode ?: '',
                'education_level_id' => $educationLevelId ?: '',
                'subject_id' => $subjectId ?: '',
                'phase_id' => $phaseId ?: '',
                'element_id' => $elementId ?: '',
                'search' => $search ?: '',
            ],
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'educationLevels' => EducationLevel::orderBy('order_index')->get(['id', 'code', 'name']),
            'subjects' => Subject::where('is_active', true)->orderBy('category')->orderBy('name')->get(['id', 'code', 'name', 'category']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name', 'level_summary']),
            'elements' => !empty($subjectId)
                ? LearningElement::where('subject_id', $subjectId)->get(['id', 'code', 'name'])
                : [],
        ]);
    }

    /**
     * API search endpoint for Generator tools (TP/ATP, RPP, Soal)
     */
    public function apiSearch(Request $request): JsonResponse
    {
        $request->validate([
            'curriculum_code' => ['nullable', 'string'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
        ]);

        $query = LearningOutcome::with(['element:id,code,name', 'regulation:id,code,title', 'curriculum:code,name'])
            ->where('status', LearningOutcome::STATUS_PUBLISHED)
            ->where('subject_id', $request->input('subject_id'))
            ->where('phase_id', $request->input('phase_id'));

        if ($request->filled('curriculum_code')) {
            $query->where('curriculum_code', $request->input('curriculum_code'));
        }

        if ($request->filled('element_id')) {
            $query->where('learning_element_id', $request->input('element_id'));
        }

        $results = $query->get()->map(function ($lo) {
            return [
                'id' => $lo->id,
                'code' => $lo->code,
                'curriculum_code' => $lo->curriculum_code,
                'curriculum_name' => $lo->curriculum?->name ?? $lo->curriculum_code,
                'element_name' => $lo->element?->name ?? 'Umum',
                'cp_text' => $lo->cp_text,
                'outcome_text' => $lo->cp_text, // alias for frontend compatibility
                'source_locator' => $lo->source_locator,
                'regulation' => $lo->regulation?->title,
                'checksum' => $lo->checksum,
                'version' => $lo->version,
            ];
        });

        return response()->json([
            'success' => true,
            'count' => $results->count(),
            'is_available' => $results->isNotEmpty(),
            'message' => $results->isEmpty()
                ? 'CP untuk kombinasi mapel dan fase ini belum tersedia pada master platform.'
                : null,
            'data' => $results,
        ]);
    }
}
