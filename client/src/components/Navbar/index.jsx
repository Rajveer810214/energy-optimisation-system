import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem, 
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Person as ProfileIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon, 
  Home as HomeIcon,
  
  // Lab as HomeIcon,
} from '@mui/icons-material';
import ContactMailIcon from '@mui/icons-material/ContactMail'; // Email contact
import InfoIcon from '@mui/icons-material/Info'; // Standard About icon
import ScieLnceIcon from '@mui/icons-material/Science';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import getUserDetail from '../../hooks/GetUserDetails';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const userDetails = await getUserDetail();
    setUser(userDetails);
  };

  const handleLogout = async () => {
    try {
      await localStorage.clear()
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const navLinks = [
    { 
      icon: <HomeIcon />, 
      text: 'Home', 
      path: '/' 
    },
    { 
      icon: <ScieLnceIcon />, 
      text: 'My Labs', 
      path: '/labs' 
    },
    { 
      icon: <InfoIcon />, 
      text: 'About', 
      path: '/about' 
    },
    { 
      icon: <ContactMailIcon />, 
      text: 'Contact us', 
      path: '/contact' 
    },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: { xs: 1, md: 0 } 
          }}>
            {/* <LabIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate('/')}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Roboto',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                ':hover': { opacity: 0.8 }
              }}
            >
              ENERGY OPTIMIZER
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="app menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navLinks.map((link) => (
                <MenuItem 
                  key={link.text} 
                  onClick={() => handleMenuItemClick(link.path)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText>{link.text}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Button
                key={link.text}
                onClick={() => handleMenuItemClick(link.path)}
                startIcon={link.icon}
                sx={{ 
                  color: 'white', 
                  mx: 1,
                  ':hover': { 
                    backgroundColor: 'rgba(255,255,255,0.2)' 
                  }
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          {/* User Profile & Settings */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Theme Toggle */}
          

            {/* User Menu */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              

<Avatar
  alt={user?.username || "User"}
  sx={{
    bgcolor: user?.username ? 'secondary.main' : 'transparent',
    width: 40,
    height: 40
  }}
>
  {user?.username ? user.username.charAt(0).toUpperCase() : <AccountCircleIcon fontSize="large" />}
</Avatar>

              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleMenuItemClick('/profile')}>
                <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              
              <Divider />
              {localStorage.getItem('user') ? (
    <MenuItem onClick={handleLogout}>
      <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
      Logout
    </MenuItem>
  ) : (
    <MenuItem onClick={() => navigate('/signin')}>
      <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
      Login
    </MenuItem>
  )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;