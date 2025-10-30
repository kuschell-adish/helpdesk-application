<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;

use App\Services\ImageUploadService;

class CommentController extends Controller
{
    protected $imageService;

    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }


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
            'user_id' => 'required|integer|exists:users,id',
            'ticket_id' => 'required|integer|exists:tickets,id',
            'comment' => 'required|string|min:3',
            'fileInput' => 'nullable|file|mimes:jpeg,jpg,png,bmp,mp4,mov|max:50000'
        ]);

        $comment = new Comment();
        $comment->fill($validated);

        if ($request->hasFile('fileInput')) {
            $file = $request->file('fileInput');
            $originalFileName = $file->getClientOriginalName();
            $path = $this->imageService->upload(
                $file,
                'comments/',
                'comment_'
            );

            $attachment = new Attachment();
            $attachment->comment_id = $comment->id;
            $attachment->file_name = $originalFileName;
            $attachment->file_path = $path;
            $attachment->save();
        }

        $comment->save();

        return response()->json(['message' => 'Data stored successfully', 'data' => $comment]);
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
