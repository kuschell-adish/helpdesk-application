<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Models\User;
use App\Models\Department;

use App\Services\ImageUploadService;

class UserController extends Controller
{
    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index () {
        $users = User::paginate(10);
        $departments = Department::all();

        return response()->json([
            'users' => $users,
            'departments' => $departments
        ]);
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

    public function store (Request $request) {

        $validated = $request->validate([
            "profile_picture" => 'nullable|image|mimes:jpeg,png,bmp,tiff|max:2048',
            "email" => ['required', Rule::unique('users', 'email')],
            "first_name" => 'required|string|min:2|max:30',
            "middle_name" => 'nullable|string|min:2|max:30',
            "last_name" => 'required|string|min:2|max:30',
            "department_id" => 'required',
            "position" => 'required|string|min:5|max:30',
        ]);

        $user = new User();
        // $user->login_provider =
        $user->fill($validated);

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

        return response()->json(['message' => 'user created successfully', 'user' => $user]);



    }
}
