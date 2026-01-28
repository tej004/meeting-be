import { RoomService } from '@/meeting/room/services/room.service';
import { Injectable } from '@nestjs/common';
import { RequestRtpCapabilitiesRequestDto } from '../dto/requests/request-rtp-capabilities-request.dto';
import { Socket } from 'socket.io';
import { RequestRtpCapabilitiesResponseDto } from '../dto/responses/request-rtp-capabilities-response.dto';
import { ERoomRole } from '@/meeting/common/enums/room-role.enum';

@Injectable()
export class PeerService {
  constructor(private readonly roomService: RoomService) {}

  async requestRtpc(
    client: Socket,
    data: RequestRtpCapabilitiesRequestDto
  ): Promise<RequestRtpCapabilitiesResponseDto> {
    const roomId = data.roomId;
    const roomState = this.roomService.findRoomState(roomId);
    const user = client.data.user;

    if (user.role === ERoomRole.VIEWER && user.allowedRoomId !== roomId) {
      client.disconnect(true);
      throw new Error('Viewer not allowed on this room.');
    }

    if (!this.roomService.isOpen(roomId) || !roomState) {
      client.disconnect(true);
      throw new Error('Room not found.');
    }

    return {
      rtpc: roomState.router.rtpCapabilities,
    };
  }
}
