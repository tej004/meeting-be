import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

// Modules will only be imported here
@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule],
})
export class AppModule {}
