import {CartoLayer, colorBins, MAP_TYPES} from '@deck.gl/carto';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';
import {TEMPERATURE_COLOR_SCALE} from './colorScales';

const {colors, labels} = TEMPERATURE_COLOR_SCALE;

export const TemperatureLayer = new CartoLayer({
  id: 'temperature',
  connection: 'bigquery',
  type: MAP_TYPES.RASTER,
  data: 'cartobq.public_account.temperature_raster_int8',
  formatTiles: 'binary',
  tileSize: 256,
  getFillColor: colorBins({
    attr: 'band_1',
    domain: labels,
    colors: colors.map(colorToRGBArray)
  }),
  opacity: 0.5,

  extensions: [new TerrainExtension()],
});
