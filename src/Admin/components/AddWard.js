import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddWard = () => {
  const [form, setForm] = useState({
    name: '',
    roomCategory: '',
    beds: [{ bedNumber: '', status: 'available' }]
  });

  const [roomCategories, setRoomCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  // ✅ Bulk upload states
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErrors, setUploadErrors] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ================= FETCH ROOM CATEGORIES =================
  useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`${BASE_URL}/api/admin/room-categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoomCategories(res.data.roomCategories || []);
      } catch (err) {
        console.error('Failed to load room categories:', err);
      }
    };
    fetchRoomCategories();
  }, []);

  // ================= FORM HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleBedChange = (index, e) => {
    const updatedBeds = [...form.beds];
    updatedBeds[index][e.target.name] = e.target.value;
    setForm({ ...form, beds: updatedBeds });

    const key = `bed-${index}`;
    setErrors({ ...errors, [key]: '' });
  };

  const addBedField = () => {
    setForm({
      ...form,
      beds: [...form.beds, { bedNumber: '', status: 'available' }]
    });
  };

  const removeBedField = (index) => {
    const updatedBeds = [...form.beds];
    updatedBeds.splice(index, 1);
    setForm({ ...form, beds: updatedBeds });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Ward name is required";

    const bedNumbers = form.beds.map(b => b.bedNumber.trim());
    const duplicates = bedNumbers.filter((item, i, arr) => arr.indexOf(item) !== i);
    const specialCharPattern = /[^a-zA-Z0-9]/;

    form.beds.forEach((bed, i) => {
      const key = `bed-${i}`;
      if (!bed.bedNumber.trim()) {
        errs[key] = "Bed number is required";
      } else if (specialCharPattern.test(bed.bedNumber)) {
        errs[key] = "No special characters allowed";
      } else if (duplicates.includes(bed.bedNumber.trim())) {
        errs[key] = "Duplicate bed number";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        `${BASE_URL}/api/admin/wards`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      setForm({
        name: '',
        roomCategory: '',
        beds: [{ bedNumber: '', status: 'available' }]
      });
      setErrors({});
      setShowForm(false);

    } catch (error) {
      if (error.response?.data?.message === "Ward already exists.") {
        setErrors({ name: "Ward already exists." });
      } else {
        setMessage(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setMessage('');
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
        `${BASE_URL}/api/admin/wards/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUploadMsg(res.data.message);
      setUploadErrors(res.data.errors || []);
      setFile(null);

    } catch (err) {
      setUploadMsg(err.response?.data?.message || "Upload failed");
      setUploadErrors(err.response?.data?.errors || []);
    }
  };

  // ================= UI =================
  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Add Ward</h2>

      {/* ================= FORM ================= */}
      {showForm ? (
        <form onSubmit={handleSubmit}>

          <div style={styles.field}>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <span style={styles.error}>{errors.name}</span>}
          </div>

          <div style={styles.field}>
            <label>Room Category:</label><br />
            <select
              name="roomCategory"
              value={form.roomCategory}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Category</option>
              {roomCategories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name} - {cat.description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label>Beds:</label>
            {form.beds.map((bed, index) => (
              <div key={index} style={styles.bedRow}>
                <input
                  type="text"
                  name="bedNumber"
                  value={bed.bedNumber}
                  onChange={(e) => handleBedChange(index, e)}
                  placeholder="Bed Number"
                  style={styles.bedInput}
                />

                <select
                  name="status"
                  value={bed.status}
                  onChange={(e) => handleBedChange(index, e)}
                  style={styles.bedSelect}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                </select>

                <button type="button" onClick={() => removeBedField(index)} style={styles.removeBtn}>
                  Remove
                </button>

                {errors[`bed-${index}`] && (
                  <span style={styles.error}>{errors[`bed-${index}`]}</span>
                )}
              </div>
            ))}

            <button type="button" onClick={addBedField} style={styles.addBtn}>
              + Add Bed
            </button>
          </div>

          <button type="submit" style={styles.submitBtn}>Submit</button>
        </form>

      ) : (
        <p style={styles.message} onClick={toggleForm}>
          ✅ {message} — click to add another ward
        </p>
      )}

      {/* ================= BULK UPLOAD ================= */}
      <div style={styles.bulkBox}>
        <h3>Bulk Upload Wards (Excel)</h3>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <br /><br />

        <button onClick={handleUpload} style={styles.addBtn}>
          Upload
        </button>

        {uploadMsg && <p style={{ marginTop: "10px" }}>{uploadMsg}</p>}

        {uploadErrors.length > 0 && (
          <div style={{ color: "red" }}>
            <h4>Errors:</h4>
            <ul>
              {uploadErrors.map((err, i) => (
                <li key={i}>
                  Row {err.row}: {err.error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= STYLES =================
const styles = {
  card: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  heading: { textAlign: "center" },
  field: { marginBottom: "15px" },
  input: { width: "100%", padding: "10px" },
  bedRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  bedInput: { flex: 2, padding: "10px" },
  bedSelect: { flex: 1, padding: "10px" },
  removeBtn: { background: "red", color: "#fff", padding: "5px" },
  addBtn: { background: "#3498db", color: "#fff", padding: "8px 12px" },
  submitBtn: { background: "green", color: "#fff", padding: "10px", width: "100%" },
  message: { color: "green", textAlign: "center" },
  error: { color: "red", fontSize: "0.8rem" },
  bulkBox: {
    marginTop: "30px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px"
  }
};

export default AddWard;