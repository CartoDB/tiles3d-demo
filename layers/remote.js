import {fetchMap} from '@deck.gl/carto';
import {DataFilterExtension, _TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {FADE_IN_COLOR} from './transitions';

const cartoMapId = '60f339dd-450b-4c54-a402-41eb2d7a06af';
// const cartoMapId = '87ded938-6337-45b6-8de1-4c2813e3d9c6';
export async function fetchRemoteLayers() {
  const {layers} = await fetchMap({cartoMapId});
  if(location.host.includes('127.0.0.1')) {
    console.log(layers.map(l => `${l.constructor.layerName} ${l.props.cartoLabel}: ${l.props.id}`).join('\n'));
  }
  return layers.map(l => {
    const props = {
      //extensions: [new TerrainExtension()],
      extensions: [],
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

      props.autoHighlight = true;
      props.pickable = true;
      props.extruded = true;

      props.elevationScale = 1;
      props.uniqueIdProperty = 'id';

      // Adjust data to have 3D offset. This doesn't work with picking
      // for some reason. So instead keep zOffset as 0 but increase elevation
      // to 300
      const zOffset = 0;
      props.getElevation = 300;
      props.dataTransform = d => {
        d.polygons.properties.forEach((p, i) => p.id = i);
     
        const {positions} = d.polygons;
        const {value, size} = positions;
        const n = value.length / size;
        const newValue = new Float32Array(3 * n);
        for (let i = 0; i < n; i++) {
          newValue[3 * i + 0] = value[size * i + 0];
          newValue[3 * i + 1] = value[size * i + 1];
          newValue[3 * i + 2] = zOffset;
        }

        positions.value = newValue;
        positions.size = 3;
        return d;
      }
    }
    return l.clone(props);
  });
}
