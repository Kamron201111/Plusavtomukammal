<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_id' => 'required|exists:tickets,id',
            'content'   => 'required|string',
            'description'   => 'nullable|string',
            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // Fayl o'zi keladi
            'answers'   => 'required|array|min:1|max:6',
            'answers.*.content'    => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ];
    }
}
