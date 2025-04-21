<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Assessment Report</title>
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
            width: 100% !important;
            table-layout: fixed;
        }

        .info {
            float: right;
            border: 1px solid black;
            width: 40%;
            margin-bottom: 20px;
        }

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

        p {
            line-height: 0.5;
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
        }
        .factoryimg{
            height: 270px;
            width: 520px;
            position: relative;
            left: 90px;
            top: 40px;
            border: 1px solid black;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="headcontainer">
            <img class="logo" src="../public/img/ecotech_logo.png" alt="logo">
            <div class="infoh">
                <p>www.example.com</p>
                <p>info@example.com</p>
            </div>
        </div>
    </div>
    
    <div class="content">
        <div class="coverpage">
            <br>
            <br>
            <br>
            <img class="factoryimg" src="https://via.placeholder.com/520x270" alt="factory">
            <br>
            <br>
            <h1 style="text-align: center; position: relative; top: 40px; height: 40px;">Facility Assessment Report</h1>
            <br>
            <br>
            <div style="background-color: rgb(239, 238, 238); position: relative; top: 35px; padding: 20px; height: 250px;"> 
                <h2>Sample Facility Name</h2>
                <table class="coverinfo">
                    <tr class="coverinfo">
                        <td class="coverinfo" width="30%">Audit Company:</td>
                        <td class="coverinfo">Example Audit Ltd</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Report No:</td>
                        <td class="coverinfo">AS-2023-001</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Type:</td>
                        <td class="coverinfo">Comprehensive</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Schedule Type:</td>
                        <td class="coverinfo">Regular</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessors:</td>
                        <td class="coverinfo">John Doe, Jane Smith</td>
                    </tr>
                    <tr class="coverinfo">
                        <td class="coverinfo">Assessment Date:</td>
                        <td class="coverinfo">2023-05-15</td>
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
                    <table>
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
                        <td style="text-align: center">85%</td>
                    </tr>
                    <tr style="border: 0px">
                        <td style="border: 0px"></td>
                        <td style="border: 0px"><img style="height: 25px; width: 30px; position:relative; top:1px; left: 50px" class="logo" src="../public/img/up.png" alt="logo"></td>
                        <td style="border: 0px"></td>
                        <td style="border: 0px"></td>
                        <td style="border: 0px"></td>
                    </tr>
                </table>
            </div>
            </br>
            <p style="font-weight: bold">Section Rating:</p>
            <div style="height: 310px;">
                <table>
                    <tbody>
                        <tr>
                            <th style="background-color: #c0c0c0">Performance Area</th>
                            <th style="background-color: #c0c0c0" width='20%'>Rating</th>
                            <th style="background-color: #c0c0c0" width='20%'>Score</th>
                        </tr>
                        <tr>
                            <td>Health & Safety</td>
                            <td style="background-color: green"></td>
                            <td style="text-align: center;">92.50</td>
                        </tr>
                        <tr>
                            <td>Environmental Compliance</td>
                            <td style="background-color: yellow"></td>
                            <td style="text-align: center;">85.75</td>
                        </tr>
                        <tr>
                            <td>Labor Practices</td>
                            <td style="background-color: yellow"></td>
                            <td style="text-align: center;">78.20</td>
                        </tr>
                        <tr>
                            <td>Business Ethics</td>
                            <td style="background-color: orange"></td>
                            <td style="text-align: center;">65.30</td>
                        </tr>
                        <tr>
                            <td>Management Systems</td>
                            <td style="background-color: green"></td>
                            <td style="text-align: center;">95.10</td>
                        </tr>
                    </tbody>       
                </table>
            </div>
            
            <div>
                <img style="height: 320px; width: 100%" src="https://quickchart.io/chart?c={
                    'type': 'horizontalBar',
                    'data': {
                      'labels': [
                        'Health & Safety','Environmental Compliance','Labor Practices','Business Ethics','Management Systems'
                      ],
                      'datasets': [
                        {
                          'label': 'Section Rating(%)',
                          'backgroundColor': 'rgba(153, 102, 255, 1)',
                          'data': [
                            92.50,85.75,78.20,65.30,95.10,0,100
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
                        <td>Sample Facility Name</td>
                    </tr>
                    <tr>
                        <td>Facility Address</td>
                        <td>123 Example Street, Industrial Zone, Sample City</td>
                    </tr>
                    <tr>
                        <td>Business License #</td>
                        <td>BL-12345-2023</td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>Example Country</td>
                    </tr>
                    <tr>
                        <td>Year of establishment</td>
                        <td>2010</td>
                    </tr>
                    <tr>
                        <td>Building description</td>
                        <td>5-story concrete structure with 2 production floors</td>
                    </tr>
                    <tr>
                        <td>Multiple Tenants?</td>
                        <td>No</td>
                    </tr>
                    <tr>
                        <td>Site owned or rented?</td>
                        <td>Owned</td>
                    </tr>
                    <tr>
                        <td>Monthly Production Capacity</td>
                        <td>50,000 units</td>
                    </tr>
                    <tr>
                        <td>Primary Contact Name</td>
                        <td>John Manager</td>
                    </tr>
                    <tr>
                        <td>Position</td>
                        <td>Facility Manager</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>john.manager@example.com</td>
                    </tr>
                    <tr>
                        <td>Contact Number</td>
                        <td>+1-555-123-4567</td>
                    </tr>
                    <tr>
                        <td>Social Compliance Contact</td>
                        <td>Sarah Compliance</td>
                    </tr>
                </table>
            </div>
            <br>
            <div class="employee">
                <table>
                    <tr style="background-color: red;">
                        <th colspan="2" style="color: white; font-weight: bold">Employee Information</th>
                    </tr>
                    <tr>
                        <td>Number of employees</td>
                        <td>250</td>
                    </tr>
                    <tr>
                        <td>Number of workers</td>
                        <td>220</td>
                    </tr>
                    <tr>
                        <td>Male employees</td>
                        <td>150</td>
                    </tr>
                    <tr>
                        <td>Female Employees</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <td>Local workers</td>
                        <td>225</td>
                    </tr>
                    <tr>
                        <td>Foreign Migrant Workers</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>Worker Turnover Rate</td>
                        <td>15% annually</td>
                    </tr>
                    <tr>
                        <td>Labor Agent Used</td>
                        <td>Yes</td>
                    </tr>
                    <tr>
                        <td>Management Spoken Language</td>
                        <td>English</td>
                    </tr>
                    <tr>
                        <td>Workers Spoken Language</td>
                        <td>English, Spanish</td>
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
                            This facility assessment was conducted to evaluate compliance with industry standards and regulations. The facility demonstrated strong performance in Health & Safety and Management Systems, with good performance in Environmental Compliance and Labor Practices. Some improvements are needed in Business Ethics area.
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
                            The facility has implemented an excellent occupational health monitoring program, comprehensive waste management system, and regular safety training for all employees. Employee engagement is strong with regular town hall meetings and suggestion programs.
                        </td>
                    </tr>
                </table>
            </div>

            <div class="findings">
                <h2 style="color: #0070C0">Audit Findings</h2>
                <table>
                    <tr style="border: 1px solid black;">
                        <th style="background-color: #c0c0c0; text-align: left;">
                            Health & Safety
                        </th>
                        <th width='20%'>
                            <table style="border: 1px solid black;">
                                <tr>
                                    No. of Findings
                                </tr>
                                <tr>
                                    <td style="background-color: green; text-align: center">1</td>
                                    <td style="background-color: yellow; text-align: center">0</td>
                                    <td style="background-color: orange; text-align: center">0</td>
                                    <td style="background-color: red; text-align: center">0</td>
                                </tr>
                            </table>
                        </th>
                        <th width='10%' style="padding: 0px; margin: 0px">
                            <table style="padding: 0px; margin: 0px">
                                <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                <tr><th><p style="font-size: 10px; margin: 2px;">92.50</p></th></tr>
                            </table>
                        </th>
                    </tr>
                </table>
                <br>

                <table>
                    <tr style="border: 0px solid black;">
                        <td width="20%">HS-01</td>
                        <td style="background-color: green" width="20%">Minor</td>
                        <td style="border: 0px solid black"></td>
                    </tr>
                    <tr>
                        <td>Findings</td>
                        <td colspan="2">Some fire extinguishers were found to be missing monthly inspection tags.</td>
                    </tr>
                    <tr>
                        <td scope="col">Legal Reference</td>
                        <td colspan="2">Fire Safety Regulation 2021, Article 15</td>
                    </tr>
                    <tr>
                        <td>Recommendation</td>
                        <td colspan="2">Implement a regular monthly inspection system for all fire extinguishers with proper documentation.</td>
                    </tr>
                </table>
                </br>

                <table>
                    <tr style="border: 1px solid black;">
                        <th style="background-color: #c0c0c0; text-align: left;">
                            Environmental Compliance
                        </th>
                        <th width='20%'>
                            <table style="border: 1px solid black;">
                                <tr>
                                    No. of Findings
                                </tr>
                                <tr>
                                    <td style="background-color: green; text-align: center">1</td>
                                    <td style="background-color: yellow; text-align: center">1</td>
                                    <td style="background-color: orange; text-align: center">0</td>
                                    <td style="background-color: red; text-align: center">0</td>
                                </tr>
                            </table>
                        </th>
                        <th width='10%' style="padding: 0px; margin: 0px">
                            <table style="padding: 0px; margin: 0px">
                                <tr><th><p style="font-size: 10px; margin: 2px;">Audit Score</p></th></tr>
                                <tr><th><p style="font-size: 10px; margin: 2px;">85.75</p></th></tr>
                            </table>
                        </th>
                    </tr>
                </table>
                <br>

                <table>
                    <tr style="border: 0px solid black;">
                        <td width="20%">ENV-01</td>
                        <td style="background-color: green" width="20%">Minor</td>
                        <td style="border: 0px solid black"></td>
                    </tr>
                    <tr>
                        <td>Findings</td>
                        <td colspan="2">Waste segregation not properly implemented in production area 2.</td>
                    </tr>
                    <tr>
                        <td scope="col">Legal Reference</td>
                        <td colspan="2">Environmental Protection Act, Section 23</td>
                    </tr>
                    <tr>
                        <td>Recommendation</td>
                        <td colspan="2">Provide additional waste bins with clear labeling and employee training.</td>
                    </tr>
                </table>
                </br>

                <table>
                    <tr style="border: 0px solid black;">
                        <td width="20%">ENV-02</td>
                        <td style="background-color: yellow" width="20%">Major</td>
                        <td style="border: 0px solid black"></td>
                    </tr>
                    <tr>
                        <td>Findings</td>
                        <td colspan="2">Water quality testing not performed as per the required schedule.</td>
                    </tr>
                    <tr>
                        <td scope="col">Legal Reference</td>
                        <td colspan="2">Water Resource Management Act, Article 42</td>
                    </tr>
                    <tr>
                        <td>Recommendation</td>
                        <td colspan="2">Establish a regular water testing schedule with third-party lab and maintain proper records.</td>
                    </tr>
                </table>
                </br>

                <table>
                    <tr style="border: 1px solid black;">
                        <th style="background-color: #c0c0c0; text-align: left;">
                            Labor Practices
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
                                <tr><th><p style="font-size: 10px; margin: 2px;">100.00</p></th></tr>
                            </table>
                        </th>
                    </tr>
                    <tr>
                        <td colspan='3'>No findings noted under this section on the assessment day.</td>
                    </tr>
                </table>
                <br>
            </div>
        </div>
        <div class="disclaimer">
            <table>
                <tr>
                    <th style="text-align: left; background-color: #c0c0c0">Disclaimer:</th>
                </tr>
                <tr>
                    <td style="text-align: justify; padding: 3px;">
                        This assessment report is for informational purposes only. The information contained herein represents the observations and findings of the assessment team at the time of inspection. While every effort has been made to ensure accuracy, the audit company makes no warranty, expressed or implied, as to the accuracy, completeness, or timeliness of this information. The report should not be relied upon as legal advice or as a substitute for consultation with professional advisors.
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