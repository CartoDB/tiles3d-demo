import {Tile3DLayer} from '@deck.gl/geo-layers';
import DeferredLoadLayer from './deferredLoadLayer';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const TILES3D_SERVER = 'https://www.googleapis.com';

// const ROOT_TILE = 'rootTileset'; // World
const ROOT_TILE = 'CggzMDYwNDE2MxIFZWFydGgYsQciBmdyb3VuZDoFZ2VvaWRABg'; // Prague

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');

const TILESET= `${useLocalCache ? '' : TILES3D_SERVER}/tile/v1/tiles3d/tilesets/${ROOT_TILE}.json?key=${API_KEY}`;

// Preload gltf files
// import TILELIST from './preload-tiles';
// for (const t of TILELIST) {
//   const url = `https://www.googleapis.com/tile/v1/tiles3d/tiles/${t}.gltf?key=${API_KEY}`
//   fetch(url).then(d => { tileIds.add(t); })
// }
// window.tileIds = new Set();

let maximumScreenSpaceError = parseFloat((new URL(location.href)).searchParams.get('sse'));
if(isNaN(maximumScreenSpaceError)) {
  // Lower than default (8) for better performance
  maximumScreenSpaceError = 40;
}

const _Google3DLayer = DeferredLoadLayer(() => {
  return new Tile3DLayer({
    id: 'tile-3d-layer',
    data: TILESET,
    // Uncomment to collect ids of tiles to preload
    // onTileLoad: tile => {
    //   const tileId = tile.contentUrl.split('/')[7].split('.')[0];
    //   tileIds.add(tileId);
    // },
    onTilesetLoad: tileset3d => {
      // Required until https://github.com/visgl/loaders.gl/pull/2252 resolved
      tileset3d._queryParams = {key: API_KEY};
      
      const traverser = tileset3d._traverser;
      tileset3d.options.maximumScreenSpaceError = maximumScreenSpaceError;

      // Do not show tiles which are many layers too low in resolution (avoids artifacts)
      tileset3d.options.onTraversalComplete = selectedTiles => {
        let maxDepth = 0;
        for (const {depth} of selectedTiles) {
          if(depth > maxDepth) maxDepth = depth;
        }
        const filtered = selectedTiles.filter(t => t.depth > maxDepth - 5);
        return filtered;
      }
    },
    operation: 'terrain+draw'
  });
});

export const Google3DLayer = new _Google3DLayer({
  id: 'google-3d'
});
