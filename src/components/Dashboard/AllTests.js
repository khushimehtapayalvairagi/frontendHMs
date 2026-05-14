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
const handlePrint = (test) => {
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Lab Test Report</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: #f4f6f8;
          }

          .report-container {
            max-width: 700px;
            margin: auto;
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #ddd;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #1976d2;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }

          .header h1 {
            margin: 0;
            color: #1976d2;
          }

          .header p {
            margin: 2px 0;
            font-size: 13px;
            color: #555;
          }

          .section {
            margin-bottom: 15px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
            font-size: 14px;
          }

          .label {
            font-weight: bold;
            color: #333;
          }

          .value {
            color: #555;
          }

          .badge {
            padding: 3px 8px;
            border-radius: 5px;
            font-size: 12px;
            color: #fff;
          }

          .urgent {
            background: red;
          }

          .normal {
            background: green;
          }

          .pending {
            background: orange;
          }

          .completed {
            background: #2e7d32;
          }

          .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 13px;
          }

          .sign {
            margin-top: 40px;
          }

          @media print {
            body {
              background: #fff;
            }
          }
        </style>
      </head>

      <body>

        <div class="report-container">

          <div class="header">
            <h1>🧪 Lab Test Report</h1>
            <p>Hospital Management System</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Patient Name:</span>
              <span class="value">${test.patientId?.fullName}</span>
            </div>

            <div class="row">
              <span class="label">Patient ID:</span>
              <span class="value">${test.patientId?.patientId}</span>
            </div>

            <div class="row">
              <span class="label">Test:</span>
              <span class="value">${test.testType}</span>
            </div>

            <div class="row">
              <span class="label">Category:</span>
              <span class="value">${test.category || "-"}</span>
            </div>

            <div class="row">
              <span class="label">Priority:</span>
              <span class="value">
                <span class="badge ${test.priority === "Urgent" ? "urgent" : "normal"}">
                  ${test.priority}
                </span>
              </span>
            </div>

            <div class="row">
              <span class="label">Status:</span>
              <span class="value">
                <span class="badge ${test.status === "Completed" ? "completed" : "pending"}">
                  ${test.status}
                </span>
              </span>
            </div>

            <div class="row">
              <span class="label">Results:</span>
              <span class="value">${test.results?.join(", ") || "-"}</span>
            </div>

            <div class="row">
              <span class="label">Notes:</span>
              <span class="value">${test.notes || "-"}</span>
            </div>

            <div class="row">
              <span class="label">Test Date:</span>
              <span class="value">${new Date(test.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="footer">
            <p class="sign">________________________</p>
            <p>Authorized Signature</p>
          </div>

        </div>

      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
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
  onClick={() => handlePrint(t)}
>
  Print
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
  border: "1px solid #ddd"   // ✅ ADD THIS
},

td: {
  padding: "10px",
  fontSize: "14px",
  border: "1px solid #ddd"   // ✅ ADD THIS
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