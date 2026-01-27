import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

// used as middleware since guards are not supported totally in gateways (will let you connect even not authorized)
@Injectable()
export class WsJwtGuard {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(client: Socket): boolean {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      return false;
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      return false;
    }

    const payload = this.jwtService.verify(token);

    (client as any).data.user = payload.data;
    return !!payload;
  }

  middleware(client: Socket, next: any) {
    try {
      if (this.validateToken(client)) {
        next();
      } else {
        next(new Error('Unauthorized'));
      }
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  }
}
