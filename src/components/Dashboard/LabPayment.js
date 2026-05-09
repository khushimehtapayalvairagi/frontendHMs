import React, { useEffect, useState } from "react";
import axios from "axios";

const LabPayment = () => {
  const [payments, setPayments] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // 🔥 Fetch payments
  const fetchData = () => {
    axios.get(`${BASE_URL}/api/lab/payments`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPayments(res.data.payments || []);
    })
    .catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Mark Paid
  const markPaid = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/lab/payments/${id}/pay`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Payment marked as Paid");

      fetchData(); // 🔄 refresh list
    } catch (err) {
      console.log(err);
      alert("Error updating payment");
    }
  };

  return (
    <div>
      <h2>Payments</h2>

      {payments.length === 0 ? (
        <p>No Pending Payments</p>
      ) : (
        payments.map(p => (
          <div key={p._id} style={{ marginBottom: "10px" }}>
            <strong>{p.patientId?.name}</strong> - ₹{p.amount}

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => markPaid(p._id)}
            >
              Mark Paid
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default LabPayment;