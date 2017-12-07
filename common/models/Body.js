import { VisionObject } from './VisionObject';

export class Body extends VisionObject {
  constructor(params) {
    super(Body.TYPE, params);
  }
}
Body.TYPE = 'BODY';
