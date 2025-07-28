<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentInfo extends Model
{
    protected $fillable = [
        'assessment_id',
        // Assessor Information
        'audit_company',
        'report_no',
        'assessment_type',
        'report_heading',
        'schedule_type',
        'assessors',
        'assessment_date',
        'capa_heading',
        
        // Facility Information
        'facility_name',
        'facility_address',
        'business_license',
        'country',
        'year_establishment',
        'building_description',
        'multiple_tenants',
        'site_owned',
        'monthly_production',
        'primary_contact_name',
        'position',
        'email',
        'contact_number',
        'social_compliance_contact',
        
        // Employee Information
        'number_of_employees',
        'number_of_workers',
        'male_employees',
        'female_employees',
        'local_workers',
        'foreign_workers',
        'worker_turnover_rate',
        'labor_agent_used',
        'management_language',
        'workers_language',
        
        // Assessment Overviews
        'general_assessment_overview',
        'facility_good_practices',
        'worker_interview',
        'additional_info',
        'disclaimer',
        
        // Facility Image
        'facility_image_path',
    ];

    protected $casts = [
        'assessment_date' => 'date',
        'year_establishment' => 'integer',
        'number_of_employees' => 'integer',
        'number_of_workers' => 'integer',
        'male_employees' => 'integer',
        'female_employees' => 'integer',
        'local_workers' => 'integer',
        'foreign_workers' => 'integer',
    ];

    /**
     * Get the assessment that owns the assessment info.
     */
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
