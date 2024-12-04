<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User; 

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, [
            'emailInput'   => 'required|email',
            'passwordInput' => 'required'
        ]);

        // not found
        $email = $request->input('emailInput');
        $userExists = User::where('email', $email)->exists();
        if (!$userExists) {
            return response()->json([
                'error' => 'user does not exist'
            ], 404); 
        }

        //forbidden access 
        if (Auth::guard('user')->attempt(['email' => $request->emailInput, 'password' => $request->passwordInput])) {
            $user = Auth::guard('user')->user()->load('company');

            if ($user->type_id === 2){
                return response()->json([
                    'error' => 'user is forbidden'
                ], 403); 
            }
            //succesful
            return response()->json([
                'message' => 'successful', 
                'user' => $user
            ], 200); 
        }
        else {
            return response()->json([
                'error' => 'unauthorized'
            ], 401); 
        }
    }

}
