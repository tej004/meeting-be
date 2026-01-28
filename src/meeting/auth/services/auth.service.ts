import { UserEntity } from '@/database/entities/user.entity';
import { ERoomRole } from '@/meeting/common/enums/room-role.enum';
import { BaseUserResponseDto } from '@/meeting/user/dtos/responses/base-user-response.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(
    user: UserEntity
  ): Promise<{ accessToken: string; user: BaseUserResponseDto }> {
    const payload = { data: user };
    const accessToken = this.jwtService.sign(payload);
    const userDto = plainToInstance(BaseUserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return { accessToken, user: userDto };
  }

  async loginViewer(
    name: string,
    roomId: string
  ): Promise<{ accessToken: string; user: any }> {
    const uuid = uuidv4();
    const viewer = {
      uuid,
      name,
      role: ERoomRole.VIEWER,
      requestedRoomId: roomId,
    };
    const payload = { data: viewer };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: viewer };
  }
}
