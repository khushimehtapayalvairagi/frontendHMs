import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BillPaymentHistory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

const [editOpen, setEditOpen] = useState(false);
const [editBill, setEditBill] = useState(null);



const printRef = useRef(null);
  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };
  const BASE_URL = process.env.REACT_APP_BASE_URL;
const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, { headers });
        // const allPatients = patientRes.data.patients;
        // const admittedPatients = [];

        // for (const patient of allPatients) {
        //   const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, { headers });
        //   const admissions = res.data.admissions || [];
        //   if (admissions.some(adm => adm.status === 'Admitted')) {
        //     admittedPatients.push(patient);
        //   }
        // }

    setPatients(patientRes.data.patients || []);
      } catch {
        toast.error('Failed to load patients');
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) return setBills([]);
    axios.get(`${BASE_URL}/api/billing/bills/patient/${selectedPatient}`, { headers })
      .then(res => setBills(res.data.bills))
      .catch(() => setError('Could not load bills'));
  }, [selectedPatient]);

  const handleBillClick = async (bill) => {
    setSelectedBill(bill);
    try {
      const res = await axios.get(`${BASE_URL}/api/billing/payments/${bill._id}`, { headers });
      setPayments(res.data.payments);
    } catch {
      setError('Could not load payments');
    }
    setOpenDialog(true);
  };



  const handlePrint = () => {
  if (!printRef.current) return;
  const printContents = printRef.current.innerHTML;
  const logoUrl = `${window.location.origin}/hospital-print-header.png`;
  const newWindow = window.open('', '', 'width=900,height=700');
  newWindow.document.write(`
    <html>
      <head>
        <title>Bill & Payment History</title>
        <style>
       body{
    font-family: Arial, sans-serif;
    padding:20px;
    color:#000;
}

.header{
    display:flex;
    align-items:center;
    border-bottom:3px solid #000;
    padding-bottom:12px;
    margin-bottom:20px;
}

.logo{
    width:90px;
    flex-shrink:0;
}

.logo img{
    width:75px;
    height:75px;
    object-fit:contain;
    display:block;
}

.header-content{
    flex:1;
    text-align:center;
    margin-right:90px;
}

.hospital-title{
    font-size:24px;
    font-weight:bold;
}

.hospital-sub{
    font-size:13px;
    margin-top:3px;
}

.report-title{
    margin-top:10px;
    font-size:20px;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
}

th,td{
    border:1px solid #ccc;
    padding:8px;
    text-align:left;
}

th{
    background:#f5f5f5;
}

.payment-card{
    border:1px solid #ccc;
    padding:8px;
    margin-bottom:8px;
    border-radius:6px;
}
        </style>
      </head>
           <body>

        <div class="header">

        

          <div class="header-content">
            <div class="hospital-title">
              Dr. M.I. Jamkhanawala Tibbia Medical College
            </div>

            <div class="hospital-sub">
              Haji Abdul Razzak Kalsekar Tibbia Hospital
            </div>

            <div class="hospital-sub">
              Anjuman-I-Islam Complex, Versova, Mumbai
            </div>

            <div class="report-title">
              BILL & PAYMENT HISTORY
            </div>
          </div>

        </div>

        ${printContents}

      </body>

    </html>
  `);
  newWindow.document.close();
  newWindow.print();
};

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Patient Bill & Payment History</h2>

      <label><strong>Patient:</strong></label>
      <select
        value={selectedPatient}
        onChange={e => setSelectedPatient(e.target.value)}
        style={{ marginLeft: '1rem', padding: '0.4rem', fontSize: '1rem' }}
      >
        <option value="">-- Select --</option>
        {patients.map(p => (
          <option key={p._id} value={p._id}>{p.fullName}</option>
        ))}
      </select>

      {bills.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>All Bills:</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {bills.map(b => (
              <li key={b._id} style={{ marginBottom: '0.5rem' }}>
                <Button
                  variant="contained"
                  color={selectedBill?._id === b._id ? "primary" : "success"}
                  onClick={() => handleBillClick(b)}
                  fullWidth
                  style={{ justifyContent: 'flex-start' }}
                >
                  {/* {new Date(b.bill_date).toLocaleDateString()} ({b.payment_status}) */}

{new Date(b.bill_date).toLocaleDateString()}
{" - "}
{b.ipd_admission_id_ref ? "🏥 IPD" : "🩺 OPD"}
{" "}
({b.payment_status})


                </Button>


<Button
  variant="outlined"
  color="primary"
  size="small"
  style={{ marginTop: '5px', marginRight: '5px' }}
  onClick={(e) => {
    e.stopPropagation();
    setEditBill(JSON.parse(JSON.stringify(b)));
    setEditOpen(true);
  }}
>
  Edit
</Button>


                <Button
  variant="outlined"
  color="error"
  size="small"
  style={{ marginTop: '5px' }}
  onClick={async (e) => {
    e.stopPropagation();

    if (!window.confirm("Delete this bill?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/billing/bills/${b._id}`,
        { headers }
      );

      toast.success("Bill deleted");

      setBills(prev =>
        prev.filter(x => x._id !== b._id)
      );

      if (selectedBill?._id === b._id) {
        setOpenDialog(false);
      }

    } catch {
      toast.error("Delete failed");
    }
  }}
>
  Delete
</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bill Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth  fullScreen={isMobile}>
        <DialogTitle>Bill Details</DialogTitle>
    <DialogContent ref={printRef}>
          {selectedBill && (
            <>


            <p
  style={{
    backgroundColor:
      selectedBill.ipd_admission_id_ref ? "#ffe5e5" : "#e5f2ff",

    color:
      selectedBill.ipd_admission_id_ref ? "#c62828" : "#1565c0",

    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "1rem"
  }}
>
  {selectedBill.ipd_admission_id_ref
    ? "🏥 IPD Patient"
    : "🩺 OPD Patient"}
</p>


<h4>Charges Summary</h4>

{isMobile ? (
  // ---------- MOBILE: CARD VIEW ----------
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {(selectedBill.items || []).map((item, idx) => {
      const qty = Number(item?.quantity || 0);
      const unit = Number(item?.unit_price || 0);
      const sub = qty * unit;

      return (
        <div
          key={idx}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '10px 12px',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Item #{idx + 1}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              rowGap: 6,
              columnGap: 8,
              fontSize: '0.95rem',
            }}
          >
            <div style={{ color: '#666' }}>Description</div>
            <div>{item?.description || '—'}</div>

            <div style={{ color: '#666' }}>Type</div>
            <div>{item?.item_type || '—'}</div>

            <div style={{ color: '#666' }}>Qty</div>
            <div>{qty}</div>

            <div style={{ color: '#666' }}>Unit Price</div>
            <div>₹{unit.toFixed(2)}</div>

            <div style={{ color: '#666' }}>Subtotal</div>
            <div style={{ fontWeight: 600 }}>₹{sub.toFixed(2)}</div>
          </div>
        </div>
      );
    })}

    {/* Total Card */}
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '10px 12px',
        background: '#fafafa',
        marginTop: 6,
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 700,
      }}
    >
      <span>Total</span>
      <span>
        ₹
        {(selectedBill.items || [])
          .reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unit_price || 0), 0)
          .toFixed(2)}
      </span>
    </div>
  </div>
) : (
  // ---------- DESKTOP: TABLE VIEW ----------
  <div style={{ overflowX: 'auto' }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        minWidth: '600px',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>#</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Qty</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Unit Price</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {(selectedBill.items || []).map((item, idx) => {
          const qty = Number(item?.quantity || 0);
          const unit = Number(item?.unit_price || 0);
          const sub = qty * unit;

          return (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item?.description || '—'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item?.item_type || '—'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{qty}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                ₹{unit.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                ₹{sub.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr style={{ fontWeight: 'bold' }}>
          <td
            colSpan={5}
            style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}
          >
            Total:
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            ₹
            {(selectedBill.items || [])
              .reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unit_price || 0), 0)
              .toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
)}




              <h4>Payment History</h4>
              {payments.length === 0 ? (
                <p>No payments for this bill.</p>
              ) : (
                payments.map(p => (
                  <div key={p._id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
                    <p><strong>Date:</strong> {new Date(p.payment_date).toLocaleString()}</p>
                    <p><strong>Amount:</strong> ₹{p.amount_paid}</p>
                    <p><strong>Method:</strong> {p.payment_method}</p>
                     <p>
  <strong>By:</strong>{" "}
  {p.received_by_user_id_ref 
    ? `${p.received_by_user_id_ref?.name} (${p.received_by_user_id_ref?.role})` 
    : "n/a"}
</p>
                  </div>
                ))
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
           <Button onClick={handlePrint} variant="contained" color="primary">
    Print
  </Button>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>



      <Dialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Edit Bill</DialogTitle>

  <DialogContent>
    {editBill?.items?.map((item, idx) => (
      <div key={idx} style={{ marginBottom: '15px' }}>
        <p>{item.description}</p>

        <input
          type="number"
          value={item.quantity}
          onChange={(e) => {
            const copy = { ...editBill };
            copy.items[idx].quantity =
              Number(e.target.value);
            setEditBill(copy);
          }}
        />

        <input
          type="number"
          value={item.unit_price}
          style={{ marginLeft: 10 }}
          onChange={(e) => {
            const copy = { ...editBill };
            copy.items[idx].unit_price =
              Number(e.target.value);
            setEditBill(copy);
          }}
        />
      </div>
    ))}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditOpen(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={async () => {
        try {
          await axios.put(
            `${BASE_URL}/api/billing/bills/${editBill._id}`,
            editBill,
            { headers }
          );

          toast.success("Bill updated");

          const res = await axios.get(
            `${BASE_URL}/api/billing/bills/patient/${selectedPatient}`,
            { headers }
          );

          setBills(res.data.bills);
          setEditOpen(false);

        } catch {
          toast.error("Update failed");
        }
      }}
    >
      Update
    </Button>
  </DialogActions>
</Dialog>

      {selectedPatient && bills.length === 0 && (
        <p style={{ marginTop: '1rem', color: '#d32f2f' }}>No bills for this patient.</p>
      )}

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}