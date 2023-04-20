import React from 'react';
import {makeStyles} from '@material-ui/core';
import Map from '../Map/Map';
import Sidebar from '../Sidebar/Sidebar';
import CoverHero from '../Cover/CoverHero';
import CoverFooter from '../Cover/CoverFooter';
import CoverHeader from '../Cover/CoverHeader';
import CoverLegend from '../Cover/CoverLegend';
import Header from '../Header/Header';
import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      overflow: 'hidden'
    }
  },
  root: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.spacing(78)
    },
    [theme.breakpoints.up('md')]: {
      minHeight: theme.spacing(83)
    }
  }
}));

const Main = () => {
  const classes = useStyles();
  const {currentSlide} = useAppState();

  return (
    <div className={classes.root}>
      <Map />
      <CoverHeader />
      <CoverHero />
      <CoverFooter />
      <CoverLegend />
      <Sidebar />
      <Header hidden={currentSlide > 0} hideDelay={500} showDelay={0} />
    </div>
  );
};

export default Main;
