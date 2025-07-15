<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\PDF;
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
            'assessmentType' => $assessmentInfo ? $assessmentInfo->assessment_type : 'N/A',
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
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('capa_report_' . $id . '.pdf');
    }

    /**
     * Generate and download Word document report.
     */
    public function generateDocx($id, Request $request)
    {
        try {
            // Get the same data as PDF generation
            $questions = $request->input('qestions', []);
            $assessment = Assessment::findOrFail($id);
            $assessmentInfo = \App\Models\AssessmentInfo::where('assessment_id', $id)->first();

            // Calculate scores and audit findings
            $total_achieved_marks = 0;
            $total_possible_marks = count($questions) * 5;
            $category_percentages = [];
            $audit_findings = [];

            // Group questions by category and calculate scores
            $grouped_questions = [];
            foreach ($questions as $question) {
                $category = $question['category'] ?? 'Uncategorized';
                $grouped_questions[$category][] = $question;
            }

            // Calculate category scores and generate audit findings
            foreach ($grouped_questions as $category => $categoryQuestions) {
                $category_achieved = 0;
                $category_possible = count($categoryQuestions) * 5;
                $findings = [];

                foreach ($categoryQuestions as $question) {
                    $marks = 0;
                    if (isset($question['answer'])) {
                        if ($question['answer'] === 'Yes') {
                            $marks = 5;
                        } elseif ($question['answer'] === 'No') {
                            $marks = 0;
                            // Add finding if answer is No
                            $color = 'red';
                            if (isset($question['riskRating'])) {
                                $riskRating = strtolower(trim($question['riskRating']));
                                if (in_array($riskRating, ['low', 'green'])) $color = 'green';
                                elseif (in_array($riskRating, ['medium', 'yellow'])) $color = 'yellow';
                                elseif (in_array($riskRating, ['high', 'orange'])) $color = 'orange';
                                elseif (in_array($riskRating, ['critical', 'red'])) $color = 'red';
                            }

                            $findings[] = [
                                'question_ref' => $question['questionRef'] ?? 'N/A',
                                'findings' => $question['findings'] ?? 'No findings description provided.',
                                'risk_rating' => $question['riskRating'] ?? 'Not Specified',
                                'legal_ref' => $question['legalRef'] ?? 'No legal reference provided.',
                                'recommendation' => $question['recommendation'] ?? 'No recommendation provided.',
                                'color' => $color
                            ];
                        }
                    }
                    $category_achieved += $marks;
                    $total_achieved_marks += $marks;
                }

                $category_percentage = $category_possible > 0 ? ($category_achieved / $category_possible) * 100 : 0;
                $category_percentages[$category] = round($category_percentage, 1);

                if (!empty($findings)) {
                    $color_counts = ['green' => 0, 'yellow' => 0, 'orange' => 0, 'red' => 0];
                    foreach ($findings as $finding) {
                        $color_counts[$finding['color']]++;
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

            // Create Word document
            $phpWord = new PhpWord();
            
            // Set document properties
            $properties = $phpWord->getDocInfo();
            $properties->setCreator('Assessment System');
            $properties->setTitle('Assessment Report');
            $properties->setDescription('Assessment Report for ' . ($assessmentInfo->facility_name ?? 'Unknown Facility'));

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
            $headerRow->addCell(4500)->addText('www.nbm-intl.com', ['size' => 10]);
            $headerRow->addCell(4500)->addText('info@nbm-intl.com', ['size' => 10], ['alignment' => 'right']);

            // Add footer with page number
            $footer = $section->addFooter();
            $footer->addPreserveText('Page {PAGE}', ['size' => 10], ['alignment' => 'right']);

            // COVER PAGE
            $section->addTextBreak(3);
            
            // Title
            $section->addText($assessmentInfo->report_heading ?? 'Assessment Report', 'titleFont', ['alignment' => 'center']);
            $section->addTextBreak(3);

            // Facility name
            $section->addText($assessmentInfo->facility_name ?? 'Facility Name Not Provided', 'facilityNameFont');
            $section->addTextBreak(2);

            // Cover information table
            $coverTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'cellMargin' => 100,
                'width' => 100 * 50
            ]);
            
            $this->addSimpleTableRow($coverTable, 'Audit Company:', $assessmentInfo->audit_company ?? 'Not Specified');
            $this->addSimpleTableRow($coverTable, 'Report No:', $assessmentInfo->report_no ?? 'Not Specified');
            $this->addSimpleTableRow($coverTable, 'Assessment Type:', $assessmentInfo->assessment_type ?? 'Not Specified');
            $this->addSimpleTableRow($coverTable, 'Schedule Type:', $assessmentInfo->schedule_type ?? 'Not Specified');
            $this->addSimpleTableRow($coverTable, 'Assessors:', $assessmentInfo->assessors ?? 'Not Specified');
            $this->addSimpleTableRow($coverTable, 'Assessment Date:', $assessmentInfo->assessment_date ? $assessmentInfo->assessment_date->format('F d, Y') : 'Not Specified');

            $section->addPageBreak();

            // REPORT SUMMARY PAGE
            $section->addText('Report Summary of', 'sectionHeadingFont');
            $section->addText($assessmentInfo->facility_name ?? 'Facility Name Not Provided', ['size' => 14, 'bold' => true]);
            $section->addTextBreak(2);

            // Overall rating
            $section->addText('Overall rating (Weighted Average):', 'boldFont');
            $section->addTextBreak(1);

            $ratingTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            
            $ratingRow = $ratingTable->addRow();
            $ratingRow->addCell(2000, ['bgColor' => '4CAF50'])->addText('Green (A)', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center']);
            $ratingRow->addCell(2000, ['bgColor' => 'FFC107'])->addText('Yellow (B)', ['bold' => true], ['alignment' => 'center']);
            $ratingRow->addCell(2000, ['bgColor' => 'FF9800'])->addText('Orange (C)', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center']);
            $ratingRow->addCell(2000, ['bgColor' => 'F44336'])->addText('Red (D)', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center']);
            $ratingRow->addCell(2000)->addText(round($overall_percentage, 1) . '%', ['bold' => true], ['alignment' => 'center']);

            $section->addTextBreak(2);

            // Section Rating
            $section->addText('Section Rating:', 'boldFont');
            $section->addTextBreak(1);

            $sectionTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            
            // Header row
            $headerRow = $sectionTable->addRow();
            $headerRow->addCell(4000, ['bgColor' => 'C0C0C0'])->addText('Performance Area', ['bold' => true]);
            $headerRow->addCell(2000, ['bgColor' => 'C0C0C0'])->addText('Rating', ['bold' => true], ['alignment' => 'center']);
            $headerRow->addCell(2000, ['bgColor' => 'C0C0C0'])->addText('Score', ['bold' => true], ['alignment' => 'center']);

            // Category rows
            foreach ($category_percentages as $category => $percentage) {
                $row = $sectionTable->addRow();
                $row->addCell(4000)->addText($category, 'normalFont');
                
                $bgColor = 'F44336'; // Red
                if ($percentage >= 90) $bgColor = '4CAF50'; // Green
                elseif ($percentage >= 71) $bgColor = 'FFC107'; // Yellow
                elseif ($percentage >= 41) $bgColor = 'FF9800'; // Orange
                
                $row->addCell(2000, ['bgColor' => $bgColor])->addText('', 'normalFont');
                $row->addCell(2000)->addText($percentage . '%', 'normalFont', ['alignment' => 'center']);
            }

            $section->addTextBreak(2);

            // Facility Information
            $section->addText('Facility Information', 'sectionHeadingFont');
            $section->addTextBreak(1);

            $facilityTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            
            // Header row for facility
            $facilityHeaderRow = $facilityTable->addRow();
            $facilityHeaderRow->addCell(8000, ['bgColor' => 'F44336'])->addText('Facility Information', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center']);
            
            $this->addInfoRow($facilityTable, 'Facility Name', $assessmentInfo->facility_name ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Facility Address', $assessmentInfo->facility_address ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Business License', $assessmentInfo->business_license ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Country', $assessmentInfo->country ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Year of establishment', $assessmentInfo->year_establishment ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Building description', $assessmentInfo->building_description ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Multiple Tenants', $assessmentInfo->multiple_tenants ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Site owned or rented', $assessmentInfo->site_owned ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Monthly Production Capacity', $assessmentInfo->monthly_production ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Primary Contact Name', $assessmentInfo->primary_contact_name ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Position', $assessmentInfo->position ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'E-mail', $assessmentInfo->email ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Contact Number', $assessmentInfo->contact_number ?? 'Not Provided');
            $this->addInfoRow($facilityTable, 'Social Compliance Contact', $assessmentInfo->social_compliance_contact ?? 'Not Provided');

            $section->addTextBreak(2);

            // Employee Information
            $employeeTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            
            // Header row for employee
            $employeeHeaderRow = $employeeTable->addRow();
            $employeeHeaderRow->addCell(8000, ['bgColor' => 'F44336'])->addText('Employee Information', ['color' => 'FFFFFF', 'bold' => true], ['alignment' => 'center']);
            
            $this->addInfoRow($employeeTable, 'Number of employees', $assessmentInfo->number_of_employees ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Number of workers', $assessmentInfo->number_of_workers ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Male employees', $assessmentInfo->male_employees ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Female Employees', $assessmentInfo->female_employees ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Local workers', $assessmentInfo->local_workers ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Foreign Migrant Workers', $assessmentInfo->foreign_workers ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Worker Turnover Rate', $assessmentInfo->worker_turnover_rate ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Labor Agent Used', $assessmentInfo->labor_agent_used ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Management Spoken Language', $assessmentInfo->management_language ?? 'Not Provided');
            $this->addInfoRow($employeeTable, 'Workers Spoken Language', $assessmentInfo->workers_language ?? 'Not Provided');

            $section->addTextBreak(2);

            // General Assessment Overview
            $overviewTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            $overviewHeaderRow = $overviewTable->addRow();
            $overviewHeaderRow->addCell(8000, ['bgColor' => 'FFD966'])->addText('General Assessment Overview', ['bold' => true]);
            $overviewContentRow = $overviewTable->addRow();
            $overviewContentRow->addCell(8000)->addText($assessmentInfo->general_assessment_overview ?? 'No general assessment overview provided.', 'normalFont');

            $section->addTextBreak(2);

            // Facility Good Practices
            $practicesTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            $practicesHeaderRow = $practicesTable->addRow();
            $practicesHeaderRow->addCell(8000, ['bgColor' => 'FFD966'])->addText('Facility Good Practices', ['bold' => true]);
            $practicesContentRow = $practicesTable->addRow();
            $practicesContentRow->addCell(8000)->addText($assessmentInfo->facility_good_practices ?? 'No facility good practices information provided.', 'normalFont');

            $section->addPageBreak();

            // AUDIT FINDINGS
            $section->addText('Audit Findings', 'sectionHeadingFont');
            $section->addTextBreak(2);

            if (!empty($audit_findings)) {
                foreach ($audit_findings as $category => $categoryData) {
                    // Category header
                    $section->addText($category, ['size' => 14, 'bold' => true]);
                    $section->addText('Category Score: ' . number_format($categoryData['percentage'], 1) . '%', ['bold' => true]);
                    $section->addText('Findings Count - Green: ' . $categoryData['color_counts']['green'] . 
                                    ', Yellow: ' . $categoryData['color_counts']['yellow'] . 
                                    ', Orange: ' . $categoryData['color_counts']['orange'] . 
                                    ', Red: ' . $categoryData['color_counts']['red'], 'normalFont');
                    $section->addTextBreak(1);

                    // Individual findings
                    if (count($categoryData['findings']) > 0) {
                        foreach ($categoryData['findings'] as $index => $finding) {
                            // Generate finding ID
                            $categoryPrefix = strtoupper(substr($category, 0, 2));
                            $findingId = $categoryPrefix . '-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                            
                            $findingTable = $section->addTable([
                                'borderSize' => 6,
                                'borderColor' => '000000',
                                'width' => 100 * 50
                            ]);
                            
                            // Finding header row
                            $headerRow = $findingTable->addRow();
                            $headerRow->addCell(2000)->addText($findingId, ['bold' => true]);
                            
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
                            
                            $headerRow->addCell(6000, ['bgColor' => $riskColor])->addText($finding['risk_rating'], ['color' => $textColor, 'bold' => true], ['alignment' => 'center']);
                            
                            // Finding details
                            $this->addFindingDetailRow($findingTable, 'Findings', $finding['findings']);
                            $this->addFindingDetailRow($findingTable, 'Legal Reference', $finding['legal_ref']);
                            $this->addFindingDetailRow($findingTable, 'Recommendation', $finding['recommendation']);
                            
                            $section->addTextBreak(1);
                        }
                    } else {
                        $section->addText('No findings noted under this section on the assessment day.', 'normalFont');
                        $section->addTextBreak(1);
                    }
                    
                    $section->addTextBreak(1);
                }
            } else {
                $section->addText('No audit findings available. All assessment questions were answered as "Yes" or no findings were recorded.', 'normalFont');
            }

            $section->addPageBreak();

            // DISCLAIMER
            $disclaimerTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '000000',
                'width' => 100 * 50
            ]);
            $disclaimerHeaderRow = $disclaimerTable->addRow();
            $disclaimerHeaderRow->addCell(8000, ['bgColor' => 'C0C0C0'])->addText('Disclaimer:', ['bold' => true]);
            $disclaimerContentRow = $disclaimerTable->addRow();
            $disclaimerText = $assessmentInfo->disclaimer ?? 'This Assessment Report has been prepared by ECOTEC Global Limited for the sole purpose of providing an overview of the current social compliance status at the facility.';
            $disclaimerContentRow->addCell(8000)->addText($disclaimerText, 'normalFont');

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
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to generate Word document',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * Add a simple table row with two columns
     */
    private function addSimpleTableRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(3000)->addText($label, ['bold' => true, 'size' => 11]);
        $row->addCell(5000)->addText($value, ['size' => 11]);
    }

    /**
     * Add info table row for facility/employee information
     */
    private function addInfoRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(3000)->addText($label, ['size' => 11]);
        $row->addCell(5000)->addText($value, ['size' => 11]);
    }

    /**
     * Add finding detail row
     */
    private function addFindingDetailRow($table, $label, $value)
    {
        $row = $table->addRow();
        $row->addCell(2000)->addText($label, ['bold' => true, 'size' => 11]);
        $row->addCell(6000)->addText($value, ['size' => 11]);
    }
}
