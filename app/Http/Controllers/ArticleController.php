<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index () {
        $articles = Article::with('user')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json(['articles' => $articles]); 
    }

    public function show ($id) {
        $article = Article::findOrFail($id)->load('user.company', 'user.department');

        return response()->json(['article' => $article]); 
    }

    public function store (Request $request) {
        $user = Auth::user();

        $validated = $request->validate([
            'titleInput' => 'required|string|min:10',
            'descriptionInput' => 'required|string|min:10',
        ]);

        $newArticle = Article::create([
            'user_id' => $user->id,
            'title' => $validated['titleInput'],
            'content' => $validated['descriptionInput']
        ]);

        return response()->json(['message' => 'Data stored successfully', 'data' => $newArticle]); 
    } 

    public function update (Request $request, $id) {
        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'content' => 'required|string|min:10',
        ]);

        $article = Article::find($id);

        $article->fill($validated);
        $article->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $article]); 
    }

    public function destroy($id) {
        $article = Article::findOrFail($id);

        $article->delete();

        return response()->json(['message' => 'Data deleted successfully']); 


    }
}
