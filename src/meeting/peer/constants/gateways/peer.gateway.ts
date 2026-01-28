import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  Ack,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  PEER_GATEWAY_ROUTE_NAME,
  PEER_GATEWAY_ROUTES,
} from '../routes/peer.routes';
import { WsJwtGuard } from '@/meeting/auth/guards/ws.jwt.guard';
import { RequestRtpCapabilitiesRequestDto } from '../../dto/requests/request-rtp-capabilities-request.dto';
import { WebSocketEventResponse } from '@/meeting/common/response/websocket-event-response';
import { RequestRtpCapabilitiesResponseDto } from '../../dto/responses/request-rtp-capabilities-response.dto';
import { RoomService } from '@/meeting/room/services/room.service';
import { ERoomRole } from '@/meeting/common/enums/room-role.enum';
import { PeerService } from '../../services/peer.service';
import { AppData, WebRtcTransport } from 'mediasoup/node/lib/types';
import { CreateTransportRequestDto } from '../../dto/requests/create-transport-request.dto';
import PeerState from '../../state/peer.state';
import RoomState from '@/meeting/room/state/room.state';
import { ConnectTransportRequestDto } from '../../dto/requests/connect-transport-request.dto';
import { ETransportType } from '@/meeting/common/enums/transport.enum';
import { ProduceRequestDto } from '../../dto/requests/produce-request.dto';
import { ProduceResponseDto } from '../../dto/responses/produce-response.dto';
import { PRODUCER_EVENTS } from '@/meeting/common/constants/mediasoup/producer-events.constant';
import { plainToInstance } from 'class-transformer';

@WebSocketGateway({ name: PEER_GATEWAY_ROUTE_NAME, cors: { origin: '*' } })
export class PeerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly wsJwtGuard: WsJwtGuard,
    private readonly roomService: RoomService,
    private readonly peerService: PeerService
  ) {}

  afterInit(server: Server) {
    server.use((socket, next) => this.wsJwtGuard.middleware(socket, next));
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(PEER_GATEWAY_ROUTES.REQUEST_RTP_CAPABILITIES)
  async requestRtpCapabilities(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RequestRtpCapabilitiesRequestDto,
    @Ack()
    ack: (
      response: WebSocketEventResponse<RequestRtpCapabilitiesResponseDto>
    ) => void
  ): Promise<void> {
    const responseData = await this.peerService.requestRtpc(client, data);

    const user = client.data.user;
    let name: string;
    if (!user) throw new Error('Unauuthorized');

    if (user.role === ERoomRole.ADMIN) {
      name = user.firstName;
    } else {
      name = user.name;
    }

    const peer = new PeerState(client.id, user.uuid, name, client, null);
    client.data.peer = peer;

    ack(
      new WebSocketEventResponse(
        PEER_GATEWAY_ROUTES.REQUEST_RTP_CAPABILITIES,
        'Room rtpc successfully retrieved',
        responseData
      )
    );
  }

  @SubscribeMessage(PEER_GATEWAY_ROUTES.CREATE_TRANSPORT)
  async createTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateTransportRequestDto,
    @Ack()
    ack: (response: WebSocketEventResponse<WebRtcTransport<AppData>>) => void
  ): Promise<void> {
    const roomState: RoomState | undefined = this.roomService.findRoomState(
      data.roomId
    );
    const peer: PeerState | undefined = client?.data?.peer;

    if (!peer || !roomState) throw new Error('Transport creation failed');

    const transportData = await peer.createTransport(
      data.type,
      roomState.router
    );

    ack(
      new WebSocketEventResponse(
        PEER_GATEWAY_ROUTES.CREATE_TRANSPORT,
        'Transport created',
        transportData
      )
    );
  }

  @SubscribeMessage(PEER_GATEWAY_ROUTES.CONNECT_TRANSPORT)
  async connectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ConnectTransportRequestDto,
    @Ack() ack: (response: WebSocketEventResponse) => void
  ): Promise<void> {
    const peer: PeerState | undefined = client?.data?.peer;

    if (!peer) {
      throw new Error('Transport connection failed: peer not found');
    }

    switch (data.transportType) {
      case ETransportType.SEND:
        if (!peer.sendTransport) {
          throw new Error('Peer send transport missing');
        }
        await peer.sendTransport.connect({
          dtlsParameters: data.dtlsParameters,
        });
        break;
      case ETransportType.RECV:
        if (!peer.recvTransport) {
          throw new Error('Peer recv transport missing.');
        }
        await peer.recvTransport.connect({
          dtlsParameters: data.dtlsParameters,
        });
        break;
      default:
        throw new Error('Invalid transport type.');
    }

    ack(
      new WebSocketEventResponse(
        PEER_GATEWAY_ROUTES.CONNECT_TRANSPORT,
        'Transport connected successfully',
        null
      )
    );
  }

  

  // should assume the peer is already accepted in the room
  @SubscribeMessage(PEER_GATEWAY_ROUTES.PRODUCE)
  async produce(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ProduceRequestDto,
    @Ack() ack: (response: WebSocketEventResponse<ProduceResponseDto>) => void
  ): Promise<void> {
    const peer: PeerState | undefined = client?.data?.peer;

    if (!peer) throw new Error('Produce failed: peer not found');

    if (!peer?.sendTransport)
      throw new Error('Produce failed: send transport not found');

    const producer = await peer.sendTransport.produce(data);

    producer.on(PRODUCER_EVENTS.TRANSPORT_CLOSE, () => {
      producer.close();
    });

    peer.producers.set(producer.id, producer);

    // loop all the peers inside the room to consume a new peer.

    ack(
      new WebSocketEventResponse(
        PEER_GATEWAY_ROUTES.PRODUCE,
        'Produced successfully',
        { id: producer.id }
      )
    );
  }
}
