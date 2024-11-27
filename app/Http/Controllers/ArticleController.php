<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index () {
        $articles = Article::with('user')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json(['articles' => $articles]); 
    }
}
