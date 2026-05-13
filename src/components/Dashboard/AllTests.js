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
    alert("Copied!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Lab Tests</h2>

      {tests.length === 0 ? (
        <p>No Tests Found</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Results</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((t) => (
                <tr key={t._id}>
                  <td>
                    {t.patientId?.fullName}
                    <br />
                    <small>({t.patientId?.patientId})</small>
                  </td>

                  <td>{t.testType}</td>

                  <td>{t.category || "-"}</td>

                  <td style={{
                    color: t.priority === "Urgent" ? "red" : "green",
                    fontWeight: "bold"
                  }}>
                    {t.priority}
                  </td>

                  <td style={{
                    color: t.status === "Completed" ? "green" : "orange"
                  }}>
                    {t.status}
                  </td>

                  <td>{t.results?.join(", ") || "-"}</td>

                  <td>{t.notes || "-"}</td>

                  <td>
                    {new Date(t.date).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      style={styles.button}
                      onClick={() => handleCopy(t)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllTests;

const styles = {
  container: {
    padding: "25px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  },

  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px"
  },

  th: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
    position: "sticky",
    top: 0
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px"
  },

  row: {
    transition: "0.2s"
  },

  button: {
    padding: "5px 10px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px"
  },

  badgeUrgent: {
    color: "#fff",
    backgroundColor: "red",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  },

  badgeNormal: {
    color: "#fff",
    backgroundColor: "green",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  },

  statusPending: {
    color: "#fff",
    backgroundColor: "orange",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  },

  statusDone: {
    color: "#fff",
    backgroundColor: "#2e7d32",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  }
};