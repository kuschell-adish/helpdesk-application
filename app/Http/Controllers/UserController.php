<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Models\User;

use App\Services\ImageUploadService;

class UserController extends Controller
{
    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

    //cannot use put or patch in supabase storage
    public function updateProfile (Request $request) {
        $request->validate([
            'profilePicture' => 'nullable|image|mimes:jpeg,jpg,png|max:2048'
        ]);


        $user = Auth::user();

        if ($request->hasFile('profilePicture')) {
            $file = $request->file('profilePicture');
            $originalFileName = $file->getClientOriginalName();
            $path = $this->imageService->upload(
                $file,
                'profiles/',
                'profile_'
            );
            $user->profile_picture = $path;
        }

        $user->save();

        return response()->json(['message' => 'Data updated successfully', 'profile_picture_url' => $user->profile_picture]);
    }
}
