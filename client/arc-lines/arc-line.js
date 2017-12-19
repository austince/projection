export function arcLine(p, x, y, maxX, stepX, offsetX, minHeight, maxHeight) {
  let prevX = x;
  x += p.random(0, stepX);
  for (; x < maxX; x += p.random(0, stepX)) {
    // let offX = p.random(-offsetX, offsetX);

    p.curve(
      prevX, y + p.random(minHeight, maxHeight),
      prevX, y,
      x + offsetX, y,
      x, y + p.random(minHeight, maxHeight)
    );

    prevX = x;
  }
}

/**
 * Just an object wrapper around the #arcLine function
 */
export class ArcLine {
  constructor(cHeight, arcColor, minWidth, maxWidth, stepX = 100, offsetX = 50, minHeight = 500, maxHeight = 3000) {
    this.cHeight = cHeight;
    this.arcColor = arcColor;
    this.stepX = stepX;
    this.offsetX = offsetX;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
  }

  draw(p) {
    p.fill(this.arcColor);
    arcLine(p, this.minWidth, this.cHeight, this.maxWidth, this.stepX, this.offsetX, this.minHeight, this.maxHeight);
  }
}