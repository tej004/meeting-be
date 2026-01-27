import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants/redis-client.constant';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from '@/config/types/interface/redis.interface';
import { CONFIGS } from '@/config/constants/configs.constant';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configServiceInstance: ConfigService) => {
        const redisConfig = configServiceInstance.get<IRedisConfig>(
          CONFIGS.REDIS
        );

        if (
          redisConfig === null ||
          redisConfig === undefined ||
          redisConfig.host === null ||
          redisConfig.port === null ||
          redisConfig.password == null ||
          redisConfig.db === null
        ) {
          throw new Error('Token configuration is missing');
        }

        return new Redis({
          host: redisConfig.host,
          port: Number(redisConfig.port),
          password: redisConfig.password,
          db: Number(redisConfig.db),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
