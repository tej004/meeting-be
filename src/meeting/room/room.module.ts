import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { WorkerModule } from '../worker/worker.module';
import { RoomController } from './controllers/room.controller';
import { AuthModule } from '../auth/auth.module';
import { RoomGateway } from './gateways/room.gateway';

@Module({
  imports: [WorkerModule, AuthModule],
  providers: [RoomService, RoomGateway],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
