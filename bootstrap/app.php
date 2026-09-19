<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\HandleTenantContext::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'webhooks/*',
        ]);

        $middleware->alias([
            'superadmin' => \App\Http\Middleware\EnsureSuperAdmin::class,
            'institution.admin' => \App\Http\Middleware\EnsureInstitutionAdmin::class,
            'permission' => \App\Http\Middleware\EnsurePermission::class,
            'ai.quota' => \App\Http\Middleware\EnsureAiQuota::class,
        ]);
    })
    ->booting(function () {
        RateLimiter::for('ai-generate', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    if ($request->expectsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Terlalu banyak permintaan generasi AI. Silakan tunggu 1 menit lalu coba lagi.',
                            'rate_limited' => true,
                        ], 429, $headers);
                    }

                    abort(429, 'Terlalu banyak permintaan. Silakan tunggu sebentar.');
                });
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

