<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $sections = \App\Models\LandingPageSection::where('is_active', true)
        ->get()
        ->keyBy('key');

    $plans = \App\Models\SubscriptionPlan::where('is_active', true)
        ->orderBy('order_index')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'sections' => $sections,
        'plans' => $plans,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/workspace/switch', [\App\Http\Controllers\WorkspaceController::class, 'switch'])->name('workspace.switch');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::match(['patch', 'post'], '/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/school', [ProfileController::class, 'updateSchool'])->name('profile.school.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Teacher CP Browser (Read-only for all teachers)
    Route::get('/curriculum/cp', [\App\Http\Controllers\Curriculum\TeacherCpBrowserController::class, 'index'])->name('curriculum.cp.index');
    Route::get('/api/curriculum/cp/search', [\App\Http\Controllers\Curriculum\TeacherCpBrowserController::class, 'apiSearch'])->name('api.curriculum.cp.search');

    // Tujuan Pembelajaran (TP) Generator
    Route::prefix('curriculum/tp')->name('curriculum.tp.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Curriculum\TpGeneratorController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Curriculum\TpGeneratorController::class, 'create'])->name('create');
        Route::post('/generate', [\App\Http\Controllers\Curriculum\TpGeneratorController::class, 'generate'])->name('generate');
        Route::post('/', [\App\Http\Controllers\Curriculum\TpGeneratorController::class, 'store'])->name('store');
        Route::delete('/{learningGoal}', [\App\Http\Controllers\Curriculum\TpGeneratorController::class, 'destroy'])->name('destroy');
    });

    // Modul Ajar / RPP KBC Generator & Management
    Route::middleware('permission:teaching_docs.generate_rpp_modul')->prefix('curriculum/modules')->name('curriculum.modules.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'create'])->name('create');
        Route::get('/api/goals', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'apiGetGoals'])->name('api.goals');
        Route::post('/generate', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'generate'])->middleware(['throttle:ai-generate', 'ai.quota'])->name('generate');
        Route::post('/', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'store'])->name('store');
        Route::get('/{teachingModule}', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'show'])->name('show');
        Route::get('/{teachingModule}/print', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'print'])->name('print');
        Route::get('/{teachingModule}/download-word', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'downloadWord'])->name('download-word');
        Route::delete('/{teachingModule}', [\App\Http\Controllers\Curriculum\TeachingModuleController::class, 'destroy'])->name('destroy');
    });

    // Alur Tujuan Pembelajaran (ATP) Generator & Management
    Route::prefix('curriculum/atp')->name('curriculum.atp.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Curriculum\AtpController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Curriculum\AtpController::class, 'create'])->name('create');
        Route::post('/generate', [\App\Http\Controllers\Curriculum\AtpController::class, 'generate'])->name('generate');
        Route::post('/', [\App\Http\Controllers\Curriculum\AtpController::class, 'store'])->name('store');
        Route::get('/{sequence}', [\App\Http\Controllers\Curriculum\AtpController::class, 'show'])->name('show');
        Route::get('/{sequence}/print', [\App\Http\Controllers\Curriculum\AtpController::class, 'print'])->name('print');
        Route::get('/{sequence}/download-word', [\App\Http\Controllers\Curriculum\AtpController::class, 'downloadWord'])->name('download-word');
        Route::delete('/{sequence}', [\App\Http\Controllers\Curriculum\AtpController::class, 'destroy'])->name('destroy');
    });

    // Bank Soal & Kisi-kisi Asesmen
    Route::middleware('permission:questions.generate')->prefix('curriculum/assessments')->name('curriculum.assessments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'create'])->name('create');
        Route::post('/generate', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'generate'])->middleware(['throttle:ai-generate', 'ai.quota'])->name('generate');
        Route::post('/upload-image', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'uploadImage'])->name('upload-image');
        Route::post('/', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'store'])->name('store');
        Route::get('/{assessmentPackage}', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'show'])->name('show');
        Route::get('/{assessmentPackage}/edit', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'edit'])->name('edit');
        Route::put('/{assessmentPackage}', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'update'])->name('update');
        Route::get('/{assessmentPackage}/print-soal', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'printSoal'])->name('print-soal');
        Route::get('/{assessmentPackage}/print-kisi', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'printKisi'])->name('print-kisi');
        Route::get('/{assessmentPackage}/print-kunci', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'printKunci'])->name('print-kunci');
        Route::get('/{assessmentPackage}/download-word', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'downloadWord'])->name('download-word');
        Route::delete('/{assessmentPackage}', [\App\Http\Controllers\Curriculum\AssessmentPackageController::class, 'destroy'])->name('destroy');
    });

    // Rubrik Penilaian Karakter Panca Cinta & Kinerja
    Route::prefix('curriculum/rubrics')->name('curriculum.rubrics.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'create'])->name('create');
        Route::post('/generate', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'generate'])->name('generate');
        Route::post('/', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'store'])->name('store');
        Route::get('/{assessmentRubric}', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'show'])->name('show');
        Route::delete('/{assessmentRubric}', [\App\Http\Controllers\Curriculum\AssessmentRubricController::class, 'destroy'])->name('destroy');
    });

    // Super Admin CP Management & Import (Control Plane only)
    Route::middleware('superadmin')->prefix('admin/curriculum')->name('admin.')->group(function () {
        // CP CRUD & Lifecycle
        Route::get('/learning-outcomes', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'index'])->name('learning-outcomes.index');
        Route::get('/learning-outcomes/create', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'create'])->name('learning-outcomes.create');
        Route::post('/learning-outcomes', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'store'])->name('learning-outcomes.store');
        Route::get('/learning-outcomes/{learningOutcome}', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'show'])->name('learning-outcomes.show');
        Route::get('/learning-outcomes/{learningOutcome}/edit', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'edit'])->name('learning-outcomes.edit');
        Route::put('/learning-outcomes/{learningOutcome}', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'update'])->name('learning-outcomes.update');
        Route::post('/learning-outcomes/{learningOutcome}/publish', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'publish'])->name('learning-outcomes.publish');
        Route::post('/learning-outcomes/{learningOutcome}/archive', [\App\Http\Controllers\Admin\Curriculum\LearningOutcomeController::class, 'archive'])->name('learning-outcomes.archive');

        // CP CSV/XLSX Import
        Route::get('/import-cp', [\App\Http\Controllers\Admin\Curriculum\CpImportController::class, 'index'])->name('import-cp.index');
        Route::get('/import-cp/template', [\App\Http\Controllers\Admin\Curriculum\CpImportController::class, 'template'])->name('import-cp.template');
        Route::post('/import-cp/preview', [\App\Http\Controllers\Admin\Curriculum\CpImportController::class, 'preview'])->name('import-cp.preview');
        Route::post('/import-cp', [\App\Http\Controllers\Admin\Curriculum\CpImportController::class, 'store'])->name('import-cp.store');
    });

    // Super Admin Landing Page CMS Management
    Route::middleware('superadmin')->prefix('admin/landing-page')->name('admin.landing-page.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Landing\LandingPageController::class, 'index'])->name('index');
        Route::put('/{key}', [\App\Http\Controllers\Admin\Landing\LandingPageController::class, 'update'])->name('update');
        Route::post('/reset/{key}', [\App\Http\Controllers\Admin\Landing\LandingPageController::class, 'reset'])->name('reset');
    });

    // Super Admin AI Provider & API Key Settings
    Route::middleware('superadmin')->prefix('admin/ai-settings')->name('admin.ai-settings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Ai\AiSettingController::class, 'index'])->name('index');
        Route::put('/{provider}', [\App\Http\Controllers\Admin\Ai\AiSettingController::class, 'update'])->name('update');
        Route::post('/{provider}/test', [\App\Http\Controllers\Admin\Ai\AiSettingController::class, 'test'])->name('test');
    });

    // Institution Admin Menus (School / Madrasah workspace only)
    Route::middleware('institution.admin')->prefix('institution')->name('institution.')->group(function () {
        // Profile & School Settings
        Route::get('/profile', [\App\Http\Controllers\Institution\InstitutionProfileController::class, 'edit'])->name('profile.edit');
        Route::match(['PUT', 'POST'], '/profile', [\App\Http\Controllers\Institution\InstitutionProfileController::class, 'update'])->name('profile.update');
        Route::get('/branding', [\App\Http\Controllers\Institution\InstitutionProfileController::class, 'branding'])->name('branding.edit');
        Route::match(['PUT', 'POST'], '/branding', [\App\Http\Controllers\Institution\InstitutionProfileController::class, 'updateBranding'])->name('branding.update');

        // Academic Calendar
        Route::get('/academic-years', [\App\Http\Controllers\Institution\AcademicYearController::class, 'index'])->name('academic-years.index');
        Route::post('/academic-years', [\App\Http\Controllers\Institution\AcademicYearController::class, 'store'])->name('academic-years.store');
        Route::post('/academic-years/{academicYear}/activate', [\App\Http\Controllers\Institution\AcademicYearController::class, 'activate'])->name('academic-years.activate');
        Route::post('/semesters/{semester}/activate', [\App\Http\Controllers\Institution\AcademicYearController::class, 'activateSemester'])->name('semesters.activate');
        Route::delete('/academic-years/{academicYear}', [\App\Http\Controllers\Institution\AcademicYearController::class, 'destroy'])->name('academic-years.destroy');

        // Teacher Management
        Route::get('/teachers', [\App\Http\Controllers\Institution\InstitutionTeacherController::class, 'index'])->name('teachers.index');
        Route::post('/teachers', [\App\Http\Controllers\Institution\InstitutionTeacherController::class, 'store'])->name('teachers.store');
        Route::put('/teachers/{teacherProfile}', [\App\Http\Controllers\Institution\InstitutionTeacherController::class, 'update'])->name('teachers.update');
        Route::post('/teachers/{teacherProfile}/toggle-status', [\App\Http\Controllers\Institution\InstitutionTeacherController::class, 'toggleStatus'])->name('teachers.toggle-status');

        // Teacher Invitations
        Route::get('/invitations', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'index'])->name('invitations.index');
        Route::post('/invitations', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'store'])->name('invitations.store');
        Route::post('/invitations/{invitation}/resend', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'resend'])->name('invitations.resend');
        Route::delete('/invitations/{invitation}', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'destroy'])->name('invitations.destroy');
    });

    // Billing & Subscription (Tenant Workspace)
    Route::prefix('billing')->name('billing.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Billing\BillingController::class, 'index'])->name('index');
        Route::get('/checkout/{plan:slug}', [\App\Http\Controllers\Billing\BillingController::class, 'checkout'])->name('checkout');
        Route::post('/order', [\App\Http\Controllers\Billing\BillingController::class, 'storeOrder'])->name('order.store');
        Route::get('/invoice/{orderNumber}', [\App\Http\Controllers\Billing\BillingController::class, 'showInvoice'])->name('invoice');
        Route::post('/invoice/{orderNumber}/proof', [\App\Http\Controllers\Billing\BillingController::class, 'uploadProof'])->name('invoice.upload-proof');
    });

    // Super Admin Billing Management
    Route::middleware('superadmin')->prefix('admin/billing')->name('admin.billing.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Billing\AdminBillingController::class, 'index'])->name('index');
        Route::post('/{order}/verify', [\App\Http\Controllers\Admin\Billing\AdminBillingController::class, 'verifyPayment'])->name('verify');
    });

    // Super Admin Payment Gateway & Method Settings
    Route::middleware('superadmin')->prefix('admin/payment-settings')->name('admin.payment-settings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'index'])->name('index');
        Route::put('/gateways/{gateway}', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'updateGateway'])->name('gateways.update');
        Route::post('/gateways/{gateway}/test', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'testGateway'])->name('gateways.test');
        Route::post('/banks', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'storeBank'])->name('banks.store');
        Route::put('/banks/{bank}', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'updateBank'])->name('banks.update');
        Route::delete('/banks/{bank}', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'destroyBank'])->name('banks.destroy');
        Route::put('/qris', [\App\Http\Controllers\Admin\Billing\AdminPaymentSettingController::class, 'updateQris'])->name('qris.update');
    });

    // Super Admin Client Management (Guru Pribadi & Sekolah)
    Route::middleware('superadmin')->prefix('admin/clients')->name('admin.clients.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'store'])->name('store');
        Route::get('/{tenant}', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'show'])->name('show');
        Route::match(['put', 'patch'], '/{tenant}/status', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'updateStatus'])->name('update-status');
        Route::post('/{tenant}/quota', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'adjustQuota'])->name('adjust-quota');
        Route::post('/{tenant}/duration', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'adjustDuration'])->name('adjust-duration');
        Route::post('/{tenant}/subscription', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'assignSubscription'])->name('assign-subscription');
        Route::delete('/{tenant}', [\App\Http\Controllers\Admin\Client\AdminClientController::class, 'destroy'])->name('destroy');
    });

    // Super Admin Subscription Plan Configuration
    Route::middleware('superadmin')->prefix('admin/plans')->name('admin.plans.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Billing\AdminPlanController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Admin\Billing\AdminPlanController::class, 'store'])->name('store');
        Route::put('/{plan}', [\App\Http\Controllers\Admin\Billing\AdminPlanController::class, 'update'])->name('update');
        Route::match(['post', 'patch'], '/{plan}/toggle-status', [\App\Http\Controllers\Admin\Billing\AdminPlanController::class, 'toggleStatus'])->name('toggle-status');
        Route::delete('/{plan}', [\App\Http\Controllers\Admin\Billing\AdminPlanController::class, 'destroy'])->name('destroy');
    });

    // Super Admin CRM & WhatsApp Gateway
    Route::middleware('superadmin')->prefix('admin/crm')->name('admin.crm.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'index'])->name('index');
        Route::match(['put', 'post'], '/settings', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'updateSettings'])->name('settings.update');
        Route::post('/test-connection', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'testConnection'])->name('test');
        Route::post('/send', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'sendMessage'])->name('send');
        Route::post('/broadcast', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'broadcast'])->name('broadcast');
        Route::post('/templates', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'storeTemplate'])->name('templates.store');
        Route::match(['put', 'post'], '/templates/{template}', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'updateTemplate'])->name('templates.update');
        Route::delete('/templates/{template}', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'destroyTemplate'])->name('templates.destroy');
        Route::post('/logs/{log}/retry', [\App\Http\Controllers\Admin\Crm\AdminWhatsAppController::class, 'retryLog'])->name('logs.retry');
    });
});

// Public Teacher Invitation Acceptance
Route::get('/invitations/{token}', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'showAccept'])->name('invitations.accept');
Route::post('/invitations/{token}/accept', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'processAccept'])->name('invitations.process');
Route::post('/invitations/{token}', [\App\Http\Controllers\Institution\TeacherInvitationController::class, 'processAccept']);

// Public Payment Gateway Webhooks (CSRF Exempted)
Route::post('/webhooks/xendit', [\App\Http\Controllers\Billing\GatewayWebhookController::class, 'xendit'])->name('webhooks.xendit');
Route::post('/webhooks/tripay', [\App\Http\Controllers\Billing\GatewayWebhookController::class, 'tripay'])->name('webhooks.tripay');

require __DIR__.'/auth.php';
