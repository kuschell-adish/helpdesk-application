<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request) {

        $token = $request->input('token');

        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);

        if ($payload) {
            $email = $payload['email'];
            $name = $payload['name'];
            $picture = $payload['picture'];

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'email' => $email,
                    'name' => $name,
                    'department_id' => 1, // default
                    'role' => 'user', // default
                    'profile_picture' => $picture, 
                ]);
            }

            auth()->login($user);
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->plainTextToken;
            return response()->json(['message' => 'authenticated', 'user' => $user, 'accessToken' => $token, 'token_type' => 'Bearer']);

        } else {
            return response()->json(['error' => 'invalid token'], 401);
        }

    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'user logged out'
        ]);

    }
}
