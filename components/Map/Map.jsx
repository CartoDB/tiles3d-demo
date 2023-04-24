import React from 'react';
import {makeStyles, useMediaQuery} from '@material-ui/core';
import {DeckGL} from '@deck.gl/react';

import {useAppState} from '../../state';
import {SIDEBAR_WIDTH} from '../Sidebar/Sidebar';
import CoverLogo from '../Cover/CoverLogo';

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

const Map = () => {
  const classes = useStyles();
  const {currentSlide, layers, viewState} = useAppState();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  // Retina rendering very expensive on mobile, so limit resolution
  const useDevicePixels = isNaN(useDevicePixelsOverride) ? (isDesktop ? true : 0.5) : useDevicePixelsOverride;

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
            controller={true}
            layers={layers}
            useDevicePixels={useDevicePixels}
          >
          </DeckGL>
        </div>
      </div>
      <CoverLogo />
      <div
        className={[classes.mapBlock, currentSlide > 0 ? classes.mapBlockHidden : ''].join(' ')}
      />
    </>
  );
};

export default Map;
