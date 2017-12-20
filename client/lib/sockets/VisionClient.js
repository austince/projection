import io from 'socket.io-client';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Face, Body } from '../../../common/models';

// import { sockets } from '../../../common/config';

export class VisionClient {
  constructor() {
    this.visionObjs$ = new Subject();
    this.faceCords$ = this.visionObjs$
      .filter(set => set.type === Face.TYPE)
      .map(set => set.objects);

    this.bodyCords$ = this.visionObjs$
      .filter(set => set.type === Body.TYPE)
      .map(set => set.objects);
  }

  connect() {
    this.socket = io.connect('localhost:8080');
    this.socket.on('vision', (objSet) => {
      this.visionObjs$.next(objSet);
    });
  }
}
