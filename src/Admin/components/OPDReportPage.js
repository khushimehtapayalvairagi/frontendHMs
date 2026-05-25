// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import './OPDReportPage.css';
// // import { toast, ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // const OPDReportPage = () => {
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate, setEndDate] = useState('');
// //   const [departmentId, setDepartmentId] = useState('');
// //   const [departments, setDepartments] = useState([]);
// //   const [centralData, setCentralData] = useState([]);
// //   const [departmentWiseData, setDepartmentWiseData] = useState({});
// //   const [newVsOldData, setNewVsOldData] = useState(null);
// //   const [doctorWiseData, setDoctorWiseData] = useState([]);
// //   const [reportType, setReportType] = useState('central'); // NEW
// // const [hasFetched, setHasFetched] = useState(false);
// //    const BASE_URL = process.env.REACT_APP_BASE_URL;
// //   const token = localStorage.getItem('jwt');
// //   const headers = { Authorization: `Bearer ${token}` };

// //   useEffect(() => {
// //     const fetchDepartments = async () => {
// //       try {
// //         const res = await axios.get(`${BASE_URL}/api/admin/departments`, { headers });
// //         setDepartments(res.data.departments || []);
// //       } catch (err) {
// //         console.error('Failed to fetch departments', err);
// //       }
// //     };
// //     fetchDepartments();
// //   }, []);

// // const handleFetchReports = async () => {
// //    if (!startDate || !endDate) {
// //     toast.warning('Please select start and end dates');
// //     return;
// //   }

// //   const params = { startDate, endDate };
// //   if (departmentId) params.departmentId = departmentId;

// //   try {
// //     setHasFetched(false); // Reset flag while fetching

// // if (reportType === 'central') {
// //   const res = await axios.get(`${BASE_URL}/api/reports/opd-register`, { params, headers });
// //   setCentralData(res.data.consultations || []);
// // }

// // if (reportType === 'department') {
// //   const res = await axios.get(`${BASE_URL}/api/reports/opd-register/department-wise`, { params, headers });
// //   setDepartmentWiseData(res.data.departmentWiseRegister || {});
// // }

// // if (reportType === 'doctor') {
// //   const res = await axios.get(`${BASE_URL}/api/reports/opd-register/doctor-wise`, { params, headers });
// //   setDoctorWiseData(res.data || []);
// // }

// // if (reportType === 'newold') {
// //   const res = await axios.get(`${BASE_URL}/api/reports/opd-register/new-vs-old`, { params, headers });
// //   setNewVsOldData(res.data || null);
// // }


// //     setHasFetched(true); // Set flag after successful fetch

// //   } catch (error) {
// //     console.error('Error fetching reports:', error);
// //      toast.error('Error fetching data. Check console.');
// //   }
// // };



// //   return (
    
// // <div className="opd-report-container">

// //   <h2 style={{
// //     fontSize: '28px',
// //     marginBottom: '20px',
// //     color: '#2c3e50',
// //     borderBottom: '2px solid #4caf50',
// //     paddingBottom: '10px'
// //   }}>📋 OPD Report Dashboard</h2>

  
// //  <div className="opd-form-grid">
// //    <label className="opd-form-label">
// //     Start Date:
// //     <input
// //       type="date"
// //       value={startDate}
// //       onChange={(e) => setStartDate(e.target.value)}
// //        className="opd-form-input"
// //     />
// //   </label>

// //    <label className="opd-form-label">
// //     End Date:
// //     <input
// //       type="date"
// //       value={endDate}
// //       onChange={(e) => setEndDate(e.target.value)}
// //       className="opd-form-input"
// //     />
// //   </label>

// //   <label className="opd-form-label">
// //     Department:
// //     <select
// //       value={departmentId}
// //       onChange={(e) => setDepartmentId(e.target.value)}
// //        className="opd-form-input"
// //     >
// //       <option value="">--All--</option>
// //       {departments.map((dep) => (
// //         <option key={dep._id} value={dep._id}>
// //           {dep.name}
// //         </option>
// //       ))}
// //     </select>
// //   </label>

// //     <label className="opd-form-label">
// //     Report Type:
// //     <select
// //       value={reportType}
// //       onChange={(e) => setReportType(e.target.value)}
// //       className="opd-form-input"
// //     >
// //       <option value="central">Central OPD</option>
// //       <option value="department">Department-wise</option>
// //       <option value="doctor">Doctor-wise</option>
// //       <option value="newold">New vs Old</option>
// //     </select>
// //   </label>

// //    <div className="opd-button-wrapper">
// //     <button onClick={handleFetchReports} className="opd-fetch-button">
// //       Fetch Reports
// //     </button>
// //   </div>
// // </div>


// //       {/* 1. Central OPD */}
// //       {reportType === 'central' &&hasFetched && (
// //         <>
// //           <h3> Central OPD Register</h3>
// //  <table className="opd-table">
// //             <thead>
// //               <tr>
// //                <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
// //                 <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
// //                 <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Doctor</th>
// //                 <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Department</th>
// //                <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {centralData.length === 0 ? (
// //                 <tr><td colSpan="5">No data found.</td></tr>
// //               ) : (
// //                 centralData.map((c, i) => (
// //                   <tr key={i}>
// //                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
// //                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
// //                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.userId?.name || 'N/A'}</td>
// //                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.department?.name || 'N/A'}</td>
// //                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </>
// //       )}

// //       {/* 2. Department-wise OPD */}
// //       {reportType === 'department' &&hasFetched && (
// //         <>
// //           <h3>Department-wise OPD Register</h3>
// //           {Object.keys(departmentWiseData).length === 0 ? (
// //             <p>No department-wise data available.</p>
// //           ) : (
// //             Object.keys(departmentWiseData).map((dept, index) => (
// //               <div key={index} style={{ marginBottom: '30px' }}>
// //                 <h4>{dept}</h4>
// //     <table className="opd-table">
// //                   <thead>
// //                     <tr>
// //                       <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
// //                       <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
// //                       <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Doctor</th>
// //                        <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {departmentWiseData[dept].map((c, i) => (
// //                       <tr key={i}>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.userId?.name || 'N/A'}</td>
// //                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ))
// //           )}
// //         </>
// //       )}

// //       {/* 3. New vs Old */}
// //       {reportType === 'newold' && hasFetched &&(
// //         <>
// //           <h3> New vs Old OPD Patients</h3>
// //           {newVsOldData ? (
// //             <ul>
// //               <li><strong>Total Consultations:</strong> {newVsOldData.totalConsultations}</li>
// //               <li><strong>Unique Patients:</strong> {newVsOldData.uniquePatients}</li>
// //               <li><strong>New Patients:</strong> {newVsOldData.newPatients}</li>
// //               <li><strong>Old Patients:</strong> {newVsOldData.oldPatients}</li>
// //             </ul>
// //           ) : (
// //             <p>No New vs Old patient data available.</p>
// //           )}
// //         </>
// //       )}

// //       {/* 4. Doctor-wise */}
// //       {reportType === 'doctor' && hasFetched &&(
// //         <>
// //           <h3> Doctor-wise OPD Register</h3>
// //           {doctorWiseData.length === 0 ? (
// //             <p>No doctor-wise data available.</p>
// //           ) : (
// //             doctorWiseData.map((entry, index) => (
// //               <div key={index} style={{ marginBottom: '30px' }}>
// //                 <h4>Dr. {entry.doctor.name} ({entry.doctor.specialty}) – Dept: {entry.doctor.department}</h4>
// //                 <p><strong>Total Consultations:</strong> {entry.totalConsultations}</p>
// //     <table className="opd-table">
// //                   <thead>
// //                     <tr>
// //                      <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
// //                     <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
// //                     <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>chiefComplaint</th>
// //                    <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {entry.consultations.map((c, i) => (
// //                       <tr key={i}>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || 'N/A'}</td>
// //                         <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.chiefComplaint || 'N/A'}</td>
// //                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ))
// //           )}
// //         </>
// //       )}
// //       <ToastContainer position="top-right" autoClose={3000} />

// //     </div>
// //   );
// // };

// // export default OPDReportPage;
// // OPDReportPage.js

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './OPDReportPage.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const OPDReportPage = () => {
//   const printRef = useRef();

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [departmentId, setDepartmentId] = useState('');
//   const [departments, setDepartments] = useState([]);

//   const [centralData, setCentralData] = useState([]);
//   const [departmentWiseData, setDepartmentWiseData] = useState({});
//   const [doctorWiseData, setDoctorWiseData] = useState([]);
//   const [newVsOldData, setNewVsOldData] = useState(null);
//   const [sonographyData, setSonographyData] = useState([]);

//   const [reportType, setReportType] = useState('all');
//   const [hasFetched, setHasFetched] = useState(false);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('jwt');

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/admin/departments`,
//         { headers }
//       );

//       setDepartments(res.data.departments || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleFetchReports = async () => {
//     if (!startDate || !endDate) {
//       toast.warning('Please select dates');
//       return;
//     }

//     try {
//       setHasFetched(false);

//       const params = {
//         startDate,
//         endDate,
//       };

//       if (departmentId) {
//         params.departmentId = departmentId;
//       }

//       // CENTRAL
//       if (reportType === 'central' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register`,
//           { params, headers }
//         );

//         setCentralData(res.data.consultations || []);
//       }

//       // DEPARTMENT
//       if (reportType === 'department' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/department-wise`,
//           { params, headers }
//         );

//         setDepartmentWiseData(
//         res.data.specialtyWiseRegister || {}

//         );
//       }

//       // DOCTOR
//       if (reportType === 'doctor' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/doctor-wise`,
//           { params, headers }
//         );

//         setDoctorWiseData(res.data || []);
//       }

//       // NEW VS OLD
//       if (reportType === 'newold' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/new-vs-old`,
//           { params, headers }
//         );

//         setNewVsOldData(res.data || null);
//       }

//       // SONOGRAPHY
//       if (reportType === 'sonography' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/sonography-report`,
//           { params, headers }
//         );

//         setSonographyData(res.data || []);
//       }

//       setHasFetched(true);

//       toast.success('Reports fetched successfully');
//     } catch (error) {
//       console.log(error);
//       toast.error('Error fetching reports');
//     }
//   };

//   // PRINT ALL REPORTS
//   const handlePrint = () => {
//     const printContents = printRef.current.innerHTML;
//     const win = window.open('', '', 'width=1200,height=800');

//     win.document.write(`
//       <html>
//         <head>
//           <title>OPD Reports</title>

//           <style>
//             body{
//               font-family: Arial;
//               padding:20px;
//             }

//             h2,h3,h4{
//               margin-top:25px;
//             }

//             table{
//               width:100%;
//               border-collapse: collapse;
//               margin-top:10px;
//               margin-bottom:30px;
//             }

//             th,td{
//               border:1px solid #000;
//               padding:8px;
//               font-size:12px;
//               text-align:left;
//             }

//             th{
//               background:#f2f2f2;
//             }
//           </style>
//         </head>

//         <body>
//           ${printContents}
//         </body>
//       </html>
//     `);

//     win.document.close();
//     win.focus();
//     win.print();
//     win.close();
//   };

//   return (
//     <div className="opd-report-container">

//       <h2 className="main-heading">
//         📋 OPD Report Dashboard
//       </h2>

//       {/* FILTERS */}

//       <div className="opd-form-grid">

//         <label className="opd-form-label">
//           Start Date

//           <input
//             type="date"
//             className="opd-form-input"
//             value={startDate}
//             onChange={(e) =>
//               setStartDate(e.target.value)
//             }
//           />
//         </label>

//         <label className="opd-form-label">
//           End Date

//           <input
//             type="date"
//             className="opd-form-input"
//             value={endDate}
//             onChange={(e) =>
//               setEndDate(e.target.value)
//             }
//           />
//         </label>

//         <label className="opd-form-label">
//           Department

//           <select
//             className="opd-form-input"
//             value={departmentId}
//             onChange={(e) =>
//               setDepartmentId(e.target.value)
//             }
//           >
//             <option value="">All</option>

//             {departments.map((dep) => (
//               <option
//                 key={dep._id}
//                 value={dep._id}
//               >
//                 {dep.name}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="opd-form-label">
//           Report Type

//           <select
//             className="opd-form-input"
//             value={reportType}
//             onChange={(e) =>
//               setReportType(e.target.value)
//             }
//           >
//             <option value="all">
//               All Reports
//             </option>

//             <option value="central">
//               Central OPD
//             </option>

//             <option value="department">
//               Department Wise
//             </option>

//             <option value="doctor">
//               Doctor Wise
//             </option>

//             <option value="newold">
//               New Vs Old
//             </option>

//             <option value="sonography">
//               Sonography
//             </option>
//           </select>
//         </label>

//       </div>

//       {/* BUTTONS */}

//       <div className="button-row">

//         <button
//           className="fetch-btn"
//           onClick={handleFetchReports}
//         >
//           Fetch Reports
//         </button>

//         {hasFetched && (
//           <button
//             className="print-btn"
//             onClick={handlePrint}
//           >
//             🖨 Print Reports
//           </button>
//         )}
//       </div>

//       {/* REPORT AREA */}

//       <div ref={printRef}>

//         {/* CENTRAL */}

//         {(reportType === 'central' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Central OPD Register
//               </h3>

//               <table className="opd-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Department</th>
//                     <th>Diagnosis</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {centralData.length === 0 ? (
//                     <tr>
//                       <td colSpan="5">
//                         No data found
//                       </td>
//                     </tr>
//                   ) : (
//                     centralData.map((c, i) => (
//                       <tr key={i}>
//                         <td>
//                           {new Date(
//                             c.consultationDateTime
//                           ).toLocaleString()}
//                         </td>

//                         <td>
//                           {c.patientId?.fullName ||
//                             'N/A'}
//                         </td>

//                         <td>
//                           {c.doctorId?.userId?.name ||
//                             'N/A'}
//                         </td>

//                         <td>
//                          {c.doctorId?.specialty?.name}
//                         </td>

//                         <td>
//                           {c.diagnosis || 'N/A'}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </>
//           )}

//         {/* DEPARTMENT */}

//         {(reportType === 'department' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Department Wise Report
//               </h3>

//               {Object.keys(
//                 departmentWiseData
//               ).map((dept, index) => (
//                 <div key={index}>

//                   <h4>{dept}</h4>

//                   <table className="opd-table">

//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Diagnosis</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {departmentWiseData[
//                         dept
//                       ].map((c, i) => (
//                         <tr key={i}>
//                           <td>
//                             {new Date(
//                               c.consultationDateTime
//                             ).toLocaleString()}
//                           </td>

//                           <td>
//                             {c.patientId
//                               ?.fullName || 'N/A'}
//                           </td>

//                           <td>
//                             {c.doctorId?.userId
//                               ?.name || 'N/A'}
//                           </td>

//                           <td>
//                             {c.diagnosis ||
//                               'N/A'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>

//                   </table>
//                 </div>
//               ))}
//             </>
//           )}

//         {/* DOCTOR */}

//         {(reportType === 'doctor' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Doctor Wise Report
//               </h3>

//               {doctorWiseData.map((doc, index) => (
//                 <div key={index}>

//                   <h4>
//                     Dr. {doc.doctor.name}
//                   </h4>

//                   <p>
//                     Total Consultations :
//                     {' '}
//                     {doc.totalConsultations}
//                   </p>

//                   <table className="opd-table">

//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Patient</th>
//                         <th>Complaint</th>
//                         <th>Diagnosis</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {doc.consultations.map(
//                         (c, i) => (
//                           <tr key={i}>
//                             <td>
//                               {new Date(
//                                 c.consultationDateTime
//                               ).toLocaleString()}
//                             </td>

//                             <td>
//                               {c.patientId
//                                 ?.fullName ||
//                                 'N/A'}
//                             </td>

//                             <td>
//                               {c.chiefComplaint ||
//                                 'N/A'}
//                             </td>

//                             <td>
//                               {c.diagnosis ||
//                                 'N/A'}
//                             </td>
//                           </tr>
//                         )
//                       )}
//                     </tbody>

//                   </table>
//                 </div>
//               ))}
//             </>
//           )}

//         {/* NEW OLD */}

//         {(reportType === 'newold' ||
//           reportType === 'all') &&
//           hasFetched &&
//           newVsOldData && (
//             <>
//               <h3>
//                 New Vs Old Patients
//               </h3>

//               <table className="opd-table">
//                 <tbody>
//                   <tr>
//                     <th>
//                       Total Consultations
//                     </th>

//                     <td>
//                       {
//                         newVsOldData.totalConsultations
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>Unique Patients</th>

//                     <td>
//                       {
//                         newVsOldData.uniquePatients
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>New Patients</th>

//                     <td>
//                       {
//                         newVsOldData.newPatients
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>Old Patients</th>

//                     <td>
//                       {
//                         newVsOldData.oldPatients
//                       }
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}

//         {/* SONOGRAPHY */}

//         {(reportType === 'sonography' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Sonography Report
//               </h3>

//               <table className="opd-table">

//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Scan Type</th>
//                     <th>Procedure</th>
//                     <th>Report</th>
//                     <th>Cost</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {sonographyData.length === 0 ? (
//                     <tr>
//                       <td colSpan="8">
//                         No reports found
//                       </td>
//                     </tr>
//                   ) : (
//                     sonographyData.map((s, i) => (
//                       <tr key={i}>

//                         <td>
//                           {new Date(
//                             s.createdAt
//                           ).toLocaleString()}
//                         </td>

//                         <td>
//                           {s.patientId
//                             ?.fullName || 'N/A'}
//                         </td>

//                         <td>
//                           {s.doctorId?.userId
//                             ?.name || 'N/A'}
//                         </td>

//                         <td>
//                           {s.scanType || 'N/A'}
//                         </td>

//                         <td>
//                      {s.procedureType || s.manualChargeId?.itemName || 'N/A'}
//                         </td>

//                         <td>
//                           {s.report || 'N/A'}
//                         </td>

//                         <td>
//                           ₹{s.cost || 0}
//                         </td>

//                         <td>
//                           {s.status ||
//                             'Pending'}
//                         </td>

//                       </tr>
//                     ))
//                   )}
//                 </tbody>

//               </table>
//             </>
//           )}

//       </div>

//       <ToastContainer />

//     </div>
//   );
// };

// export default OPDReportPage;


// OPDReportPage.js

// OPDReportPage.js

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './OPDReportPage.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const OPDReportPage = () => {
//   const printRef = useRef();

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [departmentId, setDepartmentId] = useState('');
//   const [departments, setDepartments] = useState([]);

//   const [centralData, setCentralData] = useState([]);
//   const [departmentWiseData, setDepartmentWiseData] = useState({});
//   const [doctorWiseData, setDoctorWiseData] = useState([]);
//   const [newVsOldData, setNewVsOldData] = useState(null);
//   const [sonographyData, setSonographyData] = useState([]);


//   const [billingSummary, setBillingSummary] =
//   useState(null);

// const [paymentRecon, setPaymentRecon] =
//   useState(null);



//   const [reportType, setReportType] = useState('all');
//   const [hasFetched, setHasFetched] = useState(false);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('jwt');

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/admin/departments`,
//         { headers }
//       );

//       setDepartments(res.data.departments || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleFetchReports = async () => {
//     if (!startDate || !endDate) {
//       toast.warning('Please select dates');
//       return;
//     }

//     try {
//       setHasFetched(false);

//       const params = {
//         startDate,
//         endDate,
//         billType: 'OPD'

//       };

//       if (departmentId) {
//         params.departmentId = departmentId;
//       }

//       // CENTRAL
//       if (reportType === 'central' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register`,
//           { params, headers }
//         );

//         setCentralData(res.data.consultations || []);
//       }

//       // DEPARTMENT
//       if (reportType === 'department' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/department-wise`,
//           { params, headers }
//         );

//         setDepartmentWiseData(
//        res.data.specialtyWiseRegister || {}
//         );
//       }

//       // DOCTOR
//       if (reportType === 'doctor' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/doctor-wise`,
//           { params, headers }
//         );

//         setDoctorWiseData(res.data || []);
//       }

//       // NEW VS OLD
//       if (reportType === 'newold' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/opd-register/new-vs-old`,
//           { params, headers }
//         );

//         setNewVsOldData(res.data || null);
//       }

//       // SONOGRAPHY
//       if (reportType === 'sonography' || reportType === 'all') {
//         const res = await axios.get(
//           `${BASE_URL}/api/reports/sonography-report`,
//           { params, headers }
//         );

//         setSonographyData(res.data || []);
//       }


//        //Billing Summary

//       if (
//   reportType === 'billing' ||
//   reportType === 'all'
// ) {
//   const res = await axios.get(
//     `${BASE_URL}/api/reports/billing-summary`,
//     {
//       params,
//       headers
//     }
//   );

//   setBillingSummary(
//     res.data || null
//   );
// }


//     //Payment Reconciliation

// if (
//   reportType === 'payment' ||
//   reportType === 'all'
// ) {
//   const res = await axios.get(
//     `${BASE_URL}/api/reports/payment-reconciliation`,
//     {
//       params,
//       headers
//     }
//   );

//   setPaymentRecon(
//     res.data || null
//   );
// }







//       setHasFetched(true);

//       toast.success('Reports fetched successfully');
//     } catch (error) {
//       console.log(error);
//       toast.error('Error fetching reports');
//     }
//   };



// // DELETE

// const handleDelete = async (id, api) => {
//   try {

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete?"
//     );

//     if (!confirmDelete) return;

//     await axios.delete(
//       `${BASE_URL}${api}/${id}`,
//       { headers }
//     );

//     toast.success("Deleted Successfully");

//     handleFetchReports();

//   } catch (error) {
//     console.log(error);

//     toast.error("Delete Failed");
//   }
// };



// // EDIT

// const handleEdit = (id, route) => {

//   window.open(
//     `${route}/${id}`,
//     "_blank"
//   );

// };

 
 





//   const handlePrint = () => {
//   const printContents = printRef.current.innerHTML;

//   const win = window.open('', '', 'width=1200,height=800');

//   win.document.write(`
//     <html>
//       <head>
//         <title>OPD Reports</title>

//         <style>
//           body{
//             font-family: Arial, sans-serif;
//             padding:20px;
//             color:#000;
//           }

//           .report-container{
//             width:100%;
//           }

//           .header{
//             text-align:center;
//             border-bottom:3px solid #000;
//             padding-bottom:10px;
//             margin-bottom:15px;
//           }

//           .hospital-title{
//             font-size:22px;
//             font-weight:bold;
//           }

//           .hospital-sub{
//             font-size:13px;
//             margin-top:4px;
//           }

//           .report-title{
//             font-size:18px;
//             margin-top:8px;
//             font-weight:bold;
//           }

//           .date-row{
//             display:flex;
//             justify-content:space-between;
//             margin:15px 0;
//             font-size:14px;
//           }

//           h2,h3,h4{
//             margin-top:20px;
//             margin-bottom:8px;
//           }

//           table{
//             width:100%;
//             border-collapse:collapse;
//             margin-top:10px;
//             margin-bottom:25px;
//           }

//           th,td{
//             border:1px solid #000;
//             padding:8px;
//             font-size:12px;
//             text-align:left;
//           }

//           th{
//             background:#eee;
//             font-weight:bold;
//           }

//           .footer{
//             margin-top:40px;
//             display:flex;
//             justify-content:space-between;
//           }

//           @page{
//             size:A4;
//             margin:15mm;
//           }

//           @media print{
//             body{
//               margin:0;
//             }
//           }
//         </style>
//       </head>

//       <body>

//         <div class="report-container">

//           <div class="header">

//             <div class="hospital-title">
//               Dr. M.I. Jamkhanawala Tibbia Medical College
//             </div>

//             <div class="hospital-sub">
//               Haji Abdul Razzak Kalsekar Tibbia Hospital
//             </div>

//             <div class="hospital-sub">
//               Anjuman-I-Islam Complex, Versova, Mumbai
//             </div>

//             <div class="report-title">
//               OPD REPORT
//             </div>
//           </div>

//           <div class="date-row">
//             <div>
//               <b>From:</b> ${startDate}
//             </div>

//             <div>
//               <b>To:</b> ${endDate}
//             </div>

//             <div>
//               <b>Printed:</b>
//               ${new Date().toLocaleString()}
//             </div>
//           </div>

//           ${printContents}

//           <div class="footer">

//             <div>
//               Generated by Hospital System
//             </div>

//             <div>
//               __________________<br/>
//               Authorized Sign
//             </div>

//           </div>

//         </div>

//       </body>

//       <script>
//         window.onload=function(){
//           window.print();
//           window.close();
//         }
//       </script>

//     </html>
//   `);

//   win.document.close();
// };
//   return (
//     <div className="opd-report-container">

//       <h2 className="main-heading">
//         📋 OPD Report Dashboard
//       </h2>

//       {/* FILTERS */}

//       <div className="opd-form-grid">

//         <label className="opd-form-label">
//           Start Date

//           <input
//             type="date"
//             className="opd-form-input"
//             value={startDate}
//             onChange={(e) =>
//               setStartDate(e.target.value)
//             }
//           />
//         </label>

//         <label className="opd-form-label">
//           End Date

//           <input
//             type="date"
//             className="opd-form-input"
//             value={endDate}
//             onChange={(e) =>
//               setEndDate(e.target.value)
//             }
//           />
//         </label>

//         <label className="opd-form-label">
//           Department

//           <select
//             className="opd-form-input"
//             value={departmentId}
//             onChange={(e) =>
//               setDepartmentId(e.target.value)
//             }
//           >
//             <option value="">All</option>

//             {departments.map((dep) => (
//               <option
//                 key={dep._id}
//                 value={dep._id}
//               >
//                 {dep.name}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="opd-form-label">
//           Report Type

//           <select
//             className="opd-form-input"
//             value={reportType}
//             onChange={(e) =>
//               setReportType(e.target.value)
//             }
//           >
//             <option value="all">
//               All Reports
//             </option>

//             <option value="central">
//               Central OPD
//             </option>

//             <option value="department">
//               Department Wise
//             </option>

//             <option value="doctor">
//               Doctor Wise
//             </option>

//             <option value="newold">
//               New Vs Old
//             </option>

//             <option value="sonography">
//               Sonography
//             </option>


//             <option value="billing">
//   Billing Summary
// </option>

// <option value="payment">
//   Payment Reconciliation
// </option>
//           </select>
//         </label>

//       </div>

//       {/* BUTTONS */}

//       <div className="button-row">

//         <button
//           className="fetch-btn"
//           onClick={handleFetchReports}
//         >
//           Fetch Reports
//         </button>

//         {hasFetched && (
//           <button
//             className="print-btn"
//             onClick={handlePrint}
//           >
//             🖨 Print Reports
//           </button>
//         )}
//       </div>

//       {/* REPORT AREA */}

//       <div ref={printRef}>

//         {/* CENTRAL */}

//         {(reportType === 'central' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Central OPD Register
//               </h3>
// <div className="table-wrapper">

//               <table className="opd-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Department</th>
//                     <th>Diagnosis</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {centralData.length === 0 ? (
//                     <tr>
//                       <td colSpan="5">
//                         No data found
//                       </td>
//                     </tr>
//                   ) : (
//                     centralData.map((c, i) => (
//                       <tr key={i}>
//                         <td>
//                           {new Date(
//                             c.consultationDateTime
//                           ).toLocaleString()}
//                         </td>

//                         <td>
//                           {c.patientId?.fullName ||
//                             'N/A'}
//                         </td>

//                         <td>
//                           {c.doctorId?.userId?.name ||
//                             'N/A'}
//                         </td>

//                         <td>
//                           {c.doctorId?.specialty
//                             ?.name || 'N/A'}
//                         </td>

//                         <td>
//                           {c.diagnosis || 'N/A'}
//                         </td>
//                            <td>

//       <button
//         onClick={() =>
//           handleEdit(
//             c._id,
//             "/edit-opd"
//           )
//         }
//         className="edit-btn"
//       >
//         Edit
//       </button>

//       <button
//         onClick={() =>
//           handleDelete(
//             c._id,
//             "/api/opd"
//           )
//         }
//         className="delete-btn"
//       >
//         Delete
//       </button>

//     </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>

//               </div>
//             </>
//           )}

//         {/* DEPARTMENT */}

//         {(reportType === 'department' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Department Wise Report
//               </h3>

//               {Object.keys(
//                 departmentWiseData
//               ).map((dept, index) => (
//                 <div key={index}>

//                   <h4>{dept}</h4>

//                   <table className="opd-table">

//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Diagnosis</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {departmentWiseData[
//                         dept
//                       ].map((c, i) => (
//                         <tr key={i}>
//                           <td>
//                             {new Date(
//                               c.consultationDateTime
//                             ).toLocaleString()}
//                           </td>

//                           <td>
//                             {c.patientId
//                               ?.fullName || 'N/A'}
//                           </td>

//                           <td>
//                             {c.doctorId?.userId
//                               ?.name || 'N/A'}
//                           </td>

//                           <td>
//                             {c.diagnosis ||
//                               'N/A'}
//                           </td>
//                             <td>

//     <button
//       onClick={() =>
//         handleEdit(
//           c._id,
//           "/edit-opd"
//         )
//       }
//       className="edit-btn"
//     >
//       Edit
//     </button>

//     <button
//       onClick={() =>
//         handleDelete(
//           c._id,
//           "/api/opd"
//         )
//       }
//       className="delete-btn"
//     >
//       Delete
//     </button>

//   </td>
//                         </tr>
//                       ))}
//                     </tbody>

//                   </table>
//                 </div>
//               ))}
//             </>
//           )}

//         {/* DOCTOR */}

//         {(reportType === 'doctor' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Doctor Wise Report
//               </h3>

//               {doctorWiseData.map((doc, index) => (
//                 <div key={index}>

//                   <h4>
//                     Dr. {doc.doctor.name}
//                   </h4>

//                   <p>
//                     Total Consultations :
//                     {' '}
//                     {doc.totalConsultations}
//                   </p>

//                   <table className="opd-table">

//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Patient</th>
//                         <th>Complaint</th>
//                         <th>Diagnosis</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {doc.consultations.map(
//                         (c, i) => (
//                           <tr key={i}>
//                             <td>
//                               {new Date(
//                                 c.consultationDateTime
//                               ).toLocaleString()}
//                             </td>

//                             <td>
//                               {c.patientId
//                                 ?.fullName ||
//                                 'N/A'}
//                             </td>

//                             <td>
//                               {c.chiefComplaint ||
//                                 'N/A'}
//                             </td>

//                             <td>
//                               {c.diagnosis ||
//                                 'N/A'}
//                             </td>
//                              <td>

//     <button
//       onClick={() =>
//         handleEdit(
//           c._id,
//           "/edit-opd"
//         )
//       }
//       className="edit-btn"
//     >
//       Edit
//     </button>

//     <button
//       onClick={() =>
//         handleDelete(
//           c._id,
//           "/api/opd"
//         )
//       }
//       className="delete-btn"
//     >
//       Delete
//     </button>

//   </td>
//                           </tr>
//                         )
//                       )}
//                     </tbody>

//                   </table>
//                 </div>
//               ))}
//             </>
//           )}

//         {/* NEW OLD */}

//         {(reportType === 'newold' ||
//           reportType === 'all') &&
//           hasFetched &&
//           newVsOldData && (
//             <>
//               <h3>
//                 New Vs Old Patients
//               </h3>

//               <table className="opd-table">
//                 <tbody>
//                   <tr>
//                     <th>
//                       Total Consultations
//                     </th>

//                     <td>
//                       {
//                         newVsOldData.totalConsultations
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>Unique Patients</th>

//                     <td>
//                       {
//                         newVsOldData.uniquePatients
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>New Patients</th>

//                     <td>
//                       {
//                         newVsOldData.newPatients
//                       }
//                     </td>
//                   </tr>

//                   <tr>
//                     <th>Old Patients</th>

//                     <td>
//                       {
//                         newVsOldData.oldPatients
//                       }
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}

//         {/* SONOGRAPHY */}

//         {(reportType === 'sonography' ||
//           reportType === 'all') &&
//           hasFetched && (
//             <>
//               <h3>
//                 Sonography Report
//               </h3>

//               <table className="opd-table">

//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Scan Type</th>
//                     <th>Procedure</th>
//                     <th>Report</th>
//                     <th>Cost</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {sonographyData.length === 0 ? (
//                     <tr>
//                       <td colSpan="8">
//                         No reports found
//                       </td>
//                     </tr>
//                   ) : (
//                     sonographyData.map((s, i) => (
//                       <tr key={i}>

//                         <td>
//                           {new Date(
//                             s.createdAt
//                           ).toLocaleString()}
//                         </td>

//                         <td>
//                           {s.patientId
//                             ?.fullName || 'N/A'}
//                         </td>

//                         <td>
//                           {s.doctorId?.userId
//                             ?.name || 'N/A'}
//                         </td>

//                         <td>
//                           {s.scanType || 'N/A'}
//                         </td>

//                         <td>
//                             {s.procedureType || s.manualChargeId?.itemName || 'N/A'}  
//                         </td>

//                         <td>
//                           {s.report || 'N/A'}
//                         </td>

//                         <td>
//                           ₹{s.cost || 0}
//                         </td>

//                         <td>
//                           {s.status ||
//                             'Pending'}
//                         </td>

//                          <td>

//     <button
//       onClick={() =>
//         handleEdit(
//           s._id,
//           "/edit-sonography"
//         )
//       }
//       className="edit-btn"
//     >
//       Edit
//     </button>

//     <button
//       onClick={() =>
//         handleDelete(
//           s._id,
//           "/api/sonography"
//         )
//       }
//       className="delete-btn"
//     >
//       Delete
//     </button>

//   </td>

//                       </tr>
//                     ))
//                   )}
//                 </tbody>

//               </table>
//             </>
//           )}


//          {/* Billing Summary UI */}

//           {(reportType === 'billing' ||
//   reportType === 'all') &&
//   hasFetched &&
//   billingSummary && (
//     <>
//       <h3>Billing Summary</h3>

//       <table className="opd-table">
//         <tbody>
//           <tr>
//             <th>Total Amount</th>

//             <td>
//               ₹
//               {billingSummary.totalAmount ||
//                 0}
//             </td>
//           </tr>

//           {billingSummary
//             .paymentStatusBreakdown?.map(
//               (b, i) => (
//                 <tr key={i}>
//                   <th>
//                     {b._id}
//                   </th>

//                   <td>
//                     ₹
//                     {b.totalAmount}
//                   </td>
//                 </tr>
//               )
//             )}
//         </tbody>
//       </table>
//     </>
//   )}



//        {/* Payment Reconciliation UI */}


//        {(reportType === 'payment' ||
//   reportType === 'all') &&
//   hasFetched &&
//   paymentRecon && (
//     <>
//       <h3>
//         Payment Reconciliation
//       </h3>

//       <table className="opd-table">
//         <tbody>

//           <tr>
//             <th>Total Received</th>

//             <td>
//               ₹
//               {paymentRecon.totalReceived}
//             </td>
//           </tr>

//         </tbody>
//       </table>

//       <h4>
//         Method Breakdown
//       </h4>

//       <table className="opd-table">
//         <thead>
//           <tr>
//             <th>Method</th>
//             <th>Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           {Object.entries(
//             paymentRecon.methodBreakdown ||
//               {}
//           ).map(([k, v], i) => (
//             <tr key={i}>
//               <td>{k}</td>
//               <td>₹{v}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h4>
//         User Collection
//       </h4>

//       <table className="opd-table">
//         <thead>
//           <tr>
//             <th>User</th>
//             <th>Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           {Object.entries(
//             paymentRecon.userBreakdown ||
//               {}
//           ).map(([k, v], i) => (
//             <tr key={i}>
//               <td>{k}</td>
//               <td>₹{v}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h4>
//         Payment List
//       </h4>

//       <table className="opd-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Patient</th>
//             <th>Method</th>
//             <th>Amount</th>
//             <th>Received By</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {paymentRecon.payments?.map(
//             (p, i) => (
//               <tr key={i}>
//                 <td>
//                   {new Date(
//                     p.payment_date
//                   ).toLocaleString()}
//                 </td>

//                 <td>
//                   {p.bill_id_ref
//                     ?.patient_id_ref
//                     ?.fullName || 'N/A'}
//                 </td>

//                 <td>
//                   {p.payment_method}
//                 </td>

//                 <td>
//                   ₹
//                   {p.amount_paid}
//                 </td>

//                 <td>
//                   {p
//                     .received_by_user_id_ref
//                     ?.name || 'N/A'}
//                 </td>
//                  <td>

//     <button
//       onClick={() =>
//         handleEdit(
//           p._id,
//           "/edit-payment"
//         )
//       }
//       className="edit-btn"
//     >
//       Edit
//     </button>

//     <button
//       onClick={() =>
//         handleDelete(
//           p._id,
//           "/api/payments"
//         )
//       }
//       className="delete-btn"
//     >
//       Delete
//     </button>

//   </td>
//               </tr>
//             )
//           )}
//         </tbody>
//       </table>
//     </>
//   )}





//       </div>

//       <ToastContainer />

//     </div>
//   );
// };

// export default OPDReportPage;


// OPDReportPage.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './OPDReportPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OPDReportPage = () => {
  const printRef = useRef();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);

  const [centralData, setCentralData] = useState([]);
  const [departmentWiseData, setDepartmentWiseData] = useState({});
  const [doctorWiseData, setDoctorWiseData] = useState([]);
  const [newVsOldData, setNewVsOldData] = useState(null);
  const [sonographyData, setSonographyData] = useState([]);


  const [billingSummary, setBillingSummary] =
  useState(null);

const [paymentRecon, setPaymentRecon] =
  useState(null);



  const [reportType, setReportType] = useState('all');
  const [hasFetched, setHasFetched] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchDepartments();
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

  const handleFetchReports = async () => {
    if (!startDate || !endDate) {
      toast.warning('Please select dates');
      return;
    }

    try {
      setHasFetched(false);

      const params = {
        startDate,
        endDate,
        billType: 'OPD'

      };

      if (departmentId) {
        params.departmentId = departmentId;
      }

      // CENTRAL
      if (reportType === 'central' || reportType === 'all') {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register`,
          { params, headers }
        );

        setCentralData(res.data.consultations || []);
      }

      // DEPARTMENT
      if (reportType === 'department' || reportType === 'all') {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/department-wise`,
          { params, headers }
        );

        setDepartmentWiseData(
          res.data.specialtyWiseRegister || {}
        );
      }

      // DOCTOR
      if (reportType === 'doctor' || reportType === 'all') {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/doctor-wise`,
          { params, headers }
        );

        setDoctorWiseData(res.data || []);
      }

      // NEW VS OLD
      if (reportType === 'newold' || reportType === 'all') {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/new-vs-old`,
          { params, headers }
        );

        setNewVsOldData(res.data || null);
      }

      // SONOGRAPHY
      if (reportType === 'sonography' || reportType === 'all') {
        const res = await axios.get(
          `${BASE_URL}/api/reports/sonography-report`,
          { params, headers }
        );

        setSonographyData(res.data || []);
      }


       //Billing Summary

      if (
  reportType === 'billing' ||
  reportType === 'all'
) {
  const res = await axios.get(
    `${BASE_URL}/api/reports/billing-summary`,
    {
      params,
      headers
    }
  );

  setBillingSummary(
    res.data || null
  );
}


    //Payment Reconciliation

if (
  reportType === 'payment' ||
  reportType === 'all'
) {
  const res = await axios.get(
    `${BASE_URL}/api/reports/payment-reconciliation`,
    {
      params,
      headers
    }
  );

  setPaymentRecon(
    res.data || null
  );
}







      setHasFetched(true);

      toast.success('Reports fetched successfully');
    } catch (error) {
      console.log(error);
      toast.error('Error fetching reports');
    }
  };

  // PRINT ALL REPORTS
  // const handlePrint = () => {
  //   const printContents = printRef.current.innerHTML;
  //   const win = window.open('', '', 'width=1200,height=800');

  //   win.document.write(`
  //     <html>
  //       <head>
  //         <title>OPD Reports</title>

  //         <style>
  //           body{
  //             font-family: Arial;
  //             padding:20px;
  //           }

  //           h2,h3,h4{
  //             margin-top:25px;
  //           }

  //           table{
  //             width:100%;
  //             border-collapse: collapse;
  //             margin-top:10px;
  //             margin-bottom:30px;
  //           }

  //           th,td{
  //             border:1px solid #000;
  //             padding:8px;
  //             font-size:12px;
  //             text-align:left;
  //           }

  //           th{
  //             background:#f2f2f2;
  //           }
  //         </style>
  //       </head>

  //       <body>
  //         ${printContents}
  //       </body>
  //     </html>
  //   `);

  //   win.document.close();
  //   win.focus();
  //   win.print();
  //   win.close();
  // };



  const handlePrint = () => {
  const printContents = printRef.current.innerHTML;

  const win = window.open('', '', 'width=1200,height=800');

  win.document.write(`
    <html>
      <head>
        <title>OPD Reports</title>

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
            text-align:center;
            border-bottom:3px solid #000;
            padding-bottom:10px;
            margin-bottom:15px;
          }

          .hospital-title{
            font-size:22px;
            font-weight:bold;
          }

          .hospital-sub{
            font-size:13px;
            margin-top:4px;
          }

          .report-title{
            font-size:18px;
            margin-top:8px;
            font-weight:bold;
          }

          .date-row{
            display:flex;
            justify-content:space-between;
            margin:15px 0;
            font-size:14px;
          }

          h2,h3,h4{
            margin-top:20px;
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
          }

          th{
            background:#eee;
            font-weight:bold;
          }

          .footer{
            margin-top:40px;
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
              OPD REPORT
            </div>
          </div>

          <div class="date-row">
            <div>
              <b>From:</b> ${startDate}
            </div>

            <div>
              <b>To:</b> ${endDate}
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

            <div>
              __________________<br/>
              Authorized Sign
            </div>

          </div>

        </div>

      </body>

      <script>
        window.onload=function(){
          window.print();
          window.close();
        }
      </script>

    </html>
  `);

  win.document.close();
};
  return (
    <div className="opd-report-container">

      <h2 className="main-heading">
        📋 OPD Report Dashboard
      </h2>

      {/* FILTERS */}

      <div className="opd-form-grid">

        <label className="opd-form-label">
          Start Date

          <input
            type="date"
            className="opd-form-input"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </label>

        <label className="opd-form-label">
          End Date

          <input
            type="date"
            className="opd-form-input"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        </label>

        <label className="opd-form-label">
          Department

          <select
            className="opd-form-input"
            value={departmentId}
            onChange={(e) =>
              setDepartmentId(e.target.value)
            }
          >
            <option value="">All</option>

            {departments.map((dep) => (
              <option
                key={dep._id}
                value={dep._id}
              >
                {dep.name}
              </option>
            ))}
          </select>
        </label>

        <label className="opd-form-label">
          Report Type

          <select
            className="opd-form-input"
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
          >
            <option value="all">
              All Reports
            </option>

            <option value="central">
              Central OPD
            </option>

            <option value="department">
              Department Wise
            </option>

            <option value="doctor">
              Doctor Wise
            </option>

            <option value="newold">
              New Vs Old
            </option>

            <option value="sonography">
              Sonography
            </option>


            <option value="billing">
  Billing Summary
</option>

<option value="payment">
  Payment Reconciliation
</option>
          </select>
        </label>

      </div>

      {/* BUTTONS */}

      <div className="button-row">

        <button
          className="fetch-btn"
          onClick={handleFetchReports}
        >
          Fetch Reports
        </button>

        {hasFetched && (
          <button
            className="print-btn"
            onClick={handlePrint}
          >
            🖨 Print Reports
          </button>
        )}
      </div>

      {/* REPORT AREA */}

      <div ref={printRef}>

        {/* CENTRAL */}

        {(reportType === 'central' ||
          reportType === 'all') &&
          hasFetched && (
            <>
              <h3>
                Central OPD Register
              </h3>
<div className="table-wrapper">

              <table className="opd-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Diagnosis</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {centralData.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    centralData.map((c, i) => (
                      <tr key={i}>
                        <td>
                          {new Date(
                            c.consultationDateTime
                          ).toLocaleString()}
                        </td>

                        <td>
                          {c.patientId?.fullName ||
                            'N/A'}
                        </td>

                        <td>
                          {c.doctorId?.userId?.name ||
                            'N/A'}
                        </td>

                        <td>
                          {c.doctorId?.specialty
                            ?.name || 'N/A'}
                        </td>

                        <td>
                          {c.diagnosis || 'N/A'}
                        </td>

                        <td>
                         ₹{c.visitPayment || 0}
                        </td>


                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              </div>
            </>
          )}

        {/* DEPARTMENT */}

        {(reportType === 'department' ||
          reportType === 'all') &&
          hasFetched && (
            <>
              <h3>
                Department Wise Report
              </h3>

              {Object.keys(
                departmentWiseData
              ).map((dept, index) => (
                <div key={index}>

                  <h4>{dept}</h4>

                  <table className="opd-table">

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Diagnosis</th>
                        {/* <th>Payment</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {departmentWiseData[
                        dept
                      ].map((c, i) => (
                        <tr key={i}>
                          <td>
                            {new Date(
                              c.consultationDateTime
                            ).toLocaleString()}
                          </td>

                          <td>
                            {c.patientId
                              ?.fullName || 'N/A'}
                          </td>

                          <td>
                            {c.doctorId?.userId
                              ?.name || 'N/A'}
                          </td>

                          <td>
                            {c.diagnosis ||
                              'N/A'}
                          </td>


                          {/* <td>
                                ₹{c.visitPayment || 0}
                          </td> */}


                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              ))}
            </>
          )}

        {/* DOCTOR */}

        {(reportType === 'doctor' ||
          reportType === 'all') &&
          hasFetched && (
            <>
              <h3>
                Doctor Wise Report
              </h3>

              {doctorWiseData.map((doc, index) => (
                <div key={index}>

                  <h4>
                    Dr. {doc.doctor.name}
                  </h4>

                  <p>
                    Total Consultations :
                    {' '}
                    {doc.totalConsultations}
                  </p>

                  <table className="opd-table">

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>ChiefComplaint</th>
                        <th>Diagnosis</th>
                        <th>Payment</th>
                      </tr>
                    </thead>

                    <tbody>
                      {doc.consultations.map(
                        (c, i) => (
                          <tr key={i}>
                            <td>
                              {new Date(
                                c.consultationDateTime
                              ).toLocaleString()}
                            </td>

                            <td>
                              {c.patientId
                                ?.fullName ||
                                'N/A'}
                            </td>

                            <td>
                              {c.chiefComplaint ||
                                'N/A'}
                            </td>

                            <td>
                              {c.diagnosis ||
                                'N/A'}
                            </td>


                            <td>
                                 ₹{c.visitPayment || 0}
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

        {/* NEW OLD */}

        {(reportType === 'newold' ||
          reportType === 'all') &&
          hasFetched &&
          newVsOldData && (
            <>
              <h3>
                New Vs Old Patients
              </h3>

              <table className="opd-table">
                <tbody>
                  <tr>
                    <th>
                      Total Consultations
                    </th>

                    <td>
                      {
                        newVsOldData.totalConsultations
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Unique Patients</th>

                    <td>
                      {
                        newVsOldData.uniquePatients
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>New Patients</th>

                    <td>
                      {
                        newVsOldData.newPatients
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Old Patients</th>

                    <td>
                      {
                        newVsOldData.oldPatients
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

        {/* SONOGRAPHY */}

        {(reportType === 'sonography' ||
          reportType === 'all') &&
          hasFetched && (
            <>
              <h3>
                Sonography Report
              </h3>

              <table className="opd-table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Scan Type</th>
                    <th>Procedure</th>
                    <th>Report</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {sonographyData.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    sonographyData.map((s, i) => (
                      <tr key={i}>

                        <td>
                          {new Date(
                            s.createdAt
                          ).toLocaleString()}
                        </td>

                        <td>
                          {s.patientId
                            ?.fullName || 'N/A'}
                        </td>

                        <td>
                          {s.doctorId?.userId
                            ?.name || 'N/A'}
                        </td>

                        <td>
                          {s.scanType || 'N/A'}
                        </td>

                        <td>
                              {s.procedureType || s.manualChargeId?.itemName || 'N/A'} 
                        </td>

                        <td>
                          {s.report || 'N/A'}
                        </td>

                        <td>
                          ₹{s.cost || 0}
                        </td>

                        <td>
                          {s.status ||
                            'Pending'}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </>
          )}


         {/* Billing Summary UI */}

   {(reportType === 'billing' ||
  reportType === 'all') &&
  billingSummary && (

    <>

      <h2>Billing Summary</h2>

      <h3>
        Grand Total:
        ₹{
          typeof billingSummary.totalAmount=== 'number'
            ? billingSummary.totalAmount.toFixed(2)
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

          {(billingSummary.breakdown || []).map(
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

          {(billingSummary.paymentStatusBreakdown || []).map(
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

      {billingSummary.bills?.length > 0 && (
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

              {billingSummary.bills.map((bill, index) => (

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

                ₹{
  typeof bill.total_amount === 'number'
    ? bill.total_amount.toFixed(2)
    : '0.00'
}

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




       {/* Payment Reconciliation UI */}


       {(reportType === 'payment' ||
  reportType === 'all') &&
  hasFetched &&
  paymentRecon && (
    <>
      <h3>
        Payment Reconciliation
      </h3>

      <table className="opd-table">
        <tbody>

          <tr>
            <th>Total Received</th>

            <td>
              ₹
              {paymentRecon.totalReceived}
            </td>
          </tr>

        </tbody>
      </table>

      <h4>
        Method Breakdown
      </h4>

      <table className="opd-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(
            paymentRecon.methodBreakdown ||
              {}
          ).map(([k, v], i) => (
            <tr key={i}>
              <td>{k}</td>
              <td>₹{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>
        User Collection
      </h4>

      <table className="opd-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(
            paymentRecon.userBreakdown ||
              {}
          ).map(([k, v], i) => (
            <tr key={i}>
              <td>{k}</td>
              <td>₹{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>
        Payment List
      </h4>

      <table className="opd-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Bill NO</th>
            <th>Patient</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Received By</th>
          </tr>
        </thead>

        <tbody>
          {paymentRecon.payments?.map(
            (p, i) => (
              <tr key={i}>
                <td>
                  {new Date(
                    p.payment_date
                  ).toLocaleString()}
                </td>
                                 <td>
  {p.bill_id_ref?.billId ||
    p.bill_id_ref?.billNumber ||
    p.bill_id_ref?._id ||
    'N/A'}
</td>
                <td>
                  {p.bill_id_ref
                    ?.patient_id_ref
                    ?.fullName || 'N/A'}
                </td>

                <td>
                  {p.payment_method}
                </td>

                <td>
                  ₹
                  {p.amount_paid}
                </td>

                <td>
                  {p
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





      </div>

      <ToastContainer />

    </div>
  );
};

export default OPDReportPage;