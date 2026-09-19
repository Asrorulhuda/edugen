<?php

namespace App\Http\Middleware;

use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstitutionAdmin
{
    public function __construct(
        protected TenantContext $tenantContext
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        // Super Admin has support override
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Check if current workspace is an institution and user is ADMIN
        if (!$this->tenantContext->isInstitution() || $this->tenantContext->roleName() !== 'ADMIN') {
            abort(403, 'Akses ini khusus untuk Admin Lembaga / Sekolah.');
        }

        return $next($request);
    }
}
