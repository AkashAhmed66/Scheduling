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
        Schema::create('assessment_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->onDelete('cascade');
            
            // Assessor Information
            $table->string('audit_company')->nullable();
            $table->string('report_no')->nullable();
            $table->string('assessment_type')->nullable();
            $table->string('report_heading')->nullable();
            $table->string('schedule_type')->nullable();
            $table->string('assessors')->nullable();
            $table->date('assessment_date')->nullable();
            $table->string('capa_heading')->nullable();
            
            // Facility Information
            $table->string('facility_name')->nullable();
            $table->text('facility_address')->nullable();
            $table->string('business_license')->nullable();
            $table->string('country')->nullable();
            $table->year('year_establishment')->nullable();
            $table->text('building_description')->nullable();
            $table->enum('multiple_tenants', ['Yes', 'No'])->nullable();
            $table->enum('site_owned', ['Owned', 'Rented'])->nullable();
            $table->string('monthly_production')->nullable();
            $table->string('primary_contact_name')->nullable();
            $table->string('position')->nullable();
            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('social_compliance_contact')->nullable();
            
            // Employee Information
            $table->integer('number_of_employees')->nullable();
            $table->integer('number_of_workers')->nullable();
            $table->integer('male_employees')->nullable();
            $table->integer('female_employees')->nullable();
            $table->integer('local_workers')->nullable();
            $table->integer('foreign_workers')->nullable();
            $table->string('worker_turnover_rate')->nullable();
            $table->enum('labor_agent_used', ['Yes', 'No'])->nullable();
            $table->string('management_language')->nullable();
            $table->string('workers_language')->nullable();
            
            // Assessment Overviews
            $table->text('general_assessment_overview')->nullable();
            $table->text('facility_good_practices')->nullable();
            $table->text('disclaimer')->nullable();
            
            // Facility Image
            $table->string('facility_image_path')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_infos');
    }
};
