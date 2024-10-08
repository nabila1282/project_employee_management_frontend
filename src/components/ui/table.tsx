import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    _id: string;
    name: string;
    email: string;
    department: string;
    phoneNumber: string;
    employeeId: string;
    isApproved: boolean;
    // Add any other user-related fields here
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [department, setDepartment] = useState('');
    const [newEmployeeId, setNewEmployeeId] = useState('');
    const [selectedAction, setSelectedAction] = useState('');

    useEffect(() => {
        // Fetch data from the API endpoint
        fetch('http://localhost:5000/api/v1/users/get-all-users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [users]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelectChange = async (e, user) => {
        const action = e.target.value; // Get the selected action (approve, reject, updateDepartment, or updateEmployeeId)

        const confirmation = window.confirm(
            `Are you sure you want to ${
                action === 'approve' ? 'accept' : action === 'reject' ? 'reject' : 'update'
            } this user?`
        );

        if (!confirmation) {
            return; // If the user clicks "Cancel," do nothing
        }

        try {
            if (action === 'approve' || action === 'reject') {
                // Approve or reject the user
                const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${user._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isApproved: action === 'approve' }),
                });

                if (response.ok) {
                    setUsers((prevUsers) =>
                        prevUsers.map((u) => (u._id === user._id ? { ...u, isApproved: action === 'approve' } : u))
                    );

                    if (action === 'approve') {
                        toast.success('User status updated successfully');
                    }
                } else {
                    console.error(`Failed to ${action} user`);
                    toast.error(`Failed to ${action} user`);
                }

                if (action === 'reject') {
                    const deleteResponse = await fetch(`http://localhost:5000/api/v1/users/users/delete/${user._id}`, {
                        method: 'DELETE',
                    });

                    if (deleteResponse.ok) {
                        console.log('User rejected successfully');
                        toast.success('User rejected successfully');
                    } else {
                        console.error('Failed to reject user');
                        toast.error('Failed to reject user');
                    }
                }
            } else if (action === 'updateDepartment' || action === 'updateEmployeeId') {
                let newValue;

                if (action === 'updateDepartment') {
                    newValue = department; // Use the value from the state
                } else {
                    newValue = newEmployeeId; // Use the value from the state
                }

                if (!newValue) {
                    alert(`Please provide a new ${action === 'updateDepartment' ? 'Department' : 'Employee ID'}.`);
                    return; // If the user didn't provide a new value, do nothing
                }

                // Create the update data based on the action
                const updateData = {
                    department: action === 'updateDepartment' ? newValue : user.department,
                    employeeId: action === 'updateEmployeeId' ? newValue : user.employeeId,
                };

                const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${user._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });

                if (response.ok) {
                    setUsers((prevUsers) =>
                        prevUsers.map((u) => (u._id === user._id ? { ...u, ...updateData } : u))
                    );

                    toast.success(`User's ${action === 'updateDepartment' ? 'Department' : 'Employee ID'} updated successfully`);
                } else {
                    console.error(`Failed to update ${action === 'updateDepartment' ? 'Department' : 'Employee ID'}`);
                    toast.error(`Failed to update ${action === 'updateDepartment' ? 'Department' : 'Employee ID'}`);
                }
            }
        } catch (error) {
            console.error('Error updating/rejecting user:', error);
        }
    };

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                               
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Is Approved</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                                        
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.employeeId}</TableCell>
                                        <TableCell>{user.isApproved ? 'Approved' : 'Pending'}</TableCell>
                                        <TableCell align="center">
                                            <Select
                                                value=""
                                                onChange={(e) => {
                                                    setSelectedAction(e.target.value); // Set the selected action
                                                    handleSelectChange(e, user);
                                                }}
                                            >
                                                <MenuItem value="approve">Accept</MenuItem>
                                                <MenuItem value="reject">Reject</MenuItem>
                                                <MenuItem value="updateDepartment">Update Department</MenuItem>
                                                <MenuItem value="updateEmployeeId">Update Employee ID</MenuItem>
                                            </Select>
                                            {selectedAction === 'updateDepartment' && (
                                                <input
                                                    type="text"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    placeholder="New Department"
                                                />
                                            )}
                                            {selectedAction === 'updateEmployeeId' && (
                                                <input
                                                    type="text"
                                                    value={newEmployeeId}
                                                    onChange={(e) => setNewEmployeeId(e.target.value)}
                                                    placeholder="New Employee ID"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
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
            </Paper>
            <ToastContainer />
        </>
    );
}