import { Vector } from 'p5';

const maxRotation = 55;
const spinSpeed = 7;
const numBundles = 15;

class ColorBundle {
  constructor(x, y, colorStart, maxVar, len = Math.random() * 10 + 15, numLines = Math.random() * 10 + 5) {
    this.pos = new Vector(x, y);
    this.rot = 4;
    this.numLines = numLines;
    this.length = len;
    this.halfLen = this.length / 2;
    this.lines = [];

    for (let i = 0; i < this.numLines; i++) {
      const rot = Math.random() * (maxRotation + maxRotation) - maxRotation;
      const hue = ((Math.random() * (maxVar * 2) - maxVar) + colorStart) % 360;
      const sat = (Math.random() * 80 + 65) % 100;
      this.lines.push({
        rot,
        color: [hue, sat, 80]
      })
    }
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  move(vec) {
    this.pos.add(vec);
  }

  rotate(rot) {
    this.rot += rot;
  }

  setLength(len) {
    this.length = len;
    return this;
  }

  draw(p) {
    p.colorMode(p.HSB);
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.push();
    p.rotate(p.radians(this.rot));
    for (const line of this.lines) {
      const rot = p.radians(line.rot) + p.radians(p.random(-5, 5));
      p.push();
      p.rotate(rot);
      p.strokeWeight(1 * p.width / 1920);
      p.stroke(p.color(...line.color));
      p.line(
        0, -this.halfLen,
        0, this.halfLen
      );
      p.pop();
    }
    p.pop();
    p.pop();
  }
}

class ColorBundleSet {
  constructor(bundles, x, y, maxWidth) {
    this.bundles = bundles;
    this.maxWidth = maxWidth;
    this.pos = new Vector(x, y);
    this.movingIndex = 0;
    this.moveAmount = new Vector(5, 1);
    this.scaleVal = 1;
    this.maxScale = 5;
    this.minScale = 0.5;
    this.scaleStep = 0;
    this.scaleDir = 1;
    this.maxSeparation = 20;
  }

  size() {
    return this.bundles.length;
  }

  setRotation(rot) {
    this.rotation = rot;
    return this;
  }

  scale(s) {
    this.scaleVal += s;
    return this;
  }

  setScaleStep(step) {
    this.scaleStep = step;
    return this;
  }

  setScaleBounds(min, max) {
    this.minScale = min;
    this.maxScale = max;
    return this;
  }

  setScale(s) {
    this.scaleVal = s;
    return this;
  }

  setMaxSep(sep) {
    this.maxSeparation = sep;
    return this;
  }

  setMovement(mov) {
    this.moveAmount = mov;
    return this;
  }

  update() {
    const movingBundle = this.bundles[this.movingIndex];
    movingBundle.move(this.moveAmount);
    movingBundle.rotate(spinSpeed);

    if (this.scaleVal > this.maxScale) {
      this.scaleDir = -1;
    } else if (this.scaleVal < this.minScale) {
      this.scaleDir = 1;
    }
    this.scale(this.scaleStep * this.scaleDir);

    let nextIndex = (this.movingIndex + 1) % this.bundles.length;
    const nextBundle = this.bundles[nextIndex];

    let doSwitch = false;

    // subtract for translation
    if (movingBundle.x * this.scaleVal > this.maxWidth - this.pos.x) {
      if (this.movingIndex !== this.bundles.length - 1) {
        nextIndex--;
      }
      this.bundles.splice(this.movingIndex, 1);
      doSwitch = true;
    }

    if (movingBundle.x > nextBundle.x + this.maxSeparation) {
    // if (movingBundle.pos.dist(nextBundle.pos) > this.maxSeparation) {
      doSwitch = true;
    }

    if (doSwitch) {
      this.movingIndex = nextIndex;
    }
  }

  draw(p) {
    for (const bundle of this.bundles) {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      p.scale(this.scaleVal);
      bundle.draw(p);
      p.pop();
    }
  }
}

export default function sketch(p, elem) {
  const { HSB } = p;
  const bundleSets = [];
  let white;

  function makeBundle(start = p.random(0, 255), maxVar = 50) {
    return new ColorBundle(0, 0, start, maxVar, (Math.random() * 10 + 15) * p.width / 1920);
  }

  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    p.colorMode(HSB);
    white = p.color(360, 0, 100);
    for (let y = 0; y < p.height; y += p.height / numBundles) {
      const bundles = [250, 75].map((s) => makeBundle(s));
      const baseScale = p.random(2, 7);
      bundleSets.push(
        new ColorBundleSet(bundles, p.random(-10, p.width / 2), y, p.width)
          .setScale(baseScale)
          .setMovement(new Vector(p.random(1, 5), 0))
          .setMaxSep(p.random(5, 20))
      );
    }
  };

  p.draw = () => {
    p.background(white);

    for (const [index, set] of bundleSets.entries()) {
      if (set.size() > 0) {
        set.update();
        set.draw(p);
      } else {
        bundleSets.splice(index, 1);
        const bundles = [360, 240, 120].map((s) => makeBundle(s));
        const baseScale = p.random(2, 10);
        bundleSets.push(
          new ColorBundleSet(bundles, -10, p.height / (numBundles / (index + 1)), p.width)
            .setScale(baseScale)
            .setMovement(new Vector(p.random(1, 5), 0))
            .setMaxSep(p.random(5, 20))
        );
      }
    }
  };

  p.keyTyped = () => {

  };

  p.windowResized = () => {
    console.log(`Resizing canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
