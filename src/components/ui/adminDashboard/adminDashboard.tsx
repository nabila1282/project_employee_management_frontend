import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent,  Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';


import { Button, Collapse, Typography } from '@mui/material';
import ApproveUser from '../../../pages/AdminDashboard/ApproveUser/ApproveUser';
import { useUser } from '../../../lib/UserContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the logout icon
import DepartmentDetails from '../../../pages/AdminDashboard/DepartmentDetails/DepartmentDetails';
import Departments from '../../../pages/AdminDashboard/Departments/Departments';
import AddDepartments from '../../../pages/AdminDashboard/AddDepartments/AddDepartments';
import ShiftManagement from '../../../pages/ShiftManagement/ShiftManagement';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ApproveLeave from '../../../pages/AdminDashboard/ApproveLeave/ApproveLeave';
import AdminAttendance from '../../../pages/AdminDashboard/Attendance/AdminAttendance';
import UserProfile from '../../../pages/AdminDashboard/UserProfile/UserProfile';

import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SalaryReport from '../../../pages/AdminDashboard/SalaryReport/SalaryReport';
import HomeAdmin from '../../../pages/AdminDashboard/HomeAdmin/HomeAdmin';
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
};

export default function MiniDrawer() {
    const { user } = useUser();
    const { setUser } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    //   const [isHomeClicked, setIsHomeClicked] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [activeComponent, setActiveComponent] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    // const departmentsTotal = 10;
    // const employeesTotal = 20;
    const attendanceTotal = 85;

    const [departmentsTotal, setDepartmentsTotal] = useState(0);
    const [employeesTotal, setEmployeesTotal] = useState(0);

    useEffect(() => {
        // Fetch data for departments
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/departments/get-all-departments');
                const data = await response.json();

                if (data.status === 'success') {
                    // Set the total number of departments
                    setDepartmentsTotal(data?.data?.length);
                } else {
                    console.error('Error fetching departments:', data.status);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        // Fetch data for employees
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/users/get-all-users');
                const data = await response.json();

                if (data.status === 'success') {
                    // Set the total number of employees
                    setEmployeesTotal(data?.data?.length);
                } else {
                    console.error('Error fetching employees:', data.status);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        // Call both fetch functions
        fetchDepartments();
        fetchEmployees();
    }, []);







    const handleDrawerOpen = () => {
        setOpen(true);
        setShowWelcome(false);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleComponentChange = (component) => {
        setActiveComponent(component);
        setShowWelcome(false);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');

        // Implement your logout logic here
        // For example, clear user context and redirect to login page
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {

            case 'approveuser':
                return <ApproveUser />;
            case 'departmentDetails':
                return <DepartmentDetails />;
            case 'departments':
                return <Departments />;
            case 'addDepartments':
                return <AddDepartments />;
            case 'shiftManagement':
                    return <ShiftManagement />;
            case 'approveLeave':
                return <ApproveLeave />;
            case 'adminAttendance':
                return <AdminAttendance />;
            case 'userProfile':
                return <UserProfile />;
            case 'salaryReport':
                return <SalaryReport />;
            case 'homeAdmin':
                return <HomeAdmin />;
            default:
                return <HomeAdmin />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar style={{ backgroundColor: '#1A3668' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard 
                        
                    </Typography>
                    {user?.email && (
                        <IconButton
                            color="inherit"
                            onClick={handleLogout}
                            sx={{
                                marginLeft: 'auto',
                            }}
                        >
                            <ExitToAppIcon />Logout
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader style={{ background: "#1A3668" }}>
                    <IconButton style={{ background: "white" }} onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <List style={{ backgroundColor: '#1A3668', height: '100vh' }}>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('homeAdmin')}
                        >
                            Home
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('approveuser')}
                        >
                            Approve User
                        </Button>
                     </ListItem>
                    {/* <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('departmentDetails')}
                        >
                            Department Details
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('departments')}
                        >
                            Departments
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('addDepartments')}
                        >
                            Add Departments
                        </Button>
                    </ListItem>  */}
   <ListItem disablePadding>
    <div>
        <Button
            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
            variant="contained"
            onClick={() => setDropdownOpen(!dropdownOpen)}
        >
            Department Details<KeyboardArrowDownIcon />
        </Button>
        <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItem disablePadding>
                    <Button
                        style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                        variant="contained"
                                            onClick={() => handleComponentChange('departments')}
                    >
                        Departments
                    </Button>
                </ListItem>
                <ListItem disablePadding>
                    <Button
                        style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                        variant="contained"
                        onClick={() => handleComponentChange('addDepartments')}
                    >
                        Add Departments
                    </Button>
                                    </ListItem>
                                    <ListItem disablePadding>
                    {/* <Button
                        style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                        variant="contained"
                        onClick={() => handleComponentChange('addDepartments')}
                    >
                        Add Departments
                    </Button> */}
                </ListItem>
            </List>
        </Collapse>
    </div>
</ListItem>

                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('shiftManagement')}
                        >
                            Shift Management
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('approveLeave')}
                        >
                            Approve Leave
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('adminAttendance')}
                        >
                            Attendance Management
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('userProfile')}
                        >
                            Employee Profile
                        </Button>
                    </ListItem>
                    <ListItem disablePadding>
                        <Button
                            style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
                            variant="contained"
                            onClick={() => handleComponentChange('salaryReport')}
                        >
                            Salary Report
                        </Button>
                    </ListItem>
                </List>
            </Drawer>
            {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {showWelcome && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card onClick={() => handleComponentChange('addDepartments')} style={{ backgroundColor: '#2196f3', ...cardStyles }}>
                                <CardContent>
                                    <GroupIcon fontSize="large" style={{ color: 'white' }} />
                                    <Typography variant="h5" component="div" style={{ color: 'white' }}>
                                        Departments
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {departmentsTotal}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card onClick={() => handleComponentChange('userProfile')} style={{ backgroundColor: '#4caf50', ...cardStyles }}>
                                <CardContent>
                                    <PersonIcon fontSize="large" style={{ color: 'white' }} />
                                    <Typography variant="h5" component="div" style={{ color: 'white' }}>
                                        Employees
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {employeesTotal}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card onClick={() => handleComponentChange('salaryReport')} style={{ backgroundColor: '#ff9800', ...cardStyles }}>
                                <CardContent>
                                    <EventAvailableIcon fontSize="large" style={{ color: 'white' }} />
                                    <Typography variant="h5" component="div" style={{ color: 'white' }}>
                                        Attendance
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {attendanceTotal}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
                <Typography paragraph>
                    {renderActiveComponent()}
                </Typography>
                
            </Box> */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography paragraph>
                    {renderActiveComponent()}
                </Typography>
            </Box>
        </Box>
    );
}
