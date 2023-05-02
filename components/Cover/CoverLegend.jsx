import React, {useState, useEffect} from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  Box,
  withStyles
} from '@material-ui/core';
import CoverBase from './CoverBase';
import slides from '../../slides';
import {useAppState} from '../../state';
import {colorToRGBArray} from '../../utils';

const CustomSlider = withStyles({
  root: {
    color: "#fff"
  },
  thumb: {
    backgroundColor: "#fff",
    color: "#fff",
  }
})(Slider);

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(6),
    left: theme.spacing(3),
    transform: 'none',
    width: '110px',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      bottom: '170px'
    }
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
  },
  list: {
    padding: theme.spacing(1, 0, 0)
  },
  listItem: {
    padding: theme.spacing(0.5, 0)
  },
  listItemIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0, 1, 0, 0),
    minWidth: theme.spacing(2),
    position: 'relative'
  },
  dot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    position: 'absolute',
    top: theme.spacing(0.5),
    left: theme.spacing(0.5)
  },
  ListItemText: {
    opacity: 0.6
  },
  wrapperTest: {
    display: 'flex',
    height: '100%'
  },
  slider: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
}));

const getColor = (color, alpha = 1) => {
  const colorArray = colorToRGBArray(color);
  return `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]},${alpha})`;
}

const CoverLegend = () => {
  const classes = useStyles();
  const {currentSlide} = useAppState();
  const slidesToShow = slides.map((s, i) => s.legend && i).filter(i => i);
  const [slider, setSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);

  // For fade animation, retain legend in state
  const [legend, setLegend] = useState(null);
  useEffect(() => {
    const {legend, slider} = slides[currentSlide];
    if (legend) setLegend(legend);
    if (slider) setSlider(slider);
  }, [currentSlide]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  }

  if (!legend) return null;
  return (
    <CoverBase slidesToShow={slidesToShow} className={classes.root}>
      <Box  className={classes.wrapperTest}>
        <Paper classes={{root: classes.paper}} elevation={1}>
          <Typography color="inherit" variant="caption">
            {legend.title}
          </Typography>
          <List classes={{root: classes.list}} dense={true}>
            {legend.labels
              .map((src, i) => (
                <ListItem classes={{root: classes.listItem}} key={`source-${i}`}>
                  <ListItemIcon
                    style={{backgroundColor: getColor(legend.colors[i], 0.4)}}
                    classes={{root: classes.listItemIcon}}
                  >
                    <div
                      style={{backgroundColor: legend.colors[i]}}
                      className={classes.dot}
                    ></div>
                  </ListItemIcon>
                  <ListItemText
                    classes={{root: classes.ListItemText}}
                    primaryTypographyProps={{color: 'inherit', variant: 'caption'}}
                    primary={src}
                  ></ListItemText>
                </ListItem>
              ))}
          </List>
        </Paper>
        {slider && (
          <Box className={classes.slider}>
            <CustomSlider 
              orientation="vertical"
              value={sliderValue}
              onChange={handleSliderChange}
              aria-labelledby="legend-slider"
            />
          </Box>
        )}
      </Box>
    </CoverBase>
  );
};

export default CoverLegend;
