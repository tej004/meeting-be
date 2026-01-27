import { BaseUserResponseDto } from '@/meeting/user/dtos/responses/base-user-response.dto';
import { Expose, Type } from 'class-transformer';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => BaseUserResponseDto)
  user: BaseUserResponseDto;
}
