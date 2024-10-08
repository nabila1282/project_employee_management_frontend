import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  Select,
  MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttendanceManagemeentTable() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState(''); // State to store the new status

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/get-all-users');
      if (response.ok) {
        const data = await response.json();
        setData(data.data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAttendanceManagement = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/update-attendance/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Attendance status updated successfully');
        fetchUserData();
        handleCloseModal();
      } else {
        console.error('Failed to update attendance status');
        toast.error('Failed to update attendance status');
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  return (
    <>
      <Paper>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Attendance Records</TableCell>
                {/* <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.attendanceRecords.map((record) => (
                      <div key={record._id}>
                        Date: {new Date(record.date).toLocaleDateString()}, Status: {record.status},{record.overtime && `Overtime: ${record.overtime}`}

                      </div>
                    ))}
                  </TableCell>
                  {/* <TableCell>{user.status}</TableCell> */}
                  {/* <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAttendanceManagement(user)}
                    >
                      Attendance Management
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="attendance-management-modal-title">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="attendance-management-modal-title">Attendance Management for {selectedUser && selectedUser.name}</h2>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
            <MenuItem value="On Leave">On Leave</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleStatusUpdate}>
            Update Attendance Status
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
}
