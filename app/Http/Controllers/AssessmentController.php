<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AuditJob;
use App\Models\StaffInformation;
use App\Models\RiskRating;
use App\Models\OverallRating;
use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Shared\Converter;
use Illuminate\Support\Facades\Log;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $assessments = collect();
        
        if ($user->role == 0) {
            // Super admin sees all assessments
            $assessments = Assessment::all();
        } elseif ($user->role == 1) {
            // Team admin sees assessments from jobs in their team
            $teamJobIds = AuditJob::where('team', $user->team)->pluck('id');
            $assessmentIds = StaffInformation::whereIn('job_id', $teamJobIds)
                                            ->whereNotNull('assessment_id')
                                            ->pluck('assessment_id')
                                            ->unique();
            $assessments = Assessment::whereIn('id', $assessmentIds)->get();
        } elseif ($user->role == 2 || $user->role == 3) {
            // Auditors and reviewers see only assessments where they are assigned as report writers
            $assessmentIds = StaffInformation::where('user_id', $user->id)
                                            ->where('report_write', true)
                                            ->whereNotNull('assessment_id')
                                            ->pluck('assessment_id')
                                            ->unique();
            $assessments = Assessment::whereIn('id', $assessmentIds)->get();
        }
        
        return response()->json($assessments);
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

        $questions = $request->input('questions', []);
        
        // Debug logging
        Log::info('PDF Generation - Questions received: ' . count($questions));
        if (count($questions) > 0) {
            Log::info('First question sample: ' . json_encode($questions[0]));
        }

        // Fetch the assessment to get its type
        $assessment = \App\Models\Assessment::findOrFail($id);
        
        // Get risk ratings and overall ratings for this assessment type
        $riskRatings = RiskRating::where('type', $assessment->type)->get();

        $overallRatings = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'desc')->get();

        $overallRatingsDescending = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'desc')->get();

        // return $overallRatingsDescending;

        $category_data = [];
        $total_achieved_marks = 0;
        $total_possible_marks = 0;

        foreach ($questions as $question) {
            if (!is_array($question) || !isset($question['answer'], $question['category'])) {
                continue;
            }

            $answer = strtolower(trim($question['answer']));
            $category = $question['category'] ?? 'Uncategorized';

            // Skip questions marked as "Not Applicable"
            if ($answer === 'not applicable') {
                continue;
            }

            if (!isset($category_data[$category])) {
                $category_data[$category] = ['achieved' => 0, 'possible' => 0];
            }

            // Get the mark from risk_rating table based on the selected risk_rating value
            $riskRating = $riskRatings->where('label', $question['risk_rating'] ?? '')->first();
            
            $questionMark = $riskRating ? floatval($riskRating->mark) : 0;

            if ($answer === 'compliance') {
                // For 'Compliance' answers, add the full mark
                $category_data[$category]['achieved'] += $questionMark;
                $total_achieved_marks += $questionMark;
            }
            // For 'Non-Compliance' answers, achieved mark is 0 (no need to add anything)
            
            // For possible marks, use the mark of the selected risk rating for this specific question
            $category_data[$category]['possible'] += $questionMark;
            $total_possible_marks += $questionMark;
        }

        $category_percentages = [];
        foreach ($category_data as $category => $scores) {
            $category_percentages[$category] = ($scores['possible'] > 0)
                ? round(($scores['achieved'] / $scores['possible']) * 100, 2)
                : 0;
        }

        $overall_percentage = ($total_possible_marks > 0)
            ? round(($total_achieved_marks / $total_possible_marks) * 100, 2)
            : 0;

        $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

        $audit_findings = [];

        // Get unique colors from risk_rating table for dynamic color counts
        $riskRatingColors = $riskRatings->pluck('color')->unique()->toArray();
        $colorCountsTemplate = [];
        foreach ($riskRatingColors as $color) {
            $colorCountsTemplate[strtolower($color)] = 0;
        }

        // Initialize all categories from the category_percentages first
        foreach ($category_percentages as $category => $percentage) {
            $audit_findings[$category] = [
                'findings' => [],
                'color_counts' => $colorCountsTemplate,
                'percentage' => $percentage,
            ];
        }

        // Filter questions to get only those with 'non-compliance' as an answer
        $no_answer_questions = array_filter($questions, function ($q) {
            return isset($q['answer']) && strtolower(trim($q['answer'])) === 'non-compliance';
        });

        // Group findings by category and count colors
        foreach ($no_answer_questions as $question) {
            $category = $question['category'] ?? 'Uncategorized';
            
            // Get risk rating details from database
            $riskRating = $riskRatings->where('label', $question['risk_rating'] ?? '')->first();
            $color = $riskRating ? strtolower(trim($riskRating->color)) : 'red'; // Default to red if not found

            // Initialize the category in our findings array if it's not already there (for uncategorized or missing categories)
            if (!isset($audit_findings[$category])) {
                $audit_findings[$category] = [
                    'findings' => [],
                    'color_counts' => $colorCountsTemplate,
                    'percentage' => $category_percentages[$category] ?? 0,
                ];
            }

            // Add the question to the list of findings for this category with color information
            $findingData = $question;
            $findingData['color'] = $color; // Add the color based on risk rating
            $findingData['risk_rating_color'] = $riskRating ? $riskRating->color : 'red'; // Store original color for reference
            
            $audit_findings[$category]['findings'][] = $findingData;

            // Increment the count for the specific color
            if (array_key_exists($color, $audit_findings[$category]['color_counts'])) {
                $audit_findings[$category]['color_counts'][$color]++;
            }
        }

        // Determine overall rating based on percentage and overall_rating table
        $overallRatingLabel = 'Not Determined';
        $overallRatingColor = 'red';
        
        foreach ($overallRatings as $rating) {
            if ($overall_percentage <= floatval($rating->percentage)) {
                $overallRatingLabel = $rating->label;
                $overallRatingColor = $rating->color;
            } else {
                break; // Stop at first condition that fails since they're ordered by percentage
            }
        }

        // Prepare data for the PDF view, including the calculated percentages.
        $data = [
            'audit_findings' => $audit_findings,
            'assessmentInfo' => $assessmentInfo,
            'questions' => $questions,
            'overall_ratings' => $overallRatings,
            'overall_ratings_descending' => $overallRatingsDescending,
            'risk_ratings' => $riskRatings,
            'scores' => [
                'total_achieved' => $total_achieved_marks,
                'total_possible' => $total_possible_marks,
                'overall_percentage' => $overall_percentage,
                'category_percentages' => $category_percentages,
                'overall_rating_label' => $overallRatingLabel,
                'overall_rating_color' => $overallRatingColor,
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
        try {
            $questions = $request->input('questions', []);

            // Get assessment info
            $assessment = \App\Models\Assessment::findOrFail($id);
            $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

            // Create info object for CAPA template with proper null checks
            $assessmentDate = 'N/A';
            if ($assessmentInfo && $assessmentInfo->assessment_date) {
                try {
                    $assessmentDate = \Carbon\Carbon::parse($assessmentInfo->assessment_date)->format('Y-m-d');
                } catch (\Exception $e) {
                    $assessmentDate = date('Y-m-d'); // fallback to current date
                }
            } else {
                $assessmentDate = date('Y-m-d'); // fallback to current date
            }

            $info = (object) [
                'capaTitile' => $assessmentInfo && $assessmentInfo->capa_heading 
                    ? $assessmentInfo->capa_heading 
                    : ($assessmentInfo && $assessmentInfo->facility_name 
                        ? $assessmentInfo->facility_name . ' - CAPA Report' 
                        : 'CAPA Report'),
                'facilityName' => $assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'N/A',
                'reportNo' => $assessmentInfo && $assessmentInfo->report_no ? $assessmentInfo->report_no : 'N/A',
                'facilityAddress' => $assessmentInfo && $assessmentInfo->facility_address ? $assessmentInfo->facility_address : 'N/A',
                'assessors' => $assessmentInfo && $assessmentInfo->assessors ? $assessmentInfo->assessors : 'N/A',
                'assesmentDate' => $assessmentDate,
                'scheduleType' => $assessmentInfo && $assessmentInfo->schedule_type ? $assessmentInfo->schedule_type : 'N/A',
                'assessmentType' => $assessmentInfo && $assessmentInfo->assessment_type ? $assessmentInfo->assessment_type : 'N/A',
                'primaryContact' => $assessmentInfo && $assessmentInfo->primary_contact_name ? $assessmentInfo->primary_contact_name : 'N/A',
                'position' => $assessmentInfo && $assessmentInfo->position ? $assessmentInfo->position : 'N/A',
            ];

            // Filter questions to get only those with 'Non-Compliance' as an answer (non-compliances)
            $nonComplianceQuestions = array_filter($questions, function ($q) {
                return isset($q['answer']) && strtolower(trim($q['answer'])) === 'non-compliance';
            });

            // Format audit answer data for CAPA template
            $auditAnswerData = [];
            $ncCounter = 1;

            foreach ($nonComplianceQuestions as $question) {
                // Ensure question is an array and has basic structure
                if (!is_array($question)) {
                    continue;
                }
                
                $auditAnswerData[] = (object) [
                    'category' => isset($question['category']) ? $question['category'] : 'Uncategorized',
                    'sub_category' => isset($question['subcategory']) ? $question['subcategory'] : (isset($question['sub_category']) ? $question['sub_category'] : 'General'),
                    'nc_ref' => 'NC-' . str_pad($ncCounter++, 3, '0', STR_PAD_LEFT),
                    'findings' => isset($question['findings']) ? $question['findings'] : 'Non-compliance identified',
                    'rating' => isset($question['risk_rating']) ? $question['risk_rating'] : 'N/A',
                    'corrective_action_plan' => isset($question['legal_ref']) ? $question['legal_ref'] : 'N/A',
                    'target_completion_date' => isset($question['recommendation']) ? $question['recommendation'] : 'N/A',
                ];
            }

            // Determine the audit type based on assessment type
            $type = $assessment && $assessment->type ? strtolower($assessment->type) : 'general';

            $data = [
                'info' => $info,
                'auditAnswerData' => $auditAnswerData,
                'type' => $type,
            ];

            // Validate data before passing to view
            if (empty($data['info'])) {
                throw new \Exception('Info object is empty');
            }

            // Generate and download the CAPA PDF
            $pdf = PDF::loadView('cocCapa', $data);
            $pdf->setPaper('a4', 'landscape');

            return $pdf->download('capa_report_' . $id . '.pdf');

        } catch (\Exception $e) {
            Log::error('CAPA PDF generation error: ' . $e->getMessage());
            Log::error('Error file: ' . $e->getFile() . ' on line ' . $e->getLine());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Assessment ID: ' . $id);
            Log::error('Questions count: ' . count($request->input('questions', [])));
            Log::error('AssessmentInfo exists: ' . ($assessmentInfo ? 'Yes' : 'No'));
            
            return response()->json([
                'error' => 'Failed to generate CAPA PDF',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile()),
                'debug' => [
                    'assessment_id' => $id,
                    'questions_count' => count($request->input('questions', [])),
                    'assessment_info_exists' => $assessmentInfo ? true : false
                ]
            ], 500);
        }
    }

    /**
     * Generate and download Certificate PDF.
     */
    public function generateCertificatePdf($id, Request $request)
    {
        try {
            // Get assessment and assessment info
            $assessment = \App\Models\Assessment::findOrFail($id);
            $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

            // Get data from request (sent from frontend)
            $requestAssessmentInfo = $request->input('assessmentInfo');
            $currentOverallRatings = $request->input('currentOverallRatings', []);
            $statistics = $request->input('statistics', []);

            // Use request data if available, fallback to database data
            $finalAssessmentInfo = $requestAssessmentInfo ?: $assessmentInfo;

            // Get risk ratings and overall ratings for this assessment type
            $riskRatings = RiskRating::where('type', $assessment->type)->get();
            $overallRatings = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'desc')->get();

            // Process overall ratings data
            $overallRatingData = [];
            if (!empty($currentOverallRatings)) {
                foreach ($currentOverallRatings as $rating) {
                    $overallRatingData[] = [
                        'label' => $rating['label'] ?? 'Unknown',
                        'percentage' => $rating['percentage'] ?? 0,
                        'color' => $rating['color'] ?? 'red'
                    ];
                }
            } else {
                // Fallback to database overall ratings
                foreach ($overallRatings as $rating) {
                    $overallRatingData[] = [
                        'label' => $rating->label,
                        'percentage' => $rating->percentage,
                        'color' => $rating->color
                    ];
                }
            }

            // Process statistics for bar chart
            $chartData = [
                'compliance' => $statistics['compliance'] ?? 0,
                'nonCompliance' => $statistics['nonCompliance'] ?? 0,
                'notApplicable' => $statistics['notApplicable'] ?? 0,
                'totalQuestions' => $statistics['totalQuestions'] ?? 0,
                'overallPercentage' => $statistics['overallPercentage'] ?? 0,
                'overallRatingLabel' => $statistics['overallRatingLabel'] ?? 'Not Determined',
                'overallRatingColor' => $statistics['overallRatingColor'] ?? 'red'
            ];

            // Determine assessment date
            $assessmentDate = 'N/A';
            if ($finalAssessmentInfo) {
                if (is_array($finalAssessmentInfo) && isset($finalAssessmentInfo['assessment_date'])) {
                    $assessmentDate = $finalAssessmentInfo['assessment_date'];
                } elseif (is_object($finalAssessmentInfo) && $finalAssessmentInfo->assessment_date) {
                    $assessmentDate = $finalAssessmentInfo->assessment_date;
                }
                
                // Format assessment date
                if ($assessmentDate !== 'N/A') {
                    try {
                        $assessmentDate = \Carbon\Carbon::parse($assessmentDate)->format('F d, Y');
                    } catch (\Exception $e) {
                        $assessmentDate = 'N/A';
                    }
                }
            }

            // Extract facility information
            $facilityName = 'N/A';
            $facilityAddress = 'N/A';
            $reportHeading = 'Certificate of Assessment';

            if ($finalAssessmentInfo) {
                if (is_array($finalAssessmentInfo)) {
                    $facilityName = $finalAssessmentInfo['facility_name'] ?? 'N/A';
                    $facilityAddress = $finalAssessmentInfo['facility_address'] ?? 'N/A';
                    $reportHeading = $finalAssessmentInfo['report_heading'] ?? 'Certificate of Assessment';
                } elseif (is_object($finalAssessmentInfo)) {
                    $facilityName = $finalAssessmentInfo->facility_name ?? 'N/A';
                    $facilityAddress = $finalAssessmentInfo->facility_address ?? 'N/A';
                    $reportHeading = $finalAssessmentInfo->report_heading ?? 'Certificate of Assessment';
                }
            }

            // Create data array for certificate template
            $data = [
                'assessment' => $assessment,
                'assessmentInfo' => $finalAssessmentInfo,
                'facilityName' => $facilityName,
                'facilityAddress' => $facilityAddress,
                'reportHeading' => $reportHeading,
                'assessmentDate' => $assessmentDate,
                'overallRatings' => $overallRatingData,
                'chartData' => $chartData,
                'riskRatings' => $riskRatings,
                'statistics' => $statistics
            ];

            // Generate and download the Certificate PDF
            $pdf = PDF::loadView('certificate', $data);
            $pdf->setPaper('a4', 'portrait');

            return $pdf->download('certificate_' . $id . '.pdf');

        } catch (\Exception $e) {
            Log::error('Certificate PDF generation error: ' . $e->getMessage());
            Log::error('Error file: ' . $e->getFile() . ' on line ' . $e->getLine());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Assessment ID: ' . $id);
            Log::error('Request data: ' . json_encode($request->all()));
            
            return response()->json([
                'error' => 'Failed to generate Certificate PDF',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile()),
                'debug' => [
                    'assessment_id' => $id,
                    'assessment_info_exists' => $assessmentInfo ? true : false,
                    'request_has_assessment_info' => $request->has('assessmentInfo'),
                    'request_has_overall_ratings' => $request->has('currentOverallRatings'),
                    'request_has_statistics' => $request->has('statistics')
                ]
            ], 500);
        }
    }

    /**
     * Generate and download Word document report.
     */
    public function generateDocx($id, Request $request)
    {
        try {
            // Get the same data as PDF generation
            $questions = $request->input('questions', []);
            $assessment = Assessment::findOrFail($id);
            $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

            // Get risk ratings and overall ratings for this assessment type
            $riskRatings = RiskRating::where('type', $assessment->type)->get();
            $overallRatings = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'asc')->get();

            // Calculate scores and audit findings using dynamic risk rating table
            $total_achieved_marks = 0;
            $total_possible_marks = 0;
            $category_percentages = [];
            $audit_findings = [];

            // Group questions by category and calculate scores
            $grouped_questions = [];
            foreach ($questions as $question) {
                if (!is_array($question)) {
                    continue;
                }
                $category = isset($question['category']) ? $question['category'] : 'Uncategorized';
                $grouped_questions[$category][] = $question;
            }

            // Calculate category scores and generate audit findings
            foreach ($grouped_questions as $category => $categoryQuestions) {
                $category_achieved = 0;
                $category_possible = 0; // Will calculate based on actual risk ratings selected
                $findings = [];

                foreach ($categoryQuestions as $question) {
                    // Skip questions marked as "Not Applicable"
                    if (isset($question['answer']) && strtolower(trim($question['answer'])) === 'not applicable') {
                        continue;
                    }

                    // Get the mark from risk_rating table based on the selected risk_rating value
                    $riskRating = $riskRatings->where('label', $question['risk_rating'] ?? '')->first();
                    $questionMark = $riskRating ? floatval($riskRating->mark) : 0;
                    
                    $achievedMarks = 0;
                    if (isset($question['answer'])) {
                        if (strtolower(trim($question['answer'])) === 'compliance') {
                            // For 'Compliance' answers, add the full mark
                            $achievedMarks = $questionMark;
                        } elseif (strtolower(trim($question['answer'])) === 'non-compliance') {
                            $achievedMarks = 0;
                            // Add finding if answer is Non-Compliance
                            $color = $riskRating ? strtolower(trim($riskRating->color)) : 'red'; // Default to red

                            $findings[] = [
                                'question_ref' => isset($question['ncref']) ? $question['ncref'] : 'N/A',
                                'findings' => isset($question['findings']) ? $question['findings'] : 'No findings description provided.',
                                'risk_rating' => isset($question['risk_rating']) ? $question['risk_rating'] : 'Not Specified',
                                'legal_ref' => isset($question['legal_ref']) ? $question['legal_ref'] : 'No legal reference provided.',
                                'recommendation' => isset($question['recommendation']) ? $question['recommendation'] : 'No recommendation provided.',
                                'color' => $color
                            ];
                        }
                    }
                    
                    $category_achieved += $achievedMarks;
                    $total_achieved_marks += $achievedMarks;
                    
                    // Add to possible marks based on the selected risk rating for this question
                    $category_possible += $questionMark;
                    $total_possible_marks += $questionMark;
                }

                $category_percentage = $category_possible > 0 ? ($category_achieved / $category_possible) * 100 : 0;
                $category_percentages[$category] = round($category_percentage, 1);

                if (!empty($findings)) {
                    $color_counts = ['green' => 0, 'yellow' => 0, 'orange' => 0, 'red' => 0];
                    foreach ($findings as $finding) {
                        if (isset($color_counts[$finding['color']])) {
                            $color_counts[$finding['color']]++;
                        }
                    }

                    $audit_findings[$category] = [
                        'findings' => $findings,
                        'percentage' => $category_percentage,
                        'color_counts' => $color_counts
                    ];
                } else {
                    // Include categories with no findings
                    $audit_findings[$category] = [
                        'findings' => [],
                        'percentage' => $category_percentage,
                        'color_counts' => ['green' => 0, 'yellow' => 0, 'orange' => 0, 'red' => 0]
                    ];
                }
            }

            $overall_percentage = $total_possible_marks > 0 ? ($total_achieved_marks / $total_possible_marks) * 100 : 0;

            // Determine overall rating based on percentage and overall_rating table
            $overallRatingLabel = 'Not Determined';
            $overallRatingColor = 'red';
            
            foreach ($overallRatings as $rating) {
                if ($overall_percentage >= floatval($rating->percentage)) {
                    $overallRatingLabel = $rating->label;
                    $overallRatingColor = $rating->color;
                } else {
                    break; // Stop at first condition that fails since they're ordered by percentage
                }
            }

            // Create Word document
            $phpWord = new PhpWord();
            
            // Set document properties
            $properties = $phpWord->getDocInfo();
            $properties->setCreator('Assessment System');
            $properties->setTitle('Assessment Report');
            $properties->setDescription('Assessment Report for ' . ($assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Unknown Facility'));

            // Define styles
            $phpWord->addFontStyle('titleFont', ['size' => 24, 'bold' => true]);
            $phpWord->addFontStyle('facilityNameFont', ['size' => 18, 'bold' => true, 'color' => '0070C0']);
            $phpWord->addFontStyle('sectionHeadingFont', ['size' => 16, 'bold' => true, 'color' => '0070C0']);
            $phpWord->addFontStyle('boldFont', ['bold' => true]);
            $phpWord->addFontStyle('normalFont', ['size' => 11]);

            // Add section with margins
            $section = $phpWord->addSection([
                'marginLeft' => Converter::inchToTwip(0.8),
                'marginRight' => Converter::inchToTwip(0.8),
                'marginTop' => Converter::inchToTwip(1),
                'marginBottom' => Converter::inchToTwip(1)
            ]);

            // Add header
            $header = $section->addHeader();
            $headerTable = $header->addTable();
            $headerRow = $headerTable->addRow();
            
            // Left cell with logo
            $leftCell = $headerRow->addCell(4500);
            $logoPath = public_path('images/logo.png');
            if (file_exists($logoPath)) {
                $leftCell->addImage($logoPath, [
                    'width' => 60,
                    'height' => 30,
                    'positioning' => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE,
                    'posHorizontal' => \PhpOffice\PhpWord\Style\Image::POSITION_HORIZONTAL_LEFT,
                    'posVertical' => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_TOP,
                ]);
            }
            
            // Right cell with company info
            $rightCell = $headerRow->addCell(4500);
            $rightCell->addText('www.nbm-intl.com', ['size' => 10], ['alignment' => 'right']);
            $rightCell->addText('info@nbm-intl.com', ['size' => 10], ['alignment' => 'right']);

            // Add footer with page number
            $footer = $section->addFooter();
            $footer->addPreserveText('Page {PAGE}', ['size' => 10], ['alignment' => 'right']);

            // COVER PAGE
            $section->addTextBreak(2);
            
            // Add centered logo above title
            $logoPath = public_path('images/background.jpg');
            if (file_exists($logoPath)) {
                $section->addImage($logoPath, [
                    'width' => 380,
                    'height' => 220,
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER
                ]);
            }
            $section->addTextBreak(2);
            
            // Title
            $section->addText($assessmentInfo && $assessmentInfo->report_heading ? $assessmentInfo->report_heading : 'Assessment Report', 'titleFont', ['alignment' => 'center']);
            $section->addTextBreak(2);

            // Facility name
            $section->addText($assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Facility Name Not Provided', 'facilityNameFont');

            // Cover information table - full width
            $coverTable = $section->addTable([
                'borderSize' => 1,
                'borderColor' => 'CCCCCC',
                'cellMargin' => 80,
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            
            $this->addStyledTableRow($coverTable, 'Audit Company:', $assessmentInfo && $assessmentInfo->audit_company ? $assessmentInfo->audit_company : 'Not Specified', 'F8F8F8');
            $this->addStyledTableRow($coverTable, 'Report No:', $assessmentInfo && $assessmentInfo->report_no ? $assessmentInfo->report_no : 'Not Specified', 'FFFFFF');
            $this->addStyledTableRow($coverTable, 'Assessment Type:', $assessmentInfo && $assessmentInfo->assessment_type ? $assessmentInfo->assessment_type : 'Not Specified', 'F8F8F8');
            $this->addStyledTableRow($coverTable, 'Schedule Type:', $assessmentInfo && $assessmentInfo->schedule_type ? $assessmentInfo->schedule_type : 'Not Specified', 'FFFFFF');
            $this->addStyledTableRow($coverTable, 'Assessors:', $assessmentInfo && $assessmentInfo->assessors ? $assessmentInfo->assessors : 'Not Specified', 'F8F8F8');
            
            // Handle assessment date safely
            $assessmentDateFormatted = 'Not Specified';
            if ($assessmentInfo && $assessmentInfo->assessment_date) {
                try {
                    $assessmentDateFormatted = \Carbon\Carbon::parse($assessmentInfo->assessment_date)->format('F d, Y');
                } catch (\Exception $e) {
                    $assessmentDateFormatted = 'Not Specified';
                }
            }
            $this->addStyledTableRow($coverTable, 'Assessment Date:', $assessmentDateFormatted, 'FFFFFF');

            $section->addPageBreak();

            // REPORT SUMMARY PAGE
            $section->addText('Report Summary of', 'sectionHeadingFont');
            $section->addText($assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Facility Name Not Provided', ['size' => 16, 'bold' => true]);
            $section->addTextBreak(1);

            // Overall rating
            $section->addText('Overall rating (Weighted Average):', ['size' => 12, 'bold' => true]);
            $ratingTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER
            ]);
            
            // Create dynamic rating table based on overall_ratings from database
            $ratingRow = $ratingTable->addRow();
            
            // Map color names to hex codes for background
            $colorMap = [
                'green' => '4CAF50',
                'yellow' => 'FFC107', 
                'orange' => 'FF9800',
                'red' => 'F44336'
            ];
            
            // Map colors for text (white for dark backgrounds, black for light)
            $textColorMap = [
                'green' => 'FFFFFF',
                'yellow' => '000000',
                'orange' => 'FFFFFF', 
                'red' => 'FFFFFF'
            ];
            
            // Calculate cell width based on number of ratings
            $cellWidth = $overallRatings->count() > 0 ? (8000 / $overallRatings->count()) : 2000;
            
            // Add cells for each rating from database
            foreach ($overallRatings as $rating) {
                $bgColor = $colorMap[strtolower($rating->color)] ?? 'CCCCCC';
                $textColor = $textColorMap[strtolower($rating->color)] ?? '000000';
                
                $cellText = $rating->label . ' (≥' . $rating->percentage . '%)';
                $ratingRow->addCell($cellWidth, ['bgColor' => $bgColor, 'valign' => 'center'])
                          ->addText($cellText, ['color' => $textColor, 'bold' => true], 
                                   ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            }
            
            // Add the overall percentage with the determined rating color
            $overallBgColor = $colorMap[strtolower($overallRatingColor)] ?? 'CCCCCC';
            $overallTextColor = $textColorMap[strtolower($overallRatingColor)] ?? '000000';
            
            $ratingRow->addCell(2000, ['bgColor' => $overallBgColor, 'valign' => 'center'])
                      ->addText(round($overall_percentage, 1) . '% (' . $overallRatingLabel . ')', 
                               ['color' => $overallTextColor, 'bold' => true], 
                               ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);

            $section->addTextBreak(2);

            // Section Rating
            $section->addText('Section Rating:', ['size' => 12, 'bold' => true]);

            $sectionTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
                'unit' => 'pct'
            ]);
            
            // Header row
            $headerRow = $sectionTable->addRow();
            $headerRow->addCell(4000, ['bgColor' => 'C0C0C0', 'valign' => 'center'])->addText('Performance Area', ['bold' => true], ['alignment' => 'left', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            $headerRow->addCell(2000, ['bgColor' => 'C0C0C0', 'valign' => 'center'])->addText('Rating', ['bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            $headerRow->addCell(2000, ['bgColor' => 'C0C0C0', 'valign' => 'center'])->addText('Score', ['bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);

            // Category rows
            foreach ($category_percentages as $category => $percentage) {
                $row = $sectionTable->addRow();
                $row->addCell(4000, ['valign' => 'center'])->addText($category, 'normalFont', ['alignment' => 'left', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                
                // Determine color based on overall rating table
                $colorForPercentage = 'red'; // Default to red
                
                // Find the highest rating this percentage qualifies for
                foreach ($overallRatings as $rating) {
                    if ($percentage >= floatval($rating->percentage)) {
                        $colorForPercentage = $rating->color;
                    }
                }
                
                // Map color names to hex codes
                $colorMap = [
                    'green' => '4CAF50',
                    'yellow' => 'FFC107',
                    'orange' => 'FF9800',
                    'red' => 'F44336'
                ];
                $bgColor = $colorMap[$colorForPercentage] ?? 'F44336';
                
                $row->addCell(2000, ['bgColor' => $bgColor, 'valign' => 'center'])->addText('', 'normalFont', ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                $row->addCell(2000, ['valign' => 'center'])->addText($percentage . '%', 'normalFont', ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            }

            $section->addTextBreak(1);

            // Facility Information
            $facilityTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            
            // Header row for facility
            $facilityHeaderRow = $facilityTable->addRow();
            $facilityHeaderRow->addCell(null, ['bgColor' => 'F44336', 'gridSpan' => 2])->addText('Facility Information', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            
            $this->addInfoRow($facilityTable, 'Facility Name', $assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Facility Address', $assessmentInfo && $assessmentInfo->facility_address ? $assessmentInfo->facility_address : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Business License', $assessmentInfo && $assessmentInfo->business_license ? $assessmentInfo->business_license : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Country', $assessmentInfo && $assessmentInfo->country ? $assessmentInfo->country : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Year of establishment', $assessmentInfo && $assessmentInfo->year_establishment ? $assessmentInfo->year_establishment : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Building description', $assessmentInfo && $assessmentInfo->building_description ? $assessmentInfo->building_description : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Multiple Tenants', $assessmentInfo && $assessmentInfo->multiple_tenants ? $assessmentInfo->multiple_tenants : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Site owned or rented', $assessmentInfo && $assessmentInfo->site_owned ? $assessmentInfo->site_owned : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Monthly Production Capacity', $assessmentInfo && $assessmentInfo->monthly_production ? $assessmentInfo->monthly_production : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Primary Contact Name', $assessmentInfo && $assessmentInfo->primary_contact_name ? $assessmentInfo->primary_contact_name : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Position', $assessmentInfo && $assessmentInfo->position ? $assessmentInfo->position : 'Not Provided');
            $this->addInfoRow($facilityTable, 'E-mail', $assessmentInfo && $assessmentInfo->email ? $assessmentInfo->email : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Contact Number', $assessmentInfo && $assessmentInfo->contact_number ? $assessmentInfo->contact_number : 'Not Provided');
            $this->addInfoRow($facilityTable, 'Social Compliance Contact', $assessmentInfo && $assessmentInfo->social_compliance_contact ? $assessmentInfo->social_compliance_contact : 'Not Provided');

            $section->addTextBreak(2);

            // Employee Information
            $employeeTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            
            // Header row for employee
            $employeeHeaderRow = $employeeTable->addRow();
            $employeeHeaderRow->addCell(null, ['bgColor' => 'F44336', 'gridSpan' => 2])->addText('Employee Information', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            
            $this->addInfoRow($employeeTable, 'Number of employees', $assessmentInfo && $assessmentInfo->number_of_employees ? $assessmentInfo->number_of_employees : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Number of workers', $assessmentInfo && $assessmentInfo->number_of_workers ? $assessmentInfo->number_of_workers : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Male employees', $assessmentInfo && $assessmentInfo->male_employees ? $assessmentInfo->male_employees : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Female Employees', $assessmentInfo && $assessmentInfo->female_employees ? $assessmentInfo->female_employees : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Local workers', $assessmentInfo && $assessmentInfo->local_workers ? $assessmentInfo->local_workers : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Foreign Migrant Workers', $assessmentInfo && $assessmentInfo->foreign_workers ? $assessmentInfo->foreign_workers : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Worker Turnover Rate', $assessmentInfo && $assessmentInfo->worker_turnover_rate ? $assessmentInfo->worker_turnover_rate : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Labor Agent Used', $assessmentInfo && $assessmentInfo->labor_agent_used ? $assessmentInfo->labor_agent_used : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Management Spoken Language', $assessmentInfo && $assessmentInfo->management_language ? $assessmentInfo->management_language : 'Not Provided');
            $this->addInfoRow($employeeTable, 'Workers Spoken Language', $assessmentInfo && $assessmentInfo->workers_language ? $assessmentInfo->workers_language : 'Not Provided');

            $section->addTextBreak(2);

            // General Assessment Overview
            $overviewTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            $overviewHeaderRow = $overviewTable->addRow();
            $overviewHeaderRow->addCell(null, ['bgColor' => 'FFD966', 'gridSpan' => 1, 'valign' => 'center'])->addText('General Assessment Overview', ['bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            $overviewContentRow = $overviewTable->addRow();
            $overviewCell = $overviewContentRow->addCell(null, ['gridSpan' => 1, 'valign' => 'center']);
            $this->addHtmlContentToCell($overviewCell, $assessmentInfo && $assessmentInfo->general_assessment_overview ? $assessmentInfo->general_assessment_overview : null, 'No general assessment overview provided.');

            $section->addTextBreak(2);

            // Facility Good Practices
            $practicesTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            $practicesHeaderRow = $practicesTable->addRow();
            $practicesHeaderRow->addCell(null, ['bgColor' => 'FFD966', 'gridSpan' => 1, 'valign' => 'center'])->addText('Facility Good Practices', ['bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            $practicesContentRow = $practicesTable->addRow();
            $practicesCell = $practicesContentRow->addCell(null, ['gridSpan' => 1, 'valign' => 'center']);
            $this->addHtmlContentToCell($practicesCell, $assessmentInfo && $assessmentInfo->facility_good_practices ? $assessmentInfo->facility_good_practices : null, 'No facility good practices information provided.');

            $section->addTextBreak(2);

            // Worker Interview
            $workerInterviewTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            $workerInterviewHeaderRow = $workerInterviewTable->addRow();
            $workerInterviewHeaderRow->addCell(null, ['bgColor' => 'FFD966', 'gridSpan' => 1, 'valign' => 'center'])->addText('Details of Workers Interview', ['bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            $workerInterviewContentRow = $workerInterviewTable->addRow();
            $workerInterviewCell = $workerInterviewContentRow->addCell(null, ['gridSpan' => 1, 'valign' => 'center']);
            $this->addHtmlContentToCell($workerInterviewCell, $assessmentInfo && $assessmentInfo->worker_interview ? $assessmentInfo->worker_interview : null, 'No worker interview information provided.');
            $section->addTextBreak(2);

            // AUDIT FINDINGS
            $section->addText('Audit Findings', 'sectionHeadingFont');
            $section->addTextBreak(1);

            if (!empty($audit_findings)) {
                foreach ($audit_findings as $category => $categoryData) {
                    // Category table with header and score
                    $categoryTable = $section->addTable([
                        'borderSize' => 6,
                        'borderColor' => '000000',
                        'width' => 100 * 50,
                        'unit' => 'pct'
                    ]);
                    
                    // Category header row
                    $categoryHeaderRow = $categoryTable->addRow(500); // Set explicit row height
                    $categoryHeaderRow->addCell(6000, ['bgColor' => 'E8E8E8', 'valign' => 'center'])->addText($category, ['size' => 12, 'bold' => true], ['alignment' => 'left', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                    
                    // Color counts cells
                    $categoryHeaderRow->addCell(500, ['bgColor' => '4CAF50', 'valign' => 'center'])->addText($categoryData['color_counts']['green'], ['color' => 'FFFFFF', 'bold' => true, 'size' => 10], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                    $categoryHeaderRow->addCell(500, ['bgColor' => 'FFC107', 'valign' => 'center'])->addText($categoryData['color_counts']['yellow'], ['bold' => true, 'size' => 10], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                    $categoryHeaderRow->addCell(500, ['bgColor' => 'FF9800', 'valign' => 'center'])->addText($categoryData['color_counts']['orange'], ['color' => 'FFFFFF', 'bold' => true, 'size' => 10], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                    $categoryHeaderRow->addCell(500, ['bgColor' => 'F44336', 'valign' => 'center'])->addText($categoryData['color_counts']['red'], ['color' => 'FFFFFF', 'bold' => true, 'size' => 10], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                    $categoryHeaderRow->addCell(1000, ['bgColor' => 'F0F0F0', 'valign' => 'center'])->addText('Audit Score ' . number_format($categoryData['percentage'], 1), ['bold' => true, 'size' => 8], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);

                    // Individual findings
                    if (count($categoryData['findings']) > 0) {
                        $section->addTextBreak(1);
                        
                        foreach ($categoryData['findings'] as $index => $finding) {
                            // Generate finding ID
                            $categoryPrefix = strtoupper(substr($category, 0, 2));
                            $findingId = $categoryPrefix . '-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                            
                            // Create separate table for each finding
                            $findingsTable = $section->addTable([
                                'borderSize' => 6,
                                'borderColor' => '000000',
                                'width' => 100 * 50,
                                'unit' => 'pct'
                            ]);
                            
                            // Finding header row with ID and risk rating
                            $findingHeaderRow = $findingsTable->addRow();
                            $findingHeaderRow->addCell(1500, ['valign' => 'center'])->addText($findingId, ['bold' => true, 'size' => 11], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                            
                            $riskColor = 'F44336'; // Red default
                            $textColor = 'FFFFFF';
                            if ($finding['color'] === 'green') {
                                $riskColor = '4CAF50';
                            } elseif ($finding['color'] === 'yellow') {
                                $riskColor = 'FFC107';
                                $textColor = '000000';
                            } elseif ($finding['color'] === 'orange') {
                                $riskColor = 'FF9800';
                            }
                            
                            $findingHeaderRow->addCell(7500, ['bgColor' => $riskColor, 'valign' => 'center'])->addText($finding['risk_rating'], ['color' => $textColor, 'bold' => true, 'size' => 11], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                            
                            // Findings row
                            $findingsRow = $findingsTable->addRow();
                            $findingsRow->addCell(1500, ['valign' => 'center'])->addText('Findings', ['bold' => true, 'size' => 10], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                            $findingsCell = $findingsRow->addCell(7500, ['valign' => 'center']);
                            $this->addHtmlContentToCell($findingsCell, $finding['findings'], 'No findings description provided.');
                            
                            // Legal Reference row
                            $legalRow = $findingsTable->addRow();
                            $legalRow->addCell(1500, ['valign' => 'center'])->addText('Legal Reference', ['bold' => true, 'size' => 10], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                            $legalCell = $legalRow->addCell(7500, ['valign' => 'center']);
                            $this->addHtmlContentToCell($legalCell, $finding['legal_ref'], 'No legal reference provided.');
                            
                            // Recommendation row
                            $recommendationRow = $findingsTable->addRow();
                            $recommendationRow->addCell(1500, ['valign' => 'center'])->addText('Recommendation', ['bold' => true, 'size' => 10], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                            $recommendationCell = $recommendationRow->addCell(7500, ['valign' => 'center']);
                            $this->addHtmlContentToCell($recommendationCell, $finding['recommendation'], 'No recommendation provided.');
                            
                            // Add spacing between individual finding tables
                            $section->addTextBreak(1);
                        }
                        
                        $section->addTextBreak(1);
                    } else {
                        // Add no findings row to the same category table
                        $noFindingsRow = $categoryTable->addRow();
                        $noFindingsRow->addCell(null, ['gridSpan' => 8, 'valign' => 'center'])->addText('No findings noted under this section on the assessment day.', 'normalFont', ['alignment' => 'left', 'spaceBefore' => 0, 'spaceAfter' => 0]);
                        $section->addTextBreak(2);
                    }
                }
            } else {
                $section->addText('No audit findings available. All assessment questions were answered as "Yes" or no findings were recorded.', 'normalFont');
            }

            $section->addTextBreak(2);

            // Additional Information
            $additionalInfoTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50,
                'unit' => 'pct'
            ]);
            
            // Header row for additional information
            $additionalInfoHeaderRow = $additionalInfoTable->addRow();
            $additionalInfoHeaderRow->addCell(null, ['bgColor' => 'F44336', 'gridSpan' => 2])->addText('Additional Information', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center', 'spaceBefore' => 0, 'spaceAfter' => 0]);
            
            // Content row for additional information
            $additionalInfoContentRow = $additionalInfoTable->addRow();
            $additionalInfoCell = $additionalInfoContentRow->addCell(null, ['gridSpan' => 2, 'valign' => 'center']);
            $this->addHtmlContentToCell($additionalInfoCell, $assessmentInfo && $assessmentInfo->additional_info ? $assessmentInfo->additional_info : null, 'No additional information provided.');

            $section->addTextBreak(2);

            // DISCLAIMER (as plain text without table)
            $section->addText('Disclaimer:', ['size' => 14, 'bold' => true]);
            $section->addTextBreak(1);
            
            // Create a simple paragraph for disclaimer with HTML content
            $disclaimerContent = $assessmentInfo && $assessmentInfo->disclaimer ? $assessmentInfo->disclaimer : 'This Assessment Report has been prepared by ECOTEC Global Limited for the sole purpose of providing an overview of the current social compliance status at the facility.';
            
            // For disclaimer, we'll handle it specially to maintain formatting
            $this->addHtmlContentToSection($section, $disclaimerContent);

            // Save document
            $fileName = 'assessment_report_' . $id . '.docx';
            $filePath = storage_path('app/temp/' . $fileName);
            
            // Create temp directory if it doesn't exist
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0777, true);
            }

            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($filePath);

            return response()->download($filePath, $fileName)->deleteFileAfterSend(true);

            // Save document
            $fileName = 'assessment_report_' . $id . '.docx';
            $filePath = storage_path('app/temp/' . $fileName);
            
            // Create temp directory if it doesn't exist
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0777, true);
            }

            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($filePath);

            return response()->download($filePath, $fileName)->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('Word document generation error: ' . $e->getMessage());
            Log::error('Error file: ' . $e->getFile() . ' on line ' . $e->getLine());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Assessment ID: ' . $id);
            Log::error('Questions count: ' . count($request->input('questions', [])));
            Log::error('AssessmentInfo exists: ' . ($assessmentInfo ? 'Yes' : 'No'));
            
            return response()->json([
                'error' => 'Failed to generate Word document',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile()),
                'debug' => [
                    'assessment_id' => $id,
                    'questions_count' => count($request->input('questions', [])),
                    'assessment_info_exists' => isset($assessmentInfo) ? true : false
                ]
            ], 500);
        }
    }

    /**
     * Add a simple table row with two columns
     */
    private function addSimpleTableRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(3000, ['valign' => 'center'])->addText($label, ['bold' => true, 'size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
        $row->addCell(5000, ['valign' => 'center'])->addText($value, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
    }

    /**
     * Add info table row for facility/employee information
     */
    private function addInfoRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(3000, ['valign' => 'center'])->addText($label, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
        $row->addCell(5000, ['valign' => 'center'])->addText($value, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
    }

    /**
     * Add finding detail row
     */
    private function addFindingDetailRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(2000, ['valign' => 'center'])->addText($label, ['bold' => true, 'size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
        $row->addCell(6000, ['valign' => 'center'])->addText($value, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
    }

    /**
     * Add styled table row with alternating background colors
     */
    private function addStyledTableRow($table, $label, $value, $bgColor = 'FFFFFF')
    {
        $row = $table->addRow();
        $row->addCell(3500, ['bgColor' => $bgColor, 'valign' => 'center'])->addText($label, ['bold' => true, 'size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
        $row->addCell(5500, ['bgColor' => $bgColor, 'valign' => 'center'])->addText($value, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
    }

    /**
     * Convert HTML content to Word document format
     */
    private function addHtmlContentToCell($cell, $htmlContent, $defaultText = 'No content provided.')
    {
        $content = $htmlContent ?: $defaultText;
        
        // Simple HTML to Word conversion
        // Remove HTML tags but preserve some formatting
        $content = str_replace(['<br>', '<br/>', '<br />'], "\n", $content);
        $content = str_replace(['<p>', '</p>'], ["\n", "\n"], $content);
        $content = str_replace(['<h1>', '</h1>', '<h2>', '</h2>', '<h3>', '</h3>'], ["\n", "\n", "\n", "\n", "\n", "\n"], $content);
        
        // Handle lists
        $content = str_replace(['<ul>', '</ul>', '<ol>', '</ol>'], ['', '', '', ''], $content);
        $content = str_replace(['<li>', '</li>'], ['• ', "\n"], $content);
        
        // Remove remaining HTML tags
        $content = strip_tags($content);
        
        // Clean up extra newlines
        $content = preg_replace('/\n{3,}/', "\n\n", $content);
        $content = trim($content);
        
        // Split content by lines and add to cell
        $lines = explode("\n", $content);
        $isFirstLine = true;
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }
            
            if (!$isFirstLine) {
                $cell->addTextBreak();
            }
            
            // Check if line starts with bullet point
            if (strpos($line, '•') === 0) {
                $cell->addText($line, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
            } else {
                // Check if it looks like a heading (all caps or contains colon)
                if (strpos($line, ':') !== false || strlen($line) < 50) {
                    $cell->addText($line, ['size' => 11, 'bold' => true], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                } else {
                    $cell->addText($line, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                }
            }
            
            $isFirstLine = false;
        }
    }

    /**
     * Add HTML content to Word document section
     */
    private function addHtmlContentToSection($section, $htmlContent, $defaultText = 'No content provided.')
    {
        $content = $htmlContent ?: $defaultText;
        
        // Simple HTML to Word conversion
        // Remove HTML tags but preserve some formatting
        $content = str_replace(['<br>', '<br/>', '<br />'], "\n", $content);
        $content = str_replace(['<p>', '</p>'], ["\n", "\n"], $content);
        $content = str_replace(['<h1>', '</h1>', '<h2>', '</h2>', '<h3>', '</h3>'], ["\n", "\n", "\n", "\n", "\n", "\n"], $content);
        
        // Handle lists
        $content = str_replace(['<ul>', '</ul>', '<ol>', '</ol>'], ['', '', '', ''], $content);
        $content = str_replace(['<li>', '</li>'], ['• ', "\n"], $content);
        
        // Remove remaining HTML tags
        $content = strip_tags($content);
        
        // Clean up extra newlines
        $content = preg_replace('/\n{3,}/', "\n\n", $content);
        $content = trim($content);
        
        // Split content by lines and add to section
        $lines = explode("\n", $content);
        $isFirstLine = true;
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }
            
            if (!$isFirstLine) {
                $section->addTextBreak();
            }
            
            // Check if line starts with bullet point
            if (strpos($line, '•') === 0) {
                $section->addText($line, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
            } else {
                // Check if it looks like a heading (all caps or contains colon)
                if (strpos($line, ':') !== false || strlen($line) < 50) {
                    $section->addText($line, ['size' => 11, 'bold' => true], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                } else {
                    $section->addText($line, ['size' => 11], ['spaceBefore' => 0, 'spaceAfter' => 0]);
                }
            }
            
            $isFirstLine = false;
        }
    }
}
