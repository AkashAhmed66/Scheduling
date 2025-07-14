<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Define gates for permissions
        Gate::define('manage-audit-docs', function ($user) {
            // Only users with role 0 or 1 can manage audit documents
            return in_array($user->role, [0, 1]);
        });
    }
}
