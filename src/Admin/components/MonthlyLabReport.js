import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


const MonthlyLabReport = () => {
  const [reports, setReports] = useState([]);
  const [totalTests, setTotalTests] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const printRef = useRef();

  const fetchReport = async () => {

  // ✅ VALIDATION
  if (!startDate || !endDate) {
    alert("Please select Start Date and End Date");
    return;
  }

  try {
    const token = localStorage.getItem("jwt");

    const res = await axios.get(
      `${BASE_URL}/api/reports/monthly-lab-report`,
      {
        params: {
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const reportData = res.data?.reports || [];

    setReports(reportData);

    setTotalTests(res.data?.totalTests || 0);

    // ✅ TOTAL PAYMENT CALCULATION
    const total = reportData.reduce((sum, item) => {
      return sum + (Number(item.payment?.amount) || 0);
    }, 0);

    setTotalPayment(total);

  } catch (err) {
    console.error("Monthly Lab Report Error:", err);

    setReports([]);
    setTotalTests(0);
    setTotalPayment(0);
  }
};




    // <div>
    //             <b>From:</b> ${startDate || "All"}
    //           </div>

    //           <div>
    //             <b>To:</b> ${endDate || "All"}
    //           </div>

    //           <div>
    //             <b>Printed:</b>
    //             ${new Date().toLocaleString()}
    //           </div>
 
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;

    const win = window.open("", "", "width=1200,height=800");

    win.document.write(`
      <html>
        <head>
          <title>Monthly Lab Report</title>

          <style>
            body{
              font-family: Arial, sans-serif;
              padding:20px;
              color:#000;
            }

            .report-container{
              width:100%;
            }

          .header{
    display:flex;
    align-items:center;
    border-bottom:3px solid #000;
    padding-bottom:10px;
    margin-bottom:20px;
}

.logo{
    width:90px;
    flex-shrink:0;
}

.logo img{
    width:100px;
    height:90px;
    object-fit:contain;
    display:block;
}

.header-content{
    flex:1;
    text-align:center;
}

            .hospital-title{
              font-size:24px;
              font-weight:bold;
            }

            .hospital-sub{
              font-size:13px;
              margin-top:4px;
            }

            .report-title{
              font-size:20px;
              margin-top:10px;
              font-weight:bold;
            }

            .date-row{
              display:flex;
              justify-content:space-between;
              margin:20px 0;
              font-size:14px;
              flex-wrap:wrap;
              gap:10px;
            }

          table{
  width:100%;
  border-collapse:collapse;
  table-layout:auto;
  margin-top:15px;
}

th,td{
  border:1px solid #000;
  padding:8px;
  font-size:11px;
  text-align:left;
  word-break:break-word;
}

th{
  background:#1976d2 !important;
  color:#fff !important;
  border:1px solid #000;
  font-weight:bold;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

            .footer{
              margin-top:50px;
              display:flex;
              justify-content:space-between;
            }

            @page{
              size:A4;
              margin:15mm;
            }

            @media print{
           
 
              body{
                margin:0;
                 zoom:0.85;
              }

              table{
                page-break-inside:auto;
                 width:100%;
              }

              tr{
                page-break-inside:avoid;
                page-break-after:auto;
              }
            }
          </style>
        </head>

        <body>

          <div class="report-container">

           <div class="header">

    <div class="logo">
        <img
            src="/hospital-print-header.png"
            alt="Hospital Logo"
        />
    </div>

    <div class="header-content">

        <div class="hospital-title">
            Dr. M.I. Jamkhanawala Tibbia Medical College
        </div>

        <div class="hospital-sub">
            Haji Abdul Razzak Kalsekar Tibbia Hospital
        </div>

        <div class="hospital-sub">
            Anjuman-I-Islam Complex, Versova, Mumbai
        </div>

        <div class="report-title">
            MONTHLY LAB REPORT
        </div>

    </div>

</div>
            <div class="date-row">

              <div>
                <b>From:</b> ${startDate || "All"}
              </div>

              <div>
                <b>To:</b> ${endDate || "All"}
              </div>

            

            </div>

            ${printContents}

            <div class="footer">

              <div>
                Generated by Hospital Management System
              </div>

              <div>
                ______________________ <br/>
                Authorized Sign
              </div>

            </div>

          </div>

        </body>

        <script>
          window.onload = function(){
            window.print();
            window.close();
          }
        </script>

      </html>
    `);

    win.document.close();
  };

const handleDownloadPDF = () => {
  const doc = new jsPDF("l", "mm", "a4");

  doc.setFontSize(18);
  doc.text("Monthly Lab Report", 14, 15);

  doc.setFontSize(11);
  doc.text(`From: ${startDate || "All"}`, 14, 24);
  doc.text(`To: ${endDate || "All"}`, 80, 24);
  doc.text(`Printed: ${new Date().toLocaleString()}`, 160, 24);

  doc.text(`Total Tests: ${totalTests}`, 14, 32);
  doc.text(`Total Payment: ₹${totalPayment}`, 80, 32);

  autoTable(doc, {
    startY: 40,

    head: [[
      "Sr No",
      "Date",
      "Patient ID",
      "Patient Name",
      "Test Type",
      "Amount",
      "Payment",
      "Priority",
      "Status",
      "Technician"
    ]],

    body: reports.map((r, index) => [
      index + 1,
      r.date
        ? new Date(r.date).toLocaleDateString()
        : "N/A",

      r.patientId?.patientId || "N/A",

      r.patientId?.fullName || "N/A",

      r.testType || "N/A",

      `₹${r.payment?.amount || 0}`,

      r.payment?.status || "Pending",

      r.priority || "N/A",

      r.status || "N/A",

      r.labTechnician?.userId?.name || "N/A",
    ]),

    styles: {
      fontSize: 8,
    },

    headStyles: {
      fillColor: [30, 41, 59],
    },
  });

  doc.save("Monthly_Lab_Report.pdf");
};


const handleDownloadExcel = () => {

  const workbook = XLSX.utils.book_new();

  const excelData = reports.map((r, index) => ({

    "Sr No": index + 1,

    Date: r.date
      ? new Date(r.date).toLocaleDateString()
      : "N/A",

    "Patient ID":
      r.patientId?.patientId || "N/A",

    "Patient Name":
      r.patientId?.fullName || "N/A",

    "Test Type":
      r.testType || "N/A",

    "Payment Amount":
      r.payment?.amount || 0,

    "Payment Status":
      r.payment?.status || "Pending",

    Priority:
      r.priority || "N/A",

    Status:
      r.status || "N/A",

    Technician:
      r.labTechnician?.userId?.name || "N/A",

  }));

  const ws = XLSX.utils.json_to_sheet(excelData);

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Monthly Lab Report"
  );

  XLSX.writeFile(
    workbook,
    "Monthly_Lab_Report.xlsx"
  );
};


  return (
    <div
      style={{
        padding: "20px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#1e293b",
          }}
        >
          🧪 Monthly Lab Report
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={fetchReport}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Search
          </button>

          {/* <button
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "#16a34a",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Print Report
          </button> */}

          <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  }}
>
  <button
    onClick={handlePrint}
    style={{
      padding: "10px 20px",
      border: "none",
      background: "#16a34a",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    🖨 Print
  </button>

  <button
    onClick={handleDownloadPDF}
    style={{
      padding: "10px 20px",
      border: "none",
      background: "#dc2626",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    📄 PDF
  </button>

  <button
    onClick={handleDownloadExcel}
    style={{
      padding: "10px 20px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    📊 Excel
  </button>
</div>
        </div>

      <div
  style={{
    marginBottom: "15px",
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0f172a",
  }}
>
  <div>
    Total Tests: {totalTests}
  </div>

  <div>
    Total Payment: ₹ {totalPayment}
  </div>
</div>

        <div
          ref={printRef}
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
          <thead>
  <tr
    style={{
      background: "#1e293b",
      color: "#fff",
    }}
  >
    <th style={thStyle}>Sr No</th>
    <th style={thStyle}>Date</th>
    <th style={thStyle}>Patient ID</th>
    <th style={thStyle}>Patient Name</th>
    <th style={thStyle}>Test Type</th>
    <th style={thStyle}>Payment Amount</th>
    <th style={thStyle}>Payment Status</th>
    <th style={thStyle}>Priority</th>
    <th style={thStyle}>Status</th>
    <th style={thStyle}>Technician</th>
  </tr>
</thead>

<tbody>
  {reports.length > 0 ? (
    reports.map((r, index) => (
      <tr
        key={r._id || index}
        style={{
          background:
            index % 2 === 0 ? "#fff" : "#f8fafc",
        }}
      >
                <td style={tdStyle}>
          {index + 1}
        </td>

        {/* DATE */}
        <td style={tdStyle}>
          {r.date
            ? new Date(r.date).toLocaleDateString()
            : "N/A"}
        </td>

        {/* PATIENT ID */}
        <td style={tdStyle}>
          {r.patientId?.patientId || "N/A"}
        </td>

        {/* PATIENT NAME */}
        <td style={tdStyle}>
          {r.patientId?.fullName || "N/A"}
        </td>

        {/* TEST TYPE */}
        <td style={tdStyle}>
          {r.testType || "N/A"}
        </td>

        {/* PAYMENT AMOUNT */}
        <td style={tdStyle}>
          ₹ {r.payment?.amount || 0}
        </td>

        {/* PAYMENT STATUS */}
        <td
          style={{
            ...tdStyle,
            color:
              r.payment?.status === "Paid"
                ? "green"
                : "red",
            fontWeight: "bold",
          }}
        >
          {r.payment?.status || "Pending"}
        </td>

        {/* PRIORITY */}
        <td style={tdStyle}>
          {r.priority || "N/A"}
        </td>

        {/* STATUS */}
        <td style={tdStyle}>
          {r.status || "N/A"}
        </td>

        {/* TECHNICIAN */}
        <td style={tdStyle}>
          {r.labTechnician?.userId?.name || "N/A"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="10"
        style={{
          textAlign: "center",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        No Reports Found
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
  fontSize: "14px",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  fontSize: "13px",
};

export default MonthlyLabReport;