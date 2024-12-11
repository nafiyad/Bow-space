// This component represents the navigation bar at the top of the application

import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

function Navbar() {
  // Get current user and logout function from UserContext
  const { currentUser, logout } = useUserContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'Courses', path: '/courses' },
    ...(currentUser
      ? [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Logout', action: logout }
        ]
      : [
          { label: 'Login', path: '/login' },
          { label: 'Sign Up', path: '/signup' }
        ])
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Bow Course Registration
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText>
              {item.action ? (
                <Button fullWidth onClick={item.action}>
                  {item.label}
                </Button>
              ) : (
                <Button fullWidth component={RouterLink} to={item.path}>
                  {item.label}
                </Button>
              )}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bow Course Registration
        </Typography>
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box>
            {navItems.map((item) => (
              item.action ? (
                <Button key={item.label} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              ) : (
                <Button key={item.label} color="inherit" component={RouterLink} to={item.path}>
                  {item.label}
                </Button>
              )
            ))}
          </Box>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
