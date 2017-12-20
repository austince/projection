/**
 * What gets put on the page!
 *
 * This drives the swapping of sketches and listening for people
 */

/* eslint-disable new-cap */

import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';
// import 'p5/lib/addons/p5.dom';

import Mapper from './util/mapper';
import { bootstrap } from './util/bootstrap-sketch';
import pastelSketch from './pastel';
import xx3dSketch from './xx_3d';
import arcLineSketch from './arc-lines';
import noiseSketch from './noise-circles';
import colorBundlesSketch from './color-bundles';
import textCenterSketch from './text-center';
import textColumnSketch from './text-column';
import { VisionClient } from './lib/sockets/VisionClient';

// Base Styles
import './app-style.scss';

const app = document.getElementById('app');
let floorDisplayElem;
let wallDisplayElem;
let floorApp;
let wallApp;
let wallTimeoutId = -1;
const wallSketches = [
  arcLineSketch,
  colorBundlesSketch,
  noiseSketch,
  pastelSketch
];
let cvClient = new VisionClient();

function setMap() {
  const mapper = new Mapper(wallDisplayElem, floorDisplayElem);
  mapper.setLayouts();
  console.log(mapper);
  window.addEventListener('resize', mapper.resize.bind(mapper));
  console.log('Done setup!');
}


function setup() {
  wallDisplayElem = document.createElement('div');
  wallDisplayElem.setAttribute('class', 'back-display display');
  wallDisplayElem.setAttribute('id', 'back-display');

  floorDisplayElem = document.createElement('div');
  floorDisplayElem.setAttribute('class', 'floor-display display');
  floorDisplayElem.setAttribute('id', 'floor-display');

  app.appendChild(wallDisplayElem);
  app.appendChild(floorDisplayElem);

  setMap();
}

function start() {
  setup();

  wallApp = new p5(bootstrap(noiseSketch, wallDisplayElem), wallDisplayElem);
  floorApp = new p5(bootstrap(xx3dSketch, floorDisplayElem), floorDisplayElem);
  wallSwap(wallApp, wallDisplayElem, wallSketches);
  console.log('Started!');
}

/**
 * Hacking p5 by accessing a private property
 * @param app
 */
function getCanvas(app) {
  return new Promise((resolve, reject) => {
    function checkLoaded() {
      // so hacky
      if (app._setupDone) {
        resolve(app._curElement.canvas);
      } else {
        setTimeout(checkLoaded, 100);
      }
    }

    checkLoaded();
  });
}

function swapSketch(app, swapSketch, elem) {
  app.remove();
  return new p5(bootstrap(swapSketch, elem), elem);
}

function wallSwap(app, elem, sketchList, delay = 5000, fadeDelay = 2000, index = 0) {
  // Trying to figure out how to fade them together
  // let nextApp;
  // setTimeout(async () => {
  //   const canv = await getCanvas(app);
  //   canv.style.opacity = 0;
  //   nextApp = new p5(bootstrap(sketchList[index], elem), elem);
  //   const nextCanv = await getCanvas(nextApp);
  //   nextCanv.style.transition = 'none';
  //   nextCanv.style.opacity = 0;
  //   nextCanv.style.transition = '2s opacity';
  //   nextCanv.style.opacity = 1;
  // }, delay - fadeDelay);

  wallTimeoutId = setTimeout(() => {
    app.remove();
    let nextApp = swapSketch(app, sketchList[index], elem);

    wallSwap(nextApp, elem, sketchList, delay, fadeDelay, (index + 1) % sketchList.length);
  }, delay);
}

function restart() {
  app.innerHTML = '';
  start();
}

function stop() {
  app.innerHTML = '';
}

// Expose for debugging
window.startApp = start;
window.stopApp = stop;
window.restartApp = restart;
window.setupApp = setup;
window.mapApp = setMap;


// visionClient.connect();
// visionClient.bodyCords$.subscribe((objects) => {
//   if (objects.length === 0) return;
//
//   const {
//     width, height,
//   } = p;
//
//   const {
//     params: {
//       x, y, camWidth, camHeight,
//     },
//   } = objects[0];
//   lastCoords = { x: (x / camWidth) * width, y: (y / camHeight) * height };
// });


start();

setTimeout(() => {
  clearTimeout(wallTimeoutId);
  swapSketch(wallApp, textCenterSketch, wallDisplayElem);
  swapSketch(floorApp, textColumnSketch, floorDisplayElem);
}, 2000);