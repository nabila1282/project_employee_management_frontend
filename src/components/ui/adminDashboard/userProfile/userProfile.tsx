import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
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
    bloodGroup: string;
    salary: number;
    address: string;
    jobPosition: string;
    joiningDate: string;
    // Add any other user-related fields here
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            <TableCell>Employee id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                
                                
                                
                                
                                <TableCell>Blood Group</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Job Position</TableCell>
                                <TableCell>Joining Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                                        <TableCell>{user.employeeId}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        
                                        
                                        <TableCell>{user.bloodGroup}</TableCell>
                                        <TableCell>{user.salary}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>{user.jobPosition}</TableCell>
                                        <TableCell>{user.joiningDate}</TableCell>
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
