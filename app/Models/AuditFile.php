<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'original_name',
        'file_path',
        'mime_type',
        'size',
        'folder_id',
        'user_id'
    ];

    /**
     * Get the folder this file belongs to
     */
    public function folder()
    {
        return $this->belongsTo(AuditFolder::class, 'folder_id');
    }

    /**
     * Get the user who uploaded this file
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 