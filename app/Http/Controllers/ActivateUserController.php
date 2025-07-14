<?php

namespace App\Http\Controllers;

use App\Models\ActivateUser;
use App\Http\Requests\StoreActivateUserRequest;
use App\Http\Requests\UpdateActivateUserRequest;
use App\Models\AuditJob;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ActivateUserController extends Controller
{
    /**
     * get jobs of the resource.
     */
    public function UploadProfilePhoto(Request $request)
    {
        $file = $request->file('image');
    
        // Generate a timestamp-based filename
        $timestamp = now()->format('YmdHis');  // e.g., 20250117_143500
        $extension = $file->getClientOriginalExtension();
        $newFileName = "document_{$timestamp}.{$extension}";
    
        // Define the storage path
        $destinationPath = storage_path('app/public/images');
    
        // Ensure the directory exists, create it if not
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }
    
        // Move the file to the specified directory
        $file->move($destinationPath, $newFileName);
    
        // Get the file path relative to the public directory
        $filePath = 'images/' . $newFileName;

        $user = User::where('id', Auth::user()->id)->first();
        $user->image_url = $filePath;
        $user->save();

        return redirect()->route('home');
    }
    public function DeleteUser(Request $request)
    {
        if($request->image_url == null){
            $user = ActivateUser::find($request->id);
            $user->delete();
            return redirect()->route('activate-user-list');
        }else{
            $user = User::find($request->id);
            $user->delete();
            return redirect()->route('activate-user-list');
        }
    }
    public function GetJobs()
    {
        $jobs = AuditJob::where('team', Auth::user()->team)->get();
        return Inertia::render('Jobs', [
            'jobs' => $jobs
        ]);
    }
    public function goToActivateUser()
    {
        if(Auth::user()->role == 0){
            return Inertia::render('ActivateUser');
        }else{
            return redirect()->back();
        }
    }
    /**
     * update list of the resource.
     */
    public function UpdateActivateUser(Request $request)
    {
        $formData = $request->toArray();
        $formData['password'] = Hash::make('nopassword');
        // If the authenticated user has role 0 (admin)
        if (Auth::user()->role == 0) {
            $activateUser = User::create($formData);
            $activateUser->role = $request->role;
            $activateUser->team = $activateUser->id;
            $activateUser->save();
        } else {
            // Insert the data into the ActivateUser table for non-admin users
            $activateUser = User::create($formData);
            $activateUser->team = Auth::user()->team;
            $activateUser->role = $request->role;
            $activateUser->save();
        }

        // Return Inertia response with a flash message
        return redirect()->route('activate-user-list');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(Auth::user()->role != 0){
            return redirect()->back();
        }
        $users = User::where('team', Auth::user()->team)->get();
        $activateusers = ActivateUser::where('team', Auth::user()->team)
             ->whereNotIn('email', User::where('team', Auth::user()->team)->pluck('email'))
             ->get();
        if(Auth::user()->role == 0){
            $users = User::all();
            $activateusers = ActivateUser::whereNotIn('email', User::pluck('email'))->get();
        }  
        return Inertia::render('ActivateUserList', [
            'users' => $users,
            'unactive' => $activateusers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActivateUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivateUser $activateUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActivateUser $activateUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActivateUserRequest $request, ActivateUser $activateUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivateUser $activateUser)
    {
        //
    }
}
