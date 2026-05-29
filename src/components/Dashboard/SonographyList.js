import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from "@mui/icons-material/Edit";


const ViewSonography = () => {


const [editMode, setEditMode] = useState(false);
const [editData, setEditData] = useState({});


  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  // ✅ FETCH (FIXED LIKE ANESTHESIA)
   const fetchAll = async () => {
    const token = localStorage.getItem('jwt');

    try {
      const res = await axios.get(
        `${BASE_URL}/api/sonography`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRecords(res.data || []);
      setFilteredRecords(res.data || []);

    } 
    
    catch (err) {
  console.error("FETCH ERROR:", err.response?.data || err.message);
  toast.error('Failed to fetch sonography');
}

    // catch {
    //   toast.error('Failed to fetch sonography');
    // }
    
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);


  // ✅ SEARCH
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = records.filter(r =>
      r?.patientId?.fullName?.toLowerCase().includes(lower)
    );

    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);

    setEditMode(false);

  };




  const handleEditOpen = () => {
  setEditMode(true);
  setEditData({
    scanType: selectedRecord.scanType || "",
    cost: selectedRecord.cost || "",
    paymentStatus: selectedRecord.paymentStatus || "",
    report: selectedRecord.report || "",
    startDate: selectedRecord.startDate
      ? selectedRecord.startDate.slice(0,16)
      : "",
    endDate: selectedRecord.endDate
      ? selectedRecord.endDate.slice(0,16)
      : ""
  });
};


const handleUpdate = async () => {

  try {

    const token = localStorage.getItem("jwt");

    await axios.put(
      `${BASE_URL}/api/sonography/${selectedRecord._id}`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Record updated successfully");

    // dialog update
    setSelectedRecord({
      ...selectedRecord,
      ...editData
    });

    // table update without refresh
    const updatedRecords = records.map(item =>
      item._id === selectedRecord._id
        ? { ...item, ...editData }
        : item
    );

    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);

    setEditMode(false);

  } catch (err) {

    console.log(err.response?.data || err.message);
    toast.error("Update failed");
  }
};



  // ✅ DELETE RECORD
const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this sonography record?"
  );

  if (!confirmDelete) return;

  try {

    const token = localStorage.getItem("jwt");

    await axios.delete(
      `${BASE_URL}/api/sonography/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // ✅ REMOVE FROM UI
    const updatedRecords = records.filter(
      (item) => item._id !== id
    );

    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);

    toast.success("Sonography record deleted successfully");

    // ✅ CLOSE DIALOG
    handleCloseDialog();

  } catch (err) {

    console.error(
      "DELETE ERROR:",
      err.response?.data || err.message
    );

    toast.error("Failed to delete record");
  }
};

  // ✅ PRINT REPORT
// const printReport = (record) => {
//   const printWindow = window.open("", "_blank");

//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>Sonography Report</title>

//         <style>
//           body {
//             font-family: Arial;
//             padding: 30px;
//           }

//           h1 {
//             text-align: center;
//             margin-bottom: 30px;
//           }

//           .section {
//             margin-bottom: 15px;
//           }

//           .label {
//             font-weight: bold;
//           }

//           .report-box {
//             border: 1px solid #ccc;
//             padding: 15px;
//             margin-top: 10px;
//             min-height: 120px;
//           }
//         </style>
//       </head>

//       <body>
//         <h1>Sonography Report</h1>

//         <div class="section">
//           <span class="label">Patient:</span>
//           ${record.patientId?.fullName || "N/A"}
//         </div>

//         <div class="section">
//           <span class="label">Scan Type:</span>
//           ${record.scanType || "N/A"}
//         </div>

//         <div class="section">
//           <span class="label">Start Date:</span>
//           ${
//             record.startDate
//               ? new Date(record.startDate).toLocaleString()
//               : "N/A"
//           }
//         </div>

//         <div class="section">
//           <span class="label">End Date:</span>
//           ${
//             record.endDate
//               ? new Date(record.endDate).toLocaleString()
//               : "N/A"
//           }
//         </div>

//         <div class="section">
//           <span class="label">Cost:</span>
//           ₹${record.cost || 0}
//         </div>

//         <div class="section">
//           <span class="label">Payment Status:</span>
//           ${record.paymentStatus || "N/A"}
//         </div>

//         <div class="section">
//           <span class="label">Manual Charge:</span>
//           ${record.manualChargeId?.itemName || "N/A"}
//         </div>

//         <div class="section">
//           <span class="label">Report:</span>

//           <div class="report-box">
//             ${record.report || "No Report"}
//           </div>
//         </div>

//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   // ✅ PRINT
//   printWindow.print();
// };


// ✅ BEAUTIFUL PRINT REPORT
const printReport = (record) => {

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Sonography Report</title>

        <style>

          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{
            font-family: Arial, sans-serif;
            padding:40px;
            color:#222;
            background:#fff;
          }

          .report-container{
            border:2px solid #1976d2;
            border-radius:12px;
            overflow:hidden;
          }

          /* HEADER */
          .header{
            background:#1976d2;
            color:white;
            padding:25px;
            text-align:center;
          }

          .hospital-name{
            font-size:30px;
            font-weight:bold;
            letter-spacing:1px;
          }

          .subtitle{
            margin-top:5px;
            font-size:14px;
          }

          /* TITLE */
          .title{
            text-align:center;
            font-size:24px;
            font-weight:bold;
            margin:25px 0;
            color:#1976d2;
          }

          /* INFO SECTION */
          .content{
            padding:0 30px 30px;
          }

          .info-grid{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:18px;
            margin-bottom:25px;
          }

          .info-box{
            background:#f5f7fa;
            padding:15px;
            border-radius:10px;
            border-left:5px solid #1976d2;
          }

          .label{
            font-size:13px;
            color:#666;
            margin-bottom:5px;
          }

          .value{
            font-size:17px;
            font-weight:bold;
            color:#111;
          }

          /* REPORT */
          .report-section{
            margin-top:20px;
          }

          .report-heading{
            font-size:20px;
            margin-bottom:10px;
            color:#1976d2;
            font-weight:bold;
          }

          .report-box{
            border:1px solid #ccc;
            border-radius:10px;
            padding:20px;
            min-height:150px;
            line-height:1.8;
            background:#fafafa;
            font-size:16px;
          }

          /* FOOTER */
          .footer{
            margin-top:70px;
            display:flex;
            justify-content:space-between;
            align-items:center;
          }

          .signature{
            text-align:center;
          }

          .signature-line{
            width:220px;
            border-top:1px solid #000;
            margin-bottom:8px;
          }

          .date{
            font-size:14px;
            color:#666;
          }

          @media print{
            body{
              padding:10px;
            }

            .report-container{
              border:2px solid #000;
            }
          }

        </style>
      </head>

      <body>

        <div class="report-container">

          <!-- HEADER -->
          <div class="header">
            <div class="hospital-name">
              CARE CURE HOSPITAL
            </div>

            <div class="subtitle">
              Sonography Department
            </div>
          </div>

          <!-- TITLE -->
          <div class="title">
            SONOGRAPHY REPORT
          </div>

          <!-- CONTENT -->
          <div class="content">

            <div class="info-grid">

              <div class="info-box">
                <div class="label">Patient Name</div>
                <div class="value">
                  ${record.patientId?.fullName || "N/A"}
                </div>
              </div>

              <div class="info-box">
                <div class="label">Scan Type</div>
                <div class="value">
                  ${record.scanType || "N/A"}
                </div>
              </div>

              <div class="info-box">
                <div class="label">Start Date</div>
                <div class="value">
                  ${
                    record.startDate
                      ? new Date(record.startDate).toLocaleString()
                      : "N/A"
                  }
                </div>
              </div>

              <div class="info-box">
                <div class="label">End Date</div>
                <div class="value">
                  ${
                    record.endDate
                      ? new Date(record.endDate).toLocaleString()
                      : "N/A"
                  }
                </div>
              </div>

              <div class="info-box">
                <div class="label">Cost</div>
                <div class="value">
                  ₹${record.cost || 0}
                </div>
              </div>

              <div class="info-box">
                <div class="label">Payment Status</div>
                <div class="value">
                  ${record.paymentStatus || "N/A"}
                </div>
              </div>

            </div>

            <!-- REPORT -->
            <div class="report-section">

              <div class="report-heading">
                Report Details
              </div>

              <div class="report-box">
                ${record.report || "No Report Available"}
              </div>

            </div>

            <!-- FOOTER -->
            <div class="footer">

              <div class="date">
                Printed On:
                ${new Date().toLocaleString()}
              </div>

              <div class="signature">
                <div class="signature-line"></div>
                <div>Doctor Signature</div>
              </div>

            </div>

          </div>

        </div>

      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 500);
};

  // ✅ WHATSAPP
  const sendWhatsApp = (record) => {
    const phone = record.patientId?.contactNumber;

    if (!phone) {
      toast.error("Patient phone not available");
      return;
    }

    const msg = `
📋 Sonography Report

👤 Patient: ${record.patientId?.fullName}
🧪 Scan: ${record.scanType}
// 📊 Status: ${record.status}

📝 Report:
${record.report || "Pending"}
`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };




  // ✅ PRINT REPORT
// const printReport = (record) => {

//   const printWindow = window.open("", "_blank");

//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>Sonography Report</title>

//         <style>
//           body{
//             font-family: Arial;
//             padding:40px;
//           }

//           h1{
//             text-align:center;
//             color:#1976d2;
//           }

//           .box{
//             margin-bottom:15px;
//             font-size:18px;
//           }

//           .label{
//             font-weight:bold;
//           }

//           .report{
//             border:1px solid #ccc;
//             padding:15px;
//             margin-top:10px;
//             min-height:120px;
//           }

//           .footer{
//             margin-top:50px;
//             text-align:right;
//           }
//         </style>
//       </head>

//       <body>

//         <h1>Care Cure Hospital</h1>

//         <hr />

//         <div class="box">
//           <span class="label">Patient:</span>
//           ${record.patientId?.fullName || "N/A"}
//         </div>

//         <div class="box">
//           <span class="label">Scan Type:</span>
//           ${record.scanType || "N/A"}
//         </div>

//         <div class="box">
//           <span class="label">Start Date:</span>
//           ${
//             record.startDate
//               ? new Date(record.startDate).toLocaleString()
//               : "N/A"
//           }
//         </div>

//         <div class="box">
//           <span class="label">End Date:</span>
//           ${
//             record.endDate
//               ? new Date(record.endDate).toLocaleString()
//               : "N/A"
//           }
//         </div>

//         <div class="box">
//           <span class="label">Cost:</span>
//           ₹${record.cost || 0}
//         </div>

//         <div class="box">
//           <span class="label">Payment Status:</span>
//           ${record.paymentStatus || "N/A"}
//         </div>

//         <div class="box">
//           <span class="label">Report:</span>

//           <div class="report">
//             ${record.report || "No Report"}
//           </div>
//         </div>

//         <div class="footer">
//           <p>Doctor Signature</p>
//         </div>

//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   printWindow.focus();

//   setTimeout(() => {
//     printWindow.print();
//   }, 500);
// };


  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sonography Records</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search patient..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {filteredRecords.length === 0 ? (
        <p style={styles.center}>No records found</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>👤 Patient</TableCell>
                <TableCell>🧪 Scan</TableCell>
                {/* <TableCell>📊 Status</TableCell> */}

                   <TableCell>📅 Start Date</TableCell>
                   <TableCell>📅 End Date</TableCell>

                 <TableCell>💰 Cost</TableCell>        {/* ✅ NEW */}
                 <TableCell>💳 Payment</TableCell>     {/* ✅ NEW */}
                 <TableCell>🧾 Manual Charge</TableCell> {/* ✅ NEW */}   
                <TableCell align="center">Details</TableCell>
                <TableCell align="center">Action</TableCell>
                
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords.map(record => (
                <TableRow key={record._id}>
                  <TableCell>{record.patientId?.fullName || "N/A"}</TableCell>

                  <TableCell>{record.scanType || "N/A"}</TableCell>



                  <TableCell>
  {record.startDate
    ? new Date(record.startDate).toLocaleString()
    : "N/A"}
</TableCell>

<TableCell>
  {record.endDate
    ? new Date(record.endDate).toLocaleString()
    : "N/A"}
</TableCell>

      {/* ✅ Cost */}
      <TableCell>₹{record.cost || 0}</TableCell>

      {/* ✅ Payment Status */}
      <TableCell>{record.paymentStatus || "N/A"}</TableCell>

      {/* ✅ Manual Charge Name */}
      <TableCell>
        {record.manualChargeId?.itemName || "N/A"}
      </TableCell>
                  {/* <TableCell>
                    <span style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      color: "#fff",
                      background:
                        record.status === "Completed" ? "green" :
                        record.status === "Pending" ? "orange" : "gray"
                    }}>
                      {record.status}
                    </span>
                  </TableCell> */}

                  {/* <TableCell>
                    <IconButton onClick={() => handleOpenDialog(record)}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </TableCell> */}


                  <TableCell align="center">
  <IconButton
    onClick={() => handleOpenDialog(record)}
    color="primary"
  >
    <ExpandMoreIcon />
  </IconButton>
</TableCell>

<TableCell align="center">
<IconButton
  onClick={() => handleDelete(record._id)}
  sx={{
    color: "red",
    "&:hover": {
      background: "#ffebee"
    }
  }}
>
  <DeleteIcon />
</IconButton>
</TableCell>


                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      )}

      {/* ✅ DETAILS DIALOG */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>📝 Sonography Details</DialogTitle>


<DialogContent>
  {selectedRecord && (
    <>
      <p>
        <strong>👤 Patient:</strong>{" "}
        {selectedRecord.patientId?.fullName}
      </p>

      {editMode ? (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="Scan Type"
            value={editData.scanType}
            onChange={(e) =>
              setEditData({
                ...editData,
                scanType: e.target.value
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Start Date"
            type="datetime-local"
            value={editData.startDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setEditData({
                ...editData,
                startDate: e.target.value
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="End Date"
            type="datetime-local"
            value={editData.endDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setEditData({
                ...editData,
                endDate: e.target.value
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Cost"
            type="number"
            value={editData.cost}
            onChange={(e) =>
              setEditData({
                ...editData,
                cost: e.target.value
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Payment Status"
            value={editData.paymentStatus}
            onChange={(e) =>
              setEditData({
                ...editData,
                paymentStatus: e.target.value
              })
            }
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            margin="dense"
            label="Report"
            value={editData.report}
            onChange={(e) =>
              setEditData({
                ...editData,
                report: e.target.value
              })
            }
          />
        </>
      ) : (
        <>
          <p><strong>🧪 Scan:</strong> {selectedRecord.scanType}</p>

          <p>
            <strong>📅 Start Date:</strong>{" "}
            {selectedRecord.startDate
              ? new Date(selectedRecord.startDate).toLocaleString()
              : "N/A"}
          </p>

          <p>
            <strong>📅 End Date:</strong>{" "}
            {selectedRecord.endDate
              ? new Date(selectedRecord.endDate).toLocaleString()
              : "N/A"}
          </p>

          <p><strong>💰 Cost:</strong> ₹{selectedRecord.cost || 0}</p>

          <p>
            <strong>💳 Payment:</strong>{" "}
            {selectedRecord.paymentStatus}
          </p>

          <p>
            <strong>🧾 Manual Charge:</strong>{" "}
            {selectedRecord.manualChargeId?.itemName || "N/A"}
          </p>

          <p>
            <strong>📝 Report:</strong>{" "}
            {selectedRecord.report || "N/A"}
          </p>
        </>
      )}

      <Button
        onClick={() => sendWhatsApp(selectedRecord)}
        sx={{
          background: "green",
          color: "#fff",
          mt: 2
        }}
      >
        WhatsApp
      </Button>

      <Button
        onClick={() => printReport(selectedRecord)}
        sx={{
          background: "#1976d2",
          color: "#fff",
          ml: 2,
          mt: 2
        }}
      >
        Print
      </Button>

      {!editMode ? (
        <Button
          startIcon={<EditIcon />}
          onClick={handleEditOpen}
          sx={{
            background: "#ff9800",
            color: "#fff",
            ml: 2,
            mt: 2
          }}
        >
          Edit
        </Button>
      ) : (
        <Button
          onClick={handleUpdate}
          sx={{
            background: "#2e7d32",
            color: "#fff",
            ml: 2,
            mt: 2
          }}
        >
          Update
        </Button>
      )}
    </>
  )}
</DialogContent>


        {/* <DialogContent>
          {selectedRecord && (
            <>
              <p><strong>👤 Patient:</strong> {selectedRecord.patientId?.fullName}</p>
              <p><strong>🧪 Scan:</strong> {selectedRecord.scanType}</p> */}
              {/* <p><strong>📊 Status:</strong> {selectedRecord.status}</p> */}

{/* 
              <p>
  <strong>📅 Start Date:</strong>{" "}
  {selectedRecord.startDate
    ? new Date(selectedRecord.startDate).toLocaleString()
    : "N/A"}
</p>

<p>
  <strong>📅 End Date:</strong>{" "}
  {selectedRecord.endDate
    ? new Date(selectedRecord.endDate).toLocaleString()
    : "N/A"}
</p>

              <p><strong>💰 Cost:</strong> ₹{selectedRecord.cost || 0}</p>
<p><strong>💳 Payment:</strong> {selectedRecord.paymentStatus}</p>
<p><strong>🧾 Manual Charge:</strong> {selectedRecord.manualChargeId?.itemName || "N/A"}</p>
              <p><strong>📝 Report:</strong> {selectedRecord.report || "N/A"}</p> */}

              {/* ✅ COMPLETE BUTTON */}
              {/* {selectedRecord.status !== "Completed" && (
                <Button
                  onClick={() =>
                    navigate(`/receptionist-dashboard/complete-scan/${selectedRecord._id}`)
                  }
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Complete Scan
                </Button>
              )} */}

              {/* ✅ WHATSAPP */}
              {/* <Button
                onClick={() => sendWhatsApp(selectedRecord)}
                sx={{ background: "green", color: "#fff" }}
              >
                WhatsApp
              </Button> */}

{/* ✅ PRINT */}

{/* 
              <Button
  onClick={() => printReport(selectedRecord)}
  sx={{
    background: "#1976d2",
    color: "#fff",
    ml: 2
  }}
>
  Print
</Button>
            </>
          )}
        </DialogContent> */}

        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default ViewSonography;

// 🎨 STYLES
const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "1rem"
  },
  heading: {
    textAlign: "center",
    marginBottom: "1rem"
  },
  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "1rem"
  },
  center: {
    textAlign: "center",
    marginTop: "2rem"
  }
};














































// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, IconButton,
//   Dialog, DialogTitle, DialogContent, DialogActions, Button
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const ViewSonography = () => {

//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const navigate = useNavigate();

//   // ✅ FETCH DATA
//   const fetchAll = async () => {
//     const token = localStorage.getItem('jwt');

//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/sonography`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       setRecords(res.data || []);
//       setFilteredRecords(res.data || []);

//     } 
    
//     catch (err) {
//   console.error("FETCH ERROR:", err.response?.data || err.message);
//   toast.error('Failed to fetch sonography');
// }

//     // catch {
//     //   toast.error('Failed to fetch sonography');
//     // }
    
//     finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   // ✅ SEARCH
//   useEffect(() => {
//     const lower = searchTerm.toLowerCase();

//     const filtered = records.filter(r =>
//       r?.patientId?.fullName?.toLowerCase().includes(lower)
//     );

//     setFilteredRecords(filtered);
//   }, [searchTerm, records]);

//   const handleOpenDialog = (record) => {
//     setSelectedRecord(record);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedRecord(null);
//   };

//   // ✅ WHATSAPP


//   const sendWhatsApp = (record) => {
//   const phone = record.patientId?.contactNumber;
// //   const phone = record.patientId?.phone;

//   if (!phone) {
//     toast.error("Patient phone not available");
//     return;
//   }

//   const msg = `
// 📋 Sonography Report

// 👤 Patient: ${record.patientId?.fullName}
// 🧪 Scan: ${record.scanType}
// 📊 Status: ${record.status}

// 📝 Report:
// ${record.report || "Pending"}

// ${record.reportFile ? `📎 File: ${record.reportFile}` : ""}
// `;

//   window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
// };


// //   const sendWhatsApp = (record) => {
// //     const msg = `
// // Patient: ${record.patientId?.fullName}
// // Scan: ${record.scanType}
// // Status: ${record.status}
// // Report: ${record.report || "Pending"}
// // `;

// //     window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
// //   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Sonography Records</h2>

//       {/* 🔍 SEARCH */}
//       <input
//         type="text"
//         placeholder="Search patient..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={styles.searchInput}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Patient</TableCell>
//               <TableCell>Scan</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Details</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {filteredRecords.map(record => (
//               <TableRow key={record._id}>
//                 <TableCell>{record.patientId?.fullName}</TableCell>
//                 <TableCell>{record.scanType}</TableCell>
//                 {/* <TableCell>{record.status}</TableCell> */}

//                 <TableCell>
//   <span style={{
//     padding: "5px 10px",
//     borderRadius: "20px",
//     color: "#fff",
//     background:
//       record.status === "Completed" ? "green" :
//       record.status === "Pending" ? "orange" : "gray"
//   }}>
//     {record.status}
//   </span>
// </TableCell>

//                 <TableCell>
//                   <IconButton onClick={() => handleOpenDialog(record)}>
//                     <ExpandMoreIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       {/* ✅ DIALOG */}
//       <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
//         <DialogTitle>Sonography Details</DialogTitle>

//         <DialogContent>
//           {selectedRecord && (
//             <>
//               <p><strong>Patient:</strong> {selectedRecord.patientId?.fullName}</p>
//               <p><strong>Scan:</strong> {selectedRecord.scanType}</p>
//               <p><strong>Status:</strong> {selectedRecord.status}</p>
//               <p><strong>Report:</strong> {selectedRecord.report || "N/A"}</p>

//               {/* ✅ COMPLETE */}
//               {selectedRecord.status !== "Completed" && (
//                 <Button
//                   onClick={() =>
//                     navigate(`/receptionist-dashboard/complete-scan/${selectedRecord._id}`)
//                   }
//                   variant="contained"
//                   style={{ marginRight: "10px" }}
//                 >
//                   Complete Scan
//                 </Button>
//               )}

//               {/* ✅ WHATSAPP */}
//               <Button
//                 onClick={() => sendWhatsApp(selectedRecord)}
//                 style={{ background: "green", color: "#fff" }}
//               >
//                 WhatsApp
//               </Button>
//             </>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       <ToastContainer />
//     </div>
//   );
// };

// export default ViewSonography;

// // 🎨 STYLE
// const styles = {
//   container: {
//     maxWidth: '900px',
//     margin: '2rem auto'
//   },
//   heading: {
//     textAlign: 'center'
//   },
//   searchInput: {
//     width: '100%',
//     padding: '10px',
//     marginBottom: '1rem'
//   }
// };