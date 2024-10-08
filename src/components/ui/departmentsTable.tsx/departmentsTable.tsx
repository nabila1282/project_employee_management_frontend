import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputLabel
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControl, Select, MenuItem } from "@mui/material";

interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  employeeId?: string;
  password: string;
  isApproved: boolean;
  department: string;
  
  __v: number;
}

export default function UserTableForDepartments() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'All'>('All');
  // const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departmentCounts, setDepartmentCounts] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    fetchUsers();
  }, []);
  // Add this state and effect at the beginning of your component
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    if (selectedDepartment === 'All') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.department === selectedDepartment);
      setFilteredUsers(filtered);
    }
  }, [users, selectedDepartment]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/get-all-users"
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
        const response = await fetch(
          `http://localhost:5000/api/v1/users/users/delete/${userToDelete._id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userToDelete._id)
          );
          toast.success("User deleted successfully");
        } else {
          console.error("Failed to delete user");
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setEditDialogOpen(false);

    if (userToEdit) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/update-user/${userToEdit._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userToEdit),
          }
        );

        if (response.ok) {
          const updatedUsers = users.map((user) =>
            user._id === userToEdit._id ? { ...userToEdit } : user
          );
          setUsers(updatedUsers);
          toast.success("Employee Updated successfully");
          fetchUsers();
        } else {
          console.error("Failed to update Employee");
          toast.error("Failed to update Employee");
        }
      } catch (error) {
        console.error("Error updating Employee:", error);
      }
    }
  };
  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    if (selectedValue === 'All') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.department === selectedValue);
      setFilteredUsers(filtered);
    }
  };

  const uniqueDepartments = Array.from(new Set(users.map((user) => user.department)));

  useEffect(() => {
    const counts = {};
    users.forEach((user) => {
      counts[user.department] = (counts[user.department] || 0) + 1;
    });

    setDepartmentCounts(counts);
  }, [users]);
  return (
    <>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
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
        <DialogTitle id="edit-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          {userToEdit && (
            <div>
              <form onSubmit={handleUpdateSubmit}>
                <TextField
                  label="Name"
                  value={userToEdit.name}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, name: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  value={userToEdit.email}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, email: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Gender"
                  value={userToEdit.gender}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, gender: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Phone Number"
                  value={userToEdit.phoneNumber}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      phoneNumber: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                />
                {userToEdit.employeeId !== undefined && (
                  <TextField
                    label="Employee ID"
                    value={userToEdit.employeeId}
                    onChange={(e) =>
                      setUserToEdit({
                        ...userToEdit,
                        employeeId: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                )}

                <FormControl fullWidth>
                  <label>Is Approved:</label>
                  <Select
                    value={userToEdit.isApproved}
                    onChange={(e) =>
                      setUserToEdit({
                        ...userToEdit,
                        isApproved: e.target.value,
                      })
                    }
                    required
                  >
                    <MenuItem value={true}>Approved</MenuItem>
                    <MenuItem value={false}>Pending</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Department"
                  value={userToEdit.department}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, department: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "20px" }}
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
      <FormControl >
        <InputLabel id="department-label"></InputLabel>
        <Select
          labelId="department-label"
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        >
          <MenuItem value="All">All Departments</MenuItem>
          {uniqueDepartments.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        <p>
          Total Employees in {selectedDepartment}:
          {selectedDepartment === "All" ? users.length : departmentCounts[selectedDepartment]}
        </p>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Is Approved</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                   
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.employeeId}</TableCell>
                    <TableCell>
                      {user.isApproved ? "Approved" : "Pending"}
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(user)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(user)}
                      >
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
