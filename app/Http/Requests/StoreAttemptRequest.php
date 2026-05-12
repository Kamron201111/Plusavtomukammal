<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        if (!$this->has('user_id')) {
            $this->merge([
                'user_id' => $this->user()->id,
            ]);
        }

    }

    public function rules(): array
    {
        return [
            'ticket_id' => 'nullable|exists:tickets,id',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
