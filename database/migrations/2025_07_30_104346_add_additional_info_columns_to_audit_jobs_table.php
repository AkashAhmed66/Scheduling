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
        Schema::table('audit_jobs', function (Blueprint $table) {
            $table->text('add_info_coordination')->nullable();
            $table->text('add_info_auditors')->nullable();
            $table->text('add_info_report_review')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audit_jobs', function (Blueprint $table) {
            $table->dropColumn(['add_info_coordination', 'add_info_auditors', 'add_info_report_review']);
        });
    }
};
