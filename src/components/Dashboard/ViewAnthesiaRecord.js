import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAnesthesiaRecord = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // FETCH RECORDS
  const fetchAllAnesthesiaRecords = async () => {
    const token = localStorage.getItem('jwt');

    try {
      const res = await axios.get(
        `${BASE_URL}/api/procedures/anesthesia-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecords(res.data.records || []);
      setFilteredRecords(res.data.records || []);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnesthesiaRecords();
  }, []);

  // SEARCH
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = records.filter(record =>
      record?.patientId?.fullName
        ?.toLowerCase()
        .includes(lower)
    );

    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // DETAILS
  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
  };

  // EDIT OPEN
  const handleEdit = (record) => {
    setEditRecord({
      ...record,
      induceTime: record.induceTime
        ? record.induceTime.slice(0, 16)
        : '',
      endTime: record.endTime
        ? record.endTime.slice(0, 16)
        : ''
    });

    setEditOpen(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('jwt');

      await axios.put(
        `${BASE_URL}/api/procedures/anesthesia-record/${editRecord._id}`,
        editRecord,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Record updated');

      setEditOpen(false);

      fetchAllAnesthesiaRecords();
    } catch (error) {
      console.log(error);
      toast.error('Update failed');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Delete this anesthesia record?'
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('jwt');

      await axios.delete(
        `${BASE_URL}/api/procedures/anesthesia-record/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Record deleted');

      fetchAllAnesthesiaRecords();
    } catch (error) {
      console.log(error);
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div style={styles.centerText}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Anesthesia Records
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        style={styles.searchInput}
      />

      {filteredRecords.length === 0 ? (
        <div style={styles.centerText}>
          No records found.
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Patient</strong>
                </TableCell>

                <TableCell>
                  <strong>Procedure</strong>
                </TableCell>

                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {record.patientId?.fullName ||
                      'Unknown'}
                  </TableCell>

                  <TableCell>
                    {record.procedureType ||
                      'N/A'}
                  </TableCell>

                  <TableCell>

                    {/* DETAILS */}
                    <IconButton
                      color="info"
                      onClick={() =>
                        handleOpenDialog(record)
                      }
                    >
                      <ExpandMoreIcon />
                    </IconButton>

                    {/* EDIT */}
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleEdit(record)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    {/* DELETE */}
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(record._id)
                      }
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

      {/* DETAILS DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Anesthesia Record Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedRecord && (
            <>
              <p>
                <strong>Patient:</strong>{' '}
                {selectedRecord.patientId?.fullName}
              </p>

              <p>
                <strong>Procedure:</strong>{' '}
                {selectedRecord.procedureType}
              </p>

              <p>
                <strong>Anesthetist:</strong>{' '}
                {selectedRecord.anestheticId
                  ?.userId?.name || 'N/A'}
              </p>

              <p>
                <strong>Anesthesia:</strong>{' '}
                {selectedRecord.anesthesiaName}
                ({selectedRecord.anesthesiaType})
              </p>

              <p>
                <strong>Induce Time:</strong>{' '}
                {selectedRecord.induceTime
                  ? new Date(
                      selectedRecord.induceTime
                    ).toLocaleString()
                  : 'N/A'}
              </p>

              <p>
                <strong>End Time:</strong>{' '}
                {selectedRecord.endTime
                  ? new Date(
                      selectedRecord.endTime
                    ).toLocaleString()
                  : 'N/A'}
              </p>

              <p>
                <strong>Medicines:</strong>{' '}
                {selectedRecord.medicinesUsedText ||
                  'N/A'}
              </p>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Anesthesia Record
        </DialogTitle>

        <DialogContent>

          {editRecord && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              mt={2}
            >

              <TextField
                label="Procedure Type"
                value={
                  editRecord.procedureType
                }
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    procedureType:
                      e.target.value
                  })
                }
              />

              <TextField
                label="Anesthesia Name"
                value={
                  editRecord.anesthesiaName
                }
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    anesthesiaName:
                      e.target.value
                  })
                }
              />

              <TextField
                label="Anesthesia Type"
                value={
                  editRecord.anesthesiaType
                }
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    anesthesiaType:
                      e.target.value
                  })
                }
              />

              <TextField
                type="datetime-local"
                label="Induce Time"
                InputLabelProps={{
                  shrink: true
                }}
                value={
                  editRecord.induceTime
                }
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    induceTime:
                      e.target.value
                  })
                }
              />

              <TextField
                type="datetime-local"
                label="End Time"
                InputLabelProps={{
                  shrink: true
                }}
                value={editRecord.endTime}
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    endTime:
                      e.target.value
                  })
                }
              />

              <TextField
                multiline
                rows={3}
                label="Medicines Used"
                value={
                  editRecord.medicinesUsedText
                }
                onChange={(e) =>
                  setEditRecord({
                    ...editRecord,
                    medicinesUsedText:
                      e.target.value
                  })
                }
              />

            </Box>
          )}
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
    </div>
  );
};

export default ViewAnesthesiaRecord;

const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '1rem'
  },

  heading: {
    textAlign: 'center',
    marginBottom: '1rem'
  },

  searchInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px'
  },

  centerText: {
    textAlign: 'center',
    marginTop: '2rem'
  }
};