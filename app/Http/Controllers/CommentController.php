<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $ticketId = $request->query('ticketId'); 

        $comments = Comment::with('user', 'ticket', 'attachments')
            ->when($ticketId, function ($query) use ($ticketId) {
                return $query->where('ticket_id', $ticketId); 
            })
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'comments' => $comments
        ]);
    }


    public function store (Request $request) {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'ticketId' => 'required|integer|exists:tickets,id',
            'commentText' => 'required|string|min:3',
            'fileInput' => 'nullable|file|mimes:jpeg,jpg,png,bmp,mp4,mov|max:50000'
        ]);

        $newComment = Comment::create([
            'user_id' => $validated['userId'],
            'ticket_id' => $validated['ticketId'],
            'comment' => $validated['commentText'],
        ]); 

        if ($request->hasFile('fileInput')) {
            $file = $request->file('fileInput');
            $originalFileName = $file->getClientOriginalName(); 
            $path = $file->store('attachments', 'public'); 
    
            $attachment = new Attachment();
            $attachment->comment_id = $newComment->id;
            $attachment->file_name = $originalFileName; 
            $attachment->file_path = Storage::url($path); 
            $attachment->save();
        }

        return response()->json(['message' => 'Data stored successfully', 'data' => $newComment]); 
    }

    public function update (Request $request, $id) {
        $validated = $request->validate([
            'commentText' => 'required|string|min:3'
        ]);

        $comment = Comment::find($id);

        $comment->comment = $validated['commentText'];
        $comment->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $comment]); 
    }

    public function destroy($id) {
        $comment = Comment::findOrFail($id);

        $comment->delete();

        return response()->json(['message' => 'Data deleted successfully']); 


    }
}
