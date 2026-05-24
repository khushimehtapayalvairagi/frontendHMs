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
const [existingPatients, setExistingPatients] = useState([]);
const [selectedPatient, setSelectedPatient] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const searchPatients = async (value) => {

  setSearchTerm(value);

  if (!value) {
    setExistingPatients([]);
    return;
  }

  try {

    const token = localStorage.getItem("jwt");

    const res = await axios.get(
      `${BASE_URL}/api/receptionist/patients/search?query=${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setExistingPatients(res.data.patients || []);

  } catch (err) {
    console.log(err);
  }
};
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

  // ✅ NEW PATIENT VALIDATION
if (
  !selectedPatient &&
  (!form.fullName ||
    !form.age ||
    !form.gender ||
    !form.address)
) {
  return toast.error("Patient details missing");
}

    if (!visitType || !assignedDoctorId) {
      return toast.error("Visit details required");
    }

    // if (visitType === "OPD" && (!amount || !isPaid)) {
    //   return toast.error("Payment required for OPD");
    // }
    if (visitType === "OPD" && !amount) {
  return toast.error("Payment amount required");
}

    const token = localStorage.getItem("jwt");

    const payload = {
        existingPatientId:
    selectedPatient?._id,

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

    const selectedDoctor = doctors.find(
  (doc) => doc._id === assignedDoctorId
);

setSubmittedData({
  patient: res.data.patient,
  visit: res.data.visit,
  doctorName: selectedDoctor?.userId?.name || "N/A",
  specialty: selectedDoctor?.specialty?.name || "N/A"
});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // 🖨️ PRINT
const handlePrint = () => {
  const printContents = printRef.current.innerHTML;

  const win = window.open("", "", "width=1000,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Patient Receipt</title>

        <style>

          body{
            font-family: Arial;
            padding:20px;
            color:#000;
          }

          table{
            width:100%;
            border-collapse: collapse;
          }

          td,th{
            border:1px solid #000;
            padding:10px;
            font-size:14px;
          }

          h1,h2,h3{
            margin:5px 0;
          }

          @media print{
            body{
              margin:0;
            }
          }

        </style>

      </head>

      <body>

        ${printContents}

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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>👩‍⚕️ Patient + Visit Registration</h2>

      <form onSubmit={handleSubmit}>
          <h3>Search Existing Patient</h3>

<input
  type="text"
  placeholder="Search by Patient ID / Name / Contact"
  value={searchTerm}
  onChange={(e) => searchPatients(e.target.value)}
/>
{
  selectedPatient && (
    <div
      style={{
        background: "#d4edda",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px"
      }}
    >
      Existing Patient Selected:
      <b>
        {" "}
        {selectedPatient.fullName}
      </b>

      ({selectedPatient.patientId})
    </div>
  )
}

{
  existingPatients.length > 0 && (

    <div className="search-results">

      {
        existingPatients.map((p) => (

          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "5px",
              cursor: "pointer"
            }}
         onClick={() => {

  console.log("Clicked Patient:", p);

  setSelectedPatient({
    ...p,
    _id: p._id
  });

  setForm({
    fullName: p.fullName || "",
    age: p.age || "",
    gender: p.gender || "",
    dob: p.dob
      ? p.dob.split("T")[0]
      : "",
    contactNumber: p.contactNumber || "",
    email: p.email || "",
    address: p.address || "",
    aadhaarNumber: p.aadhaarNumber || "",
    relatives: p.relatives || []
  });

  setExistingPatients([]);
  setSearchTerm("");
}}
          >

            <b>{p.fullName}</b> ({p.patientId})

            <br />

            {p.contactNumber}

          </div>

        ))
      }

    </div>
  )
}
        {/* PATIENT */}
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange}  readOnly={!!selectedPatient} />
        <input
  type="date"
  name="dob"
  value={form.dob}
  onChange={handleChange}
    readOnly={!!selectedPatient}
/>
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange}   readOnly={!!selectedPatient}/>

        <select name="gender" value={form.gender} onChange={handleChange}   readOnly={!!selectedPatient}>
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="contactNumber" placeholder="Contact" value={form.contactNumber}  readOnly={!!selectedPatient} onChange={handleChange} />
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

    <button onClick={handlePrint}>
      🖨️ Print Receipt
    </button>

    <div ref={printRef} style={{ display: "none" }}>

      <div className="print-container">

        {/* HEADER */}

  <div
  style={{
    textAlign: "center",
    borderBottom: "2px solid black",
    marginBottom: "20px",
    paddingBottom: "10px"
  }}
>

  <h1 style={{ margin: 0 }}>
    Dr. M.I. Jamkhanawala Tibbia Medical College
  </h1>

  <p style={{ margin: "5px 0" }}>
    Haji Abdul Razzak Kalsekar Tibbia Hospital
  </p>

  <p style={{ margin: "5px 0" }}>
    Anjuman-I-Islam Complex, Versova, Mumbai
  </p>

  <p style={{ margin: "5px 0" }}>
    Contact: +91 9876543210
  </p>

  <h2 style={{ marginTop: "10px" }}>
    Patient Registration Receipt
  </h2>

</div>

        {/* PATIENT DETAILS */}

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px"
          }}
        >

          <tbody>

            <tr>
              <td><b>Patient ID</b></td>
              <td>{submittedData.patient.patientId}</td>

              <td><b>Name</b></td>
              <td>{submittedData.patient.fullName}</td>
            </tr>

            <tr>
              <td><b>Gender</b></td>
              <td>{submittedData.patient.gender}</td>

              <td><b>Age</b></td>
              <td>{submittedData.patient.age}</td>
            </tr>

            <tr>
              <td><b>DOB</b></td>
              <td>
                {submittedData.patient.dob
                  ? new Date(submittedData.patient.dob).toLocaleDateString()
                  : "-"
                }
              </td>

              <td><b>Contact</b></td>
              <td>{submittedData.patient.contactNumber || "-"}</td>
            </tr>

            <tr>
              <td><b>Email</b></td>
              <td>{submittedData.patient.email || "-"}</td>

              <td><b>Aadhaar</b></td>
              <td>{submittedData.patient.aadhaarNumber || "-"}</td>
            </tr>

            <tr>
              <td><b>Address</b></td>
              <td colSpan="3">
                {submittedData.patient.address}
              </td>
            </tr>

          </tbody>
        </table>

        {/* VISIT DETAILS */}

        <h3>Visit Details</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px"
          }}
        >
          <tbody>

            <tr>
              <td><b>Visit Type</b></td>
              <td>{submittedData.visit.visitType}</td>

            </tr>

            <tr>
              <td><b>Payment Amount</b></td>
              <td>
                ₹ {submittedData.visit.payment?.amount || 0}
              </td>

              <td><b>Payment Status</b></td>
              <td>
                {submittedData.visit.payment?.isPaid
                  ? "Paid"
                  : "Pending"
                }
              </td>
            </tr>

            <tr>
              <td><b>Visit Date</b></td>
              <td colSpan="3">
                {new Date().toLocaleString()}
              </td>
            </tr>

          </tbody>
        </table>

        {/* FOOTER */}

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >

          <div>
            Generated By Hospital System
          </div>

          <div>
            Authorized Signature
          </div>

        </div>

      </div>

    </div>

  </div>
)}
      <ToastContainer />
    </div>
  );
};

export default PatientForm;