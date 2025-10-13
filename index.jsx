import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './components/Main/Main';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';
// Import cartoCredentials from separate file to avoid circular dependencies
import './credentials';

// Suppress specific console warnings in production
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out Material-UI findDOMNode deprecation warning
  if (args[0]?.includes?.('findDOMNode is deprecated')) {
    return;
  }
  // Filter out other known warnings we can't fix
  if (args[0]?.includes?.('Failed to fetch resource')) {
    return;
  }
  originalWarn(...args);
};

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppStateStore>
        <CssBaseline />
        <Main />
      </AppStateStore>
    </ThemeProvider>
  );
};
const container = document.getElementById('app');
createRoot(container).render(<App />);
