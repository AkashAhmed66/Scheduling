<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing answer values in assessment_drafts table
        DB::table('assessment_drafts')
            ->where('answer', 'Yes')
            ->update(['answer' => 'Compliance']);

        DB::table('assessment_drafts')
            ->where('answer', 'No')
            ->update(['answer' => 'Non-Compliance']);

        // Also update upload_models table if needed
        DB::table('upload_models')
            ->where('answer', 'Yes')
            ->update(['answer' => 'Compliance']);

        DB::table('upload_models')
            ->where('answer', 'No')
            ->update(['answer' => 'Non-Compliance']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse the changes
        DB::table('assessment_drafts')
            ->where('answer', 'Compliance')
            ->update(['answer' => 'Yes']);

        DB::table('assessment_drafts')
            ->where('answer', 'Non-Compliance')
            ->update(['answer' => 'No']);

        DB::table('upload_models')
            ->where('answer', 'Compliance')
            ->update(['answer' => 'Yes']);

        DB::table('upload_models')
            ->where('answer', 'Non-Compliance')
            ->update(['answer' => 'No']);
    }
};
