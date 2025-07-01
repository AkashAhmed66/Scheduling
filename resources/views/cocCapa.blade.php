<!DOCTYPE html>
<html lang="en">

<head>
    <title></title>
    <style>
        @page {
            margin: 50px 50px 25px 25px;
        }
        body{
            margin-bottom: 20px;
            margin-top: 70px;
        }
        footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            background-color: transparent;
            height: 20px;
        }

        p:last-child {
            page-break-after: never;
        }

        table {
            border-collapse: collapse;
            border: 1px;
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
        footer:after {
            content: "Page " counter(page);
            float: right;
        }
        header {
            position: fixed;
            top: 0px;
            left: 0px;
            right: 0px;
            background-color: transparent;
            height: 20px;
        }

    </style>
</head>

<body>
    <header>
        <h2>Audit Report: {{$info->capaTitile }}</h2>
    </header>
    <footer></footer>
    <main>
        <table class="table table-bordered;">
            <tr>
                <th style="text-align:left">Facility Name: {{$info->facilityName}} </th>
                <th style="text-align:left">Audit Ref #: {{$info->reportNo}}</th>
            </tr>  
            <tr>      
                <th style="text-align:left">Facility Address: {{$info->facilityAddress}}</th>
                <th style="text-align:left">Assessor Name: {{$info->assessors}}</th>
            </tr>  
            <tr>
                <th style="text-align:left">Audit Date: {{$info->assesmentDate}}</th>
                <th style="text-align:left">Audit Scheme & Type: {{$info->scheduleType}}</th>
            </tr>
        </table>
        </br>
    
        <!---NEW STYLW--->
        
        <!---HEAD WISE ACHIVE--->
    <style>
        thead:before, thead:after { display: none; }
        tbody:before, tbody:after { display: none; }
    </style>
    
    <table>
        <thead>
            <tr>
                <th style="background-color: darkorange;" width="5%">NC #</th>
                <th style="background-color: darkorange;" width="125">Findings</th>
                <th style="background-color: darkorange;" width="8%">Risk Rating</th>
                @if($type == "social" || 
                    $type == "env" ||
                    $type == "safety" ||
                    $type == "coc"   
                )
                    <th scope="col" style="background-color: darkorange;">Legal Reference</th>
                @else
                    <th scope="col" style="background-color: darkorange;">Instructions</th>
                @endif
                <th style="background-color: darkorange;" width="50">Recommendation</th>
            </tr>
        </thead>
        @if(count($auditAnswerData) > 0)
            <tbody>
                @php $prevCategory = ''; @endphp
                @forelse($auditAnswerData as $socialAudit)
                    @if($prevCategory != $socialAudit->category.$socialAudit->sub_category)
                    <tr>
                        <th colspan="5" style="background-color: #c0c0c0; text-align: left" scope="row">{{$socialAudit->category .
                            '('.$socialAudit->sub_category.')'}}</th>
                    </tr>
                    @else
                    @endif
    
                    <tr>
                        <td>{{$socialAudit->nc_ref}}</td>
                        <td>{!! $socialAudit->findings !!}</td>
                        <td>{{$socialAudit->rating}}</td>
                        <td>{{$socialAudit->corrective_action_plan}}</td>
                        <td>{{$socialAudit->target_completion_date}}</td>
                    </tr>
                @php $prevCategory = $socialAudit->category.$socialAudit->sub_category; @endphp
                @empty
    
                @endforelse
            </tbody>
        @else
            <tbody>
                <tr>
                    <td style="text-align:center">---</td>
                    <td style="text-align:center">---</td>
                    <td style="text-align:center">---</td>
                    <td style="text-align:center">---</td>
                    <td style="text-align:center">---</td>
                    <td style="text-align:center">---</td>
                </tr>
            </tbody>
        @endif

    </table>
</br>
</br>
 </br>
 <table class="table table-bordered;">
    <tr>
        <th style="text-align:center">Facility Management</th>
        <th style="text-align:center">Auditors</th>
    </tr>  
    <tr>      
        <th style="padding-bottom: 50px; text-align:left">Signature:</th>
        <th style="padding-bottom: 50px; text-align:left">Signature:</th>
    </tr>  
    <tr aria-rowspan="2">
        <th style="text-align:left">Name & position: {{$info->primaryContact}}({{$info->position}})</th>
        <th style="text-align:left">Name : {{$info->assessors}}</th>
    </tr>
    <tr>
        <th style="text-align:left">Date: {{$info->assesmentDate}}</th>
        <th style="text-align:left">Date: {{$info->assesmentDate}}</th>
    </tr>

</table>
    </main>
</body>

<!--CHART TEST-->
<!-- <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-3d.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script> -->



<script>
    // Highcharts.chart('container', {

    //     credits: {
    //         enabled: false
    //     },

    //     chart: {
    //         type: 'column',
    //         options3d: {
    //             enabled: true,
    //             alpha: 15,
    //             beta: 15,
    //             viewDistance: 25,
    //             depth: 40
    //         }
    //     },

    //     title: {
    //         text: 'Compliance scoring (Section wise)'
    //     },

    //     xAxis: {
    //         categories: ['A', 'B', 'C', 'D', 'E'],
    //         labels: {
    //             skew3d: true,
    //             style: {
    //                 fontSize: '16px'
    //             }
    //         }
    //     },

    //     yAxis: {
    //         allowDecimals: false,
    //         min: 0,
    //         title: {
    //             text: 'Number of score',
    //             skew3d: true
    //         }
    //     },

    //     tooltip: {
    //         headerFormat: '<b>{point.key}</b><br>',
    //         pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
    //     },

    //     plotOptions: {
    //         column: {
    //             stacking: 'normal',
    //             depth: 40
    //         }
    //     },

    //     series: [{
    //         name: 'Achievable Score',
    //         data: [7, 7, 7, 7, 7],
    //         stack: 'male'
    //     }, {
    //         name: 'Achieved Score',
    //         data: [2, 2, 2, 2, 2],
    //         stack: 'female'
    //     },]
    // });


    // var colors = ['#3B97B2', '#67BC42', '#FF56DE', '#E6D605', '#BC36FE', '#000'];

    // Highcharts.chart('achievable_container', {
    //     credits: {
    //         enabled: false
    //     },

    //     colors: ['green', 'yellow', 'orange', 'red'],

    //     chart: {
    //         type: 'column',
    //         options3d: {
    //             enabled: true,
    //             alpha: 15,
    //             beta: 15,
    //             viewDistance: 25,
    //             depth: 40
    //         }
    //     },

    //     title: {
    //         text: 'SEVERTY LEVEL (Color Coded Rating)'
    //     },

    //     xAxis: {
    //         categories: ['Green- Approaching Compliance', 'Yellow - Substantial Improvement Required', 'Orange - Immediate Remediation Required', 'Red - Zero Tolerance'],
    //         labels: {
    //             skew3d: true,
    //             style: {
    //                 fontSize: '16px'
    //             }
    //         }
    //     },

    //     yAxis: {
    //         allowDecimals: false,
    //         min: 0,
    //         title: {
    //             text: 'Number of score',
    //             skew3d: true
    //         }
    //     },

    //     tooltip: {
    //         headerFormat: '<b>{point.key}</b><br>',
    //         pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
    //     },

    //     plotOptions: {
    //         column: {
    //             stacking: 'normal',
    //             depth: 40
    //         }
    //     },

    //     series: [{
    //         name: 'Achievable Score',
    //         data: [7, 7, 7, 7],
    //         stack: 'male'
    //     }, {
    //         name: 'Achieved Score',
    //         data: [2, 2, 2, 2],
    //         stack: 'female'
    //     },]
    // });


    // /*PI CHART*/
    // Highcharts.chart('piechart_container', {
    //     credits: {
    //         enabled: false
    //     },
    //     chart: {
    //         type: 'pie',
    //         options3d: {
    //             enabled: true,
    //             alpha: 45,
    //             beta: 0
    //         }
    //     },
    //     title: {
    //         text: 'SEVERTY LEVEL (Color Coded Rating)'
    //     },
    //     accessibility: {
    //         point: {
    //             valueSuffix: '%'
    //         }
    //     },
    //     tooltip: {
    //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //     },
    //     plotOptions: {
    //         pie: {
    //             allowPointSelect: true,
    //             cursor: 'pointer',
    //             depth: 35,
    //             dataLabels: {
    //                 enabled: true,
    //                 format: '{point.name}'
    //             }
    //         }
    //     },
    //     series: [{
    //         type: 'pie',
    //         name: 'Color Coded Rating',
    //         data: [
    //             ['Green- Approaching Compliance (Achievable: 25, Achieved: 20)', 45.0],
    //             ['Yellow - Substantial Improvement Required  (Achievable: 25, Achieved: 20)', 5.0],
    //             {
    //                 name: 'Orange - Immediate Remediation Required  (Achievable: 25, Achieved: 20)',
    //                 y: 25.0,
    //                 sliced: true,
    //                 selected: true
    //             },
    //             ['Red - Zero Tolerance  (Achievable: 25, Achieved: 20)', 25.0]
    //         ]
    //     }]
    // });

</script>


</html>