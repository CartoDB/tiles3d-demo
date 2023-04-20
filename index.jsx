import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './components/Main/Main';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';

const theme = createTheme();

const App = () => {
  return (
    <AppStateStore>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </AppStateStore>
  );
};
const container = document.getElementById('app');
createRoot(container).render(<App />);
