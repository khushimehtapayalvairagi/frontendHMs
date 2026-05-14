import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [amount, setAmount] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch tests
  const fetchTests = () => {
    axios.get(`${BASE_URL}/api/lab/tests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTests(res.data.tests || []))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // ✅ Upload Report + Payment (PRO SYSTEM)
  const handleUpload = async () => {
    if (!amount) return toast.error("Enter amount");

    try {
      await axios.post(`${BASE_URL}/api/lab/upload-report`, {
        testId: selectedTest._id,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Report + Payment Done");

      setSelectedTest(null);
      setAmount("");
      fetchTests();

    } catch (err) {
      console.log(err);
      toast.error("❌ Failed");
    }
  };

  // 🖨️ PRINT REPORT (ADVANCED DESIGN)
  const handlePrint = (test) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Lab Report</title>

          <style>
            body {
              font-family: Arial;
              padding: 30px;
              background: #f4f6f8;
            }

            .container {
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
            }

            .header h2 {
              margin: 0;
              color: #1976d2;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }

            .label {
              font-weight: bold;
            }

            .footer {
              margin-top: 40px;
              text-align: right;
            }

            .sign {
              margin-top: 50px;
            }
          </style>
        </head>

        <body>

          <div class="container">

            <div class="header">
              <h2>🧪 Lab Test Report</h2>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="row"><span class="label">Patient:</span> ${test.patientId?.fullName}</div>
            <div class="row"><span class="label">Patient ID:</span> ${test.patientId?.patientId}</div>
            <div class="row"><span class="label">Test:</span> ${test.testType}</div>
            <div class="row"><span class="label">Category:</span> ${test.category || "-"}</div>
            <div class="row"><span class="label">Status:</span> ${test.status}</div>
            <div class="row"><span class="label">Results:</span> ${test.results?.join(", ") || "-"}</div>
            <div class="row"><span class="label">Notes:</span> ${test.notes || "-"}</div>

            <div class="footer">
              <div class="sign">_______________________</div>
              <p>Authorized Signature</p>
            </div>

          </div>

        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div style={styles.container}>
      <ToastContainer />

      <h2 style={styles.title}>🧪 All Lab Tests</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Test</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Results</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tests.map(t => (
              <tr key={t._id}>
                <td style={styles.td}>
                  {t.patientId?.fullName}
                  <br />
                  <small>({t.patientId?.patientId})</small>
                </td>

                <td style={styles.td}>{t.testType}</td>

                <td style={styles.td}>
                  <span style={{
                    color: t.status === "Completed" ? "green" : "orange",
                    fontWeight: "bold"
                  }}>
                    {t.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {t.results?.join(", ") || "-"}
                </td>

                <td style={styles.td}>
                  {new Date(t.date).toLocaleDateString()}
                </td>

                <td style={styles.td}>
                  <button style={styles.printBtn} onClick={() => handlePrint(t)}>
                    Print
                  </button>

                  {t.status === "Pending" && (
                    <button
                      style={styles.uploadBtn}
                      onClick={() => setSelectedTest(t)}
                    >
                      Upload Report
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL */}
      {selectedTest && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Upload Report + Billing</h3>

            <p><b>{selectedTest.patientId?.fullName}</b></p>

            <input
              placeholder="Enter Amount ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />

            <div>
              <button style={styles.submitBtn} onClick={handleUpload}>
                Submit
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setSelectedTest(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTests;


// ✅ INTERNAL CSS
const styles = {
  container: {
    padding: "20px",
    background: "#f4f6f8",
    minHeight: "100vh"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: "10px",
    overflowX: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#1976d2",
    color: "#fff"
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px"
  },

  printBtn: {
    margin: "2px",
    padding: "5px 8px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px"
  },

  uploadBtn: {
    margin: "2px",
    padding: "5px 8px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "4px"
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },

  input: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    border: "1px solid #ccc"
  },

  submitBtn: {
    padding: "6px 10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px"
  },

  cancelBtn: {
    marginLeft: "10px",
    padding: "6px 10px",
    background: "red",
    color: "#fff",
    border: "none"
  }
};