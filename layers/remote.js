import {fetchMap} from '@deck.gl/carto';
import {DataFilterExtension, _TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {FADE_IN_COLOR} from './transitions';

const cartoMapId = '60f339dd-450b-4c54-a402-41eb2d7a06af';
export async function fetchRemoteLayers() {
  const {layers} = await fetchMap({cartoMapId});
  if(location.host.includes('127.0.0.1')) {
    console.log(layers.map(l => `${l.constructor.layerName} ${l.props.cartoLabel}: ${l.props.id}`).join('\n'));
  }
  return layers.map(l => {
    const props = {
      extensions: [new TerrainExtension()],
      transitions: FADE_IN_COLOR
    }
    if (['ft3t0pi', 'wlixswr'].includes(l.id)) {
      props.extensions.push(new DataFilterExtension({filterSize: 1}));
      if (l.id === 'ft3t0pi') {
        props.getFilterValue = f => f.properties.distance_to_nearest_tree;
      } else {
        props.getFilterValue = f => f.properties.tpp;
      }
      props.filterRange = [0, 10000];
    }
    return l.clone(props);
  });
}
