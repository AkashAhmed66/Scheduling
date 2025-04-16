<?php

namespace App\Http\Controllers;

use App\Models\UploadModel;
use App\Http\Requests\StoreUploadModelRequest;
use App\Http\Requests\UpdateUploadModelRequest;
use App\Imports\QuestionImport;
use App\Models\AssesmentDocuments;
use App\Models\Assessment;
use App\Models\AssessmentDraft;
use App\Models\SupportingDocuments;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class UploadModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function updateAssesment(Request $request, $id)
    {
        $assessment = AssessmentDraft::findOrFail($id);

        $assessment->update($request->only([
            'question', 'answer', 'findings', 'risk_rating', 'legal_ref', 'recommendation'
        ]));

        return response()->json(['message' => 'Assessment updated successfully!']);
    }

    public function PerformAudit($id)
    {
        $questions = AssessmentDraft::where('assesment_id', $id)->get();
        $assessment = Assessment::where('id', $id)->first();
        $user = Auth::user();
        return Inertia::render('PerformAudit', [
            'question' => $questions,
            'user' => $user,
            'assessment' => $assessment
        ]);
    }

    public function upload(Request $request)
    {
        $file = $request->file('file');
        UploadModel::truncate();
        Excel::import(new QuestionImport, $file);
        return redirect()->back()->with('message', 'File uploaded and data inserted successfully.');
    }
    public function DeleteAssesment($id)
    {
        AssesmentDocuments::where('id', $id)->delete();
        return redirect()->back();
    }
    public function DeleteAssesmentSupporting($id)
    {
        SupportingDocuments::where('id', $id)->delete();
        return redirect()->back();
    }
    public function UploadAssesment(Request $request)
    {
        $uploadedFiles = [];        
        foreach ($request->file('files') as $index => $file) {        
            // Generate a timestamp-based filename
            $timestamp = now()->format('YmdHis');  // e.g., 20250117_143500
            $extension = $file->getClientOriginalExtension();
            $newFileName = "document_{$timestamp}".$index.".{$extension}";
            
            // Define the storage path
            $destinationPath = storage_path('app/public/assesment_documents');
            
            // Ensure the directory exists, create it if not
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
        
            // Move the file to the specified directory
            $file->move($destinationPath, $newFileName);
        
            // Get the file path relative to the public directory
            $filePath = 'assesment_documents/' . $newFileName;
    
            // Prepare data for saving into the database
            $formData = [
                'documentName' => $request->documentName,
                'fileName' => $newFileName,
                'jobId' => $request->jobId,
                'teamId' => Auth::user()->team,
                'filePath' => $filePath, // Save the file path in the database
            ];    
            // Create a new record in the 'assesment_documents' table
            $uploadedFiles[] = AssesmentDocuments::create($formData);
        }    
        // Redirect back with a success message
        return redirect()->back()->with('message', 'Files uploaded and data inserted successfully.');
    }
    public function UploadSupportingDoc(Request $request)
    {

        // dd($request->toArray());
        // Retrieve file from the request
        $file = $request->file('file');
    
        // Generate a timestamp-based filename
        $timestamp = now()->format('YmdHis');  // e.g., 20250117_143500
        $extension = $file->getClientOriginalExtension();
        $newFileName = "document_{$timestamp}.{$extension}";
    
        // Define the storage path
        $destinationPath = storage_path('app/public/assesment_documents');
    
        // Ensure the directory exists, create it if not
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }
    
        // Move the file to the specified directory
        $file->move($destinationPath, $newFileName);
    
        // Get the file path relative to the public directory
        $filePath = 'assesment_documents/' . $newFileName;
    
        // Prepare data for saving into the database
        $formData = [
            'name' => $request->input('documentName'),  // Store the new file name
            'jobId' => $request->input('jobId'),
            'teamId' => Auth::user()->team,
            'path' => $filePath, // Save the file path in the database
        ];
    
        // Create a new record in the 'assesment_documents' table
        SupportingDocuments::create($formData);
    
        // Redirect back with a success message
        return redirect()->back()->with('message', 'File uploaded and data inserted successfully.');
    }
    


    public function index()
    {
        $questions = UploadModel::get();
        $user = Auth::user();
        $assessments = $user->assessmentss;
        if(Auth::user()->role == 0){
            $assessments = Assessment::get();
        }
        return Inertia::render('Assesment', [
            'question' => $questions,
            'user' => $user,
            'assesments' => $assessments
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
    public function store(StoreUploadModelRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UploadModel $uploadModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UploadModel $uploadModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUploadModelRequest $request, UploadModel $uploadModel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UploadModel $uploadModel)
    {
        //
    }
}
