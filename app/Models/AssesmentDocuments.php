<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssesmentDocuments extends Model
{
    use HasFactory;

    // Define the fillable columns
    protected $fillable = [
        'documentName',
        'fileName',
        'jobId',
        'teamId',
        'filePath',
    ];
}
