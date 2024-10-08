import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
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


import { Button, Typography } from '@mui/material';
import ApproveUser from '../../../pages/AdminDashboard/ApproveUser/ApproveUser';
import { useUser } from '../../../lib/UserContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the logout icon
import LeaveRequest from '../../../pages/EmployeeDashboard/LeaveRequest/LeaveRequest';
import Attendance from '../../../pages/EmployeeDashboard/Attendance/Attendance';
import UserInfo from '../../../pages/EmployeeDashboard/UserInfo/UserInfo';
import EmployeeSalaryReport from '../../../pages/EmployeeDashboard/SalaryReport/EmployeeSalaryReport';
import HomeAdmin from '../../../pages/AdminDashboard/HomeAdmin/HomeAdmin';
import HomeAdminForEmployee from '../../../pages/EmployeeDashboard/HomeAdminForEmployee/HomeAdminForEmployee';

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

export default function MiniDrawer() {
  const { user } = useUser();
  const { setUser } = useUser();

  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

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
      case "approveuser":
        return <ApproveUser />;
      case "leaveRequest":
        return <LeaveRequest />;
      case "attendance":
        return <Attendance />;
      case "userInfo":
        return <UserInfo />;
      case "EmployeeSalaryReport":
        return <EmployeeSalaryReport />;
      case 'HomeAdminForEmployee':
        return <HomeAdminForEmployee />;
      default:
        return <HomeAdminForEmployee />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar style={{ backgroundColor: "#1A3668" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
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
                marginLeft: "auto",
              }}
            >
              <ExitToAppIcon />
              Logout
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader style={{ background: "#1A3668" }}>
          <IconButton
            style={{ background: "white" }}
            onClick={handleDrawerClose}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List style={{ backgroundColor: "#1A3668", height: "100vh" }}>
          <ListItem disablePadding>
            <Button
              style={{ width: '100%', background: '#1A3668', marginTop: '20px' }}
              variant="contained"
              onClick={() => handleComponentChange('HomeAdminForEmployee')}
            >
              Home
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              style={{
                width: "100%",
                background: "#1A3668",
                marginTop: "20px",
              }}
              variant="contained"
              onClick={() => handleComponentChange("leaveRequest")}
            >
              Leave Request
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              style={{
                width: "100%",
                background: "#1A3668",
                marginTop: "20px",
              }}
              variant="contained"
              onClick={() => handleComponentChange("attendance")}
            >
              Give Attendance
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              style={{
                width: "100%",
                background: "#1A3668",
                marginTop: "20px",
              }}
              variant="contained"
              onClick={() => handleComponentChange("userInfo")}
            >
              Profile Create
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              style={{
                width: "100%",
                background: "#1A3668",
                marginTop: "20px",
              }}
              variant="contained"
              onClick={() => handleComponentChange("EmployeeSalaryReport")}
            >
              Salary Report
              
            </Button>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph>
          {renderActiveComponent()}
        </Typography>
      </Box>
    </Box>
  );
}
