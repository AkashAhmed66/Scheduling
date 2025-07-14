<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportingDocuments extends Model
{
    use HasFactory;

    // Add the columns to the fillable property
    protected $fillable = [
        'name',
        'folder',
        'path',
        'created_at',
        'updated_at',
        'jobId',
        'teamId',
    ];
}
