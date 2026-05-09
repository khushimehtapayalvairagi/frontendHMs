import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadReport = () => {
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState({
    testId: "",
    amount: ""
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch all pending tests
  useEffect(() => {
    axios.get(`${BASE_URL}/api/lab/tests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // सिर्फ Pending tests दिखाओ
      const pendingTests = res.data.tests.filter(t => t.status === "Pending");
      setTests(pendingTests);
    })
    .catch(err => console.log(err));
  }, []);

  // ✅ Upload Report
  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/lab/upload-report`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Report Uploaded Successfully");
    } catch (err) {
      console.log(err);
      alert("Error uploading report");
    }
  };

  return (
    <div>
      <h2>Upload Lab Report</h2>

      {/* ✅ Test Dropdown */}
      <select
        onChange={(e) => setForm({ ...form, testId: e.target.value })}
      >
        <option value="">Select Test</option>
        {tests.map(t => (
          <option key={t._id} value={t._id}>
            {t.patientId?.name} - {t.testType}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Amount"
        onChange={e => setForm({ ...form, amount: e.target.value })}
      />

      <br /><br />

      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

export default UploadReport;