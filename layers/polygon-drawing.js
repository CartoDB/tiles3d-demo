import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
import { DrawPolygonMode, ModifyMode, TranslateMode, ViewMode } from '@deck.gl-community/editable-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { FADE_IN_COLOR } from './transitions';

// Initial empty feature collection for drawing
const initialFeatureCollection = {
  type: 'FeatureCollection',
  features: []
};

export class PolygonDrawingLayer {
  constructor(onUpdate) {
    this.featureCollection = initialFeatureCollection;
    this.selectedFeatureIndexes = [];
    this.mode = DrawPolygonMode;
    this.onUpdate = onUpdate || (() => {});
    this.isDrawing = false;
  }

  setMode(mode) {
    switch(mode) {
      case 'draw':
        this.mode = DrawPolygonMode;
        break;
      case 'modify':
        this.mode = ModifyMode;
        break;
      case 'translate':
        this.mode = TranslateMode;
        break;
      case 'view':
        this.mode = ViewMode;
        break;
      default:
        this.mode = DrawPolygonMode;
    }
    this.updateLayer();
  }

  clearPolygons() {
    this.featureCollection = initialFeatureCollection;
    this.selectedFeatureIndexes = [];
    this.updateLayer();
  }

  setDrawingEnabled(enabled) {
    this.isDrawing = enabled;
    if (!enabled) {
      this.mode = ViewMode;
    } else {
      this.mode = DrawPolygonMode;
    }
    this.updateLayer();
  }

  updateLayer() {
    this.onUpdate(this.getLayer());
  }

  getLayer() {
    if (!this.isDrawing) {
      // Return a simple GeoJsonLayer when not in drawing mode
      return new GeoJsonLayer({
        id: 'polygon-drawing',
        data: this.featureCollection,
        pickable: false,
        stroked: true,
        filled: true,
        getFillColor: [100, 200, 255, 100],
        getLineColor: [0, 128, 255, 255],
        getLineWidth: 3,
        lineWidthMinPixels: 2,
        transitions: FADE_IN_COLOR
      });
    }

    // Return EditableGeoJsonLayer when in drawing mode
    return new EditableGeoJsonLayer({
      id: 'polygon-drawing',
      data: this.featureCollection,
      mode: this.mode,
      selectedFeatureIndexes: this.selectedFeatureIndexes,
      pickable: true,

      // Styling for the polygons
      getFillColor: [100, 200, 255, 100],
      getLineColor: [0, 128, 255, 255],
      getLineWidth: 3,
      lineWidthMinPixels: 2,

      // Edit handles styling - using subLayerProps for the new API
      _subLayerProps: {
        'edit-handles': {
          getFillColor: [255, 255, 0, 255],
          getRadius: 6,
          getLineColor: [255, 255, 0, 255],
          radiusMinPixels: 6,
          radiusMaxPixels: 12
        },
        'guide': {
          getFillColor: [255, 255, 255, 20],
          getLineColor: [255, 255, 255, 100],
          getLineWidth: 1,
          lineWidthMinPixels: 1
        }
      },

      // Callbacks
      onEdit: ({updatedData, editType, editContext}) => {
        this.featureCollection = updatedData;

        // Add index and preserve editProperties as per v9.1 best practices
        if (this.featureCollection.features) {
          this.featureCollection.features.forEach((feature, index) => {
            if (!feature.properties) {
              feature.properties = {};
            }
            feature.properties.index = index;

            // Preserve editProperties for circles/ellipses/shapes
            if (feature.properties.editProperties) {
              // Keep the edit metadata from deck.gl-community
              feature.properties.editProperties = {...feature.properties.editProperties};
            }
          });
        }

        // Removed console.log to clean up console output

        this.onUpdate(this.getLayer());
      },

      transitions: FADE_IN_COLOR
    });
  }

  // Export the drawn polygons as GeoJSON
  exportGeoJSON() {
    return JSON.stringify(this.featureCollection, null, 2);
  }

  // Import GeoJSON data
  importGeoJSON(geojson) {
    try {
      const data = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
      if (data.type === 'FeatureCollection') {
        this.featureCollection = data;
        // Add index to features
        if (this.featureCollection.features) {
          this.featureCollection.features.forEach((feature, index) => {
            if (!feature.properties) {
              feature.properties = {};
            }
            feature.properties.index = index;
          });
        }
        this.updateLayer();
        return true;
      }
    } catch (e) {
      console.error('Failed to import GeoJSON:', e);
    }
    return false;
  }

  // Select a feature by clicking
  selectFeature(index) {
    if (index !== undefined && index !== null) {
      this.selectedFeatureIndexes = [index];
    } else {
      this.selectedFeatureIndexes = [];
    }
    this.updateLayer();
  }
}