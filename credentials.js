// CARTO credentials
export const cartoCredentials = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfbHFlM3p3Z3UiLCJqdGkiOiJiMTAyZjgzYyJ9.R2P-6K41Sr3O8lRnJ14I4y9UDfR6xaQPWVpL383lXcE',
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com'
};

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');
if (useLocalCache) {
  cartoCredentials.apiBaseUrl = `${location.protocol}//${location.host}/carto-api`;
}