import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MeetingModule } from './meeting/meeting.module';

// Modules will only be imported here
@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule, MeetingModule],
})
export class AppModule {}
