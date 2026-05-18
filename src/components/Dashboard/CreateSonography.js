import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

export default function CreateSonography() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);


  const [manualItems, setManualItems] = useState([]);




  const [form, setForm] = useState({
    patientId: "",
    doctorId:"", 
    visitId:"",
    // suggestedBy: "",


      // ✅ NEW
    startDate: "",
    endDate: "",



    procedureType: "",
    scanType: "",
    notes: "",
    cost: "",
    paymentStatus: "Unpaid"
  });

  // ✅ Load patients + doctors
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [pRes, dRes] = await Promise.all([
  //         axios.get(`${BASE_URL}/api/receptionist/patients`, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }),
  //         axios.get(`${BASE_URL}/api/receptionist/doctors`, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         })
  //       ]);

  //       setPatients(pRes.data.patients || []);
  //       setDoctors(dRes.data.doctors || []);

  //     } catch {
  //       toast.error("Failed to load data");
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {

      console.log("BASE_URL =>", BASE_URL);
      console.log("TOKEN =>", token);

      // ✅ Patients API
      const pRes = await axios.get(
        `${BASE_URL}/api/receptionist/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("PATIENT RESPONSE =>", pRes.data);

      // ✅ Doctors API
      const dRes = await axios.get(
        `${BASE_URL}/api/receptionist/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("DOCTOR RESPONSE =>", dRes.data);

      setPatients(pRes.data.patients || []);
      setDoctors(dRes.data.doctors || []);

    } catch (err) {

      console.log(
        "LOAD ERROR =>",
        err.response?.data || err.message
      );

      toast.error(
        err.response?.data?.message || "Failed to load data"
      );
    }
  };

  fetchData();
}, []);


  useEffect(() => {
  const fetchManualItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/billing/manual-charge-items`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setManualItems(res.data.items || []);
    } catch {
      toast.error("Failed to load manual items");
    }
  };

  fetchManualItems();
}, []);

// const [form, setForm] = useState({
//   patientId: "",
//   doctorId:"",
//   visitId:"",
//   procedureType: "",
//   scanType: "",
//   notes: "",
//   cost: "",
//   paymentStatus: "Unpaid",

//   // ✅ NEW
//   manualChargeId: ""
// });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post(`${BASE_URL}/api/sonography`, form, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success("✅ Sonography Created");

//       setForm({
//         patientId: "",
//         doctorId: "",
//         visitId: "",    // (optional but better)
//         procedureType: "",
//         scanType: "",
//         notes: "",
//         cost: "",
//         paymentStatus: "Unpaid"
//       });

//     }

//     catch (err) {
//   console.error("ERROR 👉", err.response?.data || err.message);

//   toast.error(
//     err.response?.data?.message || "Failed to create sonography"
//   );
// }
    
//     // catch {
//     //   toast.error("Failed to create");
//     // }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...form,
      status: "Completed",
      report: "Auto Generated Report"
    };

    // ✅ optional cleanup
    if (!payload.manualChargeId) {
      delete payload.manualChargeId;
    }

    await axios.post(`${BASE_URL}/api/sonography`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("✅ Sonography Auto Completed");

    setForm({
      patientId: "",
      doctorId: "",
      visitId: "",
      procedureType: "",
      scanType: "",


        // ✅ NEW
      startDate: "",
      endDate: "",

      notes: "",
      cost: "",
      paymentStatus: "Unpaid",
      manualChargeId: ""
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Failed to create sonography");
  }
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     await axios.post(`${BASE_URL}/api/sonography`, {
//       ...form,   // 👈 purana data

//       // ✅ YEH ADD KARO
//       status: "Completed",
//       report: "Auto Generated Report"

//     }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     // optional cleanup
// if (!payload.manualChargeId) delete payload.manualChargeId;

// await axios.post(`${BASE_URL}/api/sonography`, payload, {
//   headers: { Authorization: `Bearer ${token}` }
// });

//     toast.success("✅ Sonography Auto Completed");

//     setForm({
//       patientId: "",
//       doctorId: "",
//       visitId: "",
//       procedureType: "",
//       scanType: "",
//       notes: "",
//       cost: "",
//       paymentStatus: "Unpaid",
//       manualChargeId: ""   // ✅ keep this

      
//     });

//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     toast.error("Failed to create sonography");
//   }
// };

//   const handlePatientChange = async (e) => {
//   const selectedPatientId = e.target.value;

//   setForm({ ...form, patientId: selectedPatientId });

//   try {
//     const res = await axios.get(
//       `${BASE_URL}/api/visits/patient/${selectedPatientId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     const visit = res.data.visits?.[0];

//     // const visit = res.data[0]; // latest visit

//     setForm(prev => ({
//       ...prev,
//       patientId: selectedPatientId,
//       visitId: visit?._id || ""
//     }));

//   } catch {
//     toast.error("Visit fetch failed");
//   }
// };

// const handlePatientChange = async (e) => {
//   const selectedPatientId = e.target.value;

//   setForm({
//     ...form,
//     patientId: selectedPatientId
//   });

//   try {
//     const res = await axios.get(
//       `${BASE_URL}/api/visits/patient/${selectedPatientId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     const visit = res.data.visits?.[0];

//     setForm(prev => ({
//       ...prev,
//       patientId: selectedPatientId,
//       visitId: visit?._id || ""
//     }));

//   } catch (err) {
//     console.error(err);
//     toast.error("Visit fetch failed");
//   }
// };

const handlePatientChange = async (e) => {
  const selectedPatientId = e.target.value;

  console.log("PATIENT ID:", selectedPatientId);

  setForm({
    ...form,
    patientId: selectedPatientId
  });

  try {
    const res = await axios.get(
      `${BASE_URL}/api/visits/patient/${selectedPatientId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("VISIT RESPONSE:", res.data);

    const visit = res.data.visits?.[0];

    setForm(prev => ({
      ...prev,
      patientId: selectedPatientId,
      visitId: visit?._id || ""
    }));

  } catch (err) {
    console.error("VISIT ERROR:", err.response?.data || err);
    toast.error("Visit fetch failed");
  }
};


const manualOptions = manualItems.map(item => ({
  value: item._id,
  label: `${item.itemName} - ₹${item.defaultPrice}`,
  price: item.defaultPrice
}));



  return (
    <div style={styles.container}>
      <h2>Create Sonography</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Patient */}


        {/* <select
  name="patientId"
  value={form.patientId}
  onChange={(e) => {
    const selected = patients.find(p => p._id === e.target.value);

    setForm({
      ...form,
      patientId: e.target.value,
      visitId: selected?.visitId?._id || ""   // 🔥 IMPORTANT
    });
  }}
  required
>

</select> */}
        {/* <select name="patientId" value={form.patientId} onChange={handleChange} required> */}
        {/* <select
  name="patientId"
  value={form.patientId}
  onChange={handlePatientChange}
  required
>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p._id} value={p.patientId}>
  {p.fullName}
</option>
            // <option key={p._id} value={p._id}>{p.fullName}</option>
          ))}
        </select> */}

<select
  name="patientId"
  value={form.patientId}
  onChange={handlePatientChange}
  required
>
  <option value="">Select Patient</option>

  {patients.map((p) => (
    <option key={p._id} value={p._id}>
      {p.fullName}
    </option>
  ))}
</select>

 {/* <select
  name="patientId"
  value={form.patientId}
  onChange={handlePatientChange}
  required
>
  <option value="">Select Patient</option>

  {patients.map((p) => (
    // <option key={p._id} value={p.patientId}>
    <option key={p._id} value={p._id}>

      {p.fullName}
    </option>
  ))}
</select> */}

        {/* Doctor */}

        <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
  <option value="">Select Doctor</option>
  {doctors.map(doc => (
    <option key={doc._id} value={doc._id}>
      {doc.userId?.name}
    </option>
  ))}
</select>

        {/* <select name="suggestedBy" value={form.suggestedBy} onChange={handleChange} required>
          <option value="">Suggested By Doctor</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>
              {doc.userId?.name}
            </option>
          ))}
        </select> */}

        {/* Procedure */}
        <select name="procedureType" value={form.procedureType} onChange={handleChange} required>
          <option value="">Select Procedure</option>
          <option value="OPD">OPD</option>
          <option value="IPD">IPD</option>
          <option value="Emergency">Emergency</option>
        </select>

        {/* Scan Type */}
        <select name="scanType" value={form.scanType} onChange={handleChange} required>
          <option value="">Select Scan Type</option>
          <option>USG Abdomen</option>
          <option>Pregnancy Scan</option>
          <option>Pelvis Scan</option>
          <option>Kidney Scan</option>
        </select>



{/* Start Date */}
<input
  type="datetime-local"
  name="startDate"
  value={form.startDate}
  onChange={handleChange}
  required
/>

{/* End Date */}
<input
  type="datetime-local"
  name="endDate"
  value={form.endDate}
  onChange={handleChange}
  required
/>






        {/* ✅ Manual Charge Select */}


        {/* <Select
  options={manualOptions}
  placeholder="Search & Select Manual Charge"
  value={manualOptions.find(opt => opt.value === form.manualChargeId)}
  onChange={(selected) => {
    setForm({
      ...form,
      manualChargeId: selected?.value || "",
      cost: selected?.price || ""
    });
  }}
  isClearable
/> */}


<Select
  options={manualOptions}
  placeholder="Search & Select Manual Charge"
  value={manualOptions.find(opt => opt.value === form.manualChargeId)}
  onChange={(selected) => {
    setForm({
      ...form,
      manualChargeId: selected?.value || "",
      cost: selected?.price || ""
    });
  }}
  isClearable

  styles={{
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: "none",
      fontSize: "14px"
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: "0 10px"
    }),

    input: (provided) => ({
      ...provided,
      margin: "0px"
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#0b0101"
    })
  }}
/>
{/* <select
  name="manualChargeId"
  value={form.manualChargeId}
  onChange={(e) => {
    const selected = manualItems.find(m => m._id === e.target.value);

    setForm({
      ...form,
      manualChargeId: e.target.value,
      cost: selected?.defaultPrice || ""   // 🔥 auto fill cost
    });
  }}
>
  <option value="">Select Manual Charge (optional)</option>
  {manualItems.map(item => (
    <option key={item._id} value={item._id}>
      {item.itemName} - ₹{item.defaultPrice}
    </option>
  ))}
</select> */}



        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        {/* Cost */}
<input
  name="cost"
  type="number"
  placeholder="Cost"
  value={form.cost}
  onChange={handleChange}
/>

<select
  name="paymentStatus"
  value={form.paymentStatus}
  onChange={handleChange}
>
  <option value="Unpaid">Unpaid</option>
  <option value="Paid">Paid</option>
  <option value="Partial">Partial</option>
</select>

        <button type="submit">Save</button>
      </form>

      <ToastContainer />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#f5f5f5",
    borderRadius: "10px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  }
};