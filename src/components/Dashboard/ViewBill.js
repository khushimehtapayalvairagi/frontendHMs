

// // export default ViewBill;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//  import { toast } from 'react-toastify';

// function ViewBill() {
//   const [patientId, setPatientId] = useState('');
//   const [billId, setBillId] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const [patients, setPatients] = useState([]);

//     const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('jwt');
//   const headers = { Authorization: `Bearer ${token}` };


//   useEffect(() => {

//   const fetchPatients = async () => {

//     try {

//       const res = await axios.get(
//         `${BASE_URL}/api/receptionist/patients`,
//         { headers }
//       );

//       setPatients(res.data.patients || []);

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to load patients");

//     }
//   };

//   fetchPatients();

// }, []);
//   //  useEffect(() => {
//   //    const token = localStorage.getItem('jwt');
 
//   //    const fetchAdmittedPatients = async () => {
//   //      try {
//   //        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
//   //          headers: { Authorization: `Bearer ${token}` }
//   //        });
 
//   //        const allPatients = patientRes.data.patients;
//   //        const admittedPatients = [];
 
//   //        for (const patient of allPatients) {
//   //          const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
//   //            headers: { Authorization: `Bearer ${token}` }
//   //          });
 
//   //          const admissions = res.data.admissions || [];
//   //          if (admissions.some(adm => adm.status === 'Admitted')) {
//   //            admittedPatients.push(patient);
//   //          }
//   //        }
 
//   //        setPatients(admittedPatients);
//   //      } catch (error) {
//   //        toast.error('Failed to load admitted patients');
//   //      }
//   //    };
 
//   //    fetchAdmittedPatients();
//   //  }, []);
 
 
 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setResult(null);

//     try {
//       let res;
//       if (billId) {
//         res = await axios.get(`${BASE_URL}/api/billing/bills/${billId}`, { headers });
//         setResult({ type: 'single', data: res.data.bill });
//       } else if (patientId) {
//         res = await axios.get(`${BASE_URL}/api/billing/bills/patient/${patientId}`, { headers });
//         setResult({ type: 'list', data: res.data.bills });
//       } else {
//         setError('Enter either a Bill ID or Patient ID');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error fetching data');
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h2 style={{ marginBottom: '1rem' }}>Lookup Bill or Bills by Patient</h2>

//       <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
//        {/* <input
//   type="text"
//   value={billId}
//   onChange={(e) =>
//     setBillId(
//       e.target.value.toUpperCase()
//     )
//   }
//   placeholder="Enter Bill ID"
//   style={{
//     padding: '0.4rem',
//     marginLeft: '1rem',
//     width: '200px'
//   }}
// /> */}

//         <div style={{ marginBottom: '0.8rem' }}>
//           <label><strong>Patient:</strong></label>
//           <select
//             value={patientId}
//             onChange={(e) => setPatientId(e.target.value)}
//             style={{ padding: '0.4rem', marginLeft: '1rem', width: '220px' }}
//           >
//             <option value="">Select Patient</option>
//             {patients.map(p => (
//               <option key={p._id} value={p._id}>{p.fullName}</option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" style={{
//           padding: '0.5rem 1rem',
//           backgroundColor: '#1976d2',
//           color: 'white',
//           border: 'none',
//           cursor: 'pointer'
//         }}>
//           Fetch
//         </button>
//       </form>

//       {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

//       {result && result.type === 'single' && (
//         <div style={{ marginTop: '2rem' }}>
//           <h3>Bill Details (Raw):</h3>
//           <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>
//             {JSON.stringify(result.data, null, 2)}
//           </pre>
//         </div>
//       )}

//       {result && result.type === 'list' && (
//         <div>
//           <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Bills for Patient:</h3>
//           {result.data.length === 0 ? (
//             <p>No bills found for this patient.</p>
//           ) : result.data.map(b => (
//             <div
//               key={b._id}
//               style={{
//                 border: '1px solid #ccc',
//                 borderRadius: '6px',
//                 padding: '1rem',
//                 marginBottom: '1.5rem',
//                 backgroundColor: '#fafafa'
//               }}
//             >
//               <p>
//   <strong>Bill ID:</strong>{" "}
//   <span
//     style={{
//       color: "#1976d2",
//       fontWeight: "bold"
//     }}
//   >
//     {b.billId}
//   </span>
// </p>
//               <p><strong>Date:</strong> {new Date(b.bill_date).toLocaleString()}</p>
//               <p><strong>Total:</strong> ₹{b.total_amount}</p>
//               <p><strong>Status:</strong> {b.payment_status}</p>


// <p>
//   <strong>Patient Type:</strong>{" "}
//   <span
//     style={{
//       color: b.ipd_admission_id_ref ? "red" : "green",
//       fontWeight: "bold"
//     }}
//   >
//     {b.ipd_admission_id_ref ? "IPD" : "OPD"}
//   </span>
// </p>
//               {/* <p>
//   <strong>Patient Type:</strong>{" "}
//   <span
//     style={{
//       color: b.visitType === "IPD" ? "red" : "green",
//       fontWeight: "bold"
//     }}
//   >
//     {b.visitType || "OPD"}
//   </span>
// </p> */}

//               <h4 style={{ marginTop: '1rem' }}>Charges Summary</h4>
//            <div style={{ overflowX: "auto" }}>
//              <table style={{
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "0.9rem",
//     minWidth: "600px" // ensures columns don't shrink too much
//   }}>
//                 <thead style={{ backgroundColor: '#f0f0f0' }}>
//                   <tr>
//                     <th style={th}>#</th>
//                     <th style={th}>Description</th>
//                     <th style={th}>Type</th>
//                     <th style={th}>Qty</th>
//                     <th style={th}>Unit Price</th>
//                     <th style={th}>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {b.items?.map((item, idx) => (
//                     <tr key={idx}>
//                       <td style={td}>{idx + 1}</td>
//                       <td style={td}>{item.description || '—'}</td>
//                       <td style={td}>{item.item_type || '—'}</td>
//                       <td style={td}>{item.quantity}</td>
//                       <td style={td}>₹{item.unit_price}</td>
//                       <td style={td}>₹{(item.quantity * item.unit_price).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="5" style={{ ...td, textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
//                     <td style={{ ...td, fontWeight: 'bold' }}>
//                       ₹{b.items?.reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Shared inline styles
// const th = {
//   border: '1px solid #ccc',
//   padding: '8px',
//   textAlign: 'left'
// };

// const td = {
//   border: '1px solid #ccc',
//   padding: '8px'
// };

// export default ViewBill;



import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewBill() {
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editBill, setEditBill] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch Patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/receptionist/patients`,
        { headers }
      );

      setPatients(res.data.patients || []);
    } catch {
      toast.error("Failed to load patients");
    }
  };

  // Fetch Bills
  const fetchBills = async () => {
    if (!patientId) {
      toast.error("Select patient");
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/api/billing/bills/patient/${patientId}`,
        { headers }
      );

      setBills(res.data.bills || []);
    } catch {
      toast.error("Failed to fetch bills");
    }
  };

  // Delete Bill
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/billing/bill/${id}`,
        { headers }
      );

      toast.success("Bill deleted");
      fetchBills();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Edit Open
  const handleEdit = (bill) => {
    setEditBill({
      ...bill
    });

    setEditOpen(true);
  };

  // Change Item
  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const items = [...editBill.items];

    items[index][field] = Number(value);

    items[index].sub_total =
      items[index].quantity *
      items[index].unit_price;

    const total = items.reduce(
      (sum, i) => sum + i.sub_total,
      0
    );

    setEditBill({
      ...editBill,
      items,
      total_amount: total
    });
  };

  // Update Bill
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/billing/bill/${editBill._id}`,
        editBill,
        { headers }
      );

      toast.success("Bill updated");

      setEditOpen(false);

      fetchBills();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        background: "#f4f7fb",
        minHeight: "100vh"
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
      >
        View Bills
      </Typography>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* <Typography mb={1}>
            Select Patient
          </Typography> */}

          <Typography
  mb={1}
  sx={{
    color: "black",
    fontWeight: 600
  }}
>
  Select Patient
</Typography>

          {/* <Select
            fullWidth
            value={patientId}
            onChange={(e) =>
              setPatientId(e.target.value)
            }
          >
            <MenuItem value="">
              Select Patient
            </MenuItem>

            {patients.map((p) => (
              <MenuItem
                key={p._id}
                value={p._id}
              >
                {p.fullName}
              </MenuItem>
            ))}
          </Select> */}


          <Select
  fullWidth
  displayEmpty
  value={patientId}
  onChange={(e) =>
    setPatientId(e.target.value)
  }
  sx={{
    color: patientId ? "black" : "#999",
    ".MuiSelect-select": {
      color: patientId ? "black" : "#999"
    }
  }}
>
  <MenuItem value="" disabled>
    <span style={{ color: "#050505" }}>
      Select Patient
    </span>
  </MenuItem>

  {patients.map((p) => (
    <MenuItem
      key={p._id}
      value={p._id}
    >
      {p.fullName}
    </MenuItem>
  ))}
</Select>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={fetchBills}
          >
            Fetch Bills
          </Button>
        </CardContent>
      </Card>

      {/* Bills */}
      {bills.map((b) => (
        <Card
          key={b._id}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Box>
                <Typography>
                  <strong>Bill ID:</strong>{" "}
                  <span
                    style={{
                      color: "#1976d2"
                    }}
                  >
                    {b.billId}
                  </span>
                </Typography>

                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    b.bill_date
                  ).toLocaleString()}
                </Typography>

                <Typography>
                  <strong>Total:</strong> ₹
                  {b.total_amount}
                </Typography>

                <Typography>
                  <strong>Status:</strong>{" "}
                  {b.payment_status}
                </Typography>

                {/* OPD / IPD */}
                <Typography>
                  <strong>
                    Patient Type:
                  </strong>{" "}
                  <span
                    style={{
                      color:
                        b.ipd_admission_id_ref
                          ? "red"
                          : "green",
                      fontWeight: "bold"
                    }}
                  >
                    {b.ipd_admission_id_ref
                      ? "IPD"
                      : "OPD"}
                  </span>
                </Typography>
              </Box>

              <Box>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleEdit(b)
                  }
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(b._id)
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Charges Table */}
            <Typography
              mt={3}
              mb={1}
              variant="h6"
            >
              Charges Summary
            </Typography>

            <TableContainer
              component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>
                      Description
                    </TableCell>
                    <TableCell>
                      Type
                    </TableCell>
                    <TableCell>
                      Qty
                    </TableCell>
                    <TableCell>
                      Unit Price
                    </TableCell>
                    <TableCell>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {b.items?.map(
                    (item, idx) => (
                      <TableRow
                        key={idx}
                      >
                        <TableCell>
                          {idx + 1}
                        </TableCell>

                        <TableCell>
                          {
                            item.description
                          }
                        </TableCell>

                        <TableCell>
                          {
                            item.item_type
                          }
                        </TableCell>

                        <TableCell>
                          {
                            item.quantity
                          }
                        </TableCell>

                        <TableCell>
                          ₹
                          {
                            item.unit_price
                          }
                        </TableCell>

                        <TableCell>
                          ₹
                          {(
                            item.quantity *
                            item.unit_price
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Edit Bill
        </DialogTitle>

        <DialogContent>
          {editBill?.items?.map(
            (item, index) => (
              <Box
                key={index}
                mt={2}
              >
                <Typography>
                  {
                    item.description
                  }
                </Typography>

                <TextField
                  label="Qty"
                  type="number"
                  value={
                    item.quantity
                  }
                  sx={{ mr: 2 }}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />

                <TextField
                  label="Unit Price"
                  type="number"
                  value={
                    item.unit_price
                  }
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "unit_price",
                      e.target.value
                    )
                  }
                />
              </Box>
            )
          )}

          <Typography
            mt={3}
            fontWeight="bold"
          >
            Total: ₹
            {editBill?.total_amount}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setEditOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default ViewBill;