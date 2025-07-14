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

    /**
     * Reset assessment drafts by deleting all existing drafts for this assessment 
     * and recreating them from upload_model questions of the same type.
     */
    public function resetAssessment($assessmentId)
    {
        try {
            // Get the assessment to find its type
            $assessment = Assessment::findOrFail($assessmentId);
            
            // Delete all existing assessment drafts for this assessment
            AssessmentDraft::where('assesment_id', $assessmentId)->delete();
            
            // Get fresh questions from upload_model based on assessment type
            $questions = UploadModel::where('type', $assessment->type)->get();
            
            // Create new assessment drafts from the questions
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
                $draft->assesment_id = $assessmentId;
                
                $draft->save();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Assessment reset successfully! ' . count($questions) . ' questions have been restored.',
                'question_count' => count($questions)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset assessment: ' . $e->getMessage()
            ], 500);
        }
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
        if ($file) {
            $firstRow = Excel::toArray(function ($reader) {
                $reader->limit(1); // Only read the first row
            }, $file)[0][1]; // Access the first row of the first sheet
    
            // dd($firstRow['6']); // Output the array containing the values from the first row
            UploadModel::where('type', $firstRow['10'])->delete();
        }
        Excel::import(new QuestionImport, $file);
        UploadModel::where('type', null)->delete();
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
                'uploader' => Auth::user()->name,
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
