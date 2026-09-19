<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AssessmentPackage;
use App\Models\AssessmentRubric;
use App\Models\Institution;
use App\Models\LearningGoal;
use App\Models\LearningOutcome;
use App\Models\PaymentOrder;
use App\Models\Semester;
use App\Models\TeachingModule;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use App\Services\Billing\SubscriptionService;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected TenantContext $tenantContext,
        protected SubscriptionService $subscriptionService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = (bool) $user->is_super_admin;
        $tenantId = $this->tenantContext->id();
        $tenant = $this->tenantContext->tenant();

        // 1. Super Admin Platform Metrics
        $adminStats = null;
        $pendingPayments = [];
        $recentTenants = [];

        if ($isSuperAdmin) {
            $adminStats = [
                'total_users' => User::count(),
                'total_tenants' => Tenant::count(),
                'total_institutions' => Institution::count(),
                'total_master_cp' => LearningOutcome::count(),
                'total_modules_platform' => TeachingModule::count(),
                'pending_payments_count' => PaymentOrder::where('payment_status', 'PENDING_REVIEW')->count(),
                'total_revenue' => (float) PaymentOrder::where('payment_status', 'PAID')->sum('amount'),
            ];

            $pendingPayments = PaymentOrder::with(['tenant', 'user', 'plan'])
                ->where('payment_status', 'PENDING_REVIEW')
                ->latest()
                ->limit(5)
                ->get();

            $recentTenants = Tenant::with('institution')
                ->latest()
                ->limit(5)
                ->get();
        }

        // 2. Tenant Specific Workspace Metrics (for School / Teacher)
        $activeSubscription = $tenantId ? $this->subscriptionService->getActiveSubscription($tenantId) : null;
        
        $workspaceStats = [
            'tp_count' => $tenantId ? LearningGoal::where('tenant_id', $tenantId)->count() : 0,
            'module_count' => $tenantId ? TeachingModule::where('tenant_id', $tenantId)->count() : 0,
            'assessment_count' => $tenantId ? AssessmentPackage::where('tenant_id', $tenantId)->count() : 0,
            'rubric_count' => $tenantId ? AssessmentRubric::where('tenant_id', $tenantId)->count() : 0,
            'teacher_count' => $tenant && $tenant->tenant_type === 'INSTITUTION' 
                ? TenantMembership::where('tenant_id', $tenantId)->count() 
                : 1,
        ];

        $recentModules = $tenantId ? TeachingModule::where('tenant_id', $tenantId)
            ->with(['subject', 'phase', 'creator'])
            ->latest()
            ->limit(5)
            ->get() : collect([]);

        $recentAssessments = $tenantId ? AssessmentPackage::where('tenant_id', $tenantId)
            ->with(['subject', 'phase', 'creator'])
            ->latest()
            ->limit(5)
            ->get() : collect([]);

        $activeAcademicYear = $tenantId ? AcademicYear::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->first() : null;

        $activeSemester = $activeAcademicYear
            ? Semester::where('academic_year_id', $activeAcademicYear->id)
                ->where('is_active', true)
                ->first()
            : null;

        return Inertia::render('Dashboard', [
            'isSuperAdmin' => $isSuperAdmin,
            'adminStats' => $adminStats,
            'pendingPayments' => $pendingPayments,
            'recentTenants' => $recentTenants,
            'workspaceStats' => $workspaceStats,
            'activeSubscription' => $activeSubscription,
            'recentModules' => $recentModules,
            'recentAssessments' => $recentAssessments,
            'activeAcademicYear' => $activeAcademicYear,
            'activeSemester' => $activeSemester,
            'tenant' => $tenant,
        ]);
    }
}
