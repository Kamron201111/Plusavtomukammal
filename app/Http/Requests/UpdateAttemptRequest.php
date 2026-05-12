<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_id' => 'sometimes|exists:tickets,id',
            'user_id' => 'sometimes|exists:users,id',
            'score' => 'nullable|integer',
            'started_at' => 'nullable|date_format:Y-m-d H:i:s',
            'finished_at' => 'nullable|date_format:Y-m-d H:i:s',
        ];
    }
}
