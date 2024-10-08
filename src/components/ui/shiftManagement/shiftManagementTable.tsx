import * as React from 'react';
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
  TextField,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ShiftManagementTable() {
  const [users, setUsers] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [newShift, setNewShift] = React.useState('');

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/get-all-users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewShift('');
  };

  const handleShiftUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shift: newShift }),
      });

      if (response.ok) {
        toast.success('Shift updated successfully');
        fetchUsers();
        handleCloseModal();
      } else {
        console.error('Failed to update shift');
        toast.error('Failed to update shift');
      }
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  return (
    <>
      <Paper>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell>ID</TableCell> */}
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user?._id}>
                  {/* <TableCell component="th" scope="row">
                    {user?._id}
                  </TableCell> */}
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.shift}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdate(user)}
                    >
                      Shift Management
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="shift-update-modal-title">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="shift-update-modal-title">Update Shift for {selectedUser && selectedUser.name}</h2>
          <FormControl fullWidth>
            <Select
              value={newShift}
              onChange={(e) => setNewShift(e.target.value)}
            >
              <MenuItem value="Day 8am-4pm">Day 8am-4pm</MenuItem>
              <MenuItem value="Evening 4pm-11.59pm">Evening 4pm-11.59pm</MenuItem>
              <MenuItem value="Night 12am-8pm">Night 12am-8pm</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleShiftUpdate}>
            Update Shift
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
}
