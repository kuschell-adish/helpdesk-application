<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\User;

class UserController extends Controller
{
    public function update (Request $request, $id) {
        $user = User::findOrFail($id);

        if ($request->hasFile('profilePicture')) {
            $uploadedFile = $request->file('profilePicture');
            $path = $uploadedFile->store('profile_picture', 'public'); 
            $user->profile_picture = Storage::url($path);  
        }
        $user->update(); 

        return response()->json(['message' => 'User data updated successfully', 'data' => $user]); 
    }
}
