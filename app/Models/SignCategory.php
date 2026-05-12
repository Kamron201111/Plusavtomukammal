<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SignCategory extends Model
{
    /** @use HasFactory<\Database\Factories\SignCategoryFactory> */
    use HasFactory;


    protected $fillable = [
        'name',
        'is_active',
    ];

    public function signs(): HasMany
    {
        return $this->hasMany(Sign::class);
    }
}
