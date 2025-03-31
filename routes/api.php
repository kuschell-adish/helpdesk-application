<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('tickets', TicketController::class)->only([
    'index', 'create', 'store', 'show', 'update'
]);

Route::resource('articles', ArticleController::class)->only([
    'index', 'create', 'store', 'show', 'update'
]);

Route::resource('comments', CommentController::class)->only([
    'index', 'store', 'update', 'destroy'
]);

Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'updateProfile']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::group(['middleware' => 'auth:sanctum'], function() {
      Route::post('logout', [AuthController::class, 'logout']);
      Route::get('user', [AuthController::class, 'user']);
    });
});
