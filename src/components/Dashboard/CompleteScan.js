import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CompleteScan() {


const [cost, setCost] = useState("");
const [paymentStatus, setPaymentStatus] = useState("Unpaid");


  const [data, setData] = useState();


  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState("");
  const [file, setFile] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const handleSubmit = async () => {
    if (!report) {
      toast.error("Report required");
      return;
    }

    const formData = new FormData();
formData.append("report", report);
formData.append("status", "Completed");
formData.append("cost", cost);
formData.append("paymentStatus", paymentStatus);

if (file) {
  formData.append("file", file);

}
    // const formData = new FormData();
    // formData.append("report", report);
    // formData.append("status", "Completed");

    // if (file) {
    //   formData.append("file", file);
    // }

    try {
      await axios.put(
        `${BASE_URL}/api/sonography/complete/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Scan Completed ✅");
      navigate("/receptionist-dashboard/sonography-list");

    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Complete Sonography</h2>

      <textarea
        placeholder="Enter Report"
        value={report}
        onChange={(e) => setReport(e.target.value)}
        style={{ width: "100%", height: "120px" }}
      />

      {/* FILE UPLOAD */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginTop: "10px" }}
      />

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit
      </button>
    </div>
  );
}