<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\LoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('login', [LoginController::class, 'login']);
