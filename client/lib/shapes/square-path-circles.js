import { Vector } from 'p5';

export function simpleMap(u, v) {
  const mapped = new Vector(0, 0);

  const uSq = u * u;
  const vSq = v * v;

  if (uSq >= vSq) {
    mapped.x = Math.sign(u) * Math.sqrt(uSq + vSq);
    mapped.y = Math.sign(u) * (v / u) * Math.sqrt(uSq + vSq);
  } else {
    mapped.x = Math.sign(v) * (u / v) * Math.sqrt(uSq + vSq);
    mapped.y = Math.sign(v) * Math.sqrt(uSq + vSq);
  }

  return mapped;
}

export default function squarePathCircles(p, x, y, dist, size) {
  const { width, height, HSB } = p;

  const intPt = new Vector(width - x, height - y);

  p.colorMode(HSB);

  const c1 = p.color(
    p.map(intPt.x + intPt.y, 0, width + height, 0, 90),
    120,
    255,
    100 / 255,
  );

  const c2 = p.color(
    p.map(intPt.x + intPt.y, 0, width + height, 150, 255),
    120,
    255,
    100 / 255,
  );

  const angle = p.radians(p.map(p.millis() % 1000, 0, 999, 0, 359));
  const u = Math.cos(angle);
  const v = Math.sin(angle);
  const pt = simpleMap(u, v);

  p.push();
  p.translate(x, y);

  p.fill(c1);
  p.ellipse(pt.x * dist, pt.y * dist, size, size);
  p.fill(c2);
  p.ellipse(-pt.x * dist, -pt.y * dist, size, size);
  p.pop();
}
