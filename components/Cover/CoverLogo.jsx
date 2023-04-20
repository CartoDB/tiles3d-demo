import React from 'react';
import {makeStyles} from '@material-ui/core';
import cartoLogo from '../../assets/images/carto-components-logo-watermark.svg';
import {alpha} from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(0),
    left: theme.spacing(10.25),
    borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
    paddingLeft: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.25),
    position: 'absolute',
    display: 'flex',
    alignItems: 'flex-end',
    '& a, & img': {
      height: theme.spacing(3),
      width: 'auto',
      display: 'inline-block'
    }
  }
}));

const CoverLogo = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <a href="https://carto.com" target="_blank" alt="CARTO">
        <img alt="CARTO" src={cartoLogo} />
      </a>
    </div>
  );
};

export default CoverLogo;
