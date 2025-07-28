<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentInfoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'assessment_id' => 'required|exists:assessments,id',
            
            // Assessor Information
            'audit_company' => 'nullable|string|max:255',
            'report_no' => 'nullable|string|max:255',
            'assessment_type' => 'nullable|string|max:255',
            'report_heading' => 'nullable|string|max:255',
            'schedule_type' => 'nullable|string|max:255',
            'assessors' => 'nullable|string|max:255',
            'assessment_date' => 'nullable|date',
            'capa_heading' => 'nullable|string|max:255',
            
            // Facility Information
            'facility_name' => 'nullable|string|max:255',
            'facility_address' => 'nullable|string',
            'business_license' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'year_establishment' => 'nullable|integer|min:1800|max:' . date('Y'),
            'building_description' => 'nullable|string',
            'multiple_tenants' => 'nullable|in:Yes,No',
            'site_owned' => 'nullable|in:Owned,Rented',
            'monthly_production' => 'nullable|string|max:255',
            'primary_contact_name' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => 'nullable|string|max:255',
            'social_compliance_contact' => 'nullable|string|max:255',
            
            // Employee Information
            'number_of_employees' => 'nullable|integer|min:0',
            'number_of_workers' => 'nullable|integer|min:0',
            'male_employees' => 'nullable|integer|min:0',
            'female_employees' => 'nullable|integer|min:0',
            'local_workers' => 'nullable|integer|min:0',
            'foreign_workers' => 'nullable|integer|min:0',
            'worker_turnover_rate' => 'nullable|string|max:255',
            'labor_agent_used' => 'nullable|in:Yes,No',
            'management_language' => 'nullable|string|max:255',
            'workers_language' => 'nullable|string|max:255',
            
            // Assessment Overviews
            'general_assessment_overview' => 'nullable|string',
            'facility_good_practices' => 'nullable|string',
            'worker_interview' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'disclaimer' => 'nullable|string',
            
            // Facility Image
            'facility_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
