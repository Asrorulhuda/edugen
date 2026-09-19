<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Institution;
use App\Models\LearningGoal;
use App\Models\LearningOutcome;
use App\Models\Phase;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\TeachingModule;
use App\Services\AI\AiManager;
use App\Services\Curriculum\KbcPromptBuilder;
use App\Services\Curriculum\GeneratedDocumentValidator;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TeachingModuleController extends Controller
{
    public function __construct(
        protected AiManager $aiManager,
        protected KbcPromptBuilder $promptBuilder,
        protected GeneratedDocumentValidator $documentValidator,
        protected TenantContext $tenantContext
    ) {}

    /**
     * List teaching modules
     */
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantContext->id();

        $query = TeachingModule::with(['subject', 'phase', 'grade', 'academicYear', 'semester', 'user'])
            ->where('tenant_id', $tenantId);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        if ($request->filled('curriculum_code')) {
            $query->where('curriculum_code', $request->input('curriculum_code'));
        }

        $modules = $query->orderByDesc('created_at')->paginate(12)->withQueryString();

        return Inertia::render('Curriculum/Modules/Index', [
            'modules' => $modules,
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'filters' => $request->only(['subject_id', 'phase_id', 'curriculum_code']),
        ]);
    }

    /**
     * Show wizard form to generate a new Modul Ajar
     */
    public function create(): Response
    {
        $tenantId = $this->tenantContext->id();
        $institution = $this->resolveInstitution();

        return Inertia::render('Curriculum/Modules/Create', [
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name']),
            'grades' => Grade::with('educationLevel:id,code,name')->orderBy('order_index')->get(['id', 'grade_number', 'name', 'phase_id']),
            'academicYears' => AcademicYear::where('tenant_id', $tenantId)->with('semesters')->get(),
            'providers' => $this->aiManager->getProviderStatusesList(),
            'institution' => $institution ? [
                'name' => $institution->name,
                'npsn' => $institution->npsn,
                'logo_path' => $institution->logo_path,
            ] : null,
        ]);
    }

    /**
     * API to search available TPs for module creation
     */
    public function apiGetGoals(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
        ]);

        $tenantId = $this->tenantContext->id();

        $query = LearningGoal::where('tenant_id', $tenantId)
            ->where('subject_id', $validated['subject_id'])
            ->where('phase_id', $validated['phase_id']);

        if (!empty($validated['grade_id'])) {
            $query->where(function ($q) use ($validated) {
                $q->where('grade_id', $validated['grade_id'])
                  ->orWhereNull('grade_id');
            });
        }

        $goals = $query->orderBy('code')->get([
            'id', 'code', 'bloom_level', 'competency_kko', 'material_content', 'pedagogical_description', 'estimated_hours',
        ]);

        return response()->json([
            'success' => true,
            'goals' => $goals,
            'data' => $goals,
        ]);
    }

    /**
     * API to generate candidate Modul Ajar using AI
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'topic_name' => ['required', 'string', 'max:255'],
            'goal_ids' => ['required', 'array', 'min:1'],
            'goal_ids.*' => ['exists:learning_goals,id'],
            'alokasi_jp' => ['nullable', 'integer', 'min:1', 'max:20'],
            'menit_per_jp' => ['nullable', 'integer', 'min:15', 'max:90'],
            'kurikulum_type' => ['nullable', 'string'],
            'dpl_selected' => ['nullable', 'string'],
            'pc_selected' => ['nullable', 'string'],
            'pedagogis_selected' => ['nullable', 'string'],
            'provider' => ['nullable', 'string'],
            'teacher_notes' => ['nullable', 'string', 'max:1000'],
            'school_name' => ['nullable', 'string', 'max:255'],
            'curriculum_code' => ['required', Rule::in(['MERDEKA', 'MADRASAH_KBC'])],
        ]);

        $this->assertAcademicContext($validated, $this->tenantContext->id(), 'goal_ids');

        $subject = Subject::findOrFail($validated['subject_id']);
        $phase = Phase::findOrFail($validated['phase_id']);
        $grade = Grade::findOrFail($validated['grade_id']);
        $alokasiJp = $validated['alokasi_jp'] ?? 2;
        $menitPerJp = $validated['menit_per_jp'] ?? 40;
        $kurikulumType = $validated['curriculum_code'];
        $resolvedSchoolName = !empty($validated['school_name'])
            ? trim($validated['school_name'])
            : ($this->resolveInstitution()?->name ?? 'Madrasah / Sekolah');

        $learningGoals = LearningGoal::where('tenant_id', $this->tenantContext->id())
            ->whereIn('id', $validated['goal_ids'])
            ->with(['learningOutcome.element'])
            ->get();

        $officialTpLines = [];
        $cpList = [];
        foreach ($learningGoals as $idx => $lg) {
            $num = $idx + 1;
            $code = $lg->code ?? ("TP-" . $num);
            $desc = trim($lg->pedagogical_description ?: ($lg->material_content ?: ''));
            $kko = $lg->competency_kko ? " ({$lg->competency_kko})" : '';
            $officialTpLines[] = "{$num}. [{$code}]{$kko} {$desc}";

            if ($lg->learningOutcome) {
                $elemName = $lg->learningOutcome->element->name ?? 'Elemen Terkait';
                $cpText = trim($lg->learningOutcome->cp_text);
                $cpList[$lg->learning_outcome_id] = "Elemen {$elemName}:\n\"{$cpText}\"";
            }
        }

        if (empty($cpList)) {
            $publishedCps = LearningOutcome::where('subject_id', $subject->id)
                ->where('phase_id', $phase->id)
                ->where('status', LearningOutcome::STATUS_PUBLISHED)
                ->with('element')
                ->get();
            foreach ($publishedCps as $cp) {
                $elemName = $cp->element->name ?? 'Umum';
                $cpList[$cp->id] = "Elemen {$elemName}:\n\"" . trim($cp->cp_text) . "\"";
            }
        }

        $officialTpString = implode("\n", $officialTpLines);
        $officialCpString = !empty($cpList) ? implode("\n\n", $cpList) : '';

        $systemPrompt = $this->promptBuilder->buildModuleSystemPrompt($kurikulumType);
        $userPrompt = $this->promptBuilder->buildModuleUserPrompt(
            $subject,
            $phase,
            $grade,
            $learningGoals->toArray(),
            $validated['topic_name'],
            $alokasiJp,
            $menitPerJp,
            $kurikulumType,
            $validated['dpl_selected'] ?? null,
            $validated['pc_selected'] ?? null,
            $validated['pedagogis_selected'] ?? null,
            $validated['teacher_notes'] ?? null,
            $officialCpString,
            $resolvedSchoolName
        );

        $moduleData = $this->aiManager->generateJson(
            $systemPrompt,
            $userPrompt,
            'MODUL_AJAR',
            $validated['provider'] ?? null
        );

        $moduleData = $this->documentValidator->module($moduleData, $kurikulumType);

        // ENFORCE: CP and TP strictly grounded on official records from the database
        $moduleData['tujuan'] = $officialTpString;
        $moduleData['capaian_pembelajaran'] = $officialCpString;
        $moduleData['school_name'] = $resolvedSchoolName;

        return response()->json([
            'success' => true,
            'module_data' => $moduleData,
        ]);
    }

    /**
     * Store finalized Modul Ajar into database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'semester_id' => ['nullable', 'exists:semesters,id'],
            'curriculum_code' => ['required', Rule::in(['MERDEKA', 'MADRASAH_KBC'])],
            'title' => ['required', 'string', 'max:255'],
            'topic_name' => ['required', 'string', 'max:255'],
            'total_hours' => ['required', 'integer', 'min:1'],
            'meeting_count' => ['required', 'integer', 'min:1'],
            'learning_model' => ['nullable', 'string'],
            'target_students' => ['nullable', 'string'],
            'facilities' => ['nullable', 'string'],
            'prerequisite_knowledge' => ['nullable', 'string'],
            'learning_goal_ids' => ['required', 'array'],
            'meaningful_understanding' => ['nullable', 'string'],
            'inquiry_questions' => ['nullable', 'array'],
            'panca_cinta_integration' => ['nullable', 'array'],
            'deep_learning_activities' => ['nullable', 'array'],
            'profil_lulusan_targets' => ['nullable', 'array'],
            'learning_steps' => ['required', 'array'],
            'diagnostic_assessment' => ['nullable', 'array'],
            'formative_assessment' => ['nullable', 'array'],
            'summative_assessment' => ['nullable', 'array'],
            'remedial_enrichment' => ['nullable', 'array'],
            'student_worksheet_text' => ['nullable', 'string'],
            'reading_materials' => ['nullable', 'string'],
            'glossary' => ['nullable', 'array'],
            'bibliography' => ['nullable', 'string'],
            'status' => ['required', 'in:DRAFT,FINAL'],
            'generation_metadata' => ['nullable', 'array'],
        ]);

        $tenantId = $this->tenantContext->id();
        $userId = $request->user()->id;

        $this->assertAcademicContext($validated, $tenantId, 'learning_goal_ids');
        $this->assertCalendarContext($validated, $tenantId);

        $module = TeachingModule::create(array_merge($validated, [
            'tenant_id' => $tenantId,
            'user_id' => $userId,
        ]));

        return redirect()->route('curriculum.modules.show', $module->id)
            ->with('success', "Modul Ajar \"{$module->title}\" berhasil disimpan.");
    }

    /**
     * Show Modul Ajar details with official printable letterhead
     */
    public function show(TeachingModule $teachingModule): Response
    {
        if ($teachingModule->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $teachingModule->load([
            'subject',
            'phase',
            'grade',
            'academicYear',
            'semester',
            'user.teacherProfiles',
        ]);

        [$goals, $learningOutcomes] = $this->getResolvedGoalsAndOutcomes($teachingModule);
        $institution = $this->resolveInstitution($teachingModule);

        return Inertia::render('Curriculum/Modules/Show', [
            'module' => $teachingModule,
            'goals' => $goals,
            'learningOutcomes' => $learningOutcomes,
            'institution' => $institution,
        ]);
    }

    /**
     * Print official Modul Ajar / RPP HTML
     */
    public function print(TeachingModule $teachingModule)
    {
        if ($teachingModule->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $teachingModule->load(['subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles']);
        [$goals, $learningOutcomes] = $this->getResolvedGoalsAndOutcomes($teachingModule);
        $institution = $this->resolveInstitution($teachingModule);

        return view('curriculum.modules.print', [
            'module' => $teachingModule,
            'goals' => $goals,
            'learningOutcomes' => $learningOutcomes,
            'institution' => $institution,
            'isWord' => false,
        ]);
    }

    /**
     * Download Modul Ajar as Word (.doc)
     */
    public function downloadWord(TeachingModule $teachingModule)
    {
        if ($teachingModule->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $teachingModule->load(['subject', 'phase', 'grade', 'academicYear', 'semester', 'user.teacherProfiles']);
        [$goals, $learningOutcomes] = $this->getResolvedGoalsAndOutcomes($teachingModule);
        $institution = $this->resolveInstitution($teachingModule);

        $logoBase64 = null;
        if ($institution && !empty($institution->logo_path) && \Illuminate\Support\Facades\Storage::disk('public')->exists($institution->logo_path)) {
            $mime = \Illuminate\Support\Facades\Storage::disk('public')->mimeType($institution->logo_path) ?: 'image/png';
            $content = \Illuminate\Support\Facades\Storage::disk('public')->get($institution->logo_path);
            $logoBase64 = 'data:' . $mime . ';base64,' . base64_encode($content);
        } else {
            $svgFile = ($institution && method_exists($institution, 'isMadrasah') && $institution->isMadrasah())
                ? public_path('images/logos/kemenag.svg')
                : public_path('images/logos/tutwuri.svg');
            if (file_exists($svgFile)) {
                $logoBase64 = 'data:image/svg+xml;base64,' . base64_encode(file_get_contents($svgFile));
            }
        }

        $letterheadBase64 = null;
        if ($institution && !empty($institution->letterhead_path) && \Illuminate\Support\Facades\Storage::disk('public')->exists($institution->letterhead_path)) {
            $mime = \Illuminate\Support\Facades\Storage::disk('public')->mimeType($institution->letterhead_path) ?: 'image/png';
            $content = \Illuminate\Support\Facades\Storage::disk('public')->get($institution->letterhead_path);
            $letterheadBase64 = 'data:' . $mime . ';base64,' . base64_encode($content);
        }

        $filename = 'RPP_' . \Illuminate\Support\Str::slug($teachingModule->title) . '.doc';

        $html = view('curriculum.modules.word', [
            'module' => $teachingModule,
            'goals' => $goals,
            'learningOutcomes' => $learningOutcomes,
            'institution' => $institution,
            'logoBase64' => $logoBase64,
            'letterheadBase64' => $letterheadBase64,
        ])->render();

        return response($html, 200, [
            'Content-Type' => 'application/vnd.ms-word; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
        ]);
    }

    private function getResolvedGoalsAndOutcomes(TeachingModule $teachingModule): array
    {
        $goals = LearningGoal::whereIn('id', $teachingModule->learning_goal_ids ?? [])
            ->with(['learningOutcome.element'])
            ->get();

        $learningOutcomes = [];
        foreach ($goals as $g) {
            if ($g->learningOutcome) {
                $learningOutcomes[$g->learning_outcome_id] = [
                    'id' => $g->learning_outcome_id,
                    'element' => $g->learningOutcome->element->name ?? 'Elemen Terkait',
                    'cp_text' => $g->learningOutcome->cp_text,
                ];
            }
        }

        if (empty($learningOutcomes)) {
            $fallbackCps = LearningOutcome::where('subject_id', $teachingModule->subject_id)
                ->where('phase_id', $teachingModule->phase_id)
                ->where('status', LearningOutcome::STATUS_PUBLISHED)
                ->with('element')
                ->get();
            foreach ($fallbackCps as $cp) {
                $learningOutcomes[$cp->id] = [
                    'id' => $cp->id,
                    'element' => $cp->element->name ?? 'Umum',
                    'cp_text' => $cp->cp_text,
                ];
            }
        }

        return [$goals, array_values($learningOutcomes)];
    }

    /**
     * Delete Modul Ajar
     */
    public function destroy(TeachingModule $teachingModule): RedirectResponse
    {
        if ($teachingModule->tenant_id !== $this->tenantContext->id()) {
            abort(403);
        }

        $title = $teachingModule->title;
        $teachingModule->delete();

        return redirect()->route('curriculum.modules.index')
            ->with('success', "Modul Ajar \"{$title}\" berhasil dihapus.");
    }

    private function assertAcademicContext(array $data, int $tenantId, string $goalKey): void
    {
        $gradeMatchesPhase = Grade::whereKey($data['grade_id'])
            ->where('phase_id', $data['phase_id'])
            ->exists();

        $goalIds = array_values(array_unique(array_map('intval', $data[$goalKey] ?? [])));
        $matchedGoals = LearningGoal::where('tenant_id', $tenantId)
            ->where('subject_id', $data['subject_id'])
            ->where('phase_id', $data['phase_id'])
            ->whereIn('id', $goalIds)
            ->where(function ($query) use ($data) {
                $query->whereNull('grade_id')->orWhere('grade_id', $data['grade_id']);
            })
            ->count();

        if (!$gradeMatchesPhase || $matchedGoals !== count($goalIds)) {
            throw ValidationException::withMessages([
                $goalKey => 'Mapel, fase, kelas, dan TP harus saling sesuai serta berasal dari workspace aktif.',
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

    private function resolveInstitution(?TeachingModule $module = null): ?Institution
    {
        $inst = $this->tenantContext->institution();
        if (!$inst && $this->tenantContext->tenant()?->institution) {
            $inst = $this->tenantContext->tenant()->institution;
        }

        if (!$inst && $module?->tenant_id) {
            $inst = Institution::where('tenant_id', $module->tenant_id)->first();
        }

        if (!$inst && auth()->check()) {
            $profile = auth()->user()->teacherProfiles()->with('institution')->first();
            if ($profile && $profile->institution) {
                $inst = $profile->institution;
            }
        }

        if (!$inst && $this->tenantContext->id()) {
            $inst = Institution::where('tenant_id', $this->tenantContext->id())->first();
        }

        $metadataSchoolName = $module?->generation_metadata['school_name'] ?? null;
        $isMerdeka = $module && $module->curriculum_code === 'MERDEKA';

        if (!$inst) {
            $tenant = $this->tenantContext->tenant();
            $schoolName = $metadataSchoolName
                ?: ($tenant && !in_array($tenant->name, ['Personal', 'Individu']) ? $tenant->name : 'SDN SIMANALAGI 2');

            $fallback = new Institution();
            $fallback->name = $schoolName;
            $fallback->type = $isMerdeka ? 'SD' : 'MADRASAH';
            $fallback->letterhead_line_1 = $isMerdeka ? 'PEMERINTAH KOTA / DINAS PENDIDIKAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA';
            $fallback->letterhead_line_2 = $schoolName;
            $fallback->letterhead_subtext = 'Jl. Pendidikan No. 1. Telp / Email resmi satuan pendidikan';
            $fallback->signature_title = $isMerdeka ? 'Kepala Sekolah' : 'Kepala Madrasah';
            $fallback->signature_city = 'Kota';
            return $fallback;
        }

        // Intelligently overwrite dummy seeder texts with actual profile attributes
        if ($inst) {
            $inst = clone $inst;
            if (!empty($metadataSchoolName) && $metadataSchoolName !== $inst->name) {
                $inst->name = $metadataSchoolName;
                if (empty($inst->letterhead_line_2) || $inst->letterhead_line_2 === $inst->getOriginal('name')) {
                    $inst->letterhead_line_2 = $metadataSchoolName;
                }
            }

            // Sync line 1 if still default Kemenag on an SD/SMP/SMA school
            if (!$inst->isMadrasah() && (empty($inst->letterhead_line_1) || str_contains(strtoupper($inst->letterhead_line_1), 'KEMENTERIAN AGAMA'))) {
                $cityName = strtoupper($inst->city ?: 'KOTA');
                $inst->letterhead_line_1 = "PEMERINTAH {$cityName} / DINAS PENDIDIKAN";
            }

            // Sync subtext if still dummy seeder
            if (empty($inst->letterhead_subtext) || str_contains($inst->letterhead_subtext, 'Jl. Raya Pendidikan No. 123')) {
                $inst->letterhead_subtext = $inst->effective_subtext;
            }

            // Sync signature city
            if (!empty($inst->city) && (empty($inst->signature_city) || $inst->signature_city === 'Jakarta')) {
                $inst->signature_city = $inst->city;
            }
        }

        return $inst;
    }
}
