import {fetchMap} from '@deck.gl/carto';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';

const cartoMapId = '60f339dd-450b-4c54-a402-41eb2d7a06af';
export async function fetchRemoteLayers() {
  const {layers} = await fetchMap({cartoMapId});
  if(location.host.includes('localhost')) {
    console.log(layers.map(l => `${l.props.cartoLabel}: ${l.props.id}`).join('\n'));
  }
  return layers.map(l => {
    return l.clone({
      extensions: [new TerrainExtension()],
      stroked: false
    });
  });
}
