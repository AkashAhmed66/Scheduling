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

        .bottom-section {
            position: absolute;
            bottom: 80px;
            left: 30px;
            right: 30px;
            width: calc(100% - 60px);
        }

        .nbm-logo-section {
            text-align: center;
            margin-bottom: 10px;
        }

        .logo {
            height: 85px;
            width: auto;
            margin-bottom: 6px;
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
            font-size: 38px;
            font-weight: bold;
            color: #4472C4;
            margin-bottom: 8px;
            text-align: center;
        }

        .certificate-title {
            color: black;
            font-size: 30px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
        }


        .certify-text {
            font-size: 13px;
            color: black;
            margin-bottom: 6px;
            text-align: center;
        }

        .company-name {
            font-size: 19px;
            font-weight: bold;
            color: black;
            margin-bottom: 8px;
            text-align: center;
        }

        .company-address {
            font-size: 10px;
            color: black;
            margin-bottom: 10px;
            text-align: center;
        }

        .assessment-text {
            font-size: 10px;
            color: black;
            margin-bottom: 8px;
            text-align: center;
            line-height: 1.3;
        }

        .compliance-title {
            font-size: 20px;
            font-weight: bold;
            color: black;
            margin-bottom: 6px;
            text-align: center;
        }

        .rating {
            font-size: 14px;
            color: black;
            margin-bottom: 12px;
            text-align: center;
        }

        .details-section {
            overflow: hidden;
            clear: both;
            min-height: 90px;
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
            padding: 9px;
            margin-bottom: 6px;
            min-height: 45px;
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
            padding: 9px;
            min-height: 150px;
            margin-bottom: 10px;
            background: white;
        }

        .performance-label {
            font-size: 15px;
            color: black;
            margin-bottom: 7px;
        }

        .color-summary-item {
            display: inline-flex;
            align-items: center;
            margin: 2px 4px 2px 0;
            font-size: 9px;
            line-height: 1;
            vertical-align: middle;
        }

        .color-indicator {
            width: 12px;
            height: 12px;
            display: inline-block;
            margin-right: 3px;
            border: 1px solid #999;
            flex-shrink: 0;
            vertical-align: middle;
        }

        .bar-chart {
            display: flex;
            align-items: end;
            height: 45px;
            margin: 10px 0 5px 0;
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
            font-size: 9px;
            font-weight: bold;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        }

        .chart-legend {
            font-size: 9px;
            display: flex;
            justify-content: space-around;
            margin-top: 3px;
        }

        .legend-item {
            display: flex;
            align-items: center;
        }

        .legend-color {
            width: 8px;
            height: 8px;
            display: inline-block;
            margin-right: 2px;
            border: 1px solid #999;
        }

        .signature-section {
            margin-top: 10px;
            text-align: left;
            clear: both;
        }

        .signature-label {
            font-size: 10px;
            color: black;
            margin-bottom: 18px;
        }

        .signature {
            font-family: cursive;
            font-size: 18px;
            color: black;
            margin-bottom: 4px;
        }

        .managing-director {
            font-size: 10px;
            color: black;
        }

        .footer-section {
            margin-top: 10px;
            padding-top: 10px;
            clear: both;
            min-height: 60px;
            position: relative;
            width: 100%;
        }

        .footer-content {
            float: left;
            width: calc(100% - 80px);
            text-align: left;
        }

        .footer-text {
            font-size: 10px;
            color: black;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }

        .footer-qr {
            float: right;
            width: 80px;
            height: 80px;
            position: absolute;
            right: 100;
            bottom: 80;
        }

        .footer-qr img {
            width: 100%;
            height: 100%;
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
                                $certificateNo ?? 'Not Specified'
                            }}
                        </div>
                        <div class="detail-label">Assessment Date: {{ $assessmentDate ?? 'Not Specified' }}</div>
                        <div class="detail-label">Overall Score: {{ round($chartData['overallPercentage'] ?? 0, 1) }}%</div>
                    </div>
                </div>
                <div class="details-right">
                    <div class="detail-box">
                        <div class="detail-label" style="margin-bottom: 8px;"><strong>Overall Rating Legend</strong></div>
                        @if(!empty($overallRatings))
                            @foreach($overallRatings as $rating)
                                <div class="color-summary-item">
                                    <span class="color-indicator" style="background-color: {{ $rating['color'] }};"></span>
                                    <span style="display: inline-flex; align-items: center;">{{ $rating['label'] }} (&gt;={{ $rating['percentage'] }}%)</span>
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
                    <div style="margin-top: 5px;">                        
                        <!-- Section Rating Bars (like PDF) -->
                        @if(isset($scores['category_percentages']) && count($scores['category_percentages']) > 0)
                            <div style="font-size: 9px; margin: 8px 0 3px 0;">Section Performance:</div>
                            @foreach($scores['category_percentages'] as $category => $percentage)
                                <div style="margin-bottom: 3px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 1px;">
                                        <span style="font-weight: bold;">{{ $category }}</span>
                                        <span>{{ number_format($percentage, 1) }}%</span>
                                    </div>
                                    <div style="width: 100%; background-color: #e0e0e0; height: 9px; border-radius: 4px; overflow: hidden;">
                                        @php
                                            $barColor = '#F44336'; // Default red
                                            foreach($overall_ratings as $rating) {
                                                if($percentage <= floatval($rating->percentage)) {
                                                    $barColor = $rating->color;
                                                } else {
                                                    break;
                                                }
                                            }
                                        @endphp
                                        <div style="width: {{ min($percentage, 100) }}%; height: 100%; background-color: {{ $barColor }};"></div>
                                    </div>
                                </div>
                            @endforeach
                        @endif
                    </div>
                @endif
            </div>

            <!-- Bottom Section (Signature + Footer) -->
            <div class="bottom-section">
                <!-- Signature Section -->
                <div class="signature-section">
                    <div class="signature-label">Certificate Approved By</div>
                    <div class="signature">
                        <img src="../public/images/sign.png" alt="Signature" style="height: 40px; width: auto;">
                    </div>
                    <div class="managing-director">Managing Director</div>
                </div>

                <!-- Footer Section -->
                <div class="footer-section">
                    <div class="footer-content">
                        <p class="footer-text" style="margin-bottom: 5px; font-weight: bold;">This certificate is the property of NBM International Ltd.</p>
                        <p class="footer-text">Please validate the authenticity and status of this certificate at <strong>https://www.nbm-intl.com/certificate-check</strong></p>
                    </div>
                </div>
            </div>
            <div class="footer-qr">
                <img src="../public/images/qrcode.jpeg" alt="QR Code">
            </div>
        </div>
    </div>
</body>
</html>
