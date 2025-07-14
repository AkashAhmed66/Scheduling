<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an admin user if not exists
        $adminEmail = 'admin@example.com';
        $admin = User::where('email', $adminEmail)->first();
        
        if (!$admin) {
            User::create([
                'name' => 'Admin User',
                'email' => $adminEmail,
                'password' => Hash::make('password'),
                'role' => 0, // Admin
            ]);
        } else {
            $admin->role = 0;
            $admin->save();
        }
        
        // Create a manager user if not exists
        $managerEmail = 'manager@example.com';
        $manager = User::where('email', $managerEmail)->first();
        
        if (!$manager) {
            User::create([
                'name' => 'Manager User',
                'email' => $managerEmail,
                'password' => Hash::make('password'),
                'role' => 1, // Manager
            ]);
        } else {
            $manager->role = 1;
            $manager->save();
        }
        
        // Update test user to regular role if exists
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $testUser->role = 2; // Regular user
            $testUser->save();
        }
    }
} 