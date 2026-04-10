import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnesthesiaForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const printRef = useRef(null);

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

  // ✅ Load initial data
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

      } catch (err) {
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // ✅ Load admissions when patient selected
  useEffect(() => {
    if (!form.patientId) return;

    const token = localStorage.getItem('jwt');

    axios
      .get(`${BASE_URL}/api/ipd/admissions/${form.patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setIpdAdmissions(res.data.admissions || []))
      .catch(() => toast.error('Failed to load admissions'));

  }, [form.patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('✅ Anesthesia record saved successfully!');

      // ✅ reset form
      setForm({
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

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  // ✅ Print
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=900,height=700');
    newWindow.document.write(`
      <html>
        <head>
          <title>Anesthesia Record</title>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      
      <div ref={printRef}>
        <h2>Anesthesia Record (Independent)</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Patient */}
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.fullName}</option>
            ))}
          </select>

          {/* Admission */}
          {form.patientId && (
            <select name="ipdAdmissionId" value={form.ipdAdmissionId} onChange={handleChange}>
              <option value="">Select Admission</option>
              {ipdAdmissions.map(a => (
                <option key={a._id} value={a._id}>
                  {a.wardId?.name}
                </option>
              ))}
            </select>
          )}

          {/* Procedure Type */}
          <select name="procedureType" value={form.procedureType} onChange={handleChange} required>
            <option value="">Select Procedure Type</option>
            <option value="OT">OT</option>
            <option value="Labour Room">Labour Room</option>
          </select>

          {/* Doctor */}
          <select name="anestheticId" value={form.anestheticId} onChange={handleChange} required>
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

          <select name="anesthesiaType" value={form.anesthesiaType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="General">General</option>
            <option value="Local">Local</option>
            <option value="Epidural">Epidural</option>
          </select>

          <input type="datetime-local" name="induceTime" value={form.induceTime} onChange={handleChange} />
          <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} />

          <textarea
            name="medicinesUsedText"
            value={form.medicinesUsedText}
            onChange={handleChange}
            placeholder="Medicines used (optional)"
          />

          <button type="submit" style={{ padding: '10px', background: 'green', color: 'white' }}>
            Save Record
          </button>

        </form>
      </div>

      <button onClick={handlePrint} style={{ marginTop: '1rem' }}>
        Print
      </button>

      <ToastContainer />
    </div>
  );
};

export default AnesthesiaForm;