// // 👇 Full version of CreateBillForm with clear details for receptionist
// import React, { useEffect, useState, useRef } from 'react';

// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useLocation } from 'react-router-dom';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const CreateBillForm = () => {
//    const styles = `
//     /* Hide print-only stuff when not printing */
//     .print-only {
//       display: none !important;
//     }

//     /* Hide screen-only stuff when printing */
//     @media print {
//       .screen-only {
//         display: none !important;
//       }
//       .print-only {
//         display: block !important;
//       }
//     }
//   `;
//   const location = useLocation();
//   const { patientId: passedPatientId, ipdAdmissionId: passedAdmissionId } = location.state || {};
// const [anesthesiaRecords, setAnesthesiaRecords] = useState([]);
// const BASE_URL = process.env.REACT_APP_BASE_URL;
// const printRef = useRef(null);
// const [dailyReports, setDailyReports] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [admissions, setAdmissions] = useState([]);
//   const [manualItems, setManualItems] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [items, setItems] = useState([{ item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);

//   const [visitId, setVisitId] = useState('');
//   const [patientId, setPatientId] = useState(passedPatientId || '');
//   const [ipdAdmissionId, setIpdAdmissionId] = useState(passedAdmissionId || '');
//   const [userId, setUserId] = useState('');
//   useEffect(() => {
//   const fetchAnesthesiaRecords = async () => {
//     if (!patientId) return;
//     const token = localStorage.getItem('jwt');

//     try {
//       // ✅ Step 1: Get procedures
//       const procRes = await axios.get(
//         `${BASE_URL}/api/procedures/schedules/${patientId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const procedures = procRes.data.procedures || [];

//       // ✅ Step 2: Get ALL anesthesia records ONCE
//       const anaRes = await axios.get(
//         `${BASE_URL}/api/procedures/anesthesia-records`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const allRecords = anaRes.data.records || [];

//       // ✅ Step 3: Filter by patient + map correctly
//       const mappedRecords = allRecords
//         .filter(r => r.patientId?._id === patientId) // ✅ correct filtering
//         .map(r => {
//           // find matching procedure
//           const proc = procedures.find(
//             p => p.ipdAdmissionId === r.ipdAdmissionId
//           );

//           return {
//             ...r,
//             procedureName: proc?.procedureId?.name || r.procedureType || 'N/A'
//           };
//         });

//       setAnesthesiaRecords(mappedRecords);

//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to load anesthesia records');
//     }
//   };

//   fetchAnesthesiaRecords();
// }, [patientId]);

// useEffect(() => {
//   if (!ipdAdmissionId) return;
//   const token = localStorage.getItem('jwt');
// console.log("Calling reports API for", ipdAdmissionId);

//   axios.get(`${BASE_URL}/api/ipd/reports/${ipdAdmissionId}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   .then(res => setDailyReports(res.data.reports || []))
//   .catch(() => toast.error('Failed to load daily reports'));
// }, [ipdAdmissionId]);
//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     const user = JSON.parse(localStorage.getItem('user'));
//     setUserId(user?.id);

//     axios.get(`${BASE_URL}/api/billing/manual-charge-items`, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(res => setManualItems(res.data.items))
//       .catch(() => toast.error('Failed to load manual charge items'));
//   }, []);

// useEffect(() => {
//   const token = localStorage.getItem('jwt');
//   if (!patientId) return;

//   axios.get(`${BASE_URL}/api/procedures/schedules/${patientId}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   }).then(res => {

//     const allProcedures = res.data.procedures || [];

//     console.log("All Procedures 👉", allProcedures);

//     const completedNotBilled = allProcedures.filter(p => {
//       const status = p.status?.toLowerCase();
//       return status === 'completed' && !p.isBilled;
//     });

//     // ✅ SET DATA
//     setSchedules(completedNotBilled);

//     // ✅ 🎯 TOAST CONDITIONS

//     if (allProcedures.length === 0) {
//       toast.warning('⚠ No procedures found for this patient');
//     } 
//     else if (completedNotBilled.length === 0) {

//       const hasIncomplete = allProcedures.some(
//         p => p.status?.toLowerCase() !== 'completed'
//       );

//       const allBilled = allProcedures.every(
//         p => p.isBilled === true
//       );

//       if (hasIncomplete) {
//         toast.info('ℹ️ Procedure not completed yet. Only completed procedures can be billed.');
//       } 
//       else if (allBilled) {
//         toast.warning('⚠ All procedures are already billed');
//       } 
//       else {
//         toast.warning('⚠ No procedures available for billing');
//       }
//     }

//   }).catch((err) => {
//     console.error(err);
//     toast.error('Failed to load procedures');
//   });

// }, [patientId]);

//   useEffect(() => {
//     const token = localStorage.getItem('jwt');

//     const fetchAdmittedPatients = async () => {
//       try {
//         const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const allPatients = patientRes.data.patients;
//         const admittedPatients = [];

//         for (const patient of allPatients) {
//           const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });

//           const admissions = res.data.admissions || [];
//           if (admissions.some(adm => adm.status === 'Admitted')) {
//             admittedPatients.push(patient);
//           }
//         }

//         setPatients(admittedPatients);
//       } catch (error) {
//         toast.error('Failed to load admitted patients');
//       }
//     };

//     fetchAdmittedPatients();
//   }, []);

//   useEffect(() => {
//     if (!patientId) return;
//     const token = localStorage.getItem('jwt');
//     axios.get(`${BASE_URL}/api/ipd/admissions/${patientId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(res => {
//       const admitted = res.data.admissions.filter(a => a.status === 'Admitted');
//       setAdmissions(admitted);
//     }).catch(() => toast.error('Failed to load admissions'));
//   }, [patientId]);

//   const handleChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = value;

//     if (field === 'item_source_id') {
//       const type = updated[index].item_type;

//       if (type === 'Manual') {
//         const selected = manualItems.find(m => m._id === value);
//         updated[index].unit_price = selected?.defaultPrice || '';
//         updated[index].description = selected?.itemName || '';
//       }

//       if (type === 'ProcedureSchedule') {
//         const selected = schedules.find(s => s._id === value);
//         updated[index].unit_price = selected?.procedureId?.cost || '';
//         updated[index].description = `${selected?.procedureType} - ${selected?.procedureId?.name}` || '';
//       }
//     }

//     setItems(updated);
//   };

//   const addItem = () => {
//     setItems([...items, { item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);
//   };

//   const removeItem = (index) => {
//     if (items.length === 1) return;
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!patientId || !ipdAdmissionId || !userId) {
//       toast.error('Required patient/admission/visit/user info missing');
//       return;
//     }

//     const cleanedItems = items.map(it => {
//       const copy = { ...it };
//       if (!copy.item_source_id) delete copy.item_source_id;
//       copy.quantity = Number(copy.quantity);
//       if (copy.unit_price) copy.unit_price = Number(copy.unit_price);
//       return copy;
//     });

//     const payload = {
//       patient_id_ref: patientId,
//       // visit_id_ref: visitId,
//       ipd_admission_id_ref: ipdAdmissionId,
//       generated_by_user_id: userId,
//       items: cleanedItems
//     };

//    try {
//   const token = localStorage.getItem('jwt');
//   await axios.post(`${BASE_URL}/api/billing/bills`, payload, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   toast.success('Bill created successfully!');
// } catch (err) {
//  const errorMessage = err.response?.data?.message;
// if (errorMessage === 'This procedure has already been billed.') {
//   toast.error('⚠️ This procedure has already been billed.');
// } else if (errorMessage === 'No daily report record found.') {
//   toast.error('📋 No daily report record found.');
// } else {
//   toast.error(errorMessage || 'Error creating bill');
// }
// }

//   };
// const handlePrint = () => {
//   const patientName = patients.find(p => p._id === patientId)?.fullName || "N/A";
//   const doctorName = admissions.find(a => a._id === ipdAdmissionId)?.admittingDoctorId?.userId?.name || "N/A";
//   const admitDate = admissions.find(a => a._id === ipdAdmissionId)?.admitDate || "N/A";
//   const billDate = new Date().toLocaleDateString();
//   const total = items.reduce((sum, it) => sum + (it.quantity * (it.unit_price || 0)), 0);

//   const billLayout = `
//     <div style="padding: 2rem; font-size: 14px;">
//       <div style="text-align: center; margin-bottom: 1rem;">
//         <h2>Dr. M.I. Jamkhanawala Tibbia Unani Medical College <br/>
//           & Haji Abdul Razzak Kalsekar Tibbia Hospital</h2>
//         <p>Anjuman-I-Islam Complex, Yari Road, Versova, Andheri(W), Mumbai 400 061.</p>
//         <p>Tel: 26321032 / 25361199 / 26351188</p>
//       </div>

//       <table style="width: 100%; margin-bottom: 1rem;">
//         <tbody>
//           <tr>
//             <td><strong>Patient:</strong> ${patientName}</td>
//             <td><strong>Bill No:</strong> AutoGen-001</td>
//           </tr>
//           <tr>
//             <td><strong>Doctor:</strong> ${doctorName}</td>
//             <td><strong>Bill Date:</strong> ${billDate}</td>
//           </tr>
//           <tr>
//             <td><strong>Refer Dr:</strong> N/A</td>
//             <td><strong>Admit On:</strong> ${admitDate}</td>
//           </tr>
//         </tbody>
//       </table>

//       <table style="width: 100%; border-collapse: collapse;" border="1">
//         <thead>
//           <tr>
//             <th>Particular</th>
//             <th>Days/Qty</th>
//             <th>Rate</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${items.map(it => `
//             <tr>
//               <td>${it.description}</td>
//               <td>${it.quantity}</td>
//               <td>${it.unit_price}</td>
//               <td>${(it.quantity * it.unit_price) || 0}</td>
//             </tr>
//           `).join("")}
//         </tbody>
//       </table>

//       <div style="margin-top: 2rem; text-align: right;">
//         <strong>Total: ₹${total}</strong>
//       </div>
//     </div>
//   `;

//   const newWindow = window.open('', '', 'width=900,height=700');
//   newWindow.document.write(`
//     <html>
//       <head>
//         <title>Patient Bill</title>
//         <style>${styles}</style>
//       </head>
//       <body>
//         ${billLayout}
//       </body>
//     </html>
//   `);
//   newWindow.document.close();
//   newWindow.print();
// };



//  return (
//     <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#fafafa', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
//     <div ref={printRef} style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#fafafa', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
//      <style>{styles}</style>
//       <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Patient Bill</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Patient Select */}
// {/* Patient Select */}
// <div style={{ marginBottom: '1.2rem' }}>
//   <label style={{ display: 'block', marginBottom: '5px' }}>Patient</label>

//   {/* On screen */}
//   <select
//     className="screen-only"
//     value={patientId}
//     onChange={e => setPatientId(e.target.value)}
//     required
//     style={{ width: '100%', padding: '8px' }}
//   >
//     <option value="">-- Select Patient --</option>
//     {patients.map(p => (
//       <option key={p._id} value={p._id}>{p.fullName}</option>
//     ))}
//   </select>

//   {/* For print */}
//   <p className="print-only">
//     {patients.find(p => p._id === patientId)?.fullName || 'N/A'}
//   </p>
// </div>



//         {/* Admission Select */}
//       {/* Admission Select */}
// {admissions.length > 0 && (
//   <div style={{ marginBottom: '1.2rem' }}>
//     <label style={{ display: 'block', marginBottom: '5px' }}>Admission</label>

//     <select
//       className="screen-only"
//       value={ipdAdmissionId}
//       onChange={e => {
//         setIpdAdmissionId(e.target.value);
//         const adm = admissions.find(a => a._id === e.target.value);
//          setVisitId(adm?.visitId?._id || '');
//       }}
//       required
//       style={{ width: '100%', padding: '8px' }}
//     >
//       <option value="">-- Select Admission --</option>
//       {admissions.map(a => (
//         <option key={a._id} value={a._id}>
//           {a.wardId?.name} (Bed {a.bedNumber})
//         </option>
//       ))}
//     </select>

//     <p className="print-only">
//       {admissions.find(a => a._id === ipdAdmissionId)?.wardId?.name || 'N/A'} 
//       (Bed {admissions.find(a => a._id === ipdAdmissionId)?.bedNumber || 'N/A'})
//     </p>
//   </div>
// )}


//         {/* Doctor + Room */}
//         {ipdAdmissionId && (
//           <div style={{ background: '#f2f2f2', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem', lineHeight: '1.6' }}>
//             {(() => {
//               const adm = admissions.find(a => a._id === ipdAdmissionId);
//               return adm && (
//                 <>
//                   <p><strong>Doctor:</strong> {adm.admittingDoctorId?.userId?.name || 'N/A'
// }</p>
//                   <p><strong>Room Category:</strong> {adm.roomCategoryId?.name || 'N/A'}</p>
//                 </>
//               );
//             })()}
//           </div>
//         )}

//         {/* Daily Reports */}
//         {dailyReports.length > 0 && (
//           <div style={{ background: '#e0f7fa', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
//             <h4 style={{ marginBottom: '10px' }}>Latest Progress Report</h4>
//             <p><strong>Date:</strong> {new Date(dailyReports[0].reportDateTime).toLocaleString()}</p>
//             <ul style={{ paddingLeft: '20px' }}>
//               <li>Temperature: {dailyReports[0].vitals?.temperature || 'N/A'}</li>
//               <li>Pulse: {dailyReports[0].vitals?.pulse || 'N/A'}</li>
//               <li>BP: {dailyReports[0].vitals?.bp || 'N/A'}</li>
//               <li>Respiratory Rate: {dailyReports[0].vitals?.respiratoryRate || 'N/A'}</li>
//             </ul>
//           </div>
//         )}

//         {ipdAdmissionId && dailyReports.length === 0 && (
//           <div style={{ background: '#fff3cd', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
//             No progress reports found for this admission.
//           </div>
//         )}

//         {/* Anesthesia Records */}
//         {anesthesiaRecords.length > 0 && (
//           <div style={{ background: '#e8f5e9', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
//             <h4 style={{ marginBottom: '10px' }}>Anesthesia Records</h4>
//             {anesthesiaRecords.map((rec, i) => (
//               <div key={i} style={{ marginBottom: '0.5rem' }}>
//                 <p><strong>Procedure:</strong> {rec.procedureName || 'N/A'}</p>
//                 <p><strong>Anesthetist:</strong> {rec.anestheticId?.userId?.name || 'N/A'}</p>
//                 <p><strong>Anesthesia:</strong> {rec.anesthesiaName} ({rec.anesthesiaType})</p>
//                 <p><strong>Medicines Used:</strong> {rec.medicinesUsedText || 'N/A'}</p>
//                 <hr />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Bill Items */}
//       {/* Billing Items */}
// <h3 style={{ marginTop: '2rem' }}>Billing Items</h3>
// {items.map((item, index) => (
//   <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', background: '#fff' }}>
    
//     {/* Type Select */}
//   <div style={{ marginBottom: '0.8rem' }}>
//   <label>Type</label>

//   {/* Screen dropdown (only visible on screen) */}
//   <select
//     className="screen-only"
//     value={item.item_type}
//     onChange={e => handleChange(index, 'item_type', e.target.value)}
//     required
//     style={{ width: '100%', padding: '8px' }}
//   >
//     <option value="">Select Type</option>
//     <option value="ProcedureSchedule">Procedure Schedule</option>
//     <option value="Manual">Manual Charge</option>
//     <option value="Open">Open Charge</option>
//   </select>

//   {/* Print-only fallback (shows selected value in PDF/print) */}
//   <p className="print-only">
//     {item.item_type || "N/A"}
//   </p>
// </div>


//     {/* Manual Items */}
//  {item.item_type === 'Manual' && (
//   <div style={{ marginBottom: '0.8rem' }}>
//     <label>Select Item</label>
//     {manualItems.length > 0 ? (
//       <>
//         {/* Screen view */}
//         <select
//           className="screen-only"
//           value={item.item_source_id}
//           onChange={e => handleChange(index, 'item_source_id', e.target.value)}
//           required
//           style={{ width: '100%', padding: '8px' }}
//         >
//           <option value="">Select Manual Item</option>
//           {manualItems.map(mi => (
//             <option key={mi._id} value={mi._id}>
//               {mi.itemName} – ₹{mi.defaultPrice}
//             </option>
//           ))}
//         </select>

//         {/* Print view */}
//         <p className="print-only">
//           {manualItems.find(mi => mi._id === item.item_source_id)?.itemName || 'N/A'} – ₹
//           {manualItems.find(mi => mi._id === item.item_source_id)?.defaultPrice || '0'}
//         </p>
//       </>
//     ) : (
//       <p style={{ color: "red" }}>⚠ No manual charge items available</p>
//     )}
//   </div>
// )}


//     {/* Procedure Schedules */}
//     {item.item_type === 'ProcedureSchedule' && (
//       <div style={{ marginBottom: '0.8rem' }}>
//         <label>Select Procedure</label>
//         {schedules.length > 0 ? (
//           <select
//             className="screen-only"
//             value={item.item_source_id}
//             onChange={e => handleChange(index, 'item_source_id', e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           >
//             <option value="">Select Procedure</option>
//             {schedules.map(s => (
//               <option key={s._id} value={s._id}>
//                 {s.procedureId?.name} – ₹{s.procedureId?.cost} ({s.surgeonId?.userId?.name})
//               </option>
//             ))}
//           </select>
//         ) : (
//           <p style={{ color: "red" }}>⚠ No procedures available for billing</p>
//         )}
//       </div>
//     )}

//     {/* Open Charge */}
//     {item.item_type === 'Open' && (
//       <>
//         <input
//           type="text"
//           placeholder="Description"
//           value={item.description}
//           onChange={e => handleChange(index, 'description', e.target.value)}
//           required
//           style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
//         />
//         <input
//           type="number"
//           placeholder="Unit Price"
//           value={item.unit_price}
//           onChange={e => handleChange(index, 'unit_price', e.target.value)}
//           required
//           style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
//         />
//       </>
//     )}

//     {/* Quantity */}
//     <input
//       type="number"
//       placeholder="Quantity"
//       value={item.quantity}
//       onChange={e => handleChange(index, 'quantity', e.target.value)}
//       required
//       style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
//     />

//     <button
//       type="button"
//       onClick={() => removeItem(index)}
//       style={{ padding: '6px 12px', background: '#ff6961', color: '#fff', border: 'none', borderRadius: '4px' }}
//     >
//       Remove
//     </button>
//   </div>
// ))}


//         <button type="button" onClick={addItem} style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', marginRight: '10px' }}>
//           + Add Item
//         </button>

//         <button type="submit" style={{ padding: '10px 15px', background: 'green', color: '#fff', border: 'none', borderRadius: '6px' }}>
//           Create Bill
//         </button>
//         <button
//   type="button"
//   onClick={handlePrint}
//   className="screen-only"
//   style={{
//     padding: "10px 15px",
//     background: "#6c63ff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     marginLeft: "10px",
//   }}
// >
//   🖨 Print Bill
// </button>

//       </form>

 

//       </div>
//        <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default CreateBillForm;


// 👇 Full version of CreateBillForm with clear details for receptionist
// 👇 Full version of CreateBillForm with clear details for receptionist
import React, { useEffect, useState, useRef } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateBillForm = () => {
    const thStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '10px'
  };

  const styles = `
.print-only{
  display:none;
}

@media print{
  body{
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  table{
    width:100%;
    border-collapse:collapse;
  }

  th,td{
    border:1px solid #000 !important;
    padding:8px;
    font-size:12px;
  }

  .print-only{
    display:block !important;
  }

  .screen-only{
    display:none !important;
  }

  button{
    display:none !important;
  }
}
`;
  const location = useLocation();
  const { patientId: passedPatientId, ipdAdmissionId: passedAdmissionId } = location.state || {};
const [anesthesiaRecords, setAnesthesiaRecords] = useState([]);

const [sonographyRecords, setSonographyRecords] = useState([]);


const BASE_URL = process.env.REACT_APP_BASE_URL;
const printRef = useRef(null);


const prescriptionRef = useRef(null);

const [dischargePatient, setDischargePatient] = useState(false);
const [dailyReports, setDailyReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [items, setItems] = useState([{ item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);

  const [visitId, setVisitId] = useState('');


  const [visits, setVisits] = useState([]); // 👈 YAHAN
     const [dischargeDate, setDischargeDate] = useState('');

  const [consultations, setConsultations] = useState([]);
      const [billData, setBillData] = useState(null);
       const [paymentForm, setPaymentForm] = useState({
  amount: '',
  method: 'Cash',
  externalRef: ''
});

const [payments, setPayments] = useState([]);

const [paymentError, setPaymentError] = useState('');
  const latestConsultation = consultations[0];

  const [patientId, setPatientId] = useState(passedPatientId || '');
  const [ipdAdmissionId, setIpdAdmissionId] = useState(passedAdmissionId || '');
  const [userId, setUserId] = useState('');

  useEffect(() => {
  const fetchAnesthesiaRecords = async () => {
    if (!patientId) return;
    const token = localStorage.getItem('jwt');

    try {
      // ✅ Step 1: Get procedures
      const procRes = await axios.get(
        `${BASE_URL}/api/procedures/schedules/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const procedures = procRes.data.procedures || [];

      // ✅ Step 2: Get ALL anesthesia records ONCE
      const anaRes = await axios.get(
        `${BASE_URL}/api/procedures/anesthesia-records`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allRecords = anaRes.data.records || [];

      // ✅ Step 3: Filter by patient + map correctly
      const mappedRecords = allRecords
        .filter(r => r.patientId?._id === patientId) // ✅ correct filtering
        .map(r => {
          // find matching procedure
          const proc = procedures.find(
            p => p.ipdAdmissionId === r.ipdAdmissionId
          );

          return {
            ...r,
            procedureName: proc?.procedureId?.name || r.procedureType || 'N/A'
          };
        });

      setAnesthesiaRecords(mappedRecords);

    } catch (error) {
      console.error(error);
      toast.error('Failed to load anesthesia records');
    }
  };

  fetchAnesthesiaRecords();
}, [patientId]);// 👈 anesthesia ka end




// ✅ 👉 ISKE JUST NEECHHE YE DALNA HAI
useEffect(() => {
  const fetchSonographyRecords = async () => {
    if (!patientId) return;

    const token = localStorage.getItem("jwt");

    try {
      const res = await axios.get(
        `${BASE_URL}/api/sonography/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const records = res.data || [];

      const mapped = records.map(r => ({
        ...r,
        scanName: r.scanType || "N/A"
      }));

      setSonographyRecords(mapped);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load sonography records");
    }
  };

  fetchSonographyRecords();
}, [patientId]);



// const [sonographyRecords, setSonographyRecords] = useState([]);
useEffect(() => {
  if (sonographyRecords.length === 0) return;

  setItems(prev => {
    const existingIds = prev.map(i => i.item_source_id);

    const newItems = sonographyRecords
      .filter(rec => !existingIds.includes(rec._id))
      .map(rec => ({
        item_type: "Sonography",
        item_source_id: rec._id,
        description: `Sonography - ${rec.scanType}`,
        quantity: 1,
        unit_price: rec.cost || 0
      }));

    return [...prev, ...newItems];
  });

}, [sonographyRecords]);

useEffect(() => {
  if (!ipdAdmissionId) return;
  const token = localStorage.getItem('jwt');
console.log("Calling reports API for", ipdAdmissionId);

  axios.get(`${BASE_URL}/api/ipd/reports/${ipdAdmissionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setDailyReports(res.data.reports || []))
  .catch(() => toast.error('Failed to load daily reports'));
}, [ipdAdmissionId]);



  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));
    setUserId(user?.id);

    axios.get(`${BASE_URL}/api/billing/manual-charge-items`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setManualItems(res.data.items))
      .catch(() => toast.error('Failed to load manual charge items'));
  }, []);

useEffect(() => {
  const token = localStorage.getItem('jwt');
  if (!patientId) return;

  axios.get(`${BASE_URL}/api/procedures/schedules/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {

    const allProcedures = res.data.procedures || [];

    console.log("All Procedures 👉", allProcedures);

    const completedNotBilled = allProcedures.filter(p => {
      const status = p.status?.toLowerCase();
      return status === 'completed' && !p.isBilled;
    });

    // ✅ SET DATA
    setSchedules(completedNotBilled);

    // ✅ 🎯 TOAST CONDITIONS

    if (allProcedures.length === 0) {
      toast.warning('⚠ No procedures found for this patient');
    } 
    else if (completedNotBilled.length === 0) {

      const hasIncomplete = allProcedures.some(
        p => p.status?.toLowerCase() !== 'completed'
      );

      const allBilled = allProcedures.every(
        p => p.isBilled === true
      );

      if (hasIncomplete) {
        toast.info('ℹ️ Procedure not completed yet. Only completed procedures can be billed.');
      } 
      else if (allBilled) {
        toast.warning('⚠ All procedures are already billed');
      } 
      else {
        toast.warning('⚠ No procedures available for billing');
      }
    }

  }).catch((err) => {
    console.error(err);
    toast.error('Failed to load procedures');
  });

}, [patientId]);




useEffect(() => {
  const fetchPatients = async () => {

    try {

      const token = localStorage.getItem('jwt');

      const patientRes = await axios.get(
        `${BASE_URL}/api/receptionist/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const allPatients =
        patientRes.data.patients || [];

      const updatedPatients = [];

      for (const patient of allPatients) {

        try {

          const admRes = await axios.get(
            `${BASE_URL}/api/ipd/admissions/${patient._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const admissions =
            admRes.data.admissions || [];

          // ✅ ACTIVE IPD
          const activeAdmission =
            admissions.find(
              a =>
                a.status === "Admitted"
            );

          // ✅ DISCHARGED
          const dischargedAdmission =
            admissions.find(
              a =>
                a.status === "Discharged"
            );

          // ==========================
          // ACTIVE IPD
          // ==========================

          if (activeAdmission) {

            updatedPatients.push({
              ...patient,
              patientType: "IPD",
              status: "Admitted"
            });

          }

          // ==========================
          // DISCHARGED
          // HIDE FROM LIST
          // ==========================

          else if (dischargedAdmission) {

            // ❌ skip patient

          }

          // ==========================
          // NORMAL OPD
          // ==========================

          else {

            updatedPatients.push({
              ...patient,
              patientType: "OPD",
              status: "Active"
            });

          }

        } catch (err) {

          updatedPatients.push({
            ...patient,
            patientType: "OPD",
            status: "Active"
          });

        }

      }

      setPatients(updatedPatients);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load patients");

    }

  };

  fetchPatients();

}, [BASE_URL]);


// ✅ FETCH OPD VISITS
useEffect(() => {
  if (!patientId) return;

  const token = localStorage.getItem('jwt');

  axios.get(
    `${BASE_URL}/api/receptionist/visits/${patientId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(res => {

    const allVisits =
      res.data.visits || res.data || [];

    // ✅ ONLY COMPLETED VISITS
    const completedVisits =
      allVisits.filter(
        v =>
          v.status?.toLowerCase() === "completed"
      );

    // ✅ SHOW ALL COMPLETED
    setVisits(completedVisits);

    // ✅ AUTO SELECT
    if (
      completedVisits.length > 0 &&
      !ipdAdmissionId
    ) {
      setVisitId(
        completedVisits[0]._id
      );
    }

    // ✅ NO VISITS
    if (
      completedVisits.length === 0
    ) {
      toast.warning(
        "No completed visits found"
      );
    }

  })
  .catch(err => {
    console.error(err);

    toast.error(
      "Failed to load OPD visits"
    );
  });

}, [patientId, ipdAdmissionId, BASE_URL]);

useEffect(() => {
  if (!visitId) return;

  const token = localStorage.getItem("jwt");

  axios.get(
    `${BASE_URL}/api/doctor/opd-consultations/visit/${visitId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(res => {
    setConsultations(res.data.consultations || []);
  })
  .catch(err => {
    console.error(err);
    toast.error("Failed to load consultation report");
  });

}, [visitId]);


  // 🔽 EXISTING CODE (is ke baad)
useEffect(() => {
  if (!patientId) return;

  const token = localStorage.getItem('jwt');

  axios.get(`${BASE_URL}/api/ipd/admissions/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {

    const allAdmissions = res.data.admissions || [];

    // ✅ ONLY ACTIVE ADMISSIONS
    const activeAdmissions = allAdmissions.filter(
      a => a.status?.toLowerCase() === "admitted"
    );

    setAdmissions(activeAdmissions);

  })
  .catch(() => toast.error('Failed to load admissions'));

}, [patientId]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'item_source_id') {
      const type = updated[index].item_type;

      if (type === 'Manual') {
        const selected = manualItems.find(m => m._id === value);
        updated[index].unit_price = selected?.defaultPrice || '';
        updated[index].description = selected?.itemName || '';
      }

      if (type === 'ProcedureSchedule') {
        const selected = schedules.find(s => s._id === value);
        updated[index].unit_price = selected?.procedureId?.cost || '';
        updated[index].description = `${selected?.procedureType} - ${selected?.procedureId?.name}` || '';
      }


      if (type === 'OPDConsultation') {

  const selected = consultations.find(
    c => c._id === value
  );

  updated[index].unit_price = 300;

  updated[index].description =
    `OPD Consultation - ${
      selected?.doctorId?.userId?.name || 'Doctor'
    }`;
}

      // ✅ SONOGRAPHY ADD (IMPORTANT)
if (type === 'Sonography') {
  const selected = sonographyRecords.find(s => s._id === value);
  updated[index].unit_price = selected?.cost || '';
  updated[index].description = `Sonography - ${selected?.scanType}` || '';
}

    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };



useEffect(() => {

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantity || 0) *
          Number(item.unit_price || 0)),
      0
    );

  setPaymentForm(prev => ({
    ...prev,
    amount: total
  }));

}, [items]);

 const handleSubmit = async (e) => {

  e.preventDefault();

  if (!patientId || !userId) {
    toast.error('Required info missing');
    return;
  }

  if (!ipdAdmissionId && !visitId) {
    toast.error('Select IPD Admission OR OPD Visit');
    return;
  }

  // ✅ PAYMENT VALIDATION
  // if (!paymentForm.amount) {
  //   toast.error('Enter payment amount');
  //   return;
  // }

  const cleanedItems = items.map(it => {

    const copy = { ...it };

    if (!copy.item_source_id)
      delete copy.item_source_id;

    copy.quantity = Number(copy.quantity);

    if (copy.unit_price)
      copy.unit_price = Number(copy.unit_price);

    return copy;

  });
console.log({
  dischargePatient,
  dischargeDate
});
  // ✅ NEW COMBINED PAYLOAD
 console.log({
  dischargePatient,
  dischargeDate
});
const user = JSON.parse(localStorage.getItem('user'));
setUserId(user?._id || user?.id);
const payload = {

  patient_id_ref: patientId,

  generated_by_user_id: userId,

  visit_id_ref: visitId || null,

  ipd_admission_id_ref:
    ipdAdmissionId || null,

  items: cleanedItems,

  // dischargePatient,

  // discharge_date:
  //   dischargeDate || null,

  amount_paid:
    Number(paymentForm.amount),

  payment_method:
    paymentForm.method,

  external_reference_number:
    paymentForm.externalRef || "",

 received_by_user_id_ref: userId
};

  try {

    const token =
      localStorage.getItem('jwt');

    // ✅ NEW API
    const res = await axios.post(

      `${BASE_URL}/api/billing/bill-with-payment`,

      payload,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // ✅ SET BILL
    setBillData(res.data.bill);

    // ✅ SET PAYMENT HISTORY
    setPayments([
      res.data.payment
    ]);

//     const updatedAdmissions = await axios.get(
//   `${BASE_URL}/api/ipd/admissions/${patientId}`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   }
// );

// setAdmissions(updatedAdmissions.data.admissions || []);


    // ✅ UPDATE PAYMENT FORM
   setPaymentForm({
  amount: res.data.bill.total_amount || '',
  method: 'Cash',
  externalRef: ''
});

    // ✅ SUCCESS TOAST
    toast.success(
      'Bill + Payment created successfully ✅'
    );

  } catch (err) {

    console.error(err);

    const errorMessage =
      err.response?.data?.message;

    if (
      errorMessage ===
      'This procedure has already been billed.'
    ) {

      toast.error(
        '⚠️ This procedure has already been billed.'
      );

    }

    else if (
      errorMessage ===
      'This consultation already billed.'
    ) {

      toast.error(
        '⚠️ Consultation already billed.'
      );

    }

    else if (
      errorMessage ===
      'This scan already billed.'
    ) {

      toast.error(
        '⚠️ Sonography already billed.'
      );

    }

    else {

      toast.error(
        errorMessage ||
        'Error creating bill'
      );

    }
  }
};
      // ================= PAYMENT HANDLE =================

const handlePaymentChange = (e) => {
  const { name, value } = e.target;

  setPaymentForm(prev => ({
    ...prev,
    [name]: value
  }));
};


const handlePrint = () => {
const selectedAdmission = admissions.find(
  a => a._id === ipdAdmissionId
);
 
const selectedPatient = patients.find(
  p => p._id === patientId
);

const selectedVisit = visits.find(
  v => v._id === visitId
);
  const printContents = printRef.current.innerHTML;

  const win = window.open('', '', 'width=1200,height=800');

  win.document.write(`
    <html>
      <head>
        <title>Patient Bill & Payment</title>

        <style>
          body{
            font-family: Arial, sans-serif;
            padding:20px;
            color:#000;
          }

          h1,h2,h3,h4{
            margin-bottom:10px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
          }

          th,td{
            border:1px solid #ccc;
            padding:8px;
            text-align:left;
          }

          th{
            background:#1976d2;
            color:white;
          }

          input,
          select,
          button{
            border:none !important;
            outline:none !important;
            background:none !important;
          }

          .screen-only{
            display:none !important;
          }

          .print-only{
            display:block !important;
          }

          @media print{
            .screen-only{
              display:none !important;
            }

            .print-only{
              display:block !important;
            }

            body{
              -webkit-print-color-adjust: exact;
            }
          }
        </style>

      </head>

      <body>

        <div style="text-align:center;margin-bottom:20px;">
          <h1>🏥 Hospital Bill & Payment Receipt</h1>

          <h2>
            Dr. M.I. Jamkhanawala Tibbia Unani Medical College
          </h2>

          <p>
            Haji Abdul Razzak Kalsekar Tibbia Hospital
          </p>
        </div>

        ${printContents}



      </body>
    </html>
  `);

  win.document.close();

  win.focus();

  setTimeout(() => {
    win.print();
  }, 500);
};

 return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#fafafa', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
    <div ref={printRef} style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#fafafa', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
     <style>{styles}</style>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Patient Bill</h2>
      <form onSubmit={handleSubmit}>
        {/* Patient Select */}
{/* Patient Select */}
<div style={{ marginBottom: '1.2rem' }}>
  <label style={{ display: 'block', marginBottom: '5px' }}>Patient</label>

  {/* On screen */}
  <select
    className="screen-only"
    value={patientId}
    onChange={e => setPatientId(e.target.value)}
    required
    style={{ width: '100%', padding: '8px' }}
  >
    <option value="">-- Select Patient --</option>
    {patients.map(p => (
      // <option key={p._id} value={p._id}>{p.fullName}</option>

    <option key={p._id} value={p._id}>
  {p.fullName} |
  {p.gender} |
  {p.patientType} |

  {p.billingStatus === "Billed"
    ? "✅ Billed"
    : "🟡 Unbilled"}
</option>
    ))}
  </select>

  {/* For print */}
  <p className="print-only">
    {patients.find(p => p._id === patientId)?.fullName || 'N/A'}
  </p>
</div>



{/* OPD VISIT SELECT */}
<div style={{ marginBottom: '1rem' }}>
  <label>Select OPD Visit</label>

  <select
    className="screen-only"
    value={visitId}
    onChange={(e) => {
      setVisitId(e.target.value);
    }}
    style={{
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc'
    }}
  >
    <option value="">-- Select OPD Visit --</option>

    {visits.map(v => (
      <option key={v._id} value={v._id}>
        Dr. {v.assignedDoctorId?.userId?.name || "N/A"} |
        {v.visitDate
          ? new Date(v.visitDate).toLocaleDateString()
          : "N/A"}
      </option>
    ))}
  </select>

  {/* PRINT VIEW (IMPORTANT FIX) */}
  <p className="print-only" style={{ marginTop: '5px' }}>
    {visits.find(v => v._id === visitId)
      ? `Dr. ${visits.find(v => v._id === visitId)?.assignedDoctorId?.userId?.name || "N/A"} | ${
          visits.find(v => v._id === visitId)?.visitDate
            ? new Date(visits.find(v => v._id === visitId).visitDate).toLocaleDateString()
            : "N/A"
        }`
      : "N/A"}
  </p>
</div>


      {/* Admission Select */}
{admissions.length > 0 && (
  <div style={{ marginBottom: '1.2rem' }}>
    <label style={{ display: 'block', marginBottom: '5px' }}>Admission</label>

    <select
      className="screen-only"
      value={ipdAdmissionId}
      onChange={e => {
        setIpdAdmissionId(e.target.value);
        const adm = admissions.find(a => a._id === e.target.value);
         setVisitId(adm?.visitId?._id || '');
      }}
      required
      style={{ width: '100%', padding: '8px' }}
    >
      <option value="">-- Select Admission --</option>
      {admissions.map(a => (
        <option key={a._id} value={a._id}>
          {a.wardId?.name} (Bed {a.bedNumber})
        </option>
      ))}
    </select>

    <p className="screen-only">
      {admissions.find(a => a._id === ipdAdmissionId)?.wardId?.name || 'N/A'} 
      (Bed {admissions.find(a => a._id === ipdAdmissionId)?.bedNumber || 'N/A'})
    </p>
  </div>
)}


        {/* Doctor + Room + OPD Details */}

{(ipdAdmissionId || visitId) && (
  <div
    style={{
      background: '#f2f2f2',
      padding: '10px 15px',
      borderRadius: '6px',
      marginBottom: '1rem',
      lineHeight: '1.6'
    }}
  >
    {(() => {

      const adm = admissions.find(
        a => a._id === ipdAdmissionId
      );

      const visit = visits.find(
        v => v._id === visitId
      );

      return (
        <>

         

        </>
      );
    })()}
  </div>
)}




{/* ================= PATIENT SUMMARY ================= */}

{patientId && (() => {

  const patient = patients.find(
    p => p._id === patientId
  );

  const visit = visits.find(
    v => v._id === visitId
  );

  const adm = admissions.find(
    a => a._id === ipdAdmissionId
  );

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dcdcdc",
        borderRadius: "10px",
        padding: "18px",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}
    >

      <h3
        style={{
          marginBottom: "1rem",
          color: "#1976d2"
        }}
      >
        Patient Summary
      </h3>

      {/* BASIC INFO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "12px"
        }}
      >

        <div>
          <strong>Patient Name:</strong><br />
          {patient?.fullName || "N/A"}
        </div>

        <div>
          <strong>Patient Type:</strong><br />
          <span
            style={{
              color:
                patient?.patientType === "IPD"
                  ? "red"
                  : "green",
              fontWeight: "bold"
            }}
          >
            {patient?.patientType || "N/A"}
          </span>
        </div>

        <div>
          <strong>Gender:</strong><br />
          {patient?.gender || "N/A"}
        </div>

        <div>
          <strong>Phone:</strong><br />
         {patient?.contactNumber || "N/A"}
        </div>

      </div>

      <hr style={{ margin: "1rem 0" }} />

      {/* OPD DETAILS */}

      {visit && (
        <>
          <h4 style={{ color: "#2e7d32" }}>
            OPD Visit Details
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "12px"
            }}
          >

            <div>
          
                <strong>OPD Doctor:</strong>{" "}
                {visit.assignedDoctorId?.userId?.name || 'N/A'}
            

            </div>

            <div>
              <strong>Visit Date:</strong><br />
              {
                visit.visitDate
                  ? new Date(
                      visit.visitDate
                    ).toLocaleString()
                  : "N/A"
              }
            </div>

            <div>
              <strong>Visit Status:</strong><br />


  <span
    style={{
      color: visit.payment?.isPaid ? "green" : "red",
      fontWeight: "bold"
    }}
  >
    {visit.payment?.isPaid
      ? `Paid ₹${visit.payment?.paidAmount || visit.payment?.amount || 0}`
      : `Unpaid ₹${
          (visit.payment?.amount || 0) -
          (visit.payment?.paidAmount || 0)
        }`}
  </span>
            
            </div>

            <div>
              <strong>Consultation:</strong><br />

              {
                visit.status || "Pending"
              }
            </div>

          </div>

          <hr style={{ margin: "1rem 0" }} />
        </>
      )}

      {/* IPD DETAILS */}

      {adm && (
        <>
          <h4 style={{ color: "#c62828" }}>
            IPD Admission Details
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "12px"
            }}
          >

            <div>
              <strong>Admitting Doctor:</strong><br />
              {
                adm.admittingDoctorId?.userId
                  ?.name || "N/A"
              }
            </div>

            <div>
              <strong>Ward:</strong><br />
              {adm.wardId?.name || "N/A"}
            </div>

            <div>
              <strong>Room Category:</strong><br />
              {
                adm.roomCategoryId?.name ||
                "N/A"
              }
            </div>

            <div>
              <strong>Bed Number:</strong><br />
              {adm.bedNumber || "N/A"}
            </div>

          <div>
  <strong>Admission Date:</strong><br />
  {
    adm?.admissionDate ||
    adm?.createdAt ||
    adm?.admittedAt
      ? new Date(
          adm?.admissionDate ||
          adm?.createdAt ||
          adm?.admittedAt
        ).toLocaleString()
      : "N/A"
  }
</div>
        
{/* <div>
  <strong>Discharge Date:</strong><br />

  {
    admissions.find(
      a => a._id === ipdAdmissionId
    )?.actualDischargeDate

      ? new Date(
          admissions.find(
            a => a._id === ipdAdmissionId
          ).actualDischargeDate
        ).toLocaleString()

      : "N/A"
  }
</div> */}

          </div>

          <hr style={{ margin: "1rem 0" }} />
        </>
      )}

      {/* SONOGRAPHY STATUS */}

      {sonographyRecords.length > 0 && (
        <>
          <h4 style={{ color: "#1565c0" }}>
            Sonography Status
          </h4>

          {sonographyRecords.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px"
              }}
            >
              <p>
                <strong>Scan:</strong>{" "}
                {s.scanType}
              </p>

              <p>
                <strong>Doctor:</strong>{" "}
                {s.doctorId?.userId?.name ||
                  "N/A"}
              </p>

              <p>
                <strong>Payment:</strong>{" "}

                <span
                  style={{
                    color:
                      s.paymentStatus === "Paid"
                        ? "green"
                        : "red",
                    fontWeight: "bold"
                  }}
                >
                  {s.paymentStatus || "Unpaid"}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {s.status || "Pending"}
              </p>
            </div>
          ))}

          <hr style={{ margin: "1rem 0" }} />
        </>
      )}

    </div>
  );

})()}






{/* CONSULTATION REPORT */}

{consultations.length > 0 && (
  <div
    style={{
      background: "#fff",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "1rem",
      border: "1px solid #ddd"
    }}
  >
    <h3 style={{ color: "#1976d2" }}>
      OPD Consultation Report
    </h3>

    {consultations.map((c) => (
      <div
        key={c._id}
        style={{
          marginBottom: "1rem",
          padding: "10px",
          background: "#f9f9f9",
          borderRadius: "6px"
        }}
      >
        <p>
          <strong>Chief Complaint:</strong>{" "}
          {c.chiefComplaint || "N/A"}
        </p>

        <p>
          <strong>Diagnosis:</strong>{" "}
          {c.diagnosis || "N/A"}
        </p>

        <p>
          <strong>Doctor Notes:</strong>{" "}
          {c.doctorNotes || "N/A"}
        </p>

        <p>
          <strong>Medicines:</strong>{" "}
          {c.medicinesPrescribedText || "N/A"}
        </p>

        <p>
          <strong>Lab Tests:</strong>{" "}
          {c.labInvestigationsSuggested?.join(", ") || "N/A"}
        </p>

        <p>
          <strong>Doctor:</strong>{" "}
          {c.doctorId?.userId?.name || "N/A"}
        </p>
      </div>
    ))}
  </div>
)}



        {/* Daily Reports */}
        {dailyReports.length > 0 && (
          <div style={{ background: '#e0f7fa', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '10px' }}>Latest Progress Report</h4>
            <p><strong>Date:</strong> {new Date(dailyReports[0].reportDateTime).toLocaleString()}</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Temperature: {dailyReports[0].vitals?.temperature || 'N/A'}</li>
              <li>Pulse: {dailyReports[0].vitals?.pulse || 'N/A'}</li>
              <li>BP: {dailyReports[0].vitals?.bp || 'N/A'}</li>
              <li>Respiratory Rate: {dailyReports[0].vitals?.respiratoryRate || 'N/A'}</li>
            </ul>
          </div>
        )}

        {ipdAdmissionId && dailyReports.length === 0 && (
          <div   className="screen-only" style={{ background: '#fff3cd', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            No progress reports found for this admission.
          </div>
        )}

        {/* Anesthesia Records */}
        {anesthesiaRecords.length > 0 && (
          <div style={{ background: '#e8f5e9', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '10px' }}>Anesthesia Records</h4>
            {anesthesiaRecords.map((rec, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <p><strong>Procedure:</strong> {rec.procedureName || 'N/A'}</p>
                <p><strong>Anesthetist:</strong> {rec.anestheticId?.userId?.name || 'N/A'}</p>
                <p><strong>Anesthesia:</strong> {rec.anesthesiaName} ({rec.anesthesiaType})</p>
                <p><strong>Medicines Used:</strong> {rec.medicinesUsedText || 'N/A'}</p>
                <hr />
              </div>
            ))}
          </div>
        )}



        {/* ✅ Sonography Records */}

        {/* ✅ Sonography Records (NEW - SAME STYLE) */}
{sonographyRecords.length > 0 && (
  <div style={{ background: '#e3f2fd', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
    <h4 style={{ marginBottom: '10px' }}>Sonography Records</h4>

    {sonographyRecords.map((rec, i) => (
      <div key={i} style={{ marginBottom: '0.5rem' }}>
        <p><strong>Scan Type:</strong> {rec.scanType || 'N/A'}</p>
        <p><strong>Status:</strong> {rec.status || 'N/A'}</p>
        <p><strong>Cost:</strong> ₹{rec.cost || 0}</p>
        <p><strong>Report:</strong> {rec.report || 'N/A'}</p>



        <p>
  <strong>Payment Status:</strong>{" "}
  {rec.paymentStatus || "N/A"}
</p>

<p>
  <strong>Manual Charge:</strong>{" "}
  {rec.manualChargeId?.itemName || "N/A"}
</p>
        <p>
          <strong>Date:</strong>{" "}
          {rec.performedDate
            ? new Date(rec.performedDate).toLocaleString()
            : 'N/A'}
        </p>
        <hr />
      </div>
    ))}
  </div>
)}

      {/* Billing Items */}
<h3 style={{ marginTop: '2rem' }}>Billing Items</h3>
{items.map((item, index) => (
  <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', background: '#fff' }}>
    
    {/* Type Select */}
  <div style={{ marginBottom: '0.8rem' }}>
  <label>Type</label>

  {/* Screen dropdown (only visible on screen) */}
  <select
    className="screen-only"
    value={item.item_type}
    onChange={e => handleChange(index, 'item_type', e.target.value)}
    required
    style={{ width: '100%', padding: '8px' }}
  >
    <option value="">Select Type</option>
    <option value="ProcedureSchedule">Procedure Schedule</option>
    <option value="Manual">Manual Charge</option>
    <option value="Open">Open Charge</option>
    <option value="Sonography">Sonography</option>

    {/* <option value="OPDConsultation">OPD Consultation</option> */}
  </select>

  {/* Print-only fallback (shows selected value in PDF/print) */}
  <p className="print-only">
    {item.item_type || "N/A"}
  </p>
</div>





    {/* Manual Items */}
 {item.item_type === 'Manual' && (
  <div style={{ marginBottom: '0.8rem' }}>
    <label>Select Item</label>
    {manualItems.length > 0 ? (
      <>
        {/* Screen view */}
        <select
          className="screen-only"
          value={item.item_source_id}
          onChange={e => handleChange(index, 'item_source_id', e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">Select Manual Item</option>
          {manualItems.map(mi => (
            <option key={mi._id} value={mi._id}>
              {mi.itemName} – ₹{mi.defaultPrice}
            </option>
          ))}
        </select>

        {/* Print view */}
        <p className="print-only">
          {manualItems.find(mi => mi._id === item.item_source_id)?.itemName || 'N/A'} – ₹
          {manualItems.find(mi => mi._id === item.item_source_id)?.defaultPrice || '0'}
        </p>
      </>
    ) : (
      <p style={{ color: "red" }}>⚠ No manual charge items available</p>
    )}
  </div>
)}
 {/* Sonography Records */}
{item.item_type === 'Sonography' && (
  <div style={{ marginBottom: '0.8rem' }}>
    <label>Select Sonography</label>

    {sonographyRecords.length > 0 ? (
      <select
        className="screen-only"
        value={item.item_source_id}
        onChange={e =>
          handleChange(index, 'item_source_id', e.target.value)
        }
        required
        style={{ width: '100%', padding: '8px' }}
      >
        <option value="">Select Sonography</option>


{sonographyRecords.map(s => (
  <option key={s._id} value={s._id}>
    {s.patientId?.fullName || "N/A"} |
    {s.scanType || "N/A"} |
    ₹{s.cost || 0} |
    {s.paymentStatus || "N/A"} |
    {s.manualChargeId?.itemName || "N/A"}
  </option>
))}
        {/* {sonographyRecords.map(s => (
          <option key={s._id} value={s._id}>
            {s.scanType} – ₹{s.cost}
          </option>
        ))} */}
      </select>
    ) : (
      <p style={{ color: "red" }}>
        ⚠ No sonography records found
      </p>
    )}
  </div>
)}

{/* ✅ Sonography Details Show */}
{item.item_type === 'Sonography' && item.item_source_id && (() => {

  const selectedSono = sonographyRecords.find(
    s => s._id === item.item_source_id
  );

  if (!selectedSono) return null;

  return (
    <div
      style={{
        background: '#f5f5f5',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '1rem',
        lineHeight: '1.7'
      }}
    >
      <p>
        <strong>👤 Patient:</strong>{" "}
        {selectedSono.patientId?.fullName || 'N/A'}
      </p>

      <p>
        <strong>🧪 Scan:</strong>{" "}
        {selectedSono.scanType || 'N/A'}
      </p>

      <p>
        <strong>💰 Cost:</strong> ₹
        {selectedSono.cost || 0}
      </p>

      <p>
        <strong>💳 Payment:</strong>{" "}
        {selectedSono.paymentStatus || 'N/A'}
      </p>

      <p>
        <strong>🧾 Manual Charge:</strong>{" "}
        {selectedSono.manualChargeId?.itemName || 'N/A'}
      </p>

      <p>
        <strong>📝 Report:</strong>{" "}
        {selectedSono.report || 'N/A'}
      </p>

      <p>
        <strong>📅 Date:</strong>{" "}
        {selectedSono.performedDate
          ? new Date(selectedSono.performedDate).toLocaleString()
          : 'N/A'}
      </p>
    </div>
  );

})()}

    {item.item_type === 'ProcedureSchedule' && (
      <div style={{ marginBottom: '0.8rem' }}>
        <label>Select Procedure</label>
        {schedules.length > 0 ? (
          <select
            className="screen-only"
            value={item.item_source_id}
            onChange={e => handleChange(index, 'item_source_id', e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Procedure</option>
            {schedules.map(s => (
              <option key={s._id} value={s._id}>
                {s.procedureId?.name} – ₹{s.procedureId?.cost} ({s.surgeonId?.userId?.name})
              </option>
            ))}
          </select>
        ) : (
          <p style={{ color: "red" }}>⚠ No procedures available for billing</p>
        )}
      </div>
    )}

    {/* Open Charge */}
    {item.item_type === 'Open' && (
      <>
        <input
          type="text"
          placeholder="Description"
          value={item.description}
          onChange={e => handleChange(index, 'description', e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={item.unit_price}
          onChange={e => handleChange(index, 'unit_price', e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
        />
      </>
    )}

    {/* Quantity */}
    <input
      type="number"
      placeholder="Quantity"
      value={item.quantity}
      onChange={e => handleChange(index, 'quantity', e.target.value)}
      required
      style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
    />

    <button
      type="button"
      onClick={() => removeItem(index)}
      style={{ padding: '6px 12px', background: '#ff6961', color: '#fff', border: 'none', borderRadius: '4px' }}
    >
      Remove
    </button>
  </div>
))}
{/* ================= BILL SUMMARY TABLE ================= */}
<h3 style={{ marginTop: '2rem' }}>Bill Summary</h3>

<table
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    background: '#fff',
    border: '1px solid #ddd'
  }}
>
  <thead>
    <tr style={{ background: '#f2f2f2' }}>
      <th style={thStyle}>#</th>
      <th style={thStyle}>Item</th>
      <th style={thStyle}>Qty</th>
      <th style={thStyle}>Rate</th>
      <th style={thStyle}>Amount</th>
    </tr>
  </thead>

  <tbody>
    {items.map((item, i) => {
      let name = 'N/A';
      let rate = 0;

      if (item.item_type === 'Manual') {
        const found = manualItems.find(m => m._id === item.item_source_id);
        name = found?.itemName || 'Manual Item';
        rate = found?.defaultPrice || 0;
      }

      if (item.item_type === 'Open') {
        name = item.description || 'Open Charge';
        rate = Number(item.unit_price || 0);
      }

      if (item.item_type === 'ProcedureSchedule') {
        const found = schedules.find(s => s._id === item.item_source_id);
        name = found?.procedureId?.name || 'Procedure';
        rate = found?.procedureId?.cost || 0;
      }

      if (item.item_type === 'Sonography') {
        const found = sonographyRecords.find(s => s._id === item.item_source_id);
        name = found?.scanType || 'Sonography';
        rate = found?.cost || 0;
      }

      const qty = Number(item.quantity || 0);
      const amount = qty * rate;

      return (
        <tr key={i}>
          <td style={tdStyle}>{i + 1}</td>
          <td style={tdStyle}>{name}</td>
          <td style={tdStyle}>{qty}</td>
          <td style={tdStyle}>₹{rate}</td>
          <td style={tdStyle}>₹{amount}</td>
        </tr>
      );
    })}
  </tbody>
</table>

{/* ================= TOTAL CALCULATION ================= */}
{(() => {
  let total = 0;

  items.forEach(item => {
    let rate = 0;

    if (item.item_type === 'Manual') {
      const found = manualItems.find(m => m._id === item.item_source_id);
      rate = found?.defaultPrice || 0;
    }

    if (item.item_type === 'Open') {
      rate = Number(item.unit_price || 0);
    }

    if (item.item_type === 'ProcedureSchedule') {
      const found = schedules.find(s => s._id === item.item_source_id);
      rate = found?.procedureId?.cost || 0;
    }

    if (item.item_type === 'Sonography') {
      const found = sonographyRecords.find(s => s._id === item.item_source_id);
      rate = found?.cost || 0;
    }

    total += rate * Number(item.quantity || 0);
  });

  const paidAmount = Number(paymentForm.amount || 0);
  const balance = total - paidAmount;

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fafafa' }}>
      <p><b>Total Amount:</b> ₹{total}</p>

      <p><b>Paid Amount:</b> ₹{paidAmount}</p>

      <p style={{ color: balance > 0 ? 'red' : 'green' }}>
        <b>Balance Due:</b> ₹{balance}
      </p>
    </div>
  );
})()}

        <button type="button" onClick={addItem} style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', marginRight: '10px' }}>
          + Add Item
        </button>
           {/* ================= PAYMENT SECTION ================= */}

<div
  style={{
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #ddd'
  }}
>
  <h3
    style={{
      marginBottom: '1rem',
      color: '#1976d2'
    }}
  >
    Payment Details
  </h3>

  {/* Amount */}
  <div style={{ marginBottom: '1rem' }}>
    <label
      style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: 'bold'
      }}
    >
      Amount
    </label>

    <input
      type="number"
      name="amount"
      value={paymentForm.amount}
      onChange={handlePaymentChange}
      placeholder="Enter amount"
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc'
      }}
    />
  </div>

  {/* Payment Method */}
  <div style={{ marginBottom: '1rem' }}>
    <label
      style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: 'bold'
      }}
    >
      Payment Method
    </label>

    <select
      name="method"
      value={paymentForm.method}
      onChange={handlePaymentChange}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc'
      }}
    >
      <option value="Cash">Cash</option>
      <option value="UPI">UPI</option>
    </select>
    
  </div>

  {/* UPI Reference */}
  {paymentForm.method === 'UPI' && (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold'
        }}
      >
        UPI Reference Number
      </label>

      <input
        type="text"
        name="externalRef"
        value={paymentForm.externalRef}
        onChange={handlePaymentChange}
        placeholder="Enter UPI Ref No."
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  )}

  {/* Print Payment Info */}
 <div
  style={{
    background: '#fff',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '10px'
  }}
>
  <p>
    <strong>Payment Method:</strong>{" "}
    {paymentForm.method}
  </p>

 <p>
  <strong>Received By:</strong>{" "}
  {payments[0]?.received_by_user_id_ref?.name || "N/A"}
</p>



  {paymentForm.method === 'UPI' && (
    <p>
      <strong>UPI Ref No:</strong>{" "}
      {paymentForm.externalRef || "N/A"}
    </p>
  )}
</div>
</div>

       
        
     {/* ================= DISCHARGE OPTION ================= */}

 {/* {ipdAdmissionId && (
  <div
    className="screen-only"
    style={{
      marginTop: '1rem',
      padding: '1rem',
      background: '#fff3cd',
      borderRadius: '10px',
      border: '1px solid #ffeeba'
    }}
  >
    <h3 style={{ marginBottom: '1rem', color: '#c62828' }}>
      Discharge Settings
    </h3>

    {/* Status */}
    {/* <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold'
        }}
      >
        Patient Status
      </label>

     <select
  value={dischargePatient ? 'Discharged' : 'Admitted'}
  onChange={(e) =>
    setDischargePatient(
      e.target.value === 'Discharged'
    )
  }
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  }}
>
  <option value="Admitted">
    Admitted
  </option>

  <option value="Discharged">
    Discharged
  </option>
</select>
    </div>

    {/* Date */}
    {/* {dischargePatient && (
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: 'bold'
          }}
        >
          Discharge Date
        </label>

       <input
  type="datetime-local"
  required={dischargePatient}
  value={dischargeDate}
  onChange={(e) =>
    setDischargeDate(e.target.value)
  }
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  }}
/>
      </div>
    )}
  </div>
)}  */}
 <button type="submit" style={{ padding: '10px 15px', background: 'green', color: '#fff', border: 'none', borderRadius: '6px' }}>
       Submit Bill & Payment
        </button>
     <button
  type="button"
  onClick={handlePrint}
  className="screen-only"
  style={{
    padding: "10px 15px",
    background: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginLeft: "10px",
  }}
>
  🖨 🖨 Print Bill & Payment
</button>

      </form>

 

      </div>
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateBillForm;

