<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = request(['email','password']);

        if(!Auth::attempt($credentials))
        {
            return response()->json([
                'message' => 'unauthorized'
            ],401);
        }

        $user = Auth::user();
        $user->load('department');
        $request->session()->regenerate();
        return response()->json(['message' => 'authenticated', 'user' => $user]);

    }

    public function loginwithGoogle(Request $request) {
        $token = $request->input('token');
        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);

        if ($payload) {
            $email = $payload['email'];
            $firstName = $payload['given_name'];
            $lastName = $payload['family_name'];
            $picture = $payload['picture'];

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'email' => $email,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'department_id' => 1, // default
                    'role' => 'user', // default
                    'login_provider' => 'google', // default
                    'profile_picture' => $picture,
                ]);
            }

            Auth::login($user);
            $request->session()->regenerate();
            $user->load('department');
            return response()->json(['message' => 'authenticated', 'user' => $user]);

        } else {
            return response()->json(['error' => 'invalid token'], 401);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'user logged out'
        ]);
    }

    public function user(Request $request) {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'unauthorized'
            ],401);
        }
        return $user;
    }
}
