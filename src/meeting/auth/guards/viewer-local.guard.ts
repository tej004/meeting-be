import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { REDIS_CLIENT } from '@/redis/constants/redis-client.constant';
import Redis from 'ioredis';
import { ROOM_TEMP_KEY } from '@/meeting/room/constants/cache/room-temp-key.constant';

@Injectable()
export class ViewerLocalGuard implements CanActivate {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { roomId, tempKey, name } = request.body;
    if (!roomId || !tempKey || !name) {
      throw new BadRequestException('roomId, tempKey, and name are required');
    }

    const tempKeyRedisKey = ROOM_TEMP_KEY(roomId, tempKey);
    const exists = await this.redisClient.exists(tempKeyRedisKey);
    if (exists !== 1) {
      throw new UnauthorizedException('Invalid or expired tempKey');
    }

    return true;
  }
}
