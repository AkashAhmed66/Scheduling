<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('upload_models', function (Blueprint $table) {
            $table->text('instruction')->nullable()->after('question');
        });

        Schema::table('assessment_drafts', function (Blueprint $table) {
            $table->text('instruction')->nullable()->after('question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('upload_models', function (Blueprint $table) {
            $table->dropColumn('instruction');
        });

        Schema::table('assessment_drafts', function (Blueprint $table) {
            $table->dropColumn('instruction');
        });
    }
};
