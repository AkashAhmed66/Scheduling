<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'integer',
        ];
    }

    /**
     * Check if user can manage audit documents
     */
    public function canManageAuditDocs()
    {
        return in_array($this->role, [0, 1]);
    }
    
    /**
     * Get folders created by this user
     */
    public function auditFolders()
    {
        return $this->hasMany(AuditFolder::class);
    }
    
    /**
     * Get files uploaded by this user
     */
    public function auditFiles()
    {
        return $this->hasMany(AuditFile::class);
    }

    public function auditJobForReviwers()
    {
        return $this->hasMany(AuditJob::class, 'reviewers', 'id');
    }
    
    public function auditJobForAuditors()
    {
        return $this->hasMany(AuditJob::class, 'auditors', 'id');
    }
    public function assessmentss()
    {
        return $this->hasMany(Assessment::class, 'users', 'id');
    }
}
