import {useMediaQuery} from '@material-ui/core';
import React, {useState, createContext, useCallback, useContext, useEffect} from 'react';
import {LinearInterpolator} from '@deck.gl/core';
import FlyToInterpolator from './layers/fly-to-interpolator.js';
import {Easing} from '@tweenjs/tween.js';

import slides from './slides';
import {Google3DLayer} from './layers/google-3d';
import {TemperatureLayer} from './layers/temperature';
import {fetchRemoteLayers} from './layers/remote';

const hash = window.location.hash;

const {view} = slides[0];
const initAppState = {
  currentSlide: hash !== '' ? parseInt(hash.slice(1)) : 0,
  viewState: {...view, position: [0, 0, view.height], zoom: view.zoom - 1}
};

const LIMITED_EXTENT = [14.405979516991408, 50.10852124677322, 14.434648995339757, 50.09474325626903];
const transitionInterpolator = new LinearInterpolator(['bearing', 'longitude', 'latitude']);
export const AppStateContext = createContext(initAppState);

let map;
const localLayers = [Google3DLayer, TemperatureLayer];

export const AppStateStore = ({children}) => {
  const [currentSlide, setCurrentSlide] = useState(initAppState.currentSlide);
  const [allLayers, setAllLayers] = useState(localLayers);
  const [layers, setLayers] = useState(localLayers);
  const [viewState, setViewState] = useState(initAppState.viewState);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  // Adapt the geometry resolution on mobile
  const google3DLayer = layers.find(l => l.id === 'google-3d');
  if(google3DLayer && google3DLayer.state) {
    google3DLayer.state.tileset3d.options.maximumScreenSpaceError = isDesktop ? 16 : 40;
  }

  const orbit = useCallback(previousTransition => {
    setViewState((viewState) => ({
      ...viewState,
      bearing: viewState.bearing + 120,
      transitionDuration: previousTransition ? 20000 : 25000, // TODO should match gradients with easing
      transitionEasing: previousTransition ? x => x : Easing.Quadratic.In,
      transitionInterpolator,
      onTransitionEnd: orbit
    }));
  }, []);

  const updateViewState = function (viewState, shouldOrbit) {
    setViewState({
      transitionDuration: 5000,
      ...viewState,
      transitionEasing: Easing.Quadratic.InOut,
      transitionInterpolator: new FlyToInterpolator({curve: 1.1}),
      onTransitionEnd: () => {
        if (shouldOrbit) {
          orbit();
        }
      }
    });
  };

  useEffect(() => {
    const layers = fetchRemoteLayers().then(remoteLayers => { ;
      setAllLayers(localLayers.concat(remoteLayers));
    })
  }, []);

  useEffect(
    () => {
      if (currentSlide !== null && !isNaN(currentSlide)) {
        const {layers: visibleLayers, view, orbit: shouldOrbit} = slides[currentSlide];
        setLayers(allLayers.map(l => {
          const visible = visibleLayers.indexOf(l.id) !== -1;
          const props = {visible};
          if(!isDesktop) {
            // Limit data area on mobile - doesn't seem to work for MVT :(
            props.extent = LIMITED_EXTENT;
            props.minZoom = 11;
            props.maxZoom = 11;
          }

          return visible ? l.clone(props) : null;
        }));
        if (view && view.longitude !== undefined) {
          updateViewState({latitude: 0, longitude: 0, zoom: 0, bearing: 0, pitch: 0, position: [0, 0, view.height || 200], ...view}, shouldOrbit);

        }
      }
    },
    [currentSlide]
  );

  return (
    <AppStateContext.Provider
      value={{
        focusOnLocation: (lat, lng, tilt, heading, zoom) => {
          lat = lat || 40.72;
          lng = lng || -74;
          tilt = tilt || 0;
          heading = heading || 0;
          zoom = zoom || 15;
        },
        next: () => {
          setCurrentSlide(currentSlide => Math.min(currentSlide + 1, slides.length - 1));
        },
        prev: () => {
          setCurrentSlide(currentSlide => Math.max(currentSlide - 1, 0));
        },
        reset: () => {
          setCurrentSlide(0);
        },
        currentSlide,
        layers,
        viewState,
        slidesNumber: slides.length
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const AppStateContextConsumer = AppStateContext.Consumer;

export function useAppState() {
  return useContext(AppStateContext);
}
