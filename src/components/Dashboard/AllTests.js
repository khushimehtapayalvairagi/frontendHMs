import React, { useEffect, useState } from "react";
import axios from "axios";

const AllTests = () => {
  const [tests, setTests] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    axios.get(`${BASE_URL}/api/lab/tests`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setTests(res.data.tests || []);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <h2>All Lab Tests</h2>

      {tests.length === 0 ? (
        <p>No Tests Found</p>
      ) : (
     tests.map(t => (
  <div key={t._id} style={{
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px"
  }}>
    <h4>{t.patientId?.fullName} ({t.patientId?.patientId})</h4>

    <p><b>Test:</b> {t.testType}</p>
    <p><b>Category:</b> {t.category}</p>
    <p><b>Priority:</b> {t.priority}</p>
    <p><b>Status:</b> {t.status}</p>

    <p><b>Results:</b> {t.results?.join(", ")}</p>

    <p><b>Notes:</b> {t.notes}</p>

    <p><b>Date:</b> {new Date(t.date).toLocaleDateString()}</p>
  </div>
))
      )}
    </div>
  );
};

export default AllTests;