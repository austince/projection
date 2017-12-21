import { ArcLine } from './arc-line';

export default function sketch(p, elem) {
  let heightStep = 10;
  let arcs;
  let transparent;
  let resetY;

  function setupArcs() {
    let stepX = 100 / 1152 * p.width,
      offsetX = 50 / 1152 * p.width,
      minWidth = -offsetX,
      maxWidth = offsetX + p.width,
      minHeight = 500 / 720 * p.height,
      maxHeight = 3000 / 720 * p.height;

    // colors
    let orange = p.color(170, 86, 255, 0.29),
        maybeMagenta = p.color(340, 86, 255, 0.29),
        maybeTeal = p.color(85, 86, 255, 0.29),
        maybeGreen = p.color(42, 86, 255, 0.29);

    resetY = p.height + (minHeight + maxHeight) / 4;

    arcs = [
      // Follow Group
      new ArcLine(p.height / 4 - p.height, orange, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(p.height / 2 - p.height, maybeMagenta, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(p.height * 3 / 4 - p.height, maybeTeal, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(0, maybeGreen, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),

      // Original Group
      new ArcLine(p.height / 4, orange, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(p.height / 2, maybeMagenta, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(p.height * 3 / 4, maybeTeal, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
      new ArcLine(p.height, maybeGreen, minWidth, maxWidth, stepX, offsetX, minHeight, maxHeight),
    ];
  }

  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    p.colorMode(p.HSB);
    p.background(0);
    transparent = p.color(0, 0);

    p.frameRate(12);
    setupArcs();
  };
  
  p.draw = () => {
    p.background(0);
    p.push();
    // p.translate(p.width / 2, p.height / 2);
    p.rotate(p.radians(5));
    for (let arc of arcs) {
      p.stroke(transparent);
      arc.draw(p);
      arc.cHeight += heightStep;

      if (arc.cHeight > resetY) {
        arc.cHeight = 0;
      }
    }
    p.pop();
  };

  p.keyTyped = () => {

  };

  p.windowResized = () => {
    console.log(`Resizing canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
    setupArcs();
  };
}
