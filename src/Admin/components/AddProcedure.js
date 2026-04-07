import React, { useState } from 'react';
import axios from 'axios';

const Procedure = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // 🔹 Single form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    cost: ''
  });

  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  // 🔹 Bulk upload state
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  // 🔹 Single submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});

    try {
      const token = localStorage.getItem('jwt');

      const response = await axios.post(
        `${BASE_URL}/api/admin/procedures`,
        {
          name: form.name,
          description: form.description,
          cost: Number(form.cost)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: false
        }
      );

      if (response.status === 201) {
        setMessage(response.data.message);
        setForm({ name: '', description: '', cost: '' });
        setShowForm(false);
      } else {
        if (response.data.message?.toLowerCase().includes('already')) {
          setFieldErrors({ name: response.data.message });
        } else {
          setMessage(response.data.message || 'Failed to create procedure');
        }
      }

    } catch (error) {
      console.error(error);
      setMessage('Something went wrong');
    }
  };

  // 🔹 Bulk upload handler
  const handleBulkUpload = async () => {
    if (!file) {
      alert("Please select Excel file");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/api/admin/procedure/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUploadMessage(`${res.data.message} (${res.data.count})`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setUploadMessage(
        err.response?.data?.message || "Upload failed"
      );
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setMessage('');
    setFieldErrors({});
  };

  return (
    <div style={{
      maxWidth: '650px',
      margin: '40px auto',
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>

      <h2 style={{ textAlign: 'center' }}>Add Procedure</h2>

      {/* ================= BULK UPLOAD ================= */}
      <div style={{
        marginBottom: '25px',
        padding: '15px',
        background: '#f4f6f7',
        borderRadius: '8px'
      }}>
        <h3>📂 Bulk Upload (Excel)</h3>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleBulkUpload}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#8e44ad',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Upload Excel
        </button>

        {uploadMessage && (
          <p style={{
            marginTop: '10px',
            color: uploadMessage.toLowerCase().includes('success') ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {uploadMessage}
          </p>
        )}

        <p style={{ fontSize: '13px', marginTop: '10px' }}>
          Excel format: <b>name | description | cost</b>
        </p>
      </div>

      {/* ================= SINGLE FORM ================= */}
      {!showForm ? (
        <>
          {message && (
            <p style={{
              textAlign: 'center',
              color: message.toLowerCase().includes('success') ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {message}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button
              onClick={toggleForm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              + Add Another
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '95%', padding: '10px' }}
            />
            {fieldErrors.name && (
              <div style={{ color: 'red' }}>{fieldErrors.name}</div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '15px' }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="3"
              style={{ width: '95%', padding: '10px' }}
            />
          </div>

          {/* Cost */}
          <div style={{ marginBottom: '15px' }}>
            <label>Cost:</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              required
              style={{ width: '95%', padding: '10px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            Create Procedure
          </button>
        </form>
      )}
    </div>
  );
};

export default Procedure;