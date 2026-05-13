import React, { useEffect, useState } from "react";
import axios from "axios";

const AddTest = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    testType: "",
    results: ""
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch all patients
  useEffect(() => {
    axios.get(`${BASE_URL}/api/lab/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setPatients(res.data.patients || []);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  // ✅ Submit test
  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/lab/tests`, {
        ...form,
        results: form.results.split(",")
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Test Added Successfully");
    } catch (err) {
      console.log(err);
      alert("Error adding test");
    }
  };

  return (
    <div>
      <h2>Add Lab Test</h2>

      {/* ✅ Patient Dropdown */}
      <select
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
      >
        <option value="">Select Patient</option>
        {patients.map(p => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.phone})
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Test Type"
        onChange={e => setForm({ ...form, testType: e.target.value })}
      />

      <br /><br />

      <input
        placeholder="Results (comma separated)"
        onChange={e => setForm({ ...form, results: e.target.value })}
      />

      <br /><br />

      <button onClick={handleSubmit}>Add Test</button>
    </div>
  );
};

export default AddTest;