<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id' => 'sometimes|exists:questions,id',
            'content' => 'sometimes|string',
            'is_correct' => 'sometimes|boolean',
        ];
    }
}
