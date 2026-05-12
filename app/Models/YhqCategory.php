<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YhqCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'yhq_id',
        'name',
        'is_active',
    ];


    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function yhq()
    {
        return $this->belongsTo(Yhq::class);
    }

    public function items()
    {
        return $this->hasMany(YhqCategoryItem::class);
    }
}
