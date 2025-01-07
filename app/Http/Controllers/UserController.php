<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\User;

class UserController extends Controller
{   

    public function updateProfile (Request $request) {
        $user = $request->user();

        if ($request->hasFile('profilePicture')) {
            $path = $file->store('profile_picture', 'public'); 
            $user->profile_picture = Storage::url($path);
            $user->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }
}
