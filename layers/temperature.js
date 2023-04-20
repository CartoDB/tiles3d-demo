import {CartoLayer, colorBins, MAP_TYPES, setDefaultCredentials} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';

const credentials = {
  accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRVNGNZTHAwaThjYnVMNkd0LTE0diJ9.eyJodHRwOi8vYXBwLmNhcnRvLmNvbS9lbWFpbCI6ImZwYWxtZXJAY2FydG9kYi5jb20iLCJodHRwOi8vYXBwLmNhcnRvLmNvbS9hY2NvdW50X2lkIjoiYWNfN3hoZnd5bWwiLCJpc3MiOiJodHRwczovL2F1dGguY2FydG8uY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA3OTY5NjU1OTI5NjExMjIxNDg2IiwiYXVkIjpbImNhcnRvLWNsb3VkLW5hdGl2ZS1hcGkiLCJodHRwczovL2NhcnRvLXByb2R1Y3Rpb24udXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4MTk5NTI4OCwiZXhwIjoxNjgyMDgxNjg4LCJhenAiOiJqQ1duSEs2RTJLMmFPeTlqTHkzTzdaTXBocUdPOUJQTCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIgdXBkYXRlOmN1cnJlbnRfdXNlciByZWFkOmNvbm5lY3Rpb25zIHdyaXRlOmNvbm5lY3Rpb25zIHJlYWQ6bWFwcyB3cml0ZTptYXBzIHJlYWQ6YWNjb3VudCIsInBlcm1pc3Npb25zIjpbImV4ZWN1dGU6d29ya2Zsb3dzIiwicmVhZDphY2NvdW50IiwicmVhZDphcHBzIiwicmVhZDpjb25uZWN0aW9ucyIsInJlYWQ6Y3VycmVudF91c2VyIiwicmVhZDppbXBvcnRzIiwicmVhZDpsaXN0ZWRfYXBwcyIsInJlYWQ6bWFwcyIsInJlYWQ6dGlsZXNldHMiLCJyZWFkOnRva2VucyIsInJlYWQ6d29ya2Zsb3dzIiwidXBkYXRlOmN1cnJlbnRfdXNlciIsIndyaXRlOmFwcHMiLCJ3cml0ZTpjYXJ0by1kdy1ncmFudHMiLCJ3cml0ZTpjb25uZWN0aW9ucyIsIndyaXRlOmltcG9ydHMiLCJ3cml0ZTptYXBzIiwid3JpdGU6dG9rZW5zIiwid3JpdGU6d29ya2Zsb3dzIl19.XqI6X_6KYTuRtMUXlznjnf1RL4zQFWWjhyP_hzVc10awbqpNKliUTqf4_LnOKEvtFyRAau4-scSWvkYmy5rQBFCWZuhqFVznGkAzkLca_4mwAAtif16-DGiamVvarGk7-o7q_GOQAOc88G8nM7eOQ_p7RfagedBoFcpIg-R0vr5F8fUzJWTvr3Jnn7BbX4gwLzdoPzWs2G_Ym33k1AU4i2weRZXY8YVBRc3r0dPmJQDnB5WU2mhJ4h56k93PP6ey8AxQuuSOMgM3irQ8k_TLpi5tLzR2WVGuQpPeFnd0tF_PjgU7q8y0oETATqRWer7uNRGJ2J6Gl63nDl1Fnzx_QQ'
};

const colors = ['#0d0887', '#41049d', '#6a00a8', '#8f0da4', '#b12a90', '#cc4778', '#e16462', '#f2844b', '#fca636', '#fcce25', '#f0f921'];
const colorScale = {}
colors.forEach((c, i) => {
  colorScale[17 + 2 * i] = colorToRGBArray(c) // Range 17-34
});

const _TemperatureLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'temperature',
    connection: 'bigquery',
    type: MAP_TYPES.RASTER,
    data: 'cartobq.public_account.temperature_raster',
    credentials,
    formatTiles: 'binary',
    tileSize: 256,
    getFillColor: colorBins({
      attr: 'band_1',
      domain: Object.keys(colorScale),
      colors: Object.values(colorScale)
    }),
    opacity: 0.5,

    extensions: [new TerrainExtension()],
  });
});

export const TemperatureLayer = new _TemperatureLayer({
  id: 'temperature',
});
export const COLOR_SCALE = colorScale;
