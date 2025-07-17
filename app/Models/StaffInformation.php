<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffInformation extends Model
{
    protected $table = 'staff_information';
    
    protected $fillable = [
        'user_id',
        'stuff_day',
        'start_date',
        'end_date',
        'note',
        'job_id',
        'assessment_id',
        'report_write'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'report_write' => 'boolean'
    ];
    
    /**
     * Get the user associated with this staff information
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    /**
     * Get the job associated with this staff information
     */
    public function job()
    {
        return $this->belongsTo(AuditJob::class, 'job_id', 'id');
    }
    
    /**
     * Get the assessment associated with this staff information (if report writer)
     */
    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id', 'id');
    }
}
