<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentDraft extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentDraftFactory> */
    use HasFactory;

    protected $fillable = [
        'id',              // Column 'ID'
        'question',        // Column 'Question'
        'instruction',     // Column 'Instruction'
        'answer',          // Column 'Answer'
        'findings',        // Column 'Findings'
        'risk_rating',     // Column 'Risk Rating'
        'legal_ref',       // Column 'Legal Ref'
        'recommendation',  // Column 'Recommendation'
        'assesment_id',    // Column 'Assesment ID'
        'category',        // Column 'Category'
        'subcategory',     // Column 'Subcategory'
    ];
}
