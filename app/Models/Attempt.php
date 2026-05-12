<?php

namespace App\Models;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     schema="Attempt",
 *     type="object",
 *     title="Attempt",
 *     required={"id","ticket_id","user_id","score","started_at"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="ticket_id", type="integer", example=3),
 *     @OA\Property(property="user_id", type="integer", example=7),
 *     @OA\Property(property="score", type="integer", example=0),
 *     @OA\Property(property="started_at", type="string", format="date-time", example="2026-01-21T10:15:00Z"),
 *     @OA\Property(property="finished_at", type="string", format="date-time", nullable=true, example=null),
 *     @OA\Property(property="ticket", ref="#/components/schemas/Ticket"),
 *     @OA\Property(
 *         property="attempt_answers",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/AttemptAnswer")
 *     )
 * )
 */
class Attempt extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'score',
        'questions_count',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attemptAnswers(): HasMany
    {
        return $this->hasMany(AttemptAnswer::class);
    }
}
