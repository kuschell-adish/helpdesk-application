<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;
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


Route::middleware('auth:sanctum')->resource('articles', ArticleController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

Route::middleware('auth:sanctum')->resource('users', UserController::class)->only([
    'index', 'update'
]);
