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
    public function generatePdf($id, Request $request)
    {

        // return $request->toArray();

        $questions = $request->input('qestions', []);

        $category_data = [];
        $total_achieved_marks = 0;
        $total_possible_marks = 0;

        foreach ($questions as $question) {
            if (!is_array($question) || !isset($question['mark'], $question['answer'], $question['category'])) {
                continue;
            }

            $mark = is_numeric($question['mark']) ? (float) $question['mark'] : 0;
            $answer = isset($question['answer']) ? strtolower(trim($question['answer'])) : '';
            $category = $question['category'] ?? 'Uncategorized';

            if (!isset($category_data[$category])) {
                $category_data[$category] = ['achieved' => 0, 'possible' => 0];
            }

            $achieved_mark_for_question = ($answer === 'yes') ? $mark : 0;

            $category_data[$category]['achieved'] += $achieved_mark_for_question;
            $category_data[$category]['possible'] += $mark;

            $total_achieved_marks += $achieved_mark_for_question;
            $total_possible_marks += $mark;
        }

        $category_percentages = [];
        foreach ($category_data as $category => $scores) {
            $category_percentages[$category] = ($scores['possible'] > 0)
                ? round(($scores['achieved'] / $scores['possible']) * 100, 2)
                : 0;
        }

        // Fetch the assessment for metadata, then use the calculated scores for the PDF.
        $assessment = \App\Models\Assessment::findOrFail($id);

        $overall_percentage = ($total_possible_marks > 0)
            ? round(($total_achieved_marks / $total_possible_marks) * 100, 2)
            : 0;

        $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();


        $audit_findings = [];

        // Initialize all categories from the category_percentages first
        foreach ($category_percentages as $category => $percentage) {
            $audit_findings[$category] = [
                'findings' => [],
                'color_counts' => [
                    'green' => 0,
                    'yellow' => 0,
                    'orange' => 0,
                    'red' => 0,
                ],
                'percentage' => $percentage,
            ];
        }

        // Filter questions to get only those with 'no' as an answer
        $no_answer_questions = array_filter($questions, function ($q) {
            return isset($q['answer']) && strtolower(trim($q['answer'])) === 'no';
        });

        // Group findings by category and count colors
        foreach ($no_answer_questions as $question) {
            $category = $question['category'] ?? 'Uncategorized';
            $color = isset($question['color']) ? strtolower(trim($question['color'])) : 'unknown';

            // Initialize the category in our findings array if it's not already there (for uncategorized or missing categories)
            if (!isset($audit_findings[$category])) {
                $audit_findings[$category] = [
                    'findings' => [],
                    'color_counts' => [
                        'green' => 0,
                        'yellow' => 0,
                        'orange' => 0,
                        'red' => 0,
                    ],
                    'percentage' => $category_percentages[$category] ?? 0,
                ];
            }

            // Add the question to the list of findings for this category
            $audit_findings[$category]['findings'][] = $question;

            // Increment the count for the specific color
            if (array_key_exists($color, $audit_findings[$category]['color_counts'])) {
                $audit_findings[$category]['color_counts'][$color]++;
            }
        }
        // Prepare data for the PDF view, including the calculated percentages.
        $data = [
            'audit_findings' => $audit_findings,
            'assessmentInfo' => $assessmentInfo,
            'questions' => $questions,
            'scores' => [
                'total_achieved' => $total_achieved_marks,
                'total_possible' => $total_possible_marks,
                'overall_percentage' => $overall_percentage,
                'category_percentages' => $category_percentages,
            ],
        ];

        // Generate and download the PDF, replacing the old logic that follows.
        $pdf = PDF::loadView('assessment_report', $data);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('assessment_report_' . $id . '.pdf');
    }

    /**
     * Generate and download CAPA PDF report.
     */
    public function generateCapaPdf($id, Request $request)
    {
        $questions = $request->input('qestions', []);

        // Get assessment info
        $assessment = \App\Models\Assessment::findOrFail($id);
        $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

        // Create info object for CAPA template
        $info = (object) [
            'capaTitile' => $assessmentInfo ? $assessmentInfo->capa_heading ?? ($assessmentInfo->facility_name . ' - CAPA Report') : 'CAPA Report',
            'facilityName' => $assessmentInfo ? $assessmentInfo->facility_name : 'N/A',
            'reportNo' => $assessmentInfo ? $assessmentInfo->report_no : 'N/A',
            'facilityAddress' => $assessmentInfo ? $assessmentInfo->facility_address : 'N/A',
            'assessors' => $assessmentInfo ? $assessmentInfo->assessors : 'N/A',
            'assesmentDate' => $assessmentInfo ? $assessmentInfo->assessment_date : 'N/A',
            'scheduleType' => $assessmentInfo ? $assessmentInfo->schedule_type : 'N/A',
            'primaryContact' => $assessmentInfo ? $assessmentInfo->primary_contact_name : 'N/A',
            'position' => $assessmentInfo ? $assessmentInfo->position : 'N/A',
        ];

        // Filter questions to get only those with 'No' as an answer (non-compliances)
        $nonComplianceQuestions = array_filter($questions, function ($q) {
            return isset($q['answer']) && strtolower(trim($q['answer'])) === 'no';
        });

        // Format audit answer data for CAPA template
        $auditAnswerData = [];
        $ncCounter = 1;

        foreach ($nonComplianceQuestions as $question) {
            $auditAnswerData[] = (object) [
                'category' => $question['category'] ?? 'Uncategorized',
                'sub_category' => $question['sub_category'] ?? 'General',
                'nc_ref' => 'NC-' . str_pad($ncCounter++, 3, '0', STR_PAD_LEFT),
                'findings' => $question['findings'] ?? 'Non-compliance identified',
                'rating' => $question['risk_rating'] ?? 'N/A',
                'corrective_action_plan' => $question['legal_ref'] ?? 'N/A',
                'target_completion_date' => $question['recommendation'] ?? 'N/A',
            ];
        }

        // Determine the audit type based on assessment type
        $type = strtolower($assessment->type ?? 'general');

        $data = [
            'info' => $info,
            'auditAnswerData' => $auditAnswerData,
            'type' => $type,
        ];

        // Generate and download the CAPA PDF
        $pdf = PDF::loadView('cocCapa', $data);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('capa_report_' . $id . '.pdf');
    }
}
