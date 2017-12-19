import './back-style.scss';

import squarePathCircles from '../lib/shapes/square-path-circles';
import spinningCircles from '../lib/shapes/spinning-circles';
import splitRect from '../lib/shapes/split-rect';
import VisionClient from '../lib/sockets/VisionClient';

export default function backSketch(p, elem) {
  let white;
  let colfax;
  let clearBg = true;
  let drawBgRects = true;
  const visionClient = new VisionClient();
  let lastCoords;

  p.preload = () => {
    colfax = p.loadFont('ColfaxWebThinSub.otf');
  };

  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    p.colorMode(p.HSB);
    white = p.color(255);
    p.background(255, 0, 0);
    // this.p.fill(0);
    // this.p.rect(20 * (Math.random() + 1) * 10, 20 * (Math.random() + 1) * 10, 20, 20);

    p.noStroke();
    p.noCursor();

    p.background(p.color(255));
    // p.textFont(colfax);

    console.log(
      'USAGE:',
      'c - toggle background clearing \n',
      'z - toggle background rectangle drawing \n',
      's - save an image!',
    );

    // Todo: change to individual elem mappings?
    window.addEventListener('mappingresized', p.mappingResized);

    lastCoords = { x: p.width / 2, y: p.height / 2 };

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
    });
  };

  p.draw = () => {
    const {
      width, height,
    } = p;

    if (clearBg) {
      p.clear();
      p.background(white);
    }

    if (drawBgRects) {
      splitRect(p, lastCoords.x * 2, lastCoords.y * 2);
      splitRect(p, lastCoords.x, lastCoords.y);
    }

    for (let i = 150; i < 200; i += 10) {
      for (let j = 150; j < 200; j += 10) {
        // squarePathCircles(p, lastCoords.x + i, lastCoords.y + j, i, 10);
      }
    }

    squarePathCircles(p, lastCoords.x, height - lastCoords.y, 50, 20);
    squarePathCircles(p, width - lastCoords.x, lastCoords.y, 50, 20);

    spinningCircles(p, width - lastCoords.x, height - lastCoords.y, 150, 100);
  };

  p.keyTyped = () => {
    const { key } = p;

    if (key === 'c') {
      clearBg = !clearBg;
    } else if (key === 'z') {
      drawBgRects = !drawBgRects;
    }
  };

  function resizeSketch() {
    console.log(`Resizing back canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  }

  p.windowResized = () => {
    console.log('Window was resized');
    resizeSketch();
  };

  p.mappingResized = () => {
    console.log('Mapping was resized');
    resizeSketch();
  };
}
