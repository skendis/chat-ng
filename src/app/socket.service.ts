import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  port: string = '3000';
  readonly url: string = `ws://192.168.1.14:3000`;

  constructor() {
    this.socket = io(this.url);
  }

  /**
   * @description listen to event from server
   */
  listen(event: string) {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }

  /**
   * @description broadcast an event to server
   */
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  makeId(length = 10) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
