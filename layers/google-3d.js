import {Tile3DLayer} from '@deck.gl/geo-layers';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const TILES3D_SERVER = 'https://tile.googleapis.com';

// For development use local endpoint via vite proxy (see vite.config.js)
const useLocalCache = location.host.includes('127.0.0.1');

const TILESET = `${useLocalCache ? '' : TILES3D_SERVER}/v1/3dtiles/root.json`;

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
      // Adapt the geometry resolution on mobile
      tileset3d.options.maximumScreenSpaceError = isDesktop ? 4 : 40;
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
        selectedTiles.forEach(tile => tile.content.gltf.asset.copyright.split(';').forEach(credits.add, credits));
        setCredits([...credits].join('; '));

        return filtered;
      }
    },
    operation: 'terrain+draw'
  });
}
