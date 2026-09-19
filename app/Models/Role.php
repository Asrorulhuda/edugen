<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    // Constants for 4 core roles
    public const SUPER_ADMIN = 'SUPER_ADMIN';
    public const PERSONAL_TEACHER = 'PERSONAL_TEACHER';
    public const ADMIN = 'ADMIN';
    public const TEACHER = 'TEACHER';

    protected $fillable = [
        'name',
        'display_name',
        'scope',
        'description',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(TenantMembership::class);
    }

    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }
}
