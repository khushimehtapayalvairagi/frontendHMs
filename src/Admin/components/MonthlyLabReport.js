import React, { useEffect, useState } from "react";
import axios from "axios";

const MonthlyLabReport = () => {
  const [reports, setReports] = useState([]);
  const [totalTests, setTotalTests] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/reports/monthly-lab-report`,
        {
          params: {
            startDate,
            endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data.reports);
      setTotalTests(res.data.totalTests);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧪 Monthly Lab Report</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={fetchReport}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
          }}
        >
          Search
        </button>
      </div>

      <h3>Total Tests: {totalTests}</h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Test Type</th>
            <th>Status</th>
            <th>Technician</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td>
                {new Date(r.date).toLocaleDateString()}
              </td>

              <td>
                {r.patientId?.fullName}
              </td>

              <td>{r.testType}</td>

              <td>{r.status}</td>

              <td>
                {r.labTechnician?.userId?.name || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyLabReport;