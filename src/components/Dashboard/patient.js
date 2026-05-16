import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PatientForm.css";

const PatientForm = () => {
  const printRef = useRef();

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    dob: "",
    contactNumber: "",
    email: "",
    address: "",
    aadhaarNumber: "",
    relatives: [{ name: "", contactNumber: "", relationship: "" }]
  });

  // 🔥 NEW STATES
  const [visitType, setVisitType] = useState("");
  const [assignedDoctorId, setAssignedDoctorId] = useState("");
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [submittedData, setSubmittedData] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // 🔥 GET DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${BASE_URL}/api/receptionist/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDoctors();
  }, []);

  const validateContact = (val) => /^\d*$/.test(val) && val.length <= 10;
  const validateAadhaar = (val) => /^\d{0,12}$/.test(val);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber" && value && !validateContact(value)) {
      return toast.error("Contact number must be numeric and max 10 digits");
    }

    if (name === "aadhaarNumber" && value && !validateAadhaar(value)) {
      return toast.error("Aadhaar must be numeric and max 12 digits");
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRelChange = (i, e) => {
    const { name, value } = e.target;
    const newR = [...form.relatives];
    newR[i][name] = value;
    setForm((p) => ({ ...p, relatives: newR }));
  };

  // 🔥 SUBMIT (MERGED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.age || !form.gender || !form.address) {
      return toast.error("Patient details missing");
    }

    if (!visitType || !assignedDoctorId) {
      return toast.error("Visit details required");
    }

    if (visitType === "OPD" && (!amount || !isPaid)) {
      return toast.error("Payment required for OPD");
    }

    const token = localStorage.getItem("jwt");

    const payload = {
      ...form,
      aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
      relatives: form.relatives?.filter(r => r.name || r.contactNumber || r.relationship),

      visitType,
      assignedDoctorId,

      payment: visitType === "OPD"
        ? { amount: Number(amount), isPaid }
        : undefined
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/api/receptionist/register-and-visit`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Patient + Visit Created");
localStorage.setItem("currentPatientId", res.data.patient.patientId);

      setSubmittedData({
        patient: res.data.patient,
        visit: res.data.visit
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // 🖨️ PRINT
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const w = window.open("", "", "width=800,height=600");
    w.document.write(`<html><body>${content}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>👩‍⚕️ Patient + Visit Registration</h2>

      <form onSubmit={handleSubmit}>

        {/* PATIENT */}
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="contactNumber" placeholder="Contact" value={form.contactNumber} onChange={handleChange} />
        <input name="aadhaarNumber" placeholder="Aadhaar" value={form.aadhaarNumber} onChange={handleChange} />

        {/* VISIT */}
        <h3>Visit Details</h3>

        <select value={visitType} onChange={(e) => setVisitType(e.target.value)}>
          <option value="">Select Visit</option>
          <option value="OPD">OPD</option>
          <option value="IPD_Admission">IPD Admission</option>
        </select>

       <select value={assignedDoctorId} onChange={(e) => setAssignedDoctorId(e.target.value)}>
  <option value="">Select Doctor</option>
  {doctors.map((doc) => (
    <option key={doc._id} value={doc._id}>
      {doc.userId?.name} ({doc.specialty?.name || "No Specialty"})
    </option>
  ))}
</select>

        {/* PAYMENT */}
        {visitType === "OPD" && (
          <>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label>
              Paid
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
            </label>
          </>
        )}

        <button type="submit">Submit</button>
      </form>

      {/* PRINT */}
      {submittedData && (
        <div>
          <button onClick={handlePrint}>🖨️ Print</button>

          <div ref={printRef} style={{ display: "none" }}>
            <h2>Patient Receipt</h2>

            <p>Name: {submittedData.patient.fullName}</p>
            <p>Patient ID: {submittedData.patient.patientId}</p>
            <p>Visit: {submittedData.visit.visitType}</p>
            <p>Amount: {submittedData.visit.payment?.amount || "-"}</p>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PatientForm;