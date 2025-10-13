export const TRAFFIC_SPEED_SCALE = {
  labels: ['0', '5', '10', '15', '20', '25+ mph'],
  values: [0, 5, 10, 15, 20, 25],
  colors: ['#8B0000', '#FF4500', '#FFA500', '#FFFF00', '#ADFF2F', '#008000']
}

export const SAFETY_SCALE = {
  labels: ['0', '10', '25', '50', '100', '200+'],
  values: [0, 10, 25, 50, 100, 200],
  colors: ['#008000', '#ADFF2F', '#FFFF00', '#FFA500', '#FF4500', '#8B0000']
}

export const FUNDING_SCALE = {
  labels: ['$0', '$50M', '$100M', '$250M', '$500M', '$1B+'],
  values: [0, 50, 100, 250, 500, 1000],
  colors: ['#FFF8DC', '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#DC143C']
}

// Legacy exports (used by old temperature layer)
export const TEMPERATURE_COLOR_SCALE = TRAFFIC_SPEED_SCALE;
export const DISTANCE_COLOR_SCALE = SAFETY_SCALE;
export const PRIORITY_COLOR_SCALE = FUNDING_SCALE;
