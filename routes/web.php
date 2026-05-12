<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleAuthController;




Route::get('/', function () {
    return redirect()->route('dashboard');
//    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [\App\Http\Controllers\HomeController::class, 'index'])->name('dashboard');

    Route::resource('user', \App\Http\Controllers\User\UserController::class);
    Route::resource('tickets', \App\Http\Controllers\TicketController::class);
    Route::resource('questions', \App\Http\Controllers\QuestionController::class);

    Route::resource('attempts', \App\Http\Controllers\AttemptController::class);
    Route::resource('attempt_answers', \App\Http\Controllers\AttemptAnswerController::class)->only(['update']);
    Route::post('attempt_answers/{attempt_answer}/ajax-update', [\App\Http\Controllers\AttemptAnswerController::class, 'updateAjax'])->name('attempt_answers.update_ajax');

    Route::post('attempts/{attempt}/submit', [\App\Http\Controllers\AttemptController::class, 'submit'])->name('attempts.submit');

    Route::get('active_tickets', [\App\Http\Controllers\TicketController::class, 'activeTickets'])->name('active_tickets');

    Route::get('practice_show/{attempt}', [\App\Http\Controllers\AttemptController::class, 'practice_show'])->name('practice_show');

    // Public display pages (separate routes, dashboard buttons go here)
    Route::get('active_road_line', [\App\Http\Controllers\RoadLineController::class, 'activeIndex'])->name('active_road_line');
    Route::get('active_sign_category', [\App\Http\Controllers\SignCategoryController::class, 'activeIndex'])->name('active_sign_category');
    Route::get('active_yhq', [\App\Http\Controllers\YhqController::class, 'activeIndex'])->name('active_yhq');

    // Admin-only CRUD routes
    Route::middleware(['role:Admin'])->group(function () {
        Route::resource('road_line', \App\Http\Controllers\RoadLineController::class)->except(['create', 'edit']);
        Route::resource('sign_category', \App\Http\Controllers\SignCategoryController::class)->except(['create', 'edit']);
        Route::resource('signs', \App\Http\Controllers\SignController::class)->except(['create', 'edit', 'show', 'index']);
        Route::resource('yhq', \App\Http\Controllers\YhqController::class)->except(['create', 'edit']);
        Route::resource('yhq_category', \App\Http\Controllers\YhqCategoryController::class)->except(['create', 'edit', 'index']);
        Route::resource('yhq_category_item', \App\Http\Controllers\YhqCategoryItemController::class)->except(['create', 'edit', 'show', 'index']);
    });

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

Route::get('/auth/github', [\App\Http\Controllers\Auth\GithubAuthController::class, 'redirect'])->name('github.redirect');
Route::get('/auth/github/callback', [\App\Http\Controllers\Auth\GithubAuthController::class, 'callback'])->name('github.callback');



Route::get('/lang/{locale}', function ($locale) {
    if (!in_array($locale, ['en', 'uz', 'ru'])) {
        abort(400);
    }
    session(['locale' => $locale]);
    app()->setLocale($locale);
    return back();
});
