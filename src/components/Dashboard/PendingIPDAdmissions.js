import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PendingIPDAdmissions = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const [pendingPatients, setPendingPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPendingAdmissions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/ipd/pending-admissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Pending Admissions API Response:", res.data);

      const admissions =
        res.data?.pendingAdmissions ||
        res.data?.admissions ||
        res.data?.data ||
        [];

      setPendingPatients(admissions);
    } catch (err) {
      console.error("Pending Admission Error:", err);
      setPendingPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdmissions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending IPD Admissions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingPatients.length > 0 ? (
              pendingPatients.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.patientName ||
                      item.patientId?.fullName ||
                      "N/A"}
                  </td>

                  <td>
                    {item.doctorName ||
                      item.doctorId?.userId?.name ||
                      "N/A"}
                  </td>

                  <td>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(
                          "/receptionist-dashboard/IPDAdmissionForm",
                          {
                            state: item,
                          }
                        )
                      }
                    >
                      Admit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Pending Admissions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingIPDAdmissions;