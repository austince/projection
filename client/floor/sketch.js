import './floor-style.scss';

import VisionClient from '../lib/sockets/VisionClient';

export default function floorSketch(p, elem) {
  let colfax;
  const visionClient = new VisionClient();
  let lastCoords;

  p.preload = () => {
    colfax = p.loadFont('ColfaxWebThinSub.otf');
    visionClient.connect();

    visionClient.faceCords$.subscribe((coords) => {
      if (coords.length === 0) return;

      const {
        width, height,
      } = p;

      const [faceCoords] = coords;
      const {
        x, y, camWidth, camHeight,
      } = faceCoords;
      lastCoords = { x: (x / camWidth) * width, y: (y / camHeight) * height };
    });

    lastCoords = { x: p.width / 2, y: p.height / 2 };
  };

  p.setup = () => {
    // all drawing functions must be referenced through this.p obj
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    p.background(200);
    p.textFont(colfax);
    p.textSize(36);
  };

  p.draw = () => {

  };

  p.keyTyped = () => {
    p.text('hey', lastCoords.x, lastCoords.y);
  };

  p.windowResized = () => {
    console.log(`Resizing floor canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
