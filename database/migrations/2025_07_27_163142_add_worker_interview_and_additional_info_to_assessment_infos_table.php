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
        Schema::table('assessment_infos', function (Blueprint $table) {
            $table->text('worker_interview')->nullable()->after('facility_good_practices');
            $table->text('additional_info')->nullable()->after('worker_interview');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assessment_infos', function (Blueprint $table) {
            $table->dropColumn(['worker_interview', 'additional_info']);
        });
    }
};
