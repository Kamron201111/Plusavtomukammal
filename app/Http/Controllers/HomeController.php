<?php

namespace App\Http\Controllers;

use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {

        $user = User::query()
            ->with([
                'last_attempt',
                'attempts' => function ($query) {
                    $query->select('attempts.*', DB::raw('max(score) as score'))
                        ->where('finished_at', '>=', today()->subDays(28))
                        ->selectRaw('DATE(finished_at) as date, MAX(score) as score, finished_at, started_at, created_at')
                        ->groupByRaw('DATE(finished_at)')
                        ->orderBy('finished_at', 'asc');
                },
            ])
            ->withCount('attempts')
            ->withSum('attempts', 'score')
            ->withSum('attempts', 'questions_count')
            ->find(Auth::id());

        if (Auth::user()->hasRole('Admin')) {
            // Oxirgi 28 kunlik yangi foydalanuvchilar
            $daily_users = DB::select("
            SELECT 
                COUNT(id) AS items_count, 
                DATE(created_at) AS day_date
            FROM users
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
            GROUP BY DATE(created_at)
            ORDER BY day_date ASC;
        ");

            // Oxirgi 28 kunlik urinishlar (attempts)
            $daily_attempts = DB::select("
            SELECT 
                COUNT(id) AS items_count, 
                COUNT(DISTINCT user_id) AS unique_users_count, 
                DATE(started_at) AS day_date
            FROM attempts
            WHERE started_at >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
            GROUP BY DATE(started_at)
            ORDER BY day_date ASC;
        ");

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
        ON WEEKDAY(a.started_at) = d.weekday
    GROUP BY d.weekday
    ORDER BY d.weekday;
");


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
                                       ON HOUR(a.started_at) = h.hour
                    GROUP BY h.hour
                    ORDER BY h.hour;
            ");

            $today_hourly_attempts = DB::select("
    SELECT
        COUNT(id) AS items_count,
        COUNT(DISTINCT user_id) AS unique_users_count,
        HOUR(started_at) AS hour_of_day
    FROM attempts
    WHERE started_at >= CURDATE()
      AND started_at < CURDATE() + INTERVAL 1 DAY
    GROUP BY HOUR(started_at)
    ORDER BY hour_of_day;
");


        } else {
            $daily_users = [];
            $daily_attempts = [];
            $weekly_attempts = [];
            $hourly_attempts = [];
            $today_hourly_attempts = [];
        }

        return Inertia::render('dashboard', [
            'user' => $user,
            'daily_users' => $daily_users,
            'daily_attempts' => $daily_attempts,
            'weekly_attempts' => $weekly_attempts,
            'hourly_attempts' => $hourly_attempts,
            'today_hourly_attempts' => $today_hourly_attempts,
        ]);


    }
}
