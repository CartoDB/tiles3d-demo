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
import slide1Image from '../../assets/images/slide1.jpg';
import slide2Image from '../../assets/images/slide2.jpg';
import slide3Image from '../../assets/images/slide3.jpg';
import slide4Image from '../../assets/images/slide4.jpg';
import slide5Image from '../../assets/images/slide5.jpg';
import slide6Image from '../../assets/images/slide6.jpg';
import slide7Image from '../../assets/images/slide7.jpg';
import slide8Image from '../../assets/images/slide8.jpg';

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
        {mobileExpanded ? (
          <IconButton
            className={classes.headerPrimaryClose}
            onClick={() => {
              setMobileExpanded(false);
            }}
          >
            <IconExpandDown />
          </IconButton>
        ) : (
          <SidebarClose className={classes.headerPrimaryClose} primary={true} />
        )}
        <Header primary={true} className={classes.headerPrimaryItem} />
      </div>

      <div className={[classes.footerItem, classes.footerClose].join(' ')} data-position="top-left">
        {mobileExpanded ? (
          <IconButton
            onClick={() => {
              setMobileExpanded(false);
            }}
          >
            <IconExpandDown />
          </IconButton>
        ) : (
          <SidebarClose />
        )}
      </div>

      <div className={classes.slides}>
        <SidebarSlide
          slide={1}
          shrinked={slideShrinked}
          {...(currentSlide === 1 && {ref: currentCardRef})}
          title="Trees"
          subtitle="Trees help to regulate temperature"
          text="Trees provide shade and help to regulate the temperature in cities, reducing the urban heat island effect. This can help to mitigate the impact of climate change in urban areas."
          image={slide1Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@juvx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vlad Busuioc</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={2}
          shrinked={slideShrinked}
          {...(currentSlide === 2 && {ref: currentCardRef})}
          title="Temperature in Cities"
          subtitle="Trees have a major impact in controlling the temperature in cities"
          text="This map show areas with high temperature"
          image={slide2Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matthew Henry</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={3}
          shrinked={slideShrinked}
          {...(currentSlide === 3 && {ref: currentCardRef})}
          title="Cooling the environment"
          subtitle="Trees have a major impact in controlling the temperature in cities"
          text="While this map show areas with low temperature"
          image={slide2Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matthew Henry</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={4}
          shrinked={slideShrinked}
          {...(currentSlide === 4 && {ref: currentCardRef})}
          title="Trees contribute to quality of life"
          subtitle="A green neighbourhood is much more pleasant to live in"
          text="This map shows the distance to the nearest tree for each building"
          image={slide4Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@charlfolscher?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charl Folscher</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={5}
          shrinked={slideShrinked}
          {...(currentSlide === 5 && {ref: currentCardRef})}
          title="Plant more trees"
          subtitle="Planting trees is one of the most cost effective ways to make a city more liveable"
          text="This map show a calculation of Tree Planting Priority, an index which highlights areas in which trees should be planted in order to maximize their benefit"
          image={slide5Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@chuttersnap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">CHUTTERSNAP</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={6}
          shrinked={slideShrinked}
          {...(currentSlide === 6 && {ref: currentCardRef})}
          title="Commercial truck electrification is well within reach"
          subtitle="Fully electric trucks are reaching wider-scale consideration as truck, engine, and other component manufacturers are developing the systems required to support this new breed of commercial vehicles."
          text="These electrified trucks will bring many benefits (cleaner, renewable  energy consumption and simpler designs), but come with some additional challenges, such as the need for an updated  infrastructure and R&D investments."
          image={slide6Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@gerandeklerk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Geran de Klerk</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={7}
          shrinked={slideShrinked}
          {...(currentSlide === 7 && {ref: currentCardRef})}
          title="Focusing on long-haul trucks will require a charging infrastructure at scale."
          subtitle="Utilizing aggregated data from existing truck fleets, and considering the most common  routes, it is possible to determine optimal locations to install the required charging infrastructure."
          text="In this map, 4,780 of the most popular stops are analyzed. Using spatial analytics, different models can be created based on the phased roll out of electric truck fleets."
          image={slide7Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@sophiejonas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sophie Jonas</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={8}
          shrinked={slideShrinked}
          {...(currentSlide === 8 && {ref: currentCardRef})}
          title="Rising temperatures in Texas could have devastating impacts across sectors"
          subtitle="Depleted water resources, increasing wildfires, and expanding deserts are expected to cause significant damage to agriculture, human health, and infrastructure."
          text="Using data and spatial analysis to evaluate the impacts of change on critical sectors will be key to prioritizing investments in climate resilience. The time to act is now."
          image={slide8Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@alecimages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chenyu Guan</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
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
