import React, { useState } from 'react';
import axios from 'axios';

const AddOperationTheatre = () => {
  const [form, setForm] = useState({ name: '', status: 'Available' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  // 🔥 BULK STATES
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ================= MANUAL SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const token = localStorage.getItem('jwt');

      const res = await axios.post(
        `${BASE_URL}/api/admin/operation-theaters`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(res.data.message);
      setForm({ name: '', status: 'Available' });
      setShowForm(false);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      if (errorMsg.toLowerCase().includes('already exists')) {
        setErrors({ name: errorMsg });
      } else {
        setMessage(errorMsg);
      }
    }
  };

  // ================= BULK FILE SELECT =================
  const handleFileChange = (e) => {
    setBulkFile(e.target.files[0]);
    setBulkMessage('');
  };

  // ================= BULK UPLOAD =================
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setBulkMessage("Please select a file");
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('file', bulkFile);

      const res = await axios.post(
        `${BASE_URL}/api/admin/operation-theater/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setBulkMessage(res.data.message);
      setBulkFile(null);

    } catch (err) {
      console.error(err);
      setBulkMessage(err.response?.data?.message || "Bulk upload failed");
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setErrors({});
    setMessage('');
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>

      <h2 style={{ textAlign: 'center' }}>Add Operation Theater</h2>

      {/* ================= BULK UPLOAD ================= */}
      <div style={{
        marginBottom: '30px',
        padding: '15px',
        border: '1px dashed #ccc',
        borderRadius: '8px'
      }}>
        <h4>Bulk Upload (Excel)</h4>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
        />

        <button
          onClick={handleBulkUpload}
          style={{
            marginTop: '10px',
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Upload File
        </button>

        {bulkMessage && (
          <p style={{
            marginTop: '10px',
            color: bulkMessage.toLowerCase().includes('success') ? 'green' : 'red'
          }}>
            {bulkMessage}
          </p>
        )}

        
      </div>

      {/* ================= MANUAL FORM ================= */}
      {!showForm ? (
        <>
          {message && (
            <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>
              {message}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button onClick={toggleForm} style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              + Add Another
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '15px' }}>
            <label>Name</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Operation Theater Name"
              style={{ width: '100%', padding: '10px' }}
            />
            {errors.name && (
              <div style={{ color: 'red', marginTop: '5px' }}>{errors.name}</div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Status</label><br />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px'
          }}>
            Submit
          </button>

        </form>
      )}
    </div>
  );
};

export default AddOperationTheatre;