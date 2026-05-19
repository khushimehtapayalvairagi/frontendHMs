import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnesthesiaForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [patients, setPatients] = useState([]);
  const [ipdAdmissions, setIpdAdmissions] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: '',
    ipdAdmissionId: '',
    procedureType: '',
    anestheticId: '',
    anesthesiaName: '',
    anesthesiaType: '',
    induceTime: '',
    endTime: '',
    medicinesUsedText: ''
  });

  // Load Data
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchData = async () => {
      try {
        const [patientRes, doctorRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/receptionist/patients`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BASE_URL}/api/receptionist/doctors`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPatients(patientRes.data.patients || []);
        setDoctors(doctorRes.data.doctors || []);
      } catch {
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, [BASE_URL]);

  // Load Admission
  useEffect(() => {
    if (!form.patientId) return;

    const token = localStorage.getItem('jwt');

    axios
      .get(`${BASE_URL}/api/ipd/admissions/${form.patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setIpdAdmissions(res.data.admissions || []))
      .catch(() => toast.error('Failed to load admissions'));
  }, [form.patientId, BASE_URL]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');

    const payload = {
      patientId: form.patientId,
      ipdAdmissionId: form.ipdAdmissionId || null,
      procedureType: form.procedureType,
      anestheticId: form.anestheticId,
      anesthesiaName: form.anesthesiaName,
      anesthesiaType: form.anesthesiaType,
      induceTime: form.induceTime || null,
      endTime: form.endTime || null,
      medicinesUsedText: form.medicinesUsedText || ''
    };

    try {
      await axios.post(
        `${BASE_URL}/api/procedures/anesthesia-records`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Anesthesia record saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  // Get Names
  const patientName =
    patients.find(p => p._id === form.patientId)?.fullName || '';

  const doctorName =
    doctors.find(d => d._id === form.anestheticId)?.userId?.name || '';

  const admissionName =
    ipdAdmissions.find(a => a._id === form.ipdAdmissionId)?.wardId?.name || '';

  // PRINT FILLED DATA
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800');

    printWindow.document.write(`
      <html>
      <head>
        <title>Anesthesia Record</title>

        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          body{
            font-family: Arial;
            padding:20px;
            color:#000;
          }

          h2{
            text-align:center;
            margin-bottom:25px;
          }

          .row{
            margin-bottom:14px;
          }

          .label{
            font-weight:bold;
            margin-bottom:4px;
          }

          .box{
            border:1px solid #000;
            padding:10px;
            min-height:18px;
          }

          textarea{
            width:100%;
            min-height:80px;
          }
        </style>
      </head>

      <body>

        <h2>Anesthesia Record (Independent)</h2>

        <div class="row">
          <div class="label">Patient</div>
          <div class="box">${patientName}</div>
        </div>

        <div class="row">
          <div class="label">Admission</div>
          <div class="box">${admissionName}</div>
        </div>

        <div class="row">
          <div class="label">Procedure Type</div>
          <div class="box">${form.procedureType}</div>
        </div>

        <div class="row">
          <div class="label">Anesthetist</div>
          <div class="box">${doctorName}</div>
        </div>

        <div class="row">
          <div class="label">Anesthesia Name</div>
          <div class="box">${form.anesthesiaName}</div>
        </div>

        <div class="row">
          <div class="label">Anesthesia Type</div>
          <div class="box">${form.anesthesiaType}</div>
        </div>

        <div class="row">
          <div class="label">Induce Time</div>
          <div class="box">${form.induceTime}</div>
        </div>

        <div class="row">
          <div class="label">End Time</div>
          <div class="box">${form.endTime}</div>
        </div>

        <div class="row">
          <div class="label">Medicines Used</div>
          <div class="box">${form.medicinesUsedText}</div>
        </div>

      </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: '2rem',
        background: '#f5f5f5',
        borderRadius: '10px'
      }}
    >
      <h2>Anesthesia Record (Independent)</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>
              {p.fullName}
            </option>
          ))}
        </select>

        {form.patientId && (
          <select
            name="ipdAdmissionId"
            value={form.ipdAdmissionId}
            onChange={handleChange}
          >
            <option value="">Select Admission</option>
            {ipdAdmissions.map(a => (
              <option key={a._id} value={a._id}>
                {a.wardId?.name}
              </option>
            ))}
          </select>
        )}

        <select
          name="procedureType"
          value={form.procedureType}
          onChange={handleChange}
          required
        >
          <option value="">Select Procedure Type</option>
          <option value="OT">OT</option>
          <option value="Labour Room">Labour Room</option>
        </select>

        <select
          name="anestheticId"
          value={form.anestheticId}
          onChange={handleChange}
          required
        >
          <option value="">Select Anesthetist</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>
              {doc.userId?.name}
            </option>
          ))}
        </select>

        <input
          name="anesthesiaName"
          value={form.anesthesiaName}
          onChange={handleChange}
          placeholder="Anesthesia Name"
          required
        />

        <select
          name="anesthesiaType"
          value={form.anesthesiaType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="General">General</option>
          <option value="Local">Local</option>
          <option value="Epidural">Epidural</option>
        </select>

        <input
          type="datetime-local"
          name="induceTime"
          value={form.induceTime}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
        />

        <textarea
          name="medicinesUsedText"
          value={form.medicinesUsedText}
          onChange={handleChange}
          placeholder="Medicines used"
        />

        <button
          type="submit"
          style={{
            padding: '10px',
            background: 'green',
            color: '#fff',
            border: 'none'
          }}
        >
          Save Record
        </button>
      </form>

      <button
        onClick={handlePrint}
        style={{
          marginTop: '1rem',
          padding: '10px'
        }}
      >
        Print
      </button>

      <ToastContainer />
    </div>
  );
};

export default AnesthesiaForm;