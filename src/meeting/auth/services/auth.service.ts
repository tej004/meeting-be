import { UserEntity } from '@/database/entities/user.entity';
import { BaseUserResponseDto } from '@/meeting/user/dtos/responses/base-user-response.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

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
}
