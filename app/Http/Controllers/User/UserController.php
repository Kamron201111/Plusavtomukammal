<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $this->authorize('viewAny', User::class);

        if ($request->per_page) {
            $per_page = $request->per_page;
        } else {
            $per_page = 10;
        }

        $user = User::with([
            'roles',
        ])
            ->whereNotIn('id', [Auth::user()->id])
            ->orderBy('id', 'desc');

        if ($request->search) {
            $user->where(function ($query) use ($request) {
                $query->whereLike('name', "%$request->search%")
                    ->orWhereLike('phone', "%$request->search%")
                    ->orWhereLike('username', "%$request->search%")
                    ->orWhereLike('telegram_id', "%$request->search%")
                    ->orWhereLike('email', "%$request->search%");
            });
        }

        if ($request->role) {
            $user->whereHas('roles', function ($query) use ($request) {
                $query->where('name', $request->role);
            });
        }

        if ($request->has('is_bot_blocked') && $request->is_bot_blocked !== null && $request->is_bot_blocked !== '') {
            $user->where('is_bot_blocked', $request->is_bot_blocked);
        }

        if ($request->has('get_prava') && $request->get_prava !== null && $request->get_prava !== '') {
            $user->where('get_prava', $request->get_prava);
        }

        if (!Auth::user()->hasRole('Admin')) {
            $user->where(function ($query) {
                $query->where('ref_telegram_id', '=', Auth::user()->telegram_id);
            });
        }

        $user = $user->paginate($per_page);

        $roles = Role::all();

        return Inertia::render('user/index', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('viewAny', User::class);

        try {

            $validated = $request->validated();

            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']); // Don't update if password is empty
            }

            $user = User::query()->create($validated);

            $user->assignRole('Client');

            return back()->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {

        if (!Auth::user()->hasRole('Admin')) {
            return back()->with('error', "You are not allowed to access this page");
        }

        $user->load([
            'last_attempt',
            'attempts' => function ($query) {
                $query->select('attempts.*', DB::raw('max(score) as score'))
                    ->where('finished_at', '>=', today()->subDays(28))
                    ->selectRaw('DATE(finished_at) as date, MAX(score) as score, finished_at, started_at, created_at')
                    ->groupByRaw('DATE(finished_at)')
                    ->orderBy('finished_at', 'asc');
            },
        ])
            ->loadCount('attempts')
            ->loadSum('attempts', 'score')
            ->loadSum('attempts', 'questions_count');

        // Oxirgi 28 kunlik urinishlar (attempts)
        $daily_attempts = DB::select("
            SELECT
                COUNT(id) AS items_count,
                COUNT(DISTINCT user_id) AS unique_users_count,
                DATE(started_at) AS day_date
            FROM attempts
            WHERE user_id = ? AND started_at >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
            GROUP BY DATE(started_at)
            ORDER BY day_date ASC;
        ", [$user->id]);

        $weekly_attempts = DB::select("
            SELECT
                d.weekday AS weekday_number,
                COUNT(a.id) AS items_count,
                COUNT(DISTINCT a.user_id) AS unique_users_count
            FROM (
                SELECT 0 AS weekday UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
                SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
            ) d
            LEFT JOIN attempts a
                ON WEEKDAY(a.started_at) = d.weekday AND a.user_id = ?
            GROUP BY d.weekday
            ORDER BY d.weekday;
        ", [$user->id]);


        $hourly_attempts = DB::select("
                    SELECT
                        h.hour AS hour_of_day,
                        COUNT(a.id) AS items_count,
                        COUNT(DISTINCT a.user_id) AS unique_users_count
                    FROM (
                             SELECT 0 AS hour UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
                             SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
                             SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL
                             SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL
                             SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL
                             SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL
                             SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL
                             SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23
                         ) h
                             LEFT JOIN attempts a
                                       ON HOUR(a.started_at) = h.hour AND a.user_id = ?
                    GROUP BY h.hour
                    ORDER BY h.hour;
            ", [$user->id]);

        $today_hourly_attempts = DB::select("
            SELECT
                COUNT(id) AS items_count,
                COUNT(DISTINCT user_id) AS unique_users_count,
                HOUR(started_at) AS hour_of_day
            FROM attempts
            WHERE user_id = ? AND started_at >= CURDATE()
              AND started_at < CURDATE() + INTERVAL 1 DAY
            GROUP BY HOUR(started_at)
            ORDER BY hour_of_day;
        ", [$user->id]);

        return Inertia::render('user/show', [
            'user' => $user,
            'daily_attempts' => $daily_attempts,
            'weekly_attempts' => $weekly_attempts,
            'hourly_attempts' => $hourly_attempts,
            'today_hourly_attempts' => $today_hourly_attempts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {

            $validated = $request->validated();

            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']); // Don't update if password is empty
            }

            $user->update($validated);

            if (Auth::user()->hasRole('Admin')) {
                if (isset($validated['role'])) {
                    $user->syncRoles($validated['role']);
                }
            }

            return back()->with('success', 'User updated successfully.');
        } catch (\Exception $e) {

            dd($e);
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {

            $user->delete();
            return back()->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
