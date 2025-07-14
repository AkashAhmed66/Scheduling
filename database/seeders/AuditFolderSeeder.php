<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditFolder;
use App\Models\User;

class AuditFolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user or create a system user if none exists
        $user = User::where('role', 0)->first();
        
        if (!$user) {
            // If no admin is found, use the first user available
            $user = User::first();
            
            if (!$user) {
                // This is just fallback in case there are no users at all
                echo "Warning: No users found in database. Cannot create audit folders.\n";
                return;
            }
        }
        
        // Create default root folders
        $rootFolders = [
            'Audit Reports',
            'Client Documents',
            'Templates',
            'Training Materials'
        ];
        
        foreach ($rootFolders as $folderName) {
            AuditFolder::create([
                'name' => $folderName,
                'user_id' => $user->id
                // parent_id is null for root folders
            ]);
        }
        
        // Create some subfolders for organization
        $auditReports = AuditFolder::where('name', 'Audit Reports')->first();
        if ($auditReports) {
            AuditFolder::create([
                'name' => 'Completed Audits',
                'parent_id' => $auditReports->id,
                'user_id' => $user->id
            ]);
            
            AuditFolder::create([
                'name' => 'In Progress',
                'parent_id' => $auditReports->id,
                'user_id' => $user->id
            ]);
        }
        
        $templates = AuditFolder::where('name', 'Templates')->first();
        if ($templates) {
            AuditFolder::create([
                'name' => 'Report Templates',
                'parent_id' => $templates->id,
                'user_id' => $user->id
            ]);
            
            AuditFolder::create([
                'name' => 'Checklist Templates',
                'parent_id' => $templates->id,
                'user_id' => $user->id
            ]);
        }
        
        echo "Created default audit document folders structure.\n";
    }
} 