<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateYhqCategoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'yhq_category_id' => ['required', 'integer', 'exists:yhq_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'bhm' => ['nullable', 'numeric'],
            'summa' => ['nullable', 'integer'],
            'summa_min' => ['nullable', 'integer'],
            'summa_max' => ['nullable', 'integer'],
            'discount_summa' => ['nullable', 'integer'],
            'penalty_points' => ['nullable', 'numeric'],
            'description' => ['nullable', 'string'],
            'additional_penalty' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
