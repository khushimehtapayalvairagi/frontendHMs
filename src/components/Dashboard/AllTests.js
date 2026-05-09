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
          <div key={t._id} style={{ marginBottom: "10px" }}>
            <strong>{t.patientId?.name}</strong> - {t.testType} - {t.status}
          </div>
        ))
      )}
    </div>
  );
};

export default AllTests;