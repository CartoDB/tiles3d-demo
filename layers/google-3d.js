import {Tile3DLayer} from '@deck.gl/geo-layers';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const TILES3D_SERVER = 'https://tile.googleapis.com';

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');
// const useLocalCache = false

const TILESET = `${useLocalCache ? '' : TILES3D_SERVER}/v1/3dtiles/root.json`;

// Patches which are required to workaround issues in loaders.gl
function patchTileset(tileset3d) {

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

const sseOverride = parseFloat((new URL(location.href)).searchParams.get('sse'));

// Use create function as layer needs to report back credits
export function createGoogle3DLayer(isDesktop, setCredits) {
  return new Tile3DLayer({
    id: 'google-3d',
    data: TILESET,
    loadOptions: {
      fetch: {
        headers: {
          'X-GOOG-API-KEY': API_KEY
        }
      }
    },
    onTilesetLoad: tileset3d => {
      patchTileset(tileset3d);

      // Adapt the geometry resolution on mobile
      tileset3d.options.maximumScreenSpaceError = isDesktop ? 16 : 40;
      if (!isNaN(sseOverride)) {
        tileset3d.options.maximumScreenSpaceError = sseOverride;
      }

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
