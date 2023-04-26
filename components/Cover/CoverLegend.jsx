import React from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import CoverBase from './CoverBase';
import slides from '../../slides';
import {useAppState} from '../../state';
import {COLOR_SCALE} from '../../layers/temperature';
import {colorToRGBArray} from '../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(3),
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
  }
}));

const getColor = (color, alpha = 1) => {
  const colorArray = colorToRGBArray(color);
  return `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]},${alpha})`;
}

const CoverLegend = () => {
  const classes = useStyles();
  const {currentSlide} = useAppState();
  const {legend} = slides[currentSlide];
  const slidesToShow = slides.map((s, i) => s.legend && i).filter(i => i);

  return (
    <CoverBase slidesToShow={slidesToShow} className={classes.root}>
      <Paper classes={{root: classes.paper}} elevation={1}>
        <Typography color="inherit" variant="caption">
          Temperature
        </Typography>
        <List classes={{root: classes.list}} dense={true}>
          {COLOR_SCALE.labels
            .map((src, i) => (
              <ListItem classes={{root: classes.listItem}} key={`source-${i}`}>
                <ListItemIcon
                  style={{backgroundColor: getColor(COLOR_SCALE.colors[i], 0.4)}}
                  classes={{root: classes.listItemIcon}}
                >
                  <div
                    style={{backgroundColor: COLOR_SCALE.colors[i]}}
                    className={classes.dot}
                  ></div>
                </ListItemIcon>
                <ListItemText
                  classes={{root: classes.ListItemText}}
                  primaryTypographyProps={{color: 'inherit', variant: 'overline'}}
                  primary={src}
                ></ListItemText>
              </ListItem>
            ))}
        </List>
      </Paper>
    </CoverBase>
  );
};

export default CoverLegend;
