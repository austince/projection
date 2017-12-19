import { Vector } from 'p5';

import { RotatingGeom } from './rotating-geom';

export default function sketch(p, elem) {
  const { HSB, RGB, CLOSE, WEBGL } = p;
  const TWO_PI = Math.PI * 2;
  let white,
    black;

  const geoms = [];

  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight, WEBGL);
    p.colorMode(HSB);
    const { width, height } = p;
    white = p.color(360, 0, 100, 1);
    black = p.color(360, 100, 0, 1);
    geoms.push(
      new RotatingGeom(0.1, 0.5, -100).setMovement(new Vector(0, 0, 5)),
      new RotatingGeom(0, 0, -200).setMovement(new Vector(1, 0, 6)),
      new RotatingGeom(0, 0, -300).setMovement(new Vector(0, 1, 4.5)).setDimens(10, 50),
      new RotatingGeom(0, 0, -400).setMovement(new Vector(0, -1, 4)).setDimens(20, 30),
      new RotatingGeom(0, 0, -1500).setMovement(new Vector(1, 1, 3)),
      new RotatingGeom(0, 0, -150).setMovement(new Vector(-1, 0, 5.5)),
      new RotatingGeom(0, 0, -250).setMovement(new Vector(-1, -1, 7)),
      new RotatingGeom(0, 0, -350).setMovement(new Vector(-1, 1, 3)),
      new RotatingGeom(0, 0, -450).setMovement(new Vector(1, -1, 6.5)),
    );
  };

  p.draw = () => {
    const { width, height } = p;
    p.background(black);
    // console.log(p.alpha(white));
    p.colorMode(RGB);
    p.ambientLight(175);
    p.colorMode(HSB);
    // p.directionalLight(200, 255, 255, 0, 0, -1);
    p.pointLight(white, 0, 0, -1);
    p.pointLight(white, -1, -1, 0);
    p.pointLight(white, 1, 1, 0);
    p.pointLight(white, -1, 1, 0);
    p.pointLight(white, 1, -1, 0);

    p.fill(white);
    p.specularMaterial(white);
    p.strokeWeight(0.5);
    p.stroke(p.color(0, 0, 90));
    for (let geom of geoms) {
      geom.update();
      geom.rotate(new Vector(p.random(0.01, 0.05), p.random(0.01, 0.1), 0.01));
      geom.draw(p);
    }

    let angle = 0;
    let angleStep;
    const len = 4000;
    const hLen = len / 2;
    const m = p.millis() % len;
    const maxVal = 0.7;
    const minVal = 0.005;
    const inf = -5000;

    if (m > hLen) {
      angleStep = p.map(p.millis() % len, 0, len, minVal, maxVal);
    } else {
      angleStep = p.map(p.millis() % len, 0, len, maxVal, minVal);
    }

    let rad = Math.sqrt((height / 2) ** 2 + (width / 2) ** 2) * 1.3;

    let lastX = rad * Math.cos(angle - angleStep);
    let lastY = rad * Math.sin(angle - angleStep);

    while (angle <= TWO_PI) {
      const nextX = rad * Math.cos(angle);
      const nextY = rad * Math.sin(angle);
      const sectionColor = p.color(p.map(angle, 0, TWO_PI, 0, 360), 100, 100, 1);
      p.specularMaterial(white);
      p.fill(sectionColor);
      p.stroke(sectionColor);
      p.specularMaterial(sectionColor);
      // p.ambientMaterial(sectionColor);

      // p.triangle(
      //   0, 0, -50,
      //   nextX, nextY, -50,
      //   lastX, lastY, -50);
      p.fill(sectionColor);
      // p5 bug
      // p.specularMaterial(sectionColor);
      p.beginShape();
      p.vertex(0, 0, inf);
      p.vertex(nextX, nextY, 0);
      p.vertex(lastX, lastY, 0);
      p.endShape(CLOSE);

      lastX = nextX;
      lastY = nextY;
      angle += angleStep;
    }
  };

  p.keyTyped = () => {

  };

  p.mouseMoved = () => {

  };

  p.windowResized = () => {
    console.log(`Resizing canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
