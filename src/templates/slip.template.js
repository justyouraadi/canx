function generateSlip(params) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.employee.name} Salary Slip</title>
    <style>
        /* General Reset */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #eef2f5; /* Light grey background for contrast */
            margin: 0;
            padding: 40px;
            display: flex;
            justify-content: center;
            -webkit-print-color-adjust: exact;
        }

        /* A4 Container */
        .payslip-container {
            width: 100%;
            max-width: 850px;
            background-color: #ffffff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden; /* Clips the header corners */
        }

        /* Header Section */
        .header-banner {
            background-color: #4C88F8; /* Dark Navy */
            color: #ffffff;
            padding: 30px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .company-info h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .company-info p {
            margin: 5px 0 0;
            font-size: 13px;
            color: #000000;
        }

        .payslip-title {
            text-align: right;
        }

        .payslip-title h2 {
            margin: 0;
            font-size: 22px;
            font-weight: 400;
        }

        .payslip-title span {
            font-size: 14px;
            color: #000000;
        }

        /* Employee Details Grid */
        .employee-info {
            padding: 30px 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            border-bottom: 1px solid #e2e8f0;
        }

        .info-group h3 {
            font-size: 14px;
            text-transform: uppercase;
            color: #718096;
            margin-bottom: 15px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .info-table {
            width: 100%;
            font-size: 14px;
        }

        .info-table td {
            padding: 4px 0;
        }

        .label {
            color: #718096;
            width: 140px;
        }

        .val {
            color: #2d3748;
            font-weight: 600;
        }

        /* Financials Section */
        .financials {
            padding: 30px 40px;
            display: flex;
            gap: 30px;
        }

        .table-container {
            flex: 1;
        }

        .fin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .fin-table th {
            background-color: #f7fafc;
            color: #4a5568;
            font-weight: 600;
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid #e2e8f0;
        }

        .fin-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #edf2f7;
            color: #2d3748;
        }

        .amount {
            text-align: right;
            font-family: 'Courier New', Courier, monospace; /* Monospace for alignment */
            font-weight: 600;
        }

        /* Claims Highlight */
        .claim-row td {
            background-color: #f0fff4; /* Light green tint */
            color: #276749;
        }

        /* Total Summary */
        .summary-section {
            background-color: #f8fafc;
            padding: 20px 40px;
            display: flex;
            justify-content: flex-end;
        }

        .net-pay-box {
            background-color: #2b6cb0; /* Corporate Blue */
            color: white;
            padding: 15px 30px;
            border-radius: 6px;
            text-align: center;
            min-width: 250px;
        }

        .net-pay-box .label {
            display: block;
            font-size: 12px;
            color: #bee3f8;
            text-transform: uppercase;
            width: 100%;
            text-align: center;
        }

        .net-pay-box .value {
            font-size: 28px;
            font-weight: 700;
        }

        /* Footer */
        .footer {
            padding: 20px 40px;
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
        }

    </style>
</head>
<body>

    <div class="payslip-container">
        
        <div class="header-banner">
            <div class="company-info">
                <h1>Canx International Pvt Ltd</h1>
                <p>Daskroi, Ahmedabad, 360023</p>
            </div>
            <div class="payslip-title">
                <h2>Payslip</h2>
                <span>${params.day}/${params.month}/${params.year}</span>
            </div>
        </div>

        <div class="employee-info">
            <div class="info-group">
                <h3>Employee Profile</h3>
                <table class="info-table">
                    <tr><td class="label">Name:</td><td class="val">${params.employee.name}</td></tr>
                    <tr><td class="label">Employee ID:</td><td class="val">${params.employee.empId}</td></tr>
                    <tr><td class="label">Designation:</td><td class="val">${params.employee.designation}</td></tr>
                    <tr><td class="label">Department:</td><td class="val">${params.employee.department.name}</td></tr>
                </table>
            </div>
            <div class="info-group">
                <h3>Bank & Tax Details</h3>
                <table class="info-table">
                    <tr><td class="label">Bank Name:</td><td class="val">${params.employee.bankName}</td></tr>
                    <tr><td class="label">Acct No:</td><td class="val">${params.employee.accountNumber}</td></tr>
                    <tr><td class="label">PAN No:</td><td class="val">${params.employee.panNumber}</td></tr>
                    <tr><td class="label">Days Worked:</td><td class="val">${params.workingDays} Days</td></tr>
                </table>
            </div>
        </div>

        <div class="financials">
            
            <div class="table-container">
                <table class="fin-table">
                    <thead>
                        <tr>
                            <th>Earnings & Claims</th>
                            <th style="text-align: right;">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basic Salary</td>
                            <td class="amount">${params.employee.baseSalary}</td>
                        </tr>
                        <tr>
                            <td>Travel Allowance (Fuel)</td>
                            <td class="amount">${params.travelAllowance}</td>
                        </tr>
                        <tr>
                            <td>Food / Meal Claims</td>
                            <td class="amount">${params.claimsAmount}</td>
                        </tr>
                        <tr>
                            <td>Bonus</td>
                            <td class="amount">${params.bonus}</td>
                        </tr>
                        <tr><td style="color:transparent">.</td><td></td></tr>
                        <tr style="background-color: #edf2f7; font-weight: bold;">
                            <td>Gross Earnings</td>
                            <td class="amount">${params.grossSalary}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <table class="fin-table">
                    <thead>
                        <tr>
                            <th>Deductions</th>
                            <th style="text-align: right;">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tax</td>
                            <td class="amount">${params.deductions}</td>
                        </tr>
                        <tr><td style="color:transparent">.</td><td></td></tr>
                        <tr><td style="color:transparent">.</td><td></td></tr>
                        <tr><td style="color:transparent">.</td><td></td></tr>
                        <tr><td style="color:transparent">.</td><td></td></tr>
                        
                        <tr style="background-color: #edf2f7; font-weight: bold; color: #c53030;">
                            <td>Total Deductions</td>
                            <td class="amount">${params.deductions}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="summary-section">
            <div class="net-pay-box">
                <span class="label">Net Salary Payable</span>
                <span class="value">₹ ${params.netSalary}</span>
                <div style="font-size: 10px; margin-top: 5px; opacity: 0.8;">Paid via Bank Transfer</div>
            </div>
        </div>

        <div class="footer">
            CanX Internationals | System Generated Document | Private & Confidential
        </div>
    </div>

</body>
</html>
    `;
}

module.exports = {
  generateSlip,
};
