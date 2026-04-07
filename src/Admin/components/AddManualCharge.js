import React, { useState } from 'react';
import axios from 'axios';

const AddManualCharge = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // 🔹 Form state
  const [form, setForm] = useState({
    itemName: '',
    category: '',
    defaultPrice: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  // 🔹 Bulk upload state
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // 🔹 Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // 🔹 Manual submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const token = localStorage.getItem('jwt');

      const res = await axios.post(
        `${BASE_URL}/api/admin/manual-charge-items`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(res.data.message);
      setForm({ itemName: '', category: '', defaultPrice: '', description: '' });
      setShowForm(false);

    } catch (err) {
      const backendErrors = err.response?.data?.errors || {};
      const fallback = err.response?.data?.message || 'Something went wrong';

      if (fallback.toLowerCase().includes('exist')) {
        setErrors({ itemName: fallback });
      } else {
        setErrors(backendErrors);
        if (!Object.keys(backendErrors).length) setMessage(fallback);
      }
    }
  };

  // 🔹 Bulk upload
  const handleBulkUpload = async () => {
    if (!file) {
      alert("Please select Excel file");
      return;
    }

    try {
      const token = localStorage.getItem('jwt');

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/api/admin/manual-charge-item/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUploadMessage(res.data.message);
      setFile(null);

    } catch (err) {
      console.error(err);
      setUploadMessage(
        err.response?.data?.message || "Upload failed"
      );
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{
        maxWidth: '650px',
        width: '100%',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>

        <h2 style={{ textAlign: 'center' }}>Manual Charge Entry</h2>

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
              cursor: 'pointer',
              width: '100%'
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
            Excel format: <b>itemName | category | defaultPrice | description</b>
          </p>
        </div>

        {/* Toggle button */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setMessage('');
              setErrors({});
            }}
            style={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              width: '100%'
            }}
          >
            Add New Manual Charge
          </button>
        )}

        {/* ================= FORM ================= */}
        {showForm ? (
          <form onSubmit={handleSubmit}>

            {/* Item Name */}
            <div style={{ marginBottom: '15px' }}>
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px' }}
              />
              {errors.itemName && <div style={{ color: 'red' }}>{errors.itemName}</div>}
            </div>

            {/* Category */}
            <div style={{ marginBottom: '15px' }}>
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="">Select Category</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Lab">Lab</option>
                <option value="Labour Room">Labour Room</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
            </div>

            {/* Price */}
            <div style={{ marginBottom: '15px' }}>
              <label>Default Price</label>
              <input
                type="number"
                name="defaultPrice"
                value={form.defaultPrice}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px' }}
              />
              {errors.defaultPrice && <div style={{ color: 'red' }}>{errors.defaultPrice}</div>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '15px' }}>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                backgroundColor: '#2ecc71',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                width: '100%'
              }}
            >
              Submit
            </button>

          </form>
        ) : (
          <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddManualCharge;