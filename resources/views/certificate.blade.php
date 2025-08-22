<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Assessment Certificate</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }
        
        body {
            font-family: "Arial Black", Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            width: 210mm;
            height: 297mm;
            position: relative;
        }

        .certificate-container {
            width: 100%;
            height: 100%;
            position: relative;
            background: white;
        }

        .left-sidebar {
            width: 94px;
            height: 100%;
            background: #4472C4;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
        }

        .sidebar-text {
            color: white;
            font-size: 70px;
            font-weight: bold;
            letter-spacing: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-90deg);
            white-space: nowrap;
        }

        .main-content {
            margin-left: 94px;
            padding: 30px 30px 30px 30px;
            background: #F8F8F8;
            height: 100%;
            width: calc(210mm - 150px);
            position: absolute;
            box-sizing: border-box;
        }

        .nbm-logo-section {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            height: 100px;
            width: auto;
            margin-bottom: 10px;
        }

        .yellow-bar {
            background: #FFA500;
            height: 8px;
            width: 60px;
            margin: 0 auto 5px;
        }

        .nbm-logo {
            color: #FFA500;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .nbm-title {
            color: #4472C4;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
        }

        .nbm-company-name{
            font-size: 40px;
            font-weight: bold;
            color: #4472C4;
            margin-bottom: 12px;
            text-align: center;
        }

        .certificate-title {
            color: black;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }


        .certify-text {
            font-size: 14px;
            color: black;
            margin-bottom: 10px;
            text-align: center;
        }

        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: black;
            margin-bottom: 12px;
            text-align: center;
        }

        .company-address {
            font-size: 11px;
            color: black;
            margin-bottom: 20px;
            text-align: center;
        }

        .assessment-text {
            font-size: 11px;
            color: black;
            margin-bottom: 15px;
            text-align: center;
            line-height: 1.4;
        }

        .compliance-title {
            font-size: 22px;
            font-weight: bold;
            color: black;
            margin-bottom: 8px;
            text-align: center;
        }

        .rating {
            font-size: 15px;
            color: black;
            margin-bottom: 20px;
            text-align: center;
        }

        .details-section {
            overflow: hidden;
            clear: both;
            min-height: 120px;
        }

        .details-left {
            width: 48%;
            float: left;
            margin-right: 2%;
        }

        .details-right {
            width: 48%;
            float: right;
            margin-left: 2%;
        }

        .detail-box {
            border: 1px solid black;
            padding: 10px;
            margin-bottom: 10px;
            min-height: 50px;
            box-sizing: border-box;
            background: white;
        }

        .detail-label {
            font-size: 10px;
            color: black;
            line-height: 1.4;
        }

        .performance-area {
            border: 1px solid black;
            padding: 10px;
            height: 120px;
            margin-bottom: 15px;
            background: white;
        }

        .performance-label {
            font-size: 10px;
            color: black;
            margin-bottom: 5px;
        }

        .color-summary-item {
            display: inline-block;
            margin: 1px 2px;
            font-size: 7px;
            vertical-align: middle;
        }

        .color-indicator {
            width: 10px;
            height: 10px;
            display: inline-block;
            margin-right: 2px;
            border: 1px solid #999;
            vertical-align: middle;
        }

        .bar-chart {
            display: flex;
            align-items: end;
            height: 35px;
            margin: 8px 0 3px 0;
            border: 1px solid #ddd;
            background: white;
            overflow: hidden;
        }

        .bar-segment {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 7px;
            font-weight: bold;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        }

        .chart-legend {
            font-size: 7px;
            display: flex;
            justify-content: space-around;
            margin-top: 3px;
        }

        .legend-item {
            display: flex;
            align-items: center;
        }

        .legend-color {
            width: 6px;
            height: 6px;
            display: inline-block;
            margin-right: 2px;
            border: 1px solid #999;
        }

        .signature-section {
            margin-top: 15px;
            text-align: left;
            clear: both;
        }

        .signature-label {
            font-size: 10px;
            color: black;
            margin-bottom: 25px;
        }

        .signature {
            font-family: cursive;
            font-size: 18px;
            color: black;
            margin-bottom: 5px;
        }

        .managing-director {
            font-size: 10px;
            color: black;
        }

        .footer-section {
            margin-top: 20px;
            padding-top: 15px;
            clear: both;
            overflow: hidden;
            min-height: 60px;
        }

        .footer-text {
            font-size: 8px;
            color: black;
            text-align: left;
            line-height: 1.3;
            width: calc(100% - 70px);
            float: left;
            padding-right: 10px;
        }

        .qr-code {
            width: 50px;
            height: 50px;
            border: 1px solid black;
            text-align: center;
            line-height: 25px;
            font-size: 8px;
            float: right;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <!-- Left Blue Sidebar -->
        <div class="left-sidebar">
            <div class="sidebar-text">CERTIFICATE</div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- NBM Logo and Title -->
            <div class="nbm-logo-section">
                <img class="logo" src="../public/images/logo.png" alt="logo">
            </div>

            <!-- Company Name -->
            <div class="nbm-company-name">NBM International LTD.</div>

            <!-- Certificate Title -->
            <div class="certificate-title">
                {{ strpos(strtoupper($reportHeading ?? 'CERTIFICATE'), 'CERTIFICATE') !== false ? 
                   strtoupper($reportHeading ?? 'CERTIFICATE') : 'CERTIFICATE' }}
            </div>
            
            <!-- Certification Text -->
            <div class="certify-text">This is to certify that</div>

            <!-- Company Name -->
            <div class="company-name">{{ $facilityName ?? 'Not Provided' }}</div>

            <!-- Company Address -->
            <div class="company-address">
                {{ $facilityAddress ?? 'Address not provided' }}
            </div>

            <!-- Assessment Text -->
            <div class="assessment-text">
                has been assessed and found to conform to the requirement of local laws and international<br>
                standards for
            </div>

            <!-- Compliance Title -->
            <div class="compliance-title">{{ $reportHeading ?? 'not provided' }}</div>

            <!-- Rating -->
            <div class="rating">
                Rating: <strong style="color: {{ $chartData['overallRatingColor'] ?? '#000' }};">
                    {{ strtoupper($chartData['overallRatingLabel'] ?? 'Not Determined') }}
                </strong>
            </div>

            <!-- Details Section -->
            <div class="details-section">
                <div class="details-left">
                    <div class="detail-box">
                        <div class="detail-label">
                            Certificate No: {{ 
                                (is_array($assessmentInfo) ? ($assessmentInfo['report_no'] ?? 'Not Specified') : 
                                 (is_object($assessmentInfo) ? ($assessmentInfo->report_no ?? 'Not Specified') : 'Not Specified')) 
                            }}
                        </div>
                        <div class="detail-label">Assessment Date: {{ $assessmentDate ?? 'Not Specified' }}</div>
                        <div class="detail-label">Overall Score: {{ round($chartData['overallPercentage'] ?? 0, 1) }}%</div>
                    </div>
                </div>
                <div class="details-right">
                    <div class="detail-box">
                        <div class="detail-label" style="margin-bottom: 8px;"><strong>Color Summary</strong></div>
                        @if(!empty($overallRatings))
                            @foreach($overallRatings as $rating)
                                <div class="color-summary-item">
                                    <span class="color-indicator" style="background-color: {{ $rating['color'] }};"></span>
                                    <span>{{ $rating['label'] }} (≥{{ $rating['percentage'] }}%)</span>
                                </div>
                            @endforeach
                        @endif
                    </div>
                </div>
            </div>

            <!-- Performance Area with Bar Chart -->
            <div class="performance-area">
                <div class="performance-label"><strong>Performance Overview:</strong></div>
                @if(!empty($chartData))
                    <div style="margin-top: 10px;">
                        <!-- Bar Chart Visualization -->
                        <div class="bar-chart">
                            @php
                                $total = max($chartData['totalQuestions'] ?? 1, 1);
                                $complianceWidth = ($chartData['compliance'] ?? 0) / $total * 100;
                                $nonComplianceWidth = ($chartData['nonCompliance'] ?? 0) / $total * 100;
                                $notApplicableWidth = ($chartData['notApplicable'] ?? 0) / $total * 100;
                            @endphp
                            
                            @if($complianceWidth > 0)
                                <div class="bar-segment" style="background-color: #4CAF50; width: {{ $complianceWidth }}%;">
                                    {{ $chartData['compliance'] ?? 0 }}
                                </div>
                            @endif
                            
                            @if($nonComplianceWidth > 0)
                                <div class="bar-segment" style="background-color: #F44336; width: {{ $nonComplianceWidth }}%;">
                                    {{ $chartData['nonCompliance'] ?? 0 }}
                                </div>
                            @endif
                            
                            @if($notApplicableWidth > 0)
                                <div class="bar-segment" style="background-color: #9E9E9E; width: {{ $notApplicableWidth }}%;">
                                    {{ $chartData['notApplicable'] ?? 0 }}
                                </div>
                            @endif
                        </div>
                        
                        <!-- Legend -->
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #4CAF50;"></span>
                                <span>Compliance</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #F44336;"></span>
                                <span>Non-Compliance</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #9E9E9E;"></span>
                                <span>Not Applicable</span>
                            </div>
                        </div>
                    </div>
                @endif
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-label">Certificate Approved By</div>
                <div class="signature">
                    {{ 
                        (is_array($assessmentInfo) ? ($assessmentInfo['assessors'] ?? 'Authorized Signature') : 
                         (is_object($assessmentInfo) ? ($assessmentInfo->assessors ?? 'Authorized Signature') : 'Authorized Signature')) 
                    }}
                </div>
                <div class="managing-director">Managing Director</div>
            </div>

            <!-- Footer Section -->
            <div class="footer-section">
                This certificate is the property of NBM International Ltd.<br>
                <div class="footer-text">
                Please validate the authenticity and status of this certificate at <strong>https://www.nbm-intl.com/certificate-check</strong>
                </div>
                <div class="qr-code">
                    QR<br>CODE
                </div>
            </div>
        </div>
    </div>
</body>
</html>
