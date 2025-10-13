# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React-based 3D tiles demo that showcases environmental data visualization using Google 3D Tiles, CARTO data layers, and deck.gl. The application presents an interactive story map demonstrating "The Importance of Vegetation for Cities" with slides showing temperature data and vegetation analysis overlaid on 3D city models.

## Development Commands
- **Start development server**: `yarn start` (opens on localhost:8080)
- **Build for production**: `yarn build` (outputs to `dist/` folder)
- **Build for preview**: `yarn build-preview`
- **Link local deck.gl development**: `yarn link-deck`
- **Unlink deck.gl development**: `yarn unlink-deck`

## Environment Setup
You need a Google Maps API Key to run the project:
1. Get a Google Maps API Key from GCP Console
2. Authorize localhost for development
3. Set `VITE_GOOGLE_API_KEY` in your `.env` file

The project includes environment files for different stages:
- `.env` - Development
- `.env.preview` - Preview build
- `.env.production` - Production build

## Architecture

### Core Structure
- **React App**: Built with Vite, Material-UI theming, and React Context for state management
- **3D Visualization**: Uses deck.gl with Google 3D Tiles and CARTO layers
- **Story-based Navigation**: Slide-based interface with predefined viewpoints and layers

### Key Files
- `index.jsx` - App entry point with theme and CARTO credentials setup
- `state.jsx` - Global app state management, view transitions, and layer orchestration
- `slides.js` - Configuration for each story slide (viewpoints, layers, legends)
- `components/` - React UI components for header, sidebar, map, etc.
- `layers/` - Layer definitions and data visualization logic

### Layer System
Each visualization layer is defined in `layers/`:
- `google-3d.js` - Google 3D Tiles base layer with mobile optimization
- `temperature.js` - CARTO raster layer for temperature data
- `remote.js` - Dynamically loaded CARTO vector layers
- `colorScales.js` - Color scale definitions for data visualization
- `transitions.js` - Animation and fade-in effects

### Development Features
- **Vite Proxy**: Local caching of CARTO API and Google Tiles for better development performance (see vite.config.js:27-85)
- **Mobile Optimization**: Reduced geometry resolution and limited tile extents for mobile devices
- **Dynamic Layer Loading**: Remote layers are loaded after initial app transition
- **Orbit Animation**: Automatic camera orbiting for certain slides

### Data Sources
- Google 3D Tiles for city geometry
- CARTO BigQuery datasets for environmental data
- Temperature raster data: `cartobq.public_account.temperature_raster_int8_new`

## Development Notes
- The app uses Material-UI v4 (legacy version)
- State management through React Context, not Redux
- View transitions use custom FlyToInterpolator with smooth easing
- Layer visibility and filtering managed through slide configuration
- Mobile detection affects rendering quality and data extent limits