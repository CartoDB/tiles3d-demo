import {Tile3DLayer} from '@deck.gl/geo-layers';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const TILES3D_SERVER = 'https://www.googleapis.com';

// const ROOT_TILE = 'rootTileset'; // World
const ROOT_TILE = 'CggzMDYwNDE2MxIFZWFydGgYsQciBmdyb3VuZDoFZ2VvaWRABg'; // Prague

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('172.20.10.5');

const TILESET= `${useLocalCache ? '' : TILES3D_SERVER}/tile/v1/tiles3d/tilesets/${ROOT_TILE}.json?key=${API_KEY}`;

// Patches which are required to workaround issues in loaders.gl
function patchTileset(tileset3d) {
  // Required until https://github.com/visgl/loaders.gl/pull/2252 resolved
  tileset3d._queryParams = {key: API_KEY};

  // PATCH as loaders.gl doesn't correctly calculate tile byte size
  const _addTileToCache = tileset3d._addTileToCache;
  tileset3d._addTileToCache = tile => {
    if (tile.content.gltf) {
      let {images, bufferViews} = tile.content.gltf;
      images = images || [];
      bufferViews = bufferViews || [];
      const imageBufferViews = images.map(i => i.bufferView);
      const pre = bufferViews.length;
      bufferViews = bufferViews.filter(view => !imageBufferViews.includes(view));

      let gpuMemory = bufferViews.reduce((acc, view) => acc + view.byteLength, 0);
      let textureMemory = images.reduce((acc, image) => {
        const {width, height} = image.image;
        return acc + 4 * width * height;
        }, 0);
        tile.content.byteLength = gpuMemory + textureMemory;
      }
      tileset3d._cache.add(tileset3d, tile, (tileset) => tileset._updateCacheStats(tile));
    }
}

// Use create function as layer needs to report back credits
export function createGoogle3DLayer(isDesktop, setCredits) {
  return new Tile3DLayer({
    id: 'google-3d',
    data: TILESET,
    onTilesetLoad: tileset3d => {
      patchTileset(tileset3d);

      // Adapt the geometry resolution on mobile
      tileset3d.options.maximumScreenSpaceError = isDesktop ? 16 : 40;

      tileset3d.options.onTraversalComplete = selectedTiles => {
        // Do not show tiles which are many layers too low in resolution (avoids artifacts)
        let maxDepth = 0;
        for (const {depth} of selectedTiles) {
          if(depth > maxDepth) maxDepth = depth;
        }
        const filtered = selectedTiles.filter(t => t.depth > maxDepth - 4);

        // Show data credit
        const credits = new Set();
        filtered.forEach(tile => tile.content.gltf.asset.copyright.split(';').forEach(credits.add, credits));
        setCredits([...credits].join('; '));

        return filtered;
      }
    },
    operation: 'terrain+draw'
  });
}
