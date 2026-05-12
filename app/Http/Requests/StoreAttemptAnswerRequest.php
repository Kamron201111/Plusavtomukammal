<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttemptAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attempt_id' => 'required|exists:attempts,id',
            'question_id' => 'required|exists:questions,id',
            'answer_id' => 'required|exists:answers,id',
        ];
    }
}
