import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedTest, setSelectedTest] = useState(null);
  const [amount, setAmount] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch Tests + Payments
  const fetchData = async () => {
    try {
      const testRes = await axios.get(`${BASE_URL}/api/lab/tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payRes = await axios.get(`${BASE_URL}/api/lab/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTests(testRes.data.tests || []);

      // convert payments to map { testId: payment }
      const map = {};
      payRes.data.payments.forEach(p => {
        map[p.testId?._id] = p;
      });
      setPayments(map);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Upload Report + Create Payment
  const handleUpload = async () => {
    if (!amount) return toast.error("Enter amount");

    try {
      await axios.post(`${BASE_URL}/api/lab/upload-report`, {
        testId: selectedTest._id,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Report + Payment Created");

      setSelectedTest(null);
      setAmount("");
      fetchData();

    } catch (err) {
      toast.error("❌ Failed");
    }
  };

  // ✅ Mark Payment Paid
  const handlePay = async (paymentId) => {
    try {
      await axios.put(`${BASE_URL}/api/lab/payments/${paymentId}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("💰 Payment Done");
      fetchData();

    } catch (err) {
      toast.error("❌ Payment Failed");
    }
  };

  // 🧾 PRINT RECEIPT
  const printReceipt = (p) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .box {
              width: 320px;
              margin: auto;
              border: 1px solid #000;
              padding: 15px;
            }
            h3 { text-align: center; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>

          <div class="box">
            <h3>Lab Receipt</h3>

            <p><b>Patient:</b> ${p.patientId?.fullName}</p>
            <p><b>ID:</b> ${p.patientId?.patientId}</p>
            <p><b>Test:</b> ${p.testId?.testType}</p>

            <hr/>

            <p><b>Amount:</b> ₹${p.amount}</p>
            <p><b>Status:</b> ${p.status}</p>

            <p><b>Date:</b> ${
              p.paymentDate
                ? new Date(p.paymentDate).toLocaleDateString()
                : "-"
            }</p>

            <hr/>
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
      <ToastContainer />

      <h2 style={styles.title}>🧪 Lab Tests + Payments</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Test</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tests.map(t => {
              const payment = payments[t._id];

              return (
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

                  {/* PAYMENT STATUS */}
                  <td style={styles.td}>
                    {payment ? (
                      <span style={{
                        color: payment.status === "Paid" ? "green" : "orange",
                        fontWeight: "bold"
                      }}>
                        {payment.status}
                      </span>
                    ) : "—"}
                  </td>

                  {/* AMOUNT */}
                  <td style={styles.td}>
                    {payment ? `₹${payment.amount}` : "-"}
                  </td>

                  {/* ACTIONS */}
                  <td style={styles.td}>

                    {/* Upload */}
                    {t.status === "Pending" && (
                      <button
                        style={styles.uploadBtn}
                        onClick={() => setSelectedTest(t)}
                      >
                        Upload
                      </button>
                    )}

                    {/* Pay */}
                    {payment && payment.status === "Pending" && (
                      <button
                        style={styles.payBtn}
                        onClick={() => handlePay(payment._id)}
                      >
                        Pay
                      </button>
                    )}

                    {/* Receipt */}
                    {payment && (
                      <button
                        style={styles.printBtn}
                        onClick={() => printReceipt(payment)}
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedTest && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Upload Report + Billing</h3>

            <p>{selectedTest.patientId?.fullName}</p>

            <input
              placeholder="Enter Amount"
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


// ✅ CSS
const styles = {
  container: { padding: "20px", background: "#f4f6f8" },
  title: { textAlign: "center", marginBottom: "20px" },

  tableWrapper: {
    background: "#fff",
    borderRadius: "10px",
    overflowX: "auto"
  },

  table: { width: "100%", borderCollapse: "collapse" },

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

  uploadBtn: {
    background: "green",
    color: "#fff",
    margin: "2px",
    padding: "5px 8px",
    border: "none"
  },

  payBtn: {
    background: "orange",
    color: "#fff",
    margin: "2px",
    padding: "5px 8px",
    border: "none"
  },

  printBtn: {
    background: "#1976d2",
    color: "#fff",
    margin: "2px",
    padding: "5px 8px",
    border: "none"
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px"
  },

  input: {
    width: "100%",
    padding: "8px",
    margin: "10px 0"
  },

  submitBtn: {
    background: "#1976d2",
    color: "#fff",
    padding: "6px 10px",
    border: "none"
  },

  cancelBtn: {
    marginLeft: "10px",
    background: "red",
    color: "#fff",
    padding: "6px 10px",
    border: "none"
  }
};