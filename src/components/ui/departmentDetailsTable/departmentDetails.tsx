import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
    const [selectedDepartment, setSelectedDepartment] = useState<string | 'All'>('All');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [departmentCounts, setDepartmentCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Fetch data from the API endpoint
        fetch('http://localhost:5000/api/v1/users/get-all-users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data.data);
                setFilteredUsers(data.data); // Initially, set filtered users to all users
                updateDepartmentCounts(data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Filter users based on the selected department
        if (selectedDepartment === 'All') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) => user.department === selectedDepartment);
            setFilteredUsers(filtered);
        }
    }, [selectedDepartment, users]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDepartment(event.target.value as string);
    };

    // Get unique department values from users
    const uniqueDepartments = Array.from(new Set(users.map((user) => user.department)));

    // Calculate department-wise counts
    const updateDepartmentCounts = (userList: User[]) => {
        const counts: { [key: string]: number } = {};

        userList.forEach((user) => {
            if (counts[user.department]) {
                counts[user.department]++;
            } else {
                counts[user.department] = 1;
            }
        });

        // If 'All Departments' is selected, calculate the total count
        if (selectedDepartment === 'All') {
            let totalCount = 0;
            for (const key in counts) {
                totalCount += counts[key];
            }
            counts['All'] = totalCount;
        }

        setDepartmentCounts(counts);
    };

    return (
        <>
            <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                sx={{ margin: '16px' }}
            >
                <MenuItem value="All">All Departments</MenuItem>
                {uniqueDepartments.map((department) => (
                    <MenuItem key={department} value={department}>
                        {department}
                    </MenuItem>
                ))}
            </Select>
            <div>
                <p>
                    Total Employees in {selectedDepartment}: {departmentCounts[selectedDepartment]}
                </p>
            </div>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                                       
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.employeeId}</TableCell>
                                        <TableCell>{user.isApproved ? 'Approved' : 'Pending'}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}
