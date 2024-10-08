import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useUser } from '../../../../lib/UserContext'; // Assuming this is how you get the logged-in user
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function LeaveTable() {
    const { user: loggedInUser } = useUser(); // Assuming this is how you get the logged-in user

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addLeaveDialogOpen, setAddLeaveDialogOpen] = useState(false);

    useEffect(() => {
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [leaveRequestData, setLeaveRequestData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        status: 'Pending'
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLeaveRequestData({
            ...leaveRequestData,
            [name]: value
        });
    };

    const handleAddLeaveRequest = async () => {
        const userEmail = loggedInUser?.email; // Assuming you have the user's email available
    
        const userToUpdate = users.find(user => user?.email === userEmail);
    
        if (userToUpdate) {
            const userId = userToUpdate._id;
    
            try {
                const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        leaveRequests: [...userToUpdate.leaveRequests, leaveRequestData]
                    }),
                });
    
                if (response.ok) {
                    toast.success('Leave request added successfully');
                    fetchUsers(); // Assuming you want to refresh the user data after adding a leave request
                } else {
                    console.error('Failed to add leave request');
                    toast.error('Failed to add leave request');
                }
            } catch (error) {
                console.error('Error adding leave request:', error);
            }
        }
    };
    

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Button 
                variant="contained" 
                color="primary"
                onClick={() => setAddLeaveDialogOpen(true)}
            >
                Add Leave Request
            </Button>

            <Dialog 
            open={addLeaveDialogOpen} 
            onClose={() => setAddLeaveDialogOpen(false)} 
            aria-labelledby="add-leave-dialog-title"
        >
            <DialogTitle id="add-leave-dialog-title">Add Leave Request</DialogTitle>
            <DialogContent>
                <span>Start Date</span>
                <TextField
                    
                    type="date"
                    name="startDate"
                    value={leaveRequestData.startDate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <span>End Date</span>
                <TextField
                    
                    type="date"
                    name="endDate"
                    value={leaveRequestData.endDate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Reason</InputLabel>
                    <Select
                        label="Reason"
                        name="reason"
                        value={leaveRequestData.reason}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Sick">Sick</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Vacation">Vacation</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() => setAddLeaveDialogOpen(false)} 
                    color="primary"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={() => {
                        setAddLeaveDialogOpen(false);
                        handleAddLeaveRequest();
                    }} 
                    color="primary"
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>


            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Leave Start Date</TableCell>
                            <TableCell>Leave End Date</TableCell>
                            <TableCell>Leave Reason</TableCell>
                            <TableCell>Leave Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .filter(user => user?.email === loggedInUser?.email)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <React.Fragment key={user?._id}>
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                        <TableCell>{user?.name}</TableCell>
                                        <TableCell>{user?.email}</TableCell>
                                    </TableRow>
                                    {user.leaveRequests.map((request, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell colSpan={2}>Leave Request {index + 1}</TableCell>
                                            <TableCell>Start Date: {new Date(request.startDate).toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell>End Date: {new Date(request.endDate).toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell>Reason: {request.reason}</TableCell>
                                            <TableCell>Status: {request.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ToastContainer />
        </Paper>
    );
}
