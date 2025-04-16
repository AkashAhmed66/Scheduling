<?php

namespace App\Http\Controllers;

use App\Models\AuditJob;
use App\Http\Requests\StoreAuditJobRequest;
use App\Http\Requests\UpdateAuditJobRequest;
use App\Models\AssesmentDocuments;
use App\Models\Assessment;
use App\Models\AssessmentDraft;
use App\Models\SupportingDocuments;
use App\Models\UploadModel;
use App\Models\User;
use Illuminate\Http\Request;
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
        AuditJob::where('id', $id)->delete();
        return redirect()->back();
    }
    
    public function EditJob($id)
    {
        $auditors = User::where('role', '2')->get();
        $reviewers = User::where('role', '3')->get();
        $job = AuditJob::where('id', $id)->first();
        return Inertia::render('CreateJob', [
            'create' => 0,
            'auditors' => $auditors,
            'reviewers' => $reviewers,
            'job' => $job
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

        return Inertia::render('CreateJob', [
            'create' => 1,
            'auditors' => $auditors,
            'reviewers' => $reviewers,
            'job' => null
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function GetJobsForCalender()
    {
        $jobs = AuditJob::where('team',  Auth::user()->team)->get();
        if(Auth::user()->role == 0){
            $jobs = AuditJob::get();
        }
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
        $jobs = AuditJob::where('team',  Auth::user()->team)->get();
        $user = Auth::user();
        if($user->role == 2){
            $jobs = $user->auditJobForAuditors;
        }
        if($user->role == 3){
            $jobs = $user->auditJobForReviwers;
        }
        // dd($jobs->toArray());
        if(Auth::user()->role == 0){
            $jobs = AuditJob::get();
        }
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
        $auditJob = AuditJob::create($formData);

        $auditor = User::where('id', $formData['auditor'])->first();
        $reviewer = User::where('id', $formData['reviewer'])->first();
        
        $assesment = new Assessment();
        $assesment->type = 'social';
        $assesment->searchId = 'NBM' . now()->format('YmdHis');
        $assesment->userss()->associate($auditor);
        $assesment->save();

        $questions = UploadModel::where('type', $assesment->type)->get();
        foreach ($questions as $question) {
            AssessmentDraft::create([
                'question' => $question->question,
                'answer' => $question->answer,
                'findings' => $question->findings,
                'risk_rating' => $question->risk_rating,
                'legal_ref' => $question->legal_ref,
                'recommendation' => $question->recommendation,
                'created_at' => $question->created_at,
                'updated_at' => $question->updated_at,
                'assesment_id' => $assesment->id,
            ]);
        }
        $auditJob->auditors()->associate($auditor);
        $auditJob->reviewer()->associate($reviewer);
        $auditJob->assesmentts()->associate($assesment);


        $auditJob->save();

        return redirect()->route('jobs');
    }

    public function AuditEdit(Request $request)
    {
        $formData = $request->toArray();
        $formData['team'] = Auth::user()->team;
        $auditJob = AuditJob::findOrFail($formData['id']);
        $auditJob->update($formData);
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
        //
    }
}
