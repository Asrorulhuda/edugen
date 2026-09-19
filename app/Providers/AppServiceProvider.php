<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\TenantContext::class, function () {
            return new \App\Services\TenantContext();
        });

        $this->app->singleton(\App\Services\AI\AiManager::class, function ($app) {
            return new \App\Services\AI\AiManager($app->make(\App\Services\TenantContext::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
