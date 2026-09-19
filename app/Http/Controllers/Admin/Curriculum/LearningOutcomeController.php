<?php

namespace App\Http\Controllers\Admin\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\CpAuditLog;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\LearningElement;
use App\Models\LearningOutcome;
use App\Models\LearningOutcomeVersion;
use App\Models\Phase;
use App\Models\Regulation;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningOutcomeController extends Controller
{
    /**
     * Display a listing of Capaian Pembelajaran with search and filters
     */
    public function index(Request $request): Response
    {
        $query = LearningOutcome::with([
            'curriculum:id,code,name',
            'regulation:id,code,title',
            'subject:id,code,name,category',
            'phase:id,code,name,level_summary',
            'element:id,code,name',
            'educationLevel:id,code,name',
            'verifier:id,name',
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('cp_text', 'like', "%{$search}%")
                    ->orWhere('source_locator', 'like', "%{$search}%");
            });
        }

        if ($request->filled('curriculum_code')) {
            $query->where('curriculum_code', $request->input('curriculum_code'));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        if ($request->filled('phase_id')) {
            $query->where('phase_id', $request->input('phase_id'));
        }

        if ($request->filled('education_level_id')) {
            $query->where('education_level_id', $request->input('education_level_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('regulation_id')) {
            $query->where('regulation_id', $request->input('regulation_id'));
        }

        $learningOutcomes = $query->orderBy('subject_id')
            ->orderBy('phase_id')
            ->orderBy('code')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Curriculum/LearningOutcomes/Index', [
            'learningOutcomes' => $learningOutcomes,
            'filters' => $request->only(['search', 'curriculum_code', 'subject_id', 'phase_id', 'education_level_id', 'status', 'regulation_id']),
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(['id', 'code', 'name', 'category']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name', 'level_summary']),
            'levels' => EducationLevel::orderBy('order_index')->get(['id', 'code', 'name']),
            'regulations' => Regulation::orderBy('year', 'desc')->get(['id', 'code', 'title']),
        ]);
    }

    /**
     * Show form for creating a new CP
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Curriculum/LearningOutcomes/Form', [
            'learningOutcome' => null,
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'regulations' => Regulation::where('status', 'ACTIVE')->get(['id', 'code', 'title']),
            'subjects' => Subject::with('elements:id,subject_id,code,name')->where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name', 'level_summary']),
            'levels' => EducationLevel::orderBy('order_index')->get(['id', 'code', 'name']),
        ]);
    }

    /**
     * Store a newly created CP in storage as DRAFT
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
            'curriculum_code' => ['required', 'string', 'exists:curriculum_frameworks,code'],
            'regulation_id' => ['required', 'exists:regulations,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'education_level_id' => ['nullable', 'exists:education_levels,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'learning_element_id' => ['nullable', 'exists:learning_elements,id'],
            'cp_text' => ['required', 'string', 'min:10'],
            'source_locator' => ['nullable', 'string', 'max:255'],
            'source_page_start' => ['nullable', 'integer', 'min:1'],
            'source_page_end' => ['nullable', 'integer', 'gte:source_page_start'],
            'notes' => ['nullable', 'string'],
        ]);

        $checksum = LearningOutcome::generateChecksum($validated['cp_text']);

        // Check for exact duplicate in same curriculum, subject, and phase
        $duplicate = LearningOutcome::where('curriculum_code', $validated['curriculum_code'])
            ->where('subject_id', $validated['subject_id'])
            ->where('phase_id', $validated['phase_id'])
            ->where('checksum', $checksum)
            ->first();

        if ($duplicate) {
            return back()->withInput()->withErrors([
                'cp_text' => "Teks CP yang sama persis sudah ada dengan kode [{$duplicate->code}].",
            ]);
        }

        $userId = $request->user()->id;

        $lo = LearningOutcome::create(array_merge($validated, [
            'checksum' => $checksum,
            'version' => 1,
            'status' => LearningOutcome::STATUS_DRAFT,
            'updated_by' => $userId,
        ]));

        $element = $validated['learning_element_id'] ? LearningElement::find($validated['learning_element_id']) : null;

        // Create version 1 record
        LearningOutcomeVersion::create([
            'learning_outcome_id' => $lo->id,
            'version' => 1,
            'cp_text' => $lo->cp_text,
            'element_name' => $element?->name,
            'change_summary' => 'Initial draft creation.',
            'changed_by' => $userId,
            'created_at' => now(),
        ]);

        // Audit Log
        CpAuditLog::create([
            'learning_outcome_id' => $lo->id,
            'actor_id' => $userId,
            'action' => 'CREATE',
            'reason' => 'Draft Capaian Pembelajaran baru dibuat secara manual.',
            'after_payload' => $lo->toArray(),
            'created_at' => now(),
        ]);

        return redirect()->route('admin.learning-outcomes.show', $lo->id)
            ->with('success', "Draft CP [{$lo->code}] berhasil dibuat.");
    }

    /**
     * Display the specified CP with immutable versions and audit logs
     */
    public function show(LearningOutcome $learningOutcome): Response
    {
        $learningOutcome->load([
            'curriculum',
            'regulation',
            'subject',
            'phase',
            'element',
            'educationLevel',
            'verifier',
            'updater',
            'versions.changer',
            'auditLogs.actor',
        ]);

        return Inertia::render('Admin/Curriculum/LearningOutcomes/Show', [
            'learningOutcome' => $learningOutcome,
        ]);
    }

    /**
     * Show the form for editing the specified CP
     */
    public function edit(LearningOutcome $learningOutcome): Response
    {
        $learningOutcome->load(['versions', 'element']);

        return Inertia::render('Admin/Curriculum/LearningOutcomes/Form', [
            'learningOutcome' => $learningOutcome,
            'curricula' => CurriculumFramework::where('is_active', true)->get(['code', 'name']),
            'regulations' => Regulation::where('status', 'ACTIVE')->get(['id', 'code', 'title']),
            'subjects' => Subject::with('elements:id,subject_id,code,name')->where('is_active', true)->orderBy('name')->get(['id', 'code', 'name']),
            'phases' => Phase::orderBy('order_index')->get(['id', 'code', 'name', 'level_summary']),
            'levels' => EducationLevel::orderBy('order_index')->get(['id', 'code', 'name']),
        ]);
    }

    /**
     * Update the specified CP
     */
    public function update(Request $request, LearningOutcome $learningOutcome): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
            'curriculum_code' => ['required', 'string', 'exists:curriculum_frameworks,code'],
            'regulation_id' => ['required', 'exists:regulations,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'education_level_id' => ['nullable', 'exists:education_levels,id'],
            'phase_id' => ['required', 'exists:phases,id'],
            'learning_element_id' => ['nullable', 'exists:learning_elements,id'],
            'cp_text' => ['required', 'string', 'min:10'],
            'source_locator' => ['nullable', 'string', 'max:255'],
            'source_page_start' => ['nullable', 'integer', 'min:1'],
            'source_page_end' => ['nullable', 'integer', 'gte:source_page_start'],
            'notes' => ['nullable', 'string'],
            'change_reason' => ['required_if:status,PUBLISHED', 'nullable', 'string'],
        ]);

        $userId = $request->user()->id;
        $checksum = LearningOutcome::generateChecksum($validated['cp_text']);
        $element = $validated['learning_element_id'] ? LearningElement::find($validated['learning_element_id']) : null;

        // If CP is already PUBLISHED, create a new version (v2, v3...)
        if ($learningOutcome->status === LearningOutcome::STATUS_PUBLISHED) {
            $newVersionNumber = $learningOutcome->version + 1;

            $beforePayload = $learningOutcome->toArray();

            $learningOutcome->update([
                'code' => $validated['code'],
                'curriculum_code' => $validated['curriculum_code'],
                'regulation_id' => $validated['regulation_id'],
                'subject_id' => $validated['subject_id'],
                'education_level_id' => $validated['education_level_id'],
                'phase_id' => $validated['phase_id'],
                'learning_element_id' => $validated['learning_element_id'],
                'cp_text' => $validated['cp_text'],
                'source_locator' => $validated['source_locator'],
                'source_page_start' => $validated['source_page_start'],
                'source_page_end' => $validated['source_page_end'],
                'checksum' => $checksum,
                'version' => $newVersionNumber,
                'status' => LearningOutcome::STATUS_DRAFT, // New version starts as DRAFT per spec
                'notes' => $validated['notes'],
                'updated_by' => $userId,
            ]);

            LearningOutcomeVersion::create([
                'learning_outcome_id' => $learningOutcome->id,
                'version' => $newVersionNumber,
                'cp_text' => $validated['cp_text'],
                'element_name' => $element?->name,
                'change_summary' => $request->input('change_reason', 'Revisi teks CP terbitan baru.'),
                'changed_by' => $userId,
                'created_at' => now(),
            ]);

            CpAuditLog::create([
                'learning_outcome_id' => $learningOutcome->id,
                'actor_id' => $userId,
                'action' => 'NEW_VERSION',
                'reason' => $request->input('change_reason', 'Pembaruan versi CP yang sudah terpublikasi.'),
                'before_payload' => $beforePayload,
                'after_payload' => $learningOutcome->toArray(),
                'created_at' => now(),
            ]);

            return redirect()->route('admin.learning-outcomes.show', $learningOutcome->id)
                ->with('success', "Versi baru (v{$newVersionNumber}) dibuat sebagai DRAFT untuk ditinjau.");
        }

        // If CP is DRAFT, update in place
        $beforePayload = $learningOutcome->toArray();

        $learningOutcome->update(array_merge($validated, [
            'checksum' => $checksum,
            'updated_by' => $userId,
        ]));

        // Update version 1 record
        LearningOutcomeVersion::where('learning_outcome_id', $learningOutcome->id)
            ->where('version', $learningOutcome->version)
            ->update([
                'cp_text' => $validated['cp_text'],
                'element_name' => $element?->name,
                'change_summary' => 'Pembaruan isi draft.',
            ]);

        CpAuditLog::create([
            'learning_outcome_id' => $learningOutcome->id,
            'actor_id' => $userId,
            'action' => 'UPDATE_DRAFT',
            'reason' => 'Perubahan field pada draft CP.',
            'before_payload' => $beforePayload,
            'after_payload' => $learningOutcome->toArray(),
            'created_at' => now(),
        ]);

        return redirect()->route('admin.learning-outcomes.show', $learningOutcome->id)
            ->with('success', 'Draft CP berhasil diperbarui.');
    }

    /**
     * Publish validated CP
     */
    public function publish(Request $request, LearningOutcome $learningOutcome): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string'],
        ]);

        $userId = $request->user()->id;
        $beforePayload = $learningOutcome->toArray();

        $learningOutcome->update([
            'status' => LearningOutcome::STATUS_PUBLISHED,
            'verified_by' => $userId,
            'verified_at' => now(),
            'published_at' => now(),
            'updated_by' => $userId,
        ]);

        CpAuditLog::create([
            'learning_outcome_id' => $learningOutcome->id,
            'actor_id' => $userId,
            'action' => 'PUBLISH',
            'reason' => $request->input('reason', 'Verifikasi & publikasi resmi Capaian Pembelajaran.'),
            'before_payload' => $beforePayload,
            'after_payload' => $learningOutcome->toArray(),
            'created_at' => now(),
        ]);

        return back()->with('success', "CP [{$learningOutcome->code}] berhasil dipublikasikan dan aktif untuk guru.");
    }

    /**
     * Archive CP
     */
    public function archive(Request $request, LearningOutcome $learningOutcome): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string'],
        ]);

        $userId = $request->user()->id;
        $beforePayload = $learningOutcome->toArray();

        $learningOutcome->update([
            'status' => LearningOutcome::STATUS_ARCHIVED,
            'updated_by' => $userId,
        ]);

        CpAuditLog::create([
            'learning_outcome_id' => $learningOutcome->id,
            'actor_id' => $userId,
            'action' => 'ARCHIVE',
            'reason' => $request->input('reason'),
            'before_payload' => $beforePayload,
            'after_payload' => $learningOutcome->toArray(),
            'created_at' => now(),
        ]);

        return back()->with('success', "CP [{$learningOutcome->code}] berhasil diarsipkan.");
    }
}
