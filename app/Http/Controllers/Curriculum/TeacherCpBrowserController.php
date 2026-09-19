<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\CurriculumFramework;
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
        // Determine default curriculum mode based on institution or personal preference
        $institution = $tenantContext->institution();
        $defaultCurriculum = $institution?->default_curriculum_mode ?? 'MERDEKA';

        $curriculumCode = $request->input('curriculum_code', $defaultCurriculum);

        $query = LearningOutcome::with([
            'curriculum:id,code,name',
            'regulation:id,code,title,authority,year',
            'subject:id,code,name,category',
            'phase:id,code,name,level_summary',
            'element:id,code,name',
            'educationLevel:id,code,name',
        ])
        ->where('status', LearningOutcome::STATUS_PUBLISHED); // Strict: only published CP

        if ($curriculumCode) {
            $query->where('curriculum_code', $curriculumCode);
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        if ($request->filled('element_id')) {
            $query->where('learning_element_id', $request->input('element_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('cp_text', 'like', "%{$search}%");
            });
        }

        $learningOutcomes = $query->orderBy('subject_id')
            ->orderBy('phase_id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Curriculum/BrowseCp', [
            'learningOutcomes' => $learningOutcomes,
            'filters' => [
                'curriculum_code' => $curriculumCode,
                'subject_id' => $request->input('subject_id'),
                'phase_id' => $request->input('phase_id'),
                'element_id' => $request->input('element_id'),
                'search' => $request->input('search'),
            ],
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name', 'category']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name', 'level_summary']),
            'elements' => $request->filled('subject_id')
                ? LearningElement::where('subject_id', $request->input('subject_id'))->get(['id', 'code', 'name'])
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
