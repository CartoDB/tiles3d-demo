import {GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';
import {FADE_IN_COLOR} from './transitions';

// Congestion Zone Boundary (60th Street)
const congestionZoneData = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-74.02, 40.699], // Battery Park
        [-74.02, 40.764], // 60th St West
        [-73.958, 40.764], // 60th St East
        [-73.958, 40.699], // East River South
        [-74.02, 40.699]
      ]]
    },
    properties: {name: 'Congestion Pricing Zone'}
  }]
};

export const CongestionZoneLayer = new GeoJsonLayer({
  id: 'congestion-zone',
  data: congestionZoneData,
  stroked: true,
  filled: false,
  lineWidthMinPixels: 3,
  getLineColor: [0, 128, 255, 255],
  getLineWidth: 5,
  transitions: FADE_IN_COLOR
});

// Traffic Speed - Before (Hexagon grid showing congestion)
const generateTrafficGrid = (isBefore = true) => {
  const features = [];
  // Generate a grid of hexagons across Manhattan
  for (let lat = 40.70; lat < 40.78; lat += 0.005) {
    for (let lon = -74.01; lon < -73.96; lon += 0.005) {
      const speed = isBefore
        ? Math.random() * 10 + 2  // 2-12 mph (slow)
        : Math.random() * 15 + 10; // 10-25 mph (faster)

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        properties: { speed }
      });
    }
  }
  return { type: 'FeatureCollection', features };
};

export const TrafficBeforeLayer = new ScatterplotLayer({
  id: 'traffic-before',
  data: generateTrafficGrid(true),
  getPosition: d => d.geometry.coordinates,
  getRadius: 80,
  getFillColor: d => {
    const speed = d.properties.speed;
    if (speed < 5) return [139, 0, 0, 180];      // Dark red
    if (speed < 10) return [255, 69, 0, 180];    // Orange-red
    if (speed < 15) return [255, 165, 0, 180];   // Orange
    return [255, 255, 0, 180];                    // Yellow
  },
  transitions: FADE_IN_COLOR
});

export const TrafficAfterLayer = new ScatterplotLayer({
  id: 'traffic-after',
  data: generateTrafficGrid(false),
  getPosition: d => d.geometry.coordinates,
  getRadius: 80,
  getFillColor: d => {
    const speed = d.properties.speed;
    if (speed < 10) return [255, 165, 0, 180];   // Orange
    if (speed < 15) return [255, 255, 0, 180];   // Yellow
    if (speed < 20) return [173, 255, 47, 180];  // Yellow-green
    return [0, 128, 0, 180];                      // Green
  },
  transitions: FADE_IN_COLOR
});

// Regional Improvement (wider area)
const generateRegionalData = () => {
  const features = [];
  for (let lat = 40.65; lat < 40.85; lat += 0.01) {
    for (let lon = -74.05; lon < -73.90; lon += 0.01) {
      const distance = Math.sqrt(
        Math.pow((lat - 40.745) * 111, 2) +
        Math.pow((lon + 73.98) * 85, 2)
      );
      const improvement = Math.max(0, 25 - distance); // 0-25% improvement

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        properties: { improvement }
      });
    }
  }
  return { type: 'FeatureCollection', features };
};

export const RegionalImprovementLayer = new ScatterplotLayer({
  id: 'regional-improvement',
  data: generateRegionalData(),
  getPosition: d => d.geometry.coordinates,
  getRadius: 200,
  getFillColor: d => {
    const imp = d.properties.improvement;
    if (imp < 5) return [255, 255, 0, 100];      // Yellow
    if (imp < 10) return [173, 255, 47, 120];    // Yellow-green
    if (imp < 15) return [0, 200, 0, 140];       // Green
    return [0, 128, 0, 160];                      // Dark green
  },
  transitions: FADE_IN_COLOR
});

// Crash locations (scattered points)
const generateCrashData = () => {
  const features = [];
  // Generate ~100 random crash locations in Manhattan
  for (let i = 0; i < 100; i++) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -74.01 + Math.random() * 0.05,
          40.70 + Math.random() * 0.08
        ]
      },
      properties: {
        severity: Math.floor(Math.random() * 3) // 0=minor, 1=injury, 2=fatal
      }
    });
  }
  return { type: 'FeatureCollection', features };
};

export const CrashesLayer = new ScatterplotLayer({
  id: 'crashes',
  data: generateCrashData(),
  getPosition: d => d.geometry.coordinates,
  getRadius: 50,
  getFillColor: d => {
    const sev = d.properties.severity;
    if (sev === 0) return [255, 255, 0, 180];    // Yellow - minor
    if (sev === 1) return [255, 165, 0, 200];    // Orange - injury
    return [139, 0, 0, 220];                      // Dark red - fatal
  },
  transitions: FADE_IN_COLOR
});

// Transit project locations
const transitProjectsData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-73.978, 40.769] }, // Second Ave & 96th
      properties: { name: 'Second Ave Subway Phase 2', cost: 500 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-73.991, 40.750] }, // Penn Station
      properties: { name: 'Penn Station Expansion', cost: 300 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-73.935, 40.743] }, // Queens
      properties: { name: 'Metro-North Penn Access', cost: 250 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-73.956, 40.773] }, // East Harlem
      properties: { name: 'Accessibility Upgrades', cost: 150 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-74.005, 40.739] }, // Chelsea
      properties: { name: 'Signal Modernization', cost: 200 }
    }
  ]
};

export const TransitProjectsLayer = new ScatterplotLayer({
  id: 'transit-projects',
  data: transitProjectsData,
  getPosition: d => d.geometry.coordinates,
  getRadius: d => d.properties.cost * 0.5, // Scale by cost
  getFillColor: [255, 215, 0, 200], // Gold
  getLineColor: [255, 140, 0, 255], // Dark orange border
  lineWidthMinPixels: 2,
  stroked: true,
  transitions: FADE_IN_COLOR
});
