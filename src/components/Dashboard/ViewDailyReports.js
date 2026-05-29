import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,

  DialogActions,
  TextField
} from '@mui/material'; // NEW: For dropdown & dialog
import MoreVertIcon from '@mui/icons-material/MoreVert'; // NEW: Icon for dropdown


import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const ViewDailyReports = () => {
  const location = useLocation();
  const token = localStorage.getItem('jwt');
  const { ipdAdmissionId } = location.state || {};

  const [patientsWithReports, setPatientsWithReports] = useState([]);
  const [singleAdmissionReports, setSingleAdmissionReports] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // NEW
  const [dialogOpen, setDialogOpen] = useState(false); // NEW

  const [anchorEl, setAnchorEl] = useState(null); // NEW
  const [menuPatient, setMenuPatient] = useState(null); // NEW


  const [editDialogOpen, setEditDialogOpen] = useState(false);
const [editingReport, setEditingReport] = useState(null);
const [editForm, setEditForm] = useState({
  temperature: '',
  pulse: '',
  bp: '',
  respiratoryRate: '',
  nurseNotes: '',
  treatmentsAdministeredText: '',
  medicineConsumptionText: '',
});


    const BASE_URL = process.env.REACT_APP_BASE_URL;

    
  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(null);
  };


const handleDeleteReport = async (reportId) => {
  if (!window.confirm('Delete this report?')) return;

  try {
    await axios.delete(
      `${BASE_URL}/api/ipd/reports/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Report deleted');

    setSelectedPatient(prev => ({
      ...prev,
      admissions: prev.admissions.map(adm => ({
        ...adm,
        reports: adm.reports.filter(r => r._id !== reportId)
      }))
    }));
  } catch (err) {
    toast.error('Delete failed');
  }
};

const handleEditClick = (report) => {
  setEditingReport(report);

  setEditForm({
    temperature: report.vitals?.temperature || '',
    pulse: report.vitals?.pulse || '',
    bp: report.vitals?.bp || '',
    respiratoryRate: report.vitals?.respiratoryRate || '',
    nurseNotes: report.nurseNotes || '',
    treatmentsAdministeredText:
      report.treatmentsAdministeredText || '',
    medicineConsumptionText:
      report.medicineConsumptionText || '',
  });

  setEditDialogOpen(true);
};

const handleUpdateReport = async () => {
  try {
    const payload = {
      vitals: {
        temperature: editForm.temperature,
        pulse: editForm.pulse,
        bp: editForm.bp,
        respiratoryRate: editForm.respiratoryRate,
      },
      nurseNotes: editForm.nurseNotes,
      treatmentsAdministeredText:
        editForm.treatmentsAdministeredText,
      medicineConsumptionText:
        editForm.medicineConsumptionText,
    };

    const res = await axios.put(
      `${BASE_URL}/api/ipd/reports/${editingReport._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Report updated');

    setSelectedPatient(prev => ({
      ...prev,
      admissions: prev.admissions.map(adm => ({
        ...adm,
        reports: adm.reports.map(r =>
          r._id === editingReport._id
            ? { ...r, ...res.data.report }
            : r
        )
      }))
    }));

    setEditDialogOpen(false);
  } catch (err) {
    toast.error('Update failed');
  }
};


  useEffect(() => {
    const fetchSingleAdmissionReports = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/ipd/reports/${ipdAdmissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSingleAdmissionReports(res.data.reports || []);
      } catch (err) {
        toast.error('Failed to load report');
      }
    };

    const fetchAllReports = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPatients = patientRes.data.patients || [];
        const admittedPatientsWithReports = [];

        for (const patient of allPatients) {
          const ipdRes = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const admittedAdmissions = (ipdRes.data.admissions || []).filter(adm => adm.status === 'Admitted');

          const enrichedAdmissions = [];

          for (const admission of admittedAdmissions) {
            const reportRes = await axios.get(`${BASE_URL}/api/ipd/reports/${admission._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            enrichedAdmissions.push({
              ...admission,
              reports: reportRes.data.reports || [],
            });
          }

          if (enrichedAdmissions.length > 0) {
            admittedPatientsWithReports.push({
              patient,
              admissions: enrichedAdmissions,
            });
          }
        }

        setPatientsWithReports(admittedPatientsWithReports);
      } catch (err) {
        toast.error('Failed to load daily reports');
      }
    };

    if (ipdAdmissionId) {
      fetchSingleAdmissionReports();
    } else {
      fetchAllReports();
    }
  }, [ipdAdmissionId, token]);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        {ipdAdmissionId ? 'Daily Reports for Admission' : 'All Daily Reports for Admitted Patients'}
      </h2>

      {ipdAdmissionId ? (
        singleAdmissionReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No reports found.</p>
        ) : (
          singleAdmissionReports.map((report, index) => (
            <div key={report._id} style={styles.reportCard}>
              <h4 style={{ marginBottom: '1rem', color: '#007BFF' }}>
                Report #{singleAdmissionReports.length - index}
              </h4>
              <p><strong>Date:</strong> {new Date(report.reportDateTime).toLocaleString()}</p>
     <p>
  <strong>Recorded By:</strong> 
  {report.recordedByUserId?.userId?.name} 
  ({report.recordedByUserId?.userId?.role})
</p>


              <ul style={{ paddingLeft: '1.2rem' }}>
                <li><strong>Temperature:</strong> {report.vitals?.temperature}</li>
                <li><strong>Pulse:</strong> {report.vitals?.pulse}</li>
                <li><strong>BP:</strong> {report.vitals?.bp}</li>
                <li><strong>Respiratory Rate:</strong> {report.vitals?.respiratoryRate}</li>
              </ul>
              <p><strong>Nurse Notes:</strong> {report.nurseNotes}</p>
              <p><strong>Treatments:</strong> {report.treatmentsAdministeredText}</p>
              <p><strong>Medicines:</strong> {report.medicineConsumptionText}</p>
            </div>
          ))
        )
      ) : (
        patientsWithReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No admitted patients with reports found.</p>
        ) : (
          patientsWithReports.map(({ patient, admissions }) => (
            <div key={patient._id} style={{ marginBottom: '2.5rem' }}>
            <div style={styles.patientHeaderContainer}>
  <h3 style={styles.patientName}>
    👤 {patient.fullName}
  </h3>
  <IconButton
    style={styles.iconButton}
    onClick={(event) => {
      setAnchorEl(event.currentTarget);
      setMenuPatient(patient);
    }}
  >
    <MoreVertIcon />
  </IconButton>
</div>


              {/* Menu for dialog open */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuPatient?._id === patient._id}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => {
                  setAnchorEl(null);
                  handleOpenDialog({ patient, admissions });
                }}>
                  View All Reports
                </MenuItem>
              </Menu>

            
            </div>
          ))
        )
      )}

      {/* Dialog for all reports of selected patient */}
     <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
  <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    All Reports for {selectedPatient?.patient?.fullName}
    <IconButton onClick={handleCloseDialog}>
      ✖️
    </IconButton>
  </DialogTitle>
  <DialogContent dividers>
    {selectedPatient?.admissions?.map(adm => (
      <div key={adm._id} style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: '#28a745' }}>
          Admission — Ward: {adm.wardId?.name}, Bed: {adm.bedNumber}
        </h4>
        {adm.reports.length === 0 ? (
          <p style={{ color: '#999' }}>No reports yet for this admission.</p>
        ) : (
          adm.reports.map((report, idx) => (
            <div key={report._id} style={styles.dialogReportCard}>
              <p><strong>Report {adm.reports.length - idx}</strong> — {new Date(report.reportDateTime).toLocaleString()}</p>


  {/* ADD HERE */}
  <div
    style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '10px'
    }}
  >
    <Button
      variant="outlined"
      size="small"
      startIcon={<EditIcon />}
      onClick={() => handleEditClick(report)}
    >
      Edit
    </Button>

    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={() => handleDeleteReport(report._id)}
    >
      Delete
    </Button>
  </div>

  {/* <p>
    <strong>Recorded By:</strong>
    {report.recordedByUserId?.userId?.name}
    ({report.recordedByUserId?.userId?.role})
  </p> */}

             <p><strong>Recorded By:</strong> 
  {report.recordedByUserId?.userId?.name} 
  ({report.recordedByUserId?.userId?.role})
</p>

              <ul style={{ paddingLeft: '1.2rem' }}>
                <li><strong>Temperature:</strong> {report.vitals?.temperature}</li>
                <li><strong>Pulse:</strong> {report.vitals?.pulse}</li>
                <li><strong>BP:</strong> {report.vitals?.bp}</li>
                <li><strong>Respiratory Rate:</strong> {report.vitals?.respiratoryRate}</li>
              </ul>
              <p><strong>Nurse Notes:</strong> {report.nurseNotes}</p>
              <p><strong>Treatments:</strong> {report.treatmentsAdministeredText}</p>
              <p><strong>Medicines:</strong> {report.medicineConsumptionText}</p>
            </div>
          ))
        )}
      </div>
    ))}
  </DialogContent>
</Dialog>

{/* </Dialog> */}

{/* EDIT DIALOG HERE */}
<Dialog
  open={editDialogOpen}
  onClose={() => setEditDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Edit Report</DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      margin="dense"
      label="Temperature"
      value={editForm.temperature}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          temperature:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Pulse"
      value={editForm.pulse}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          pulse:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="BP"
      value={editForm.bp}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          bp:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Respiratory Rate"
      value={editForm.respiratoryRate}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          respiratoryRate:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      multiline
      rows={2}
      margin="dense"
      label="Nurse Notes"
      value={editForm.nurseNotes}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          nurseNotes:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      multiline
      rows={2}
      margin="dense"
      label="Treatments"
      value={editForm.treatmentsAdministeredText}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          treatmentsAdministeredText:e.target.value
        })
      }
    />

    <TextField
      fullWidth
      multiline
      rows={2}
      margin="dense"
      label="Medicines"
      value={editForm.medicineConsumptionText}
      onChange={(e)=>
        setEditForm({
          ...editForm,
          medicineConsumptionText:e.target.value
        })
      }
    />

  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setEditDialogOpen(false)}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUpdateReport}
    >
      Update
    </Button>
  </DialogActions>
</Dialog>

 {/* // View Reports Dialog close */}





    </div>
  );
};

const styles = {
  reportCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff',
  },
  inlineReportCard: {
    border: '1px solid #ddd',
    padding: '1.2rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
  },
  patientHeaderContainer: {
  position: 'relative',
  borderBottom: '2px solid #007BFF',
  width: '100%',
  marginBottom: '1rem',
  paddingBottom: '0.5rem',
},

patientName: {
  margin: 0,
  color: '#333',
  fontSize: '1.25rem',
  fontWeight: 600,
},

iconButton: {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '4px',
},

  dialogReportCard: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    backgroundColor: '#fff',
  },
};

export default ViewDailyReports;
