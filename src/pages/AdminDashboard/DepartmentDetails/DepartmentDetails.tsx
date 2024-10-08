import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UserTable from '../../../components/ui/departmentDetailsTable/departmentDetails';


export default function DepartmentDetails() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
      // Define the API endpoint URL
      const apiUrl = 'http://localhost:5000/api/v1/users/get-all-users';
  
      // Use Axios to fetch data from the API
      axios.get(apiUrl)
        .then((response) => {
          // Handle the successful response and set the data in the state
          const userData = response.data.data;
          setUserData(userData);
        })
        .catch((error) => {
          // Handle any errors that occur during the fetch
          console.error('Error fetching data:', error);
        });
    }, []);
  
  return (
    <div>
       <UserTable/>
    </div>
  )
}
