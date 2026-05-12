<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');


Route::post('login', [\App\Http\Controllers\Api\LoginController::class, 'login']);
Route::post('/auth/login-otp', [\App\Http\Controllers\Api\LoginController::class, 'loginWithOtp']);

Route::middleware('auth:sanctum')
    ->name('api.')
    ->group(function () {

        Route::apiResource('attempts', \App\Http\Controllers\Api\AttemptController::class);
        Route::post('attempts/{attempt}/submit', [\App\Http\Controllers\Api\AttemptController::class, 'submit'])->name('attempts.submit');

        Route::apiResource('attempt_answers', \App\Http\Controllers\Api\AttemptAnswerController::class)->only(['update']);
        Route::apiResource('user', \App\Http\Controllers\Api\UserController::class)->only(['index', 'update']);

        Route::apiResource('tickets', \App\Http\Controllers\Api\TicketController::class);

        // TMA Info & Stats
        Route::get('road_line', [\App\Http\Controllers\Api\RoadLineController::class, 'index']);
        Route::get('sign_category', [\App\Http\Controllers\Api\SignCategoryController::class, 'index']);
        Route::get('yhq', [\App\Http\Controllers\Api\YhqController::class, 'index']);
    });

Route::post('humo/webhook', [\App\Http\Controllers\Api\HumoWebhookController::class, 'handle']);


//handle requests from payment system
Route::any('/handle/{paysys}', function ($paysys) {
    (new Goodoneuz\PayUz\PayUz)->driver($paysys)->handle();
});

//redirect to payment system or payment form
Route::any('/pay/{paysys}/{key}/{amount}', function ($paysys, $key, $amount) {
    $model = Goodoneuz\PayUz\Services\PaymentService::convertKeyToModel($key);
    $url = request('redirect_url', '/'); // redirect url after payment completed
    $pay_uz = new Goodoneuz\PayUz\PayUz;
    $pay_uz
        ->driver($paysys)
        ->redirect($model, $amount, 860, $url);
});
