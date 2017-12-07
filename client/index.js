/**
 * What gets put on the page!
 *
 *
 */

/* eslint-disable new-cap */

import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

import Mapper from './util/mapping/mapper';
import { bootstrap } from './util/bootstrap-sketch';
import backSketch from './back';
import floorSketch from './floor';
import './app-style.scss';

const app = document.getElementById('app');
let floorDisplay;
let backDisplay;


function setMap() {
  const mapper = new Mapper(backDisplay, floorDisplay);
  mapper.setLayouts();
  console.log(mapper);
  window.addEventListener('resize', mapper.resize.bind(mapper));
  console.log('Done setup!');
}


function setup() {
  const width = window.innerWidth;
  const height = window.innerHeight / 2;

  backDisplay = document.createElement('div');
  backDisplay.setAttribute('id', 'back-display');
  // backDisplay.style.height = `${height}px`;
  // backDisplay.style.width = `${width}px`;
  backDisplay.style.height = `500px`;
  backDisplay.style.width = `500px`;

  floorDisplay = document.createElement('div');
  floorDisplay.setAttribute('id', 'floor-display');
  // floorDisplay.style.height = `${height}px`;
  // floorDisplay.style.width = `${width}px`;
  floorDisplay.style.height = `500px`;
  floorDisplay.style.width = `500px`;

  app.appendChild(backDisplay);
  app.appendChild(floorDisplay);

  setMap();
}


function start() {
  const backDisplayApp = new p5(bootstrap(backSketch, backDisplay), backDisplay);
  const floorDisplayApp = new p5(bootstrap(floorSketch, floorDisplay), floorDisplay);

  console.log('Started!');
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

setup();
start();
