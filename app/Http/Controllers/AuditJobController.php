<?php

namespace App\Http\Controllers;

use App\Models\AuditJob;
use App\Http\Requests\StoreAuditJobRequest;
use App\Http\Requests\UpdateAuditJobRequest;
use App\Models\AssesmentDocuments;
use App\Models\Assessment;
use App\Models\AssessmentDraft;
use App\Models\StaffInformation;
use App\Models\SupportingDocuments;
use App\Models\UploadModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use function Termwind\render;

class AuditJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function PassJob(Request $request)
    {
        $job = AuditJob::where('id', $request->id)->first();
        if($job->jobStatus == 'completed'){
            return redirect()->back();
        }
        if($request->status == 0){
            $job = AuditJob::where('id', $request->id)->first();
            $job->update(['jobStatus' => 're-audit']);
            $job->save();
        }else if($request->status == 1){
            $job = AuditJob::where('id', $request->id)->first();
            if(Auth::user()->role == 2) $job->update(['jobStatus' => 'review']);
            if(Auth::user()->role == 3) $job->update(['jobStatus' => 'done']);
            $job->save();
        }else{
            $job = AuditJob::where('id', $request->id)->first();
            $job->update(['jobStatus' => 'completed']);
            $job->save();
        }
    }
    public function SubmitAuditFiles(Request $request)
    {
        $formData =$request->toArray();
        $jobId = $formData[0];
        $fileStructure = $formData[1];

        $this->flattenFileStructure($fileStructure, null, $jobId);

        return redirect()->back();
    }
    private function flattenFileStructure($fileStructure, $parentid = null, $jobId)
    {

        // Iterate through each item in the file structure
        foreach ($fileStructure as $key => $value) {
            if ($value instanceof \Illuminate\Http\UploadedFile) {

                $timestamp = now()->format('YmdHis');  // e.g., 20250117_143500
                $extension = $value->getClientOriginalExtension();
                $newFileName = "document_{$timestamp}.{$extension}";
            
                // Define the storage path
                $destinationPath = storage_path('app/public/assesment_documents');
            
                // Ensure the directory exists, create it if not
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
            
                // Move the file to the specified directory
                $value->move($destinationPath, $newFileName);
            
                // Get the file path relative to the public directory
                $filePath = 'assesment_documents/' . $newFileName;
            
                // Prepare data for saving into the database
                $formData = [
                    'name' => $value->getClientOriginalName(),
                    'path' => $filePath,
                    "folder" => $parentid,
                    'jobId' => $jobId,
                    'teamId' => Auth::user()->team,
                ];
                // Create a new record in the 'assesment_documents' table
                SupportingDocuments::create($formData);
            } else{
                $formData = [
                    'name' => $key,
                    'path' => null,
                    "folder" => $parentid,
                    'jobId' => $jobId,
                    'teamId' => Auth::user()->team,
                ];
                // Create a new record in the 'assesment_documents' table
                $doc = SupportingDocuments::create($formData);
                $this->flattenFileStructure($value, $doc->id, $jobId);
            }
        }
    }

    public function DeleteJob($id)
    {
        $job = AuditJob::find($id);
        if ($job) {
            // Get the assessment before modifying the job
            $assessment = $job->assesmentts;
            $assessmentId = $assessment ? $assessment->id : null;
            
            // Use database transaction for safe deletion
            DB::transaction(function () use ($job, $assessment, $assessmentId, $id) {
                // Delete related staff information
                StaffInformation::where('job_id', $id)->delete();
                
                // Delete supporting documents
                SupportingDocuments::where('jobId', $id)->delete();
                
                // Delete assessment documents
                AssesmentDocuments::where('jobId', $id)->delete();
                
                // Remove the foreign key reference from job before deleting assessment
                if ($assessment && $assessmentId) {
                    // Update the job to remove the assessment reference
                    DB::table('audit_jobs')->where('id', $id)->update(['assesment' => null]);
                    
                    // Delete assessment info (contains facility and employee information)
                    \App\Models\AssessmentInfo::where('assessment_id', $assessmentId)->delete();
                    
                    // Delete assessment drafts
                    AssessmentDraft::where('assesment_id', $assessmentId)->delete();
                    
                    // Delete the assessment
                    $assessment->delete();
                }
                
                // Delete the job last
                $job->delete();
            });
        }
        
        return redirect()->back();
    }
    
    public function EditJob($id)
    {
        $auditors = User::where('role', '2')->get();
        $reviewers = User::where('role', '3')->get();
        $job = AuditJob::where('id', $id)->first();
        $staffInformation = StaffInformation::where('job_id', $id)->get();
        $assessmentTypes = UploadModel::distinct('type')->pluck('type');
        
        // Add staff information to job object for easy access in frontend
        $job->staffList = $staffInformation->map(function ($staff) use ($auditors) {
            $user = $auditors->firstWhere('id', $staff->user_id);
            return [
                'id' => $staff->id,
                'user' => $staff->user_id,
                'userName' => $user ? $user->name : 'Unknown User',
                'staffDay' => $staff->stuff_day,
                'startDate' => $staff->start_date->format('Y-m-d'),
                'endDate' => $staff->end_date->format('Y-m-d'),
                'note' => $staff->note,
                'assessment_id' => $staff->assessment_id,
                'reportWriter' => $staff->report_write
            ];
        });
        
        return Inertia::render('CreateJob', [
            'create' => 0,
            'auditors' => $auditors,
            'reviewers' => $reviewers,
            'job' => $job,
            'assessmentTypes' => $assessmentTypes,
        ]);
    }
    public function AddFilesToJob($id)
    {
        $fileStructure = SupportingDocuments::where('jobId', $id)->get();
        $job = AuditJob::where('id', $id)->first();

        return Inertia::render('FileStructure', [
            'supportingDocuments' => $fileStructure,
            'job' => $job,
            'dontDelete' => 1
        ]);
    }
    public function CreateJob()
    {
        $auditors = User::where('role', '2')->get();
        $reviewers = User::where('role', '3')->get();
        $assessmentTypes = UploadModel::distinct('type')->pluck('type');
        return Inertia::render('CreateJob', [
            'create' => 1,
            'auditors' => $auditors,
            'reviewers' => $reviewers,
            'job' => null,
            'assessmentTypes' => $assessmentTypes,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function GetJobsForCalender()
    {
        $user = Auth::user();
        $jobs = collect();
        
        if ($user->role == 0) {
            // Super admin sees all jobs
            $jobs = AuditJob::with(['staffInformation.user'])->get();
        } elseif ($user->role == 1) {
            // Team admin sees jobs from their team
            $jobs = AuditJob::with(['staffInformation.user'])->where('team', $user->team)->get();
        } elseif ($user->role == 2 || $user->role == 3) {
            // Auditors and reviewers see jobs where they are assigned as staff
            $assignedJobIds = StaffInformation::where('user_id', $user->id)
                                             ->pluck('job_id')
                                             ->unique();
            $jobs = AuditJob::with(['staffInformation.user'])->whereIn('id', $assignedJobIds)->get();
            
            // Also include jobs where they are assigned as reviewer (for role 3)
            if ($user->role == 3) {
                $reviewerJobs = AuditJob::with(['staffInformation.user'])->where('reviewers', $user->id)->get();
                $jobs = $jobs->merge($reviewerJobs)->unique('id');
            }
        }
        
        // Add field staff names to each job and ensure proper date format
        $jobs = $jobs->map(function ($job) {
            $fieldStaffNames = $job->staffInformation->pluck('user.name')->filter()->toArray();
            $job->fieldStaffNames = $fieldStaffNames;
            $job->totalStaffDays = $job->staffInformation->sum('stuff_day');
            
            // Ensure auditEndDate is in proper format (Y-m-d)
            if ($job->auditEndDate) {
                $job->auditEndDate = date('Y-m-d', strtotime($job->auditEndDate));
            }
            
            // Get auditor and reviewer names
            if ($job->auditors) {
                $auditorUser = User::find($job->auditors);
                $job->auditorName = $auditorUser ? $auditorUser->name : 'Unknown';
            } else {
                $job->auditorName = 'Not Assigned';
            }
            
            if ($job->reviewers) {
                $reviewerUser = User::find($job->reviewers);
                $job->reviewerName = $reviewerUser ? $reviewerUser->name : 'Unknown';
            } else {
                $job->reviewerName = 'Not Assigned';
            }
            
            return $job;
        });
        
        return Inertia::render('Calender', [
            'jobs' => $jobs,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function ViewJob($id)
    {
        $job = AuditJob::where('id',  $id)->first();
        $assesmentDocuments = AssesmentDocuments::where('jobId', $id)->get();
        $supportingDocuments = SupportingDocuments::where('jobId', $id)->get();
        
        // Get factory history: similar factory jobs with completed status
        $factoryHistory = [];
        if ($job && $job->factoryName) {
            $factoryHistory = AuditJob::where('factoryName', $job->factoryName)
                ->where('jobStatus', 'completed')
                ->get();
        }

        return Inertia::render('ViewJob', [
            'job' => $job,
            'assesmentDocuments' => $assesmentDocuments,
            'factoryHistory' => $factoryHistory, // Renamed from 'history' to 'factoryHistory'
            'supportingDocuments' => $supportingDocuments,
            'dontDelete' => null
        ]);
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $jobs = collect();
        
        if ($user->role == 0) {
            // Super admin sees all jobs
            $jobs = AuditJob::with(['staffInformation.user'])->get();
        } elseif ($user->role == 1) {
            // Team admin sees jobs from their team
            $jobs = AuditJob::with(['staffInformation.user'])->where('team', $user->team)->get();
        } elseif ($user->role == 2 || $user->role == 3) {
            // Auditors and reviewers see jobs where they are assigned as staff
            $assignedJobIds = StaffInformation::where('user_id', $user->id)
                                             ->pluck('job_id')
                                             ->unique();
            $jobs = AuditJob::with(['staffInformation.user'])->whereIn('id', $assignedJobIds)->get();
            
            // Also include jobs where they are assigned as reviewer (for role 3)
            if ($user->role == 3) {
                $reviewerJobs = AuditJob::with(['staffInformation.user'])->where('reviewers', $user->id)->get();
                $jobs = $jobs->merge($reviewerJobs)->unique('id');
            }
        }
        
        // Add field staff names to each job
        $jobs = $jobs->map(function ($job) {
            $fieldStaffNames = $job->staffInformation->pluck('user.name')->filter()->toArray();
            $job->fieldStaffNames = $fieldStaffNames;
            $job->totalStaffDays = $job->staffInformation->sum('stuff_day');
            return $job;
        });
        
        return Inertia::render('Jobs', [
            'user' => $user,
            'jobs' => $jobs,
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
    public function store(Request $request)
    {
        $formData = $request->toArray();
        $formData['team'] = Auth::user()->team;

        // Remove individual staff fields and staffList from audit job data
        $staffFields = ['user', 'staffDay', 'startDate', 'endDate', 'reportWriter', 'note', 'staffList'];
        foreach ($staffFields as $field) {
            unset($formData[$field]);
        }

        $auditJob = AuditJob::create($formData);
        
        // Update the additional fields
        $auditJob->fieldStaff = $request->fieldStaff;
        $auditJob->serviceName = $request->serviceName;
        $auditJob->requestReceiveDate = $request->requestReceiveDate;
        $auditJob->serviceType = $request->serviceType;
        $auditJob->serviceScope = $request->serviceScope;
        $auditJob->scheduleType = $request->scheduleType;
        $auditJob->clientShadowing = $request->clientShadowing;
        $auditJob->save();

        $reviewer = User::where('id', $formData['reviewer'])->first();
        
        $assesment = new Assessment();
        $assesment->type = $auditJob->assessmentType;
        $assesment->searchId = 'NBM' . now()->format('YmdHis');
        $assesment->save();

        $questions = UploadModel::where('type', $assesment->type)->get();
        foreach ($questions as $question) {
            $draft = new AssessmentDraft();

            $draft->ncref = $question->ncref;
            $draft->category = $question->category;
            $draft->subcategory = $question->subcategory;
            $draft->mark = $question->mark;
            $draft->color = $question->color;
            $draft->question = $question->question;
            $draft->answer = $question->answer;
            $draft->findings = $question->findings;
            $draft->risk_rating = $question->risk_rating;
            $draft->legal_ref = $question->legal_ref;
            $draft->recommendation = $question->recommendation;
            $draft->created_at = $question->created_at;
            $draft->updated_at = $question->updated_at;
            $draft->assesment_id = $assesment->id;

            $draft->save();
        }
        $auditJob->reviewer()->associate($reviewer);
        $auditJob->assesmentts()->associate($assesment);

        $auditJob->save();

        // Handle staff information
        if ($request->has('staffList') && is_array($request->staffList)) {
            foreach ($request->staffList as $staff) {
                StaffInformation::create([
                    'user_id' => $staff['user'],
                    'stuff_day' => $staff['staffDay'],
                    'start_date' => $staff['startDate'],
                    'end_date' => $staff['endDate'],
                    'note' => $staff['note'] ?? null,
                    'job_id' => $auditJob->id,
                    'assessment_id' => $staff['reportWriter'] ? $assesment->id : null,
                    'report_write' => $staff['reportWriter'] ?? false
                ]);
            }
        }

        return redirect()->route('jobs');
    }

    public function AuditEdit(Request $request)
    {
        $formData = $request->toArray();
        $formData['team'] = Auth::user()->team;
        
        // Remove individual staff fields and staffList from audit job data
        $staffFields = ['user', 'staffDay', 'startDate', 'endDate', 'reportWriter', 'note', 'staffList'];
        foreach ($staffFields as $field) {
            unset($formData[$field]);
        }
        
        $auditJob = AuditJob::findOrFail($formData['id']);
        $auditJob->update($formData);
        
        // Update the additional fields
        $auditJob->fieldStaff = $request->fieldStaff;
        $auditJob->serviceName = $request->serviceName;
        $auditJob->requestReceiveDate = $request->requestReceiveDate;
        $auditJob->serviceType = $request->serviceType;
        $auditJob->serviceScope = $request->serviceScope;
        $auditJob->scheduleType = $request->scheduleType;
        $auditJob->clientShadowing = $request->clientShadowing;
        $auditJob->save();
        
        // Get the existing assessment for this job
        $assessment = $auditJob->assesmentts;
        
        // Handle staff information for edit
        if ($request->has('staffList') && is_array($request->staffList)) {
            // First, delete existing staff information for this job
            StaffInformation::where('job_id', $auditJob->id)->delete();
            
            // Then create new staff information records
            foreach ($request->staffList as $staff) {
                StaffInformation::create([
                    'user_id' => $staff['user'],
                    'stuff_day' => $staff['staffDay'],
                    'start_date' => $staff['startDate'],
                    'end_date' => $staff['endDate'],
                    'note' => $staff['note'] ?? null,
                    'job_id' => $auditJob->id,
                    'assessment_id' => $staff['reportWriter'] && $assessment ? $assessment->id : null,
                    'report_write' => $staff['reportWriter'] ?? false
                ]);
            }
        }
        
        // redirect to jobs route
        return redirect()->route('jobs');
    }

    /**
     * Display the specified resource.
     */
    public function show(AuditJob $auditJob)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AuditJob $auditJob)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAuditJobRequest $request, AuditJob $auditJob)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditJob $auditJob)
    {
        // Get the assessment before modifying the job
        $assessment = $auditJob->assesmentts;
        $assessmentId = $assessment ? $assessment->id : null;
        
        // Use database transaction for safe deletion
        DB::transaction(function () use ($auditJob, $assessment, $assessmentId) {
            // Delete related staff information
            StaffInformation::where('job_id', $auditJob->id)->delete();
            
            // Delete supporting documents
            SupportingDocuments::where('jobId', $auditJob->id)->delete();
            
            // Delete assessment documents
            AssesmentDocuments::where('jobId', $auditJob->id)->delete();
            
            // Remove the foreign key reference from job before deleting assessment
            if ($assessment && $assessmentId) {
                // Update the job to remove the assessment reference
                DB::table('audit_jobs')->where('id', $auditJob->id)->update(['assesment' => null]);
                
                // Delete assessment info (contains facility and employee information)
                \App\Models\AssessmentInfo::where('assessment_id', $assessmentId)->delete();
                
                // Delete assessment drafts
                AssessmentDraft::where('assesment_id', $assessmentId)->delete();
                
                // Delete the assessment
                $assessment->delete();
            }
            
            // Delete the job last
            $auditJob->delete();
        });
        
        return response()->json(['message' => 'Audit job and related assessment deleted successfully']);
    }
}
