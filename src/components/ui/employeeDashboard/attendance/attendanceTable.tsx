import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useUser } from "../../../../lib/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";

export default function AttendanceTable() {
  const { user: loggedInUser } = useUser();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleGiveAttendance = async () => {
    const userEmail = loggedInUser.email;
    const userToUpdate = users.find((user) => user.email === userEmail);

    if (userToUpdate) {
      const userId = userToUpdate._id;
      const currentTime = new Date();

      // Check if the user has already given attendance today
      const today = new Date(currentTime);
      today.setHours(0, 0, 0, 0);

      const hasGivenAttendanceToday = userToUpdate.attendanceRecords.some((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === today.getDate() &&
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getFullYear() === today.getFullYear()
        );
      });

      if (hasGivenAttendanceToday) {
        toast.warning("You have already given attendance today.");
      } else {
        // Continue with attendance recording logic

        // Compare the current time with 9:00 AM in Bangladeshi time
        const nineAM = new Date(currentTime);
        nineAM.setUTCHours(3, 0, 0, 0); // UTC+3 is Bangladeshi time

        let status = "Present"; // Default status

        if (currentTime > nineAM) {
          status = "Late"; // Set to "Late" if the user arrives after 9:00 AM
        }

        // Update the "attendanceTime" and "status" fields
        const attendanceRecord = {
          date: currentTime.toISOString(),
          status: status,
          attendanceTime: currentTime,
        };

        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/users/update-user/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                attendanceRecords: [
                  ...userToUpdate.attendanceRecords,
                  attendanceRecord,
                ],
              }),
            }
          );

          if (response.ok) {
            toast.success("Attendance recorded successfully");
            fetchUsers();
          } else {
            console.error("Failed to record attendance");
            toast.error("Failed to record attendance");
          }
        } catch (error) {
          console.error("Error recording attendance:", error);
        }
      }
    }
  };



  // const handleOutTime = async () => {
  //   const userEmail = loggedInUser.email;
  //   const userToUpdate = users.find((user) => user.email === userEmail);

  //   if (userToUpdate) {
  //     const userId = userToUpdate._id;
  //     const currentTime = new Date();

  //     // Check if an out time entry already exists for today
  //     const today = new Date(currentTime);
  //     today.setHours(0, 0, 0, 0);

  //     const existingOutTimeEntry = userToUpdate.attendanceRecords.find((record) => {
  //       const recordDate = new Date(record.date);
  //       return (
  //         recordDate.getDate() === today.getDate() &&
  //         recordDate.getMonth() === today.getMonth() &&
  //         recordDate.getFullYear() === today.getFullYear() &&
  //         record.status === "Signed Out"
  //       );
  //     });

  //     if (existingOutTimeEntry) {
  //       toast.warning("You have already recorded Out Time for today.");
  //       // // Update the outTime for the existing out time entry
  //       // existingOutTimeEntry.outTime = currentTime;

  //       // // Calculate overtime for the existing entry
  //       // const officeEndTime = new Date(currentTime);
  //       // officeEndTime.setHours(18, 0, 0, 0); // Set the office end time to 6:00 PM
  //       // const overtimeMinutes = (currentTime - officeEndTime) / 60000;
  //       // // const hours = Math.floor(Math.abs(overtimeMinutes) / 60);
  //       // const hours = Math.abs(Math.floor(overtimeMinutes / 60)); // Calculate absolute positive hours
  //       // existingOutTimeEntry.overtime = `${overtimeMinutes < 0 ? '-' : ''}${hours} hours`;
  //     }

  //     else {
  //       // Add a new entry for the out time
  //       const officeEndTime = new Date(currentTime);
  //       officeEndTime.setHours(18, 0, 0, 0); // Set the office end time to 6:00 PM
  //       const overtimeMinutes = (currentTime - officeEndTime) / 60000;
  //       // const hours = Math.floor(Math.abs(overtimeMinutes) / 60);
  //       const hours = Math.abs(Math.floor(overtimeMinutes / 60)); // Calculate absolute positive hours
  //       const overtimeFormatted = `${overtimeMinutes < 0 ? '-' : ''}${hours} hours`;

  //       const outTimeEntry = {
  //         date: currentTime.toISOString(),
  //         status: "Signed Out",
  //         outTime: currentTime,
  //         overtime: overtimeFormatted,
  //       };

  //       userToUpdate.attendanceRecords.push(outTimeEntry); // Add the new out time entry

  //       try {
  //         const response = await fetch(
  //           `http://localhost:5000/api/v1/users/update-user/${userId}`,
  //           {
  //             method: "PUT",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               attendanceRecords: userToUpdate.attendanceRecords,
  //             }),
  //           }
  //         );

  //         if (response.ok) {
  //           toast.success("Out Time recorded successfully");
  //           fetchUsers();
  //         }
  //         else {
  //           console.error("Failed to record Out Time");
  //           toast.error("Failed to record Out Time");
  //         }
  //       } catch (error) {
  //         console.error("Error recording Out Time:", error);
  //       }
  //     }
  //   }
  // };


  const handleOutTime = async () => {
    const userEmail = loggedInUser.email;
    const userToUpdate = users.find((user) => user.email === userEmail);

    if (userToUpdate) {
      const userId = userToUpdate._id;
      const currentTime = new Date();

      // Check if an out time entry already exists for today
      const today = new Date(currentTime);
      today.setHours(0, 0, 0, 0);

      const existingOutTimeEntry = userToUpdate.attendanceRecords.find((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === today.getDate() &&
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getFullYear() === today.getFullYear() &&
          record.status === "Signed Out"
        );
      });

      if (existingOutTimeEntry) {
        toast.warning("You have already recorded Out Time for today.");
      } else {
        // Add a new entry for the out time
        const officeEndTime = new Date(currentTime);
        officeEndTime.setHours(18, 0, 0, 0); // Set the office end time to 6:00 PM

        // Check if out time is between 6 PM and 11:59 PM
        if (currentTime >= officeEndTime && currentTime < new Date(currentTime).setHours(23, 59, 59, 999)) {
          const overtimeMinutes = (currentTime - officeEndTime) / 60000;
          const hours = Math.abs(Math.floor(overtimeMinutes / 60));
          const overtimeFormatted = `${overtimeMinutes < 0 ? '-' : ''}${hours} hours`;

          const outTimeEntry = {
            date: currentTime.toISOString(),
            status: "Signed Out",
            outTime: currentTime,
            overtime: overtimeFormatted,
          };

          userToUpdate.attendanceRecords.push(outTimeEntry); // Add the new out time entry

          try {
            const response = await fetch(
              `http://localhost:5000/api/v1/users/update-user/${userId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  attendanceRecords: userToUpdate.attendanceRecords,
                }),
              }
            );

            if (response.ok) {
              toast.success("Out Time recorded successfully");
              fetchUsers();
            } else {
              console.error("Failed to record Out Time");
              toast.error("Failed to record Out Time");
            }
          } catch (error) {
            console.error("Error recording Out Time:", error);
          }
        } else {
          // Set overtime to 0 if out time is not between 6 PM and 11:59 PM
          const outTimeEntry = {
            date: currentTime.toISOString(),
            status: "Signed Out",
            outTime: currentTime,
            overtime: "0 hours",
          };

          userToUpdate.attendanceRecords.push(outTimeEntry); // Add the new out time entry

          try {
            const response = await fetch(
              `http://localhost:5000/api/v1/users/update-user/${userId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  attendanceRecords: userToUpdate.attendanceRecords,
                }),
              }
            );

            if (response.ok) {
              toast.success("Out Time recorded successfully");
              fetchUsers();
            } else {
              console.error("Failed to record Out Time");
              toast.error("Failed to record Out Time");
            }
          } catch (error) {
            console.error("Error recording Out Time:", error);
          }
        }
      }
    }
  };



  
return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGiveAttendance}
      >
        Give Attendance
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleOutTime}
      >
        Out Time
      </Button>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time (Bangladesh Time)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Over Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((user) => user?.email === loggedInUser?.email)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <React.Fragment key={user?._id}>
                  {user.attendanceRecords
                    .slice() // Create a copy of the array
                    .reverse() // Reverse the order of records
                    .map((record, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell>
                          {new Date(record.date)
                            .toLocaleTimeString("en-US", {
                              timeZone: "Asia/Dhaka",
                            })
                            .replace(/:\d+ /, " ")}
                        </TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>{record.overtime}</TableCell>
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
