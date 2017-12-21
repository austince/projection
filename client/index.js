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
import pastelSketch from './sketches/pastel';
import xx3dSketch from './sketches/xx_3d';
import arcLineSketch from './sketches/arc-lines';
import noiseSketch from './sketches/noise-circles';
import colorBundlesSketch from './sketches/color-bundles';
import textCenterSketch from './sketches/text-center';
import textColumnSketch from './sketches/text-column';
import { VisionClient } from './lib/sockets/VisionClient';

// Base Styles
import './app-style.scss';

const appElem = document.getElementById('app');
let floorDisplayElem;
let wallDisplayElem;
let floorApp;
let wallApp;
let wallTimeoutId = null;
const wallSwitchInterval =  1 * 60 * 1000; // one minute
const playTimeBeforeSwitch = .25 * 60 * 1000; // before switching
const restartTimeAfterLeaving = 10 * 1000; // how long before the thing is restarted
const bodyLegitInterval = .15 * 60 * 1000; // how many seconds for each body detection to count
const floorSketch = xx3dSketch;
const startingWallSketch = noiseSketch;
const wallSketches = [
  colorBundlesSketch,
  pastelSketch,
  arcLineSketch,
  noiseSketch
];
let cvClient = new VisionClient();

function personWatcher() {
  // Look for a body, let them play a little bit, then hit them with the text
// Then wait for them to leave and restart
  let textSwitchId = null;
  let lastSeenDate = null;
  let doneSwitch = false;
  cvClient.bodyCords$.subscribe((objects) => {
    if (objects.length === 0) {
      // if they've been gone long enough, let's restart the sketches
      const now = new Date();
      if ((lastSeenDate !== null) && now.getTime() - lastSeenDate.getTime() > restartTimeAfterLeaving) {
        // Reset text switching
        console.log(now - lastSeenDate);
        console.log(restartTimeAfterLeaving);
        if (textSwitchId !== null) clearTimeout(textSwitchId);
        textSwitchId = null;

        floorApp = swapSketch(floorApp, floorSketch, floorDisplayElem);
        const randSketchIndex = Math.floor(Math.random() * wallSketches.length);
        if (wallTimeoutId !== null) clearTimeout(wallTimeoutId);
        wallApp = swapSketch(wallApp, wallSketches[randSketchIndex], wallDisplayElem);
        // start the wall swapper again
        wallSwap(wallApp, wallDisplayElem, wallSketches, randSketchIndex);
        lastSeenDate = null;
        doneSwitch = false;
        console.log("They've gone.");
      } else if (!doneSwitch && lastSeenDate !== null && now.getTime() - lastSeenDate.getTime() > bodyLegitInterval)  {
        if (textSwitchId !== null) {
          clearTimeout(textSwitchId);
        }
        textSwitchId = null;
        lastSeenDate = null;
        doneSwitch = false;
        console.log(now - lastSeenDate);
        console.log("They're illegitimate.");
      }

    } else {
      lastSeenDate = new Date();

      if (textSwitchId !== null) {
        // already found em
        return;
      }
      // we have person
      console.log("They've arrived.");

      textSwitchId = setTimeout(() => {
        doneSwitch = true;
        console.log("Switched ya.");
        clearTimeout(wallTimeoutId); // shut off the wall swapping
        wallApp = swapSketch(wallApp, textCenterSketch, wallDisplayElem);
        floorApp = swapSketch(floorApp, textColumnSketch, floorDisplayElem);
      }, playTimeBeforeSwitch);
    }
  });
}


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

  appElem.appendChild(wallDisplayElem);
  appElem.appendChild(floorDisplayElem);

  setMap();
}

function start() {
  setup();
  cvClient.connect();

  wallApp = new p5(bootstrap(startingWallSketch, wallDisplayElem), wallDisplayElem);
  floorApp = new p5(bootstrap(xx3dSketch, floorDisplayElem), floorDisplayElem);
  wallSwap(wallApp, wallDisplayElem, wallSketches);
  console.log('Started!');
  personWatcher();
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

function wallSwap(app, elem, sketchList, index = 0, delay = wallSwitchInterval, fadeDelay = 2000) {
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

    wallSwap(nextApp, elem, sketchList, (index + 1) % sketchList.length, delay, fadeDelay);
  }, delay);
}

function restart() {
  appElem.innerHTML = '';
  start();
}

function stop() {
  appElem.innerHTML = '';
}

// Expose for debugging
window.startApp = start;
window.stopApp = stop;
window.restartApp = restart;
window.setupApp = setup;
window.mapApp = setMap;




// Start it up
start();


