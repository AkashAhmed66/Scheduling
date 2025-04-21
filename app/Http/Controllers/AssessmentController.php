<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\PDF;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreAssessmentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Assessment $assessment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Assessment $assessment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssessmentRequest $request, Assessment $assessment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assessment $assessment)
    {
        //
    }

    /**
     * Generate and download assessment PDF report.
     */
    public function generatePdf($id)
    {
        // Fetch the assessment from the database
        $assessment = Assessment::findOrFail($id);
        
        // Prepare data for the PDF view
        $data = [
            'info' => [
                'title' => 'Facility Assessment Report',
                'date' => $assessment->created_at->format('Y-m-d'),
                'facility' => $assessment->facility_name ?? 'Not Specified',
                'disclaimer' => 'This assessment report is for informational purposes only. The information contained herein represents the observations and findings of the assessment team at the time of inspection.'
            ],
            'score' => $assessment->overall_score ?? 0, // Overall score percentage
            'findings' => []
        ];
        
        // Check if findings exist and process them
        if ($assessment->findings && is_array($assessment->findings)) {
            $data['findings'] = $assessment->findings;
        } else {
            // Fallback to empty findings or create sample data if needed
            $data['findings'] = [
                [
                    'category' => 'No Categories',
                    'score' => 0,
                    'findings' => 'No findings available for this assessment.'
                ]
            ];
        }

        // Generate PDF
        $pdf = PDF::loadView('assessment_report', $data);
        
        // You can customize the PDF if needed
        $pdf->setPaper('a4', 'portrait');
        
        // Download the PDF
        return $pdf->download('assessment_report_' . $id . '.pdf');
    }
}
