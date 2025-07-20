<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskRating extends Model
{
    use HasFactory;

    protected $table = 'risk_rating';

    protected $fillable = [
        'label',
        'mark',
        'color',
        'type',
    ];
}
