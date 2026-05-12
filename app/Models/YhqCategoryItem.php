<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YhqCategoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'yhq_category_id',
        'name',
        'bhm',
        'summa',
        'summa_min',
        'summa_max',
        'discount_summa',
        'penalty_points',
        'description',
        'additional_penalty',
        'is_active',
    ];

    protected $casts = [
        'bhm' => 'float',
        'summa' => 'integer',
        'summa_min' => 'integer',
        'summa_max' => 'integer',
        'discount_summa' => 'integer',
        'penalty_points' => 'float',
        'is_active' => 'boolean'
    ];

    public function category()
    {
        return $this->belongsTo(YhqCategory::class, 'yhq_category_id');
    }
}
