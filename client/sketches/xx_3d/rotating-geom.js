import { Vector } from 'p5';

export class RotatingGeom {
  constructor(x, y, z, rotation = new Vector(0, 0, 0), movement = new Vector(0, 0, 5)) {
    this.pos = new Vector(x, y, z);
    this.startingPos = this.pos.copy();
    this.movement = movement;
    this.rot = rotation;
    this.maxZ = 1000;
    this.width = 20;
    this.height = 40;
  }

  setMovement(mov) {
    this.movement = mov;
    return this;
  }

  setDimens(w, h) {
    this.width = w;
    this.height = h;
    return this;
  }

  update() {
    this.pos = this.pos.add(this.movement);
    if (this.pos.z > this.maxZ) {
      this.pos.set(this.startingPos);
    }
  }

  rotate(vec) {
    this.rot = this.rot.add(vec);
  }

  draw(p) {
    p.push();
    p.translate(this.pos);
    p.rotateX(this.rot.x);
    p.rotateY(this.rot.y);
    p.rotateZ(this.rot.z);

    p.box(this.width, this.height);
    p.pop();
  }
}