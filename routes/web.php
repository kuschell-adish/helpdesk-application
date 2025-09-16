<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArticleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login/google', [AuthController::class, 'loginWithGoogle']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

Route::middleware('auth')->group(function () {
    Route::get('/user/tickets', [TicketController::class, 'userTickets']);
    Route::get('/admin/tickets', [TicketController::class, 'adminTickets']);
    Route::post('/update/profile', [UserController::class, 'updateProfile']);

    Route::resource('tickets', TicketController::class)->only([
        'index', 'create', 'store', 'show', 'update'
    ]);

    Route::resource('comments', CommentController::class)->only([
        'index', 'store', 'update', 'destroy'
    ]);

    Route::resource('articles', ArticleController::class)->only([
        'index', 'store', 'show', 'update', 'destroy'
    ]);

});
