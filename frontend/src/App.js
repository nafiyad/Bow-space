import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './AppRoutes';
import './App.css';

// Create a theme instance.
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
