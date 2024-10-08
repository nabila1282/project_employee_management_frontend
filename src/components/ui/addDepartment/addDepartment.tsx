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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Modal } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Department {
    _id: string;
    name: string;
    __v: number;
}

export default function DepartmentTable() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [newDepartmentName, setNewDepartmentName] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, [departments]);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/departments/get-all-departments');
            if (response.ok) {
                const data = await response.json();
                setDepartments(data.data);
            } else {
                console.error('Failed to fetch departments');
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDelete = (department) => {
        setDepartmentToDelete(department);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false);
        if (departmentToDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/departments/delete/${departmentToDelete._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setDepartments((prevDepartments) => prevDepartments.filter((department) => department._id !== departmentToDelete._id));
                    toast.success('Department deleted successfully');
                } else {
                    console.error('Failed to delete department');
                    toast.error('Failed to delete department');
                }
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const handleEdit = (department) => {
        setDepartmentToEdit(department);
        setEditDialogOpen(true);
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        setEditDialogOpen(false);

        if (departmentToEdit) {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/departments/update-department/${departmentToEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(departmentToEdit),
                });

                if (response.ok) {
                    const updatedDepartments = departments.map((department) =>
                        department._id === departmentToEdit._id ? { ...departmentToEdit } : department
                    );
                    setDepartments(updatedDepartments);
                    toast.success('Department updated successfully');
                    fetchDepartments();
                } else {
                    console.error('Failed to update department');
                    toast.error('Failed to update department');
                }
            } catch (error) {
                console.error('Error updating department:', error);
            }
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewDepartmentName('');
    };

    const handleCreateDepartment = async () => {
        if (newDepartmentName) {
            try {
                const response = await fetch('http://localhost:5000/api/v1/departments/create-department', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newDepartmentName }),
                });

                if (response.ok) {
                    toast.success('Department created successfully');
                    fetchDepartments();
                    handleCloseModal();
                } else {
                    console.error('Failed to create department');
                    toast.error('Failed to create department');
                }
            } catch (error) {
                console.error('Error creating department:', error);
            }
        }
    };

    return (
        <>
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} aria-labelledby="delete-dialog-title">
                <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this department?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                aria-labelledby="edit-dialog-title"
            >
                <DialogTitle id="edit-dialog-title">Edit Department</DialogTitle>
                <DialogContent>
                    {departmentToEdit && (
                        <div>
                            <form onSubmit={handleUpdateSubmit}>
                                <TextField
                                    label="Name"
                                    value={departmentToEdit.name}
                                    onChange={(e) => setDepartmentToEdit({ ...departmentToEdit, name: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ marginTop: '20px' }}
                                >
                                    Save Changes
                                </Button>
                            </form>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add Department
            </Button>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell>ID</TableCell> */}
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((department) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={department._id}>
                                        {/* <TableCell>{department._id}</TableCell> */}
                                        <TableCell>{department.name}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleEdit(department)}>
                                                Update
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => handleDelete(department)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={departments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            

            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="add-department-modal-title">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <h2 id="add-department-modal-title">Add Department</h2>
                    <TextField
                        label="Department Name"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateDepartment}>
                        Create Department
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </>
    );
}
