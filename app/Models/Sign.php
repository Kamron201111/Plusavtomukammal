<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sign extends Model
{
    /** @use HasFactory<\Database\Factories\SignFactory> */
    use HasFactory;


    protected $fillable = [
        'sign_category_id',
        'content',
        'image_url',
        'is_active',
    ];

    public function signCategory() : BelongsTo
    {
        return $this->belongsTo(SignCategory::class);
    }
}
