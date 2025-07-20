<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OverallRating extends Model
{
    use HasFactory;

    protected $table = 'overall_rating';

    protected $fillable = [
        'percentage',
        'label',
        'color',
        'type',
    ];
}
