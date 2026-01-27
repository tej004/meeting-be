import { WsJwtGuard } from '@/meeting/auth/guards/ws.jwt.guard';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ROOM_GATEWAY_ROUTE_NAME } from '../constants/routes/room-gateway.routes';

@WebSocketGateway({ namespace: ROOM_GATEWAY_ROUTE_NAME, cors: { origin: '*' } })
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
      `Client connected: ${(client as any).data?.user?.uuid} - role: ${(client as any).data?.user?.role}`
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
