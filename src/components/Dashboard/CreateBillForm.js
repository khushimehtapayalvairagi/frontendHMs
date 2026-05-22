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
// ✅ CREATE BILL + PAYMENT MERGED COMPONENT
// ✅ Kuch bhi remove nahi kiya
// ✅ Payment form same component me add kiya
// ✅ Bill + Payment dono ek sath print honge

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const CreateBillForm = () => {

  const location = useLocation();

  const {
    patientId: passedPatientId,
    ipdAdmissionId: passedAdmissionId
  } = location.state || {};

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const printRef = useRef(null);

  const token = localStorage.getItem("jwt");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const stylesPrint = `
    .print-only{
      display:none;
    }

    @media print{

      .screen-only{
        display:none !important;
      }

      .print-only{
        display:block !important;
      }

      body{
        background:#fff;
      }
    }
  `;

  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);
  const [anesthesiaRecords, setAnesthesiaRecords] = useState([]);
  const [sonographyRecords, setSonographyRecords] = useState([]);

  const [patientId, setPatientId] = useState(
    passedPatientId || ""
  );

  const [ipdAdmissionId, setIpdAdmissionId] = useState(
    passedAdmissionId || ""
  );

  const [visitId, setVisitId] = useState("");

  const [userId, setUserId] = useState("");

  const [createdBill, setCreatedBill] = useState(null);

  const [payments, setPayments] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "Cash",
    externalRef: ""
  });

  const [paymentError, setPaymentError] = useState("");

  const [items, setItems] = useState([
    {
      item_type: '',
      item_source_id: '',
      description: '',
      quantity: 1,
      unit_price: ''
    }
  ]);

  const latestConsultation = consultations[0];

  // =========================
  // FETCH MANUAL ITEMS
  // =========================

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    setUserId(user?.id);

    axios.get(
      `${BASE_URL}/api/billing/manual-charge-items`,
      { headers }
    )
      .then(res => {
        setManualItems(res.data.items || []);
      })
      .catch(() => {
        toast.error("Failed to load manual items");
      });

  }, []);

  // =========================
  // FETCH PATIENTS
  // =========================

  useEffect(() => {

    const fetchPatients = async () => {

      try {

        const res = await axios.get(
          `${BASE_URL}/api/receptionist/patients`,
          { headers }
        );

        const allPatients = res.data.patients || [];

        const updatedPatients = await Promise.all(
          allPatients.map(async patient => {

            let patientType = "OPD";

            try {

              const admRes = await axios.get(
                `${BASE_URL}/api/ipd/admissions/${patient._id}`,
                { headers }
              );

              const admissions =
                admRes.data.admissions || [];

              const activeAdmission =
                admissions.find(
                  adm =>
                    adm.status?.toLowerCase() ===
                    "admitted"
                );

              patientType =
                activeAdmission ? "IPD" : "OPD";

            } catch (err) {}

            return {
              ...patient,
              patientType
            };

          })
        );

        setPatients(updatedPatients);

      } catch (err) {

        toast.error("Failed to load patients");

      }

    };

    fetchPatients();

  }, []);

  // =========================
  // FETCH VISITS
  // =========================

  useEffect(() => {

    if (!patientId) return;

    axios.get(
      `${BASE_URL}/api/receptionist/visits/${patientId}`,
      { headers }
    )
      .then(res => {

        const allVisits =
          res.data.visits || [];

        const completedVisits =
          allVisits.filter(
            v =>
              v.status?.toLowerCase() ===
              "completed"
          );

        setVisits(completedVisits);

      })
      .catch(() => {

        toast.error("Failed to load visits");

      });

  }, [patientId]);

  // =========================
  // FETCH CONSULTATIONS
  // =========================

  useEffect(() => {

    if (!visitId) return;

    axios.get(
      `${BASE_URL}/api/doctor/opd-consultations/visit/${visitId}`,
      { headers }
    )
      .then(res => {

        setConsultations(
          res.data.consultations || []
        );

      })
      .catch(() => {

        toast.error(
          "Failed to load consultation"
        );

      });

  }, [visitId]);

  // =========================
  // FETCH ADMISSIONS
  // =========================

  useEffect(() => {

    if (!patientId) return;

    axios.get(
      `${BASE_URL}/api/ipd/admissions/${patientId}`,
      { headers }
    )
      .then(res => {

        const admitted =
          res.data.admissions.filter(
            a => a.status === "Admitted"
          );

        setAdmissions(admitted);

      })
      .catch(() => {

        toast.error("Failed to load admissions");

      });

  }, [patientId]);

  // =========================
  // FETCH PROCEDURES
  // =========================

  useEffect(() => {

    if (!patientId) return;

    axios.get(
      `${BASE_URL}/api/procedures/schedules/${patientId}`,
      { headers }
    )
      .then(res => {

        const allProcedures =
          res.data.procedures || [];

        const completedNotBilled =
          allProcedures.filter(p => {

            const status =
              p.status?.toLowerCase();

            return (
              status === "completed" &&
              !p.isBilled
            );

          });

        setSchedules(completedNotBilled);

      })
      .catch(() => {

        toast.error(
          "Failed to load procedures"
        );

      });

  }, [patientId]);

  // =========================
  // FETCH DAILY REPORTS
  // =========================

  useEffect(() => {

    if (!ipdAdmissionId) return;

    axios.get(
      `${BASE_URL}/api/ipd/reports/${ipdAdmissionId}`,
      { headers }
    )
      .then(res => {

        setDailyReports(
          res.data.reports || []
        );

      })
      .catch(() => {

        toast.error(
          "Failed to load reports"
        );

      });

  }, [ipdAdmissionId]);

  // =========================
  // FETCH ANESTHESIA
  // =========================

  useEffect(() => {

    if (!patientId) return;

    const fetchAnesthesia = async () => {

      try {

        const procRes = await axios.get(
          `${BASE_URL}/api/procedures/schedules/${patientId}`,
          { headers }
        );

        const procedures =
          procRes.data.procedures || [];

        const anaRes = await axios.get(
          `${BASE_URL}/api/procedures/anesthesia-records`,
          { headers }
        );

        const allRecords =
          anaRes.data.records || [];

        const mapped =
          allRecords
            .filter(
              r =>
                r.patientId?._id ===
                patientId
            )
            .map(r => {

              const proc =
                procedures.find(
                  p =>
                    p.ipdAdmissionId ===
                    r.ipdAdmissionId
                );

              return {
                ...r,
                procedureName:
                  proc?.procedureId?.name ||
                  "N/A"
              };

            });

        setAnesthesiaRecords(mapped);

      } catch (err) {

        toast.error(
          "Failed to load anesthesia"
        );

      }

    };

    fetchAnesthesia();

  }, [patientId]);

  // =========================
  // FETCH SONOGRAPHY
  // =========================

  useEffect(() => {

    if (!patientId) return;

    axios.get(
      `${BASE_URL}/api/sonography/patient/${patientId}`,
      { headers }
    )
      .then(res => {

        setSonographyRecords(
          res.data || []
        );

      })
      .catch(() => {

        toast.error(
          "Failed to load sonography"
        );

      });

  }, [patientId]);

  // =========================
  // HANDLE ITEM CHANGE
  // =========================

  const handleChange = (
    index,
    field,
    value
  ) => {

    const updated = [...items];

    updated[index][field] = value;

    if (field === "item_source_id") {

      const type =
        updated[index].item_type;

      if (type === "Manual") {

        const selected =
          manualItems.find(
            m => m._id === value
          );

        updated[index].unit_price =
          selected?.defaultPrice || "";

        updated[index].description =
          selected?.itemName || "";

      }

      if (type === "ProcedureSchedule") {

        const selected =
          schedules.find(
            s => s._id === value
          );

        updated[index].unit_price =
          selected?.procedureId?.cost ||
          "";

        updated[index].description =
          selected?.procedureId?.name ||
          "";

      }

      if (type === "OPDConsultation") {

        const selected =
          consultations.find(
            c => c._id === value
          );

        updated[index].unit_price = 300;

        updated[index].description =
          `OPD Consultation - ${
            selected?.doctorId?.userId
              ?.name || ""
          }`;

      }

      if (type === "Sonography") {

        const selected =
          sonographyRecords.find(
            s => s._id === value
          );

        updated[index].unit_price =
          selected?.cost || "";

        updated[index].description =
          `Sonography - ${
            selected?.scanType || ""
          }`;

      }

    }

    setItems(updated);

  };

  // =========================
  // ADD ITEM
  // =========================

  const addItem = () => {

    setItems([
      ...items,
      {
        item_type: '',
        item_source_id: '',
        description: '',
        quantity: 1,
        unit_price: ''
      }
    ]);

  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = index => {

    if (items.length === 1) return;

    setItems(
      items.filter((_, i) => i !== index)
    );

  };

  // =========================
  // CREATE BILL
  // =========================

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      const cleanedItems = items.map(
        it => ({
          ...it,
          quantity: Number(it.quantity),
          unit_price: Number(
            it.unit_price
          )
        })
      );

      const payload = {

        patient_id_ref: patientId,

        generated_by_user_id:
          userId,

        visit_id_ref:
          visitId || null,

        ipd_admission_id_ref:
          ipdAdmissionId || null,

        items: cleanedItems

      };

      const res = await axios.post(
        `${BASE_URL}/api/billing/bills`,
        payload,
        { headers }
      );

      toast.success(
        "Bill created successfully"
      );

      setCreatedBill(res.data.bill);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Error creating bill"
      );

    }

  };

  // =========================
  // FETCH PAYMENTS
  // =========================

  const fetchPayments = async billId => {

    try {

      const res = await axios.get(
        `${BASE_URL}/api/billing/payments/${billId}`,
        { headers }
      );

      setPayments(
        res.data.payments || []
      );

    } catch (err) {}

  };

  // =========================
  // PAYMENT SUBMIT
  // =========================

  const submitPayment = async e => {

    e.preventDefault();

    setPaymentError("");

    try {

      const payload = {

        bill_id_ref:
          createdBill._id,

        amount_paid: Number(
          paymentForm.amount
        ),

        payment_method:
          paymentForm.method,

        external_reference_number:
          paymentForm.externalRef ||
          undefined,

        received_by_user_id_ref:
          user.userId

      };

      const { data } =
        await axios.post(
          `${BASE_URL}/api/billing/payments`,
          payload,
          { headers }
        );

      toast.success(
        "Payment added successfully"
      );

      setCreatedBill(
        data.updatedBill
      );

      fetchPayments(
        data.updatedBill._id
      );

    } catch (err) {

      setPaymentError(
        err.response?.data?.message ||
          "Payment failed"
      );

    }

  };

  // =========================
  // PRINT
  // =========================

  const handlePrint = () => {

    const printContents =
      printRef.current.innerHTML;

    const newWindow =
      window.open(
        '',
        '',
        'width=1000,height=700'
      );

    newWindow.document.write(`
      <html>
        <head>
          <title>Bill & Payment</title>

          <style>

            body{
              font-family:Arial;
              padding:20px;
            }

            table{
              width:100%;
              border-collapse:collapse;
              margin-top:15px;
            }

            th,td{
              border:1px solid #ccc;
              padding:10px;
            }

            th{
              background:#1976d2;
              color:#fff;
            }

          </style>

        </head>

        <body>
          ${printContents}
        </body>

      </html>
    `);

    newWindow.document.close();

    newWindow.print();

  };

  // =========================
  // TOTAL
  // =========================

  const total =
    items.reduce(
      (sum, i) =>
        sum +
        i.quantity *
          (i.unit_price || 0),
      0
    );

  return (

    <div style={styles.container}>

      <style>{stylesPrint}</style>

      <ToastContainer />

      <div ref={printRef}>

        <h2 style={styles.heading}>
          Create Patient Bill
        </h2>

        {/* ====================== */}
        {/* BILL FORM */}
        {/* ====================== */}

        <form onSubmit={handleSubmit}>

          {/* PATIENT */}

          <div style={styles.field}>

            <label>Patient</label>

            <select
              style={styles.select}
              value={patientId}
              onChange={e =>
                setPatientId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Patient
              </option>

              {patients.map(p => (

                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.fullName} |
                  {p.gender} |
                  {p.patientType}
                </option>

              ))}

            </select>

          </div>

          {/* VISITS */}

          <div style={styles.field}>

            <label>
              OPD Visit
            </label>

            <select
              style={styles.select}
              value={visitId}
              onChange={e =>
                setVisitId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Visit
              </option>

              {visits.map(v => (

                <option
                  key={v._id}
                  value={v._id}
                >
                  Dr.
                  {
                    v.assignedDoctorId
                      ?.userId?.name
                  }
                </option>

              ))}

            </select>

          </div>

          {/* ADMISSION */}

          {admissions.length > 0 && (

            <div style={styles.field}>

              <label>
                IPD Admission
              </label>

              <select
                style={styles.select}
                value={
                  ipdAdmissionId
                }
                onChange={e =>
                  setIpdAdmissionId(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Admission
                </option>

                {admissions.map(a => (

                  <option
                    key={a._id}
                    value={a._id}
                  >
                    {a.wardId?.name} |
                    Bed {a.bedNumber}
                  </option>

                ))}

              </select>

            </div>

          )}

          {/* ITEMS */}

          <h3>
            Billing Items
          </h3>

          {items.map(
            (item, index) => (

              <div
                key={index}
                style={styles.card}
              >

                <div
                  style={styles.field}
                >

                  <label>
                    Type
                  </label>

                  <select
                    style={
                      styles.select
                    }
                    value={
                      item.item_type
                    }
                    onChange={e =>
                      handleChange(
                        index,
                        "item_type",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Type
                    </option>

                    <option value="ProcedureSchedule">
                      Procedure
                    </option>

                    <option value="Manual">
                      Manual
                    </option>

                    <option value="Open">
                      Open
                    </option>

                    <option value="Sonography">
                      Sonography
                    </option>

                    <option value="OPDConsultation">
                      Consultation
                    </option>

                  </select>

                </div>

                {/* MANUAL */}

                {item.item_type ===
                  "Manual" && (

                  <select
                    style={
                      styles.select
                    }
                    value={
                      item.item_source_id
                    }
                    onChange={e =>
                      handleChange(
                        index,
                        "item_source_id",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Item
                    </option>

                    {manualItems.map(
                      mi => (

                        <option
                          key={
                            mi._id
                          }
                          value={
                            mi._id
                          }
                        >
                          {
                            mi.itemName
                          } |
                          ₹
                          {
                            mi.defaultPrice
                          }
                        </option>

                      )
                    )}

                  </select>

                )}

                {/* PROCEDURES */}

                {item.item_type ===
                  "ProcedureSchedule" && (

                  <select
                    style={
                      styles.select
                    }
                    value={
                      item.item_source_id
                    }
                    onChange={e =>
                      handleChange(
                        index,
                        "item_source_id",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Procedure
                    </option>

                    {schedules.map(
                      s => (

                        <option
                          key={
                            s._id
                          }
                          value={
                            s._id
                          }
                        >
                          {
                            s
                              .procedureId
                              ?.name
                          } |
                          ₹
                          {
                            s
                              .procedureId
                              ?.cost
                          }
                        </option>

                      )
                    )}

                  </select>

                )}

                {/* SONOGRAPHY */}

                {item.item_type ===
                  "Sonography" && (

                  <select
                    style={
                      styles.select
                    }
                    value={
                      item.item_source_id
                    }
                    onChange={e =>
                      handleChange(
                        index,
                        "item_source_id",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Sonography
                    </option>

                    {sonographyRecords.map(
                      s => (

                        <option
                          key={
                            s._id
                          }
                          value={
                            s._id
                          }
                        >
                          {
                            s.scanType
                          } |
                          ₹
                          {
                            s.cost
                          }
                        </option>

                      )
                    )}

                  </select>

                )}

                {/* OPEN */}

                {item.item_type ===
                  "Open" && (

                  <>
                    <input
                      style={
                        styles.input
                      }
                      placeholder="Description"
                      value={
                        item.description
                      }
                      onChange={e =>
                        handleChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <input
                      style={
                        styles.input
                      }
                      placeholder="Unit Price"
                      value={
                        item.unit_price
                      }
                      onChange={e =>
                        handleChange(
                          index,
                          "unit_price",
                          e.target.value
                        )
                      }
                    />
                  </>

                )}

                {/* QTY */}

                <input
                  type="number"
                  style={styles.input}
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={e =>
                    handleChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  style={
                    styles.removeBtn
                  }
                  onClick={() =>
                    removeItem(
                      index
                    )
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

          <button
            type="button"
            style={styles.addBtn}
            onClick={addItem}
          >
            + Add Item
          </button>

          <button
            type="submit"
            style={styles.submitBtn}
          >
            Create Bill
          </button>

        </form>

        {/* ====================== */}
        {/* BILL SUMMARY */}
        {/* ====================== */}

        {createdBill && (

          <div
            style={{
              marginTop: "2rem"
            }}
          >

            <h2>
              Bill Summary
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Description
                  </th>

                  <th>
                    Qty
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Total
                  </th>
                </tr>

              </thead>

              <tbody>

                {items.map(
                  (
                    item,
                    idx
                  ) => (

                    <tr key={idx}>

                      <td>
                        {
                          item.description
                        }
                      </td>

                      <td>
                        {
                          item.quantity
                        }
                      </td>

                      <td>
                        ₹
                        {
                          item.unit_price
                        }
                      </td>

                      <td>
                        ₹
                        {(
                          item.quantity *
                          item.unit_price
                        ).toFixed(
                          2
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

            <h3
              style={{
                marginTop:
                  "1rem"
              }}
            >
              Grand Total : ₹
              {total}
            </h3>

            {/* ====================== */}
            {/* PAYMENT FORM */}
            {/* ====================== */}

            <form
              onSubmit={
                submitPayment
              }
              style={
                styles.paymentBox
              }
            >

              <h3>
                Record Payment
              </h3>

              <div
                style={
                  styles.field
                }
              >

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  style={
                    styles.input
                  }
                  value={
                    paymentForm.amount
                  }
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      amount:
                        e.target
                          .value
                    })
                  }
                />

              </div>

              <div
                style={
                  styles.field
                }
              >

                <label>
                  Method
                </label>

                <select
                  style={
                    styles.select
                  }
                  value={
                    paymentForm.method
                  }
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      method:
                        e.target
                          .value
                    })
                  }
                >

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="External_Reference">
                    External Reference
                  </option>

                </select>

              </div>

              {paymentForm.method ===
                "External_Reference" && (

                <input
                  style={
                    styles.input
                  }
                  placeholder="Reference Number"
                  value={
                    paymentForm.externalRef
                  }
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      externalRef:
                        e.target
                          .value
                    })
                  }
                />

              )}

              <button
                type="submit"
                style={
                  styles.submitBtn
                }
              >
                Submit Payment
              </button>

              {paymentError && (

                <p
                  style={{
                    color:
                      "red"
                  }}
                >
                  {
                    paymentError
                  }
                </p>

              )}

            </form>

            {/* PAYMENT HISTORY */}

            {payments.length >
              0 && (

              <div
                style={{
                  marginTop:
                    "2rem"
                }}
              >

                <h3>
                  Payment History
                </h3>

                {payments.map(
                  p => (

                    <div
                      key={
                        p._id
                      }
                      style={
                        styles.paymentCard
                      }
                    >

                      <p>
                        <strong>
                          Amount:
                        </strong>{" "}
                        ₹
                        {
                          p.amount_paid
                        }
                      </p>

                      <p>
                        <strong>
                          Method:
                        </strong>{" "}
                        {
                          p.payment_method
                        }
                      </p>

                      <p>
                        <strong>
                          Date:
                        </strong>{" "}
                        {new Date(
                          p.payment_date
                        ).toLocaleString()}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        )}

      </div>

      {/* PRINT */}

      <button
        className="screen-only"
        style={{
          ...styles.submitBtn,
          background:
            "#673ab7",
          marginTop:
            "2rem"
        }}
        onClick={handlePrint}
      >
        🖨 Print Bill + Payment
      </button>

    </div>

  );

};

const styles = {

  container: {
    maxWidth: "1100px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#fafafa",
    borderRadius: "10px",
    fontFamily: "Arial"
  },

  heading: {
    textAlign: "center",
    marginBottom: "2rem"
  },

  field: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column"
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "10px"
  },

  select: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },

  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "1rem"
  },

  addBtn: {
    padding: "10px 15px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px"
  },

  submitBtn: {
    padding: "10px 15px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },

  removeBtn: {
    padding: "8px 12px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },

  paymentBox: {
    marginTop: "2rem",
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  paymentCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginBottom: "1rem"
  }

};

export default CreateBillForm;

