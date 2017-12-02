import io from 'socket.io-client';
import { Subject } from 'rxjs';
// import { sockets } from '../../../common/config';

export default class Client {
  connect() {
    this.faceCords$ = new Subject();
    this.socket = io.connect('localhost:8080');
    this.socket.on('vision', (coords) => {
      this.faceCords$.next(coords);
    });
  }
}
