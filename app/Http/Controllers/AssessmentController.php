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
use Carbon\Carbon;
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
            // Get questions from request - same as generatePdf
            $questions = $request->input('questions', []);
            
            // Get assessment and assessment info
            $assessment = \App\Models\Assessment::findOrFail($id);
            $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

            // Get risk ratings and overall ratings for this assessment type
            $riskRatings = RiskRating::where('type', $assessment->type)->get();
            $overallRatings = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'desc')->get();

            $overallRatingsDescending = OverallRating::where('type', $assessment->type)->orderBy('percentage', 'desc')->get();
            
            // Calculate scores exactly like generatePdf does
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
            
            // Calculate compliance statistics for bar chart
            $compliance = 0;
            $nonCompliance = 0;
            $notApplicable = 0;
            
            foreach ($questions as $question) {
                if (!is_array($question) || !isset($question['answer'])) {
                    continue;
                }
                
                $answer = strtolower(trim($question['answer']));
                
                if ($answer === 'compliance') {
                    $compliance++;
                } elseif ($answer === 'non-compliance') {
                    $nonCompliance++;
                } elseif ($answer === 'not applicable') {
                    $notApplicable++;
                }
            }
            
            $totalQuestions = count($questions);

            // Process overall ratings data for display
            $overallRatingData = [];
            foreach ($overallRatings as $rating) {
                $overallRatingData[] = [
                    'label' => $rating->label,
                    'percentage' => $rating->percentage,
                    'color' => $rating->color
                ];
            }

            // Create chart data structure
            $chartData = [
                'compliance' => $compliance,
                'nonCompliance' => $nonCompliance,
                'notApplicable' => $notApplicable,
                'totalQuestions' => $totalQuestions,
                'overallPercentage' => $overall_percentage,
                'overallRatingLabel' => $overallRatingLabel,
                'overallRatingColor' => $overallRatingColor
            ];

            // Determine assessment date
            $assessmentDate = 'N/A';
            if ($assessmentInfo && $assessmentInfo->assessment_date) {
                try {
                    $assessmentDate = \Carbon\Carbon::parse($assessmentInfo->assessment_date)->format('F d, Y');
                } catch (\Exception $e) {
                    $assessmentDate = 'N/A';
                }
            }

            // Create data array for certificate template - matching generatePdf structure
            $data = [
                'assessment' => $assessment,
                'assessmentInfo' => $assessmentInfo,
                'facilityName' => $assessmentInfo->facility_name ?? 'N/A',
                'facilityAddress' => $assessmentInfo->facility_address ?? 'N/A',
                'reportHeading' => $assessmentInfo->assessment_type ?? 'Certificate of Assessment',
                'certificateNo' => $assessmentInfo->report_no ?? 'N/A',
                'assessmentDate' => $assessmentDate,
                'overallRatings' => $overallRatingData,
                'overall_ratings' => $overallRatings, // Pass the collection for consistency
                'overall_ratings_descending' => $overallRatingsDescending,
                'chartData' => $chartData,
                'riskRatings' => $riskRatings,
                'scores' => [
                    'total_achieved' => $total_achieved_marks,
                    'total_possible' => $total_possible_marks,
                    'overall_percentage' => $overall_percentage,
                    'category_percentages' => $category_percentages,
                    'overall_rating_label' => $overallRatingLabel,
                    'overall_rating_color' => $overallRatingColor,
                ],
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
                    'assessment_info_exists' => isset($assessmentInfo) ? true : false,
                    'questions_count' => count($request->input('questions', [])),
                ]
            ], 500);
        }
    }

    /**
     * Generate and download simple Word document with title only.
     */
    public function generateDocx($id, Request $request)
    {
        try {
            // Create Word document
            $phpWord = new PhpWord();

            // Define title style
            $phpWord->addFontStyle('titleFont', ['size' => 20, 'bold' => true, 'color' => '4472C4']);

            // Add section
            $section = $phpWord->addSection();

            // Title only
            $section->addText('Assessment Summary Report', 'titleFont', ['alignment' => 'center']);

            // Save document
            $fileName = 'assessment_summary_' . $id . '.docx';
            $filePath = storage_path('app/temp/' . $fileName);

            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0777, true);
            }

            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($filePath);

            return response()->download($filePath, $fileName)->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('Word document generation error: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to generate Word document',
                'message' => $e->getMessage()
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
