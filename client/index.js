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

const backDisplay = document.createElement('div');
backDisplay.setAttribute('id', 'back-display');

const floorDisplay = document.createElement('div');
floorDisplay.setAttribute('id', 'floor-display');

app.appendChild(backDisplay);
app.appendChild(floorDisplay);

const backDisplayApp = new p5(bootstrap(backSketch, backDisplay), backDisplay);
const floorDisplayApp = new p5(bootstrap(floorSketch, floorDisplay), floorDisplay);

// setLayouts();
const mapper = new Mapper('back-display', 'floor-display');

window.addEventListener('resize', mapper.resize.bind(mapper));

console.log(mapper);
console.log('Done setup!');
