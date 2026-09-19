<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AssessmentMatrix;
use App\Models\AssessmentPackage;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentRubric;
use App\Models\Grade;
use App\Models\LearningGoal;
use App\Models\LearningOutcome;
use App\Models\Phase;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AssessmentGeneratorTest extends TestCase
{
    use DatabaseTransactions;

    protected User $teacher;
    protected Tenant $tenant;
    protected Subject $subject;
    protected Phase $phase;
    protected Grade $grade;
    protected LearningGoal $goal;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $this->tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();

        $learningOutcome = LearningOutcome::with(['subject', 'phase'])
            ->where('status', 'PUBLISHED')
            ->firstOrFail();

        $this->subject = $learningOutcome->subject;
        $this->phase = $learningOutcome->phase;
        $this->grade = Grade::where('phase_id', $this->phase->id)->firstOrFail();

        $this->goal = LearningGoal::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->teacher->id,
            'learning_outcome_id' => $learningOutcome->id,
            'subject_id' => $this->subject->id,
            'phase_id' => $this->phase->id,
            'grade_id' => $this->grade->id,
            'code' => 'TP-TES-01',
            'bloom_level' => 'C3',
            'competency_kko' => 'Menerapkan',
            'material_content' => 'Nilai Empati dan Persaudaraan',
            'pedagogical_description' => 'Peserta didik mampu menerapkan nilai empati dan kasih sayang dalam pergaulan.',
            'estimated_hours' => 4,
            'is_verified' => true,
        ]);
    }

    public function test_teacher_can_generate_and_store_assessment_package()
    {
        // 1. Generate Assessment Package via AI API
        $generateResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->postJson('/curriculum/assessments/generate', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'title' => 'Asesmen Sumatif Bab Karakter Kasih Sayang',
                'assessment_type' => 'SUMATIF_LINGKUP_MATERI',
                'goal_ids' => [$this->goal->id],
                'question_count' => 3,
                'provider' => 'mock',
                'curriculum_code' => 'MADRASAH_KBC',
            ]);

        $generateResponse->assertStatus(200);
        $generateResponse->assertJsonStructure([
            'success',
            'package_data' => [
                'title',
                'instructions',
                'duration_minutes',
                'items' => [
                    '*' => [
                        'question_number',
                        'indicator_text',
                        'bloom_level',
                        'cognitive_tier',
                        'question_type',
                        'score_weight',
                        'stimulus_text',
                        'question_text',
                    ],
                ],
            ],
        ]);

        $pkgData = $generateResponse->json('package_data');
        $this->assertNotEmpty($pkgData['items']);

        // 2. Store finalized assessment package
        $academicYear = AcademicYear::where('tenant_id', $this->tenant->id)->first();
        $semester = Semester::where('academic_year_id', $academicYear?->id)->first();

        $itemsToStore = array_map(function ($item) {
            $item['learning_goal_id'] = $this->goal->id;
            $item['difficulty_level'] = $item['difficulty_level'] ?? 'SEDANG';
            return $item;
        }, $pkgData['items']);

        $storeResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post('/curriculum/assessments', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'academic_year_id' => $academicYear?->id,
                'semester_id' => $semester?->id,
                'title' => $pkgData['title'],
                'curriculum_code' => 'MADRASAH_KBC',
                'assessment_type' => 'SUMATIF_LINGKUP_MATERI',
                'total_questions' => count($itemsToStore),
                'duration_minutes' => $pkgData['duration_minutes'] ?? 90,
                'instructions' => $pkgData['instructions'] ?? 'Kerjakan dengan teliti',
                'status' => 'FINAL',
                'items' => $itemsToStore,
            ]);

        $storeResponse->assertRedirect();

        $savedPackage = AssessmentPackage::where('tenant_id', $this->tenant->id)
            ->where('title', $pkgData['title'])
            ->first();

        $this->assertNotNull($savedPackage);
        $this->assertEquals(count($itemsToStore), $savedPackage->questions()->count());
        $this->assertEquals(count($itemsToStore), $savedPackage->matrices()->count());

        // 3. View Assessment Sheet (Show View)
        $showResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get("/curriculum/assessments/{$savedPackage->id}");

        $showResponse->assertStatus(200);

        // Verify AI log recorded for ASSESSMENT
        $this->assertDatabaseHas('ai_generation_logs', [
            'tenant_id' => $this->tenant->id,
            'feature_type' => 'ASSESSMENT',
            'status' => 'SUCCESS',
        ]);
    }

    public function test_teacher_can_generate_and_store_rubric()
    {
        // 1. Generate Rubric via AI API
        $generateResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->postJson('/curriculum/rubrics/generate', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'title' => 'Rubrik Sikap Peduli Lingkungan dan Sesama',
                'rubric_type' => 'SIKAP_PANCA_CINTA',
                'context' => 'Proyek Bakti Lingkungan',
                'provider' => 'mock',
            ]);

        $generateResponse->assertStatus(200);
        $generateResponse->assertJsonStructure([
            'success',
            'rubric_data' => [
                'title',
                'rubric_type',
                'description',
                'scoring_guidelines',
                'dimensions' => [
                    '*' => [
                        'name',
                        'aspect',
                        'descriptors' => [
                            'perlu_bimbingan',
                            'cukup',
                            'baik',
                            'sangat_baik',
                        ],
                    ],
                ],
            ],
        ]);

        $rubricData = $generateResponse->json('rubric_data');
        $this->assertNotEmpty($rubricData['dimensions']);

        // 2. Store Rubric into database
        $storeResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post('/curriculum/rubrics', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'title' => $rubricData['title'],
                'rubric_type' => $rubricData['rubric_type'],
                'description' => $rubricData['description'],
                'dimensions_data' => $rubricData['dimensions'],
                'scoring_guidelines' => $rubricData['scoring_guidelines'],
            ]);

        $storeResponse->assertRedirect();

        $savedRubric = AssessmentRubric::where('tenant_id', $this->tenant->id)
            ->where('title', $rubricData['title'])
            ->first();

        $this->assertNotNull($savedRubric);
        $this->assertCount(count($rubricData['dimensions']), $savedRubric->dimensions_data);

        // 3. View Rubric (Show View)
        $showResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get("/curriculum/rubrics/{$savedRubric->id}");

        $showResponse->assertStatus(200);

        // Verify AI log recorded for RUBRIC
        $this->assertDatabaseHas('ai_generation_logs', [
            'tenant_id' => $this->tenant->id,
            'feature_type' => 'RUBRIC',
            'status' => 'SUCCESS',
        ]);
    }

    public function test_teacher_can_upload_stimulus_image_and_persist_image_fields(): void
    {
        Storage::fake('public');

        // 1. Upload stimulus image
        $file = UploadedFile::fake()->image('stimulus_visual.jpg', 640, 480);

        $uploadResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->postJson('/curriculum/assessments/upload-image', [
                'image' => $file,
            ]);

        $uploadResponse->assertOk();
        $uploadResponse->assertJsonStructure(['success', 'image_path', 'url']);
        $imagePath = $uploadResponse->json('image_path');
        $this->assertNotEmpty($imagePath);

        // 2. Store assessment package with image_prompt and image_path
        $packageTitle = 'Asesmen Gambar Stimulus ' . uniqid();
        $imagePrompt = 'Ilustrasi infografis sel hewan dengan nukleus dan mitokondria jelas.';

        $storeResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->post('/curriculum/assessments', [
                'subject_id' => $this->subject->id,
                'phase_id' => $this->phase->id,
                'grade_id' => $this->grade->id,
                'title' => $packageTitle,
                'curriculum_code' => 'MADRASAH_KBC',
                'assessment_type' => 'FORMATIF',
                'total_questions' => 1,
                'duration_minutes' => 60,
                'status' => 'FINAL',
                'items' => [
                    [
                        'question_number' => 1,
                        'learning_goal_id' => $this->goal->id,
                        'indicator_text' => 'Disajikan gambar sel, peserta didik dapat mengidentifikasi organel penghasil energi.',
                        'bloom_level' => 'C3',
                        'cognitive_tier' => 'L2',
                        'difficulty_level' => 'SEDANG',
                        'question_type' => 'PG',
                        'score_weight' => 1,
                        'stimulus_text' => 'Perhatikan gambar penampang sel di bawah ini!',
                        'image_prompt' => $imagePrompt,
                        'image_path' => $imagePath,
                        'question_text' => 'Organel sel yang berfungsi menghasilkan energi ATP adalah...',
                        'options_data' => [
                            'A' => 'Mitokondria',
                            'B' => 'Ribosom',
                            'C' => 'Lisosom',
                            'D' => 'Badan Golgi',
                        ],
                        'correct_answer' => 'A',
                        'explanation' => 'Mitokondria adalah the powerhouse of cell penghasil ATP.',
                    ],
                ],
            ]);

        $storeResponse->assertRedirect();

        $savedPackage = AssessmentPackage::where('title', $packageTitle)->firstOrFail();
        $savedQuestion = AssessmentQuestion::where('assessment_package_id', $savedPackage->id)->firstOrFail();

        $this->assertEquals($imagePrompt, $savedQuestion->image_prompt);
        $this->assertEquals($imagePath, $savedQuestion->image_path);
        $this->assertEquals('A', $savedQuestion->correct_answer);

        // 3. Verify show and print views render without errors
        $showResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get("/curriculum/assessments/{$savedPackage->id}");
        $showResponse->assertOk();

        $printResponse = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get("/curriculum/assessments/{$savedPackage->id}/print-soal");
        $printResponse->assertOk();
        $printResponse->assertSee($imagePath);
    }
}
