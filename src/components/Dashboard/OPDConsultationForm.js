import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import { useParams,useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OPDConsultationForm = () => {
  const location = useLocation();
  const { visitId } = useParams();  // 👈 get visitId from route
   const [visit, setVisit] = useState(location.state?.visit || null);
  const [loading, setLoading] = useState(true);
const BASE_URL = process.env.REACT_APP_BASE_URL;
 const user = JSON.parse(localStorage.getItem('user')) || {};
  // Form states...
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [admissionAdvice, setAdmissionAdvice] = useState(false);
  const [labInvestigationsSuggested, setLabInvestigationsSuggested] = useState('');
  const [medicinesPrescribedText, setMedicinesPrescribedText] = useState('');
  const [transcribedFromPaperNotes, setTranscribedFromPaperNotes] = useState(false);
  const [transcribedByUserId, setTranscribedByUserId] = useState('');
const navigate = useNavigate();

  const prescriptionRef = useRef(null); 

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (!chiefComplaint) {
    toast.error('Chief Complaint is required.');
    return;
  }

  console.log(visit);

  const payload = {
    visitId: visit._id,
    patientId: visit.patientDbId._id,
 doctorId: visit.assignedDoctorId,


    chiefComplaint,
    diagnosis,
    doctorNotes,
    admissionAdvice,
    labInvestigationsSuggested: labInvestigationsSuggested.split(',').map(i => i.trim()),
    medicinesPrescribedText,
    transcribedFromPaperNotes,
    transcribedByUserId: transcribedFromPaperNotes ? user._id : undefined,
  };

  try {
    console.log("Payload being sent:", payload);

    await axios.post(`${BASE_URL}/api/doctor/opd-consultations`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success('Consultation submitted successfully!');
    setTimeout(() => navigate('/doctor-dashboard'), 2000); // wait for toast to show
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error(err.response?.data?.message || 'Failed to submit consultation.');
  }
};

 const handlePrintPrescription = () => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  printWindow.document.write(`
    <html>
      <head>
        <title>Prescription</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }

          .bill-container {
            width: 100%;
            border: 1px solid #000;
            padding: 15px;
          }



          .print-header{
    width:90px;
    padding-top:10px;   /* Logo ko niche lane ke liye sirf ye value badhana */
}

.print-header img{
    width:60px;
    height:60px;
    display:block;
    margin:auto;
}

.header-content{
    flex:1;
    text-align:center;
}

.title{

    text-align:center;

    font-size:22px;

    font-weight:bold;

    margin-top:10px;

    margin-bottom:10px;

    letter-spacing:1px;

}

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }

        /*  .hospital-logo{
    width:90px;
    height:90px;
    object-fit:contain;
    display:block;
    margin-top:-8px;
    margin-left:-8px;
}*/

          .hospital-name {
            font-size: 20px;
            font-weight: bold;
          }

          .hospital-address {
            font-size: 15px;
          } 

          .print-header{
    position: absolute;
    top: 15px;
    left: 20px;
}

.print-header img{
    width:70px;
    height:70px;
    object-fit:contain;
     top: 50px;
}

          .patient-info {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
          }

          .section {
            margin-top: 15px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          table, th, td {
            border: 1px solid #000;
          }

          th, td {
            padding: 8px;
            text-align: left;
          }

          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }

          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="bill-container">

      

<div class="print-header">
    <img src="/hospital-print-header.png" />
</div>



    <div class="header">
            <div class="hospital-name">
              Dr. M.I. Jamkhanawala Tibbia Medical College
            </div>
            <div class="hospital-address">
              Anjuman-I-Islam Complex, Mumbai 400061
            </div>

            <div class="title">

OPD PRESCRIPTION

</div>

          </div>





          <div class="patient-info">
            <div>
              <p><b>Patient:</b> ${visit.patientDbId?.fullName || ''}</p>
              <p><b>Patient ID:</b> ${visit.patientId}</p>
              <p><b>Mobile:</b> ${visit.patientDbId?.contactNumber || ''}</p>
            </div>

            <div>
              <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
              <p><b>DOB:</b> ${
                visit.patientDbId?.dob
                  ? new Date(visit.patientDbId.dob).toLocaleDateString()
                  : ''
              }</p>
            </div>
          </div>

          <div class="section">
            <table>
              <tr>
                <th>Chief Complaint</th>
                <td>${chiefComplaint}</td>
              </tr>

              <tr>
                <th>Diagnosis</th>
                <td>${diagnosis}</td>
              </tr>

              <tr>
                <th>Doctor Notes</th>
                <td>${doctorNotes}</td>
              </tr>

              <tr>
                <th>Lab Investigations</th>
                <td>${labInvestigationsSuggested}</td>
              </tr>

              <tr>
                <th>Medicines</th>
                <td>${medicinesPrescribedText}</td>
              </tr>
            </table>

            <div
style="

height:150px;

border-left:1px solid black;

border-right:1px solid black;

border-bottom:1px solid black;

">

</div>


          </div>

          <div class="footer">
            <div>
              ${
                transcribedFromPaperNotes
                  ? `<p><b>Transcribed By:</b> ${user.name}</p>`
                  : ''
              }
            </div>

            <div>
              <br><br>
              ____________________<br>
              Doctor Signature
            </div>
          </div>

        </div>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
  useEffect(() => {
  if (visit) {
    setLoading(false); // 👈 this fixes your issue
  }
}, [visit]);

  if (loading) return <p>Loading...</p>;
  if (!visit) return <p>Visit not found.</p>;

 return (
  <>
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid #ccc',
        padding: '2rem',
        marginTop: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <h3 style={{ textAlign: 'center' }}>OPD Consultation Details</h3>

      <div><strong>Patient ID:</strong> {visit.patientId}</div>
      <div><strong>Patient Name:</strong> {visit.patientDbId?.fullName || 'N/A'}</div>

      <textarea
        placeholder="Chief Complaint"
        value={chiefComplaint}
        onChange={(e) => setChiefComplaint(e.target.value)}
        required
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Doctor Notes"
        value={doctorNotes}
        onChange={(e) => setDoctorNotes(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <label  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       Recommend IPD Admission
        <input
          type="checkbox"
          checked={admissionAdvice}
          onChange={(e) => setAdmissionAdvice(e.target.checked)}
        />
      
      </label>

      <input
        type="text"
        placeholder="Lab Investigations (comma separated)"
        value={labInvestigationsSuggested}
        onChange={(e) => setLabInvestigationsSuggested(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Medicines Prescribed"
        value={medicinesPrescribedText}
        onChange={(e) => setMedicinesPrescribedText(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

     <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span>Transcribed from Paper Notes</span>
  <input
    type="checkbox"
    checked={transcribedFromPaperNotes}
    onChange={(e) => setTranscribedFromPaperNotes(e.target.checked)}
  />
</label>

      {transcribedFromPaperNotes && (
       <p>Will be transcribed by: {user.name}</p>
      )}

     
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={handlePrintPrescription}
           variant="outlined" color="secondary"
          >
            Print Prescription
          </button>
          <button type="submit" variant="contained" color="primary">Submit Consultation</button>
        </div>
      
    </form>
      <div ref={prescriptionRef} style={{ display: 'none' }}>
        <h2 style={{ textAlign: 'center' }}>🧾 Prescription</h2>
        <p><strong>Patient ID:</strong> {visit.patientId}</p>
        <p><strong>Patient Name:</strong> {visit.patientDbId?.fullName}</p>
        <p><strong>DOB:</strong> {visit.patientDbId?.dob ? new Date(visit.patientDbId.dob).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Mobile:</strong> {visit.patientDbId?.contactNumber || 'N/A'}</p>
        <p><strong>Aadhaar:</strong> {visit.patientDbId?.aadhaarNumber || 'N/A'}</p>
        <hr />
        <p><strong>Chief Complaint:</strong> {chiefComplaint}</p>
        <p><strong>Diagnosis:</strong> {diagnosis}</p>
        <p><strong>Doctor Notes:</strong> {doctorNotes}</p>
        <p><strong>Lab Investigations:</strong> {labInvestigationsSuggested}</p>
        <p><strong>Medicines:</strong> {medicinesPrescribedText}</p>
       {transcribedFromPaperNotes && (
    <p><strong>Transcribed By:</strong> {user.name}</p>
  )}
      </div>
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);


};

export default OPDConsultationForm;
