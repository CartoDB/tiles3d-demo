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
  credits: '',
  currentSlide: hash !== '' ? parseInt(hash.slice(1)) : 0,
  viewState: {...view, position: [0, 0, view.height], zoom: view.zoom - 1}
};

const LIMITED_EXTENT = [14.42, 50.09, 14.44, 50.12];
const FULL_EXTENT = [14.3, 50, 14.55, 50.15];
const transitionInterpolator = new LinearInterpolator(['bearing', 'longitude', 'latitude']);
export const AppStateContext = createContext(initAppState);

let map;
const localLayers = [Google3DLayer, TemperatureLayer];

export const AppStateStore = ({children}) => {
  const [credits, setCredits] = useState(initAppState.credits);
  const [currentSlide, setCurrentSlide] = useState(initAppState.currentSlide);
  const [filterValue, setFilterValue] = useState(null);
  const [allLayers, setAllLayers] = useState(localLayers);
  const [layers, setLayers] = useState(localLayers);
  const [viewState, setViewState] = useState(initAppState.viewState);
  const [loadRemoteLayers, setLoadRemoteLayers] = useState(false);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  // Adapt the geometry resolution on mobile
  const google3DLayer = layers.find(l => l.id === 'google-3d');

  if(google3DLayer && google3DLayer.state) {
    const {tileset3d} = google3DLayer.state;
    tileset3d.options.maximumScreenSpaceError = isDesktop ? 16 : 40;

    tileset3d.options.onTraversalComplete = selectedTiles => {
      // Do not show tiles which are many layers too low in resolution (avoids artifacts)
      let maxDepth = 0;
      for (const {depth} of selectedTiles) {
        if(depth > maxDepth) maxDepth = depth;
      }
      const filtered = selectedTiles.filter(t => t.depth > maxDepth - 4);

      // Show data credit
      const credits = new Set();
      for (const tile of filtered) {
        const {gltf} = tile.content;
        if (gltf) {
          gltf.asset.copyright.split(';').forEach(credits.add, credits);
        }
      }
      setCredits([...credits].join(';'));

      return filtered;
    }
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
    if(currentSlide) setLoadRemoteLayers(true);
    setViewState({
      transitionDuration: 5000,
      ...viewState,
      transitionEasing: Easing.Quadratic.InOut,
      transitionInterpolator: new FlyToInterpolator({curve: 1.1}),
      onTransitionEnd: () => {
        setLoadRemoteLayers(true);
        if (shouldOrbit) {
          orbit();
        }
      }
    });
  };

  useEffect(() => {
    // Defer load of remote layers until initial zoom in completes
    if (!loadRemoteLayers) return;
    const layers = fetchRemoteLayers().then(remoteLayers => { ;
      setAllLayers(localLayers.concat(remoteLayers));
    })
  }, [loadRemoteLayers]);

  useEffect(
    () => {
      if (currentSlide !== null && !isNaN(currentSlide)) {
        const {layers: visibleLayers, view, orbit: shouldOrbit} = slides[currentSlide];
        setLayers(allLayers.map(l => {
          const visible = visibleLayers.indexOf(l.id) !== -1;
          const props = {visible};

          // Limit to single zoom level to avoid flashing (due to fade in transition)
          // and to limit data use on mobile
          props.minZoom = 15;
          props.maxZoom = 15;
          props.extent = isDesktop ? FULL_EXTENT : LIMITED_EXTENT;

          return visible ? l.clone(props) : null;
        }));
        if (view && view.longitude !== undefined) {
          updateViewState({latitude: 0, longitude: 0, zoom: 0, bearing: 0, pitch: 0, position: [0, 0, view.height || 200], ...view}, shouldOrbit);

        }
      }
    },
    [currentSlide]
  );
  useEffect(
    () => {
      setLayers(layers => layers.map(l => {
        const props = {};
        if (filterValue !== null && l && l.id !== 'google-3d') {
          props.filterRange = [filterValue - 0.00001, 10000];
        }

        return l && l.clone(props);
      }));
    },
    [filterValue]
  );

  return (
    <AppStateContext.Provider
      value={{
        next: () => {
          setCurrentSlide(currentSlide => Math.min(currentSlide + 1, slides.length - 1));
        },
        prev: () => {
          setCurrentSlide(currentSlide => Math.max(currentSlide - 1, 0));
        },
        reset: () => {
          setCurrentSlide(0);
        },
        credits,
        setFilterValue,
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
