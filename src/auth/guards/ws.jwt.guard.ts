import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard {
  static validate(client: Socket) {
    return true;
  }
}
