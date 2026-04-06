import React, { useState } from "react";
import axios from "axios";

const RoomCategory = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formVisible, setFormVisible] = useState(true);

  // ✅ Bulk upload states
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErrors, setUploadErrors] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        `${BASE_URL}/api/admin/room-categories`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      setMessage("Room category created successfully.");
      setForm({ name: "", description: "" });
      setFormVisible(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";

      if (errMsg === "Room category already exists.") {
        setErrors({ name: errMsg });
      } else {
        setMessage(errMsg);
      }
    }
  };

  // ================= BULK UPLOAD =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMsg("");
    setUploadErrors([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMsg("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        `${BASE_URL}/api/admin/room-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMsg(res.data.message);
      setUploadErrors([]);
      setFile(null);
    } catch (err) {
      setUploadMsg(err.response?.data?.message || "Upload failed");
      setUploadErrors(err.response?.data?.errorRows || []);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Room Category</h2>

      {/* ================= FORM ================= */}
      {!formVisible ? (
        <>
          <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
          <button onClick={() => setFormVisible(true)} style={{ padding: "10px 20px" }}>
            Create Another
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Description:</label><br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.description && <div style={{ color: "red" }}>{errors.description}</div>}
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
        </form>
      )}

      {/* ================= BULK UPLOAD ================= */}
      <div style={{ marginTop: "40px", padding: "15px", border: "1px solid #ccc" }}>
        <h3>Bulk Upload (Excel)</h3>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <br /><br />

        <button onClick={handleUpload}>Upload</button>

        {uploadMsg && <p style={{ marginTop: "10px" }}>{uploadMsg}</p>}

        {uploadErrors.length > 0 && (
          <div style={{ color: "red" }}>
            <h4>Error Rows:</h4>
            <ul>
              {uploadErrors.map((row, i) => (
                <li key={i}>Row {row}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCategory;