import React, {useState, useEffect, useRef} from 'react';
import {
  Button,
  IconButton,
  Drawer,
  makeStyles,
  Fade,
  useMediaQuery,
  Hidden
} from '@material-ui/core';
import {useAppState} from '../../state';
import {ReactComponent as ArrowLeft} from '../../assets/icons/arrow-left.svg';
import {ReactComponent as ArrowRightWhite} from '../../assets/icons/arrow-right-white.svg';
import {ReactComponent as IconActionHome} from '../../assets/icons/icon-action-home.svg';
import {ReactComponent as IconExpand} from '../../assets/icons/icon-navigation-expand-less.svg';
import {ReactComponent as IconExpandDown} from '../../assets/icons/icon-navigation-expand-more.svg';
import SidebarSlide from './SidebarSlide';
import SidebarClose from './SidebarClose';
import Header, {HEADER_HEIGHT} from '../Header/Header';
import slide1Image from '../../assets/images/slides/slide1.jpg';
import slide2Image from '../../assets/images/slides/slide2.jpg';
import slide3Image from '../../assets/images/slides/slide3.jpg';
import slide4Image from '../../assets/images/slides/slide4.jpg';
import slide5Image from '../../assets/images/slides/slide5.jpg';

export const SIDEBAR_WIDTH = {
  xs: '400px',
  xsNr: 400,
  lg: '460px',
  lgNr: 460
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    zIndex: 1,
    height: 0,
    [theme.breakpoints.up('md')]: {
      height: 'auto',
      '&, & $drawerPaper': {
        width: SIDEBAR_WIDTH.xs,
        inset: '0 0 0 auto !important'
      }
    },
    [theme.breakpoints.up('lg')]: {
      '&, & $drawerPaper': {
        width: SIDEBAR_WIDTH.lg
      }
    }
  },
  drawerPaper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[50],
    border: 'none',
    [theme.breakpoints.down('sm')]: {
      '&:not($drawerPaperExpanded)': {
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1)
      }
    },
    [theme.breakpoints.up('md')]: {
      height: '100%'
    }
  },
  drawerPaperExpanded: {
    [theme.breakpoints.down('sm')]: {
      top: 0
    }
  },
  header: {
    position: 'fixed',
    [theme.breakpoints.up('md')]: {
      position: 'absolute'
    }
  },
  footer: {
    display: 'block',
    position: 'relative',
    width: '100%',
    minHeight: theme.spacing(8.5),
    [theme.breakpoints.up('md')]: {
      minHeight: theme.spacing(10.5)
    }
  },
  footerItem: {
    margin: theme.spacing(2, 0),
    position: 'absolute',
    bottom: 0,
    '&[data-position="left"]': {
      left: theme.spacing(2)
    },
    '&[data-position="top-left"]': {
      left: theme.spacing(2),
      bottom: 'auto',
      top: 0,
      zIndex: 1
    },
    '&[data-position="right"]': {
      right: theme.spacing(2)
    },
    '&[data-position="center"]': {
      left: '50%',
      transform: 'translateX(-50%)',
      margin: theme.spacing(2, 0)
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(3, 0),
      '&[data-position="left"]': {
        left: theme.spacing(3)
      },
      '&[data-position="top-left"]': {
        left: theme.spacing(3)
      },
      '&[data-position="right"]': {
        right: theme.spacing(3)
      },
      '&[data-position="center"]': {
        margin: theme.spacing(3, 0)
      }
    }
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    minHeight: theme.spacing(4.5)
  },
  dot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.text.disabled,
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short
    }),
    '&[data-active="true"]': {
      backgroundColor: theme.palette.primary.main
    }
  },
  slides: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minHeight: theme.spacing(10)
  },
  headerPrimary: {
    position: 'absolute',
    left: 0,
    width: '100%',
    zIndex: 2,
    display: 'none',
    bottom: `calc(100% - ${HEADER_HEIGHT}px)`,
    height: 0,
    backgroundColor: theme.palette.grey[50],
    overflow: 'hidden'
  },
  headerPrimaryShown: {
    display: 'block'
  },
  headerPrimaryClose: {
    position: 'absolute',
    margin: theme.spacing(2.25, 2),
    bottom: 0,
    left: 0,
    '& svg path': {
      fill: theme.palette.primary.main
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(3)
    }
  },
  headerPrimaryItem: {
    top: 'auto',
    bottom: theme.spacing(0.5),
    [theme.breakpoints.up('md')]: {
      bottom: 0
    }
  },
  iconButtonContained: {
    '&, &:hover, &:focus, &:active': {
      backgroundColor: theme.palette.primary.main
    }
  },
  footerClose: {
    position: 'fixed',
    [theme.breakpoints.up('md')]: {
      position: 'absolute'
    }
  },
  swipeUpRoot: {
    position: 'absolute',
    top: theme.spacing(2.5),
    right: theme.spacing(2.5)
  }
}));

const Sidebar = () => {
  const classes = useStyles();
  const {next, prev, reset, currentSlide, slidesNumber} = useAppState();
  const [headerPrimaryHeight, setHeaderPrimaryHeight] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const currentCardRef = useRef();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const slideShrinked = !mobileExpanded && !isDesktop;

  useEffect(() => {
    if (currentCardRef?.current) {
      const item = currentCardRef.current;
      const itemContent = item.querySelector('[data-content="true"]');

      const scrollListener = () => {
        const contentTop = itemContent.getBoundingClientRect().top;
        setHeaderPrimaryHeight(
          contentTop > HEADER_HEIGHT
            ? 0
            : contentTop > 0
            ? HEADER_HEIGHT - contentTop
            : HEADER_HEIGHT
        );
      };
      item.addEventListener('scroll', scrollListener);
      scrollListener();
      return () => {
        item?.removeEventListener('scroll', scrollListener);
      };
    }
  }, [currentCardRef.current, setHeaderPrimaryHeight]);

  useEffect(() => {
    if (!currentSlide || isDesktop) {
      setMobileExpanded(false);
    }
  }, [currentSlide, setMobileExpanded, isDesktop]);

  return (
    <Drawer
      className={classes.drawer}
      variant="temporary"
      anchor={isDesktop ? 'right' : 'bottom'}
      open={currentSlide > 0}
      classes={{
        paper: [classes.drawerPaper, mobileExpanded ? classes.drawerPaperExpanded : ''].join(' ')
      }}
      hideBackdrop={true}
    >
      <Header
        showDelay={500}
        hideDelay={0}
        hidden={currentSlide === 0}
        className={classes.header}
      />
      <div
        className={[
          classes.headerPrimary,
          headerPrimaryHeight > 0 ? classes.headerPrimaryShown : ''
        ].join(' ')}
        style={{height: headerPrimaryHeight}}
      >
        {mobileExpanded && (
          <IconButton
            className={classes.headerPrimaryClose}
            onClick={() => {
              setMobileExpanded(false);
            }}
          >
            <IconExpandDown />
          </IconButton>
        )}
        
        {/* <SidebarClose className={classes.headerPrimaryClose} primary={true} /> */}
        
        <Header primary={true} className={classes.headerPrimaryItem} />
      </div>

      <div className={[classes.footerItem, classes.footerClose].join(' ')} data-position="top-left">
        {mobileExpanded && (
          <IconButton
            onClick={() => {
              setMobileExpanded(false);
            }}
          >
            <IconExpandDown />
          </IconButton>
        )} 
        {/* <SidebarClose /> */}
      </div>

      <div className={classes.slides}>
        <SidebarSlide
          slide={1}
          shrinked={slideShrinked}
          {...(currentSlide === 1 && {ref: currentCardRef})}
          title="America's Most Congested District"
          subtitle="Before January 2025, Manhattan was drowning in traffic"
          text="<p>New Yorkers lost <b>117 hours annually</b> sitting in gridlock. 647,200 vehicles entered the zone daily, with average Midtown speeds of just <b>4.7 mph</b>.</p><p>The economic cost: <b>$20 billion per year</b>.</p><p>On <b>January 5, 2025</b>, NYC launched the nation's first urban congestion toll: $9 to enter Manhattan south of 60th Street.</p>"
          image={slide1Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@robertbye?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Robert Bye</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={2}
          shrinked={slideShrinked}
          {...(currentSlide === 2 && {ref: currentCardRef})}
          title="The Results: Traffic Moving Again"
          subtitle="17.6 million fewer vehicles in 9 months"
          text="<p>Key crossing improvements:</p><ul><li><b>Holland Tunnel delays: -65%</b></li><li><b>Brooklyn Bridge: -13% faster</b></li><li><b>Lincoln Tunnel: -5% improvement</b></li><li><b>Overall zone delays: -25%</b></li></ul><p>Average commuters gain back <b>7 minutes per hour</b> spent in traffic.</p>"
          image={slide2Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@cici9265?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Cici Hung</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={3}
          shrinked={slideShrinked}
          {...(currentSlide === 3 && {ref: currentCardRef})}
          title="Benefits Beyond Manhattan"
          subtitle="The transformation spread across the entire region"
          text="<p>Traffic delays down everywhere:</p><ul><li>Manhattan zone: <b>-25%</b></li><li>The Bronx: <b>-10%</b></li><li>Bergen County, NJ: <b>-14%</b></li><li>Metro region: <b>-9%</b></li></ul><p>Even roads outside the zone are moving faster: Long Island Expressway, Flatbush Avenue, and approach highways all show improvements.</p>"
          image={slide3Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@inakristina?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kristi Simko</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={4}
          shrinked={slideShrinked}
          {...(currentSlide === 4 && {ref: currentCardRef})}
          title="Safer Streets, Cleaner Air, Quieter City"
          subtitle="The city isn't just moving faster—it's living better"
          text="<p><b>Safety improvements:</b></p><ul><li>Crashes: <b>-14%</b></li><li>Traffic injuries: <b>-15%</b></li><li>Pedestrian fatalities at historic lows</li></ul><p><b>Environmental gains:</b></p><ul><li>CO₂ emissions: <b>-2-3% per km</b></li><li>Air quality improved at monitoring stations</li><li>Noise complaints: <b>-45%</b></li></ul>"
          image={slide4Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@jerrykavan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jaromír Kavan</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={5}
          shrinked={slideShrinked}
          {...(currentSlide === 5 && {ref: currentCardRef})}
          title="$15 Billion for Better Transit"
          subtitle="Revenue on track: $500 million in 2025"
          text="<p><b>Where your toll dollars go:</b></p><ul><li>🚇 Second Avenue Subway Phase 2 extension</li><li>♿ 70+ stations getting elevators & accessibility</li><li>🚂 Penn Access & Metro-North expansion</li><li>🚌 New bus routes connecting outer boroughs</li><li>🔧 Signal upgrades & critical infrastructure repairs</li></ul><p>5.5 million daily riders will benefit from these improvements.</p><p><i>&quot;Nine months in, it's clear: congestion pricing has been a huge success.&quot;</i><br/>— Governor Kathy Hochul, July 2025</p>"
          image={slide5Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@chrsndrsn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chris Anderson</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
      </div>

      <div className={classes.footer}>
        <Fade in={currentSlide === 1}>
          <div>
            <Hidden smDown>
              <Button
                data-position="left"
                classes={{root: classes.footerItem}}
                startIcon={<IconActionHome />}
                color="primary"
                onClick={reset}
              >
                Home
              </Button>
            </Hidden>
            <Hidden mdUp>
              <IconButton
                data-position="left"
                classes={{root: classes.footerItem}}
                color="primary"
                onClick={reset}
              >
                <IconActionHome />
              </IconButton>
            </Hidden>
          </div>
        </Fade>
        <Fade in={currentSlide > 1}>
          <IconButton
            data-position="left"
            classes={{root: classes.footerItem}}
            aria-label="Previous"
            color="primary"
            onClick={prev}
          >
            <ArrowLeft />
          </IconButton>
        </Fade>
        <div className={[classes.dots, classes.footerItem].join(' ')} data-position="center">
          {[...new Array(slidesNumber - 1)].map((item, i) => (
            <div
              key={`dot-${i + 1}`}
              className={classes.dot}
              data-active={i + 1 === currentSlide}
            />
          ))}
        </div>
        <Fade in={currentSlide !== slidesNumber - 1}>
          <div>
            <Hidden smDown>
              <Button
                data-position="right"
                classes={{root: classes.footerItem}}
                variant="contained"
                color="primary"
                onClick={next}
                endIcon={<ArrowRightWhite />}
              >
                Next
              </Button>
            </Hidden>
            <Hidden mdUp>
              <IconButton
                data-position="right"
                classes={{root: [classes.footerItem, classes.iconButtonContained].join(' ')}}
                color="primary"
                onClick={next}
              >
                <ArrowRightWhite />
              </IconButton>
            </Hidden>
          </div>
        </Fade>
      </div>

      <div className={classes.swipeUpRoot}>
        <IconButton
          onClick={() => {
            setMobileExpanded(true);
          }}
          size="small"
        >
          <IconExpand />
        </IconButton>
      </div>
    </Drawer>
  );
};

export default Sidebar;
