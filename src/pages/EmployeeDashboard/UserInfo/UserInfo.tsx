import React, { useState, useEffect } from 'react';
import { useUser } from '../../../lib/UserContext';
import { TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';

export default function UserInfo() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatedUserData, setUpdatedUserData] = useState({});
    const loggedInUser = useUser();

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
    const loggedInUserData = users.find(user => user?.email === loggedInUser?.user?.email);

    

    const handleUpdate = async () => {
        // Assuming you have the user's email available
        const userEmail = loggedInUser?.user.email;

        // Find the user to update
        const userToUpdate = users.find(user => user?.email === userEmail);

        if (userToUpdate) {
            const userId = userToUpdate._id;

            try {
                // Send a PUT request to update the user data
                const response = await fetch(`http://localhost:5000/api/v1/users/update-user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUserData),
                });

                if (response.ok) {
                    console.log('User data updated successfully');
                    toast.success('User data updated successfully');
                    fetchUsers(); // Assuming you want to refresh the user data after updating
                } else {
                    console.error('Failed to update user data');
                    toast.error('Failed to update user data');
                }
            } catch (error) {
                console.error('Error updating user data:', error);
                toast.error('Error updating user data');
            }
        }
    };
    const handleInputChange = (field, value) => {
        setUpdatedUserData({ ...updatedUserData, [field]: value });
    };

    const validateDate = (dateString) => {
        // Check if the date is in the format 'YYYY-MM-DD'
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(dateString);
    };

    // if (loading) {
    //     return <div>Loading...</div>; 
    // }

    return (
        <div>
            <div>
                <p>Name: {loggedInUserData?.name}</p>
                <p>Email: {loggedInUserData?.email}</p>
                <p>Job Position: {loggedInUserData?.jobPosition}</p>
               
                <p>Salary: {loggedInUserData?.salary}</p>
                <p>Blood Group: {loggedInUserData?.bloodGroup}</p>
                <p>Address: {loggedInUserData?.address}</p>
                <p>Joining Date: {loggedInUserData?.joiningDate}</p>
            </div>

            <div className="for-updating">
                {/* Input fields for updating user information */}
                <TextField
                    label="Job Position"
                    type="text"
                    fullWidth
                    
                    onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                />
             
                <TextField
                    label="Salary"
                    type="number"
                    fullWidth
                    
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                />
                <TextField
                    label="Blood Group"
                    type="text"
                    fullWidth
                  
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                />
                <TextField
                    label="Address"
                    type="text"
                    fullWidth
                    
                    onChange={(e) => handleInputChange('address', e.target.value)}
                />
                <TextField
                    label="Joining Date"
                    type="text"
                    fullWidth
                    
                    onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />

                {/* Update button */}
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </div>
        </div>
    );
}
