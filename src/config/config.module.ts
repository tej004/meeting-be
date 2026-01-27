import { Global, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import databaseConfig from './configs/database.config';
import redisConfig from './configs/redis.config';
import encryptionConfig from './configs/encryption.config';
import tokenConfig from './configs/token.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig, redisConfig, encryptionConfig, tokenConfig],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
