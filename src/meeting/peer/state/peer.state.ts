import { ERoomApprovalStatus } from '@/meeting/room/types/enums/room-approval.enum';
import { EventEmitter } from 'events';
import { Consumer } from 'mediasoup/node/lib/ConsumerTypes';
import { Producer, Router } from 'mediasoup/node/lib/types';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransportTypes';
import { Socket } from 'socket.io';
import { EPeerRole } from '../types/enums/peer-role.enum';

export default class PeerState extends EventEmitter {
  id: string;
  name: string;
  role: EPeerRole;
  joined: boolean;
  joinedAt: Date | null;
  roomId: string | null;
  socket: Socket;
  roomApprovalStatus: ERoomApprovalStatus;
  recvTransport: WebRtcTransport | null;
  sendTransport: WebRtcTransport | null;
  consumers: Map<string, Consumer>;
  producers: Map<string, Producer>;
  rtpCapabilities: any | null; /// clients rtpc from the fe or can be accessed after device.load()

  constructor(id: string, name: string, socket: Socket, rtpCapabilities: any) {
    super();
    this.id = id;
    this.name = name;
    this.role = EPeerRole.PARTICIPANT;
    this.socket = socket;
    this.roomApprovalStatus = ERoomApprovalStatus.PENDING;
    this.joined = false;
    this.joinedAt = null;
    this.recvTransport = null;
    this.sendTransport = null;
    this.consumers = new Map();
    this.producers = new Map();
    this.rtpCapabilities = rtpCapabilities;
  }

  public async createTransport(
    type: 'recv' | 'send',
    router: Router,
  ): Promise<WebRtcTransport> {
    if (type === 'send' && this.sendTransport !== null) {
      return this.sendTransport;
    } else if (type === 'recv' && this.recvTransport !== null) {
      return this.recvTransport;
    }

    const transport = await router.createWebRtcTransport({
      listenInfos: [
        {
          ip: '0.0.0.0',
          protocol: 'udp',
        },
        {
          ip: '0.0.0.0',
          protocol: 'tcp',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    if (type === 'send') {
      this.sendTransport = transport;
    } else {
      this.recvTransport = transport;
    }

    return transport;
  }

  public async close(): Promise<void> {
    this.recvTransport?.close();
    this.sendTransport?.close();

    for (const consumer of this.consumers.values()) {
      consumer.close();
    }

    for (const producer of this.producers.values()) {
      producer.close();
    }

    this.emit('close');

    console.log(`Peer destroyed. ${this.id} ${this.name}`);
  }
}
