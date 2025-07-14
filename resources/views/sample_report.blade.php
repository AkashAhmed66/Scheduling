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
            margin-bottom: 20px;
            margin-top: 70px;
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
            height: 80px;
            width: 120px;
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
        .header,
        .footer {
            width: 100%;
            position: fixed;
        }
        .header {
            top: 0px;
        }
        .footer {
            bottom: 0px;
            text-align: right;
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
            <img class="logo" src="../public/img/ecotech_logo.png" alt="logo">
                <div class="infoh">
                    <p>www.ecotecglobal.net</p>
                    <p>info@ecotecglobal.net</p>
                </div>
        </div>
    </div>
    
    <div class="content">
        <div class="coverpage">
            <br>
            <br>
            <br>
            <img class="factoryimg" src="https://esg.ecotecglobal.net/storage/app/public/headings/{{$info->imageFile}}" alt="factory">
            <br>
            <br>
            <h1 style="text-align: center; position: relative; top: 40px; height: 40px;">{{$info->reportTitile}}</h1>
            <br>
            <br>
            <div style="background-color: rgb(239, 238, 238); position: relative; top: 35px; padding: 20px; height: 250px;"> 
                <h2>{{$info->facilityName}}</h2>
                <table class="coverinfo">
                    <tr class="coverinfo">
                        <td class="coverinfo" width="30%">Audit Company:</td>
                        <td class="coverinfo"> {{$info->serviceProvider}}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Report No:</td>
                        <td class="coverinfo"> {{$info->reportNo}}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Type:</td>
                        <td class="coverinfo"> {{$info->assesmentType}}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Schedule Type:</td>
                        <td class="coverinfo"> {{$info->scheduleType}}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessors:</td>
                        <td class="coverinfo">{{$info->assessors}}</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Date:</td>
                        <td class="coverinfo"> {{$info->assesmentDate}}</td>
                    </tr>
                </table>
            </div>
            <div style="height: 120px; width: 10px;">

            </div>
        </div>
        <div class="summary">
            <h2 style="color: #0070C0">Report Summary</h2>
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
                            @php
                                $f = "<=40%";
                            @endphp
                            <td> {{$f}} </td>
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
                        <td style="text-align: center">{{$score}}</td>
                    </tr>
                    <tr style="border: 0px">
                        <td style="border: 0px">@if($score >= 90)  <img style="height: 25px; width: 30px; position:relative; top:1px; left: 50px" class="logo" src="../public/img/up.png" alt="logo"> @endif</td>
                        <td style="border: 0px">@if($score >= 70 && $score < 90)  <img style="height: 25px; width: 30px; position:relative; top:1px; left: 50px" class="logo" src="../public/img/up.png" alt="logo"> @endif</td>
                        <td style="border: 0px">@if($score >= 40 && $score < 70)  <img style="height: 25px; width: 30px; position:relative; top:1px; left: 50px" class="logo" src="../public/img/up.png" alt="logo"> @endif</td>
                        <td style="border: 0px">@if($score < 40) <img style="height: 25px; width: 30px; position:relative; top:1px; left: 50px" class="logo" src="../public/img/up.png" alt="logo"> @endif</td>
                        <td style="border: 0px"></td>
                    </tr>
                </table>
            </div>
            </br>
            <p style="font-weight: bold">Section Rating:</p>
            @php $value = '' @endphp
            @php $titles = '' @endphp
            <div style="height: 310px;">
                <table>
                    <tbody>
                        <tr>
                            <th style="background-color: #c0c0c0" >Performance Area</th>
                            <th style="background-color: #c0c0c0" width='20%'>Rating</th>
                            <th style="background-color: #c0c0c0" width='20%'>Score</th>
                        </tr>
            
                        @php $totalAchivementScore = 0; @endphp
                        @php $parcentageScore = array() @endphp
                        @forelse ($AchievableScores as $AchievableScore)
                            @php
                                $totalAchivementScore = $totalAchivementScore + $AchievableScore->totalAchivement;
                            @endphp
                            @if(array_key_exists($AchievableScore->category, $achivedArray))
                                @php
                                    $parcentageScore[$AchievableScore->category] = number_format($achivedArray[$AchievableScore->category] / $AchievableScore->totalAchivement * 100, 2);
                                @endphp
                            @else  
                                @php
                                    $parcentageScore[$AchievableScore->category] = number_format($AchievableScore->totalAchivement / $AchievableScore->totalAchivement * 100, 2);
                                @endphp
                            @endif
                            <tr>
                                @php
                                    $ans = $AchievableScore->category;
                                    if($AchievableScore->category == '8. Freedom of Association & Grievance') $ans = '8. FoA And Grievance';
                                    $ans = preg_replace('/^\d+\./', '', $ans);
                                @endphp
                                <td>{{ $ans }}</td>
                                
                                @if($parcentageScore[$AchievableScore->category] > 90) <td style="background-color: green"></td>
                                @elseif($parcentageScore[$AchievableScore->category] > 70) <td style="background-color: yellow"></td>
                                @elseif($parcentageScore[$AchievableScore->category] > 40) <td style="background-color: orange"></td>
                                @else <td style="background-color: red"></td>
                                @endif

                                <td style="text-align: center;">
                                    @php $value = $value.$parcentageScore[$AchievableScore->category]."," @endphp
                                    @php $titles = $titles."'".preg_replace('/^\d+\./', '', $AchievableScore->category)."'"."," @endphp
                                    {{$parcentageScore[$AchievableScore->category]}}
                                </td>
                            </tr>
                        @empty
                            <p>NO DATA</p>
                        @endforelse
                    </tbody>       
                </table>
            </div>
            @php
                $titles = str_replace('&', "And", $titles);
                $titles = str_replace("(If applicable)", '', $titles);
                $titles = str_replace("Freedom of Association", 'FoA', $titles);
                $value = $value."0, 100";
            @endphp
            <div>
                <img style="height: 320px; width: 100%" src="https://quickchart.io/chart?c={
                    'type': 'horizontalBar',
                    'data': {
                      'labels': [
                        {{$titles}}
                      ],
                      'datasets': [
                        {
                          'label': 'Section Rating(%)',
                          'backgroundColor': 'rgba(153, 102, 255, 1)',
                          'data': [
                            {{$value}}
                          ]
                        }
                      ]
                    },
                  }" alt="">

            </div>
            <div class="facility">
                <table>
                    <tr style="background-color: red;">
                        <th colspan="2" style="color: white; font-weight: bold">Facility Information</th>
                    </tr>
                    <tr>
                        <td>Facility Name</td>
                        <td>{{$info->facilityName}}</td>
                    </tr>
                    <tr>
                        <td>Facility Address</td>
                        <td>{{$info->facilityAddress}}</td>
                    </tr>
                    <tr>
                        <td>Business License #</td>
                        <td>{{$info->businessLicence}}</td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>{{$info->country}}</td>
                    </tr>
                    <tr>
                        <td>Year of establishment</td>
                        <td>{{$info->yearPublish}}</td>
                    </tr>
                    <tr>
                        <td>Building description</td>
                        <td>{{$info->buildingDisc}}</td>
                    </tr>
                    <tr>
                        <td>Multiple Tenants?</td>
                        <td>{{$info->multipleTenants}}</td>
                    </tr>
                    <tr>
                        <td>Site owned or rented?</td>
                        <td>{{$info->siteOwned}}</td>
                    </tr>
                    <tr>
                        <td>Monthly Production Capacity</td>
                        <td>{{$info->monthlyProd}}</td>
                    </tr>
                    <tr>
                        <td>Primary Contact Name</td>
                        <td>{{$info->primaryContact}}</td>
                    </tr>
                    <tr>
                        <td>Position</td>
                        <td>{{$info->position}}</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>{{$info->email}}</td>
                    </tr>
                    <tr>
                        <td>Contact Number</td>
                        <td>{{$info->contactNum}}</td>
                    </tr>
                    <tr>
                        <td>Social Compliance Contact</td>
                        <td>{{$info->socialComp}}</td>
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
                        <td>{{$info->numberEmp}}</td>
                    </tr>
                    <tr>
                        <td>Number of workers</td>
                        <td>{{$info->numberWorker}}</td>
                    </tr>
                    <tr>
                        <td>Male employees</td>
                        <td>{{$info->maleEmp}}</td>
                    </tr>
                    <tr>
                        <td>Female Employees</td>
                        <td>{{$info->femaleEmp}}</td>
                    </tr>
                    <tr>
                        <td>Local workers</td>
                        <td>{{$info->localWorker}}</td>
                    </tr>
                    <tr>
                        <td>Foreign Migrant Workers</td>
                        <td>{{$info->foreignWorker}}</td>
                    </tr>
                    <tr>
                        <td>Worker Turnover Rate</td>
                        <td>{{$info->workerTurnover}}</td>
                    </tr>
                    <tr>
                        <td>Labor Agent Used</td>
                        <td>{{$info->laborAgent}}</td>
                    </tr>
                    <tr>
                        <td>Management Spoken Language</td>
                        <td>{{$info->managementLang}}</td>
                    </tr>
                    <tr>
                        <td>Workers Spoken Language</td>
                        <td>{{$info->workerLang}}</td>
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
                            {{$info->generalAssesment}}
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
                            {{$info->goodPractice}}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="findings">
                <h2 style="color: #0070C0">Audit Findings</h2>
                    @php $prevCategory = ''; @endphp
                    @forelse($auditAnswerData as $socialAudit)

                        @if($findFindings[$socialAudit->category] > 0)

                            @if($prevCategory != $socialAudit->category)
                                <table>
                                    <tr style="border: 1px solid black;">
                                        <th style="background-color: #c0c0c0; text-align: left;">
                                        {{$socialAudit->category}}
                                            </th>
                                        <th width='20%'>
                                            <table style="border: 1px solid black;">
                                                <tr>
                                                    No. of Findings
                                                </tr>
                                                <tr>
                                                    <td style="background-color: green; text-align: center">
                                                        @if(array_key_exists($socialAudit->category, $greenArray)) {{$greenArray[$socialAudit->category]}}
                                                        @else 0
                                                        @endif
                                                    </td>
                                                    <td style="background-color: yellow; text-align: center">
                                                        @if(array_key_exists($socialAudit->category, $yellowArray)) {{$yellowArray[$socialAudit->category]}}
                                                        @else 0
                                                        @endif
                                                    </td>
                                                    <td style="background-color: orange; text-align: center">
                                                        @if(array_key_exists($socialAudit->category, $orangeArray)) {{$orangeArray[$socialAudit->category]}}
                                                        @else 0
                                                        @endif
                                                    </td>
                                                    <td style="background-color: red; text-align: center">
                                                        @if(array_key_exists($socialAudit->category, $redArray)) {{$redArray[$socialAudit->category]}}
                                                        @else 0
                                                        @endif
                                                    </td>
                                                </tr>
                                            </table>
                                        </th>
                                        <th width='10%' style="padding: 0px; margin: 0px">
                                            <table style="padding: 0px; margin: 0px">
                                                <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                                <tr><th><p style="font-size: 10px; margin: 2px;">
                                                    {{$parcentageScore[$socialAudit->category]}}
                                                </p></th></tr>
                                            </table>
                                        </th>
                                    </tr>
                                </table>
                                <br>
                            
                            @endif
                            @if($socialAudit->answer == 'NO')
                                <table>
                                    <tr style="border: 0px solid black;">
                                        <td width="20%">{{$socialAudit->nc_ref}}</td>
                                        @if($socialAudit->rating == 'Minor') <td style="background-color: green" width="20%">{{$socialAudit->rating}}</td>
                                        @elseif($socialAudit->rating == 'Major') <td style="background-color: yellow" width="20%">{{$socialAudit->rating}}</td>
                                        @elseif($socialAudit->rating == 'Critical') <td style="background-color: orange" width="20%">{{$socialAudit->rating}}</td>
                                        @elseif($socialAudit->rating == 'Zero Tolerance (ZT)') <td style="background-color: red" width="20%">{{$socialAudit->rating}}</td>
                                        @endif
                                        <td style="border: 0px solid black"></td>
                                    </tr>
                                    <tr>
                                        <td>Findings</td>
                                        <td colspan="2">{!! $socialAudit->findings !!}</td>
                                    </tr>
                                    <tr>
                                        @if($type == "social" || 
                                            $type == "env" ||
                                            $type == "safety" ||
                                            $type == "coc"   
                                        )
                                            <td scope="col">Legal Reference</td>
                                        @else
                                            <td scope="col">Instructions</td>
                                        @endif
                                        <td colspan="2">{{$socialAudit->corrective_action_plan}}</td>
                                    </tr>
                                    <tr>
                                        <td>Recommendation</td>
                                        <td colspan="2">{{$socialAudit->target_completion_date}}</td>
                                    </tr>
                                </table>
                                </br>
                            @endif
                            
                        @elseif($findFindings[$socialAudit->category] == 0)
                            <table>
                                <tr style="border: 1px solid black;">
                                    <th style="background-color: #c0c0c0; text-align: left;">
                                        {{$socialAudit->category}}
                                    </th>
                                    <th width='20%'>
                                        <table style="border: 1px solid black;">
                                            <tr>
                                                No. of Findings
                                            </tr>
                                            <tr>
                                                <td style="background-color: green; text-align: center">
                                                    0
                                                </td>
                                                <td style="background-color: yellow; text-align: center">
                                                    0
                                                </td>
                                                <td style="background-color: orange; text-align: center">
                                                   0
                                                </td>
                                                <td style="background-color: red; text-align: center">
                                                    0
                                                </td>
                                            </tr>
                                        </table>
                                    </th>
                                    <th width='10%' style="padding: 0px; margin: 0px">
                                        <table style="padding: 0px; margin: 0px">
                                            <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                            <tr><th><p style="font-size: 10px; margin: 2px;">
                                                100.00
                                            </p></th></tr>
                                        </table>
                                    </th>
                                </tr>
                                <tr>
                                    <td colspan='3'>No findings noted under this section on the assessment day.</td>
                                </tr>
                            </table>
                            <br>
                            @php $findFindings[$socialAudit->category] = -1 @endphp
                        @else
                        @endif
                        @php $prevCategory = $socialAudit->category; @endphp
                        @empty
                    @endforelse

            </div>
        </div>
        <div class="disclaimer">
            <table>
                <tr>
                    <th style="text-align: left; background-color: #c0c0c0">Disclaimer:</th>
                </tr>
                <tr>
                    <td style="text-align: justify; padding: 3px;">
                        {{$info->disclaimer}}
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
