import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { PeerModule } from './peer/peer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [RoomModule, PeerModule, UserModule],
})
export class MeetingModule {}
