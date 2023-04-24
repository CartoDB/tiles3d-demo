import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './components/Main/Main';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';
import {setDefaultCredentials} from '@deck.gl/carto';

const theme = createTheme();

const credentials = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIwNjhlYzgyMCJ9.2SAyHDttt4s-m2i6HgQuMqxdZIr_bdkIzBHM2zbYwOU'
}

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');
if (useLocalCache) {
  credentials.apiBaseUrl = '/carto-api/';
}

setDefaultCredentials(credentials);

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
