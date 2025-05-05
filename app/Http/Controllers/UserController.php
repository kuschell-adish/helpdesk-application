<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{   
    public function index (Request $request) {

        $user = Auth::user();
        $user->load(['company', 'department']); 
        return response()->json([
            'user' => $user
        ]);
    }

    public function update (Request $request, User $user) {

        // $validated = $request->validate([
        //     'profilePicture' => 'nullable|image|mimes:jpeg,jpg,png|max:2048'
        // ]); 

        Log::info('Request received', ['request_data' => $request->all()]);

        if ($request->hasFile('profilePicture')) {
            $file = $request->file('profilePicture');

            Log::info('Received profile picture', [
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_mime_type' => $file->getMimeType()
            ]);
            
            $path = $file->store('profile_picture', 'public'); 
            $user->profile_picture = Storage::url($path); 
        }
        $user->save();

        return response()->json(['message' => 'Data updated successfully', 'profile_picture_url' => $user->profile_picture]); 
    }
}
