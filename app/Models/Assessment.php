<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
