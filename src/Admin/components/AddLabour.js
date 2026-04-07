import React, { useState } from 'react';
import axios from 'axios';

const AddLabour = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [mode, setMode] = useState("single"); // 🔥 single | bulk

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SINGLE CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        `${BASE_URL}/api/admin/labour-rooms`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setMessage(res.data.message);
      setForm({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  // ✅ BULK UPLOAD
  const handleBulkUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/api/admin/labour-rooms/bulk`, // ⚠️ check route
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Bulk upload failed");
    }
  };

  const handleAddAnother = () => {
    setMessage('');
    setShowForm(true);
    setMode("single");
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px'
    }}>

      <h2 style={{ textAlign: 'center' }}>Add Labour Room</h2>

      {/* 🔥 MODE SWITCH */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setMode("single")}>Single</button>
        <button onClick={() => setMode("bulk")}>Bulk Upload</button>
      </div>

      {showForm ? (
        <>
          {/* ================= SINGLE FORM ================= */}
          {mode === "single" && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter room name"
                required
                style={{ width: '100%', marginBottom: '10px' }}
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
                style={{ width: '100%', marginBottom: '10px' }}
              />

              <button type="submit">Create Labour Room</button>
            </form>
          )}

          {/* ================= BULK UPLOAD ================= */}
          {mode === "bulk" && (
            <div>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button onClick={handleBulkUpload} style={{ marginTop: '10px' }}>
                Upload Excel
              </button>

              <p style={{ fontSize: '12px', marginTop: '10px' }}>
                ⚠️ Excel format:
                <br />
                <b>name | description</b>
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{
            textAlign: 'center',
            color: message.toLowerCase().includes('success') ? 'green' : 'red'
          }}>
            {message}
          </p>

          <button onClick={handleAddAnother}>
            + Add Another
          </button>
        </>
      )}
    </div>
  );
};

export default AddLabour;