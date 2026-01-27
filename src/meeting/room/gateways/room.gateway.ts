import { WsJwtGuard } from '@/meeting/auth/guards/ws.jwt.guard';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'room', cors: { origin: '*' } })
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsJwtGuard: WsJwtGuard) {}

  afterInit(server: Server) {
    server.use((socket, next) => this.wsJwtGuard.middleware(socket, next));
  }

  handleConnection(client: Socket) {
    console.log(
      `Client connected: ${(client as any)?.user?.uuid} - email: ${(client as any)?.user?.email}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
