import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './components/Main/Main';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';
import {setDefaultCredentials} from '@deck.gl/carto';

const theme = createTheme();

const credentials = {
  accessToken: 'YOUR_CARTO_ACCESS_TOKEN'
}

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');
if (useLocalCache) {
  credentials.apiBaseUrl = '/carto-api/';
}

setDefaultCredentials(credentials);

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
