import {CartoLayer, colorBins, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';

const colors = ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'];
const labels = [26, 28, 30, 32, 34, 36];
const colorScale = {}
colors.forEach((c, i) => {
  colorScale[labels[i]] = colorToRGBArray(c);
});

const _TemperatureLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
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
});

export const TemperatureLayer = new _TemperatureLayer({
  id: 'temperature',
});
export const COLOR_SCALE = {colors, labels};
