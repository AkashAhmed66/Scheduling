<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivateUser extends Model
{
    use HasFactory;

    protected $table = 'activate_users';

    protected $fillable = [
        'name',
        'email',
        'role',
    ];
}
