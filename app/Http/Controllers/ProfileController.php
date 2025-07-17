<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\AuditJob;
use App\Models\Assessment;
use App\Models\StaffInformation;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{

    public function ProfileData()
    {
        $user = Auth::user();
        $user->image_url = asset('storage/'.$user->image_url);
        return $user;
    }
    public function GetUserData()
    {
        $user = Auth::user();
        
        // Get user's assigned jobs based on staff information
        $assignedJobIds = collect();
        $assignedAssessmentIds = collect();
        
        if ($user->role == 0) {
            // Super admin sees all
            $assignedJobs = AuditJob::all();
            $assignedAssessments = Assessment::all();
        } elseif ($user->role == 1) {
            // Team admin sees jobs from their team
            $assignedJobs = AuditJob::where('team', $user->team)->get();
            $teamJobIds = $assignedJobs->pluck('id');
            $assessmentIds = StaffInformation::whereIn('job_id', $teamJobIds)
                                            ->whereNotNull('assessment_id')
                                            ->pluck('assessment_id')
                                            ->unique();
            $assignedAssessments = Assessment::whereIn('id', $assessmentIds)->get();
        } else {
            // Auditors and reviewers
            $assignedJobIds = StaffInformation::where('user_id', $user->id)
                                             ->pluck('job_id')
                                             ->unique();
            $assignedJobs = AuditJob::whereIn('id', $assignedJobIds)->get();
            
            // Also include jobs where they are assigned as reviewer (for role 3)
            if ($user->role == 3) {
                $reviewerJobs = AuditJob::where('reviewers', $user->id)->get();
                $assignedJobs = $assignedJobs->merge($reviewerJobs)->unique('id');
            }
            
            // Get assessments where user is report writer
            $assignedAssessmentIds = StaffInformation::where('user_id', $user->id)
                                                    ->where('report_write', true)
                                                    ->whereNotNull('assessment_id')
                                                    ->pluck('assessment_id')
                                                    ->unique();
            $assignedAssessments = Assessment::whereIn('id', $assignedAssessmentIds)->get();
        }
        
        return Inertia::render('Home', [
            'user' => $user,
            'image_url' => asset('storage/'.$user->image_url),
            'assignedJobs' => $assignedJobs,
            'assignedAssessments' => $assignedAssessments,
        ]);
    }
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->all());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
    
        $request->user()->gender = $request->gender;
        $request->user()->countryCode = $request->countryCode;
        $request->user()->department = $request->department;
        $request->user()->designation = $request->designation;
        $request->user()->phone = $request->phone;
        $request->user()->companyName = $request->companyName;
        $request->user()->name = $request->name;
        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
