import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { RoomEntity } from './entities/room.entity'
import dataSource from './data-source/data-source'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    TypeOrmModule.forFeature([UserEntity, RoomEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
