<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\AssessmentRubric;
use App\Models\Grade;
use App\Models\Phase;
use App\Models\Subject;
use App\Services\AI\AiManager;
use App\Services\Curriculum\KbcPromptBuilder;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentRubricController extends Controller
{
    public function __construct(
        protected AiManager $aiManager,
        protected KbcPromptBuilder $promptBuilder,
        protected TenantContext $tenantContext
    ) {}

    /**
     * List rubrics
     */
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantContext->id();

        $query = AssessmentRubric::with(['subject', 'phase', 'grade', 'user'])
            ->where('tenant_id', $tenantId);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        if ($request->filled('rubric_type')) {
            $query->where('rubric_type', $request->input('rubric_type'));
        }

        $rubrics = $query->orderByDesc('created_at')->paginate(12)->withQueryString();

        return Inertia::render('Curriculum/Rubrics/Index', [
            'rubrics' => $rubrics,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'filters' => $request->only(['subject_id', 'phase_id', 'rubric_type']),
        ]);
    }

    /**
     * Show rubric creation form
     */
    public function create(): Response
    {
        return Inertia::render('Curriculum/Rubrics/Create', [
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'providers' => $this->aiManager->getProviderStatusesList(),
        ]);
    }

    /**
     * Generate rubric using AI
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'title' => ['required', 'string', 'max:255'],
            'rubric_type' => ['required', 'in:SIKAP_PANCA_CINTA,KINERJA_UNJUK_KERJA,PROYEK_KOLABORATIF,PORTOFOLIO_REFLEKTIF'],
            'context' => ['nullable', 'string', 'max:1000'],
            'provider' => ['nullable', 'string'],
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);
        $phase = Phase::findOrFail($validated['phase_id']);
        $grade = !empty($validated['grade_id']) ? Grade::find($validated['grade_id']) : null;

        $systemPrompt = $this->promptBuilder->buildRubricSystemPrompt();
        $userPrompt = $this->promptBuilder->buildRubricUserPrompt(
            $subject,
            $phase,
            $grade,
            $validated['rubric_type'],
            $validated['title'],
            $validated['context'] ?? null
        );

        $rubricData = $this->aiManager->generateJson(
            $systemPrompt,
            $userPrompt,
            'RUBRIC',
            $validated['provider'] ?? null
        );

        return response()->json([
            'success' => true,
            'rubric_data' => $rubricData,
        ]);
    }

    /**
     * Store rubric into database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'title' => ['required', 'string', 'max:255'],
            'rubric_type' => ['required', 'in:SIKAP_PANCA_CINTA,KINERJA_UNJUK_KERJA,PROYEK_KOLABORATIF,PORTOFOLIO_REFLEKTIF'],
            'description' => ['nullable', 'string'],
            'dimensions_data' => ['required', 'array', 'min:1'],
            'criteria_data' => ['nullable', 'array'],
            'scoring_guidelines' => ['nullable', 'string'],
        ]);

        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;

        $rubric = AssessmentRubric::create([
            'tenant_id' => $tenantId,
            'user_id' => $userId,
            'subject_id' => $validated['subject_id'],
            'phase_id' => $validated['phase_id'],
            'grade_id' => $validated['grade_id'] ?? null,
            'title' => $validated['title'],
            'rubric_type' => $validated['rubric_type'],
            'description' => $validated['description'] ?? null,
            'dimensions_data' => $validated['dimensions_data'],
            'criteria_data' => $validated['criteria_data'] ?? null,
            'scoring_guidelines' => $validated['scoring_guidelines'] ?? null,
        ]);

        return redirect()->route('curriculum.rubrics.show', $rubric->id)
            ->with('success', "Rubrik Asesmen \"{$rubric->title}\" berhasil disimpan.");
    }

    /**
     * Show rubric details with printable letterhead
     */
    public function show(AssessmentRubric $assessmentRubric): Response
    {
        if ($assessmentRubric->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentRubric->load([
            'subject',
            'phase',
            'grade',
            'user.teacherProfiles',
        ]);

        $institution = $this->tenantContext->institution();

        return Inertia::render('Curriculum/Rubrics/Show', [
            'rubric' => $assessmentRubric,
            'institution' => $institution,
        ]);
    }

    /**
     * Delete rubric
     */
    public function destroy(AssessmentRubric $assessmentRubric): RedirectResponse
    {
        if ($assessmentRubric->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $title = $assessmentRubric->title;
        $assessmentRubric->delete();

        return redirect()->route('curriculum.rubrics.index')
            ->with('success', "Rubrik \"{$title}\" berhasil dihapus.");
    }
}
