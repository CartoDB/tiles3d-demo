import React from 'react';
import { makeStyles, Button, ButtonGroup, Paper, Typography } from '@material-ui/core';
import { useAppState } from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(3),
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000,
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: 500,
    fontSize: '0.9rem'
  },
  buttonGroup: {
    marginBottom: theme.spacing(1)
  }
}));

const DrawingControls = () => {
  const classes = useStyles();
  const { currentSlide, slidesNumber, polygonDrawingManager, isDrawingEnabled } = useAppState();

  // Only show on the last slide
  if (!isDrawingEnabled || currentSlide !== slidesNumber - 1 || !polygonDrawingManager) {
    return null;
  }

  const handleModeChange = (mode) => {
    polygonDrawingManager.setMode(mode);
  };

  const handleClear = () => {
    if (window.confirm('Clear all polygons?')) {
      polygonDrawingManager.clearPolygons();
    }
  };

  const handleExport = () => {
    const geojson = polygonDrawingManager.exportGeoJSON();
    console.log('Exported GeoJSON:', geojson);
    // You could also download this as a file
    const blob = new Blob([geojson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygons.geojson';
    a.click();
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.title}>
        Polygon Drawing Tools
      </Typography>
      <ButtonGroup className={classes.buttonGroup} size="small" variant="contained" color="primary">
        <Button onClick={() => handleModeChange('draw')}>
          Draw
        </Button>
        <Button onClick={() => handleModeChange('modify')}>
          Edit
        </Button>
        <Button onClick={() => handleModeChange('translate')}>
          Move
        </Button>
      </ButtonGroup>
      <ButtonGroup size="small" variant="outlined">
        <Button onClick={handleClear} color="secondary">
          Clear All
        </Button>
        <Button onClick={handleExport} color="primary">
          Export GeoJSON
        </Button>
      </ButtonGroup>
      <Typography variant="caption" display="block" style={{ marginTop: 8, opacity: 0.7 }}>
        Click on the map to start drawing a polygon. Double-click to finish.
      </Typography>
    </Paper>
  );
};

export default DrawingControls;