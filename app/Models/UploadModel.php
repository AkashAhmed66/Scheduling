<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UploadModel extends Model
{
    use HasFactory;

    // Add the fillable columns
    protected $fillable = [
        'id',              // Column 'ID'
        'question',        // Column 'Question'
        'answer',          // Column 'Answer'
        'findings',        // Column 'Findings'
        'risk_rating',     // Column 'Risk Rating'
        'legal_ref',       // Column 'Legal Ref'
        'recommendation',  // Column 'Recommendation'
        'type',            // Column 'Type'
        'ncref',          // Column 'NC Ref'
        'category',        // Column 'Category'
        'subcategory',     // Column 'Subcategory'
        'mark',            // Column 'Mark'
        'color',           // Column 'Color'
    ];
}
