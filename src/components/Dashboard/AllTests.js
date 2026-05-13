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

  // ✅ Copy Function
  const handleCopy = (test) => {
    const text = `
Patient: ${test.patientId?.fullName} (${test.patientId?.patientId})
Test: ${test.testType}
Category: ${test.category}
Priority: ${test.priority}
Status: ${test.status}
Results: ${test.results?.join(", ")}
Notes: ${test.notes}
Date: ${new Date(test.date).toLocaleDateString()}
    `;

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Lab Tests</h2>

      {tests.length === 0 ? (
        <p>No Tests Found</p>
      ) : (
        <div style={styles.grid}>
          {tests.map(t => (
            <div key={t._id} style={styles.card}>
              
              <h4 style={styles.name}>
                {t.patientId?.fullName}
                <span style={styles.id}> ({t.patientId?.patientId})</span>
              </h4>

              <p><b>Test:</b> {t.testType}</p>
              <p><b>Category:</b> {t.category || "-"}</p>

              <p>
                <b>Priority:</b>{" "}
                <span style={{
                  color: t.priority === "Urgent" ? "red" : "green",
                  fontWeight: "bold"
                }}>
                  {t.priority}
                </span>
              </p>

              <p>
                <b>Status:</b>{" "}
                <span style={{
                  color: t.status === "Completed" ? "green" : "orange"
                }}>
                  {t.status}
                </span>
              </p>

              <p><b>Results:</b> {t.results?.join(", ") || "-"}</p>
              <p><b>Notes:</b> {t.notes || "-"}</p>
              <p><b>Date:</b> {new Date(t.date).toLocaleDateString()}</p>

              {/* ✅ Copy Button */}
              <button 
                style={styles.button}
                onClick={() => handleCopy(t)}
              >
                Copy
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTests;