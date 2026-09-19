<?php

namespace App\Http\Middleware;

use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    public function __construct(private readonly TenantContext $tenantContext) {}

    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        $tenantId = $this->tenantContext->id();

        abort_unless($user && $user->hasPermission($permission, $tenantId), 403, 'Anda tidak memiliki izin untuk menggunakan fitur ini.');

        return $next($request);
    }
}
