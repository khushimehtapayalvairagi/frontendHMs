import React, { useEffect, useState } from "react";
import axios from "axios";

const LabPayment = () => {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const fetchData = () => {
    axios.get(`${BASE_URL}/api/lab/payments/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPayments(res.data.payments || []))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Pay
  const markPaid = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/lab/payments/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Payment Done");
      fetchData();
    } catch (err) {
      alert("❌ Error");
    }
  };

  // 🖨️ PRINT RECEIPT
  const handlePrint = (p) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>

          <style>
            body {
              font-family: Arial;
              padding: 30px;
              background: #f4f6f8;
            }

            .receipt {
              max-width: 400px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 10px;
              background: #fff;
            }

            h2 {
              text-align: center;
              color: #1976d2;
              margin-bottom: 10px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
            }

            .total {
              font-size: 16px;
              font-weight: bold;
              margin-top: 10px;
            }

            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 13px;
            }
          </style>
        </head>

        <body>

          <div class="receipt">
            <h2>Lab Payment Receipt</h2>

            <div class="row"><span>Patient:</span> ${p.patientId?.fullName}</div>
            <div class="row"><span>ID:</span> ${p.patientId?.patientId}</div>
            <div class="row"><span>Test:</span> ${p.testId?.testType}</div>

            <hr/>

            <div class="row total">
              <span>Total:</span> ₹${p.amount}
            </div>

            <div class="row">
              <span>Status:</span> ${p.status}
            </div>

            <div class="row">
              <span>Date:</span>
              ${
                p.paymentDate
                  ? new Date(p.paymentDate).toLocaleDateString()
                  : "-"
              }
            </div>

            <div class="footer">
              Thank You 🙏
            </div>
          </div>


        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // 🔍 FILTER
  const filteredPayments = payments.filter(p =>
    activeTab === "pending"
      ? p.status === "Pending"
      : p.status === "Paid"
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💳 Lab Payments</h2>

      {/* ✅ Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "pending" ? "#1976d2" : "#ccc"
          }}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "history" ? "#1976d2" : "#ccc"
          }}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* ✅ Table */}
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
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td style={styles.td}>
                {p.patientId?.fullName}
                <br />
                <small>({p.patientId?.patientId})</small>
              </td>

              <td style={styles.td}>{p.testId?.testType}</td>

              <td style={styles.td}>₹{p.amount}</td>

              <td style={styles.td}>
                <span style={{
                  ...styles.status,
                  background: p.status === "Paid" ? "green" : "orange"
                }}>
                  {p.status}
                </span>
              </td>

              <td style={styles.td}>
                {p.paymentDate
                  ? new Date(p.paymentDate).toLocaleDateString()
                  : "-"}
              </td>

              <td style={styles.td}>
                {p.status === "Pending" && (
                  <button
                    style={styles.payBtn}
                    onClick={() => markPaid(p._id)}
                  >
                    Pay
                  </button>
                )}

                <button
                  style={styles.printBtn}
                  onClick={() => handlePrint(p)}
                >
                  Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabPayment;

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

  tabs: {
    textAlign: "center",
    marginBottom: "15px"
  },

  tabBtn: {
    margin: "5px",
    padding: "8px 15px",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff"
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

  status: {
    color: "#fff",
    padding: "4px 8px",
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