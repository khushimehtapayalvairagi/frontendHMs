import React, { useEffect, useState } from "react";
import axios from "axios";

const MonthlyLabReport = () => {
  const [reports, setReports] = useState([]);
  const [totalTests, setTotalTests] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.get(
        `${BASE_URL}/api/reports/monthly-lab-report`,
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
setReports(res.data?.reports || []);
setTotalTests(res.data?.totalTests || 0);

    } catch (err) {
      console.error("Monthly Lab Report Error:", err);
      setReports([]);
      setTotalTests(0);
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
          {reports.length > 0 ? (
            reports.map((r, index) => (
              <tr key={r._id || index}>
                <td>
                  {r.date
                    ? new Date(r.date).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>
                  {r.patientId?.fullName || "N/A"}
                </td>

                <td>{r.testType || "N/A"}</td>

                <td>{r.status || "N/A"}</td>

                <td>
                  {r.labTechnician?.userId?.name || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Reports Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyLabReport;