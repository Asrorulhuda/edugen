<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\LearningGoal;
use App\Models\LearningOutcome;
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

class TpGeneratorController extends Controller
{
    public function __construct(
        protected AiManager $aiManager,
        protected KbcPromptBuilder $promptBuilder,
        protected TenantContext $tenantContext
    ) {}

    /**
     * List all generated TP in this workspace
     */
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantContext->id();

        $query = LearningGoal::with(['subject', 'phase', 'grade', 'learningOutcome.element'])
            ->where('tenant_id', $tenantId);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        $goals = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Curriculum/Tp/Index', [
            'goals' => $goals,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'filters' => $request->only(['subject_id', 'phase_id']),
        ]);
    }

    /**
     * Show wizard form to generate TP
     */
    public function create(): Response
    {
        return Inertia::render('Curriculum/Tp/Create', [
            'curricula' => \App\Models\CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'providers' => $this->aiManager->getProviderStatusesList(),
        ]);
    }

    /**
     * API to generate candidate TP using selected AI provider
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'learning_outcome_id' => ['required', 'exists:learning_outcomes,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'target_count' => ['nullable', 'integer', 'min:1', 'max:10'],
            'provider' => ['nullable', 'string'],
            'additional_context' => ['nullable', 'string', 'max:1000'],
        ]);

        $learningOutcome = LearningOutcome::with(['element', 'curriculum', 'regulation'])
            ->findOrFail($validated['learning_outcome_id']);

        $subject = Subject::findOrFail($validated['subject_id']);
        $phase = Phase::findOrFail($validated['phase_id']);
        $grade = !empty($validated['grade_id']) ? Grade::find($validated['grade_id']) : null;
        $targetCount = $validated['target_count'] ?? 3;

        $systemPrompt = $this->promptBuilder->buildTpSystemPrompt();
        $userPrompt = $this->promptBuilder->buildTpUserPrompt(
            $learningOutcome,
            $subject,
            $phase,
            $grade,
            $targetCount,
            $validated['additional_context'] ?? null
        );

        $result = $this->aiManager->generateJson(
            $systemPrompt,
            $userPrompt,
            'TP',
            $validated['provider'] ?? null
        );

        $learningGoals = $result['learning_goals'] ?? [];

        return response()->json([
            'success' => true,
            'learning_goals' => $learningGoals,
            'meta' => [
                'subject_name' => $subject->name,
                'phase_name' => $phase->name,
                'cp_element' => $learningOutcome->element?->name,
                'regulation' => $learningOutcome->regulation?->title,
            ],
        ]);
    }

    /**
     * Store selected generated TP into database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'learning_outcome_id' => ['required', 'exists:learning_outcomes,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'goals' => ['required', 'array', 'min:1'],
            'goals.*.code' => ['required', 'string', 'max:50'],
            'goals.*.bloom_level' => ['required', 'in:C1,C2,C3,C4,C5,C6'],
            'goals.*.competency_kko' => ['required', 'string', 'max:100'],
            'goals.*.material_content' => ['required', 'string', 'max:255'],
            'goals.*.pedagogical_description' => ['required', 'string'],
            'goals.*.panca_cinta_dimensions' => ['nullable', 'array'],
            'goals.*.deep_learning_elements' => ['nullable', 'array'],
            'goals.*.profil_lulusan_dimensions' => ['nullable', 'array'],
            'goals.*.estimated_hours' => ['nullable', 'integer', 'min:1'],
        ]);

        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;

        $createdCount = 0;
        foreach ($validated['goals'] as $goalData) {
            LearningGoal::create([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'learning_outcome_id' => $validated['learning_outcome_id'],
                'subject_id' => $validated['subject_id'],
                'phase_id' => $validated['phase_id'],
                'grade_id' => $validated['grade_id'] ?? null,
                'code' => $goalData['code'],
                'bloom_level' => $goalData['bloom_level'],
                'competency_kko' => $goalData['competency_kko'],
                'material_content' => $goalData['material_content'],
                'pedagogical_description' => $goalData['pedagogical_description'],
                'panca_cinta_dimensions' => $goalData['panca_cinta_dimensions'] ?? [],
                'deep_learning_elements' => $goalData['deep_learning_elements'] ?? [],
                'profil_lulusan_dimensions' => $goalData['profil_lulusan_dimensions'] ?? [],
                'estimated_hours' => $goalData['estimated_hours'] ?? 2,
                'is_verified' => true,
            ]);
            $createdCount++;
        }

        return redirect()->route('curriculum.tp.index')
            ->with('success', "{$createdCount} Tujuan Pembelajaran (TP) berhasil disimpan ke bank kurikulum.");
    }

    /**
     * Delete a single TP
     */
    public function destroy(LearningGoal $learningGoal): RedirectResponse
    {
        if ($learningGoal->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $code = $learningGoal->code;
        $learningGoal->delete();

        return back()->with('success', "Tujuan Pembelajaran {$code} berhasil dihapus.");
    }
}
