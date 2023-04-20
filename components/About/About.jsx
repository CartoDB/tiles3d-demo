import React, {forwardRef, useImperativeHandle, useState, useEffect} from 'react';
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
  Link,
  Paper,
  Divider,
  Hidden
} from '@material-ui/core';
import {ReactComponent as IconNavigationClose} from '../../assets/icons/icon-navigation-close.svg';
import {ReactComponent as IconGithub} from '../../assets/icons/icon-github.svg';
import cartoLogo from '../../assets/images/carto-components-logo.svg';
import googleMapsLogo from '../../assets/images/google-maps-platform-logo.png';
import geotabLogo from '../../assets/images/geotap-primary.svg';
import climateEngineLogo from '../../assets/images/climate-engine-logo@2x-primary.png';
import codeImage from '../../assets/images/code.svg';
import AboutText from './AboutText';
import bigqueryImage from '../../assets/images/bigquery.svg';

const ABOUT_HASH = 'about';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 0,
    maxHeight: '100%',
    height: '100%',
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      maxHeight: `calc(100% - ${theme.spacing(18)}px)`,
      height: 'auto',
      margin: theme.spacing(4),
      borderRadius: theme.shape.borderRadius
    }
  },
  title: {
    padding: theme.spacing(3),
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    '& svg path': {
      fill: theme.palette.text.secondary
    }
  },
  content: {
    padding: theme.spacing(2, 3, 0, 3)
  },
  logosText: {
    marginBottom: theme.spacing(2),
    fontWeight: 400
  },
  card: {
    padding: theme.spacing(3, 3, 4.5),
    backgroundColor: theme.palette.grey[50],
    display: 'flex',
    alignItems: 'center'
  },
  cardText: {
    flex: 1,
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(3)
    }
  },
  cardTextTitle: {
    textTransform: 'uppercase',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1)
  },
  cardTextButtons: {
    marginTop: theme.spacing(3),
    '& > a + a': {
      marginTop: theme.spacing(1.5)
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      '& > a + a': {
        marginLeft: theme.spacing(1),
        marginTop: 0
      }
    }
  },
  climateEngineLogo: {
    maxWidth: theme.spacing(17)
  },
  divider: {
    margin: theme.spacing(4.5, 0, 2)
  }
}));

const About = ({}, forwardedRef) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const hashChangeListener = () => {
      setOpen(window.location.hash === `#${ABOUT_HASH}`);
    };
    window.addEventListener('hashchange', hashChangeListener);
    hashChangeListener();
    return () => {
      window.removeEventListener('hashchange', hashChangeListener);
    };
  }, [setOpen]);

  useImperativeHandle(forwardedRef, () => ({
    show: () => {
      setOpen(true);
    }
  }));

  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="about-title"
      aria-describedby="about-description"
      onClose={() => {
        window.location.hash = '';
      }}
      classes={{
        paper: classes.paper
      }}
    >
      <DialogTitle id="about-title" disableTypography classes={{root: classes.title}}>
        <Typography color="textPrimary" variant="h6">
          About this story map
        </Typography>
        <IconButton
          classes={{root: classes.closeBtn}}
          aria-label="Close"
          color="inherit"
          onClick={() => {
            window.location.hash = '';
          }}
        >
          <IconNavigationClose />
        </IconButton>
      </DialogTitle>
      <DialogContent classes={{root: classes.content}}>
        <DialogContentText component="div" id="about-description" tabIndex={-1}>
          <AboutText
            title="BigQuery + CARTO + Deck.GL + Google Maps WebGL = Great rich map visualizations"
            imageBlocks={[
              {
                title: 'With data stored in',
                textClassName: classes.logosText,
                mobileHorizontal: true,
                images: [
                  {
                    src: bigqueryImage,
                    alt: 'Google Big Query'
                  }
                ]
              },
              {
                title: 'Connected by',
                textClassName: classes.logosText,
                mobileHorizontal: true,
                images: [
                  {
                    src: cartoLogo,
                    alt: 'CARTO'
                  }
                ]
              },
              {
                title: 'Displayed on top of',
                textClassName: classes.logosText,
                mobileHorizontal: true,
                images: [
                  {
                    src: googleMapsLogo,
                    alt: 'Google Maps'
                  }
                ]
              }
            ]}
          >
            <p>
              With the new{' '}
              <Link
                underline="always"
                href="https://developers.google.com/maps/documentation/javascript/webgl"
                target="_blank"
              >
                Google Maps WebGL
              </Link>{' '}
              release, CARTO is been working on integrating a rich set of visualization
              capabilities. The data behind it is stored on{' '}
              <Link underline="always" href="https://cloud.google.com/bigquery/" target="_blank">
                BigQuery
              </Link>{' '}
              and visualized using{' '}
              <Link underline="always" href="https://carto.com" target="_blank">
                CARTO
              </Link>{' '}
              and{' '}
              <Link underline="always" href="https://deck.gl/" target="_blank">
                Deck.GL
              </Link>{' '}
              libraries. Some maps are made of very large datasets and others come directly from
              SQL.
            </p>
          </AboutText>

          <Paper classes={{root: classes.card}} elevation={0}>
            <div className={classes.cardText}>
              <Typography variant="overline" component="h4" className={classes.cardTextTitle}>
                How has this been made
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                CARTO offers a simple way to add Tables or direct SQL from BigQuery into Google
                Maps. Now with Google Maps WebGL support a much more rich set of visualizations are
                possible.
              </Typography>
              <div className={classes.cardTextButtons}>
                <Button
                  href="https://cloud.google.com/blog/products/maps-platform/richer-data-visualization-google-maps-platform-using-deckgl"
                  component="a"
                  target="_blank"
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Read the technical blog
                </Button>
                <Button
                  href="https://github.com/CartoDB/cloud-next"
                  component="a"
                  target="_blank"
                  size="small"
                  color="primary"
                  startIcon={<IconGithub />}
                >
                  Check it on GitHub
                </Button>
              </div>
            </div>
            <Hidden smDown>
              <img src={codeImage} />
            </Hidden>
          </Paper>

          <Divider className={classes.divider} />

          <AboutText
            title="Data sources"
            imageBlocks={[
              {
                title: 'Special thanks to:',
                textClassName: classes.logosText,
                images: [
                  {
                    src: geotabLogo,
                    alt: 'GEOTAB'
                  },
                  {
                    src: climateEngineLogo,
                    alt: 'Climate Engine',
                    className: classes.climateEngineLogo
                  }
                ]
              }
            ]}
          >
            <p>
              All the data used for this visualization is available as public data in BigQuery (
              <strong>cartobq.nexus_demo</strong>). The original sources for the data are:
            </p>
            <ul>
              <li>
                <Link href="https://ignition.geotab.com/" target="_blank">
                  Truck parking locations sample from Geotab
                </Link>{' '}
              </li>
              <li>
                <Link
                  href="https://www.naturalearthdata.com/downloads/10m-cultural-vectors/roads/"
                  target="_blank"
                >
                  Natural Earth for roads
                </Link>
              </li>
              <li>
                <Link
                  href="https://en.wikipedia.org/wiki/List_of_power_stations_in_Texas"
                  target="_blank"
                >
                  Power stations in Texas
                </Link>
              </li>
              <li>
                <Link
                  href="https://hifld-geoplatform.opendata.arcgis.com/datasets/electric-power-transmission-lines/explore"
                  target="_blank"
                >
                  Electric Power Transmission Lines
                </Link>
              </li>
              <li>
                <Link href="https://www.gits.igg.unam.mx/idea/descarga" target="_blank">
                  Transmission lines in Mexico
                </Link>
              </li>
              <li>
                <Link
                  href="https://data.humdata.org/dataset/kontur-population-dataset"
                  target="_blank"
                >
                  Global Population Density for 400m H3 Hexagons
                </Link>
              </li>
              <li>
                <Link href="https://carto.com/data" target="_blank">
                  Demographics, boundaries and other extra layer from CARTO Data Observatory
                </Link>
              </li>
            </ul>
          </AboutText>

          <Divider className={classes.divider} />

          <AboutText title="Credits" imageBlocks={[]}>
            <ul>
              <li>
                <Link
                  href="https://sketchfab.com/3d-models/low-poly-truck-98826ebd44e2492298ac925461509216"
                  target="_blank"
                >
                  Low Poly Truck
                </Link>
                {' model by '}
                <Link href="https://sketchfab.com/Arifido._" target="_blank">
                  Arifido
                </Link>{' '}
                <Link href="http://creativecommons.org/licenses/by/4.0/" target="_blank">
                  CC-BY-4.0
                </Link>
              </li>
            </ul>
          </AboutText>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default forwardRef(About);
