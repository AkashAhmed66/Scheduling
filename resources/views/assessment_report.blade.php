<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PDF Title</title>
    <style>
        @page {
            margin: 50px 50px 50px 50px;
        }
        body{
            margin-bottom: 50px;
            margin-top: 70px;
            font-family: Arial, sans-serif;
        }

        p:last-child {
            page-break-after: never;
        }

        table {
            border-collapse: collapse;
            /* border: 1px; */
            width: 100% !important;
            table-layout : fixed;
        }

        .info {
            float: right;
            border: 1px solid black;
            width: 40%;
            margin-bottom: 20px;
        }

        .customer {}
        
        th,
        tr,
        td {
            border: 1px solid black;
            font-size: 14px !important;
            margin: 3px;
        }

        .company-name {
            font-size: 40px;
        }

        .items {
            width: 100%;
            padding-top: 20px;
            border: 1px solid black;
        }

        .items td {
            text-align: center;
        }

        .company-info {}

        .firstline th {
            border: 0;
        }

        p {
            line-height: 0.5;
        }

        #recTable tr td {
            height:10px !important
            border:1px solid red !important
        }
        .multiCharts{
            display: flex;
            flex-wrap: wrap;
            position: relative;
            left: 50px;
        }
        .chartImage{
            height: 280px;
            width: 280px
            margin: 10px; 
        }
        .logo{
            height: 70px;
            width: 100px;
            position: relative;
            bottom: 15px;
            right: 7px;
        }
        .infoh{
            float: right;
        }
        .ratingTable{
            width: 200px;
            float: right;
            position: relative;
        }
        .ratingTableDiv{
            width: 100%;
            height: 80px;
        }
        .header {
            width: 100%;
            position: fixed;
            top: 0px;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            right: 0px;
            width: auto;
            text-align: right;
            font-size: 12px;
        }
        .pagenum:before {
            content: counter(page);
        }
        .coverinfo{
            border: 0px;
            height: 25px;
            /* background-color: red; */
        }
        .factoryimg{
            height: 270px;
            width: 520px;
            position: relative;
            left: 90px;
            top: 40px;
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="headcontainer">
            <img class="logo" src="../public/images/logo.png" alt="logo">
                <div class="infoh">
                    <p>www.nbm-intl.com</p>
                    <p>info@nbm-intl.com</p>
                </div>
        </div>
    </div>
    
    <div class="content">
        <div class="coverpage">
            <br>
            <br>
            <br>
            @if($assessmentInfo && $assessmentInfo->facility_image_path)
                @php
                    $imagePath = public_path('storage/' . $assessmentInfo->facility_image_path);
                    $imageExists = file_exists($imagePath);
                @endphp
                @if($imageExists)
                    <img class="factoryimg" src="{{ $imagePath }}" alt="facility image">
                @else
                    <img class="factoryimg" src="{{ public_path('images/background.jpg') }}" alt="factory">
                @endif
            @else
                <img class="factoryimg" src="{{ public_path('images/background.jpg') }}" alt="factory">
            @endif
            <br>
            <br>
            <h1 style="text-align: center; position: relative; top: 40px; height: 40px;">{{ $assessmentInfo && $assessmentInfo->report_heading ? $assessmentInfo->report_heading : 'Assessment Report' }}</h1>
            <br>
            <br>
            <div style="background-color: rgb(239, 238, 238); position: relative; top: 35px; padding: 20px; height: 250px;"> 
                <h2>{{ $assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Facility Name Not Provided' }}</h2>
                <table class="coverinfo">
                    <tr class="coverinfo">
                        <td class="coverinfo" width="30%">Audit Company:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->audit_company ? $assessmentInfo->audit_company : 'Not Specified' }}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Report No:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->report_no ? $assessmentInfo->report_no : 'Not Specified' }}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Type:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->assessment_type ? $assessmentInfo->assessment_type : 'Not Specified' }}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Schedule Type:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->schedule_type ? $assessmentInfo->schedule_type : 'Not Specified' }}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessors:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->assessors ? $assessmentInfo->assessors : 'Not Specified' }}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Date:</td>
                        <td class="coverinfo">{{ $assessmentInfo && $assessmentInfo->assessment_date ? $assessmentInfo->assessment_date->format('F d, Y') : 'Not Specified' }}</td>
                    </tr>
                </table>
            </div>
            <div style="height: 120px; width: 10px;">

            </div>
        </div>
        <div class="summary">
            <h2 style="color: #0070C0">Report Summary of</h2>
            <h2 style="color: #000000; margin-top: 5px; margin-bottom: 20px; font-weight: bold;">{{ $assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Facility Name Not Provided' }}</h2>
            <div class="ratingTableDiv">
                <div class="ratingTable">
                    <table >
                        <tr>
                            <td style="background-color: green">Green/A</td>
                            <td>>90%</td>
                        </tr>
                        <tr>
                            <td style="background-color: yellow">Yellow/B</td>
                            <td>71% - 90%</td>
                        </tr>
                        <tr>
                            <td style="background-color: orange">Orange/C</td>
                            <td>41% - 70%</td>
                        </tr>
                        <tr>
                            <td style="background-color: red">Red/D</td>
                            <td><=40%</td>
                        </tr>
                    </table>
                </div>
            </div>
            <p style="font-weight: bold">Overall rating (Weighted Average):</p>
            <div>
                <table>
                    <tr>
                        <td style="background-color: green; text-align: center">Green (A)</td>
                        <td style="background-color: yellow; text-align: center">Yellow (B)</td>
                        <td style="background-color: orange; text-align: center">Orange (C)</td>
                        <td style="background-color: red; text-align: center">Red (D)</td>
                        <td style="text-align: center">{{ $scores['overall_percentage'] ?? 0 }}%</td>
                    </tr>
                    <tr style="border: 0px">
                        <td style="border: 0px">@if(($scores['overall_percentage'] ?? 0) >= 90)  <span style="font-size: 28px; font-weight: bold; color: black; position: relative; left: 50px; top: -3px; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">^</span> @endif</td>
                        <td style="border: 0px">@if(($scores['overall_percentage'] ?? 0) >= 71 && ($scores['overall_percentage'] ?? 0) < 90)  <span style="font-size: 28px; font-weight: bold; color: black; position: relative; left: 50px; top: -3px; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">^</span> @endif</td>
                        <td style="border: 0px">@if(($scores['overall_percentage'] ?? 0) >= 41 && ($scores['overall_percentage'] ?? 0) < 71)  <span style="font-size: 28px; font-weight: bold; color: black; position: relative; left: 50px; top: -3px; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">^</span> @endif</td>
                        <td style="border: 0px">@if(($scores['overall_percentage'] ?? 0) < 41) <span style="font-size: 28px; font-weight: bold; color: black; position: relative; left: 50px; top: -3px; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">^</span> @endif</td>
                        <td style="border: 0px"></td>
                    </tr>
                </table>
            </div>
            </br>
            <p style="font-weight: bold">Section Rating:</p>
            <div style="">
                <table>
                    <tbody>
                        <tr>
                            <th style="background-color: #c0c0c0" >Performance Area</th>
                            <th style="background-color: #c0c0c0" width='20%'>Rating</th>
                            <th style="background-color: #c0c0c0" width='20%'>Score</th>
                        </tr>
                        @if(isset($scores['category_percentages']) && count($scores['category_percentages']) > 0)
                            @foreach($scores['category_percentages'] as $category => $percentage)
                                <tr>
                                    <td>{{ $category }}</td>
                                    @if($percentage >= 90) 
                                        <td style="background-color: green"></td>
                                    @elseif($percentage >= 71) 
                                        <td style="background-color: yellow"></td>
                                    @elseif($percentage >= 41) 
                                        <td style="background-color: orange"></td>
                                    @else 
                                        <td style="background-color: red"></td>
                                    @endif
                                    <td style="text-align: center;">{{ $percentage }}</td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="3" style="text-align: center; color: #666;">No category data available</td>
                            </tr>
                        @endif
                    </tbody>       
                </table>
            </div>
            <div>
                <h3 style="color: #0070C0; margin-bottom: 15px;">Section Rating Chart</h3>
                @if(isset($scores['category_percentages']) && count($scores['category_percentages']) > 0)
                    <div style="border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9;">
                        @foreach($scores['category_percentages'] as $category => $percentage)
                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                    <span style="width: 200px; font-size: 12px; font-weight: bold;">{{ $category }}</span>
                                    <span style="font-size: 12px; color: #666; margin-left: 10px;">{{ number_format($percentage, 1) }}%</span>
                                </div>
                                <div style="width: 100%; background-color: #e0e0e0; height: 20px; border-radius: 10px; position: relative;">
                                    @php
                                        $barColor = '#9966ff'; // Default purple
                                        if($percentage >= 90) $barColor = '#4CAF50'; // Green
                                        elseif($percentage >= 71) $barColor = '#FFC107'; // Yellow  
                                        elseif($percentage >= 41) $barColor = '#FF9800'; // Orange
                                        else $barColor = '#F44336'; // Red
                                    @endphp
                                    <div style="width: {{ $percentage }}%; background-color: {{ $barColor }}; height: 100%; border-radius: 10px; position: relative;">
                                        @if($percentage > 15)
                                            <span style="position: absolute; right: 5px; top: 2px; color: white; font-size: 10px; font-weight: bold;">{{ number_format($percentage, 1) }}%</span>
                                        @endif
                                    </div>
                                    @if($percentage <= 15)
                                        <span style="position: absolute; left: {{ $percentage + 2 }}%; top: 2px; color: #333; font-size: 10px; font-weight: bold;">{{ number_format($percentage, 1) }}%</span>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div style="border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9; text-align: center; color: #666;">
                        No category data available for chart
                    </div>
                @endif
            </div>
            <br>
            <div class="facility">
                <table>
                    <tr style="background-color: red;">
                        <th colspan="2" style="color: white; font-weight: bold">Facility Information</th>
                    </tr>
                    <tr>
                        <td>Facility Name</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->facility_name ? $assessmentInfo->facility_name : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Facility Address</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->facility_address ? $assessmentInfo->facility_address : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Business License</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->business_license ? $assessmentInfo->business_license : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->country ? $assessmentInfo->country : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Year of establishment</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->year_establishment ? $assessmentInfo->year_establishment : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Building description</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->building_description ? $assessmentInfo->building_description : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Multiple Tenants</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->multiple_tenants ? $assessmentInfo->multiple_tenants : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Site owned or rented</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->site_owned ? $assessmentInfo->site_owned : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Monthly Production Capacity</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->monthly_production ? $assessmentInfo->monthly_production : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Primary Contact Name</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->primary_contact_name ? $assessmentInfo->primary_contact_name : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Position</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->position ? $assessmentInfo->position : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->email ? $assessmentInfo->email : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Contact Number</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->contact_number ? $assessmentInfo->contact_number : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Social Compliance Contact</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->social_compliance_contact ? $assessmentInfo->social_compliance_contact : 'Not Provided' }}</td>
                    </tr>
                </table>
            </div>
            <br>
            <div class="employee" >
                <table>
                    <tr style="background-color: red;">
                        <th colspan="2" style="color: white; font-weight: bold">Employee Information</th>
                    </tr>
                    <tr>
                        <td>Number of employees </td>
                        <td>{{ $assessmentInfo && $assessmentInfo->number_of_employees ? $assessmentInfo->number_of_employees : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Number of workers</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->number_of_workers ? $assessmentInfo->number_of_workers : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Male employees</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->male_employees ? $assessmentInfo->male_employees : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Female Employees</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->female_employees ? $assessmentInfo->female_employees : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Local workers</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->local_workers ? $assessmentInfo->local_workers : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Foreign Migrant Workers</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->foreign_workers ? $assessmentInfo->foreign_workers : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Worker Turnover Rate</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->worker_turnover_rate ? $assessmentInfo->worker_turnover_rate : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Labor Agent Used</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->labor_agent_used ? $assessmentInfo->labor_agent_used : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Management Spoken Language</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->management_language ? $assessmentInfo->management_language : 'Not Provided' }}</td>
                    </tr>
                    <tr>
                        <td>Workers Spoken Language</td>
                        <td>{{ $assessmentInfo && $assessmentInfo->workers_language ? $assessmentInfo->workers_language : 'Not Provided' }}</td>
                    </tr>
                </table>
            </div>
            <br>
            <div>
                <table>
                    <tr style="background-color: #FFD966">
                        <th>
                            General Assessment Overview
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ $assessmentInfo && $assessmentInfo->general_assessment_overview ? $assessmentInfo->general_assessment_overview : 'No general assessment overview provided.' }}
                        </td>
                    </tr>
                </table>
            </div>
            <br>
            <div>
                <table>
                    <tr style="background-color: #FFD966">
                        <th>
                            Facility Good Practices
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ $assessmentInfo && $assessmentInfo->facility_good_practices ? $assessmentInfo->facility_good_practices : 'No facility good practices information provided.' }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="findings">
                <h2 style="color: #0070C0">Audit Findings</h2>
                
                @if(isset($audit_findings) && count($audit_findings) > 0)
                    @foreach($audit_findings as $category => $categoryData)
                        <table>
                            <tr style="border: 1px solid black;">
                                <th style="background-color: #c0c0c0; text-align: left;">
                                    {{ $category }}
                                </th>
                                <th width='20%'>
                                    <table style="border: 1px solid black;">
                                        <tr>
                                            No. of Findings
                                        </tr>
                                        <tr>
                                            <td style="background-color: green; text-align: center">{{ $categoryData['color_counts']['green'] ?? 0 }}</td>
                                            <td style="background-color: yellow; text-align: center">{{ $categoryData['color_counts']['yellow'] ?? 0 }}</td>
                                            <td style="background-color: orange; text-align: center">{{ $categoryData['color_counts']['orange'] ?? 0 }}</td>
                                            <td style="background-color: red; text-align: center">{{ $categoryData['color_counts']['red'] ?? 0 }}</td>
                                        </tr>
                                    </table>
                                </th>
                                <th width='10%' style="padding: 0px; margin: 0px">
                                    <table style="padding: 0px; margin: 0px">
                                        <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                        <tr><th><p style="font-size: 10px; margin: 2px;">{{ number_format($categoryData['percentage'], 1) }}</p></th></tr>
                                    </table>
                                </th>
                            </tr>
                            @if(count($categoryData['findings']) == 0)
                                <tr>
                                    <td colspan='3'>No findings noted under this section on the assessment day.</td>
                                </tr>
                            @endif
                        </table>
                        <br>
                        
                        @if(count($categoryData['findings']) > 0)
                            @foreach($categoryData['findings'] as $index => $finding)
                                @php
                                    $color = isset($finding['color']) ? strtolower(trim($finding['color'])) : 'unknown';
                                    $colorName = ucfirst($color);
                                    $riskRating = isset($finding['risk_rating']) ? $finding['risk_rating'] : 'Not Specified';
                                    
                                    // Generate finding ID
                                    $categoryPrefix = strtoupper(substr($category, 0, 2));
                                    $findingId = $categoryPrefix . '-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                                @endphp
                                
                                <table>
                                    <tr style="border: 0px solid black;">
                                        <td width="20%">{{ $findingId }}</td>
                                        <td style="background-color: {{ $color }}; color: {{ $color == 'yellow' ? 'black' : 'white' }}" width="20%">{{ $riskRating }}</td>
                                        <td style="border: 0px solid black"></td>
                                    </tr>
                                    <tr>
                                        <td>Findings</td>
                                        <td colspan="2">{{ $finding['findings'] ?? 'No findings description provided.' }}</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">Legal Reference</td>
                                        <td colspan="2">{{ $finding['legal_ref'] ?? 'No legal reference provided.' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Recommendation</td>
                                        <td colspan="2">{{ $finding['recommendation'] ?? 'No recommendation provided.' }}</td>
                                    </tr>
                                </table>
                                <br>
                            @endforeach
                        @endif
                    @endforeach
                @else
                    <table>
                        <tr style="border: 1px solid black;">
                            <th style="background-color: #c0c0c0; text-align: left;">
                                Assessment Results
                            </th>
                            <th width='20%'>
                                <table style="border: 1px solid black;">
                                    <tr>
                                        No. of Findings
                                    </tr>
                                    <tr>
                                        <td style="background-color: green; text-align: center">0</td>
                                        <td style="background-color: yellow; text-align: center">0</td>
                                        <td style="background-color: orange; text-align: center">0</td>
                                        <td style="background-color: red; text-align: center">0</td>
                                    </tr>
                                </table>
                            </th>
                            <th width='10%' style="padding: 0px; margin: 0px">
                                <table style="padding: 0px; margin: 0px">
                                    <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                    <tr><th><p style="font-size: 10px; margin: 2px;">{{ $scores['overall_percentage'] ?? 0 }}</p></th></tr>
                                </table>
                            </th>
                        </tr>
                        <tr>
                            <td colspan='3'>No audit findings available. All assessment questions were answered as "Yes" or no findings were recorded.</td>
                        </tr>
                    </table>
                    <br>
                @endif

            </div>
        </div>
        <div class="disclaimer">
            <table>
                <tr>
                    <th style="text-align: left; background-color: #c0c0c0">Disclaimer:</th>
                </tr>
                <tr>
                    <td style="text-align: justify; padding: 3px;">
                        {{ $assessmentInfo && $assessmentInfo->disclaimer ? $assessmentInfo->disclaimer : 'This Assessment Report has been prepared by ECOTEC Global Limited for the sole purpose of providing an overview of the current social compliance status at the facility. The audit was conducted in accordance with local law and different international standards and guidelines along with specific COC. However, it is important to note that the findings and recommendations presented in this report are subject to the following disclaimers and limitations that the intended user is the ultimate owner of the report. ECOTEC is not representing any buyers by this assessment. It is intended to assist the facility to comply the requirement of law and buyers COC and enhance the understanding the standards and requirements. The report shall be read as a whole, and sections should not be read or relied upon out of context. All recommendations, where given, are for the purpose of providing directional advice only. Recommendations are not exhaustive and relate solely to identifying key and obvious improvements related to findings in this report, and do not represent a comprehensive solution to any issue. This report is based only on the date herein and ECOTEC has no responsibility to update this report. ECOTEC takes no responsibility for any loss that any party may suffer in connection with any actions, or lack of action, taken to address the findings in the report.' }}
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        Page <span class="pagenum"></span>
    </div>
</body>
</html>
