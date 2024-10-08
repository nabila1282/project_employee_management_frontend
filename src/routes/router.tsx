import { createBrowserRouter } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import App from '../App';
import Dashboard from '../pages/AdminDashboard/AdminDashboard';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard/EmployeeDashboard';
import ApproveUser from '../pages/AdminDashboard/ApproveUser/ApproveUser';
import DepartmentDetails from '../pages/AdminDashboard/DepartmentDetails/DepartmentDetails';
import Departments from '../pages/AdminDashboard/Departments/Departments';
import AddDepartments from '../pages/AdminDashboard/AddDepartments/AddDepartments';
import ShiftManagement from '../pages/ShiftManagement/ShiftManagement';
import LeaveRequest from '../pages/EmployeeDashboard/LeaveRequest/LeaveRequest';
import ApproveLeave from '../pages/AdminDashboard/ApproveLeave/ApproveLeave';
import Attendance from '../pages/EmployeeDashboard/Attendance/Attendance';
import AdminAttendance from '../pages/AdminDashboard/Attendance/AdminAttendance';
import UserInfo from '../pages/EmployeeDashboard/UserInfo/UserInfo';
import UserProfile from '../pages/AdminDashboard/UserProfile/UserProfile';
import SalaryReport from '../pages/AdminDashboard/SalaryReport/SalaryReport';
import HomeAdmin from '../pages/AdminDashboard/HomeAdmin/HomeAdmin';
import EmployeeSalaryReport from '../pages/EmployeeDashboard/SalaryReport/EmployeeSalaryReport';



const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      // {
      //     path: '/checkout',
      //     element: <PrivateRoute>
      //         <Checkout />
      //     </PrivateRoute>,
      // },
    ],
  },

  {
    path: "/admindashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/homeAdmin",
    element: <HomeAdmin />,
  },
  {
    path: "/approveuser",
    element: <ApproveUser />,
  },
  {
    path: "/departmentDetails",
    element: <DepartmentDetails />,
  },
  {
    path: "/departments",
    element: <Departments />,
  },
  {
    path: "/addDepartments",
    element: <AddDepartments />,
  },
  {
    path: "/shiftManagement",
    element: <ShiftManagement />,
  },
  {
    path: "/approveLeave",
    element: <ApproveLeave />,
  },
  {
    path: "/adminAttendance",
    element: <AdminAttendance />,
  },
  {
    path: "/userProfile",
    element: <UserProfile />,
  },
  {
    path: "/salaryReport",
    element: <SalaryReport />,
  },
  {
    path: "/employeedashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/leaveRequest",
    element: <LeaveRequest />,
  },
  {
    path: "/attendance",
    element: <Attendance />,
  },
  {
    path: "/userInfo",
    element: <UserInfo />,
  },
  {
    path: "/EmployeeSalaryReport",
    element: <EmployeeSalaryReport />,
  },
  // {
  //     path: '/admin-residential-for-Sell',
  //     element: <AdminResidentialForSell />,
  // },

  // {
  //     path: '*',
  //     element: <NotFound />,
  // },
]);

export default routes;
