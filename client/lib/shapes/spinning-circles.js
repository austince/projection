import { Vector } from 'p5';

export default function spinningCircles(p, x, y, dist, size) {
  const { width, height, HSB } = p;

  const intPt = new Vector(width - x, height - y);
  p.colorMode(HSB);
  const c = p.color(
    p.map((intPt.x + intPt.y) / 2, 0, (width + height) / 2, 255, 0),
    120,
    255,
    100 / 255,
  );

  p.push();
  p.translate(x, y);
  p.rotate(p.radians(p.map(p.millis(), 0, 999, 0, 359)));
  p.fill(c);
  p.ellipse(-dist, -dist, size, size);
  p.ellipse(dist, dist, size, size);
  p.pop();
}
