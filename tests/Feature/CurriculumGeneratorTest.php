<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AiGenerationLog;
use App\Models\Grade;
use App\Models\LearningGoal;
use App\Models\LearningOutcome;
use App\Models\Phase;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\TeachingModule;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CurriculumGeneratorTest extends TestCase
{
    use DatabaseTransactions;

    protected User $teacher;
    protected Tenant $tenant;
    protected Subject $subject;
    protected Phase $phase;
    protected Grade $grade;
    protected LearningOutcome $learningOutcome;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $this->tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        // Dynamically pick first published CP and its matched subject, phase, and grade
        $this->learningOutcome = LearningOutcome::with(['subject', 'phase'])
            ->where('status', 'PUBLISHED')
            ->firstOrFail();

        $this->subject = $this->learningOutcome->subject;
        $this->phase = $this->learningOutcome->phase;
        $this->grade = Grade::where('phase_id', $this->phase->id)->firstOrFail();
    }

    public function test_teacher_can_generate_and_store_learning_goals()
    {
        // 1. Generate TP candidates via AI API
        $generateResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->postJson('/curriculum/tp/generate', [
                'learning_outcome_id' => $this->learningOutcome->id,
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'target_count' => 3,
                'provider' => 'mock',
                'curriculum_code' => 'MADRASAH_KBC',
            ]);

        $generateResponse->assertStatus(200);
        $generateResponse->assertJsonStructure([
            'success',
            'learning_goals' => [
                '*' => [
                    'code',
                    'bloom_level',
                    'competency_kko',
                    'material_content',
                    'pedagogical_description',
                    'panca_cinta_dimensions',
                    'deep_learning_elements',
                ],
            ],
        ]);

        $candidateGoals = $generateResponse->json('learning_goals');
        $this->assertNotEmpty($candidateGoals);

        // 2. Store selected goals into database
        $storeResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post('/curriculum/tp', [
                'learning_outcome_id' => $this->learningOutcome->id,
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'goals' => $candidateGoals,
            ]);

        $storeResponse->assertRedirect(route('curriculum.tp.index'));

        // Verify records in learning_goals table
        $this->assertDatabaseHas('learning_goals', [
            'tenant_id' => $this->tenant->id,
            'subject_id' => $this->subject->id,
            'phase_id' => $this->phase->id,
            'code' => $candidateGoals[0]['code'],
        ]);

        // Verify AI generation log entry was written
        $this->assertDatabaseHas('ai_generation_logs', [
            'tenant_id' => $this->tenant->id,
            'feature_type' => 'TP',
            'status' => 'SUCCESS',
        ]);
    }

    public function test_teacher_can_generate_and_store_teaching_module()
    {
        // Create an explicit TP first
        $goal = LearningGoal::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->teacher->id,
            'learning_outcome_id' => $this->learningOutcome->id,
            'subject_id' => $this->subject->id,
            'phase_id' => $this->phase->id,
            'grade_id' => $this->grade->id,
            'code' => 'TP-PAI-D-01',
            'bloom_level' => 'C3',
            'competency_kko' => 'Menerapkan',
            'material_content' => 'Adab dan Akhlak Terpuji',
            'pedagogical_description' => 'Peserta didik mampu menerapkan adab dan akhlak terpuji dalam pergaulan sehari-hari.',
            'estimated_hours' => 4,
            'is_verified' => true,
        ]);

        // 1. Check API to fetch goals
        $goalsResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->getJson("/curriculum/modules/api/goals?subject_id={$this->subject->id}&phase_id={$this->phase->id}&grade_id={$this->grade->id}");

        $goalsResponse->assertStatus(200);
        $goalsResponse->assertJsonFragment(['code' => 'TP-PAI-D-01']);

        // 2. Generate Modul Ajar with AI
        $generateResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->postJson('/curriculum/modules/generate', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'topic_name' => 'Akhlak Terpuji Menghargai Sesama',
                'goal_ids' => [$goal->id],
                'meeting_count' => 2,
                'provider' => 'mock',
                'curriculum_code' => 'MADRASAH_KBC',
            ]);

        $generateResponse->assertStatus(200);
        $moduleData = $generateResponse->json('module_data');
        $this->assertNotEmpty($moduleData);
        $this->assertArrayHasKey('meaningful_understanding', $moduleData);
        $this->assertArrayHasKey('learning_steps', $moduleData);

        // 3. Store finalized Modul Ajar
        $academicYear = AcademicYear::where('tenant_id', $this->tenant->id)->first();
        $semester = Semester::where('academic_year_id', $academicYear?->id)->first();

        $storeResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post('/curriculum/modules', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'academic_year_id' => $academicYear?->id,
                'semester_id' => $semester?->id,
                'title' => $moduleData['title'] ?? 'Modul Ajar Akhlak Terpuji',
                'curriculum_code' => 'MADRASAH_KBC',
                'topic_name' => 'Akhlak Terpuji Menghargai Sesama',
                'total_hours' => 4,
                'meeting_count' => 2,
                'learning_model' => 'Problem-Based Learning',
                'learning_goal_ids' => [$goal->id],
                'meaningful_understanding' => $moduleData['meaningful_understanding'],
                'inquiry_questions' => $moduleData['inquiry_questions'] ?? [],
                'panca_cinta_integration' => $moduleData['panca_cinta_integration'] ?? [],
                'deep_learning_activities' => $moduleData['deep_learning_activities'] ?? [],
                'learning_steps' => $moduleData['learning_steps'] ?? [],
                'status' => 'FINAL',
            ]);

        $storeResponse->assertRedirect();

        $savedModule = TeachingModule::where('tenant_id', $this->tenant->id)
            ->where('topic_name', 'Akhlak Terpuji Menghargai Sesama')
            ->first();

        $this->assertNotNull($savedModule);

        // 4. View Modul Ajar Document (Show View)
        $showResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get("/curriculum/modules/{$savedModule->id}");

        $showResponse->assertStatus(200);

        // Verify AI log recorded for MODUL_AJAR
        $this->assertDatabaseHas('ai_generation_logs', [
            'tenant_id' => $this->tenant->id,
            'feature_type' => 'MODUL_AJAR',
            'status' => 'SUCCESS',
        ]);
    }
}
