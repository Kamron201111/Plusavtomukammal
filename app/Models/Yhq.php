<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Yhq extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'brv_amount',
        'brv_description',
        'discount_days',
        'discount_percent',
        'payment_deadline_regular',
        'payment_deadline_camera',
        'cancellation_if_no_decision_days',
        'is_active',
    ];


    protected $casts = [
        'is_active' => 'boolean'
    ];
    public function categories()
    {
        return $this->hasMany(YhqCategory::class);
    }
}
