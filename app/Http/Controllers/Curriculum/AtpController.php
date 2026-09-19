<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\LearningGoal;
use App\Models\LearningGoalSequence;
use App\Models\Phase;
use App\Models\Subject;
use App\Services\AI\AiManager;
use App\Services\Curriculum\KbcPromptBuilder;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class AtpController extends Controller
{
    public function __construct(
        protected AiManager $aiManager,
        protected KbcPromptBuilder $promptBuilder,
        protected TenantContext $tenantContext
    ) {}

    /**
     * Display list of saved ATP sequences
     */
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantContext->id();

        $query = LearningGoalSequence::with(['subject', 'phase', 'grade', 'academicYear', 'creator'])
            ->where('tenant_id', $tenantId);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        $sequences = $query->orderByDesc('updated_at')->paginate(10)->withQueryString();

        return Inertia::render('Curriculum/Atp/Index', [
            'sequences' => $sequences,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'filters' => $request->only(['subject_id', 'phase_id']),
        ]);
    }

    /**
     * Show ATP creation wizard
     */
    public function create(): Response
    {
        $tenantId = $this->tenantContext->id();

        return Inertia::render('Curriculum/Atp/Create', [
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'academicYears' => AcademicYear::where('tenant_id', $tenantId)->with('semesters')->get(),
            'providers' => $this->aiManager->getProviderStatusesList(),
        ]);
    }

    /**
     * API to generate ATP using AI
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'goal_ids' => ['required', 'array', 'min:1'],
            'goal_ids.*' => ['exists:learning_goals,id'],
            'rationale' => ['nullable', 'string', 'max:1000'],
            'provider' => ['nullable', 'string'],
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);
        $phase = Phase::findOrFail($validated['phase_id']);
        $grade = Grade::findOrFail($validated['grade_id']);

        $goals = LearningGoal::whereIn('id', $validated['goal_ids'])->get()->toArray();

        $systemPrompt = $this->promptBuilder->buildAtpSystemPrompt();
        $userPrompt = $this->promptBuilder->buildAtpUserPrompt(
            $subject,
            $phase,
            $grade,
            $goals,
            $validated['rationale'] ?? null
        );

        $result = $this->aiManager->generateJson(
            $systemPrompt,
            $userPrompt,
            'ATP',
            $validated['provider'] ?? null
        );

        return response()->json([
            'success' => true,
            'atp_data' => $result,
        ]);
    }

    /**
     * Store finalized ATP into database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'title' => ['required', 'string', 'max:255'],
            'rationale' => ['nullable', 'string'],
            'total_hours_allocated' => ['required', 'integer', 'min:1'],
            'sequence_data' => ['required', 'array'],
            'status' => ['required', 'in:DRAFT,FINAL'],
        ]);

        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;

        $sequence = LearningGoalSequence::create(array_merge($validated, [
            'tenant_id' => $tenantId,
            'user_id' => $userId,
        ]));

        return redirect()->route('curriculum.atp.show', $sequence->id)
            ->with('success', "Alur Tujuan Pembelajaran (ATP) \"{$sequence->title}\" berhasil disimpan.");
    }

    /**
     * Show ATP detail
     */
    public function show(LearningGoalSequence $sequence): Response
    {
        if ($sequence->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $sequence->load(['subject', 'phase', 'grade', 'academicYear', 'user.teacherProfiles']);
        $institution = $this->tenantContext->institution();

        return Inertia::render('Curriculum/Atp/Show', [
            'sequence' => $sequence,
            'institution' => $institution,
        ]);
    }

    /**
     * Print official ATP document (Landscape format)
     */
    public function print(LearningGoalSequence $sequence): HttpResponse
    {
        if ($sequence->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $sequence->load(['subject', 'phase', 'grade', 'academicYear', 'user.teacherProfiles']);
        $institution = $this->tenantContext->institution();

        return response()->view('curriculum.atp.print', [
            'sequence' => $sequence,
            'institution' => $institution,
        ]);
    }

    /**
     * Download ATP document in Word format (.doc)
     */
    public function downloadWord(LearningGoalSequence $sequence): HttpResponse
    {
        if ($sequence->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $sequence->load(['subject', 'phase', 'grade', 'academicYear', 'user.teacherProfiles']);
        $institution = $this->tenantContext->institution();

        $content = view('curriculum.atp.print', [
            'sequence' => $sequence,
            'institution' => $institution,
        ])->render();

        $filename = 'ATP_' . preg_replace('/[^A-Za-z0-9_]/', '_', $sequence->title) . '.doc';

        return response($content)
            ->header('Content-Type', 'application/vnd.ms-word')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    /**
     * Delete an ATP sequence
     */
    public function destroy(LearningGoalSequence $sequence): RedirectResponse
    {
        if ($sequence->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $sequence->delete();

        return redirect()->route('curriculum.atp.index')
            ->with('success', 'Alur Tujuan Pembelajaran (ATP) berhasil dihapus.');
    }
}
