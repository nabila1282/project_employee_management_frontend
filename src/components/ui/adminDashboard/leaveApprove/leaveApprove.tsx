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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// ... (your existing imports)

export default function UserLeaveTable() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

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

    const handleDelete = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false);
        if (userToDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/users/delete/${userToDelete._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
                    toast.success('User deleted successfully');
                } else {
                    console.error('Failed to delete user');
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleEdit = (user, leaveRequestId) => {
        setUserToEdit(user);
        setSelectedLeaveRequestId(leaveRequestId);
        setEditDialogOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (userToEdit && selectedLeaveRequestId && newStatus) {
            const updatedLeaveRequests = userToEdit.leaveRequests.map(request => {
                if (request._id === selectedLeaveRequestId) {
                    // Update only the status of the selected leave request
                    return {
                        ...request,
                        status: newStatus
                    };
                }
                return request;
            });

            const updatedUser = {
                ...userToEdit,
                leaveRequests: updatedLeaveRequests
            };

            try {
                const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${userToEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (response.ok) {
                    toast.success('Leave request status updated successfully');
                    fetchUsers(); // Assuming you want to refresh the user data after updating status
                } else {
                    console.error('Failed to update leave request status');
                    toast.error('Failed to update leave request status');
                }
            } catch (error) {
                console.error('Error updating leave request status:', error);
            }

            setEditDialogOpen(false);
            setNewStatus('');
            setSelectedLeaveRequestId(null);
        }
    };
    const handlePrint = () => {
        const printContent = document.querySelector('.leave-report-container').innerHTML;
        const originalContent = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = printContent;

        // Call print() in the new window
        printWindow.print();

        // Restore original content after printing
        printWindow.onafterprint = () => {
            printWindow.close();
            document.body.innerHTML = originalContent;
        };
    };

    const handleDownloadPDF = async () => {
        const pdfContent = document.querySelector('.leave-report-container');

        if (!pdfContent) {
            console.error('Could not find the PDF content element');
            return;
        }

        const canvas = await html2canvas(pdfContent as HTMLElement);

        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            
        });

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

        pdf.save('salary_report.pdf');
    };
    return (
        <>
            <button
                onClick={handlePrint}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                Print
            </button>
            <button
                onClick={handleDownloadPDF}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '10px',
                }}
            >
                Download PDF
            </button>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} aria-labelledby="delete-dialog-title">
                <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} aria-labelledby="edit-dialog-title">
                <DialogTitle id="edit-dialog-title">Update Leave Request Status</DialogTitle>
                <DialogContent>
                    <Select
                        label="New Status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Declined">Declined</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateStatus} color="primary">
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            <Paper className="leave-report-container" sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Leave Requests</TableCell>
                                {/* <TableCell>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.leaveRequests.map((request) => (
                                                <div key={request._id}>
                                                    Start Date: {new Date(request.startDate).toLocaleDateString('en-GB')}<br />
                                                    End Date: {new Date(request.endDate).toLocaleDateString('en-GB')}<br />
                                                    Reason: {request.reason}<br />
                                                    Status: {request.status}<br />
                                                    {/* Button to update status */}
                                                    <Button variant="outlined" color="primary" onClick={() => handleEdit(user, request._id)}>
                                                        Update Status
                                                    </Button>
                                                    <br /><br />
                                                </div>
                                            ))}
                                        </TableCell>
                                        {/* <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleEdit(user, null)}>
                                                Approve All
                                            </Button>
                                            
                                        </TableCell> */}
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

