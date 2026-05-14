import React, { useEffect, useState } from "react";
import axios from "axios";

const LabPayment = () => {
  const [payments, setPayments] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const fetchData = () => {
    axios.get(`${BASE_URL}/api/lab/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPayments(res.data.payments || []))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Mark Paid
  const markPaid = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/lab/payments/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Payment Done");
      fetchData();

    } catch (err) {
      console.log(err);
      alert("❌ Error");
    }
  };

  // ✅ PRINT RECEIPT
  const handlePrint = (p) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .receipt {
              width: 320px;
              border: 1px solid #000;
              padding: 15px;
              margin: auto;
            }
            h3 { text-align: center; margin-bottom: 10px; }
            p { margin: 4px 0; font-size: 14px; }
            hr { margin: 10px 0; }
          </style>
        </head>
        <body>

          <div class="receipt">
            <h3>Lab Payment Receipt</h3>

            <p><b>Patient:</b> ${p.patientId?.fullName}</p>
            <p><b>ID:</b> ${p.patientId?.patientId}</p>
            <p><b>Test:</b> ${p.testId?.testType}</p>

            <hr />

            <p><b>Amount:</b> ₹${p.amount}</p>
            <p><b>Status:</b> ${p.status}</p>

            <p><b>Date:</b> ${
              p.paymentDate
                ? new Date(p.paymentDate).toLocaleDateString()
                : "Pending"
            }</p>

            <hr />
            <p style="text-align:center">Thank You</p>
          </div>

        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lab Payments</h2>

      {payments.length === 0 ? (
        <p style={{ textAlign: "center" }}>No Pending Payments</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Test</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td style={styles.td}>
                  {p.patientId?.fullName}
                  <br />
                  <small>({p.patientId?.patientId})</small>
                </td>

                <td style={styles.td}>
                  {p.testId?.testType}
                </td>

                <td style={styles.td}>₹{p.amount}</td>

                <td style={styles.td}>
                  <span style={styles.pending}>
                    {p.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {p.paymentDate
                    ? new Date(p.paymentDate).toLocaleDateString()
                    : "-"}
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.payBtn}
                    onClick={() => markPaid(p._id)}
                  >
                    Pay
                  </button>

                  <button
                    style={styles.printBtn}
                    onClick={() => handlePrint(p)}
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LabPayment;


// ✅ Internal CSS
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },

  th: {
    background: "#1976d2",
    color: "#fff",
    padding: "12px",
    border: "1px solid #ddd"
  },

  td: {
    padding: "10px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },

  pending: {
    background: "orange",
    color: "#fff",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  },

  payBtn: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  printBtn: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};