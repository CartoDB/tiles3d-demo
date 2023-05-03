import {Tile3DLayer} from '@deck.gl/geo-layers';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const TILES3D_SERVER = 'https://www.googleapis.com';

// const ROOT_TILE = 'rootTileset'; // World
const ROOT_TILE = 'CggzMDYwNDE2MxIFZWFydGgYsQciBmdyb3VuZDoFZ2VvaWRABg'; // Prague

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('172.20.10.5');

export const TILESET= `${useLocalCache ? '' : TILES3D_SERVER}/tile/v1/tiles3d/tilesets/${ROOT_TILE}.json?key=${API_KEY}`;

export function patchTileset(tileset3d) {
  // Required until https://github.com/visgl/loaders.gl/pull/2252 resolved
  tileset3d._queryParams = {key: API_KEY};

  tileset3d.options.maximumScreenSpaceError = 40;

  // PATCH as loaders.gl doesn't correctly calculate tile byte size
  const _addTileToCache = tileset3d._addTileToCache;
  const stats = document.getElementById('stats2');
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
      stats.innerHTML = `Tileset3D: ${Math.round(tileset3d.gpuMemoryUsageInBytes / (1024*1024))}MB`;
    }
}

export const Google3DLayer = new Tile3DLayer({
  id: 'google-3d',
  data: TILESET,
  onTilesetLoad: tileset3d => {
    patchTileset(tileset3d);
  },
  operation: 'terrain+draw'
});
