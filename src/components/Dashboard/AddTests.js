import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTest = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    testType: "",
    category: "",
    date: "",
    priority: "Normal",
    results: "",
    notes: ""
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch patients
  useEffect(() => {
    axios.get(`${BASE_URL}/api/lab/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPatients(res.data.patients || []))
    .catch(err => console.log(err));
  }, []);

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!form.patientId || !form.testType) {
      return toast.error("Patient & Test Type required");
    }

    try {
      await axios.post(`${BASE_URL}/api/lab/tests`, {
        ...form,
        results: form.results.split(","),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

     toast.success("✅ Test Added Successfully");

      // reset form
      setForm({
        patientId: "",
        testType: "",
        category: "",
        date: "",
        priority: "Normal",
        results: "",
        notes: ""
      });

    } catch (err) {
      console.log(err);
      toast.error("❌ Error adding test");
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        <h2 style={styles.title}>Add Lab Test</h2>

        {/* Patient */}
        <label style={styles.label}>Select Patient</label>
        <select
          style={styles.input}
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>
             {p.fullName} ({p.patientId})
            </option>
          ))}
        </select>

        {/* Test Type */}
        <label style={styles.label}>Test Type</label>
        <input
          style={styles.input}
          placeholder="Blood Test, X-Ray..."
          value={form.testType}
          onChange={e => setForm({ ...form, testType: e.target.value })}
        />

        {/* Category */}
        <label style={styles.label}>Category</label>
        <input
          style={styles.input}
          placeholder="Hematology, Radiology..."
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        {/* Date */}
        <label style={styles.label}>Test Date</label>
        <input
          type="date"
          style={styles.input}
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        {/* Priority */}
        <label style={styles.label}>Priority</label>
        <select
          style={styles.input}
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        {/* Results */}
        <label style={styles.label}>Results</label>
        <input
          style={styles.input}
          placeholder="Enter results (comma separated)"
          value={form.results}
          onChange={e => setForm({ ...form, results: e.target.value })}
        />

        {/* Notes */}
        <label style={styles.label}>Notes</label>
        <textarea
          style={{ ...styles.input, height: "80px" }}
          placeholder="Extra notes..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />

        {/* Button */}
        <button style={styles.button} onClick={handleSubmit}>
          Add Test
        </button>
      </div>
    </div>
  );
};

export default AddTest;





// ✅ Internal CSS
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px"
  },
  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  label: {
    fontWeight: "bold",
    marginTop: "10px",
    display: "block"
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};