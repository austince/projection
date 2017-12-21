import { Vector } from 'p5';

export default function splitRect(p, x, y) {
  const {
    width, height, HSB, CENTER,
  } = p;

  const intPt = new Vector(width - x, height - y);

  p.colorMode(HSB);
  p.rectMode(CENTER);
  p.push();
  const c1 = p.color(
    p.map((intPt.x + intPt.y) / 2, 0, (width + height) / 2, 0, 255),
    120,
    255,
    100 / 255,
  );
  p.fill(c1);
  p.rect(0, 0, intPt.x, intPt.y);

  const c2 = p.color(
    p.map((intPt.x + intPt.y) / 2, 0, (width + height) / 2, 0, 120),
    120,
    255,
    100 / 255,
  );
  p.fill(c2);
  p.rect(intPt.x, 0, width, intPt.y);

  const c3 = p.color(
    p.map((intPt.x + intPt.y) / 2, 0, (width + height) / 2, 120, 255),
    120,
    255,
    100 / 255,
  );
  p.fill(c3);
  p.rect(0, intPt.y, intPt.x, height);

  p.pop();
}
