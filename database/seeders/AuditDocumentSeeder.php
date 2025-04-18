<?php

namespace Database\Seeders;

use App\Models\AuditFolder;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AuditDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user (or create one if it doesn't exist)
        $admin = User::where('role', 0)->first();
        
        if (!$admin) {
            $admin = User::where('email', 'admin@example.com')->first();
            
            if (!$admin) {
                $admin = User::factory()->create([
                    'name' => 'Admin User',
                    'email' => 'admin@example.com',
                    'role' => 0
                ]);
            }
        }
        
        // Create sample folders
        $rootFolder = AuditFolder::create([
            'name' => 'Financial Audits',
            'user_id' => $admin->id
        ]);
        
        $subFolder1 = AuditFolder::create([
            'name' => 'Q1 2023',
            'parent_id' => $rootFolder->id,
            'user_id' => $admin->id
        ]);
        
        $subFolder2 = AuditFolder::create([
            'name' => 'Q2 2023',
            'parent_id' => $rootFolder->id,
            'user_id' => $admin->id
        ]);
        
        $rootFolder2 = AuditFolder::create([
            'name' => 'Compliance Reports',
            'user_id' => $admin->id
        ]);
        
        // Ensure the audit-docs directory exists
        if (!Storage::disk('public')->exists('audit-docs')) {
            Storage::disk('public')->makeDirectory('audit-docs');
        }
        
        $this->command->info('Sample audit folders created.');
    }
} 