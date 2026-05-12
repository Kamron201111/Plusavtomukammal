<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     schema="Answer",
 *     type="object",
 *     title="Answer",
 *     required={"id","question_id","content","is_correct"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="question_id", type="integer", example=2, description="ID of the related question"),
 *     @OA\Property(property="content", type="string", example="42", description="Answer content"),
 *     @OA\Property(property="is_correct", type="boolean", example=true, description="Indicates if this is the correct answer")
 * )
 */


class Answer extends Model
{
    protected $fillable = [
        'question_id',
        'content',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function attemptAnswers(): HasMany
    {
        return $this->hasMany(AttemptAnswer::class);
    }
}
