<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Attempt;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     required={"id","name"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="username", type="string", nullable=true, example="johndoe"),
 *     @OA\Property(property="phone", type="string", nullable=true, example="+998901234567"),
 *     @OA\Property(property="email", type="string", format="email", nullable=true, example="john@example.com"),
 *     @OA\Property(property="avatar", type="string", nullable=true, example="https://example.com/avatar.png"),
 *
 *     @OA\Property(
 *         property="roles",
 *         type="array",
 *         @OA\Items(type="string", example="admin")
 *     ),
 *
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2026-01-21T10:15:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2026-01-21T10:15:00Z")
 * )
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'phone',
        'email',
        'password',
        'avatar',
        'google_id',
        'telegram_id',
        'ref_telegram_id',
        'github_id',
        'get_prava',
        'is_bot_blocked',
    ];

    protected $with = [
        'roles'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'get_prava' => 'boolean',
            'is_bot_blocked' => 'boolean',
        ];
    }


    public function attempts()
    {
        return $this->hasMany(Attempt::class, 'user_id');
    }

    public function last_attempt()
    {
        return $this->hasOne(Attempt::class, 'user_id')
            ->whereNotNull('finished_at')
            ->latestOfMany('created_at');
    }


}
