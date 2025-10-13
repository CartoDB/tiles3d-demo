import {RasterTileLayer, rasterSource, colorBins} from '@deck.gl/carto';
import {DataFilterExtension, _TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';
import {TEMPERATURE_COLOR_SCALE} from './colorScales';
import {FADE_IN_COLOR} from './transitions';
import {cartoCredentials} from '../credentials';

const {colors, values} = TEMPERATURE_COLOR_SCALE;

const dataSource = rasterSource({
  accessToken: cartoCredentials.accessToken,
  apiBaseUrl: cartoCredentials.apiBaseUrl,
  connectionName: '3dtiles-demo',
  tableName: 'cartobq.public_account.temperature_raster_int8_new'
});

export const TemperatureLayer = new RasterTileLayer({
  id: 'temperature',
  data: dataSource,
  getFillColor: colorBins({
    attr: 'band_1',
    domain: values,
    colors: colors.map(colorToRGBArray)
  }),

  opacity: 0.5,
  transitions: FADE_IN_COLOR,
  extensions: [new DataFilterExtension({filterSize: 1}), new TerrainExtension()],
  getFilterValue: f => f.properties.band_1,
  filterRange: [0, 100]
});
