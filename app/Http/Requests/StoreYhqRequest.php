<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreYhqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'brv_amount' => ['nullable', 'numeric'],
            'brv_description' => ['nullable', 'string'],
            'discount_days' => ['nullable', 'integer'],
            'discount_percent' => ['nullable', 'numeric'],
            'payment_deadline_regular' => ['nullable', 'integer'],
            'payment_deadline_camera' => ['nullable', 'integer'],
            'cancellation_if_no_decision_days' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}
