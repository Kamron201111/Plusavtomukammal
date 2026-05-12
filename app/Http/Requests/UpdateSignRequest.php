<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateSignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'sign_category_id' => ['required', 'integer', 'exists:sign_categories,id'],
            'content' => ['required', 'string', 'max:1000'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ];
    }
}
