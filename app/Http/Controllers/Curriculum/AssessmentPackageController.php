<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\AssessmentPackage;
use App\Models\Grade;
use App\Models\LearningGoal;
use App\Models\Phase;
use App\Models\Semester;
use App\Models\Subject;
use App\Services\AI\AiManager;
use App\Services\Curriculum\AssessmentService;
use App\Services\Curriculum\GeneratedDocumentValidator;
use App\Services\Curriculum\KbcPromptBuilder;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentPackageController extends Controller
{
    public function __construct(
        protected AiManager $aiManager,
        protected KbcPromptBuilder $promptBuilder,
        protected GeneratedDocumentValidator $documentValidator,
        protected TenantContext $tenantContext,
        protected AssessmentService $assessmentService
    ) {}

    /**
     * List assessment packages
     */
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantContext->id();

        $query = AssessmentPackage::with(['subject', 'phase', 'grade', 'academicYear', 'semester', 'user'])
            ->withCount(['questions', 'matrices'])
            ->where('tenant_id', $tenantId);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        if ($request->filled('assessment_type')) {
            $query->where('assessment_type', $request->input('assessment_type'));
        }

        if ($request->filled('curriculum_code')) {
            $query->where('curriculum_code', $request->input('curriculum_code'));
        }

        $packages = $query->orderByDesc('created_at')->paginate(12)->withQueryString();

        return Inertia::render('Curriculum/Assessments/Index', [
            'packages' => $packages,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'filters' => $request->only(['subject_id', 'phase_id', 'assessment_type', 'curriculum_code']),
        ]);
    }

    /**
     * Show creation wizard
     */
    public function create(): Response
    {
        $tenantId = $this->tenantContext->id();

        return Inertia::render('Curriculum/Assessments/Create', [
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'academicYears' => AcademicYear::where('tenant_id', $tenantId)->with('semesters')->get(),
            'providers' => $this->aiManager->getProviderStatusesList(),
        ]);
    }

    /**
     * Generate assessment draft using AI
     */
    public function generate(Request $request): JsonResponse
    {
        $learningGoalIds = $request->input('learning_goal_ids') ?? $request->input('goal_ids');
        $totalQuestions = $request->input('total_questions') ?? $request->input('question_count');
        if (!$totalQuestions && ($request->filled('jml_pg') || $request->filled('jml_essay'))) {
            $totalQuestions = ((int) $request->input('jml_pg', 0)) + ((int) $request->input('jml_essay', 0));
        }
        if (!$totalQuestions) {
            $totalQuestions = 5;
        }

        $request->merge([
            'learning_goal_ids' => $learningGoalIds,
            'total_questions' => (int) $totalQuestions,
            'duration_minutes' => (int) ($request->input('duration_minutes') ?? 60),
        ]);

        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'title' => ['required', 'string', 'max:255'],
            'assessment_type' => ['required', 'in:FORMATIF,SUMATIF_LINGKUP_MATERI,SUMATIF_AKHIR_SEMESTER,SUMATIF_AKHIR_FASE'],
            'total_questions' => ['required', 'integer', 'min:1', 'max:50'],
            'duration_minutes' => ['required', 'integer', 'min:10', 'max:360'],
            'curriculum_code' => ['required', Rule::in(['MERDEKA', 'MADRASAH_KBC'])],
            'learning_goal_ids' => ['required', 'array', 'min:1'],
            'learning_goal_ids.*' => ['integer', 'exists:learning_goals,id'],
            'instructions' => ['nullable', 'string'],
            'teacher_preferences' => ['nullable', 'string'],
            'provider' => ['nullable', 'string'],
            'jml_pg' => ['nullable', 'integer', 'min:0', 'max:50'],
            'jml_essay' => ['nullable', 'integer', 'min:0', 'max:50'],
            'opsi_pg' => ['nullable', 'integer', 'in:3,4,5'],
            'tingkat' => ['nullable', 'string', 'max:50'],
            'berpikir' => ['nullable', 'string', 'max:50'],
            'image_count' => ['nullable', 'integer', 'min:0', 'max:10'],
        ]);

        $tenantId = $this->tenantContext->id();
        $this->assertAcademicContext($validated, $tenantId, $validated['learning_goal_ids']);

        $subject = Subject::findOrFail($validated['subject_id']);
        $phase = Phase::findOrFail($validated['phase_id']);
        $grade = Grade::findOrFail($validated['grade_id']);

        $learningGoals = LearningGoal::where('tenant_id', $tenantId)
            ->whereIn('id', $validated['learning_goal_ids'])
            ->get();

        $curriculumCode = (string) $validated['curriculum_code'];
        $opsiPg = isset($validated['opsi_pg']) ? (int) $validated['opsi_pg'] : 4;
        $totalQuestions = (int) $validated['total_questions'];
        $jmlPg = isset($validated['jml_pg']) ? (int) $validated['jml_pg'] : $totalQuestions;
        $jmlEssay = isset($validated['jml_essay']) ? (int) $validated['jml_essay'] : 0;
        if ($jmlPg + $jmlEssay !== $totalQuestions && !isset($validated['jml_pg'])) {
            $jmlPg = $totalQuestions;
            $jmlEssay = 0;
        }

        $tingkat = $validated['tingkat'] ?? 'Campuran';
        $berpikir = $validated['berpikir'] ?? 'Campuran';
        $teacherPreferences = $validated['teacher_preferences'] ?? ($validated['instructions'] ?? null);
        $imageCount = isset($validated['image_count']) ? (int) $validated['image_count'] : 0;

        $systemPrompt = $this->promptBuilder->buildAssessmentSystemPrompt(
            $opsiPg,
            $curriculumCode
        );
        $userPrompt = $this->promptBuilder->buildAssessmentUserPrompt(
            $subject,
            $phase,
            $grade,
            $learningGoals->toArray(),
            $validated['title'],
            $validated['assessment_type'],
            $jmlPg,
            $jmlEssay,
            $opsiPg,
            $tingkat,
            $berpikir,
            $teacherPreferences,
            $curriculumCode,
            $imageCount
        );

        $assessmentData = $this->aiManager->generateJson(
            $systemPrompt,
            $userPrompt,
            'ASSESSMENT',
            $validated['provider'] ?? null
        );

        $assessmentData = $this->documentValidator->assessment(
            $assessmentData,
            $totalQuestions,
            $validated['learning_goal_ids']
        );

        if (!empty($assessmentData['items']) && is_array($assessmentData['items'])) {
            foreach ($assessmentData['items'] as &$item) {
                $item['explanation'] = null;
            }
            unset($item);
        }

        return response()->json([
            'success' => true,
            'assessment_data' => $assessmentData,
            'package_data' => $assessmentData,
        ]);
    }

    /**
     * Upload an image stimulus
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $path = $request->file('image')->store('assessments/stimuli', 'public');
        $publicUrl = '/storage/' . $path;

        return response()->json([
            'success' => true,
            'path' => $publicUrl,
            'image_path' => $publicUrl,
            'url' => $publicUrl,
        ]);
    }

    /**
     * Store finalized assessment package into database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePackageData($request);
        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;

        $goalIds = array_values(array_unique(array_filter(array_map(
            fn ($item) => isset($item['learning_goal_id']) ? (int) $item['learning_goal_id'] : null,
            $validated['items']
        ))));
        $this->assertAcademicContext($validated, $tenantId, $goalIds);
        $this->assertCalendarContext($validated, $tenantId);

        $normalized = $this->documentValidator->assessment(
            ['title' => $validated['title'], 'instructions' => $validated['instructions'] ?? '', 'duration_minutes' => $validated['duration_minutes'], 'items' => $validated['items']],
            $validated['total_questions'],
            $goalIds
        );
        $validated['items'] = $normalized['items'];

        $package = $this->assessmentService->savePackage($validated, $tenantId, $userId);

        return redirect()->route('curriculum.assessments.show', $package->id)
            ->with('success', "Paket Asesmen \"{$package->title}\" berhasil disimpan.");
    }

    /**
     * Show assessment package preview & print sheet
     */
    public function show(AssessmentPackage $assessmentPackage): Response
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester',
            'user.teacherProfiles', 'matrices.learningGoal', 'questions.matrix',
        ]);

        $institution = $this->assessmentService->resolveInstitution($assessmentPackage, $this->tenantContext);

        return Inertia::render('Curriculum/Assessments/Show', [
            'package' => $assessmentPackage,
            'institution' => $institution,
        ]);
    }

    /**
     * Show form to edit existing assessment package
     */
    public function edit(AssessmentPackage $assessmentPackage): Response
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $tenantId = $this->tenantContext->id();

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester',
            'matrices.learningGoal', 'questions.matrix',
        ]);

        $learningGoals = LearningGoal::where('tenant_id', $tenantId)
            ->where('subject_id', $assessmentPackage->subject_id)
            ->where('phase_id', $assessmentPackage->phase_id)
            ->orderBy('code')
            ->get(['id', 'code', 'competency_kko', 'material_content', 'pedagogical_description', 'bloom_level']);

        return Inertia::render('Curriculum/Assessments/Edit', [
            'package' => $assessmentPackage,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'academicYears' => AcademicYear::where('tenant_id', $tenantId)->with('semesters')->get(),
            'learningGoals' => $learningGoals,
        ]);
    }

    /**
     * Update existing assessment package and its question items
     */
    public function update(Request $request, AssessmentPackage $assessmentPackage): RedirectResponse
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $validated = $this->validatePackageData($request);
        $this->assessmentService->updatePackage($assessmentPackage, $validated);

        return redirect()->route('curriculum.assessments.show', $assessmentPackage->id)
            ->with('success', "Paket Asesmen \"{$assessmentPackage->title}\" berhasil diperbarui.");
    }

    /**
     * Print naskah soal ujian
     */
    public function printSoal(AssessmentPackage $assessmentPackage)
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles',
            'questions' => fn($q) => $q->orderBy('question_number')
        ]);
        $institution = $this->assessmentService->resolveInstitution($assessmentPackage, $this->tenantContext);

        return view('curriculum.assessments.print_soal', [
            'package' => $assessmentPackage,
            'institution' => $institution,
        ]);
    }

    /**
     * Print matriks kisi-kisi asesmen (Landscape)
     */
    public function printKisi(AssessmentPackage $assessmentPackage)
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles',
            'matrices' => fn($q) => $q->with('learningGoal')->orderBy('question_number')
        ]);
        $institution = $this->assessmentService->resolveInstitution($assessmentPackage, $this->tenantContext);

        return view('curriculum.assessments.print_kisi', [
            'package' => $assessmentPackage,
            'institution' => $institution,
        ]);
    }

    /**
     * Print kunci jawaban & pembahasan
     */
    public function printKunci(AssessmentPackage $assessmentPackage)
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles',
            'questions' => fn($q) => $q->orderBy('question_number')
        ]);
        $institution = $this->assessmentService->resolveInstitution($assessmentPackage, $this->tenantContext);

        return view('curriculum.assessments.print_kunci', [
            'package' => $assessmentPackage,
            'institution' => $institution,
        ]);
    }

    /**
     * Download naskah soal as Word (.doc)
     */
    public function downloadWord(AssessmentPackage $assessmentPackage)
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $assessmentPackage->load([
            'subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles',
            'questions' => fn($q) => $q->orderBy('question_number')
        ]);
        $institution = $this->assessmentService->resolveInstitution($assessmentPackage, $this->tenantContext);
        $filename = 'Soal_' . \Illuminate\Support\Str::slug($assessmentPackage->title) . '.doc';

        $html = view('curriculum.assessments.print_soal', [
            'package' => $assessmentPackage,
            'institution' => $institution,
            'isWord' => true,
        ])->render();

        return response($html, 200, [
            'Content-Type' => 'application/vnd.ms-word; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
        ]);
    }

    /**
     * Delete assessment package
     */
    public function destroy(AssessmentPackage $assessmentPackage): RedirectResponse
    {
        if ($assessmentPackage->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $title = $assessmentPackage->title;
        $assessmentPackage->delete();

        return redirect()->route('curriculum.assessments.index')
            ->with('success', "Paket Asesmen \"{$title}\" berhasil dihapus.");
    }

    private function validatePackageData(Request $request): array
    {
        return $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'semester_id' => ['nullable', 'exists:semesters,id'],
            'curriculum_code' => ['required', Rule::in(['MERDEKA', 'MADRASAH_KBC'])],
            'title' => ['required', 'string', 'max:255'],
            'assessment_type' => ['required', 'in:FORMATIF,SUMATIF_LINGKUP_MATERI,SUMATIF_AKHIR_SEMESTER,SUMATIF_AKHIR_FASE'],
            'total_questions' => ['required', 'integer', 'min:1'],
            'duration_minutes' => ['required', 'integer', 'min:10', 'max:360'],
            'instructions' => ['nullable', 'string'],
            'settings' => ['nullable', 'array'],
            'status' => ['required', 'in:DRAFT,FINAL'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.question_number' => ['required', 'integer'],
            'items.*.learning_goal_id' => ['nullable', 'exists:learning_goals,id'],
            'items.*.indicator_text' => ['required', 'string'],
            'items.*.bloom_level' => ['required', Rule::in(['C1', 'C2', 'C3', 'C4', 'C5', 'C6'])],
            'items.*.cognitive_tier' => ['required', Rule::in(['L1', 'L2', 'L3'])],
            'items.*.difficulty_level' => ['required', Rule::in(['MUDAH', 'SEDANG', 'SULIT'])],
            'items.*.question_type' => ['required', Rule::in(['PG', 'PG_KOMPLEKS', 'MENJODOHKAN', 'ISIAN', 'URAIAN'])],
            'items.*.score_weight' => ['required', 'integer', 'min:1'],
            'items.*.stimulus_text' => ['nullable', 'string'],
            'items.*.image_prompt' => ['nullable', 'string'],
            'items.*.image_path' => ['nullable', 'string', 'max:500'],
            'items.*.question_text' => ['required', 'string'],
            'items.*.options_data' => ['nullable', 'array'],
            'items.*.correct_answer' => ['nullable', 'string'],
            'items.*.explanation' => ['nullable', 'string'],
        ]);
    }

    private function assertAcademicContext(array $data, int $tenantId, array $goalIds): void
    {
        $gradeMatchesPhase = Grade::whereKey($data['grade_id'])->where('phase_id', $data['phase_id'])->exists();
        $goalIds = array_values(array_unique(array_map('intval', $goalIds)));
        $matchedGoals = LearningGoal::where('tenant_id', $tenantId)
            ->where('subject_id', $data['subject_id'])
            ->where('phase_id', $data['phase_id'])
            ->whereIn('id', $goalIds)
            ->where(function ($query) use ($data) {
                $query->whereNull('grade_id')->orWhere('grade_id', $data['grade_id']);
            })
            ->count();

        if (!$gradeMatchesPhase || $goalIds === [] || $matchedGoals !== count($goalIds)) {
            throw ValidationException::withMessages([
                'items' => 'Mapel, fase, kelas, dan TP harus saling sesuai serta berasal dari workspace aktif.',
            ]);
        }
    }

    private function assertCalendarContext(array $data, int $tenantId): void
    {
        if (!empty($data['academic_year_id'])
            && !AcademicYear::whereKey($data['academic_year_id'])->where('tenant_id', $tenantId)->exists()) {
            throw ValidationException::withMessages(['academic_year_id' => 'Tahun ajaran bukan milik workspace aktif.']);
        }

        if (!empty($data['semester_id'])) {
            $validSemester = Semester::whereKey($data['semester_id'])
                ->whereHas('academicYear', fn ($query) => $query->where('tenant_id', $tenantId))
                ->when(!empty($data['academic_year_id']), fn ($query) => $query->where('academic_year_id', $data['academic_year_id']))
                ->exists();
            if (!$validSemester) {
                throw ValidationException::withMessages(['semester_id' => 'Semester tidak sesuai dengan tahun ajaran workspace aktif.']);
            }
        }
    }
}
