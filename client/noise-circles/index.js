import VisionClient from '../lib/sockets/VisionClient';
import NoiseCircle from './noise-circle';

const detail = 0.6; // amount of detail in the noise (0-1)
const increment = 0.2; // how quickly to move through noise (0-1)

// Todo: Make these work
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
      // Todo: make the efficient array above indexing work
      if (area === 1) {
        p.set(x, y, gray);
      } else {
        for (let aX = x - area; aX < x + area; aX++) {
          for (let aY = y - area; aY < y + area; aY++) {
            p.set(aX, aY, gray);
          }
        }
      }
    }
  }
  p.updatePixels();
}


export default function floorSketch(p, elem) {
  let noiseGraphics;
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

    // Render noise in an offscreen buffer
    noiseGraphics = p.createGraphics(p.width, p.height);

    // first adjusts overall variety
    // Lower --> less
    // second adjusts local variety
    // 0 -> 1
    p.noiseDetail(8, detail);
    // makeNoise(noiseGraphics, 1, 1);
    makeNoise(noiseGraphics, 2, 1);

    white = p.color(255);
    p.background(200);

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
  };

  p.draw = () => {
    p.image(noiseGraphics, 0, 0);

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
  };

  p.keyTyped = () => {

  };

  p.windowResized = () => {
    console.log(`Resizing floor canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
