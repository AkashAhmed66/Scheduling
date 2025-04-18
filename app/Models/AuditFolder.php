<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditFolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'user_id'
    ];

    /**
     * Get the parent folder
     */
    public function parent()
    {
        return $this->belongsTo(AuditFolder::class, 'parent_id');
    }

    /**
     * Get all child folders
     */
    public function children()
    {
        return $this->hasMany(AuditFolder::class, 'parent_id');
    }

    /**
     * Get all files in this folder
     */
    public function files()
    {
        return $this->hasMany(AuditFile::class, 'folder_id');
    }

    /**
     * Get the user who created this folder
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Recursive method to get all children of a folder
     */
    public function getAllChildren()
    {
        $children = $this->children;
        
        foreach ($this->children as $child) {
            $children = $children->merge($child->getAllChildren());
        }
        
        return $children;
    }
} 