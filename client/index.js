/**
 * What gets put on the page!
 *
 *
 */

/* eslint-disable new-cap */

import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

import Mapper from './util/mapper';
import { bootstrap } from './util/bootstrap-sketch';
import pastelSketch from './pastel';
import xx3dSketch from './xx_3d';
import arcLineSketch from './arc-lines';
import './app-style.scss';

const app = document.getElementById('app');
let floorDisplayElem;
let wallDisplayElem;
let floorApp;
let wallApp;

function setMap() {
  const mapper = new Mapper(wallDisplayElem, floorDisplayElem);
  mapper.setLayouts();
  console.log(mapper);
  window.addEventListener('resize', mapper.resize.bind(mapper));
  console.log('Done setup!');
}


function setup() {
  wallDisplayElem = document.createElement('div');
  wallDisplayElem.setAttribute('id', 'back-display');
  wallDisplayElem.style.height = `500px`;
  wallDisplayElem.style.width = `500px`;

  floorDisplayElem = document.createElement('div');
  floorDisplayElem.setAttribute('id', 'floor-display');
  floorDisplayElem.style.height = `500px`;
  floorDisplayElem.style.width = `500px`;

  app.appendChild(wallDisplayElem);
  app.appendChild(floorDisplayElem);

  setMap();
}

function swapSketch(app, swapSketch, elem, delay=1000) {
  setTimeout(() => {
    app.remove();
    app = new p5(bootstrap(swapSketch, elem), elem);
  }, delay);
}


function start() {
  wallApp = new p5(bootstrap(pastelSketch, wallDisplayElem), wallDisplayElem);
  floorApp = new p5(bootstrap(xx3dSketch, floorDisplayElem), floorDisplayElem);
  swapSketch(wallApp, arcLineSketch, wallDisplayElem);
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
