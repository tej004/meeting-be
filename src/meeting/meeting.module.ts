import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { PeerModule } from './peer/peer.module';

@Module({
  imports: [RoomModule, PeerModule]
})
export class MeetingModule {}
