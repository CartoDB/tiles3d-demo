import {CartoLayer, colorBins, MAP_TYPES, setDefaultCredentials} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';

const credentials = {
  accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRVNGNZTHAwaThjYnVMNkd0LTE0diJ9.eyJodHRwOi8vYXBwLmNhcnRvLmNvbS9lbWFpbCI6ImZwYWxtZXJAY2FydG9kYi5jb20iLCJodHRwOi8vYXBwLmNhcnRvLmNvbS9hY2NvdW50X2lkIjoiYWNfN3hoZnd5bWwiLCJpc3MiOiJodHRwczovL2F1dGguY2FydG8uY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA3OTY5NjU1OTI5NjExMjIxNDg2IiwiYXVkIjoiY2FydG8tY2xvdWQtbmF0aXZlLWFwaSIsImlhdCI6MTY4MTkwNzkwOSwiZXhwIjoxNjgxOTk0MzA5LCJhenAiOiJBdHh2SERldVhsUjhYUGZGMm5qMlV2MkkyOXB2bUN4dSIsInBlcm1pc3Npb25zIjpbImV4ZWN1dGU6d29ya2Zsb3dzIiwicmVhZDphY2NvdW50IiwicmVhZDphcHBzIiwicmVhZDpjb25uZWN0aW9ucyIsInJlYWQ6Y3VycmVudF91c2VyIiwicmVhZDppbXBvcnRzIiwicmVhZDpsaXN0ZWRfYXBwcyIsInJlYWQ6bWFwcyIsInJlYWQ6dGlsZXNldHMiLCJyZWFkOnRva2VucyIsInJlYWQ6d29ya2Zsb3dzIiwidXBkYXRlOmN1cnJlbnRfdXNlciIsIndyaXRlOmFwcHMiLCJ3cml0ZTpjYXJ0by1kdy1ncmFudHMiLCJ3cml0ZTpjb25uZWN0aW9ucyIsIndyaXRlOmltcG9ydHMiLCJ3cml0ZTptYXBzIiwid3JpdGU6dG9rZW5zIiwid3JpdGU6d29ya2Zsb3dzIl19.gMia8tLmHTCOg7HHSUZxlfPy_xa9Nm80A5m7Fv3kCt14RGSuuIFum4T3VUc8Hq2M9d-iHkvX-xrYaG88XEJgxWEcjWWk3ryHxxCne0v9imED_GBN5aGY1THiAO-T9NscbYR8_XQdv4-i2HorIb-X2zAinZTBjid48GYPo3RPunVlOoIkT1wHxSpnpF-jxUUs0keEfJUEzNiB8B72CAAHYYjELFi45yP_r5wo-XVILeXV9giu50kKuGdN0cO74z4t0ORPXt9JPkDzfGZCvUxbOF0C9IeXhW1DzN80RDlLbrzQPlY22oIrY0RedGxDq-C7Sc8M0bxc5w-heMghzfBW4A'
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
