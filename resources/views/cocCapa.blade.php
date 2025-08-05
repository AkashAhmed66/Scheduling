<!DOCTYPE html>
<html lang="en">

<head>
    <title></title>
    <style>
        @page {
            margin: 50px 50px 25px 25px;
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
        .header {
            width: 100%;
            position: fixed;
            top: 0px;
        }
        .footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            width: 100%;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin: 0;
        }
        .footer .left-content {
            text-align: left;
            flex: 1;
            padding: 0;
            margin: 0;
            position: fixed;
            top: 0px;
        }
        .footer .right-content {
            text-align: right;
            flex: 1;
            padding: 0;
            margin: 0;
        }
        .pagenum:before {
            content: counter(page);
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
    <div class="header">
        <div class="headcontainer">
            <img class="logo" src="../public/images/logo.png" alt="logo">
                <div class="infoh">
                    <p>www.nbm-intl.com</p>
                    <p>info@nbm-intl.com</p>
                </div>
        </div>
    </div>
    
    <div class="footer">
        <div class="left-content">
            {{ $info->capaTitile }}
        </div>
        <div class="right-content">
            Page <span class="pagenum"></span>
        </div>
    </div>
    
    <main>
        <p style="font-weight: bold; font-size: 26px">{{ $info->capaTitile }}</p>
        <table class="table table-bordered;">
            <tr>
                <th style="text-align:left">Facility Name: {{$info->facilityName}} </th>
                <th style="text-align:left">Audit Ref #: {{$info->reportNo}}</th>
            </tr>  
            <tr>      
                <th style="text-align:left">Facility Address: {{$info->facilityAddress}}</th>
                <th style="text-align:left">Assessor(s) Name: {{$info->assessors}}</th>
            </tr>  
            <tr>
                <th style="text-align:left">Audit Date: {{ \Carbon\Carbon::parse($info->assesmentDate)->format('F d, Y') }}</th>
                <th style="text-align:left">Assessment & Schedule Type: {{$info->assessmentType." (".$info->scheduleType.")"}}</th>
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
        <th style="text-align:left">Date: {{ \Carbon\Carbon::parse($info->assesmentDate)->format('F d, Y') }}</th>
        <th style="text-align:left">Date: {{ \Carbon\Carbon::parse($info->assesmentDate)->format('F d, Y') }}</th>
    </tr>

</table>
    </main>
</body>

</html>