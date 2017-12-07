import { VisionObject } from './VisionObject';

export class Face extends VisionObject {
  constructor(params) {
    super(Face.TYPE, params);
  }
}
Face.TYPE = 'FACE';
