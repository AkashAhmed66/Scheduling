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
use App\Models\RiskRating;
use App\Models\OverallRating;
use App\Models\StaffInformation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            'question', 'instruction', 'answer', 'findings', 'risk_rating', 'legal_ref', 'recommendation'
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
                $draft->instruction = $question->instruction;
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
        
        // Get original questions from upload_model to provide default risk ratings
        $originalQuestions = [];
        if ($assessment && $assessment->type) {
            $originalQuestions = UploadModel::where('type', $assessment->type)->get()->keyBy('question');
        }
        
        // Add original risk rating to each question
        $questions = $questions->map(function ($question) use ($originalQuestions) {
            $originalQuestion = $originalQuestions->get($question->question);
            if ($originalQuestion) {
                $question->original_risk_rating = $originalQuestion->risk_rating;
            }
            return $question;
        });
        
        // Get risk ratings and overall ratings for this assessment type
        $riskRatings = [];
        $overallRatings = [];
        if ($assessment && $assessment->type) {
            $riskRatings = RiskRating::where('type', $assessment->type)->get();
            $overallRatings = OverallRating::where('type', $assessment->type)->get();
        }
        
        return Inertia::render('PerformAudit', [
            'question' => $questions,
            'user' => $user,
            'assessment' => $assessment,
            'riskRatings' => $riskRatings,
            'overallRatings' => $overallRatings
        ]);
    }

    public function upload(Request $request)
    {
        $file = $request->file('file');
        $riskRatingData = json_decode($request->input('riskRatingData'), true) ?? [];
        $overallRatingData = json_decode($request->input('overallRatingData'), true) ?? [];
        
        if ($file) {
            $firstRow = Excel::toArray(function ($reader) {
                $reader->limit(1); // Only read the first row
            }, $file)[0][1]; // Access the first row of the first sheet
    
            $assessmentType = $firstRow['10']; // Get the type from excel
            
            // Delete existing upload models of this type
            UploadModel::where('type', $assessmentType)->delete();
            
            // Delete existing risk and overall ratings of this type
            RiskRating::where('type', $assessmentType)->delete();
            OverallRating::where('type', $assessmentType)->delete();
            
            // Import the excel data
            Excel::import(new QuestionImport, $file);
            
            // Delete any records with null type
            UploadModel::where('type', null)->delete();
            
            // Save risk rating data
            foreach ($riskRatingData as $riskRating) {
                if (!empty($riskRating['label']) || !empty($riskRating['mark']) || !empty($riskRating['color'])) {
                    RiskRating::create([
                        'label' => $riskRating['label'] ?? '',
                        'mark' => $riskRating['mark'] ?? '',
                        'color' => $riskRating['color'] ?? '',
                        'type' => $assessmentType,
                    ]);
                }
            }
            
            // Save overall rating data
            foreach ($overallRatingData as $overallRating) {
                if (!empty($overallRating['percentage']) || !empty($overallRating['label']) || !empty($overallRating['color'])) {
                    OverallRating::create([
                        'percentage' => $overallRating['percentage'] ?? '',
                        'label' => $overallRating['label'] ?? '',
                        'color' => $overallRating['color'] ?? '',
                        'type' => $assessmentType,
                    ]);
                }
            }
        }
        
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
        
        // Filter assessments based on user role and staff assignments
        if(Auth::user()->role == 0) {
            // Admin sees all assessments
            $assessments = Assessment::get();
        } else {
            // Regular users see only assessments they are assigned to via staff_information table
            $assessmentIds = StaffInformation::where('user_id', $user->id)
                                           ->whereNotNull('assessment_id')
                                           ->pluck('assessment_id')
                                           ->unique();
            
            $assessments = Assessment::whereIn('id', $assessmentIds)->get();
        }
        
        // Get all risk ratings and overall ratings
        $riskRatings = RiskRating::all();
        $overallRatings = OverallRating::all();
        
        return Inertia::render('Assesment', [
            'question' => $questions,
            'user' => $user,
            'assesments' => $assessments,
            'riskRatings' => $riskRatings,
            'overallRatings' => $overallRatings
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
     * Get risk rating and overall rating data by assessment type
     */
    public function getRatingsByType($type)
    {
        $riskRatings = RiskRating::where('type', $type)->get();
        $overallRatings = OverallRating::where('type', $type)->get();
        
        return response()->json([
            'riskRatings' => $riskRatings,
            'overallRatings' => $overallRatings
        ]);
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

    /**
     * Display a listing of upload models grouped by assessment type for the new upload workflow.
     */
    public function uploadModelsList()
    {
        try {
            // Get all unique assessment types with their upload models
            $uploadModelsByType = [];
            
            $types = UploadModel::select('type')->distinct()->whereNotNull('type')->get();
            
            foreach ($types as $typeObj) {
                $type = $typeObj->type;
                $uploadModels = UploadModel::where('type', $type)
                    ->orderBy('created_at', 'desc')
                    ->get();
                
                $uploadModelsByType[$type] = $uploadModels;
            }

            return Inertia::render('UploadModelsList', [
                'uploadModelsByType' => $uploadModelsByType,
                'totalTypes' => count($uploadModelsByType)
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error fetching upload models: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new upload model.
     */
    public function uploadModelsCreate()
    {
        return Inertia::render('UploadModelCreate');
    }

    /**
     * Display the specified upload model with its ratings.
     */
    public function uploadModelsShow($id)
    {
        try {
            $uploadModel = UploadModel::findOrFail($id);

            // Get risk ratings and overall ratings for this type
            $riskRatings = RiskRating::where('type', $uploadModel->type)->get();
            $overallRatings = OverallRating::where('type', $uploadModel->type)->get();
            
            // Get all upload model questions for this type
            $uploadModelQuestions = UploadModel::where('type', $uploadModel->type)
                ->orderBy('id', 'asc')
                ->get();

            return Inertia::render('UploadModelView', [
                'uploadModel' => $uploadModel,
                'riskRatings' => $riskRatings,
                'overallRatings' => $overallRatings,
                'uploadModelQuestions' => $uploadModelQuestions
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error fetching upload model: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created upload model from the new workflow.
     */
    public function uploadModelsStore(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240', // 10MB max
            'riskRatingData' => 'required|json',
            'overallRatingData' => 'required|json'
        ]);

        try {
            DB::beginTransaction();
            
            $file = $request->file('file');
            $riskRatingData = json_decode($request->input('riskRatingData'), true) ?? [];
            $overallRatingData = json_decode($request->input('overallRatingData'), true) ?? [];

            Log::info('Risk rating data received: ', $riskRatingData);
            Log::info('Overall rating data received: ', $overallRatingData);

            // Validate rating data
            if (empty($riskRatingData) || empty($overallRatingData)) {
                throw new \Exception('Risk rating and overall rating data are required.');
            }

            // Get assessment type from Excel file
            $firstRow = Excel::toArray(function ($reader) {
                $reader->limit(1); // Only read the first row
            }, $file)[0][1]; // Access the first row of the first sheet

            
            $assessmentType = $firstRow['11']; // Get the type from excel
            Log::info('Assessment type from Excel: ' . $assessmentType);

            // Check if this assessment type already exists
            $existingUploadModels = UploadModel::where('type', $assessmentType)->count();
            if ($existingUploadModels > 0) {
                return back()->with('error', "Assessment tool of type '{$assessmentType}' already exists. Please delete the existing tool first or choose a different assessment type.");
            }
            
            // Import the excel data first
            Excel::import(new QuestionImport, $file);
            Log::info('Excel import completed');
            
            // Delete any records with null type
            UploadModel::where('type', null)->delete();
            
            // Save risk rating data
            $riskRatingSaved = 0;
            foreach ($riskRatingData as $riskRating) {
                // Save if at least one field is not empty
                if (!empty(trim($riskRating['label'] ?? '')) || 
                    !empty(trim($riskRating['mark'] ?? '')) || 
                    !empty(trim($riskRating['color'] ?? ''))) {
                    
                    $created = RiskRating::create([
                        'label' => trim($riskRating['label'] ?? ''),
                        'mark' => trim($riskRating['mark'] ?? ''),
                        'color' => trim($riskRating['color'] ?? ''),
                        'type' => $assessmentType,
                    ]);
                    $riskRatingSaved++;
                    Log::info('Risk rating saved: ', $created->toArray());
                }
            }
            Log::info("Total risk ratings saved: {$riskRatingSaved}");
            
            // Save overall rating data
            $overallRatingSaved = 0;
            foreach ($overallRatingData as $overallRating) {
                // Save if at least one field is not empty
                if (!empty(trim($overallRating['percentage'] ?? '')) || 
                    !empty(trim($overallRating['label'] ?? '')) || 
                    !empty(trim($overallRating['color'] ?? ''))) {
                    
                    $created = OverallRating::create([
                        'percentage' => trim($overallRating['percentage'] ?? ''),
                        'label' => trim($overallRating['label'] ?? ''),
                        'color' => trim($overallRating['color'] ?? ''),
                        'type' => $assessmentType,
                    ]);
                    $overallRatingSaved++;
                    Log::info('Overall rating saved: ', $created->toArray());
                }
            }
            Log::info("Total overall ratings saved: {$overallRatingSaved}");

            // Check if we actually saved some ratings
            if ($riskRatingSaved === 0 || $overallRatingSaved === 0) {
                throw new \Exception("Failed to save rating data. Risk ratings saved: {$riskRatingSaved}, Overall ratings saved: {$overallRatingSaved}");
            }

            DB::commit();
            
            return redirect()->route('upload-models.list')->with('success', "Assessment tool '{$assessmentType}' uploaded successfully! Saved {$riskRatingSaved} risk ratings and {$overallRatingSaved} overall ratings.");

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error uploading file: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return back()->with('error', 'Error uploading file: ' . $e->getMessage());
        }
    }

    /**
     * Delete an upload model and its related data.
     */
    public function uploadModelsDestroy($id)
    {
        try {
            DB::beginTransaction();
            
            $uploadModel = UploadModel::findOrFail($id);
            $type = $uploadModel->type;

            // Get all assessments that use this type
            $assessmentIds = Assessment::where('type', $type)->pluck('id');

            // Delete assessment drafts for these assessments
            if ($assessmentIds->isNotEmpty()) {
                AssessmentDraft::whereIn('assesment_id', $assessmentIds)->delete();
            }

            // Delete all upload models of this type (since they work as a group)
            UploadModel::where('type', $type)->delete();
            
            // Delete related risk and overall ratings
            RiskRating::where('type', $type)->delete();
            OverallRating::where('type', $type)->delete();

            // Optionally, you might also want to delete the assessments themselves
            // Assessment::where('type', $type)->delete();

            DB::commit();
            
            return redirect()->route('upload-models.list')->with('success', "Assessment tool '{$type}' and all related data deleted successfully!");

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error deleting upload model: ' . $e->getMessage());
            return back()->with('error', 'Error deleting upload model: ' . $e->getMessage());
        }
    }
}
