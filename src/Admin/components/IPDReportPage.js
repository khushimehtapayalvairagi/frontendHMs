// IPDReportPage.js

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './IPDReportPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const IPDReportPage = () => {

  const printRef = useRef();

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [departments, setDepartments] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedOtRoom, setSelectedOtRoom] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [reportType, setReportType] = useState('all');

  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [gender, setGender] = useState('');
  const [deliveryType, setDeliveryType] = useState('');

  // DATA STATES

  const [centralData, setCentralData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [otData, setOtData] = useState([]);
  const [anesthesiaData, setAnesthesiaData] = useState([]);
  const [birthData, setBirthData] = useState([]);
  const [billingData, setBillingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [fumigationData, setFumigationData] = useState([]);
  const [sonographyData, setSonographyData] = useState([]);

  // FETCH DEPARTMENTS

  useEffect(() => {
    fetchDepartments();
    fetchTheaters();
  }, []);

  const fetchDepartments = async () => {
    try {

      const res = await axios.get(
        `${BASE_URL}/api/admin/departments`,
        { headers }
      );

      setDepartments(res.data.departments || []);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchTheaters = async () => {
    try {

      const res = await axios.get(
        `${BASE_URL}/api/admin/operation-theaters`,
        { headers }
      );

      setTheaters(res.data.theaters || []);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH REPORTS

  const handleGenerate = async (e) => {

    e.preventDefault();

    if (!startDate || !endDate) {
      toast.warning('Please select dates');
      return;
    }

    try {

      setLoading(true);
      setHasFetched(false);

      const params = {
        startDate,
        endDate,
      };

      if (selectedDepartment) {
        params.departmentId = selectedDepartment;
      }

      // CENTRAL

      if (reportType === 'central' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/ipd-register/central`,
          { headers, params }
        );

        setCentralData(res.data || []);
      }

      // DEPARTMENT

      if (reportType === 'department' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/ipd-register/department-wise`,
          { headers, params }
        );

        setDepartmentData(res.data || []);
      }

      // OT

      if (reportType === 'ot' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/procedures/ot-register`,
          { headers, params }
        );

        setOtData(res.data || []);
      }

      // ANESTHESIA

      if (reportType === 'anesthesia' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/anesthesia-register`,
          { headers, params }
        );

        setAnesthesiaData(res.data || []);
      }

      // BIRTH

      if (reportType === 'birth' || reportType === 'all') {

        const birthParams = {
          startDate,
          endDate,
          gender,
          delivery_type: deliveryType,
        };

        const res = await axios.get(
          `${BASE_URL}/api/reports/birth-records`,
          {
            headers,
            params: birthParams,
          }
        );

        setBirthData(res.data || []);
      }

      // BILLING

      if (reportType === 'billing' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/billing-summary`,

          // { headers, params }

          {
  headers,
  params: {
    ...params,
    billType: 'IPD'
  }
}


        );

        setBillingData(res.data || null);
      }

      // PAYMENT

      if (
        reportType === 'paymentReconciliation' ||
        reportType === 'all'
      ) {

        // const res = await axios.get(
        //   `${BASE_URL}/api/reports/payment-reconciliation`,
        //   { headers, params }
        // );


        const res = await axios.get(
  `${BASE_URL}/api/reports/payment-reconciliation`,
  {
    headers,
    params: {
      ...params,
      billType: 'IPD'
    }
  }
);


        setPaymentData(res.data || null);
      }

      // FUMIGATION

      if (reportType === 'fumigation' || reportType === 'all') {

        const fumigationParams = {
          startDate,
          endDate,
          otRoomId: selectedOtRoom,
        };

        const res = await axios.get(
          `${BASE_URL}/api/reports/ot-fumigation-report`,
          {
            headers,
            params: fumigationParams,
          }
        );

        setFumigationData(res.data || []);
      }

      // SONOGRAPHY

      if (reportType === 'sonography' || reportType === 'all') {

        const res = await axios.get(
          `${BASE_URL}/api/reports/sonography-report`,
          { headers, params }
        );

        setSonographyData(res.data || []);
      }

      setHasFetched(true);

      toast.success('Reports generated successfully');

    } catch (error) {

      console.log(error);
      toast.error('Error generating report');

    } finally {

      setLoading(false);

    }
  };

 




const handlePrint = () => {

  if (!printRef.current) {
    toast.error("No report found");
    return;
  }

  const printContents = printRef.current.innerHTML;

  if (!printContents || printContents.trim() === "") {
    toast.error("Nothing to print");
    return;
  }

  const win = window.open(
    "",
    "_blank",
    "width=1200,height=900"
  );

  if (!win) {
    toast.error("Please allow popup for printing");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>IPD Reports</title>

        <style>

          *{
            box-sizing:border-box;
          }

          body{
            font-family: Arial, sans-serif;
            padding:20px;
            color:#000;
          }

          .report-container{
            width:100%;
          }

          .header{
            text-align:center;
            border-bottom:3px solid #000;
            padding-bottom:10px;
            margin-bottom:20px;
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
            font-weight:bold;
            margin-top:10px;
          }

          .date-row{
            display:flex;
            justify-content:space-between;
            margin:15px 0 25px;
            font-size:14px;
            flex-wrap:wrap;
            gap:10px;
          }

          h2{
            margin-top:25px;
            margin-bottom:10px;
            border-bottom:1px solid #000;
            padding-bottom:5px;
          }

          h3{
            margin-top:15px;
            margin-bottom:8px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
            margin-bottom:25px;
          }

          th,td{
            border:1px solid #000;
            padding:8px;
            font-size:12px;
            text-align:left;
            word-break:break-word;
          }

          th{
            background:#eeeeee !important;
            font-weight:bold;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          tr{
            page-break-inside:avoid;
          }

          .footer{
            margin-top:40px;
            display:flex;
            justify-content:space-between;
            font-size:13px;
          }

          @page{
            size:A4;
            margin:12mm;
          }

          @media print{

            body{
              margin:0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

          }

        </style>
      </head>

      <body>

        <div class="report-container">

          <div class="header">

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
               IPD REPORT
            </div>

          </div>

          <div class="date-row">

            <div>
              <b>From:</b> ${startDate || "N/A"}
            </div>

            <div>
              <b>To:</b> ${endDate || "N/A"}
            </div>

            <div>
              <b>Department:</b>
              ${
                departments.find(
                  (d) => d._id === selectedDepartment
                )?.name || "All"
              }
            </div>

            <div>
              <b>Printed:</b>
              ${new Date().toLocaleString()}
            </div>

          </div>

          ${printContents}

          <div class="footer">

            <div>
              Generated by Hospital System
            </div>

            <div style="text-align:center;">
              __________________<br/>
              Authorized Sign
            </div>

          </div>

        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
              window.close();
            }, 500);
          };
        </script>

      </body>
    </html>
  `);

  win.document.close();
};


// const handleDownloadPDF = async () => {
//   if (!printRef.current) {
//     toast.error("No report found");
//     return;
//   }

//   const input = printRef.current;

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//   });

//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");

//   const pageWidth = pdf.internal.pageSize.getWidth();

//   const pageHeight = pdf.internal.pageSize.getHeight();

//   const imgWidth = pageWidth;

//   const imgHeight =
//     (canvas.height * imgWidth) / canvas.width;

//   let heightLeft = imgHeight;

//   let position = 0;

//   pdf.addImage(
//     imgData,
//     "PNG",
//     0,
//     position,
//     imgWidth,
//     imgHeight
//   );

//   heightLeft -= pageHeight;

//   while (heightLeft > 0) {
//     position = heightLeft - imgHeight;

//     pdf.addPage();

//     pdf.addImage(
//       imgData,
//       "PNG",
//       0,
//       position,
//       imgWidth,
//       imgHeight
//     );

//     heightLeft -= pageHeight;
//   }

//   pdf.save("IPD_Report.pdf");
// };

const handleDownloadPDF = async () => {
  if (!printRef.current) {
    toast.error("No report found");
    return;
  }

  const input = printRef.current;

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // ✅ Margin
  const margin = 10;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  // First page
  pdf.addImage(
    imgData,
    "PNG",
    margin,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= (pageHeight - margin * 2);

  // Extra pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= (pageHeight - margin * 2);
  }

  pdf.save("IPD_Report.pdf");
};

const handleDownloadExcel = () => {

  const workbook = XLSX.utils.book_new();

  // CENTRAL

  if (centralData.length > 0) {

    const data = centralData.map((item) => {

      const admission = new Date(item.admissionDate);

      const discharge = item.actualDischargeDate
        ? new Date(item.actualDischargeDate)
        : new Date();

      const days = Math.max(
        1,
        Math.ceil(
          (discharge - admission) /
            (1000 * 60 * 60 * 24)
        )
      );

      return {

        Patient: item.patient?.fullName,

        Doctor: item.doctor?.name,

        Department: item.doctor?.specialty,

        Ward: item.ward?.name,

        Room: item.roomCategory?.name,

        Bed: item.bedNumber,

        Admission: admission.toLocaleDateString(),

        Discharge: item.actualDischargeDate
          ? discharge.toLocaleDateString()
          : "N/A",

        "Total Days": days,

        Status: item.status,

      };

    });

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(
      workbook,
      ws,
      "Central IPD"
    );

  }

  // Department

  if (departmentData.length > 0) {

const departmentExcel = [];

departmentData.forEach((dept) => {
  (dept.admissions || []).forEach((a) => {
    departmentExcel.push({
      Department: dept.specialty,
      Patient: a.patient?.fullName || "N/A",
      Doctor: a.doctor?.name || "N/A",
      Bed: a.bedNumber || "N/A",
      Status: a.status || "N/A",
    });
  });
});

const ws = XLSX.utils.json_to_sheet(departmentExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "Department"
);

    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "Department"
    // );

  }

  // OT

  if (otData.length > 0) {

const otExcel = otData.map((item) => ({
  Patient: item.patient?.name || "N/A",
  Procedure: item.procedure?.name || "N/A",
  Surgeon: item.surgeon?.name || "N/A",
  Date: item.scheduledDateTime
    ? new Date(item.scheduledDateTime).toLocaleString()
    : "N/A",
  Status: item.status || "N/A",
}));

const ws = XLSX.utils.json_to_sheet(otExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "OT Register"
);
    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "OT"
    // );

  }

  // Anaesthesia

  if (anesthesiaData.length > 0) {

const anesthesiaExcel = anesthesiaData.map((item) => ({
  Patient: item.patient?.name || "N/A",
  Anesthetist: item.anesthetist?.name || "N/A",
  Procedure: item.procedureType || "N/A",
  "Anesthesia Type": item.anesthesiaType || "N/A",
  "Start Time": item.induceTime
    ? new Date(item.induceTime).toLocaleString()
    : "N/A",
  "End Time": item.endTime
    ? new Date(item.endTime).toLocaleString()
    : "N/A",
}));

const ws = XLSX.utils.json_to_sheet(anesthesiaExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "Anaesthesia"
);

    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "Anaesthesia"
    // );

  }

  // Birth

  if (birthData.length > 0) {

const birthExcel = birthData.map((item) => ({
  Patient: item.patientId?.fullName || "N/A",
  "Baby Name": item.babyName || "N/A",
  Gender: item.gender || "N/A",
  DOB: item.dobBaby
    ? new Date(item.dobBaby).toLocaleDateString()
    : "N/A",
  "Delivery Type": item.deliveryType || "N/A",
}));

const ws = XLSX.utils.json_to_sheet(birthExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "Birth Register"
);

    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "Birth"
    // );

  }

  // Fumigation

  if (fumigationData.length > 0) {
const fumigationExcel = fumigationData.map((item) => ({
  Date: item.date
    ? new Date(item.date).toLocaleDateString()
    : "N/A",
  "OT Room": item.otRoomId?.name || "N/A",
  "Performed By": item.performedBy?.name || "N/A",
  Remarks: item.remarks || "N/A",
}));

const ws = XLSX.utils.json_to_sheet(fumigationExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "Fumigation"
);

    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "Fumigation"
    // );

  }

  // Sonography

  if (sonographyData.length > 0) {

 const sonoExcel = sonographyData.map((item) => ({
  Date: item.createdAt
    ? new Date(item.createdAt).toLocaleString()
    : "N/A",
  Patient: item.patientId?.fullName || "N/A",
  Doctor: item.doctorId?.userId?.name || "N/A",
  Scan: item.scanType || "N/A",
  Cost: item.cost || 0,
  Status: item.status || "Pending",
}));

const ws = XLSX.utils.json_to_sheet(sonoExcel);

XLSX.utils.book_append_sheet(
  workbook,
  ws,
  "Sonography"
);

    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   ws,
    //   "Sonography"
    // );

  }

  XLSX.writeFile(
    workbook,
    "IPD_Report.xlsx"
  );

};

  return (

    <div className="report-container">

      <h1 className="report-title">
        🏥 IPD Report Dashboard
      </h1>

      {/* FILTERS */}

      <form
        onSubmit={handleGenerate}
        className="form-section"
      >

        <div className="filter-grid">

          <div>
            <label>Report Type</label>

            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
              className="input-field"
            >

              <option value="all">
                All Reports
              </option>

              <option value="central">
                Central IPD
              </option>

              <option value="department">
                Department Wise
              </option>

              <option value="ot">
                OT Register
              </option>

              <option value="anesthesia">
                Anesthesia Register
              </option>

              <option value="birth">
                Birth Register
              </option>

              <option value="billing">
                Billing Summary
              </option>

              <option value="paymentReconciliation">
                Payment Reconciliation
              </option>

              <option value="fumigation">
                OT Fumigation
              </option>

              <option value="sonography">
                Sonography
              </option>

            </select>
          </div>

          <div>
            <label>Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="input-field"
            />
          </div>

          <div>
            <label>End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="input-field"
            />
          </div>

          <div>
            <label>Department</label>

            <select
              value={selectedDepartment}
              onChange={(e) =>
                setSelectedDepartment(
                  e.target.value
                )
              }
              className="input-field"
            >

              <option value="">
                All
              </option>

              {departments.map((d) => (
                <option
                  key={d._id}
                  value={d._id}
                >
                  {d.name}
                </option>
              ))}

            </select>
          </div>

          {reportType === 'fumigation' && (
            <div>

              <label>OT Room</label>

              <select
                value={selectedOtRoom}
                onChange={(e) =>
                  setSelectedOtRoom(
                    e.target.value
                  )
                }
                className="input-field"
              >

                <option value="">
                  All
                </option>

                {theaters.map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                  >
                    {room.name}
                  </option>
                ))}

              </select>

            </div>
          )}

        </div>

        {/* BUTTONS */}

        {/* <div className="button-group">

          <button
            type="submit"
            className="generate-btn"
          >
            {loading
              ? 'Loading...'
              : 'Generate Report'}
          </button>

          {(
  centralData.length > 0 ||
  departmentData.length > 0 ||
  otData.length > 0 ||
  anesthesiaData.length > 0 ||
  birthData.length > 0 ||
  fumigationData.length > 0 ||
  sonographyData.length > 0 ||
  billingData ||
  paymentData
) && (
            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >
              🖨 Print Reports
            </button>
            
          )}

        </div> */}

  <div className="button-group">

<button
type="submit"
className="generate-btn"
>
{loading ? "Loading..." : "Generate Report"}
</button>

{(
centralData.length > 0 ||
departmentData.length > 0 ||
otData.length > 0 ||
anesthesiaData.length > 0 ||
birthData.length > 0 ||
fumigationData.length > 0 ||
sonographyData.length > 0 ||
billingData ||
paymentData
) && (

<>

<button
type="button"
className="print-btn"
onClick={handlePrint}
>
🖨 Print
</button>

<button
type="button"
className="print-btn"
onClick={handleDownloadPDF}
>
📄 PDF
</button>

<button
type="button"
className="print-btn"
onClick={handleDownloadExcel}
>
📊 Excel
</button>

</>

)}

</div>
      </form>

      {/* REPORTS */}

      <div ref={printRef}>



        {/* ANESTHESIA */}

{(reportType === 'anesthesia' ||
  reportType === 'all') &&
  anesthesiaData.length > 0 && (

    <>

      <h2>Anesthesia Register</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Patient</th>
            <th>Anesthetist</th>
            <th>Procedure</th>
            <th>Anesthesia Type</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>

        <tbody>

          {anesthesiaData.map((item, index) => (

            <tr key={item._id || index}>

              <td>{item.patient?.name || 'N/A'}</td>

              <td>{item.anesthetist?.name || 'N/A'}</td>

              <td>{item.procedureType|| 'N/A'}</td>

              <td>{item.anesthesiaType || 'N/A'}</td>

              <td>
                {item.induceTime
                  ? new Date(item.induceTime).toLocaleString()
                  : 'N/A'}
              </td>

              <td>
                {item.endTime
                  ? new Date(item.endTime).toLocaleString()
                  : 'N/A'}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </>
)}


{/* BIRTH REGISTER */}

{(reportType === 'birth' ||
  reportType === 'all') &&
  birthData.length > 0 && (

    <>

      <h2>Birth Register</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Patient</th>
            <th>Baby Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Delivery Type</th>
          </tr>
        </thead>

        <tbody>

          {birthData.map((item, index) => (

            <tr key={item._id || index}>

              <td>{item.patientId?.fullName || 'N/A'}</td>

              <td>{item.babyName || 'N/A'}</td>

              <td>{item.gender || 'N/A'}</td>

              <td>
                {item.dobBaby
                  ? new Date(item.dobBaby).toLocaleDateString()
                  : 'N/A'}
              </td>

              <td>{item.deliveryType || 'N/A'}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </>
)}




{(reportType === 'billing' ||
  reportType === 'all') &&
  billingData && (

    <>

      <h2>Billing Summary</h2>

      <h3>
        Grand Total:
        ₹{
          typeof billingData.totalAmount=== 'number'
            ? billingData.totalAmount.toFixed(2)
            : '0.00'
        }
      </h3>

      {/* ITEM BREAKDOWN */}

      <h3>Breakdown by Item Type</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Total Amount</th>
            <th>Count</th>
          </tr>
        </thead>

        <tbody>

          {(billingData.breakdown || []).map(
            (item, index) => (

              <tr key={index}>
                <td>{item.type}</td>
                <td>
                  ₹{
                    typeof item.amount === 'number'
                      ? item.amount.toFixed(2)
                      : '0.00'
                  }
                </td>
                <td>{item.count}</td>
              </tr>

            )
          )}

        </tbody>
      </table>

      {/* PAYMENT STATUS */}

      <h3>Payment Status Breakdown</h3>

      <table className="table">

        <thead>
          <tr>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
        </thead>

        <tbody>

          {(billingData.paymentStatusBreakdown || []).map(
            (status, index) => (

              <tr key={index}>
                <td>{status._id || 'N/A'}</td>
                <td>
                  ₹{
                    typeof status.totalAmount === 'number'
                      ? status.totalAmount.toFixed(2)
                      : '0.00'
                  }
                </td>
                
              </tr>

            )
          )}

        </tbody>
      </table>

      {/* BILL DETAILS */}

      {billingData.bills?.length > 0 && (
        <>

          <h3>Bill Details</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Bill No</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {billingData.bills.map((bill, index) => (

                <tr key={bill._id || index}>

               <td>
  {bill.billId ? bill.billId : (bill.billNumber ? bill.billNumber : bill._id)}
</td>

                  <td>
                    {bill.patient_id_ref?.fullName ||
                      bill.patient?.fullName ||
                      'N/A'}
                  </td>

                  <td>
                    {bill.createdAt
                      ? new Date(
                          bill.createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>

                {/* ₹{
  typeof bill.total_amount === 'number'
    ? bill.total_amount.toFixed(2)
    : '0.00'
} */}

<td>
  ₹{
    typeof bill.total_amount === 'number'
      ? bill.total_amount.toFixed(2)
      : '0.00'
  }
</td>

                  <td>
                    {bill.payment_status || 'N/A'}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </>
      )}

    </>
)}




{(reportType === 'paymentReconciliation' ||
  reportType === 'all') &&
  paymentData && (

    <>

      <h2>Payment Reconciliation</h2>

      <h3>
        Total Received :
        ₹{
          typeof paymentData.totalReceived === 'number'
            ? paymentData.totalReceived.toFixed(2)
            : '0.00'
        }
      </h3>

      {/* METHOD BREAKDOWN */}

      <h3>Payment Method Breakdown</h3>

      <table className="table">

        <thead>
          <tr>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>

          {Object.entries(
            paymentData.methodBreakdown || {}
          ).map(([method, amount], index) => (

            <tr key={index}>
              <td>{method}</td>
              <td>
                ₹{
                  typeof amount === 'number'
                    ? amount.toFixed(2)
                    : Number(amount || 0).toFixed(2)
                }
              </td>
            </tr>

          ))}

        </tbody>

      </table>

      {/* USER BREAKDOWN */}

      <h3>Received By User</h3>

      <table className="table">

        <thead>
          <tr>
            <th>Received By</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>

          {Object.entries(
            paymentData.userBreakdown || {}
          ).map(([user, amount], index) => (

            <tr key={index}>
              <td>{user}</td>
              <td>
                ₹{
                  typeof amount === 'number'
                    ? amount.toFixed(2)
                    : Number(amount || 0).toFixed(2)
                }
              </td>
            </tr>

          ))}

        </tbody>

      </table>

      {/* PAYMENT TRANSACTIONS */}

      {paymentData.payments?.length > 0 && (
        <>

          <h3>Payment Transactions</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Bill No</th>
                <th>Patient</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Received By</th>
              </tr>
            </thead>

            <tbody>

              {paymentData.payments.map(
                (payment, index) => (

                  <tr
                    key={payment._id || index}
                  >

                    <td>
                      {payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleString()
                        : 'N/A'}
                    </td>

                <td>
  {payment.bill_id_ref?.billId ||
    payment.bill_id_ref?.billNumber ||
    payment.bill_id_ref?._id ||
    'N/A'}
</td>

                    <td>
                      {payment.bill_id_ref
                        ?.patient_id_ref
                        ?.fullName ||
                        payment.bill_id_ref
                          ?.patient?.fullName ||
                        'N/A'}
                    </td>

                    <td>
                      {payment.payment_method ||
                        'N/A'}
                    </td>

                    <td>
                      ₹{
                        typeof payment.amount_paid ===
                        'number'
                          ? payment.amount_paid.toFixed(
                              2
                            )
                          : Number(
                              payment.amount_paid || 0
                            ).toFixed(2)
                      }
                    </td>

                    <td>
                      {payment
                        .received_by_user_id_ref
                        ?.name || 'N/A'}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </>
      )}

    </>
)}


{/* FUMIGATION */}

{(reportType === 'fumigation' ||
  reportType === 'all') &&
  fumigationData.length > 0 && (

    <>

      <h2>OT Fumigation Report</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Date</th>
            <th>OT Room</th>
            <th>Performed By</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>

          {fumigationData.map((item, index) => (

            <tr key={item._id || index}>

              <td>
                {new Date(item.date).toLocaleDateString()}
              </td>

              <td>{item.otRoomId?.name || 'N/A'}</td>

              <td>{item.performedBy?.name || 'N/A'}</td>

              <td>{item.remarks || 'N/A'}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </>
)}
        {/* CENTRAL */}

        {(reportType === 'central' ||
          reportType === 'all') &&
          centralData.length > 0 && (
            <>

              <h2>
                Central IPD Register
              </h2>

              <table className="table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Ward</th>
                    <th>Room</th>
                    <th>Bed</th>
                    <th>Admission</th>
                    <th>Discharged Date</th>
                    <th>Total Days</th>

                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {/* {centralData.map((entry) => ( */}


{centralData.map((entry) => {

  const admissionDate = new Date(entry.admissionDate);

  const dischargeDate = entry.actualDischargeDate
    ? new Date(entry.actualDischargeDate)
    : new Date();

  const totalDays =
    Math.max(
      1,
      Math.ceil(
        (dischargeDate - admissionDate) /
        (1000 * 60 * 60 * 24)
      )
    );

  return (


    <tr key={entry._id}>

  <td>
    {entry.patient?.fullName}
  </td>

  <td>
    {entry.doctor?.name}
  </td>

  <td>
    {entry.doctor?.specialty}
  </td>

  <td>
    {entry.ward?.name}
  </td>

  <td>
    {entry.roomCategory?.name}
  </td>

  <td>
    {entry.bedNumber}
  </td>

  <td>
    {new Date(entry.admissionDate).toLocaleDateString()}
  </td>

  <td>
    {entry.actualDischargeDate
      ? new Date(entry.actualDischargeDate).toLocaleDateString()
      : "N/A"}
  </td>

  <td>
    {totalDays} Day{totalDays > 1 ? "s" : ""}
  </td>

  <td>
    {entry.status}
  </td>

</tr>

//                     <tr key={entry._id}>

//                       <td>
//                         {entry.patient?.fullName}
//                       </td>

//                       <td>
//                         {entry.doctor?.name}
//                       </td>

//                       <td>
//                         {entry.doctor?.specialty}
//                       </td>

//                       <td>
//                         {entry.ward?.name}
//                       </td>

//                       <td>
//                         {entry.roomCategory?.name}
//                       </td>

//                       <td>
//                         {entry.bedNumber}
//                       </td>

//                       <td>
//                         {new Date(
//                           entry.admissionDate
//                         ).toLocaleDateString()}

//                          </td>
//                       {/*
//       <td>
//   {entry.actualDischargeDate
//     ? new Date(
//         entry.actualDischargeDate
//       ).toLocaleDateString()
//     : 'N/A'}
// </td>

//                       <td>
//                         {entry.status}
//                       </td> */}


// <td>
//   {entry.actualDischargeDate
//     ? new Date(
//         entry.actualDischargeDate
//       ).toLocaleDateString()
//     : "N/A"}
// </td>

// <td>
//   {totalDays} Day{totalDays > 1 ? "s" : ""}
// </td>

// <td>
//   {entry.status}
// </td>

//                     </tr>

                 


                  );
})}

                </tbody>

              </table>

            </>
          )}

        {/* DEPARTMENT */}

        {(reportType === 'department' ||
          reportType === 'all') &&
          departmentData.length > 0 && (
            <>

              <h2>
                Department Wise IPD
              </h2>

              {/* {departmentData.map((dept) => ( */}

              {departmentData.map((dept, index) => (


                // <div key={dept.departmentId}>
                <div key={dept.departmentId || index}>

                  <h3>
                    {dept.specialty}
                  </h3>

                  <table className="table">

                    <thead>

                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Bed</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {(dept.admissions || []).map(
                        (a) => (

                          <tr key={a._id}>

                            <td>
                              {
                                a.patient
                                  ?.fullName
                              }
                            </td>

                            <td>
                              {
                                a.doctor?.name
                              }
                            </td>

                            <td>
                              {
                                a.bedNumber
                              }
                            </td>

                            <td>
                              {a.status}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ))}

            </>
          )}

        {/* OT */}

        {(reportType === 'ot' ||
          reportType === 'all') &&
          otData.length > 0 && (
            <>

              <h2>
                OT Register
              </h2>

              <table className="table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Procedure</th>
                    <th>Surgeon</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {otData
                  
                  
                  // .map((item) => (

                    .map((item, index) => (

                    // <tr key={item._id}>

                    <tr key={item._id || index}>

                      <td>
                        {
                          item.patient
                            ?.name
                        }
                      </td>

                      <td>
                        {
                          item.procedure
                            ?.name
                        }
                      </td>

                      <td>
                        {
                          item.surgeon
                            ?.name
                        }
                      </td>

                      <td>
                        {new Date(
                          item.scheduledDateTime
                        ).toLocaleString()}
                      </td>

                      <td>
                        {item.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </>
          )}

        {/* SONOGRAPHY */}

        {(reportType === 'sonography' ||
          reportType === 'all') &&
          sonographyData.length > 0 && (
            <>

              <h2>
                Sonography Report
              </h2>

              <table className="table">

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Scan</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {sonographyData.map((s) => (

                    <tr key={s._id}>

                      <td>
                        {new Date(
                          s.createdAt
                        ).toLocaleString()}
                      </td>

                      <td>
                        {
                          s.patientId
                            ?.fullName
                        }
                      </td>

                      <td>
                        {
                          s.doctorId
                            ?.userId?.name
                        }
                      </td>

                      <td>
                        {s.scanType}
                      </td>

                      <td>
                        ₹{s.cost}
                      </td>

                      <td>
                        {s.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </>
          )}

      </div>

      <ToastContainer />

    </div>
  );
};

export default IPDReportPage;