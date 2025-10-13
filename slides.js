import {TRAFFIC_SPEED_SCALE, SAFETY_SCALE, FUNDING_SCALE} from './layers/colorScales';

export default [
  /* 0 - COVER */ {
    layers: ['google-3d', 'congestion-zone'],
    view: {latitude: 40.758, longitude: -73.980, bearing: 0, pitch: 50, zoom: 13.5, height: 600},
    orbit: true
  },
  /* 1 - The Challenge */ {
    layers: ['google-3d', 'congestion-zone', 'traffic-before'],
    view: {latitude: 40.750, longitude: -73.985, bearing: -30, pitch: 55, zoom: 14.5, height: 300},
    legend: {title: 'Traffic Speed (Before)', ...TRAFFIC_SPEED_SCALE}
  },
  /* 2 - Traffic Reduction */ {
    layers: ['google-3d', 'congestion-zone', 'traffic-after'],
    view: {latitude: 40.727, longitude: -74.012, bearing: 45, pitch: 60, zoom: 15, height: 250},
    legend: {title: 'Traffic Speed (After)', ...TRAFFIC_SPEED_SCALE}
  },
  /* 3 - Regional Impact */ {
    layers: ['google-3d', 'regional-improvement'],
    view: {latitude: 40.758, longitude: -73.965, bearing: 0, pitch: 40, zoom: 11.5, height: 800},
    legend: {title: 'Speed Improvement', ...TRAFFIC_SPEED_SCALE}
  },
  /* 4 - Safety */ {
    layers: ['google-3d', 'congestion-zone', 'crashes'],
    view: {latitude: 40.755, longitude: -73.988, bearing: 20, pitch: 65, zoom: 15.5, height: 200},
    legend: {title: 'Crash Locations', ...SAFETY_SCALE}
  },
  /* 5 - Transit Funding */ {
    layers: ['google-3d', 'transit-projects'],
    view: {latitude: 40.753, longitude: -73.977, bearing: -10, pitch: 50, zoom: 14, height: 400},
    legend: {title: 'Transit Projects', ...FUNDING_SCALE},
    orbit: true
  }
];
