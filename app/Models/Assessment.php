<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Assessment extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentFactory> */
    use HasFactory;

    public function job()
    {
        return $this->hasOne(AuditJob::class, 'assesment', 'id');
    }
    
    public function userss()
    {
        return $this->belongsTo(User::class, 'users', 'id');
    }

    /**
     * Get the assessment info associated with the assessment.
     */
    public function assessmentInfo(): HasOne
    {
        return $this->hasOne(AssessmentInfo::class);
    }
    
    /**
     * Get staff members assigned to this assessment as report writers
     */
    public function reportWriters()
    {
        return $this->hasMany(StaffInformation::class, 'assessment_id', 'id')
                    ->where('report_write', true);
    }
}
