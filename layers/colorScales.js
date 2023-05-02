export const TEMPERATURE_COLOR_SCALE = {
  labels: [26, 28, 30, 32, 34, 36],
  colors: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921']
}

export const DISTANCE_COLOR_SCALE = {
  labels: [10, 50, 100, 250, 500].map(n => `${n}m`),
  colors: ['#FEEBE2', '#FCC5C0', '#FA9FB5', '#F768A1', '#C51B8A']
}

export const PRIORITY_COLOR_SCALE = {
  labels: ['medium', '', 'high'],
  colors: ['#ffffb2', '#fecc5c', '#fd8d3c']
}
