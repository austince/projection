import './floor-style.scss';

import VisionClient from '../lib/sockets/VisionClient';
import NoiseCircle from './noise-circle';

const detail = 0.6; // amount of detail in the noise (0-1)
const increment = 0.002; // how quickly to move through noise (0-1)

// Todo: Make these into mixins for the p p5 object
function colorPixel(p, x, y, color) {
  const density = p.pixelDensity();
  for (let i = 0; i < density; i++) {
    for (let j = 0; j < density; j++) {
      // loop over
      const idx = (4 * (((y * density) + j) * (p.width * density))) + ((x * density) + i);
      p.pixels[idx] = p.red(color);
      p.pixels[idx + 1] = p.green(color);
      p.pixels[idx + 2] = p.blue(color);
      p.pixels[idx + 3] = p.alpha(color);
    }
  }
}

function colorPixelGray(p, x, y, grayVal, area = 1) {
  const density = p.pixelDensity();
  const bounds = density * area;
  const denseWidth = (p.width * density);
  const denseY = (y * density);
  const denseX = (x * density);
  for (let i = 0; i < density; i++) {
    for (let j = 0; j < density; j++) {
      // loop over
      const idx = (4 * ((denseY + j) * denseWidth)) + (denseX + i);
      p.pixels[idx] = grayVal;
      p.pixels[idx + 1] = grayVal;
      p.pixels[idx + 2] = grayVal;
      p.pixels[idx + 3] = 1;
    }
  }
}


function makeNoise(p, step = 3, area = 1) {
  p.loadPixels();
  const density = p.pixelDensity();
  const widthD = p.width * density;
  const heightD = p.height * density;
  for (let x = 0; x < widthD; x += step) {
    for (let y = 0; y < heightD; y += step) {
      // noise() returns a value 0-1, so multiply
      // by 255 to get a number we can use for color
      const gray = p.noise(x * increment, y * increment) * 255;

      // set the current pixel to the value from noise()
      // colorPixel(p, x, y, p.color(gray));
      // colorPixelGray(p, x, y, gray, area);
      // colorPixelGray(p, x, y, gray, 1);
      // Todo: make the efficient array indexing work
      if (area === 1) {
        p.set(x, y, gray);
      } else if (x > area && y > area && x + area < widthD && y + area < heightD) {
        for (let aX = x - area; aX < x + area; aX++) {
          for (let aY = y - area; aY < y + area; aY++) {
            p.set(aX, aY, gray);
          }
        }
      } else {
        p.set(x, y, gray);
      }
    }
  }
  p.updatePixels();
}


export default function floorSketch(p, elem) {
  let colfax;
  let white;
  const visionClient = new VisionClient();
  let lastCoords;
  let cX;
  let cY;
  const maxCircleOffset = 30;
  const angleStep = 0.05;
  const timeIncrement = 0.01; // speed of change over time (0-1)
  let timeOffset = 0; // incremented each frame to shift the noise
  let noiseyCircles = [];

  p.preload = () => {
    colfax = p.loadFont('ColfaxWebThinSub.otf');

    visionClient.connect();
    visionClient.bodyCords$.subscribe((objects) => {
      if (objects.length === 0) return;

      const {
        width, height,
      } = p;

      const {
        params: {
          x, y, camWidth, camHeight,
        },
      } = objects[0];
      lastCoords = { x: (x / camWidth) * width, y: (y / camHeight) * height };


      noiseyCircles.forEach((circle) => {
        const offset = {
          x: p.random(-maxCircleOffset, maxCircleOffset),
          y: p.random(-maxCircleOffset, maxCircleOffset),
        };
        // Todo: make this a gradual change
        // Todo: make this the difference to orig center
        circle.setCenter(lastCoords.x + offset.x, p.height / 2 + offset.y);
      });
    });

    lastCoords = { x: p.width / 2, y: p.height / 2 };
  };

  p.setup = () => {
    // all drawing functions must be referenced through this.p obj
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    white = p.color(255);
    p.background(200);
    p.textFont(colfax);
    p.textSize(36);

    // first adjusts overall variety
    // Lower --> less
    // second adjusts local variety
    // 0 -> 1
    p.noiseDetail(8, detail);

    cX = p.width / 2;
    cY = p.height / 2;
    const whAvg = (p.width + p.height) / 2;
    noiseyCircles = [whAvg / 2, whAvg / 4, whAvg / 8].map((rad) => {
      const offset = {
        x: p.random(-maxCircleOffset, maxCircleOffset),
        y: p.random(-maxCircleOffset, maxCircleOffset),
      };
      const ang = p.map(p.random(1), 0, 1, 0, 359);
      return new NoiseCircle(p, cX + offset.x, cY + offset.y, rad, 30, ang);
    });

    window.addEventListener('mappingresized', resize);
  };

  let l = new Date();
  p.draw = () => {
    const {
      width, height,
    } = p;

    let c = new Date();
    console.log('drawing' + (c - l));
    p.background(0);
    p.noiseDetail(8, 0.6);
    // makeNoise(p, 10, 4);
    makeNoise(p, 6, 2);
    // makeNoise(p, 4, 2);

    p.noFill();
    p.stroke(white);
    p.strokeWeight(6);
    p.noiseDetail(1, p.map(p.second(), 0, 59, 0, 1));
    noiseyCircles.forEach((circle, index) => {
      circle.noiseValue = timeOffset;
      circle.incCenter(angleStep);
      circle.display();
    });

    timeOffset += timeIncrement;
    l = c;
  };

  p.keyTyped = () => {

  };

  function resize() {
    console.log(`Resizing back canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    // p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  }

  p.windowResized = () => {
    console.log(`Resizing floor canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
