import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './data-source/data-source';
import { UserEntity } from './entities/user.entity';
import { RoomEntity } from './entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSource.options),
    TypeOrmModule.forFeature([UserEntity, RoomEntity]),
  ],
})
export class DatabaseModule {}
