import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { PeerModule } from './peer/peer.module';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, RoomModule, PeerModule, UserModule, WorkerModule],
})
export class MeetingModule {}
