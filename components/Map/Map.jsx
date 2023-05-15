import React from 'react';
import {makeStyles, useMediaQuery, useTheme} from '@material-ui/core';
import {DeckGL} from '@deck.gl/react';

import {useAppState} from '../../state';
import {SIDEBAR_WIDTH} from '../Sidebar/Sidebar';
import CoverLogo from '../Cover/CoverLogo';
import CoverAttribution from '../Cover/CoverAttribution';

const SCORES = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

const LABELS = [
  'This group has a moderate level of urbanity and is characterized by a relatively small population of children under 15 years old, a small population of individuals over 65 years old, and a greater distance to the nearest area of dense vegetation. The group has a moderate number of buildings with an average building area. The land surface temperature is slightly lower than the total mean. The nitrogen dioxide concentration is significantly lower than the total mean. The group has a high priority for planting trees based on the Tree Planting Priority Score.',
  'This group has a high level of urbanization, with a majority of the population being middle-aged or older. There is a low percentage of children under the age of 15. The group is located far from areas with dense vegetation and is surrounded by buildings, many of which are comparatively small. The average building size is also relatively small. The temperature and nitrogen dioxide concentration are moderate. The group has a moderately high priority for planting trees, indicating that trees could provide significant benefits for the residents.',
  'This group has a relatively high urbanity level, with a large proportion of the population being above the age of 65 and a slightly below average population of children under the age of 15. The distance to the nearest area of dense vegetation is lower than the overall population mean, indicating that this area may benefit from more trees. The number of buildings is lower than the total mean, while the average buildings area is also lower than the total mean, suggesting a more compact living arrangement. Land surface temperature and nitrogen dioxide concentration are somewhat lower than the total mean. The Tree Planting Priority Score for this group is higher than the overall population mean, indicating a higher priority for planting trees.',
  'This group has a high urbanity level and is located in a dense urban area. The population of this area has a significant number of young and elderly individuals, indicating a need for sustainable and healthy planning. The group has a moderate distance to the nearest area of dense vegetation, which could potentially be improved with tree planting. The number of buildings and their area are high, indicating an opportunity for green infrastructure. The Land Surface Temperature and the Nitrogen Dioxide concentration are slightly above the average, which may have negative impacts on the health and well-being of the population. The group has a high Tree Planting Priority Score, which suggests it should be a priority area for planting trees.',
  'This group has a high level of urbanity and a large population with significant proportions of individuals both under 15 and over 65. The average distance to the nearest tree area is relatively high, suggesting that there may be a lack of green spaces in the area. The number and size of buildings in the area are also relatively high. The Land Surface Temperature and Nitrogen Dioxide concentration values are also higher than average. However, the group has a high priority for planting trees, as reflected by its high Tree Planting Priority Score. This is likely due to its high exposure score, which is a reflection of the potential benefits that tree planting could provide to the urban environment and the vulnerability of its population.'
];

const useStyles = makeStyles((theme) => ({
  mapWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#061714'
  },
  root: {
    position: 'relative',
    height: '100%',
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'background-image'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  rootShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginBottom: theme.spacing(15),
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      height: '100%',
      marginRight: `${SIDEBAR_WIDTH.xs}`,
      [theme.breakpoints.up('lg')]: {
        marginRight: `${SIDEBAR_WIDTH.lg}`
      }
    }
  },
  rootBlocked: {
    pointerEvents: 'none'
  },
  mapBlock: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundImage:
      'linear-gradient(to bottom, rgba(15, 17, 20, 0.84), rgba(15, 17, 20, 0.8) 65%, rgba(15, 17, 20, 0.2))',
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  mapBlockHidden: {
    opacity: 0,
    pointerEvents: 'none'
  }
}));

const useDevicePixelsOverride = parseFloat((new URL(location.href)).searchParams.get('useDevicePixels'));
let currentViewState;

const LONGITUDE_RANGE = [14.3, 14.55];
const LATITUDE_RANGE = [50, 50.15];

const Map = () => {
  const classes = useStyles();
  const {currentSlide, layers, viewState, setHoveredFeatureId} = useAppState();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const theme = useTheme();

  // Retina rendering very expensive on mobile, so limit resolution
  const useDevicePixels = isNaN(useDevicePixelsOverride) ? (isDesktop ? true : 0.75) : useDevicePixelsOverride;

  return (
    <>
      <div
        className={[classes.root, currentSlide > 0 ? classes.rootShift : classes.rootBlocked].join(
          ' '
        )}
        id="map"
      >
        <div className={classes.mapWrapper} id="mapWrapper">
          <DeckGL 
            initialViewState={viewState}
            controller={{touchRotate: true, minZoom: 12, maxZoom: 17, inertia: 250}}
            layers={layers}
            onViewStateChange={({viewState}) => {
              viewState.longitude = Math.min(LONGITUDE_RANGE[1], Math.max(LONGITUDE_RANGE[0], viewState.longitude));
              viewState.latitude = Math.min(LATITUDE_RANGE[1], Math.max(LATITUDE_RANGE[0], viewState.latitude));
              currentViewState = viewState;
              return viewState;
            }}
            useDevicePixels={useDevicePixels}
            getTooltip={({object}) => {
              setHoveredFeatureId(object && object.properties.id);
              if (!object) return;
              const {tpp} = object.properties;
              const i = Math.floor(tpp * 5);
              return {
                html: `<h3>Tree Planting Priority: ${SCORES[i]}</h3><div>${LABELS[i]}</div>`,
                style: {borderRadius: '10px', backgroundColor: theme.palette.common.black, fontSize: '0.8em', width: '400px'}
              }
            }}
            layerFilter={({layer, renderPass}) => {
              if (layer.id === 'lvm6ojq-hover' && renderPass === 'screen') {
                return false;
              }
              return true;
            }}
          >
          </DeckGL>
        </div>
      </div>
      <CoverLogo />
      <div
        className={[classes.mapBlock, currentSlide > 0 ? classes.mapBlockHidden : ''].join(' ')}
      />
      <CoverAttribution />
    </>
  );
};

export default Map;

// Helper to extract view states for slides.js
window.print = () => {
  const {latitude, longitude, bearing, pitch, zoom, position} = currentViewState;
  const height = position[2];
  console.log(JSON.stringify({latitude, longitude, bearing, pitch, zoom, height}).replaceAll('"', '').replaceAll(',', ', ').replaceAll(':', ': '));
};
