<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     schema="Question",
 *     type="object",
 *     title="Question",
 *     required={"id","ticket_id","content"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="ticket_id", type="integer", example=3, description="ID of the related ticket"),
 *     @OA\Property(property="content", type="string", example="What is 2 + 2?", description="Question text"),
 *     @OA\Property(property="image_url", type="string", nullable=true, example=null, description="Optional image URL for the question"),
 *
 *     @OA\Property(
 *         property="answers",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Answer")
 *     )
 * )
 */


class Question extends Model
{
    protected $fillable = [
        'ticket_id',
        'content',
        'description',
        'image_url',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function attemptAnswers(): HasMany
    {
        return $this->hasMany(AttemptAnswer::class);
    }
}
