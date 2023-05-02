import {fetchMap} from '@deck.gl/carto';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {FADE_IN_COLOR} from './transitions';

const cartoMapId = '60f339dd-450b-4c54-a402-41eb2d7a06af';
export async function fetchRemoteLayers() {
  const {layers} = await fetchMap({cartoMapId});
  if(location.host.includes('127.0.0.1')) {
    console.log(layers.map(l => `${l.constructor.layerName} ${l.props.cartoLabel}: ${l.props.id}`).join('\n'));
  }
  return layers.map(l => {
    return l.clone({
      extensions: [new TerrainExtension()],
      stroked: false,
      transitions: FADE_IN_COLOR
    });
  });
}
