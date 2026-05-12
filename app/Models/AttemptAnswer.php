<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     schema="AttemptAnswer",
 *     type="object",
 *     title="AttemptAnswer",
 *     required={"id","attempt_id","question_id"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="attempt_id", type="integer", example=5, description="ID of the related attempt"),
 *     @OA\Property(property="question_id", type="integer", example=2, description="ID of the related question"),
 *     @OA\Property(property="answer_id", type="integer", nullable=true, example=3, description="ID of the selected answer, nullable if not answered yet"),
 *
 *     @OA\Property(
 *         property="question",
 *         ref="#/components/schemas/Question"
 *     ),
 *     @OA\Property(
 *         property="answer",
 *         ref="#/components/schemas/Answer"
 *     )
 * )
 */


class AttemptAnswer extends Model
{
    protected $table = 'attempt_answers';

    protected $fillable = [
        'attempt_id',
        'question_id',
        'answer_id',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class);
    }
}
