import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MeetingModule } from './meeting/meeting.module';
import { RedisModule as RedisModuleWrapper } from './redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisModuleWrapper, ConfigModule, MeetingModule],
})
export class AppModule {}
