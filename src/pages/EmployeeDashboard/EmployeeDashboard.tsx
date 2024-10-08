import React from 'react'
import { useParams } from 'react-router-dom';
import MiniDrawer from '../../components/ui/employeeDashboard/employeeDashboard';

export default function EmployeeDashboard() {
  const { email } = useParams();
  return (
    <div>
       
      
      <MiniDrawer/>
    </div>
  )
}
