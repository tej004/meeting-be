import { forwardRef, Module } from '@nestjs/common';
import { RoomModule } from '../room/room.module';
import { PeerService } from './services/peer.service';
import { AuthModule } from '../auth/auth.module';
import { PeerGateway } from './constants/gateways/peer.gateway';

@Module({
  imports: [forwardRef(() => RoomModule), AuthModule],
  providers: [PeerService, PeerGateway],
})
export class PeerModule {}
