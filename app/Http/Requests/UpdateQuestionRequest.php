<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'answers' => 'required|array|min:1|max:5',
            'answers.*.id' => 'nullable|integer|exists:answers,id',
            'answers.*.content' => 'required|string',
            'answers.*.is_correct' => 'nullable|boolean',
        ];
    }
}
