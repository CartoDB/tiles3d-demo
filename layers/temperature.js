import {CartoLayer, colorBins, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {colorToRGBArray} from '../utils';

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
    data: 'cartobq.public_account.temperature_raster_int16',
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
