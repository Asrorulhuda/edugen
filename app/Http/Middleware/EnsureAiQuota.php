<?php

namespace App\Http\Middleware;

use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAiQuota
{
    public function __construct(private readonly TenantContext $tenantContext) {}

    /**
     * Ensure the current tenant has remaining AI generation quota before
     * allowing the request to proceed. Returns a JSON 429 response with
     * a user-friendly Indonesian message if quota is exhausted.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $remaining = $this->tenantContext->remainingAiQuota();

        // -1 means no active subscription found — allow in grace mode
        if ($remaining === 0) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kuota generasi AI untuk periode langganan ini telah habis. '
                        . 'Silakan upgrade paket berlangganan Anda untuk melanjutkan.',
                    'quota_exhausted' => true,
                ], 429);
            }

            abort(429, 'Kuota generasi AI telah habis. Silakan upgrade paket berlangganan.');
        }

        return $next($request);
    }
}
