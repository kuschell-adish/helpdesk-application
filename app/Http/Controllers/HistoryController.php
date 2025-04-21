<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\History;

class HistoryController extends Controller
{
    public function show ($id) {
        $histories = History::where('ticket_id', $id)
        ->orderBy('id', 'desc')
        ->get();

        return response()->json(['histories' => $histories]); 
    }
}
